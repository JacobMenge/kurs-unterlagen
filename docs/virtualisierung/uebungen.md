---
title: "Übungen"
description: "Eigene Hands-on-Übungen zum Virtualisierungs-Block – vier Schwierigkeitsgrade vom Einsteiger bis zur Challenge."
---

# Übungen – Virtualisierung

Hier findest du Aufgaben, die **du selbst** ausprobieren kannst – zusätzlich zu dem, was wir im Unterricht gemeinsam machen. Wenn dir langweilig wird, arbeite dich nach oben.

!!! abstract "Konzept der Schwierigkeitsgrade"
    - 🟢 **Einsteiger** – jeder Schritt bis ins Detail erklärt, auch der Kontext rundherum
    - 🟡 **Mittel** – du kennst die Befehle, kombinierst sie neu
    - 🔴 **Fortgeschritten** – Hinweise statt Rezepte
    - 🏆 **Challenge** – Aufgabe ohne Lösung. Lösung nur zum Aufklappen, falls du stecken bleibst

## Voraussetzung für alle Übungen

- **Multipass installiert** – siehe [Installation](multipass-einstieg.md), falls noch nicht geschehen.
- Ein **Terminal** auf deinem Rechner geöffnet:
    - **macOS**: Spotlight (`Cmd+Leertaste`) → „Terminal" eingeben → Enter
    - **Windows**: Start-Menü → „PowerShell" → Enter
    - **Linux**: `Ctrl+Alt+T` oder im Menü „Terminal" suchen
- **Test**, dass Multipass da ist:
    ```bash
    multipass version
    ```
    Wenn eine Versionsnummer erscheint, kann's losgehen.

---

## 🟢 Einsteiger

### Übung 1.1 – Deine erste VM

!!! info "Was du lernst"
    - Wie du eine virtuelle Maschine startest, betrittst und wieder löschst
    - Grundlegende Linux-Befehle im Gast-System
    - Den Unterschied zwischen Host und Gast erfahren

#### Worum geht's – ganz einfach erklärt

Stell dir vor, dein Computer wäre wie ein Mehrfamilienhaus. **Virtualisierung** schafft eine neue, leere Wohnung, in die du ein zweites Betriebssystem einziehen lässt – ohne dass dein eigenes Betriebssystem davon etwas merkt. Diese „Wohnung" nennt man **virtuelle Maschine (VM)**.

In dieser Übung erzeugst du eine neue VM mit **Ubuntu Linux** darin. Du schaust hinein, schreibst „Hallo" auf eine Datei und räumst am Ende wieder auf.

**Warum Ubuntu?** Ubuntu ist eine kostenlose Linux-Distribution, die weltweit Standard für Server und Cloud ist. Multipass lädt das Image automatisch für dich – du musst nichts klicken.

#### Schritt 1 – VM starten

Tippe im Terminal:

```bash
multipass launch --name uebung1
```

Was hier passiert:

- `multipass launch` sagt Multipass: „Starte eine neue VM".
- `--name uebung1` gibt der VM einen festen Namen, damit du sie später wiederfindest.
- Multipass lädt beim allerersten Mal das Ubuntu-Image herunter (ca. 350 MB). Das dauert 1–2 Minuten bei gutem Internet.
- Danach richtet Multipass die VM ein und startet sie.

Am Ende siehst du:
```text
Launched: uebung1
```

#### Schritt 2 – Prüfen, dass die VM läuft

```bash
multipass list
```

Du siehst eine Zeile wie:
```text
Name       State     IPv4             Image
uebung1    Running   192.168.64.5     Ubuntu 24.04 LTS
```

**Wichtig:** `State: Running` heißt, die VM läuft jetzt im Hintergrund auf deinem Rechner.

#### Schritt 3 – In die VM einsteigen

```bash
multipass shell uebung1
```

Dein Prompt ändert sich jetzt zu etwas wie:
```text
ubuntu@uebung1:~$
```

**Du bist jetzt in der VM!** Alle folgenden Befehle laufen **dort**, nicht mehr auf deinem Rechner.

#### Schritt 4 – Ein paar Linux-Befehle ausprobieren

In der VM, versuche diese Befehle einen nach dem anderen:

```bash
whoami
```
Das zeigt, wer du bist. Antwort: `ubuntu` – der Standard-Benutzer in der VM.

```bash
hostname
```
Das zeigt den Namen des Rechners. Antwort: `uebung1` – so hast du die VM genannt.

