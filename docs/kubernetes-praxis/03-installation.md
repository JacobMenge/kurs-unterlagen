---
title: "Installation"
description: "Einen lokalen Kubernetes-Cluster einrichten – Schritt für Schritt für Windows 11, macOS und Linux. Mit minikube und kubectl, Docker Desktop als Alternative, plus Prüfen, ob alles läuft."
---

# Installation

Für die Praxis brauchst du **zwei Dinge**:

1. **`kubectl`** – das Kommandozeilen-Werkzeug, mit dem du den Cluster bedienst.
2. einen **lokalen Cluster** auf deinem Rechner. Wir nehmen **minikube** – es packt einen vollständigen Ein-Knoten-Cluster in eine kleine virtuelle Maschine und läuft auf **Windows, macOS und Linux gleich**.

!!! info "Warum minikube – und der Docker-Bezug"
    minikube nutzt **Docker** als Unterbau (den „Treiber“). Den hast du aus den Docker-Blöcken schon – **Docker Desktop muss also laufen**, bevor wir den Cluster starten. Wer lieber Docker Desktops eingebauten Kubernetes-Schalter nutzt, findet die [Alternative weiter unten](#alternative-kubernetes-in-docker-desktop). Wir richten uns im ganzen Block nach Befehlen, die mit **beiden** Wegen funktionieren.

---

## Schnelltest: hast du schon alles?

Öffne ein Terminal (Windows: **PowerShell**; macOS/Linux: **Terminal**) und tippe:

```bash
kubectl version --client
minikube version
```

- Beide geben eine **Versionsnummer** aus? Dann fehlt nur noch der laufende Cluster → spring zu [Cluster starten](#cluster-starten).
- Kommt **„command not found“** / **„wird nicht erkannt“**? Dann folge unten der Anleitung für dein Betriebssystem.

!!! warning "Docker muss laufen"
    Egal welches Betriebssystem: Starte zuerst **Docker Desktop** (Windows/macOS) bzw. die **Docker Engine** (Linux) und warte, bis Docker bereit ist. Ohne laufenden Docker startet der Cluster nicht. Falls Docker noch fehlt: [Docker installieren](../docker/installation.md).

---

## Werkzeuge installieren

=== "Windows 11"

    Am einfachsten über den eingebauten Paketmanager **winget** (in Windows 11 vorhanden). „Terminal“ öffnen (kein Admin nötig) und ausführen:

    ```powershell
    winget install -e --id Kubernetes.kubectl
    winget install -e --id Kubernetes.minikube
    ```

    Danach das **Terminal einmal schließen und neu öffnen**, damit die Befehle im `PATH` landen.

    ??? note "Kein winget? Dann Chocolatey"
        Falls winget fehlt, geht es mit [Chocolatey](https://chocolatey.org/install) in einer **Admin**-PowerShell:

        ```powershell
        choco install kubernetes-cli minikube -y
        ```

    !!! tip "Docker Desktop muss vorher laufen"
        Stelle sicher, dass Docker Desktop gestartet ist und das Wal-Symbol „Engine running“ zeigt – minikube setzt darauf auf.

=== "macOS"

    Am einfachsten über **[Homebrew](https://brew.sh)**:

    ```bash
    brew install kubectl
    brew install minikube
    ```

    !!! note "Apple Silicon oder Intel – egal"
        Homebrew lädt automatisch die passende Variante für deinen Mac. Docker Desktop muss laufen, bevor du den Cluster startest.

=== "Linux"

    **kubectl** (offizielles Binary für x86_64):

    ```bash
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
    ```

    **minikube** (x86_64):

    ```bash
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    sudo install minikube-linux-amd64 /usr/local/bin/minikube
    ```

    !!! note "Docker als Treiber, ohne sudo"
        minikube nutzt unter Linux die **Docker Engine**. Dein Benutzer sollte in der `docker`-Gruppe sein (`sudo usermod -aG docker $USER`, dann ab- und anmelden) – siehe [Docker installieren](../docker/installation.md#installation-auf-linux-ubuntu-debian). Auf **ARM**-Geräten (z.B. Raspberry Pi) jeweils `arm64` statt `amd64` herunterladen.

---

## Cluster starten

In **allen** Fällen gleich. Docker muss laufen, dann:

```bash
minikube start --driver=docker
```

Beim ersten Mal lädt minikube ein Cluster-Image (das dauert ein paar Minuten) und richtet alles ein. Am Ende steht sinngemäß „Done! kubectl is now configured to use minikube“.

!!! note "Kurz erklärt: was hier passiert"
    `minikube start` baut eine kleine virtuelle Maschine (als Docker-Container), installiert darin einen kompletten Kubernetes-Cluster und stellt deinen `kubectl` automatisch auf diesen Cluster ein. `--driver=docker` sagt: „nimm Docker als Unterbau.“ Ein einziger Befehl – und du hast einen echten Cluster.

---

## Prüfen, ob alles läuft

```bash
kubectl get nodes
```

Erwartet: **eine** Zeile mit einem Node namens `minikube`, Status **`Ready`**:

```text
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   1m    v1.xx.x
```

Zur Gegenprobe:

```bash
kubectl get pods -A
```

Das listet die System-Pods des Clusters (im Namespace `kube-system`) – laufen die, ist dein Cluster gesund. 🎉

!!! tip "Das Cluster-Dashboard (optional, aber schön)"
    minikube bringt eine grafische Übersicht mit. Sie öffnet sich im Browser und zeigt Pods, Deployments und Services live:

    ```bash
    minikube dashboard
    ```

    Praktisch, um beim Üben **zuzusehen**, was deine `kubectl`-Befehle bewirken. Schließen mit `Ctrl+C` im Terminal.

---

## Alternative: Kubernetes in Docker Desktop

Wenn du Docker Desktop sowieso offen hast, kannst du dessen **eingebauten Kubernetes** statt minikube nutzen:

1. Docker Desktop öffnen → **Settings** (Zahnrad) → **Kubernetes**.
2. Haken bei **„Enable Kubernetes“** setzen → **Apply & restart**. Beim ersten Mal lädt Docker die nötigen Images (dauert ein paar Minuten).
3. Prüfen, dass `kubectl` auf den richtigen Cluster zeigt:

    ```bash
    kubectl config use-context docker-desktop
    kubectl get nodes
    ```

    Erwartet: ein Node `docker-desktop`, Status `Ready`.

!!! note "Welchen Cluster bediene ich gerade?"
    `kubectl` kann mehrere Cluster kennen. Der aktive heißt **Kontext**. So schaust und wechselst du:

    ```bash
    kubectl config current-context        # welcher ist aktiv?
    kubectl config get-contexts           # alle bekannten
    kubectl config use-context minikube   # zu minikube wechseln
    ```

    Wenn ein Befehl ins Leere läuft, ist fast immer der **falsche Kontext** aktiv. [Hilfekarte 1](09-hilfekarten.md#hilfekarte-1-falscher-cluster-kontext) hilft.

---

## Das Projekt besorgen

In den Praxis-Teilen wenden wir ein paar fertige **Manifeste** an. Hol dir die Projektdateien lokal – zwei Wege:

=== "Mit Git (empfohlen)"
    ```bash
    git clone https://github.com/JacobMenge/kurs-unterlagen.git
    cd kurs-unterlagen/apps/kubernetes-praxis
    ```

=== "Ohne Git (ZIP)"
    1. <https://github.com/JacobMenge/kurs-unterlagen> öffnen.
    2. Grüner Button **Code → Download ZIP**, entpacken.
    3. In den Ordner `apps/kubernetes-praxis` wechseln.

---

## Aufräumen (für später)

Den Cluster brauchst du erst, wenn du wirklich fertig bist – dann:

```bash
minikube stop      # pausiert den Cluster (Zustand bleibt)
minikube delete    # löscht den Cluster komplett (für einen sauberen Neustart)
```

---

## Weiter

- [Praxis 1: Hello World](04-praxis-hello-world.md) – jetzt startest du deinen ersten Pod
