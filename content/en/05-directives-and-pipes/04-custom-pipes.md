---
title: Writing custom pipes
minutes: 8
quiz:
  - question: Which method does a pipe have to implement?
    options: [format, transform, pipe, render]
    answer: 1
  - question: "How do you pass two parameters to a pipe named truncate?"
    options: ["truncate(30, '…')", "truncate: 30, '…'", "truncate: 30 : '…'", "truncate[30]['…']"]
    answer: 2
  - question: When does Angular call a regular (pure) pipe again?
    options:
      - On every change detection run
      - Only when the input value or a parameter changes
      - Only once at startup
      - Every second
    answer: 1
    explanation: For objects and arrays the reference counts – a pure pipe doesn't notice an array changed with `push()`.
---

# Writing custom pipes

The built-in pipes cover a lot, but not everything: shortening text, building initials, making file sizes readable. A custom pipe is quickly written – and much more readable in a template than a method call.

## A pipe with @Pipe

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }
}
```

- `name` is the name you use to call the pipe in a template.
- `transform()` receives the value before the `|` and returns the result.

```ts
@Component({
  imports: [InitialsPipe],
  template: `{{ 'Grace Brewster Hopper' | initials }}`, // GH
})
```

## Parameters

Further parameters of `transform()` are passed in the template with colons:

```ts
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, max = 30, suffix = '…'): string {
    if (value.length <= max) return value;
    const cut = value.slice(0, max);
    return cut.slice(0, cut.lastIndexOf(' ')) + suffix;
  }
}
```

```html
{{ text | truncate }}                 <!-- default: 30 characters -->
{{ text | truncate: 40 }}             <!-- 40 characters -->
{{ text | truncate: 40 : ' [more]' }} <!-- custom suffix -->
```

## Chaining pipes

The result of one pipe is the input of the next:

```html
{{ author | uppercase | truncate: 12 }}
```

::tryit{custom-pipes}

## Pure or not pure?

Regular pipes are **pure**: Angular only calls `transform()` again when the input value or a parameter changes. That makes pipes very efficient – much more so than a method call in the template, which runs on every change detection.

For objects and arrays, the **reference** is what counts:

```ts
this.items().push(item);                         // ❌ same reference – the pipe notices nothing
this.items.update((list) => [...list, item]);    // ✅ new array – the pipe recalculates
```

With `@Pipe({ name: 'x', pure: false })` a pipe runs on every change detection. You almost never need this – and it costs performance.

> [!TIP]
> If you're working with signals anyway, a `computed()` in the class is often the better choice than a pipe. Pipes pay off mainly for formatting you need in many components.
