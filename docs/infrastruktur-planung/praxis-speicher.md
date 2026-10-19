---
title: "Praxis: Speicher für Voltrad"
description: "Kurze Planungsübung im Team: den Netto-Bedarf für drei Jahre ausrechnen, ein RAID-Level mit passender Plattenzahl wählen und für drei Bedarfe zwischen DAS, NAS und SAN entscheiden."
---

# Praxis: Speicher für Voltrad

In der Bestandsaufnahme habt ihr das Sollkonzept für die Voltrad GmbH
entworfen. Die
Bürodateien wandern zu Microsoft 365, Konfigurator und Händlerportal in die
Cloud. Fertigung, Warenwirtschaft, Anmeldung, CAD-Daten und Datensicherung
bleiben im Werk. Die Server laufen dort künftig als virtuelle Maschinen auf
zwei bis drei Virtualisierungshosts. Dafür braucht das Werk neuen Speicher. Heute plant ihr ihn in drei Schritten: wie viel, wie sicher, wie
angebunden.

!!! abstract "Ziel"
    Am Ende könnt ihr:

    - einen Speicherbedarf aus Bestand, Zuwachs, Horizont und Reserve
      ausrechnen
    - zwischen Netto und Brutto unterscheiden und ein RAID-Level begründet
      wählen
    - für einen Bedarf zwischen DAS, NAS und SAN entscheiden

    Für die Schnellen gibt es drei kurze Bonus-Aufgaben und eine längere
    Denkaufgabe.

!!! info "Wenig Lesestoff"
    Alle Zahlen stehen auf der Karte unten. Mehr müsst ihr nicht lesen. Ihr
    braucht nur einen Taschenrechner, zum Beispiel den eures Rechners.

## So arbeitet ihr im Team

Im Breakout teilt eine Person den Bildschirm mit dieser Seite. Eine zweite
schreibt die drei Antworten auf: den Netto-Bedarf, das RAID-Level mit der
Zahl der Platten und die Anbindung je Bedarf. Zu jeder Station gibt es Hinweise
zum Aufklappen, falls ihr nicht weiterkommt. Die Lösung besprechen wir
gemeinsam nach der Praxiszeit. Dort stellt jede Gruppe ihre drei Antworten in
fünf Minuten vor.

## Die Karte mit allen Zahlen

![Die Zahlen für Voltrad: 1.400 GB VMs mit 10 GB Zuwachs im Monat, 600 GB CAD-Daten mit 15 GB Zuwachs im Monat, drei Jahre, 25 % Reserve, Platten mit 2 TB](../assets/diagramme/speicher-auftrag.png){ .diagramm }

| Was | Heute | Zuwachs |
|---|---|---|
| Platten der virtuellen Maschinen (Fertigungsleitsystem, Warenwirtschaft, Domänencontroller, Druck, Broker) | 1.400 GB | 10 GB im Monat |
| CAD-Daten der Konstruktion | 600 GB | 15 GB im Monat |

- Planungshorizont: 3 Jahre. Reserve: 25 %.
- Platten gibt es mit 2 TB. Rechnet mit 1 TB = 1.000 GB.
- Zwei Hosts im Werk müssen sich gegenseitig vertreten können.
- 12 Personen in der Konstruktion arbeiten täglich mit den CAD-Daten.

Ob das Fertigungsleitsystem als virtuelle Maschine laufen darf, hat Voltrad
mit dem Hersteller geklärt: Es darf.

---

## Station 1: Wie viel? (15 Minuten)

**Was ihr hier tut:** Ihr rechnet aus, wie viel nutzbaren Speicher Voltrad in
drei Jahren braucht. Das ist der **Netto-Bedarf**.

![Kapazität planen in vier Zutaten, mit einem Rechenbeispiel einer Steuerkanzlei](../assets/diagramme/speicher-kapazitaet.png){ .diagramm }

1. Wie viel liegt heute im Werk? Zählt beide Zeilen der Karte zusammen.
2. Um wie viel wächst der Bestand in drei Jahren? Rechnet mit 36 Monaten.
3. Wie viel ist das in drei Jahren zusammen?
4. Schlagt 25 % Reserve auf. Das Ergebnis ist der Netto-Bedarf.

