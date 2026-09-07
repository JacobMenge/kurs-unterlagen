---
title: "Praxis: VM-Detektiv"
description: "Gruppenübung: das Netz einer echten VM mit Netzwerk-Wissen entschlüsseln und einordnen, auf wessen Hardware sie eigentlich läuft – wahlweise auf einem Cloud Server oder einer lokalen VM. Mit Snapshot-Experiment als Kür."
---

# Praxis: VM-Detektiv

!!! info "Auf einen Blick"
    - **Dauer:** ca. 50 Minuten in Gruppen.
    - **Du brauchst:** irgendeine Linux-VM mit Terminal. Im Kurs: ein **Cloud Server** aus dem Pluralsight-**Hands-on-Playground**. Zu Hause tut es genauso eine lokale VM (`multipass launch 24.04 --name demo`, siehe [Multipass-Einstieg](multipass-einstieg.md)).
    - **Festhalten:** die drei Netz-Antworten aus Teil A und euren Einordnungs-Satz aus Teil B.
    - **Kür:** das Snapshot-Experiment in Teil C – braucht einen Hypervisor unter eigener Kontrolle (Multipass), dauert zu Hause etwa zehn Minuten.

Zwei Ermittlungen, ein Ziel: Die VM soll aufhören, eine Blackbox zu sein. In **Teil A** wendest du dein Netzwerk-Wissen auf die VM an. In **Teil B** ordnest du ein, was du da eigentlich benutzt – und wem die Hardware darunter gehört.

---

## Teil A – Netz-Detektiv: Wo wohnt deine VM?

### A1 – Verbinden und umsehen

=== "Cloud Server (im Kurs)"

    In Pluralsight: links im Menü **Hands-on** → oben der Reiter **Cloud Servers** → Knopf **Create New Server**.

    | Feld | Wert für heute |
    |---|---|
    | Distribution | **Ubuntu 24.04 – Noble Numbat** |
    | Zone | **Europe** |
    | Size | **Micro** – 1 Unit, ~2 CPU / 1 GiB (reicht völlig) |

    !!! tip "Der Server braucht ein paar Minuten – das ist normal"
        Er durchläuft sichtbar mehrere Stufen: *Creating* → *Starting* →
        *Verifying SSH* → *Running Commands* → **Ready**. Rechnet mit rund
        fünf Minuten. Solange steht rechts „Terminal N/A" – das ist kein
        Fehler, sondern heißt nur: noch nicht so weit. Nutzt die Zeit und
        lest schon mal Teil A2 durch.

    Sobald der Server bereit ist:

    1. Server in der Liste anklicken – die Details klappen auf. Hier stehen
       **Username**, **Temporary Password** und die **IP-Adressen**.
    2. **Open Terminal** öffnet die Web-Konsole **in einem neuen Browser-Tab**
       (kein SSH-Client nötig). Lasst den ersten Tab offen – die Adressen
       darin braucht ihr in A3.
    3. Im schwarzen Fenster erscheint `… login:` – dort **erst den Benutzernamen**
       `cloud_user` eintippen und Enter, **dann** das temporäre Passwort.

    !!! warning "Beim ersten Login wirst du das Passwort los"
        Der Server verlangt sofort einen Wechsel: temporäres Passwort eingeben → **noch einmal** dasselbe → dann zweimal ein neues. Das Passwort ist beim Tippen unsichtbar – das ist normal, nicht kaputt. Denk dir etwas Einfaches aus, der Server ist heute Abend Wegwerfware.

    Lass die aufgeklappten **Server-Details offen** – die Adressen darin brauchst du in A3.

    !!! success "Keine Sorge wegen Kosten oder Vergessen"
        Der Server gehört zur Lizenz, es gibt keine Abrechnung nach Stunden –
        begrenzt ist nur die Anzahl (9 Einheiten pro Person, ein Micro-Server
        kostet 1). Vier Stunden nach dem Start schaltet Pluralsight ihn
        **automatisch ab**, nach 14 Tagen ohne Nutzung wird er gelöscht.
        Kurz: Kaputt machen ist ausdrücklich erlaubt. Wer trotzdem aufräumen
        will – *Quick Actions → Delete*.

