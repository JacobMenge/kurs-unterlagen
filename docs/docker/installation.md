---
title: "Docker installieren"
description: "Schritt-für-Schritt-Installation von Docker auf Windows 11, macOS und Linux – mit offiziellen Links, Systemanforderungen, Fallstricken und Troubleshooting."
---

# Docker installieren

!!! abstract "Ziel dieser Seite"
    Nach dieser Seite hast du:

    - Docker auf deinem Rechner installiert
    - überprüft, dass `docker version` und `docker run hello-world` sauber laufen
    - verstanden, welche Fallstricke es pro Betriebssystem gibt
    - einen Plan B in der Hinterhand, falls Docker Desktop nicht läuft (oder aus Lizenzgründen nicht darf)

!!! warning "Bevor du loslegst"
    Schließe am besten andere VM-Tools (VirtualBox, VMware Fusion, Parallels), während Docker sich einrichtet. Einige Virtualisierungsschichten streiten sich gern, das sparst du dir so.

---

## Welche Docker-Variante brauche ich?

Docker ist kein einzelnes Produkt. Es gibt im Wesentlichen drei Wege, Docker auf deinen Rechner zu bekommen:

| Variante | Für wen | Besonderheit |
|----------|---------|--------------|
| **Docker Desktop** | Mac, Windows, auch Linux mit GUI | Das "Rundum-sorglos-Paket". GUI, automatische Updates, Kubernetes integriert. **Lizenzpflicht** für größere Firmen (siehe unten). |
| **Docker Engine** | Linux (Server und Workstation) | Pure CLI, keine GUI. Kostenfrei. Standard auf Produktions-Servern. |
| **Alternative Runtimes** | Wenn Docker Desktop aus Lizenzgründen nicht geht | Colima, OrbStack, Podman Desktop, Rancher Desktop. CLI bleibt `docker`, aber die Engine dahinter ist eine andere. |

Für den Kurs empfehle ich:

- **Windows 11 / macOS:** Docker Desktop (einfachste Installation, bestes Zusammenspiel mit dem heutigen Stoff).
- **Linux:** Docker Engine direkt.
- **Firmenlaptop mit Lizenz-Problem:** Abschnitt „Alternativen" weiter unten.

---

## Docker-Desktop-Lizenz – kurz, aber wichtig

Docker Desktop ist **für Privatpersonen, Bildung, kleinere Firmen und Open-Source-Arbeit kostenlos**. Aber seit 2022 gilt:

!!! warning "Lizenzpflicht für größere Unternehmen"
    Nutzt **eine Firma mit mehr als 250 Mitarbeitenden oder mehr als 10 Mio USD Jahresumsatz** Docker Desktop, braucht diese Firma eine **kostenpflichtige Lizenz**: „Pro", „Team" oder „Business".

    Die Lizenzpflicht betrifft **Docker Desktop** – nicht die Docker Engine auf Linux und **nicht** die Alternativen Colima, Podman, Rancher Desktop.

    Wenn du nicht sicher bist, ob dein Arbeitgeber eine Lizenz hat: **frag kurz nach**, bevor du installierst. Für den heutigen Kurs auf deinem eigenen Laptop ist das in fast allen Fällen irrelevant.

    Aktuelle Lizenzdetails: <https://www.docker.com/pricing/>

---

## Installation auf Windows 11

!!! info "Systemanforderungen Windows"
    - **Windows 11** (mindestens Version 23H2, Build 22631) oder **Windows 10 64-Bit** ab Version 22H2 (Build 19045)
    - **WSL2-Funktion** mit WSL Version **2.1.5 oder neuer** (Docker Desktop aktiviert das während der Installation, wenn nicht vorhanden)
    - **Hardware-Virtualisierung im BIOS/UEFI** aktiviert (Intel VT-x oder AMD-V), zusätzlich **SLAT-fähige 64-Bit-CPU**
    - **Mindestens 4 GB RAM**, empfohlen 8 GB oder mehr
    - **Ca. 2 GB freier Plattenplatz** für Docker Desktop selbst, dazu Raum für Images
    - **Editionen**: offiziell unterstützt sind Pro / Enterprise / Education. **Home** funktioniert in der Praxis ebenfalls über WSL2 – Docker dokumentiert das nicht als „supported", in den meisten Fällen klappt es aber problemlos.

