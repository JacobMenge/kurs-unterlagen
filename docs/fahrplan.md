---
title: "Fahrplan"
description: "Der rote Faden durch den Kurs: die drei Themenschwerpunkte mit allen Blöcken, ihre Reihenfolge, wie sie aufeinander aufbauen und wie ein Kursabend abläuft."
hide:
  - navigation
---

# Fahrplan

Deine Landkarte durch den Kurs. Drei Themenschwerpunkte, die aufeinander aufbauen – hier siehst du auf einen Blick, was wo hingehört.

<div class="kursmap" markdown>

<div class="kursmap-spalte t1" markdown>
<div class="kursmap-nr">Thema 1</div>
<div class="kursmap-titel">Planung, Konzeptionierung, Integration</div>
<div class="kursmap-frage">Wie entsteht ein System?</div>
<ul class="kursmap-liste">
<li><a href="../netzwerke/">Netzwerke</a></li>
<li><a href="../virtualisierung/">Virtualisierung</a></li>
<li><a href="../docker/">Docker – Einführung</a></li>
<li><a href="../docker-aufbau/">Docker – Aufbau</a></li>
<li><a href="../docker-compose/">Docker Compose</a></li>
<li><a href="../infrastruktur-planung/">Infrastruktur & Architektur</a></li>
</ul>
<div class="kursmap-fuss">Der größte Block. Hier entsteht das Fundament für alles Weitere.</div>
</div>

<div class="kursmap-spalte t2" markdown>
<div class="kursmap-nr">Thema 2</div>
<div class="kursmap-titel">Sicherstellung des laufenden Betriebs</div>
<div class="kursmap-frage">Wie bleibt es am Laufen?</div>
<ul class="kursmap-liste">
<li><a href="../betrieb/">Betrieb & Verfügbarkeit</a></li>
<li><a href="../monitoring-praxis/">Monitoring</a></li>
<li><a href="../orchestrierung/">Softwareverteilung</a></li>
<li><a href="../kubernetes-praxis/">Kubernetes</a></li>
<li><a href="../git/">Git & GitHub</a></li>
<li><a href="../ci-cd/">CI/CD</a></li>
</ul>
<div class="kursmap-fuss">Ausfälle vorwegdenken, überwachen, ausrollen, wiederherstellen.</div>
</div>

<div class="kursmap-spalte t3" markdown>
<div class="kursmap-nr">Thema 3</div>
<div class="kursmap-titel">Qualitätssicherung und IT-Sicherheit</div>
<div class="kursmap-frage">Läuft es richtig und sicher?</div>
<ul class="kursmap-liste">
<li><a href="../it-sicherheit/">Schutzziele & Grundlagen</a></li>
<li><a href="../it-sicherheit/risikomanagement/">Risikomanagement</a></li>
<li><a href="../it-sicherheit/isms/">ISMS & Standards</a></li>
<li><a href="../it-sicherheit/sicherheitsvorfaelle/">Sicherheitsvorfälle</a></li>
<li><a href="../testen-qualitaet/">Tests & Qualität</a></li>
<li><a href="../testen-qualitaet/uebergabe-und-training/">Übergabe & Einweisung</a></li>
</ul>
<div class="kursmap-fuss">Greift alles Vorherige auf – und liegt am nächsten an der Prüfung.</div>
</div>

</div>

<div class="kursmap-werkzeuge" markdown>
<strong>Dazu kommen zwei Schwerpunkte von anderer Seite:</strong> organisatorische und rechtliche Vorgaben sowie Projektunterstützung und -koordination. Beide sind prüfungsrelevant – eine Einordnung findest du unter <a href="../weitere-themen/">Weitere Themen</a>.
</div>

!!! tip "Wo stehen wir gerade?"
    Der aktuelle Stand des Kurses – was zuletzt dran war und was als Nächstes kommt – steht auf der Seite **[Wo stehen wir?](kurs/fortschritt.md)**.

---

## Wie die Themen aufeinander aufbauen

Die Reihenfolge ist kein Zufall. Jeder Block liefert das Vokabular für den nächsten.

