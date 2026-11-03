---
title: SSR and hydration
minutes: 9
quiz:
  - question: What is the benefit of server-side rendering?
    options:
      - The app doesn't need JavaScript anymore
      - The browser gets finished HTML right away – visible sooner and good for search engines
      - The app only runs on the server
      - You no longer need components
    answer: 1
  - question: What happens during hydration?
    options:
      - Angular deletes the HTML from the server and renders everything again
      - Angular takes over the existing HTML in the browser and attaches events and state to it
      - The server sends the data again
      - The styles are loaded
    answer: 1
  - question: "Where can you safely access `window` or `localStorage`?"
    options:
      - In the constructor
      - In a field initializer
      - "In `afterNextRender()` – it only runs in the browser"
      - In `ngOnInit`
    answer: 2
    explanation: "Constructors, fields and `ngOnInit` also run on the server, where there is no `window`. `afterNextRender()` and `afterRenderEffect()` only run in the browser, after rendering."
exercise:
  example: ex-after-render
  title: Measuring a banner
  task: |-
    The component should show the banner's height. But the banner doesn't exist yet in the constructor, so it always shows 0.

    1. Measure the height after rendering with `this.banner().nativeElement.offsetHeight`, e.g. with `afterNextRender()`.
    2. Measure again when `large()` changes. `afterRenderEffect()` is a good fit for this, and it can cover task 1 as well.
  checks:
    measures-after-render: After rendering, the page shows the real height
    measures-again: After **Toggle size** the height is right again
---

# SSR and hydration

A plain Angular app first sends the browser an almost empty HTML page. The content only appears once the JavaScript has loaded. With **server-side rendering (SSR)**, Angular renders the page on the server already. The browser gets finished HTML and can show it right away.

## Three ways to render

| Kind | When is it rendered? | Fits |
|---|---|---|
| Client-side rendering | in the browser, after the JavaScript has loaded | apps behind a login |
| Server-side rendering | on the server, on every request | pages with current, individual data |
| Prerendering (SSG) | once, at build time | content that is the same for everyone |

This learning platform uses **prerendering**, by the way: every lesson was created as an HTML file at build time.

Create a new project with SSR using `ng new my-app --ssr`, or add it to an existing one with `ng add @angular/ssr`. You decide how each route is rendered in `app.routes.server.ts`:

```ts
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'account/**', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server },
];
```

## Hydration

The HTML from the server is display only at first: buttons don't react yet. Once the JavaScript has loaded, Angular **takes over** the existing HTML instead of rendering it again. It attaches events and state to the elements that are already there. This is called **hydration**. It is turned on with `provideClientHydration()`, which SSR projects already include.

**Incremental hydration** goes one step further. Parts of the page stay plain HTML until they are needed:

```html
@defer (hydrate on viewport) {
  <app-comments />
}
```

## Code that may only run in the browser

On the server there is no `window`, no `document`, no `localStorage` and no element sizes. But constructors, fields and `ngOnInit` run there too. Code that needs the browser therefore belongs in **`afterNextRender()`** or **`afterRenderEffect()`**: both only run in the browser, after rendering.

```ts
constructor() {
  // once, after the first render
  afterNextRender(() => {
    this.theme.set(localStorage.getItem('theme') ?? 'light');
  });

  // after every render in which a signal it reads has changed
  afterRenderEffect(() => {
    this.wide();
    this.width.set(this.box().nativeElement.offsetWidth);
  });
}
```

The second reason for these functions applies even without SSR: the component's elements only exist in the DOM **after** rendering. In the constructor you can neither find nor measure them.

::tryit{render-hooks}

> [!WARNING]
> Server and browser must produce the **same** HTML on the first render. If you show `Date.now()` or a random number directly in the template, the two differ and Angular warns about a *hydration mismatch*. Set such values in `afterNextRender()` instead.
