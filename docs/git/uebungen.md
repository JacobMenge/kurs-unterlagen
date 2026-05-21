---
title: "Übungen: Git"
description: "Eigene Hands-on-Übungen zum Git-Block in vier Schwierigkeitsgraden – von einfachen lokalen Operationen bis zum Multi-Branch-Refactoring mit Pull Request. Mit Schritt-für-Schritt-Anleitung und Musterlösung pro Übung."
---

# Übungen: Git

Die Übungen bauen auf den Praxis-Seiten dieses Blocks auf. Du kannst sie in jedem deiner Übungs-Repos durchspielen – am einfachsten in `mein-tagebuch` (aus [Praxis 1](praxis-erste-schritte.md)) oder `mein-erstes-remote-repo` (aus [Praxis 4](praxis-github-neu.md)).

Die Übungen sind so geordnet, dass du **Schritt für Schritt** mehr Sicherheit bekommst: erst die lokalen Grundoperationen, dann Branches, dann das Zusammenspiel mit GitHub, am Ende eine kleine Challenge ohne Schritt-Anleitung.

!!! abstract "Die vier Stufen"
    Alle Übungen haben eine **Aufgabe**, eine ausklappbare **Schritt-für-Schritt-Anleitung** und eine ausklappbare **Musterlösung**. Die Stufen unterscheiden sich beim **Thema** und der **Tiefe**:

    - 🟢 **Einsteiger.** Lokale Grundoperationen (Commit, Status, Diff, Restore).
    - 🟡 **Mittel.** Branches, Merge, Konflikte.
    - 🔴 **Fortgeschritten.** Remote-Arbeit mit GitHub (Push, Pull, Pull Request).
    - 🏆 **Challenge.** Komplexere Mehr-Branch-Situation ohne Schritt-Anleitung. Musterlösung mit Erklärung gibt es trotzdem zum Aufklappen.

## Voraussetzung für alle Übungen

- Du hast die [Praxis 1–6](praxis-erste-schritte.md) durchgespielt.
- Du kannst `git status`, `git log`, `git diff` selbstständig lesen.
- Ab Übung 7.5 brauchst du einen GitHub-Account und ein zugewiesenes Repo.

---

## 🟢 Einsteiger

### Übung 7.1: Sauberer Commit-Stapel

!!! info "Was du lernst"
    - Gezielt einzelne Dateien stagen, statt `git add .`
    - Mehrere Commits **in der richtigen Reihenfolge** machen
    - Mit `git log --oneline` die Commits prüfen

#### Aufgabe

Lege im Home-Verzeichnis ein neues Repo `uebung-stapel` an. Erstelle dort drei Dateien:

- `notizen.md` mit einer Zeile Inhalt
- `agenda.md` mit drei Stichpunkten
- `kontakte.md` mit einem Namen und einer E-Mail

Bring die drei Dateien in **drei eigene Commits**, in dieser Reihenfolge:

1. erst `notizen.md`
2. dann `agenda.md`
3. zuletzt `kontakte.md`

Am Ende soll `git log --oneline` genau drei Commits zeigen, mit sinnvollen Messages.

#### Hinweise

- Nutze `git add <datei>`, nicht `git add .`.
- Achte vor jedem Commit mit `git status`, was wirklich gestaged ist.

