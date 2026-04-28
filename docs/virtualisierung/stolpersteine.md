---
title: "Stolpersteine Virtualisierung"
description: "Multipass-Fehler, VM-Probleme und Hypervisor-Eigenheiten – mit Ursache, Lösung und Präventions­tipps. Alles zum schnellen Aufklappen."
---

# Stolpersteine der Virtualisierung

Diese Seite ist deine **Nachschlagekarte**. Such dein Symptom unten, klicke die Box auf – darunter steht Ursache und Lösung.

!!! abstract "Aufbau jedes Eintrags"
    - **Problem** – das Symptom, das du siehst
    - **Ursache** – warum das passiert
    - **Lösung** – was du konkret tun kannst
    - Gelegentlich: **Prävention** – wie du es beim nächsten Mal vermeidest

---

## Multipass-Installation

??? danger "„`multipass: command not found`" direkt nach der Installation"
    **Ursache:** Dein Terminal kennt den frisch hinzugefügten Pfad noch nicht, oder die Installation ist unvollständig abgebrochen.

    **Lösung:**

    1. Prüfe mit `which multipass`, ob Multipass gefunden wird.
    2. Falls nein: **Terminal schließen und neu öffnen** – das lädt den PATH neu.
    3. Hilft das nicht: Shell-Profil neu einlesen:
        - macOS Zsh: `source ~/.zshrc`
        - macOS/Linux Bash: `source ~/.bashrc` oder `source ~/.bash_profile`
        - Windows PowerShell: neues Fenster öffnen
    4. Ist Multipass immer noch nicht da: Installation neu durchführen (siehe [Multipass-Einstieg](multipass-einstieg.md)).

