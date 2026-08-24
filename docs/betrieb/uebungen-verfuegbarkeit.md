---
title: "Übungen: Verfügbarkeit & Datensicherung"
description: "Gruppenübung für Kleingruppen: Für die Systemlandschaft eines Medizintechnikbetriebs entwickelt ihr aus Stillstandskosten die Kritikalität, legt RTO und RPO je System fest, findet die Single Points of Failure, rechnet die Verfügbarkeitskette im Ist- und im Sollzustand, wählt aus einem Maßnahmenkatalog ein Paket innerhalb eines Budgets aus, entwerft Backupkonzept und Wiederanlaufreihenfolge und begründet jede Entscheidung. Mit Hilfekarten, zwei durchgerechneten Lösungsvarianten und Reflexionsfragen."
---

# Übungen – Verfügbarkeit & Datensicherung

<span class='badge badge-praxis'>Gruppenarbeit</span> &nbsp; Eine zusammenhängende Fallaufgabe für **Kleingruppen von drei bis fünf Personen**, ausgelegt auf **60 bis 90 Minuten**. Ihr braucht nichts als das Szenario, Papier und die Bereitschaft, eure Zahlen zu verteidigen.

Die Aufgabe bildet nach, was in der Prüfung verlangt wird: Aus einer betrieblichen Situation entwickelt ihr **eigenständig eine Lösung** und begründet sie. Es gibt deshalb nicht die eine richtige Antwort. Es gibt Antworten, die man mit Zahlen begründen kann, und Antworten, die man nicht begründen kann – und genau darin liegt der Unterschied.

Die fachliche Grundlage steht auf zwei Seiten: [Hochverfügbarkeit & Redundanz](hochverfuegbarkeit.md) und [Backup & Recovery](backup-und-recovery.md). Wer die Formeln nicht im Kopf hat, schlägt dort nach – das ist ausdrücklich erlaubt und in der Praxis der Normalfall.

!!! info "Alle Zahlen sind Beispielwerte"
    Stillstandskosten, Verfügbarkeiten und Preise in dieser Aufgabe sind erfunden, aber plausibel gewählt. In der Praxis kommen sie aus Störungsstatistiken, Angeboten und Gesprächen mit den Fachabteilungen – und bleiben auch dort Schätzungen. Geübt wird das Verfahren, nicht das Auswendiglernen von Zahlen.

---

## Rollen und Ablauf

Verteilt am Anfang die Rollen. Bei vier Personen passt das so:

| Rolle | Aufgabe |
|---|---|
| **Moderation** | hält die Gruppe an der Aufgabe, achtet darauf, dass alle zu Wort kommen |
| **Rechnen** | führt die Verfügbarkeits- und Kostenrechnungen aus, schreibt die Rechenwege mit |
| **Protokoll** | hält Entscheidungen **und Begründungen** fest – die Begründung ist das eigentliche Ergebnis |
| **Vortrag** | bereitet die Vorstellung im Plenum vor, achtet auf die Zeit |

Bei drei Personen übernimmt die Moderation zusätzlich das Protokoll, bei fünf teilt sich das Rechnen auf zwei Personen auf.

**Zeiteinteilung für 90 Minuten** (Richtwerte, passt sie an):

```text
10 Min   Rollen verteilen, Szenario gemeinsam lesen
15 Min   Teil A  Kritikalität, RTO und RPO je System
20 Min   Teil B  Single Points of Failure und Verfügbarkeitskette
25 Min   Teil C  Maßnahmenpaket im Budget
10 Min   Teil D  Backupkonzept und Wiederanlaufreihenfolge
10 Min   Vorstellung vorbereiten: drei Kernaussagen
```

**Kurzfassung für 60 Minuten:** Teile A, B und C vollständig, Teil D auf die Wiederanlaufreihenfolge beschränken.

---

## Das Szenario

### Der Betrieb

Die **Aurach Medizintechnik GmbH** entwickelt und fertigt Bauteile für medizinische Geräte. 240 Beschäftigte, ein Betriebsgelände mit zwei Gebäuden: dem **Hauptwerk** mit Fertigung, Lager und Serverraum sowie dem rund 300 Meter entfernten **Verwaltungsgebäude** mit Konstruktion, Vertrieb und Buchhaltung. Beide Gebäude sind über eine eigene Glasfaser verbunden.

Die Fertigung läuft im **Zweischichtbetrieb** an fünf Tagen der Woche, insgesamt rund **3.680 Betriebsstunden im Jahr** (230 Produktionstage zu je 16 Stunden). Das entspricht **42 Prozent** der 8.760 Kalenderstunden – eine Zahl, die ihr noch brauchen werdet.

Der Betrieb ist Zulieferer für Medizingerätehersteller. Lieferverzug führt zu Vertragsstrafen, und Kunden verlangen zunehmend Nachweise über Ausfallsicherheit und Datensicherung, bevor sie neue Rahmenverträge abschließen. Die Geschäftsführung hat deshalb ein Budget freigegeben: **120.000 Euro einmalig** und **40.000 Euro jährlich** für Betrieb, Wartung und Verträge. Mehr gibt es nicht.

### Die Systeme

| Nr. | System | Wofür | Nutzer | Stillstandskosten je **Betriebs**stunde | Datenbestand | Änderung je Tag |
|---|---|---|---|---|---|---|
| **S1** | MES / Fertigungssteuerung | Fertigungsaufträge, Maschinendaten, Rückmeldungen | 90 in der Fertigung | **4.500 €** | 800 GB | 25 GB |
| **S2** | ERP / Warenwirtschaft | Einkauf, Lager, Versand, Rechnungsstellung | 70 | **2.200 €** | 1.200 GB | 30 GB |
| **S3** | Dateiserver Konstruktion | CAD-Zeichnungen, Stücklisten, Prüfprotokolle | 25 | **900 €** | 3.000 GB | 60 GB |
| **S4** | Verzeichnisdienst, DNS, DHCP | Anmeldung, Namensauflösung, Adressvergabe | alle | ohne ihn steht alles | 40 GB | 1 GB |
| **S5** | E-Mail und Groupware | Kommunikation, Termine, Kundenanfragen | 200 | **700 €** | 900 GB | 20 GB |
| **S6** | Kundenportal | Ersatzteilbestellungen von Kunden | extern | **600 €** | 150 GB | 5 GB |
| **S7** | Telefonanlage (VoIP) | Servicehotline, gesamte Telefonie | alle | **800 €** | – | – |
| **S8** | Zeiterfassung | Kommen und Gehen, Zuschläge, Urlaubskonten | alle | **80 €** | 60 GB | 2 GB |

Gesamter Datenbestand rund **6.150 GB**, tägliche Änderungsmenge rund **143 GB**.

### Die Infrastruktur, so wie sie heute ist

