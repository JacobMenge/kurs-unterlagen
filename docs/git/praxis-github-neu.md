---
title: "Praxis 4: Repo auf GitHub erstellen und klonen"
description: "Schritt-für-Schritt: GitHub-Repo neu anlegen, lokal klonen, ersten Commit pushen, Online-Edit ausprobieren und mit git pull synchronisieren. Mit Personal-Access-Token-Setup für Windows 11."
---

# Praxis 4: Repo auf GitHub erstellen und klonen

!!! abstract "Ziel"
    In **etwa 30 Minuten** legst du auf GitHub ein neues Repository an, klonst es lokal, machst dort einen Commit und schickst ihn zurück. Du erlebst auch, was passiert, wenn jemand auf GitHub direkt etwas ändert – und wie du das lokal abholst.

    Am Ende kannst du:

    - ein **neues Repo auf GitHub** anlegen, inklusive Sichtbarkeit und README
    - das Repo mit **`git clone`** lokal holen, inklusive vorkonfiguriertem `origin`-Remote
    - lokal arbeiten, commiten und mit **`git push`** auf GitHub schieben
    - eine Änderung **direkt auf GitHub** im Web-Editor machen
    - mit **`git pull`** die Änderung lokal abholen
    - einen **Personal Access Token** anlegen und für Authentifizierung nutzen

---

## Voraussetzungen

- Du hast einen **GitHub-Account**. Anlegen unter <https://github.com/signup>, kostenlos.
- Du hast die [Praxis 1](praxis-erste-schritte.md), [2](praxis-branches.md) und [3](praxis-merge-konflikt.md) durchgespielt – du kennst `init`, `add`, `commit`, `log`, `branch`, `merge`.
- Du bist eingeloggt auf <https://github.com>.

---

## Was wir bauen

Ein neues Repo, klein und unkompliziert. Wir nutzen es bewusst nicht für etwas Großes, sondern als Spielfeld für den Remote-Workflow.

```mermaid
flowchart LR
  STEP1["1. Repo auf GitHub anlegen"] --> STEP2["2. lokal klonen"]
  STEP2 --> STEP3["3. lokal Commit"]
  STEP3 --> STEP4["4. git push"]
  STEP4 --> STEP5["5. auf GitHub Edit"]
  STEP5 --> STEP6["6. git pull"]
```

---

## Schritt 1: Neues Repo auf GitHub anlegen

1. Im Browser <https://github.com/new> öffnen.
2. **Repository name**: `mein-erstes-remote-repo`.
3. **Description** (optional): „Übungs-Repo aus dem Git-Block.".
4. **Public** lassen. Public-Repos sind für unsere Übungszwecke einfacher: keine Limitierungen, du kannst die URL teilen.
5. Unter **Initialize this repository with** den Schieberegler **„Add a README file"** nach rechts schieben (aktivieren). Damit wird das Repo nicht komplett leer angelegt, sondern mit einer initialen `README.md`. Das ist wichtig, damit `git clone` etwas zu klonen hat.
6. **Add .gitignore** auf „None" lassen.
7. **Add a license** auf „None" lassen.
8. **Create repository** klicken.

Du landest auf der Repo-Startseite. Sieht ungefähr so aus:

```text
mein-erstes-remote-repo
└── README.md
```

Oben rechts steht ein grüner **Code**-Knopf. Den brauchen wir gleich.

!!! tip "Workflow Permissions (für später)"
    Wir brauchen das für diesen Block nicht. Aber für [CI/CD](../ci-cd/index.md) später: im Repo unter **Settings → Actions → General → Workflow permissions** kannst du einstellen, ob deine Workflows in das Repo schreiben dürfen (z.B. Pakete pushen, Releases anlegen). Standard ist lesend. Für dieses Repo egal.

---

## Schritt 2: Repo-URL kopieren

Auf der Repo-Startseite oben rechts:

1. **Code**-Knopf klicken.
2. Reiter **HTTPS** wählen (Default).
3. Die URL daneben kopieren. Sie sieht so aus:

    ```text
    https://github.com/<DEIN-USERNAME>/mein-erstes-remote-repo.git
    ```

    Mit `.git` am Ende, das gehört dazu.

