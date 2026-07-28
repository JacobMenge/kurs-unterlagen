---
title: "Übungen: Speicherlösungen"
description: "Acht Einzelaufgaben nur zu Speicherlösungen: Kapazität über den Planungshorizont rechnen, aus Netto-Bedarf einen Einkauf machen, RAID-Level begründet wählen, RAID gegen Backup abgrenzen, DAS/NAS/SAN zuordnen, Überbuchung beim Thin Provisioning nachrechnen, Shared Storage und Live-Migration verstehen und Objektspeicher richtig einsetzen. Jede Aufgabe mit ausführlicher Musterlösung."
---

# Übungen – Speicherlösungen

<span class='badge badge-praxis'>Aufgaben</span> &nbsp; Acht Aufgaben, die ausschließlich um die Inhalte der Seite [Speicherlösungen](speicherloesungen.md) kreisen. Jede Aufgabe steht für sich – du kannst einsteigen, wo du willst. Die große Aufgabensammlung zum durchgehenden Szenario findest du unter [Übungsaufgaben](uebungen.md).

Auf dieser Seite wird gerechnet. Nimm dir Taschenrechner und Zettel und rechne **erst selbst**, bevor du die Musterlösung aufklappst – bei Speicheraufgaben sitzt der Lerneffekt in der Rechnung, nicht im Ergebnis. Wo Zwischenwerte gerundet sind, steht das dabei; kleine Abweichungen in der letzten Stelle sind kein Fehler.

---

## Die Aufgaben

### Aufgabe 1 – Wie viel Platz brauchst du wirklich?

!!! info "Worum es geht"
    - Eine **Kapazitätsplanung** mit allen vier Zutaten sauber durchrechnen
    - Verstehen, warum Wachstum exponentiell wirkt – und was das für den Planungshorizont bedeutet
    - Theorie dazu: [Speicherlösungen](speicherloesungen.md)

Die **Werbeagentur Nordlicht** (14 Beschäftigte) arbeitet mit Bild- und Videomaterial. Auf dem gemeinsamen Speicher liegen heute **12 TB**. Der Bestand ist in den letzten drei Jahren um jeweils rund **25 %** gewachsen. Der neue Speicher soll **4 Jahre** tragen, kalkuliert wird mit **20 % Reserve**.

1. **Rechne den Netto-Bedarf aus.** Zeig die Jahresschritte.
2. Ein Kollege rechnet im Kopf: „25 % von 12 TB sind 3 TB, mal vier Jahre, also 12 + 12 = 24 TB." **Wie groß ist sein Fehler und woher kommt er?**
3. Die Geschäftsführung fragt, ob man den Speicher gleich für **6 Jahre** auslegen sollte. **Rechne den Bedarf** und nenne zwei Gründe, die gegen einen langen Horizont sprechen.

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – der Netto-Bedarf für 4 Jahre:*

    ```text
    Ist-Bestand:        12 TB
    Wachstum:           25 % pro Jahr
    Planungshorizont:    4 Jahre
    Reserve:            20 %

    Jahr 1:  12,00 TB x 1,25  =  15,00 TB
    Jahr 2:  15,00 TB x 1,25  =  18,75 TB
    Jahr 3:  18,75 TB x 1,25  =  23,44 TB
    Jahr 4:  23,44 TB x 1,25  =  29,30 TB

    + 20 % Reserve:  29,30 x 1,20  =  35,16 TB

    Netto-Bedarf:  rund 35 TB
    ```

    Kurzform: 12 TB × 1,25⁴ × 1,20 = 35,16 TB.

    *Teil 2 – der Fehler des Kollegen:* Er rechnet **linear** und kommt auf 24 TB. Richtig sind vor der Reserve **29,3 TB** – er liegt also rund **18 % zu niedrig**. Der Fehler entsteht, weil er die 25 % jedes Jahr auf den **Ausgangswert** von 12 TB bezieht statt auf den jeweils erreichten Stand. Im ersten Jahr stimmen beide Rechnungen noch (3 TB Zuwachs), im vierten Jahr wächst der Bestand aber schon um 5,9 TB. Wer linear plant, unterschätzt den Bedarf mit jedem weiteren Jahr stärker.

    *Teil 3 – der Bedarf für 6 Jahre:*

    ```text
    12 TB x 1,25^6  =  12 x 3,8147  =  45,78 TB
    + 20 % Reserve:                     54,93 TB   ->  rund 55 TB
    ```

    Zwei Jahre mehr Horizont bedeuten also fast **20 TB mehr** Netto-Bedarf – und damit im Einkauf je nach RAID-Level noch einmal deutlich mehr Rohkapazität. Zwei Gründe, die dagegen sprechen:

    - **Die Annahme trägt nicht so weit.** 25 % Wachstum sind aus drei Jahren Vergangenheit abgeleitet. Über sechs Jahre hochgerechnet wird aus einer plausiblen Annahme eine Wette – ein neuer Großkunde oder ein Wechsel zu höheren Videoauflösungen verändert die Rate komplett.
    - **Speicher wird billiger und schneller.** Kapazität, die erst in Jahr 5 gebraucht wird, kauft man in Jahr 5 zu einem besseren Preis. Vorab gekaufter Platz kostet heute Geld, verbraucht Strom und altert – Platten haben eine begrenzte Lebensdauer, unabhängig davon, ob etwas darauf liegt.
    - Ebenfalls richtig: Nach 5 bis 6 Jahren endet typischerweise der Herstellersupport für das Gerät. Der Speicher wird also ohnehin abgelöst, bevor die kalkulierte Kapazität ausgereizt ist.

    **2. Warum so?** – Die vier Zutaten der Kapazitätsplanung sind kein Schema zum Auswendiglernen, sondern vier Stellen, an denen eine Rechnung schiefgehen kann. Der Ist-Bestand wird **gemessen**, nicht geschätzt. Die Wachstumsrate kommt aus dem tatsächlichen Verlauf, nicht aus dem Gefühl. Der Planungshorizont ist eine bewusste Entscheidung mit Kosten. Und die Reserve fängt genau das ab, was in keiner der drei anderen Zahlen steckt.

    Die eigentliche Lehre von Teil 3: **Ein längerer Horizont ist keine Vorsicht, sondern eine größere Wette.** Bei exponentiellem Wachstum wächst nicht nur der Bedarf, sondern auch die Unsicherheit der Prognose. Drei bis fünf Jahre sind deshalb üblich – nicht aus Bequemlichkeit, sondern weil weiter niemand seriös rechnen kann.

    **3. Auch gut wäre ...** – vorzuschlagen, den Speicher **erweiterbar** zu kaufen statt gleich groß: ein Gehäuse mit freien Einschüben, das in Jahr 3 mit weiteren Platten aufgestockt wird. Das kombiniert kurzen Horizont mit langer Nutzbarkeit und ist in der Praxis der Standardweg. Ebenfalls stark ist der Hinweis, dass die Agentur ihr Wachstum **beeinflussen** kann: Ein Archivierungskonzept, das abgeschlossene Projekte nach zwölf Monaten auf günstigeren Speicher verschiebt, senkt die Wachstumsrate auf dem teuren, schnellen Speicher spürbar.

    **4. Typischer Stolperstein** – die Reserve auf den Ist-Bestand statt auf den Endwert zu rechnen. 12 TB + 20 % ergäbe 14,4 TB und hat mit dem Bedarf in vier Jahren nichts zu tun. Der zweite Stolperstein: die 35 TB für den Einkaufswert zu halten. Das ist der **Netto**-Bedarf – wie viel Rohkapazität dafür ins Rack muss, rechnet die nächste Aufgabe.

