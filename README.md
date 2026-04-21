# Kursunterlagen – Virtualisierung & Docker

Nachschlagewerk zu meinen Kursen rund um **Virtualisierung** und **Docker**.
Gebaut mit [MkDocs](https://www.mkdocs.org/) + [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) und automatisch über GitHub Pages veröffentlicht.

Mehr über mich und andere Projekte: <https://jacob-decoded.de>

---

## Live-Version

Sobald das Repo unter `<username>/kurs-unterlagen` auf GitHub liegt und Pages aktiviert ist, läuft die Seite unter:

```
https://<username>.github.io/kurs-unterlagen/
```

---

## Einmalige Einrichtung (das musst du selbst tun)

Damit das Ganze als GitHub Page online geht, brauchst du **fünf kurze Schritte**. Das dauert keine 10 Minuten.

### 1. GitHub-Repository anlegen

- Gehe auf <https://github.com/new>.
- Name: **`kurs-unterlagen`** (exakt so, damit `site_url` passt – kannst du später ändern, siehe Schritt 4).
- Sichtbarkeit: **Public** (für Pages ohne bezahltes Konto nötig).
- **Keine** README, `.gitignore` oder License mitanlegen – das haben wir schon.
- **Create repository** klicken.

### 2. Lokales Projekt mit GitHub verbinden

Im Terminal im Projektordner (`/Users/jacobmenge/Desktop/kurs-unterlagen`):

```bash
# Git-Repo initialisieren (falls noch nicht geschehen)
git init -b main

# Alle Dateien stagen
git add .

# Ersten Commit erstellen
git commit -m "Initial kurs-unterlagen: Virtualisierung, Docker, Aufbau, Compose, Profi"

# GitHub-Remote verbinden (Username ersetzen!)
git remote add origin https://github.com/<DEIN-USERNAME>/kurs-unterlagen.git

# Hochladen
git push -u origin main
```

### 3. GitHub Pages aktivieren

- Auf der GitHub-Repo-Seite: **Settings → Pages**.
- Unter **Source** → **GitHub Actions** auswählen (nicht „Deploy from branch"!).
- Speichern.

### 4. `site_url` in `mkdocs.yml` anpassen (falls dein Username nicht `JacobMenge` ist)

Öffne `mkdocs.yml`. Oben steht:

```yaml
site_url: "https://jacobmenge.github.io/kurs-unterlagen/"
```

Ersetze `jacobmenge` durch deinen GitHub-Username (kleingeschrieben). Beispiel:

```yaml
site_url: "https://mein-github-name.github.io/kurs-unterlagen/"
```

Auch in `mkdocs.yml` das GitHub-Repository-Link anpassen:

```yaml
extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/<DEIN-USERNAME>/kurs-unterlagen
```

Dann:

```bash
git add mkdocs.yml
git commit -m "site_url an Username anpassen"
git push
```

### 5. Deploy abwarten

- GitHub startet den Workflow automatisch nach dem Push.
- Auf der Repo-Seite: **Actions-Tab** öffnen, du siehst den Workflow „Deploy MkDocs to GitHub Pages" laufen.
- Nach 1–2 Minuten: **grüner Haken** → die Seite ist live.
- URL: `https://<DEIN-USERNAME>.github.io/kurs-unterlagen/`

!!! tip "Fehler beim ersten Deploy?"
    - Falls `mkdocs build --strict` im Workflow fehlschlägt, schau in die Actions-Logs – meist ein YAML-Syntax-Fehler oder ein kaputter interner Link.
    - Falls „Pages" nicht aktiv ist: siehe Schritt 3. Unter Settings → Pages muss **GitHub Actions** ausgewählt sein.

---

## Ab hier: ganz normaler Git-Workflow

Jede Änderung, die du pushst, wird **automatisch neu deployed**:

```bash
# Änderung machen
vim docs/docker/warum-docker.md

# Lokal prüfen
mkdocs serve

# Wenn alles passt:
git add .
git commit -m "Docker-Block: Kapitel ergänzt"
git push
```

Nach dem Push dauert es 1–2 Minuten, bis die neue Version online ist.

---

## Lokal arbeiten

Einmalig eine virtuelle Umgebung anlegen und Abhängigkeiten installieren:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Dann den Entwicklungsserver starten:

```bash
mkdocs serve
```

Danach im Browser: <http://127.0.0.1:8000/kurs-unterlagen/>

Änderungen an Markdown- oder CSS-Dateien werden automatisch neu geladen.

---

## Produktions-Build

```bash
mkdocs build --strict
```

Der fertige statische Output liegt dann in `site/`. `--strict` verhindert den Build bei jeder Warnung (kaputte Links etc.).

---

## Projekt-Struktur

```
docs/
├── index.md                        # Startseite
├── virtualisierung/                # Block 1: VMs, Hypervisor, Multipass
├── docker/                         # Block 2: Docker-Einführung
├── docker-aufbau/                  # Block 3: Volumes, ENV, Netzwerke
├── docker-compose/                 # Block 4: Compose
├── docker-profi/                   # Block 5: Best Practices, Image-Optimierung
├── cheatsheets/                    # Spickzettel für Multipass, Docker, Compose
├── glossar.md                      # Alle Fachbegriffe erklärt
├── includes/abbreviations.md       # Auto-Verlinkung für Begriffe
├── stylesheets/extra.css           # Terminal-Design
└── javascripts/glossar-links.js    # Glossar-Klicklogik
```

Die Navigation wird automatisch aus `.pages`-Dateien in den jeweiligen Ordnern
erzeugt (Plugin: `mkdocs-awesome-pages-plugin`). Neue Markdown-Seiten erscheinen
ohne manuelle Einträge in `mkdocs.yml`.

---

## Deployment

Der Workflow unter `.github/workflows/deploy.yml` baut die Seite bei jedem Push
auf `main` und veröffentlicht sie auf GitHub Pages.

- Baut mit `mkdocs build --strict` → bricht bei Broken Links ab
- Cached pip-Dependencies
- Deployment via `actions/deploy-pages@v4`

---

## Lizenz der Inhalte

Die Texte dieses Repositories stelle ich als Lernmaterial frei zur Verfügung.
Das Branding der Marke „Jacob Decoded" (Logo, Wortmarke, Layout) ist davon
ausgenommen.