- **Serverraum** im Untergeschoss des Hauptwerks. Ein Raum, ein Brandabschnitt. Neben dem Raum verläuft die Hauptwasserleitung des Gebäudes.
- **Zwei Virtualisierungshosts.** Die MES-Maschine läuft fest auf Host 1; für einen automatischen Failover fehlen Lizenzen und ein dritter Host als Reserve.
- **Ein NAS** mit RAID 6 als gemeinsamer Speicher für alle virtuellen Maschinen.
- **Ein Core-Switch**, an dem beide Hosts, das NAS und die Verbindung ins Verwaltungsgebäude hängen.
- **Ein Internetanschluss** eines einzigen Anbieters, eine Hauseinführung.
- **Eine USV** mit ursprünglich 15 Minuten Autonomiezeit; die Batterien sind sechs Jahre alt und wurden nie unter Last geprüft. Eine Netzersatzanlage gibt es nicht.
- **Ein Klimagerät** (Split-Anlage). Der Wartungsvertrag ist vor zwei Jahren ausgelaufen und wurde nicht verlängert.
- **Sicherung:** nächtlich auf ein zweites NAS **im selben Raum**. Einmal wöchentlich kopiert der Administrator die Sicherung zusätzlich auf eine Wechselplatte und nimmt sie unverschlüsselt mit nach Hause.
- Der **Backupserver ist Mitglied der Produktivdomäne**, sein Dienstkonto ist Domänenadministrator.
- **Restore-Tests:** Auf Nachfrage kann niemand sagen, wann zuletzt etwas zurückgespielt wurde. Die täglichen Sicherungsberichte sind grün.
- **Betreut wird alles von einer Person**, dem Systemadministrator. Ein Auszubildender hilft bei Arbeitsplatzthemen.
- **Herstellersupport:** Für Hosts und NAS besteht ein Vertrag mit Reaktion am nächsten Werktag (5×9).
- Das **Sicherungsnetz** ist heute mit 1 Gbit/s angebunden; effektiv sind rund **100 MB/s** erreichbar. Ein Wiederherstellungsvorgang vom lokalen Backup-NAS schafft rund **200 MB/s**.
- Sicherungsfenster: nachts stehen rund **7 Stunden** zur Verfügung, am Wochenende rund **30 Stunden**.

### Ausgangswerte für die Verfügbarkeitskette

Für das MES (S1) hat die IT folgende Einzelverfügbarkeiten geschätzt. Alle Glieder müssen gleichzeitig funktionieren, damit in der Fertigung gearbeitet werden kann.

| Glied der Kette | Heutiger Zustand | Verfügbarkeit |
|---|---|---|
| Stromversorgung (Netz + USV, keine Netzersatzanlage) | einfach | 99,95 % |
| Klimatisierung (ein Gerät, Wartung ausgelaufen) | einfach | 99,80 % |
| Core-Switch | einfach | 99,95 % |
| Virtualisierungshost (MES fest auf Host 1) | einfach | 99,80 % |
| Speicher (ein NAS) | einfach | 99,95 % |
| MES-Anwendung selbst | – | 99,90 % |

### Der Maßnahmenkatalog

Aus diesen Maßnahmen dürft ihr auswählen. Die Preise sind gerundete Beispielwerte.

| Kürzel | Maßnahme | Einmalig | Jährlich |
|---|---|---|---|
| **M1** | Zweiter Core-Switch als Stack, redundante Verkabelung zu Hosts und Speicher | 14.000 € | 1.500 € |
| **M2** | Zweites Netzteil je Server, zweiter Stromkreis, A/B-Speisung im Rack | 9.000 € | 500 € |
| **M3** | Dritter Virtualisierungshost, Clusterlizenzen, automatischer Failover (N+1) | 28.000 € | 3.500 € |
| **M4** | Zweite Internetanbindung, anderer Anbieter, zweite Hauseinführung | 4.000 € | 6.000 € |
| **M5** | Netzersatzanlage inklusive Einbau, Tank und jährlichem Lasttest | 45.000 € | 3.000 € |
| **M6** | USV-Erweiterung auf 30 Minuten, neue Batterien, Wartungs- und Lasttestvertrag | 8.000 € | 1.200 € |
| **M7** | Zweites Klimagerät (N+1), getrennte Stromkreise, Temperaturüberwachung mit Alarm | 18.000 € | 1.500 € |
| **M8** | Zweiter Brandabschnitt im Verwaltungsgebäude: Rack, Glasfaser, Zweitspeicher mit asynchroner Replikation | 35.000 € | 4.000 € |
| **M9** | Backupsoftware mit unveränderlichem Repository und Cloudziel außer Haus | 12.000 € | 9.000 € |
| **M10** | Bandlaufwerk, Bandsatz und Bankschließfach für eine monatliche Offline-Kopie | 11.000 € | 2.400 € |
| **M11** | Herstellersupport für Hosts und Speicher auf 24×7×4 anheben | – | 9.500 € |
| **M12** | Ersatzteilschrank vor Ort: Netzteile, Datenträger, vorkonfigurierter Ersatz-Switch | 9.000 € | 800 € |
| **M13** | Monitoring mit Alarmierung und Rufbereitschaft über einen Dienstleister | 6.000 € | 7.000 € |
| **M14** | Isolierte Testumgebung für quartalsweise Restore-Tests | 3.000 € | 2.500 € |
| **M15** | Ausweichrechenzentrum bei einem Dienstleister, rund 220 km entfernt, asynchrone Replikation | 60.000 € | 48.000 € |

---

## Eure Aufgabe

### Teil A – Kritikalität, RTO und RPO

1. **Ordnet die acht Systeme nach Kritikalität** in vier Stufen: sehr hoch, hoch, mittel, gering. Nutzt dafür die Stillstandskosten – aber nicht nur. Begründet jede Einstufung in einem Satz.
2. **Legt für jedes System eine RTO und eine RPO fest.** Schreibt zu jeder Zahl die Begründung aus Sicht des Geschäfts dazu, nicht aus Sicht der Technik.
3. Ein System in der Tabelle hat eine **kurze RTO und eine lange RPO**. Findet es und erklärt, warum diese Kombination sinnvoll ist.

### Teil B – Single Points of Failure und die Verfügbarkeitskette

4. **Findet die Single Points of Failure** in der beschriebenen Infrastruktur. Sucht auf allen Ebenen: Strom, Kühlung, Netz, Server, Speicher, Daten, Anbieter, Mensch, Standort. Mindestens acht sollten zusammenkommen.
5. **Rechnet die Verfügbarkeitskette für das MES im Ist-Zustand.** Wie hoch ist die Gesamtverfügbarkeit, wie viele Ausfallstunden je Jahr ergeben sich daraus?
6. **Rechnet die erwarteten Stillstandskosten je Jahr** für das MES. Denkt daran, dass nur ein Teil der Kalenderstunden Betriebszeit ist.
7. **Welches Glied verursacht die meisten Ausfallstunden?** Begründet eure Antwort mit Zahlen, nicht mit Gefühl.

### Teil C – Das Maßnahmenpaket

