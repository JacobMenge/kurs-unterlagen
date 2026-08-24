*[VM]: Virtuelle Maschine – ein per Software emulierter Computer mit eigenem Gast-Betriebssystem
*[VMs]: Virtuelle Maschinen (Plural)
*[OS]: Operating System – Betriebssystem (z.B. Linux, macOS, Windows)
*[API]: Application Programming Interface – definierte Schnittstelle, über die Programme miteinander reden
*[APIs]: Application Programming Interfaces (Plural)
*[CLI]: Command-Line Interface – textbasierte Bedienung über die Kommandozeile
*[GUI]: Graphical User Interface – grafische Benutzeroberfläche
*[CVE]: Common Vulnerabilities and Exposures – öffentlich bekannte Sicherheitslücke mit eindeutiger ID
*[SHA-256]: Kryptografische Hashfunktion – erzeugt einen 256-Bit-Fingerabdruck eines Inhalts
*[SHA]: Secure Hash Algorithm – Familie kryptografischer Hashfunktionen (SHA-1, SHA-256, …)
*[GPG]: GNU Privacy Guard – Open-Source-Implementierung von OpenPGP für Signaturen und Verschlüsselung
*[TLS]: Transport Layer Security – Verschlüsselung für Netzwerkprotokolle (z.B. HTTPS)
*[SSL]: Secure Sockets Layer – Vorgänger von TLS, der Begriff wird oft synonym genutzt
*[RAM]: Random Access Memory – Arbeitsspeicher
*[CPU]: Central Processing Unit – Prozessor
*[vCPU]: Virtual CPU – virtualisierte Prozessoreinheit
*[NIC]: Network Interface Card – Netzwerkkarte (physisch oder virtuell)
*[SSH]: Secure Shell – verschlüsseltes Netzwerkprotokoll für Fernzugriff auf Server
*[LTS]: Long Term Support – langzeitgepflegte Software-Version (z.B. Ubuntu 22.04 LTS)
*[KVM]: Kernel-based Virtual Machine – Virtualisierungslösung des Linux-Kernels
*[QEMU]: Quick Emulator – quelloffener Maschinen-Emulator
*[HVF]: Hypervisor Framework – Apples Virtualisierungs-API auf macOS
*[WSL]: Windows Subsystem for Linux – Microsofts Linux-Laufzeit unter Windows
*[WSL2]: Windows Subsystem for Linux 2 – optimierte WSL-Version mit echtem Linux-Kernel
*[ESXi]: VMware ESXi – Typ-1-Hypervisor von VMware
*[UTM]: UTM Virtual Machines – freie Virtualisierungs-App für macOS
*[ARM]: Advanced RISC Machines – Prozessorarchitektur (z.B. Apple Silicon)
*[x86]: x86-Architektur – klassische Intel/AMD-Prozessorarchitektur
*[x86_64]: 64-Bit-Variante der x86-Architektur (auch "amd64")
*[amd64]: 64-Bit-Intel/AMD-Architektur, Synonym für x86_64
*[HTTP]: Hypertext Transfer Protocol – Protokoll für Webseiten-Übertragung
*[HTTPS]: HTTP Secure – verschlüsselte Variante von HTTP
*[TCP]: Transmission Control Protocol – zuverlässiges, verbindungsorientiertes Netzwerkprotokoll
*[UDP]: User Datagram Protocol – verbindungsloses Netzwerkprotokoll, schneller als TCP
*[DNS]: Domain Name System – übersetzt Namen in IP-Adressen
*[DHCP]: Dynamic Host Configuration Protocol – automatische IP-Adresszuweisung
*[NAT]: Network Address Translation – Adress-Übersetzung zwischen Netzen
*[IP]: Internet Protocol – Grundlage der Netzwerkkommunikation im Internet
*[URL]: Uniform Resource Locator – Webadresse
*[YAML]: YAML Ain't Markup Language – menschenlesbares Datenformat
*[JSON]: JavaScript Object Notation – leichtgewichtiges Datenaustauschformat
*[CI/CD]: Continuous Integration / Continuous Deployment – automatisierte Software-Auslieferung
*[IDE]: Integrated Development Environment – integrierte Entwicklungsumgebung
*[BIOS]: Basic Input/Output System – Firmware, die beim Rechnerstart läuft
*[UEFI]: Unified Extensible Firmware Interface – moderner BIOS-Nachfolger
*[SBOM]: Software Bill of Materials – maschinenlesbare Liste aller Software-Komponenten
*[PID]: Process ID – eindeutige Nummer eines laufenden Prozesses
*[MAC]: Media Access Control – eindeutige Hardware-Adresse einer Netzwerkkarte
*[SSD]: Solid State Drive – Flash-basierte Festplatte
*[HDD]: Hard Disk Drive – klassische magnetische Festplatte