??? tip "Schritt für Schritt: wie du die Übung löst"

    **Schritt 1: Repo anlegen**

    === "macOS / Linux / Git Bash"
        ```bash
        cd ~
        mkdir uebung-stapel
        cd uebung-stapel
        git init
        ```

    === "Windows PowerShell"
        ```powershell
        Set-Location $HOME
        New-Item -ItemType Directory -Name uebung-stapel | Out-Null
        Set-Location uebung-stapel
        git init
        ```

    **Schritt 2: Alle drei Dateien anlegen**

    Im Editor `notizen.md`, `agenda.md` und `kontakte.md` mit beliebigem Inhalt anlegen und speichern.

    Im Terminal:

    ```bash
    git status
    ```

    Erwartung: drei untracked files, alles im Working Tree.

    **Schritt 3: Erster Commit – nur `notizen.md`**

    ```bash
    git add notizen.md
    git status
    ```

    `notizen.md` steht jetzt unter „Changes to be committed". Die anderen beiden bleiben untracked.

    ```bash
    git commit -m "Notizen: erste Version"
    ```

    **Schritt 4: Zweiter Commit – nur `agenda.md`**

    ```bash
    git add agenda.md
    git commit -m "Agenda: Stichpunkte angelegt"
    ```

    **Schritt 5: Dritter Commit – `kontakte.md`**

    ```bash
    git add kontakte.md
    git commit -m "Kontakte: erster Eintrag"
    ```

    **Schritt 6: Historie prüfen**

    ```bash
    git log --oneline
    ```

    Erwartung: genau drei Commits, in der richtigen Reihenfolge.

??? success "Musterlösung"
    ```text
    c3d4e5f Kontakte: erster Eintrag
    b2c3d4e Agenda: Stichpunkte angelegt
    a1b2c3d Notizen: erste Version
    ```

    Hinweis: du kannst statt `git add <datei>` auch `git add -p` ausprobieren – das fragt dich pro Datei, ob du sie stagen willst. Praktisch, wenn du mal mit `git add .` denkbar zu großzügig sein würdest.

---

### Übung 7.2: Änderung verwerfen und neu machen

!!! info "Was du lernst"
    - Den Unterschied zwischen Working Tree und letztem Commit erkennen
    - Eine Änderung mit `git restore` verwerfen
    - Ohne Datenverlust nochmal von vorne anfangen

#### Aufgabe

Im Repo `uebung-stapel` aus 7.1:

1. Ändere `notizen.md` so, dass mindestens drei Zeilen anders sind als im letzten Commit.
2. Schau dir mit `git diff` den Unterschied an.
3. Verwirf die Änderungen ohne Commit.
4. Mach dann eine **andere** Änderung an `notizen.md` (z.B. nur eine Zeile dazu), stagen, commiten.

Am Ende soll `git log` einen zusätzlichen Commit zeigen, und `notizen.md` darf **nicht** die ursprünglich verworfenen Zeilen enthalten.

#### Hinweise

- `git diff` ohne Argumente vergleicht Working Tree mit letztem Commit.
- `git restore <datei>` wirft Working-Tree-Änderungen weg.

??? tip "Schritt für Schritt"
    **Schritt 1: notizen.md verändern**

    Öffne `notizen.md` und schreib drei sinnlose Zeilen ein, z.B.:

    ```markdown
    Das hier soll wieder weg.
    Und das auch.
    Und das ebenfalls.
    ```

    Speichern.

    **Schritt 2: Diff ansehen**

    ```bash
    git diff
    ```

    Ausgabe zeigt drei `+`-Zeilen (oder mehr, je nach Original).

    **Schritt 3: Änderung verwerfen**

    ```bash
    git restore notizen.md
    ```

    ```bash
    git status
    ```

    ```text
    nothing to commit, working tree clean
    ```

    `notizen.md` ist auf dem Stand des letzten Commits.

    **Schritt 4: Eine andere, sinnvolle Änderung**

    Öffne `notizen.md`, füge eine sinnvolle Zeile ein:

    ```markdown
    Heute habe ich `git restore` ausprobiert.
    ```

    Speichern, stagen, committen:

    ```bash
    git add notizen.md
    git commit -m "Notizen: Tageseintrag zu git restore"
    ```

    **Schritt 5: Log prüfen**

    ```bash
    git log --oneline
    ```

    Erwartung: vier Commits jetzt, der neueste oben.

??? success "Musterlösung"
    ```text
    d4e5f6g Notizen: Tageseintrag zu git restore
    c3d4e5f Kontakte: erster Eintrag
    b2c3d4e Agenda: Stichpunkte angelegt
    a1b2c3d Notizen: erste Version
    ```

    Merksatz: **`git restore` wirft im Working Tree weg, was nicht commitet ist. Mehr nicht. Es betrifft nie deine Commits.**