8. **Wählt ein Paket aus dem Katalog**, das in beide Budgets passt: höchstens 120.000 Euro einmalig und höchstens 40.000 Euro jährlich. Schreibt die Summen auf.
9. **Rechnet die Verfügbarkeitskette für das MES nach eurem Paket erneut.** Legt dafür fest, welche neuen Werte die verbesserten Glieder erreichen, und begründet die Annahme kurz.
10. **Rechnet die Wirtschaftlichkeit:** Wie viele Ausfallstunden spart ihr, was ist das in Euro wert, und was kostet euer Paket jährlich (verteilt die einmaligen Kosten auf fünf Jahre)?
11. **Begründet drei Maßnahmen, die ihr bewusst nicht gewählt habt**, und benennt das Restrisiko, das dadurch bestehen bleibt.

### Teil D – Sicherung und Wiederanlauf

12. **Entwerft das Backupkonzept** in Stichpunkten: Was wird wann gesichert, wohin, wie lange aufbewahrt, wer darf was, wie wird getestet? Prüft am Ende, ob ihr 3-2-1-1-0 erfüllt.
13. **Rechnet nach, ob eure Sicherungsläufe in die Fenster passen** – Vollsicherung und tägliche Sicherung.
14. **Legt die Wiederanlaufreihenfolge** für den Fall fest, dass nach einem Stromausfall alle Systeme neu gestartet werden müssen. Nennt zu drei Schritten, warum genau diese Reihenfolge zwingend ist.

### Für die Vorstellung im Plenum

Bereitet **drei Kernaussagen** vor:

1. Der teuerste Single Point of Failure und was er kostet.
2. Euer Maßnahmenpaket in einem Satz – und die eine Maßnahme, über die ihr am längsten gestritten habt.
3. Das größte Restrisiko, das ihr bewusst in Kauf nehmt, und warum.

---

## Hilfekarten

Klappt eine Karte erst auf, wenn ihr wirklich feststeckt – und dann nur die eine, die zu eurem Problem passt.

??? tip "Hilfekarte 1 – Wir wissen nicht, wo wir anfangen sollen"
    Fangt nicht bei der Technik an, sondern beim Geld. Sortiert die acht Systeme nach ihren Stillstandskosten je Betriebsstunde. Die Reihenfolge, die dabei herauskommt, ist eure Arbeitsreihenfolge für den ganzen Rest der Aufgabe.

    Achtet auf zwei Systeme, die in dieser Sortierung falsch landen:

    - **S4 (Verzeichnisdienst, DNS, DHCP)** hat gar keinen eigenen Stillstandswert – aber ohne ihn meldet sich niemand an und keine Anwendung findet ihre Datenbank. Sein Ausfall zieht **alle anderen** mit. Solche Systeme heißen Basisdienste und werden nach ihrer Wirkung eingestuft, nicht nach ihrem eigenen Preis.
    - **S7 (Telefonanlage)** kostet weniger als das ERP – aber die Servicehotline ist für Kunden die einzige Stimme des Betriebs. Fragt euch, ob es dafür einen Notbetrieb gibt (Umleitung auf Mobilnummern) und wie schnell er greift.

??? tip "Hilfekarte 2 – Wie rechnet man die Verfügbarkeitskette?"
    Zwei Formeln, mehr braucht ihr nicht.

    **In Reihe** (alle Glieder müssen gleichzeitig laufen) – multiplizieren:

    ```text
    A_gesamt = A_1 x A_2 x ... x A_n
    ```

    **Parallel** (eines reicht) – die Nichtverfügbarkeiten multiplizieren:

    ```text
    A_parallel = 1 - (1 - A_1) x (1 - A_2)
    ```

    **Von Prozent zu Stunden:**

    ```text
    Ausfallzeit je Jahr = 8.760 h x (100 % - Verfuegbarkeit)
    ```

    **Der Abkürzungstrick:** Rechnet für jedes Glied einzeln die Ausfallstunden aus und addiert sie. Bei hohen Verfügbarkeiten stimmt das Ergebnis bis auf Rundungsfehler mit der Multiplikation überein – und ihr seht sofort, **welches Glied die Stunden verursacht**.

    ```text
    99,95 %  ->  8.760 x 0,0005  =   4,38 h
    99,90 %  ->  8.760 x 0,001   =   8,76 h
    99,80 %  ->  8.760 x 0,002   =  17,52 h
    99,99 %  ->  8.760 x 0,0001  =   0,88 h
    ```

??? tip "Hilfekarte 3 – Wir setzen überall dieselbe RTO und RPO"
    Wenn alle acht Systeme dieselben Zielwerte bekommen, habt ihr die Aufgabe umgangen. Der Sinn der Staffelung ist, an sechs Stellen zu sparen, um an zwei Stellen ernsthaft investieren zu können.

    Stellt für jedes System diese zwei Fragen, und zwar in dieser Reihenfolge:

    1. **„Was tut der Fachbereich in der ersten Stunde ohne dieses System – und was in der vierten?"** Fast immer gibt es einen Notbehelf: Papierlisten, Telefon, lokale Kopien, Nacherfassung. Wie lange er trägt, ist die maximal tolerierbare Ausfallzeit. Die RTO liegt spürbar darunter.
    2. **„Wie viel Arbeit darf verloren gehen?"** Ein Fertigungsauftrag der laufenden Schicht: fast nichts. Eine Zeitbuchung: ein Tag, die trägt man nach. Das ist die RPO.

    Prüft am Ende: Steht bei mindestens einem System eine RTO von mehr als 24 Stunden? Wenn nicht, wart ihr vermutlich zu vorsichtig.

??? tip "Hilfekarte 4 – Das Budget reicht hinten und vorne nicht"
    Das ist beabsichtigt. Der Katalog enthält Maßnahmen für weit über 260.000 Euro einmalig – ihr habt 120.000. Drei Werkzeuge helfen beim Sortieren:

    1. **Zwei Budgets getrennt führen.** Manche Maßnahmen sind einmalig teuer und laufend billig (M5, M8), andere umgekehrt (M11, M15). M15 allein sprengt mit 48.000 Euro schon das gesamte Jahresbudget – damit ist es raus, ohne dass ihr darüber diskutieren müsst.
    2. **Nach gesparten Ausfallstunden je Euro sortieren.** Schaut in eure Kettenrechnung: Welches Glied verursacht die meisten Stunden? Die Maßnahme, die dort ansetzt, bringt am meisten. Eine Maßnahme, die ein Glied von 99,95 auf 99,99 Prozent hebt, spart 3,5 Stunden im Jahr – eine, die 99,80 auf 99,99 hebt, spart 16,6.
    3. **Billige Maßnahmen mit großer Wirkung zuerst.** M12 (Ersatzteile vor Ort) und M13 (Monitoring mit Alarmierung) verkürzen die MTTR bei **allen** Ausfallursachen gleichzeitig und kosten wenig. M14 (Restore-Test) macht aus einer Vermutung einen Nachweis. Solche Maßnahmen stehen fast immer weit oben.

