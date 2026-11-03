import { Check } from './check-kit';

export const exercise = 'ex-signal-form';

export const checks: Check[] = [
  {
    id: 'input-updates-model',
    run: async (t) => {
      await t.type('#name', 'Ada');
      await t.type('#city', 'London');
      t.expectText('#preview', 'Ada from London');
    },
  },
  {
    id: 'checkbox-updates-model',
    run: async (t) => {
      const box = t.$('#newsletter') as HTMLInputElement;
      if (box.checked) await t.click(box);
      await t.click(box);
      t.expectText('#preview', 'newsletter: yes');
    },
  },
  {
    id: 'model-updates-inputs',
    run: async (t) => {
      await t.click(t.button('Fill example'));
      t.expect((t.$('#name') as HTMLInputElement).value === 'Grace', 'The name field should show "Grace" after "Fill example"');
      t.expect((t.$('#newsletter') as HTMLInputElement).checked, 'The checkbox should be ticked after "Fill example"');
    },
  },
];
