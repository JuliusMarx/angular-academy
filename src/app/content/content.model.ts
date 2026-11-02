export const LANGS = ['de', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang);

export interface LessonSummary {
  /** "<chapter>/<lesson>", identical across languages. */
  id: string;
  slug: string;
  title: string;
  minutes: number;
}

export interface Chapter {
  slug: string;
  title: string;
  description: string;
  lessons: LessonSummary[];
}

export type LessonSegment = { type: 'html'; html: string } | { type: 'tryit'; example: string };

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  /** Inline HTML rendered from Markdown at build time. */
  explanation?: string;
}

export interface TocEntry {
  /** Anchor id of the h2 heading. */
  id: string;
  text: string;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  toc: TocEntry[];
  segments: LessonSegment[];
  quiz: QuizQuestion[];
}

export interface Example {
  id: string;
  openFile: string;
  files: Record<string, string>;
}
