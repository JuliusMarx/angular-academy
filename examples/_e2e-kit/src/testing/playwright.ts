// Angular Academy mini Playwright – you don't need to change this file.
// In a real project, `npx playwright test` drives real browsers. The course preview can't start a browser,
// so this small imitation offers the most important parts of the same API and drives the app in a frame.
// Like Playwright, it waits automatically for elements and retries assertions – here for up to 1.5 s
// instead of Playwright's 5 s, so failing tests report quickly.

const TIMEOUT = 1500;
const FRAME_NAME = 'angular-academy-app-under-test';

/** Inside the test frame: the variant of the app to start ('' for the real one), otherwise undefined. */
export function appUnderTest(): string | undefined {
  const [name, variant] = window.name.split(':');
  return name === FRAME_NAME ? (variant ?? '') : undefined;
}

// ---------- helpers ----------

/** Errors that make no sense to retry, e.g. a locator matching several elements. */
class FatalError extends Error {}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function retry<T>(attempt: () => T, timeout = TIMEOUT): Promise<T> {
  const end = Date.now() + timeout;
  for (;;) {
    try {
      return attempt();
    } catch (e) {
      if (e instanceof FatalError || Date.now() > end) throw e;
    }
    await delay(50);
  }
}

const normalize = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();
const show = (value: unknown): string => (value instanceof RegExp || value instanceof Locator ? String(value) : JSON.stringify(value));

type TextMatch = string | RegExp;

/** Like Playwright: strings match case-insensitively as a substring, or exactly with `exact: true`. */
function matches(text: string, expected: TextMatch, exact = false): boolean {
  if (expected instanceof RegExp) return expected.test(text);
  return exact ? text === normalize(expected) : text.toLowerCase().includes(normalize(expected).toLowerCase());
}

function isVisible(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  return el.checkVisibility({ visibilityProperty: true }) && (rect.width > 0 || rect.height > 0);
}

/** Hidden from users and screen readers – getByRole() ignores these elements, like Playwright. */
function isHiddenFromAccessibility(el: Element): boolean {
  if (!el.checkVisibility({ visibilityProperty: true })) return true;
  return !!el.closest('[aria-hidden="true"]');
}

const isDisabled = (el: Element) => (el as HTMLButtonElement).disabled === true || el.getAttribute('aria-disabled') === 'true';

// ---------- roles and names (a simplified version of what browsers compute) ----------

const INPUT_ROLES: Record<string, string> = {
  button: 'button',
  submit: 'button',
  reset: 'button',
  image: 'button',
  checkbox: 'checkbox',
  radio: 'radio',
  range: 'slider',
  number: 'spinbutton',
  search: 'searchbox',
  text: 'textbox',
  email: 'textbox',
  tel: 'textbox',
  url: 'textbox',
};

const TAG_ROLES: Record<string, string> = {
  article: 'article',
  button: 'button',
  dialog: 'dialog',
  form: 'form',
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  h5: 'heading',
  h6: 'heading',
  hr: 'separator',
  li: 'listitem',
  main: 'main',
  nav: 'navigation',
  ol: 'list',
  option: 'option',
  output: 'status',
  p: 'paragraph',
  progress: 'progressbar',
  table: 'table',
  td: 'cell',
  textarea: 'textbox',
  th: 'columnheader',
  tr: 'row',
  ul: 'list',
};

function roleOf(el: Element): string | undefined {
  const explicit = el.getAttribute('role');
  if (explicit) return explicit.split(' ')[0];
  const tag = el.tagName.toLowerCase();
  if (tag === 'input') {
    const type = (el as HTMLInputElement).type;
    return type === 'password' || type === 'hidden' ? undefined : (INPUT_ROLES[type] ?? 'textbox');
  }
  if (tag === 'a') return el.hasAttribute('href') ? 'link' : undefined;
  if (tag === 'img') return el.getAttribute('alt') === '' ? 'presentation' : 'img';
  if (tag === 'select') return (el as HTMLSelectElement).multiple ? 'listbox' : 'combobox';
  return TAG_ROLES[tag];
}

/** Roles whose accessible name comes from their content, e.g. the text of a button. */
const NAME_FROM_CONTENT = new Set(['button', 'link', 'heading', 'checkbox', 'radio', 'cell', 'columnheader', 'option', 'tab', 'menuitem', 'switch']);

