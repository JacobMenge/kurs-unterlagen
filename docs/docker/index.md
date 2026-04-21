---
title: "Docker – Überblick"
description: "Einstieg in Docker: warum Container entstanden sind, wie sie sich von VMs unterscheiden, und wie du deinen ersten Container startest."
---

# Docker – Überblick

Im Virtualisierungs-Block hast du gesehen, dass wir Systeme kapseln können – mit dem Preis, dass **jede VM ihr eigenes Betriebssystem** mitbringt. Das ist für viele Fälle übertrieben. Oft willst du nicht „ein ganzes System", sondern nur **eine einzelne Anwendung in einer sauberen Umgebung**.

Genau dafür gibt es **Docker** und die Idee der **Container**.

!!! abstract "Was du nach diesem Kapitel kannst"
    - erklären, **warum Container als Alternative zu VMs** entstanden sind
    - den **technischen Unterschied** zwischen Container und VM benennen (Stichwort: geteilter Kernel)
    - verstehen, warum **Docker Desktop auf Mac und Windows** selbst eine VM ist
    - die Begriffe **Image**, **Container**, **Layer**, **Registry**, **Tag**, **Dockerfile** sicher verwenden
    - ein **erstes eigenes Image** bauen, starten und wieder entfernen

---

## Seiten in diesem Kapitel

| Seite | Inhalt | Art |
|-------|--------|-----|
| [Warum Docker?](warum-docker.md) | Motivation: das Gewicht von VMs, Container-Analogien | Theorie |
| [Container vs. VM](container-vs-vm.md) | Technischer Vergleich, Namespaces und cgroups | Theorie |
| [Docker Desktop ist eine VM](docker-desktop-wahrheit.md) | Kritisch für Mac- und Windows-Nutzer | Theorie |
| [Image und Container](image-und-container.md) | Vorlage, Instanz, Layer, Copy-on-Write | Theorie |
| [Registry und Docker Hub](registry-und-dockerhub.md) | Woher kommen Images? `pull`, `push`, Tags | Theorie |
| [Dockerfile – Grundlagen](dockerfile-grundlagen.md) | FROM, COPY, RUN, CMD und Co. | Theorie |
| [Docker installieren](installation.md) | Schritt-für-Schritt-Installation auf Windows 11, macOS, Linux inkl. Troubleshooting | Anleitung |
| [Erste Schritte](erste-schritte.md) | `docker run` mit hello-world, nginx, httpd | Anleitung |
| [Praxis: eigenes Image](praxis-eigenes-image.md) | Eigenes nginx-Image bauen und deployen | Anleitung |
| [Stolpersteine](stolpersteine.md) | Typische Fehler und ihre Lösung | Referenz |
| [Merksätze](merksaetze.md) | Zusammenfassung | Referenz |

---

## Empfohlene Leserichtung

1. **[Warum Docker?](warum-docker.md)** – woher der Container-Boom kommt.
2. **[Container vs. VM](container-vs-vm.md)** – der präzise technische Unterschied.
3. **[Docker Desktop ist eine VM](docker-desktop-wahrheit.md)** – **wichtig** für Mac/Windows.
4. **[Image und Container](image-und-container.md)** – das zentrale Begriffspaar.
5. **[Registry und Docker Hub](registry-und-dockerhub.md)** – woher Images kommen.
6. **[Dockerfile – Grundlagen](dockerfile-grundlagen.md)** – wie Images entstehen.
7. **[Docker installieren](installation.md)** – Schritt-für-Schritt für Windows 11, macOS und Linux.
8. **[Erste Schritte](erste-schritte.md)** – die ersten Befehle am Terminal.
9. **[Praxis: eigenes Image](praxis-eigenes-image.md)** – dein eigener Container.
10. Bei Problemen: **[Stolpersteine](stolpersteine.md)**.
11. Zum Wiederholen: **[Merksätze](merksaetze.md)**.

Für schnellen Befehls-Lookup: **[Cheatsheet Docker](../cheatsheets/docker.md)**.

---

## Was in diesem Kapitel **nicht** drin ist

- **Docker Compose** – kommt später, wenn wir mehrere Container orchestrieren wollen.
- **Volumes / Bind Mounts** in Tiefe – kurz erwähnt, ausführlich im nächsten Kursblock.
- **`ENTRYPOINT`, Multi-Stage-Builds, `docker network`** – jenseits des heutigen Einstiegs.
- **Kubernetes** – ganz andere Liga, eigene Einheit.

Dieser Block legt die Grundlage. Alles Weitergehende baut darauf auf.

---

## Leitfrage des Blocks

> **Wenn ich nur eine Anwendung sauber, reproduzierbar und überall gleich laufen lassen will – wie mache ich das, ohne jedes Mal ein ganzes Betriebssystem mitzuschleppen?**

Die Antwort führt uns zu Containern. Los geht’s.
