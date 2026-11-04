---
title: What is Angular?
minutes: 5
quiz:
  - question: Which language does Angular use by default?
    options: [JavaScript, TypeScript, Dart, Python]
    answer: 1
    explanation: Angular projects are written in TypeScript, which adds type checking and great editor support.
  - question: Which command creates a new Angular project?
    options: [npm create angular, ng init, ng new my-project, angular start]
    answer: 2
    explanation: "`ng new` from the Angular CLI generates a complete, ready-to-run project."
---

# What is Angular?

**Angular** is a framework by Google for building modern web applications – from small apps to large enterprise systems. Unlike a pure UI library, Angular ships with everything you need for a complete application:

- **Components** to build the user interface
- **Signals** for reactive state
- **Router** to navigate between pages
- **Forms** with validation
- **HttpClient** to talk to servers
- **Dependency injection** for well-separated, testable code
- **Angular CLI** to generate, build and test projects

> [!NOTE]
> This course assumes you know the basics of JavaScript or TypeScript: variables, functions, classes, arrays and modules with `import`/`export`.

## Installing Angular

You need a current version of [Node.js](https://nodejs.org). Then create a new project with the Angular CLI:

```bash
npx @angular/cli@latest new my-project
cd my-project
npm start
```

Your app now runs at `http://localhost:4200`. Every change in the code shows up in the browser right away.

## Project structure

The most important files in a new project:

| File | Purpose |
|---|---|
| `src/main.ts` | Entry point: starts the application with `bootstrapApplication()` |
| `src/index.html` | The HTML page Angular renders the app into |
| `src/app/app.ts` | The root component of your app |
| `src/app/app.config.ts` | Global configuration (router, HTTP, …) |
| `src/styles.css` | Global styles (or `.scss`, depending on the project) |
| `angular.json` | Angular CLI configuration |

> [!TIP]
> You don't need to install Angular locally for this course. Every lesson with a **Try it yourself** button starts a real Angular project right in your browser.