| | Thema 1 baut das Fundament | Thema 2 hält es am Laufen | Thema 3 sichert es ab |
|---|---|---|---|
| **Beginnt mit** | Netzwerken, weil ohne sie nichts kommuniziert | dem Konzept von Verfügbarkeit, bevor Werkzeuge kommen | Risikomanagement als Methode für alles Weitere |
| **Braucht davor** | nichts | Container und Infrastrukturverständnis aus Thema 1 | Systemverständnis aus Thema 1 und 2 |
| **Endet mit** | der Planung, weil man erst entscheiden kann, wenn man die Bausteine kennt | der automatisierten Auslieferung | Tests und der geordneten Übergabe |

---

## Die Blöcke im Einzelnen

=== "Thema 1 · Planung und Integration"

    | Block | Worum es geht | Praxisanteil |
    |---|---|---|
    | [Netzwerke](netzwerke/index.md) | OSI-Modell, Adressierung, Subnetting, Routing, DNS und DHCP, Transport- und Anwendungsprotokolle, Industrie- und IoT-Protokolle, Segmentierung, VPN, Netzwerksicherheit | Subnetting-Wettbewerb, Verkehr mitlesen, Störungssuche |
    | [Virtualisierung](virtualisierung/index.md) | Warum kapseln, Hypervisor-Typen, virtuelle Hardware, Werkzeuge im Vergleich | eigene virtuelle Maschinen aufsetzen und automatisiert einrichten |
    | [Docker – Einführung](docker/index.md) | Container gegen VM, Images und Container, eigene Images bauen, Registry | erste eigene Container und Images |
    | [Docker – Aufbau](docker-aufbau/index.md) | Volumes, Umgebungsvariablen, Container-Netzwerke | Datenbank mit dauerhaftem Speicher |
    | [Docker Compose](docker-compose/index.md) | Mehrere Dienste deklarativ beschreiben und starten | kompletter Anwendungsstapel aus einer Datei |
    | [Infrastruktur & Architektur](infrastruktur-planung/index.md) | Bestandsanalyse, Anforderungen, Sollkonzept, Architekturen, Speicher, Ressourcen, Lizenzen | durchgehendes Unternehmensszenario mit Entscheidungen |

    **Vertiefungen, wenn Zeit bleibt:** [Docker – Vertiefung](docker-vertiefung/index.md), [Escape Room](docker-escape-room/index.md), [Mission Control](docker-compose-mission-control/index.md), [Docker für Profis](docker-profi/index.md).

=== "Thema 2 · Laufender Betrieb"

    | Block | Worum es geht | Praxisanteil |
    |---|---|---|
    | [Betrieb & Verfügbarkeit](betrieb/index.md) | Ausfallrisiken, Verfügbarkeit rechnen, Redundanz und Cluster, Backup und Recovery, Wiederanlauf, Incident Response, Notbetrieb | Redundanz- und Backupkonzept entwerfen, Notfallübung |
    | [Monitoring](monitoring-praxis/index.md) | Metriken, Kennzahlen, Schwellenwerte, Alarmierung | Überwachungsstapel aufbauen, Dashboard und Alarm bauen |
    | [Softwareverteilung](orchestrierung/index.md) | Paketierung, Imaging, Deployment-Strategien, Rollback | Rollout-Plan für einen Betrieb entwerfen |
    | [Kubernetes](kubernetes-praxis/index.md) | Container über einen Cluster betreiben, skalieren, selbstheilend machen | Anwendung im Cluster betreiben und gezielt zerstören |
    | [Git & GitHub](git/index.md) | Versionskontrolle als Werkzeug: Commits, Branches, Konflikte, Pull Requests | eigenes Repository, Branches, Konflikte lösen, im Team arbeiten |
    | [CI/CD](ci-cd/index.md) | Automatisch bauen, testen und ausliefern | eigene Pipeline schreiben |

    !!! info "Warum Git hier steht"
        Git ist kein eigener Prüfungsschwerpunkt, sondern **Handwerkszeug**. Es sitzt bewusst direkt vor CI/CD: Eine Pipeline wird von einem Git-Ereignis ausgelöst – ohne Git bleibt CI/CD abstrakt. Wer Git schon kann, kann den Block überspringen; wer neugierig ist, kann ihn jederzeit vorziehen.

