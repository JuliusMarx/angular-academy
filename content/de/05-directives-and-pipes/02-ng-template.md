---
title: Templates mit ng-template wiederverwenden
minutes: 9
quiz:
  - question: Was passiert mit dem Inhalt eines <ng-template>, wenn man nichts weiter tut?
    options:
      - Er wird ganz normal angezeigt
      - Er wird nicht angezeigt, bis ihn jemand rendert
      - Er wird als Kommentar angezeigt
      - Er wird nach einer Sekunde angezeigt
    answer: 1
  - question: Wie heißt der Kontext-Schlüssel, den let-item ohne Wert übernimmt?
    options: [item, $implicit, $default, value]
    answer: 1
  - question: Wie bekommt eine Komponente ein ng-template, das zwischen ihre Tags geschrieben wurde?
    options: ["viewChild(TemplateRef)", "contentChild(TemplateRef)", "input<TemplateRef>()", "inject(TemplateRef)"]
    answer: 1
    explanation: Inhalte zwischen den Tags sind projizierter Inhalt – dafür ist `contentChild()` zuständig.
---

# Templates mit ng-template wiederverwenden

Ein `<ng-template>` ist ein Stück Template, das **nicht sofort angezeigt** wird. Es ist eine Vorlage, die du später – einmal, mehrmals oder gar nicht – rendern kannst. Damit lassen sich Dinge lösen, die mit `<ng-content>` nicht gehen.

## Ein Template rendern

```html
<ng-template #badge>
  <span class="badge">neu</span>
</ng-template>

<ng-container *ngTemplateOutlet="badge" />
<ng-container *ngTemplateOutlet="badge" />
```

- `#badge` gibt dem Template einen Namen.
- `NgTemplateOutlet` rendert es an der gewünschten Stelle – hier zweimal.
- `<ng-container>` erzeugt selbst kein Element im DOM. Es ist nur ein Halter für die Direktive.

Importiere `NgTemplateOutlet` aus `@angular/common`, um es zu verwenden.

## Werte mitgeben: der Kontext

Templates können Variablen empfangen. Du übergibst sie als **Kontext**-Objekt und nimmst sie mit `let-` entgegen:

```html
<ng-template #badge let-text let-color="color">
  <span [style.background]="color">{{ text }}</span>
</ng-template>

<ng-container *ngTemplateOutlet="badge; context: { $implicit: 'neu', color: 'pink' }" />
```

- `let-text` ohne Wert bekommt `$implicit` – den „Standardwert“ des Kontexts.
- `let-color="color"` bekommt den Schlüssel `color`.

## Templates an Komponenten übergeben

Richtig mächtig wird das, wenn eine Komponente ihr Aussehen teilweise der Eltern-Komponente überlässt. Eine Liste kümmert sich um das Drumherum, die Eltern-Komponente bestimmt, wie eine Zeile aussieht:

```html
<app-item-list [items]="tasks()">
  <ng-template let-task let-i="index">
    {{ i + 1 }}. {{ task.title }}
  </ng-template>
</app-item-list>
```

Die Liste holt sich das Template mit `contentChild()` und rendert es für jeden Eintrag:

```ts
@Component({
  selector: 'app-item-list',
  imports: [NgTemplateOutlet],
  template: `
    @for (item of items(); track $index; let i = $index) {
      <ng-container *ngTemplateOutlet="rowTemplate() ?? defaultRow; context: { $implicit: item, index: i }" />
    }
    <ng-template #defaultRow let-item>{{ item }}</ng-template>
  `,
})
export class ItemList<T> {
  readonly items = input.required<T[]>();
  protected readonly rowTemplate = contentChild(TemplateRef);
}
```

Gibt die Eltern-Komponente kein Template mit, greift `defaultRow`.

::tryit{template-outlet}

## ng-content oder ng-template?

| Eigenschaft | `<ng-content>` | `<ng-template>` |
|---|---|---|
| Inhalt wird gerendert | genau einmal | so oft du willst – auch gar nicht |
| Bedingt anzeigen (`@if`) | nicht zuverlässig | ja |
| Daten von der Komponente zurückbekommen | nein | ja, über den Kontext |
| Aufwand | gering | etwas mehr |

> [!TIP]
> Fang mit `<ng-content>` an. Erst wenn du denselben Inhalt mehrfach oder mit Daten der Komponente brauchst, lohnt sich `<ng-template>`.
