---
title: "Start"
description: "Kursunterlagen zur IT-Systemintegration und Vernetzung – frei verfügbares Lernmaterial von Jacob Menge: Netzwerke, Virtualisierung, Container, Kubernetes, Betrieb, Sicherheit und mehr."
hide:
  - navigation
---

# Kursunterlagen – Systemintegration & Vernetzung

Willkommen. Hier findest du die Nachlese zu meinem Kurs rund um **IT-Systemintegration und Vernetzung** – von **Netzwerken** und **Virtualisierung** über **Container** und **Kubernetes** bis hin zu **Planung, Betrieb, Sicherheit, Recht und Projektarbeit**.
Jede Zeile Code, jede Erklärung und jede Analogie aus dem Unterricht kannst du hier in Ruhe nachlesen – egal, ob du während des Kurses etwas überhört hast, ob du zu Hause mitmachen willst, oder ob du später darauf zurückkommen möchtest.

!!! abstract "Was diese Seite ist – und was nicht"
    **Ist:** ein Nachschlagewerk. Jeder Befehl, den du im Unterricht siehst, steht hier mit Erklärung. Du kannst Schritt für Schritt mitlesen und alles zu Hause wiederholen.
    **Ist nicht:** ein Ersatz für den Kurs. Die Analogien, Diskussionen und Fragerunden leben vom Präsenzunterricht. Die Unterlagen sind der rote Faden dazu.

!!! tip "Neu hier? Starte mit dem Fahrplan"
    Du weißt nicht, wo du anfangen sollst? Der **[:octicons-arrow-right-24: Fahrplan](fahrplan.md)** zeigt dir die sinnvolle Reihenfolge, welche Themen aufeinander aufbauen und – ganz wichtig – **was prüfungsrelevant ist** und was eher die Praxis schärft.

---

## Themengebiete

Such dir einen Block aus oder folge dem [Fahrplan](fahrplan.md). Die Gruppen hier entsprechen genau der Navigation oben. Die kleine Ampel an jedem Block zeigt dir die Wichtigkeit für die Prüfung: <span class='badge badge-pruefung'>Prüfungsrelevant</span> = Kerninhalt · <span class='badge badge-vertiefung'>Vertiefung</span> = wichtig, vertieft das Verständnis · <span class='badge badge-praxis'>Praxis</span> = vor allem zum Anwenden.

### Grundlagen

<div class="grid cards" markdown>

-   :material-lan:{ .lg .middle } __[Netzwerke](netzwerke/index.md)__ &nbsp;<span class='badge badge-pruefung'>Prüfungsrelevant</span>

    ---

    Das Fundament: vom OSI-Modell über IP-Adressierung, Subnetting, Routing und DNS bis zu Industrie- und IoT-Protokollen (OPC UA, MQTT) sowie Netzwerk-Sicherheit.

    [:octicons-arrow-right-24: Block starten](netzwerke/index.md)

-   :material-server-network:{ .lg .middle } __[Virtualisierung](virtualisierung/index.md)__ &nbsp;<span class='badge badge-pruefung'>Prüfungsrelevant</span>

    ---

    Warum kapseln wir Systeme? Was ist ein Hypervisor? Welche Werkzeuge gibt es? Und wie startest du deine erste Ubuntu-VM mit **Multipass**?

    [:octicons-arrow-right-24: Block starten](virtualisierung/index.md)

-   :material-source-fork:{ .lg .middle } __[Git & GitHub](git/index.md)__ &nbsp;<span class='badge badge-praxis'>Praxis</span>

    ---

    Versionskontrolle von den Basics bis zum Pull Request: Repository, Commits, Branches, Merge, Konflikte und Remote-Arbeit mit GitHub und GitLab. Mit Gruppen-Übung.

    [:octicons-arrow-right-24: Git-Block starten](git/index.md)

</div>

### Container

<div class="grid cards" markdown>

-   :material-docker:{ .lg .middle } __[Docker – Einführung](docker/index.md)__ &nbsp;<span class='badge badge-pruefung'>Prüfungsrelevant</span>

    ---

    Warum Container? Wie unterscheiden sie sich von VMs? Was ist ein Image, was ein Container? Und wie baust du deinen ersten eigenen Container?

    [:octicons-arrow-right-24: Block starten](docker/index.md)

