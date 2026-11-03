---
title: Lazy Loading und Kind-Routen
minutes: 8
quiz:
  - question: Wann wird der Code einer Route mit `loadComponent` geladen?
    options:
      - Beim Start der App
      - Beim ersten Besuch der Route
      - Bei jedem Besuch erneut
      - Nur wenn man auf einen Button klickt
    answer: 1
  - question: Was ist der Unterschied zwischen `loadComponent` und `loadChildren`?
    options:
      - Es gibt keinen
      - loadComponent lädt eine Komponente, loadChildren eine ganze Gruppe von Routen
      - loadChildren funktioniert nur mit Modulen
      - loadComponent ist veraltet
    answer: 1
  - question: Wo erscheinen die Kind-Routen einer Route mit `children`?
    options:
      - Im router-outlet der App
      - Im router-outlet der Eltern-Komponente
      - In einem neuen Fenster
      - Gar nicht, man muss sie manuell anzeigen
    answer: 1
---

# Lazy Loading und Kind-Routen

Je mehr Seiten eine App hat, desto größer wird ihr JavaScript. Muss ein Besucher der Startseite wirklich den Code des Admin-Bereichs herunterladen? Mit **Lazy Loading** lädt Angular den Code einer Route erst, wenn sie zum ersten Mal besucht wird.

## Eine Komponente später laden

Statt `component` verwendest du `loadComponent` mit einem dynamischen `import()`:

```ts
const routes: Routes = [
  { path: '', component: Home }, // mit der App geladen
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin').then((m) => m.Admin), // erst bei /admin
  },
];
```

Die Angular CLI legt `admin.ts` dann in eine eigene JavaScript-Datei. Sie wird beim ersten Besuch von `/admin` geladen – und danach nicht noch einmal.

> [!TIP]
> Exportiert die Datei ihre Komponente als `export default`, reicht sogar `loadComponent: () => import('./admin/admin')`.

## Ganze Bereiche mit loadChildren

Hat ein Bereich mehrere Seiten, lädst du gleich seine Routen nach:

```ts
{ path: 'shop', loadChildren: () => import('./shop/shop.routes').then((m) => m.SHOP_ROUTES) }
```

```ts
// shop/shop.routes.ts – Pfade relativ zu /shop
export const SHOP_ROUTES: Routes = [
  {
    path: '',
    component: ShopLayout,
    children: [
      { path: '', component: ShopList },     // /shop
      { path: 'cart', component: ShopCart }, // /shop/cart
    ],
  },
];
```

## Kind-Routen und verschachtelte Outlets

Mit `children` zeigt eine Route ihre Unterseiten **in sich selbst** an. Die Eltern-Komponente – hier `ShopLayout` – bringt dafür ein eigenes `<router-outlet>` mit:

```html
<h1>Shop</h1>
<nav>
  <a routerLink=".">Produkte</a>
  <a routerLink="cart">Warenkorb</a>
</nav>
<router-outlet />  <!-- hier erscheint ShopList oder ShopCart -->
```

Links ohne führenden Schrägstrich (`cart`, `.`) sind **relativ** zur aktuellen Route – so funktioniert der Bereich auch, wenn er später unter einem anderen Pfad hängt.

::tryit{routing-lazy}

> [!NOTE]
> Öffne im Beispiel die Browser-Konsole: Beim ersten Klick auf Admin oder Shop erscheint jeweils eine Meldung, dass die Datei geladen wurde – beim zweiten Klick nicht mehr.
