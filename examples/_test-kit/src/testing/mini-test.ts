// Angular Academy test runner – you don't need to change this file.
// In a real project, `ng test` runs your *.spec.ts files with Vitest. In the course preview, this small
// runner provides the same globals (describe, it, expect, vi …) so the specs look exactly the same.
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

type Fn = () => unknown;

interface Suite {
  name: string;
  beforeEach: Fn[];
  afterEach: Fn[];
  children: (Suite | TestCase)[];
  parent?: Suite;
}

interface TestCase {
  name: string;
  fn: Fn;
  suite: Suite;
}

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

export interface RunResult {
  results: TestResult[];
  passed: number;
  failed: number;
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

function it(name: string, fn: Fn): void {
  current.children.push({ name, fn, suite: current });
}

const tests = (suite: Suite): TestCase[] => suite.children.flatMap((c) => ('fn' in c ? [c] : tests(c)));
const chain = (suite: Suite | undefined): Suite[] => (suite ? [...chain(suite.parent), suite] : []);
const fullName = (test: TestCase) => [...chain(test.suite).map((s) => s.name).filter(Boolean), test.name].join(' › ');

// ---------- expect ----------

class AssertionError extends Error {}

const show = (value: unknown): string => {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'function') return value.name ? `[Function ${value.name}]` : '[Function]';
  if (value instanceof Element) return `<${value.tagName.toLowerCase()}>`;
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
};