function labelsOf(el: Element): string | undefined {
  const labelledBy = el.getAttribute('aria-labelledby');
  if (labelledBy) return normalize(labelledBy.split(/\s+/).map((id) => el.ownerDocument.getElementById(id)?.textContent).join(' '));
  const ariaLabel = normalize(el.getAttribute('aria-label'));
  if (ariaLabel) return ariaLabel;
  const labels = (el as HTMLInputElement).labels;
  if (labels?.length) return normalize([...labels].map((l) => l.textContent).join(' '));
  return undefined;
}

function accessibleName(el: Element): string {
  const fromLabels = labelsOf(el);
  if (fromLabels !== undefined) return fromLabels;
  if (el.tagName === 'IMG') return normalize(el.getAttribute('alt'));
  if (el.tagName === 'INPUT' && ['submit', 'reset', 'button'].includes((el as HTMLInputElement).type)) {
    return normalize((el as HTMLInputElement).value) || ((el as HTMLInputElement).type === 'reset' ? 'Reset' : 'Submit');
  }
  if (NAME_FROM_CONTENT.has(roleOf(el) ?? '')) return normalize(el.textContent);
  return normalize(el.getAttribute('title') ?? el.getAttribute('placeholder'));
}

function textOf(el: Element): string {
  if (el.tagName === 'INPUT' && ['submit', 'button', 'reset'].includes((el as HTMLInputElement).type)) return normalize((el as HTMLInputElement).value);
  return normalize(el.textContent);
}

// ---------- locators ----------

export interface RoleOptions {
  name?: TextMatch;
  exact?: boolean;
  level?: number;
  checked?: boolean;
}

export interface TextOptions {
  exact?: boolean;
}

const unique = (elements: Element[]) => [...new Set(elements)];
const descendants = (scope: Element) => [...scope.querySelectorAll('*')].filter((el) => !['SCRIPT', 'STYLE'].includes(el.tagName));

function describeOptions(options: object): string {
  const entries = Object.entries(options).map(([k, v]) => `${k}: ${show(v)}`);
  return entries.length ? `, { ${entries.join(', ')} }` : '';
}

/** Everything that can find elements: the page and every locator. */
abstract class Finder {
  protected abstract scopes(): Element[];
  protected abstract readonly path: string;
  protected abstract readonly page: Page;

  private find(description: string, select: (scope: Element) => Element[]): Locator {
    return new Locator(this.page, () => unique(this.scopes().flatMap(select)), this.path ? `${this.path}.${description}` : description);
  }

  /** Finds elements by their role and accessible name – the way screen readers see the page. */
  getByRole(role: string, options: RoleOptions = {}): Locator {
    return this.find(`getByRole(${show(role)}${describeOptions(options)})`, (scope) =>
      descendants(scope).filter(
        (el) =>
          roleOf(el) === role &&
          !isHiddenFromAccessibility(el) &&
          (options.name === undefined || matches(accessibleName(el), options.name, options.exact)) &&
          (options.level === undefined || el.tagName === `H${options.level}`) &&
          (options.checked === undefined || (el as HTMLInputElement).checked === options.checked),
      ),
    );
  }

  /** Finds form fields by the text of their label (or aria-label). */
  getByLabel(text: TextMatch, options: TextOptions = {}): Locator {
    return this.find(`getByLabel(${show(text)}${describeOptions(options)})`, (scope) =>
      descendants(scope).filter((el) => {
        const labels = labelsOf(el);
        return labels !== undefined && el.tagName !== 'LABEL' && matches(labels, text, options.exact);
      }),
    );
  }

  /** Finds the innermost elements that contain the text. */
  getByText(text: TextMatch, options: TextOptions = {}): Locator {
    return this.find(`getByText(${show(text)}${describeOptions(options)})`, (scope) => {
      const hits = descendants(scope).filter((el) => matches(textOf(el), text, options.exact));
      return hits.filter((el) => !hits.some((other) => other !== el && el.contains(other)));
    });
  }

  getByPlaceholder(text: TextMatch, options: TextOptions = {}): Locator {
    return this.find(`getByPlaceholder(${show(text)}${describeOptions(options)})`, (scope) =>
      descendants(scope).filter((el) => el.hasAttribute('placeholder') && matches(normalize(el.getAttribute('placeholder')), text, options.exact)),
    );
  }

