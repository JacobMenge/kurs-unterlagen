---
title: "Gruppenübung 1: Merge-Konflikt im Team lösen (60 Min)"
description: "Erste der beiden Git-Gruppenübungen. 60 Minuten am selben GitHub-Repo, drei bis vier Personen, jeder mit eigenem Feature-Branch. Zwei Personen ändern absichtlich dieselbe Stelle in derselben Datei - ihr provoziert einen Merge-Konflikt und löst ihn gemeinsam."
---

# Gruppenübung 1: Merge-Konflikt im Team lösen

!!! warning "Bevor ihr loslegt – welche Gruppenübung ist das?"
    Im Git-Block gibt es **zwei** verschiedene Gruppenübungen mit unterschiedlichem Schwerpunkt. Stellt sicher, dass **alle in der Gruppe wissen, welche ihr gerade macht** – sonst arbeiten Teilnehmer aneinander vorbei.

    | | **Gruppenübung 1** (diese hier) | **[Gruppenübung 2](praxis-team-workflow.md)** |
    |---|---|---|
    | **Dauer** | 60 Minuten | 45 Minuten |
    | **Fokus** | **Merge-Konflikt** auflösen | **Workflow** und `[rejected]`-Fehler |
    | **Wer ändert was?** | mehrere ändern **dieselbe Stelle in derselben Datei** | jeder ändert seine **eigene Section** |
    | **Wer wird Konflikt erleben?** | gewollt: Konflikt zwischen zwei Devs | kein Merge-Konflikt; dafür `[rejected]`-Fehler beim Push |
    | **Wann nehmen?** | wenn ihr Konflikt-Auflösung im Team üben wollt | wenn ihr den sauberen Team-Workflow üben wollt |

    **Wenn ihr beide Übungen machen wollt:** macht **Gruppenübung 2 zuerst** (sie ist freundlicher und vermittelt die Routine), **danach Gruppenübung 1** (anspruchsvoller, mit gewolltem Konflikt). Bei Unsicherheit: fragt euren Dozenten.

---

Willkommen zur **Git-Praxis-Wiederholung in der Gruppe – mit Konflikt-Fokus**.

In den Praxis-Seiten hast du alle Bausteine schon einzeln gemacht – Branches, Merges, Konflikte, Pull Requests. Heute spielt ihr das **gemeinsam an einem Repo** durch. **In Gruppen, in 60 Minuten, mit einem absichtlich provozierten Konflikt.**

---

## Worum's geht

Eure Gruppe übernimmt ein kleines Repo namens `team-projekt`. Drei bis vier Teilnehmer arbeiten **am selben Remote-Repo**, jeder mit einem eigenen Feature-Branch. Mindestens zwei Personen ändern bewusst **dieselbe Stelle in derselben Datei**, sodass beim Mergen ein Konflikt entsteht. Den löst ihr gemeinsam.

Was ihr dabei einübt:

- ein gemeinsames Remote-Repo aufsetzen (eine Person hostet)
- als Kollaborator eingeladen werden und Schreibrechte bekommen
- parallel auf eigenen Branches arbeiten
- Pull Requests öffnen und reviewen
- einen Konflikt erkennen und im Team auflösen
- den **eigenen lokalen Stand aktuell halten**, während andere ebenfalls pushen

!!! info "Voraussetzungen"
    - Alle haben Git lokal installiert und konfiguriert (siehe [Git installieren](installation.md)).
    - Alle haben einen GitHub-Account.
    - Alle haben die [Praxis 1–6](praxis-erste-schritte.md) durchgespielt.
    - **Eine Person übernimmt die Rolle „Host"** – sie legt das Repo an und lädt die anderen ein.

---

## Rollenverteilung

Verteilt am Anfang die Rollen in eurer Gruppe. Bei vier Personen passt das so:

| Rolle | Aufgaben |
|---|---|
| **Host** | Legt das GitHub-Repo an und lädt die anderen als Collaborator ein. Macht später den finalen Merge. |
| **Dev A** | Feature-Branch für eine Änderung an Datei X. Wird in Konflikt geraten. |
| **Dev B** | Feature-Branch für eine Änderung an Datei X – am selben Ort. Wird in Konflikt geraten. |
| **Dev C** | Feature-Branch für eine Änderung an Datei Y. Konfliktfrei. |