function equals(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => equals((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

interface MockFn {
  (...args: unknown[]): unknown;
  mock: { calls: unknown[][] };
  mockReturnValue(value: unknown): MockFn;
  mockImplementation(impl: (...args: unknown[]) => unknown): MockFn;
}

const isMock = (value: unknown): value is MockFn => typeof value === 'function' && 'mock' in value;

function matchers(actual: unknown, negate: boolean) {
  const check = (pass: boolean, message: string) => {
    if (pass === negate) throw new AssertionError(negate ? message.replace('Expected', 'Expected not') : message);
  };
  const calls = () => {
    if (!isMock(actual)) throw new AssertionError(`${show(actual)} is not a vi.fn() mock`);
    return actual.mock.calls;
  };
  return {
    toBe: (expected: unknown) => check(Object.is(actual, expected), `Expected ${show(actual)} to be ${show(expected)}`),
    toEqual: (expected: unknown) => check(equals(actual, expected), `Expected ${show(actual)} to equal ${show(expected)}`),
    toBeTruthy: () => check(!!actual, `Expected ${show(actual)} to be truthy`),
    toBeFalsy: () => check(!actual, `Expected ${show(actual)} to be falsy`),
    toBeNull: () => check(actual === null, `Expected ${show(actual)} to be null`),
    toBeUndefined: () => check(actual === undefined, `Expected ${show(actual)} to be undefined`),
    toBeDefined: () => check(actual !== undefined, `Expected ${show(actual)} to be defined`),
    toBeGreaterThan: (n: number) => check((actual as number) > n, `Expected ${show(actual)} to be greater than ${n}`),
    toBeLessThan: (n: number) => check((actual as number) < n, `Expected ${show(actual)} to be less than ${n}`),
    toContain: (item: unknown) =>
      check(
        typeof actual === 'string' ? actual.includes(item as string) : Array.isArray(actual) && actual.includes(item),
        `Expected ${show(actual)} to contain ${show(item)}`,
      ),
    toHaveLength: (n: number) =>
      check((actual as { length?: number })?.length === n, `Expected length ${n}, but got ${(actual as { length?: number })?.length}`),
    toMatch: (pattern: RegExp | string) =>
      check(typeof actual === 'string' && new RegExp(pattern).test(actual), `Expected ${show(actual)} to match ${pattern}`),
    toThrow: () => {
      let threw = false;
      try {
        (actual as () => unknown)();
      } catch {
        threw = true;
      }
      check(threw, 'Expected the function to throw');
    },
    toHaveBeenCalled: () => check(calls().length > 0, 'Expected the mock to have been called'),
    toHaveBeenCalledTimes: (n: number) =>
      check(calls().length === n, `Expected the mock to have been called ${n} times, but it was called ${calls().length} times`),
    toHaveBeenCalledWith: (...args: unknown[]) =>
      check(
        calls().some((c) => equals(c, args)),
        `Expected the mock to have been called with ${show(args)}, but the calls were ${show(calls())}`,
      ),
  };
}

type Matchers = ReturnType<typeof matchers>;

function expect(actual: unknown): Matchers & { not: Matchers } {
  return { ...matchers(actual, false), not: matchers(actual, true) };
}

// ---------- vi ----------

function fn(impl?: (...args: unknown[]) => unknown): MockFn {
  let implementation = impl;
  const mock = ((...args: unknown[]) => {
    mock.mock.calls.push(args);
    return implementation?.(...args);
  }) as MockFn;
  mock.mock = { calls: [] };
  mock.mockReturnValue = (value) => {
    implementation = () => value;
    return mock;
  };
  mock.mockImplementation = (next) => {
    implementation = next;
    return mock;
  };
  return mock;
}

function spyOn<T extends object>(object: T, method: keyof T & string): MockFn {
  const original = object[method] as (...args: unknown[]) => unknown;
  const spy = fn((...args) => original.apply(object, args));
  (object as Record<string, unknown>)[method] = spy;
  return spy;
}

export const vi = { fn, spyOn };

declare global {
  function describe(name: string, body: () => void): void;
  function it(name: string, fn: () => unknown): void;
  function beforeEach(fn: () => unknown): void;
  function afterEach(fn: () => unknown): void;
  function expect(actual: unknown): Matchers & { not: Matchers };
  const vi: { fn: typeof fn; spyOn: typeof spyOn };
}

export function installGlobals(): void {
  Object.assign(globalThis, {
    describe,
    it,
    test: it,
    expect,
    vi,
    beforeEach: (f: Fn) => current.beforeEach.push(f),
    afterEach: (f: Fn) => current.afterEach.push(f),
  });
}

// ---------- running ----------

/**
 * Replaces a class everywhere the tests get it from Angular – used by the exercise checks to run
 * your tests against deliberately broken versions ("mutants"). A good test notices the difference.
 */
export type Replacements = [original: Type<unknown>, replacement: Type<unknown>][];

const originalCreateComponent = TestBed.createComponent.bind(TestBed);

export async function runTests(replacements: Replacements = []): Promise<RunResult> {
  const components = new Map(replacements.filter(([, r]) => 'ɵcmp' in r));
  TestBed.createComponent = ((type: Type<unknown>) => originalCreateComponent(components.get(type) ?? type)) as typeof TestBed.createComponent;

  const results: TestResult[] = [];
  for (const test of tests(root)) {
    TestBed.resetTestingModule();
    for (const [original, replacement] of replacements) {
      if (!components.has(original)) TestBed.overrideProvider(original, { useFactory: () => new replacement() });
    }
    const suites = chain(test.suite);
    let error: unknown;
    try {
      for (const s of suites) for (const f of s.beforeEach) await f();
      await test.fn();
    } catch (e) {
      error = e;
    }
    // afterEach runs even when the test failed – e.g. http.verify() – and can fail the test too.
    for (const s of [...suites].reverse()) {
      for (const f of s.afterEach) {
        try {
          await f();
        } catch (e) {
          error ??= e;
        }
      }
    }
    TestBed.resetTestingModule();
    results.push(
      error === undefined
        ? { name: fullName(test), passed: true }
        : { name: fullName(test), passed: false, error: error instanceof Error ? error.message : String(error) },
    );
  }
  TestBed.createComponent = originalCreateComponent;
  const passed = results.filter((r) => r.passed).length;
  return { results, passed, failed: results.length - passed };
}