  /** Finds elements by their data-testid attribute. */
  getByTestId(id: string): Locator {
    return this.find(`getByTestId(${show(id)})`, (scope) => descendants(scope).filter((el) => el.getAttribute('data-testid') === id));
  }

  /** Finds elements with a CSS selector. */
  locator(selector: string): Locator {
    return this.find(`locator(${show(selector)})`, (scope) => [...scope.querySelectorAll(selector)]);
  }
}

export class Locator extends Finder {
  constructor(
    protected readonly page: Page,
    private readonly query: () => Element[],
    readonly path: string,
  ) {
    super();
  }

  protected scopes(): Element[] {
    return this.query();
  }

  /** All elements the locator matches right now. */
  elements(): Element[] {
    return this.page.isLoaded() ? this.query() : [];
  }

  toString(): string {
    return this.path;
  }

  first(): Locator {
    return this.nth(0);
  }

  last(): Locator {
    return new Locator(this.page, () => this.query().slice(-1), `${this.path}.last()`);
  }

  nth(index: number): Locator {
    return new Locator(this.page, () => this.query().slice(index, index + 1), `${this.path}.nth(${index})`);
  }

  /** Keeps only the elements that contain the text, or an element matching the locator. */
  filter(options: { hasText?: TextMatch; has?: Locator }): Locator {
    return new Locator(
      this.page,
      () =>
        this.query().filter(
          (el) =>
            (options.hasText === undefined || matches(textOf(el), options.hasText)) &&
            (options.has === undefined || options.has.elements().some((inner) => el.contains(inner))),
        ),
      `${this.path}.filter(${describeOptions(options).slice(2)})`,
    );
  }

  /** Exactly one element – like Playwright, actions refuse to guess when several match. */
  single(action: string): Element {
    const found = this.elements();
    if (found.length > 1) throw new FatalError(`${action}: strict mode violation – ${this.path} matches ${found.length} elements`);
    if (found.length === 0) throw new Error(`${action}: waiting for ${this.path}`);
    return found[0];
  }

  private async actionable(action: string, ready: (el: Element) => string | undefined): Promise<HTMLElement> {
    try {
      return await retry(() => {
        const el = this.single(action);
        const problem = ready(el);
        if (problem) throw new Error(`${action}: ${this.path} is ${problem}`);
        return el as HTMLElement;
      });
    } catch (e) {
      throw e instanceof FatalError ? e : new Error(`Timeout ${TIMEOUT} ms – ${(e as Error).message}`);
    }
  }

  private static clickable(el: Element): string | undefined {
    if (!isVisible(el)) return 'not visible';
    if (isDisabled(el)) return 'disabled';
    return undefined;
  }

  private static editable(el: Element): string | undefined {
    if (!['INPUT', 'TEXTAREA'].includes(el.tagName) && !(el as HTMLElement).isContentEditable) return 'not an input field';
    if ((el as HTMLInputElement).readOnly) return 'read-only';
    return Locator.clickable(el);
  }

  async click(): Promise<void> {
    const el = await this.actionable('click', Locator.clickable);
    el.focus();
    el.click();
  }

  /** Replaces the content of an input field, like typing it in. */
  async fill(value: string): Promise<void> {
    const el = await this.actionable('fill', Locator.editable);
    const win = el.ownerDocument.defaultView!;
    el.focus();
    if (el.isContentEditable) {
      el.textContent = value;
    } else {
      const proto = el.tagName === 'TEXTAREA' ? win.HTMLTextAreaElement.prototype : win.HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(el, value);
    }
    el.dispatchEvent(new win.Event('input', { bubbles: true }));
    el.dispatchEvent(new win.Event('change', { bubbles: true }));
  }

