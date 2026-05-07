---
title: "Übungen"
description: "Eigene Hands-on-Übungen zum CI/CD-Block in zwei Schwierigkeitsgraden."
---

# Übungen: CI/CD mit GitHub Actions

Die Übungen bauen auf dem **Repo aus der [Praxis](praxis-erste-pipeline.md)** auf (`mein-erster-workflow`). Jede Übung legt eine neue Workflow-Datei unter `.github/workflows/` an, sodass dein Hello-World-Workflow daneben weiterläuft.

!!! abstract "Die zwei Stufen"
    - 🟢 **Einsteiger**: jeder Schritt bis ins Detail
    - 🟡 **Mittel**: weniger Hand-Holding

## Voraussetzung für alle Übungen

- Du hast die [Praxis-Übung](praxis-erste-pipeline.md) durchgespielt.
- Dein Repo `mein-erster-workflow` ist auf GitHub und mindestens ein Lauf war grün.
- Du kannst den **Actions-Tab** öffnen und Logs lesen.

---

## 🟢 Einsteiger

### Übung 6.1: Bedingte Steps mit `if:`

!!! info "Was du lernst"
    - einen Step nur unter bestimmten Bedingungen ausführen
    - Kontextvariablen wie `github.event_name` und `github.ref` nutzen
    - das Verhalten bei Push und manueller Auslösung unterscheiden

#### Aufgabe

Lege die Datei `.github/workflows/bedingungen.yml` an mit folgenden Anforderungen:

1. Trigger: `push` und `workflow_dispatch`.
2. Ein Job `info` auf `ubuntu-latest`.
3. Steps:
    - **Immer**: ein `echo` mit dem Auslöser (`Push` oder `Manuell`).
    - **Nur bei Push**: ein `echo` mit dem Branch-Namen.
    - **Nur bei manueller Auslösung**: ein `echo` mit „Du hast den Knopf gedrückt".

#### Hinweise

- Der Auslöser steht in `${{ github.event_name }}` und ist `push` oder `workflow_dispatch`.
- Der Branch-Name steht in `${{ github.ref_name }}`.
- `if:` direkt unter dem Step-Namen entscheidet, ob der Step läuft.

??? success "Musterlösung"
    ```yaml
    name: Bedingungen

    on:
      push:
      workflow_dispatch:

    jobs:
      info:
        runs-on: ubuntu-latest
        steps:
          - name: Auslöser anzeigen
            run: echo "Auslöser= ${{ github.event_name }}"

          - name: Nur bei Push
            if: github.event_name == 'push'
            run: echo "Branch ist ${{ github.ref_name }}"

          - name: Nur bei manueller Auslösung
            if: github.event_name == 'workflow_dispatch'
            run: echo "Du hast den Knopf gedrückt"
    ```

    Push erzeugt zwei Log-Zeilen, Klick auf **Run workflow** ebenfalls zwei, jeweils nur die passenden.

---

### Übung 6.2: Zwei Jobs mit Abhängigkeit

!!! info "Was du lernst"
    - mehrere Jobs in einem Workflow definieren
    - mit `needs:` eine Reihenfolge erzwingen
    - dass jeder Job auf einer **eigenen frischen** Runner-VM läuft

#### Aufgabe

Lege die Datei `.github/workflows/zwei-jobs.yml` an:

1. Trigger: `push` und `workflow_dispatch`.
2. Job `vorbereiten`: gibt eine Begrüßung aus.
3. Job `arbeiten`: läuft **erst nach** `vorbereiten` und gibt eine zweite Meldung aus.

Wichtig: nach dem ersten Push siehst du im Actions-Tab, dass `arbeiten` erst startet, wenn `vorbereiten` grün ist.

#### Hinweise

- `needs: vorbereiten` direkt unter `runs-on:` reicht.
- Beide Jobs laufen auf `ubuntu-latest`.

