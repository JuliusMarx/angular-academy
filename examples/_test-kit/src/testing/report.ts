// Shows the test results in the preview, like the output of `ng test` in the terminal.
/** The parts of a test run the report shows – the same for unit tests and UI tests. */
export interface RunResult {
  results: { name: string; passed: boolean; error?: string }[];
  passed: number;
  failed: number;
}

export function renderReport(run: RunResult, target: Element = document.body): void {
  const section = document.createElement('section');
  section.className = 'test-report';
  const heading = document.createElement('h1');
  const tests = (n: number) => `${n} ${n === 1 ? 'test' : 'tests'}`;
  heading.textContent = run.failed === 0 ? `✓ ${tests(run.passed)} passed` : `✗ ${run.failed} of ${tests(run.results.length)} failed`;
  heading.className = run.failed === 0 ? 'pass' : 'fail';
  const list = document.createElement('ul');
  for (const result of run.results) {
    const item = document.createElement('li');
    item.className = result.passed ? 'pass' : 'fail';
    item.textContent = `${result.passed ? '✓' : '✗'} ${result.name}`;
    if (result.error) {
      const error = document.createElement('pre');
      error.textContent = result.error;
      item.append(error);
    }
    list.append(item);
  }
  if (run.results.length === 0) list.innerHTML = '<li>No tests found – import your spec files in src/specs.ts.</li>';
  const style = document.createElement('style');
  style.textContent = `
    .test-report { font-family: system-ui, sans-serif; }
    .test-report ul { list-style: none; padding: 0; }
    .test-report li { margin: 0.25rem 0; }
    .test-report .pass { color: #1a7f37; }
    .test-report .fail { color: #b3261e; }
    .test-report pre { margin: 0.25rem 0 0.5rem 1.25rem; white-space: pre-wrap; color: #57606a; }
  `;
  section.append(style, heading, list);
  target.replaceChildren(section);
}