Bei drei Personen kombiniert eine Person zwei Rollen (z.B. Host + Dev C).

Bei größeren Gruppen können mehrere „Dev"-Rollen mit eigenen unterschiedlichen Branches dazukommen.

---

## Zeitrahmen

```text
60 Minuten Gruppenarbeit
```

- 10 Min: Setup (Host legt Repo an, Einladungen, alle klonen)
- 20 Min: Parallel auf eigenen Branches arbeiten, pushen, PRs öffnen
- 20 Min: Konflikt provozieren, gemeinsam lösen, finaler Merge
- 10 Min: Reflexion und Aufräumen

Danach setzt ihr euch zusammen und besprecht typische Stolperstellen.

---

## Phase 1: Setup (10 Minuten)

### Schritt 1.1 – Host legt das Repo an

**Nur die Host-Person macht das.**

1. Auf <https://github.com/new> ein neues Repo anlegen.
2. **Repository name**: `team-projekt`.
3. **Public** wählen (einfacher für die Gruppenarbeit).
4. Unter **Initialize this repository with** den Schieberegler **„Add a README file"** nach rechts schieben (aktivieren).
5. **Create repository**.

Auf der Repo-Startseite muss die initiale `README.md` mit folgendem Inhalt liegen. Falls automatisch generierte Inhalte abweichen, **direkt im Web-Editor anpassen** (Stift-Symbol an der `README.md` → Inhalt ersetzen → Commit):

```markdown
# team-projekt

Gemeinsames Übungs-Repo aus dem Git-Kurs.

## Inhalt

- (Inhalt folgt)

## Team

- Host

## Kontakt

- E-Mail: hostmail@example.com
```

Speichern (commiten auf `main`).

### Schritt 1.2 – Collaborator einladen

Auf der Repo-Seite:

1. **Settings → Collaborators → Add people**.
2. GitHub-Username oder E-Mail von Dev A, B, C eintragen, jeweils einladen.
3. Die eingeladenen Personen bekommen eine Mail (oder eine Benachrichtigung auf GitHub) und müssen die Einladung **annehmen**.

!!! warning "Einladung muss angenommen sein"
    Solange die Einladung nicht angenommen ist, kann der Eingeladene zwar das Repo klonen, aber **nicht pushen**. Schnell-Check: jeder klickt oben rechts auf den Glocken-Eintrag oder geht auf `https://github.com/<HOST>/team-projekt/invitations` und klickt **Accept invitation**.

### Schritt 1.3 – Alle klonen

Jeder klont das Repo auf seinen Rechner:

=== "macOS / Linux / Git Bash"
    ```bash
    cd ~
    git clone https://github.com/<HOST-USERNAME>/team-projekt.git
    cd team-projekt
    ```

=== "Windows PowerShell"
    ```powershell
    Set-Location $HOME
    git clone https://github.com/<HOST-USERNAME>/team-projekt.git
    Set-Location team-projekt
    ```

=== "Windows CMD"
    ```cmd
    cd /d "%USERPROFILE%"
    git clone https://github.com/<HOST-USERNAME>/team-projekt.git
    cd team-projekt
    ```

Prüfen:

```bash
git log --oneline
git remote -v
```

Erwartet: ein bis zwei Commits, `origin` zeigt auf das Repo des Hosts.

