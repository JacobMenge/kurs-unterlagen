---
title: "Warum Docker?"
description: "Warum Container entstanden sind, was sie im Vergleich zu VMs anders machen, und zwei Analogien für den Einstieg."
---

# Warum braucht man Docker überhaupt?

!!! abstract "Lernziel"
    Nach dieser Seite kannst du:

    - **drei konkrete Probleme** benennen, die Docker löst
    - die Analogien **Containerschiff** und **Lunchbox** verwenden
    - den zentralen Merksatz des Blocks mit eigenen Worten erklären

---

## Warum das wichtig ist

Viele, die zum ersten Mal mit Docker arbeiten, hören den Namen und denken: „Das ist doch auch nur so eine VM-Geschichte, oder?" – Jein. Docker löst ähnliche Probleme wie Virtualisierung, aber mit einem **anderen Ansatz** und einem **anderen Preis**.

Um das zu verstehen, schauen wir uns erst an, **wo VMs an ihre Grenzen stoßen**. Genau aus diesen Grenzen ist die Idee „Container" entstanden.

---

## Das Problem: ein OS pro Dienst ist zu viel

Stell dir vor, du betreibst eine kleine Anwendung. Sie besteht aus:

- einem **Web-Backend** (z.B. Node.js oder Python)
- einer **Datenbank** (z.B. PostgreSQL)
- einem **Cache** (z.B. Redis)
- einem **Reverse Proxy** (z.B. nginx)

Sauber getrennt nach „jede Komponente in eigener VM" hast du damit **vier VMs**. Jede bringt ihr eigenes Linux mit – also:

| Komponente | Gast-OS | RAM-Bedarf nur fürs OS |
|------------|---------|------------------------|
| Backend | Ubuntu | 400 MB – 1,5 GB |
| Datenbank | Ubuntu | 400 MB – 1,5 GB |
| Cache | Ubuntu | 400 MB – 1,5 GB |
| Proxy | Ubuntu | 400 MB – 1,5 GB |
| **Summe** | | **ca. 1,6 – 6 GB nur OS** |

Die Spannweite kommt daher, dass eine Ubuntu-VM **im Leerlauf** ca. 400 MB braucht, **mit laufenden System­diensten** aber schnell 1–2 GB. Siehe [Grundbegriffe der Virtualisierung](../virtualisierung/grundbegriffe.md). In beiden Fällen gilt: **mehrere GB RAM**, bevor du eine einzige Zeile eigenen Code laufen lässt. Und vier Gast-Kernels, vier Paket-Manager, vier Security-Update-Zeitplaner.

Die naheliegende Frage:

!!! question "Moment mal …"
    Alle vier VMs laufen auf demselben Host, mit demselben Linux-Kernel darunter. Warum brauche ich **vier** separate Kernels, wenn der Host schon einen hat?

Genau hier setzt die Container-Idee an: **Teilt sich den Kernel des Hosts, kapselt nur die Anwendung samt Abhängigkeiten.**

---

## Der Container-Ansatz in einem Satz

> **Ein Container bündelt eine Anwendung mit allem, was sie zum Laufen braucht – aber ohne eigenen Betriebssystem-Kernel. Er benutzt den Kernel, der auf dem Host schon läuft.**

Für unser Beispiel heißt das:

| Komponente | Ausführung | RAM für „OS-Overhead" |
|------------|------------|------------------------|
| Backend | Container | ca. 20–50 MB |
| Datenbank | Container | ca. 20–50 MB |
| Cache | Container | ca. 10–20 MB |
| Proxy | Container | ca. 10–20 MB |
| **Summe** | | **< 200 MB** |

Statt 1,6 GB sind es jetzt deutlich unter 200 MB OS-Overhead. Das ist der **Gewichts­vorteil**, von dem immer alle reden.

---

## Analogie 1: Das Containerschiff