!!! info "SSH lassen wir vorerst weg"
    SSH ist eine Alternative für die Authentifizierung. Sie ist auf Dauer angenehmer, aber das Setup ist ein Extra-Schritt. In dieser Praxis bleiben wir bei HTTPS. Beim ersten `git push` fragt Git nach Anmeldedaten – wir lösen das mit einem **Personal Access Token** (siehe Schritt 5).

---

## Schritt 3: Lokal klonen

Ein gutes Heimatverzeichnis für deine Projekte: das Home-Verzeichnis oder ein `projekte`-Unterordner. Wir nehmen das Home.

=== "macOS / Linux / Git Bash"
    ```bash
    cd ~
    git clone https://github.com/<DEIN-USERNAME>/mein-erstes-remote-repo.git
    cd mein-erstes-remote-repo
    ```

=== "Windows PowerShell"
    ```powershell
    Set-Location $HOME
    git clone https://github.com/<DEIN-USERNAME>/mein-erstes-remote-repo.git
    Set-Location mein-erstes-remote-repo
    ```

=== "Windows CMD"
    ```cmd
    cd /d "%USERPROFILE%"
    git clone https://github.com/<DEIN-USERNAME>/mein-erstes-remote-repo.git
    cd mein-erstes-remote-repo
    ```

`<DEIN-USERNAME>` durch deinen GitHub-Namen ersetzen.

Beim Klonen sagt Git ungefähr:

```text
Cloning into 'mein-erstes-remote-repo'...
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Compressing objects: 100% (2/2), done.
Unpacking objects: 100% (3/3), 1.05 KiB | 1.05 MiB/s, done.
```

Du bist jetzt in einem neuen Ordner mit der `README.md` aus GitHub und einem komplett eingerichteten Git-Repository.

Prüfen:

```bash
git log --oneline
```

```text
abc1234 (HEAD -> main, origin/main, origin/HEAD) Initial commit
```

Wichtige Beobachtungen:

- Es gibt einen **Initial commit**, den GitHub beim Anlegen automatisch gemacht hat.
- HEAD zeigt auf `main` und **`origin/main`** zeigt auch dort hin. `origin/main` ist der **Tracking-Branch** aus den [Theorie-Seiten](remote-und-github.md#was-sind-tracking-branches). Er sagt: „so weit ist `main` auf dem Remote, beim letzten Stand."
- **`origin`** ist der Name, unter dem dein lokales Repo den Remote kennt.

```bash
git remote -v
```

```text
origin  https://github.com/<DEIN-USERNAME>/mein-erstes-remote-repo.git (fetch)
origin  https://github.com/<DEIN-USERNAME>/mein-erstes-remote-repo.git (push)
```

Das ist die Adresse von `origin`, einmal fürs Holen, einmal fürs Pushen (in der Praxis dieselbe URL).

---

## Schritt 4: Lokal arbeiten und committen

Öffne `README.md` und bau eine kleine Sektion hinzu:

```markdown
# mein-erstes-remote-repo

Übungs-Repo aus dem Git-Block.

## Was ich heute lerne

- Repo auf GitHub anlegen
- klonen
- lokal committen
- pushen und pullen
```

Speichern. Im Terminal:

```bash
git add README.md
git commit -m "README: Lernpfad für heute beschreiben"
```

```text
[main b2c3d4e] README: Lernpfad für heute beschreiben
 1 file changed, 6 insertions(+)
```

Schauen wir uns die Lage an:

```bash
git status
```

```text
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean
```

Genau das mentale Bild: lokal hast du **einen Commit mehr** als der Remote. Git sagt dir sogar den nächsten Befehl: `git push`.

---

## Schritt 5: Pushen – und das Token-Setup

```bash
git push
```

Was jetzt passiert, hängt davon ab, ob du auf diesem Rechner schon mal auf GitHub gepusht hast.

**Fall A: erstes Mal Push auf diesem Rechner**

Du wirst nach Anmeldedaten gefragt – entweder direkt im Terminal oder über ein Browser-Popup vom Git Credential Manager. Auf Windows ist das oft ein Browser-Fenster mit GitHub-Login.

**Username**: dein GitHub-Username.
**Passwort**: ein **Personal Access Token** (PAT), **nicht** dein normales Passwort. GitHub akzeptiert seit 2021 keine Passwörter mehr für git-Operationen.

### Personal Access Token erstellen

1. Auf GitHub eingeloggt sein.
2. Oben rechts auf dein Profilbild klicken → **Settings**.
3. Links im Menü ganz unten: **Developer settings**.
4. **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**.
5. **Note**: irgendwas Sprechendes, z.B. „Kurs-Laptop".
6. **Expiration**: 30, 60, 90 Tage – such was Sinnvolles aus. Längere Token sind bequemer, kürzere sicherer.
7. **Select scopes**: für unsere Zwecke reicht **`repo`** (vollständig anhaken). Das gibt dem Token Schreibrechte auf alle deine Repos.
8. Ganz unten **Generate token** klicken.
9. **TOKEN KOPIEREN**. Du siehst ihn nur einmal. Wenn du das Fenster schließt, ist er weg und du musst einen neuen erstellen.

Im Terminal: Token als Passwort einfügen. Auf Windows in der PowerShell oder im Credential-Manager-Browser-Fenster einfügen.

!!! tip "Git Credential Manager merkt sich das"
    Beim ersten Push einmal Username + Token eingeben. Auf Windows speichert der Git Credential Manager beides automatisch in der Windows-Anmeldeinformations-Verwaltung. Beim nächsten Push fragt Git nicht mehr nach.

    Auf macOS macht das die Keychain. Auf Linux gibt es verschiedene Backends. Im Zweifel: einmal eingeben, dann läuft es.

Erwartete Push-Ausgabe:

```text
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 412 bytes | 412.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0), pack-reused 0
To https://github.com/<DEIN-USERNAME>/mein-erstes-remote-repo.git
   abc1234..b2c3d4e  main -> main
```

Geschafft. Dein Commit liegt jetzt auch auf GitHub.

Prüfen:

```bash
git status
```

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

`up to date with 'origin/main'` – lokal und remote sind auf demselben Stand. Sauberer Zustand.

Im Browser auf <https://github.com/<DEIN-USERNAME>/mein-erstes-remote-repo> gehen. Reload. Du siehst deinen Commit und die neue README-Sektion.

---

## Schritt 6: Direkt auf GitHub editieren

Wir bauen jetzt absichtlich nach, was passiert, wenn **außerhalb deines lokalen Repos** etwas geändert wird. In der echten Welt ist das oft eine Kollegin oder ein PR-Merge. Wir machen es selbst.

1. Auf GitHub im Repo bleiben.
2. Auf die `README.md` klicken.
3. Oben rechts auf das **Stift-Symbol** („Edit this file") klicken.
4. Eine neue Zeile am Ende einfügen:

    ```markdown
    *Diese Zeile wurde direkt auf GitHub eingefügt.*
    ```

5. Unten den **Commit changes**-Knopf klicken.
6. Im Dialog die Default-Message lassen oder anpassen.
7. **Commit directly to the `main` branch** auswählen.
8. Auf **Commit changes** klicken.

Du bist zurück auf der Repo-Seite. Der neue Commit ist da. Aber: **lokal weißt du nichts davon**.

Probier es aus. Im Terminal:

```bash
git log --oneline
```

```text
b2c3d4e (HEAD -> main, origin/main) README: Lernpfad für heute beschreiben
abc1234 Initial commit
```

Lokal siehst du nur die zwei Commits von vorher. Logisch: Git holt nichts automatisch. Es muss explizit nach Updates fragen.

---

## Schritt 7: Den Online-Stand abholen

```bash
git pull
```

Erwartete Ausgabe:

```text
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 3 (delta 1), reused 0 (delta 0), pack-reused 0
Unpacking objects: 100% (3/3), 391 bytes | 391.00 KiB/s, done.
From https://github.com/<DEIN-USERNAME>/mein-erstes-remote-repo
   b2c3d4e..c3d4e5f  main       -> origin/main
Updating b2c3d4e..c3d4e5f
Fast-forward
 README.md | 2 ++
 1 file changed, 2 insertions(+)
```

Schau in `README.md` im Editor: die online-Zeile ist jetzt auch lokal da.

```bash
git log --oneline
```

```text
c3d4e5f (HEAD -> main, origin/main) Update README.md
b2c3d4e README: Lernpfad für heute beschreiben
abc1234 Initial commit
```

Beide Stände sind wieder identisch. **`git pull`** hat unter der Haube zwei Sachen getan: `git fetch` (holt neue Commits in den Tracking-Branch) und `git merge` (mergt sie in deinen lokalen Branch). Weil es einen geraden Vorlauf war, gab es einen Fast-Forward.

---

## Schritt 8: Was, wenn beide Seiten etwas geändert haben?

Jetzt der spannende Fall: beide Seiten haben **gleichzeitig** etwas an `README.md` geändert. Wir bauen das absichtlich nach.

### Lokale Änderung

Öffne `README.md` und füg ans Ende ein:

```markdown
*Das hier ist eine lokale Änderung.*
```

Speichern, stagen, committen:

```bash
git add README.md
git commit -m "README: lokale Zeile angehängt"
```

### Gleichzeitig: Änderung auf GitHub

Im Browser zu deinem Repo, Stift-Symbol an der `README.md`, eine andere Zeile am Ende einfügen:

```markdown
*Das hier ist eine GitHub-Online-Änderung.*
```

Commit changes auf `main`.

### Push versuchen

```bash
git push
```

Git verweigert:

```text
To https://github.com/<DEIN-USERNAME>/mein-erstes-remote-repo.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/<DEIN-USERNAME>/mein-erstes-remote-repo.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
```

Git schützt dich. Auf dem Remote gibt es Commits, die du lokal nicht hast – wenn dein Push einfach durchginge, gingen die verloren. Git verlangt: zuerst integrieren, dann pushen.

### Pull mit Auto-Merge

```bash
git pull
```

Wenn die beiden Änderungen unterschiedliche Zeilen betreffen (was hier wahrscheinlich der Fall ist), kann Git automatisch mergen:

```text
remote: ...
From https://github.com/<DEIN-USERNAME>/mein-erstes-remote-repo
   c3d4e5f..d4e5f6g  main       -> origin/main
Merge made by the 'ort' strategy.
 README.md | 2 ++
 1 file changed, 2 insertions(+)
```

Es entsteht ein **Merge-Commit**. Schauen wir uns das an:

```bash
git log --oneline --graph
```

```text
*   m6n7o8p (HEAD -> main) Merge branch 'main' of https://github.com/...
|\
| * d4e5f6g (origin/main) Update README.md
* | f6g7h8i README: lokale Zeile angehängt
|/
* c3d4e5f Update README.md
* b2c3d4e README: Lernpfad für heute beschreiben
* abc1234 Initial commit
```

Genau wie in [Praxis 2](praxis-branches.md): zwei Linien, die mergen. Die Online-Änderung und deine lokale, in einem Merge-Commit zusammengeführt.

### Jetzt pushen

```bash
git push
```

Ausgabe:

```text
...
   d4e5f6g..m6n7o8p  main -> main
```

Im Browser den Reload, sieh den Merge-Commit auf GitHub.

!!! info "Was wenn beide dieselbe Zeile geändert hätten?"
    Genau dann hätte es einen **Konflikt** gegeben – wie in [Praxis 3](praxis-merge-konflikt.md). Du würdest die Konflikt-Marker in der Datei sehen, manuell auflösen, `git add` + `git commit`, dann `git push`. Das Vorgehen ist identisch, egal ob die andere Änderung lokal oder online entstand.

---

## Schritt 9: Repo aufräumen oder behalten

Du kannst das Repo behalten. Wir nutzen es als Ausgangspunkt für [Praxis 6](praxis-pull-request.md).

Wenn du löschen willst:

- **Auf GitHub**: Repo → Settings → ganz nach unten → **Delete this repository**. Bestätigen, Repo-Name eingeben, fertig.
- **Lokal**: den Ordner löschen, siehe Anleitung am Ende von [Praxis 1](praxis-erste-schritte.md#aufraumen-oder-weitermachen).

---

## Wichtige Befehle dieser Praxis

| Befehl | Zweck |
|--------|-------|
| `git clone <URL>` | Remote-Repo lokal holen, inklusive eingerichtetem `origin` |
| `git push` | lokale Commits zum Remote schieben |
| `git pull` | neue Commits vom Remote holen und in den aktuellen Branch mergen |
| `git remote -v` | konfigurierte Remotes mit URL anzeigen |
| `git fetch` | neue Commits holen, **ohne** automatisch zu mergen (manuelle Kontrolle) |

---

## Was du jetzt verstanden hast

- `git clone` erledigt drei Sachen auf einmal: Ordner anlegen, Repo herunterladen, `origin` einrichten.
- Lokale Commits sind **nicht automatisch** auf dem Remote. Erst `git push` schiebt sie.
- Remote-Commits sind **nicht automatisch** lokal. Erst `git pull` holt sie.
- Wenn lokal und remote parallel weiterentwickelt wurden, läuft `git pull` als Merge ab.
- Bei einem Push, wenn der Remote weiter ist, lehnt Git ab und schützt dich vor Datenverlust.
- Personal Access Token = Passwort-Ersatz auf GitHub. Einmal eintippen, der Git Credential Manager merkt es sich.

---

## Häufige Stolperfallen

??? warning "Push wird abgelehnt mit `non-fast-forward`"
    Das ist der Schutzmechanismus. Auf dem Remote gibt es Commits, die du noch nicht hast. Tu Folgendes:

    ```bash
    git pull
    git push
    ```

    Falls beim `git pull` ein Konflikt auftaucht: wie in [Praxis 3](praxis-merge-konflikt.md) auflösen, dann `git push`.

??? warning "Authentifizierung fehlgeschlagen"
    Auf Windows kommt manchmal ein Browser-Fenster mit GitHub-Login. Schließe es nicht. Logge dich ein und autorisier die Anmeldung.

    Falls du die Anmeldung über Token machst und es klemmt: prüfe, ob der Token noch gültig ist (im GitHub-Tab Settings → Developer settings → Tokens). Abgelaufene Token werden weiterhin akzeptiert für `clone`, aber für `push` brauchst du einen frischen.

??? warning "`fatal: not a git repository`"
    Du bist im falschen Verzeichnis. `cd` ins richtige Verzeichnis. Mit `git rev-parse --show-toplevel` zeigt Git an, was sein Repo-Root wäre – wenn dieser Befehl fehlschlägt, bist du wirklich außerhalb.

??? info "Token im Klartext im Terminal-Verlauf"
    Wenn du den Token einmal als Passwort eingegeben hast, taucht er **nicht** im Shell-History auf (die meisten Eingabe-Prompts werden nicht gespeichert). Trotzdem: für andere Wege wie URL mit eingebettetem Token (`https://USER:TOKEN@github.com/...`) gibt es einen History-Eintrag. Diese URL-Variante vermeiden.

---

## Merksatz

!!! success "Merksatz"
    > **Repo auf GitHub anlegen, `git clone <URL>` holt es lokal mit fertig eingerichtetem `origin`. `git push` schiebt deine Commits hoch, `git pull` holt fremde herunter. Auf Windows ist der Personal Access Token dein Passwort-Ersatz, einmal eingegeben merkt sich Git ihn.**

---

## Weiterlesen

- [Praxis 5: lokales Repo zu GitHub bringen](praxis-lokal-zu-github.md): wenn du den umgekehrten Weg brauchst
- [Praxis 6: Pull Request über Branch](praxis-pull-request.md): der wichtigste Team-Workflow