---

### Übung 7.3: Commit-Message korrigieren

!!! info "Was du lernst"
    - Eine Commit-Message nachträglich ändern, **bevor** sie gepusht wurde
    - Was `git commit --amend` macht (und was nicht)
    - Warum das nach einem Push gefährlich ist

#### Aufgabe

Im Repo `uebung-stapel`:

1. Mache einen neuen Commit mit absichtlich schlechter Message wie `fix` oder `asdf`.
2. Korrigiere die Message **ohne** zusätzlichen Commit anzulegen.
3. Prüfe mit `git log --oneline`, dass die neue Message dasteht und kein zweiter Commit entstanden ist.

#### Hinweise

- `git commit --amend -m "neue message"` ersetzt die Message des letzten Commits.
- Funktioniert nur, solange der Commit noch nicht zu einem Remote gepusht wurde – sonst wirfst du anderen Beteiligten die Historie um.

??? tip "Schritt für Schritt"
    **Schritt 1: Schlechten Commit anlegen**

    Mach irgendeine kleine Änderung, z.B. eine Zeile in `agenda.md` anhängen. Speichern, stagen, mit hässlicher Message committen:

    ```bash
    git add agenda.md
    git commit -m "asdf"
    ```

    **Schritt 2: Mit `git log` prüfen**

    ```bash
    git log --oneline
    ```

    Du siehst den `asdf`-Commit ganz oben. Peinlich, aber noch nicht außer Haus.

    **Schritt 3: Message korrigieren**

    ```bash
    git commit --amend -m "Agenda: zusätzlicher Punkt für Donnerstag"
    ```

    **Schritt 4: Prüfen**

    ```bash
    git log --oneline
    ```

    Der oberste Commit hat jetzt die korrigierte Message. Der SHA hat sich allerdings geändert – `--amend` erzeugt unter der Haube einen **neuen** Commit und schmeißt den alten weg.

??? success "Musterlösung"
    ```text
    e5f6g7h Agenda: zusätzlicher Punkt für Donnerstag    (zuvor: asdf)
    d4e5f6g Notizen: Tageseintrag zu git restore
    ...
    ```

    !!! warning "Niemals nach dem Push"
        Wenn du den `asdf`-Commit schon zu GitHub gepusht hattest, ist `--amend` ein Problem. Du würdest den Hash ändern – andere, die den alten Commit schon gezogen haben, geraten in Trouble. Faustregel: **`--amend` nur auf noch nicht gepushten Commits**.

---

## 🟡 Mittel

### Übung 7.4: Branch-Switch mit ungespeicherten Änderungen

!!! info "Was du lernst"
    - Was Git tut, wenn du den Branch wechseln willst, aber Änderungen im Working Tree sind
    - Den `git stash`-Befehl als Notausgang

#### Aufgabe

Im Repo `uebung-stapel`:

1. Lege einen Branch `feature/zwischenstand` an und wechsle drauf.
2. Mach eine kleine Änderung an einer Datei, **commite sie nicht**.
3. Versuche, auf `main` zu wechseln. Was passiert?
4. Nutze `git stash`, um die Änderung zwischenzuparken.
5. Wechsle auf `main` und zurück auf `feature/zwischenstand`.
6. Hole die Änderung mit `git stash pop` zurück.

#### Hinweise

- `git stash` legt die ungespeicherten Änderungen auf einen Stapel.
- `git stash pop` holt sie zurück und entfernt sie vom Stapel.
- `git stash list` zeigt, was im Stash liegt.

