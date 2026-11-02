---
title: "Template-Variablen mit @let und #ref"
minutes: 7
quiz:
  - question: Wie deklarierst du eine lokale Variable im Template?
    options: ["let total = price();", "@let total = price();", "#total = price()", "{{ let total = price() }}"]
    answer: 1
    explanation: "`@let` deklariert eine schreibgeschützte Variable, die sich automatisch aktualisiert."
  - question: "Worauf zeigt die Variable #nameInput in <input #nameInput />?"
    options:
      - Auf den aktuellen Wert des Eingabefelds als String
      - Auf das DOM-Element des Eingabefelds
      - Auf ein Signal mit dem Wert
      - Auf die Komponente, die das Template enthält
    answer: 1
  - question: Kann man einer @let-Variable im Template einen neuen Wert zuweisen?
    options: ["Ja, mit =", "Ja, mit .set()", "Nein, @let-Variablen sind schreibgeschützt", "Nur innerhalb von @for"]
    answer: 2
---

# Template-Variablen mit @let und #ref

Manchmal brauchst du einen Wert im Template mehrfach oder möchtest auf ein Element direkt zugreifen. Dafür gibt es zwei Arten von Template-Variablen.

## @let – Werte im Template speichern

Mit `@let` speicherst du das Ergebnis eines Ausdrucks in einer Variable:

```html
@let total = totalPrice();
@let shipping = total >= 50 ? 0 : 4.9;

<p>Zwischensumme: {{ total }} €</p>
<p>Versand: {{ shipping }} €</p>
<p>Gesamt: {{ total + shipping }} €</p>
```

- Die Variable gilt ab ihrer Deklaration im aktuellen Template-Block und in allen verschachtelten Blöcken.
- Ändern sich die Werte im Ausdruck, aktualisiert Angular die Variable automatisch.
- `@let`-Variablen sind **schreibgeschützt**. Du kannst ihnen keinen neuen Wert zuweisen.

Besonders praktisch ist `@let`, um lange Ausdrücke abzukürzen:

```html
@let user = session().currentUser;
<h2>{{ user.firstName }} {{ user.lastName }}</h2>
<p>{{ user.email }}</p>
```

> [!TIP]
> Nutze `@let` für Werte, die nur das Template braucht. Ein Wert, der auch in der Klasse gebraucht wird, gehört als `computed()` in die Klasse.

## #ref – Template-Referenzvariablen

Mit `#name` gibst du einem Element im Template einen Namen. Danach kannst du an anderer Stelle im Template auf das Element zugreifen:

```html
<input #productInput placeholder="Produktname" />
<button (click)="add(productInput.value)">Hinzufügen</button>
```

Hier zeigt `productInput` auf das `<input>`-Element. Mit `productInput.value` liest du den Text, ohne dafür ein Event-Binding und ein eigenes Signal zu brauchen.

Steht `#ref` auf einer Komponente, zeigt die Variable auf die **Instanz der Komponente** statt auf das DOM-Element:

```html
<app-timer #timer />
<button (click)="timer.reset()">Zurücksetzen</button>
```

::tryit{template-variables}

> [!WARNING]
> Template-Referenzen funktionieren nur im Template. In der Klasse greifst du auf Elemente mit `viewChild()` zu – das lernst du im Kapitel über Komponenten-Kommunikation.