??? danger "Auf Windows: „Hyper-V ist nicht verfügbar" – Installation schlägt fehl"
    **Ursache:** Entweder Windows Home (ohne Hyper-V-Funktion), oder Hyper-V wurde noch nie aktiviert.

    **Lösung:**

    1. **Windows-Edition prüfen:** Einstellungen → System → Info. Steht dort „Windows 11 Home"? Dann ist Hyper-V nicht verfügbar. Siehe [Multipass-Einstieg – Alternative für Windows Home](multipass-einstieg.md#windows-home).
    2. **Pro/Enterprise/Education:** Systemsteuerung → Programme → Windows-Features → **Hyper-V** anhaken, **OK**, Rechner neu starten.
    3. **Virtualisierung im BIOS** aktivieren: Task-Manager → Leistung → CPU → „Virtualisierung: Aktiviert". Steht dort „Deaktiviert", dann im BIOS/UEFI einschalten (meist F2/F10/Entf beim Booten, Option heißt „Intel VT-x", „SVM Mode" oder „Virtualization Technology").

??? danger "Auf macOS: „Multipass failed to launch: QEMU: HVF error"
    **Ursache:** Apples Hypervisor Framework (HVF) wird blockiert – meist durch ein anderes Virtualisierungs-Tool, das bereits aktiv ist.

    **Lösung:**

    1. **Docker Desktop** kurz beenden (Docker-Menü → Quit Docker Desktop) und erneut `multipass launch` probieren.
    2. Andere VM-Tools (VirtualBox, Parallels, VMware Fusion) auch schließen.
    3. Multipass auf aktuelle Version aktualisieren:
       ```bash
       brew upgrade multipass
       ```
    4. Bringt nichts: Mac neu starten. Einige Hintergrund­prozesse lösen den HVF-Lock erst beim Neustart.

??? warning "Auf Linux: Multipass installiert, aber `multipass launch` bricht mit KVM-Fehler ab"
    **Ursache:** KVM-Modul fehlt oder Virtualisierung ist nicht aktiviert.

    **Lösung:**

    1. `lsmod | grep kvm` – kommt nichts zurück? Dann ist das Modul nicht geladen.
    2. **BIOS/UEFI prüfen:** Intel VT-x bzw. AMD-V aktiviert?
    3. Ubuntu-Fix:
       ```bash
       sudo apt install -y qemu-kvm
       sudo modprobe kvm_intel   # oder kvm_amd, je nach CPU
       ```
    4. Neustart hilft oft zusätzlich.

??? warning "Antivirus auf Windows blockiert Multipass"
    **Ursache:** Drittanbieter-AV-Programme (McAfee, Norton, Kaspersky, Avast) sehen Hypervisor-VMs kritisch und blockieren sie.

    **Lösung:**

    1. Multipass-Installations­pfad in der AV-Software als **Ausnahme** eintragen. Standard­pfad: `C:\Program Files\Multipass\`
    2. Windows-Firewall für Multipass freigeben.
    3. Hilft das nicht: AV vorübergehend deaktivieren, Installation abschließen, danach AV wieder einschalten.

    **Konkrete Wege pro Produkt:**

    | Antivirus | Pfad zu Ausnahmen |
    |-----------|-------------------|
    | **Norton 360** | Settings → Antivirus → Scans and Risks → Exclusions / Low Risks → Configure |
    | **McAfee** | Real-Time Scanning → Excluded Files and Folders → Add File/Folder |
    | **Kaspersky** | Einstellungen → Gefahren und Ausschlüsse → Ausschlüsse verwalten → Hinzufügen |
    | **Bitdefender** | Protection → Antivirus → Settings → Manage Exceptions |
    | **Avast / AVG** | Menu → Settings → General → Exceptions |
    | **Windows Defender** | Windows-Sicherheit → Viren- & Bedrohungsschutz → Einstellungen verwalten → Ausschlüsse → Ausschluss hinzufügen |

    Füge in jedem Fall den Multipass-Installations­ordner als **Ausschluss** hinzu – nicht nur die `.exe`, sondern den ganzen Ordner.

    **Corporate-Laptop:** wenn dein Arbeitgeber die AV-Einstellungen verwaltet, kommst du nicht selbst dran. Dann IT-Support um eine Ausnahme bitten. Das ist ein häufiger Schritt – niemand wird überrascht sein.

---

## Multipass-Launch und Shell

??? danger "`multipass launch` hängt bei „Retrieving image: ..."
    **Ursache:** Langsame oder blockierte Internet­verbindung. Oder ein Firmen-Proxy filtert den Zugriff auf Canonicals Image-Server.

    **Lösung:**

    1. Warte mindestens 3 Minuten – ein frisches Image ist ca. 500 MB groß.
    2. Breche mit ++ctrl+c++ ab und prüfe den Zugang:

        === "macOS / Linux"
            ```bash
            curl -I https://cloud-images.ubuntu.com/
            ```

        === "Windows PowerShell"
            ```powershell
            Invoke-WebRequest -Method Head https://cloud-images.ubuntu.com/
            ```

        Kommt keine 200er Antwort, kommt dein Rechner nicht ans Ubuntu-Image.

    3. **Bei Firmen-Proxy:**

        === "macOS / Linux"
            ```bash
            export HTTP_PROXY=http://proxy.firma:8080
            export HTTPS_PROXY=http://proxy.firma:8080
            multipass launch 22.04 --name demo
            ```

        === "Windows PowerShell"
            ```powershell
            $env:HTTP_PROXY  = "http://proxy.firma:8080"
            $env:HTTPS_PROXY = "http://proxy.firma:8080"
            multipass launch 22.04 --name demo
            ```

        === "Windows CMD"
            ```cmd
            set HTTP_PROXY=http://proxy.firma:8080
            set HTTPS_PROXY=http://proxy.firma:8080
            multipass launch 22.04 --name demo
            ```

    4. Teste ggf. mit einem anderen Netz (Hotspot vom Handy), um zu isolieren, ob es am Firmen-Netz liegt.

??? warning "`multipass shell demo` hängt oder „No route to host"
    **Ursache:** Das virtuelle Netzwerk des Gasts ist noch nicht fertig initialisiert. Das passiert besonders beim allerersten Start.

    **Lösung:**

    1. **10–30 Sekunden warten**, dann erneut versuchen.
    2. Falls es weiter hängt:
       ```bash
       multipass info demo
       ```
       Wenn unter `IPv4` nichts steht, hat die VM noch keine IP bekommen.
    3. `multipass restart demo`, dann erneut warten und `shell` versuchen.
    4. Hilft gar nichts: VM löschen und neu erzeugen (`delete` + `purge` + `launch`).

??? warning "Gast hat keine Internet­verbindung"
    **Problem:** `multipass shell demo` klappt, aber in der VM geht `sudo apt update` nicht durch.

    **Ursache:** DNS- oder Routing-Problem im virtuellen Netzwerk.

    **Lösung:**

    1. In der VM:
       ```bash
       ping -c 3 8.8.8.8    # IP direkt: geht Routing?
       ping -c 3 ubuntu.com # geht DNS?
       ```
    2. Geht IP, aber nicht DNS → `/etc/resolv.conf` in der VM prüfen.
    3. Geht IP auch nicht → Host-Firewall könnte die VM-Bridge blockieren. VPN auf dem Host trennen und erneut probieren.

??? warning "VM ist extrem langsam auf Apple Silicon"
    **Ursache:** Die VM läuft mit emulierter x86_64-Architektur statt nativ ARM64.

    **Lösung:**

    1. Prüfen, welche Architektur die VM nutzt:
       ```bash
       multipass exec demo -- uname -m
       ```
    2. Sollte `aarch64` zurückgeben. Gibt es `x86_64`, ist etwas schiefgelaufen.
    3. Multipass auf aktuelle Version aktualisieren: `brew upgrade multipass` – neuere Versionen wählen ARM automatisch.
    4. VM mit explizitem Ubuntu-Alias neu erzeugen. In neueren Multipass-Versionen geht das meist ohne Flag, die richtige Architektur wird erkannt.

---

## Multipass-Verwaltung

??? warning "„Plattenplatz voll", obwohl ich VMs gelöscht habe"
    **Ursache:** `multipass delete` markiert nur zum Löschen. Das endgültige Entfernen passiert erst mit `multipass purge`.

    **Lösung:**

    ```bash
    multipass list    # Status sollte "Deleted" zeigen
    multipass purge   # endgültig entfernen
    ```

    Danach `multipass list` sollte „No instances found." zeigen.

    **Prüfen, wie viel Multipass insgesamt belegt:**

    === "macOS"
        ```bash
        sudo du -sh "/var/root/Library/Application Support/multipassd"
        ```

    === "Linux (Snap)"
        ```bash
        sudo du -sh /var/snap/multipass/common/data/multipassd
        ```

    === "Windows PowerShell (als Admin)"
        ```powershell
        Get-ChildItem -Recurse "C:\Windows\System32\config\systemprofile\AppData\Roaming\multipassd" |
            Measure-Object -Property Length -Sum |
            ForEach-Object { "{0:N2} MB" -f ($_.Sum / 1MB) }
        ```

??? info "„Habe ich aus Versehen die falsche VM gelöscht, kann ich das rückgängig machen?"
    **Ja – solange du noch nicht `purge` gemacht hast.**

    ```bash
    multipass recover <name>
    ```

    Die VM kommt zurück in den Status „Stopped". Nach einem `purge` ist die VM endgültig weg und nur noch aus einem Backup wieder­herstellbar.

??? warning "Laptop ist plötzlich heiß und laut"
    **Ursache:** Eine oder mehrere VMs laufen im Hintergrund und verbrauchen CPU.

    **Lösung:**

    1. `multipass list` – welche VMs sind im Status „Running"?
    2. VMs stoppen, wenn du sie nicht brauchst:
       ```bash
       multipass stop --all
       ```
    3. Dauerhaft: bei `multipass launch` keine VMs mehr mit `Autostart` anlegen (ist aber ohnehin nicht Default).

??? info "Wo liegen die virtuellen Disks meiner VMs?"
    Multipass speichert die VM-Dateien an unterschiedlichen Orten je nach Host-OS. Die Verzeichnisse sind meist **root/Admin-geschützt**.

    | Host-OS | Pfad |
    |---------|------|
    | macOS (Apple Silicon + Intel) | `/var/root/Library/Application Support/multipassd/qemu/vault/instances/<vm-name>/` |
    | Linux (Snap-Install) | `/var/snap/multipass/common/data/multipassd/vault/instances/<vm-name>/` |
    | Windows | `C:\Windows\System32\config\systemprofile\AppData\Roaming\multipassd\vault\instances\<vm-name>\` |

    Canonical empfiehlt, **nicht** manuell in diesen Verzeichnissen zu arbeiten – das bringt die Multipass-Datenbank durcheinander. Für Backups lieber mit `multipass stop && multipass snapshot` arbeiten (siehe `multipass help snapshot`).

??? info "Multipass und Docker Desktop parallel – gibt es Konflikte?"
    **Kurze Antwort:** Auf modernen Systemen meist nein, aber gelegentlich schon.

    **Lange Antwort:**

    - Auf **Linux** teilen sich beide das KVM-Backend – problemlos.
    - Auf **macOS** nutzen beide mittlerweile Apples `Virtualization.framework`. Konflikte sind selten, aber wenn Multipass plötzlich nicht startet und Docker Desktop an ist: erst Docker kurz schließen.
    - Auf **Windows** nutzen beide **Hyper-V** – auch hier geht es meist problemlos, aber bei Fehlern ist Docker-Desktop-kurz-schließen die erste Maßnahme.

    Prävention: Beide Tools immer auf der neuesten Version halten.

---

## VirtualBox und andere Typ-2-Hypervisoren

??? danger "VirtualBox: „VT-x is not available (VERR_VMX_NO_VMX)" auf Windows"
    **Ursache:** Hyper-V läuft bereits und beansprucht die CPU-Virtualisierungs­funktionen. VirtualBox kommt nicht ran.

    **Lösung – drei Optionen:**

    1. **Hyper-V deaktivieren** (wenn du es nicht brauchst). In Admin-PowerShell:
       ```powershell
       bcdedit /set hypervisorlaunchtype off
       ```
       Neu starten. Später wieder einschalten mit `bcdedit /set hypervisorlaunchtype auto`.
    2. **VirtualBox 6.1+ nutzen**, das Hyper-V als Backend akzeptieren kann – allerdings mit Performance­einbußen.
    3. **Auf Multipass wechseln**, das mit Hyper-V zusammenarbeitet.

??? warning "VirtualBox auf Apple Silicon – Performance und Kompatibilität"
    **Stand April 2026:** VirtualBox 7.1 (seit September 2024) hat offiziellen Apple-Silicon-Support. Die „Developer Preview"-Phase ist damit abgeschlossen.

    **Trotzdem gilt:**

    - **ARM-Gäste** laufen nativ und relativ schnell, aber weniger optimiert als bei **UTM** oder **Parallels**.
    - **x86_64-Gäste** müssen weiterhin **emuliert** werden (sehr langsam, Faktor 5–10 gegenüber nativ).
    - Einige Features (3D-Beschleunigung, manche USB-Geräte) sind auf Apple Silicon noch eingeschränkt.

    **Empfehlung:**

    1. Für **Ubuntu-VMs** auf Apple Silicon → **Multipass** nutzen, das läuft nativ und schnell.
    2. Für **andere Linux-Distros oder Windows-Gäste** → **UTM** (<https://mac.getutm.app>) oder **Parallels Desktop** (kostenpflichtig, beste Integration).
    3. VirtualBox auf Apple Silicon nur, wenn du schon lange damit arbeitest oder ein spezifisches VirtualBox-Feature brauchst. Für Kurs-Zwecke sind die Alternativen meist die bessere Wahl.

??? info "Mehrere Hypervisoren auf einem Host – geht das?"
    **Ja, aber mit Einschränkungen.**

    - **Linux** mit KVM: gleichzeitig VirtualBox und Multipass laufen lassen – geht meist ohne Probleme.
    - **macOS** ab macOS 11: Apple hat die Hypervisor-Framework-Schnittstelle so gebaut, dass mehrere Tools parallel arbeiten können (Docker Desktop + Multipass + Parallels sind mittlerweile meist freundlich zueinander).
    - **Windows** ist historisch problematisch. VirtualBox und Hyper-V streiten sich um Ring-0-Zugriff, siehe oben.

---

## Allgemein

??? warning "Nach einem macOS-Update läuft plötzlich nichts mehr"
    **Ursache:** macOS-Major-Updates (z.B. von Sonoma auf Sequoia) ändern manchmal die Hypervisor-Framework-API. Tools, die darauf aufbauen (Multipass, Docker Desktop), müssen mitziehen.

    **Lösung:**

    1. Multipass aktualisieren: `brew upgrade multipass`
    2. Docker Desktop aktualisieren: Docker-Menü → Check for Updates
    3. Alle VMs einmal neu starten.
    4. Falls es **gar nicht** geht: Tool deinstallieren und neu installieren.

??? info "Wenn nichts hilft: systematisch vorgehen"
    1. **Neustart** des Hosts – bringt in ca. 40 % der Fälle die Lösung, wenn ein Backend­prozess hängt.
    2. **Multipass-Logs:**
        - macOS: `sudo cat /Library/Logs/Multipass/multipassd.log`
        - Linux (Snap): `sudo journalctl -u snap.multipass.multipassd`
        - Windows: Ereignis­anzeige → Anwendungs­protokolle → Multipass
    3. **Multipass-GitHub-Issues:** <https://github.com/canonical/multipass/issues> – vielleicht hat jemand dein Problem schon gemeldet.
    4. **Im Kurs:** direkt fragen. Oft sehe ich am Screen in 30 Sekunden, was los ist.

---

## Präventive Tipps, damit du selten hierhin zurück musst

!!! tip "Gute Gewohnheiten"
    - **`multipass purge` am Ende des Arbeitstages.** Vermeidet den „20 GB belegt, keine Ahnung wovon"-Effekt.
    - **Immer aktuelle Multipass-Version** (mindestens jede Quartal­version testen). Viele gemeldete Bugs sind in neueren Releases schon behoben.
    - **Ressourcen im Blick behalten:** Activity Monitor (macOS), htop (Linux), Task-Manager (Windows). Eine VM zieht immer mehr Ressourcen als man denkt.
    - **Keine VM-Konfig per Hand fummeln.** Nutze Cloud-Init und `multipass launch`-Flags – dann ist die VM reproduzierbar, auch wenn du sie neu bauen musst.
    - **Notizen zu deinen VM-Setups** an einem festen Ort (README im Projekt­ordner) – so kannst du jede VM jederzeit neu bauen, wenn sie mal kaputt geht.