=== "Thema 3 · Qualität und Sicherheit"

    | Block | Worum es geht | Praxisanteil |
    |---|---|---|
    | [Schutzziele & Grundlagen](it-sicherheit/grundlagen.md) | Vertraulichkeit, Integrität, Verfügbarkeit, Schutzbedarf, Grundprinzipien | Schutzbedarf für eine Systemlandschaft feststellen |
    | [Risikomanagement](it-sicherheit/risikomanagement.md) | Risiken identifizieren, analysieren, bewerten, steuern, überwachen | vollständige Risikoanalyse in der Gruppe |
    | [ISMS & Standards](it-sicherheit/isms.md) | ISO 27001, BSI-Grundschutz, Richtlinien, Audits, Awareness | Sicherheitsrichtlinie entwerfen |
    | [Sicherheitsvorfälle](it-sicherheit/sicherheitsvorfaelle.md) | Erkennen, bewerten, eindämmen, protokollieren, beweissicher dokumentieren | Vorfallbearbeitung an einem realistischen Szenario |
    | [Tests & Qualität](testen-qualitaet/index.md) | Testfälle, Testumgebungen, Durchführung, Auswertung, Optimierung | Testkonzept für ein Integrationsvorhaben |
    | [Übergabe & Einweisung](testen-qualitaet/uebergabe-und-training.md) | Übergabedokumentation, Schulungsbedarf, Nachbetreuung | Übergabekonzept erstellen |

=== "Nachschlagen · jederzeit"

    | Bereich | Wofür |
    |---|---|
    | [Cheatsheets](cheatsheets/index.md) | Befehlsübersichten für Multipass, Docker, Compose, Git, GitHub Actions und Helm |
    | [Glossar](glossar.md) | Alle Fachbegriffe erklärt. Abkürzungen sind auf jeder Seite automatisch verlinkt |
    | [Die Prüfung](kurs/pruefung.md) | Format, Ablauf, Bewertung, Fristen |
    | [FAQ](kurs/faq.md) | Die häufigsten Fragen zu Kurs und Prüfung |

---

## Wie ein Kursabend abläuft

Die meisten Abende folgen demselben Muster. Der größere Teil gehört euch.

<div class="grid cards" markdown>

-   :material-presentation:{ .lg .middle } __1 · Theorie__

    ---

    Etwa 45 bis 60 Minuten im Hauptraum: Begriffe, Zusammenhänge, das Warum. Kurz genug, dass Zeit zum Arbeiten bleibt.

-   :material-account-group:{ .lg .middle } __2 · Praxis in Kleingruppen__

    ---

    Der größere Teil des Abends. Ihr arbeitet in getrennten Räumen an einer Aufgabe, helft euch gegenseitig, und ich komme dazu, wenn es klemmt.

-   :material-forum-outline:{ .lg .middle } __3 · Gemeinsame Auswertung__

    ---

    Zurück im Hauptraum: Was ist herausgekommen, wo hat es gehakt, welche Lösungswege gab es? Hier fällt der Groschen.

</div>

!!! tip "Die Praxis ist der Kern"
    Der Kurs bereitet auf die Prüfung vor, aber vor allem sollt ihr die Dinge **anwenden**. Wenn du einen Abend verpasst, arbeite zuerst die Übung nach – die Theorie dazu steht ohnehin hier.

---

## Wie die Blöcke aufgebaut sind

Jeder Block folgt derselben Gliederung. Einmal zurechtgefunden, findest du dich überall zurecht.

| Seitentyp | Was dich erwartet |
|---|---|
| **Überblick** | Worum es geht, was du lernst, wie die Seiten zusammenhängen |
| **Theorie** | Die Inhalte mit Erklärungen, Analogien und Diagrammen |
| **Praxis** | Schritt-für-Schritt-Anleitungen zum Mitmachen |
| **Übungen** | Aufgaben mit Musterlösung, meist nach Schwierigkeit gestaffelt |
| **Stolpersteine** | Was typischerweise schiefgeht und wie du es behebst |
| **Merksätze** | Die Kernaussagen des Blocks auf einer Seite |

---

## Wenn die Zeit knapp wird

!!! abstract "Die Prioritäten"
    1. **Die Theorie jedes Themas** – die Prüfung fragt Verständnis ab, nicht Handgriffe.
    2. **Die Übungen mit Musterlösung** – wenn du sie nicht durchführen kannst, lies wenigstens Aufgabe und Lösung.
    3. **Die Stolperstein-Seiten** – sie sparen dir im Ernstfall Stunden.
    4. **Die Vertiefungen** – wertvoll, aber verzichtbar, wenn die Zeit fehlt.

    Unabhängig von der Prüfung gilt: Die Praxisblöcke machen den Stoff greifbar. Lass sie dir nicht entgehen, nur weil sie nicht direkt abgefragt werden.
