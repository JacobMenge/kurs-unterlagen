---
title: "Merksätze – Virtualisierung"
description: "Die Kern-Sätze des Virtualisierungs-Blocks auf einer Seite."
---

# Merksätze – Virtualisierung

Diese Seite ist deine **Spickzettel-Ebene** für das Konzept dahinter. Keine Befehle, keine neuen Inhalte – nur die Sätze, die hängen bleiben sollen.

!!! abstract "Wenn du am Ende dieses Blocks diese fünf Sätze mit eigenen Worten erklären kannst, hat der Block sein Ziel erreicht."

---

## 1. Warum wir virtualisieren

!!! success "Merksatz 1"
    > **Virtualisierung trennt Systeme voneinander, damit sie sich nicht gegenseitig stören – zu dem Preis, dass jede Einheit ihr eigenes Betriebssystem mitbringt.**

Das ist der Kern: **Trennung** ist das Ziel, **eigenes OS pro Gast** der Preis. Wer das verstanden hat, hat auch verstanden, warum später Container als Alternative so attraktiv wirken.

---

## 2. Was ein Hypervisor ist

!!! success "Merksatz 2"
    > **Ein Hypervisor gaukelt dem Gast-System einen eigenen Computer vor – inklusive CPU, RAM, Festplatte und Netzwerk. Der Gast bringt seinen eigenen Kernel mit.**

Der Nachsatz ist entscheidend: **„Der Gast bringt seinen eigenen Kernel mit"**. Genau dieser Punkt unterscheidet VMs von Containern.

---

## 3. Typ 1 vs. Typ 2

!!! success "Merksatz 3"
    > **Typ 1 läuft direkt auf der Hardware und ist schnell und schlank. Typ 2 läuft als Programm in einem Host-Betriebssystem und ist bequem zu installieren.**

Typ 1 für Produktion und Rechenzentren, Typ 2 für Entwicklung und Schulung – grob vereinfacht, aber belastbar.

---

## 4. Werkzeug-Auswahl

!!! success "Merksatz 4"
    > **Für einen reibungslosen Ubuntu-Einstieg ist Multipass fast immer die beste Wahl. Für andere Betriebssysteme oder GUI-lastige Gäste greifst du zu UTM, VirtualBox, VMware oder Parallels – abhängig von deinem Host.**

Es gibt kein „bestes" Tool für alle Fälle. Es gibt nur das **passende Tool für dein Ziel und deinen Host**.

---

## 5. Der Multipass-Workflow

!!! success "Merksatz 5"
    > **`launch` – `shell` – `stop` – `delete` – `purge`. Mit diesen fünf Befehlen hast du eine VM vollständig im Griff.**

Starten. Betreten. Anhalten. Entsorgen. Endgültig löschen. Fünf Verben, fünf Befehle – der ganze Lebenszyklus.

---

## Für den nächsten Block vorbereitet

Merk dir besonders Satz 2 gut. Im nächsten Block geht es um **Docker** – und dort dreht sich die zentrale Frage genau um diesen einen Punkt:

> **Muss wirklich jede Einheit ihren eigenen Kernel mitbringen?**

Die Antwort: nein, oft reicht ein Bruchteil davon. Genau das macht Container leichter als VMs.

[Weiter zu: Warum Docker? →](../docker/warum-docker.md)
