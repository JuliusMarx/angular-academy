---
title: The Angular CLI
minutes: 6
summary: |-
  - All CLI commands start with `ng`: `ng new`, `ng serve`, `ng generate`, `ng build`, `ng test`, `ng add`, `ng update`.
  - `ng serve` (or `npm start`) starts the development server with automatic reloading.
  - `ng g c user-card` creates a component with `.ts`, `.html`, `.css` and `.spec.ts`; `--dry-run` shows what would be generated first.
  - Services, directives, pipes and guards work the same way (`ng g service`, `ng g directive`, …).
  - `ng build` builds an optimized production version into the `dist/` folder.
  - `ng update` updates Angular and adapts your code with migrations.

  ```bash
  ng g c user-card --dry-run
  ng build
  ng update @angular/core @angular/cli
  ```

  > [!TIP] Always update one major version at a time, e.g. from 21 to 22.
quiz:
  - question: Which command generates a new component named user-card?
    options: [ng new user-card, ng generate component user-card, ng create user-card, ng add user-card]
    answer: 1
    explanation: "`ng generate component` – `ng g c` for short – creates the TypeScript file, template, styles and test."
  - question: What is ng serve for?
    options:
      - It builds the app for production
      - It starts a development server with automatic reloading
      - It publishes the app to the internet
      - It runs the tests
    answer: 1
  - question: What does ng update do?
    options:
      - It updates Angular packages and migrates your code automatically
      - It reloads the page in the browser
      - It only updates package.json
      - It installs the latest Node.js version
    answer: 0
    explanation: "`ng update` runs migrations that adapt your code to new versions."
---

# The Angular CLI

The **Angular CLI** (command line interface) is your most important everyday tool. You use it to create projects, generate code, start the development server and build the app for production. All commands start with `ng`.

## The most important commands

| Command | Short form | What it does |
|---|---|---|
| `ng new <name>` | | Create a new project |
| `ng serve` | `npm start` | Start the development server (with automatic reloading) |
| `ng generate component <name>` | `ng g c <name>` | Generate a new component |
| `ng build` | | Build the app for production (`dist/` folder) |
| `ng test` | | Run unit tests |
| `ng add <package>` | | Install and set up a library |
| `ng update` | | Update Angular to a new version |

## Generating code with ng generate

Instead of creating files by hand, let the CLI generate them:

```bash
ng generate component user-card
```

The CLI creates a folder with four files:

```bash
src/app/user-card/
  user-card.ts        # class with @Component
  user-card.html      # template
  user-card.css       # styles (or .scss, depending on the project)
  user-card.spec.ts   # unit test
```

The same works for other building blocks you'll meet later:

```bash
ng g service auth       # service
ng g directive tooltip  # directive
ng g pipe currency-eur  # pipe
ng g guard admin        # router guard
```

> [!TIP]
> With `--dry-run` you see which files would be generated without writing anything: `ng g c user-card --dry-run`.

## Building for production

```bash
ng build
```

The result ends up in the `dist/` folder. The CLI optimizes automatically: it removes unused code, minifies the files and splits the app into small bundles that are loaded on demand. You can upload the contents of `dist/` to any web server.

## Keeping Angular up to date

Angular releases a new major version about every six months. Update your project with `ng update`:

```bash
ng update @angular/core @angular/cli
```

This runs automatic **migrations** that adapt your code to changes.

> [!NOTE]
> Always update one major version at a time, e.g. from 21 to 22. The update guide at [angular.dev/update-guide](https://angular.dev/update-guide) shows you the individual steps.
