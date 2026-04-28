---
title: "Praxis mit Multipass"
description: "Schritt-für-Schritt: erste Ubuntu-VM starten, betreten, stoppen, löschen. Alle Befehle mit erwarteter Ausgabe."
---

# Praxis mit Multipass

!!! abstract "Ziel"
    Am Ende dieser Anleitung hast du:

    - eine **laufende Ubuntu-VM**, die du mit deinem Namen gestartet hast
    - die VM einmal **betreten** und ein paar Linux-Befehle darin ausgeführt
    - die VM **gestoppt** und wieder **gestartet**
    - die VM **sauber entfernt**, sodass kein Plattenplatz zurückbleibt

## Voraussetzungen

- Multipass ist installiert (siehe [Multipass – Einstieg](multipass-einstieg.md))
- Du sitzt an einem **Host** mit macOS, Linux oder Windows (Pro+)
- Mindestens **4 GB freier RAM** und **10 GB freier Platten­platz**
- **Internet­verbindung**, damit das Ubuntu-Image geladen werden kann

??? warning "Ich habe Windows Home – kann ich das trotzdem mitmachen?"
    Multipass braucht Hyper-V, das Windows Home fehlt. Aber du hast Alternativen:

    1. **VirtualBox** + eigenhändig Ubuntu-Server-ISO installieren (funktioniert zu 100 %, dauert nur länger).
    2. **WSL2** nutzen – du springst direkt zum Docker-Teil, der auf Home problemlos läuft.
    3. **Windows Pro-Upgrade** erwerben (ca. 145 €).

    Details: [Multipass-Einstieg → Windows Home](multipass-einstieg.md#windows-home).

??? info "Funktioniert das auch im Firmennetz mit Proxy?"
    Ja, aber mit kleinen Einstellungen. Siehe [Multipass-Einstieg → Corporate-Firmenumgebung](multipass-einstieg.md) und [Stolpersteine](stolpersteine.md). Kurzform:

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

## Grundregel für Befehle auf dieser Seite

- Befehle, die du **auf dem Host** (deinem echten Rechner) ausführst, beginnen mit einem schlichten `$` in der Erklärung oder ohne Präfix im Code-Block.
- Befehle, die du **in der VM** (im Gast) ausführst, markiere ich im Text deutlich.

---

## Schritt 1 – Prüfen, ob Multipass läuft

```bash
multipass version
```

Du solltest eine Versions­nummer sehen. Wenn nicht, schau in [Stolpersteine](stolpersteine.md) oder installiere Multipass neu.

Optional: schau, welche Ubuntu-Images es gibt:

```bash
multipass find
```

Gekürzte Beispiel­ausgabe:

```text
Image                       Aliases           Version          Description
20.04                       focal             20240419         Ubuntu 20.04 LTS
22.04                       jammy,lts         20240419         Ubuntu 22.04 LTS
24.04                       noble             20240419         Ubuntu 24.04 LTS
```

Die Ausgabe kann je nach Multipass-Version variieren.

---

## Schritt 2 – Die erste VM starten

Wir starten bewusst **Ubuntu 22.04 LTS**, damit alle im Kurs dieselbe Version haben:

```bash
multipass launch 22.04 --name demo
```

Was du siehst:

```text
Launched: demo
```

Was im Hintergrund passiert: Multipass lädt ggf. das Image herunter, legt eine virtuelle Disk an, bootet die VM. Dauer beim ersten Mal: ein bis zwei Minuten. Bei allen weiteren Starts: wenige Sekunden.

??? info "Was, wenn ich keinen Namen angebe?"
    Dann vergibt Multipass einen zufälligen Namen wie `friendly-herald` oder `keen-swan`. Für einen Kurs­kontext lieber immer `--name` setzen, damit du weißt, welche VM du meinst.

---

## Schritt 3 – Laufende VMs anzeigen

```bash
multipass list
```

Beispiel­ausgabe:

```text
Name                    State             IPv4             Image
demo                    Running           192.168.64.5     Ubuntu 22.04 LTS
```

Die **IPv4-Adresse** ist die IP, unter der die VM in deinem lokalen virtuellen Netz erreichbar ist. Auf Mac/Windows liegt dieses Netz in einer internen Bridge, auf Linux je nach Multipass-Version ebenfalls.

Für Detailinfos einer einzelnen VM:

```bash
multipass info demo
```

Ausgabe (Auszug):

```text
Name:           demo
State:          Running
IPv4:           192.168.64.5
Release:        Ubuntu 22.04.4 LTS
Image hash:     abc123...
Load:           0.02 0.01 0.00
Disk usage:     1.6G out of 4.8G
Memory usage:   144.0M out of 957.1M
Mounts:         --
```

Du siehst hier genau, **wie viele Ressourcen** die VM aktuell nutzt – und damit auch, wie wenig eine frisch gestartete Ubuntu-VM eigentlich verbraucht.

---

## Schritt 4 – In die VM wechseln

```bash
multipass shell demo
```

Dein Terminal-Prompt ändert sich jetzt:

```text
ubuntu@demo:~$
```

**Du bist drin.** Ab hier sind alle Befehle **in der VM**.

??? warning "`shell` hängt oder bricht mit Fehler ab"
    Häufig ist die VM einfach noch nicht fertig initialisiert. Erst etwa 10 Sekunden warten, dann nochmal versuchen.

    Wenn es dauerhaft hängt, siehe [Stolpersteine → `multipass shell` hängt](stolpersteine.md). Oft hilft:
    ```bash
    multipass restart demo
    ```

??? info "Wie unterscheidet sich `multipass shell` von SSH?"
    Unter der Haube nutzt Multipass einen eigenen Mechanismus zum Hineinspringen. Du kannst die VM aber auch klassisch per SSH ansprechen, wenn dir das lieber ist:

    === "macOS / Linux"
        ```bash
        ssh ubuntu@$(multipass info demo | awk '/IPv4/ {print $2}')
        ```

    === "Windows PowerShell"
        ```powershell
        $ip = (multipass info demo --format json | ConvertFrom-Json).info.demo.ipv4[0]
        ssh ubuntu@$ip
        ```

    Funktional das Gleiche, beide landen als User `ubuntu` in der VM.

Ein paar Befehle zur Orientierung:

```bash
hostname          # zeigt: demo
whoami            # zeigt: ubuntu
uname -a          # zeigt: Linux demo 5.15.0-... x86_64 (oder aarch64)
pwd               # zeigt: /home/ubuntu
ls /              # zeigt die obersten Verzeichnisse der VM
```

??? info "`uname -m` zeigt `x86_64` oder `aarch64` – warum?"
    - `x86_64` bedeutet: dein Host ist Intel/AMD (ältere Macs, die meisten Windows-PCs, Linux-Server).
    - `aarch64` bedeutet: dein Host nutzt ARM (Apple Silicon: M1/M2/M3/M4, einige moderne ARM-Server, Raspberry Pi).

    Beides ist völlig normal. Multipass wählt automatisch die passende Ubuntu-Architektur fürs Image. Auf Apple Silicon läuft Ubuntu ARM-nativ und ist **schneller**, als wenn man per Emulation ein x86_64-Image starten würde.

Was dir auffallen sollte:

- **Eigener Hostname** (`demo`), nicht der deines Laptops.
- **Eigener Benutzer** (`ubuntu`), nicht dein Host-Username.
- **Eigenes Dateisystem** – dein Home-Verzeichnis vom Host ist nicht hier.

Das ist Virtualisierung in Aktion: der Gast lebt in seiner eigenen Welt.

Wenn du magst, installiere kurz ein kleines Paket, um zu zeigen, dass `apt` funktioniert:

```bash
sudo apt update
sudo apt install -y cowsay
cowsay "Hallo aus der VM!"
```

Du solltest eine nett sprechende Kuh sehen. Reiner Show-Effekt, aber er macht sichtbar, dass **du gerade auf einem vollwertigen Linux-System** arbeitest.

??? warning "`apt update` hängt oder liefert Fehler"
    Siehe [Stolpersteine → Gast hat keine Internet­verbindung](stolpersteine.md). Quick-Check direkt in der VM:
    ```bash
    ping -c 3 8.8.8.8      # geht IP-Routing?
    ping -c 3 ubuntu.com   # geht DNS?
    ```
    Antwortet nur die erste Zeile, ist das ein DNS-Problem. Antwortet nichts, ist es Routing.

??? info "Warum muss ich `sudo` nutzen?"
    Der Standard-User in der VM heißt `ubuntu` und ist ein normaler User (kein Root). Systemweite Installationen wie `apt install` brauchen daher Admin-Rechte – das leistet `sudo`. Ein Passwort wird nicht verlangt, weil `ubuntu` auf einer Multipass-VM default in der `sudoers`-Gruppe steht und Passwortlos.

### Zurück zum Host

```bash
exit
```

Wichtig: **`exit`** verlässt nur die Shell, die VM läuft im Hintergrund weiter. Das ist gewollt – genauso, wie du auch ein normales SSH-Fenster schließen könntest, ohne den Remote-Rechner abzuschalten.

Prüfe das:

```bash
multipass list
```

Die VM hat nach wie vor Status `Running`.

---

## Schritt 5 – Stoppen und erneut starten

VMs sollten nicht permanent laufen, wenn du sie nicht brauchst – sie fressen RAM.

```bash
multipass stop demo
```

Der Status wird jetzt `Stopped`. Die virtuelle Disk bleibt erhalten, die VM ist also **nicht weg**, sie macht nur gerade nichts.

Wieder anschalten:

```bash
multipass start demo
```

Die VM bootet in wenigen Sekunden (keine Image-Download mehr, die Disk existiert ja bereits).

!!! tip "Alle VMs stoppen"
    Wenn du viele VMs hast, kannst du sie auf einen Schlag anhalten:
    ```bash
    multipass stop --all
    ```

---

## Schritt 6 – Eine größere VM starten (Variante)

Du kannst jederzeit eine zweite VM mit anderen Ressourcen starten:

```bash
multipass launch 22.04 --name gross --cpus 2 --memory 2G --disk 10G
```

Nach dem Start hast du zwei voneinander unabhängige Ubuntu-VMs parallel:

```bash
multipass list
```

```text
Name      State     IPv4            Image
demo      Running   192.168.64.5    Ubuntu 22.04 LTS
gross     Running   192.168.64.9    Ubuntu 22.04 LTS
```

Jede VM kann für sich `apt install`, Netzwerk­tests, Experimente durchführen – ohne die andere zu beeinflussen.

---

## Schritt 7 – Aufräumen (wichtig!)

!!! warning "Ohne diesen Schritt bleibt die VM bestehen und belegt weiter Plattenplatz"
    VMs verschwinden nicht von selbst. Wer sie nicht aktiv entfernt, hat irgendwann eine volle Festplatte.

Das Löschen passiert in **zwei Schritten**, das ist wichtig:

### 7a – Zum Löschen markieren

```bash
multipass delete demo
multipass delete gross
```

`delete` schaltet die VMs nur **auf den Müllhaufen**. Sie sind noch nicht endgültig weg. Das siehst du so:

```bash
multipass list
```

```text
Name      State       IPv4   Image
demo      Deleted     --     Ubuntu 22.04 LTS
gross     Deleted     --     Ubuntu 22.04 LTS
```

Der Status ist **`Deleted`**, aber die Einträge sind noch da. Mit `multipass recover demo` könntest du jetzt noch rückgängig machen.

### 7b – Endgültig entfernen

```bash
multipass purge
```

**Jetzt** sind die VMs tatsächlich weg, und der Platten­platz ist frei. Kontrolle:

```bash
multipass list
```

```text
No instances found.
```

---

## Troubleshooting-Schnelltest

Falls irgendetwas schief­geht, hier die häufigsten Fälle:

| Problem | Erste Maßnahme |
|---------|----------------|
| `multipass: command not found` | Installation noch nicht abgeschlossen? Siehe [Multipass – Einstieg](multipass-einstieg.md) |
| `launch` hängt ewig | Image-Download läuft noch. Mit `multipass find` prüfen, ob Internet da ist |
| `shell` endet sofort mit Fehler | VM-Netzwerk noch nicht bereit. Kurz warten, dann erneut |
| `VM startet aber kein Internet in der VM` | `multipass restart demo`, danach in VM `ping 8.8.8.8` |
| Plattenplatz voll trotz `delete` | `multipass purge` vergessen |

Ausführlicher: siehe [Stolpersteine](stolpersteine.md).

---

## Merksatz

!!! success "Merksatz"
    > **`launch` – `shell` – `stop` – `delete` – `purge`. Mit diesen fünf Befehlen hast du eine VM vollständig im Griff.**

---

## Weiterlesen

- [Stolpersteine der Virtualisierung](stolpersteine.md)
- [Merksätze zum Block](merksaetze.md)
- [Cheatsheet Multipass](../cheatsheets/multipass.md)
- Weiter im Kurs: [Warum Docker?](../docker/warum-docker.md)
