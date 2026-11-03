// Angular Academy exercise checker – you don't need to change this file.
// After every save the app reloads, runs the checks in ./checks.ts against the running app
// and reports the results to the course page.
import { ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';

export interface Check {
  /** Matches the label shown on the course page. */
  id: string;
  run: (t: TestKit) => Promise<void> | void;
}

export interface CheckResult {
  id: string;
  passed: boolean;
  message?: string;
}

class CheckFailed extends Error {}

export class TestKit {
  constructor(private readonly appRef: ApplicationRef) {}

  /** The first element matching the selector – fails the check if there is none. */
  $(selector: string): HTMLElement {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new CheckFailed(`Nothing matches "${selector}"`);
    return el;
  }

  $$(selector: string): HTMLElement[] {
    return [...document.querySelectorAll<HTMLElement>(selector)];
  }

  text(selector: string): string {
    return this.$(selector).textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  /** A button (or any element) whose text contains the given label. */
  button(label: string): HTMLElement {
    const el = this.$$('button').find((b) => b.textContent?.includes(label));
    if (!el) throw new CheckFailed(`No button with the text "${label}"`);
    return el;
  }

  /**
   * Clicks and waits until the page is updated. With { untilStable: false } it only waits for the
   * next render – needed to see intermediate states like "Loading …", because whenStable() also
   * waits for pending resources.
   */
  async click(target: string | HTMLElement, options: { untilStable?: boolean } = {}): Promise<void> {
    (typeof target === 'string' ? this.$(target) : target).click();
    if (options.untilStable === false) {
      await new Promise((r) => setTimeout(r, 30));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    } else {
      await this.settle();
    }
  }

  async type(selector: string, value: string): Promise<void> {
    const input = this.$(selector) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await this.settle();
  }

  /** Navigates like typing the URL into the address bar (runs guards, redirects, resolvers). */
  async navigate(url: string): Promise<void> {
    await this.appRef.injector.get(Router).navigateByUrl(url);
    await this.settle();
  }

  /** The current router URL, e.g. "/products/2?sort=price". */
  url(): string {
    return this.appRef.injector.get(Router).url;
  }

  /** Waits until Angular has updated the page (and pending async work is done). */
  async settle(ms = 0): Promise<void> {
    await new Promise((r) => setTimeout(r, ms));
    await this.appRef.whenStable();
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  }

  /** Retries the assertion for a while – for things that take time, like loading data. */
  async eventually(assertion: () => void, timeoutMs = 3000): Promise<void> {
    const start = Date.now();
    for (;;) {
      try {
        assertion();
        return;
      } catch (e) {
        if (Date.now() - start > timeoutMs) throw e;
        await this.settle(100);
      }
    }
  }

  expect(condition: unknown, message: string): void {
    if (!condition) throw new CheckFailed(message);
  }

  expectText(selector: string, expected: string | RegExp): void {
    const actual = this.text(selector);
    const ok = typeof expected === 'string' ? actual.includes(expected) : expected.test(actual);
    this.expect(ok, `Expected "${selector}" to contain ${expected}, but it shows "${actual}"`);
  }
}

export async function runChecks(exercise: string, appRef: ApplicationRef, checks: Check[]): Promise<void> {
  const kit = new TestKit(appRef);
  await kit.settle(50);
  const results: CheckResult[] = [];
  for (const check of checks) {
    try {
      await check.run(kit);
      results.push({ id: check.id, passed: true });
    } catch (e) {
      results.push({ id: check.id, passed: false, message: e instanceof Error ? e.message : String(e) });
    }
  }
  report(exercise, results);
}

/** Bootstrapping failed (e.g. a compile error in the template): report every check as failed. */
export function reportCrash(exercise: string, checks: Check[], error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  report(exercise, checks.map((c) => ({ id: c.id, passed: false, message })));
}

function report(exercise: string, results: CheckResult[]): void {
  console.table(results);
  (window as unknown as { __exerciseResults?: unknown }).__exerciseResults = results;
  // The course page embeds this preview; window.top is the course page.
  window.top?.postMessage({ type: 'angular-academy:exercise-results', exercise, results }, '*');
}
