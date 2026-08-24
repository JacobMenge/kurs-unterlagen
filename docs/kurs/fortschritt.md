---
title: "Wo stehen wir?"
description: "Aktueller Stand des Kurses: was bereits behandelt wurde, was gerade läuft und was als Nächstes kommt."
---

# Wo stehen wir?

Diese Seite zeigt euch jederzeit, **wie weit wir gekommen sind** und **was als Nächstes ansteht**. Sie wird nach jeder Einheit aktualisiert.

<!-- ===================================================================
     STAND AKTUALISIEREN
     Nach jeder Einheit hier anpassen:
       1. Die drei Prozentwerte unten (style="width: XX%")
       2. Den Text neben dem Balken (z. B. "3 von 6 Blöcken")
       3. Die Statusspalte in den Tabellen: fertig / laeuft / offen
       4. Die drei Kästen "Zuletzt", "Gerade" und "Als Nächstes"
     Alles andere bleibt stehen.
     =================================================================== -->

## Der Gesamtstand

<div class="fortschritt-block t1" markdown>
<div class="fortschritt-kopf">
<span class="fortschritt-name">Thema 1 · Planung, Konzeptionierung, Integration</span>
<span class="fortschritt-wert">1 von 6 Blöcken</span>
</div>
<div class="fortschritt-schiene"><div class="fortschritt-balken" style="width: 8%"></div></div>
</div>

<div class="fortschritt-block t2" markdown>
<div class="fortschritt-kopf">
<span class="fortschritt-name">Thema 2 · Sicherstellung des laufenden Betriebs</span>
<span class="fortschritt-wert">noch nicht begonnen</span>
</div>
<div class="fortschritt-schiene"><div class="fortschritt-balken" style="width: 0%"></div></div>
</div>

<div class="fortschritt-block t3" markdown>
<div class="fortschritt-kopf">
<span class="fortschritt-name">Thema 3 · Qualitätssicherung und IT-Sicherheit</span>
<span class="fortschritt-wert">noch nicht begonnen</span>
</div>
<div class="fortschritt-schiene"><div class="fortschritt-balken" style="width: 0%"></div></div>
</div>

---

## Zuletzt, jetzt und als Nächstes

<div class="grid cards" markdown>

-   :material-check-circle-outline:{ .lg .middle } __Zuletzt gemacht__

    ---

    **Orientierung und Kennenlernen**

    Ablauf des Kurses, Weg bis zur Prüfung, Kursregeln und Materialien.

-   :material-play-circle-outline:{ .lg .middle } __Gerade dran__

    ---

    **Netzwerke – Grundlagen**

    Warum Netzwerke, Grundbegriffe, OSI- und TCP/IP-Modell.

    [:octicons-arrow-right-24: Zum Block](../netzwerke/index.md)

-   :material-arrow-right-circle-outline:{ .lg .middle } __Als Nächstes__

    ---

    **Adressierung und Subnetting**

    MAC, IPv4, IPv6, Subnetzmasken – und die erste Praxisübung dazu.

    [:octicons-arrow-right-24: Vorbereiten](../netzwerke/adressierung.md)

</div>

---

## Die Blöcke im Einzelnen

**Legende:** <span class="status-fertig">✓ abgeschlossen</span> · <span class="status-laeuft">● läuft gerade</span> · <span class="status-offen">○ kommt noch</span>

### Thema 1 · Planung, Konzeptionierung, Integration

| Status | Block | Inhalt |
|:---:|---|---|
| <span class="status-laeuft">●</span> | [Netzwerke](../netzwerke/index.md) | Modelle, Adressierung, Routing, Protokolle, Sicherheit |
| <span class="status-offen">○</span> | [Virtualisierung](../virtualisierung/index.md) | Hypervisor, virtuelle Maschinen, Werkzeuge |
| <span class="status-offen">○</span> | [Docker – Einführung](../docker/index.md) | Container, Images, eigene Container bauen |
| <span class="status-offen">○</span> | [Docker – Aufbau](../docker-aufbau/index.md) | Volumes, Umgebungsvariablen, Netzwerke |
| <span class="status-offen">○</span> | [Docker Compose](../docker-compose/index.md) | Mehrere Dienste als ein Stapel |
| <span class="status-offen">○</span> | [Infrastruktur & Architektur](../infrastruktur-planung/index.md) | Anforderungen, Architekturen, Speicher, Lizenzen |

### Thema 2 · Sicherstellung des laufenden Betriebs

| Status | Block | Inhalt |
|:---:|---|---|
| <span class="status-offen">○</span> | [Betrieb & Verfügbarkeit](../betrieb/index.md) | Redundanz, Backup, Wiederanlauf, Notbetrieb |
| <span class="status-offen">○</span> | [Monitoring](../monitoring-praxis/index.md) | Metriken, Kennzahlen, Alarmierung |
| <span class="status-offen">○</span> | [Softwareverteilung](../orchestrierung/index.md) | Ausrollen, Deployment-Strategien, Rollback |
| <span class="status-offen">○</span> | [Kubernetes](../kubernetes-praxis/index.md) | Container über einen Cluster betreiben |
| <span class="status-offen">○</span> | [Git & GitHub](../git/index.md) | Versionskontrolle als Werkzeug |
| <span class="status-offen">○</span> | [CI/CD](../ci-cd/index.md) | Automatisch bauen, testen, ausliefern |

### Thema 3 · Qualitätssicherung und IT-Sicherheit

| Status | Block | Inhalt |
|:---:|---|---|
| <span class="status-offen">○</span> | [Schutzziele & Grundlagen](../it-sicherheit/grundlagen.md) | CIA, Schutzbedarf, Grundprinzipien |
| <span class="status-offen">○</span> | [Risikomanagement](../it-sicherheit/risikomanagement.md) | Risiken bewerten und steuern |
| <span class="status-offen">○</span> | [ISMS & Standards](../it-sicherheit/isms.md) | ISO 27001, BSI-Grundschutz, Audits |
| <span class="status-offen">○</span> | [Sicherheitsvorfälle](../it-sicherheit/sicherheitsvorfaelle.md) | Erkennen, eindämmen, dokumentieren |
| <span class="status-offen">○</span> | [Tests & Qualität](../testen-qualitaet/index.md) | Testfälle, Durchführung, Auswertung |
| <span class="status-offen">○</span> | [Übergabe & Einweisung](../testen-qualitaet/uebergabe-und-training.md) | Dokumentation, Schulung, Nachbetreuung |

---

!!! tip "Etwas verpasst?"
    Alle Blöcke stehen hier vollständig zum Nachlesen – du kannst jederzeit aufholen. Arbeite zuerst die **Praxisübung** nach, die lässt sich am schlechtesten nachholen. Wenn danach etwas unklar bleibt, frag beim nächsten Mal.

!!! info "Was danach kommt"
    Nach Thema 3 folgen im Kurs die beiden Schwerpunkte **organisatorische und rechtliche Vorgaben** sowie **Projektunterstützung und -koordination** von anderer Seite, danach die Prüfungsvorbereitung. Eine Einordnung findest du unter [Weitere Themen](../weitere-themen.md).