---

### Aufgabe 2 – Von Netto zu Brutto

!!! info "Worum es geht"
    - Aus einem Netto-Bedarf einen **Einkauf** machen: Wie viele Platten braucht es tatsächlich?
    - Den Preis der Redundanz in Kapazität ausrechnen statt zu schätzen
    - Theorie dazu: [Speicherlösungen](speicherloesungen.md)

Der Netto-Bedarf der Agentur Nordlicht liegt bei **35 TB** (Ergebnis aus Aufgabe 1). Angeboten werden Platten mit je **12 TB**.

1. **Wie viele Platten brauchst du** – jeweils für RAID 5, RAID 6 und RAID 10? Gib zu jeder Variante die nutzbare Kapazität, die Rohkapazität und an, wie viele Plattenausfälle sie verkraftet.
2. Der Einkauf fragt: „Warum kaufen wir 60 TB, wenn wir 35 brauchen?" **Erklär es in zwei Sätzen.**
3. Nach dem Aufbau meldet das System nicht 36 TB, sondern rund 32,7 TB nutzbar. **Woher kommt die Differenz?**

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – der Vergleich:*

    ```text
    Anforderung: 35 TB netto, Platten mit je 12 TB

    RAID 5:   nutzbar = (n-1) x 12 TB
              (n-1) x 12 >= 35   ->   n-1 = 3   ->   n = 4 Platten
              nutzbar 36 TB   |   roh 48 TB   |   1 Plattenausfall

    RAID 6:   nutzbar = (n-2) x 12 TB
              (n-2) x 12 >= 35   ->   n-2 = 3   ->   n = 5 Platten
              nutzbar 36 TB   |   roh 60 TB   |   2 Plattenausfaelle

    RAID 10:  nutzbar = (n/2) x 12 TB
              (n/2) x 12 >= 35   ->   n/2 = 3   ->   n = 6 Platten
              nutzbar 36 TB   |   roh 72 TB   |   1 Ausfall je Spiegelpaar
    ```

    Alle drei liefern hier dieselben 36 TB nutzbar – der Unterschied steckt allein im Einkauf und in der Ausfalltoleranz. Kommt ein **Hot Spare** dazu, ist es jeweils eine Platte mehr.

    *Teil 2 – die Erklärung für den Einkauf:*

    > „Von den 60 TB Rohkapazität sind 24 TB kein nutzbarer Speicher, sondern Redundanz: Sie sorgen dafür, dass der Betrieb weiterläuft, wenn zwei beliebige Platten ausfallen. Ohne diesen Anteil würden wir bei jedem Plattendefekt den kompletten Datenbestand aus dem Backup zurückspielen – das kostet Tage, in denen die Agentur nicht arbeiten kann."

    *Teil 3 – die fehlenden 3,3 TB:* Zwei Effekte, die zusammenwirken:

    - **Dezimal gegen binär.** Hersteller rechnen 1 TB = 1.000.000.000.000 Byte. Betriebssysteme zeigen häufig **TiB** an, also 1.024er-Schritte. Eine 12-TB-Platte sind rechnerisch nur 10,91 TiB – drei davon ergeben 32,7 TiB. Das ist keine fehlende Kapazität, sondern eine andere Maßeinheit mit derselben Abkürzung.
    - **Verwaltungsdaten.** Dateisystem, Metadaten und je nach System reservierte Bereiche kosten zusätzlich ein paar Prozent.

    Die praktische Folge: Der Netto-Bedarf von 35 TB und die angezeigten 32,7 TiB sind nicht direkt vergleichbar. Wer sichergehen will, plant eine Platte mehr ein – bei RAID 6 also sechs statt fünf, dann stehen 48 TB beziehungsweise rund 43,7 TiB zur Verfügung.

    **2. Warum so?** – Die drei Formeln sind der ganze Trick – und sie lassen sich aus dem Prinzip herleiten statt auswendig lernen:

    | Level | Prinzip | Nutzbar | Merksatz |
    |---|---|---|---|
    | RAID 5 | eine Platte Parität, verteilt | (n−1) × Plattengröße | „Eine Platte zahlst du für die Sicherheit" |
    | RAID 6 | zwei Platten Parität, verteilt | (n−2) × Plattengröße | „Zwei Platten, dafür überlebst du zwei Ausfälle" |
    | RAID 10 | Spiegelpaare, darüber Striping | (n/2) × Plattengröße | „Die Hälfte ist Kopie" |

    Wichtig ist die Reihenfolge der Rechnung: **Erst der Netto-Bedarf, dann das RAID-Level, dann der Einkauf.** Wer beim Angebot anfängt („was bekomme ich für 5.000 Euro?"), rechnet rückwärts und findet sich mit einer Zahl ab, statt sie zu begründen.

    **3. Auch gut wäre ...** – die Varianten nicht nur nach Kapazität, sondern nach **Rebuild-Risiko** zu bewerten: Bei 12-TB-Platten dauert der Wiederaufbau nach einem Ausfall viele Stunden, teils über einen Tag. In dieser Zeit läuft ein RAID 5 ohne jede Reserve – ein zweiter Ausfall bedeutet Totalverlust. Genau deshalb ist RAID 6 bei großen Platten die übliche Empfehlung, obwohl es eine Platte mehr kostet. Ebenfalls stark ist der Hinweis, dass RAID 10 zwar am meisten Rohkapazität verlangt, dafür aber die beste Schreibleistung liefert und am schnellsten wieder aufbaut – die Auswahl ist eine Abwägung aus Kapazität, Sicherheit und Geschwindigkeit, nicht nur aus Kapazität.

    **4. Typischer Stolperstein** – die Formel für RAID 5 als „50 % nutzbar" zu erinnern. Das gilt für RAID 1 und RAID 10, nicht für RAID 5: Dort kostet die Redundanz **immer genau eine Platte**, egal ob der Verbund aus 3 oder aus 12 besteht – bei vielen Platten ist RAID 5 also sehr sparsam und genau deshalb bei großen Platten so riskant. Der zweite Stolperstein: TB und TiB als Fehler zu verbuchen und beim Händler zu reklamieren. Es ist keiner, es ist eine Einheitenfrage – aber eine, die man in der Planung einkalkulieren muss.

---

### Aufgabe 3 – Welches RAID-Level passt?

!!! info "Worum es geht"
    - RAID-Level nicht nach Gewohnheit, sondern nach **Einsatzzweck** wählen
    - Auch den Fall erkennen, in dem RAID 0 die richtige Antwort ist
    - Theorie dazu: [Speicherlösungen](speicherloesungen.md)

**Wähle für jeden der vier Fälle ein RAID-Level und begründe in zwei Sätzen.**

| Fall | Situation |
|---|---|
| **A** | Ein Videoschnittplatz braucht einen sehr schnellen Arbeitsbereich für das Rohmaterial des laufenden Projekts. Das Originalmaterial liegt zusätzlich im Archiv und ist jederzeit wieder herstellbar. |
| **B** | Ein kleines NAS mit zwei Einschüben soll die laufenden Projektdaten der Agentur aufnehmen. |
| **C** | Ein Archivspeicher mit zehn Platten à 16 TB. Zugriffe sind selten, ein Wiederaufbau nach einem Plattenausfall dauert über einen Tag. |
| **D** | Der Datenbankserver der Projektverwaltung. Viele kleine Schreibzugriffe, Antwortzeit ist kritisch. |

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Fall | Level | Begründung |
    |---|---|---|
    | **A** | **RAID 0** | Hier zählt nur Geschwindigkeit – und der Datenverlust ist verkraftbar, weil das Material aus dem Archiv wiederhergestellt werden kann. Das ist der seltene Fall, in dem die fehlende Redundanz eine bewusste, vertretbare Entscheidung ist und kein Versäumnis. |
    | **B** | **RAID 1** | Bei zwei Einschüben ist Spiegelung die einzige Option mit Redundanz. 50 % nutzbare Kapazität sind der Preis dafür, dass der Ausfall einer Platte den Betrieb nicht anhält. |
    | **C** | **RAID 6** | Bei 16-TB-Platten dauert der Wiederaufbau so lange, dass die Wahrscheinlichkeit eines **zweiten** Ausfalls in diesem Fenster real wird. RAID 6 überlebt genau das. Die zusätzlich geopferte Platte ist bei zehn Stück ein kleiner Preis. |
    | **D** | **RAID 10** | Keine Paritätsberechnung, deshalb die beste Schreibleistung von allen Leveln – genau das, was viele kleine Schreibzugriffe brauchen. Dazu der schnellste Wiederaufbau, weil nur der Spiegelpartner kopiert wird statt der ganze Verbund gelesen. |

    **2. Warum so?** – Hinter der Auswahl stehen drei Fragen, die du in dieser Reihenfolge stellst:

    1. **Sind die Daten reproduzierbar?** Wenn ja – und nur dann – ist RAID 0 überhaupt im Rennen. Fall A ist der Beleg, dass RAID 0 kein Anfängerfehler ist, sondern ein Werkzeug mit einem sehr engen Einsatzbereich.
    2. **Wie viele Platten habe ich zur Verfügung?** Zwei Einschübe lassen nur RAID 1 zu, RAID 5 braucht mindestens drei, RAID 6 und RAID 10 mindestens vier.
    3. **Was ist das Lastprofil?** Viele Schreibzugriffe sprechen für RAID 10, große Kapazität bei ruhiger Last für RAID 5 oder 6.

    Der Punkt bei Fall C verdient besondere Aufmerksamkeit, weil er in Prüfungen wie in der Praxis unterschätzt wird: **Je größer die Platten, desto länger der Rebuild – und desto gefährlicher wird RAID 5.** Der Verbund läuft während des Wiederaufbaus degradiert – also ohne jede Reserve – und liest dabei jede verbliebene Platte vollständig aus. Genau diese Belastung ist der Moment, in dem eine zweite altersschwache Platte gern aufgibt.

    **3. Auch gut wäre ...** – bei Fall B anzumerken, dass ein Zwei-Platten-NAS mit RAID 1 zwar redundant ist, aber trotzdem kein Backup darstellt: Beide Platten stehen im selben Gehäuse am selben Ort. Bei Fall C ist der Hinweis auf einen **Hot Spare** stark – er verkürzt das riskante Zeitfenster, weil der Wiederaufbau sofort startet statt erst nach dem Weg in den Serverraum. Und bei Fall D ist es richtig, die Frage zu stellen, ob überhaupt drehende Platten das richtige Medium sind: Für latenzkritische Datenbanken sind SSDs die naheliegendere Antwort – dann verschiebt sich die RAID-Frage, verschwindet aber nicht.

    **4. Typischer Stolperstein** – RAID 5 als Standardantwort für alles. Es ist ein guter Kompromiss für mittelgroße Verbünde mit ruhiger Last, aber bei großen Platten riskant und bei schreiblastigen Anwendungen langsam. Der zweite Stolperstein ist die Angst vor RAID 0: Wer in Fall A ein RAID 1 baut, halbiert Kapazität und Schreibleistung, um Daten zu schützen, die ohnehin doppelt vorhanden sind. Redundanz ohne Bedarf ist auch eine Fehlplanung.

---

### Aufgabe 4 – Wogegen hilft RAID, wogegen nur ein Backup?

!!! info "Worum es geht"
    - Den Schutzbereich von RAID **scharf** abgrenzen
    - Erkennen, dass auch ein Backup Bedingungen hat, damit es im Ernstfall trägt
    - Theorie dazu: [Speicherlösungen](speicherloesungen.md)

Die Agentur betreibt ein NAS mit RAID 6 und sichert nachts auf ein zweites NAS im selben Serverraum. **Geh die sechs Schadensfälle durch und beantworte für jeden zwei Fragen: Hilft das RAID? Hilft dieses Backup?** Wo das Backup nur unter Bedingungen hilft, nenne die Bedingung.

| Nr. | Schadensfall |
|---|---|
| a | Eine Platte im Verbund fällt aus |
| b | Eine Kollegin löscht am Freitagabend versehentlich einen Projektordner |
| c | Ein Verschlüsselungstrojaner läuft über die Dateifreigaben |
| d | Der RAID-Controller stirbt und schreibt dabei fehlerhafte Daten auf alle Platten |
| e | Ein Rohrbruch setzt den Serverraum unter Wasser |
| f | Ein Fehler in einer Anwendung überschreibt seit drei Wochen unbemerkt Metadaten in tausenden Dateien |

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Nr. | Hilft RAID? | Hilft dieses Backup? |
    |---|---|---|
    | a | **Ja** – genau dafür ist es da. Der Verbund läuft degradiert weiter, die Platte wird getauscht, der Rebuild startet. | Nicht nötig. |
    | b | **Nein.** Das Löschen ist eine gültige Anweisung, das RAID führt sie auf allen Platten korrekt aus. | **Ja** – vorausgesetzt, die nächtliche Sicherung lief vor dem Löschen und die Datei ist in der Aufbewahrung noch enthalten. Schneller ginge ein Papierkorb oder ein Snapshot. |
    | c | **Nein.** Verschlüsseln ist Schreiben – der Verbund macht es zuverlässig mit. | **Nur unter einer Bedingung:** Die Sicherung darf vom befallenen System aus nicht überschreibbar sein. Ein zweites NAS als beschreibbare Netzfreigabe wird mitverschlüsselt. Es braucht eine getrennte Anmeldung, unveränderliche Sicherungen oder eine Kopie, die offline steht. |
    | d | **Nein** – im Gegenteil: Der Controller ist die gemeinsame Instanz aller Platten, sein Fehler trifft den ganzen Verbund. | **Ja**, sofern der Fehler bemerkt wird, bevor die nächste Sicherung den defekten Stand überschreibt. |
    | e | **Nein.** Wasser trifft alle Platten im Gehäuse gleichzeitig. | **Nein** – das zweite NAS steht im selben Raum. Hier fehlt die Kopie **außer Haus**. |
    | f | **Nein.** Die Schreibvorgänge sind technisch korrekt. | **Nur unter einer Bedingung:** Die Aufbewahrung muss weiter zurückreichen als drei Wochen. Sichert das System nur sieben Tage, ist der letzte saubere Stand längst überschrieben. |

    **2. Warum so?** – Die Tabelle bringt eine einzige Erkenntnis auf sechs verschiedene Arten: **RAID schützt vor genau einem Szenario – dem Hardware-Defekt einer Platte.** In fünf von sechs Fällen ist es machtlos – in Fall d ist der Verbund sogar selbst der Überträger des Schadens.

    Interessanter ist die zweite Spalte, weil sie zeigt, dass „wir haben ein Backup" ebenfalls keine Antwort ist. Ein Backup trägt nur, wenn drei Eigenschaften stimmen:

    - **Zeitversetzt** – es muss einen Stand geben, der vor dem Schaden liegt (Fälle b, d, f).
    - **An einem anderen Ort** – sonst trifft ein physischer Schaden beide Kopien (Fall e).
    - **Nicht vom Quellsystem aus veränderbar** – sonst nimmt ein Trojaner die Sicherung mit (Fall c).

    Genau diese drei Eigenschaften stecken in der Faustregel **3-2-1**: drei Kopien, auf zwei verschiedenen Medien, eine davon außer Haus. Das Backup der Agentur erfüllt heute nur die erste Bedingung sauber.

    Fall f ist der unangenehmste, weil er still verläuft. Ein Schaden, der drei Wochen unbemerkt bleibt, wird durch kurze Aufbewahrungsfristen erst richtig teuer – deshalb gehört zur Sicherungsstrategie immer die Frage: **Wie weit zurück kommen wir eigentlich?**

    **3. Auch gut wäre ...** – bei Fall b auf **Snapshots** und einen **Papierkorb** hinzuweisen: Sie lösen genau diesen häufigsten aller Fälle in Sekunden statt in Stunden und entlasten das Backup für die echten Katastrophen. Ebenfalls stark ist der Hinweis, dass in Fall a das RAID zwar hilft, aber ein Zeitfenster öffnet: Bis der Rebuild durch ist, läuft der Verbund ohne Reserve – bei RAID 6 mit einer verbleibenden, bei RAID 5 mit keiner. Und richtig ist auch die Anmerkung, dass keiner dieser Punkte etwas wert ist, solange niemand eine **Rücksicherung getestet** hat.

    **4. Typischer Stolperstein** – Fall c mit „ja, wir haben ein Backup" abzuhaken. Ein zweites NAS, das per Netzfreigabe beschreibbar am selben Netz hängt, ist für einen Verschlüsselungstrojaner schlicht ein weiteres Laufwerk. Der zweite Stolperstein ist Fall d: RAID 6 verkraftet zwei **Platten**ausfälle – nicht den Ausfall des Bauteils, das alle Platten steuert. Die Redundanz gilt für die Komponenten, die vervielfacht wurden, nicht für die, die es nur einmal gibt.

---

### Aufgabe 5 – DAS, NAS oder SAN?

!!! info "Worum es geht"
    - Die drei Anbindungsarten an der Frage unterscheiden: **Wer soll drankommen und wie?**
    - Datei- gegen Blockzugriff sicher auseinanderhalten
    - Theorie dazu: [Speicherlösungen](speicherloesungen.md)

**Ordne jeden der fünf Fälle einer Anbindungsart zu** und nenne den Grund in einem Satz.

| Nr. | Fall |
|---|---|
| a | Ein einzelner Videoschnittplatz braucht einen sehr schnellen lokalen Arbeitsbereich |
| b | 14 Beschäftigte greifen gemeinsam auf Projektordner zu, mit Rechten pro Abteilung |
| c | Drei Virtualisierungs-Hosts sollen sich Speicher teilen, damit VMs den Host wechseln können |
| d | Ein Backup-Server soll seine Sicherungen auf ein separates Gerät im Netz schreiben |
| e | Eine Datenbank braucht Blockzugriff mit möglichst niedriger Latenz |

**Zusatzfrage:** Woran erkennst du in einem Angebot, ob ein Gerät Datei- oder Blockzugriff liefert?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Nr. | Anbindung | Grund |
    |---|---|---|
    | a | **DAS** | Genau ein Rechner braucht Zugriff, dafür maximal schnell – kein Netz dazwischen, keine Freigabe nötig. |
    | b | **NAS** | Viele Nutzer, gemeinsame Ordner, Berechtigungen: der klassische Dateizugriff über SMB oder NFS im vorhandenen LAN. |
    | c | **SAN** | Mehrere Hosts brauchen gleichzeitig Zugriff auf denselben Speicher – erst das macht Live-Migration und Neustart auf einem anderen Host möglich. |
    | d | **NAS** | Ein Ziel im Netz, das der Backup-Server beschreibt. Ein DAS am Backup-Server wäre ebenfalls vertretbar, verhindert aber, dass andere Systeme direkt sichern. |
    | e | **SAN** | Blockzugriff ist genau das, was ein SAN liefert – der Server legt sein eigenes Dateisystem darauf an, wie auf einer lokalen Platte. |

    *Zusatzfrage:* An den **Protokollen** in der Beschreibung.

    - **SMB** oder **NFS** → Dateizugriff, also NAS-Charakter. Das Gerät verwaltet das Dateisystem und gibt Ordner frei.
    - **iSCSI** oder **Fibre Channel** → Blockzugriff, also SAN-Charakter. Das Gerät liefert rohe Blöcke, das Dateisystem legt der Server an.

    **2. Warum so?** – Die drei Kürzel beschreiben nicht die verbauten Platten, sondern den **Weg zum Speicher** – und daran hängt, wer ihn nutzen kann:

    | | Wer kommt dran? | Über welches Netz? | Was wird geliefert? |
    |---|---|---|---|
    | **DAS** | genau ein Rechner | keins – direktes Kabel | Blöcke, lokal |
    | **NAS** | viele Nutzer | normales LAN | **Dateien** |
    | **SAN** | viele Server | eigenes Speichernetz | **Blöcke** |

    Der Unterschied zwischen Datei und Block ist der, den man in Prüfungen am häufigsten braucht. Bei einem NAS entscheidet **das Gerät**, wie Dateien abgelegt werden – es verwaltet das Dateisystem und liefert dir fertige Dateien. Bei einem SAN entscheidet **der Server**: Er bekommt einen rohen Bereich und formatiert ihn selbst. Genau deshalb brauchen Datenbanken und Hypervisoren Blockzugriff – sie wollen die Kontrolle über die Ablage, nicht ein fremdes Dateisystem dazwischen.

    **3. Auch gut wäre ...** – bei Fall c anzumerken, dass in kleineren Umgebungen ein NAS diese Aufgabe mit übernimmt: Viele NAS-Geräte sprechen zusätzlich iSCSI oder bieten NFS-Freigaben an, die Hypervisoren als gemeinsamen Speicher nutzen können. Die Grenze zwischen NAS und SAN ist im Mittelstand fließend – entscheidend ist nicht das Etikett auf dem Gehäuse, sondern ob alle Hosts gleichzeitig und schnell genug drankommen. Ebenfalls stark ist der Hinweis, dass bei Fall c die **Anbindung** mitgeplant werden muss: Wenn jede Platten-Operation jeder VM über dasselbe Netz läuft, entscheidet dessen Auslegung über die gefühlte Geschwindigkeit des gesamten Clusters.

    **4. Typischer Stolperstein** – NAS und SAN über den Preis oder die Größe zu unterscheiden („SAN ist das teure große"). Das Unterscheidungsmerkmal ist der Zugriff: Datei gegen Block. Ein kleines NAS mit iSCSI liefert Blöcke, ein sehr teures Gerät kann trotzdem reiner Dateispeicher sein. Der zweite Stolperstein ist Fall a: DAS wirkt altmodisch und wird deshalb gern übersehen. Für genau einen Rechner mit hohem Durchsatzbedarf ist es die schnellste und günstigste Lösung – ein Netz dazwischen würde hier nur bremsen.

---

### Aufgabe 6 – Wann läuft der Pool voll?

!!! info "Worum es geht"
    - **Überbuchung** beim Thin Provisioning nachrechnen statt zu ahnen
    - Den Kipppunkt bestimmen, ab dem eine ganze Umgebung stehen bleibt
    - Theorie dazu: [Speicherlösungen](speicherloesungen.md)

Auf dem Virtualisierungs-Cluster der Agentur liegt ein Speicher-Pool mit **4.000 GB**. Darauf laufen **15 VMs**, jede mit einer virtuellen Platte von **400 GB**, angelegt mit **Thin Provisioning**. Aktuell belegt jede VM rund **120 GB**.

1. **Wie viel Speicher ist den VMs zugesagt** – und wie viel ist tatsächlich belegt?
2. **Wie hoch ist der Überbuchungsgrad?**
3. **Ab welchem durchschnittlichen Füllstand je VM ist der Pool voll?** Gib den Wert in GB und in Prozent der zugesagten 400 GB an.
4. **Was passiert, wenn der Pool tatsächlich voll läuft** – und was gehört deshalb ins Monitoring?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    ```text
    Pool:                4.000 GB
    VMs:                 15 Stueck x 400 GB zugesagt

    Zugesagt:            15 x 400 GB  =  6.000 GB
    Tatsaechlich belegt: 15 x 120 GB  =  1.800 GB   ->  45 % des Pools

    Ueberbuchungsgrad:   6.000 / 4.000  =  1,5      ->  150 %

    Kipppunkt:           4.000 GB / 15 VMs  =  266,7 GB je VM
                         266,7 / 400        =  66,7 % der zugesagten Groesse
    ```

    *Teil 3 in Worten:* Der Pool ist voll, sobald die VMs **im Durchschnitt rund 267 GB** belegen – also bei zwei Dritteln ihrer zugesagten Größe. Aus Sicht jeder einzelnen VM ist zu diesem Zeitpunkt noch ein Drittel frei. Genau das macht die Überbuchung so tückisch: Der Engpass entsteht dort, wo niemand hinschaut.

    *Teil 4 – was passiert und was ins Monitoring gehört:* Läuft der Pool voll, können **alle** VMs nicht mehr schreiben – nicht nur die, die zuletzt gewachsen ist. Je nach System werden sie angehalten oder gehen in einen Nur-Lese-Zustand; im ungünstigen Fall reißt es laufende Schreibvorgänge mitten durch und beschädigt Datenbestände. Ein voll gelaufener Pool ist damit kein Speicherproblem, sondern ein Komplettausfall der Virtualisierungsumgebung.

    Ins Monitoring gehören deshalb:

    - der **tatsächliche Füllstand des Pools**, mit Alarm deutlich vor 100 % – zwei Stufen sind üblich, etwa bei 75 % und 85 %, damit noch Zeit zum Handeln bleibt
    - die **Wachstumsrate** des Pools, nicht nur der Momentwert: 45 % sind harmlos, 45 % mit fünf Prozentpunkten Zuwachs pro Woche sind es nicht
    - der **Überbuchungsgrad** selbst, damit auffällt, wenn beim Anlegen weiterer VMs unbemerkt weiter überbucht wird

    **2. Warum so?** – Thin Provisioning ist kein Trick, sondern eine sinnvolle Antwort auf eine reale Beobachtung: Virtuelle Platten werden fast nie voll genutzt. Rechne den Gegenentwurf einmal durch: Mit **Thick Provisioning** passen in diesen Pool überhaupt nur zehn dieser VMs – sie würden die vollen 4.000 GB blockieren, obwohl sie zusammen nur 1.200 GB nutzen. Thin Provisioning bringt fünfzehn VMs auf demselben Blech unter und lässt dabei immer noch 2.200 GB frei. Der Preis dafür ist, dass aus einer **garantierten** Zusage eine **wahrscheinliche** wird.

    Und genau deshalb ist Thin Provisioning kein Ersatz für Kapazitätsplanung, sondern ein Grund mehr dafür. Die Rechnung oben ist die Planung: Sie sagt dir, wie viel Luft du hast (bis 267 GB je VM) und wie schnell sie verbraucht wird. Ohne diese Zahl ist Überbuchung eine Hoffnung.

    **3. Auch gut wäre ...** – Gegenmaßnahmen zu benennen, statt nur zu warnen: den Pool erweiterbar auslegen, damit im Alarmfall Platten nachgesteckt werden können; kritische VMs bewusst **thick** anlegen, damit sie garantiert Platz haben; und beim Anlegen neuer VMs realistische Plattengrößen vergeben statt reflexhaft 400 GB. Ebenfalls stark ist der Hinweis, dass gelöschte Daten innerhalb einer VM den Pool nicht automatisch wieder freigeben – dafür braucht es ein Verfahren, das dem Speicher die freigewordenen Blöcke meldet. Ohne das wächst der belegte Platz nur in eine Richtung.

    **4. Typischer Stolperstein** – den Füllstand des Pools mit dem Füllstand der VMs zu verwechseln. „In jeder VM sind noch 280 GB frei" klingt beruhigend und ist der gefährlichste Satz in der ganzen Aufgabe. Der zweite Stolperstein ist, die Überbuchung als Fehler zu behandeln. 150 % Überbuchung sind völlig normal und wirtschaftlich sinnvoll – gefährlich wird nicht die Überbuchung, sondern die Überbuchung **ohne Monitoring**.

---

### Aufgabe 7 – Warum die VM umziehen kann

!!! info "Worum es geht"
    - Verstehen, warum **Shared Storage** die Voraussetzung für Live-Migration ist
    - Erkennen, dass der gemeinsame Speicher dabei selbst zum kritischen Punkt wird
    - Theorie dazu: [Speicherlösungen](speicherloesungen.md)

Die Agentur betreibt drei Virtualisierungs-Hosts an einem gemeinsamen SAN.

1. **Erkläre in eigenen Worten**, warum eine VM im laufenden Betrieb von Host 1 auf Host 2 wechseln kann – und was dabei überhaupt bewegt wird.
2. **Was passiert beim Ausfall eines Hosts** – einmal mit gemeinsamem Speicher, einmal, wenn die virtuellen Platten lokal auf den Hosts lägen?
3. Der gemeinsame Speicher löst zwei Probleme – **schafft aber ein neues.** Benenne es und nenne zwei Gegenmaßnahmen.

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – warum der Umzug funktioniert:* Die virtuellen Platten der VM liegen nicht auf Host 1, sondern im SAN – und Host 2 erreicht dasselbe SAN. Beim Umzug muss also **nichts von den Daten bewegt werden**. Bewegt wird nur der flüchtige Teil: der Arbeitsspeicherinhalt und der Prozessorzustand. Die werden über das Netz auf Host 2 übertragen, während die VM weiterläuft; im letzten Moment wird sie für den Bruchteil einer Sekunde angehalten, der Rest übertragen und auf Host 2 fortgesetzt. Aus Sicht der Nutzer bleibt die VM erreichbar.

    Der Merksatz dazu: **Die VM zieht um, ihre Daten nicht** – sie lagen nie auf dem Host.

    *Teil 2 – Ausfall eines Hosts:*

    | | mit gemeinsamem Speicher | mit lokalem Speicher |
    |---|---|---|
    | Wo liegen die Daten? | im SAN – der tote Host hatte sie nie | auf den Platten des ausgefallenen Hosts |
    | Was passiert? | Die VMs starten auf einem anderen Host neu. Ausfallzeit: die Dauer eines Neustarts. | Die VMs sind nicht startbar, solange der Host nicht repariert ist. Ausfallzeit: Stunden bis Tage. |
    | Datenverlust? | keiner über den letzten Schreibvorgang hinaus | möglich, je nach Defekt sogar vollständig |

    *Teil 3 – das neue Problem:* Der gemeinsame Speicher ist jetzt der **Single Point of Failure des ganzen Clusters**. Vorher konnte der Ausfall eines Hosts einen Teil der VMs treffen – jetzt trifft der Ausfall des Speichers oder seiner Anbindung **alle VMs auf allen Hosts gleichzeitig**. Zwei Gegenmaßnahmen:

    - **Redundante Pfade zum Speicher**: mehrere Netzwerkkarten beziehungsweise Adapter je Host, mehrere Switches im Speichernetz, mehrere Controller im Speichersystem – so, dass kein einzelnes Kabel und kein einzelnes Gerät den Zugang unterbricht.
    - **Redundanz im Speichersystem selbst**: RAID gegen Plattenausfälle, doppelte Netzteile, bei hohem Anspruch ein zweites Speichersystem mit Spiegelung an einen anderen Brandabschnitt.
    - Ebenfalls richtig: die Anbindung so auslegen, dass sie auch unter Last trägt – ein überlastetes Speichernetz macht sich als Langsamkeit **aller** VMs bemerkbar und ist im Betrieb schwer zu diagnostizieren.

    **2. Warum so?** – Die ganze Aufgabe hängt an einer einzigen Einsicht: **Beweglichkeit entsteht dadurch, dass die Daten stillstehen.** Solange die Platten am Host kleben, klebt auch die VM. Sobald sie an einem Ort liegen, den alle Hosts erreichen, wird der Host austauschbar – für Wartung, für Lastverteilung, im Fehlerfall.

    Dieselbe Idee kennst du aus dem Docker-Block: Ein Volume existiert unabhängig vom Container. Der Container ist wegwerfbar, die Daten leben weiter. Shared Storage ist genau dieses Prinzip eine Etage tiefer – und Teil 3 zeigt den Preis, den es überall hat: Was alle gemeinsam nutzen, fällt für alle gemeinsam aus.

    **3. Auch gut wäre ...** – anzumerken, dass für den Umzug neben dem gemeinsamen Speicher weitere Voraussetzungen erfüllt sein müssen: ausreichend schnelles Netz zwischen den Hosts, kompatible Prozessoren und ein Cluster, der die VMs überhaupt verwaltet. Live-Migration ist keine Eigenschaft des Speichers allein. Ebenfalls stark ist der Hinweis, dass es moderne Alternativen gibt, die ohne zentrales SAN auskommen: Verfahren, die die lokalen Platten aller Hosts zu einem gemeinsamen, mehrfach gespiegelten Speicher zusammenfassen. Das Prinzip bleibt dasselbe – die Daten müssen von mehr als einem Host erreichbar sein.

    **4. Typischer Stolperstein** – anzunehmen, bei der Live-Migration würden die Festplatten kopiert. Genau das passiert **nicht** – deshalb dauert der Umzug Sekunden statt Stunden. Der zweite Stolperstein ist, Shared Storage mit Hochverfügbarkeit gleichzusetzen. Er ist die **Voraussetzung** dafür, dass ein Cluster Ausfälle abfangen kann – ohne eigene Redundanz ist er aber die neue Stelle, an der alles hängt.

---

### Aufgabe 8 – Wofür taugt Objektspeicher?

!!! info "Worum es geht"
    - Objektspeicher von Datei- und Blockzugriff abgrenzen
    - Erkennen, wofür er die richtige und wofür er die falsche Wahl ist
    - Theorie dazu: [Speicherlösungen](speicherloesungen.md)

Die Agentur überlegt, Objektspeicher bei einem Cloud-Anbieter einzusetzen. **Sortiere die fünf Arbeitslasten in „geeignet" und „ungeeignet"** und begründe jeweils in einem Satz.

| Nr. | Arbeitslast |
|---|---|
| a | Die nächtlichen Sicherungen der VMs, 30 Tage aufbewahren |
| b | Das Archiv abgeschlossener Kundenprojekte, wird selten gelesen |
| c | Die Datenbank der Projektverwaltung |
| d | Das gemeinsame Laufwerk, auf dem die Grafiker den ganzen Tag Dateien öffnen und speichern |
| e | Die Auslieferung großer Bilddateien an Kunden über einen Download-Link |

**Zusatzfrage:** Warum ist Objektspeicher der natürliche „andere Ort" für ein Backup – und welche zwei Punkte muss die Agentur trotzdem im Vertrag prüfen?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Nr. | Bewertung | Begründung |
    |---|---|---|
    | a | **geeignet** | Backups werden geschrieben und selten gelesen, wachsen stetig und brauchen einen Ort außerhalb des Hauses – genau das Profil, für das Objektspeicher gebaut ist. |
    | b | **geeignet** | Ein Archiv wächst nur, wird selten angefasst und soll nie an eine Partitionsgrenze stoßen. Viele Anbieter haben für genau diesen Fall besonders günstige Archivklassen. |
    | c | **ungeeignet** | Eine Datenbank braucht Blockzugriff mit niedriger Latenz und wahlfreiem Schreiben in bestehende Dateien. Objektspeicher liefert weder das eine noch das andere. |
    | d | **ungeeignet** als direkter Ersatz | Das Tagesgeschäft der Grafiker braucht ein Dateisystem mit Ordnern, Sperren beim gleichzeitigen Bearbeiten und kurzen Antwortzeiten – dafür bleibt das NAS im Haus die richtige Wahl. |
    | e | **geeignet** | Jedes Objekt ist über eine Webschnittstelle adressierbar. Große Dateien an Kunden auszuliefern, ohne sie ins eigene Netz zu lassen, ist ein Musterfall. |

    *Zusatzfrage – warum der natürliche „andere Ort":* Ein echtes Backup braucht eine zeitversetzte Kopie an einem anderen Ort. Objektspeicher beim Anbieter erfüllt beides von selbst: Er steht außerhalb des Serverraums, läuft auf fremder Technik und wächst mit, ohne dass jemand einen Verbund erweitern muss. Dazu bieten viele Anbieter unveränderliche Ablage an – einmal geschrieben, für eine festgelegte Frist nicht löschbar. Das ist der wirksamste Schutz gegen Verschlüsselungstrojaner, den es für Sicherungen gibt.

    Zwei Punkte gehören trotzdem in den Vertrag geprüft:

    - **Kosten für das Herausholen.** Das Ablegen ist meist günstig, das Abrufen nicht immer: Viele Anbieter berechnen ausgehenden Datenverkehr und bei Archivklassen zusätzlich eine Abrufgebühr. Ein Backup, das im Ernstfall vollständig zurückgeholt wird, kann dann auf einen Schlag mehr kosten als ein Jahr Ablage.
    - **Dauer der Wiederherstellung.** Zehn Terabyte über die Internetleitung zurückzuholen dauert bei begrenzter Bandbreite Tage. Wenn die Anforderung „in vier Stunden wieder arbeitsfähig" lautet, braucht es zusätzlich eine lokale Kopie – die Cloud-Kopie ist dann die zweite Verteidigungslinie, nicht die erste.

    **2. Warum so?** – Der Unterschied lässt sich auf eine Zeile bringen: **Objektspeicher ist für Dinge gebaut, die abgelegt und als Ganzes wieder geholt werden – nicht für Dinge, in denen ständig herumgeschrieben wird.** Ein Objekt wird geschrieben, gelesen, ersetzt oder gelöscht. Es wird nicht an Position 4.096 um zwölf Byte geändert, während drei andere Prozesse dieselbe Datei geöffnet haben. Genau das aber tun Datenbanken und Arbeitsdateien den ganzen Tag.

    Daraus folgt die Einordnung im Gesamtbild: Block (SAN) für Datenbanken und virtuelle Maschinen, Datei (NAS) für die tägliche Zusammenarbeit, Objekt für alles, was nur noch mehr wird und selten angefasst wird. In hybriden Architekturen ist genau das das übliche Muster – die schnellen, aktiven Daten liegen im Haus, die Sicherungen und Archive wandern als Objekte in die Cloud.

    **3. Auch gut wäre ...** – bei Fall d anzumerken, dass die Grenze in der Praxis weicher ist: Es gibt Werkzeuge, die Objektspeicher wie ein Laufwerk einbinden. Es gibt Dienste, die eine lokale Zwischenspeicherung davorschalten. Für ein Grafikteam mit großen Dateien bleibt die Latenz aber der begrenzende Faktor – solange die Aufgabe die tägliche Arbeit meint, ist die Antwort „ungeeignet" richtig. Ebenfalls stark ist der Hinweis, dass bei Fall e die **Zugriffskontrolle** mitgeplant werden muss: Ein öffentlich erreichbarer Link ist bequem und liegt genauso lange offen, wie ihn niemand zurückzieht – zeitlich begrenzte Links sind der übliche Weg.

    **4. Typischer Stolperstein** – Objektspeicher für „Cloud-Speicher" schlechthin zu halten und ihm alles zuzuweisen, was in die Cloud soll. Cloud-Anbieter liefern alle drei Formen: Blockspeicher für virtuelle Maschinen, Dateidienste für Freigaben und Objektspeicher für Ablage. Die Wahl richtet sich nach der Zugriffsart, nicht danach, wo das Gerät steht. Der zweite Stolperstein ist, Objektspeicher automatisch für die billigste Variante zu halten. Pro Gigabyte Ablage stimmt das oft – die Rechnung entscheidet sich aber daran, wie viel wieder herausgeholt wird.

---

## Was du jetzt kannst

Wer diese acht Aufgaben durchgearbeitet hat, plant Speicher belastbar statt nach Gefühl: Du rechnest Kapazität über den Planungshorizont mit exponentiellem Wachstum, machst aus dem Netto-Bedarf einen konkreten Einkauf und weißt, warum das System hinterher weniger anzeigt, als auf der Rechnung steht. Du wählst RAID-Level nach Einsatzzweck – inklusive der Fälle, in denen RAID 0 richtig und RAID 5 riskant ist – und kannst für jeden Schadensfall sagen, ob RAID, das Backup oder keines von beidem hilft. Du ordnest DAS, NAS und SAN über die Zugriffsart zu, rechnest eine Überbuchung bis zum Kipppunkt durch, erklärst Live-Migration über den gemeinsamen Speicher und setzt Objektspeicher dort ein, wo er stark ist.

!!! tip "Weiter geht es"
    Der nächste Themenblock ist [Ressourcen planen](ressourcen-planen.md) – mit eigenem Aufgabensatz unter [Übungen: Ressourcen planen](uebungen-ressourcen.md). Wie sich Speicherentscheidungen im großen Szenario auswirken, zeigen die [Übungsaufgaben](uebungen.md) zur TransRegio Spedition.
