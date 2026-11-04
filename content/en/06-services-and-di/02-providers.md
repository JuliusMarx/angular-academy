---
title: Providers and injection tokens
minutes: 10
summary: |-
  - A provider is a rule: "Whoever asks for *X* gets *Y*." You add it to `providers` in `app.config.ts`.
  - Provider kinds: `useClass`, `useValue`, `useFactory`, `useExisting` – and the shorthand `Y` for `{ provide: Y, useClass: Y }`.
  - For values without a class (strings, configuration objects) you create an `InjectionToken`. A `factory` provides a default value.
  - Abstract classes like `Logger` make good tokens: the component asks for the contract, the configuration decides the implementation.
  - If nobody provides something, the app doesn't start (`NG0201`). `inject(X, { optional: true })` then returns `null`.

  ```ts
  export const APP_SETTINGS = new InjectionToken<AppSettings>('APP_SETTINGS', {
    providedIn: 'root',
    factory: () => ({ appName: 'Default app', maxItems: 3 }),
  });

  providers: [
    { provide: Logger, useClass: MemoryLogger },
  ],
  ```
quiz:
  - question: "What does `{ provide: Logger, useClass: MemoryLogger }` do?"
    options:
      - Whoever asks for Logger gets an instance of MemoryLogger
      - MemoryLogger is renamed to Logger
      - Both classes are merged
      - Logger is only loaded if MemoryLogger is missing
    answer: 0
  - question: What do you need an InjectionToken for?
    options:
      - For classes with many methods
      - For values without their own class, such as strings or configuration objects
      - Only for HTTP requests
      - To make services faster
    answer: 1
  - question: "What does `inject(X, { optional: true })` return when nothing provides X?"
    options: ["`undefined`", "`null`", "An error", "An empty instance"]
    answer: 1
exercise:
  example: ex-providers
  title: Provide a logger and the app name
  task: |-
    The app asks for a `Logger` and the token `APP_NAME` – but nothing provides them. That's why it fails to start with the error `NG0201`.

    Add to `app.config.ts`:

    1. Whoever asks for `Logger` gets a `MemoryLogger` (`useClass`).
    2. The token `APP_NAME` has the value `My Shop` (`useValue`).
  checks:
    app-starts: The app starts without an error
    app-name: The heading shows **My Shop**
    memory-logger: After **Save**, **Saved** appears in the log
---

# Providers and injection tokens

With `providedIn: 'root'` a service provides itself. Often, though, you want to decide yourself **what** a component gets: a different implementation in a test, a configuration per environment, a value without its own class. That's what **providers** are for.

## Whoever asks gets …

A provider is a rule: "whoever asks for *X* gets *Y*". You add providers in `app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: Logger, useClass: MemoryLogger },
  ],
};
```

The component only asks for the contract – the configuration decides which implementation it gets:

```ts
export abstract class Logger {
  abstract log(message: string): void;
}

export class App {
  private readonly logger = inject(Logger); // gets a MemoryLogger
}
```

## Kinds of providers

| Provider | Meaning |
|---|---|
| `{ provide: X, useClass: Y }` | creates an instance of `Y` |
| `{ provide: X, useValue: value }` | hands out exactly this value |
| `{ provide: X, useFactory: () => … }` | calls the function and hands out its result |
| `{ provide: X, useExisting: Y }` | redirects to another provider – same instance |
| `Y` | shorthand for `{ provide: Y, useClass: Y }` |

## Injection tokens for values

For a string or a configuration object there is no class to ask for. Instead, you create an **`InjectionToken`** as the key:

```ts
import { InjectionToken } from '@angular/core';

export interface AppSettings {
  appName: string;
  maxItems: number;
}

export const APP_SETTINGS = new InjectionToken<AppSettings>('APP_SETTINGS', {
  providedIn: 'root',
  factory: () => ({ appName: 'Default app', maxItems: 3 }),
});
```

- The `factory` provides a default – so the token works without a provider, too.
- In `app.config.ts` you override it with `{ provide: APP_SETTINGS, useValue: { … } }`.

```ts
protected readonly settings = inject(APP_SETTINGS);
```

::tryit{di-providers}

## When nothing is provided

If a component asks for something nobody provides, the app doesn't start:

```bash
NG0201: No provider found for `Logger`.
```

If a dependency really is optional, say so explicitly – you then get `null` instead of an error:

```ts
protected readonly memory = inject(MemoryLogger, { optional: true });
```

> [!TIP]
> Abstract classes like `Logger` make good tokens: they describe what a logger must be able to do, and TypeScript checks that every implementation fits.
