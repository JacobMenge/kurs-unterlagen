---
title: "Warum kapseln wir Systeme?"
description: "Drei typische Situationen, in denen Virtualisierung Probleme löst – und die zentrale Analogie Wohnhaus & Wohnungen."
---

# Warum kapseln wir Systeme überhaupt?

!!! abstract "Lernziel"
    Nach dieser Seite kannst du:

    - **drei konkrete Probleme** benennen, die durch Virtualisierung gelöst werden
    - die Analogie **Wohnhaus – Wohnungen** für Virtualisierung erklären
    - einordnen, warum Kapselung nicht kostenlos ist (Ressourcen, Startzeit)

---

## Warum das wichtig ist

Kaum ein Satz ist in der IT häufiger zu hören als dieser:

> „Auf meinem Rechner lief’s aber!"

Meistens steckt dahinter kein Magier, sondern ein simples Problem: **Zwei Rechner sind nie exakt gleich.** Unterschiedliche Betriebssysteme, unterschiedliche Bibliotheks­versionen, unterschiedliche Pfade, unterschiedliche Rechte. Sobald Software auf einen zweiten Rechner wandert, kann sie an Kleinigkeiten scheitern.

Virtualisierung ist eine der wirkungsvollsten Antworten auf dieses Problem: Wir **kapseln** eine komplette Umgebung so weit, dass sie sich auf jedem Rechner gleich verhält.

---

## Drei Alltagsszenarien, die Virtualisierung entschärft

### 1. Gemeinsam an einem Projekt arbeiten – mit unterschiedlichen Rechnern

Du arbeitest auf macOS, eine Kollegin auf Windows, ein Kollege auf Ubuntu. Alle drei wollen dieselbe Anwendung testen. Ohne Virtualisierung schreibt jeder eine eigene Installations­anleitung – und irgendjemand vergisst immer einen Schritt.

Mit einer gemeinsamen VM läuft auf allen drei Rechnern **dieselbe Ubuntu-Version mit denselben Paketen**. Unterschiede zwischen den Host-Systemen werden damit irrelevant.

### 2. Eine Anwendung braucht ein bestimmtes Betriebssystem – dein Rechner hat aber ein anderes

Ein älteres Werkzeug läuft nur auf Ubuntu 20.04. Dein Laptop hat Ubuntu 24.04 oder macOS 15. Statt den Laptop „zurückzubauen", startest du eine VM mit genau der Version, die das Werkzeug erwartet. Dein Haupt­system bleibt unberührt.

### 3. Gefährliche Dinge testen – ohne das Haupt­system zu zerstören

Du willst eine Firewall-Regel ausprobieren, ein Systemkommando testen, das du nicht ganz verstehst, oder ein unbekanntes Programm aus dem Internet anschauen. In einer VM kannst du **alles zerstören**, was dort drin liegt – dein echter Rechner bleibt heil. Im Notfall löschst du die VM und startest eine neue.

!!! example "Kurz zusammengefasst"
    1. **Gleichmachen**, was auf unterschiedlichen Hosts läuft.
    2. **Unabhängig machen** von der Version des Host-Betriebssystems.
    3. **Absichern**, damit Experimente das Haupt­system nicht beschädigen.

---

## Die Kern-Idee: ein Rechner trägt mehrere Systeme

Früher galt: **Ein Rechner – ein Betriebssystem – eine Aufgabe.** Wer einen Web­server, einen Daten­bank­server und einen Test­rechner brauchte, stellte drei Kisten in den Keller. Das war teuer, langsam zu ändern und schwer zu sichern.

Heute gilt: **Ein Rechner – viele Systeme.** Dank Virtualisierung sieht jede dieser „Kisten" für ihre Software aus wie ein eigener Computer, obwohl sie sich die echte Hardware mit anderen teilt.

---

## Analogie: Wohnhaus & Wohnungen

!!! tip "Wohnhaus mit Wohnungen"
    Stell dir ein Mehrfamilien­haus vor:

    - **Das Grundstück** und die **Hauptleitungen** (Wasser, Strom, Heizung) = die **physische Hardware**.
    - **Das Gebäude selbst** = das **Host-Betriebssystem**, das die Leitungen verwaltet.
    - **Die einzelnen Wohnungen** = die **virtuellen Maschinen**.

    Jede Wohnung hat ihre eigene Küche, ihr eigenes Bad, ihre eigene Haustür. Was in Wohnung 3B passiert, interessiert Wohnung 7A nicht. Beide teilen sich trotzdem unsichtbar die Grund­infrastruktur. Wird in einer Wohnung Wasser aufgedreht, merkt die Nachbar­wohnung nichts – solange der Haupthahn mitspielt.

    **Genau so funktioniert Virtualisierung**: mehrere getrennte Einheiten auf einer gemeinsamen Grundlage.

Die Analogie trägt erstaunlich weit:

- Eine Wohnung zu bauen kostet Zeit und Material → eine VM zu starten kostet Zeit und RAM.
- Ein Umbau in Wohnung 3B betrifft nur 3B → ein Absturz in VM 1 betrifft nur VM 1.
- Das Haus selbst muss solide sein → das Host-System muss stabil sein, damit die VMs laufen.

---

## Was Kapselung kostet

Virtualisierung ist kein Wunder. Jede VM bringt **ihr eigenes Betriebssystem** mit. Das bedeutet:

- **RAM-Bedarf**: eine VM mit Ubuntu verbraucht schnell 1–2 GB RAM, bevor eine einzige eigene Anwendung läuft.
- **Startzeit**: eine VM bootet wie ein echter Rechner – Sekunden bis Minuten.
- **Plattenplatz**: ein Ubuntu-Image belegt 2–5 GB, dazu kommt Platz für installierte Software.

Das ist der Preis für die strikte Trennung. Später beim Thema [Docker](../docker/warum-docker.md) sehen wir, dass es für viele Anwendungsfälle einen **leichteren** Weg gibt – er löst aber nicht genau dasselbe Problem.

---

## Merksatz

!!! success "Merksatz"
    > **Virtualisierung trennt Systeme voneinander, damit sie sich nicht gegenseitig stören – zu dem Preis, dass jede Einheit ihr eigenes Betriebssystem mitbringt.**

---

## Weiterlesen

- [Grundbegriffe der Virtualisierung](grundbegriffe.md)
- [Hypervisor-Typen](hypervisor-typen.md)
- Später im Kurs: [Warum Docker?](../docker/warum-docker.md)
