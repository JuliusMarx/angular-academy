---
title: Focus management
minutes: 10
summary: |-
  - Everything you can do with the mouse must also work with the keyboard: <kbd>Tab</kbd>, <kbd>Shift</kbd>+<kbd>Tab</kbd>, Enter, Space, Escape.
  - The focus must always be visible. Never remove `outline` without a replacement, use `:focus-visible`.
  - `tabindex="0"` adds an element to the tab order, `tabindex="-1"` makes it focusable only via `focus()`. Avoid positive values.
  - After a route change the focus gets stuck somewhere. Set it to the heading or `<main>` on `NavigationEnd` and give every route a `title`.
  - A native `<dialog>` opened with `showModal()` moves the focus into the dialog, makes the rest of the page inert, closes on Escape and returns the focus when it closes.
  - For your own overlays, `@angular/cdk/a11y` helps: `cdkTrapFocus` keeps the focus inside a region, `FocusMonitor` reports whether focus came from mouse, keyboard or code.

  ```ts
  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  open(): void {
    this.dialog().nativeElement.showModal();
  }
  ```
quiz:
  - question: "What does `tabindex=\"-1\"` do on a heading?"
    options:
      - It can be focused with `focus()`, but is not in the tab order
      - It is the first element reached with Tab
      - It is hidden from screen readers
      - It becomes a button
    answer: 0
  - question: "What happens when a `<dialog>` that was opened with `showModal()` closes?"
    options:
      - The focus jumps to the top of the page
      - The focus stays in the invisible dialog
      - The browser moves the focus back to the element that had it before, usually the button that opened it
      - The page reloads
    answer: 2
  - question: Why should you set the focus after a route change?
    options:
      - So Angular loads the page faster
      - Because a single-page app doesn't reload the page – without your own focus handling, keyboard and screen reader users hardly notice the change
      - Because the router throws an error otherwise
      - It's not necessary, the browser always does that by itself
    answer: 1
---

# Focus management

Keyboard users move from element to element with <kbd>Tab</kbd>. The element with the **focus** receives the keys. The browser does most of the work for you – as long as you use native elements. It gets tricky when the page changes without reloading: on route changes, in dialogs and when elements are deleted.

## Keyboard basics

| Key | Expectation |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | to the next / previous interactive element |
| <kbd>Enter</kbd> | follow a link, trigger a button |
| <kbd>Space</kbd> | trigger a button, toggle a checkbox |
| <kbd>Escape</kbd> | close a dialog or menu |
| Arrow keys | inside widgets like tabs, menus, radio groups |

Test your app without a mouse regularly. Can you get everywhere? Can you always see where the focus is?

## Keep the focus visible

Browsers draw a focus ring. Never remove it without a replacement:

```css
/* bad */
button:focus {
  outline: none;
}

/* good: your own ring, only for keyboard use */
button:focus-visible {
  outline: 3px solid #1a73e8;
  outline-offset: 2px;
}
```

`:focus-visible` applies when the browser thinks a focus ring is useful – yes for the keyboard, usually not for a mouse click on a button.

## tabindex

| Value | Effect |
|---|---|
| `tabindex="0"` | the element joins the normal tab order |
| `tabindex="-1"` | not reachable with Tab, but focusable with `element.focus()` |
| `tabindex="1"` and higher | jumps ahead of everything else – avoid it, it messes up the order |

You need `tabindex="-1"` to move the focus to something that normally can't be focused, like a heading.

## Focus after a route change

On a classic website every link loads a new page, and the screen reader starts at the top. An Angular app only swaps the content in the `<router-outlet>`. The focus stays on the clicked link, and people who can't see the screen hardly notice the change.

So move the focus to the main content after every navigation:

```ts
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <nav>…</nav>
    <main #main tabindex="-1">
      <router-outlet />
    </main>
  `,
})
export class App {
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.main().nativeElement.focus());
  }
}
```

Where exactly the focus should go depends on your layout: on `<main>` or on the `<h1>` of the new page (then with `tabindex="-1"`). What matters is that it doesn't fall back to `<body>` or stay on the old link.

Also give every route a `title`. The router sets it as the page title. This keeps tabs and history apart, and screen reader users can query it at any time to find out where they are. Screen readers usually don't announce a new title on their own after navigation in a single-page app, which is why you also need to move focus:

```ts
export const routes: Routes = [
  { path: 'cart', component: Cart, title: 'Cart' },
];
```

## Dialogs with `<dialog>`

A modal dialog has a lot to do: move the focus in, keep it inside, close on Escape, then return the focus. The native `<dialog>` element does all of that when you open it with `showModal()`:

```ts
@Component({
  selector: 'app-root',
  template: `
    <button type="button" (click)="dialog.showModal()">Delete account …</button>

    <dialog #dialog aria-labelledby="dialog-title" (close)="result.set(dialog.returnValue)">
      <h2 id="dialog-title">Delete account?</h2>
      <form method="dialog">
        <button value="cancel" autofocus>Cancel</button>
        <button value="delete">Delete</button>
      </form>
    </dialog>
  `,
})
export class App {
  protected readonly result = signal('');
}
```

- `showModal()` moves the focus to the first focusable element or to the one with `autofocus`.
- The rest of the page becomes **inert**: not clickable, not focusable, invisible to screen readers.
- <kbd>Escape</kbd> closes the dialog.
- A button inside `<form method="dialog">` closes it, and its `value` ends up in `returnValue`.
- When the dialog closes, the browser moves the focus back to the element that had it before.

> [!TIP]
> For a dangerous action, put `autofocus` on the harmless button (here "Cancel"). An accidental Enter then deletes nothing.

## Focus after deleting

When someone deletes an entry, the button with the focus disappears. The focus then falls back to `<body>`, and keyboard users have to start over. Move it to a sensible target, for example the list's heading:

```ts
protected remove(item: Item): void {
  this.items.update((items) => items.filter((i) => i !== item));
  this.heading().nativeElement.focus(); // <h2 #heading tabindex="-1">
}
```

::tryit{a11y-focus}

## The CDK: `@angular/cdk/a11y`

For your own overlays, menus and lists, the Angular CDK has ready-made building blocks. Install it with `npm install @angular/cdk`.

**FocusTrap** keeps the focus inside a region for <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd>:

```ts
import { CdkTrapFocus } from '@angular/cdk/a11y';

@Component({
  imports: [CdkTrapFocus],
  template: `
    <div class="panel" cdkTrapFocus cdkTrapFocusAutoCapture>
      <input cdkFocusInitial />
      <button type="button" (click)="close()">Done</button>
    </div>
  `,
})
export class Panel {}
```

`cdkTrapFocusAutoCapture` moves the focus into the region when it appears (to `cdkFocusInitial`, if present) and returns it when the region goes away. The directive doesn't prevent mouse clicks outside.

**FocusMonitor** reports how an element got the focus: `'keyboard'`, `'mouse'`, `'touch'`, `'program'` or `null` when it is lost. It also sets classes like `cdk-keyboard-focused`.

```ts
const origin$ = inject(FocusMonitor).monitor(element); // later: stopMonitoring(element)
```

> [!NOTE]
> For dialogs the CDK also has `Dialog` from `@angular/cdk/dialog`, and Angular Material has `MatDialog`. Both take care of the focus trap, Escape and returning the focus. For simple cases the native `<dialog>` is enough.