??? tip "Schritt für Schritt"
    **Schritt 1: Branch anlegen**

    ```bash
    git switch -c feature/zwischenstand
    ```

    **Schritt 2: Datei ändern, nicht committen**

    Öffne `notizen.md`, füg eine Zeile an:

    ```markdown
    Zwischenstand-Test.
    ```

    Speichern. Im Terminal:

    ```bash
    git status
    ```

    Du siehst die Änderung als „not staged".

    **Schritt 3: Branch-Wechsel versuchen**

    ```bash
    git switch main
    ```

    Mögliche Reaktionen:

    - Wenn `notizen.md` auf `main` denselben Stand wie auf dem Feature-Branch hatte (sehr wahrscheinlich), erlaubt Git den Wechsel und die Änderung **wandert mit**. Das ist okay, kann aber verwirren, wenn der Branchstand woanders abweicht.
    - Wenn die Änderung auf `main` zu einem Konflikt führen würde, blockiert Git mit:

        ```text
        error: Your local changes to the following files would be overwritten by checkout
        ```

    Egal welcher Fall – wir wollen das übergeordnete Verhalten kennenlernen. Probier folgendes:

    **Schritt 4: Stash**

    Erst zurück auf den Feature-Branch:

    ```bash
    git switch feature/zwischenstand
    ```

    Falls die Änderung gewandert ist, ist sie jetzt wieder da. Stash:

    ```bash
    git stash
    ```

    ```text
    Saved working directory and index state WIP on feature/zwischenstand: ...
    ```

    ```bash
    git status
    ```

    ```text
    On branch feature/zwischenstand
    nothing to commit, working tree clean
    ```

    Die Änderung ist auf den Stash-Stapel gewandert.

    **Schritt 5: Hin- und herwechseln**

    ```bash
    git switch main
    git switch feature/zwischenstand
    ```

    Beides funktioniert problemlos.

    **Schritt 6: Stash zurück**

    ```bash
    git stash pop
    ```

    Die Zwischenstand-Zeile ist wieder in `notizen.md`.

    **Schritt 7: Aufräumen**

    Entweder committen oder verwerfen:

    ```bash
    git restore notizen.md
    git switch main
    git branch -D feature/zwischenstand
    ```

??? success "Musterlösung"
    Kernbefehle:

    ```bash
    git switch -c feature/zwischenstand
    # Datei ändern, nicht committen
    git stash
    git switch main
    git switch feature/zwischenstand
    git stash pop
    ```

    Praktischer Hintergrund: in der echten Welt nutzt du `git stash`, wenn du **mitten in einer Arbeit** bist und jemand kommt mit „hilf mal kurz an Branch X". Du stashst deinen aktuellen Stand weg, hilfst, kommst zurück, popst, machst weiter. Kein Commit auf halb fertiger Arbeit.

---

### Übung 7.5: Bug-Fix-Branch nach Konflikt

!!! info "Was du lernst"
    - Eine realistische Branch-Geschichte selbst aufbauen
    - Einen Konflikt provozieren und sauber lösen
    - Den finalen Stand auf `main` prüfen

#### Aufgabe

Im Repo `uebung-stapel`:

1. Auf `main` ändere `agenda.md` so, dass eine Zeile gegenüber dem letzten Stand anders ist. Committe.
2. Lege einen Branch `bugfix/agenda-tippfehler` an und ändere **dieselbe Zeile** auf andere Weise. Committe.
3. Wechsle zurück auf `main` und versuche, den Bugfix-Branch zu mergen.
4. Löse den entstehenden Konflikt sauber auf.
5. Committe den Merge und räume den Bugfix-Branch auf.

#### Hinweise

- Du baust mit Absicht die Situation aus [Praxis 3](praxis-merge-konflikt.md) nach.
- Welche Version am Ende gilt, ist deine Entscheidung.

