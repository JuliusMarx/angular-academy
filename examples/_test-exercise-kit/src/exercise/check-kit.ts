// Angular Academy exercise checker for test exercises – you don't need to change this file.
// It runs your specs against the real code (they should pass) and against deliberately broken
// versions from ./mutants.ts (a good test fails for each of them).
import { Replacements, RunResult, runTests } from '../testing/mini-test';

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
  /** Runs all your tests – optionally with classes replaced by broken versions. */
  runTests(replacements: Replacements = []): Promise<RunResult> {
    return runTests(replacements);
  }

  expect(condition: unknown, message: string): void {
    if (!condition) throw new CheckFailed(message);
  }

  /** Your tests must notice the broken version: at least one has to fail. */
  async expectCaught(replacements: Replacements, message: string): Promise<void> {
    const run = await this.runTests(replacements);
    this.expect(run.results.length > 0 && run.failed > 0, message);
  }
}

export async function runChecks(exercise: string, checks: Check[]): Promise<void> {
  const kit = new TestKit();
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

/** Something crashed before the checks could run (e.g. a compile error): report every check as failed. */
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
