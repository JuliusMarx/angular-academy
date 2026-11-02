import { Check } from './check-kit';

export const exercise = 'ex-bindings';

export const checks: Check[] = [
  {
    id: 'greeting-updates',
    run: async (t) => {
      await t.type('#name', 'Ada');
      t.expectText('h1', 'Hello, Ada!');
    },
  },
  {
    id: 'clear-empties',
    run: async (t) => {
      await t.type('#name', 'Grace');
      await t.click('#clear');
      const input = t.$('#name') as HTMLInputElement;
      t.expect(input.value === '', `The input still contains "${input.value}"`);
      t.expect(!t.text('h1').includes('Grace'), 'The heading still shows the old name');
    },
  },
  {
    id: 'clear-disabled',
    run: async (t) => {
      await t.type('#name', '');
      const button = t.$('#clear') as HTMLButtonElement;
      t.expect(button.disabled, 'The button should be disabled while the name is empty');
      await t.type('#name', 'Alan');
      t.expect(!button.disabled, 'The button should be enabled once a name is entered');
    },
  },
];
