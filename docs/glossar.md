---
title: "Glossar"
description: "Alle Fachbegriffe dieses Kurses auf einen Blick – ausführlich erklärt und alphabetisch sortiert."
---

# Glossar

Diese Seite erklärt alle Fachbegriffe, die im Kurs vorkommen, **verständlich und in mehreren Sätzen**.
Auf anderen Seiten sind die Begriffe automatisch verlinkt – ein Klick bringt dich direkt zur passenden Definition.

!!! tip "Aufbau"
    Die Einträge sind **alphabetisch** sortiert. Wenn du einen Begriff nicht findest, nutze die **Suche** oben rechts oder schlage im passenden Kapitel nach.

---

## <span id="adminer"></span>Adminer
: Schlanke **Web-Oberfläche zur Verwaltung von Datenbanken** wie PostgreSQL, MySQL oder SQLite. Wird als offizielles Docker-Image (`adminer`) bereitgestellt und ist damit in Sekunden startklar. Kein Setup nötig – Login-Maske öffnen, Host/User/Passwort eingeben, loslegen. In diesem Kurs nutzen wir Adminer, um in einer Postgres-Datenbank Tabellen anzulegen und Daten einzusehen.

## <span id="alpine"></span><span id="slim"></span>Alpine / Slim (Basis-Images)
: **Minimale Linux-Basis-Images für Container.**

    - **Alpine** ist eine eigenständige, sehr kleine Distribution (~5 MB Basis), die `musl` statt `glibc` und `apk` als Paketmanager nutzt. Beliebt für schlanke Images. Vorsicht: manche Software (vor allem Python-Wheels mit C-Code) braucht spezielle Alpine-Builds, sonst muss kompiliert werden – das kann Build-Zeiten verlängern.
    - **Slim** (z.B. `python:3.12-slim`, `node:20-slim`) ist eine entschlackte Variante eines klassischen Debian-basierten Images. Behält `glibc` und `apt`, lässt aber Doku, Build-Tools und seltene Pakete weg. Ein guter Kompromiss zwischen Größe und Kompatibilität.

    Faustregel: **Slim** ist der sichere Default. **Alpine** wenn du wirklich jeden MB sparen willst und deine Abhängigkeiten kompatibel sind.

## <span id="api"></span><span id="apis"></span>API (Application Programming Interface)
: **Definierte Schnittstelle, über die Programme miteinander reden.** Eine Web-API beschreibt: „Schicke einen `GET /entries`-Request an diese URL, du bekommst JSON zurück". Im Kurs taucht `API` vor allem im Compose- und Escape-Room-Block auf, wo eine kleine Web-Anwendung mit der Datenbank über eine REST-API spricht. Siehe auch [REST](#rest), [GET](#get), [POST](#post), [Endpoint](#endpoint).

## <span id="apparmor"></span>AppArmor
: **Linux-Sicherheitsmodul**, das den Zugriff eines Prozesses auf Dateien, Netzwerke und andere Ressourcen einschränkt. Ubuntu und Debian setzen AppArmor standardmäßig ein. Docker bringt ein Default-Profil mit, das für die meisten Container passt – selten Ursache von Problemen. Du erkennst AppArmor-Blockaden in `dmesg`-Logs.

## <span id="argocd"></span>ArgoCD
: **GitOps-Controller für Kubernetes.** Liest fortlaufend einen Git-Branch mit Cluster-Manifesten und gleicht den **Soll-Zustand aus dem Repo** mit dem **Ist-Zustand im Cluster** ab. Drift wird automatisch korrigiert, jeder Cluster-Stand ist auf einen Git-Commit zurückführbar. Ein typisches Setup: die CI-Pipeline pusht ein neues Image in die Registry und ändert die Image-Referenz in einem GitOps-Repo; ArgoCD bemerkt den Commit und rollt aus. Alternative Tools: Flux, Argo Rollouts (für Blue/Green und Canary).

## <span id="artifact"></span><span id="artefakt"></span><span id="upload-artifact"></span><span id="download-artifact"></span>Artifact / Artefakt (GitHub Actions)
: **Datei oder Ordner, den ein Job am Ende hochlädt, damit ein nachfolgender Job (oder du selbst nach dem Lauf) darauf zugreifen kann.** Hintergrund: jeder GitHub-Actions-Job startet auf einer **eigenen, frischen Runner-VM** – Dateien aus dem vorigen Job sind weg. Mit `actions/upload-artifact@v4` schickt ein Job seine Dateien in den GitHub-Storage, mit `actions/download-artifact@v4` zieht ein späterer Job sie wieder herunter:

    ```yaml
    - uses: actions/upload-artifact@v4
      with:
        name: build-output
        path: dist/

    # In einem späteren Job mit `needs:`:
    - uses: actions/download-artifact@v4
      with:
        name: build-output
        path: dist/
    ```

    Artifacts sind außerdem im Actions-Tab pro Workflow-Lauf unter „Artifacts" zum manuellen Download sichtbar. Sie werden **standardmäßig 90 Tage aufbewahrt** und gelten danach als verworfen (konfigurierbar über `retention-days`). Für reine Docker-Image-Layer ist `cache-from: type=gha` in der `docker/build-push-action` meistens praktischer als Artifacts (siehe [GitHub Actions Cache](#github-actions-cache)). Begrifflich nicht zu verwechseln mit „Build-Artefakt" im allgemeinen Sprachgebrauch – dort meint Artefakt einfach das **Ergebnis eines Builds** (Binary, Image, .zip).

## <span id="apt"></span>apt / apt-get
: **Paketmanager** der Debian- und Ubuntu-Linux-Distributionen. Damit installierst, aktualisierst und entfernst du Software: `sudo apt install docker-ce`, `sudo apt update`, `sudo apt remove foo`. Der neuere Befehl ist `apt`, der ältere `apt-get` – funktional fast identisch, `apt` hat eine schönere Ausgabe.

## <span id="arm"></span>ARM / Apple Silicon
: **Prozessor-Architektur**, die seit 2020 auf neueren Macs (M1, M2, M3, M4) und vielen mobilen Geräten läuft. Unterscheidet sich grundlegend von der klassischen `x86_64`-Architektur, weshalb Software oft in zwei Varianten ausgeliefert wird. Für Docker bedeutet das: viele Images haben ARM- und x86_64-Varianten, manche nur eine. ARM-native Images laufen auf Apple Silicon sehr schnell, x86_64-Images müssen emuliert werden (langsamer).

## <span id="bare-metal"></span>Bare-Metal
: Bezeichnung für Software, die **direkt auf der Hardware** läuft, ohne ein Host-Betriebssystem darunter. Typ-1-Hypervisoren wie ESXi und KVM werden oft „bare-metal" genannt. Das ist besonders performant, weil der Umweg über ein Host-OS entfällt – typisch in Rechenzentren und Clouds.

## <span id="bash"></span>Bash
: **Die Standard-Shell** auf vielen Linux-Systemen und älteren Macs. Liest Befehle aus dem Terminal, führt sie aus und zeigt Ausgaben. Bash ist mächtig (Pipes, Skripte, Variablen) und wird in allen Praxis-Teilen dieses Kurses auf Linux/macOS angenommen. Auf macOS seit Catalina ist allerdings Zsh der Default, Bash ist aber nachinstallierbar.

## <span id="bind-mount"></span>Bind Mount
: Ein **Host-Verzeichnis wird direkt** in einen Container eingehängt. Änderungen im Container sind sofort auf dem Host sichtbar und umgekehrt. Typisch beim Entwickeln: den Quellcode vom Host in den Container mounten, damit Änderungen ohne Rebuild sichtbar werden. Im Gegensatz zu Volumes kennst du den Host-Pfad direkt und kannst ihn mit anderen Tools (Editor, Git) bearbeiten.

## <span id="blue-green"></span><span id="blue-green-deployment"></span>Blue/Green Deployment
: **Deployment-Strategie**, bei der zwei vollständige Umgebungen parallel existieren: **Blau** ist live, **Grün** wird mit der neuen Version vorbereitet. Smoke-Tests laufen gegen Grün, ohne dass User Traffic sehen. Beim Switch leitet der Load Balancer alles auf Grün um – Blau bleibt für **instantes Rollback** stehen. Vorteil: sofortiger Rollback, klares mentales Modell. Nachteil: doppelter Ressourcenverbrauch während des Switches.

## <span id="bios"></span>BIOS (Basic Input/Output System)
: **Firmware**, die beim Starten eines Rechners als Erstes ausgeführt wird. Findet Hardware, initialisiert sie und lädt den Bootloader. BIOS ist der historische Name und weitgehend durch UEFI abgelöst – im Alltag werden beide Begriffe oft synonym verwendet.

