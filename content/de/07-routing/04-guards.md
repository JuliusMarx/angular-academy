---
title: Guards und Resolver
minutes: 9
summary: |-
  - Ein Guard ist eine Funktion (`CanActivateFn`): `true` lässt die Navigation weiter, ein `UrlTree` leitet um, `false` bricht nur ab.
  - Angular ruft Guards in einem Injection Context auf, deshalb funktioniert `inject()`.
  - Du hängst den Guard mit `canActivate: [authGuard]` an die Route. Weitere Arten: `canActivateChild`, `canDeactivate`, `canMatch`.
  - Ein Resolver (`ResolveFn`) lädt Daten, bevor die Route aktiviert wird. Mit `withComponentInputBinding()` kommt das Ergebnis als Input unter dem Namen aus `resolve` an.
  - Während ein Resolver lädt, bleibt die alte Seite stehen – bei langem Laden ist `resource()` in der Komponente oft besser.

  ```ts
  export const authGuard: CanActivateFn = (_route, state) => {
    if (inject(AuthService).loggedIn()) return true;
    return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  };
  ```

  > [!WARNING] Ein Guard schützt nur die Oberfläche. Echte Zugriffsrechte muss immer der Server prüfen.
quiz:
  - question: Was kann ein `CanActivateFn`-Guard zurückgeben, um umzuleiten?
    options: ["false", "Einen UrlTree", "Einen String mit der URL", "null"]
    answer: 1
    explanation: "`false` bricht die Navigation nur ab. Ein `UrlTree` leitet stattdessen auf eine andere Seite um."
  - question: Warum funktioniert `inject()` in einem Guard?
    options:
      - Guards sind Komponenten
      - Angular ruft Guards in einem Injection Context auf
      - inject() funktioniert überall
      - Weil der Guard in app.config.ts steht
    answer: 1
  - question: Was macht ein Resolver?
    options:
      - Er prüft, ob der Nutzer angemeldet ist
      - Er lädt Daten, bevor die Route aktiviert wird
      - Er löst Merge-Konflikte
      - Er übersetzt URLs
    answer: 1
exercise:
  example: ex-guard
  title: Den Admin-Bereich schützen
  task: |-
    Die Seite `/admin` ist für alle erreichbar. Das soll sich ändern.

    1. Schreibe in `auth.ts` einen Guard `authGuard` (`CanActivateFn`): Angemeldete Nutzer dürfen weiter, alle anderen werden auf `/login` umgeleitet.
    2. Schütze die Route `admin` in `app.config.ts` mit `canActivate: [authGuard]`.
  checks:
    redirects-when-logged-out: Abgemeldet führt `/admin` zu `/login`
    admin-after-login: Nach **Log in** öffnet sich `/admin`
    other-pages-open: Die Startseite bleibt für alle erreichbar
---

# Guards und Resolver

Nicht jede Seite soll für jeden erreichbar sein, und manche brauchen Daten, bevor sie überhaupt etwas anzeigen können. Dafür kann der Router vor dem Seitenwechsel Code ausführen: **Guards** entscheiden, *ob* navigiert wird, **Resolver** laden, *was* die Seite braucht.

## Ein Guard

Ein Guard ist eine Funktion. Gibt sie `true` zurück, geht die Navigation weiter. Gibt sie einen `UrlTree` zurück, leitet der Router dorthin um:

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).loggedIn()) return true;
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
```

- Angular ruft Guards in einem **Injection Context** auf – deshalb funktioniert `inject()`.
- `state.url` ist die URL, die der Nutzer aufrufen wollte. Als `returnUrl` mitgegeben, kann die Login-Seite ihn danach dorthin zurückschicken.

Den Guard hängst du an die Route:

```ts
{ path: 'account', component: Account, canActivate: [authGuard] }
```

> [!WARNING]
> Ein Guard schützt nur die **Oberfläche**. Wer die API direkt aufruft, umgeht ihn. Echte Zugriffsrechte muss immer der Server prüfen.

## Weitere Guard-Arten

| Guard | Wird gefragt … |
|---|---|
| `canActivate` | bevor eine Route betreten wird |
| `canActivateChild` | bevor eine ihrer Kind-Routen betreten wird |
| `canDeactivate` | bevor eine Route verlassen wird – etwa bei ungespeicherten Änderungen |
| `canMatch` | ob eine Route überhaupt passen darf (z. B. Admin-Version einer Seite) |

## Ein Resolver

Ein Resolver lädt Daten, **bevor** die Route aktiviert wird. Die Seite zeigt sich erst, wenn die Daten da sind – ein „Lädt …“-Zustand in der Komponente entfällt:

```ts
export const profileResolver: ResolveFn<Profile> = () => inject(ProfileService).load();
```

```ts
{
  path: 'account',
  component: Account,
  canActivate: [authGuard],
  resolve: { profile: profileResolver },
}
```

Mit `withComponentInputBinding()` kommt das Ergebnis als Input an – unter dem Namen aus `resolve`:

```ts
export class Account {
  readonly profile = input.required<Profile>();
}
```

::tryit{routing-guards}

> [!TIP]
> Während ein Resolver lädt, bleibt die **alte** Seite stehen. Dauert das Laden spürbar, ist `resource()` in der Komponente oft die bessere Wahl: Die neue Seite erscheint sofort und zeigt selbst an, dass sie lädt.