!!! tip "Container­schiff"
    Stell dir ein großes Container­schiff vor. Darauf liegen **Hunderte standardisierte Container**. Jeder Container sieht von außen gleich aus – gleiche Maße, gleiche Befestigungs­punkte, gleiche Beschriftungs­logik.

    Innen hat jeder Container etwas **völlig anderes**: Bananen, Kühlschränke, Auto­teile, Kaffee.

    Das Schiff muss sich nicht um den Inhalt kümmern. Es muss nur **Container** transportieren können. Standardisierte Hülle, unterschiedlicher Inhalt.

Übertragen auf Software:

- **Schiff** = Host-System mit Docker
- **Container (Schiff)** = Docker-Container
- **Inhalt des Containers** = deine Anwendung samt Abhängigkeiten
- **Standardisierung** = Docker-Format: egal was drin ist, `docker run` startet es

Der Name „Container" ist nicht zufällig gewählt. Er kommt direkt aus dieser Analogie.

---

## Analogie 2: Die Lunchbox

Falls dir das Container­schiff zu abstrakt ist, hilft vielleicht diese:

!!! tip "Lunchbox"
    Du gehst arbeiten und nimmst dein Mittagessen mit. In deiner **Lunchbox** ist alles drin, was du brauchst: Reis, Gemüse, Sauce, Löffel, Serviette. Egal wohin du gehst – Kantine, Park, Bahn – deine Lunchbox hat alles dabei.

    Du musst vor Ort nichts mehr zusammen­suchen.

Übertragen auf Software:

- **Lunchbox** = Container
- **Reis** = die eigentliche Anwendung
- **Gemüse, Sauce, Löffel** = alle Abhängigkeiten (Bibliotheken, Tools, Konfigurationen)
- **Ort** = Host-System, auf dem die Lunchbox geöffnet wird

Das Schöne: eine gepackte Lunchbox gibst du jemandem weiter, und **der andere muss nicht fragen, was drin ist** oder „wie man das isst". Alles Nötige ist dabei.

Diese Analogie funktioniert besonders gut für den Kern­gedanken von Docker:

> **Anwendung + Abhängigkeiten + Konfiguration = ein Paket.**

---

## Drei konkrete Probleme, die Docker entschärft

### 1. „Das läuft bei mir, aber nicht bei dir"

Klassiker: deine Anwendung braucht Python 3.12 mit einem speziellen Paket in Version 2.7. Auf deinem Laptop funktioniert alles, auf dem Server der Kollegin nicht.

**Mit Docker:** das Image enthält genau Python 3.12 und genau das Paket in Version 2.7. Auf jedem Host liefert `docker run` dasselbe Verhalten.

### 2. „Ich will die Anwendung schnell mal ausprobieren"

Klassisches Setup für einen neuen Webserver: Paket-Manager aufrufen, Abhängigkeiten installieren, Konfigurations­dateien anfassen, Dienst starten. Zehn Minuten, wenn du weißt, was du tust. Eine Stunde, wenn du Pech hast.

**Mit Docker:** `docker run nginx` – und ein Webserver läuft. Nach fünf Sekunden.

### 3. „Mein Server ist ein Schlachtfeld installierter Pakete"

Server, auf denen viele Projekte betrieben werden, sammeln irgendwann Müll: alte Python-Versionen, Bibliotheken, die niemand mehr braucht, halb deinstallierte Dienste.

**Mit Docker:** alle Anwendungen liegen **in ihren eigenen Containern**. Löschst du einen Container, ist auch alles weg, was dazu gehört. Der Host bleibt sauber.

---

## Der zentrale Merksatz des gesamten Blocks

!!! success "Merksatz – unbedingt merken"
    > **VMs kapseln ganze Systeme. Container kapseln vor allem Anwendungen.**

Dieser Satz trägt den ganzen Docker-Block. Wenn du ihn dir in einer Weise merkst, die du einem Laien erklären könntest, hast du schon 70 % dieses Kapitels verstanden.

Auf der nächsten Seite schauen wir uns genauer an, **wie** Container das technisch schaffen – und was der Unterschied zur klassischen Virtualisierung genau ist.

---

## Weiterlesen

- [Container vs. VM – der technische Unterschied](container-vs-vm.md)
- [Docker Desktop ist eine VM](docker-desktop-wahrheit.md) – speziell für Mac- und Windows-Nutzer
