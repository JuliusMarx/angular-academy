---
title: Semantisches HTML
minutes: 9
summary: |-
  - Barrierefreie Apps funktionieren mit Tastatur, Screenreader, Sprachsteuerung und Zoom. Der Maßstab ist WCAG 2.2, Stufe AA.
  - Der Browser baut aus deinem HTML den **Accessibility-Baum**: Rolle, Name und Zustand jedes Elements. Screenreader lesen nur diesen Baum.
  - Native Elemente zuerst: `<button>` für Aktionen, `<a href>` bzw. `routerLink` für Navigation. Ein `<div (click)>` ist weder fokussierbar noch per Tastatur bedienbar.
  - Jedes Formularfeld braucht ein `<label>`. Ein Platzhalter ist kein Label.
  - Überschriften bilden eine Gliederung ohne Lücken. Landmarks wie `<header>`, `<nav>`, `<main>` und `<footer>` helfen beim Springen.
  - Bilder brauchen `alt`, dekorative Bilder `alt=""`.
  - Gibt es eine DOM-Eigenschaft, bindest du sie direkt (`[disabled]`). ARIA-Attribute bindest du mit `[attr.aria-…]`. `null` entfernt das Attribut.

  ```html
  <label for="email">E-Mail</label>
  <input id="email" type="email" />
  <button type="button" [disabled]="!email()" (click)="subscribe()">Anmelden</button>
  ```
quiz:
  - question: "Ein Button soll eine Aktion auslösen. Was ist die beste Lösung?"
    options:
      - "`<div (click)=\"save()\">Speichern</div>`"
      - "`<div role=\"button\" (click)=\"save()\">Speichern</div>`"
      - "`<button type=\"button\" (click)=\"save()\">Speichern</button>`"
      - "`<span tabindex=\"0\" (click)=\"save()\">Speichern</span>`"
    answer: 2
    explanation: "Ein natives `<button>` ist fokussierbar, reagiert auf Enter und Leertaste und hat die Rolle `button`. Alles andere musst du selbst nachbauen – und vergisst dabei leicht etwas."
  - question: Warum reicht ein Platzhalter (placeholder) nicht als Beschriftung eines Feldes?
    options:
      - Er verschwindet beim Tippen und wird nicht zuverlässig als Name des Feldes vorgelesen
      - Angular unterstützt keine Platzhalter
      - Platzhalter sind nur in Formularen mit `FormsModule` erlaubt
      - Er reicht, ein Label ist nur Dekoration
    answer: 0
  - question: "Wie setzt du in Angular das Attribut `aria-current` abhängig von einem Signal?"
    options:
      - "`[aria-current]` geht nicht, ARIA kann man nicht binden"
      - "`aria-current=\"{{ active() }}\"` ist die einzige Möglichkeit"
      - "`[ariaCurrentAttr]=\"active()\"`"
      - "`[attr.aria-current]=\"active() ? 'page' : null\"`"
    answer: 3
    explanation: "Mit `attr.` schreibt Angular ein HTML-Attribut. Ist der Wert `null`, entfernt Angular das Attribut wieder."
---

# Semantisches HTML

Barrierefreiheit (englisch *Accessibility*, kurz *a11y*) heißt: Alle können deine App benutzen. Auch Menschen, die nur die Tastatur verwenden, einen Screenreader hören, per Sprache steuern oder die Seite stark vergrößern. Das betrifft mehr Leute, als man denkt – und mit dem European Accessibility Act (in Deutschland: Barrierefreiheitsstärkungsgesetz) ist es seit Juni 2025 für viele Online-Shops und Dienste Pflicht.

Der Maßstab sind die **WCAG** (Web Content Accessibility Guidelines), aktuell Version 2.2. Üblich ist die Stufe **AA**.

## Der Accessibility-Baum

Aus deinem HTML baut der Browser neben dem DOM einen zweiten Baum: den **Accessibility-Baum**. Darin steht für jedes Element:

| Eigenschaft | Beispiel |
|---|---|
| Rolle | `button`, `link`, `heading`, `textbox` |
| Name | „Speichern“, „E-Mail“ |
| Zustand | deaktiviert, ausgeklappt, ausgewählt |

Screenreader lesen nur diesen Baum. Wie etwas aussieht, ist ihnen egal. Ein `<div>`, das per CSS wie ein Button aussieht, ist für sie nur Text.

> [!TIP]
> Den Baum siehst du in den Chrome DevTools: Elements → Tab **Accessibility**. In Firefox gibt es dafür ein eigenes Panel **Barrierefreiheit**.

## Native Elemente zuerst

Die wichtigste Regel: Nimm das HTML-Element, das genau das tut, was du brauchst.

