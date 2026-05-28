---
title: "Gruppenübung 2: Feature-Workflow im Team (45 Min)"
description: "Zweite der beiden Git-Gruppenübungen. 45 Minuten am gemeinsamen GitHub-Repo, 4 bis 5 Teilnehmer. Jeder arbeitet auf einem eigenen Feature-Branch in seiner eigenen README-Section. Die Übung produziert absichtlich den 'rejected, non-fast-forward'-Fehler, damit alle den Pull-Push-Workflow im Team erleben - ohne Merge-Konflikt."
---

# Gruppenübung 2: Feature-Workflow im Team

!!! warning "Bevor ihr loslegt – welche Gruppenübung ist das?"
    Im Git-Block gibt es **zwei** verschiedene Gruppenübungen mit unterschiedlichem Schwerpunkt. Stellt sicher, dass **alle in der Gruppe wissen, welche ihr gerade macht** – sonst arbeiten Teilnehmer aneinander vorbei.

    | | **[Gruppenübung 1](gruppen-uebung.md)** | **Gruppenübung 2** (diese hier) |
    |---|---|---|
    | **Dauer** | 60 Minuten | 45 Minuten |
    | **Fokus** | **Merge-Konflikt** auflösen | **Workflow** und `[rejected]`-Fehler |
    | **Wer ändert was?** | mehrere ändern **dieselbe Stelle in derselben Datei** | jeder ändert seine **eigene Section** |
    | **Wer wird Konflikt erleben?** | gewollt: Konflikt zwischen zwei Devs | kein Merge-Konflikt; dafür `[rejected]`-Fehler beim Push |
    | **Wann nehmen?** | wenn ihr Konflikt-Auflösung im Team üben wollt | wenn ihr den sauberen Team-Workflow üben wollt |

    **Wenn ihr beide Übungen machen wollt:** macht **Gruppenübung 2 zuerst** (diese hier, sie ist freundlicher und vermittelt die Routine), **danach Gruppenübung 1** (anspruchsvoller, mit gewolltem Konflikt). Bei Unsicherheit: fragt euren Dozenten.

---

Willkommen zur **Workflow-Gruppenübung**.

Ihr habt auf der Seite [Typische Git-Workflows in der Praxis](workflows.md) drei Muster alleine durchgespielt. Jetzt erlebt ihr **denselben Stoff zu viert oder fünft** – am gemeinsamen Repo, mit echten Mehrbenutzer-Effekten.

---

## Worum's geht

Eine Gruppe von 4 (idealerweise) oder 5 Personen arbeitet am selben Remote-Repo. Jeder hat einen eigenen Feature-Branch und macht zwei Commits. Alle pushen, alle öffnen Pull Requests. Der Maintainer (eine bestimmte Rolle in eurer Gruppe) merged die PRs nacheinander.

**Der eigentliche Lerneffekt kommt danach:** sobald der erste PR gemerged ist, sind alle anderen lokalen `main`-Stände **veraltet**. Wenn jemand jetzt einen weiteren Commit direkt auf `main` machen und pushen würde, ohne vorher zu pullen, bekommt er den **`rejected, non-fast-forward`-Fehler**. Genau diese Situation provoziert ihr, alle gemeinsam.

Was ihr dabei einübt:

- ein gemeinsames Remote-Repo aufsetzen
- als Collaborator eingeladen werden und akzeptieren
- jeder auf einem eigenen Feature-Branch arbeiten
- Pull Requests öffnen, Reviews tauschen, mergen
- den **`[rejected]`-Fehler** live erleben und ihn mit `git pull` auflösen
- den Reflex „**vor jedem Push einmal pullen**" verinnerlichen