??? tip "Schritt für Schritt"
    **Schritt 1: Ausgangsstand auf main**

    Du bist auf `main`. Öffne `agenda.md`, ändere eine Zeile (egal welche) zu etwas Konkretem:

    ```markdown
    - Donnerstag: Code-Review-Session
    ```

    Speichern. Stagen, committen:

    ```bash
    git add agenda.md
    git commit -m "Agenda: Donnerstag mit Inhalt füllen"
    ```

    **Schritt 2: Bugfix-Branch**

    ```bash
    git switch -c bugfix/agenda-tippfehler
    ```

    Auf dem Branch dieselbe Zeile **anders** ändern, z.B.:

    ```markdown
    - Donnerstag: Code-Review (verschoben)
    ```

    Speichern, stagen, committen:

    ```bash
    git add agenda.md
    git commit -m "Agenda: Donnerstag-Termin als verschoben markieren"
    ```

    **Schritt 3: Auf main**

    ```bash
    git switch main
    ```

    (Die Branch-Änderung verschwindet aus der Datei, weil `main` einen anderen Stand hat.)

    **Schritt 4: Merge versuchen, Konflikt erleben**

    ```bash
    git merge bugfix/agenda-tippfehler
    ```

    ```text
    Auto-merging agenda.md
    CONFLICT (content): Merge conflict in agenda.md
    Automatic merge failed; fix conflicts and then commit the result.
    ```

    **Schritt 5: Konflikt lösen**

    Öffne `agenda.md`. Du siehst die Markierungen:

    ```markdown
    <<<<<<< HEAD
    - Donnerstag: Code-Review-Session
    =======
    - Donnerstag: Code-Review (verschoben)
    >>>>>>> bugfix/agenda-tippfehler
    ```

    Lösung deiner Wahl, z.B.:

    ```markdown
    - Donnerstag: Code-Review-Session (verschoben auf Freitag)
    ```

    Speichern.

    **Schritt 6: Stagen, Merge-Commit**

    ```bash
    git add agenda.md
    git commit
    ```

    Default-Merge-Message lassen, Editor schließen.

    **Schritt 7: Aufräumen**

    ```bash
    git branch -d bugfix/agenda-tippfehler
    git log --oneline --graph
    ```

??? success "Musterlösung"
    Erwartete Log-Auszug am Ende:

    ```text
    *   m6n7o8p (HEAD -> main) Merge branch 'bugfix/agenda-tippfehler'
    |\
    | * f5g6h7i Agenda: Donnerstag-Termin als verschoben markieren
    * | e4f5g6h Agenda: Donnerstag mit Inhalt füllen
    |/
    * ...
    ```

    Merge-Commit ist sichtbar, beide Originale stehen in der Historie. Konflikt ist gelöst, indem **beide Aussagen kombiniert** wurden.

---

## 🔴 Fortgeschritten

### Übung 7.6: PR-Workflow auf GitHub

!!! info "Was du lernst"
    - Den kompletten PR-Workflow allein simulieren
    - Eine Review-Reaktion mit zusätzlichem Commit beantworten
    - Den PR mergen und sauber aufräumen

#### Aufgabe

Auf einem GitHub-Repo deiner Wahl (am einfachsten `mein-erstes-remote-repo`):

1. Lege lokal einen Branch `feature/kontakt-bereich` an.
2. Schreib eine neue Datei `kontakt.md` mit etwa fünf Zeilen.
3. Pushe den Branch zum Remote (`git push -u origin ...`).
4. Öffne auf GitHub einen Pull Request. Titel und sinnvolle Description.
5. „Simuliere ein Review": stell dir vor, dein Tutor hat geschrieben „Bitte ergänze noch eine Telefonnummer". Mach genau das mit einem weiteren Commit auf demselben Branch, push.
6. Merge den PR auf GitHub (Create a merge commit).
7. Lösche den Branch auf GitHub.
8. Lokal: auf `main` wechseln, `git pull`, lokalen Feature-Branch löschen, ggf. mit `git fetch --prune` Tracking-Branches aufräumen.

#### Hinweise

- Genau das Vorgehen aus [Praxis 6](praxis-pull-request.md).
- Achte am Ende auf `git status`: „Your branch is up to date with 'origin/main'" – kein offener Loose End.

