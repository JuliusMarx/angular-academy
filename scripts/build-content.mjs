// Reads content/ and examples/ and generates TypeScript modules under
// src/app/content/generated/ that the app imports (lazy-loaded per lesson).
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { createHighlighter } from 'shiki';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT_DIR = join(ROOT, 'content');
const EXAMPLES_DIR = join(ROOT, 'examples');
const OUT_DIR = join(ROOT, 'src/app/content/generated');
const LANGS = ['de', 'en'];

const highlighter = await createHighlighter({
  themes: ['github-light-default', 'github-dark-default'],
  langs: ['ts', 'js', 'html', 'css', 'scss', 'json', 'bash', 'angular-html', 'angular-ts'],
});

const LANG_ALIASES = { typescript: 'angular-ts', ts: 'angular-ts', html: 'angular-html', sh: 'bash', shell: 'bash' };

/** h2 headings of the lesson currently being rendered – reset per lesson, used for the table of contents. */
let headings = [];

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const marked = new Marked({
  renderer: {
    heading({ tokens, depth }) {
      const html = this.parser.parseInline(tokens);
      if (depth !== 2 && depth !== 3) return `<h${depth}>${html}</h${depth}>\n`;
      const text = html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      let id = slugify(text) || 'section';
      for (let n = 2; headings.some((h) => h.id === id); n++) id = `${slugify(text)}-${n}`;
      headings.push({ id, text, depth });
      return `<h${depth} id="${id}">${html}</h${depth}>\n`;
    },
    code({ text, lang }) {
      const requested = (lang ?? '').trim().split(/\s+/)[0] || 'text';
      const shikiLang = LANG_ALIASES[requested] ?? requested;
      const html = highlighter.getLoadedLanguages().includes(shikiLang)
        ? highlighter.codeToHtml(text, {
            lang: shikiLang,
            themes: { light: 'github-light-default', dark: 'github-dark-default' },
            defaultColor: false,
          })
        : `<pre class="shiki"><code>${escapeHtml(text)}</code></pre>`;
      return `<div class="code-block"><button type="button" class="copy-button" data-copy>Copy</button>${html}</div>`;
    },
  },
});

/** Strips the numeric ordering prefix: "01-introduction" -> "introduction". */
const slugOf = (name) => name.replace(/^\d+-/, '').replace(/\.md$/, '');

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** GitHub-style alerts: "> [!TIP]" blockquotes become callout boxes. */
function renderCallouts(html) {
  return html.replace(
    /<blockquote>\s*<p>\[!(NOTE|TIP|WARNING)\]\s*/g,
    (_, kind) => `<blockquote class="callout callout-${kind.toLowerCase()}"><p>`,
  );
}

/**
 * Splits the markdown body at "::tryit{example-id}" lines so the app can render
 * an interactive component in between the static HTML segments.
 */
function renderSegments(markdown, exampleIds, file, lang) {
  const segments = [];
  const parts = markdown.split(/^::tryit\{([\w-]+)\}\s*$/m);
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      if (!exampleIds.has(part)) throw new Error(`${file}: unknown example "${part}"`);
      segments.push({ type: 'tryit', example: part });
    } else if (part.trim()) {
      segments.push({ type: 'html', html: localize(renderCallouts(marked.parse(part)), lang) });
    }
  });
  return segments;
}

const COPY_LABEL = { de: 'Kopieren', en: 'Copy' };
const localize = (html, lang) => html.replaceAll('data-copy>Copy</button>', `data-copy>${COPY_LABEL[lang]}</button>`);

async function sortedDirs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && !e.name.startsWith('_')).map((e) => e.name).sort();
}

async function readExampleFiles(dir, base = dir) {
  const files = {};
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) Object.assign(files, await readExampleFiles(path, base));
    else if (entry.name !== 'meta.json') files[relative(base, path).replace(/\\/g, '/')] = await readFile(path, 'utf8');
  }
  return files;
}

async function buildExamples() {
  const baseFiles = await readExampleFiles(join(EXAMPLES_DIR, '_base'));
  const ids = await sortedDirs(EXAMPLES_DIR);
  await mkdir(join(OUT_DIR, 'examples'), { recursive: true });
  for (const id of ids) {
    const dir = join(EXAMPLES_DIR, id);
    const meta = existsSync(join(dir, 'meta.json')) ? JSON.parse(await readFile(join(dir, 'meta.json'), 'utf8')) : {};
    const example = {
      id,
      openFile: meta.openFile ?? 'src/app/app.ts',
      files: { ...baseFiles, ...(await readExampleFiles(dir)) },
    };
    await writeTs(join(OUT_DIR, 'examples', `${id}.ts`), `export default ${JSON.stringify(example, null, 2)} satisfies Example;`, "import type { Example } from '../../content.model';");
  }
  const loaders = ids.map((id) => `  '${id}': () => import('./examples/${id}').then((m) => m.default),`).join('\n');
  await writeTs(
    join(OUT_DIR, 'examples.ts'),
    `export const exampleLoaders: Record<string, () => Promise<Example>> = {\n${loaders}\n};`,
    "import type { Example } from '../content.model';",
  );
  return new Set(ids);
}

