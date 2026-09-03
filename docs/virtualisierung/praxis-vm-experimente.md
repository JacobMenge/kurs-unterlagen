---
title: "Praxis: Netz-Detektiv & Snapshot"
description: "Gruppenübung mit Multipass: das Netz der eigenen VM mit Netzwerk-Wissen entschlüsseln, dann die VM per Snapshot absichern, mit Absicht kaputt machen und in Sekunden wiederherstellen."
---

# Praxis: Netz-Detektiv & Snapshot

!!! info "Auf einen Blick"
    - **Dauer:** ca. 50 Minuten in Gruppen.
    - **Voraussetzung:** die VM `demo` aus der [ersten Praxis](praxis-multipass.md) – heißt deine anders, ersetze einfach den Namen. Keine mehr da? `multipass launch 24.04 --name demo` baut in zwei Minuten eine neue.
    - **Festhalten:** Zu Teil A die drei Antworten (Adresse, Netz, Gateway), zu Teil B einen Satz: Was hat der Restore zurückgeholt – und was nicht?
    - **Snapshots brauchen Multipass 1.13 oder neuer:** `multipass version` verrät es dir.

Zwei Experimente, ein Ziel: Die VM soll aufhören, eine Blackbox zu sein. In **Teil A** wendest du dein Netzwerk-Wissen auf die VM an – Adresse, Netz, Gateway, alles schon mal gesehen. In **Teil B** machst du die VM mit Absicht kaputt und holst sie per Snapshot zurück.

---

## Teil A – Netz-Detektiv: Wo wohnt deine VM?

### A1 – Die Adresse von außen

```text
multipass list
```

Notiere die IPv4-Adresse deiner VM. Sie stammt **nicht** aus deinem Heimnetz – aus welchem Netz dann?

### A2 – Die Sicht von innen

Wechsle in die VM und schau dir ihre Netz-Konfiguration an:

```text
multipass shell demo
```

In der VM (beide Befehle sind Linux – die VM ist ein Ubuntu, egal welches System dein Host hat):

```text
ip a
ip route
```

Beantworte mit den Ausgaben drei Fragen – alles Handwerk aus dem Netzwerk-Block:

1. **Adresse und Präfix:** Welche IPv4-Adresse und welche Präfixlänge hat das Interface? In welchem **Netz** liegt die VM also (Netzadresse ausrechnen!)?
2. **Gateway:** Welche Adresse steht in `ip route` hinter `default via …` – und wer ist dieses Gerät?
3. **DHCP:** Die VM hat ihre Adresse automatisch bekommen. Wer hat sie vergeben – dein Heim-Router oder jemand anderes?

### A3 – Wer sieht wen?

Drei Erreichbarkeits-Tests (ersetze die Beispiel-Adressen durch deine):

```text
# 1) In der VM: Kommt sie ins Internet?
ping -c 3 9.9.9.9

# 2) In der VM: Erreicht sie dein Gateway?
ping -c 3 <deine default-via-Adresse>

# 3) Auf dem HOST (neues Terminal, nicht in der VM): Erreichst du die VM?
ping <IPv4-Adresse der VM>
```

Und die Detektiv-Frage zum Schluss: Könnte jemand **anderes** aus deinem Heimnetz (Handy, zweiter Laptop) deine VM anpingen? Warum (nicht)?

---

## Teil B – Snapshot: kaputt machen erlaubt

### B1 – Spuren hinterlassen

In der VM etwas anlegen, das nachher als Beweis dient:

```text
echo "wichtige arbeit" > ~/beweis.txt
sudo apt-get install -y cowsay
/usr/games/cowsay "alles laeuft"
exit
```

### B2 – Das Lesezeichen setzen

Snapshots gehen nur bei **gestoppter** VM:

```text
multipass stop demo
multipass snapshot demo --name sauber
multipass list --snapshots
```

### B3 – Mit Absicht kaputt machen

VM starten und Schaden anrichten:

```text
multipass start demo
multipass shell demo
```

In der VM:

```text
rm ~/beweis.txt
sudo apt-get remove -y cowsay
sudo rm /etc/hosts
exit
```

