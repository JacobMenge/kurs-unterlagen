---
title: "Cheatsheet: Git"
description: "Die wichtigsten Git-Befehle als Tabellen und Snippets zum schnellen Nachschlagen: lokal, Branches, Remote, GitHub, Konflikt-Auflösung."
---

# Cheatsheet: Git

!!! info "Bezug zum Block"
    Die Erklärungen findest du im [Git-Block](../git/index.md), die Hands-on-Praxis in [Praxis 1–6](../git/praxis-erste-schritte.md).

## Konfiguration (einmalig)

```bash
# Identität
git config --global user.name "Vorname Nachname"
git config --global user.email "deine.adresse@example.com"

# Default-Branch
git config --global init.defaultBranch main

# Editor (Beispiel VSCode)
git config --global core.editor "code --wait"

# Konfiguration anzeigen
git config --global --list
```

## Lokales Arbeiten

| Befehl | Zweck |
|--------|-------|
| `git init` | aktuellen Ordner zum Repository machen |
| `git status` | Was sieht Git gerade? In welchem Zustand sind die Dateien? |
| `git add <datei>` | Datei stagen |
| `git add .` | alle Änderungen im aktuellen Ordner stagen |
| `git commit -m "..."` | neuer Commit aus dem, was gestaged ist |
| `git commit --amend -m "..."` | Message des letzten Commits ändern (nur vor Push) |
| `git log` | Historie ausführlich |
| `git log --oneline` | kompakt, eine Zeile pro Commit |
| `git log --oneline --graph --all` | grafische Übersicht aller Branches |
| `git diff` | Working Tree vs. letzter Commit |
| `git diff --staged` | Staging-Area vs. letzter Commit |
| `git restore <datei>` | Working-Tree-Änderungen verwerfen |
| `git restore --staged <datei>` | Datei vom Vorbereitungstisch nehmen, Inhalt bleibt |
| `git rm <datei>` | Datei löschen und im selben Commit aus dem Repo nehmen |
| `git mv <alt> <neu>` | Datei umbenennen, Git erkennt es als Rename |

## Branches

| Befehl | Zweck |
|--------|-------|
| `git branch` | alle lokalen Branches, aktueller mit `*` |
| `git branch -r` | alle Remote-Branches (Tracking) |
| `git branch -a` | alle Branches (lokal + Remote) |
| `git switch <name>` | auf bestehenden Branch wechseln |
| `git switch -c <name>` | neuen Branch anlegen + wechseln |
| `git branch -M <name>` | aktuellen Branch umbenennen (z.B. `master → main`) |
| `git branch -d <name>` | Branch löschen (nur wenn gemergt) |
| `git branch -D <name>` | Branch löschen, auch wenn nicht gemergt |
| `git merge <branch>` | genannten Branch in den aktuellen mergen |
| `git merge --no-ff <branch>` | Merge erzwingen, auch bei möglichem Fast-Forward |
| `git merge --abort` | laufenden Merge abbrechen |

## Stash – Arbeit zwischenparken

```bash
git stash               # aktuelle Änderungen wegstapeln
git stash list          # was liegt im Stash?
git stash pop           # neueste Änderung zurück + von Stash entfernen
git stash apply         # zurück, aber im Stash behalten
git stash drop          # neueste Änderung wegwerfen
```

Praktisch, wenn du mitten in einer Arbeit bist und kurz einen anderen Branch brauchst.

## Remote und GitHub

| Befehl | Zweck |
|--------|-------|
| `git clone <URL>` | Remote-Repo lokal holen, `origin` eingerichtet |
| `git clone <URL> <ordner>` | wie oben, aber mit eigenem Zielordner-Namen |
| `git remote -v` | konfigurierte Remotes anzeigen |
| `git remote add origin <URL>` | Remote mit Namen `origin` hinzufügen |
| `git remote set-url origin <URL>` | URL eines bestehenden Remote ändern |
| `git remote remove origin` | Remote entfernen |
| `git fetch` | neue Commits vom Remote holen, ohne mergen |
| `git fetch --prune` | dabei verwaiste Tracking-Branches aufräumen |
| `git pull` | `fetch` + `merge` in aktuellen Branch |
| `git pull --rebase` | `fetch` + `rebase` statt `merge` |
| `git push` | aktuellen Branch zum Remote |
| `git push -u origin <branch>` | erster Push mit Tracking-Setup |
| `git push origin --delete <branch>` | Branch auf dem Remote löschen |

## Bei Fehlern und Konflikten

```bash
# Konflikt während eines Merges?
# 1. In der Datei die Marker <<<<<<<, =======, >>>>>>> beseitigen
# 2. Datei anpassen, speichern
git add <datei>
git commit            # Merge-Commit (vorbereitete Message)

# Komplett zurück auf vor dem Merge
git merge --abort
```

Wenn beim Push „rejected (non-fast-forward)" kommt:

```bash
git pull
# ggf. Konflikte lösen
git push
```

## Häufige Snippets

