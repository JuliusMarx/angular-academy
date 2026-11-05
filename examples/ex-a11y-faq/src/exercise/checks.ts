import { Check, TestKit } from './check-kit';

export const exercise = 'ex-a11y-faq';

function items(t: TestKit): HTMLElement[] {
  const all = t.$$('app-faq-item');
  t.expect(all.length === 3, `Expected 3 <app-faq-item>, found ${all.length}`);
  return all;
}

/** The question button of an FAQ item – fails if it is not a <button> directly inside the <h3>. */
function buttonOf(t: TestKit, item: HTMLElement, n: number): HTMLButtonElement {
  const button = item.querySelector<HTMLButtonElement>('h3 > button');
  t.expect(button, `Question ${n} is not a <button> directly inside the <h3>`);
  return button!;
}

function answerOf(t: TestKit, item: HTMLElement, n: number): HTMLElement {
  const answer = item.querySelector<HTMLElement>('.answer');
  t.expect(answer, `Question ${n} has no element with the class "answer"`);
  return answer!;
}

const expanded = (button: HTMLElement) => button.getAttribute('aria-expanded') ?? '(none)';

export const checks: Check[] = [
  {
    id: 'uses-button',
    run: (t) => {
      items(t).forEach((item, i) => {
        const button = buttonOf(t, item, i + 1);
        t.expect(button.type === 'button', `Button ${i + 1} needs type="button"`);
        t.expect(button.textContent?.trim(), `Button ${i + 1} shows no question`);
      });
    },
  },
  {
    id: 'expanded-state',
    run: async (t) => {
      const item = items(t)[0];
      const button = buttonOf(t, item, 1);
      const answer = answerOf(t, item, 1);
      t.expect(expanded(button) === 'false', `Closed: expected aria-expanded="false", found ${expanded(button)}`);
      t.expect(answer.hidden, 'The answer should be hidden at the start');
      await t.click(button);
      t.expect(expanded(button) === 'true', `Open: expected aria-expanded="true", found ${expanded(button)}`);
      t.expect(!answer.hidden, 'After a click the answer should be visible');
      await t.click(button);
      t.expect(expanded(button) === 'false', `After a second click: expected aria-expanded="false", found ${expanded(button)}`);
      t.expect(answer.hidden, 'After a second click the answer should be hidden again');
    },
  },
  {
    id: 'controls-panel',
    run: (t) => {
      const ids = items(t).map((item, i) => {
        const button = buttonOf(t, item, i + 1);
        const answer = answerOf(t, item, i + 1);
        const controls = button.getAttribute('aria-controls');
        t.expect(controls, `Button ${i + 1} has no aria-controls`);
        t.expect(answer.id === controls, `Button ${i + 1} has aria-controls="${controls}", but its answer has id="${answer.id}"`);
        t.expect(document.querySelectorAll(`[id="${controls}"]`).length === 1, `The id "${controls}" exists more than once`);
        return controls;
      });
      t.expect(new Set(ids).size === ids.length, `The answers share ids: ${ids.join(', ')}`);
    },
  },
];
