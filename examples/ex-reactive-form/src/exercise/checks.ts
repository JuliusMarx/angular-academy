import { Check } from './check-kit';

export const exercise = 'ex-reactive-form';

const submitButton = (t: Parameters<Check['run']>[0]) => t.button('Log in') as HTMLButtonElement;

export const checks: Check[] = [
  {
    id: 'disabled-when-empty',
    run: (t) => {
      t.expect(submitButton(t).disabled, 'The button should be disabled while the form is empty');
    },
  },
  {
    id: 'validators',
    run: async (t) => {
      await t.type('#email', 'not-an-email');
      await t.type('#password', 'secret12');
      t.expect(submitButton(t).disabled, 'An invalid email should keep the button disabled');
      await t.type('#email', 'ada@example.com');
      await t.type('#password', '123');
      t.expect(submitButton(t).disabled, 'A password with fewer than 6 characters should keep the button disabled');
      await t.type('#password', 'secret12');
      t.expect(!submitButton(t).disabled, 'A valid form should enable the button');
    },
  },
  {
    id: 'submit-and-reset',
    run: async (t) => {
      await t.type('#email', 'ada@example.com');
      await t.type('#password', 'secret12');
      // Without [formGroup] the browser would submit natively and reload the page.
      t.expect(t.$('form').classList.contains('ng-valid'), 'Connect the <form> to your FormGroup with [formGroup]');
      await t.click(submitButton(t));
      t.expectText('#result', 'Logged in as ada@example.com');
      t.expect((t.$('#email') as HTMLInputElement).value === '', 'The form should be reset after logging in');
    },
  },
];
