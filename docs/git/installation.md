---
title: "Git installieren"
description: "Git auf Windows 11, macOS und Linux installieren – mit offiziellen Links, Erstkonfiguration (Name, E-Mail, Editor, Default-Branch) und Troubleshooting für typische Stolperfallen."
---

# Git installieren

!!! abstract "Ziel dieser Seite"
    Nach dieser Seite hast du:

    - **Git auf deinem Rechner installiert**
    - mit `git --version` geprüft, dass die Installation läuft
    - **Name** und **E-Mail** in Git konfiguriert
    - **`main`** als Default-Branch eingestellt
    - einen Standard-Editor für Commit-Messages festgelegt
    - die wichtigsten Stolperfallen pro Betriebssystem gesehen

!!! info "Schon installiert?"
    Wenn `git --version` bei dir eine Versionsnummer ausgibt, kannst du direkt zum Abschnitt [Erstkonfiguration](#erstkonfiguration) springen.

---

## Welche Variante brauche ich?

| Plattform | Empfehlung | Bringt mit |
|-----------|------------|------------|
| **Windows 11** | [Git for Windows](https://git-scm.com/download/win) | Git, Git Bash, Git Credential Manager – alles in einem Installer |
| **macOS** | Über **Homebrew** oder die [Apple Command Line Tools](https://developer.apple.com/xcode/resources/) | Reine Kommandozeilen-Git, ohne GUI |
| **Linux** | Paketmanager der Distribution (`apt`, `dnf`, …) | Reine Kommandozeilen-Git |

Es gibt zusätzlich grafische Werkzeuge wie **GitHub Desktop**, **SourceTree** oder die Git-Integration in **VSCode**. Die kannst du parallel zum Kommandozeilen-Git installieren. In diesem Kurs arbeiten wir bewusst mit der Kommandozeile, weil du dort sieht, was wirklich passiert.

---

## Installation auf Windows 11

!!! info "Systemanforderungen Windows"
    - **Windows 11** oder **Windows 10 64-Bit**
    - **ca. 300 MB freier Plattenplatz**
    - **Administratorrechte** für die Installation (System-PATH-Eintrag)

### Schritt 1 – Installer herunterladen

**Download:** <https://git-scm.com/download/win>

Die Seite erkennt deine Architektur. Auf einem normalen Rechner nimmst du die **64-bit Git for Windows Setup**-Variante.

### Schritt 2 – Installer ausführen

Doppelklick auf die heruntergeladene `Git-2.xx.x-64-bit.exe`. Du klickst dich durch eine ganze Reihe Dialoge. Die Defaults sind heutzutage gut – einmal kurz erklärt, was wichtig ist:

| Dialog | Empfehlung | Warum |
|--------|-----------|-------|
| Lizenz | annehmen | Standardvorgang |
| Installationsort | `C:\Program Files\Git` lassen | passt für alle |
| Komponenten | Defaults belassen, Git Bash bleibt aktiv | Git Bash ist sehr nützlich |
| Startmenü | belassen | egal |
| **Default-Editor** | **„Use Visual Studio Code as Git's default editor"**, falls VSCode installiert ist; sonst „Use Notepad++" oder „Use Vim" | du musst hin und wieder Commit-Messages bearbeiten |
| **Default-Branch** | **„Override the default branch name for new repositories"** → `main` eintragen | moderner Standard |
| **PATH** | **„Git from the command line and also from 3rd-party software"** | sodass `git` in PowerShell, CMD und VSCode funktioniert |
| SSH | „Use bundled OpenSSH" | reicht für alles |
| HTTPS-Backend | „Use the OpenSSL library" | Standard |
| **Line endings** | **„Checkout Windows-style, commit Unix-style line endings"** | siehe Box unten |
| **Terminal** | „Use MinTTY" | bessere Git-Bash-Erfahrung |
| Defaults für `git pull` | „Default (fast-forward or merge)" | passt zu unseren Kursinhalten |
| Credential Manager | „Git Credential Manager" anhaken | merkt sich GitHub-Logins automatisch |
| **Experimentelle Optionen** | **nichts anhaken** | beta, Finger weg |

Mit „Install" startet die Installation. Dauert ein paar Minuten.

!!! warning "Line Endings auf Windows"
    Die Frage nach den Line Endings sorgt regelmäßig für Verwirrung. Kurz erklärt:

    - **Windows** speichert Zeilenenden traditionell als `CRLF` (zwei Zeichen).
    - **Unix-Systeme** (macOS, Linux) speichern sie als `LF` (ein Zeichen).
    - Wenn beide Welten an einem Repo arbeiten, gibt es ohne Regelung Mist im Diff.

    Mit der empfohlenen Einstellung **„Checkout Windows-style, commit Unix-style"** macht Git Folgendes:

    - Beim Auschecken (Dateien werden bei dir lokal sichtbar) → `CRLF`, damit Notepad und Co. die Datei normal anzeigen.
    - Beim Commit → `LF`, damit das Repo plattformübergreifend gleich aussieht.

    Das ist heute praktisch immer die richtige Wahl.

### Schritt 3 – Funktion prüfen

Drei Wege, ein Terminal zu öffnen – such dir einen aus:

- **PowerShell** über `Win + R` → `powershell` → `Enter`
- **CMD** über `Win + R` → `cmd` → `Enter`
- **Git Bash** über Start → „Git Bash"

In allen drei sollte funktionieren:

```bash
git --version
```

Erwartete Ausgabe ungefähr:

```text
git version 2.50.0.windows.1
```

Die genaue Versionsnummer wird bei dir natürlich anders sein.

??? danger "`git: command not found` oder `Der Befehl ... ist falsch geschrieben`"
    Git wurde zwar installiert, aber der **PATH** ist noch nicht gesetzt – oder du hast ein Terminal-Fenster offen, das vor der Installation gestartet wurde.

    Lösung:

    1. **Alle PowerShell-/CMD-Fenster schließen** und ein neues öffnen. Der PATH wird beim Start eines neuen Terminals gelesen.
    2. Klappt es immer noch nicht: prüfen, ob bei der Installation die Option **„Git from the command line and also from 3rd-party software"** gewählt wurde. Falls nicht, den Installer noch einmal laufen lassen und diese Option setzen.

??? warning "Git Bash startet, aber `notepad` öffnet sich nicht"
    Wenn du in Git Bash `notepad` aufrufst und nichts passiert, liegt das an den Pfaden. Nutze entweder den vollen Pfad (`C:/Windows/System32/notepad.exe`) oder einen anderen Editor. Für den Kurs ist das aber selten ein Problem, weil wir Commit-Messages über `-m "..."` setzen.

### Schritt 4 – Git Bash ausprobieren (optional)

Git Bash ist eine **Linux-ähnliche Shell** auf Windows, die mit Git mitgeliefert wird. Sie versteht `ls`, `cat`, `grep`, `ssh` und die ganzen Unix-Standardbefehle. Für viele Git-Workflows ist sie der angenehmste Ort zum Arbeiten.

Im Startmenü nach **„Git Bash"** suchen, starten. Du landest in deinem Benutzer-Home (`/c/Users/<DEIN-NAME>`). Probier:

```bash
pwd          # zeigt deinen aktuellen Pfad
ls           # listet Dateien
git --version
```

Funktioniert. Wenn du im Folgenden Kommandos aus den **„macOS / Linux"**-Tabs siehst, kannst du sie meist 1:1 in Git Bash benutzen.

---

## Installation auf macOS

!!! info "Systemanforderungen macOS"
    - **macOS 12 (Monterey) oder neuer**
    - **ca. 200 MB freier Plattenplatz**

### Variante 1 – über Homebrew (empfohlen)

Wenn du [Homebrew](https://brew.sh) installiert hast (das ist heutzutage Quasi-Standard auf Mac-Entwicklungsmaschinen), reicht ein Befehl:

```bash
brew install git
```

Homebrew installiert eine aktuelle Version und sorgt dafür, dass `git` im PATH liegt.

### Variante 2 – über die Xcode Command Line Tools

Wenn du keinen Homebrew willst, gibt es die Apple-eigene Variante. Beim ersten Aufruf von `git` schlägt macOS dir automatisch vor, die Command Line Tools zu installieren:

```bash
git --version
```

Falls Git fehlt, erscheint ein Dialog:

```text
The "git" command requires the command line developer tools.
Would you like to install the tools now?
```

Auf **Install** klicken, ein paar Minuten warten, fertig.

!!! info "Welche Variante ist besser?"
    Für die meisten reicht die Apple-Variante. Wenn du regelmäßig die aktuelle Git-Version willst (Apple verzögert manchmal um Monate), nimm Homebrew.

### Schritt 3 – Funktion prüfen

```bash
git --version
```

Erwartete Ausgabe:

```text
git version 2.50.0
```

??? warning "`xcrun: error: invalid active developer path`"
    Das passiert nach einem großen macOS-Update. Die Command Line Tools sind „verloren". Lösung:

    ```bash
    xcode-select --install
    ```

    Bestätigen, ein paar Minuten warten.

---

## Installation auf Linux

Linux-Distributionen bringen Git praktisch immer als Paket mit. Die Variante hängt von der Distribution ab:

=== "Ubuntu / Debian"
    ```bash
    sudo apt update
    sudo apt install git
    ```

=== "Fedora / RHEL"
    ```bash
    sudo dnf install git
    ```

=== "Arch / Manjaro"
    ```bash
    sudo pacman -S git
    ```

=== "openSUSE"
    ```bash
    sudo zypper install git
    ```

Prüfen:

```bash
git --version
```

Erwartete Ausgabe:

```text
git version 2.50.0
```

Auf Linux ist Git praktisch nie problematisch – wenn der Paketmanager erfolgreich war, läuft es.

---

## Erstkonfiguration

!!! warning "Diese drei Punkte müssen gesetzt sein, bevor du den ersten Commit machst"

    1. Dein **Name**
    2. Deine **E-Mail-Adresse**
    3. Der **Default-Branch-Name** (sollte `main` sein)

Sonst erscheint später beim ersten Commit eine Warnung und du bekommst eventuell zufällig generierte Werte. Die saubere Variante ist, das einmalig zu konfigurieren.

### Name und E-Mail setzen

Beide werden in jeden deiner Commits als Autor eingetragen. Bei öffentlichen Repos auf GitHub sind sie sichtbar.

```bash
git config --global user.name "Vorname Nachname"
git config --global user.email "deine.adresse@example.com"
```

!!! info "Welche E-Mail bei GitHub?"
    Wenn du auf GitHub pushen willst und deine E-Mail-Adresse nicht öffentlich zeigen möchtest, nutzt du am besten die **No-Reply-Adresse**, die GitHub für jeden Account bereitstellt. Sie hat das Format:

    ```text
    12345678+benutzername@users.noreply.github.com
    ```

    Wo du sie findest: GitHub → Settings → Emails → **„Keep my email addresses private"** anhaken, dann erscheint die No-Reply-Adresse darunter. Diese in `git config --global user.email "..."` eintragen.

### Default-Branch auf `main` setzen

Auf Git for Windows hast du das vermutlich schon im Installer eingestellt. Auf macOS und Linux ist es eine Zeile:

```bash
git config --global init.defaultBranch main
```

Damit heißt der Default-Branch in jedem neuen lokalen Repo `main` statt des alten `master`.

### Editor festlegen

Wenn du eine Commit-Message ohne `-m` machst, öffnet Git einen Editor. Standardmäßig ist das **vim** – das ist die Quelle vieler Anfänger-Tränen, weil das Schließen nicht offensichtlich ist. Stell den Editor auf etwas Komfortableres:

=== "VSCode"
    ```bash
    git config --global core.editor "code --wait"
    ```

=== "Notepad (Windows)"
    ```bash
    git config --global core.editor "notepad"
    ```

=== "Sublime Text"
    ```bash
    git config --global core.editor "subl -w"
    ```

=== "Nano (eingebaut auf Linux/macOS)"
    ```bash
    git config --global core.editor "nano"
    ```

=== "Vim (für die Mutigen)"
    ```bash
    git config --global core.editor "vim"
    ```

Speichern in vim, falls du doch landest: `Esc` → `:wq` → `Enter`. Verlassen ohne Speichern: `Esc` → `:q!` → `Enter`.

### Konfiguration prüfen

```bash
git config --global --list
```

Erwartete Ausgabe (gekürzt):

```text
user.name=Vorname Nachname
user.email=12345678+benutzer@users.noreply.github.com
init.defaultBranch=main
core.editor=code --wait
```

Wenn das so aussieht, ist die Erstkonfiguration fertig.

---

## Was hat sich `--global` gemerkt?

Die Option `--global` schreibt in eine Datei in deinem Benutzerverzeichnis:

| Plattform | Pfad |
|-----------|------|
| Windows | `C:\Users\<DEIN-NAME>\.gitconfig` |
| macOS | `/Users/<DEIN-NAME>/.gitconfig` |
| Linux | `/home/<DEIN-NAME>/.gitconfig` |

Du kannst sie auch direkt in einem Editor anschauen – ist eine reine Textdatei.

Die Einstellungen gelten für **alle Repositories**, die du auf diesem Rechner als dieser Benutzer anlegst. Brauchst du in einem bestimmten Repo eine andere Konfiguration (z.B. andere E-Mail-Adresse für Privatprojekte), kannst du sie pro Repo überschreiben:

```bash
cd mein-projekt
git config user.email "private.adresse@example.com"
```

Ohne `--global` gilt das nur in diesem einen Repo (gespeichert in `.git/config`).

---

## Optionale Komfort-Konfiguration

### Farbige Ausgabe (in modernen Git-Versionen Default)

```bash
git config --global color.ui auto
```

### Push-Verhalten

```bash
git config --global push.default simple
```

`simple` ist das moderne Default und tut, was die meisten erwarten: pushe genau den aktuellen Branch zu dem Branch gleichen Namens auf dem Remote.

### Pull-Verhalten

```bash
git config --global pull.rebase false
```

Damit verhält sich `git pull` als „fetch + merge", was zu unseren Kursinhalten passt. Wer mit `pull.rebase=true` arbeitet, baut beim Pullen seine Commits oben drauf um. Für Einsteiger ist `merge` das Sichere.

### Git-Aliase (für Faule)

Häufige Befehle abkürzen:

```bash
git config --global alias.s "status -s"
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.co "checkout"
git config --global alias.br "branch"
```

Danach reicht `git lg` für eine kompakte grafische Historie. Ist nicht zwingend, macht aber Spaß.

---

## Plan B: Git über das Web nutzen

Falls du Git lokal **nicht** installieren kannst (z.B. Firmenlaptop mit Sperre), gibt es Notausgänge:

- **github.dev** – online-Editor direkt in einem GitHub-Repo. Im Repo-URL einfach `github.com` durch `github.dev` ersetzen. Du kannst dort Dateien anlegen, ändern und committen, ohne lokales Git.
- **GitHub Codespaces** – komplette virtuelle Entwicklungsumgebung im Browser, mit echtem Terminal und Git. Kostenlos in eingeschränktem Umfang.
- **Direkt im Browser editieren** – auf GitHub kannst du jede Datei mit dem Stift-Symbol bearbeiten. Reicht für kleine Korrekturen.

Für diesen Kurs ist die lokale Installation aber die Idealvariante. Du lernst die Befehle, und sie sind später überall verwendbar.

---

## Was du jetzt erreicht hast

- Git ist installiert und mit `git --version` bestätigt.
- Name, E-Mail, Default-Branch und Editor sind konfiguriert.
- Du weißt, wo deine globale Konfiguration liegt und kannst sie pro Repo überschreiben.
- Du kennst die wichtigsten Optionen aus dem Windows-Installer.

---

## Häufige Stolperfallen

??? warning "Git-Befehle in VSCode funktionieren nicht, in PowerShell schon"
    VSCode hat sich seinen PATH gemerkt, bevor Git installiert wurde. VSCode komplett schließen und neu öffnen – nicht nur das Fenster, sondern den ganzen Prozess.

??? warning "`Please tell me who you are` beim ersten Commit"
    Du hast die Erstkonfiguration übersprungen. Schnell-Fix:

    ```bash
    git config --global user.name "Vorname Nachname"
    git config --global user.email "deine.adresse@example.com"
    ```

    Danach den Commit erneut probieren.

??? warning "Beim `git config` kommt nichts zurück"
    Das ist normal! `git config` gibt keinen Erfolgsmeldung aus. Prüfe mit `git config --global --list`, ob der Wert wirklich gespeichert ist.

??? danger "vim öffnet sich beim Commit und ich kann nicht raus"
    Klassiker. Ausgang:

    1. `Esc` drücken.
    2. `:q!` tippen.
    3. `Enter`.

    Damit verlässt du vim ohne zu speichern. Danach setze deinen Editor mit `git config --global core.editor "..."` auf etwas anderes (siehe oben).

??? info "Welche Git-Version brauche ich?"
    Alles ab Git 2.30 ist okay. Aktuell (Stand 2026) sind 2.50+. Brandneue Funktionen brauchst du im Kurs nicht. Wenn dein System eine **Uralt-Version** wie 1.x mitliefert (manche LTS-Linux-Distributionen), upgrade über den Paketmanager.

---

## Was du als Nächstes machst

Jetzt geht's los. Du baust dein erstes eigenes Repository und siehst die Begriffe aus der Theorie in Aktion.

→ Weiter mit [Praxis 1: erste Schritte lokal](praxis-erste-schritte.md).