<!-- Fachbegriffe (werden automatisch mit dem Glossar verlinkt) -->

*[Kernel]: Der zentrale Teil eines Betriebssystems – verwaltet Hardware, Prozesse, Speicher
*[Container]: Isolierter Prozess, der sich den Kernel mit dem Host teilt
*[Container-Engine]: Software, die Container ausführt (Docker Engine, containerd, Podman)
*[Containerisierung]: Das Prinzip, Anwendungen in Container zu verpacken
*[Image]: Schreibgeschützte Vorlage für Container
*[Layer]: Schicht in einem Docker-Image
*[Dockerfile]: Textdatei mit Anweisungen zum Image-Bauen
*[Registry]: Server, auf dem Docker-Images gespeichert sind
*[Tag]: Versions-Bezeichner eines Images hinter dem Doppelpunkt
*[Daemon]: Hintergrund-Dienst ohne Terminal-Ausgabe
*[Namespace]: Linux-Kernel-Feature für Prozess-Isolation
*[cgroup]: Control Group – Linux-Kernel-Feature für Ressourcen-Limits
*[Capability]: Feinkörniges Rechte-System unter Linux
*[Copy-on-Write]: Schreibschutz-Strategie, Kopie erst beim Schreiben
*[Build-Kontext]: Ordner, der beim docker build an den Daemon geschickt wird
*[Detached Mode]: Container im Hintergrund (Flag -d)
*[Port]: Nummer zwischen 0 und 65535, identifiziert einen Dienst
*[Port-Mapping]: Weiterleitung Host-Port → Container-Port (-p)
*[Bind Mount]: Host-Verzeichnis direkt in Container eingehängt
*[Volume]: Persistenter, von Docker verwalteter Speicher
*[Bridge]: Default-Netzwerktreiber von Docker
*[Bridge-Netzwerk]: Virtuelles Netzwerk, in dem Container standardmäßig laufen
*[Mount]: Einhängepunkt im Dateisystem
*[Mount-Point]: Der Pfad, an dem etwas eingehängt wird
*[Dateisystem]: Organisation von Dateien auf einem Speicher
*[Prozess]: Ein laufendes Programm, das der Kernel verwaltet
*[Shell]: Programm, das Befehle aus dem Terminal entgegennimmt
*[Bash]: Standard-Shell auf vielen Linux-Systemen
*[PowerShell]: Microsofts moderne Shell, plattformübergreifend
*[Firmware]: Low-Level-Software, die beim Rechnerstart läuft (BIOS/UEFI)
*[Bootloader]: Programm, das Kernel beim Start lädt
*[Hostname]: Name eines Rechners im Netzwerk
*[Gateway]: Netzwerk-Gerät oder IP, über die man "nach draußen" kommt
*[Loopback]: Virtuelles Netzwerk-Interface für die eigene Maschine
*[localhost]: Name für den eigenen Rechner (IP 127.0.0.1)
*[Socket]: Kommunikationskanal zwischen zwei Endpunkten
*[Unix-Socket]: Lokaler Datei-Socket für Prozess-zu-Prozess-Kommunikation
*[Subnet]: Bereich von IP-Adressen im selben Netzwerk
*[Subnetz]: Bereich von IP-Adressen im selben Netzwerk
*[Routing-Tabelle]: Liste, wohin Netzwerk-Pakete geschickt werden
*[Netzwerkinterface]: Schnittstelle zum Netzwerk (NIC, Loopback, Bridge usw.)
*[Interface]: Schnittstelle – oft Netzwerk-Interface gemeint
*[Umgebungsvariable]: Variable, die einem Prozess beim Start übergeben wird
*[Umgebungsvariablen]: Variablen, die Prozessen beim Start übergeben werden
*[PATH]: Umgebungsvariable mit Pfaden zu ausführbaren Programmen
*[Paketmanager]: Software, die Software installiert und verwaltet
*[Paket-Manager]: Software, die Software installiert und verwaltet
*[Repository]: Zentraler Ablageort für Code oder Pakete
*[Repo]: Repository – zentraler Ablageort für Code oder Pakete
*[Compose]: Docker Compose – deklaratives Multi-Container-Tool
*[compose.yaml]: Die zentrale Compose-Konfigurationsdatei
*[env_file]: Compose-Schlüssel, der eine externe Datei mit KEY=VALUE-Zeilen für einen Service einliest
*[Imperativ]: Schritte beschreiben („erst dies, dann jenes") – Gegenstück zu deklarativ
*[Deklarativ]: Zielzustand beschreiben – das System rechnet sich die Schritte selbst aus
*[Stack]: Verbund aus mehreren Containern, die zusammen eine Anwendung bilden (z.B. via compose.yaml)
*[scale]: Compose-Flag --scale, startet einen Service in mehreren Instanzen
*[watch]: Compose-Watch-Mode (seit v2.22), synchronisiert oder baut bei Datei-Änderungen automatisch
*[pg_isready]: Postgres-Hilfsprogramm, das prüft, ob der Server Anfragen annimmt – Standard in Healthchecks
*[MariaDB]: Frei verfügbare MySQL-kompatible Datenbank, oft als Docker-Image genutzt
*[Redis]: Sehr schneller In-Memory-Datenspeicher, oft als Cache eingesetzt
*[WordPress]: Das verbreitetste CMS – PHP-Anwendung mit MySQL/MariaDB-Backend
*[Healthcheck]: Bereitschafts-Prüfung, die Docker regelmäßig ausführt
*[Multi-Stage-Build]: Dockerfile-Technik mit mehreren FROM-Blöcken
*[Distroless]: Basis-Image von Google ohne Shell und Paketmanager
*[Dangling Image]: Image ohne Tag, das Plattenplatz belegt
*[Trivy]: Open-Source-Scanner für Docker-Images
*[Podman]: Container-Engine als Docker-Alternative, ohne Daemon
*[OrbStack]: Mac-native Docker-Alternative
*[Rosetta]: Rosetta 2 – Apples Übersetzer von x86_64 nach ARM
*[Kubernetes]: Container-Orchestrierungs-Plattform, oft als „K8s" abgekürzt
*[K8s]: Kubernetes – Container-Orchestrierung über mehrere Hosts
*[containerd]: Container-Runtime, Standard-Engine unter Docker
*[runc]: Low-Level-Container-Runtime, die einzelne Container startet
*[OCI]: Open Container Initiative – Standardisierungsgremium für Container-Formate
*[Swarm]: Docker Swarm – Dockers eigenes Cluster-Tool, einfacher als Kubernetes
*[Helm]: Paketmanager für Kubernetes
*[Chart]: Helm-Paket – Ordner mit Vorlagen, Standardwerten und Steckbrief
*[Release]: Eine benannte Installation eines Helm-Charts im Cluster
*[Revision]: Ein Stand eines Helm-Releases – jedes Upgrade erzeugt eine neue
*[Pod]: Kleinste deploybare Einheit in Kubernetes (ein oder mehrere Container)
*[Cluster]: Verbund mehrerer Hosts, die zusammen Workloads tragen
*[Reverse Proxy]: Server, der Anfragen von außen entgegennimmt und an interne Dienste weiterreicht
*[Emulation]: Simulation einer Hardware oder Architektur in Software
*[Hardware-Beschleunigung]: CPU-Feature, das Virtualisierung beschleunigt
*[Hypervisor]: Software, die virtuelle Maschinen verwaltet
*[Host]: Der physische Rechner, auf dem etwas läuft
*[Gast]: Das System, das innerhalb einer VM läuft
*[Gast-OS]: Betriebssystem innerhalb einer virtuellen Maschine
*[Bare-Metal]: Software, die direkt auf Hardware läuft
*[Orchestrierung]: Verwaltung vieler Container über mehrere Hosts
*[Virtualisierung]: Technik, mit der sich Computer-Ressourcen in Software nachbauen lassen
*[Multipass]: Canonicals CLI-Tool für Ubuntu-VMs
*[LinuxKit]: Minimales Linux, das Docker Desktop auf Mac verwendet
*[Docker Desktop]: Fertige Docker-Umgebung für Mac und Windows
*[SELinux]: Linux-Sicherheitsmodul (Fedora/RHEL)
*[AppArmor]: Linux-Sicherheitsmodul (Ubuntu/Debian)
*[systemd]: Moderner Linux-Init- und Service-Manager
*[Snap]: Canonicals Paketformat und -Manager
*[apt]: Paketmanager auf Debian/Ubuntu
*[dnf]: Paketmanager auf Fedora/RHEL
*[pacman]: Paketmanager auf Arch Linux
*[Homebrew]: Paketmanager für macOS
*[Hyper-V]: Virtualisierungstechnologie von Microsoft
*[Secret]: Vertrauliche Information (Passwort, API-Key)
*[Service]: Eintrag unter services: in compose.yaml
*[depends_on]: Compose-Schlüssel für Start-Reihenfolge
*[Linux]: Open-Source-Betriebssystem, Basis für Container
*[init]: Der erste Prozess in einem Linux-System (PID 1)
*[Zsh]: Z shell – erweiterte Shell, Default auf neueren Macs
*[Postgres]: Freie relationale Datenbank, oft als Docker-Image genutzt
*[PostgreSQL]: Vollname von Postgres
*[nginx]: Populärer Webserver und Reverse Proxy
*[Adminer]: Web-Oberfläche zur Datenbankverwaltung
*[Flask]: Leichtgewichtiges Python-Web-Framework
*[Alpine]: Minimales Linux (~5 MB), Standard-Basis für schlanke Container-Images
*[Slim]: Variante eines Basis-Images mit reduziertem Inhalt (z.B. python:3.12-slim)
*[Distro]: Linux-Distribution – z.B. Ubuntu, Debian, Fedora, Alpine
*[Distribution]: Linux-Distribution – z.B. Ubuntu, Debian, Fedora, Alpine
*[Snapshot]: Punkt-in-Zeit-Abbild eines Volumes oder einer VM
*[Cache]: Zwischenspeicher zur Wiederverwendung von Daten
*[Caching]: Mechanismus, der Zwischenergebnisse speichert (z.B. Docker-Layer-Cache)
*[Layer-Cache]: Docker-Build-Mechanismus, der unveränderte Layer wiederverwendet
*[Layer-Caching]: Docker-Build-Mechanismus, der unveränderte Layer wiederverwendet
*[Laufzeitumgebung]: Software-Plattform, auf der eine Anwendung läuft – im Dockerfile per FROM gewählt (z.B. Node.js, Python, Java)
*[Laufzeit]: Umgangssprachlich für Laufzeitumgebung (Plattform); fachlich auch „Dauer der Ausführung"
*[Runtime]: Englisch für Laufzeitumgebung – im Container die Sprach-Plattform (Node, Python, JVM, …)
*[Restart-Policy]: Docker-Regel, was nach einem Container-Crash passiert (no/on-failure/always/unless-stopped)
*[RestartCount]: Zähler im docker inspect, wie oft ein Container schon neu gestartet wurde
*[BuildKit]: Modernes Docker-Build-Backend mit besserem Caching, parallelen Stages und Multi-Architektur
*[profiles]: Compose-Schlüssel, der Services optional macht (nur via --profile gestartet)
*[compose.override.yaml]: Optionale Override-Datei, die Compose automatisch zusätzlich zur compose.yaml lädt
*[Stage]: Build-Stage in einem Multi-Stage-Dockerfile (FROM-Block)
*[Build-Stage]: Eine FROM-Stufe im Multi-Stage-Build
*[Git]: Verteiltes Versionsverwaltungssystem für Quellcode
*[GitHub]: Beliebte Web-Plattform für Git-Repositories
*[GitLab]: Self-hostbare Web-Plattform für Git-Repositories und CI/CD
*[GitHub Actions]: GitHubs CI/CD-Plattform, die Workflows aus YAML-Dateien ausführt
*[GitHub Pages]: Hosting für statische Webseiten direkt aus einem GitHub-Repository
*[GHCR]: GitHub Container Registry – Image-Registry unter ghcr.io, integriert in GitHub
*[GitHub Container Registry]: Image-Registry unter ghcr.io, integriert in GitHub
*[ArgoCD]: GitOps-Controller, der Kubernetes-Cluster mit einem Git-Repo synchronisiert
*[Argo Rollouts]: ArgoCD-Erweiterung für Blue/Green- und Canary-Deployments in Kubernetes
*[Flux]: GitOps-Controller (CNCF), Alternative zu ArgoCD
*[GitOps]: Betriebsmodell, bei dem der Soll-Zustand der Infrastruktur in einem Git-Repo liegt und automatisch ausgerollt wird
*[Workflow]: YAML-Datei in .github/workflows/, die einen GitHub-Actions-Ablauf beschreibt
*[Runner]: Maschine, auf der ein CI-Job ausgeführt wird (GitHub-gehostet oder self-hosted)
*[Self-hosted Runner]: Eigener Server, der GitHub-Actions-Jobs ausführt
*[Pipeline]: Automatisierte Folge von Phasen (Trigger, Build, Test, Publish, Deploy)
*[CI]: Continuous Integration – automatisches Bauen und Testen bei jedem Push
*[Continuous Integration]: Automatisches Bauen und Testen bei jedem Push
*[Continuous Delivery]: Jede grüne Version wird automatisch paketiert; Veröffentlichen bleibt ein Knopfdruck
*[Continuous Deployment]: Jede grüne Version wird ohne menschliches Zutun in Produktion ausgerollt
*[Trigger]: Ereignis, das eine CI-Pipeline auslöst (Push, Tag, Schedule, Manual)
*[Rolling Update]: Deployment-Strategie, bei der Instanzen wellenweise auf die neue Version umgestellt werden
*[Blue/Green]: Deployment-Strategie mit zwei parallelen Umgebungen und Traffic-Switch
*[Canary]: Deployment-Strategie, bei der eine neue Version graduell für einen wachsenden Anteil von Nutzern aktiviert wird
*[Recreate]: Einfachste Deployment-Strategie: alles stoppen, neu starten – akzeptiert Downtime
*[OIDC]: OpenID Connect – Identitätsprotokoll, mit dem GitHub Actions ohne Langzeit-Tokens zu Cloud-Anbietern authentifizieren kann
*[PaaS]: Platform as a Service – Cloud-Plattform, die Infrastruktur, Routing und Skalierung übernimmt
*[PAT]: Personal Access Token – persönlicher GitHub-Token für API-Zugriffe
*[GHA]: GitHub Actions
*[Trivy-Action]: Vorgefertigte GitHub-Action für CVE-Scans (aquasecurity/trivy-action)
*[BuildKit-Cache]: Layer-Cache des modernen Docker-Build-Backends, in CI oft mit type=gha
*[Linter]: Werkzeug, das Quellcode statisch auf Stilprobleme und typische Bugs prüft
*[Lint]: Sammelbezeichnung für die von einem Linter gefundenen Probleme
*[Linting]: Aktives Prüfen von Code mit einem Linter
*[Formatter]: Werkzeug, das Code automatisch formatiert (Einrückung, Zeilenlänge, Anführungszeichen)
*[Static Analysis]: Untersuchung von Quellcode ohne Ausführung (Linter, Type-Checker, Scanner)
*[Type-Checker]: Werkzeug, das Datentypen im Code prüft, ohne ihn auszuführen (mypy, tsc)
*[Type-Check]: Prüfung von Datentypen im Code ohne Ausführung
*[ruff]: Sehr schneller Python-Linter und Formatter in Rust geschrieben
*[eslint]: Linter für JavaScript und TypeScript
*[pylint]: Linter für Python
*[golangci-lint]: Sammlung von Linter-Aggregator für Go
*[prettier]: Formatter für JavaScript, TypeScript, CSS und HTML
*[black]: Formatter für Python
*[gofmt]: Standard-Formatter für Go
*[mypy]: Type-Checker für Python
*[tsc]: TypeScript-Compiler, prüft auch Typen ohne Ausführung
*[buildx]: Erweitertes `docker build`-Plugin (Multi-Architektur, Cache-Backends)
*[Signal]: Nachricht vom Kernel an einen Prozess (SIGTERM, SIGKILL, SIGINT, …)
*[SIGTERM]: Höfliches Beenden eines Prozesses – kann abgefangen werden
*[SIGKILL]: Hartes Beenden eines Prozesses – kann nicht abgefangen werden
*[ENTRYPOINT]: Dockerfile-Instruktion für den festen Hauptprozess eines Containers
*[CMD]: Dockerfile-Instruktion für die Default-Argumente an den ENTRYPOINT
*[FROM]: Dockerfile-Instruktion: definiert das Basis-Image
*[COPY]: Dockerfile-Instruktion: kopiert Dateien aus dem Build-Kontext ins Image
*[ADD]: Dockerfile-Instruktion: wie COPY, kann zusätzlich URLs und Tar-Archive
*[RUN]: Dockerfile-Instruktion: führt während des Builds einen Befehl aus, erzeugt einen Layer
*[WORKDIR]: Dockerfile-Instruktion: setzt das Arbeitsverzeichnis im Image
*[EXPOSE]: Dockerfile-Instruktion: deklariert (informativ) einen Port, den der Container nutzt
*[ARG]: Dockerfile-Instruktion: Build-Argument, nur während `docker build` verfügbar
*[ENV]: Dockerfile-Instruktion: setzt eine Umgebungsvariable im Image
*[USER]: Dockerfile-Instruktion: wechselt den User für nachfolgende Befehle und zur Laufzeit
*[Gatekeeper]: Sicherheitsmechanismus von macOS für unbekannte Apps
*[Virtualization.framework]: Apples moderne Virtualisierungs-API
*[Typ-1-Hypervisor]: Bare-Metal-Hypervisor direkt auf Hardware
*[Typ-2-Hypervisor]: Hosted-Hypervisor, läuft als App im Host-OS
*[Image-ID]: SHA-256-Hash eines Images (unveränderlich)
*[Docker Hub]: Default-Registry von Docker Inc.

<!-- Shell- und System-Begriffe -->

*[sudo]: Unix-Präfix, um einen Befehl mit Administrator-Rechten auszuführen
*[xargs]: Unix-Befehl, der Eingabe-Zeilen in Argumente für einen anderen Befehl umwandelt
*[Pipe]: Shell-Symbol `|`, das die Ausgabe eines Befehls an den nächsten weitergibt
*[SQL]: Structured Query Language – Standard-Sprache für relationale Datenbanken
*[Here-Document]: Shell-Technik, um mehrzeiligen Text direkt in eine Datei zu schreiben
*[EOF]: End Of File – Markierung, die ein Here-Document oder Eingabe-Ende signalisiert
*[Shell-Redirektion]: Umleitung der Ein-/Ausgabe von Befehlen mit `>`, `>>` oder `|`

<!-- API- und Web-Begriffe -->

*[GET]: HTTP-Methode zum Abrufen von Daten ohne Veränderung
*[POST]: HTTP-Methode zum Senden / Erstellen von Daten mit JSON-Body
*[REST]: Architektur-Stil für Web-APIs auf Basis von HTTP-Methoden
*[Endpoint]: Anlaufstelle einer API – HTTP-Methode plus URL-Pfad
*[Endpoints]: Anlaufstellen einer API (Plural)
*[Endpunkt]: Anlaufstelle einer API – HTTP-Methode plus URL-Pfad
*[Endpunkte]: Anlaufstellen einer API (Plural)
*[Pool]: Connection Pool – vorgehaltene Datenbankverbindungen
*[Retry-Logik]: Mechanismus zur Wiederholung fehlgeschlagener Operationen
*[SERIAL]: PostgreSQL-Datentyp für automatisch hochzählende Integer-IDs

<!-- Kubernetes-Begriffe -->

*[kubectl]: Kommandozeilen-Werkzeug zum Bedienen eines Kubernetes-Clusters
*[minikube]: Werkzeug, das einen kompletten Kubernetes-Cluster lokal in einer kleinen VM startet
*[ReplicaSet]: Kubernetes-Objekt, das eine feste Anzahl gleicher Pods am Laufen hält
*[ClusterIP]: Standard-Service-Typ – nur innerhalb des Clusters erreichbar
*[NodePort]: Service-Typ, der einen Dienst über einen Port am Cluster-Knoten von außen erreichbar macht
*[kubelet]: Agent auf jedem Node, der dort die Pods startet und überwacht
*[etcd]: verteilte Datenbank, in der die Control Plane den Cluster-Zustand speichert
*[Control Plane]: das "Gehirn" des Clusters – plant, überwacht, nimmt kubectl-Befehle an
*[Manifest]: YAML-Datei, die einen gewünschten Kubernetes-Zustand beschreibt
*[Selektor]: Regel (z.B. app=hello), über die ein Service oder Deployment seine Pods anhand von Labels findet


