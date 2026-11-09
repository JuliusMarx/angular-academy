---
title: Projektstart – Komponenten und Signals
minutes: 9
summary: |-
  - In diesem Kapitel baust du eine kleine Aufgaben-App in vier Schritten: Liste, Detailseite, Formular, Server. Jede Lektion setzt auf dem Stand der vorigen auf.
  - Zuerst das Datenmodell: ein `interface Task` mit `id`, `title`, `notes` und `done`.
  - Ein **Store-Service** (`providedIn: 'root'`) hält die Aufgaben in einem privaten `signal()` und gibt sie mit `asReadonly()` nach außen. Geändert wird nur über Methoden wie `toggle()`.
  - Abgeleitete Werte wie die Zahl offener Aufgaben sind `computed()` – im Store, wenn alle sie brauchen, in der Komponente, wenn nur sie sie braucht.
  - Kleine Komponenten bekommen Daten per `input()` und melden Aktionen per `output()`. Sie ändern den Store nicht selbst.
  - Signals nie verändern, sondern ersetzen: `update((tasks) => tasks.map(…))` erzeugt ein neues Array.

  ```ts
  @Injectable({ providedIn: 'root' })
  export class TaskStore {
    private readonly state = signal<Task[]>([]);
    readonly tasks = this.state.asReadonly();
    readonly openCount = computed(() => this.tasks().filter((t) => !t.done).length);
  }
  ```
quiz:
  - question: "Warum gibt der Store `this.state.asReadonly()` heraus statt das Signal `state` selbst?"
    options:
      - Weil schreibbare Signals in Templates nicht funktionieren
      - Damit Komponenten die Aufgaben lesen, aber nur über die Methoden des Stores ändern können
      - Weil `asReadonly()` schneller ist
      - Damit die Daten im `localStorage` landen
    answer: 1
    explanation: So gibt es genau einen Ort, an dem sich Aufgaben ändern. Fehler findest du schneller, und Regeln (z. B. neue ids) gelten überall.
  - question: "`toggle()` ändert `task.done = true` direkt im Array und ruft dann `state.set(tasks)` mit demselben Array auf. Was passiert?"
    options:
      - Alles wird korrekt aktualisiert
      - Angular wirft einen Fehler
      - Das Signal hält dasselbe Array wie vorher, gilt also als unverändert – abhängige `computed()` und die Ansicht aktualisieren sich nicht zuverlässig
      - Das Array wird automatisch kopiert
    answer: 2
    explanation: "Signals vergleichen standardmäßig mit `Object.is`. Erzeuge neue Objekte: `tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))`."
  - question: "Wo gehört der aktuelle Filter der Liste (Alle/Offen/Erledigt) hin?"
    options:
      - Als `signal()` in die Listen-Komponente, weil nur sie ihn braucht
      - In den Store, weil alle Daten in den Store gehören
      - In eine globale Variable
      - In ein `effect()`
    answer: 0
    explanation: Zustand, den nur eine Komponente braucht, bleibt dort. In den Store kommt, was mehrere Teile der App teilen.
  - question: "`TaskItem` soll melden, dass die Checkbox geklickt wurde. Wie?"
    options:
      - Es ruft `inject(TaskStore).toggle()` selbst auf
      - Es setzt `task().done` direkt
      - Es hat ein `output()` und die Elternkomponente entscheidet, was passiert
      - Über ein `@Input()`
    answer: 2
exercise:
  example: ex-project-filter
  title: Filter für die Liste
  task: |-
    Die Liste soll sich filtern lassen: alle Aufgaben, nur offene oder nur erledigte.

    1. Lege in `App` ein Signal `filter` an (Startwert `'all'`) und ein `computed()` `visible` mit den Aufgaben des Stores, die zum Filter passen.
    2. Erzeuge im `<div role="group">` für jeden Eintrag in `filters` einen `<button type="button">` mit seinem `label`. Ein Klick setzt den Filter, `aria-pressed` zeigt, ob er gerade aktiv ist.
    3. Lass die Liste über `visible()` laufen statt über alle Aufgaben.
  checks:
    filter-buttons: "Es gibt die Buttons **All**, **Open** und **Done**, anfangs ist nur **All** gedrückt (`aria-pressed`)"
    filter-lists: "**Open** zeigt nur offene, **Done** nur erledigte Aufgaben"
    filter-reacts: Eine unter **Open** abgehakte Aufgabe verschwindet sofort aus der Liste
---

# Projektstart – Komponenten und Signals

Du kennst jetzt alle wichtigen Bausteine. In diesem Kapitel setzt du sie zu **einer** App zusammen: einer kleinen Aufgabenliste. Sie wächst in vier Schritten:

| Lektion | Neu dazu |
|---|---|
| 1. Komponenten und Signals | Datenmodell, Store-Service, Liste, Filter |
| 2. Routing | Detailseite pro Aufgabe, Navigation |
| 3. Formulare | Aufgaben anlegen mit Signal Forms und Validierung |
| 4. HTTP und Tests | Daten vom Server, Schreiben per POST/PUT, Unit-Tests |

