---
title: "Start"
description: "Kursunterlagen zur IT-Systemintegration und Vernetzung: Netzwerke, Virtualisierung, Container, Betrieb, Monitoring, IT-Sicherheit und Qualitätssicherung – mit Praxisübungen und Musterlösungen."
hide:
  - navigation
---

# Kursunterlagen – Systemintegration und Vernetzung

Willkommen. Hier findest du den kompletten Stoff zum Kurs **Geprüfter Berufsspezialist für Systemintegration und Vernetzung** – von Netzwerken und Virtualisierung über Container und Betrieb bis zu IT-Sicherheit und Qualitätssicherung.

Jeder Befehl, jede Erklärung und jede Übung aus dem Unterricht steht hier zum Nachlesen. Egal, ob du während des Kurses etwas überhört hast, zu Hause mitmachen willst oder später darauf zurückkommst.

<div class="grid cards" markdown>

-   :material-map-marker-path:{ .lg .middle } __Neu hier?__

    ---

    Der **[Fahrplan](fahrplan.md)** zeigt dir den roten Faden: welche Themen wann kommen, wie sie aufeinander aufbauen und wie ein Kursabend abläuft.

    [:octicons-arrow-right-24: Zum Fahrplan](fahrplan.md)

-   :material-information-outline:{ .lg .middle } __Organisatorisches__

    ---

    Ablauf, Regeln, Materialien und Ansprechpartner stehen in der **[Kursinfo](kurs/index.md)**. Dazu die **[Prüfung](kurs/pruefung.md)** im Detail und ein **[FAQ](kurs/faq.md)**.

    [:octicons-arrow-right-24: Zur Kursinfo](kurs/index.md)

</div>

!!! abstract "Was diese Seite ist – und was nicht"
    **Ist:** ein Nachschlagewerk. Jeder Befehl, den du im Unterricht siehst, steht hier mit Erklärung. Du kannst Schritt für Schritt mitlesen und alles zu Hause wiederholen.

    **Ist nicht:** ein Ersatz für den Kurs. Die Analogien, Diskussionen und Fragerunden leben vom gemeinsamen Unterricht. Die Unterlagen sind der rote Faden dazu.

---

## Die drei Themenschwerpunkte

Der Kurs ist in drei Blöcke gegliedert, die aufeinander aufbauen.

### :material-hammer-screwdriver: Thema 1 – Planung, Konzeptionierung, Integration

*Wie entsteht eine IT-Infrastruktur?* Das Fundament: Netze verstehen und planen, Systeme kapseln, Anwendungen in Container verpacken und aus alldem eine begründete Lösung entwerfen.

<div class="grid cards" markdown>

-   :material-lan:{ .lg .middle } __[Netzwerke](netzwerke/index.md)__

    ---

    OSI-Modell, IP-Adressierung, Subnetting, Routing, DNS und DHCP, Transport- und Anwendungsprotokolle, Industrie- und IoT-Protokolle, Segmentierung, VPN und Netzwerksicherheit.

-   :material-server-network:{ .lg .middle } __[Virtualisierung](virtualisierung/index.md)__

    ---

    Warum kapseln wir Systeme? Hypervisor-Typen, virtuelle Hardware, Werkzeuge im Vergleich – und die erste eigene virtuelle Maschine.

-   :material-docker:{ .lg .middle } __[Container mit Docker](docker/index.md)__

    ---

    Container gegen virtuelle Maschinen, Images bauen, Daten dauerhaft speichern, Umgebungsvariablen und Netzwerke – bis zum Multi-Container-Stack mit Compose.

-   :material-sitemap-outline:{ .lg .middle } __[Infrastruktur & Architektur](infrastruktur-planung/index.md)__

    ---

    Bestandsanalyse, Anforderungskatalog, Sollkonzept, zentrale und dezentrale Architekturen, Cloud gegen eigenen Betrieb, Speicherlösungen, Ressourcen und Lizenzmodelle.

</div>

[:octicons-arrow-right-24: Worum es in Thema 1 geht](thema-1.md)

### :material-server: Thema 2 – Sicherstellung des laufenden Betriebs

*Wie bleibt ein System am Laufen?* Ausfälle vorwegdenken, den Betrieb überwachen, Software verteilen und im Ernstfall geordnet wiederherstellen.

<div class="grid cards" markdown>

-   :material-monitor-dashboard:{ .lg .middle } __[Betrieb & Verfügbarkeit](betrieb/index.md)__

    ---

    Ausfallrisiken und Schadenshöhen, Redundanz und Cluster, Backup- und Recoverystrategien, Wiederanlaufpläne, Incident Response und Notbetrieb.

-   :material-chart-line:{ .lg .middle } __[Monitoring](monitoring-praxis/index.md)__

    ---

    Betriebsdaten sammeln, Kennzahlen festlegen, Dashboards bauen und Alarme auslösen – praktisch mit Prometheus und Grafana.