??? tip "Hilfekarte 5 – Unser Backupkonzept ist ein Satz lang"
    Ein vollständiges Konzept beantwortet sechs Fragen. Geht sie der Reihe nach durch:

    | Frage | Was hineingehört |
    |---|---|
    | **Was?** | welche Systeme und Daten – und was ausdrücklich nicht |
    | **Wie oft?** | ergibt sich aus der RPO. Bei 15 Minuten reicht kein nächtlicher Lauf – dann braucht ihr Transaktionsprotokolle |
    | **Wohin?** | mindestens drei Ziele: schnell und lokal, außer Haus, unveränderlich oder offline |
    | **Wie lange?** | Generationen nach Großvater-Vater-Sohn, abgestimmt mit der Buchhaltung |
    | **Wer darf?** | Sichern, Wiederherstellen und Löschen sind drei getrennte Berechtigungen |
    | **Wie geprüft?** | Rhythmus der Restore-Tests, isoliertes Netz, gemessene RTA, Protokoll |

    Und die Prüffrage danach: **Welches einzelne Ereignis vernichtet Original und Sicherung gleichzeitig?** Im Ist-Zustand des Szenarios gibt es davon mindestens zwei.

??? tip "Hilfekarte 6 – Wir sind fertig, aber es fühlt sich dünn an"
    Dann fehlt vermutlich die Begründung, nicht die Lösung. Prüft jede Maßnahme gegen vier Fragen:

    1. **Gegen welches Risiko** wirkt sie? Ein Satz nach dem Muster „Weil …, kann …, wodurch …".
    2. **An welchem Glied** der Kette setzt sie an – und um wie viele Stunden verschiebt sie es?
    3. **Was kostet sie**, einmalig und jährlich?
    4. **Was bleibt danach übrig?** Jede Maßnahme lässt ein Restrisiko stehen. Wer es benennen kann, hat verstanden, was er gekauft hat.

    Und noch eine Ergänzung, die Gruppen oft vergessen: Zwei der schwersten Schwachstellen im Szenario kosten **gar kein Geld** – dass der Backupserver in derselben Domäne hängt und dass nur eine Person das ganze Verfahren kennt. Beides steht in keinem Katalogpreis und gehört trotzdem in eure Lösung.

---

## Musterlösung

!!! warning "Erst selbst lösen"
    Diese Lösung ist ausführlich, weil sie in der gemeinsamen Auswertung als Vergleichsmaßstab dient. Wenn eure Zahlen abweichen, ist das nicht automatisch falsch – entscheidend ist, ob ihr sie begründen könnt.

### Teil A – Kritikalität, RTO und RPO

**Aufgabe 1 und 2 – die Einstufung:**

| System | Kritikalität | RTO | RPO | Begründung aus dem Geschäft |
|---|---|---|---|---|
| **S1** MES | sehr hoch | **4 h** | **15 min** | Teuerstes System je Stunde. Die Fertigungsaufträge der laufenden Schicht dürfen nicht verloren gehen – sonst müssen Maschinenbelegung und Rückmeldungen von Hand rekonstruiert werden, was länger dauert als der Ausfall selbst. |
| **S4** Verzeichnisdienst, DNS, DHCP | sehr hoch | **2 h** | **24 h** | Basisdienst: Ohne ihn meldet sich niemand an und keine Anwendung findet ihre Datenbank. Sein Ausfall summiert die Stillstandskosten **aller** anderen Systeme. Die Daten selbst ändern sich dagegen kaum. |
| **S2** ERP | hoch | **8 h** | **1 h** | Versand und Rechnungsstellung lassen sich einen halben Tag mit Lieferscheinen und Listen überbrücken. Erfasste Aufträge und Buchungen dürfen dabei nicht verloren gehen. |
| **S7** Telefonanlage | hoch | **4 h** | – | Keine Nutzdaten, deshalb keine RPO. Aber die Servicehotline ist die einzige Stimme gegenüber Kunden. Notbetrieb: Umleitung auf Mobilnummern – der muss innerhalb der RTO stehen und **vorher geübt** sein. |
| **S3** Dateiserver Konstruktion | hoch | **8 h** | **4 h** | Die Konstruktion arbeitet mit lokalen Kopien einen Arbeitstag weiter. Vier Stunden verlorene Konstruktionsarbeit sind nacharbeitbar, aber teuer. |
| **S5** E-Mail | mittel | **8 h** | **1 h** | Kommunikation läuft übergangsweise über Telefon und Mobilgeräte. Eingehende Kundenanfragen dürfen nicht verschwinden – sie sind oft die einzige Spur eines Auftrags. |
| **S6** Kundenportal | mittel | **24 h** | **1 h** | Ein Tag ohne Portal ist unangenehm, aber Bestellungen kommen ersatzweise per Telefon und E-Mail. Bereits eingegangene Bestellungen dürfen nicht verloren gehen. |
| **S8** Zeiterfassung | gering | **72 h** | **24 h** | Erfassung von Hand ist möglich und üblich. Ein Tag Buchungen lässt sich nachtragen. |

**Aufgabe 3 – kurze RTO, lange RPO:** Das ist **S4**, der Verzeichnisdienst. Die Kombination wirkt widersprüchlich, ist aber genau richtig:

- **Kurze RTO**, weil der Ausfall alles andere blockiert. Zwei Stunden ohne Anmeldung sind zwei Stunden ohne jedes System.
- **Lange RPO**, weil sich Benutzerkonten, Gruppen und DNS-Einträge selten ändern. Ein Stand von gestern ist praktisch derselbe wie der von heute.

Und daraus folgt die eigentliche Erkenntnis: **Ein Verzeichnisdienst wird nicht durch schnelles Zurückspielen abgesichert, sondern durch einen zweiten Domänencontroller.** Die Wiederherstellung ist hier der Notnagel, nicht der Plan – zumal die Wiederherstellung eines Verzeichnisdienstes aus der Sicherung zu den heikelsten Vorgängen überhaupt gehört. Ein zweiter Domänencontroller im Verwaltungsgebäude kostet fast nichts und steht in keinem Katalogpreis.

### Teil B – Single Points of Failure und Kette

**Aufgabe 4 – die SPOF-Liste:**