  /** Presses a key, e.g. 'Enter'. Enter in a form field submits the form, like in a browser. */
  async press(key: string): Promise<void> {
    const el = await this.actionable('press', Locator.clickable);
    const win = el.ownerDocument.defaultView!;
    el.focus();
    const proceed = el.dispatchEvent(new win.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    el.dispatchEvent(new win.KeyboardEvent('keyup', { key, bubbles: true }));
    const form = (el as HTMLInputElement).form;
    if (proceed && key === 'Enter' && el.tagName === 'INPUT' && form) form.requestSubmit();
  }

  async check(): Promise<void> {
    await this.setChecked(true);
  }

  async uncheck(): Promise<void> {
    await this.setChecked(false);
  }

  private async setChecked(checked: boolean): Promise<void> {
    const el = (await this.actionable(checked ? 'check' : 'uncheck', Locator.clickable)) as HTMLInputElement;
    if (el.checked !== checked) el.click();
    await retry(() => {
      if (el.checked !== checked) throw new Error(`${this.path} did not change its checked state`);
    });
  }

  async count(): Promise<number> {
    return this.elements().length;
  }

  async textContent(): Promise<string | null> {
    return (await this.actionable('textContent', () => undefined)).textContent;
  }

  async inputValue(): Promise<string> {
    return ((await this.actionable('inputValue', () => undefined)) as HTMLInputElement).value;
  }

  async isVisible(): Promise<boolean> {
    const found = this.elements();
    return found.length > 0 && isVisible(found[0]);
  }
}

// ---------- page ----------

export class Page extends Finder {
  protected readonly path = '';
  protected readonly page = this;

  constructor(private readonly frame: HTMLIFrameElement) {
    super();
  }

  private get window(): Window {
    return this.frame.contentWindow!;
  }

  isLoaded(): boolean {
    return !!this.frame.getAttribute('src') && !!this.window.document.body;
  }

  protected scopes(): Element[] {
    return this.isLoaded() ? [this.window.document.documentElement] : [];
  }

  /** Opens a URL of the app. Paths like '/products' are relative to the app, like Playwright's baseURL. */
  async goto(url: string): Promise<void> {
    const target = new URL(url.replace(/^\//, ''), document.baseURI).href;
    await this.waitForLoad(() => this.frame.setAttribute('src', target));
  }

  async reload(): Promise<void> {
    await this.waitForLoad(() => this.window.location.reload());
  }

  private waitForLoad(start: () => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout – the page did not load')), 15_000);
      this.frame.addEventListener('load', () => (clearTimeout(timer), resolve()), { once: true });
      start();
    });
  }

  url(): string {
    return this.isLoaded() ? this.window.location.href : 'about:blank';
  }

  async title(): Promise<string> {
    return this.documentTitle();
  }

  documentTitle(): string {
    return this.isLoaded() ? this.window.document.title : '';
  }
}

// ---------- expect ----------

interface Outcome {
  pass: boolean;
  received: string;
}

class Assertions {
  constructor(
    private readonly subject: string,
    private readonly negate: boolean,
  ) {}

  protected async assert(matcher: string, expected: string, test: () => Outcome): Promise<void> {
    const label = `expect(${this.subject}).${this.negate ? 'not.' : ''}${matcher}(${expected})`;
    try {
      await retry(() => {
        const outcome = test();
        if (outcome.pass === this.negate) throw new Error(`${label} failed\nReceived: ${outcome.received}`);
      });
    } catch (e) {
      throw e instanceof FatalError ? new Error(`${label}: ${e.message}`) : e;
    }
  }
}

export class LocatorAssertions extends Assertions {
  constructor(
    private readonly locator: Locator,
    private readonly negated = false,
  ) {
    super(locator.path, negated);
  }

  get not(): LocatorAssertions {
    return new LocatorAssertions(this.locator, !this.negated);
  }

  /** The single matching element, or undefined if there is none. */
  private one(): Element | undefined {
    const found = this.locator.elements();
    if (found.length > 1) throw new FatalError(`strict mode violation – ${this.locator.path} matches ${found.length} elements`);
    return found[0];
  }

  private withElement(test: (el: Element) => Outcome): () => Outcome {
    return () => {
      const el = this.one();
      return el ? test(el) : { pass: false, received: 'no matching element' };
    };
  }

  toBeVisible(): Promise<void> {
    return this.assert('toBeVisible', '', this.withElement((el) => ({ pass: isVisible(el), received: 'hidden' })));
  }

  toBeHidden(): Promise<void> {
    return this.assert('toBeHidden', '', () => {
      const el = this.one();
      return { pass: !el || !isVisible(el), received: 'visible' };
    });
  }

