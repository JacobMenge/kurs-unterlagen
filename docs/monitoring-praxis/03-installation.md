---
title: "Installation"
description: "Was installiert werden muss und wie – Schritt für Schritt für Windows, macOS und Linux. Danach prüfen, ob Docker läuft."
---

# Installation

Für diesen Block brauchst du **nur eines: Docker**. Der komplette Monitoring-Stack (Prometheus, Grafana, die Beispiel-App) läuft in Containern – ist Docker installiert, läuft alles andere von selbst.

!!! tip "Vielleicht hast du Docker schon"
    Wenn du den Docker-Block schon mitgemacht hast, ist Docker wahrscheinlich startklar. Mach zuerst den **Schnelltest** unten – läuft er, kannst du die Installation überspringen.

---

## Schnelltest: läuft Docker schon?

Öffne ein Terminal (Windows: PowerShell; macOS/Linux: Terminal) und tippe:

```bash
docker version
docker compose version
```

- Bekommst du bei beiden eine **Versionsnummer** (bei `docker version` einen „Client"- **und** einen „Server"-Block)? Dann ist alles startklar → weiter zu [Beispiel-Anwendung starten](04-beispiel-anwendung.md).
- Kommt ein **Fehler** („command not found" oder „Cannot connect to the Docker daemon")? Dann folge unten der Anleitung für dein Betriebssystem.

---

## Docker installieren

=== "Windows"

    **Docker Desktop mit WSL2.**

    1. **WSL2 aktivieren.** „Terminal (Admin)" öffnen (Rechtsklick aufs Start-Menü) und ausführen:

        ```powershell
        wsl --install
        ```

        Danach Windows **neu starten**, wenn gefordert.

    2. **Docker Desktop herunterladen:** <https://www.docker.com/products/docker-desktop/> → „Download for Windows".

    3. **Installer ausführen** (`Docker Desktop Installer.exe`). Den Haken bei **„Use WSL 2 instead of Hyper-V"** aktiviert lassen. Durchlaufen lassen, ggf. neu starten.

    4. **Docker Desktop starten.** Warten, bis das Wal-Symbol unten „Engine running" zeigt.

    5. **Neues** PowerShell-Fenster öffnen und [unten prüfen](#prufen-ob-alles-lauft).

    !!! warning "Befehl nicht gefunden?"
        Docker Desktop muss **laufen**, bevor du das Terminal öffnest – sonst kennt PowerShell den `docker`-Befehl nicht. Erst Docker Desktop starten, dann ein neues Terminal.

=== "macOS"

    **Docker Desktop.**

    1. **Herunterladen:** <https://www.docker.com/products/docker-desktop/>. Die richtige Variante wählen:
        - **Mac with Apple Chip** (M1/M2/M3/M4)
        - **Mac with Intel Chip** (ältere Macs)

        Unsicher? Apfel-Menü → **Über diesen Mac**: steht dort „Apple M…", nimm Apple Chip.

    2. **Installieren:** `.dmg` öffnen, das **Docker-Symbol in den Programme-Ordner** ziehen.

    3. **Starten:** Docker aus dem Programme-Ordner öffnen, beim ersten Start mit **Öffnen** bestätigen und die Admin-Abfrage zulassen.

    4. Warten, bis das Wal-Symbol in der Menüleiste „running" zeigt.

    5. Terminal öffnen und [unten prüfen](#prufen-ob-alles-lauft).

=== "Linux"

    **Docker Engine (Ubuntu/Debian).** Der schnellste Weg ist das offizielle Installations-Skript:

    1. **Docker installieren:**

        ```bash
        curl -fsSL https://get.docker.com | sudo sh
        ```

    2. **Ohne `sudo` nutzbar machen** (eigenen Benutzer in die `docker`-Gruppe):

        ```bash
        sudo usermod -aG docker $USER
        ```

        Danach **einmal ab- und wieder anmelden** (oder `newgrp docker` in der aktuellen Shell).

    3. **Daemon starten/aktivieren:**

        ```bash
        sudo systemctl enable --now docker
        ```

    4. [Unten prüfen](#prufen-ob-alles-lauft).

    !!! note "Andere Distributionen"
        Für RPM-basierte Systeme (Fedora, Rocky, Alma) und Details siehe die ausführliche Seite [Docker installieren](../docker/installation.md#installation-auf-linux-ubuntu-debian).

---

## Prüfen, ob alles läuft

In **allen** Fällen zum Schluss prüfen:

```bash
docker version
docker compose version
docker run hello-world
```

- `docker version` zeigt einen **Client-** und einen **Server-Block** mit Versionsnummern.
- `docker compose version` zeigt eine Versionsnummer (Compose v2).
- `docker run hello-world` lädt ein winziges Test-Image und gibt eine Begrüßung aus.

Läuft alles? Dann bist du bereit. 🎉

!!! info "Es hakt irgendwo?"
    Die ausführliche Seite [Docker installieren](../docker/installation.md) hat für jedes Betriebssystem einen **Troubleshooting-Abschnitt** (WSL2-Fehler, Apple-Silicon, fehlende Rechte unter Linux) und beschreibt **Alternativen** zu Docker Desktop (OrbStack, Colima, Podman, Rancher Desktop).

---

## Das Projekt besorgen

Du brauchst die Projektdateien lokal. Zwei Wege:

=== "Mit Git (empfohlen)"
    ```bash
    git clone https://github.com/JacobMenge/kurs-unterlagen.git
    cd kurs-unterlagen/apps/monitoring-praxis
    ```

=== "Ohne Git (ZIP)"
    1. <https://github.com/JacobMenge/kurs-unterlagen> öffnen.
    2. Grüner Button **Code → Download ZIP**, entpacken.
    3. In den Ordner `apps/monitoring-praxis` wechseln.

---

## Weiter

- [Beispiel-Anwendung starten](04-beispiel-anwendung.md) – den Stack hochfahren