=== "Lokale VM (Multipass)"

    ```text
    multipass launch 24.04 --name demo
    multipass shell demo
    ```

    Die Adresse deiner VM zeigt dir vorab `multipass list`.

### A2 – Die Sicht von innen

Jetzt im Terminal-Tab, also **in** der VM (beides Linux-Befehle – die VM ist ein Linux, egal womit du sie erreichst):

```text
ip a
ip route
```

Beantworte mit den Ausgaben drei Fragen – alles Handwerk aus dem Netzwerk-Block:

1. **Adresse und Präfix:** Welche IPv4-Adresse und welche Präfixlänge hat das Interface? In welchem **Netz** liegt die VM also (Netzadresse ausrechnen!)?
2. **Gateway:** Welche Adresse steht in `ip route` hinter `default via …` – und in welchem Netz liegt sie?
3. **DHCP:** Die VM hat ihre Adresse automatisch bekommen. Wer hat sie wohl vergeben – und wo läuft dieser Dienst?

### A3 – Private und öffentliche Adresse vergleichen

=== "Cloud Server (im Kurs)"

    Der Server zeigt euch seine Adressen selbst: In den aufgeklappten Server-Details steht unter **IP Address** sowohl eine **Public IPv4** als auch eine **Private IPv4**.

    Vergleicht drei Dinge:

    - die Adresse aus `ip a` **in** der VM,
    - die **Private IPv4** aus den Details,
    - die **Public IPv4** aus den Details.

    Fragen dazu:

    1. Welche der beiden Adressen kennt die VM selbst – und welche sieht sie nie?
    2. Die Public IPv4 ist bei jedem Start eine andere, die Private bleibt. Was sagt das über die beiden aus?
    3. Welcher Mechanismus aus dem Netzwerk-Block verbindet die zwei Adressen – und wo sitzt er?

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

1. **Wessen Hardware?** Auf welchem physischen Rechner läuft eure VM – und wo steht der ungefähr? *(Tipp: Der Zone-Name und die öffentliche Adresse verraten mehr, als man denkt.)*
2. **Welcher Hypervisor-Typ?** Typ 1 oder Typ 2 – und woran macht ihr das fest?
3. **Was habt ihr gemietet?** Die physische Hardware, den Hypervisor oder nur den Gast?

> Formuliert es als einen Satz nach dem Muster: „Unsere VM ist ein Gast auf …, der Hypervisor ist Typ …, und uns gehört davon …"

---

## Teil C (Kür) – Snapshot: kaputt machen erlaubt

!!! note "Braucht Multipass"
    Auf dem Cloud Server kannst du keine Snapshots ziehen – dafür brauchst du einen Hypervisor unter eigener Kontrolle. Zu Hause mit Multipass dauert das Experiment etwa zehn Minuten. Snapshots gibt es ab **Multipass 1.13** (`multipass version`).

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
    Findet ihr in `ip a` mehrere Einträge? `lo` ist die Loopback-Adresse des Systems selbst (127.0.0.1) – die zählt nicht. Interessant ist die Netzwerkkarte mit der echten Adresse – wie sie heißt, ist je nach System verschieden (`eth0`, `ens5`, `enX0` …). Entscheidend: alles außer `lo`. `ip a` zeigt die Adresse mit Präfix (z. B. `/24`) – Netzadresse rechnen wie im Subnetting geübt. Das `default via …` aus `ip route` liegt im selben Netz wie die VM. Zwei verschiedene Adressen innen und außen, und trotzdem kommt alles an? Der Übersetzer dazwischen war ein eigenes Thema im Netzwerk-Block. (Siehe [DHCP](../netzwerke/dhcp.md) und [Segmentierung/NAT](../netzwerke/segmentierung-und-vpn.md).)

??? info "Hinweis zu Teil B"
    Konntet ihr die Hardware anfassen? Habt ihr ein Betriebssystem unter dem Hypervisor gesehen? Und: Über die [Hypervisor-Typen](hypervisor-typen.md) verrät die Antwort auf „Wo steht die physische Hardware?" fast alles.

