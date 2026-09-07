---
title: "Praxis: VM-Detektiv"
description: "Gruppenübung: das Netz einer echten VM mit Netzwerk-Wissen entschlüsseln und einordnen, auf wessen Hardware sie eigentlich läuft – wahlweise auf einer Cloud-Sandbox oder einer lokalen VM. Mit Snapshot-Experiment als Kür."
---

# Praxis: VM-Detektiv

!!! info "Auf einen Blick"
    - **Dauer:** ca. 50 Minuten in Gruppen.
    - **Du brauchst:** irgendeine Linux-VM mit Terminal. Im Kurs: ein Server aus der **Pluralsight-Cloud-Sandbox**. Zu Hause tut es genauso eine lokale VM (`multipass launch 24.04 --name demo`, siehe [Multipass-Einstieg](multipass-einstieg.md)).
    - **Festhalten:** die drei Netz-Antworten aus Teil A und euren Einordnungs-Satz aus Teil B.
    - **Kür:** das Snapshot-Experiment in Teil C – braucht einen Hypervisor unter eigener Kontrolle (Multipass), dauert zu Hause etwa zehn Minuten.

Zwei Ermittlungen, ein Ziel: Die VM soll aufhören, eine Blackbox zu sein. In **Teil A** wendest du dein Netzwerk-Wissen auf die VM an. In **Teil B** ordnest du ein, was du da eigentlich benutzt – und wem die Hardware darunter gehört.

---

## Teil A – Netz-Detektiv: Wo wohnt deine VM?

### A1 – Verbinden und umsehen

=== "Cloud-Sandbox (im Kurs)"

    Starte in Pluralsight einen Linux-Server aus der Cloud-Sandbox und verbinde dich – per Browser-Terminal oder SSH mit den angezeigten Zugangsdaten. Notiere dabei die **Adresse, über die du dich verbindest** – sie spielt in A3 die Hauptrolle.

=== "Lokale VM (Multipass)"

    ```text
    multipass launch 24.04 --name demo
    multipass shell demo
    ```

    Die Adresse deiner VM zeigt dir vorab `multipass list`.

### A2 – Die Sicht von innen

In der VM (beides Linux-Befehle – die VM ist ein Linux, egal womit du sie erreichst):

```text
ip a
ip route
```

Beantworte mit den Ausgaben drei Fragen – alles Handwerk aus dem Netzwerk-Block:

1. **Adresse und Präfix:** Welche IPv4-Adresse und welche Präfixlänge hat das Interface? In welchem **Netz** liegt die VM also (Netzadresse ausrechnen!)?
2. **Gateway:** Welche Adresse steht in `ip route` hinter `default via …` – und in welchem Netz liegt sie?
3. **DHCP:** Die VM hat ihre Adresse automatisch bekommen. Wer hat sie wohl vergeben – und wo läuft dieser Dienst?

### A3 – Die zwei Gesichter der VM

=== "Cloud-Sandbox (im Kurs)"

    Vergleiche zwei Adressen:

    - die Adresse aus `ip a` (innen),
    - die Adresse, über die du dich **verbunden** hast (außen, aus den Sandbox-Zugangsdaten).

    Sie sind verschieden – warum funktioniert die Verbindung trotzdem? Welcher Mechanismus aus dem Netzwerk-Block steckt dahinter, und wo sitzt er?

=== "Lokale VM (Multipass)"

    Drei Erreichbarkeits-Tests (Adressen durch deine ersetzen):

    ```text
    # 1) In der VM: Kommt sie ins Internet?
    ping -c 3 9.9.9.9

    # 2) In der VM: Erreicht sie ihr Gateway?
    ping -c 3 <deine default-via-Adresse>

    # 3) Auf dem HOST (neues Terminal): Erreichst du die VM?
    ping <IPv4-Adresse der VM>
    ```

    Und die Detektiv-Frage: Könnte dein Handy im selben WLAN die VM anpingen? Warum (nicht)?

---

## Teil B – Einordnung: Was benutzt du hier eigentlich?

Diskutiert in der Gruppe und schreibt einen Satz auf:

1. **Wessen Hardware?** Auf welchem physischen Rechner läuft eure VM – und wo steht der ungefähr?
2. **Welcher Hypervisor-Typ?** Typ 1 oder Typ 2 – und woran macht ihr das fest?
3. **Was habt ihr gemietet?** Das Blech, den Hypervisor oder nur den Gast?

> Formuliert es als einen Satz nach dem Muster: „Unsere VM ist ein Gast auf …, der Hypervisor ist Typ …, und uns gehört davon …"

---

## Teil C (Kür) – Snapshot: kaputt machen erlaubt

!!! note "Braucht Multipass"
    In der Cloud-Sandbox kannst du keine Snapshots ziehen – dafür brauchst du einen Hypervisor unter eigener Kontrolle. Zu Hause mit Multipass dauert das Experiment etwa zehn Minuten. Snapshots gibt es ab **Multipass 1.13** (`multipass version`).

### C1 – Spuren hinterlassen

In der VM (`multipass shell demo`):

```text
echo "wichtige arbeit" > ~/beweis.txt
sudo apt-get install -y cowsay
/usr/games/cowsay "alles laeuft"
exit
```

### C2 – Das Lesezeichen setzen