  /** The whole text must match (whitespace is normalized). With an array: one entry per element. */
  toHaveText(expected: TextMatch | TextMatch[]): Promise<void> {
    if (Array.isArray(expected)) {
      return this.assert('toHaveText', show(expected), () => {
        const texts = this.locator.elements().map(textOf);
        const pass = texts.length === expected.length && texts.every((t, i) => matches(t, expected[i], true));
        return { pass, received: show(texts) };
      });
    }
    return this.assert('toHaveText', show(expected), this.withElement((el) => ({ pass: matches(textOf(el), expected, true), received: show(textOf(el)) })));
  }

  /** The text must contain the expected part. */
  toContainText(expected: TextMatch): Promise<void> {
    return this.assert(
      'toContainText',
      show(expected),
      this.withElement((el) => ({
        pass: expected instanceof RegExp ? expected.test(textOf(el)) : textOf(el).includes(normalize(expected)),
        received: show(textOf(el)),
      })),
    );
  }

  toHaveCount(count: number): Promise<void> {
    return this.assert('toHaveCount', String(count), () => {
      const n = this.locator.elements().length;
      return { pass: n === count, received: String(n) };
    });
  }

  toHaveValue(expected: TextMatch): Promise<void> {
    return this.assert(
      'toHaveValue',
      show(expected),
      this.withElement((el) => {
        const value = (el as HTMLInputElement).value ?? '';
        return { pass: expected instanceof RegExp ? expected.test(value) : value === expected, received: show(value) };
      }),
    );
  }

  toBeChecked(): Promise<void> {
    return this.assert('toBeChecked', '', this.withElement((el) => ({ pass: (el as HTMLInputElement).checked === true, received: 'not checked' })));
  }

  toBeEnabled(): Promise<void> {
    return this.assert('toBeEnabled', '', this.withElement((el) => ({ pass: !isDisabled(el), received: 'disabled' })));
  }

  toBeDisabled(): Promise<void> {
    return this.assert('toBeDisabled', '', this.withElement((el) => ({ pass: isDisabled(el), received: 'enabled' })));
  }

  toHaveAttribute(name: string, value?: TextMatch): Promise<void> {
    return this.assert(
      'toHaveAttribute',
      value === undefined ? show(name) : `${show(name)}, ${show(value)}`,
      this.withElement((el) => {
        const actual = el.getAttribute(name);
        const pass = actual !== null && (value === undefined || (value instanceof RegExp ? value.test(actual) : actual === value));
        return { pass, received: show(actual) };
      }),
    );
  }
}

export class PageAssertions extends Assertions {
  constructor(
    private readonly target: Page,
    private readonly negated = false,
  ) {
    super('page', negated);
  }

  get not(): PageAssertions {
    return new PageAssertions(this.target, !this.negated);
  }