| Ebene | Single Point of Failure | Was ihn auslöst |
|---|---|---|
| **Standort** | ein Serverraum, ein Brandabschnitt, im Untergeschoss neben der Hauptwasserleitung | Brand, Rohrbruch, Rückstau, gesperrter Zutritt |
| **Strom** | eine USV mit sechs Jahre alten, nie unter Last geprüften Batterien; keine Netzersatzanlage | Stromausfall länger als wenige Minuten |
| **Kühlung** | ein Klimagerät ohne Wartungsvertrag | Verdichterschaden, Sommertag, ausgefallene Wartung |
| **Netz intern** | ein Core-Switch für Hosts, Speicher und Gebäudeverbindung | Gerätedefekt, Netzteil, Konfigurationsfehler |
| **Netz extern** | ein Internetanbieter, eine Hauseinführung | Bagger auf dem Gelände, Störung beim Anbieter |
| **Server** | MES fest auf Host 1, kein Failover | Hostdefekt – die wichtigste Anwendung ist die einzige ohne Ausweichmöglichkeit |
| **Speicher** | ein NAS für alle virtuellen Maschinen | Controllerdefekt, Dateisystemfehler, Fehlbedienung |
| **Sicherung – Ort** | Backup-NAS **im selben Raum** wie das Original | jedes Standortereignis vernichtet beides gleichzeitig |
| **Sicherung – Rechte** | Backupserver in der Produktivdomäne, Dienstkonto Domänenadministrator | ein kompromittiertes Konto reicht, um Produktivdaten **und** Sicherungen zu vernichten |
| **Sicherung – Nachweis** | kein bekannter Restore-Test | die Wiederherstellbarkeit ist nicht belegt, sondern vermutet |
| **Datenschutz** | unverschlüsselte Wechselplatte in einer Privatwohnung | Verlust oder Diebstahl wäre eine meldepflichtige Datenschutzverletzung |
| **Mensch** | eine Person kennt das gesamte Verfahren | Krankheit, Urlaub, Kündigung – und der Auszubildende kann nicht einspringen |
| **Vertrag** | Reaktion erst am nächsten Werktag (5×9) | Ein Ausfall am Freitagabend bleibt bis Montag ein Ausfall |

Zwei Einträge stechen heraus, weil sie **keinen Cent kosten**: die Domänenmitgliedschaft des Backupservers und das Wissensmonopol. Eine Lösung, die diese beiden übersieht, hat den teuersten Teil der Aufgabe verpasst.

**Aufgabe 5 – die Kette im Ist-Zustand:**

```text
0,9995 x 0,9980 x 0,9995 x 0,9980 x 0,9995 x 0,9990  =  0,993516

  Gesamtverfuegbarkeit                    =  99,3516 %
  Ausfallzeit  8.760 x 0,006484           =  rund 56,8 Stunden je Jahr
```

Gegenprobe über die Addition der Ausfallstunden:

```text
Strom       99,95 %  ->   4,38 h
Klima       99,80 %  ->  17,52 h
Switch      99,95 %  ->   4,38 h
Host        99,80 %  ->  17,52 h
Speicher    99,95 %  ->   4,38 h
Anwendung   99,90 %  ->   8,76 h
                        --------
Summe                    56,94 h   (Multiplikation: 56,8 h)
```

Beachtenswert: **Kein einziges Glied ist schlecht** – und trotzdem landet die Kette bei 99,35 Prozent, also schlechter als jedes Glied für sich. Das ist die Kernaussage der Reihenschaltung.

**Aufgabe 6 – die erwarteten Stillstandskosten:**

```text
Ausfallstunden je Jahr (Kalenderzeit)              =  56,8 h
Anteil Betriebszeit  3.680 / 8.760                 =  42 %
Ausfall waehrend der Betriebszeit  56,8 x 0,42     =  rund 23,9 h
Stillstandskosten  23,9 h x 4.500 EUR              =  rund 108.000 EUR je Jahr
```

Diese Zahl allein trägt die gesamte Investitionsdiskussion: Der Ist-Zustand kostet für **ein einziges System** rund 108.000 Euro im Jahr an erwarteten Ausfallkosten – fast so viel wie das gesamte einmalige Budget.

!!! note "Warum die Umrechnung auf die Betriebszeit wichtig ist"
    Wer mit den vollen 56,8 Stunden rechnet, kommt auf 255.600 Euro und überschätzt den Schaden deutlich – ein Ausfall um drei Uhr nachts kostet die Fertigung nichts. Wer umgekehrt nur mit den Betriebsstunden als Bezugsgröße rechnet, unterschlägt, dass ein nächtlicher Ausfall bis in die Frühschicht hineinreichen kann. Die 42-Prozent-Rechnung ist eine vertretbare Näherung – **wichtig ist, dass ihr die Annahme aufschreibt.**

**Aufgabe 7 – das schwächste Glied:** Es sind **zwei gleich schwere**: die Klimatisierung und der Virtualisierungshost mit je 17,52 Stunden. Zusammen verursachen sie 35 der 57 Stunden, also rund 62 Prozent. Die Anwendung folgt mit 8,76 Stunden.

Daraus folgt unmittelbar die Priorität für Teil C: Jede Maßnahme, die an Klima oder Host ansetzt, wirkt mehr als doppelt so stark wie eine Maßnahme am Switch, am Speicher oder am Strom.

### Teil C – das Maßnahmenpaket

**Aufgabe 8 – Variante A: Komponentenausfälle zuerst**

| Kürzel | Maßnahme | Einmalig | Jährlich |
|---|---|---|---|
| M1 | Zweiter Core-Switch als Stack | 14.000 € | 1.500 € |
| M2 | A/B-Speisung, zweites Netzteil je Server | 9.000 € | 500 € |
| M3 | Dritter Host, Cluster N+1 mit Failover | 28.000 € | 3.500 € |
| M6 | USV auf 30 Minuten, neue Batterien, Lasttestvertrag | 8.000 € | 1.200 € |
| M7 | Zweites Klimagerät (N+1) mit Alarm | 18.000 € | 1.500 € |
| M9 | Unveränderliches Backup-Repository + Cloudziel | 12.000 € | 9.000 € |
| M10 | Band und Bankschließfach für die Offline-Kopie | 11.000 € | 2.400 € |
| M11 | Herstellersupport 24×7×4 | – | 9.500 € |
| M12 | Ersatzteilschrank vor Ort | 9.000 € | 800 € |
| M13 | Monitoring mit Alarmierung und Rufbereitschaft | 6.000 € | 7.000 € |
| M14 | Isolierte Testumgebung für Restore-Tests | 3.000 € | 2.500 € |
| | **Summe** | **118.000 €** | **39.400 €** |

Beide Budgets sind eingehalten; es bleiben 2.000 Euro einmalig und 600 Euro jährlich als Reserve.

**Aufgabe 9 – die Kette nach Variante A:**

| Glied | Ist | Soll | Begründung der Annahme |
|---|---|---|---|
| Strom | 99,95 % | **99,97 %** | Geprüfte Batterien und 30 Minuten Autonomie fangen kurze Ausfälle sicher ab. Ohne Netzersatzanlage bleibt der lange Ausfall eine offene Lücke – deshalb kein höherer Wert. |
| Klimatisierung | 99,80 % | **99,99 %** | N+1: Ein Gerät darf ausfallen oder gewartet werden. Nicht höher, weil beide Geräte im selben Raum stehen und teilweise dieselben Ursachen teilen. |
| Core-Switch | 99,95 % | **99,99 %** | Stack aus zwei Geräten. Nicht höher wegen gemeinsamer Firmware und gemeinsamer Konfiguration. |
| Host | 99,80 % | **99,99 %** | Cluster N+1 mit automatischem Failover; das MES ist nicht mehr an ein Gerät gebunden. |
| Speicher | 99,95 % | **99,95 %** | **unverändert** – es bleibt bei einem NAS |
| Anwendung | 99,90 % | 99,90 % | unverändert; Software wird durch Hardware nicht besser |

