import { Check } from './check-kit';

export const exercise = 'ex-effect';

export const checks: Check[] = [
  {
    id: 'saves-draft',
    run: async (t) => {
      localStorage.removeItem('draft');
      await t.type('#draft', 'Hello Angular');
      await t.eventually(() => {
        const saved = localStorage.getItem('draft');
        t.expect(saved === 'Hello Angular', `localStorage "draft" is ${JSON.stringify(saved)}`);
      }, 1500);
    },
  },
  {
    id: 'saves-changes',
    run: async (t) => {
      await t.type('#draft', 'Second version');
      await t.eventually(() => {
        const saved = localStorage.getItem('draft');
        t.expect(saved === 'Second version', `localStorage "draft" is ${JSON.stringify(saved)}`);
      }, 1500);
    },
  },
];