!!! info "Voraussetzungen"
    - Alle haben Git installiert und konfiguriert (siehe [Git installieren](installation.md)).
    - Alle haben einen GitHub-Account und einen **Personal Access Token** bereit (siehe [Praxis 4 → Schritt 5](praxis-github-neu.md#schritt-5-pushen-und-das-token-setup)).
    - Alle haben mindestens [Praxis 1–4](praxis-erste-schritte.md) und idealerweise auch die Seite [Workflows](workflows.md) gelesen.
    - **Eine Person übernimmt die Rolle Maintainer** und legt das Repo an.

---

## Rollenverteilung

Verteilt am Anfang die Rollen. Die Standardbesetzung sind **vier Personen**:

| Rolle | Aufgaben |
|---|---|
| **Maintainer** | Legt das GitHub-Repo an, lädt die anderen als Collaborator ein. Macht keine eigenen Feature-Branches. Merged später die PRs in der Reihenfolge A → B → C. |
| **Dev A** | Feature-Branch `feature/section-a`. Trägt sich in der Section A der README ein. |
| **Dev B** | Feature-Branch `feature/section-b`. Trägt sich in der Section B der README ein. |
| **Dev C** | Feature-Branch `feature/section-c`. Trägt sich in der Section C der README ein. |

**Bei fünf Personen** kommt **Dev D** dazu mit Section D – sonst genau derselbe Ablauf. **Lieber Vierergruppen** als gemischte Gruppen mit fünft, weil bei fünft die Phase 3 etwas zäh wird – aber wenn die Gruppengröße sich nicht teilen lässt, ist Fünft okay.

!!! info "Warum getrennte Sections?"
    Anders als in [Gruppenübung 1](gruppen-uebung.md) ändert hier **jeder Dev seine eigene Section in der README**. Damit treten **keine** Merge-Konflikte zwischen den Devs auf. Der Lerneffekt kommt nicht aus dem Konflikt selbst, sondern aus der **`[rejected]`-Situation** in Phase 3.

---

## Zeitrahmen

```text
45 Minuten Gruppenarbeit
```

- **10 Min:** Phase 1 – Setup (Repo, Einladungen, alle klonen)
- **15 Min:** Phase 2 – Parallel auf eigenen Branches arbeiten, pushen, PRs öffnen
- **10 Min:** Phase 3 – Maintainer merged, Devs erleben `[rejected]` und lösen es
- **10 Min:** Phase 4 – Reflexion und Aufräumen

Plant am Anfang **5 Minuten Puffer** für Verzögerungen ein (Token-Setup, Collaborator-Einladungen).

---

## Phase 1: Setup (10 Minuten)

### Schritt 1.1 – Maintainer legt das Repo an

**Nur die Maintainer-Person macht das.**

1. Auf <https://github.com/new> gehen.
2. **Repository name:** `team-workflow-uebung`.
3. **Public** wählen (einfacher für die Übung).
4. **„Add a README file"** aktivieren.
5. **Create repository**.

Auf der Repo-Seite die `README.md` mit dem Stift-Symbol öffnen und den Inhalt durch Folgendes ersetzen:

```markdown
# Team-Workflow-Übung

Übungs-Repo aus der 45-Min-Gruppenübung „Feature-Workflow im Team".

## Section A

(Dev A trägt sich hier ein)

## Section B

(Dev B trägt sich hier ein)

## Section C

(Dev C trägt sich hier ein)
```

(Bei fünft: noch eine `## Section D` ergänzen.)

Auf **Commit changes** klicken, Standard-Message lassen, **Commit changes** bestätigen.

Damit liegt der **Startstand** auf `main`.

### Schritt 1.2 – Collaborator einladen

Auf der Repo-Seite:

1. **Settings → Collaborators → Add people**.
2. GitHub-Username oder E-Mail von Dev A, B, C (ggf. D) eintragen, jeweils einladen.
3. Die Eingeladenen bekommen eine Mail/Benachrichtigung und müssen die Einladung **annehmen** (Glocken-Icon oben rechts → die Einladung öffnen → **Accept invitation**).

!!! warning "Ohne Annahme der Einladung kein Push"
    Wenn ein Dev die Einladung nicht annimmt, kann er das Repo zwar klonen, aber **nicht pushen**. Erst die Annahme freigibt die Schreibrechte. Schnell-Check zur Sicherheit: jede Person geht einmal auf `https://github.com/<MAINTAINER>/team-workflow-uebung/invitations` und klickt **Accept invitation**.

### Schritt 1.3 – Alle klonen

Jede Person, inklusive Maintainer, klont das Repo lokal:

=== "macOS / Linux / Git Bash"
    ```bash
    cd ~
    git clone https://github.com/<MAINTAINER-USERNAME>/team-workflow-uebung.git
    cd team-workflow-uebung
    ```

=== "Windows PowerShell"
    ```powershell
    Set-Location $HOME
    git clone https://github.com/<MAINTAINER-USERNAME>/team-workflow-uebung.git
    Set-Location team-workflow-uebung
    ```

=== "Windows CMD"
    ```cmd
    cd /d "%USERPROFILE%"
    git clone https://github.com/<MAINTAINER-USERNAME>/team-workflow-uebung.git
    cd team-workflow-uebung
    ```

Schnellcheck:

```bash
git log --oneline
git remote -v
```

Erwartet: ein oder zwei Commits auf `main`, `origin` zeigt auf das Repo des Maintainers.

!!! info "Personal Access Token bereit?"
    Spätestens beim ersten Push fragt GitHub nach Anmeldedaten. Username ist der GitHub-Name, Passwort ist der **Personal Access Token**, nicht das normale Passwort. Falls noch nicht erstellt: siehe [Praxis 4 → Schritt 5](praxis-github-neu.md#schritt-5-pushen-und-das-token-setup).

---

## Phase 2: Parallel arbeiten (15 Minuten)

**Jeder Dev arbeitet jetzt auf einem eigenen Branch.** Der Maintainer macht in dieser Phase nichts Eigenes – er ist bereit, später zu mergen.

### Aufgabenverteilung

| Rolle | Branch-Name | Aufgabe |
|---|---|---|
| **Maintainer** | – | Wartet, beobachtet, ist bereit für Reviews. Hat selbst keinen eigenen Feature-Branch in dieser Phase. |
| **Dev A** | `feature/section-a` | In der README den Platzhalter `(Dev A trägt sich hier ein)` durch zwei Zeilen ersetzen: eine Zeile mit deinem **Namen**, eine Zeile mit deiner **Lieblingsprogrammiersprache**. Zwei Commits machen. |
| **Dev B** | `feature/section-b` | In Section B dieselben zwei Informationen über dich ergänzen. Zwei Commits. |
| **Dev C** | `feature/section-c` | In Section C dieselben zwei Informationen über dich ergänzen. Zwei Commits. |

!!! warning "Jeder nur in **seiner eigenen** Section"
    A schreibt in Section A, B in Section B, C in Section C. **Niemand außerhalb seiner Section.** Sonst gibt es Konflikte, die wir hier bewusst vermeiden wollen – das Lernziel ist diesmal der saubere Push-Workflow, nicht die Konflikt-Auflösung.

### Schritt 2.1 – Branch lokal anlegen

Jeder Dev macht für sich:

```bash
git switch -c feature/section-a
```

(Branch-Name anpassen je nach Rolle.)

!!! info "Warum ein eigener Branch?"
    Damit alle parallel arbeiten können, ohne sich gegenseitig zu überschreiben. Auf `main` darf nichts halb-Fertiges landen – `main` ist „heilig". Mehr dazu im [Merksatz 10](merksaetze.md#10-im-team-main-ist-heilig).

### Schritt 2.2 – Erste Änderung, erster Commit

Im Editor `README.md` öffnen, in der eigenen Section die erste Information ergänzen. Beispiel für Dev A:

```markdown
## Section A

- Name: Anna Anders
```

Speichern. Im Terminal:

```bash
git add README.md
git commit -m "Section A: Namen ergänzen"
```

!!! info "Was Git dir hier sagt"
    ```text
    [feature/section-a a1b2c3d] Section A: Namen ergänzen
     1 file changed, 1 insertion(+), 1 deletion(-)
    ```

    **`[feature/section-a`** als Präfix bestätigt: der Commit liegt auf dem Feature-Branch, nicht auf `main`. Genau richtig.

### Schritt 2.3 – Zweite Änderung, zweiter Commit

Datei nochmal öffnen, zweite Information ergänzen:

```markdown
## Section A

- Name: Anna Anders
- Lieblingssprache: Python
```

```bash
git add README.md
git commit -m "Section A: Lieblingssprache ergänzen"
```

`git log --oneline` zeigt jetzt zwei Commits auf dem Feature-Branch und den ursprünglichen Maintainer-Commit auf `main`:

```text
b2c3d4e (HEAD -> feature/section-a) Section A: Lieblingssprache ergänzen
a1b2c3d Section A: Namen ergänzen
e5f6g7h (origin/main, main) Initial commit
```

### Schritt 2.4 – Branch pushen

```bash
git push -u origin feature/section-a
```

Erfolgsmeldung:

```text
...
To https://github.com/<MAINTAINER-USERNAME>/team-workflow-uebung.git
 * [new branch]      feature/section-a -> feature/section-a
branch 'feature/section-a' set up to track 'origin/feature/section-a'.
```

Das Schlüsselwort ist `[new branch]`. Der Branch ist jetzt auch auf GitHub sichtbar.

!!! info "Was bedeutet `-u`?"
    `-u` (kurz für `--set-upstream`) verknüpft deinen lokalen Branch mit dem Remote-Branch. Beim nächsten Push reicht `git push` ohne Argumente, weil Git sich gemerkt hat, wohin gepusht werden soll.

### Schritt 2.5 – Pull Request öffnen

Jeder Dev:

1. Im Browser zu `https://github.com/<MAINTAINER>/team-workflow-uebung`.
2. Direkt nach dem Push erscheint oben der gelbe Hinweis **„Compare & pull request"** → anklicken.
3. PR-Titel sinnvoll wählen, z.B.:

    | Branch | PR-Titel |
    |--------|----------|
    | `feature/section-a` | Section A: Anna Anders eintragen |
    | `feature/section-b` | Section B: Ben Bender eintragen |
    | `feature/section-c` | Section C: Carla Carlson eintragen |

4. Description kann kurz sein, z.B. „Mein Eintrag in der Übungs-README."
5. **Create pull request**.

Jetzt gibt es drei (oder vier) offene PRs gegen `main`.

### Schritt 2.6 – Kurz Reviews tauschen

Wenn noch Zeit ist, schaut sich jeder Dev **einen** PR von jemand anderem an (Tab **Files changed**). Wer Lust hat, hinterlässt einen kurzen Kommentar oder klickt **Approve**.

!!! tip "Reviews sind Kultur, nicht Zeremonie"
    Im echten Berufsalltag ist Code Review der Hauptort der Wissensweitergabe im Team. Auch wenn unsere Übungs-PRs trivial sind – nehmt euch 30 Sekunden, in einem fremden PR zu blättern. So gewöhnt ihr euch an den Workflow.

---

## Phase 3: Merge-Reihenfolge und der `[rejected]`-Fehler (10 Minuten)

Jetzt kommt der eigentliche Lerneffekt. **Maintainer übernimmt die Steuerung.**

### Schritt 3.1 – Maintainer merged der Reihe nach

Maintainer öffnet die drei PRs nacheinander und merged sie. **Reihenfolge: A → B → C.**

Pro PR:

1. **Merge pull request** → **Create a merge commit** → **Confirm merge** → **Delete branch**.
2. Kurz warten, bis GitHub den Merge bestätigt.

Nach allen drei Merges ist `main` auf GitHub um drei Merge-Commits weiter. **Lokal weiß niemand davon.**

### Schritt 3.2 – Jeder Dev macht einen kleinen Commit direkt auf main (ohne pullen!)

**Wichtig:** Diese Phase macht **bewusst** den Fehler, den im echten Projekt niemand machen würde. Sie ist der Lehrmoment. Niemand pullt, jeder versucht direkt zu pushen.

Jeder Dev:

```bash
git switch main
```

(Falls Git über ungespeicherte Änderungen meckert: die kurz mit `git stash` oder einem Commit auf dem Feature-Branch wegschaffen.)

Im Editor irgendeine kleine, persönliche Änderung an einer **neuen** Datei machen, z.B. eine Datei `notiz-<deinName>.md` anlegen:

```markdown
# Notiz von Anna
Die Übung läuft.
```

```bash
git add notiz-anna.md
git commit -m "Notiz von Anna"
```

Und jetzt der Versuch:

```bash
git push
```

### Schritt 3.3 – Der `[rejected]`-Fehler tritt auf

**Alle Devs** bekommen jetzt:

```text
To https://github.com/<MAINTAINER-USERNAME>/team-workflow-uebung.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/<MAINTAINER-USERNAME>/team-workflow-uebung.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

**Pause. Alle lesen die Meldung.**

!!! info "Warum kommt der Fehler bei allen?"
    Weil der Maintainer in Schritt 3.1 drei Merge-Commits auf `main` gemacht hat (auf GitHub). **Kein lokaler `main`** der drei Devs hat diese Commits – alle sind auf dem Stand **vor** den Merges. Wenn Git den Push einfach durchließe, würde er die drei Merges überschreiben. Das verhindert Git mit dem `[rejected]`.

    Der Wortlaut der `hint:`-Zeilen kann je nach Git-Version minimal anders aussehen – das entscheidende Signal ist immer `! [rejected]` und `(fetch first)`.

### Schritt 3.4 – Lösung: pullen, dann pushen

Jede Person, die abgelehnt wurde:

```bash
git pull
```

Reaktion (sehr wahrscheinlich): automatischer Merge-Commit, weil die Änderungen sich nicht überlappen.

```text
Merge made by the 'ort' strategy.
 README.md          | 6 +++++-
 1 file changed, 5 insertions(+), 1 deletion(-)
```

(Der Editor öffnet sich gegebenenfalls für die Merge-Commit-Message – Default akzeptieren, schließen.)

Jetzt erneut pushen:

```bash
git push
```

Erfolgsmeldung:

```text
...
To https://github.com/<MAINTAINER-USERNAME>/team-workflow-uebung.git
   e5f6g7h..i8j9k0l  main -> main
```

**Geschafft.** Der eigene Notiz-Commit ist jetzt auf `main`. Die Person, die als zweite pusht, könnte denselben `[rejected]` jetzt erneut erleben, weil zwischenzeitlich jemand anderes durch ist – das ist normal. Dann eben nochmal `git pull` und `git push`.

!!! warning "Niemals `git push --force`"
    In dieser Situation könnt ihr versucht sein, mit `git push --force` durchzubrechen. **Tut es nicht.** Force-Push überschreibt die Merge-Commits des Maintainers und zerstört die Arbeit der anderen.

    Im Team gilt: **`[rejected]` heißt `git pull`. Punkt.** Niemals `--force`.

### Schritt 3.5 – Endstand prüfen

Wenn alle durch sind, schauen alle:

```bash
git log --oneline --graph
```

Ihr seht die zusammengeflossene Geschichte: Merge-Commits vom Maintainer + Notiz-Commits + automatische Pull-Merges. Etwas verworren, aber instruktiv.

```bash
git status
```

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

Alle wieder synchron.

---

## Phase 4: Reflexion und Aufräumen (10 Minuten)

Setzt euch zusammen und sprecht durch:

| Frage | Antwort/Hintergrund |
|---|---|
| Warum haben **alle** Devs in Schritt 3.3 den `[rejected]` gesehen? | Weil alle drei einen lokalen Commit gemacht haben, bevor sie die drei Merge-Commits des Maintainers gepullt haben. **Jeder** lokale `main` war veraltet. Git lehnt jeden Push ab, der den Remote-Stand nicht enthält. |
| Was wäre die **saubere** Reihenfolge gewesen, anstatt zu pushen und auf `[rejected]` zu warten? | `git switch main` → **`git pull`** → dann erst die Notiz-Datei anlegen, committen, pushen. Reihenfolge sicher zu wissen: was auf Remote ist, war zuletzt da. |
| Warum wäre `git push --force` hier eine Katastrophe gewesen? | Es hätte die drei Merge-Commits des Maintainers **überschrieben**. Die Section-Einträge aller Devs wären weg, niemand hätte gemerkt wo. Die anderen müssten ihre Arbeit aus dem `reflog` rekonstruieren oder neu machen. |
| Wann darf man `--force` nutzen? | Nur in einem Repo, an dem **niemand sonst** arbeitet. Z.B. in einem persönlichen Sandbox-Repo. Im Team-Repo: niemals ohne Absprache. Wenn doch nötig, dann `--force-with-lease`. |
| Was lernen wir für den Alltag? | **Reflex:** vor jedem Push einmal `git status` und `git pull`. Lieber einmal zu viel pullen als einmal `[rejected]` zu bekommen. Im Team-Repo ist `git pull` so billig wie `git status`. |

### Optional: Setup aufräumen

Wenn ihr das Repo nicht mehr braucht:

- **Maintainer:** Repo → **Settings** → ganz nach unten → **Delete this repository**.
- **Alle:** den lokalen Ordner löschen.

=== "macOS / Linux / Git Bash"
    ```bash
    cd ~
    rm -rf team-workflow-uebung
    ```

=== "Windows PowerShell"
    ```powershell
    Set-Location $HOME
    Remove-Item -Recurse -Force team-workflow-uebung
    ```

=== "Windows CMD"
    ```cmd
    cd /d "%USERPROFILE%"
    rmdir /s /q team-workflow-uebung
    ```

Oder lasst es liegen als Spielfeld für weitere Experimente. Nimmt nichts weg.

---

## Troubleshooting während der Übung

Diese Sammlung deckt die häufigsten Stolperstellen der 45 Minuten ab. Wenn etwas hakt, hier zuerst nachschauen.

??? danger "Authentifizierung scheitert beim ersten Push"
    GitHub verlangt seit 2021 einen **Personal Access Token** statt eines Passworts.

    1. Auf GitHub → **Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token**.
    2. Mindestens das Recht **`repo`** anhaken. Ablaufzeit setzen (z.B. 30 Tage reichen für die Übung).
    3. Token kopieren (wird nur einmal angezeigt!).
    4. Beim Git-Push: Username = GitHub-Name, Passwort = der eben kopierte Token.

    Vollständige Anleitung in [Praxis 4 → Schritt 5](praxis-github-neu.md#schritt-5-pushen-und-das-token-setup).

??? warning "Einladung als Collaborator nicht angekommen / nicht annehmbar"
    Der Eingeladene geht direkt auf:

    ```text
    https://github.com/<MAINTAINER>/team-workflow-uebung/invitations
    ```

    Dort sollte der **Accept invitation**-Knopf erscheinen. Falls nicht:

    - Mailadresse im GitHub-Profil prüfen (Settings → Emails).
    - Maintainer entfernt den Eingeladenen unter Settings → Collaborators und lädt nochmal ein.

??? warning "Beim Push: „src refspec main does not match any""
    Tritt auf, wenn der lokale Branch leer ist oder noch nicht existiert.

    ```bash
    git branch
    ```

    Prüfen, ob du auf `main` stehst. Falls nicht:

    ```bash
    git switch main
    ```

    Falls `main` lokal nicht existiert (weil du gerade gecklont hast und etwas schiefging):

    ```bash
    git fetch
    git switch main
    ```

??? danger "Branch-Switch wird verweigert: „Your local changes would be overwritten""
    Du hast nicht-commitete Änderungen, die beim Wechsel verloren gingen.

    Drei Möglichkeiten:

    - **Committen** auf den aktuellen Branch:

        ```bash
        git add .
        git commit -m "Zwischenstand"
        git switch main
        ```

    - **Verwerfen**, wenn die Änderungen nicht wichtig sind:

        ```bash
        git restore .
        git switch main
        ```

    - **Stashen** für später:

        ```bash
        git stash
        git switch main
        # später wieder zurück
        git switch feature/section-a
        git stash pop
        ```

??? warning "PR-Knopf erscheint auf GitHub nicht"
    GitHub zeigt den gelben „Compare & pull request"-Banner nur direkt nach einem Push. Wenn der weg ist:

    1. Im Repo zum Tab **Pull requests**.
    2. **New pull request** klicken.
    3. **Base** auf `main`, **Compare** auf deinen Feature-Branch.
    4. Weiter wie üblich.

??? info "`git pull` öffnet plötzlich einen Editor"
    Das ist die **Merge-Commit-Message**. Default-Message lassen, Editor schließen.

    - **In vim:** `Esc` → `:wq` → `Enter`.
    - **In nano:** `Strg+O` → `Enter` → `Strg+X`.
    - **In VSCode** (mit `code --wait` als Editor): einfach den Tab im VSCode-Fenster schließen.

    Wenn du den Editor in Zukunft vermeiden willst, kannst du Pull auf Rebase umstellen:

    ```bash
    git config --global pull.rebase true
    ```

    Damit produziert `git pull` linear, ohne Merge-Commit. Aber Achtung: bei Konflikten ist Rebase etwas hakeliger. Für Anfänger ist Merge (Default) okay.

??? warning "Zweiter Dev bekommt `[rejected]` direkt nach dem ersten Lösungs-`git pull`"
    Das ist **normal** und passiert, wenn mehrere Devs gleichzeitig pullen und pushen wollen.

    Ablauf:
    1. Dev A pullt, pusht – durch.
    2. Dev B pullt, pusht – `[rejected]`, weil Dev A inzwischen weiter ist.
    3. Dev B pullt nochmal, pusht – durch.

    Die Lösung ist die gleiche wie beim ersten `[rejected]`: nochmal `git pull`, dann `git push`. Wiederholen, bis durch.

??? danger "Ich habe `--force` gepusht, der Maintainer-Merge ist weg"
    Aufpassen, das hätte nicht passieren dürfen. Aber kein Drama, solange jemand den Stand vorher noch lokal hat.

    1. Der **Maintainer** macht `git log --oneline` lokal und schaut, ob er die alten Commits noch sieht.
    2. Falls ja: der Maintainer macht `git push --force-with-lease`, um den eigenen Stand wiederherzustellen.
    3. Wenn niemand den alten Stand mehr hat: aus den Devs‑Feature-Branches die README-Einträge in ein neues PR überführen. Mehrarbeit, aber rettbar.

    **Lehre:** in echten Repos schaltet ihr **Branch Protection** an, damit so etwas gar nicht möglich ist. Setting → Branches → **Add classic branch protection rule** → Pattern `main` → „Require a pull request before merging" anhaken.

---

## Was ihr aus dieser Übung mitnehmen sollt

- Mehrere Personen am selben Repo arbeiten lassen ist **technisch problemlos**, solange jeder den Pull-Push-Reflex hat.
- Der **`[rejected]`-Fehler** ist kein Schaden, sondern ein Schutzmechanismus. Reaktion: `git pull`, dann erneut `git push`.
- **Niemals `--force` im Team-Repo.** Wenn ihr meint, ihr braucht es, fragt vorher die anderen.
- Der **Maintainer-Workflow** (alles über PRs, `main` ist heilig) ist auch in kleinen Teams sinnvoll. Er schützt euch vor den Push-Konflikten, die sonst entstehen.
- **Vor jedem Branch und vor jedem Push: `git pull`.** Das ist ein Reflex, kein Befehl.

---

## Lust auf mehr?

Wenn ihr die 45 Minuten überlebt habt und Lust auf eine längere Variante habt:

- **[Gruppenübung 1: Merge-Konflikt im Team lösen](gruppen-uebung.md)** (60 Min) – die andere Gruppenübung mit absichtlich provoziertem Merge-Konflikt.
- **Rollentausch:** dieselbe Übung nochmal, jeder spielt eine andere Rolle. Wer war Maintainer, ist jetzt Dev. So lernt jeder beide Seiten.
- **Branch Protection einbauen:** im Repo Settings → Branches → „Require a pull request before merging" anhaken. Dann darf niemand direkt auf `main` pushen, auch nicht der Maintainer – alles muss über PRs.

---

## Merksatz

!!! success "Merksatz"
    > **Im Team ist Pullen so wichtig wie Pushen. `[rejected]` heißt nie „Schaden", sondern „du hast die letzten Sekunden verpasst – hol sie nach". `git pull` → `git push`. Niemals `--force`. Wer den Reflex hat, sieht den `[rejected]`-Fehler im Alltag nie wieder.**

---

## Weiterlesen

- [Typische Git-Workflows in der Praxis](workflows.md): die drei Workflows hier nochmal als Solo-Übungen
- [Gruppenübung 1: Merge-Konflikt im Team lösen](gruppen-uebung.md): die andere Gruppenübung, mit Merge-Konflikt-Fokus
- [Stolpersteine](stolpersteine.md): wenn etwas im Team-Workflow hakt
- [Merksätze](merksaetze.md): die Kern-Sätze des ganzen Blocks