```text
0,9997 x 0,9999 x 0,9999 x 0,9999 x 0,9995 x 0,9990  =  0,997902

  Gesamtverfuegbarkeit                    =  99,7902 %
  Ausfallzeit  8.760 x 0,002098           =  rund 18,4 Stunden je Jahr
```

Gegenprobe über die Addition: 2,63 + 0,88 + 0,88 + 0,88 + 4,38 + 8,76 = **18,41 h**. Das passt.

Und der wichtigste Nebenbefund: **Nach den Maßnahmen sind die beiden größten Posten die Anwendung (8,76 h) und der Speicher (4,38 h)** – zusammen 13,1 der verbleibenden 18,4 Stunden. Der Speicher ist damit zum neuen schwächsten Hardwareglied geworden. Das ist kein Fehler der Planung, sondern ihr Ergebnis: Man verschiebt den Engpass, bis das nächste Geld dort wirkt.

**Aufgabe 10 – die Wirtschaftlichkeit:**

```text
Ausfallstunden vorher                              =  56,8 h je Jahr
Ausfallstunden nachher                             =  18,4 h je Jahr
Ersparnis                                          =  38,4 h je Jahr

Davon in der Betriebszeit  38,4 x 0,42             =  rund 16,1 h
Wert  16,1 h x 4.500 EUR                           =  rund 72.500 EUR je Jahr

Kosten des Pakets:
  einmalig 118.000 EUR, verteilt auf 5 Jahre       =  23.600 EUR je Jahr
  laufend                                          =  39.400 EUR je Jahr
                                                      -----------
  Summe                                            =  63.000 EUR je Jahr

Ergebnis  72.500 - 63.000                          =  +9.500 EUR je Jahr
```

Das Paket rechnet sich also **allein aus dem MES** – und dabei sind die Verbesserungen für ERP, Konstruktion, E-Mail und Portal, die auf denselben Hosts, demselben Switch und in demselben Raum liegen, noch gar nicht eingerechnet. Rechnet man S2 und S3 mit, liegt der Nutzen deutlich höher.

!!! warning "Die Grenzen dieser Rechnung ehrlich benennen"
    Drei Einschränkungen gehören in jede Vorstellung dieser Zahlen:

    1. **Die 4.500 Euro je Stunde sind eine Schätzung des Fachbereichs**, keine Messung. Die ganze Rechnung hängt an dieser Zahl und ihrer Herleitung.
    2. **Die angenommenen Soll-Verfügbarkeiten sind ebenfalls Schätzungen.** Wer sie zu optimistisch ansetzt, rechnet sich das Paket schön. Deshalb wurden oben bewusst keine Werte über 99,99 Prozent vergeben – gemeinsame Ursachen wie Raum, Firmware und Konfiguration bleiben bestehen.
    3. **Der Erwartungswert taugt nicht für den Großschaden.** Brand oder Wassereinbruch im Untergeschoss würden alle Systeme gleichzeitig treffen. Dieses Ereignis ist selten, sein Erwartungswert klein – die Folge aber existenzbedrohend. Solche Risiken werden nicht über den Erwartungswert entschieden, sondern von der Geschäftsführung bewusst und schriftlich getragen.

**Aufgabe 11 – bewusst nicht gewählt:**

| Nicht gewählt | Begründung | Verbleibendes Restrisiko |
|---|---|---|
| **M15** Ausweichrechenzentrum (48.000 €/Jahr) | Sprengt allein das gesamte Jahresbudget. Der Nutzen greift erst bei einem Standortereignis, gegen das es günstigere Teilantworten gibt. | Ein Totalverlust des Standorts führt zu einem Wiederanlauf aus der Cloudsicherung – Tage statt Stunden. |
| **M5** Netzersatzanlage (45.000 € einmalig) | Größter Einzelposten im einmaligen Budget; hätte drei andere Maßnahmen verdrängt. Stromausfälle über 30 Minuten sind am Standort selten. | Ein mehrstündiger Stromausfall legt den Betrieb still. Der Notbehelf ist ein geordnetes Herunterfahren innerhalb der USV-Zeit – das muss geübt und automatisiert sein. |
| **M8** Zweiter Brandabschnitt (35.000 € / 4.000 €) | Fachlich die stärkste der nicht gewählten Maßnahmen. Sie hätte M7, M10 und M11 verdrängt und dabei das größte Glied der Kette – die Klimatisierung – unangetastet gelassen. | Original und lokale Sicherung stehen weiterhin in einem Raum. Abgefedert wird das nur durch die Cloudkopie (M9) und das Band (M10). |
| **M4** Zweite Internetanbindung (4.000 € / 6.000 €) | Betrifft vor allem S6 und den externen Zugriff; die Fertigung läuft ohne Internet weiter. | Kundenportal und Fernwartung fallen bei einer Leitungsstörung aus. Notbehelf: Mobilfunkrouter als Kaltreserve – deutlich billiger. |

**Aufgabe 8 bis 11, Variante B: Standortrisiko zuerst**

Eine zweite, ebenso vertretbare Lösung – sie gewichtet das Standortereignis höher als die Komponentenausfälle:

| Kürzel | Maßnahme | Einmalig | Jährlich |
|---|---|---|---|
| M1 | Zweiter Core-Switch als Stack | 14.000 € | 1.500 € |
| M3 | Dritter Host, Cluster N+1 | 28.000 € | 3.500 € |
| M4 | Zweite Internetanbindung | 4.000 € | 6.000 € |
| M6 | USV auf 30 Minuten, neue Batterien | 8.000 € | 1.200 € |
| M8 | Zweiter Brandabschnitt mit repliziertem Zweitspeicher | 35.000 € | 4.000 € |
| M9 | Unveränderliches Repository + Cloudziel | 12.000 € | 9.000 € |
| M12 | Ersatzteilschrank vor Ort | 9.000 € | 800 € |
| M13 | Monitoring mit Alarmierung und Rufbereitschaft | 6.000 € | 7.000 € |
| M14 | Isolierte Testumgebung | 3.000 € | 2.500 € |
| | **Summe** | **119.000 €** | **35.500 €** |

Die Kette für das MES sieht dann so aus – Klimatisierung unverändert, dafür ein replizierter Zweitspeicher mit manueller Umschaltung:

```text
Strom      99,97 %  ->   2,63 h
Klima      99,80 %  ->  17,52 h   <-- unveraendert
Switch     99,99 %  ->   0,88 h
Host       99,99 %  ->   0,88 h
Speicher   99,98 %  ->   1,75 h
Anwendung  99,90 %  ->   8,76 h
                       --------
Summe                   32,42 h

Multiplikation: 0,9997 x 0,9980 x 0,9999 x 0,9999 x 0,9998 x 0,9990 = 0,996304
Gesamt 99,6304 %  ->  rund 32,4 Stunden je Jahr
```

**Der Vergleich ist das eigentliche Lernergebnis:**