### Neuer Feature-Branch und Push

```bash
git switch main
git pull
git switch -c feature/<name>
# Arbeiten, committen
git push -u origin feature/<name>
```

### Nach gemergtem PR aufräumen

```bash
git switch main
git pull
git branch -d feature/<name>
git fetch --prune
```

### Schneller Blick auf den Stand

```bash
git status              # Working Tree + Staging
git log --oneline -5    # letzte 5 Commits
git branch -vv          # Branches mit Tracking-Info
```

### Eine bestimmte Datei aus einem alten Commit zurückholen

```bash
git log --oneline -- <datei>     # finde die SHA
git checkout <sha> -- <datei>    # nur diese Datei aus dem alten Stand
```

### Letzten Commit komplett rückgängig machen (lokal)

```bash
# Sanft: Änderungen bleiben im Working Tree
git reset --soft HEAD~1

# Hart: alles wird verworfen
git reset --hard HEAD~1
```

!!! warning "`reset --hard` ist endgültig"
    Mit `--hard` verlierst du sowohl Commit als auch Working-Tree-Änderungen. Nur lokal sinnvoll. Niemals nach einem Push.

## Aliase für Faule

```bash
git config --global alias.s "status -s"
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.co "checkout"
git config --global alias.br "branch"
git config --global alias.cm "commit -m"
```

Dann reicht `git lg` für eine kompakte grafische Historie.

---

## Personal Access Token (GitHub, HTTPS)

GitHub fragt seit 2021 nicht mehr nach dem normalen Passwort.

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic).
2. **Generate new token (classic)**.
3. Mindestens Recht `repo`. Sinnvolle Laufzeit setzen.
4. **Token kopieren** (siehst du nur einmal).
5. Beim ersten `git push` als Passwort eingeben. Git Credential Manager merkt es sich.

Mehr in [Praxis 4 → Schritt 5](../git/praxis-github-neu.md#schritt-5-pushen-und-das-token-setup).

---

## `.gitignore` – Vorlagen

Beispiel für Python-Projekte:

```text
# Editor
.vscode/
*.swp
.DS_Store

# Python
__pycache__/
*.py[cod]
.venv/
venv/

# Build / Distribution
build/
dist/
*.egg-info/

# Tests / Coverage
.coverage
.pytest_cache/
```

Beispiel für Node:

```text
node_modules/
npm-debug.log
.env
dist/
build/
```

Mehr Vorlagen unter <https://github.com/github/gitignore>.

---

## Häufige Fehler – Express-Lösung

| Fehler | Erste Maßnahme |
|--------|----------------|
| `Please tell me who you are` | `git config --global user.name`/`user.email` setzen |
| `nothing to commit, working tree clean` (trotz Änderung) | falsches Verzeichnis oder `.gitignore`-Filter prüfen |
| `! [rejected] non-fast-forward` | `git pull`, dann `git push` |
| Authentifizierung fehlgeschlagen | Personal Access Token nutzen, nicht das Passwort |
| `refusing to merge unrelated histories` | `git pull --allow-unrelated-histories` |
| `error: The branch X is not fully merged` | `git branch -D` (Großbuchstabe) – aber nur wenn du sicher bist |
| Branch-Wechsel blockiert | `git stash` oder vorher committen |
| Merge-Marker `<<<<<<<` in der Datei | mit `git diff --check` aufspüren, manuell entfernen |
| Token funktioniert nicht mehr | neuen Token erzeugen, alten im Credential Manager löschen |

---

## Workflow-Patterns

### Feature-Branch (Standard)

```text
main → feature/<name> → PR → main
```

### Bugfix-Branch

```text
main → bugfix/<beschreibung> → PR → main
```

### Hotfix in Produktion

```text
main → hotfix/<beschreibung> → PR → main (+ ggf. release-Branch)
```

### Open Source via Fork

```text
upstream/main → Fork → feature-Branch → PR an upstream/main
```

---

## Lokale Tools, die helfen

| Tool | Was es macht |
|------|--------------|
| [GitHub Desktop](https://desktop.github.com/) | GUI mit Diff-Viewer und einfachem Commit-/Push-Flow |
| [SourceTree](https://www.sourcetreeapp.com/) | starke GUI mit Branch-Visualisierung |
| [Git Graph (VSCode-Extension)](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) | grafische Historie im Editor |
| [Lazygit](https://github.com/jesseduffield/lazygit) | TUI für Git, schnell und tastaturlastig |
| [`gh` CLI](https://cli.github.com/) | GitHub im Terminal: PRs öffnen, Issues, Releases |

CLI bleibt das, was du immer hast. Eine GUI ist Komfort obendrauf.

---

Für ausführlichere Erklärungen:

- [Warum Git?](../git/warum-git.md)
- [Grundbegriffe](../git/grundbegriffe.md)
- [Branches und Merge](../git/branches-und-merge.md)
- [Remote und GitHub](../git/remote-und-github.md)
- [Stolpersteine](../git/stolpersteine.md)