Jedes Beispiel startet mit dem Stand, mit dem das vorige aufgehört hat – inklusive der Lösung der Übung. Du kannst also jederzeit einsteigen.

## Das Datenmodell

Am Anfang steht die Frage: Welche Daten hat die App? Für eine Aufgabe reichen vier Felder:

```ts
export interface Task {
  id: number;
  title: string;
  notes: string;
  done: boolean;
}
```

Ein eigenes `interface` lohnt sich schon in kleinen Apps. TypeScript meldet dann Tippfehler wie `task.titel`, und jede Komponente spricht von denselben Feldern.

## Der Store

Die Aufgaben brauchen später mehrere Komponenten: die Liste, die Detailseite, das Formular und der Zähler im Kopf. Deshalb liegen sie in einem **Service**, nicht in einer Komponente. Weil er den Zustand der App „aufbewahrt“, heißt so ein Service oft **Store**:

```ts
@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly state = signal<Task[]>([ /* … */ ]);

  /** Read-only for components – changes go through the methods below. */
  readonly tasks = this.state.asReadonly();
  readonly openCount = computed(() => this.tasks().filter((t) => !t.done).length);

  toggle(id: number): void {
    this.state.update((tasks) => tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
}
```

Drei Entscheidungen stecken darin:

- **Privat schreiben, öffentlich lesen.** Das schreibbare Signal ist `private`. Nach außen geht mit `asReadonly()` eine Version ohne `set()` und `update()`. Ändern geht nur über Methoden wie `toggle()` – es gibt also genau eine Stelle, an der sich Aufgaben ändern.
- **Abgeleitetes ist `computed()`.** Die Zahl der offenen Aufgaben wird nicht gespeichert, sondern berechnet. So kann sie nie veralten.
- **Ersetzen statt verändern.** `update()` gibt ein **neues** Array mit einem **neuen** Objekt für die geänderte Aufgabe zurück. Änderst du `t.done` direkt, bleibt das Array dasselbe, und das Signal bemerkt nichts.

> [!TIP]
> `providedIn: 'root'` macht den Store zum Singleton: Alle Komponenten bekommen per `inject(TaskStore)` dieselbe Instanz. Ab Angular 22 kannst du dafür auch den kürzeren `@Service()`-Dekorator nehmen. Die Beispiele laufen auf Angular 21 und nutzen deshalb `@Injectable`.

## Komponenten

Die Liste zeigt jede Aufgabe mit einer kleinen Komponente `TaskItem`. Sie bekommt die Aufgabe per `input()` und meldet einen Klick per `output()`:

```ts
@Component({
  selector: 'app-task-item',
  template: `
    <label>
      <input type="checkbox" [checked]="task().done" (change)="toggled.emit()" />
      <span [class.done]="task().done">{{ task().title }}</span>
    </label>
  `,
})
export class TaskItem {
  readonly task = input.required<Task>();
  readonly toggled = output();
}
```

`TaskItem` kennt den Store nicht. Was bei einem Klick passiert, entscheidet die Elternkomponente:

```html
@for (task of store.tasks(); track task.id) {
  <li><app-task-item [task]="task" (toggled)="store.toggle(task.id)" /></li>
} @empty {
  <li>No tasks yet.</li>
}
```

Solche „dummen“ Komponenten lassen sich leicht wiederverwenden und testen, weil sie nur von ihren Inputs abhängen. `track task.id` sorgt dafür, dass Angular beim Abhaken nicht die ganze Liste neu aufbaut, sondern nur die eine Zeile aktualisiert.

::tryit{project-components}

Hake im Beispiel eine Aufgabe ab: Der Zähler „… of 3 open“ aktualisiert sich, obwohl `App` ihn nirgends neu berechnet. `openCount` hängt von `tasks` ab, und `tasks` hat sich geändert.

## Lokaler Zustand oder Store?

Nicht jeder Zustand gehört in den Store. Eine gute Faustregel:

| Zustand | Wohin? |
|---|---|
| Die Aufgaben selbst | Store – Liste, Detail und Formular brauchen sie |
| Zahl der offenen Aufgaben | `computed()` im Store – auch der Kopf zeigt sie |
| Gewählter Filter der Liste | `signal()` in der Listen-Komponente – nur sie braucht ihn |
| Ob ein Bereich aufgeklappt ist | `signal()` in der Komponente |

In der Übung baust du genau so einen Filter: ein lokales Signal plus ein `computed()`, das die Aufgaben des Stores filtert. Weil `computed()` von **beiden** abhängt, aktualisiert sich die Liste auch dann, wenn du unter „Open“ eine Aufgabe abhakst.

> [!NOTE]
> Die Filter-Buttons sind Umschalter. `aria-pressed="true"` sagt Screenreadern, welcher gerade aktiv ist, und `role="group"` mit `aria-label` fasst sie zu einer benannten Gruppe zusammen.