| | Variante A | Variante B |
|---|---|---|
| Ausfallstunden je Jahr (MES) | **18,4 h** | 32,4 h |
| Schutz gegen Komponentenausfälle | sehr gut | gut |
| Schutz gegen ein Standortereignis | schwach – nur über die Cloudkopie | **deutlich besser** – zweiter Brandabschnitt mit Replikat |
| Offline-Kopie mit echter Trennung | ja (Band im Schließfach) | nein – nur unveränderliche Cloudkopie |
| Reaktionszeit des Herstellers | 24×7×4 | weiterhin nächster Werktag, teilweise ersetzt durch M12 |
| Jährliche Kosten inkl. Abschreibung | 63.000 € | 59.300 € |

Variante A gewinnt bei der Zahl, Variante B beim seltenen Großschaden. **Beide sind verteidigbar** – aber nur, wenn die Gruppe sagen kann, welche Annahme sie trifft: Wie wahrscheinlich ist ein Standortereignis im Vergleich zu den vielen kleinen Ausfällen? Wer Variante B wählt, muss zusätzlich erklären, warum er die Klimatisierung mit 17,52 Ausfallstunden – dem größten Einzelposten der Kette – unangetastet lässt.

!!! danger "Was in **keiner** Variante fehlen darf – und nichts kostet"
    Vier Maßnahmen stehen in keinem Katalogpreis und gehören trotzdem in jede Lösung:

    1. **Backupserver aus der Produktivdomäne nehmen**, eigenes Konto ohne Domänenadministratorrechte, Mehrfaktor-Anmeldung an der Konsole. Ohne das ist jede unveränderliche Sicherung nur halb wirksam.
    2. **Zweiter Domänencontroller im Verwaltungsgebäude.** Er kostet eine virtuelle Maschine und löst die RTO von zwei Stunden für S4 besser als jede Wiederherstellung.
    3. **Das Wissensmonopol auflösen:** Wiederanlaufplan schriftlich, zweite eingearbeitete Person oder ein Bereitschaftsvertrag mit einem Dienstleister.
    4. **Die unverschlüsselte Wechselplatte in der Privatwohnung sofort beenden.** Sie ist keine Sicherungsstrategie, sondern ein Datenschutzvorfall mit Vorlaufzeit.

### Teil D – Sicherung und Wiederanlauf

**Aufgabe 12 – das Backupkonzept:**

| Frage | Festlegung |
|---|---|
| **Was** | alle acht Systeme als vollständige virtuelle Maschinen; zusätzlich Datenbanken von S1 und S2 als eigene Sicherung mit Transaktionsprotokollen |
| **Wie oft** | wöchentliche Vollsicherung im Wochenendfenster, täglich inkrementell. **S1:** Transaktionsprotokolle alle 15 Minuten. **S2:** stündlich. **S3, S5, S6:** zusätzlicher Lauf während des Tages, um RPO 4 h bzw. 1 h zu halten |
| **Wohin** | **Ziel 1:** lokales Backup-NAS für den schnellen Restore. **Ziel 2:** unveränderliches Cloudziel außer Haus, täglich (M9). **Ziel 3:** monatliches Band ins Bankschließfach, offline (M10) |
| **Wie lange** | 14 tägliche, 8 wöchentliche, 12 monatliche Stände; Jahresstände nach Vorgabe der Buchhaltung. Aufbewahrung **länger** als die typische unentdeckte Verweilzeit eines Angreifers |
| **Wer darf** | Sichern, Wiederherstellen und Ändern von Aufbewahrungsregeln getrennt; Fachbereiche beantragen, führen nicht aus; jede Wiederherstellung wird protokolliert und begründet; Vier-Augen-Prinzip beim Verkürzen von Fristen |
| **Verschlüsselung** | Cloudziel und Bänder verschlüsselt. Schlüssel an zwei Orten **außerhalb** der gesicherten Umgebung: ausgedruckt im Tresor des Verwaltungsgebäudes und als zweite Kopie außer Haus |
| **Wie geprüft** | monatlich Einzeldateien aus verschiedenen Generationen; quartalsweise S1 vollständig in die isolierte Umgebung (M14) mit **gemessener RTA**; jährlich eine Wiederanlaufübung über mehrere Systeme |

**Die 3-2-1-1-0-Prüfung:**

```text
3 Kopien    Produktivdaten + lokales Backup-NAS + Cloudziel (+ Band)   erfuellt
2 Medien    Plattenspeicher und Objektspeicher/Band                    erfuellt
1 ausser Haus  Cloudziel und Band im Schliessfach                      erfuellt
1 unveraenderlich/offline  Objektsperre in der Cloud + Band offline    erfuellt
0 Fehler    quartalsweiser Restore-Test mit Protokoll                  erfuellt
```

**Aufgabe 13 – passen die Läufe in die Fenster?**

```text
Vollsicherung  6.150 GB bei 100 MB/s
  6.150.000 MB / 100 MB/s  =  61.500 s  =  17,1 h
  Nachtfenster  7 h   ->  passt NICHT
  Wochenendfenster 30 h  ->  passt

Taegliche inkrementelle Sicherung  143 GB bei 100 MB/s
  143.000 MB / 100 MB/s  =  1.430 s  =  rund 24 Minuten
  Nachtfenster 7 h  ->  passt bequem

Differenzielle Sicherung am fuenften Tag  5 x 143 GB = 715 GB
  715.000 MB / 100 MB/s  =  7.150 s  =  rund 2,0 h
  Nachtfenster 7 h  ->  passt ebenfalls
```

Ergebnis: Die vorhandene 1-Gbit-Anbindung reicht für den täglichen Betrieb völlig aus. Die Vollsicherung muss aufs Wochenende – das ist der übliche Aufbau und kein Mangel. Wer die Wochenendläufe entzerren will, nimmt **synthetische Vollsicherungen**; dann liest das Backupsystem die Produktivsysteme nie vollständig.

Und die Gegenprobe zur RTO:

```text
S1 (MES, 800 GB) zurueckspielen bei 200 MB/s
  800.000 MB / 200 MB/s  =  4.000 s  =  rund 1,1 h
  + Erkennen, Entscheiden, Bereitstellen, Pruefen, Freigeben  rund 2,0 h
  = rund 3,1 h    ->  RTO von 4 h ist haltbar

S3 (Konstruktion, 3.000 GB) zurueckspielen bei 200 MB/s
  3.000.000 MB / 200 MB/s  =  15.000 s  =  rund 4,2 h
  + rund 2,0 h Nebenzeiten
  = rund 6,2 h    ->  RTO von 8 h ist haltbar, aber ohne Puffer
```

Bei S3 lohnt der Hinweis: Vier Stunden reines Kopieren lassen wenig Spielraum für Überraschungen. Eine **Instant Recovery** direkt vom Backupspeicher oder eine Priorisierung der aktiven Projektordner (Teilwiederherstellung zuerst) macht die Zusage belastbar.

**Aufgabe 14 – die Wiederanlaufreihenfolge:**