async function buildLessons(exampleIds) {
  const curriculum = {};
  const loaders = [];
  for (const lang of LANGS) {
    curriculum[lang] = [];
    const langDir = join(CONTENT_DIR, lang);
    for (const chapterDir of await sortedDirs(langDir)) {
      const chapterSlug = slugOf(chapterDir);
      const chapterMeta = matter(await readFile(join(langDir, chapterDir, '_chapter.md'), 'utf8')).data;
      const chapter = { slug: chapterSlug, title: chapterMeta.title, description: chapterMeta.description ?? '', lessons: [] };
      const files = (await readdir(join(langDir, chapterDir))).filter((f) => f.endsWith('.md') && !f.startsWith('_')).sort();
      for (const file of files) {
        const path = join(langDir, chapterDir, file);
        const raw = await readFile(path, 'utf8');
        const { data, content } = matter(raw);
        assertNoYamlComments(raw, data, relative(ROOT, path));
        const lessonSlug = slugOf(file);
        const id = `${chapterSlug}/${lessonSlug}`;
        chapter.lessons.push({ id, slug: lessonSlug, title: data.title, minutes: data.minutes ?? 5 });
        headings = [];
        const segments = renderSegments(content, exampleIds, relative(ROOT, path), lang);
        const lesson = {
          id,
          title: data.title,
          minutes: data.minutes ?? 5,
          toc: headings.filter((h) => h.depth === 2).map(({ id, text }) => ({ id, text })),
          segments,
          quiz: (data.quiz ?? []).map((q) => ({
            ...q,
            explanation: q.explanation && marked.parseInline(q.explanation),
          })),
        };
        const out = join(OUT_DIR, 'lessons', lang, chapterSlug, `${lessonSlug}.ts`);
        await mkdir(join(out, '..'), { recursive: true });
        await writeTs(out, `export default ${JSON.stringify(lesson, null, 2)} satisfies Lesson;`, "import type { Lesson } from '../../../../content.model';");
        loaders.push(`  '${lang}/${id}': () => import('./lessons/${lang}/${id}').then((m) => m.default),`);
      }
      curriculum[lang].push(chapter);
    }
  }
  assertSameStructure(curriculum);
  await writeTs(
    join(OUT_DIR, 'curriculum.ts'),
    `export const curriculum: Record<Lang, Chapter[]> = ${JSON.stringify(curriculum, null, 2)};\n\n` +
      `export const lessonLoaders: Record<string, () => Promise<Lesson>> = {\n${loaders.join('\n')}\n};`,
    "import type { Chapter, Lang, Lesson } from '../content.model';",
  );
  return loaders.length;
}

/**
 * In unquoted YAML, " #" starts a comment – "Variables with @let and #ref" silently becomes
 * "Variables with @let and". Fail the build when a parsed value is followed by " #" in the source.
 */
function assertNoYamlComments(raw, data, file) {
  const values = [data.title, ...(data.quiz ?? []).flatMap((q) => [q.question, ...q.options])];
  for (const value of values) {
    if (typeof value === 'string' && raw.includes(`${value} #`)) {
      throw new Error(`${file}: "${value} #…" was cut off by YAML – put the value in quotes.`);
    }
  }
}

/** The language switch keeps the URL, so every lesson must exist in every language. */
function assertSameStructure(curriculum) {
  const idsOf = (lang) => curriculum[lang].flatMap((c) => c.lessons.map((l) => l.id)).join('\n');
  const [first, ...others] = LANGS;
  for (const lang of others) {
    if (idsOf(lang) !== idsOf(first)) {
      throw new Error(`Lessons in content/${lang} differ from content/${first} – every lesson needs both languages.`);
    }
  }
}

async function writeTs(path, body, imports) {
  await writeFile(path, `// Generated by scripts/build-content.mjs – do not edit.\n${imports}\n\n${body}\n`);
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });
const exampleIds = await buildExamples();
const lessonCount = await buildLessons(exampleIds);
console.log(`Content built: ${lessonCount} lessons, ${exampleIds.size} examples.`);
