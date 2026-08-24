# Kursunterlagen – Systemintegration und Vernetzung

Begleitmaterial zum Lehrgang **Geprüfter Berufsspezialist für Systemintegration und
Vernetzung** (IHK). Gebaut mit [MkDocs](https://www.mkdocs.org/) und
[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/), automatisch über
GitHub Pages veröffentlicht.

**Live:** <https://jacobmenge.github.io/kurs-unterlagen/>

---

## Aufbau

Die Unterlagen folgen den drei Themenschwerpunkten des Lehrgangs:

| Bereich | Inhalt |
|---|---|
| **Thema 1 – Planung, Konzeptionierung, Integration** | Netzwerke, Virtualisierung, Container, Infrastruktur- und Architekturplanung |
| **Thema 2 – Sicherstellung des laufenden Betriebs** | Verfügbarkeit, Backup und Wiederanlauf, Monitoring, Softwareverteilung, Orchestrierung, CI/CD |
| **Thema 3 – Qualitätssicherung und IT-Sicherheit** | Risikomanagement, Sicherheitskonzepte, Sicherheitsvorfälle, Tests, Übergabe |

Dazu Werkzeug- und Nachschlagebereiche (Git, Cheatsheets, Glossar) sowie eine
Einordnung der beiden Schwerpunkte, die von anderer Seite unterrichtet werden.

```
docs/
├── index.md                    Startseite
├── fahrplan.md                 Roter Faden durch den Kurs
├── thema-1.md … thema-3.md     Übersicht je Themenschwerpunkt
├── weitere-themen.md           Einordnung von Recht und Projektmanagement
├── kurs/                       Kursinfo, Prüfungsformat, FAQ
├── netzwerke/ … testen-qualitaet/   Fachblöcke
├── cheatsheets/                Befehlsübersichten
├── glossar.md                  Fachbegriffe
├── includes/abbreviations.md   Automatische Glossar-Verlinkung
├── stylesheets/extra.css       Design
└── javascripts/glossar-links.js
folien/                         Foliensätze (pptxgenjs)
apps/                           Beispielanwendungen für die Praxisübungen
```

Die Navigation wird über `.pages`-Dateien gesteuert
(Plugin `mkdocs-awesome-pages-plugin`). Die oberste Gliederung steht in `docs/.pages`,
die Reihenfolge innerhalb eines Blocks in der jeweiligen `.pages` des Ordners.

---

## Wiederverwendbarkeit

Die Unterlagen sind so geschrieben, dass sie **für jeden Kursdurchlauf unverändert
nutzbar** sind. Konkrete Datumsangaben und kurslaufspezifische Hinweise stehen
ausschließlich im Abschnitt „Termine dieses Kurses" in `docs/kurs/index.md`.

Bei einem neuen Durchlauf genügt es, diesen einen Abschnitt zu aktualisieren.

---

## Lokal arbeiten

Einmalig eine virtuelle Umgebung anlegen:

**macOS / Linux**

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**Windows PowerShell**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Kommt beim Aktivieren `running scripts is disabled`, einmalig
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` ausführen.

Entwicklungsserver starten:

```bash
mkdocs serve
```

Dann im Browser <http://127.0.0.1:8000/kurs-unterlagen/> öffnen. Änderungen an
Markdown- und CSS-Dateien werden automatisch neu geladen.

Produktions-Build prüfen:

```bash
mkdocs build --strict
```

`--strict` bricht bei jeder Warnung ab, insbesondere bei kaputten internen Links.

---

## Folien

Die Foliensätze liegen unter `folien/` und werden mit
[pptxgenjs](https://gitbrent.github.io/PptxGenJS/) erzeugt.

```bash
cd folien
npm install                       # einmalig
node 00-orientierung.js           # Foliensatz bauen -> dist/
../.venv/bin/python qa.py dist/00-orientierung.pptx
```

`lib/theme.js` enthält das gemeinsame Design und alle Bausteine (Titelfolien,
Abschnittstrenner, Karten, Zeitstrahl, Ablauftabellen, Code-Blöcke). Ein neuer
Foliensatz ist damit ein kurzes Skript.

`qa.py` prüft die fertige Datei auf Textüberläufe, Elemente außerhalb der Folie,
überlappende Textkästen und vergessene Platzhalter.

---

## Beispielanwendungen

Unter `apps/` liegen die Anwendungen, die in den Praxisübungen verwendet werden –
etwa der Monitoring-Stack, die Kubernetes-Manifeste und das Helm-Chart. Die
zugehörigen Anleitungen stehen jeweils im passenden Block der Dokumentation.

---

## Deployment

`.github/workflows/deploy.yml` baut die Seite bei jedem Push auf `main` und
veröffentlicht sie auf GitHub Pages:

- Build mit `mkdocs build --strict`, bricht bei kaputten Links ab
- pip-Abhängigkeiten werden zwischengespeichert
- Veröffentlichung über `actions/deploy-pages@v4`

Nach dem Push dauert es ein bis zwei Minuten, bis die neue Fassung online ist.

---

## Lizenz der Inhalte

Die Texte dieses Repositories stelle ich als Lernmaterial frei zur Verfügung.