| Schritt | Was | Prüfkriterium |
|---|---|---|
| 1 | Stromversorgung stabil, USV geladen | Netzspannung stabil, USV meldet Ladezustand über 80 % |
| 2 | Klimatisierung | Raumtemperatur im Zielbereich und fallend |
| 3 | Netz: Core-Switch, Firewall, Router, Glasfaser zum Verwaltungsgebäude | Verbindung zwischen beiden Gebäuden erreichbar |
| 4 | Monitoring | Übersicht sichtbar, Alarmierung aktiv |
| 5 | Speicher (NAS) | Datenträger fehlerfrei, Datenspeicher eingebunden |
| 6 | Virtualisierungshosts | Cluster gesund, Quorum vorhanden |
| 7 | Zeit und Namen: NTP, dann DNS/DHCP, dann Verzeichnisdienst | Testanmeldung eines Kontos gelingt |
| 8 | Datenbankserver | Testabfrage liefert einen aktuellen Datensatz |
| 9 | S1 MES, dann S2 ERP | Testauftrag anlegen und zurückmelden |
| 10 | S3 Dateiserver, S5 E-Mail, S7 Telefonanlage | Testdatei öffnen, Testmail zustellen, Testanruf |
| 11 | S6 Kundenportal, S8 Zeiterfassung | Testbestellung, Testbuchung |
| 12 | Clientzugang, VPN, Druck – dann Freigabe an die Fachbereiche | Stichprobe an drei Arbeitsplätzen |

**Drei Schritte, deren Reihenfolge zwingend ist:**

1. **NTP vor dem Verzeichnisdienst (Schritt 7).** Kerberos-Anmeldungen scheitern, wenn die Uhren zu weit auseinanderliegen; üblich ist eine Toleranz von fünf Minuten. Nach einem langen Stromausfall stehen Uhren falsch – und der Fehler sieht nach allem Möglichen aus, nur nicht nach der Uhrzeit.
2. **Speicher vor den Hosts (Schritt 5 vor 6).** Startet ein Host, bevor sein Speicher bereit ist, findet er seine virtuellen Maschinen nicht und markiert sie als verwaist. Das Aufräumen dauert länger als das Warten.
3. **Klimatisierung vor der Last (Schritt 2 vor 5).** Wer erst die Server startet und dann die Kühlung, erzeugt Wärme in einem Raum, dessen Temperatur ohnehin über dem Normalwert liegt – und riskiert eine Abschaltung wegen Übertemperatur mitten im Wiederanlauf.

Zwei Ergänzungen, die in der Auswertung oft fehlen: Beim **geplanten** Herunterfahren gilt dieselbe Liste rückwärts. Und der Plan muss **offline** vorliegen – ausgedruckt am Serverschrank und als verschlüsselte Kopie außer Haus –, denn im Szenario liegt jede Dokumentation auf genau den Systemen, die gerade nicht laufen.

---

## Reflexionsfragen für die Auswertung

Diese Fragen gehören ins Plenum, nicht in die Gruppenarbeit. Sie ziehen aus dem Fall das heraus, was übertragbar ist.

1. **Kein einziges Glied der Ist-Kette war schlecht – und trotzdem kam nur 99,35 Prozent heraus. Was heißt das für Verfügbarkeitszusagen, die ein Anbieter für sein Produkt gibt?**
2. **Nach den Maßnahmen ist die Anwendung selbst der größte Ausfallposten. Welche Maßnahmen wirken auf dieses Glied – und warum stehen sie in keinem Hardwarekatalog?**
3. **Die beiden schwersten Schwachstellen im Szenario kosten nichts** (Backupserver in der Domäne, Wissensmonopol). Warum fallen gerade kostenlose Maßnahmen im Alltag am häufigsten unter den Tisch?
4. **Bei welchen eurer RTO- und RPO-Werte habt ihr am längsten diskutiert – und woran lag das: an der Technik oder daran, dass niemand am Tisch für den Fachbereich sprechen konnte?**
5. **Variante A und Variante B kommen auf 18,4 gegen 32,4 Ausfallstunden. Trotzdem ist B nicht falsch. Welche Annahme über die Welt steckt in jeder der beiden Entscheidungen?**
6. **Ihr habt für den Ist-Zustand rund 108.000 Euro erwartete Ausfallkosten je Jahr ausgerechnet – für ein System. Warum hat das vorher niemand im Betrieb gewusst, obwohl alle Zahlen dafür vorhanden waren?**
7. **Angenommen, in einem Jahr passiert nichts.** War die Investition dann falsch? Wie erklärt ihr das einer Geschäftsführung, die genau diese Frage stellt?

---

## Was eine tragfähige Lösung auszeichnet

Zur Selbsteinschätzung nach der Auswertung:

| Merkmal | Schwach | Tragfähig |
|---|---|---|
| **RTO und RPO** | für alle Systeme gleich | gestaffelt, jede Zahl mit einer Begründung aus dem Geschäft |
| **SPOF-Analyse** | nur Technik | auch Standort, Anbieter, Mensch und die Sicherung selbst |
| **Kettenrechnung** | Verfügbarkeiten addiert oder gemittelt | multipliziert, Ausfallstunden je Glied ausgewiesen |
| **Maßnahmenwahl** | nach Gefühl oder nach Preis | nach gesparten Ausfallstunden je Euro, beide Budgets getrennt geführt |
| **Annahmen** | unausgesprochen | aufgeschrieben und angreifbar gemacht |
| **Restrisiko** | nicht erwähnt | benannt, mit Notbehelf und Zuständigkeit |
| **Backupkonzept** | „täglich auf das NAS" | sechs Fragen beantwortet, 3-2-1-1-0 geprüft, Restore-Test terminiert |
| **Wiederanlauf** | Liste ohne Begründung | Reihenfolge mit Abhängigkeiten und Prüfkriterien je Schritt |

---

## Weiterlesen

- [Hochverfügbarkeit & Redundanz](hochverfuegbarkeit.md): die Formeln, Redundanzarten, Cluster und die Business Impact Analysis hinter dieser Aufgabe
- [Backup & Recovery](backup-und-recovery.md): Sicherungsarten, 3-2-1-1-0, RTO und RPO sowie der Wiederanlaufplan
- [Monitoring & Betrieb](monitoring.md): woher die Zahlen kommen, mit denen man MTTR verkürzt
- [Incident Response & Business Continuity](incident-und-bcm.md): wie aus dem Wiederanlaufplan eine geübte Krisenorganisation wird
- [Risikomanagement](../it-sicherheit/risikomanagement.md): Risikoregister, Matrix und die vier Steuerungsstrategien – dieselbe Denkweise, andere Werkzeuge
- [Übungen: Risikoanalyse](../it-sicherheit/uebungen-risikoanalyse.md): der passende Aufgabensatz zur Bewertung von Risiken
- [Speicherlösungen](../infrastruktur-planung/speicherloesungen.md): RAID, Shared Storage und Kapazitätsplanung für den Sicherungsspeicher