??? info "Hinweis zu Teil C"
    `multipass snapshot` verlangt eine **gestoppte** VM – erst `multipass stop`. Beim `restore` fragt Multipass nach Bestätigung; mit `--destructive` überspringst du die Nachfrage. Wenn `cowsay` nach dem Restore fehlt: Hast du den Snapshot **nach** der Installation angelegt?

---

## Lösung

!!! danger "Stopp"
    Erst aufklappen, wenn eure Antworten aus Teil A und der Satz aus Teil B stehen.

??? success "Lösung Teil A – das VM-Netz"
    - Die VM wohnt in einem **privaten Netz**. Auf den Pluralsight-Servern ist das in aller Regel etwas wie `172.31.x.x` – also der private Bereich **172.16.0.0/12** vom Adressierungs-Abend. Netzadresse: Adresse + Präfix, gerechnet wie immer. (Lokal mit Multipass sieht man je nach System `10.x.x.x` oder `192.168.x.x` – dieselbe Idee, andere Zahlen.)
    - Das **Gateway** liegt im selben Netz wie die VM – in der Cloud ist es der Ausgang des virtuellen Anbieter-Netzes, lokal spielt der eigene Host den Router.
    - Die **Adresse vergibt ein DHCP-Dienst der Virtualisierungs-Umgebung** – in der Cloud der des Anbieters, lokal der von Multipass/Hypervisor. Der Heim-Router sieht davon nichts.
    - **Innen privat, außen öffentlich (Cloud Server):** `ip a` zeigt **nur die private Adresse** – die öffentliche kennt die VM gar nicht. Sie steht ausschließlich in der Weboberfläche. Dazwischen sitzt **NAT beim Anbieter**: Er ordnet der privaten Adresse eine öffentliche zu und übersetzt in beide Richtungen. Genau das NAT-Prinzip vom Adressierungs-Abend, nur im Rechenzentrum statt im Heim-Router. Dass die **Public IPv4 sich bei jedem Start ändert**, passt ins Bild: Sie gehört nicht der VM, sondern wird ihr geliehen – die private Adresse dagegen bleibt.
    - **(Lokale Variante:** VM→Internet ja, Host→VM ja, Handy→VM nein – die VM ist hinter dem NAT des Hosts unsichtbar.)

??? success "Lösung Teil B – die Einordnung"
    Ein möglicher Satz: „Unsere VM ist ein **Gast auf einem Server im Rechenzentrum eines Cloud-Anbieters**, der Hypervisor ist **Typ 1** (läuft direkt auf der Hardware, dafür gebaut, ständig fremde Gäste zu tragen) – und uns gehört davon **nur der Gast**: gemietete CPU-Zeit, RAM und Platte."

    **Die Indizien, die euch dahin führen:**

    - Ihr konntet **kein Betriebssystem unter dem Hypervisor** sehen und die Hardware nirgends anfassen – erst recht steht sie nicht bei euch.
    - Die **Zone** („Europe") ist eine Rechenzentrums-Region, kein Gerät.
    - Die **private Adresse aus dem 172.31er-Bereich** ist typisch für die Standard-Netze großer Cloud-Anbieter – wer die **öffentliche Adresse** nachschlägt (z. B. auf einer Whois-Seite), landet beim Betreiber des Rechenzentrums. Bei unserem Test war das **AWS**.
    - Für Typ 1 spricht die reine Ökonomie: Ein Anbieter, der Tausende fremder Gäste gleichzeitig trägt, packt sich kein Desktop-Betriebssystem unter den Hypervisor.

    Die physische Hardware seht ihr nie – genau das ist das Geschäftsmodell „Cloud".

    **Wer lokal mit Multipass gearbeitet hat, kommt zum Gegenteil – und das ist genauso richtig:** „Unsere VM ist ein **Gast auf unserem eigenen Laptop**, der Hypervisor ist **Typ 2** (er läuft als Programm auf unserem Betriebssystem) – und uns gehört **alles davon**: Hardware, Hypervisor und Gast." Dieselben Handgriffe, dieselbe Technik – nur wohnt die VM einmal im Rechenzentrum und einmal unter eurem Schreibtisch. Und im Netz zeigt sich derselbe Unterschied: Beim Cloud Server übersetzt der Anbieter zwischen privater und öffentlicher Adresse, lokal übernimmt euer eigener Rechner diese Rolle.

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
