import { Check, TestKit } from './check-kit';

export const exercise = 'ex-project-form';

/** Opens the form, enters the values and presses "Save task". */
async function submitWith(t: TestKit, title: string, notes = ''): Promise<void> {
  await t.navigate('/tasks/new');
  await t.type('#title', title);
  await t.type('#notes', notes);
  await t.click(t.button('Save task'));
}

const hasError = (t: TestKit, field: string, kind: string) => t.$$(`#${field}-errors [data-kind="${kind}"]`).length > 0;

const stayed = (t: TestKit, what: string) =>
  t.expect(t.url() === '/tasks/new', `${what} must not be saved, but the app navigated to ${t.url()}`);

export const checks: Check[] = [
  {
    id: 'title-required',
    run: async (t) => {
      await submitWith(t, '');
      t.expect(hasError(t, 'title', 'required'), 'An empty title should show a "required" error');
      stayed(t, 'A task without a title');
    },
  },
  {
    id: 'title-length',
    run: async (t) => {
      await submitWith(t, 'ab');
      t.expect(hasError(t, 'title', 'minLength'), '"ab" should show a "minLength" error');
      stayed(t, 'A title with 2 characters');
      await submitWith(t, 'x'.repeat(81));
      t.expect(hasError(t, 'title', 'maxLength'), 'A title with 81 characters should show a "maxLength" error');
      stayed(t, 'A title with 81 characters');
      await submitWith(t, 'Ship it', 'y'.repeat(501));
      t.expect(hasError(t, 'notes', 'maxLength'), 'Notes with 501 characters should show a "maxLength" error');
      stayed(t, 'A task with 501 characters of notes');
    },
  },
  {
    id: 'saves-and-navigates',
    run: async (t) => {
      await submitWith(t, 'Write the tests', 'For the store.');
      await t.eventually(() =>
        t.expect(/^\/tasks\/\d+$/.test(t.url()), `After saving, expected the URL /tasks/<id>, but it is ${t.url()}`),
      );
      await t.eventually(() => t.expectText('h1', 'Write the tests'));
      await t.navigate('/tasks');
      t.expect(
        t.$$('.tasks a').some((a) => a.textContent?.trim() === 'Write the tests'),
        'The new task should appear in the list',
      );
    },
  },
];