```bash
pwd
```
„Print Working Directory" – zeigt dein aktuelles Verzeichnis. Antwort: `/home/ubuntu`.

```bash
ls
```
„List" – zeigt Dateien im aktuellen Verzeichnis. Wahrscheinlich leer.

#### Schritt 5 – Eine Datei erzeugen und lesen

```bash
echo "Hallo aus der VM!" > meine-notiz.txt
```

Was passiert:

- `echo` gibt Text aus. Normalerweise landet der Text direkt auf dem Bildschirm (der „Standard-Ausgabe").
- `>` ist die [Shell-Redirektion](../glossar.md#shell-redirektion) – sie leitet die Ausgabe **in eine Datei** um, statt sie auf den Bildschirm zu drucken. Wenn die Datei schon existiert, wird sie überschrieben. Mit `>>` würdest du stattdessen anhängen.
- `meine-notiz.txt` ist der Dateiname, den wir gewählt haben.

Prüfen:

```bash
ls
```
Jetzt siehst du: `meine-notiz.txt`.

```bash
cat meine-notiz.txt
```

`cat` liest eine Datei aus. Antwort: `Hallo aus der VM!`.

!!! tip "Experiment"
    Probier gerne weitere `echo`-Befehle mit eigenen Texten. Jede VM ist wie ein Sandkasten: Was du hier kaputtmachst, beschädigt deinen Rechner nicht.

#### Schritt 6 – VM verlassen

```bash
exit
```

Dein Prompt kehrt zurück zu dem, was er vorher war. **Wichtig:** `exit` beendet nur die Shell, **nicht die VM**. Die läuft weiter im Hintergrund.

#### Schritt 7 – Aufräumen

VMs sollen nicht ewig laufen, sonst fressen sie RAM.

```bash
multipass stop uebung1
multipass delete uebung1
multipass purge
```

Was die drei Befehle tun:

- `stop` – fährt die VM herunter
- `delete` – markiert sie zum Löschen
- `purge` – entfernt sie **endgültig** von der Festplatte

Prüfen mit `multipass list` – die VM sollte nicht mehr auftauchen.

!!! success "Geschafft!"
    Du hast eine VM gestartet, betreten, genutzt und sauber entfernt. Das ist der komplette Lebenszyklus einer VM in 7 Schritten.

---

### Übung 1.2 – VM mit eigenen Ressourcen

!!! info "Was du lernst"
    - Wie du einer VM mehr CPU, RAM und Disk zuteilst
    - Warum das für echte Arbeit wichtig ist

#### Worum geht's

In Übung 1.1 hatte deine VM die Standardwerte: 1 CPU, 1 GB RAM, 5 GB Disk. Das reicht für Experimente, aber nicht für ernsthafte Arbeit. In dieser Übung baust du eine größere VM.

#### Aufgabe

Starte eine VM mit folgenden Werten:

- Name: `uebung2`
- 2 CPUs
- 2 GB RAM
- 10 GB Disk

#### Schritt-für-Schritt

```bash
multipass launch --name uebung2 --cpus 2 --memory 2G --disk 10G
```

Kleine Unterschiede zu Übung 1.1:

- `--cpus 2` → gibt der VM zwei virtuelle CPU-Kerne
- `--memory 2G` → gibt der VM 2 Gigabyte RAM
- `--disk 10G` → gibt der VM 10 Gigabyte Festplatte

Prüfen, was die VM bekommen hat:

```bash
multipass info uebung2
```

Du siehst ganz unten die zugewiesenen Ressourcen. **Vergleiche** mit Übung 1.1 – merkst du den Unterschied?

#### Aufräumen

```bash
multipass delete uebung2 && multipass purge
```

---

## 🟡 Mittel

### Übung 1.3 – Zwei VMs gleichzeitig

!!! info "Was du lernst"
    - Mehrere VMs parallel betreiben
    - Verstehen, dass VMs voneinander isoliert sind

#### Aufgabe

Starte **zwei** VMs gleichzeitig: `vmA` und `vmB`. Schreibe in jeder VM eine andere Datei. Wechsle zwischen den VMs hin und her und prüfe, dass die Dateien **nicht** auf der anderen VM sichtbar sind.

#### Hinweise

- Nutze zwei Terminal-Fenster, eins pro VM. So kannst du in beiden gleichzeitig arbeiten.
- Oder nutze `multipass exec <name> -- <befehl>`, um einen einzelnen Befehl in einer VM auszuführen, ohne die Shell zu betreten.

??? info "Beispiel für `exec`"
    ```bash
    multipass exec vmA -- echo "Ich bin vmA" > /home/ubuntu/id.txt
    multipass exec vmA -- cat /home/ubuntu/id.txt
    ```
    Der Teil nach `--` ist der Befehl, der in der VM ausgeführt wird.

#### Aufräumen nicht vergessen

```bash
multipass stop --all
multipass delete --all
multipass purge
```

---

### Übung 1.4 – Eigene Software in der VM installieren

!!! info "Was du lernst"
    - Pakete in Ubuntu installieren mit `apt`
    - Einen einfachen Webserver in der VM starten
    - Dass die VM ein vollwertiges Linux ist

#### Worum geht's

Wir installieren **Python** in der VM und starten damit einen ganz einfachen Webserver, der HTML-Dateien ausliefert. **Python** ist eine Programmiersprache, die Ubuntu oft schon mitliefert – du musst sie also nur prüfen oder nachinstallieren.

#### Schritte

1. VM starten:
   ```bash
   multipass launch --name webserver
   multipass shell webserver
   ```

2. In der VM:
   ```bash
   python3 --version
   ```
   Sollte etwas wie `Python 3.12.x` zurückgeben. Falls nicht:
   ```bash
   sudo apt update
   sudo apt install -y python3
   ```

   **`sudo`?** Das ist das Präfix, um einen Befehl mit Administrator-Rechten auszuführen. System-weite Installationen wie `apt install` brauchen die. Auf der Multipass-VM ist `sudo` passwortlos eingerichtet, du musst nichts eingeben. Mehr im [Glossar](../glossar.md#sudo).

3. Eine HTML-Datei erzeugen:
   ```bash
   echo '<h1>Hallo aus meiner VM!</h1>' > index.html
   ```

4. Den eingebauten Python-Webserver starten:
   ```bash
   python3 -m http.server 8000
   ```
   Der Server läuft jetzt und hört auf Port 8000.

5. **Neues Terminal öffnen** (VM läuft, alte Shell zeigt Logs). Dort prüfen, wie du die VM vom Host erreichst:
   ```bash
   multipass info webserver
   ```
   Merk dir die **IPv4**-Adresse, z.B. `192.168.64.5`.

6. Im Browser auf deinem Host: `http://<IPv4-aus-Schritt-5>:8000`

7. Zurück zur ersten Shell: `Ctrl+C` beendet den Server, dann `exit` die VM-Shell.

#### Aufräumen

```bash
multipass delete webserver && multipass purge
```

---

## 🔴 Fortgeschritten

### Übung 1.5 – VM mit Cloud-Init vorkonfigurieren

!!! info "Was du lernst"
    - Cloud-Init: VMs automatisiert beim Start konfigurieren
    - Reproduzierbares VM-Setup

#### Worum geht's

**Cloud-Init** ist ein Standard, um VMs beim ersten Start automatisch einzurichten – Pakete installieren, User anlegen, Dateien schreiben. Das gibt dir **reproduzierbare** VMs, ohne manuell nacharbeiten zu müssen.

#### Aufgabe

Erzeuge eine Cloud-Init-Datei, die beim VM-Start:

1. `cowsay` installiert (ein Spaß-Programm, das Kühe Text sprechen lässt)
2. Eine Datei `/home/ubuntu/willkommen.txt` mit „Diese VM wurde automatisch eingerichtet" erzeugt

Starte die VM mit dieser Konfiguration.

#### Hinweise

- Cloud-Init-Dateien sind **YAML**. Die Datei beginnt mit `#cloud-config`.
- Multipass: `multipass launch --name <name> --cloud-init <datei.yaml>`
- Relevante Keywords: `packages:`, `write_files:`
- Docs: <https://cloudinit.readthedocs.io/en/latest/>

??? tip "Kleiner Startpunkt"
    Lege eine Datei `init.yaml` an mit folgendem Grundgerüst:
    ```yaml
    #cloud-config
    packages:
      - cowsay
    write_files:
      - path: /home/ubuntu/willkommen.txt
        content: |
          Diese VM wurde automatisch eingerichtet
        owner: ubuntu:ubuntu
    ```

#### Erfolgs-Check

Nach `multipass shell <name>`:
```bash
cowsay "Ich bin automatisch da"
cat /home/ubuntu/willkommen.txt
```
Beides sollte funktionieren.

#### Aufräumen

`multipass delete <name> && multipass purge`

---

## 🏆 Challenge

### Challenge 1 – Eine VM, in der ein Mini-Blog läuft

!!! abstract "Aufgabe"
    Baue eine VM, in der ein einfacher Python-Webserver einen **selbstgeschriebenen Text-Blog** ausliefert.

    Anforderungen:

    - Ubuntu-VM mit Multipass
    - Im Verzeichnis `/home/ubuntu/blog/` liegen **mindestens drei** HTML-Dateien:
        - `index.html` mit einer Übersicht und Links zu den Posts
        - `post1.html` und `post2.html` mit beliebigem Inhalt
    - Python-HTTP-Server läuft auf Port 8000 und liefert diese Dateien aus
    - Du erreichst den Blog vom Host-Rechner im Browser über die VM-IP

    **Bonus:** Style die Seiten mit etwas eingebetteten CSS (z.B. andere Hintergrundfarbe, andere Schrift).

??? success "Musterlösung (erst versuchen, dann aufklappen!)"

    !!! tip "Hinweis zur Here-Doc-Syntax"
        Die folgenden `cat > datei << 'EOF'`-Blöcke sind ein sogenanntes [Here-Document](../glossar.md#here-document). Der Text zwischen `'EOF'` und dem abschließenden `EOF` wird in die Datei geschrieben. Das Ganze läuft **in der VM** (nicht auf dem Host) – dort ist es reine Bash-Syntax und funktioniert immer.

    ### Schritt 1 – VM starten

    ```bash
    multipass launch --name blog --cpus 1 --memory 1G --disk 5G
    multipass shell blog
    ```

    ### Schritt 2 – Projekt anlegen (in der VM)

    ```bash
    mkdir -p /home/ubuntu/blog
    cd /home/ubuntu/blog
    ```

    ### Schritt 3 – `index.html` erzeugen

    ```bash
    cat > index.html << 'EOF'
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <title>Mein Mini-Blog</title>
      <style>
        body { font-family: system-ui, sans-serif; background: #111; color: #eee; padding: 2rem; }
        a { color: #7dff9a; }
      </style>
    </head>
    <body>
      <h1>Mein Mini-Blog</h1>
      <p>Willkommen! Hier sind meine Posts:</p>
      <ul>
        <li><a href="post1.html">Post 1 – Mein erster Eintrag</a></li>
        <li><a href="post2.html">Post 2 – Noch ein Eintrag</a></li>
      </ul>
    </body>
    </html>
    EOF
    ```

    ### Schritt 4 – `post1.html` und `post2.html`

    ```bash
    cat > post1.html << 'EOF'
    <!DOCTYPE html>
    <html lang="de"><head><meta charset="UTF-8"><title>Post 1</title>
    <style>body{font-family:system-ui;background:#111;color:#eee;padding:2rem}a{color:#7dff9a}</style>
    </head><body>
      <h1>Post 1 – Mein erster Eintrag</h1>
      <p>Das hier ist mein erster Blog-Post in einer VM.</p>
      <p><a href="index.html">Zurück zur Übersicht</a></p>
    </body></html>
    EOF

    cat > post2.html << 'EOF'
    <!DOCTYPE html>
    <html lang="de"><head><meta charset="UTF-8"><title>Post 2</title>
    <style>body{font-family:system-ui;background:#111;color:#eee;padding:2rem}a{color:#7dff9a}</style>
    </head><body>
      <h1>Post 2 – Noch ein Eintrag</h1>
      <p>Cool, dass die VM funktioniert!</p>
      <p><a href="index.html">Zurück zur Übersicht</a></p>
    </body></html>
    EOF
    ```

    ### Schritt 5 – Webserver starten

    ```bash
    python3 -m http.server 8000
    ```

    ### Schritt 6 – IP der VM herausfinden (neues Terminal auf dem Host)

    ```bash
    multipass info blog
    ```

    IPv4-Adresse merken, z.B. `192.168.64.7`.

    ### Schritt 7 – Im Browser öffnen

    `http://<IPv4>:8000/`

    Du siehst den Blog. Klick auf die Posts funktioniert.

    ### Schritt 8 – Aufräumen

    ```bash
    multipass delete blog && multipass purge
    ```

    **Tipp für den nächsten Schritt:** In Block 2 bauen wir fast dasselbe nochmal – aber mit einem **Container** statt einer VM. Du wirst sehen, wie viel schneller und schlanker das geht.

---

## Weiter mit

- [Docker-Einführung](../docker/index.md) – der nächste Block mit eigenen Übungen
- [Stolpersteine Virtualisierung](stolpersteine.md) – falls etwas schiefläuft
