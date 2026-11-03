import { Check, TestKit } from './check-kit';

export const exercise = 'ex-validation';

/** Fills the form and presses "Sign up" – submit() marks all fields as touched, so errors show. */
async function submitWith(t: TestKit, values: { email: string; password: string; confirm: string }): Promise<void> {
  await t.type('#email', values.email);
  await t.type('#password', values.password);
  await t.type('#confirm', values.confirm);
  await t.click(t.button('Sign up'));
}

const hasError = (t: TestKit, field: string, kind: string) => t.$$(`#${field}-errors [data-kind="${kind}"]`).length > 0;

export const checks: Check[] = [
  {
    id: 'email-required',
    run: async (t) => {
      await submitWith(t, { email: '', password: '', confirm: '' });
      t.expect(hasError(t, 'email', 'required'), 'An empty email should show a "required" error');
    },
  },
  {
    id: 'email-format',
    run: async (t) => {
      await submitWith(t, { email: 'ada@', password: '', confirm: '' });
      t.expect(hasError(t, 'email', 'email'), '"ada@" should show an "email" error');
      await t.type('#email', 'ada@example.com');
      t.expect(!hasError(t, 'email', 'email'), '"ada@example.com" should be accepted');
    },
  },
  {
    id: 'password-length',
    run: async (t) => {
      await submitWith(t, { email: 'ada@example.com', password: 'short', confirm: 'short' });
      t.expect(hasError(t, 'password', 'minLength'), '"short" should show a "minLength" error');
      await submitWith(t, { email: 'ada@example.com', password: '', confirm: '' });
      t.expect(hasError(t, 'password', 'required'), 'An empty password should show a "required" error');
    },
  },
  {
    id: 'passwords-match',
    run: async (t) => {
      await submitWith(t, { email: 'ada@example.com', password: 'secret123', confirm: 'secret124' });
      t.expect(hasError(t, 'confirm', 'mismatch'), 'Different passwords should show a "mismatch" error');
      t.expect(!t.text('#result').includes('Welcome'), 'An invalid form must not be submitted');
      await submitWith(t, { email: 'ada@example.com', password: 'secret123', confirm: 'secret123' });
      t.expect(!hasError(t, 'confirm', 'mismatch'), 'Equal passwords should be accepted');
      t.expectText('#result', 'Welcome, ada@example.com!');
    },
  },
];