Spätestens die gelöschte `/etc/hosts` wäre im Alltag ein echtes Problem – genau richtig für unser Experiment.

### B4 – Zurück zum Lesezeichen

```text
multipass stop demo
multipass restore demo.sauber
multipass start demo
multipass shell demo
```

Prüfe in der VM: Ist `~/beweis.txt` wieder da? Funktioniert `/usr/games/cowsay "wieder da"`? Existiert `/etc/hosts`?

### B5 – Die Grenze des Snapshots

Diskutiert in der Gruppe und schreibt einen Satz auf:

> Der Snapshot liegt auf derselben Platte wie die VM. Gegen welche Sorte Probleme hilft er – und gegen welche **nicht**?

---

## Hilfekarten

??? info "Hinweis zu Teil A"
    `ip a` zeigt die Adresse mit Präfix (z. B. `/24`) – Netzadresse rechnen wie im Subnetting geübt. Das `default via …` aus `ip route` ist das Gateway der VM: Es liegt im selben Netz wie die VM selbst – also **nicht** dein Heim-Router. Wer bleibt dann als Vermieter des Netzes übrig? (Siehe [DHCP](../netzwerke/dhcp.md) und [Segmentierung/NAT](../netzwerke/segmentierung-und-vpn.md).)

??? info "Hinweis zu Teil B"
    `multipass snapshot` verlangt eine **gestoppte** VM – erst `multipass stop`. Beim `restore` fragt Multipass nach Bestätigung; mit `--destructive` überspringst du die Nachfrage. Wenn `cowsay` nach dem Restore fehlt, prüfe: Hast du den Snapshot **nach** der Installation angelegt?

---

## Lösung

!!! danger "Stopp"
    Erst aufklappen, wenn eure Antworten aus Teil A und der Satz aus B5 stehen.

??? success "Lösung Teil A – das VM-Netz"
    - Die VM wohnt in einem **privaten NAT-Netz, das der Host selbst aufspannt** (bei Multipass je nach System z. B. `10.x.x.x/24` oder `192.168.64.0/24`). Netzadresse: Adresse + Präfix, gerechnet wie immer.
    - Das **Gateway ist der Host** – dein eigener Rechner spielt für die VM den Router, inklusive NAT nach draußen.
    - Die **Adresse vergibt ein kleiner DHCP-Dienst des Hypervisors/Multipass** auf dem Host – nicht dein Heim-Router. Der sieht die VM nie.
    - Erreichbarkeit: VM → Internet **ja** (über das NAT des Hosts) · Host → VM **ja** (der Host hängt selbst am VM-Netz) · andere Geräte im Heimnetz → VM **nein**, die VM ist hinter dem NAT unsichtbar. Genau das Bild von der Folie: NAT-Modus.

??? success "Lösung Teil B – was der Snapshot kann"
    - Der Restore holt **den kompletten Zustand zum Snapshot-Zeitpunkt** zurück: `beweis.txt`, `cowsay` und `/etc/hosts` sind wieder da. Alles, was **nach** dem Snapshot passiert ist, ist weg – auch das ist wichtig zu wissen.
    - **B5:** Der Snapshot hilft gegen **kaputte Software-Zustände** (Fehlkonfiguration, missglücktes Update, gelöschte Dateien). Er hilft **nicht** gegen den Verlust der Platte oder des Rechners – dafür braucht es ein **Backup an einem anderen Ort**. Merksatz: **Snapshot = Lesezeichen, Backup = Kopie woanders.**

---

## Was du dabei gelernt hast

- Eine VM ist Netzwerktechnik zum Anfassen: privates Netz, NAT, DHCP und Gateway – alles steckt in deinem eigenen Rechner.
- Snapshots machen Experimente billig: Lesezeichen setzen, mutig sein, zurückspringen.
- Und die Grenze: Ein Snapshot ist kein Backup. Wer beides verwechselt, merkt es am schlechtesten Tag.

## Weiter mit

- [Übungen zur Virtualisierung](uebungen.md) – zum Vertiefen in eigenem Tempo.
- [Stolpersteine](stolpersteine.md) – wenn ein Befehl anders reagiert als hier beschrieben.