## <span id="bridge"></span><span id="bridge-netzwerk"></span>Bridge-Netzwerk
: **Default-Netzwerktreiber von Docker.** Alle Container, die ohne weitere Angabe gestartet werden, landen in einer virtuellen Switch („Bridge") auf dem Host. Im **User-Defined Bridge** gibt es DNS (Container finden sich per Name), im **Default-Bridge** nicht. Die Bridge ist ein virtuelles Gerät im Linux-Kernel, das Pakete zwischen Containern und der Außenwelt weiterleitet. Siehe auch [Docker-Netzwerke](docker-aufbau/docker-networks.md).

## <span id="bootloader"></span>Bootloader
: **Kleines Programm**, das nach BIOS/UEFI gestartet wird und den Kernel des Betriebssystems in den RAM lädt und anspringt. Auf Linux häufig **GRUB** (Grand Unified Bootloader). Virtuelle Maschinen haben ihren eigenen virtuellen Bootloader, der beim VM-Start läuft.

## <span id="buildx"></span>buildx
: **Erweitertes `docker build`-Plugin** für moderne Build-Funktionen. Wird seit Docker 20.10 standardmäßig mitgeliefert. Wichtige Features: **Multi-Architektur-Builds** (`--platform linux/amd64,linux/arm64` baut beide Varianten gleichzeitig), bessere Cache-Backends (`--cache-from`, `--cache-to`) und der moderne Frontend-Mechanismus per `# syntax=docker/dockerfile:1`. Im Alltag merkst du buildx kaum – es übernimmt automatisch im Hintergrund.

## <span id="build-kontext"></span>Build-Kontext
: Der **Ordner, der beim `docker build .` komplett an den Docker-Daemon gesendet wird**. Alle `COPY`- und `ADD`-Pfade im Dockerfile beziehen sich auf diesen Ordner. Der Punkt am Ende von `docker build -t name .` ist genau dieser Kontext. Mit einer `.dockerignore` kann man Dateien ausschließen, damit Build-Kontext und Image schlank bleiben.

## <span id="buildkit"></span>BuildKit
: **Modernes Build-Backend von Docker** seit Docker 18.09, seit 23.0 Default. Bringt deutliche Verbesserungen gegenüber dem klassischen Builder: paralleles Bauen unabhängiger Build-Stages, **bessere Cache-Granularität** (Inhalt statt nur Reihenfolge), Cache-Backends in Registries (`--cache-to`, `--cache-from`), Multi-Architektur-Builds via [buildx](#buildx), Build-Secrets ohne Image-Spuren (`--mount=type=secret`). BuildKit liest spezielle `# syntax=docker/dockerfile:1`-Direktiven am Anfang eines Dockerfiles, um neue Features zu aktivieren.

## <span id="cache"></span><span id="caching"></span><span id="layer-cache"></span><span id="layer-caching"></span>Cache / Caching (Docker-Layer-Cache)
: **Zwischenspeicher zur Wiederverwendung von Daten.** Im Docker-Kontext meint „Cache" fast immer den **Layer-Cache**: Wenn `docker build` einen Schritt schon einmal mit identischem Input ausgeführt hat, nutzt es das gespeicherte Ergebnis erneut, statt neu zu bauen. Deshalb ist die Reihenfolge im Dockerfile so wichtig – selten geänderte Layer (Abhängigkeiten) **vor** häufig geänderten (eigener Code) platzieren. Cache-Verhalten erzwingen mit `--no-cache`. In einer Pipeline kann dieser Layer-Cache zwischen Workflow-Läufen geteilt werden – siehe [GitHub Actions Cache](#github-actions-cache).

## <span id="github-actions-cache"></span><span id="gha-cache"></span>GitHub Actions Cache (`type=gha`)
: **Speicher-Backend für Build-Caches, das GitHub jedem Repo kostenlos bereitstellt.** In der `docker/build-push-action` aktivierst du es mit zwei Zeilen:

    ```yaml
    - uses: docker/build-push-action@v6
      with:
        context: .
        cache-from: type=gha
        cache-to: type=gha,mode=max
    ```

    `type=gha` ist die Adresse des Speichers, `mode=max` sagt: „speichere **alle** Zwischenlayer, nicht nur den finalen". Beim nächsten Lauf zieht BuildKit unveränderte Layer aus diesem Cache, statt sie neu zu bauen – im Log siehst du `CACHED` neben den entsprechenden Build-Schritten. Pro Repo gibt es **10 GB Cache-Kontingent**; älteste Einträge werden automatisch verdrängt, wenn das Kontingent voll ist. Unverändert seit 7 Tagen nicht angefasste Einträge werden ohnehin gelöscht.

    Konzeptionell verwandt, aber **nicht dasselbe** wie [Artefakte](#artifact): Cache ist für Build-Wiederverwendung optimiert und beliebig nachladbar; Artefakte sind explizit benannte Dateien zwischen zwei Jobs.

## <span id="canary"></span><span id="canary-deployment"></span>Canary Deployment
: **Deployment-Strategie**, bei der eine neue Version zuerst nur einen kleinen Teil der Nutzer erreicht (oft 5 %). Wenn Metriken stabil bleiben (Fehlerrate, Latenz), wird der Anteil schrittweise erhöht. Ein Bug trifft so anfangs nur einen Bruchteil der Nutzer; bei Auffälligkeit wird der Anteil sofort zurückgesetzt. Voraussetzung: feinkörniger Traffic-Splitter (Service Mesh, Feature-Flag-System) und gute Observability.

## <span id="capability"></span>Capability
: **Feinkörniges Rechte-System unter Linux**. Statt „alles oder nichts" (root/nicht-root) werden einzelne Fähigkeiten wie „darf Ports unter 1024 öffnen" oder „darf Kernel-Module laden" getrennt vergeben. Container bekommen meist nur ein reduziertes Set dieser Capabilities. Das erschwert Angreifern, aus einem kompromittierten Container auszubrechen.

## <span id="compose"></span>Compose / Docker Compose
: **Docker-Werkzeug zum deklarativen Starten und Verwalten von Multi-Container-Stacks**. Die Definition steht in einer `compose.yaml`, gestartet wird mit `docker compose up -d`. Aktuelle Version ist Compose V2 (`docker compose` mit Leerzeichen), nicht das veraltete `docker-compose` mit Bindestrich. Mit Compose beschreibst du einmal, wie dein Stack aussehen soll – statt mehrere `docker run`-Befehle einzeln zu tippen.

## <span id="compose-override-yaml"></span><span id="compose.override.yaml"></span>compose.override.yaml
: **Optionale Override-Datei**, die Compose **automatisch zusätzlich** zur `compose.yaml` lädt, wenn sie im selben Ordner liegt. Werte aus der Override-Datei überschreiben Werte aus der Basis-`compose.yaml`. Klassisches Muster: `compose.yaml` enthält den produktionstauglichen Stack, `compose.override.yaml` bringt lokale Entwicklungs-Spezifika (Live-Mounts, Debug-Ports, andere Image-Tags). Mehrere Override-Dateien lassen sich auch explizit über `docker compose -f compose.yaml -f compose.dev.yaml up -d` kombinieren.

## <span id="compose-yaml"></span>compose.yaml
: Die **zentrale Konfigurationsdatei für Docker Compose**. Enthält Top-Level-Blöcke `services:`, `volumes:`, `networks:` und beschreibt den kompletten Container-Stack. Das ältere `docker-compose.yml` (mit Bindestrich) wird noch gelesen, die neue Konvention ist aber `compose.yaml`.

## <span id="cgroup"></span>cgroup (Control Group)
: **Linux-Kernel-Feature**, mit dem festgelegt wird, wie viele Ressourcen (CPU, RAM, I/O) ein Prozess verbrauchen darf. Docker setzt damit Limits für jeden Container, damit ein ausufernder Container nicht den ganzen Host auffrisst. Es gibt zwei Major-Versionen: **cgroups v1** (älter) und **cgroups v2** (neuer, ab Fedora 31, Ubuntu 21.10, Debian 11 Default). Docker ab Version 20.10 funktioniert auf beiden.

## <span id="ci-cd"></span><span id="continuous-integration"></span><span id="continuous-delivery"></span><span id="continuous-deployment"></span>CI/CD (Continuous Integration / Delivery / Deployment)
: **Automatisierte Software-Auslieferung in drei aufeinander aufbauenden Stufen.** Wer „CI/CD" sagt, meint je nach Kontext eine oder mehrere davon:

    - **Continuous Integration (CI)** – bei jedem Push in den Hauptzweig baut ein Server den Code und führt Tests aus. Schlägt etwas fehl, gilt der Branch als kaputt und das Team wird sofort gewarnt.
    - **Continuous Delivery (CD)** – jede grüne CI-Version wird automatisch **paketiert** (z.B. als Docker-Image in eine Registry gepusht), sodass sie jederzeit ausrollbar ist. Den finalen **Veröffentlichungs-Klick** macht aber ein Mensch.
    - **Continuous Deployment (CD)** – jede grüne Version wird ohne menschliches Zutun in Produktion ausgerollt. Setzt sehr gute Tests, Rollback-Pfad und Monitoring voraus.

    Achtung: „CD" ist mehrdeutig und bezeichnet sowohl Delivery als auch Deployment. Im Zweifel nachfragen. Docker passt zu allen drei Stufen, weil Images in der Pipeline reproduzierbar gebaut werden. Bekannte CI/CD-Systeme: GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure DevOps. Siehe [CI/CD-Block](ci-cd/index.md).

## <span id="cli"></span>CLI (Command-Line Interface)
: **Textbasierte Bedienung** eines Programms oder Systems über die Kommandozeile. Gegenstück zum GUI. Du tippst Befehle ein wie `docker run nginx` oder `ls -la` und bekommst Textausgaben zurück. CLI-Tools lassen sich leicht automatisieren, in Skripte einbauen und per SSH auf entfernten Rechnern nutzen – deshalb sind sie in der IT so verbreitet.

## <span id="collaborator"></span><span id="collaboratorin"></span>Collaborator (GitHub)
: **Person, die zu einem privaten oder öffentlichen GitHub-Repository als Mitwirkende eingeladen wurde.** Collaborators dürfen je nach vergebener Rolle Branches pushen, Pull Requests öffnen, Issues bearbeiten oder mergen. Eingeladen werden sie unter **Settings → Collaborators → Add people**.

    Vier typische Rollenstufen auf GitHub:

    - **Read** – nur Lesezugriff
    - **Triage** – darf Issues und PRs verwalten, aber nicht pushen
    - **Write** – darf pushen, Branches anlegen, PRs öffnen (Standard für Mitwirkende)
    - **Maintain** / **Admin** – darf zusätzlich Konfiguration und Berechtigungen ändern (siehe [Maintainer](#maintainer))

    **Wichtig:** Eine **Einladung muss explizit angenommen** werden, bevor jemand pushen kann. Solange die Einladung offen ist, sieht der Eingeladene das Repo zwar (wenn es privat ist, oft erst nach Annahme), kann aber noch nichts ändern.

## <span id="container"></span>Container
: Eine **laufende, isolierte Anwendung** auf einem Linux-Host. Technisch ein Prozess (oder Prozess-Baum), der sich den Kernel mit dem Host teilt, aber in eigenem Namespace läuft, eigene Ressourcen-Limits (cgroups) und reduzierte Rechte (Capabilities) hat. Ein Container ist die **laufende Instanz eines Images** – du kannst aus einem Image beliebig viele Container starten. Wird der Container gelöscht (`docker rm`), ist alles, was nur in ihm lebte, weg.

## <span id="containerd"></span>containerd
: **Container-Runtime**, die Docker (und auch Kubernetes) intern nutzen, um Container tatsächlich zu starten. Sie sitzt eine Ebene unter der Docker Engine: Docker Engine (oder ein anderer Client) schickt einen API-Aufruf an containerd, das wiederum mit `runc` einzelne Linux-Container erzeugt. containerd ist ein Top-Level-Projekt der CNCF und damit unabhängig von Docker Inc.

## <span id="container-engine"></span>Container-Engine
: **Software, die Container ausführt und verwaltet.** Docker Engine, containerd und Podman sind Beispiele. Die Engine nimmt Befehle entgegen („starte Container X"), erzeugt dann Namespaces und cgroups, entpackt das Image-Dateisystem und startet den Prozess.

## <span id="containerisierung"></span>Containerisierung
: **Das Prinzip, Anwendungen in Container zu verpacken.** Ziele: Reproduzierbarkeit (läuft überall gleich), Isolation (keine Seiteneffekte zwischen Anwendungen), Portabilität (Image mitnehmen und woanders starten). Containerisierung ist nicht an Docker gebunden – Docker ist nur das populärste Werkzeug dafür.

## <span id="copy-on-write"></span>Copy-on-Write
: **Schreibschutz-Strategie**: Erst wenn eine Datei tatsächlich geändert wird, wird sie kopiert. Bei Docker bedeutet das: alle Container teilen sich dieselben Image-Layer (read-only) und bekommen nur ihren eigenen **beschreibbaren Top-Layer** für Änderungen. Spart Platz (ein Image, viele Container) und macht Container-Starts schnell.

## <span id="cve"></span>CVE (Common Vulnerabilities and Exposures)
: **Öffentlich gepflegte Datenbank von Sicherheitslücken** mit eindeutigen IDs der Form `CVE-2024-12345`. Tools wie Trivy gleichen die Pakete in einem Image gegen die CVE-Datenbank ab und melden bekannte Lücken. Für jede CVE gibt es einen Schweregrad (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) und meist eine Empfehlung, auf welche Version man updaten sollte.

## <span id="cpu"></span>CPU
: **Central Processing Unit** – der Prozessor eines Rechners, der die eigentliche Rechenarbeit macht. Moderne CPUs haben mehrere Kerne, die parallel arbeiten können. In virtuellen Maschinen und Containern werden CPU-Anteile als vCPU zugeteilt.

## <span id="daemon"></span>Daemon
: **Hintergrund-Dienst**, der auf einem System ohne direktes Terminal läuft. Bei Docker ist das `dockerd`, bei Multipass `multipassd`, bei Linux-Systemen gibt es viele weitere wie `sshd` oder `systemd`. Du rufst sie nicht direkt auf, sondern sprichst über die jeweilige CLI mit ihnen, die wiederum über einen Socket oder eine API mit dem Daemon kommuniziert.

## <span id="dangling-image"></span>Dangling Image
: **Image ohne Tag**, das bei `docker images` mit `<none>:<none>` erscheint. Entstehen, wenn ein Build ein neues Image unter einem schon vergebenen Tag erzeugt – das alte Image verliert dann seinen Tag. Dangling Images belegen weiter Plattenplatz. Aufräumen mit `docker image prune`.

## <span id="dateisystem"></span>Dateisystem / Filesystem
: **Die Organisation, wie Dateien und Verzeichnisse auf einer Festplatte oder im RAM gespeichert werden.** Linux nutzt z.B. ext4, btrfs oder xfs; macOS APFS; Windows NTFS. Ein Container hat sein eigenes Dateisystem (aus den Image-Layern zusammengesetzt), das vom Host-Dateisystem getrennt ist.

## <span id="depends-on"></span>depends_on
: **Compose-Schlüssel**, der die Start-Reihenfolge von Services festlegt. In der einfachen Form wartet Compose nur auf den Container-**Start**, nicht auf die Bereitschaft des Dienstes. Mit `condition: service_healthy` und einem Healthcheck im Ziel-Service wartet Compose auch auf die tatsächliche Bereitschaft (z.B. „Postgres akzeptiert Verbindungen").

## <span id="dhcp"></span>DHCP (Dynamic Host Configuration Protocol)
: **Protokoll, das neuen Geräten im Netzwerk automatisch eine IP-Adresse zuteilt.** Dein Heimrouter macht das, Docker macht das intern für Container, Multipass macht das für VMs. Ohne DHCP müsstest du jedem Gerät von Hand eine IP geben.

## <span id="distroless"></span>Distroless
: **Von Google gepflegte Basis-Images**, die keine Shell, keinen Paket-Manager, keine Debug-Tools enthalten. Sehr klein (wenige MB), maximal sichere Angriffsfläche. Ideal für kompilierte Sprachen wie Go oder Rust zusammen mit Multi-Stage-Builds. Nachteil: schwer zu debuggen, weil man nicht mit `docker exec` reinkommt.

## <span id="dns"></span>DNS (Domain Name System)
: **Das „Telefonbuch" des Internets** – übersetzt Namen wie `google.com` in IP-Adressen wie `142.250.185.14`. Dein Betriebssystem fragt DNS-Server (oft vom Internet-Provider oder `8.8.8.8` von Google), um Namen aufzulösen. Docker bringt einen eigenen internen DNS mit: Container in einem User-Defined-Netzwerk finden sich über ihre Namen.

## <span id="dockerignore"></span>.dockerignore
: **Gegenstück zu `.gitignore` für Docker-Builds.** Legt fest, welche Dateien NICHT in den Build-Kontext wandern. Verhindert, dass `.git/`, `node_modules/` oder `.env`-Dateien unnötig oder versehentlich ins Image landen. Jeder Eintrag ist ein Muster, z.B. `.git/` oder `*.log`.

## <span id="dotenv"></span>.env
: **Textdatei mit `KEY=VALUE`-Zeilen**, die Compose automatisch liest (oder die bei `docker run --env-file` angegeben wird). Wird für Konfiguration und Secrets genutzt – Secrets **nie in Git einchecken**, sondern in `.gitignore` aufnehmen.

## <span id="detached-mode"></span>Detached Mode
: **Container läuft im Hintergrund**, getrennt von deinem Terminal. Gestartet mit dem Flag `-d` bei `docker run`. Gegenstück ist der Vordergrund-Modus, in dem du die Logs direkt im Terminal siehst und mit `Ctrl+C` den Container beenden würdest. Im Detached Mode siehst du die Logs mit `docker logs -f name`.

## <span id="distro"></span><span id="distribution"></span>Distro / Distribution
: **Linux-Distribution** – eine konkrete Variante von Linux, die Kernel, Tools, Paketmanager und Userland zusammenpackt. Bekannte Distros: **Ubuntu, Debian, Fedora, RHEL, Rocky/AlmaLinux, Arch, Alpine, openSUSE**. Bei Docker bauen die meisten Basis-Images auf einer Distro auf (`debian:bookworm-slim`, `ubuntu:24.04`, `alpine:3.20`, …). Die Wahl beeinflusst Image-Größe, verfügbare Pakete und Sicherheit.

## <span id="dnf"></span>dnf
: **Paketmanager** von Fedora, Rocky Linux, AlmaLinux und RHEL. Gegenstück zu `apt` auf Debian/Ubuntu. `sudo dnf install docker-ce`, `sudo dnf update`. Ältere RHEL-Systeme nutzten `yum`, das mittlerweile ein Alias für `dnf` ist.

## <span id="docker-desktop"></span>Docker Desktop
: **Kommerzielle Desktop-Anwendung** von Docker Inc., die auf Mac und Windows eine fertig eingerichtete Docker-Umgebung liefert. Unter der Haube startet Docker Desktop eine Linux-VM, in der die Container laufen – siehe [Docker Desktop ist eine VM](docker/docker-desktop-wahrheit.md). Für Unternehmen mit mehr als 250 Mitarbeitenden oder mehr als 10 Mio USD Umsatz kostenpflichtig.

## <span id="docker-hub"></span>Docker Hub
: **Default-Registry von Docker Inc.** (<https://hub.docker.com>), auf der sowohl offizielle als auch Community-Images gehostet werden. Wenn du keinen Registry-Namen angibst, holt Docker das Image von dort. Offizielle Images (`nginx`, `postgres`, `python`) liegen im Namespace `library` und werden von Docker zusammen mit den Projekten gepflegt.

## <span id="dockerfile-instruktionen"></span><span id="from"></span><span id="run"></span><span id="cmd"></span><span id="entrypoint"></span><span id="copy"></span><span id="add"></span><span id="workdir"></span><span id="expose"></span><span id="env"></span><span id="arg"></span><span id="user"></span>Dockerfile-Instruktionen (FROM, RUN, CMD, …)
: **Die wichtigsten Befehle in einem Dockerfile.** Eine ausführliche Erklärung mit Beispielen findest du unter [Dockerfile – Grundlagen](docker/dockerfile-grundlagen.md). Kurzübersicht:

    | Instruktion | Zweck |
    |---|---|
    | `FROM` | Basis-Image, auf dem das eigene Image aufbaut |
    | `RUN` | Befehl, der **beim Build** ausgeführt wird (z.B. Pakete installieren); jedes `RUN` erzeugt einen Layer |
    | `COPY` | Dateien aus dem Build-Kontext ins Image kopieren |
    | `ADD` | Wie `COPY`, kann zusätzlich URLs ziehen und Tar-Archive entpacken (selten genutzt – `COPY` bevorzugen) |
    | `CMD` | Default-Kommando bzw. Default-Argumente, wenn der Container startet |
    | `ENTRYPOINT` | Fester Hauptprozess des Containers (oft kombiniert mit `CMD` für Argumente) |
    | `WORKDIR` | Arbeitsverzeichnis im Image (für nachfolgende Befehle und zur Laufzeit) |
    | `EXPOSE` | **Informativer** Hinweis, welche Ports der Container nutzt; öffnet keinen Port |
    | `ENV` | Umgebungsvariable, die im Image gesetzt wird |
    | `ARG` | Build-Argument, nur während `docker build` verfügbar (nicht zur Laufzeit) |
    | `USER` | Wechselt den User für nachfolgende Befehle und zur Laufzeit |
    | `HEALTHCHECK` | Definiert eine Bereitschafts-Prüfung (siehe [Healthcheck](#healthcheck)) |
    | `LABEL` | Metadaten als Key-Value-Paare im Image |

    **Fallstrick `CMD` vs. `ENTRYPOINT`:** `ENTRYPOINT ["/usr/bin/nginx"]` legt das Programm fest, `CMD ["-g", "daemon off;"]` legt die Argumente fest. Wer den Container mit `docker run image foo` startet, ersetzt das `CMD` (also die Argumente), nicht das `ENTRYPOINT`.

## <span id="dockerfile"></span>Dockerfile
: **Textdatei mit Anweisungen**, wie ein Image gebaut werden soll (`FROM`, `COPY`, `RUN`, `CMD` usw.). Muss exakt so heißen: `Dockerfile`, ohne Endung. Jede Instruktion erzeugt einen Layer – die Reihenfolge im Dockerfile beeinflusst also sowohl die Build-Geschwindigkeit (Layer-Caching) als auch die Image-Größe.

## <span id="emulation"></span>Emulation
: **Simulation einer Hardware oder Architektur in Software.** Deutlich langsamer als native Ausführung, aber ermöglicht etwa, x86_64-Programme auf einem ARM-Mac laufen zu lassen. Docker auf Apple Silicon emuliert x86_64-Images mit Rosetta 2; QEMU kann ganze Prozessor-Architekturen emulieren.

## <span id="endpoint"></span><span id="endpoints"></span><span id="endpunkt"></span><span id="endpunkte"></span>Endpoint / Endpunkt
: **Konkrete Anlaufstelle einer API** – die Kombination aus HTTP-Methode (`GET`, `POST`, …) und URL-Pfad. Beispiele: `GET /health`, `POST /api/entries`, `GET /api/scoreboard`. Eine API hat in der Regel mehrere Endpoints, jeder davon erfüllt eine bestimmte Aufgabe (Daten holen, Daten speichern, Status prüfen).

## <span id="env-file"></span><span id="env_file"></span>env_file (Compose)
: **Compose-Schlüssel**, der eine externe Datei mit `KEY=VALUE`-Zeilen für einen Service einliest und daraus Umgebungsvariablen macht. Praktisch, wenn du viele Variablen sammeln willst, ohne den `services:`-Block aufzublähen, oder wenn unterschiedliche Services unterschiedliche Variablen brauchen sollen. Nicht zu verwechseln mit der `.env` neben der `compose.yaml`: diese wird **automatisch** für `${VAR}`-Ersetzungen in der YAML genutzt; `env_file:` dagegen verweist explizit auf eine (oder mehrere) Datei(en) und die Variablen landen ausschließlich im Service-Container.

## <span id="eof"></span>EOF (End Of File)
: **Markierung für „Ende der Eingabe".** In Shells beendet `EOF` ein Here-Document: der Text zwischen `<<EOF` und einer eigenen Zeile mit `EOF` wird als Eingabe an einen Befehl gegeben oder in eine Datei geschrieben (siehe [Here-Document](#here-document)). Auf der Kommandozeile beendet `Ctrl+D` (macOS/Linux) bzw. `Ctrl+Z` (Windows) interaktive Eingaben, indem ein EOF-Signal an den Prozess geschickt wird.

## <span id="esxi"></span>ESXi
: **Typ-1-Hypervisor von VMware** (heute Broadcom). Läuft direkt auf der Hardware, ohne klassisches Host-OS. Klassisch im Enterprise-Rechenzentrum, wo viele VMs pro Server betrieben werden sollen.

## <span id="express"></span>Express
: **Leichtes Web-Framework für [Node.js](#nodejs)**. Express bietet eine schlanke API zum Definieren von HTTP-Endpunkten (`app.get('/foo', handler)`) und ist im Node-Ökosystem das Standard-Tool für kleine APIs und Web-Server. In diesem Kurs nutzen wir Express in den Backend-Containern der Praxis-Blöcke (Escape Room und Mission Control). Ihr müsst Express nicht im Detail verstehen – nur wissen, dass das Backend damit auf Anfragen wie `/api/health` antwortet.

## <span id="fastapi"></span>FastAPI
: **Modernes Python-Web-Framework** für HTTP-APIs, basierend auf [Pydantic](#pydantic) und [Uvicorn](#uvicorn). Bietet automatische Datenvalidierung über Type-Hints und automatisch generierte OpenAPI-Doku. Das Pendant zu [Express](#express) auf der Python-Seite. In diesem Kurs taucht FastAPI in der Mission-Control-Praxis als alternatives Backend auf – es zeigt, dass die Schnittstelle eines Containers (HTTP-Endpunkte, JSON) wichtiger ist als seine innere Sprache.

## <span id="firmware"></span>Firmware
: **Low-Level-Software**, die fest mit der Hardware verbunden ist und beim Einschalten des Rechners als Erstes startet. Klassisch das **BIOS**, heute meist **UEFI**. Sie initialisiert die Hardware, sucht den Bootloader und übergibt dann die Kontrolle ans Betriebssystem. Auch andere Geräte (Router, Festplatten, Drucker) haben ihre eigene Firmware. Bei Virtualisierung simuliert der Hypervisor eine virtuelle Firmware für den Gast.

## <span id="flask"></span>Flask
: **Leichtgewichtiges Python-Web-Framework.** Eignet sich für kleine bis mittlere Web-Anwendungen und APIs. In diesem Kurs nutzen wir Flask im Compose-Praxisteil, um eine kleine App zu bauen, die mit einer Postgres-Datenbank spricht.

## <span id="formatter"></span>Formatter
: **Werkzeug, das Code automatisch formatiert** also Einrückung, Zeilenlänge, Anführungszeichen und Klammer-Stil vereinheitlicht. Bekannte Vertreter: `prettier` für JavaScript, TypeScript, CSS und HTML, `black` für Python, `gofmt` für Go, `rustfmt` für Rust. Anders als ein [Linter](#linter) bewertet ein Formatter nichts. Er schreibt um. In CI laufen oft beide nacheinander: erst Format-Check, dann Lint.

## <span id="gast-os"></span><span id="gast"></span>Gast / Gast-OS
: **Das Betriebssystem, das innerhalb einer virtuellen Maschine läuft.** Aus Sicht des Gastes ist er auf einem echten Rechner – in Wahrheit sieht er nur virtualisierte Hardware, die der Hypervisor bereitstellt. Ein Host kann mehrere Gäste gleichzeitig betreiben.

## <span id="gatekeeper"></span>Gatekeeper
: **Sicherheitsmechanismus von macOS**, der beim ersten Start einer heruntergeladenen App fragt, ob du sie wirklich öffnen willst. Bei Docker Desktop und Multipass muss man oft einmal in **Systemeinstellungen → Datenschutz & Sicherheit** bestätigen, dass die App starten darf.

## <span id="gateway"></span>Gateway
: **Netzwerk-Gerät oder -Adresse, über die dein Rechner „nach draußen" erreicht**, was nicht im lokalen Netz liegt. Zu Hause ist das meist dein Router. In einem Docker-Bridge-Netzwerk ist der Gateway eine IP wie `172.17.0.1`, die den Hostbereich repräsentiert.

## <span id="git"></span>Git
: **Verteiltes Versionsverwaltungssystem.** Jeder Entwickler hat eine vollständige Kopie der Historie auf seinem Rechner; geteilt wird über Remote-Repositories (z.B. auf GitHub). Geschrieben 2005 von Linus Torvalds für die Linux-Kernel-Entwicklung, heute Standard in praktisch jedem ernsthaften Software-Projekt. Im Kurs lernst du Git im eigenen [Git-Block](git/index.md) komplett von den Grundlagen bis zum PR-Workflow.

    Die wichtigsten Befehle im Überblick:

    | Befehl | Zweck |
    |--------|-------|
    | `git init` | Ordner zum Repository machen |
    | `git add <datei>` | Datei stagen (auf den Vorbereitungstisch legen) |
    | `git commit -m "..."` | Stand als neuen Commit archivieren |
    | `git status` | aktuellen Zustand anzeigen |
    | `git log` | Historie ansehen |
    | `git diff` | Änderungen vergleichen |
    | `git switch <branch>` | Branch wechseln |
    | `git merge <branch>` | anderen Branch in den aktuellen mergen |
    | `git clone <URL>` | Remote-Repo lokal holen |
    | `git push` | lokale Commits zum Remote schieben |
    | `git pull` | neue Commits vom Remote holen + mergen |

    Mehr im [Cheatsheet Git](cheatsheets/git.md).

## <span id="repository"></span><span id="repo"></span>Repository (Git)
: **Komplette Verwaltungseinheit eines Git-Projekts.** Technisch: ein Ordner mit einem versteckten `.git`-Unterordner, der die gesamte Historie, alle Branches, Tags und Konfiguration enthält. **Lokales Repository** liegt auf deinem Rechner, **Remote-Repository** auf einem Server (z.B. GitHub). Beide haben dieselbe Struktur und tauschen Daten über `git push` und `git pull` aus.

## <span id="commit"></span>Commit
: **Vollständiger Schnappschuss deines Projekts zu einem bestimmten Zeitpunkt**, plus Autor, Zeitstempel und eine Beschreibung (Commit-Message). Jeder Commit hat eine eindeutige **SHA-ID** (40-stelliger Hash, oft abgekürzt auf 7 Zeichen) und referenziert seinen Vorgänger – daraus entsteht die Kette der Historie. Erzeugt mit `git commit -m "..."`. Siehe auch [Grundbegriffe](git/grundbegriffe.md#commit).

## <span id="working-tree"></span><span id="working-directory"></span>Working Tree / Working Directory
: **Die ganz normalen Dateien in deinem Projektordner**, so wie sie aktuell auf der Festplatte liegen. Änderungen hier sind „in Arbeit" – Git sieht sie, aber sie sind noch nicht zum Commit vorgemerkt. Erst mit `git add` wandern sie in die [Staging-Area](#staging-area).

## <span id="staging-area"></span><span id="staging"></span><span id="index-git"></span>Staging-Area / Index
: **Vorbereitungstisch zwischen Working Tree und Repository.** Hier sammelst du mit `git add` die Änderungen, die du im **nächsten Commit** zusammenfassen willst. Damit kannst du gezielt steuern, was in einen Commit kommt – statt alle parallelen Änderungen in einen Topf zu werfen. Auch „Index" genannt.

## <span id="head"></span>HEAD (Git)
: **Zeiger auf den Commit, auf dem du gerade stehst.** Normalerweise zeigt HEAD auf den neuesten Commit deines aktuellen Branches. Beim Commit rückt HEAD automatisch einen Schritt weiter, beim Branch-Wechsel hängt HEAD auf den neuen Branch um. Praktisch dein „du bist hier"-Schild in der Historie.

## <span id="branch"></span>Branch (Git)
: **Eigene Entwicklungslinie** in Git. Technisch nur ein **Name, der auf einen Commit zeigt** – nicht mehr. Branches sind extrem leichtgewichtig: Anlegen, Wechseln und Löschen dauert Sekundenbruchteile. Standard-Branch heißt heute praktisch überall `main` (früher `master`, das wurde seit ca. 2020 schrittweise umbenannt). Anlegen mit `git switch -c <name>`, Wechseln mit `git switch <name>`. Siehe [Branches und Merge](git/branches-und-merge.md).

## <span id="merge"></span><span id="merge-commit"></span>Merge / Merge-Commit
: **Zwei Git-Branches zu einem zusammenführen.** Zwei Hauptfälle:

    - **Fast-Forward Merge**: wenn auf dem Ziel-Branch seit dem Abzweig nichts dazugekommen ist, schiebt Git den Branch-Zeiger einfach weiter. Kein neuer Commit.
    - **Echter Merge-Commit**: wenn beide Linien parallel gewachsen sind, erzeugt Git einen besonderen Commit mit **zwei Eltern**. So bleibt in der Historie sichtbar, dass es einen Branch gab.

    Befehl: `git merge <branch>`. Mit `--no-ff` lässt sich der Fast-Forward unterdrücken und immer ein Merge-Commit erzwingen. Siehe [Branches und Merge](git/branches-und-merge.md#merge-zwei-linien-wieder-zusammenfuhren).

## <span id="merge-konflikt"></span>Merge-Konflikt
: **Situation, in der Git beim Mergen nicht entscheiden kann, welche Version gilt** – weil dieselbe Stelle in derselben Datei in beiden Branches unterschiedlich geändert wurde. Git markiert die konkurrierenden Zeilen in der Datei mit `<<<<<<<`, `=======`, `>>>>>>>` und überlässt die Auflösung dem Menschen. Vorgehen: Datei bearbeiten, Marker entfernen, gewünschte Version hinschreiben, `git add`, `git commit`. Komplettes Beispiel in [Praxis 3](git/praxis-merge-konflikt.md). Abbrechen mit `git merge --abort`.

## <span id="remote"></span><span id="remote-repository"></span>Remote-Repository
: **Git-Repository, das auf einem anderen Rechner liegt** – typischerweise einem Server wie GitHub, GitLab oder einem self-hosted Gitea. Dein lokales Repo kennt jeden Remote unter einem **Namen**, per Konvention heißt der wichtigste `origin`. Befehle: `git remote add origin <URL>` zum Verknüpfen, `git remote -v` zum Anzeigen, `git push` zum Schieben, `git pull` zum Holen.

## <span id="pull-request"></span><span id="pr"></span><span id="merge-request"></span><span id="mr"></span>Pull Request / Merge Request (PR / MR)
: **Vorschlag, einen Branch in einen anderen zu mergen** – mit Diskussionsraum, Reviews und CI-Checks drumherum. Auf GitHub und Bitbucket heißt das **Pull Request**, auf GitLab **Merge Request**. Beides ist konzeptuell dasselbe.

    **Wichtig**: ein PR ist **kein Git-Konzept**. Git selbst kennt nur Branches und Merges. Pull Requests sind eine Erfindung der Plattformen, um den Merge-Prozess mit Reviews zu strukturieren. Typischer Ablauf: Branch lokal anlegen, pushen, auf GitHub PR öffnen, ggf. Review-Kommentare mit weiteren Commits beantworten, mergen, Branch aufräumen. Komplettes Beispiel in [Praxis 6](git/praxis-pull-request.md).

## <span id="fast-forward"></span>Fast-Forward (Merge)
: **Einfachster Fall eines Merges**: wenn auf dem Ziel-Branch seit dem Abzweig keine eigenen Commits hinzugekommen sind, schiebt Git den Branch-Zeiger einfach an die Spitze des anderen Branches. **Kein neuer Commit** wird angelegt. Die Historie bleibt dadurch linear, aber die Information „hier gab es einen Branch" geht verloren. Mit `git merge --no-ff` kann man Fast-Forward unterdrücken und immer einen Merge-Commit erzwingen.

## <span id="fork"></span><span id="forken"></span>Fork (Git / GitHub)
: **Eigene Kopie eines bestehenden Git-Repositories auf einer Plattform wie GitHub oder GitLab.** Mit einem Klick auf „Fork" entsteht in deinem eigenen Account eine vollständige, eigenständige Kopie eines fremden Repos. Du kannst darin frei pushen, Branches anlegen, experimentieren – ohne Schreibrechte auf das Original zu brauchen.

    **Typischer Open-Source-Workflow:**

    1. Du forkst ein Projekt auf GitHub.
    2. Klonst deinen Fork lokal (`git clone <DEIN-FORK-URL>`).
    3. Fügst optional das Original als Remote `upstream` hinzu (`git remote add upstream <ORIGINAL-URL>`).
    4. Arbeitest auf einem Feature-Branch, pushst zu deinem Fork.
    5. Öffnest einen **Pull Request** vom Branch deines Forks gegen das Original-Repo.
    6. Die Maintainer des Originals können den PR mergen.

    **Wichtig:** Ein Fork ist eine Plattform-Funktion (GitHub, GitLab, Gitea), kein eigenständiger Git-Befehl. Technisch ist ein Fork einfach ein Klon, der auf der Plattform mit dem Original verknüpft bleibt. Siehe auch [Origin](#origin), [Upstream](#upstream) und [Pull Request](#pull-request).

## <span id="git-clone"></span>git clone
: **Befehl zum Holen eines Remote-Repositories** auf den eigenen Rechner. `git clone <URL>` legt einen neuen Ordner an, lädt die komplette Historie, richtet den Remote `origin` ein und checkt den Default-Branch aus. Einer der häufigsten Git-Befehle überhaupt – nach einem Klon ist alles fertig konfiguriert.

## <span id="git-push"></span>git push
: **Schiebt deine lokalen Commits zum Remote.** Standardform: `git push`. Beim ersten Push eines neuen Branches: `git push -u origin <branch>` – das `-u` setzt zugleich das **Tracking-Verhältnis**, sodass folgende Pushs ohne Argumente reichen. Wenn der Remote weiter ist als du erwartest, lehnt Git ab und schützt vor Datenverlust.

## <span id="git-pull"></span>git pull
: **Holt neue Commits vom Remote** und mergt sie in deinen aktuellen Branch. Unter der Haube: `git fetch` + `git merge`. Bei abweichenden lokalen Änderungen kann es zu Konflikten kommen – die werden wie beim normalen Merge gelöst.

## <span id="git-fetch"></span>git fetch
: **Holt neue Commits vom Remote**, ohne sie in deinen aktuellen Branch zu mergen. Praktisch, wenn du **erst sehen** willst, was es Neues gibt, bevor du integrierst. Die geholten Commits landen in den [Tracking-Branches](#tracking-branch) (z.B. `origin/main`).

## <span id="tracking-branch"></span><span id="tracking-branches"></span>Tracking-Branch
: **Lokale Kopie eines Remote-Branches**, benannt nach dem Schema `<remote>/<branch>` – also `origin/main` für den `main`-Branch auf `origin`. Tracking-Branches werden mit `git fetch` aktualisiert und repräsentieren den **Stand des Remotes, wie er beim letzten Fetch war**. `git status` vergleicht deinen lokalen Branch mit dem Tracking-Branch und zeigt Zeilen wie „Your branch is ahead of 'origin/main' by 2 commits".

## <span id="git-stash"></span>git stash
: **Zwischenparkplatz für nicht-committete Änderungen.** Mit `git stash` legst du den Working Tree weg, sodass `git status` „clean" zeigt – die Änderungen sind aber auf einem Stapel sicher abgelegt. Praktisch, wenn du **mitten in einer Arbeit** bist und kurz auf einen anderen Branch wechseln musst. Mit `git stash pop` holst du sie zurück und entfernst sie vom Stapel.

## <span id="git-switch"></span><span id="git-checkout"></span>git switch / git checkout
: **Befehle zum Wechseln des Branches.** `git switch <branch>` ist seit Git 2.23 (2019) der **moderne** Befehl. `git switch -c <neuer-branch>` legt einen neuen Branch an und wechselt direkt darauf. Mit `git switch -` springst du zum vorherigen Branch zurück.

    Der ältere `git checkout` macht dasselbe und noch viel mehr – er kann auch Dateien aus alten Commits wiederherstellen, in einen [Detached HEAD](#detached-head) wechseln und Vieles mehr. Genau diese Vielfalt wurde als historisch verwirrend empfunden, weshalb `switch` (nur für Branches) und `restore` (nur für Dateien) eingeführt wurden. Für Anfänger ist `switch` klarer; `checkout` läuft aber bis heute und ist in vielen Anleitungen Standard.

## <span id="detached-head"></span><span id="losloesen"></span>Detached HEAD
: **Zustand, in dem HEAD direkt auf einen Commit zeigt – statt auf einen Branch.** Tritt auf, wenn du mit `git checkout <sha>` (oder `git switch --detach <sha>`) auf einen Commit aus der Historie springst, der nicht der oberste eines Branches ist.

    **Gefahr:** Commits, die du in diesem Zustand machst, **hängen an keinem Branch**. Wenn du dann mit `git switch main` zurück wechselst, sind sie nur noch über `git reflog` erreichbar. Git warnt aber bei beiden Schritten deutlich.

    **Lösung:** Wenn du im Detached HEAD Commits machen willst, gleich am Anfang `git switch -c neuer-branch` ausführen – dann sind die Commits an einem Branch festgemacht und überleben. Mehr dazu in [Workflows](git/workflows.md#workflow-1-zuruck-zu-einem-alten-commit-und-von-dort-neu-starten).

## <span id="gitignore"></span>.gitignore (Git)
: **Datei im Repository-Root, die festlegt, welche Dateien und Ordner Git ignorieren soll.** Eine Zeile pro Muster, Wildcards erlaubt:

    ```text
    *.log              # alle .log-Dateien
    node_modules/      # ganzer Ordner
    .env               # einzelne Datei
    !wichtig.log       # Ausnahme
    ```

    Wird selbst ins Repository commitet, damit alle Beteiligten dieselben Filterregeln haben. Vorlagen für viele Sprachen unter <https://github.com/github/gitignore>. Nicht zu verwechseln mit Dockers [.dockerignore](#dockerignore).

## <span id="commit-message"></span>Commit-Message
: **Beschreibung eines Commits, in der ersten Zeile knapp**, ggf. mit ausführlicherem Body danach. Gute Faustregel: die erste Zeile sollte den Satz „Wenn ich diesen Commit anwende, dann …" sinnvoll vervollständigen. Beispiele: `Login: E-Mail-Validierung ergänzen`, `Crash bei leerem Eingabefeld beheben`, `README: Tippfehler korrigieren`. Setzt man mit `git commit -m "..."`; nachträglich änderbar mit `git commit --amend` (nur vor dem Push, sonst Hash-Konflikt).

## <span id="personal-access-token"></span><span id="pat"></span>Personal Access Token (PAT)
: **Passwort-Ersatz für GitHub-Operationen über HTTPS.** Seit 2021 akzeptiert GitHub keine normalen Passwörter mehr für Git-Operationen. Stattdessen erstellst du in **Settings → Developer settings → Personal access tokens** einen Token mit gezielten Rechten (mindestens `repo` für Push/Pull) und einer Laufzeit. Beim ersten `git push` gibst du den Token statt des Passworts ein; der Git Credential Manager merkt ihn sich. Mehr in [Praxis 4 → Schritt 5](git/praxis-github-neu.md#schritt-5-pushen-und-das-token-setup).

## <span id="github"></span><span id="github-actions"></span><span id="github-pages"></span><span id="ghcr"></span><span id="github-container-registry"></span>GitHub / GitHub Actions / GitHub Pages / GHCR
: **Web-Plattform** rund um Git, betrieben von Microsoft. Hostet Open-Source- und private Repositories. Vier Bausteine, die im Kurs vorkommen:

    - **GitHub** als Repository-Plattform (Code-Hosting, Issues, Pull Requests).
    - **GitHub Actions** als CI/CD-System: Workflows in YAML, getriggert durch Pushs oder Pull Requests, laufen auf von GitHub bereitgestellten Runnern (Linux/macOS/Windows). Diese Kursunterlagen werden via GitHub Actions gebaut und veröffentlicht. Siehe [CI/CD mit GitHub Actions](ci-cd/index.md).
    - **GitHub Pages** für das Hosting statischer Webseiten direkt aus einem Repo. Die fertige MkDocs-Site liegt damit unter `https://<user>.github.io/kurs-unterlagen/`.
    - **GHCR (GitHub Container Registry)** – Container-Registry unter `ghcr.io`, integriert in GitHub. Ein Workflow kann mit dem eingebauten `GITHUB_TOKEN` Images pushen, sofern `permissions: packages: write` gesetzt ist. Public Repos erhalten kostenlosen Speicher.

## <span id="gitlab"></span>GitLab
: **Web-Plattform für Git-Repositories**, sowohl als gehosteter Dienst (<https://gitlab.com>) als auch self-hosted in eigenen Rechenzentren. Bringt CI/CD, Issues, Wikis und Container-Registry direkt mit. Pull Requests heißen hier **Merge Requests**, sonst sind die Konzepte identisch zu GitHub. Besonders beliebt in Unternehmen und Behörden, weil sich GitLab on-premise installieren lässt und Daten so nicht das eigene Netzwerk verlassen. Konzeptionell sehr ähnlich zu GitHub – das Wissen ist übertragbar.

## <span id="bitbucket"></span>Bitbucket
: **Git-Plattform von Atlassian.** Enge Integration mit Jira und Confluence – beliebt in Teams, die ohnehin im Atlassian-Universum unterwegs sind. Funktional sehr nah an GitHub/GitLab, bringt eigenes CI/CD-System („Bitbucket Pipelines") mit. Wer GitHub kann, lernt Bitbucket in einer halben Stunde.

## <span id="gitea"></span>Gitea
: **Leichtgewichtige Open-Source-Git-Plattform**, in Go geschrieben, läuft auf einer kleinen VM oder einem Heimserver. Erinnert in der Oberfläche an GitHub, lässt sich aber komplett selbst hosten. Beliebt für private Server, Studierende, kleinere Teams und alle, die ihre Daten nicht in der Cloud haben wollen.

## <span id="gitops"></span>GitOps
: **Betriebsmodell, bei dem der Soll-Zustand der Infrastruktur (Manifeste, Konfiguration) komplett in einem Git-Repo liegt** und ein Operator im Cluster diesen Stand fortlaufend mit der Realität abgleicht. Ein typischer Ablauf: CI-Pipeline pusht ein neues Image und ändert die Image-Referenz im GitOps-Repo; ein Operator wie [ArgoCD](#argocd) oder Flux bemerkt den Commit und rollt aus. Vorteile: jede Cluster-Änderung ist ein Commit (auditierbar, rollbackbar), Drift-Detection korrigiert manuelle Eingriffe automatisch.

## <span id="get"></span>GET (HTTP-Methode)
: **HTTP-Methode zum Abrufen von Daten** – ohne dass dabei etwas verändert wird. Wenn du im Browser eine Seite aufrufst, schickt der Browser einen `GET`-Request. APIs beantworten `GET`-Anfragen typischerweise mit einer Liste oder einem einzelnen Datensatz im JSON-Format. Beispiel: `GET /api/entries` liefert alle Einträge.

## <span id="gui"></span>GUI (Graphical User Interface)
: **Grafische Benutzeroberfläche** mit Fenstern, Knöpfen, Icons. Gegenstück zur CLI. Klicken statt Tippen.

## <span id="hardware-beschleunigung"></span>Hardware-Beschleunigung
: **Wenn der Prozessor spezielle Instruktionen hat, die eine Aufgabe direkt ausführen können** – statt sie in Software zu simulieren. Moderne Intel/AMD-CPUs haben Virtualisierungs-Beschleunigung (VT-x / AMD-V), die VMs deutlich schneller macht. Ohne diese Beschleunigung müsste die VM emuliert werden, was viel langsamer ist.

## <span id="here-document"></span>Here-Document (`<<`, `<< 'EOF'`)
: **Shell-Technik**, um mehrzeiligen Text direkt in einen Befehl oder eine Datei zu schreiben. Beispiel: `cat > datei.txt << 'EOF'` – danach schreibst du beliebig viele Zeilen Text; das Wort `EOF` (für „End Of File") auf einer eigenen Zeile beendet den Block und alle dazwischen geschriebenen Zeilen landen in `datei.txt`. Praktisch für HTML/Konfigurationsdateien ohne Editor-Umweg. Die Anführungszeichen um `'EOF'` verhindern, dass `$variable` im Block interpretiert wird. **Windows PowerShell** hat eine eigene Syntax dafür: `@" ... "@ | Set-Content datei.txt`.

## <span id="hdd"></span>HDD (Hard Disk Drive)
: **Klassische magnetische Festplatte** mit drehenden Scheiben und beweglichen Schreib-/Leseköpfen. Deutlich langsamer als eine SSD (typisch 100–200 MB/s vs. 500–7000 MB/s), dafür preiswerter pro Gigabyte. Für aktive Docker-Images und Datenbanken ist eine SSD inzwischen Standard – HDDs nutzt man höchstens noch für Archive oder große Datenmengen.

## <span id="gpg"></span>GPG (GNU Privacy Guard)
: **Open-Source-Implementierung des OpenPGP-Standards** für digitale Signaturen und Verschlüsselung. Im Kurs taucht GPG bei der Linux-Installation von Docker und Trivy auf: ein heruntergeladener Schlüssel wird mit `gpg --dearmor` ins Binärformat gebracht und unter `/usr/share/keyrings/` abgelegt, damit `apt` Pakete aus dem Repository als authentisch erkennt.

## <span id="healthcheck"></span>Healthcheck
: **Prüfung, die Docker regelmäßig in einem Container ausführt**, um festzustellen, ob der Dienst nicht nur läuft, sondern tatsächlich bereit ist. Definiert im Dockerfile (`HEALTHCHECK`) oder in `compose.yaml`. Status `healthy` / `unhealthy` sichtbar in `docker ps`. Beispiel: `pg_isready -U postgres` bei PostgreSQL.

## <span id="homebrew"></span>Homebrew
: **Der populäre Paketmanager für macOS** (und inzwischen auch Linux). Installation vieler Kommandozeilen-Tools und Apps per `brew install <name>` oder `brew install --cask <app>`. Für Apple Silicon liegt der Brew-Pfad unter `/opt/homebrew`, für Intel-Macs unter `/usr/local`. Wir nutzen Brew im Kurs für Multipass-Installation auf Mac.

## <span id="host"></span>Host
: **Der physische Rechner**, an dem du tatsächlich sitzt. Auf dem Host läuft das normale Betriebssystem und gegebenenfalls ein Hypervisor, der VMs verwaltet – oder eine Container-Engine, die Container verwaltet. „Host" heißt: „der Rechner, auf dem das läuft".

## <span id="hostname"></span>Hostname
: **Der Name eines Rechners im Netzwerk.** Auf deinem Laptop oft dein Benutzername + `.local`, in einer VM etwas wie `demo`, in einem Container der Container-Name. Mit `hostname` im Terminal angezeigt. Wichtig für Docker-DNS: Container werden über ihren Hostnamen (= Service-Name bei Compose) gefunden.

## <span id="http"></span>HTTP (Hypertext Transfer Protocol)
: **Protokoll, über das Browser mit Webservern sprechen.** Ein Klick auf einen Link → HTTP-Anfrage an einen Server → HTTP-Antwort mit HTML-Inhalt. Läuft standardmäßig auf Port 80. In Docker hat fast jeder Webserver-Container eine HTTP-Schnittstelle, die per Port-Mapping erreichbar wird.

## <span id="https"></span>HTTPS (HTTP Secure)
: **Verschlüsselte Version von HTTP.** Verwendet TLS für die Verschlüsselung, läuft standardmäßig auf Port 443. Für produktive Setups Pflicht, im Entwicklungs-Kurs aber oft nicht notwendig.

## <span id="hvf"></span>HVF (Hypervisor Framework)
: **Apple-Framework für Virtualisierung auf macOS.** Seit Apple Silicon ist HVF die Standard-Schnittstelle, die Tools wie Multipass, Docker Desktop, UTM oder Parallels nutzen. Technisch heißt die API seit macOS 11 `Virtualization.framework`.

## <span id="hyper-v"></span>Hyper-V
: **Virtualisierungstechnologie von Microsoft.** Als Server-Rolle ein Typ-1-Hypervisor, als Windows-Client-Feature eher ein Typ-2-Zwitter. Nicht verfügbar auf Windows Home. Docker Desktop nutzt Hyper-V indirekt über WSL2 oder direkt als klassisches Backend.

## <span id="hypervisor"></span>Hypervisor
: **Software, die virtuelle Maschinen verwaltet** – teilt Host-Ressourcen unter den VMs auf, startet, stoppt und isoliert sie. Man unterscheidet Typ 1 (läuft direkt auf Hardware) und Typ 2 (läuft als App im Host-OS). Jede VM sieht den Hypervisor nicht – sie denkt, sie hat echte Hardware.

## <span id="ide"></span>IDE (Integrated Development Environment)
: **Integrierte Entwicklungsumgebung**, die Editor, Debugger, Git-Integration und mehr zusammen anbietet. Beispiele: VSCode, IntelliJ IDEA, PyCharm. Für den Kurs reicht jeder Editor, der Syntax-Highlighting für YAML und Dockerfiles kann.

## <span id="image"></span>Image
: **Schreibgeschützte Vorlage für Container.** Enthält Dateisystem, Bibliotheken, Anwendungscode und Metadaten. Besteht intern aus mehreren Layern, die übereinandergestapelt werden. Aus einem Image können beliebig viele Container gestartet werden – jeder Container bekommt seinen eigenen beschreibbaren Top-Layer.

## <span id="image-id"></span>Image-ID
: **Eindeutige Identifikation eines Images**, technisch ein SHA-256-Hash seines Inhalts. Unveränderlich – im Gegensatz zu Tags, die umbewegbar sind. Beim `docker images`-Output wird meist nur die ersten 12 Zeichen angezeigt.

## <span id="imperativ"></span><span id="deklarativ"></span>Imperativ / Deklarativ
: **Zwei Arten, einem System zu sagen, was es tun soll.**

    - **Imperativ** = du beschreibst die einzelnen **Schritte**: „Lege erst ein Netzwerk an, dann starte den DB-Container, dann starte den App-Container." Klassisches Beispiel: mehrere `docker run`-Befehle hintereinander.
    - **Deklarativ** = du beschreibst den gewünschten **Zielzustand**: „Ich will einen DB-Container und einen App-Container, so konfiguriert." Das System rechnet sich aus, welche Schritte nötig sind, um vom Ist- zum Zielzustand zu kommen. Klassisches Beispiel: eine `compose.yaml` und `docker compose up -d`.

    Deklarative Konfiguration ist im modernen DevOps der Standard – Docker Compose, Kubernetes, Terraform, Ansible und viele Cloud-Tools arbeiten so. Der Vorteil: die Konfigurationsdatei **ist** das Setup, statt nur eine Anleitung dazu zu sein.

## <span id="init"></span>init / PID 1
: **Der allererste Prozess**, der in einem Linux-System (oder Container) startet und alle anderen Prozesse als „Eltern" hat. In Containern ist das der Prozess aus `CMD` oder `ENTRYPOINT`. Muss sich ordentlich um Signale (SIGTERM, SIGKILL) und verwaiste Kind-Prozesse kümmern. Für komplexe Anwendungen im Container hilft `docker run --init`, das einen kleinen Init-Prozess (tini) vorneweg startet.

## <span id="ip"></span>IP-Adresse
: **Eindeutige Nummer eines Geräts im Netzwerk.** In IPv4-Schreibweise vier Zahlen zwischen 0 und 255, getrennt durch Punkte (z.B. `192.168.1.42`). IPv6 ist länger und flexibler. Im Docker-Bridge-Netz bekommt jeder Container automatisch eine interne IP; der Host kommuniziert über einen Gateway.

## <span id="json"></span>JSON (JavaScript Object Notation)
: **Schlankes Datenaustausch-Format**, das sowohl Mensch als auch Maschine gut lesen können. Docker verwendet JSON unter anderem für `docker inspect`-Ausgaben und Konfigurationsdateien. Kennzeichen: geschweifte Klammern, Anführungszeichen bei Keys, Kommas zwischen Einträgen.

## <span id="json-body"></span>JSON Body
: **Daten im JSON-Format, die im Body eines HTTP-Requests** mitgesendet werden – typischerweise bei `POST` oder `PUT`. Beispiel: `{"team":"Alpha","score":25}`. Auf Server-Seite parsen Frameworks wie Express diesen Body automatisch (Middleware: `express.json()`), sodass die Anwendung darauf zugreifen kann.

## <span id="kernel"></span>Kernel
: **Der zentrale Teil eines Betriebssystems.** Verwaltet Hardware-Zugriff, Prozesse, Speicher, Dateisystem, Netzwerk. Bei Linux: der Linux-Kernel, bei macOS: xnu/Darwin, bei Windows: NT. Virtuelle Maschinen haben jeweils einen eigenen Kernel, Container teilen sich den Kernel des Hosts – das ist der fundamentale Unterschied zwischen VM und Container.

## <span id="kvm"></span>KVM (Kernel-based Virtual Machine)
: **Virtualisierungslösung, die direkt im Linux-Kernel steckt.** Damit quasi Typ 1, weil sie im Kernel sitzt – aber trotzdem auf einem normalen Linux-Host nutzbar. Sehr performant. Standard-Backend von Multipass auf Linux und das Herzstück vieler Cloud-Provider (AWS, GCP, Azure nutzen KVM oder Varianten).

## <span id="kubernetes"></span><span id="k8s"></span><span id="pod"></span><span id="cluster"></span><span id="helm"></span>Kubernetes / K8s
: **Container-Orchestrierungs-Plattform**, oft als „K8s" abgekürzt (acht Buchstaben zwischen K und s). Verwaltet Container über viele Hosts hinweg: Deployments, automatische Neustarts, Skalierung, Service-Discovery, rollende Updates. Während Compose nur **einen** Host bedient, ist Kubernetes für **Cluster** aus vielen Nodes gemacht.

    Kernbegriffe:

    - **Pod** – kleinste deploybare Einheit, ein oder mehrere eng gekoppelte Container.
    - **Deployment** – beschreibt, wie viele Pods einer Sorte laufen sollen.
    - **Service** – stabile Netzwerk-Adresse vor einer Gruppe von Pods.
    - **Cluster** – Verbund aller Nodes, die zusammen Workloads tragen.
    - **Helm** – Paketmanager für Kubernetes (versionierte „Charts" als Bündel von Manifesten).

    Kubernetes ist die nächste Stufe nach Docker Compose. Zum Anfassen in drei Blöcken: [Teil 1](kubernetes-praxis/index.md) (Pod, Deployment, Service), [Teil 2](kubernetes-aufbau/index.md) (betriebsreif machen) und [Helm](kubernetes-helm/index.md) (Pakete statt Handarbeit).

## <span id="chart"></span><span id="release"></span><span id="revision"></span><span id="values"></span>Chart / Release / Revision (Helm)
: **Die vier Begriffe, mit denen Helm arbeitet.** Sie werden leicht verwechselt, meinen aber klar Verschiedenes:

    - **Chart** – das **Paket**: ein Ordner mit Vorlagen (`templates/`), Standardwerten (`values.yaml`) und einem Steckbrief (`Chart.yaml`). Die Bauanleitung, noch nichts Laufendes.
    - **Release** – eine **Installation** dieses Charts, mit einem Namen. Dasselbe Chart kann mehrfach installiert sein – unter verschiedenen Namen oder in verschiedenen Namespaces.
    - **Revision** – ein **Stand** eines Releases. Jedes `helm upgrade` erzeugt eine neue Revision, die alte bleibt erhalten. Genau deshalb funktioniert `helm rollback`.
    - **Values** – die **Stellschrauben**: Werte, die beim Installieren in die Vorlagen eingesetzt werden. Reihenfolge: `values.yaml` < eigene Datei per `-f` < `--set` (rechts gewinnt).

    Nicht verwechseln: Die **Revision** (1, 2, 3 …) zählt die Installationen eines Releases, die **Chart-Version** beschreibt den Stand des Pakets und die **appVersion** den Stand der Software darin. Drei verschiedene Zähler. Alles dazu im Block [Kubernetes – Helm](kubernetes-helm/index.md).

## <span id="laufzeitumgebung"></span><span id="laufzeit"></span><span id="runtime"></span>Laufzeitumgebung / Runtime
: **Die Software-Plattform, in der eine Anwendung ausgeführt wird.** Im Docker-Kontext meint man damit fast immer die **Sprach-Runtime** im Container: Node.js, Python, Java/JVM, .NET, Go, Ruby usw. Welche Laufzeitumgebung dein Image nutzt, siehst du an der **`FROM`-Zeile** im Dockerfile:

    | `FROM`-Zeile | Laufzeitumgebung |
    |---|---|
    | `FROM node:22-alpine` | Node.js 22 |
    | `FROM python:3.12-slim` | Python 3.12 |
    | `FROM eclipse-temurin:21-jre` | Java 21 (JRE) |
    | `FROM postgres:16` | keine App-Runtime – das ist ein **Service**-Image |

    !!! note "Begriffliche Feinheit: ‚Laufzeit' vs. ‚Laufzeitumgebung'"
        Im Deutschen wird umgangssprachlich oft **„Laufzeit"** gesagt – das ist aber mehrdeutig: „Laufzeit" kann auch die **Dauer einer Ausführung** meinen („das Skript hat 2 Sekunden Laufzeit"). Fachlich präziser ist **„Laufzeitumgebung"** (= die Plattform, auf der etwas läuft) bzw. einfach das englische **„Runtime"**. In diesen Unterlagen nutzen wir „Laufzeitumgebung" oder „Runtime", wenn die Plattform gemeint ist.

    Achtung Doppelbedeutung von „Runtime": In anderen Kontexten meint „Runtime" auch die **Container-Runtime** (containerd, runc, …) – also die Software, die Container *startet*, nicht die *im* Container *läuft*. Aus dem Kontext lässt sich meistens unterscheiden, welche Bedeutung gerade gemeint ist.

## <span id="layer"></span>Layer
: **Eine Schicht in einem Docker-Image.** Jede Instruktion im Dockerfile erzeugt einen Layer, der Änderungen am Dateisystem gegenüber dem darunterliegenden Layer festhält. Layer werden zwischen Images geteilt (wenn sie identisch sind), um Platz und Bauzeit zu sparen. Beim Pullen lädt Docker nur fehlende Layer herunter.

## <span id="linter"></span><span id="lint"></span><span id="linting"></span>Linter / Lint / Linting
: **Werkzeug, das Quellcode statisch prüft** also ohne ihn auszuführen. Sucht nach typischen Bugs, schlechtem Stil und gefährlichen Mustern. Bekannte Vertreter: `eslint` für JavaScript und TypeScript, `pylint` und `ruff` für Python, `golangci-lint` für Go, `rubocop` für Ruby. Linter laufen meistens schon im Editor und nochmal in der CI. Wenn etwas auffällt, gibt es eine Meldung mit Datei, Zeile und oft einem Auto-Fix-Vorschlag. „Lint" ist die Sammelbezeichnung für die gefundenen Probleme. „Linting" beschreibt das aktive Prüfen.

## <span id="linux"></span>Linux
: **Open-Source-Betriebssystem.** Sehr flexibel, auf unzähligen Geräten vom Smartphone (Android basiert auf Linux) bis zum Supercomputer. Der **Linux-Kernel** ist die Grundlage. Populäre Distributionen: Ubuntu, Debian, Fedora, Arch, openSUSE. Alle Docker-Container brauchen letztlich einen Linux-Kernel zum Laufen.

## <span id="linuxkit"></span>LinuxKit
: **Minimales Linux**, das Docker Desktop auf Mac in der darunter liegenden VM verwendet. Leicht, spezialisiert, nur für das Betreiben von Docker-Containern – ohne Desktop-Umgebung, ohne Paket-Manager in klassischem Sinn.

## <span id="localhost"></span>localhost
: **Name für den eigenen Rechner im Netzwerk.** Zeigt immer auf die IP `127.0.0.1` (IPv4) oder `::1` (IPv6). **Wichtig in Docker:** `localhost` im Container ist der Container selbst, nicht der Host. Für Host-Zugriff aus Containern gibt es `host.docker.internal` (Mac/Win) oder explizite Host-IPs.

## <span id="loopback"></span>Loopback
: **Virtuelles Netzwerk-Interface**, das Pakete an den eigenen Rechner zurückschickt. Wird typischerweise unter `127.0.0.1` angesprochen. Praktisch für lokale Tests, weil kein echtes Netzwerk nötig ist. Jeder Container hat ein eigenes Loopback-Interface.

## <span id="lts"></span>LTS (Long Term Support)
: **Version einer Software mit lang gepflegter Unterstützung.** Bei Ubuntu alle zwei Jahre (20.04, 22.04, 24.04), jeweils fünf Jahre Pflege. LTS-Versionen sind für Produktions-Einsatz geeignet, Nicht-LTS für schnelleren Feature-Zyklus.

## <span id="mac"></span>MAC (Media Access Control)
: **Eindeutige Hardware-Adresse einer Netzwerkkarte.** 48 Bit, üblich als sechs Hex-Paare geschrieben (`a4:5e:60:1f:b2:c3`). Wird vom Hersteller fest in die Karte gebrannt – im Prinzip „die Seriennummer im LAN". Switche und Router nutzen sie auf Layer 2 zum Zustellen von Paketen. Virtuelle NICs (in VMs und Containern) bekommen eine zufällige MAC-Adresse zugewiesen – die ist nicht echt, aber im virtuellen Netz eindeutig.

## <span id="maintainer"></span>Maintainer
: **Person mit erweiterten Rechten in einem Git-Repository**, typischerweise auf GitHub oder GitLab. Maintainer dürfen:

    - Pull Requests annehmen oder ablehnen und in den Hauptbranch mergen
    - Branches schützen (Branch Protection Rules setzen)
    - Mitwirkende (Collaborator) einladen oder entfernen
    - Releases anlegen
    - das Repository umkonfigurieren

    Auf GitHub wird die Rolle technisch über die Repository-Rechte vergeben (`Maintain` oder `Admin`). In Open-Source-Projekten ist „Maintainer" oft eine Selbstbezeichnung für aktive Pflege-Personen. Siehe auch [Collaborator](#collaborator).

## <span id="mariadb"></span>MariaDB
: **Frei verfügbare relationale Datenbank**, die als Community-Fork aus MySQL entstanden ist und in den meisten Fällen ein **Drop-in-Ersatz** für MySQL ist. Wird von der von den ursprünglichen MySQL-Entwicklern gegründeten MariaDB Foundation gepflegt. Hört wie MySQL standardmäßig auf Port `3306`. Im Kurs nutzen wir MariaDB im WordPress-Compose-Beispiel als leichtgewichtige Alternative zu MySQL. Das offizielle Image (`mariadb`) bringt seit Version 11.2 ein eingebautes Healthcheck-Skript (`healthcheck.sh --connect --innodb_initialized`) mit, das robuster ist als ein selbstgebauter Auth-basierter Check.

## <span id="mount"></span><span id="mount-point"></span>Mount / Mount-Point
: **Eine Datei, ein Ordner oder ein Gerät wird an einem bestimmten Pfad ins Dateisystem „eingehängt"**. Auf Linux ist z.B. `/mnt/usb` ein möglicher Mount-Point für einen USB-Stick. Bei Docker sind Bind Mounts und Volumes solche Einhängungen, die Host-Inhalte in den Container „einhängen".

## <span id="multi-stage-build"></span>Multi-Stage-Build
: **Dockerfile-Technik**, bei der mehrere `FROM`-Blöcke hintereinander stehen. Die erste Stage baut Artefakte (mit allen Build-Tools), die folgende(n) Stage(s) bauen ein schlankes Runtime-Image und kopieren nur die Ergebnisse mit `COPY --from=stage-name`. Reduziert Image-Größe und Angriffsfläche erheblich – z.B. aus 1 GB wird 50 MB.

## <span id="multipass"></span>Multipass
: **Kommandozeilen-Werkzeug von Canonical**, das auf macOS, Linux und Windows mit einem Befehl Ubuntu-VMs startet. Nutzt intern je nach Host unterschiedliche Backends (QEMU/HVF auf Mac, KVM auf Linux, Hyper-V auf Windows). Perfekt für schnelle Testumgebungen und den Einstieg in Virtualisierung.

## <span id="namespace"></span>Namespace
: **Linux-Kernel-Feature**, das einem Prozess eine eigene Sicht auf bestimmte Systemressourcen gibt – eigene PIDs, eigenes Netzwerk, eigenes Dateisystem, eigener Hostname. Grundlage der Container-Isolation. Mehrere Prozesse können in unterschiedlichen Namespaces leben und sich gegenseitig nicht sehen – obwohl sie denselben Kernel teilen.

## <span id="nat"></span>NAT (Network Address Translation)
: **Technik, die mehrere interne IP-Adressen hinter einer einzigen externen verbirgt.** Dein Heimrouter macht das, damit alle Geräte im Heimnetz über eine einzige öffentliche IP ins Internet können. Docker nutzt NAT im Bridge-Netzwerk: Der Host hat eine Gateway-IP, alle Container hängen dahinter und werden übersetzt, wenn sie nach draußen sprechen.

## <span id="nginx"></span>nginx
: **Sehr populärer Webserver**, der statische Seiten ausliefert und als Reverse Proxy vor anderen Diensten eingesetzt wird. Schnell, ressourcenschonend, gut konfigurierbar. In Docker als offizielles Image `nginx` verfügbar – wird im Kurs oft als „schnell einen Webserver haben"-Beispiel genutzt. Siehe auch [proxy_pass](#proxy_pass) für die Reverse-Proxy-Direktive.

## <span id="nodejs"></span><span id="node"></span>Node.js
: **JavaScript-Laufzeitumgebung außerhalb des Browsers**, basierend auf der V8-Engine von Chrome. Damit lässt sich JavaScript für Server-Anwendungen, CLI-Tools oder Build-Pipelines verwenden. Mit dem Paketmanager **npm** oder **pnpm** zieht man Bibliotheken nach (z.B. [Express](#express) für eine kleine API). In diesem Kurs taucht Node.js in den Beispiel-Backends auf – als Image `node:22-alpine` oder `node:20-slim`. Ihr müsst Node nicht selbst installieren, das macht das Image.

## <span id="nic"></span>NIC (Network Interface Card)
: **Netzwerkkarte** – das Gerät, über das ein Rechner sich mit einem Netzwerk verbindet. Kann physisch sein (Ethernet, WLAN) oder virtuell (bei VMs und Containern). Jede NIC hat eine eigene MAC-Adresse und eine oder mehrere IP-Adressen.

## <span id="netzwerkinterface"></span><span id="interface"></span>Netzwerkinterface / Interface
: **Allgemeiner Begriff für „die Schnittstelle zum Netzwerk".** Umfasst physische NICs, virtuelle NICs, Loopback, Bridge-Interfaces und mehr. Unter Linux siehst du sie mit `ip addr` oder `ifconfig`. Im Docker-Netzwerk hat jeder Container sein eigenes virtuelles Interface (meist `eth0`).

## <span id="oci"></span>OCI (Open Container Initiative)
: **Standardisierungsgremium** für das Container-Format. Sorgt dafür, dass Images und Runtimes verschiedener Hersteller (Docker, Podman, containerd, …) miteinander kompatibel sind. Wenn du in Logs Begriffe wie „OCI-konform", „OCI-Image-Spec" oder „OCI-Runtime-Spec" liest, geht es um genau diese Standards. `runc` ist die offizielle Referenz-Implementierung der OCI-Runtime-Spec.

## <span id="orchestrierung"></span>Orchestrierung
: **Verwaltung vieler Container über mehrere Hosts hinweg** – Skalierung, Deployment, Health-Checks, automatische Neustarts, Service-Discovery. Prominentes Beispiel: **Kubernetes**. Docker Swarm ist eine einfachere Alternative. Compose ist **keine** Orchestrierung, weil es nur auf einem Host arbeitet.

## <span id="orbstack"></span><span id="orb-stack"></span>OrbStack
: **Mac-native Alternative zu Docker Desktop**, entwickelt seit 2023. Schneller und ressourcenschonender als Docker Desktop, v.a. auf Apple Silicon. Frei für Privatnutzung, kostenpflichtig für größere kommerzielle Nutzung. Die CLI bleibt `docker`, die Integration ist nahtlos.

## <span id="origin"></span>origin (Git)
: **Standard-Name für den ersten Remote eines Git-Repositories.** Wenn du ein Repo mit `git clone <URL>` holst, legt Git automatisch einen Remote namens `origin` an, der auf diese URL zeigt. Ab dann meint `git push` ohne weitere Angabe meistens „nach origin pushen".

    **Wichtig:** `origin` ist nur eine **Konvention**, kein Sonderwort. Technisch könntest du ihn umbenennen (`git remote rename origin meinremote`) oder mehrere Remotes haben (`origin`, `upstream`, `backup`, …). In >99 % der Repos ist `origin` aber genau das, was du erwartest: dein Haupt-Remote, typischerweise auf GitHub, GitLab oder einem firmeninternen Git-Server.

    Anzeigen mit `git remote -v`, hinzufügen mit `git remote add origin <URL>`, ändern mit `git remote set-url origin <URL>`. Siehe auch [Remote-Repository](#remote-repository) und [Upstream](#upstream).

## <span id="os"></span>OS (Operating System)
: **Betriebssystem**, z.B. Linux, macOS, Windows. Verwaltet Hardware, bietet Diensten wie Prozess-Isolation, Dateisystem, Netzwerk.

## <span id="pacman"></span>pacman
: **Paketmanager** von Arch Linux und seinen Varianten (Manjaro, EndeavourOS). `sudo pacman -S docker` installiert, `sudo pacman -Syu` aktualisiert das ganze System.

## <span id="paketmanager"></span><span id="paket-manager"></span>Paketmanager
: **Software, die Software installiert.** Holt Pakete aus Repositories, installiert sie samt Abhängigkeiten, updated oder entfernt sie sauber. Auf Linux je Distribution unterschiedlich: `apt` (Debian/Ubuntu), `dnf` (Fedora/RHEL), `pacman` (Arch), `zypper` (openSUSE). Auf macOS: Homebrew. Auf Windows: winget, Chocolatey.

## <span id="path"></span>PATH
: **Umgebungsvariable**, in der alle Verzeichnisse stehen, in denen das Betriebssystem nach ausführbaren Programmen sucht. Wenn du `docker` tippst, schaut dein Shell alle PATH-Einträge durch, bis sie eine Datei namens `docker` findet. `echo $PATH` (Bash/Zsh) oder `$env:PATH` (PowerShell) zeigt den aktuellen PATH.

## <span id="pat"></span><span id="personal-access-token"></span>Personal Access Token (PAT)
: **Persönlicher Zugriffs-Token bei GitHub**, der ein Passwort beim Aufruf von Git- oder API-Befehlen ersetzt. Wird in den GitHub-Settings unter **Developer settings → Personal access tokens** angelegt. Zwei Varianten:

    - **Tokens (classic)** – freie Scope-Auswahl (`repo`, `read:packages`, …), unbegrenzt lange gültig.
    - **Fine-grained tokens** – pro Repo zugeschnitten, mit Ablaufdatum.

    Brauchst du **nicht**, wenn du nur in deinem eigenen Repo aus einem GitHub-Actions-Workflow auf das Repo, GHCR-Pakete oder Releases zugreifst – dafür reicht der eingebaute [GITHUB\_TOKEN](#github-token). PATs werden erst nötig bei: HTTPS-Pushes aus dem Terminal, dem **manuellen** Pullen eines privaten GHCR-Images (`docker login ghcr.io -u <user> --password-stdin` mit Scope `read:packages`), oder Cross-Repo-Aktionen (von Repo A in Repo B pushen). **Sicherheitshinweis:** PATs sind so sensibel wie Passwörter – nie ins Repo committen, beim Anlegen ein **Ablaufdatum** setzen, nur die nötigen Scopes anhaken.

## <span id="permissions"></span>permissions (GitHub Actions)
: **YAML-Block, mit dem du dem [GITHUB\_TOKEN](#github-token) für die Dauer eines Workflows oder Jobs gezielt Schreibrechte einräumst.** Seit 2023 sind die Default-Rechte des Tokens auf „read" reduziert; willst du z.B. ein Image nach GHCR pushen oder einen Release anlegen, musst du das explizit erlauben:

    ```yaml
    permissions:
      contents: read       # Code lesen (Default)
      packages: write      # GHCR pushen
      contents: write      # Releases anlegen, Tags pushen
      id-token: write      # OIDC für Cloud-Login
      pull-requests: write # PR kommentieren
    ```

    Der Block darf **auf Workflow- oder Job-Ebene** stehen. Job-Ebene gewinnt, wenn beides gesetzt ist. Zusätzlich muss in den Repo-Settings unter **Settings → Actions → General → Workflow permissions** mindestens **„Read and write permissions"** ausgewählt sein, sonst ignoriert GitHub den Block und meldet `resource not accessible by integration` beim Push.

## <span id="pg-isready"></span><span id="pg_isready"></span>pg_isready
: **Kleines Hilfsprogramm**, das im offiziellen `postgres`-Image enthalten ist und prüft, ob der Postgres-Server **schon Anfragen annimmt**. Liefert Exit-Code 0, wenn die Datenbank bereit ist, sonst einen Fehler-Exit-Code – ideal für Healthchecks. Typische Aufrufe: `pg_isready -U postgres` (Default-User) oder `pg_isready -U $POSTGRES_USER -d $POSTGRES_DB`. In `compose.yaml`-Healthchecks musst du Variablen mit doppeltem `$$` schreiben, damit Compose sie nicht selbst auflöst, sondern sie an die Shell im Container weitergibt: `pg_isready -U $${POSTGRES_USER}`.

## <span id="port"></span>Port
: **Eine Nummer zwischen 0 und 65535**, die einen Dienst auf einem Rechner identifiziert. Webserver hören meist auf Port 80 (HTTP) oder 443 (HTTPS), PostgreSQL auf 5432, SSH auf 22. Ein Rechner kann viele Ports gleichzeitig „offen" haben – jeder Port ist ein eigener Kommunikationskanal. Ports unter 1024 sind privilegiert (nur root darf sie öffnen).

## <span id="port-mapping"></span>Port-Mapping
: **Weiterleitung eines Host-Ports auf einen Container-Port.** Syntax bei Docker: `-p HOST:CONTAINER`. Beispiel: `-p 8080:80` verbindet den Host-Port 8080 mit dem Container-Port 80. Der Host-Port steht **zuerst**, der Container-Port danach – häufige Fehlerquelle.

## <span id="pid"></span>PID (Process ID)
: **Eindeutige Nummer eines laufenden Prozesses** auf einem System. Vom Kernel beim Start des Prozesses vergeben, einmalig zur Laufzeit. Die `PID 1` ist auf Linux der allererste Prozess (siehe [init / PID 1](#init)). Anzeigen mit `ps aux` (Linux/macOS), `Get-Process` (PowerShell) oder `tasklist` (CMD). Bei Docker bekommst du die PID des laufenden Container-Prozesses mit `docker top <container>` oder `docker inspect --format '{{.State.Pid}}' <container>`.

## <span id="pipeline"></span><span id="ci-pipeline"></span>Pipeline (CI/CD)
: **Automatisierte Folge von Phasen, die nach einem Trigger ablaufen.** Klassische Phasen: **Trigger → Build → Test → Publish → Deploy**. Jede Phase hat klare Inputs und Outputs; Folge-Phasen laufen nur bei grünem Vorgänger. In GitHub Actions wird eine Pipeline durch eine YAML-Datei in `.github/workflows/` beschrieben, die einen [Workflow](#workflow) bildet. Siehe [Pipeline-Konzept](ci-cd/pipeline-konzept.md).

## <span id="pipe"></span>Pipe (`|`)
: **Shell-Symbol**, das die Ausgabe eines Befehls direkt als Eingabe an einen anderen Befehl weitergibt. Beispiel: `docker ps -aq | xargs docker rm` → `docker ps -aq` liefert eine Liste von Container-IDs, `xargs` übergibt sie Stück für Stück an `docker rm`. Die Pipe ist ein Grundbaustein der Unix-Shell und sehr mächtig. In Windows PowerShell funktioniert Piping ähnlich, aber leitet **Objekte** statt Text weiter.

## <span id="podman"></span>Podman
: **Container-Engine von Red Hat als Alternative zu Docker.** Arbeitet ohne zentralen Daemon – Container laufen direkt unter dem aufrufenden User. Mit `alias docker=podman` meist Drop-in-Ersatz. Gut für lizenzsensitive Umgebungen und strenge Security-Anforderungen.

## <span id="pool"></span>Connection Pool / Pool
: **Vorgehaltener Vorrat an Datenbankverbindungen**, den eine Anwendung intern verwaltet. Statt für jede Anfrage eine neue Verbindung aufzubauen (langsam), nimmt die App eine offene Verbindung aus dem Pool, nutzt sie und gibt sie zurück. Erhöht die Performance deutlich. In der Beispiel-App des Escape Rooms macht das die `pg`-Library mit `new Pool(...)`. Wichtig: Wenn die Datenbank neu startet, sind die alten Verbindungen kaputt – die App muss neu starten oder reconnecten.

## <span id="post"></span>POST (HTTP-Methode)
: **HTTP-Methode zum Senden/Erstellen von Daten.** Anders als `GET` enthält ein `POST`-Request einen Body – meistens JSON oder Form-Daten. Beispiel: `POST /api/entries` mit Body `{"team":"Alpha","name":"Drache","score":25}` legt einen neuen Eintrag an. Server bestätigt typischerweise mit Status `201 Created`.

## <span id="profiles"></span>profiles (Compose)
: **Compose-Schlüssel**, der Services **optional** macht. Ein Service mit `profiles: ["debug"]` startet **nicht** bei `docker compose up -d` – nur wenn das passende Profil aktiv ist: `docker compose --profile debug up -d`. Sehr nützlich, um z.B. Adminer, Mailpit oder andere Debug-Tools im selben `compose.yaml` zu definieren, sie aber im Alltag nicht hochzufahren. Mehrere Profile pro Service sind möglich.

## <span id="proxy_pass"></span>proxy_pass (nginx)
: **Direktive in der nginx-Konfiguration**, die ankommende Anfragen an einen anderen Server weiterleitet (Reverse-Proxy-Verhalten). Beispiel: `proxy_pass http://backend:3000/api/;` heißt: alles, was an diese `location` kommt, wird intern an `http://backend:3000/api/...` geschickt. In Compose-Setups ist der Hostname rechts oft ein **Service-Name** aus der `compose.yaml`, sodass nginx den anderen Container über den Compose-internen DNS findet. Wichtig in dynamischen Setups: nginx mit einem `resolver`-Block kombinieren und den Hostnamen über eine Variable einsetzen, damit nicht beim Start einmalig gecacht wird. Siehe auch [nginx](#nginx) und [Reverse Proxy](#reverse-proxy).

## <span id="postgres"></span><span id="postgresql"></span>PostgreSQL / Postgres
: **Mächtige, frei verfügbare relationale Datenbank.** Sehr ausgereift, extrem erweiterbar, in vielen Projekten die erste Wahl. In Docker als offizielles Image `postgres` verfügbar und wird in den Kurs-Praxisteilen genutzt. Der Service hört standardmäßig auf Port 5432.

## <span id="powershell"></span>PowerShell
: **Die moderne Shell von Microsoft**, plattformübergreifend (Windows/macOS/Linux). Objekt-orientiert statt text-orientiert wie Bash: Befehle liefern Objekte, nicht Strings. Mächtig, aber mit anderer Syntax als Bash – in diesem Kurs zeigen wir wichtige Varianten, wo sich die Befehle unterscheiden.

## <span id="pydantic"></span>Pydantic
: **Python-Bibliothek zur Daten-Validierung über Type-Hints.** Eine Klasse beschreibt das erwartete Datenmodell (Felder, Typen, Constraints), Pydantic prüft beim Erzeugen automatisch und meldet Fehler. Wird intensiv von [FastAPI](#fastapi) genutzt, um eingehende Requests zu validieren – passt das JSON nicht zum Modell, gibt es automatisch eine `422`-Antwort mit Erklärung.

## <span id="prozess"></span>Prozess
: **Ein laufendes Programm**, das der Kernel verwaltet. Hat eine PID (Prozess-ID), einen eigenen Speicherbereich, kann Kind-Prozesse starten. Siehst du auf Linux mit `ps aux` oder `htop`. Jeder Container ist technisch ein Prozess (oder eine Prozess-Gruppe) auf dem Host-Kernel.

## <span id="qemu"></span>QEMU
: **Quelloffener Maschinen-Emulator**, der oft als Virtualisierungs-Backend genutzt wird – etwa von Multipass auf macOS. Kann sowohl emulieren (langsam, flexibel, auch fremde Architekturen) als auch mit Hardware-Beschleunigung virtualisieren (schnell, nur native Architektur). In CI-Pipelines wird QEMU über `docker/setup-qemu-action@v3` aktiviert, um auf einem `x86_64`-Runner auch `linux/arm64`-Images bauen zu können – langsamer als nativ, aber das einzige Mittel auf den GitHub-gehosteten Standard-Runnern.

## <span id="ram"></span>RAM (Random Access Memory)
: **Arbeitsspeicher.** Schneller, flüchtiger Speicher – beim Ausschalten weg. Jede VM reserviert bei ihrem Start einen Teil des Host-RAMs. Container teilen sich dagegen den Host-RAM und bekommen je nach cgroup-Konfiguration ein Limit.

## <span id="redis"></span>Redis
: **Sehr schneller In-Memory-Datenspeicher**, der vor allem als **Cache** und für Sessions, Queues und Pub/Sub eingesetzt wird. Daten liegen primär im RAM, optional werden sie regelmäßig auf Platte geschrieben (Snapshot-Datei `dump.rdb` oder Append-Only-Log). Hört standardmäßig auf Port `6379`. Im Kurs taucht Redis in der Compose-Challenge als Cache-Service auf. Per Konvention startet man Redis mit `redis-server --requirepass ...`, um Passwortschutz zu erzwingen; das offizielle `redis`-CLI nutzt automatisch die Umgebungsvariable `REDISCLI_AUTH`, sodass im `redis-cli`-Aufruf keine Klartext-Passwörter stehen müssen.

## <span id="registry"></span>Registry
: **Server, auf dem Docker-Images gespeichert sind.** Docker Hub ist die Default-Registry. Weitere bekannte Registries: GitHub Container Registry (`ghcr.io`), AWS ECR, GitLab Container Registry, Azure Container Registry, Harbor. In Firmen werden oft interne Registries betrieben, damit Images nicht extern wandern müssen.

## <span id="repository"></span><span id="repo"></span>Repository / Repo
: **Zentraler Ablageort für Code oder Pakete.** Bei Git: ein Repository enthält Quellcode und Historie (z.B. auf GitHub). Bei Paketmanagern: ein Repository hält Software-Pakete bereit (z.B. Debians Main-Repo). Bei Docker: ein Repository ist ein Image-Name in einer Registry (z.B. `library/nginx`), kann viele Tags haben.

## <span id="rest"></span>REST / RESTful API
: **Architektur-Stil für Web-APIs**, der HTTP-Methoden nutzt, um Ressourcen zu adressieren. Idee: jede Ressource hat eine URL (`/api/entries`, `/api/scoreboard`) und HTTP-Methoden (`GET`, `POST`, `PUT`, `DELETE`) drücken aus, was mit ihr passieren soll. Eine API, die diesem Stil folgt, heißt **RESTful**. Beispiel: `GET /api/entries` holt die Liste, `POST /api/entries` legt einen Eintrag an.

## <span id="retry-logik"></span>Retry-Logik
: **Mechanismus, eine fehlgeschlagene Operation mehrfach zu wiederholen** – meist mit Wartezeit zwischen den Versuchen. Sinnvoll bei Operationen, die auf einen anderen Dienst warten müssen. Beispiel aus dem Escape Room: Die API kann erst loslegen, wenn die Datenbank bereit ist. Sie versucht es 20-mal, mit 1 Sekunde Wartezeit – statt sofort aufzugeben. Praktisch in Container-Setups, wo Startreihenfolgen nicht garantiert sind.

## <span id="recreate"></span>Recreate (Deployment-Strategie)
: **Einfachste Deployment-Strategie**: alle alten Instanzen stoppen, dann neue starten. Akzeptiert eine kurze **Downtime** im Update-Fenster, dafür kein Mischbetrieb zweier Versionen, keine besondere Infrastruktur nötig. In Compose ist das de-facto der Default beim `docker compose up -d` mit neuem Image. Sinnvoll bei kleinen, internen Apps oder bei Schema-Änderungen, die Versions-kompatibel nicht möglich sind.

## <span id="rebase"></span>Rebase (Git)
: **Alternative zum klassischen Merge.** Statt zwei Branches mit einem Merge-Commit zusammenzuführen, baut Rebase deine Commits auf einen anderen Branch **um** – als wären sie dort direkt entstanden. Ergebnis: **lineare Historie** ohne Merge-Commits.

    Befehl: `git rebase main` (auf einem Feature-Branch). Git nimmt deine Feature-Commits, setzt den Branch auf den aktuellen `main`-Stand zurück und spielt deine Commits einzeln darauf ab.

    **Vorteil:** sehr aufgeräumte Historie. **Nachteil:** ändert die SHAs deiner Commits (neue Commits, die alten gibt es technisch nicht mehr) – nach einem Rebase brauchst du `git push --force-with-lease`. Faustregel: **nie auf einen Branch rebasen, den andere schon haben** – das schreibt deren Historie um. Lokal auf Feature-Branches ist Rebase aber sehr nützlich.

## <span id="reflog"></span>Reflog (Git)
: **Aufzeichnung jeder HEAD-Bewegung deines Repositories.** Während die normale Historie (`git log`) zeigt, wo dein Branch jetzt steht, zeigt `git reflog` zusätzlich **wo HEAD überall war** – Commits, Checkouts, Resets, Merges, Rebases.

    Praktisch zur **Rettung**: hast du versehentlich Commits mit `git reset --hard` weggeworfen, einen Branch gelöscht oder bist im [Detached HEAD](#detached-head) etwas verloren – `git reflog` zeigt die SHAs der verlorenen Commits, du kannst sie mit `git branch rettung <sha>` zurückholen.

    **Aufbewahrung:** Reflog-Einträge zu noch erreichbaren Commits halten standardmäßig 90 Tage, Einträge zu unerreichbaren Commits 30 Tage. Danach kann `git gc` sie wegräumen.

## <span id="git-reset"></span><span id="reset-git"></span>git reset
: **Befehl zum Verschieben des aktuellen Branches auf einen anderen Commit.** Drei Varianten:

    - `git reset --soft <commit>` – Branch verschieben, **Staging und Working Tree unverändert lassen**. Alle Änderungen liegen weiter zum Commit bereit.
    - `git reset --mixed <commit>` (Default) – Branch + Staging zurücksetzen, Working Tree unverändert. Änderungen werden „uncommitted und unstaged".
    - `git reset --hard <commit>` – Branch, Staging **und Working Tree** auf den Zielzustand setzen. **Alle nicht-committeten Änderungen sind weg.**

    **Vorsicht bei `--hard`:** danach gibt es kein Undo der Working-Tree-Änderungen außer aus dem [Reflog](#reflog). Erst Backup machen, dann zurücksetzen.

    **Niemals reset auf gepushte Commits**, wenn andere darauf zugreifen – das überschreibt deren Historie. Im Solo-Repo dagegen ist es ein normales Werkzeug, z.B. zum Korrigieren eines verfrühten Commits.

## <span id="reverse-proxy"></span>Reverse Proxy
: **Server, der Anfragen aus dem Netz entgegennimmt und an interne Dienste weiterreicht.** Klassiker: nginx oder Traefik vor mehreren Backend-Containern. Vorteile: zentrale TLS-Terminierung, Load Balancing, Caching, Auth-Vorprüfung. In einem Compose-Setup sieht das so aus: nginx hat den `-p 443:443`-Port nach außen, die App-Container haben **nur** interne Ports und werden vom nginx über das Compose-Netz erreicht.

## <span id="restart-policy"></span><span id="restartcount"></span>Restart-Policy
: **Regel, was nach einem Container-Exit passiert.** Wird beim `docker run --restart=...` gesetzt:

    | Wert | Verhalten |
    |---|---|
    | `no` *(Default)* | gar nichts – Container bleibt nach Crash unten |
    | `on-failure[:N]` | startet bei Exit-Code ≠ 0 neu, optional N-mal max. |
    | `always` | startet immer neu, auch nach Daemon-Neustart |
    | `unless-stopped` | wie `always`, respektiert aber `docker stop` |

    Im `docker inspect <container>` siehst du unter `RestartCount`, wie oft Docker den Container schon neu gestartet hat – sehr nützlich, um „der Container kommt immer wieder hoch" von „der läuft stabil" zu unterscheiden.

## <span id="rosetta"></span><span id="rosetta-2"></span>Rosetta 2
: **Apples Übersetzer**, der x86_64-Software auf Apple-Silicon-Rechnern lauffähig macht. Relevant für Docker, wenn ein Image nur in x86_64 vorliegt und auf M-Macs laufen soll. Installation: `softwareupdate --install-rosetta --agree-to-license`. Docker Desktop ab Version 4.25 nutzt Rosetta 2 direkt für die Container-Emulation, was deutlich schneller ist als QEMU-Emulation.

## <span id="rolling-update"></span><span id="rolling"></span>Rolling Update (Deployment-Strategie)
: **Deployment-Strategie**, bei der Instanzen einer App in kleinen Wellen ausgetauscht werden: alte stoppen, neue starten, Healthcheck warten, nächste Welle. Während des gesamten Updates läuft die App weiter (kein Downtime), aber kurzzeitig sind **alte und neue Version parallel** aktiv. Standard-Modus von Kubernetes-Deployments. Voraussetzung: die neue Version muss kurzzeitig **API-kompatibel** zur alten sein.

## <span id="routing-tabelle"></span>Routing-Tabelle
: **Liste, wohin Netzwerk-Pakete geschickt werden sollen.** Wenn du `google.com` aufrufst, fragt dein Betriebssystem die Routing-Tabelle: „Wie komme ich zu dieser IP?" – die Antwort ist meist der Gateway (Router). Docker-Netzwerke haben eigene Routing-Tabellen, damit Container-Pakete richtig geleitet werden.

## <span id="runner"></span><span id="self-hosted-runner"></span>Runner (CI/CD)
: **Maschine, auf der ein Pipeline-Job ausgeführt wird.** Bei GitHub Actions sind das standardmäßig **GitHub-gehostete Runner** (frische Ubuntu-/Windows-/macOS-VMs, neu pro Job). Alternativ lassen sich **self-hosted Runner** registrieren – eigene Server, an die GitHub Jobs verteilt. Self-hosted Runner braucht man bei besonderer Hardware (GPU, ARM, viel RAM), Compliance-Anforderungen oder hohem Lauf-Volumen. Andere CI-Systeme nennen die Komponente **Agent** (Jenkins) oder **Runner** (GitLab). Im Kurs nutzen wir nur GitHub-gehostete Runner.

## <span id="runc"></span>runc
: **Low-Level-Container-Runtime**, die einzelne Linux-Container tatsächlich startet. `runc` ist die Referenz-Implementierung der OCI-Runtime-Spec. Du nutzt sie nie direkt – Docker, containerd und Kubernetes rufen sie unter der Haube auf, um aus einem entpackten Image-Dateisystem einen laufenden Container zu machen.

## <span id="sbom"></span>SBOM (Software Bill of Materials)
: **Maschinenlesbare Liste aller Komponenten eines Images** oder einer Software – ähnlich der Zutatenliste auf Lebensmittelverpackungen. Ermöglicht schnelles Beantworten von „welche meiner Images sind von CVE X betroffen?". Erzeugbar z.B. mit Syft.

## <span id="scale"></span>scale (Compose)
: **Compose-Flag**, das einen Service in mehreren Instanzen gleichzeitig startet: `docker compose up -d --scale app=3` startet drei `app`-Container statt einem. Praktisch für Lasttests oder einfache Demos. **Aber:** Mehrere Instanzen vor demselben Host-Port funktionieren nur, wenn ein Reverse Proxy oder Load-Balancer (nginx, Traefik) davorsitzt – sonst lehnt Docker den zweiten Container ab. Für ernsthaftes Skalieren über mehrere Hosts gibt es **Kubernetes** oder **Docker Swarm** – Compose ist und bleibt ein Single-Host-Tool.

## <span id="selinux"></span>SELinux (Security-Enhanced Linux)
: **Linux-Sicherheitsmodul**, das regeln kann, welche Prozesse auf welche Dateien und Netzwerke zugreifen dürfen. Standardmäßig aktiv auf Fedora, RHEL, CentOS, Rocky Linux, AlmaLinux. Bei Docker-Volumes kann SELinux den Zugriff blockieren – Lösung: `:z` oder `:Z` an den Mount-Pfad anhängen, z.B. `-v ./data:/app/data:z`.

## <span id="secret"></span>Secret
: **Vertrauliche Information** (Passwort, API-Key, Zertifikat), die nicht ins Image gehört und nicht in Git landen darf. Zur Laufzeit über Umgebungsvariablen, Volumes oder dedizierte Secret-Manager übergeben. Ein geleaktes Secret in Git gilt als kompromittiert – es muss rotiert werden. In **GitHub Actions** liegen Secrets unter Settings → Secrets and variables → Actions; im Workflow zugreifbar über `${{ secrets.NAME }}`. GitHub maskiert die Werte automatisch in den Logs als `***`.

## <span id="github-token"></span>GITHUB\_TOKEN
: **Automatisch erzeugter Token pro GitHub-Actions-Workflow-Lauf.** Erlaubt dem Workflow den Zugriff auf das Repo, ohne dass du einen eigenen Personal Access Token (PAT) anlegen musst. Default-Berechtigungen sind seit 2023 schreibgeschützt; mit `permissions:` im Workflow lassen sich gezielt mehr Rechte einräumen (`contents: write`, `packages: write`, `id-token: write`). Der Token läuft nach Ende des Jobs sofort ab. Reicht für die meisten Aufgaben (GHCR-Push, Release-Anlage, Issue-Kommentare). Eigene PATs braucht man erst bei Cross-Repo-Aktionen.

## <span id="semver"></span><span id="semantic-versioning"></span>Semver / Semantic Versioning
: **Versions-Schema in der Form `MAJOR.MINOR.PATCH`** (z.B. `1.4.2`). Die drei Stellen haben feste Bedeutungen:

    - **MAJOR** wird erhöht, wenn es **brechende Änderungen** gibt.
    - **MINOR** wird erhöht, wenn neue Features **rückwärtskompatibel** dazu kommen.
    - **PATCH** wird erhöht bei Bugfixes ohne API-Änderung.

    In CI-Pipelines wird Semver oft via Git-Tag (`v1.4.2`) ausgelöst – die `docker/metadata-action` leitet daraus automatisch Image-Tags `1.4.2`, `1.4`, `1` und `latest` ab. So kann ein Konsument sich ans gewünschte Stabilitäts-Niveau binden (`:1` heißt „beliebige 1.x-Version").

## <span id="serial"></span>SERIAL (PostgreSQL)
: **Datentyp in PostgreSQL für automatisch hochzählende ganze Zahlen.** Wird typischerweise für Primary Keys verwendet: `id SERIAL PRIMARY KEY`. Bei jedem Insert wird automatisch ein neuer, eindeutiger Wert vergeben (1, 2, 3, …). So musst du dir um IDs nicht selbst kümmern. Andere Datenbanken haben ähnliche Typen (`AUTO_INCREMENT` bei MySQL, `IDENTITY` bei MS-SQL).

## <span id="service"></span>Service (Compose)
: **In Compose ein Eintrag unter `services:`** – konzeptuell eine Container-Art, die beliebig oft instanziiert werden kann (z.B. mit `--scale`). Der Service-Name ist gleichzeitig der DNS-Name im Compose-Netzwerk: `db`, `app`, `cache`.

## <span id="shell"></span>Shell
: **Programm, das Befehle aus dem Terminal entgegennimmt** und an das Betriebssystem weiterleitet. Beispiele: Bash, Zsh, Fish (Linux/Mac), PowerShell, cmd (Windows). Die Shell interpretiert Befehle, führt sie aus und zeigt das Ergebnis. Beim `docker exec -it container bash` öffnest du eine Bash-Shell im Container.

## <span id="shell-redirektion"></span>Shell-Redirektion (`>`, `>>`, `|`)
: **Umleitung** der Ein-/Ausgabe von Befehlen. `echo "text" > datei.txt` schreibt den Text in die Datei (**überschreibt** sie). `echo "text" >> datei.txt` hängt ans Ende der Datei an. `|` (Pipe) leitet die Ausgabe eines Befehls als Eingabe an einen anderen weiter. Grundlegende Technik in Bash, Zsh und PowerShell.

## <span id="signal"></span><span id="sigterm"></span><span id="sigkill"></span>Signal (SIGTERM, SIGKILL, SIGINT, …)
: **Nachrichten vom Kernel an einen Prozess**, um auf Ereignisse zu reagieren oder ihn zu beenden.

    - **SIGTERM** (`kill <pid>` ohne Flags) – höfliche Aufforderung zu beenden. Der Prozess kann sie abfangen, aufräumen und sich sauber beenden. Docker schickt SIGTERM an PID 1 beim `docker stop`.
    - **SIGKILL** (`kill -9 <pid>`) – hartes Beenden, kann **nicht** abgefangen werden. Docker schickt SIGKILL nach 10 Sekunden, wenn der Container auf SIGTERM nicht reagiert.
    - **SIGINT** (`Ctrl+C`) – Unterbrechung, klassisch von der Shell aus.

    Wichtig im Container: PID 1 ist meist die App selbst – die App muss SIGTERM behandeln, sonst dauert jedes `docker stop` zehn Sekunden.

## <span id="smoke-test"></span>Smoke Test
: **Sehr kurzer, rein funktionaler Test direkt nach einem Deploy**: läuft das System überhaupt, antwortet der Health-Endpoint, gibt die Startseite eine 200 zurück? Keine Tiefe, kein Edge-Case-Coverage – nur „rauchts oder rauchts nicht". In Blue/Green-Deployments laufen Smoke-Tests gegen die noch nicht live geschaltete Umgebung, bevor der Traffic-Switch erfolgt. Klassische Werkzeuge: `curl`, ein paar HTTP-Requests in einem Skript, oder ein dedizierter Tool wie `k6` für leichte Last-Smoke-Tests.

## <span id="snap"></span>Snap
: **Paketformat und Paketmanager von Canonical.** Snaps sind in sich abgeschlossene Pakete, die ihre Abhängigkeiten mitbringen – ähnlich wie Container, aber auf Linux-Desktop-Ebene. Auf Ubuntu vorinstalliert, auf Debian manuell nachrüstbar. Wird in diesem Kurs für die Multipass-Installation genutzt: `sudo snap install multipass`.

## <span id="socket"></span>Socket
: **Kommunikationskanal** zwischen zwei Endpunkten – entweder im Netzwerk (TCP/UDP-Sockets zwischen Rechnern) oder lokal auf einem Rechner (Unix-Sockets zwischen Prozessen). Docker-CLI spricht mit dem Daemon über einen Unix-Socket. Bei Netzwerk-Sockets gehören immer IP-Adresse und Port zusammen.

## <span id="sql"></span>SQL (Structured Query Language)
: **Standard-Sprache zum Arbeiten mit relationalen Datenbanken** wie PostgreSQL, MySQL, MariaDB, SQLite. Mit SQL legst du Tabellen an (`CREATE TABLE`), fügst Daten ein (`INSERT INTO`), holst sie zurück (`SELECT`) und änderst sie (`UPDATE`, `DELETE`). Ein Standard seit den 1970ern, der auf fast allen Datenbanken gleich funktioniert – mit kleinen Varianten pro Produkt.

## <span id="ssh"></span>SSH (Secure Shell)
: **Verschlüsseltes Netzwerkprotokoll für Fernzugriff auf Server.** Standard-Port: 22. Multipass nutzt SSH, um eine Shell in der VM zu öffnen. Man meldet sich mit Benutzername + Passwort oder (besser) mit SSH-Keys an.

## <span id="snapshot"></span>Snapshot
: **Punkt-in-Zeit-Abbild** eines Volumes, einer VM oder einer Datenbank. Erlaubt es, später auf genau diesen Zustand zurückzuspringen. Multipass kennt `multipass snapshot` für VMs; PostgreSQL und Redis können per Konfiguration regelmäßig Snapshots aufs Volume schreiben. **Achtung:** Snapshots ersetzen kein Backup – sie liegen meist auf demselben Storage und gehen mit ihm mit unter.

## <span id="sha"></span><span id="sha-256"></span>SHA / SHA-256
: **Kryptografische Hash-Funktionen**, die aus beliebigem Input einen festen Fingerabdruck erzeugen. SHA-256 erzeugt einen 256-Bit-Hash (64 Hex-Zeichen). Docker identifiziert Image- und Layer-Inhalte über SHA-256-Hashes – das ist die [Image-ID](#image-id). Wenn sich auch nur ein Byte ändert, ist der Hash komplett anders. Damit ist Manipulation an einem Image sofort erkennbar.

## <span id="ssd"></span>SSD (Solid State Drive)
: **Flash-basierte Festplatte ohne bewegliche Teile.** Deutlich schneller als eine HDD (oft Faktor 10–50) und robuster gegen Stöße. Heute Standard in Laptops und Servern. Für Docker relevant, weil Image-Pulls, Container-Starts und Build-Caches stark von der Disk-IO profitieren – auf einer SSD werden viele Operationen erst angenehm schnell.

## <span id="static-analysis"></span><span id="statische-analyse"></span>Static Analysis (Statische Code-Analyse)
: **Untersuchung von Quellcode ohne ihn auszuführen.** Oberbegriff für [Linter](#linter), [Formatter](#formatter), [Type-Checker](#type-checker) und Security-Scanner. Static Analysis findet typische Probleme früh und billig. Ein Editor-Hinweis ist günstiger als ein roter Test in der CI und der wiederum günstiger als ein Bug in Produktion. In CI-Pipelines steht Static Analysis meistens vor den Tests: zuerst sieht der Code überhaupt sauber aus, dann läuft er.

## <span id="stack"></span>Stack
: **Verbund aus mehreren Containern, die gemeinsam eine Anwendung bilden** – z.B. Web-App + Datenbank + Cache + Reverse Proxy. Im Compose-Kontext ist ein Stack alles, was in einer `compose.yaml` (oder einer Kombination aus `compose.yaml` und Override-Dateien) zusammen beschrieben wird. `docker compose up -d` startet einen Stack, `docker compose down` baut ihn ab. In Docker Swarm bekommt der Begriff einen formelleren Namen: dort verteilt `docker stack deploy` einen Stack auf mehrere Knoten. Der zentrale Gedanke: **ein Stack hat einen klar abgegrenzten Lebenszyklus** – startet, läuft, hört zusammen wieder auf.

## <span id="squash"></span><span id="squash-merge"></span>Squash / Squash-Merge
: **Variante des Mergens, bei der alle Commits eines Branches zu einem einzigen zusammengefasst werden.** Statt eines Merge-Commits mit zwei Eltern (klassischer Merge) entsteht ein einzelner neuer Commit auf dem Ziel-Branch, der alle Änderungen des Feature-Branches enthält. Die ursprüngliche Commit-Historie des Feature-Branches geht dabei verloren.

    **Wann sinnvoll?** Bei langen Feature-Branches mit vielen kleinen „WIP"-Commits, die in `main` nicht hilfreich sind. Auf GitHub wählst du das beim Mergen eines Pull Requests unter **„Squash and merge"**.

    **Nachteil:** Nach dem Squash-Merge erkennt Git den Feature-Branch nicht mehr als „vollständig gemergt" über seine Commits – `git branch -d` lehnt das Löschen ab, du brauchst `git branch -D`. Auch lässt sich ein einzelner Bug nicht mehr auf einen feineren Commit zurückführen.

## <span id="stage"></span><span id="build-stage"></span>Stage / Build-Stage
: **Eine `FROM`-Stufe in einem Multi-Stage-Dockerfile.** Jeder Multi-Stage-Build hat mindestens zwei Stages: eine **Build-Stage** (mit Compilern, Tools), die nur Artefakte erzeugt und eine **Runtime-Stage**, die nur das fertige Artefakt enthält. Stages werden mit `FROM image AS name` benannt; spätere Stages kopieren Ergebnisse mit `COPY --from=name`. So wird das finale Image klein – die Build-Tools landen nicht mit drin. Siehe [Multi-Stage-Build](#multi-stage-build).

## <span id="subnet"></span><span id="subnetz"></span>Subnetz / Subnet
: **Bereich von IP-Adressen, die zum gleichen Netzwerk gehören.** Schreibweise z.B. `172.17.0.0/16` – das sind alle Adressen `172.17.*.*`. Docker-Netzwerke bekommen jeweils ein eigenes Subnetz, damit Container-IPs eindeutig sind. Zuhause hast du meist `192.168.1.0/24`.

## <span id="sudo"></span>sudo
: **Unix/Linux-Befehl**, mit dem du einen anderen Befehl mit Administrator-Rechten (root) ausführst. Beispiel: `sudo apt update` – normale User dürfen keine Paketlisten aktualisieren, mit `sudo` schon. Meistens fragt sudo einmal nach deinem Passwort und merkt sich das für ein paar Minuten. Auf macOS und den meisten Linux-Distributionen Standard. Innerhalb von Docker-Containern oft nicht nötig, weil der Container-Prozess häufig schon als root läuft.

## <span id="swarm"></span>Swarm (Docker Swarm)
: **Dockers eigene, einfache Container-Orchestrierung.** Aus dem Docker-Daemon heraus aktivierbar (`docker swarm init`), versteht direkt `compose.yaml`-ähnliche Stacks, verteilt Services auf mehrere Hosts. Funktional weniger mächtig als Kubernetes, aber deutlich einfacher zu betreiben. In den meisten neuen Projekten wird heute zu Kubernetes gegriffen – Swarm ist trotzdem im Docker-Engine-Funktionsumfang vorhanden und für kleinere Setups eine valide Wahl.

## <span id="systemd"></span>systemd
: **Moderner Linux-Init-Manager und Service-Manager.** Startet, stoppt und überwacht Systemdienste. Auf systemd-Systemen verwaltest du den Docker-Daemon mit `sudo systemctl {start|stop|restart|status} docker`. Default in den meisten heutigen Linux-Distributionen (Ubuntu, Debian, Fedora, RHEL, openSUSE, Arch).

## <span id="tag"></span>Tag
: **Versions- oder Varianten-Bezeichner eines Images**, hinter dem Doppelpunkt. Beispiel: `nginx:1.27.3`, `nginx:alpine`, `nginx:latest`. Tags sind nicht unveränderlich – der Publisher kann sie jederzeit auf andere Inhalte umbiegen, deshalb ist `:latest` in Produktion ein Anti-Pattern.

## <span id="tls"></span><span id="ssl"></span>TLS / SSL (Transport Layer Security)
: **Verschlüsselung für Netzwerkverbindungen.** TLS 1.2 und 1.3 sind heute Standard. „SSL" ist der historische Name (SSL 3.0 war der Vorgänger), wird aber im Sprachgebrauch oft synonym verwendet. HTTPS = HTTP über TLS. Im Container-Kontext wird TLS oft am Reverse Proxy (nginx, Traefik) terminiert; die Backend-Container kommunizieren intern unverschlüsselt im privaten Docker-Netz.

## <span id="tcp"></span>TCP (Transmission Control Protocol)
: **Zuverlässiges Netzwerkprotokoll**, das Pakete in der richtigen Reihenfolge und ohne Verluste zustellt. Grundlage für HTTP, HTTPS, SSH, SMTP und viele andere. TCP sorgt dafür, dass eine Verbindung aufgebaut wird und Pakete bei Verlust nochmal geschickt werden – Preis dafür ist etwas Overhead.

## <span id="trigger"></span><span id="ci-trigger"></span>Trigger (CI/CD)
: **Ereignis, das eine Pipeline auslöst.** Typische Trigger: ein **Push** in einen Branch, ein **Pull-Request**, ein **Tag** (z.B. `v1.4.2`), ein **Cron-Schedule** (täglich 3 Uhr) oder ein **manueller Knopf** (`workflow_dispatch`). In GitHub Actions stehen Trigger im `on:`-Block der Workflow-Datei. Mehrere Trigger lassen sich kombinieren – ein Workflow kann z.B. bei Push **und** PR **und** auf manuellen Knopfdruck laufen.

## <span id="trivy"></span>Trivy
: **Open-Source-Scanner für Docker-Images** (und mehr). Prüft Images auf bekannte Sicherheitslücken (CVEs) in Systempaketen und Anwendungsabhängigkeiten. Standard-Werkzeug in CI/CD-Pipelines für Security-Gating: `trivy image nginx:1.27.3`.

## <span id="type-checker"></span><span id="type-check"></span>Type-Checker / Type-Check
: **Werkzeug, das Datentypen im Code prüft, ohne ihn auszuführen.** Bei statisch typisierten Sprachen (Java, Go, Rust) ist das Teil des Compilers. Bei dynamisch typisierten Sprachen kommt der Type-Checker als eigenes Werkzeug obendrauf: `mypy` für Python, `tsc` für TypeScript. Ein guter Type-Check fängt eine ganze Klasse von Fehlern (vertippt, falscher Datentyp, vergessenes Argument) noch vor dem ersten Test ab. Gehört zur [Static Analysis](#static-analysis).

## <span id="typ-1-hypervisor"></span>Typ-1-Hypervisor
: **„Bare-Metal"-Hypervisor**, der direkt auf der Hardware läuft. Beispiele: ESXi, KVM, Xen. Typisch in Rechenzentren und Clouds. Kein Host-OS nötig, alle Ressourcen direkt verwaltet.

## <span id="typ-2-hypervisor"></span>Typ-2-Hypervisor
: **„Hosted"-Hypervisor**, der als Anwendung im Host-OS läuft. Beispiele: VirtualBox, UTM, VMware Workstation/Fusion, Parallels. Typisch auf Entwicklerrechnern und in Schulungen.

## <span id="udp"></span>UDP (User Datagram Protocol)
: **Verbindungsloses Netzwerkprotokoll** – sendet Pakete einfach ab, ohne Bestätigung. Schneller als TCP, aber unzuverlässig. Wird für Streaming, DNS-Anfragen, Spiele und andere zeitkritische Dinge genutzt.

## <span id="uefi"></span>UEFI (Unified Extensible Firmware Interface)
: **Moderne Nachfolge-Technologie von BIOS** – Firmware, die beim Start einer Maschine (oder VM) ausgeführt wird. Schneller, flexibler, sicherer (Secure Boot). Die meisten PCs und Macs ab ca. 2010 nutzen UEFI, auch wenn sie es oft noch „BIOS" nennen.

## <span id="umgebungsvariable"></span><span id="umgebungsvariablen"></span>Umgebungsvariable / Environment Variable
: **Eine Variable**, die einem Prozess beim Start übergeben wird und während seiner Laufzeit verfügbar ist. Beispiele: `PATH`, `HOME`, `DATABASE_URL`, `LOG_LEVEL`. In Docker Standard-Weg für Konfiguration: `docker run -e DB_HOST=postgres myapp`. Kann auch aus Dateien kommen (`--env-file`) oder im Dockerfile vorbelegt werden (`ENV`).

## <span id="upstream"></span><span id="upstream-branch"></span>Upstream (Git)
: **Der Remote-Branch, mit dem dein lokaler Branch verknüpft ist.** Wenn du `git push -u origin main` machst, setzt das `-u` (kurz für `--set-upstream`) die Verknüpfung: ab dann weiß dein lokaler `main`, dass `origin/main` sein Upstream ist. Beim nächsten Mal reicht `git push` ohne Argumente. Auch `git status` vergleicht deinen Branch mit dem Upstream und zeigt z.B. „Your branch is ahead of 'origin/main' by 2 commits".

    **Begrifflicher Spezialfall:** In Projekten mit **Forks** wird der Begriff doppelt benutzt – das **ursprüngliche Repo** (von dem du geforkt hast) wird oft als Remote namens `upstream` hinzugefügt, damit du Änderungen von dort holen kannst. Dein eigenes Fork-Remote heißt dann `origin`, das Ursprungsrepo `upstream`. Siehe auch [Fork](#fork) und [Origin](#origin).

## <span id="url"></span>URL (Uniform Resource Locator)
: **Eine Web-Adresse**, z.B. `https://beispiel.de`. Besteht aus Schema (`https`), Host (`beispiel.de`), optional Port und Pfad.

## <span id="uvicorn"></span>Uvicorn
: **Schneller ASGI-Server für Python**, mit dem [FastAPI](#fastapi)- und andere asynchrone Web-Apps tatsächlich ausgeführt werden. Übernimmt die Rolle, die `node` für Express oder Gunicorn für Flask spielt: er nimmt HTTP-Anfragen entgegen, ruft die Anwendung auf und schickt die Antwort zurück. Im Container startet man eine FastAPI-App typischerweise mit `uvicorn main:app --host 0.0.0.0 --port 3000`.

## <span id="utm"></span>UTM
: **Freie Virtualisierungs-App für macOS** (auch Apple Silicon), basiert intern auf QEMU. Stark für ARM-native Gäste und exotische Architekturen – kann z.B. einen Raspberry-Pi-Kernel auf dem Mac emulieren.

## <span id="unix-socket"></span>Unix-Socket
: **Datei-ähnlicher Kommunikationskanal** zwischen Prozessen auf demselben Host. Docker-CLI spricht mit dem Docker-Daemon über einen Unix-Socket unter `/var/run/docker.sock`. Schneller und sicherer als TCP – auf Docker Desktop (Mac/Win) wird der Socket aus der internen Linux-VM ans Host-System durchgereicht.

## <span id="vcpu"></span><span id="v-cpu"></span>vCPU
: **Virtuelle CPU**, die einer VM oder einem Container zugewiesen ist. Der Hypervisor teilt die echten CPU-Kerne unter den vCPUs auf. Eine vCPU ist nicht identisch mit einem physischen Kern – zwei vCPUs auf einem 8-Kern-Host können sich zeitlich abwechseln.

## <span id="virtualisierung"></span>Virtualisierung
: **Technik, mit der sich Computer-Ressourcen in Software nachbauen lassen.** Ein physischer Rechner kann dadurch mehrere „virtuelle Computer" (VMs) gleichzeitig betreiben, die sich gegenseitig nicht stören. Virtualisierung löst Probleme wie Isolation, Reproduzierbarkeit und Ressourcenteilung – und ist die Grundlage vieler Cloud-Dienste.

## <span id="virtualization-framework"></span>Virtualization.framework
: **Apples Virtualisierungs-API** seit macOS 11 (Big Sur), optimiert für Apple Silicon. Ersetzt die ältere `HyperKit`-Technologie. Docker Desktop, Multipass, UTM und Parallels nutzen diese Schnittstelle, was die Parallel-Nutzung mehrerer VM-Tools auf dem Mac deutlich stabiler gemacht hat.

## <span id="vm"></span><span id="vms"></span>VM (Virtuelle Maschine)
: **Eine per Software emulierte „Computer-in-Software".** Hat eigene virtuelle Hardware (CPU, RAM, Disk, NIC) und ein eigenes Gast-Betriebssystem samt Kernel. Wird von einem Hypervisor verwaltet. Eine VM ist stark isoliert, braucht aber deutlich mehr Ressourcen als ein Container – jede VM schleppt ihr eigenes OS mit.

## <span id="volume"></span>Volume
: **Persistenter Speicher für Docker-Container.** Überlebt, wenn der Container gelöscht wird und wird von Docker selbst verwaltet (liegt meist unter `/var/lib/docker/volumes/`). Alternative zu Bind Mounts, wenn du von der konkreten Host-Pfad-Struktur unabhängig sein willst. Typischer Einsatz: Datenbank-Dateien.

## <span id="workflow"></span><span id="job"></span><span id="step"></span>Workflow / Job / Step (GitHub Actions)
: **Drei Hierarchie-Begriffe einer GitHub-Actions-Pipeline.**

    - **Workflow** – eine YAML-Datei in `.github/workflows/`, die einen kompletten automatisierten Ablauf beschreibt. Hat einen Namen, Trigger und mindestens einen Job.
    - **Job** – eine geordnete Folge von Steps, die zusammen auf **einer eigenen Runner-VM** laufen. Jobs eines Workflows laufen standardmäßig parallel; mit `needs:` lässt sich eine Reihenfolge erzwingen.
    - **Step** – eine einzelne Aktion innerhalb eines Jobs. Entweder ein Shell-Befehl (`run:`) oder eine vorgefertigte [Action](#github) (`uses:`). Innerhalb eines Jobs laufen Steps strikt sequenziell.

    Andere CI-Systeme nutzen ähnliche Begriffe: GitLab kennt zusätzlich **Stages**, Jenkins **Pipelines** und **Stages**. Die Konzepte sind tool-übergreifend.

## <span id="webhook"></span>Webhook
: **HTTP-Aufruf**, den ein System bei einem definierten Ereignis an eine vorab konfigurierte URL absetzt. GitHub schickt z.B. bei jedem Push einen Webhook an seinen eigenen Actions-Service – das ist der Mechanismus, der Pipelines auslöst. Du kannst Webhooks auch nutzen, um aus eigenem Code andere Systeme zu triggern: Slack-Nachrichten, Build-Server, Monitoring. Typische Form: `POST <URL>` mit JSON-Body, der den Event beschreibt.

## <span id="matrix"></span><span id="matrix-build"></span>Matrix-Build
: **GitHub-Actions-Konstrukt, mit dem ein Job parallel mit mehreren Parametern läuft.** Beispiel: Tests auf Python 3.10, 3.11 und 3.12 gleichzeitig:

    ```yaml
    strategy:
      matrix:
        python: ["3.10", "3.11", "3.12"]
    ```

    Jede Kombination erzeugt einen eigenen Sub-Job mit eigenem Runner. Wichtig vor allem für **Bibliotheken**, die mehrere Versions-Kombinationen unterstützen müssen. Bei Anwendungs-Pipelines selten nötig, weil dort meist nur eine Ziel-Plattform produktiv läuft.

## <span id="watch"></span><span id="compose-watch"></span>watch (Compose Watch-Mode)
: **Compose-Funktion seit Version v2.22 (Oktober 2023)**, die Dateien auf dem Host beobachtet und Änderungen **automatisch** in den laufenden Stack einarbeitet. Im `services:`-Block beschreibt der Schlüssel `develop.watch:` Aktionen wie `sync` (Datei in den Container synchronisieren), `rebuild` (Image neu bauen) oder `sync+restart` (synchronisieren und Container neu starten). Gestartet mit `docker compose watch`. Sehr nützlich für iterative Entwicklung – ähnlich wie ein Live-Reload-Tool, aber direkt in der Compose-Welt verankert. Ersetzt im Alltag oft Bind Mounts mit File-Watchern wie `nodemon` oder `flask --debug`.

## <span id="wordpress"></span>WordPress
: **Das mit Abstand am weitesten verbreitete Content-Management-System (CMS) für Websites** – läuft auf einem signifikanten Teil aller öffentlich erreichbaren Webseiten. Technisch eine PHP-Anwendung, die eine relationale Datenbank (MySQL oder MariaDB) braucht. WordPress ist deshalb ein klassischer Compose-Anwendungsfall: ein App-Container (`wordpress:latest`) plus ein DB-Container (`mariadb:11` oder `mysql:8`) plus persistente Volumes für Datenbank-Inhalte und das `wp-content/`-Verzeichnis (Themes, Plugins, Uploads). Im Kurs taucht WordPress in den Compose-Übungen 4.3 und 4.5 auf.

## <span id="wsl"></span><span id="wsl2"></span><span id="wsl-2"></span>WSL / WSL2 (Windows Subsystem for Linux 2)
: **Microsofts Linux-Runtime auf Windows.** Die ältere Variante **WSL** (auch „WSL1") übersetzte Linux-Systemcalls auf Windows – funktional, aber langsam. **WSL2** ist eine hochoptimierte Hyper-V-VM mit einem echten Linux-Kernel von Microsoft (ca. 100 MB) und ist seit 2020 Standard. Grundlage für Docker Desktop auf Windows – der Docker-Daemon läuft in WSL2, nicht direkt in Windows.

## <span id="xargs"></span>xargs
: **Unix-Befehl**, der Ausgaben in Argumente für einen anderen Befehl umwandelt. Klassische Nutzung mit Pipe: `docker ps -aq | xargs docker rm -f`. `docker ps -aq` liefert eine Liste von Container-IDs (eine pro Zeile), `xargs` nimmt sie und hängt sie als Argumente an `docker rm -f` an – das löscht alle Container in einem Rutsch. Windows PowerShell hat ein anderes Muster, meist mit `@(...)` oder `ForEach-Object`.

## <span id="x86-64"></span><span id="x86"></span><span id="amd64"></span>x86 / x86_64 / amd64
: **Klassische Intel/AMD-Prozessorarchitektur.** Der Begriff `x86` bezeichnet die 32-Bit-Familie ab dem Intel 80386, `x86_64` (auch `amd64`) die 64-Bit-Variante – heute Standard auf den meisten Servern, älteren Macs und vielen Laptops. Apple Silicon (M-Chips) und viele mobile Geräte nutzen stattdessen ARM. Bei Docker-Images sieht man `amd64` als Architektur-Tag; `x86_64` und `amd64` meinen exakt dasselbe.

## <span id="yaml"></span>YAML (YAML Ain't Markup Language)
: **Menschenlesbares Datenformat.** Wird in MkDocs-Konfigurationen (`mkdocs.yml`), GitHub Actions (`deploy.yml`), Docker Compose und Kubernetes-Manifesten verwendet. Wichtig: keine Tabs, nur Leerzeichen für die Einrückung – YAML ist sehr pingelig mit Syntax.

## <span id="zsh"></span>Zsh (Z shell)
: **Erweiterte Shell**, die seit macOS Catalina (2019) Standard ist. Rückwärtskompatibel zu Bash, mit mehr Komfort (Tab-Completion, Themes wie Oh My Zsh). Auf modernen Macs öffnet ein neues Terminal direkt eine Zsh-Shell. Für unsere Docker-Befehle ist der Unterschied zu Bash unerheblich.

---

## Noch was unklar?

Wenn dir ein Begriff fehlt, sag mir Bescheid – oder nutze die **Suche** oben rechts, um das betreffende Kapitel zu finden. Im Zweifelsfall: [Virtualisierung](virtualisierung/index.md) und [Docker](docker/index.md) sind die Hauptblöcke, dort steht alles ausführlich im Kontext.