??? tip "Hinweise zu Station 1"
    1. Rechnet in denselben Schritten wie im Beispiel der Steuerkanzlei:
       Bestand, Zuwachs, Summe, Reserve.
    2. Der Zuwachs: Um wie viele GB wachsen Maschinen und Zeichnungen
       zusammen in einem Monat? Und in 36 Monaten?
    3. 25 % Reserve heißt: Summe mal 1,25.

---

## Station 2: Wie sicher? (15 Minuten)

**Was ihr hier tut:** Ihr wählt ein RAID-Level und zählt, wie viele Platten
mit je 2 TB Voltrad kaufen muss. Gekauft wird **brutto**, nutzbar ist
**netto**. Der Unterschied steckt in der Redundanz.

Das Bild rechnet mit 4-TB-Platten, ihr rechnet mit 2 TB.

![Vier RAID-Level: was nutzbar ist und was ausfallen darf](../assets/diagramme/speicher-raid.png){ .diagramm }

1. Rechnet für RAID 1, RAID 5, RAID 6 und RAID 10 aus: Wie viele Platten mit
   2 TB braucht ihr mindestens, damit euer Netto-Bedarf aus Station 1
   hineinpasst?
2. Wie viel kauft Voltrad dann brutto? Wie viele Platten dürfen
   ausfallen?
3. Entscheidet euch für ein Level. Bedenkt: Auf dem Speicher läuft auch die
   Datenbank der Warenwirtschaft. In der IT arbeiten nur zwei Personen.

!!! tip "So rechnet ihr die Plattenzahl"
    Bei RAID 5 geht die Kapazität einer Platte für die Parität weg, verteilt
    über alle Platten. Nutzbar sind also alle außer einer. Bei RAID 6 alle
    außer zwei. RAID 1 spiegelt genau zwei Platten, nutzbar ist eine davon.
    RAID 10 verbindet mehrere Spiegelpaare, nutzbar ist die Hälfte. Beispiel
    RAID 5 mit drei Platten: (3 − 1) × 2 TB = 4 TB netto.

    Ein **Hot Spare** ist eine eingebaute Ersatzplatte, die bei einem Ausfall
    sofort einspringt. Sie zählt zum Brutto, nicht zum Netto.

??? note "Station 1 noch nicht fertig?"
    Dann rechnet hier mit einem Netto-Bedarf von 3,6 TB weiter.

??? tip "Hinweise zu Station 2"
    1. Rechnet für jedes Level die kleinste Plattenzahl aus, deren
       Netto-Kapazität über eurem Bedarf aus Station 1 liegt.
    2. Vergleicht dann: Wie viele Platten dürfen ausfallen? Denkt an die
       Nacht und das Wochenende, an denen niemand da ist.
    3. Lohnt sich ein Hot Spare, wenn nachts niemand eine Platte tauschen kann?

---

## Station 3: Wie angebunden? (10 Minuten)

**Was ihr hier tut:** Ihr entscheidet für drei Bedarfe, wie der Speicher an
die Rechner kommt.

![DAS, NAS und SAN als drei kleine Szenen mit Faustregel](../assets/diagramme/speicher-anbindung.png){ .diagramm }

Welche Anbindung passt? Begründet jede Wahl in einem Satz.

1. Die Platten der virtuellen Maschinen. Fällt ein Host aus, sollen seine
   Maschinen auf dem anderen weiterlaufen.
2. Die CAD-Daten, mit denen 12 Personen täglich arbeiten.
3. Die Datensicherung. Denkt an die Regel 3-2-1 im Bild darunter.

![Wogegen RAID hilft und die Regel 3-2-1](../assets/diagramme/speicher-backup.png){ .diagramm }

??? tip "Hinweise zu Station 3"
    1. Wer muss auf die Platten der virtuellen Maschinen zugreifen: ein
       einzelner Server oder mehrere Hosts?
    2. Brauchen die 12 Personen in der Konstruktion Blöcke oder Dateien?
    3. Wo darf die Sicherung auf keinen Fall liegen?

---

## Bonus für die Schnellen

Die Reihenfolge ist frei. Die ersten drei Aufgaben dauern je etwa fünf
Minuten, die Denkaufgabe etwa zehn.