??? success "Musterlösung"
    ```yaml
    name: Zwei Jobs

    on:
      push:
      workflow_dispatch:

    jobs:
      vorbereiten:
        runs-on: ubuntu-latest
        steps:
          - run: echo "Job 1: Vorbereitung läuft"

      arbeiten:
        runs-on: ubuntu-latest
        needs: vorbereiten
        steps:
          - run: echo "Job 2: Arbeit beginnt jetzt"
    ```

    !!! warning "Jobs teilen keine Dateien"
        Jeder Job startet auf einer **frischen** VM. Wenn `vorbereiten` eine Datei erzeugt, ist sie in `arbeiten` nicht da. Um Dateien weiterzugeben, gibt es `actions/upload-artifact` und `actions/download-artifact`. Mehr dazu im [Cheatsheet](../cheatsheets/github-actions.md#artefakte-zwischen-jobs).

---

## 🟡 Mittel

### Übung 6.3: Code aus dem Repo nutzen

!!! info "Was du lernst"
    - die wichtigste Action überhaupt: `actions/checkout`
    - Dateien aus dem Repo im Workflow verwenden
    - dass der Runner den Code **nicht** automatisch kennt

#### Szenario

Bisher hat unser Workflow nur Befehle ausgeführt. Wenn du auf den **Code im Repo** zugreifen willst, musst du ihn zuerst auf den Runner holen. Das macht die Action `actions/checkout`.

#### Aufgabe

1. Lege im Repo-Root eine Datei `hallo.txt` an mit dem Inhalt `Hallo aus dem Repo`. Im Editor erstellen, speichern, dann committen und pushen:

    ```bash
    git add hallo.txt
    git commit -m "Test-Datei"
    git push
    ```

2. Lege `.github/workflows/checkout-test.yml` an, der:
    - bei Push und manuell läuft
    - **ohne** Checkout versucht, `cat hallo.txt` zu lesen (das soll fehlschlagen)
    - **mit** Checkout danach `cat hallo.txt` erfolgreich liest

Tipp: setze `continue-on-error: true` am ersten `cat`-Step, damit der Workflow nicht abbricht und du beide Steps im Log sehen kannst.

??? success "Musterlösung"
    ```yaml
    name: Checkout-Test

    on:
      push:
      workflow_dispatch:

    jobs:
      checkout-vergleich:
        runs-on: ubuntu-latest
        steps:
          - name: Ohne Checkout, sollte scheitern
            continue-on-error: true
            run: cat hallo.txt

          - name: Code holen
            uses: actions/checkout@v4

          - name: Mit Checkout, funktioniert
            run: cat hallo.txt
    ```

    Im Log:

    - Step 1 zeigt `cat: hallo.txt: No such file or directory`. Trotzdem grün, weil `continue-on-error: true`.
    - Step 2 zieht das Repo auf den Runner.
    - Step 3 gibt den Inhalt von `hallo.txt` aus.

    **Lehrsatz:** ohne `actions/checkout@v4` ist dein Repo auf dem Runner **nicht da**. Praktisch jeder echte Workflow startet mit diesem Step.

---

### Übung 6.4: Matrix-Build mit mehreren Versionen

!!! info "Was du lernst"
    - einen Job parallel mit verschiedenen Parametern laufen lassen
    - die `strategy.matrix`-Syntax
    - typisches Muster für Library-Tests

#### Szenario

Wenn du eine Bibliothek oder ein Tool für mehrere Sprach-Versionen unterstützen willst (Python 3.11, 3.12, 3.13), willst du nicht drei Workflows. Du willst **einen** Workflow, der drei Mal parallel läuft.

#### Aufgabe

Lege `.github/workflows/matrix.yml` an, der:

1. bei Push und manuell läuft
2. einen Job `python-versionen` enthält
3. den Job parallel für Python 3.11, 3.12 und 3.13 ausführt
4. in jedem Lauf `python --version` und `echo "Läuft auf Python ${{ matrix.python }}"` ausgibt

Im Actions-Tab solltest du nach dem Push **drei** parallele Job-Läufe sehen, einer pro Python-Version.

#### Hinweise

- Im Job-Block:
    ```yaml
    strategy:
      matrix:
        python: ["3.11", "3.12", "3.13"]
    ```
- Python installieren mit:
    ```yaml
    - uses: actions/setup-python@v5
      with:
        python-version: ${{ matrix.python }}
    ```

??? success "Musterlösung"
    ```yaml
    name: Matrix-Build

    on:
      push:
      workflow_dispatch:

    jobs:
      python-versionen:
        runs-on: ubuntu-latest
        strategy:
          matrix:
            python: ["3.11", "3.12", "3.13"]
        steps:
          - name: Python installieren
            uses: actions/setup-python@v5
            with:
              python-version: ${{ matrix.python }}

          - name: Version prüfen
            run: python --version

          - name: Eigenes Echo
            run: echo "Läuft auf Python ${{ matrix.python }}"
    ```

    Im Actions-Tab siehst du den Job dreimal, mit Klammern: `python-versionen (3.11)`, `python-versionen (3.12)`, `python-versionen (3.13)`. Alle drei laufen parallel auf eigenen Runner-VMs.

    !!! tip "Matrix mit zwei Achsen"
        Du kannst die Matrix beliebig erweitern. Beispiel: drei Python-Versionen × drei Betriebssysteme = neun parallele Läufe:

        ```yaml
        runs-on: ${{ matrix.os }}
        strategy:
          matrix:
            python: ["3.11", "3.12", "3.13"]
            os: [ubuntu-latest, windows-latest, macos-latest]
        ```

        Wichtig: bei mehreren OS muss `runs-on:` auf `${{ matrix.os }}` zeigen, sonst läuft alles auf demselben Linux.

---

## Was du nach diesen Übungen kannst

- **Bedingte Steps** mit `if:` schreiben
- **Mehrere Jobs** mit `needs:` verketten
- **Code aus dem Repo** auf den Runner holen (`actions/checkout`)
- **Matrix-Builds** für parallele Läufe nutzen
- **Logs** lesen und Fehler einordnen

Damit hast du das Vokabular, um die meisten realen GitHub-Actions-Workflows zu lesen und kleinere selbst zu schreiben.

---

## Weiterlesen

- [Stolpersteine](stolpersteine.md): wenn etwas hakt
- [Cheatsheet GitHub Actions](../cheatsheets/github-actions.md)