-   :material-ship-wheel:{ .lg .middle } __[Softwareverteilung & Kubernetes](orchestrierung/index.md)__

    ---

    Software automatisiert ausrollen, Deployment-Strategien wählen – und Container über einen Cluster orchestrieren, skalieren und selbstheilend betreiben.

-   :material-source-branch:{ .lg .middle } __[CI/CD](ci-cd/index.md)__

    ---

    Vom manuellen Ausliefern zur Pipeline, die bei jeder Änderung automatisch baut, testet und bereitstellt.

</div>

[:octicons-arrow-right-24: Worum es in Thema 2 geht](thema-2.md)

### :material-shield-check-outline: Thema 3 – Qualitätssicherung und IT-Sicherheit

*Läuft das System richtig – und ist es sicher?* Risiken bewerten, absichern, testen und geordnet übergeben.

<div class="grid cards" markdown>

-   :material-shield-lock-outline:{ .lg .middle } __[IT-Sicherheit & Risiko](it-sicherheit/index.md)__

    ---

    Schutzziele, Risikomanagement von der Identifikation bis zur Überwachung, Informationssicherheits-Managementsysteme, Sicherheitsvorfälle und beweissichere Dokumentation.

-   :material-test-tube:{ .lg .middle } __[Tests & Qualität](testen-qualitaet/index.md)__

    ---

    Testfälle und Testszenarien entwerfen, Simulationsumgebungen wählen, Tests durchführen und auswerten, Betrieb optimieren, Übergabe und Einweisung.

</div>

[:octicons-arrow-right-24: Worum es in Thema 3 geht](thema-3.md)

---

## Werkzeuge und Nachschlagewerke

<div class="grid cards" markdown>

-   :material-source-fork:{ .lg .middle } __[Git & GitHub](git/index.md)__

    ---

    Versionskontrolle als Handwerkszeug: Commits, Branches, Merge-Konflikte, Pull Requests und die Zusammenarbeit im Team.

-   :material-view-dashboard-outline:{ .lg .middle } __[Cheatsheets](cheatsheets/index.md)__

    ---

    Befehlsübersichten zum schnellen Nachschlagen während der Arbeit – für Multipass, Docker, Compose, Git, Actions und Helm.

-   :material-book-open-variant:{ .lg .middle } __[Glossar](glossar.md)__

    ---

    Alle Fachbegriffe des Kurses kompakt erklärt. Abkürzungen werden auf jeder Seite automatisch damit verlinkt.

-   :material-scale-balance:{ .lg .middle } __[Weitere Prüfungsthemen](weitere-themen.md)__

    ---

    Recht, Datenschutz und Projektmanagement werden von anderer Seite unterrichtet, sind aber prüfungsrelevant. Hier die Einordnung.

</div>

---

## Wie du die Unterlagen am besten nutzt

=== "Während des Unterrichts"
    Halte die Seite offen. Wenn ein Befehl gezeigt wird und du kurz aussteigst, findest du genau diesen Befehl hier mit Erklärung wieder.

    Die **Suche oben rechts** durchsucht alle Seiten samt Befehlen – oft schneller als das Blättern durch die Navigation.

=== "Zum Nacharbeiten"
    Innerhalb jedes Blocks ist die Reihenfolge didaktisch aufgebaut: Überblick, Theorie, Praxis, Übungen, Stolpersteine, Merksätze.

    Wenn du einen Termin verpasst hast, arbeite vor allem die **Praxisübung** nach. Die Theorie kannst du hier in Ruhe lesen, das gemeinsame Ausprobieren lässt sich schlechter nachholen.

=== "Zur Prüfungsvorbereitung"
    Arbeite mit den **Übungen und Musterlösungen**. Die Prüfung fragt keine Definitionen ab, sondern verlangt begründete Entscheidungen zu einer betrieblichen Situation.

    Die Aufgaben in den Blöcken [Infrastruktur](infrastruktur-planung/uebungen.md) und [IT-Sicherheit](it-sicherheit/uebungen-risikoanalyse.md) kommen dem Prüfungsformat am nächsten.

=== "Zum Nachschlagen"
    Die **[Cheatsheets](cheatsheets/index.md)** enthalten die wichtigsten Befehle in Tabellenform.

    Fachbegriffe und Abkürzungen sind automatisch mit dem **[Glossar](glossar.md)** verlinkt – ein Klick auf eine Abkürzung führt direkt zur Erklärung.

---

!!! note "Arbeitsstand"
    Diese Unterlagen wachsen mit dem Kurs. Einige Blöcke sind bereits ausführlich ausgearbeitet, andere werden Schritt für Schritt ergänzt – du erkennst sie an einem Hinweis oben auf der jeweiligen Seite.

Technisch ist die Seite mit [MkDocs](https://www.mkdocs.org/) und [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) gebaut: statisch, schnell und auch offline nutzbar, wenn du sie einmal gespeichert hast.
