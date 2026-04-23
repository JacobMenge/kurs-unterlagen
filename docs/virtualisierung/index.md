---
title: "Virtualisierung – Überblick"
description: "Einstieg in das Thema Virtualisierung – warum wir Umgebungen kapseln und welche Werkzeuge es dafür gibt."
---

# Virtualisierung – Überblick

In diesem Kapitel geht es um eine der wichtigsten Ideen der modernen IT: **Wie bekommen wir es hin, dass verschiedene Systeme friedlich auf einem Rechner nebeneinander laufen, ohne sich gegenseitig zu stören?**

Die Antwort heißt **Virtualisierung**. Wir schauen zuerst, warum sie so nützlich ist, lernen die nötigen Begriffe kennen, sortieren die Werkzeug-Landschaft und starten am Ende ganz konkret unsere erste Ubuntu-VM mit **Multipass**.

!!! abstract "Was du nach diesem Kapitel kannst"
    - in eigenen Worten erklären, **warum** man IT-Umgebungen kapselt
    - die Begriffe **Host**, **Gast**, **Hypervisor** und **virtuelle Hardware** sicher verwenden
    - **Typ-1-** und **Typ-2-Hypervisoren** unterscheiden
    - die wichtigsten VM-Werkzeuge einordnen (Multipass, VirtualBox, UTM, Hyper-V, VMware, Parallels)
    - mit **Multipass** eine Ubuntu-VM starten, betreten, stoppen und sauber wieder entfernen

---

## Seiten in diesem Kapitel

| Seite | Inhalt | Art |
|-------|--------|-----|
| [Warum kapseln?](warum-kapseln.md) | Motivation, konkrete Probleme aus dem Alltag | Theorie |
| [Grundbegriffe](grundbegriffe.md) | Host, Gast, Hypervisor, vCPU, virtuelle Hardware | Theorie |
| [Hypervisor-Typen](hypervisor-typen.md) | Typ 1 vs. Typ 2 mit realen Produkten | Theorie |
| [Werkzeuge im Überblick](werkzeuge-im-ueberblick.md) | Multipass, VirtualBox, UTM, Hyper-V, VMware, Parallels | Referenz |
| [Multipass – Einstieg](multipass-einstieg.md) | Was ist Multipass? Installation pro Betriebssystem | Brücke |
| [Praxis mit Multipass](praxis-multipass.md) | Hands-on: VM starten, betreten, stoppen, löschen | Anleitung |
| [Übungen](uebungen.md) | 🟢🟡🔴🏆 Vier Schwierigkeitsgrade zum Selbermachen | Training |
| [Stolpersteine](stolpersteine.md) | Typische Probleme und ihre Lösungen | Referenz |
| [Merksätze](merksaetze.md) | Kompakte Zusammenfassung | Referenz |

---

## Empfohlene Leserichtung

Wenn du dich dem Thema zum ersten Mal näherst, lies linear durch:

1. **[Warum kapseln?](warum-kapseln.md)** – damit du weißt, wofür der Aufwand gut ist.
2. **[Grundbegriffe](grundbegriffe.md)** – das Vokabular muss sitzen, sonst verwirrt alles Folgende.
3. **[Hypervisor-Typen](hypervisor-typen.md)** und **[Werkzeuge im Überblick](werkzeuge-im-ueberblick.md)** – du siehst die Landschaft.
4. **[Multipass – Einstieg](multipass-einstieg.md)** – das Werkzeug, das wir im Kurs tatsächlich benutzen.
5. **[Praxis mit Multipass](praxis-multipass.md)** – Hands-on, bis die VM wirklich läuft.
6. Bei Problemen: **[Stolpersteine](stolpersteine.md)**.
7. Zum Wiederholen: **[Merksätze](merksaetze.md)**.

Wenn du nur schnell einen Befehl brauchst: **[Cheatsheet Multipass](../cheatsheets/multipass.md)**.

---

## Leitfrage des Blocks

> **Wie bekommen wir IT-Umgebungen sauber, schnell und reproduzierbar ans Laufen, ohne das Host-System zu verändern?**

Wenn du am Ende des Blocks diese Frage mit eigenen Worten und einem Beispiel beantworten kannst, hat der Block funktioniert.