### Bonus 1: Prozentuales Wachstum

Angenommen, der Bestand von 2.000 GB wächst nicht um feste 25 GB im Monat,
sondern um 15 % im Jahr. Wie viel liegt nach drei Jahren da? Mehr oder
weniger als bei eurer Rechnung?

??? tip "Musterlösung"
    2.000 × 1,15 = 2.300 GB. 2.300 × 1,15 = 2.645 GB. 2.645 × 1,15 =
    **rund 3.042 GB**. Vergleicht mit eurer Summe aus Station 1 vor der Reserve:
    Prozentual gerechnet liegt der Bestand darüber.
    Prozentuales Wachstum rechnet jedes Jahr auf den neuen Stand, deshalb
    wird es von Jahr zu Jahr mehr.

### Bonus 2: Was kostet der Hot Spare?

Angenommen, Voltrad nimmt RAID 5 mit drei Platten zu 2 TB und eine vierte als
Hot Spare. Wie viel kauft Voltrad brutto? Welcher Anteil davon ist nutzbar?

??? tip "Musterlösung"
    Vier Platten × 2 TB = **8 TB brutto**, davon **4 TB netto**. Nutzbar
    ist also die Hälfte. Der Rest ist Sicherheit: eine Platte Parität und eine
    Ersatzplatte.

### Bonus 3: 3-2-1 für Voltrad

Benennt für Voltrad die drei Kopien, die zwei Medien und die eine Kopie außer
Haus.

??? tip "Musterlösung"
    - **Drei Kopien:** die Daten auf dem neuen Speicher im Werk, eine
      Sicherung auf einem eigenen Gerät im Werk, eine zweite außer Haus.
    - **Zwei Medien:** zum Beispiel Festplatten im Werk und Objektspeicher
      in der Cloud. Auch ein Band ist ein eigenes Medium.
    - **Eine außer Haus:** die Kopie in der Cloud. Sie übersteht Brand und
      Wasser. Einen Trojaner im Werksnetz übersteht sie nur, wenn sie sich
      für eine Zeit nicht ändern oder löschen lässt. Viele Cloud-Speicher
      bieten dafür eine Sperre an.

    Das Sicherungsgerät im Werk steht am besten in einem anderen Raum als
    der Serverraum.

### Denkaufgabe: Die Frage der Chefin

Die Geschäftsführerin sagt: „Warum kaufen wir nicht gleich 20 TB? Dann
müssen wir nie wieder darüber reden." Was antwortet ihr? Nennt zwei
Argumente dagegen und schlagt einen Mittelweg vor.

??? tip "Musterlösung"
    Argumente gegen 20 TB:

    - **Geld liegt brach:** Fünfmal so viel Speicher kostet sofort, wird aber
      jahrelang nicht gebraucht. Speicher wird mit der Zeit billiger, später
      gekauft ist er günstiger.
    - **Platten altern:** Nach fünf bis sechs Jahren wird die Hardware ohnehin
      ersetzt, so wie jetzt. Platz, der bis dahin nie genutzt wurde, ist
      verschenkt.
    - **„Nie wieder" stimmt nicht:** Ohne Überwachung läuft auch ein großer
      Speicher irgendwann unbemerkt voll.

    Mittelweg: ein Gerät mit freien Einschüben kaufen, das sich später um
    Platten erweitern lässt. Den Füllstand ins Monitoring aufnehmen, mit
    einem Alarm bei 80 %. So kauft Voltrad heute, was es braucht. Erweitert
    wird rechtzeitig, bevor es eng wird.

---

## Was ihr jetzt könnt

- Ihr rechnet einen Speicherbedarf aus Bestand, Zuwachs, Horizont und
  Reserve aus.
- Ihr unterscheidet Netto und Brutto und wählt ein RAID-Level mit
  Begründung.
- Ihr wisst, dass RAID keine Datensicherung ist. Ihr kennt die Regel 3-2-1.
- Ihr entscheidet je Bedarf zwischen DAS, NAS und SAN.

Die Theorie dazu steht auf der Seite [Speicherlösungen](speicherloesungen.md).
Acht weitere Aufgaben findet ihr unter
[Übungen: Speicherlösungen](uebungen-speicherloesungen.md).