Snapshots gehen nur bei **gestoppter** VM:

```text
multipass stop demo
multipass snapshot demo --name sauber
multipass list --snapshots
```

### C3 – Mit Absicht kaputt machen

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

### C4 – Zurück zum Lesezeichen

```text
multipass stop demo
multipass restore demo.sauber
multipass start demo
multipass shell demo
```

Prüfe: Ist `~/beweis.txt` wieder da? Funktioniert `/usr/games/cowsay "wieder da"`? Existiert `/etc/hosts`?

### C5 – Die Grenze des Snapshots

> Der Snapshot liegt auf derselben Platte wie die VM. Gegen welche Sorte Probleme hilft er – und gegen welche **nicht**?

---

## Hilfekarten

??? info "Hinweis zu Teil A"
    `ip a` zeigt die Adresse mit Präfix (z. B. `/24`) – Netzadresse rechnen wie im Subnetting geübt. Das `default via …` aus `ip route` liegt im selben Netz wie die VM. Zwei verschiedene Adressen innen und außen, und trotzdem kommt alles an? Der Übersetzer dazwischen war ein eigenes Thema im Netzwerk-Block. (Siehe [DHCP](../netzwerke/dhcp.md) und [Segmentierung/NAT](../netzwerke/segmentierung-und-vpn.md).)

??? info "Hinweis zu Teil B"
    Konntet ihr die Hardware anfassen? Habt ihr ein Betriebssystem unter dem Hypervisor gesehen? Und: Über die [Hypervisor-Typen](hypervisor-typen.md) verrät die Antwort auf „Wo steht das Blech?" fast alles.

??? info "Hinweis zu Teil C"
    `multipass snapshot` verlangt eine **gestoppte** VM – erst `multipass stop`. Beim `restore` fragt Multipass nach Bestätigung; mit `--destructive` überspringst du die Nachfrage. Wenn `cowsay` nach dem Restore fehlt: Hast du den Snapshot **nach** der Installation angelegt?

---

## Lösung

!!! danger "Stopp"
    Erst aufklappen, wenn eure Antworten aus Teil A und der Satz aus Teil B stehen.

??? success "Lösung Teil A – das VM-Netz"
    - Die VM wohnt in einem **privaten Netz** (typisch `10.x.x.x` oder `172.x`/`192.168.x` – Cloud-Anbieter wie Multipass nutzen dieselben privaten Bereiche aus dem Netzwerk-Block). Netzadresse: Adresse + Präfix, gerechnet wie immer.
    - Das **Gateway** liegt im selben Netz wie die VM – in der Cloud ist es der Ausgang des virtuellen Anbieter-Netzes, lokal spielt der eigene Host den Router.
    - Die **Adresse vergibt ein DHCP-Dienst der Virtualisierungs-Umgebung** – in der Cloud der des Anbieters, lokal der von Multipass/Hypervisor. Der Heim-Router sieht davon nichts.
    - **Die zwei Gesichter (Cloud):** Innen eine private Adresse, verbunden habt ihr euch über eine öffentliche – dazwischen sitzt **NAT bzw. die 1:1-Zuordnung des Anbieters**. Genau das NAT-Prinzip vom Adressierungs-Abend, nur bei Amazon & Co. statt zu Hause. **(Lokal:** VM→Internet ja, Host→VM ja, Handy→VM nein – die VM ist hinter dem NAT des Hosts unsichtbar.)

??? success "Lösung Teil B – die Einordnung"
    Ein möglicher Satz: „Unsere VM ist ein **Gast auf einem Server im Rechenzentrum des Cloud-Anbieters**, der Hypervisor ist **Typ 1** (direkt auf dem Blech, dafür gebaut, ständig fremde Gäste zu tragen) – und uns gehört davon **nur der Gast**: gemietete CPU-Zeit, RAM und Platte, minutenweise." Das Blech seht ihr nie – genau das ist das Geschäftsmodell „Cloud".

??? success "Lösung Teil C – was der Snapshot kann"
    - Der Restore holt **den kompletten Zustand zum Snapshot-Zeitpunkt** zurück: `beweis.txt`, `cowsay` und `/etc/hosts` sind wieder da. Alles **nach** dem Snapshot ist weg – auch das gehört zur Wahrheit.
    - **C5:** Der Snapshot hilft gegen **kaputte Software-Zustände** (Fehlkonfiguration, missglücktes Update, gelöschte Dateien). Er hilft **nicht** gegen den Verlust von Platte oder Rechner – dafür braucht es ein **Backup an einem anderen Ort**. Merksatz: **Snapshot = Lesezeichen, Backup = Kopie woanders.**

---

## Was du dabei gelernt hast

- Eine VM ist Netzwerktechnik zum Anfassen: privates Netz, NAT, DHCP und Gateway stecken in jeder Virtualisierungs-Umgebung – vom Laptop bis zur Cloud.
- „Cloud-Server" heißt fast immer: ein Gast auf einem Typ-1-Hypervisor, den du nie siehst.
- Snapshots machen Experimente billig – aber sie sind ein Lesezeichen, kein Backup.

## Weiter mit

- [Übungen zur Virtualisierung](uebungen.md) – zum Vertiefen in eigenem Tempo.
- [Stolpersteine](stolpersteine.md) – wenn ein Befehl anders reagiert als hier beschrieben.
