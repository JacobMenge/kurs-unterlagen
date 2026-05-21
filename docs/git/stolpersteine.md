---
title: "Stolpersteine Git"
description: "Typische Probleme bei Git: Konfiguration, Commits, Branches, Push, Pull, Konflikte, Remote, Personal Access Token, Line Endings. Mit ausklappbaren Schnell-Fixes."
---

# Stolpersteine Git

Diese Seite sammelt typische Git-Probleme – nach Themen sortiert. Bei jedem Stolperstein findest du **eine Diagnose** und **einen konkreten Fix**.

!!! info "Erste Anlaufstelle: `git status`"
    Bei fast jedem Problem ist `git status` der erste Befehl. Er sagt dir, in welchem Zustand dein Repo ist und welche Aktion Git als nächstes erwartet. Lies die Ausgabe sorgfältig.

---

## Konfiguration

??? danger "`Please tell me who you are` beim ersten Commit"
    Du hast vor dem ersten Commit keine Identität konfiguriert.

    **Schnell-Fix:**

    ```bash
    git config --global user.name "Vorname Nachname"
    git config --global user.email "deine.adresse@example.com"
    ```

    Danach den Commit erneut versuchen. Mehr in [Git installieren → Erstkonfiguration](installation.md#erstkonfiguration).

??? warning "Default-Branch heißt bei dir `master`, in allen Anleitungen aber `main`"
    Du hast `init.defaultBranch` nicht gesetzt.

    **Schnell-Fix in einem bestehenden Repo:**

    ```bash
    git branch -M main
    ```

    **Dauerhaft für alle neuen Repos:**

    ```bash
    git config --global init.defaultBranch main
    ```

??? info "`git config --list` zeigt zu viele oder fehlende Einträge"
    Git liest Konfiguration aus drei Stellen:

    - System-weit: `/etc/gitconfig` (Admin-Rechte zum Ändern)
    - Pro Benutzer: `~/.gitconfig` (das mit `--global`)
    - Pro Repo: `.git/config` (das ohne `--global`, im aktuellen Repo)

    Auflisten nach Quelle:

    ```bash
    git config --system --list
    git config --global --list
    git config --local --list
    ```

    So findest du heraus, woher ein Wert kommt.

---

## Erste Commits, Staging

??? warning "`nothing to commit, working tree clean`, obwohl du Änderungen gemacht hast"
    Sehr wahrscheinlich bist du im falschen Verzeichnis oder die Änderung wurde nicht gespeichert. Prüfen:

    ```bash
    pwd                  # aktuelles Verzeichnis
    ls                   # Dateien sichtbar?
    git rev-parse --show-toplevel    # Repo-Root
    ```

    Falls die Datei wirklich geändert ist, hat sie eventuell eine **`.gitignore`**-Regel, die sie ausschließt:

    ```bash
    git check-ignore -v <datei>
    ```

    Das zeigt die `.gitignore`-Regel, die die Datei filtert, oder schweigt, wenn keine Regel zutrifft.

??? warning "Du hast eine Datei gestaged, die du nicht stagen wolltest"
    Mit `--staged` rückgängig machen:

    ```bash
    git restore --staged <datei>
    ```

    Die Datei wandert vom Vorbereitungstisch zurück auf den Lesetisch. Inhalt bleibt unverändert.

??? warning "Du hast versehentlich eine sensible Datei (z.B. `.env`) committet"
    **Wenn der Commit noch nicht gepusht ist**, kannst du ihn rückgängig machen:

    ```bash
    git rm --cached .env
    git commit --amend
    ```

    Der `--amend` ersetzt den letzten Commit ohne die Datei. Dann unbedingt `.env` in deine `.gitignore` aufnehmen.

    **Wenn schon gepusht**: die Datei ist in der Historie sichtbar, auch wenn du sie jetzt löschst. Bei wirklich sensiblen Inhalten (Passwörter, API-Keys) gilt:

    1. Den **Secret-Wert sofort rotieren** (Passwort ändern, Token neu generieren).
    2. Optional die Historie umschreiben mit Tools wie [`git filter-repo`](https://github.com/newren/git-filter-repo) und `git push --force`. Komplex und nur für eigene Repos sinnvoll.

??? info "Du willst die Message des letzten Commits ändern"
    **Wenn noch nicht gepusht:**

    ```bash
    git commit --amend -m "Korrekte Message"
    ```

    **Wenn schon gepusht**: vermeide das, weil es die SHA ändert. Wenn du es trotzdem machen musst, brauchst du danach `git push --force`. Im Team ein Tabu.

---

## Branches

??? warning "Du hast einen Branch angelegt, bist aber noch auf dem alten"
    ```bash
    git branch
    ```

    Das Sternchen `*` zeigt deinen aktuellen Branch. Wenn du dachtest, du sei auf dem neuen Branch:

    ```bash
    git switch <branch-name>
    ```

??? danger "Branch lässt sich nicht löschen: `error: The branch X is not fully merged`"
    Sicherheitsbremse: Git verweigert das Löschen, weil der Branch Commits enthält, die nicht in einen anderen Branch gemergt wurden. Du würdest die Arbeit verlieren.

    **Wenn du sicher bist, dass der Branch weg darf:**

    ```bash
    git branch -D <branch-name>
    ```

    (Großes `D`.) Verlust ist endgültig.

    **Sicherer ist:** den Branch erst mergen oder in einen anderen schieben, dann mit `-d` löschen.

??? warning "Branch-Wechsel funktioniert nicht: „Your local changes would be overwritten"
    Du hast ungespeicherte Änderungen im Working Tree, die auf dem anderen Branch zu Konflikten führen würden.

    **Drei Optionen:**

    1. Änderungen committen, dann wechseln.
    2. Änderungen verwerfen mit `git restore .`, dann wechseln.
    3. Änderungen mit `git stash` zwischenparken:

        ```bash
        git stash
        git switch <branch>
        # später zurück
        git switch <ursprünglicher-branch>
        git stash pop
        ```

??? info "Du willst sehen, welche Branches schon in `main` gemergt sind"
    ```bash
    git branch --merged main
    ```

    Alles, was hier auftaucht, kannst du gefahrlos mit `git branch -d` löschen.

    Umgekehrt:

    ```bash
    git branch --no-merged main
    ```

    Zeigt Branches, die noch nicht in `main` sind – das sind Kandidaten für laufende Arbeit oder vergessene Experimente.

---

## Merges und Konflikte

??? danger "Du steckst mitten in einem Merge fest und willst raus"
    ```bash
    git merge --abort
    ```

    Damit ist der Merge komplett zurückgerollt, als wäre er nie gestartet. Working Tree zurück auf den Zustand vor `git merge`. Du kannst dir sammeln und neu versuchen.

??? warning "Merge-Marker (`<<<<<<<`) versehentlich in der Datei gelassen"
    Vorbeugen: kurz nach jedem Konflikt-Merge:

    ```bash
    git diff --check
    ```

    Das warnt, wenn noch Marker übrig sind.

    Falls schon committet: Datei korrigieren, neu committen mit `git commit --amend`.

??? warning "Konflikt-Auflösung soll genau einer Seite folgen, ohne manuelles Editieren"
    Während eines Merges kannst du eine ganze Datei mit einer Seite überschreiben:

    ```bash
    git checkout --ours <datei>       # nimmt deine Seite (HEAD)
    git checkout --theirs <datei>     # nimmt die andere Seite
    git add <datei>
    git commit
    ```

    Mit `--ours` / `--theirs` umgehst du das manuelle Editieren – nimm das nur, wenn du wirklich nichts von der anderen Seite behalten willst.

??? info "Du willst nach einem Merge sehen, wer was beigetragen hat"
    ```bash
    git log --oneline --graph --all
    ```

    Die Grafik zeigt Merge-Commits und die zusammenfließenden Linien. `git show <merge-commit-sha>` zeigt den Merge-Commit selbst inklusive Konfliktauflösung.

---

## Push, Pull und Remote

??? danger "`! [rejected]   main -> main (non-fast-forward)`"
    Auf dem Remote gibt es Commits, die du lokal nicht hast. Git schützt dich.

    **Standard-Vorgehen:**

    ```bash
    git pull
    git push
    ```

    Wenn `git pull` einen Konflikt produziert: wie in [Praxis 3](praxis-merge-konflikt.md) lösen, dann pushen.

    **Niemals mit `--force` umgehen, ohne zu wissen, was du tust.** In Team-Repos ist Force-Push tabu.

??? danger "Authentifizierung fehlgeschlagen beim Push"
    Auf GitHub seit 2021 kein Passwort mehr, sondern **Personal Access Token**.

    - Token erstellen: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic). Mindestens Recht `repo`.
    - Beim Push als Passwort eingeben.
    - Auf Windows merkt sich der Git Credential Manager das automatisch. Auf macOS die Keychain.

    Mehr in [Praxis 4 → Schritt 5](praxis-github-neu.md#schritt-5-pushen-und-das-token-setup).

??? warning "`fatal: remote origin already exists`"
    Du versuchst, `origin` neu anzulegen, obwohl er schon existiert.

    ```bash
    git remote set-url origin <neue-URL>
    ```

    Oder entfernen und neu hinzufügen:

    ```bash
    git remote remove origin
    git remote add origin <URL>
    ```

??? warning "`fatal: refusing to merge unrelated histories`"
    Beim `git pull` zwischen einem lokalen Repo mit eigenen Commits und einem Remote, der schon eigene Initial-Commits hatte (z.B. README, License).

    ```bash
    git pull --allow-unrelated-histories
    ```

    Achtung: das produziert oft Konflikte (z.B. wenn beide eine `README.md` haben). Lösen wie üblich.

??? info "Du willst sehen, ob du gepusht hast oder noch nicht"
    ```bash
    git status
    ```

    Zeigt Zeilen wie „Your branch is ahead of 'origin/main' by 2 commits" oder „up to date with 'origin/main'".

??? info "Du willst alle veralteten lokalen Tracking-Branches loswerden"
    Nach jedem `git fetch --prune` entfernt Git Tracking-Branches, deren Remote-Gegenstück nicht mehr existiert:

    ```bash
    git fetch --prune
    ```

    Praktisch nach Feature-Merges, wenn die Branches auf GitHub gelöscht wurden.

---

## Klonen und Repo-Setup

??? warning "Beim Klonen kommt nur `fatal: repository ... not found`"
    Häufige Ursachen:

    1. Tippfehler in der URL. Genauer hinschauen.
    2. Repo ist privat und du bist nicht eingeloggt / nicht eingeladen.
    3. Du hast `https://` mit dem Web-URL verwechselt (`https://github.com/user/repo` statt `https://github.com/user/repo.git` – beides funktioniert in modernen Git-Versionen, aber bei alten Versionen ist `.git` Pflicht).

??? warning "Klonen läuft, aber `cd` ins Verzeichnis findet ihn nicht"
    Standardmäßig erstellt `git clone` einen Ordner mit dem Repo-Namen. Wenn der Klon-Befehl andere Erwartungen weckt:

    ```bash
    git clone <URL> <eigener-name>
    ```

    Damit kommt der Ordner unter `<eigener-name>` zu liegen.

??? info "Du willst nur einen einzigen Branch klonen, nicht das ganze Repo"
    ```bash
    git clone --depth 1 --branch <branch-name> <URL>
    ```

    Spart Platz und Zeit bei großen Repos, wenn du wirklich nur den aktuellen Stand brauchst (ohne Historie).

---

## Personal Access Token und Authentifizierung

??? danger "Token funktioniert nicht mehr, obwohl er vorher ging"
    GitHub-Token haben ein **Verfallsdatum**. Standard ist 30 Tage. Prüfen unter GitHub → Settings → Developer settings → Personal access tokens.

    **Neuen Token erstellen, mit längerer Laufzeit.** Auf dem alten gespeicherten Token musst du den Credential Manager neu fragen lassen, indem du beim nächsten Push das gespeicherte Passwort entfernst:

    === "Windows"
        Systemsteuerung → Anmeldeinformationsverwaltung → Windows-Anmeldeinformationen → den Eintrag `git:https://github.com` löschen.

    === "macOS"
        Schlüsselbund-Verwaltung öffnen → `github.com` suchen → Eintrag löschen.

    === "Linux"
        Bei `git-credential-libsecret`: `secret-tool clear ...`. Variiert je nach Distribution. Alternativ: `~/.git-credentials` öffnen und Eintrag entfernen.

    Beim nächsten Push fragt Git wieder nach Anmeldedaten und du gibst den neuen Token an.

??? warning "Du willst einen URL mit eingebettetem Token nicht benutzen"
    Gut so. URLs wie

    ```text
    https://USER:TOKEN@github.com/...
    ```

    speichern den Token in `.git/config` **und** im Shell-Verlauf. Das ist unsicher.

    Stattdessen Token über den Credential Manager. Einmal beim Push eingeben, Git merkt es sich. Sicher und bequem.

---

## Windows-spezifische Stolperfallen

??? warning "Line Endings: Datei wird beim Klonen plötzlich „geändert""
    Wenn ein Kollege auf Linux gepusht hat und du auf Windows arbeitest, kann `git status` direkt nach dem Klon sagen „modified" – obwohl du nichts gemacht hast. Hintergrund: die `core.autocrlf`-Einstellung übersetzt automatisch zwischen `LF` und `CRLF`.

    Empfohlene Konfiguration für Windows:

    ```bash
    git config --global core.autocrlf true
    ```

    Auf macOS / Linux:

    ```bash
    git config --global core.autocrlf input
    ```

    Mehr Hintergrund in [Git installieren → Line Endings](installation.md#schritt-2-installer-ausfuhren).

??? warning "Git Bash startet im falschen Verzeichnis"
    Per Standard startet Git Bash in deinem Home-Verzeichnis (`/c/Users/<DEIN-NAME>`). Klick mit der rechten Maustaste in einen Ordner im Explorer → **„Git Bash here"** öffnet die Git Bash direkt in diesem Ordner.

??? warning "Pfade auf Windows: Backslash oder Forward-Slash?"
    In Git-Befehlen und in `.gitignore` immer **Forward-Slash** verwenden (`/`), auch auf Windows:

    ```text
    docs/private/        # nicht docs\private\
    ```

    In normalen Windows-Befehlen (CMD, PowerShell) ist beides okay. Git selbst nutzt intern immer Forward-Slashes.

??? info "Pfad mit Leerzeichen funktioniert nicht in der CMD"
    In CMD oder PowerShell müssen Pfade mit Leerzeichen in Anführungszeichen:

    === "PowerShell"
        ```powershell
        Set-Location "C:\Users\Dein Name\Projekte"
        ```

    === "CMD"
        ```cmd
        cd "C:\Users\Dein Name\Projekte"
        ```

    In Git Bash mit Forward-Slash und Anführungszeichen:

    ```bash
    cd "/c/Users/Dein Name/Projekte"
    ```

---

## Wenn nichts hilft

??? info "Systematisches Debugging"
    1. **`git status` lesen.** Genau, jede Zeile.
    2. **`git log --oneline --graph --all` lesen.** Wo stehst du? Wo ist `origin/main`? Wer ist „ahead"?
    3. **`git remote -v` prüfen.** Stimmt die URL?
    4. **`git config --list` prüfen.** Stimmen Name, E-Mail, Default-Branch?
    5. **Repository neu klonen** als letzte Option. Wenn du keine wertvolle lokale Arbeit hast, ist das oft der schnellste Weg aus einem unklaren Zustand.

!!! tip "Vorbeugend"
    - **Vor neuen Branches** immer `git pull` auf `main`.
    - **Nach jedem Merge** Branches sauber löschen.
    - **Bei größeren Operationen** vorher mit `git log` und `git status` orientieren.
    - **`git stash` nutzen**, wenn du mitten in der Arbeit unterbrochen wirst.
    - **`.gitignore` rechtzeitig anlegen**, bevor du sensible Dateien anfasst.

---

## Hilfe direkt in Git

Git hat eine eingebaute Hilfe. Sehr nützlich, wenn du einen Befehl unsicher bist:

```bash
git help <befehl>
```

Zum Beispiel `git help merge` öffnet die ausführliche Doku zu `git merge`. Im Browser auch unter <https://git-scm.com/docs>.

Für eine kurze Übersicht:

```bash
git <befehl> --help
git <befehl> -h
```

---

## Weiterlesen

- [Merksätze](merksaetze.md): die Kern-Sätze des Blocks
- [Cheatsheet Git](../cheatsheets/git.md): alle Befehle kompakt
- [Praxis-Seiten](praxis-erste-schritte.md): wenn du etwas konkret nachschlagen willst
