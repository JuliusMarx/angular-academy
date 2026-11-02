import { Check, TestKit } from './check-kit';

export const exercise = 'ex-hierarchy';

const score = (t: TestKit, team: string) => t.text(`#${team} .score`);
const buttonIn = (t: TestKit, team: string, label: string) => {
  const b = t.$$(`#${team} button`).find((el) => el.textContent?.trim() === label);
  t.expect(b, `No "${label}" button in #${team}`);
  return b!;
};

export const checks: Check[] = [
  {
    id: 'independent',
    run: async (t) => {
      await t.click(buttonIn(t, 'team-a', '+1'));
      t.expect(score(t, 'team-a') === '1', `Team A shows ${score(t, 'team-a')} instead of 1`);
      t.expect(score(t, 'team-b') === '0', `Team B shows ${score(t, 'team-b')} – it should not change`);
    },
  },
  {
    id: 'children-share-board',
    run: async (t) => {
      await t.click(buttonIn(t, 'team-b', '+1'));
      await t.click(buttonIn(t, 'team-b', '+1'));
      t.expect(score(t, 'team-b') === '2', `Team B shows ${score(t, 'team-b')} instead of 2`);
      t.expect(score(t, 'team-a') === '1', `Team A shows ${score(t, 'team-a')} instead of 1`);
    },
  },
  {
    id: 'separate-reset',
    run: async (t) => {
      await t.click(buttonIn(t, 'team-a', 'Reset'));
      t.expect(score(t, 'team-a') === '0', `Team A shows ${score(t, 'team-a')} after Reset`);
      t.expect(score(t, 'team-b') === '2', `Team B shows ${score(t, 'team-b')} – Reset in A should not touch B`);
    },
  },
];