!!! info "Personal Access Token bereit?"
    Spätestens beim ersten Push wird GitHub nach Anmeldedaten fragen. **Username** ist euer GitHub-Name, **Passwort** ist ein **Personal Access Token**. Falls noch nicht erstellt: [siehe Praxis 4 → Schritt 5](praxis-github-neu.md#schritt-5-pushen-und-das-token-setup).

---

## Phase 2: Parallel arbeiten (20 Minuten)

Jeder von euch arbeitet jetzt auf einem eigenen Branch. **Wichtig**: nicht direkt auf `main` arbeiten. Jeder hat seinen eigenen Feature-Branch, der später per PR in `main` zurück will.

### Aufgabenverteilung

| Rolle | Branch-Name | Aufgabe |
|-------|-------------|---------|
| **Host** | – | Wartet, gibt Reviews und macht später Merges. Hat selbst keinen eigenen Branch in dieser Phase. |
| **Dev A** | `feature/team-mitglied-a` | Trag deinen Namen in der `## Team`-Sektion **direkt unter „Host"** ein. |
| **Dev B** | `feature/team-mitglied-b` | Trag deinen Namen in der `## Team`-Sektion **direkt unter „Host"** ein. |
| **Dev C** | `feature/kontakt-erweitern` | Ergänze unter `## Kontakt` eine **Telefon-Zeile** für den Host. |

!!! warning "A und B – beide in dieselbe Sektion an dieselbe Stelle!"
    Das ist Absicht. Beide schreiben **direkt unter** „- Host". Das wird gleich beim Mergen knallen. Genau das wollen wir lernen.

### Schritt 2.1 – Branch lokal anlegen

Jeder Dev macht für sich:

```bash
git switch -c feature/team-mitglied-a
```

(Branch-Name anpassen.)

### Schritt 2.2 – Datei ändern, commiten

Im Editor `README.md` öffnen und die zugewiesene Änderung machen. Beispiel für Dev A:

```markdown
## Team

- Host
- Anna Anders
```

Speichern, im Terminal:

```bash
git add README.md
git commit -m "Team: Anna Anders ergänzen"
```

Beispiel für Dev B:

```markdown
## Team

- Host
- Ben Bender
```

```bash
git add README.md
git commit -m "Team: Ben Bender ergänzen"
```

Beispiel für Dev C:

```markdown
## Kontakt

- E-Mail: hostmail@example.com
- Telefon: +49 40 12345678
```

```bash
git add README.md
git commit -m "Kontakt: Telefonnummer ergänzen"
```

### Schritt 2.3 – Branch pushen

Jeder Dev pusht seinen Branch:

```bash
git push -u origin feature/team-mitglied-a
```

(Branch-Name jeweils anpassen.)

### Schritt 2.4 – Pull Request öffnen

Jeder Dev geht auf das Repo im Browser. Direkt nach dem Push erscheint oben ein gelber „Compare & pull request"-Hinweis. Klicken, sinnvollen Titel und Description schreiben:

| Branch | PR-Titel |
|--------|----------|
| `feature/team-mitglied-a` | Team: Anna Anders ergänzen |
| `feature/team-mitglied-b` | Team: Ben Bender ergänzen |
| `feature/kontakt-erweitern` | Kontakt: Telefonnummer ergänzen |

Auf **Create pull request** klicken.

Jetzt gibt es drei offene PRs gegen `main`.

### Schritt 2.5 – Reviews tauschen (kurz)

Jeder schaut sich **einen anderen PR** an. Im Tab **Files changed** sieht man den Diff. Wer Lust hat, hinterlässt einen Kommentar („sieht gut aus" oder eine kleine Verbesserung).

Wer Approve-Buttons sieht (das ist auf manchen Repos eingeschränkt): einmal **Approve** klicken, wenn er den PR okay findet.

---

## Phase 3: Konflikt provozieren und lösen (20 Minuten)

Jetzt kommt der interessante Teil. **Host übernimmt die Steuerung.**

### Schritt 3.1 – PR von Dev C zuerst mergen

Auf GitHub:

1. **Host** öffnet den PR von Dev C (`feature/kontakt-erweitern`).
2. **Merge pull request → Create a merge commit → Confirm merge → Delete branch**.

Im Browser ist `main` jetzt aktualisiert. Die Kontakt-Sektion hat eine Telefonnummer mehr. Kein Konflikt.

### Schritt 3.2 – PR von Dev A mergen

1. **Host** öffnet den PR von Dev A.
2. GitHub sagt: „This branch has no conflicts with the base branch".
3. Mergen wie beim ersten PR.

Nach dem Merge: `main` hat jetzt Anna Anders im Team.

### Schritt 3.3 – PR von Dev B mergen … oder doch nicht?

1. **Host** öffnet den PR von Dev B.
2. GitHub meldet rote Warnung:

    ```text
    This branch has conflicts that must be resolved.
    ```

3. Knopf „Merge" ist **deaktiviert**.

**Damit ist der Konflikt da.** Jetzt soll **Dev B** das Problem lösen – mit Hilfe der anderen.

### Schritt 3.4 – Dev B löst den Konflikt lokal

Dev B macht im eigenen Terminal:

```bash
git switch feature/team-mitglied-b
```

Aktuellen Stand der `main`-Linie holen:

```bash
git fetch
```

Schauen, was sich getan hat:

```bash
git log --oneline --all --graph
```

Du siehst, dass `origin/main` Commits hat, die du nicht hast. Dev B mergt `origin/main` in den eigenen Branch:

```bash
git merge origin/main
```

Reaktion:

```text
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.
```

`README.md` öffnen. Konflikt sieht ungefähr so aus:

```markdown
## Team

<<<<<<< HEAD
- Host
- Ben Bender
=======
- Host
- Anna Anders
>>>>>>> origin/main
```

**Diskussion in der Gruppe:**

> Sollen beide Namen rein? Wenn ja, in welcher Reihenfolge? Soll alphabetisch sortiert werden? Soll einer der Namen herausfliegen (z.B. weil die Person doch nicht im Team ist)?

Realistisch im Übungs-Setup: beide rein, alphabetisch. Dev B passt die Datei an:

```markdown
## Team

- Host
- Anna Anders
- Ben Bender
```

Die drei Marker-Linien sind weg, die Datei ist sauber. Speichern.

### Schritt 3.5 – Konflikt-Auflösung committen

```bash
git add README.md
git commit
```

Editor öffnet sich mit vorbereiteter Merge-Message. Speichern, schließen.

Pushen:

```bash
git push
```

### Schritt 3.6 – PR-Stand prüfen

Im Browser den PR von Dev B aktualisieren. GitHub erkennt automatisch, dass der Konflikt aufgelöst ist. Der „Merge"-Knopf wird grün.

**Host mergt den PR.** Branch löschen.

### Schritt 3.7 – Alle aktualisieren

Jetzt sind drei PRs auf `main` gemergt. Alle holen den aktuellen Stand:

```bash
git switch main
git pull
git branch -d feature/team-mitglied-a    # nur die jeweilige Person
git branch -d feature/team-mitglied-b    # nur die jeweilige Person
git branch -d feature/kontakt-erweitern  # nur die jeweilige Person
git fetch --prune
```

`git log --oneline --graph` zeigt jetzt eine Historie mit drei Merge-Commits und allen Beiträgen.

Im Browser auf `main` schauen: die README hat eine vollständige Team-Liste und die Telefonnummer.

---

## Phase 4: Reflexion und Aufräumen (10 Minuten)

Setzt euch in der Gruppe zusammen und sprecht durch:

| Frage | Hintergrund |
|-------|-------------|
| Wer hat den Konflikt **technisch** verursacht? | Niemand. Beide Änderungen waren legitim. Der Konflikt ist nicht „Schuld" einer Person. |
| Hätte man den Konflikt vermeiden können? | Ja: indem A und B unterschiedliche Sektionen oder unterschiedliche Dateien bearbeitet hätten. In echten Projekten klappt das durch klare Aufgabenverteilung. |
| Was wäre passiert, wenn Dev B **vor dem Push** schon `git pull origin main` gemacht hätte? | Der Konflikt wäre lokal aufgetreten, statt im PR. Vorgehen wäre dasselbe. |
| Wer entscheidet, **welche Version gilt**? | Die Person, die den Konflikt auflöst – im Zweifel mit Rücksprache im Team. Kein Algorithmus, sondern menschliche Entscheidung. |
| Was wäre, wenn Dev A und B **gleichzeitig** den Konflikt lösen wollten? | Nur eine Auflösung wird gewinnen. Die zweite müsste pullen und sehen, dass die erste schon gelöst hat. |

### Optional: Setup aufräumen

Wenn ihr das Repo nicht mehr braucht:

- **Host**: Repo → Settings → ganz nach unten → **Delete this repository**.
- **Alle**: den lokalen Ordner löschen, siehe Anleitung am Ende von [Praxis 1](praxis-erste-schritte.md#aufraumen-oder-weitermachen).

Wenn ihr das Repo behalten wollt (z.B. als Spielfeld für weitere Experimente), könnt ihr es einfach liegen lassen. Nimmt nichts weg.

---

## Bonus-Runden (falls Zeit bleibt)

### Bonus 1: Force-Push-Demo (vorsichtig!)

Eine zweite Runde. **Diesmal mit Absicht falsch machen, um zu sehen, was passiert.**

Dev A pusht direkt auf `main` (klar, ohne Branch):

```bash
git switch main
echo "Direkt auf main." >> README.md
git add README.md
git commit -m "Direkter Commit auf main"
git push
```

In Repos mit **Branch Protection** (auf öffentlichen Übungs-Repos nicht aktiv) würde der Push abgelehnt. Auf eurem Repo geht es durch. Diskutiert: **Warum ist das in echten Projekten verboten?**

Antwort: weil dann jede Person direkt veröffentlichen kann, ohne Review. PR-Workflows existieren genau, um das zu unterbinden.

### Bonus 2: Branch Protection einschalten

Auf dem Repo → Settings → Branches → **Add classic branch protection rule**:

- Pattern: `main`
- **Require a pull request before merging** anhaken.
- Speichern.

Jetzt versucht Dev A erneut, direkt auf `main` zu pushen. GitHub lehnt ab:

```text
remote: error: GH006: Protected branch update failed for refs/heads/main.
```

Dev A muss jetzt ebenfalls über einen PR.

### Bonus 3: Issue als „Aufgabentafel"

Auf dem Repo → **Issues → New issue**. Issue mit Titel „Team-Mitglied hinzufügen". Beschreibung „Bitte trag dich in der README ein."

Wenn jemand jetzt einen PR macht, kann er in der Description schreiben:

```markdown
Closes #1
```

Beim Merge des PR wird Issue #1 automatisch geschlossen. Schöner Brückenschlag zwischen Issues und PRs.

---

## Was ihr aus dieser Übung mitnehmen sollt

- Ein **Remote-Repo gemeinsam zu nutzen** braucht ein Mindestmaß an Absprache, aber die Tools sind robust.
- **Konflikte sind normal**, gehören zur Arbeit und werden nicht von Git „verhindert", sondern aktiv aufgelöst.
- Der Konflikt-Workflow im Team: **lokal mergen, lösen, pushen** – nicht „rumprobieren auf dem Remote".
- Pull Requests sind nicht nur Zeremonie. Sie sind die Stelle, an der **Reviews und Diskussionen** passieren.
- Das **eigene lokale Wissen** über `main` veraltet schnell. Vor jedem neuen Branch: `git pull` auf `main`.
- **Aufräumen** (Branches löschen, `git fetch --prune`) gehört zum Workflow dazu.

---

## Wenn ihr Lust auf mehr habt

Diese Übung ist absichtlich klein. Eine Verlängerung könnte sein:

- **Drei Runden** mit Rollentausch: jeder ist mal Host, mal Konflikt-Verursacher, mal Konflikt-Löser.
- Eine Runde **ohne Schritt-Anleitung**, in der ihr nur die Aufgabe bekommt „setzt ein Repo auf, baut drei parallele Features, mergt sie sauber". Beobachtet, welche Hilfe ihr noch braucht.
- Eine Variante mit **Branch Protection** und Pflicht-Reviews, sodass niemand selbst seinen eigenen PR mergen kann.

Alles davon vertieft genau die Routinen, die ihr im echten Berufsalltag braucht.

---

## Merksatz

!!! success "Merksatz"
    > **Im Team ist `main` heilig. Alle arbeiten auf Branches, alle nutzen PRs, Konflikte werden lokal gelöst, nicht im Browser. Vor jedem neuen Branch ein `git pull` auf `main`, nach jedem Merge ein `git fetch --prune`. Konflikte sind kein Drama, sie sind ein Routinevorgang.**

---

## Weiterlesen

- [Stolpersteine](stolpersteine.md): Probleme im Team-Workflow
- [Merksätze](merksaetze.md): die Kern-Sätze des ganzen Blocks
- [CI/CD-Einführung](../ci-cd/index.md): das, was nach dem PR-Merge automatisch passiert