-   :material-layers-outline:{ .lg .middle } __[Docker – Aufbau](docker-aufbau/index.md)__ &nbsp;<span class='badge badge-vertiefung'>Vertiefung</span>

    ---

    Die drei Säulen realer Container-Anwendungen: **Volumes, Umgebungsvariablen, Netzwerke**. Abschluss mit Hands-on Postgres + Adminer.

    [:octicons-arrow-right-24: Block starten](docker-aufbau/index.md)

-   :material-school-outline:{ .lg .middle } __[Docker – Vertiefung](docker-vertiefung/index.md)__ &nbsp;<span class='badge badge-praxis'>Praxis</span>

    ---

    **Fünf eigenständige Übungen** ohne Compose: `docker exec` als Debug-Werkzeug, Volume-Backup, Healthchecks, Restart-Policies, Image-Größen-Vergleich.

    [:octicons-arrow-right-24: Vertiefungs-Übungen](docker-vertiefung/index.md)

-   :material-puzzle-outline:{ .lg .middle } __[Praxis: Docker Escape Room](docker-escape-room/index.md)__ &nbsp;<span class='badge badge-praxis'>Praxis</span>

    ---

    **Praxis-Wiederholung in der Gruppe:** Multi-Container-Setup manuell aufbauen, **bevor** Compose kommt. Eine 90-Minuten-Challenge mit 10 Aufgaben + Bonus.

    [:octicons-arrow-right-24: Praxis-Block starten](docker-escape-room/index.md)

-   :material-file-code-outline:{ .lg .middle } __[Docker Compose](docker-compose/index.md)__ &nbsp;<span class='badge badge-vertiefung'>Vertiefung</span>

    ---

    Multi-Container-Stacks deklarativ: `compose.yaml`, Services, Volumes, Netzwerke, Healthchecks. Praxis mit Flask + Postgres + Adminer.

    [:octicons-arrow-right-24: Block starten](docker-compose/index.md)

-   :material-satellite-variant:{ .lg .middle } __[Praxis: Mission Control](docker-compose-mission-control/index.md)__ &nbsp;<span class='badge badge-praxis'>Praxis</span>

    ---

    **Compose-Gruppenübung:** Vier Services (Frontend, Backend, DB, Adminer), `.env`, Healthcheck, optionaler Backend-Tausch. 90-Minuten-Mission rund um die Aurora Station.

    [:octicons-arrow-right-24: Praxis-Block starten](docker-compose-mission-control/index.md)

-   :material-rocket-launch-outline:{ .lg .middle } __[Docker für Profis](docker-profi/index.md)__ &nbsp;<span class='badge badge-praxis'>Praxis</span>

    ---

    Dockerfile-Best-Practices: Multi-Stage, USER, HEALTHCHECK. Image-Optimierung mit Alpine, Distroless, Trivy-Scanning.

    [:octicons-arrow-right-24: Block starten](docker-profi/index.md)

</div>

### Kubernetes & CI/CD

<div class="grid cards" markdown>

-   :material-ship-wheel:{ .lg .middle } __[Orchestrierung & Verteilung](orchestrierung/index.md)__ &nbsp;<span class='badge badge-vertiefung'>Vertiefung</span>

    ---

    Vom einzelnen Container zum Cluster: automatische Softwareverteilung, Deployment-Strategien und die Grundlagen von **Kubernetes**.

    [:octicons-arrow-right-24: Block starten](orchestrierung/index.md)

-   :material-kubernetes:{ .lg .middle } __[Kubernetes Teil 1 – Einstieg](kubernetes-praxis/index.md)__ &nbsp;<span class='badge badge-praxis'>Praxis</span>

    ---

    **Kubernetes Hands-on von Grund auf:** Container über einen Cluster orchestrieren – Pod, Deployment, Service, Selbstheilung, Skalierung. Mit Installation für Windows/macOS/Linux und drei angeleiteten Übungen im Wechsel aus Theorie und Praxis.

    [:octicons-arrow-right-24: Praxis-Block starten](kubernetes-praxis/index.md)

-   :material-cog-outline:{ .lg .middle } __[Kubernetes Teil 2 – Aufbau](kubernetes-aufbau/index.md)__ &nbsp;<span class='badge badge-praxis'>Praxis</span>

    ---

    **Betriebsreif statt nur lauffähig:** ConfigMap & Secret, Health-Probes, Requests & Limits – dieselbe Demo-App, jetzt so konfiguriert, wie sie in den Betrieb gehört.

    [:octicons-arrow-right-24: Praxis-Block starten](kubernetes-aufbau/index.md)