??? tip "Schritt für Schritt"
    **Schritt 1: Branch lokal**

    ```bash
    cd ~/mein-erstes-remote-repo
    git switch main
    git pull
    git switch -c feature/kontakt-bereich
    ```

    **Schritt 2: Datei anlegen, committen**

    Im Editor `kontakt.md` mit beliebigem Inhalt (Name, E-Mail, Wohnort, zwei weitere Zeilen):

    ```markdown
    # Kontakt

    Name: Maxi Musterperson
    E-Mail: maxi@example.com
    Wohnort: Hamburg
    Web: https://example.com
    ```

    Speichern, stagen, committen:

    ```bash
    git add kontakt.md
    git commit -m "Kontakt-Bereich angelegt"
    ```

    **Schritt 3: Push**

    ```bash
    git push -u origin feature/kontakt-bereich
    ```

    **Schritt 4: PR öffnen**

    Auf GitHub den gelben „Compare & pull request"-Hinweis nutzen. Titel z.B. „Kontakt-Bereich ergänzen", Description „Neue Datei `kontakt.md` mit Basis-Kontaktdaten."

    PR erstellen.

    **Schritt 5: Review-Reaktion**

    Zurück lokal, **immer noch auf dem Feature-Branch**:

    ```bash
    git status
    ```

    `On branch feature/kontakt-bereich`. Gut.

    `kontakt.md` öffnen, Zeile mit Telefon ergänzen:

    ```markdown
    Telefon: +49 40 12345678
    ```

    Stagen, committen, pushen:

    ```bash
    git add kontakt.md
    git commit -m "Kontakt: Telefonnummer ergänzt"
    git push
    ```

    Im PR-Tab sieht man zwei Commits.

    **Schritt 6: Merge**

    Auf GitHub im PR auf **Merge pull request → Create a merge commit → Confirm merge** klicken. Danach **Delete branch**.

    **Schritt 7: Lokal aufräumen**

    ```bash
    git switch main
    git pull
    git branch -d feature/kontakt-bereich
    git fetch --prune
    git status
    ```

    Erwartet: sauber, `main` auf neuestem Stand, kein Feature-Branch mehr.

??? success "Musterlösung"
    Kernbefehle ohne Schritt-Anleitung:

    ```bash
    git switch -c feature/kontakt-bereich
    # Datei anlegen, committen
    git push -u origin feature/kontakt-bereich
    # PR öffnen, Review-Commit, Push
    # Merge auf GitHub
    git switch main
    git pull
    git branch -d feature/kontakt-bereich
    git fetch --prune
    ```

    Ergebnis: ein sauberer Merge-Commit auf `main`, beide Commits aus dem Feature-Branch sichtbar in der Historie, keine offenen Branches.

---

### Übung 7.7: Konflikt aus einem PR heraus lösen

!!! info "Was du lernst"
    - Was passiert, wenn dein PR mit `main` nicht mehr sauber mergt
    - `git merge main` (oder `git pull origin main`) auf dem Feature-Branch
    - Wie GitHub den PR neu validiert nach deinem Push

#### Aufgabe

1. Auf GitHub direkt eine kleine Änderung an `README.md` auf `main` machen (Stift-Symbol, Commit auf main).
2. Lokal einen Branch `feature/parallel-readme` von der **alten** Version anlegen (vor deinem GitHub-Edit, also: vorher auf `main` ein `git pull` machen, dann den Branch erstellen – oder bewusst nicht pullen, um die alte Lage zu provozieren).
3. Auf dem Branch dieselbe Zeile ändern wie auf GitHub.
4. Pushen, PR öffnen.
5. GitHub meldet im PR: „This branch has conflicts that must be resolved."
6. Den Konflikt lokal lösen: `git switch feature/parallel-readme`, `git fetch`, `git merge origin/main`, Konflikt auflösen, committen, pushen.
7. PR mergen.

#### Hinweise

