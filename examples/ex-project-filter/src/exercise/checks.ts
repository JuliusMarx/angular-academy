import { Check, TestKit } from './check-kit';

export const exercise = 'ex-project-filter';

const LABELS = ['All', 'Open', 'Done'];

/** The filter button with exactly this label. */
function filterButton(t: TestKit, label: string): HTMLButtonElement {
  const button = t.$$('[role="group"] button').find((b) => b.textContent?.trim() === label);
  t.expect(button, `No button "${label}" inside the <div role="group">`);
  return button as HTMLButtonElement;
}

/** The checkboxes of the tasks in the list. */
const shown = (t: TestKit) => t.$$('.tasks app-task-item input[type="checkbox"]') as HTMLInputElement[];

const pressed = (b: HTMLElement) => b.getAttribute('aria-pressed') ?? '(none)';

export const checks: Check[] = [
  {
    id: 'filter-buttons',
    run: (t) => {
      for (const label of LABELS) {
        const button = filterButton(t, label);
        t.expect(button.type === 'button', `"${label}" needs type="button"`);
        const expected = label === 'All' ? 'true' : 'false';
        t.expect(pressed(button) === expected, `"${label}": expected aria-pressed="${expected}", found ${pressed(button)}`);
      }
    },
  },
  {
    id: 'filter-lists',
    run: async (t) => {
      await t.click(filterButton(t, 'All'));
      const all = shown(t).length;
      await t.click(filterButton(t, 'Open'));
      t.expect(pressed(filterButton(t, 'Open')) === 'true', 'After a click on "Open" it should have aria-pressed="true"');
      t.expect(pressed(filterButton(t, 'All')) === 'false', 'After a click on "Open", "All" should have aria-pressed="false"');
      const open = shown(t);
      t.expect(open.length > 0 && open.every((c) => !c.checked), '"Open" should list only the open tasks');
      await t.click(filterButton(t, 'Done'));
      const done = shown(t);
      t.expect(done.length > 0 && done.every((c) => c.checked), '"Done" should list only the finished tasks');
      t.expect(
        open.length + done.length === all,
        `"All" shows ${all} tasks, but "Open" and "Done" together show ${open.length + done.length}`,
      );
    },
  },
  {
    id: 'filter-reacts',
    run: async (t) => {
      await t.click(filterButton(t, 'Open'));
      const before = shown(t).length;
      t.expect(before > 0, '"Open" shows no tasks');
      await t.click(shown(t)[0]);
      t.expect(shown(t).length === before - 1, 'A task ticked off under "Open" should disappear from the list');
      await t.click(filterButton(t, 'Done'));
      const done = shown(t);
      await t.click(done[done.length - 1]); // reopen the task again
      t.expect(shown(t).length === done.length - 1, 'A task reopened under "Done" should disappear from the list');
      await t.click(filterButton(t, 'Open'));
      t.expect(shown(t).length === before, 'The reopened task should show up under "Open" again');
    },
  },
];