-   :material-package-variant-closed:{ .lg .middle } __[Kubernetes Teil 3 – Helm](kubernetes-helm/index.md)__ &nbsp;<span class='badge badge-praxis'>Praxis</span>

    ---

    **Der Abschluss des Kubernetes-Wegs:** Aus der YAML-Halde wird ein Paket. Eigenes Chart, Werte je Umgebung, Upgrade & Rollback – und fertige Charts aus dem Netz.

    [:octicons-arrow-right-24: Praxis-Block starten](kubernetes-helm/index.md)

-   :material-source-branch:{ .lg .middle } __[CI/CD mit GitHub Actions](ci-cd/index.md)__ &nbsp;<span class='badge badge-vertiefung'>Vertiefung</span>

    ---

    Vom manuellen `docker push` zur automatischen Pipeline: Begriffe, GitHub-Actions-Syntax und eine eigene Workflow-Datei, die ein Image baut, testet und in GHCR pusht.

    [:octicons-arrow-right-24: Block starten](ci-cd/index.md)

</div>

### Planung & Betrieb

<div class="grid cards" markdown>

-   :material-sitemap-outline:{ .lg .middle } __[Infrastruktur & Architektur](infrastruktur-planung/index.md)__ &nbsp;<span class='badge badge-pruefung'>Prüfungsrelevant</span>

    ---

    Planung und Konzeption: Anforderungen und Sollkonzept, zentrale/dezentrale Architekturen, Cloud vs. on-premise, Speicherlösungen, Ressourcen und Lizenzmodelle. Mit zehn Übungsaufgaben samt Musterlösungen.

    [:octicons-arrow-right-24: Block starten](infrastruktur-planung/index.md)

-   :material-monitor-dashboard:{ .lg .middle } __[Betrieb & Verfügbarkeit](betrieb/index.md)__ &nbsp;<span class='badge badge-pruefung'>Prüfungsrelevant</span>

    ---

    Der Dauerbetrieb: Monitoring und Troubleshooting, Backup- und Recovery-Strategien, Hochverfügbarkeit, Betriebsdaten und Business Continuity.

    [:octicons-arrow-right-24: Block starten](betrieb/index.md)

-   :material-chart-line:{ .lg .middle } __[Praxis: Monitoring](monitoring-praxis/index.md)__ &nbsp;<span class='badge badge-praxis'>Praxis</span>

    ---

    **Monitoring-Gruppenübung:** Mit Prometheus und Grafana eine Beispiel-App überwachen – Metriken, Dashboard, Alarm. Inklusive Installation für Windows/macOS/Linux und Einzelübungen.

    [:octicons-arrow-right-24: Praxis-Block starten](monitoring-praxis/index.md)

</div>

### Sicherheit & Qualität

<div class="grid cards" markdown>

-   :material-shield-lock-outline:{ .lg .middle } __[IT-Sicherheit & Risiko](it-sicherheit/index.md)__ &nbsp;<span class='badge badge-pruefung'>Prüfungsrelevant</span>

    ---

    Schutzziele (CIA), Risikomanagement, Informationssicherheits-Managementsysteme (ISO 27001, BSI-Grundschutz) und der Umgang mit Sicherheitsvorfällen.

    [:octicons-arrow-right-24: Block starten](it-sicherheit/index.md)

-   :material-test-tube:{ .lg .middle } __[Tests & Qualität](testen-qualitaet/index.md)__ &nbsp;<span class='badge badge-vertiefung'>Vertiefung</span>

    ---

    Testszenarien und Simulation, Integrations- und End-to-End-Tests, Betriebsoptimierung sowie die saubere Übergabe an die Anwender.

    [:octicons-arrow-right-24: Block starten](testen-qualitaet/index.md)

</div>

### Organisation & Projekte

<div class="grid cards" markdown>

-   :material-scale-balance:{ .lg .middle } __[Recht & Datenschutz](recht-organisation/index.md)__ &nbsp;<span class='badge badge-vertiefung'>Vertiefung</span>

    ---

    Die rechtliche Klammer: DSGVO und Datenschutz, Datensicherheitskonzepte, IT-Governance und Compliance sowie IT-Verträge und Lizenzrecht.

    [:octicons-arrow-right-24: Block starten](recht-organisation/index.md)