- Eine kontrollierte Variante des Konflikts aus [Praxis 4](praxis-github-neu.md#schritt-8-was-wenn-beide-seiten-etwas-geandert-haben), nur diesmal vor dem Hintergrund eines offenen PRs.

??? tip "Schritt für Schritt"
    **Schritt 1: Ausgangsstand sicherstellen**

    Lokal:

    ```bash
    git switch main
    git pull
    ```

    **Schritt 2: Auf GitHub direkt editieren**

    Im Browser zu deinem Repo, README öffnen, Stift, irgendeine Zeile ändern, Commit auf `main`. Lokal weißt du davon nicht.

    **Schritt 3: Feature-Branch lokal (mit veralteter Basis)**

    ```bash
    git switch -c feature/parallel-readme
    ```

    Dieselbe Zeile lokal anders verändern. Stagen, committen.

    **Schritt 4: Pushen, PR öffnen**

    ```bash
    git push -u origin feature/parallel-readme
    ```

    Auf GitHub PR öffnen.

    **Schritt 5: Konflikt-Anzeige**

    GitHub meldet im PR die Konflikt-Warnung mit einem orangen Hinweis „This branch has conflicts that must be resolved."

    **Schritt 6: Lokal auflösen**

    ```bash
    git fetch
    git merge origin/main
    ```

    Konflikt-Markierungen in der Datei. Wie in [Praxis 3](praxis-merge-konflikt.md) lösen. Stagen, Merge-Commit.

    ```bash
    git push
    ```

    **Schritt 7: PR mergen**

    GitHub erkennt nach dem Push, dass der Konflikt weg ist. Merge-Knopf wird grün. Merge, Branch löschen.

    **Schritt 8: Lokal aufräumen**

    Genau wie in Übung 7.6.

??? success "Musterlösung"
    Kernbefehle (auf dem Feature-Branch):

    ```bash
    git fetch
    git merge origin/main
    # Konflikt in der Datei manuell auflösen
    git add <konfliktdatei>
    git commit
    git push
    ```

    Lehrsatz: **Wenn dein PR mit `main` divergiert ist, holst du `main` in deinen Feature-Branch und löst den Konflikt dort. Niemals direkt auf `main` mergen, ohne den PR auf GitHub zu schließen.**

---

## 🏆 Challenge

### Übung 7.8: Multi-Branch-Refactoring

!!! info "Worum es geht"
    Diese Übung hat **keine Schritt-Anleitung**. Eine Musterlösung mit Erklärung gibt es trotzdem zum Aufklappen. Versuch erst eigenständig.

#### Szenario

Du hast ein Repo mit folgendem Inhalt:

```text
mein-projekt/
├── README.md
├── todo.md
└── notizen.md
```

Du sollst innerhalb einer einzigen Arbeitssitzung **drei separate Änderungen** umsetzen, **ohne sie miteinander zu vermischen**:

1. **Tippfehler in der `README.md`** korrigieren – kleinster und schnellster Fix.
2. **Komplette Umstrukturierung der `todo.md`** in Kategorien (Heute, Diese Woche, Später).
3. **`notizen.md` umbenennen** zu `journal.md` (mit `git mv`).

Außerdem soll am Ende alles **auf GitHub** liegen, jede der drei Änderungen als **eigener Pull Request**, alle drei gemergt, alle Branches aufgeräumt.

#### Ergebniserwartungen

- Auf `main` gibt es nach allen Merges drei Merge-Commits (oder drei klare Feature-Commits, je nach gewählter Merge-Strategie).
- Keine offenen Branches, weder lokal noch remote.
- Die Tippfehler-Korrektur taucht in der Historie **vor** den anderen beiden auf (du startest mit dem kleinen Fix).
- `git mv notizen.md journal.md` erscheint in der Historie als **Rename**, nicht als „Datei gelöscht + neue Datei".

#### Tipps (keine Lösung)

- Du brauchst drei Feature-Branches. Sinnvolle Namensvorschläge: `fix/readme-tippfehler`, `feature/todo-kategorien`, `refactor/notizen-zu-journal`.
- Lege die Branches **alle von einem sauberen `main` aus** an, damit sie nicht voneinander abhängen.
- `git mv <alt> <neu>` ist eine Kombination aus `mv` (Datei umbenennen) und `git add` (für beide Stände). Probier es aus, schau dir `git status` an.

??? success "Musterlösung mit Erklärung"

    **Idee:** drei Branches, drei PRs, sauberes Aufräumen.

    ### Vorbereitung

    Sicherstellen, dass `main` aktuell ist:

    ```bash
    git switch main
    git pull
    ```

    ### Branch 1: Tippfehler-Fix

    ```bash
    git switch -c fix/readme-tippfehler
    # Tippfehler in README.md korrigieren
    git add README.md
    git commit -m "README: Tippfehler in der Einleitung korrigiert"
    git push -u origin fix/readme-tippfehler
    # Auf GitHub PR öffnen, mergen, Branch löschen
    git switch main
    git pull
    git branch -d fix/readme-tippfehler
    ```

    Mit dem **kleinsten Fix zuerst** ist Standard. Er ist schnell durch und blockiert nichts.

    ### Branch 2: TODO-Kategorien

    ```bash
    git switch -c feature/todo-kategorien
    # todo.md neu strukturieren
    git add todo.md
    git commit -m "TODO: in Kategorien (Heute, Diese Woche, Später) umstrukturiert"
    git push -u origin feature/todo-kategorien
    # PR öffnen, mergen, löschen
    git switch main
    git pull
    git branch -d feature/todo-kategorien
    ```

    ### Branch 3: Rename mit `git mv`

    ```bash
    git switch -c refactor/notizen-zu-journal
    git mv notizen.md journal.md
    git status
    ```

    Ausgabe ungefähr:

    ```text
    Changes to be committed:
        renamed:    notizen.md -> journal.md
    ```

    Schön zu sehen: Git erkennt das als **Rename**, nicht als Löschung + Neuanlage. Dadurch bleibt die Datei-Historie intakt – `git log --follow journal.md` zeigt später auch die Zeit, als die Datei noch `notizen.md` hieß.

    ```bash
    git commit -m "Notizen-Datei in journal.md umbenannt"
    git push -u origin refactor/notizen-zu-journal
    # PR, Merge, Branch löschen
    git switch main
    git pull
    git branch -d refactor/notizen-zu-journal
    git fetch --prune
    ```

    ### Endkontrolle

    ```bash
    git log --oneline --graph
    git branch -a
    ```

    Erwartung: drei Merge-Commits (oder drei reine Feature-Commits, je nach Squash/Merge-Wahl), keine offenen Branches, weder lokal noch remote.

    !!! tip "Wenn du mit Squash-Merges arbeitest"
        Dann sind die drei Feature-Branches als jeweils **ein einzelner Commit** auf `main` zu sehen, nicht als Merge-Commit mit Sub-Commits. Trotzdem ist die Reihenfolge erkennbar und die Branch-Wahl war sinnvoll.

    Das Wichtigste an dieser Übung ist nicht das Kommando-Vokabular, sondern das Bewusstsein: **separate Themen gehören in separate Branches**, auch wenn man sie innerhalb einer Stunde abarbeiten könnte. So bleibt die Historie sprechend, und jeder PR ist klein genug, um reviewt zu werden.

---

## Wie du die Übungen am besten nutzt

- **Linear durchgehen**, wenn du Git neu lernst.
- **Springen**, wenn du gezielt eine Lücke füllen willst (z.B. nur 7.5 für Konflikt-Übung).
- **Mehrmals machen**: die ersten paar Male mit Schritt-Anleitung, dann ohne, dann mit etwas Variation (anderer Dateiname, andere Branch-Namen).

Wenn du an einer Stelle festhängst, schau in die [Stolpersteine](stolpersteine.md). Wenn du Lust auf eine Mehr-Personen-Variante hast: die [Gruppenübung](gruppen-uebung.md) zwingt euch in eine realistische Konfliktsituation.

---

## Was du nach allen Übungen kannst

- Lokale Commits sauber stapeln, gezielt stagen, Änderungen verwerfen.
- Branches anlegen, wechseln, mergen, auch bei Konflikten.
- Mit Personal Access Token gegen GitHub authentifizieren, pushen, pullen.
- Pull Requests öffnen, Reviews mit Folge-Commits beantworten, mergen, aufräumen.
- Größere Refactorings sauber in mehrere Branches zerlegen.

Damit bist du startklar für den anschließenden [CI/CD-Block](../ci-cd/index.md), wo wir aus genau diesen Bausteinen automatisierte Pipelines bauen.