```html
<!-- schlecht -->
<div class="button" (click)="save()">Speichern</div>

<!-- gut -->
<button type="button" (click)="save()">Speichern</button>
```

Das `<div>` bekommt keinen Fokus, reagiert nicht auf Enter oder Leertaste und hat keine Rolle. Das `<button>` kann das alles von selbst. Angular ruft `(click)` auch auf, wenn jemand den Button per Tastatur auslöst.

- **Aktion** auf der Seite (speichern, öffnen, löschen) → `<button type="button">`.
- **Navigation** zu einer anderen Seite → `<a href>` bzw. `<a routerLink>`.
- **Eingabe** → `<input>`, `<select>`, `<textarea>` mit Label.

> [!NOTE]
> Innerhalb eines `<form>` ist ein Button ohne `type` ein Absende-Button. Schreib `type="button"` dazu, wenn er nur etwas tun und nicht absenden soll.

## Labels für Formularfelder

Jedes Feld braucht einen sichtbaren Namen, der mit dem Feld verknüpft ist:

```html
<label for="email">E-Mail</label>
<input id="email" type="email" />

<!-- oder: das Feld steckt im Label -->
<label>
  <input type="checkbox" /> Newsletter abonnieren
</label>
```

Ein Klick auf das Label setzt dann auch den Fokus ins Feld. Ein `placeholder` ist kein Ersatz: Er verschwindet beim Tippen, hat oft zu wenig Kontrast und wird nicht zuverlässig als Name vorgelesen.

## Überschriften und Landmarks

Screenreader-Nutzer springen oft von Überschrift zu Überschrift. Die Überschriften sollten deshalb eine Gliederung bilden:

- Pro Seite eine `<h1>`, darunter `<h2>`, `<h3>` … ohne Stufen zu überspringen.
- Wähle die Stufe nach Struktur, nicht nach Schriftgröße. Die Größe regelst du mit CSS.

**Landmarks** teilen die Seite in Bereiche, zu denen man direkt springen kann:

```html
<header>…Logo, Suche…</header>
<nav aria-label="Hauptmenü">…Links…</nav>
<main>…Inhalt der Seite…</main>
<footer>…Impressum…</footer>
```

`<main>` gibt es einmal pro Seite. In einer Angular-App steht es meist in der `App`-Komponente um das `<router-outlet />`. Gibt es mehrere `<nav>`, unterscheide sie mit `aria-label`.

## Bilder

```html
<img [src]="product.image" [alt]="product.name" />
<img src="divider.svg" alt="" />
```

- Ein Bild mit Inhalt bekommt einen `alt`-Text, der beschreibt, was das Bild aussagt.
- Ein rein dekoratives Bild bekommt `alt=""`. Dann überspringt der Screenreader es. Fehlt `alt` ganz, liest er oft den Dateinamen vor.

## Bindings und Barrierefreiheit

Native Zustände setzt du mit einem Property-Binding. Der Browser meldet sie dann selbst weiter:

```html
<button type="button" [disabled]="saving()">Speichern</button>
<input type="checkbox" [checked]="done()" />
```

Ein deaktivierter Button ist nicht mehr fokussierbar, und der Screenreader sagt „nicht verfügbar“.

Für ARIA-Attribute gibt es meist keine passende DOM-Eigenschaft, die zuverlässig funktioniert. Du bindest sie als Attribut mit `attr.`:

```html
<a routerLink="/cart" [attr.aria-current]="active() ? 'page' : null">Warenkorb</a>
```

Ist der Wert `null` oder `undefined`, entfernt Angular das Attribut. Seit Angular 20.2 darfst du das `attr.` bei ARIA-Attributen auch weglassen: `[aria-current]="…"`. Hat eine Direktive auf dem Element ein Input mit diesem Namen, bekommt allerdings das Input den Wert. Mit `attr.` ist immer klar, dass ein Attribut gemeint ist.

> [!TIP]
> Für aktive Links gibt es schon eine fertige Lösung: `routerLinkActive="active" ariaCurrentWhenActive="page"` setzt `aria-current="page"` automatisch.

## Probier es aus

Im Beispiel gibt es dasselbe Formular zweimal. Klick in die Seite und drück mehrmals <kbd>Tab</kbd>: Der `<div>`-„Button“ wird übersprungen, der echte Button nicht.

::tryit{a11y-semantic}

> [!WARNING]
> `tabindex="0"` macht das `<div>` zwar fokussierbar, aber Enter und Leertaste tun immer noch nichts, und die Rolle fehlt. Du müsstest alles nachbauen, was `<button>` schon kann. Nimm gleich das native Element.