-   :material-clipboard-text-outline:{ .lg .middle } __[Projekte & Koordination](projektmanagement/index.md)__ &nbsp;<span class='badge badge-vertiefung'>Vertiefung</span>

    ---

    Projektarbeit in der Systemintegration: Organisation (klassisch & agil), Projektplanung, Aufwand und Kalkulation, Controlling sowie Schulung.

    [:octicons-arrow-right-24: Block starten](projektmanagement/index.md)

</div>

### Nachschlagen

<div class="grid cards" markdown>

-   :material-view-dashboard-outline:{ .lg .middle } __[Cheatsheets](cheatsheets/index.md)__

    ---

    Spickzettel mit den wichtigsten **Multipass-**, **Docker-**, **Compose-**, **Git-**, **GitHub-Actions-** und **Helm-Befehlen** in Tabellen – zum schnellen Nachschlagen während des Arbeitens.

    [:octicons-arrow-right-24: Zu den Spickzetteln](cheatsheets/index.md)

-   :material-book-open-variant:{ .lg .middle } __[Glossar](glossar.md)__

    ---

    Alle Begriffe, die im Kurs vorkommen, kompakt erklärt. Abkürzungen wie `VM`, `CLI` oder `SSH` werden auf jeder Seite automatisch mit dem Glossar verlinkt.

    [:octicons-arrow-right-24: Zum Glossar](glossar.md)

</div>

---

## Wie du diese Seite am besten nutzt

=== "Wo anfangen?"
    Wirf zuerst einen Blick auf den **[Fahrplan](fahrplan.md)**. Er zeigt dir die empfohlene Reihenfolge und welche Themen aufeinander aufbauen.

    Wenn du ganz neu bist: Beginne mit dem **Fundament** – [Netzwerke](netzwerke/index.md) und [Virtualisierung](virtualisierung/index.md). Darauf baut fast alles andere auf.

=== "Während des Kurses"
    Habe die Seite offen. Wenn im Präsenzteil ein Befehl gezeigt wird und du kurz aussteigst, findest du genau diesen Befehl hier mit Erklärung wieder.

    Nutze die **Suche oben rechts** – sie durchsucht alle Seiten inkl. Befehle.

=== "Nach dem Kurs"
    Arbeite die Abschnitte in Ruhe nach. Innerhalb jedes Blocks ist die Reihenfolge didaktisch aufgebaut:

    1. **Überblick** (Worum geht's?)
    2. **Warum** (Motivation)
    3. **Grundbegriffe** (Vokabular)
    4. **Praxis** (Hands-on)
    5. **Stolpersteine** (Debugging)
    6. **Merksätze** (Zusammenfassung)

=== "Was ist am wichtigsten?"
    Achte auf die **Ampel** an jedem Block und in der Tabelle im [Fahrplan](fahrplan.md):

    - <span class='badge badge-pruefung'>Prüfungsrelevant</span> – Kerninhalt für die Prüfung, hier wirklich sattelfest werden
    - <span class='badge badge-vertiefung'>Vertiefung</span> – baut darauf auf, vertieft das Verständnis
    - <span class='badge badge-praxis'>Praxis</span> – vor allem zum Anwenden, optional für die Prüfung

---

## Technischer Hinweis

Diese Seite ist mit [MkDocs](https://www.mkdocs.org/) und [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) gebaut. Sie ist statisch, schnell und läuft auch im Flugzeug, wenn du sie einmal offline gespeichert hast. Der Quellcode liegt öffentlich auf [GitHub](https://github.com/JacobMenge/kurs-unterlagen).

Mehr über mich und andere Projekte findest du auf [jacob-decoded.de](https://jacob-decoded.de).

!!! note "Arbeitsstand"
    Diese Unterlagen wachsen mit dem Kurs. Einige Blöcke sind bereits ausführlich ausgearbeitet (z. B. Netzwerke, Virtualisierung, Docker, Kubernetes, Infrastruktur & Architektur), andere sind als **Platzhalter** angelegt und werden Schritt für Schritt gefüllt – du erkennst sie an einem Hinweis oben auf der jeweiligen Seite. Der [Fahrplan](fahrplan.md) zeigt dir jederzeit, welche Themen schon bereitstehen und wie alles zusammenpasst.