### Schritt 1 – Vorbereitung prüfen

??? note "Hardware-Virtualisierung im BIOS prüfen (meistens schon aktiv)"
    Öffne den **Task-Manager** (Strg + Shift + Esc), gehe auf den Tab **Leistung** → **CPU**. Rechts unten steht „Virtualisierung: Aktiviert" oder „Deaktiviert".

    Ist sie deaktiviert:

    1. Rechner neu starten, ins BIOS/UEFI gehen (meist F2, F10, Entf beim Booten – je nach Hersteller).
    2. Nach „Virtualization Technology", „VT-x", „SVM Mode" oder „AMD-V" suchen.
    3. Aktivieren, speichern, neu starten.

    Ohne aktivierte Hardware-Virtualisierung läuft weder Docker Desktop noch eine VM.

### Schritt 2 – WSL2 einrichten (empfohlener Weg)

Docker Desktop nutzt unter Windows standardmäßig **WSL2**, das Microsoft Windows Subsystem for Linux. Das ist die schnellste und reibungsärmste Variante. WSL2 installiert sich mit einem einzigen Befehl – als Admin-PowerShell öffnen (Rechtsklick auf das Start-Menü → „Terminal (Admin)"), dann:

```powershell
wsl --install
```

Danach Windows neu starten, wenn gefordert.

??? info "Was passiert bei `wsl --install`?"
    Dieser Befehl aktiviert die Windows-Features „Virtual Machine Platform" und „Windows Subsystem for Linux" und installiert standardmäßig Ubuntu als Linux-Distribution. Für Docker Desktop brauchst du die Ubuntu-Distribution nicht zwingend – es reicht, dass WSL2 selbst vorhanden ist. Wenn du Ubuntu später nicht nutzen willst, kannst du es einfach stehen lassen oder mit `wsl --unregister Ubuntu` entfernen.

??? warning "Fehler bei `wsl --install`? Ältere Windows-Version?"
    Falls der Befehl „Hilfe anzeigen" statt einer Installation ausführt, ist dein Windows zu alt. Dann:

    1. **Windows-Version prüfen**: `Einstellungen → System → Info → Windows-Spezifikationen`. Du brauchst mindestens **Windows 10 Version 22H2** oder **Windows 11** (jede Version).
    2. **Windows Update** durchführen, bis die Version passt.
    3. Alternativer manueller Weg: WSL2-Kernel-Update von Microsoft laden: <https://learn.microsoft.com/windows/wsl/install-manual>

    Das **WSL2-Kernel-Update** ist ein **echter Linux-Kernel von Microsoft** (ca. 100 MB), der neben deinem Windows-Kernel läuft – aber nur, wenn WSL2 aktiv genutzt wird. Verwechsle ihn nicht mit deinem Windows-Kernel.

    **Bei Firmen-Proxy**: das Update kommt direkt von Microsoft-Servern. Falls der Download scheitert, bitte deine IT, `aka.ms` und `microsoft.com` in die Proxy-Whitelist aufzunehmen.

### Schritt 3 – Docker Desktop herunterladen

**Download:** <https://www.docker.com/products/docker-desktop/>

Wähle „Download for Windows – AMD64" (für normale Intel-/AMD-PCs) oder „Windows – ARM64" (nur für Windows-Rechner mit ARM-Prozessor, z.B. manche Surface-Modelle).

### Schritt 4 – Docker Desktop installieren

1. Doppelklick auf die heruntergeladene `Docker Desktop Installer.exe`.
2. Den Haken bei **„Use WSL 2 instead of Hyper-V (recommended)"** aktiviert lassen.
3. Installation durchlaufen lassen, Rechner gegebenenfalls neu starten.
4. Docker Desktop starten. Beim ersten Start:
    - Nutzungsbedingungen akzeptieren (beachte die Lizenz-Hinweise oben).
    - Optional einen Docker-Account verknüpfen (nicht nötig für unseren Kurs).

### Schritt 5 – Funktion prüfen

PowerShell oder Terminal öffnen (**kein** Admin nötig):

```powershell
docker version
```

Du solltest Blöcke für „Client" und „Server" sehen, jeweils mit Versionsnummer.

Ein erster Test:

```powershell
docker run hello-world
```

Wenn die Begrüßung erscheint, läuft alles.

### Typische Probleme auf Windows 11

??? danger "„WSL 2 installation is incomplete"-Fehler beim Start"
    Docker Desktop meldet, dass WSL 2 nicht vollständig ist. Meist fehlt das Linux-Kernel-Update.

    **Lösung:**

    1. Kernel-Update manuell laden: <https://aka.ms/wsl2kernel>
    2. Installieren, Rechner neu starten.
    3. Docker Desktop erneut starten.

??? danger "„The virtual machine could not be started"-Fehler"
    Meist ein Konflikt mit anderen Hypervisoren oder abgeschaltete Hardware-Virtualisierung.

    **Lösungsansätze in der Reihenfolge:**

    1. BIOS-Virtualisierung prüfen (siehe oben im Schritt 1).
    2. Andere Virtualisierungs-Apps (VirtualBox, VMware, Hyper-V Server-Rolle) beenden oder deinstallieren.
    3. **Windows-Feature „Hyper-V"** in den Windows-Features *aktiviert* haben – WSL2 setzt darauf auf. Unter **Systemsteuerung → Programme → Windows-Features aktivieren oder deaktivieren** die Haken bei „Hyper-V", „Virtual Machine Platform" und „Windows Subsystem for Linux" setzen.

??? warning "Windows 11 Home statt Pro – geht Docker trotzdem?"
    **Ja.** Früher brauchte Docker Desktop Hyper-V in der Pro-Edition. Seit der WSL2-Umstellung geht Docker Desktop auch auf Windows 11 Home, weil WSL2 auf Home verfügbar ist.

    Nur *Multipass* benötigt weiterhin die Pro-Edition (Hyper-V). Für den Virtualisierungs-Teil des Kurses auf Home-Windows ist deshalb **VirtualBox** eine gute Alternative.

??? warning "Corporate-Laptop: Proxy, Zertifikate, Gruppenrichtlinien"
    In Firmenumgebungen gibt es oft zusätzliche Hürden:

    - **HTTP-Proxy** für Image-Downloads: In Docker Desktop unter **Settings → Resources → Proxies** eintragen.
    - **Corporate Root CA**: Zertifikat in **Settings → Docker Engine** oder unter WSL2 ins Vertrauen ziehen.
    - **Gruppenrichtlinien**, die WSL2 oder Hyper-V blockieren: Das kannst nur die IT auflösen.

    Sprich im Zweifel mit eurer IT, bevor du dir die Haare raufst.

??? warning "Docker-Befehle im PowerShell funktionieren nicht (Executable not found)"
    Docker Desktop war noch nicht (oder nicht vollständig) gestartet, als du das Terminal aufgemacht hast. Erst Docker Desktop öffnen, auf „Engine running" warten, dann ein **neues** Terminal-Fenster – der PATH wird erst beim Öffnen gesetzt.

---

## Installation auf macOS

!!! info "Systemanforderungen macOS"
    - **macOS 13.3 (Ventura) oder neuer** – Docker unterstützt offiziell die aktuelle und die zwei vorherigen macOS-Major-Versionen. Ältere macOS-Versionen werden mit Stand 2026 nicht mehr unterstützt.
    - **Apple Silicon (M1/M2/M3/M4)**: Rosetta 2 ist für die meisten Workflows **nicht mehr zwingend nötig**, kann aber für x86_64-Images sinnvoll sein (siehe Schritt 2).
    - **Mindestens 4 GB RAM**, empfohlen 8 GB oder mehr
    - **Ca. 2 GB Disk** für Docker Desktop plus Raum für Images

### Schritt 1 – Richtige Variante wählen

**Download:** <https://www.docker.com/products/docker-desktop/>

Zwei Varianten stehen zur Wahl:

- **Mac with Apple Chip** – für M1, M2, M3, M4 (alle Macs ab ca. 2020).
- **Mac with Intel Chip** – für ältere Macs mit Intel-Prozessor.

Wenn du unsicher bist: **Apfel-Menü → Über diesen Mac**. Steht dort „Apple M…" → Apple Chip. Steht „Intel" → Intel Chip.

??? danger "Falsche Variante heruntergeladen?"
    Docker Desktop verweigert den Start mit einer etwas kryptischen Fehlermeldung, wenn du die falsche Architektur gewählt hast. Einfach die richtige Version runterladen und drüberinstallieren.

### Schritt 2 – Rosetta 2 installieren (nur Apple Silicon)

Rosetta 2 ist Apples Übersetzer für x86_64-Software. Viele Docker-Images gibt es **nur** in x86_64-Version – ohne Rosetta 2 musst du bei jedem solchen Image einen Emulations-Workaround fahren.

```bash
softwareupdate --install-rosetta --agree-to-license
```

Wenn Rosetta schon installiert ist: kein Schaden, die Meldung sagt es dir.

??? info "Was genau macht Rosetta 2?"
    Rosetta 2 übersetzt x86_64-Befehle in ARM64-Befehle, die der Apple-Silicon-Chip versteht. Docker Desktop nutzt ab Version 4.25 eine optimierte Rosetta-Integration (sichtbar unter **Settings → Features in development → Use Rosetta for x86_64/amd64 emulation on Apple Silicon**), die deutlich schneller ist als die klassische Emulation per QEMU.

### Schritt 3 – Docker Desktop installieren

1. `.dmg`-Datei doppelklicken.
2. Das Docker-Symbol in den Programme-Ordner ziehen.
3. Im Programme-Ordner „Docker" doppelklicken – beim ersten Start fragt macOS, ob das Programm wirklich geöffnet werden soll (Programme aus dem Internet), mit **Öffnen** bestätigen.
4. Docker fragt nach Admin-Rechten, um ein paar Helper-Tools zu installieren – zustimmen.

### Schritt 4 – Grund-Einstellungen vornehmen

Nach dem Start öffnet sich das Docker-Dashboard. **Unbedingt einmal durchschauen:**

- **Settings → General:** Autostart beim Login aktivieren, wenn du Docker oft nutzt.
- **Settings → Resources → Advanced:** Standardmäßig bekommt Docker 2 GB RAM und 2 CPUs. Für ernsthafte Arbeit dreh auf **4 GB RAM, 4 CPUs** hoch.
- **Settings → Resources → File sharing:** Standardmäßig sind `~` und `/Users` freigegeben. Für Bind Mounts später musst du hier eventuell Verzeichnisse ergänzen.
- **Settings → Features in development:** Wenn du Apple Silicon hast, aktiviere „Use Rosetta for x86_64/amd64 emulation on Apple Silicon" – macht x86_64-Container merklich schneller.

### Schritt 5 – Funktion prüfen

Terminal öffnen, dann:

```bash
docker version
docker run hello-world
```

Läuft beides ohne Fehler, ist Docker einsatzbereit.

### Typische Probleme auf macOS

??? danger "„Docker.app kann nicht geöffnet werden, da es aus einer nicht verifizierten Quelle stammt"-Fehler"
    Passiert gelegentlich bei heruntergeladenen DMGs. Lösung:

    1. **Systemeinstellungen → Datenschutz & Sicherheit** öffnen.
    2. Ganz unten steht „Docker.app wurde am Öffnen gehindert …" mit Button **Dennoch öffnen**.
    3. Klicken, bestätigen.

??? warning "Docker-Container sind langsam auf Apple Silicon"
    Meistens liegt das an einer der folgenden Ursachen:

    1. **x86_64-Image auf ARM-Mac**. Der Container muss emuliert werden. Prüfen mit `docker inspect <name> | grep Architecture`. Wenn `amd64` statt `arm64` steht → Image existiert nur in x86_64.
        - Falls es eine ARM-Variante gibt: `docker pull --platform linux/arm64 <image>`
        - Falls nicht: akzeptieren oder Rosetta-Integration in Docker Desktop aktivieren (siehe oben).
    2. **VirtioFS-Performance** bei Bind Mounts. In **Settings → General → File sharing implementation** zwischen VirtioFS (Default, schnell) und osxfs (langsam) wechseln.
    3. **Docker Desktop hat zu wenig RAM**. In den Resource-Settings prüfen.

??? warning "`exec format error` beim Start eines Containers"
    Das Image gibt es nur in einer Architektur, die dein Host nicht nativ ausführt. Typischerweise auf Apple Silicon mit x86_64-Images.

    **Lösung:**

    ```bash
    docker run --platform linux/amd64 <image>
    ```

    Dann wird der Container emuliert (langsamer, aber läuft).

??? warning "Port schon belegt, obwohl ich nichts laufen habe"
    Oft ein Überbleibsel eines zuvor abgestürzten Containers oder ein macOS-Systemdienst.

    ```bash
    lsof -i :8080
    ```

    zeigt, was den Port belegt. Ist es ein Docker-Container, stoppe ihn mit `docker stop <name>`. Ist es ein macOS-Dienst (z.B. der integrierte Webdienst), brauchst du einen anderen Port oder deaktivierst den Dienst.

??? info "Apple-Silicon-Tipp: OrbStack als schnellere Alternative zu Docker Desktop"
    Seit 2023 gibt es [OrbStack](https://orbstack.dev/). Es ist eine Mac-native Alternative zu Docker Desktop mit spürbar schnellerem Start, weniger Ressourcenverbrauch und besserer Battery-Life auf MacBooks. Für Privatanwender kostenfrei, die CLI heißt weiterhin `docker`. Wenn Docker Desktop auf deinem Mac zickt, ist OrbStack einen Versuch wert.

---

## Installation auf Linux (Ubuntu / Debian)

Auf Linux bekommst du Docker **direkt**, ohne Desktop-GUI und ohne umhüllende VM. Das ist **die schnellste und ehrlichste** Docker-Erfahrung.

!!! info "Systemanforderungen Linux"
    - **64-Bit-Kernel**, Version 3.10 oder neuer (alle aktuellen Distributionen erfüllen das).
    - Distribution: Ubuntu 22.04 LTS oder 24.04 LTS, Debian 11 oder 12, Fedora 38+, Rocky/Alma 9+ – offiziell unterstützt.
    - Andere Distributionen gehen auch, mit etwas mehr Handarbeit.

Die folgenden Schritte sind für **Ubuntu/Debian**. Für andere Distributionen findest du die Anleitung hier: <https://docs.docker.com/engine/install/>

### Schritt 1 – Alte Docker-Reste entfernen

Falls du früher eine ältere Docker-Version oder ein Distri-Paket installiert hattest, räume zuerst auf:

```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do
  sudo apt-get remove -y $pkg
done
```

Falls nichts zu entfernen ist, passiert nichts. Daten in `/var/lib/docker` bleiben erhalten.

### Schritt 2 – Docker-Repository hinzufügen

Ubuntu/Debian-Nutzer fahren mit dem offiziellen Docker-Repository am besten. So bekommst du Updates automatisch.

```bash
# Notwendige Tools
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Docker-GPG-Key hinzufügen
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Repository-Quelle hinzufügen
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

!!! tip "Debian statt Ubuntu?"
    In beiden URLs `ubuntu` durch `debian` ersetzen.

### Schritt 3 – Docker installieren

```bash
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Das installiert:

- `docker-ce` – die Docker Engine selbst
- `docker-ce-cli` – das `docker`-Kommando
- `containerd.io` – die Container-Runtime
- `docker-buildx-plugin` – moderner Image-Builder (z.B. für Multi-Arch)
- `docker-compose-plugin` – der Nachfolger von `docker-compose` als Unterkommando `docker compose`

### Schritt 4 – Ohne `sudo` benutzen können

Standardmäßig braucht `docker` root-Rechte. Für den Alltag nimmst du deinen User in die `docker`-Gruppe auf:

```bash
sudo usermod -aG docker $USER
```

!!! warning "Einmal ab- und wieder anmelden"
    Die Gruppenmitgliedschaft greift erst nach einem neuen Login. Entweder ausloggen und einloggen, oder für die aktuelle Shell:

    ```bash
    newgrp docker
    ```

??? warning "Sicherheitshinweis: `docker`-Gruppe = Root-Zugriff"
    Wer in der `docker`-Gruppe ist, kann effektiv Root auf dem Host werden (z.B. indem er einen Container startet, der den ganzen Host mountet). Das ist für einen Entwicklerrechner völlig okay, aber für Mehr-Benutzer-Systeme eine bewusste Entscheidung.

### Schritt 5 – Daemon starten und aktivieren

Der Docker-Daemon sollte bei der Installation schon gestartet und als Systemdienst aktiviert worden sein. Prüfen:

```bash
sudo systemctl status docker
```

Falls er nicht läuft:

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Schritt 6 – Funktion prüfen

```bash
docker version
docker run hello-world
```

Wenn die Begrüßung läuft: fertig. Glückwunsch, du hast Docker Engine auf Linux installiert.

### Fedora / RHEL / Rocky / AlmaLinux – Kurzanleitung

Für RPM-basierte Distributionen nutzt du `dnf` statt `apt`:

```bash
# Alte Versionen entfernen
sudo dnf remove -y docker docker-client docker-client-latest docker-common \
                    docker-latest docker-latest-logrotate docker-logrotate docker-engine

# Offizielles Docker-Repository hinzufügen
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
# Für RHEL/Rocky/AlmaLinux stattdessen:
# sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Docker installieren
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Daemon starten
sudo systemctl enable --now docker
```

Danach wie bei Ubuntu: User in die `docker`-Gruppe aufnehmen (siehe Schritt 4).

!!! warning "SELinux bei Fedora/RHEL"
    Fedora, RHEL und Rocky/AlmaLinux kommen mit **aktivem SELinux**. Bei Bind Mounts musst du den Mount-Pfad mit `:z` (shared) oder `:Z` (private) markieren, sonst blockiert SELinux den Zugriff:

    ```bash
    # FUNKTIONIERT NICHT ohne :z auf SELinux:
    docker run -v $(pwd):/app meine-app

    # Funktioniert:
    docker run -v $(pwd):/app:z meine-app
    ```

    SELinux-Status prüfen: `getenforce` (Permissive oder Enforcing).

### Arch Linux

```bash
sudo pacman -S docker docker-compose docker-buildx
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

### Typische Probleme auf Linux

??? danger "`Cannot connect to the Docker daemon at unix:///var/run/docker.sock`"
    Der Daemon läuft nicht, oder dein User darf nicht auf den Socket.

    **Erst prüfen:** `sudo systemctl status docker`

    - Läuft der Daemon nicht: `sudo systemctl start docker`
    - Läuft er: wahrscheinlich ist dein User nicht in der `docker`-Gruppe. Siehe Schritt 4 oben und denk an den Neu-Login!

??? warning "Ältere Ubuntu-Version oder LTS am Ende des Supports"
    Wenn du auf einer alten Ubuntu-Version bist (18.04, 20.04 nach EOL), lädt das Docker-Repository nicht mehr zuverlässig. Entweder das Betriebssystem aktualisieren oder die offizielle Docker-Doku für ältere Versionen nutzen.

??? warning "Fehler „conflict: unable to remove repository reference"
    Wenn du nach längerer Nutzung Plattenplatz zurückholen willst und `docker rmi` verweigert wird, weil ein Container das Image noch referenziert:

    ```bash
    docker ps -a                 # zeigt alle Container
    docker rm $(docker ps -aq)   # entfernt alle Container
    docker rmi <image-id>        # jetzt geht das Image auch weg
    ```

??? info "Rootless Docker auf Linux"
    Für Entwickler, die ohne `docker`-Gruppe arbeiten wollen, gibt es seit Docker 20.10 einen rootless-Modus (Docker läuft komplett im User-Space). Setup ist aber fummelig; für den heutigen Einstieg empfehle ich den klassischen Weg oben. Doku: <https://docs.docker.com/engine/security/rootless/>

---

## Alternativen zu Docker Desktop

Falls du Docker Desktop nicht installieren kannst oder willst (Lizenz, Performance, Vorliebe), hier die wichtigsten Alternativen. **Die CLI bleibt jeweils `docker` – nur die Engine darunter ist anders.**

??? info "OrbStack (macOS) – schnell und Mac-nativ"
    <https://orbstack.dev/>

    - Nur für macOS.
    - Frei für Privatgebrauch, kostenpflichtig für größere kommerzielle Nutzung.
    - Spürbar schneller und sparsamer als Docker Desktop, besonders auf Apple Silicon.
    - Installation: DMG laden, in den Programme-Ordner ziehen, starten.
    - Der Befehl `docker` funktioniert danach wie gewohnt.

??? info "Colima (macOS, Linux) – Open Source, CLI-first"
    <https://github.com/abiosoft/colima>

    - Open Source, schlanke CLI-Lösung auf Basis von Lima (Mac-VM für Linux) und containerd.
    - Installation auf Mac: `brew install colima`
    - Start: `colima start`
    - Danach `docker`-Befehle wie gewohnt.
    - Keine GUI – für Terminal-Menschen perfekt, für GUI-Freunde nicht die erste Wahl.

??? info "Podman Desktop – Red Hats Alternative"
    <https://podman-desktop.io/>

    - Cross-Platform (Mac, Windows, Linux).
    - Open Source.
    - Nutzt Podman als Runtime; Container laufen ohne zentralen Daemon.
    - Alias für `docker`-Befehle möglich: `alias docker=podman`

??? info "Rancher Desktop – K8s built-in"
    <https://rancherdesktop.io/>

    - Open Source, SUSE.
    - Bringt Kubernetes direkt mit, wenn man das braucht.
    - Basierend auf `containerd` oder `dockerd` (umschaltbar).

!!! tip "Welche Alternative für wen?"
    - **Mac-Entwickler mit Performance-Ansprüchen und ohne Lizenz-Bedenken:** OrbStack
    - **Mac/Linux-Minimalisten:** Colima
    - **Firmen mit strengen Lizenz-Vorgaben:** Podman Desktop oder Rancher Desktop
    - **Kubernetes-Lernende:** Rancher Desktop

    Für diesen Kurs ist jede dieser Alternativen fein – alle verstehen `docker run`, `docker build`, `docker ps` usw.

---

## Verifikations-Checkliste

Wenn du hier angekommen bist, solltest du:

- [x] `docker version` liefert ohne Fehler Client- und Server-Block
- [x] `docker run hello-world` gibt die Begrüßungsmeldung aus
- [x] `docker ps -a` zeigt den gerade beendeten `hello-world`-Container
- [x] (nur Linux) `docker`-Befehl funktioniert **ohne** `sudo`

Hakt es irgendwo? Das entsprechende Abschnitt-Troubleshooting oben durchgehen, oder sich auf der Seite [Stolpersteine](stolpersteine.md) umsehen.

---

## Danach weiterlesen

- [Erste Schritte mit Docker](erste-schritte.md) – die ersten Container starten
- [Dockerfile – Grundlagen](dockerfile-grundlagen.md) – eigene Images bauen
- [Stolpersteine](stolpersteine.md) – wenn es doch mal hakt
