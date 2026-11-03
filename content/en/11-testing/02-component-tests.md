---
title: Testing components
minutes: 9
quiz:
  - question: "What does `TestBed.createComponent(Counter)` return?"
    options:
      - The component's HTML as a string
      - A `ComponentFixture` with the instance and the rendered element
      - Only the class instance
      - A screenshot
    answer: 1
  - question: Why is there an `await fixture.whenStable()` after a click?
    options:
      - So the click arrives
      - So Angular updates the DOM before the test checks it
      - Because tests always have to be async
      - To catch errors
    answer: 1
  - question: How do you set a component input in a test?
    options:
      - "`fixture.componentInstance.max = 3`"
      - "`fixture.componentRef.setInput('max', 3)`"
      - "`fixture.nativeElement.max = 3`"
      - You can't
    answer: 1
    explanation: "Signal inputs are read-only from the outside. `setInput()` sets the input the way a parent template would."
exercise:
  example: ex-test-component
  title: Tests for a star rating
  task: |-
    Write tests for the `Rating` component in `rating.spec.ts`:

    1. With `setInput('value', 3)` the label shows “3 / 5”.
    2. Clicking star 4 changes the label to “4 / 5”.
    3. Clicking star 2 emits 2 through `rated`.

    Here too, your tests also run against broken versions of the component.
  checks:
    tests-pass: Your tests pass against the real component
    catches-input-bug: A test notices when the input is ignored
    catches-click-bug: A test notices when a click doesn't change the label
    catches-emit-bug: A test notices when `rated` is never emitted
---

# Testing components

For a component you want to know: does it show the right thing, and does it react correctly to the user? For that, `TestBed` really renders the component, and the test operates it like a user would.

## The fixture

`TestBed.createComponent()` creates the component and returns a **fixture**:

```ts
let fixture: ComponentFixture<Counter>;
let element: HTMLElement;

beforeEach(async () => {
  fixture = TestBed.createComponent(Counter);
  element = fixture.nativeElement; // the rendered <app-counter>
  await fixture.whenStable();      // wait until Angular has rendered
});
```

| Property | Contains |
|---|---|
| `fixture.nativeElement` | the component's DOM element |
| `fixture.componentInstance` | the class instance |
| `fixture.componentRef` | access from the outside, e.g. `setInput()` |

## Checking the DOM

Test what the **user sees**, not the inner fields of the class. That way your tests stay valid even when you restructure the component internally:

```ts
it('starts at 0', () => {
  expect(element.querySelector('output')?.textContent).toBe('0');
});
```

## Interacting and waiting

Clicking a button runs the event handler, but Angular only updates the DOM afterwards. So you wait with `whenStable()` before checking:

```ts
it('counts up on click', async () => {
  button('+').click();
  await fixture.whenStable();
  expect(element.querySelector('output')?.textContent).toBe('1');
});
```

> [!WARNING]
> Without `await fixture.whenStable()` you still see the old DOM, and the test fails even though the component works correctly. This is one of the most common mistakes in component tests.

## Inputs and outputs

Set inputs with `setInput()`, the way a parent template would:

```ts
fixture.componentRef.setInput('max', 2);
await fixture.whenStable();
```

An output can be subscribed to from the outside. A mock function lets you check what was emitted:

```ts
const changed = vi.fn();
fixture.componentInstance.changed.subscribe(changed);
button('+').click();
expect(changed).toHaveBeenCalledWith(1);
```

::tryit{testing-components}

> [!TIP]
> Find elements the way a user finds them: by their text or their `aria-label`. A test that looks for `button('+')` also checks that the button has a meaningful label. A test using `querySelectorAll('button')[1]` breaks as soon as the order changes.