  /** A string is resolved like page.goto() does, so '/products' works. */
  toHaveURL(expected: TextMatch): Promise<void> {
    const wanted = typeof expected === 'string' ? new URL(expected.replace(/^\//, ''), document.baseURI).href : expected;
    return this.assert('toHaveURL', show(expected), () => {
      const url = this.target.url();
      return { pass: typeof wanted === 'string' ? url === wanted : wanted.test(url), received: show(url) };
    });
  }

  toHaveTitle(expected: TextMatch): Promise<void> {
    return this.assert('toHaveTitle', show(expected), () => {
      const title = this.target.documentTitle();
      return { pass: matches(title, expected, typeof expected === 'string'), received: show(title) };
    });
  }
}

class ValueAssertions {
  constructor(
    private readonly actual: unknown,
    private readonly negate = false,
  ) {}

  get not(): ValueAssertions {
    return new ValueAssertions(this.actual, !this.negate);
  }

  private check(pass: boolean, message: string): void {
    if (pass === this.negate) throw new Error(this.negate ? message.replace('Expected', 'Expected not') : message);
  }

  toBe(expected: unknown): void {
    this.check(Object.is(this.actual, expected), `Expected ${show(this.actual)} to be ${show(expected)}`);
  }

  toEqual(expected: unknown): void {
    this.check(JSON.stringify(this.actual) === JSON.stringify(expected), `Expected ${show(this.actual)} to equal ${show(expected)}`);
  }

  toContain(item: unknown): void {
    const actual = this.actual as string | unknown[];
    this.check(actual?.includes?.(item as never) ?? false, `Expected ${show(this.actual)} to contain ${show(item)}`);
  }

  toBeTruthy(): void {
    this.check(!!this.actual, `Expected ${show(this.actual)} to be truthy`);
  }
}

export function expect(subject: Locator): LocatorAssertions;
export function expect(subject: Page): PageAssertions;
export function expect(subject: unknown): ValueAssertions;
export function expect(subject: unknown): LocatorAssertions | PageAssertions | ValueAssertions {
  if (subject instanceof Locator) return new LocatorAssertions(subject);
  if (subject instanceof Page) return new PageAssertions(subject);
  return new ValueAssertions(subject);
}

// ---------- test ----------

export interface Fixtures {
  page: Page;
}

type TestFn = (fixtures: Fixtures) => unknown;

interface Suite {
  name: string;
  beforeEach: TestFn[];
  afterEach: TestFn[];
  children: (Suite | TestCase)[];
  parent?: Suite;
}

interface TestCase {
  name: string;
  fn: TestFn;
  suite: Suite;
}

const root: Suite = { name: '', beforeEach: [], afterEach: [], children: [] };
let current = root;

function describe(name: string, body: () => void): void {
  const suite: Suite = { name, beforeEach: [], afterEach: [], children: [], parent: current };
  current.children.push(suite);
  current = suite;
  try {
    body();
  } finally {
    current = suite.parent!;
  }
}

export const test = Object.assign(
  (name: string, fn: TestFn) => {
    current.children.push({ name, fn, suite: current });
  },
  {
    describe,
    beforeEach: (fn: TestFn) => current.beforeEach.push(fn),
    afterEach: (fn: TestFn) => current.afterEach.push(fn),
  },
);

/** Only here so playwright.config.ts looks like in a real project. */
export const defineConfig = <T>(config: T): T => config;
export const devices: Record<string, object> = {};

// ---------- running ----------

const tests = (suite: Suite): TestCase[] => suite.children.flatMap((c) => ('fn' in c ? [c] : tests(c)));
const chain = (suite: Suite | undefined): Suite[] => (suite ? [...chain(suite.parent), suite] : []);
const fullName = (t: TestCase) => [...chain(t.suite).map((s) => s.name).filter(Boolean), t.name].join(' › ');

export interface RunOptions {
  /** Which version of the app the tests run against – the exercise checks use broken ones. */
  variant?: string;
  /** Stop at the first failing test. */
  bail?: boolean;
}

export interface RunResult {
  results: { name: string; passed: boolean; error?: string }[];
  passed: number;
  failed: number;
}

/** The frame that shows the app while the tests drive it. */
function stage(): HTMLElement {
  let stage = document.getElementById('app-under-test');
  if (!stage) {
    stage = document.createElement('section');
    stage.id = 'app-under-test';
    stage.innerHTML = `
      <style>
        #app-under-test { margin-top: 1.5rem; font-family: system-ui, sans-serif; }
        #app-under-test p { margin: 0 0 0.25rem; color: #57606a; font-size: 0.875rem; }
        #app-under-test iframe { width: 100%; height: 22rem; border: 1px solid #d0d7de; border-radius: 6px; background: #fff; }
      </style>
      <p>App under test</p>`;
    document.body.append(stage);
  }
  return stage;
}

export async function runTests({ variant = '', bail = false }: RunOptions = {}): Promise<RunResult> {
  const results: RunResult['results'] = [];
  for (const t of tests(root)) {
    const frame = document.createElement('iframe');
    frame.name = `${FRAME_NAME}:${variant}`;
    frame.title = `App under test: ${t.name}`;
    stage().querySelector('iframe')?.remove();
    stage().append(frame);
    const fixtures = { page: new Page(frame) };
    const suites = chain(t.suite);
    let error: unknown;
    try {
      for (const s of suites) for (const f of s.beforeEach) await f(fixtures);
      await t.fn(fixtures);
    } catch (e) {
      error = e;
    }
    for (const s of [...suites].reverse()) {
      for (const f of s.afterEach) {
        try {
          await f(fixtures);
        } catch (e) {
          error ??= e;
        }
      }
    }
    results.push(
      error === undefined
        ? { name: fullName(t), passed: true }
        : { name: fullName(t), passed: false, error: error instanceof Error ? error.message : String(error) },
    );
    if (bail && error !== undefined) break;
  }
  const passed = results.filter((r) => r.passed).length;
  return { results, passed, failed: results.length - passed };
}
