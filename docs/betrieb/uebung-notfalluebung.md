---
title: "Übung: Notfallübung"
description: "Tabletop-Übung für Kleingruppen: Ein Störungsszenario spitzt sich über fünf Runden von der harmlosen Meldung bis zum Notfall zu. In jeder Runde entscheidet die Gruppe, was zu tun ist, wer informiert wird und was dokumentiert werden muss – mit Rundenkarten für die Kursleitung, Hilfekarten, ausführlicher Musterlösung und einer Bewertung der typischen Fehlentscheidungen."
---

# Übung: Notfallübung

<span class='badge badge-praxis'>Praxis</span> &nbsp; Eine Tabletop-Übung. Kein Rechner, keine Software, keine Technik – nur ein Szenario, das sich Runde für Runde zuspitzt, und eine Gruppe, die entscheiden muss, bevor sie alles weiß.

Genau darin liegt der Sinn. Im echten Ernstfall entscheidet niemand mit vollständiger Information. Die erste Meldung sieht immer harmloser aus als die Lage, und jede Entscheidung, die du in der ersten Stunde triffst, wirkt sich auf die nächsten drei Tage aus. Eine Tabletop-Übung stellt genau diese Situation her – zum Preis eines Vormittags statt zum Preis eines Vorfalls.

!!! info "Auf einen Blick"
    - **Dauer:** 60–90 Minuten Gruppenarbeit, danach gemeinsame Auswertung
    - **Gruppen:** 3–5 Personen
    - **Material:** dieses Blatt (Teil A, ausgedruckt oder am Bildschirm), Papier und Stift für das Ereignisprotokoll. Sonst nichts.
    - **Voraussetzung:** [Incident Response & Business Continuity](incident-und-bcm.md); hilfreich sind außerdem [Monitoring & Betrieb](monitoring.md) und [Risikomanagement](../it-sicherheit/risikomanagement.md)
    - **Aufbau:** fünf Runden mit je etwa 12 Minuten. Die Kursleitung gibt jede Runde einzeln frei.

!!! warning "Spielregel"
    **Immer nur eine Runde ist offen.** Wer vorausliest, nimmt sich den ganzen Lerneffekt: Der Kern der Übung ist, mit unvollständiger Information zu entscheiden und später zu sehen, was die eigene Entscheidung angerichtet hat. Die Musterlösung in Teil B bleibt bis zur gemeinsamen Auswertung zu.

    Und die zweite Regel: **Jede Entscheidung wird aufgeschrieben.** Auch die, gegen die ihr euch entschieden habt, und auch die, bei der ihr euch unsicher wart. Ein Ereignisprotokoll zu führen ist Teil der Übungsaufgabe, nicht Beiwerk.

---

## Teil A – für die Gruppen

### Die Ausgangslage

Die **Feinwerk Präzisionstechnik GmbH** fertigt Präzisionsteile für den Maschinenbau. Rund 180 Beschäftigte, zwei Standorte: das **Werk Nord** mit Verwaltung, Konstruktion und Fertigung, dazu das **Werk Süd** rund 40 Kilometer entfernt mit Montage und Versand. Beide Standorte hängen über eine VPN-Verbindung zusammen.

Die IT sitzt im Werk Nord, in einem Serverraum im Kellergeschoss. Das Team besteht aus drei Personen: der IT-Leitung und zwei Administratoren. Für das ERP-System gibt es einen externen Dienstleister mit Wartungsvertrag, für den Datenschutz eine externe beauftragte Person.

**Die Systeme:**

| System | Wofür | Anmerkung |
|---|---|---|
| **FeinPlan** (ERP mit Fertigungssteuerung) | Aufträge, Stücklisten, Maschinenbelegung, Versand | ohne dieses System steht die Fertigung |
| **Dateiserver** | Konstruktionsdaten, Abteilungslaufwerke, Personalabteilung | zentrale Ablage für alle Bereiche |
| **Mailserver** | interne und externe Kommunikation | im Haus betrieben |
| **Backup-NAS** | tägliche Sicherung, im selben Serverraum | als Netzlaufwerk in die Server eingebunden |
| **Bandsicherung** | wöchentliche Vollsicherung freitags | Band wird montags in den Tresor der Verwaltung gebracht, 4 Bänder im Umlauf |

**Was der Betrieb sich vorgenommen hat** (aus der letzten Business Impact Analyse):

```text
Fertigungssteuerung FeinPlan
  maximal tolerierbare Ausfallzeit (MTA)   24 Stunden
  RTO (Zielzeit Wiederanlauf)               8 Stunden
  RPO (tolerierbarer Datenverlust)         24 Stunden
  Stillstandskosten Fertigung               4.500 EUR je Produktionsstunde
  Produktionszeit                          16 Stunden je Werktag (Zweischichtbetrieb)
```

**Was es nicht gibt:** ein geübtes Notfallverfahren, eine aktuelle Erreichbarkeitsliste außerhalb des Netzlaufwerks, eine schriftlich festgelegte Wiederanlaufreihenfolge.

---

### Eure Rollen

Verteilt in der Gruppe die folgenden Rollen. Sie sind keine Verkleidung, sondern eine Arbeitsteilung – und die Übung prüft nebenbei, ob ihr sie durchhaltet.

| Rolle | Aufgabe in der Übung |
|---|---|
| **Einsatzleitung** | führt die Gruppe durch jede Runde, sorgt für eine Entscheidung, achtet auf die Zeit. **Arbeitet inhaltlich möglichst wenig selbst mit.** |
| **Protokollführung** | schreibt das Ereignisprotokoll: Zeitmarke, Feststellung, Entscheidung, Begründung, wer macht was |
| **Technik** | vertritt die technische Sicht: Was ist machbar, was dauert wie lange, was hat welche Nebenwirkung? |
| **Kommunikation** | vertritt die Sicht nach innen und außen: Wer muss was wann erfahren, mit welcher Aussage? |
| **Fachbereich / Geschäftsführung** (ab 4 Personen) | vertritt die Interessen der Fertigung und die Entscheidungen, die Geld kosten |

Bei drei Personen fasst ihr Technik und Fachbereich zusammen. **Die Protokollführung wird nicht wegrationalisiert** – auch dann nicht, wenn es eng wird. Genau das ist ein Teil des Tests.

---

### So beantwortet ihr jede Runde

In jeder Runde bekommt ihr eine Lagemeldung. Beantwortet danach **immer dieselben drei Fragen** – schriftlich, kurz, mit Begründung:

1. **Was tun wir jetzt?** Welche konkreten Maßnahmen, in welcher Reihenfolge, wer macht sie? Und wie stuft ihr die Lage ein: Störung, Sicherheitsvorfall oder Notfall?
2. **Wen informieren wir?** Wer erfährt was, in welcher Reihenfolge, über welchen Weg – und mit welcher Handlungsanweisung?
3. **Was dokumentieren wir?** Was gehört jetzt ins Ereignisprotokoll, und welche Angaben braucht ihr später noch?

Dazu eine vierte Frage, die ihr euch in jeder Runde stellen solltet: **Welche Annahme treffen wir gerade, ohne sie geprüft zu haben?**

---

### Runde 1 – Montagmorgen

??? note "Lagemeldung Runde 1 – erst öffnen, wenn die Kursleitung die Runde freigibt"
    **Zeitmarke T+0**

    Kurz nach Arbeitsbeginn gehen im Servicedesk drei Meldungen ein:

    - Eine Konstrukteurin meldet, dass sich zwei CAD-Dateien nicht öffnen lassen. Die Anwendung sagt, die Datei sei beschädigt.
    - Die Arbeitsvorbereitung meldet, das Abteilungslaufwerk sei „extrem langsam“.
    - Ein Auszubildender erwähnt beiläufig, sein Rechner sei „schon seit Freitagnachmittag komisch, der lüftet dauernd“.

    Ein Blick ins Monitoring zeigt: Die **Schreiblast auf dem Dateiserver** ist seit den frühen Morgenstunden deutlich erhöht und hält sich seither auf hohem Niveau. Ein Alarm wurde nicht ausgelöst – für Schreiblast ist keine Schwelle eingerichtet.

    FeinPlan läuft normal. Die Fertigung arbeitet.

    Der Servicedesk hat bereits ein Ticket mit der Kategorie „Dateizugriff – Anwendungsfehler“ angelegt und der Konstrukteurin geraten, die Datei aus dem Papierkorb wiederherzustellen.

    **Beantwortet jetzt die drei Fragen.** Zeitbudget: rund 12 Minuten.

---

### Runde 2 – vierzig Minuten später

??? note "Lagemeldung Runde 2 – erst nach Freigabe öffnen"
    **Zeitmarke T+40 Minuten**

    Inzwischen sind **elf Meldungen aus vier Abteilungen** eingegangen. Das Bild ist überall gleich: Dateien lassen sich nicht mehr öffnen.

    Ein Administrator sieht sich das Abteilungslaufwerk der Konstruktion an. Dort stehen die gewohnten Dateinamen – aber jede Datei hat eine zusätzliche, unbekannte Endung. In jedem Ordner liegt außerdem eine neue Textdatei mit dem Namen `WIEDERHERSTELLUNG.txt`. Ihr Inhalt: eine Nachricht in gebrochenem Deutsch, die mitteilt, dass die Daten verschlüsselt wurden, dass eine Kopie der Daten abgezogen worden sei und dass sich der Betrieb über eine angegebene Adresse melden solle.

    FeinPlan läuft weiterhin. Die Fertigung arbeitet. Der Mailserver ist unauffällig.

    Die IT-Leitung ist im Haus. Die Geschäftsführerin ist auswärts bei einem Kunden, per Mobiltelefon erreichbar. Ein Administrator schlägt vor, „erst mal alle Server herunterzufahren, bevor noch mehr passiert“. Der andere schlägt vor, sofort mit der Rücksicherung des Konstruktionslaufwerks zu beginnen.

    **Beantwortet die drei Fragen erneut.** Und haltet ausdrücklich fest, ob und wie sich eure Einstufung gegenüber Runde 1 verändert.

---

### Runde 3 – zwei Stunden nach der ersten Meldung

??? note "Lagemeldung Runde 3 – erst nach Freigabe öffnen"
    **Zeitmarke T+2 Stunden**

    Die Lage hat sich deutlich verändert:

    - **FeinPlan antwortet nicht mehr.** Die Datenbankdateien auf dem Anwendungsserver tragen dieselbe fremde Endung. Die Fertigung kann keine Aufträge mehr abrufen, keine Stücklisten öffnen und keine Maschinenbelegung einsehen. **Die Produktion steht.**
    - Auf dem **Backup-NAS** sind die Sicherungsdateien ebenfalls betroffen. Das NAS war als Netzlaufwerk dauerhaft in die Server eingebunden. Der letzte erfolgreiche Sicherungslauf war der von Freitagnacht; der Lauf von Sonntagnacht steht auf „fehlgeschlagen“, ohne dass jemand die Meldung gesehen hätte.
    - Das **Band der letzten Vollsicherung** vom vergangenen Freitag steckt noch im Laufwerk – es sollte heute in den Tresor gebracht werden. Das Bandlaufwerk hängt am betroffenen Server.
    - Das letzte Band, das sicher im **Tresor der Verwaltung** liegt, stammt vom **Freitag der Vorwoche**.
    - Auf dem Dateiserver liegt auch das Laufwerk der **Personalabteilung**: Bewerbungsunterlagen, Lohnabrechnungen, Krankmeldungen, Schwerbehindertenausweise.
    - Ein Mitarbeiter aus dem **Werk Süd** meldet, dass dort ebenfalls Dateien nicht mehr zu öffnen sind.

    Die Geschäftsführerin ist auf dem Rückweg und in einer Stunde im Haus. Sie fragt am Telefon: „Wann läuft die Fertigung wieder?“

    **Beantwortet die drei Fragen.** Rechnet zusätzlich aus: **Wie groß ist der Datenverlust, wenn ihr vom Tresorband wiederherstellt – und wie verhält sich das zu eurer eigenen RPO-Vorgabe?**

    Zeitbudget: rund 15 Minuten. Dies ist die schwerste Runde.

---

### Runde 4 – am Nachmittag

??? note "Lagemeldung Runde 4 – erst nach Freigabe öffnen"
    **Zeitmarke T+6 Stunden**

    Vier neue Entwicklungen:

    - Ein **Stammkunde** ruft an. Er habe am Vormittag eine Mail von einer Feinwerk-Adresse mit einem Anhang bekommen, der ihm merkwürdig vorkomme. Er habe ihn nicht geöffnet, wolle aber wissen, was los sei.
    - Die **Lokalzeitung** ruft an. Ein Redakteur habe gehört, bei Feinwerk stehe die Produktion, und bittet um eine Stellungnahme bis zum Abend.
    - Der **ERP-Dienstleister** meldet sich: Er habe auf seinem eigenen Testsystem eine Kopie der FeinPlan-Datenbank, rund drei Wochen alt. Er könne die „sofort einspielen, dann läuft wenigstens etwas“.
    - Zwei **Fertigungsaufträge** mit Liefertermin am Ende dieser Woche sind angearbeitet. Für einen davon ist eine Vertragsstrafe vereinbart.

    Die Geschäftsführerin ist im Haus. Sie stellt zwei Fragen in die Runde: **„Können wir zahlen, wenn das schneller geht?“** und **„Was sagen wir dem Kunden?“**

    **Beantwortet die drei Fragen.** Nehmt zusätzlich ausdrücklich Stellung zu den beiden Fragen der Geschäftsführerin und zum Angebot des Dienstleisters.

---

### Runde 5 – drei Tage später

??? note "Lagemeldung Runde 5 – erst nach Freigabe öffnen"
    **Zeitmarke T+3 Tage**

    Der Stand:

    - Die Ursache ist gefunden: Über einen Fernwartungszugang, der seit einem Projekt offengeblieben war und dessen Passwort mehrfach verwendet wurde, kam der Zugriff zustande. Der Zugang wurde am Freitag der Vorwoche zum ersten Mal genutzt.
    - Der Anwendungsserver für FeinPlan ist neu aufgesetzt, die Datenbank vom Tresorband zurückgespielt und läuft in einem provisorischen Zustand.
    - Der Dateiserver ist zur Hälfte wiederhergestellt.
    - Die Fertigung hat drei Tage lang mit ausgedruckten Stücklisten aus der Konstruktionsablage im Werk Süd gearbeitet, die dort zufällig als PDF-Kopien vorlagen. Aufträge wurden auf Formularen erfasst, die eine Mitarbeiterin selbst entworfen und im Kopierer vervielfältigt hat. Es liegen rund **210 handschriftliche Belege** vor, teilweise ohne Nummerierung.
    - Der Versand im Werk Süd hat weitergearbeitet und dabei Lieferscheine von Hand geschrieben.

    Die Geschäftsführerin will wissen: **Wann sind wir wieder im Normalbetrieb – und was ändern wir, damit das nicht noch einmal passiert?**

    **Beantwortet die drei Fragen ein letztes Mal.** Erstellt zusätzlich:

    - eine **Wiederanlaufreihenfolge** für die verbleibenden Systeme, mit Begründung
    - einen **Plan für die Nacherfassung** der 210 Belege
    - eine **Maßnahmenliste** mit mindestens fünf Punkten, jeweils mit Verantwortlichem und Frist

---

### Hilfekarten

!!! tip "Erst diskutieren, dann aufklappen"
    Die Hilfekarten sind für Gruppen gedacht, die feststecken – nicht als Abkürzung. Wenn ihr nach fünf Minuten Diskussion keine Richtung habt, nehmt genau die Karte, die zu eurer Frage passt.

??? tip "Hilfekarte 1 – Wie stufe ich die Lage ein?"
    Drei Zustände, drei verschiedene Verfahren:

    - **Störung:** Ein Dienst ist gestört. Regelprozess, Servicedesk, Ziel ist die schnelle Wiederherstellung.
    - **Sicherheitsvorfall:** Es besteht Verdacht auf Angriff oder Missbrauch. Ziel ist, die Ausbreitung zu stoppen **und Spuren zu sichern**. Informationssicherheit und Datenschutz kommen dazu.
    - **Notfall:** Ein kritischer Prozess steht länger still, als es tragbar ist. Krisenstab, Notbetrieb, Geschäftsführung entscheidet mit.

    Nützliche Auslösekriterien: mehr als eine Abteilung betroffen · gleichartiges Symptom bei mehreren Nutzern · Verdacht auf Schadsoftware · ein kritischer Prozess steht · personenbezogene Daten könnten betroffen sein.

    Und der wichtigste Satz: **Wer hochstuft und sich irrt, hat richtig gehandelt.** Zurückstufen dauert fünf Minuten.

??? tip "Hilfekarte 2 – Eindämmen: was heißt das konkret?"
    Ziel der Eindämmung ist, den Schaden zu begrenzen, **bevor** ihr die Ursache versteht.

    Mögliche Maßnahmen: betroffene Systeme vom Netz **trennen** · Netzsegmente voneinander abschneiden · Standortverbindung kappen · Konten sperren · Zugänge von außen schließen · Auftragsläufe anhalten.

    Zwei Merksätze:

    - **Trennen ist nicht ausschalten.** Ausschalten löscht den Arbeitsspeicher und damit oft genau die Information, die zeigt, was passiert ist.
    - **Isolieren, sichern, dann bereinigen.** Wer sofort neu aufsetzt, vernichtet die Beweise – und braucht sie später für Versicherung, Meldung und Ursachenklärung.

    Fragt euch außerdem: Was ist **noch nicht** betroffen, und wie schützt ihr es? Alles, was momentan mit dem befallenen Netz verbunden ist, ist gefährdet – auch Sicherungen, auch der zweite Standort.

??? tip "Hilfekarte 3 – Wen informieren, in welcher Reihenfolge?"
    Geht die Empfängerliste durch und entscheidet für jeden: jetzt, später oder gar nicht?

    | Empfänger | Auslöser |
    |---|---|
    | Einsatzteam | sofort |
    | Geschäftsführung | bei Höherstufung, spätestens beim Notfall |
    | betroffene Fachbereiche | sobald die Auswirkung absehbar ist |
    | gesamte Belegschaft | sobald Verhaltensregeln nötig sind |
    | Datenschutzbeauftragte Person | sobald personenbezogene Daten betroffen sein könnten |
    | Dienstleister | sobald ihr ihre Systeme oder ihre Hilfe braucht |
    | Kunden und Lieferanten | wenn Leistungen betroffen sind oder von euch eine Gefahr ausgeht |
    | Aufsichtsbehörde | innerhalb der gesetzlichen Frist |
    | Presse | nur über eine benannte Stelle |

    Drei Regeln: **eine Stimme nach außen** · **feste Taktung** statt Meldung nur bei Neuigkeiten · **jede Meldung enthält eine Handlungsanweisung** („Geräte nicht ausschalten“, „keine Anhänge öffnen“, „Aufträge auf Papier“).

??? tip "Hilfekarte 4 – Was gehört ins Ereignisprotokoll?"
    Fortlaufend, mit Zeitmarke, in dieser Struktur:

    ```text
    Zeit  | Feststellung / Meldung        | Entscheidung + Begründung      | Wer macht was
    ------+-------------------------------+--------------------------------+---------------
    T+0   | 3 Meldungen Dateizugriff      | Verdacht Muster -> hochstufen  | Name / bis wann
    ```

    Wichtig ist neben dem **Was** vor allem das **Warum**: Entscheidungen ohne Begründung sind später nicht nachvollziehbar – weder für euch selbst noch für Versicherung, Behörde oder Nachbereitung.

    Ebenfalls hinein gehören: bewusst **verworfene** Optionen · getroffene **Annahmen**, die noch nicht geprüft sind · wer wann **informiert** wurde · welche Systeme wann vom Netz genommen wurden.

??? tip "Hilfekarte 5 – Notbetrieb und Ersatzverfahren"
    Frage nicht „wie bekommen wir das System zurück?“, sondern: **„Was muss der Betrieb heute unbedingt leisten – und wie geht das ohne dieses System?“**

    Legt zuerst das **Mindestbetriebsniveau** fest: Was läuft weiter, was ruht bewusst? Zum Beispiel: angearbeitete Aufträge fertigstellen und ausliefern; Neuanlagen, Auswertungen und Angebote ruhen.

    Dann für jeden weiterlaufenden Prozess ein Ersatzverfahren – und dazu immer drei Fragen:

    - **Gibt es die Vorlage?** Papierformular, ausgedruckte Liste, PDF-Kopie auf einem sauberen Gerät.
    - **Kann es jemand?** Wer seit Jahren nur die Maske kennt, füllt ein Formular unvollständig aus.
    - **Wie kommt es später ins System?** Durchgehende Nummerierung, fester Ablageort, benannte Zuständigkeit. Ohne diesen Punkt entsteht ein zweites Problem.

??? tip "Hilfekarte 6 – Wiederanlauf: nach welcher Reihenfolge?"
    Zwei Kriterien bestimmen die Reihenfolge, und zwar in dieser Rangfolge:

    1. **Abhängigkeit:** Was muss laufen, damit anderes überhaupt laufen kann? Netz, Verzeichnisdienst, Namensauflösung, Datenbank – erst dann die Anwendungen darüber.
    2. **Kritikalität:** Welcher Prozess kostet am meisten pro Stunde Stillstand? Das steht in der BIA.

    Drei weitere Bedingungen:

    - **Sauberer Ausgangspunkt.** Zurückgespielt wird von einem Stand, der nachweislich **vor** dem Erstzugriff liegt – nicht vor der Entdeckung.
    - **Prüfen vor Freigabe.** Fachlicher Test durch den Fachbereich, nicht „läuft wieder“ vom Administrator.
    - **Erhöhte Beobachtung** nach dem Wiederanlauf, für einen festgelegten Zeitraum.

---

## Teil B – für die Kursleitung

!!! danger "Nicht für die Gruppen"
    Dieser Teil enthält die Regieanweisungen, die Musterlösung und die Bewertung. Er wird erst in der gemeinsamen Auswertung geöffnet.

### Rundenkarten

??? abstract "Regie: Runde 1"
    **Was diese Runde prüft:** Erkennt die Gruppe ein Muster in drei scheinbar zusammenhanglosen Meldungen – und traut sie sich, ohne Beweis hochzustufen?

    **Freigabe:** Lagemeldung austeilen, Zeitbudget 12 Minuten nennen, Rollenverteilung kurz abfragen.

    **Was ihr beobachtet:**

    - Führt die Gruppe von Anfang an ein Protokoll, oder fängt sie erst in Runde 3 damit an?
    - Stuft sie hoch, oder bleibt sie bei „Anwendungsfehler“?
    - Fällt jemandem der Rechner des Auszubildenden auf – der einzige Hinweis auf den Startpunkt?
    - Fällt auf, dass die erhöhte Schreiblast **keinen Alarm** ausgelöst hat?

    **Nachfrage, falls die Gruppe zu schnell fertig ist:** „Der Servicedesk hat der Konstrukteurin geraten, die Datei aus dem Papierkorb wiederherzustellen. Was haltet ihr davon?“ – Das ist der erste eingebaute Fehler und ein guter Einstieg.

    **Nicht verraten:** dass es sich um Verschlüsselung handelt. Wenn die Gruppe es vermutet, ist das die richtige Reaktion – bestätigt es nicht, sondern fragt: „Was folgt daraus für euer Handeln?“

??? abstract "Regie: Runde 2"
    **Was diese Runde prüft:** Eindämmung unter Zeitdruck – und ob die Gruppe den Unterschied zwischen *trennen* und *ausschalten* kennt.

    **Die beiden Vorschläge der Administratoren sind bewusst gesetzte Fallen:**

    - „Alle Server herunterfahren“ – klingt entschlossen, vernichtet den Arbeitsspeicher und damit Spuren, und legt zusätzlich Systeme lahm, die noch laufen.
    - „Sofort zurücksichern“ – spielt in eine noch aktive Umgebung zurück und macht die Sicherung mit kaputt. Außerdem ist unklar, ob die Sicherung sauber ist.

    Wenn die Gruppe einen der beiden Vorschläge übernimmt, **nicht korrigieren**. In der Auswertung ist es viel wirksamer, die Folge zu zeigen.

    **Optionale Einspielung, wenn die Gruppe zügig arbeitet:** „Eine Mitarbeiterin fragt, ob sie ihren Rechner ausschalten soll – sie will in die Mittagspause.“ Damit prüft ihr, ob die Gruppe an eine **Verhaltensanweisung an die Belegschaft** denkt.

    **Beobachten:** Wird die Geschäftsführerin informiert, obwohl sie auswärts ist? Wird an den Datenschutz gedacht, obwohl noch niemand von der Personalabteilung gesprochen hat? Wird der zweite Standort erwähnt?

??? abstract "Regie: Runde 3"
    **Was diese Runde prüft:** Die Runde, in der alles kippt. Notfall-Einstufung, Krisenstab, Notbetrieb, Meldefristen – und die schmerzhafte Rechnung zur RPO.

    **Zeitbudget großzügiger ansetzen: rund 15 Minuten.**

    **Die vier eingebauten Kernpunkte:**

    1. **Die Sicherungsstrategie ist gescheitert** – nicht aus Pech, sondern aus Bauart: Das NAS war dauerhaft eingebunden, das Band steckte im Laufwerk, der fehlgeschlagene Lauf hat niemanden erreicht.
    2. **Die RPO-Rechnung:** Vom Tresorband (Freitag der Vorwoche) bis heute (Montag) sind **10 Tage**. Die eigene Vorgabe lautet 24 Stunden. Der Ist-Wert liegt beim Zehnfachen der Zusage.
    3. **Personenbezogene Daten** liegen auf dem Dateiserver, und in der Erpressernachricht steht die Behauptung eines Datenabflusses. Damit läuft die 72-Stunden-Frist.
    4. **Der zweite Standort** ist betroffen – die VPN-Verbindung war der Weg.

    **Wenn die Gruppe die RPO nicht selbst ausrechnet, fordert es ausdrücklich ein.** Diese eine Zahl trägt mehr Erkenntnis als der Rest der Runde.

    **Auf die Frage der Geschäftsführerin („Wann läuft die Fertigung wieder?“) hat die Gruppe zu antworten.** Beobachtet, ob sie eine Zahl nennt, die sie nicht halten kann. Gute Antwort: eine ehrliche Auskunft über das, was bekannt ist, plus ein Zeitpunkt für die nächste Information.

??? abstract "Regie: Runde 4"
    **Was diese Runde prüft:** Kommunikation nach außen, Umgang mit Angeboten, die verlockend klingen, und die Lösegeldfrage.

    **Die vier Einspielungen und was sie provozieren sollen:**

    - **Der Kunde mit der verdächtigen Mail:** Von euch geht möglicherweise eine Gefahr aus. Das ist kein Imagethema, sondern eine Warnpflicht gegenüber Geschäftspartnern.
    - **Die Zeitung:** Prüft, ob die Gruppe „eine Stimme nach außen“ umsetzt – oder ob der Technikverantwortliche selbst ans Telefon geht.
    - **Der Dienstleister mit der drei Wochen alten Kopie:** klingt hilfreich, ist aber gefährlich. Einspielen in eine nicht bereinigte Umgebung, unklare Herkunft, und drei Wochen Datenverlust statt zehn Tagen – es ist ein **Rückschritt**, kein Fortschritt. Zusätzlich: Warum hat der Dienstleister überhaupt eine Kopie der Produktivdaten auf seinem Testsystem? Das ist eine eigene Datenschutzfrage.
    - **Die Frage nach der Zahlung:** Hier keine Meinung vorgeben. Die Gruppe soll die Argumente selbst zusammentragen.

    **Wenn die Gruppe die Zeitung ignoriert:** nach fünf Minuten nachlegen – „der Redakteur ruft ein zweites Mal an und sagt, er veröffentliche auch ohne Stellungnahme“.

??? abstract "Regie: Runde 5"
    **Was diese Runde prüft:** Rückkehr zum Normalbetrieb – der Teil, den fast alle unterschätzen – und die Fähigkeit, aus dem Verlauf konkrete Maßnahmen abzuleiten.

    **Die drei Aufträge sind das eigentliche Ergebnis der Übung.** Lasst die Gruppe die Wiederanlaufreihenfolge, den Nacherfassungsplan und die Maßnahmenliste tatsächlich aufschreiben; sie sind das Material für die gemeinsame Auswertung.

    **Der versteckte Punkt in dieser Runde:** Der Erstzugriff erfolgte am **Freitag der Vorwoche**. Das Tresorband stammt vom selben Tag. Die Gruppe sollte selbst darauf kommen, dass damit nicht sicher ist, ob dieser Stand sauber ist – und dass das vor der Freigabe geprüft werden muss.

    **Zum Abschluss in die Runde geben:** „Ihr habt am ersten Tag eine Entscheidung getroffen, die ihr heute anders treffen würdet. Welche?“ Das ist der Übergang in die Auswertung.

---

### Musterlösung

??? tip "Musterlösung Runde 1"
    **1 – Was tun wir jetzt?**

    **Einstufung: Sicherheitsvorfall, mindestens Verdachtsfall.** Drei Meldungen sind noch kein Beweis, aber sie bilden ein Muster: verschiedene Personen, verschiedene Abteilungen, dasselbe Symptom bei Dateien, dazu eine ungewöhnliche Schreiblast auf genau dem Server, auf dem diese Dateien liegen. Das ist kein Anwendungsfehler – Anwendungsfehler betreffen eine Anwendung, nicht vier Personen mit unterschiedlichen Programmen.

    Konkrete Maßnahmen, in dieser Reihenfolge:

    1. **Ereignisprotokoll eröffnen.** Ab jetzt wird alles mit Zeitmarke festgehalten.
    2. **Den Rechner des Auszubildenden vom Netz trennen** – nicht ausschalten. „Seit Freitagnachmittag komisch“ ist der einzige Hinweis auf einen möglichen Startpunkt und damit die wertvollste Information der ganzen Runde.
    3. **Auf dem Dateiserver nachsehen**, was da eigentlich schreibt: Prozesse, offene Verbindungen, welche Konten aktiv sind. Dabei nichts löschen und nichts neu starten.
    4. **Den Dateiserver vorbereitend isolieren** oder zumindest den Schreibzugriff einschränken, sobald sich der Verdacht erhärtet.
    5. **Den Ratschlag des Servicedesks zurücknehmen.** „Aus dem Papierkorb wiederherstellen“ ist bei einem Verschlüsselungsverdacht falsch: Es hilft nicht und erzeugt weitere Schreibvorgänge.
    6. **Prüfen, ob die Sicherungen intakt sind** – und zwar bevor jemand etwas zurückspielt.

    **2 – Wen informieren wir?**

    - **IT-Leitung sofort**, mit klarer Aussage: Verdacht auf einen Sicherheitsvorfall, keine Gewissheit.
    - **Servicedesk** mit einer Anweisung: Alle weiteren Meldungen dieser Art sofort und ungefiltert an die IT, nicht mehr als Einzeltickets bearbeiten. Diese eine Anweisung verkürzt die Erkennungszeit erheblich.
    - **Geschäftsführung**: eine kurze Vorabinformation ist angemessen. Sie kostet nichts und verhindert, dass die erste Nachricht später eine Notfallmeldung ist.
    - Noch **nicht** die gesamte Belegschaft – dafür ist die Lage zu unklar, und es gibt noch keine sinnvolle Handlungsanweisung.

    **3 – Was dokumentieren wir?**

    Zeitpunkte und Wortlaut aller drei Meldungen · den Beginn der erhöhten Schreiblast · welche Systeme wann vom Netz genommen wurden · die Feststellung, dass für Schreiblast **kein Alarm eingerichtet** ist (das ist bereits ein Befund für die Nachbereitung) · die getroffene Einstufung mit Begründung · die Anweisung an den Servicedesk.

    **Die ungeprüfte Annahme dieser Runde:** dass FeinPlan nicht betroffen ist. Geprüft hat das bisher niemand – es sagt nur niemand etwas.

??? tip "Musterlösung Runde 2"
    **1 – Was tun wir jetzt?**

    **Einstufung: bestätigter Sicherheitsvorfall.** Die Erpressernachricht macht aus dem Verdacht eine Tatsache. Ein Notfall ist es formal noch nicht, weil die Fertigung läuft – aber die Vorbereitung darauf beginnt jetzt.

    1. **Eindämmen:** Dateiserver vom Netz trennen. Betroffene Arbeitsplätze trennen. **Nicht ausschalten.** Und ganz wichtig: **die Verbindung zum Werk Süd kappen** und **das Backup-NAS vom Netz nehmen**, bevor es erreicht wird.
    2. **Fernzugänge schließen**, administrative Konten sperren oder Passwörter zurücksetzen – über einen Weg, der nicht am betroffenen System hängt.
    3. **Spuren sichern:** die Erpressernachricht sichern (Text, Dateiname, Zeitstempel), Protokolle sichern, betroffene Systeme nicht verändern. Wenn möglich, ein Abbild erstellen, bevor irgendetwas bereinigt wird.
    4. **Externe Unterstützung anfordern.** Ein Dreipersonenteam kann das nicht parallel leisten. Der ERP-Dienstleister, ein Sicherheitsdienstleister, gegebenenfalls die Zentrale Ansprechstelle Cybercrime der Polizei.
    5. **Prüfen, was noch nicht betroffen ist** – FeinPlan, Mailserver – und wie man es schützt. Das ist die wichtigste Frage dieser Runde.

    **Zu den beiden Vorschlägen der Administratoren – beide sind falsch:**

    - *„Alle Server herunterfahren.“* Trennen ja, ausschalten nein: Der Arbeitsspeicher enthält oft die entscheidenden Hinweise. Zudem legt es Systeme lahm, die noch arbeiten – die Fertigung würde ohne Not stehen.
    - *„Sofort zurücksichern.“* In eine noch aktive Umgebung zurückzuspielen bedeutet, die Sicherung mit zu verlieren. Vor jeder Rücksicherung muss die Umgebung sauber und der Sicherungsstand geprüft sein.

    **2 – Wen informieren wir?**

    - **Geschäftsführung sofort**, auch auswärts. Ab hier fallen Entscheidungen, die Geld kosten.
    - **Datenschutzbeauftragte Person** – jetzt, nicht später. Auf dem Dateiserver liegen Abteilungslaufwerke, und die Nachricht behauptet einen Datenabfluss. Die Frist beginnt mit der Kenntnis, nicht mit der Klärung.
    - **Gesamte Belegschaft** mit einer klaren Verhaltensanweisung: Geräte **nicht** ausschalten, sich nicht neu anmelden, keine Anhänge öffnen, Auffälligkeiten an eine genannte Nummer melden. Dazu die Ansage, dass die nächste Information zu einem genannten Zeitpunkt kommt.
    - **Werk Süd** gesondert, weil dort die Verbindung gekappt wird und die Leute sonst nur merken, dass „nichts mehr geht“.
    - **Dienstleister** nach Vertrag.
    - Noch **nicht** Kunden und Presse – dafür ist zu wenig bekannt. Aber die Zuständigkeit für externe Auskünfte wird jetzt festgelegt.

    **3 – Was dokumentieren wir?**

    Zeitpunkt und Wortlaut der Erpressernachricht · vollständige Liste der betroffenen Systeme und Laufwerke · alle Trennungen mit Uhrzeit · alle gesperrten Konten · wer wann informiert wurde · die beiden verworfenen Vorschläge **mit Begründung** – das schützt die Beteiligten später und ist der beste Beleg für strukturiertes Vorgehen.

??? tip "Musterlösung Runde 3"
    **1 – Was tun wir jetzt?**

    **Einstufung: Notfall.** Ein kritischer Prozess steht: Die Fertigung produziert nicht. Die MTA beträgt 24 Stunden, davon sind zwei verbraucht. Krisenstab einberufen, Notfallverfahren auslösen.

    **Die RPO-Rechnung – die zentrale Zahl dieser Runde:**

    ```text
    Erpressung entdeckt:              Montag
    letzte sichere Sicherung (Tresor): Freitag der Vorwoche

    Fr -> Sa -> So -> Mo -> Di -> Mi -> Do -> Fr -> Sa -> So -> Mo
     0     1     2     3     4     5     6     7     8     9    10

    tatsächlicher Datenverlust:  10 Tage
    eigene RPO-Vorgabe:           1 Tag  (24 Stunden)

    Faktor:  10 Tage / 1 Tag  =  10
    ```

    Der Betrieb verliert das **Zehnfache** dessen, was er sich selbst als Obergrenze gesetzt hat. Und der Grund ist keine höhere Gewalt, sondern Bauart: Das Backup-NAS war dauerhaft als Netzlaufwerk eingebunden und damit für den Angriff genauso erreichbar wie jedes andere Laufwerk. Das Band vom letzten Freitag steckte noch im Laufwerk – auch das ist eine Verbindung. Und der fehlgeschlagene Sicherungslauf vom Sonntag hat niemanden erreicht, weil kein Alarm darauf lag.

    **Die Stillstandsrechnung**, die die Geschäftsführerin gleich verlangen wird:

    ```text
    4.500 EUR je Produktionsstunde  x  16 Stunden je Werktag  =   72.000 EUR je Tag
    bei drei Tagen Stillstand                                  =  216.000 EUR
    ```

    Maßnahmen:

    1. **Krisenstab** einberufen: Einsatzleitung, Geschäftsführung, Fertigungsleitung, Kommunikation, Protokoll.
    2. **Verbindung zum Werk Süd sofort trennen**, falls in Runde 2 versäumt, und dort den Umfang feststellen.
    3. **Tresorband sichern** – physisch in Verwahrung nehmen, keinesfalls in ein Laufwerk am betroffenen Netz einlegen. Rücksicherung ausschließlich auf sauberer Hardware in einer getrennten Umgebung.
    4. **Notbetrieb ausrufen** und das Mindestbetriebsniveau festlegen: Welche Aufträge werden fertiggestellt? Können angearbeitete Teile mit Papierunterlagen weiterlaufen? Gibt es ausgedruckte oder als PDF vorliegende Stücklisten?
    5. **Externe Unterstützung** verbindlich beauftragen, nicht nur anfragen.
    6. **Meldeweg Datenschutz** in Gang setzen – siehe unten.

    **2 – Wen informieren wir?**

    - **Krisenstab** und **gesamte Belegschaft** mit einer aktualisierten Anweisung.
    - **Datenschutzbeauftragte Person und Aufsichtsbehörde:** Auf dem Dateiserver liegen Bewerbungsunterlagen, Lohnabrechnungen, Krankmeldungen und Schwerbehindertenausweise – das sind personenbezogene Daten, teilweise besonderer Kategorien. Zusammen mit der behaupteten Kopie der Daten ist von einem Risiko auszugehen. Die **72-Stunden-Frist ab Kenntnis** läuft. Eine unvollständige Meldung, die nachgereicht wird, ist ausdrücklich vorgesehen – Warten auf vollständige Aufklärung ist der falsche Weg.
    - **Betroffene Beschäftigte:** Wenn ein hohes Risiko besteht, sind sie zusätzlich zu benachrichtigen. Das ist gemeinsam mit der Datenschutzbeauftragten zu bewerten.
    - **Kunden mit laufenden Aufträgen:** frühzeitig, mit ehrlicher Aussage zum Liefertermin. Eine frühe Absprache rettet Termine, eine späte Entschuldigung nicht.
    - **Versicherung**, falls eine Cyber-Police besteht – dort gelten oft eigene, kurze Meldefristen.
    - **Auf die Frage der Geschäftsführerin „Wann läuft die Fertigung wieder?“** ist die einzig richtige Antwort: was bekannt ist, was noch geprüft wird, und wann die nächste belastbare Aussage kommt. Eine ausgedachte Zahl ist der Beginn des nächsten Problems.

    **3 – Was dokumentieren wir?**

    Zeitpunkt des Produktionsstillstands (der Beginn der Stillstandsrechnung) · Zustand jeder Sicherung mit Datum · den fehlgeschlagenen Lauf vom Sonntag und dass er nicht alarmiert wurde · welche personenbezogenen Daten betroffen sein könnten, mit Kategorien · Zeitpunkt der Kenntnis – das ist der Fristbeginn und die wichtigste einzelne Zeitmarke des Falls · Beschluss zum Notbetrieb und das festgelegte Mindestbetriebsniveau.

??? tip "Musterlösung Runde 4"
    **1 – Was tun wir jetzt?**

    **Zum Angebot des ERP-Dienstleisters: ablehnen, jedenfalls in dieser Form.** Drei Gründe:

    - Es wäre ein Einspielen in eine **noch nicht bereinigte Umgebung**. Solange nicht feststeht, dass der Zugang des Angreifers geschlossen ist, wird die neue Datenbank verschlüsselt wie die alte.
    - Drei Wochen alt ist **schlechter** als das Tresorband mit zehn Tagen. Es wäre ein Rückschritt, kein Notbehelf.
    - Die Herkunft ist unklar: Eine Kopie der Produktivdatenbank auf einem Testsystem des Dienstleisters ist selbst ein Befund – für die Nachbereitung und möglicherweise für den Datenschutz.

    Verwertbar ist das Angebot trotzdem: Der Dienstleister hat Fachwissen zum System und sollte beim Wiederanlauf **auf sauberer Hardware** unterstützen.

    **Zur Zahlungsfrage.** Die Entscheidung trifft die Geschäftsführung, aber die Gruppe muss die Argumente liefern:

    - Behörden und das BSI **raten von Zahlungen ab**. Eine Zahlung finanziert das Geschäftsmodell und macht den Betrieb zum bekannten zahlungsbereiten Ziel.
    - Eine Zahlung **garantiert nichts**: weder einen funktionierenden Schlüssel noch die Löschung abgeflossener Daten. Die Zusage einer erpressenden Partei ist wertlos.
    - Entschlüsselung ist **nicht schneller** als Wiederherstellung: Auch mit Schlüssel müssen alle Systeme geprüft, bereinigt und getestet werden – die Lücke bleibt sonst offen.
    - Sie **ändert nichts an den Meldepflichten** und nichts an der abgeflossenen Datenkopie.
    - Und: Es können **rechtliche Fragen** berührt sein. Das ist nichts, was man am Nachmittag im Krisenstab nebenbei klärt.

    Der Krisenstab dokumentiert die Entscheidung samt Begründung – so oder so.

    **Weiter:** Notbetrieb stabilisieren, Ersatzverfahren für die Auftragserfassung festlegen (Vorlagen, Nummernkreis, Ablageort, Zuständigkeit), Wiederanlauf auf sauberer Hardware vorbereiten.

    **2 – Wen informieren wir?**

    - **Der Kunde mit der verdächtigen Mail** wird zurückgerufen – und zwar noch heute. Möglicherweise geht von euch eine Gefahr aus. Inhalt: Wir haben einen Sicherheitsvorfall, bitte öffnen Sie keine Anhänge aus Mails, die vorgeblich von uns stammen, hier ist Ihr Ansprechpartner. Das ist keine Frage der Höflichkeit, sondern eine Warnung an einen Geschäftspartner.
    - **Alle weiteren Kunden und Lieferanten**, die im Adressbuch stehen könnten, bekommen dieselbe Warnung – über einen sauberen Kanal.
    - **Die Presse** ausschließlich über die benannte Stelle, mit einer abgestimmten, kurzen Aussage: was passiert ist, dass Fachleute eingebunden sind, dass Betroffene informiert werden, dass keine Spekulationen möglich sind. **Kein Kommentar** ist die schlechteste Variante – sie erzeugt die Schlagzeile, die man vermeiden wollte. Falsche Details sind allerdings noch schlechter.
    - **Belegschaft** vor der Presse: Beschäftigte sollen nicht aus der Zeitung erfahren, was in ihrem Betrieb los ist. Dazu die Bitte, keine eigenen Auskünfte zu geben, und der Hinweis, an wen zu verweisen ist.

    **3 – Was dokumentieren wir?**

    Kundenanruf mit Zeitpunkt und Inhalt (Hinweis auf einen möglichen Verbreitungsweg – forensisch relevant) · das Angebot des Dienstleisters und die Ablehnung mit Begründung · die Zahlungsentscheidung mit Begründung und wer sie getroffen hat · alle externen Auskünfte, wortgleich · Presseanfrage und abgegebene Stellungnahme · die betroffenen Fertigungsaufträge mit Terminen und der Vertragsstrafenrisiko-Bewertung.

??? tip "Musterlösung Runde 5"
    **1 – Wiederanlaufreihenfolge**

    ```text
    1  Netzinfrastruktur, Verzeichnisdienst, Namensauflösung
         -> ohne diese Grundlagen läuft nichts anderes an

    2  FeinPlan (Datenbank + Anwendung) auf sauberer Hardware
         -> hoechste Kritikalitaet: 4.500 EUR je Produktionsstunde

    3  Dateiserver: zuerst Konstruktion und Arbeitsvorbereitung
         -> ohne Stuecklisten und Zeichnungen nuetzt FeinPlan wenig

    4  Mailserver
         -> notwendig fuer Kunden- und Lieferantenkontakt

    5  uebrige Abteilungslaufwerke, Auswertungen, Nebensysteme
         -> koennen warten
    ```

    Begründung: **Abhängigkeit vor Kritikalität.** Ein System, dessen Voraussetzungen fehlen, kommt auch dann nicht hoch, wenn es das wichtigste ist. Innerhalb einer Abhängigkeitsstufe entscheidet der Stundensatz aus der BIA.

    **Der versteckte Prüfpunkt:** Der Erstzugriff erfolgte am **Freitag der Vorwoche** – am selben Tag, von dem das Tresorband stammt. Es ist damit **nicht gesichert**, dass dieser Stand sauber ist. Vor der Freigabe muss geprüft werden, ob sich auf dem zurückgespielten Stand bereits Spuren finden, und der Wiederanlauf gehört unter erhöhte Beobachtung. Wer diesen Punkt sieht, hat die Übung verstanden.

    Weitere Bedingungen: Alle Zugangsdaten, die auf betroffenen Systemen lagen oder von dort verwendet wurden, gelten als kompromittiert und werden gewechselt – auch die des Fernwartungszugangs, auch die des Dienstleisters. Die fachliche Freigabe erteilt der Fachbereich nach einem echten Test, nicht die IT nach dem Hochfahren.

    **2 – Plan für die Nacherfassung**

    1. **Bestandsaufnahme:** alle 210 Belege einsammeln, zählen, an einem Ort zusammenführen, gegen Verlust sichern (Kopie oder Scan, bevor irgendetwas weitergegeben wird).
    2. **Nachträglich nummerieren** und in eine Reihenfolge bringen – nach Datum und Schicht.
    3. **Doppelerfassungen finden:** Belege, die dieselbe Bestellung betreffen, und Vorgänge, die im Werk Süd und im Werk Nord parallel erfasst wurden.
    4. **Zwei-Personen-Regel** bei der Eingabe: Eingabe und Kontrolle getrennt. Bei 210 Belegen unter Zeitdruck sind Übertragungsfehler sonst sicher.
    5. **Reihenfolge:** zuerst alles, was Lieferung und Rechnungsstellung betrifft, dann Bestände, dann der Rest.
    6. **Abgleich am Ende:** Bestände und offene Aufträge gegen die Wirklichkeit prüfen – im Zweifel eine Inventur der betroffenen Artikel.
    7. **Formelles Ende des Notbetriebs:** Ab einem benannten Zeitpunkt gelten die Papierverfahren als beendet. Ohne diese Ansage laufen beide Verfahren wochenlang nebeneinander, und niemand weiß, welcher Bestand stimmt.

    **3 – Maßnahmenliste (Auswahl, jeweils mit Verantwortlichem und Frist)**

    | # | Maßnahme | Setzt an bei |
    |---|---|---|
    | 1 | Sicherungskonzept umbauen: mindestens eine Kopie **offline und getrennt** vom Netz, Bänder unmittelbar nach dem Lauf auslagern, unveränderbare Sicherungen prüfen | RPO von 10 Tagen |
    | 2 | **Alarm auf fehlgeschlagene Sicherungsläufe** und auf ausbleibende Läufe (Lebendüberwachung) | niemand hat den Fehlschlag gesehen |
    | 3 | **Rücksicherung regelmäßig üben** und die tatsächliche Dauer messen – erst diese Zahl macht die RTO belastbar | RTO war eine Schätzung |
    | 4 | **Fernwartungszugänge inventarisieren**, befristen, mit Zwei-Faktor-Authentisierung versehen, Standardkonten entfernen | der Eintrittsweg |
    | 5 | **Netzsegmentierung** zwischen Standorten, Fertigung und Verwaltung; Backup-Netz getrennt | Ausbreitung über VPN und Netzlaufwerk |
    | 6 | **Notfallhandbuch** erstellen: Rollen mit Namen, Erreichbarkeiten, Wiederanlaufreihenfolge, Ersatzverfahren – **offline** und ausgedruckt | nichts davon war vorhanden |
    | 7 | **Ersatzverfahren vorbereiten**: Formularvorlagen mit Nummernkreis, PDF-Kopien kritischer Stücklisten auf einem getrennten Gerät | improvisierte Formulare, 210 unnummerierte Belege |
    | 8 | **Servicedesk-Regel**: gleichartige Meldungen aus mehreren Abteilungen lösen sofort eine Höherstufung aus | zwei verlorene Stunden in Runde 1 |
    | 9 | **Monitoring erweitern**: Schwelle auf ungewöhnliche Schreiblast, Alarm auf Massenumbenennungen | die Schreiblast war sichtbar und hat niemanden erreicht |
    | 10 | **Tabletop-Übung** wiederholen, danach eine Teilübung mit echter Rücksicherung | der Plan war nie geübt |

    **Vollständigkeitsprüfung für die Maßnahmenliste:** Jede Maßnahme muss auf einen **konkreten Punkt im Verlauf** zeigen. Eine Maßnahme ohne Bezug zum Geschehenen ist eine allgemeine gute Idee – und die gehört nicht in diese Liste.

---

### Bewertung: die typischen Fehlentscheidungen

Diese Tabelle ist das Herzstück der gemeinsamen Auswertung. Geht sie durch und lasst die Gruppen selbst sagen, welche davon sie getroffen haben – erfahrungsgemäß trifft jede Gruppe mindestens drei.

| Fehlentscheidung | Warum sie verlockend ist | Was sie anrichtet | Besser |
|---|---|---|---|
| **In Runde 1 bei „Anwendungsfehler“ bleiben** | drei Meldungen sind kein Beweis, und niemand will Alarm schlagen | zwei Stunden nach falschem Verfahren; die Ausbreitung läuft weiter | Muster erkennen und hochstufen; Rückstufung kostet fünf Minuten |
| **Alle Server sofort herunterfahren** | fühlt sich entschlossen und sicher an | Arbeitsspeicher weg, Spuren weg; noch laufende Systeme werden ohne Not gestoppt | trennen statt ausschalten; gezielt isolieren |
| **Sofort zurücksichern** | „dann läuft es wenigstens wieder“ | Rücksicherung in eine aktive Umgebung – die Sicherung ist danach auch verschlüsselt | erst bereinigen, Sicherungsstand prüfen, dann auf sauberer Hardware |
| **Das Backup-NAS im Netz lassen** | es fällt schlicht nicht ein | die letzte tagesaktuelle Sicherung geht verloren; RPO springt von 1 auf 10 Tage | Sicherungssysteme zuerst trennen – sie sind das wertvollste Ziel |
| **Die Verbindung zum Werk Süd stehen lassen** | „da ist ja nichts passiert“ | der zweite Standort wird ebenfalls betroffen; der Notbetrieb verliert seinen letzten Rückhalt | Standortverbindung früh kappen und dort den Umfang prüfen |
| **Kein Protokoll führen** | im Stress fehlt die Zeit | Übergaben misslingen, Meldungen sind nicht belegbar, die Nachbereitung wird zur Erinnerungsübung | Protokollrolle besetzen und durchhalten – auch und gerade wenn es eng wird |
| **Den Datenschutz erst am nächsten Tag einbinden** | „wir wissen doch noch gar nicht, ob Daten weg sind“ | die 72-Stunden-Frist läuft ab Kenntnis, nicht ab Klärung | in der ersten Lagebesprechung fragen: Sind personenbezogene Daten betroffen? |
| **Der Geschäftsführerin eine Zeitangabe nennen** | die Frage steht im Raum, man will handlungsfähig wirken | eine gerissene Zusage kostet mehr Vertrauen als eine ehrliche Unsicherheit | sagen, was bekannt ist, und wann die nächste Information kommt |
| **Die drei Wochen alte Kopie einspielen** | schnelle Hilfe, kostet nichts | mehr Datenverlust als das Tresorband, in einer unbereinigten Umgebung | ablehnen; Fachwissen des Dienstleisters für den sauberen Wiederanlauf nutzen |
| **Die Presse ignorieren** | „wir haben Wichtigeres zu tun“ | der Bericht erscheint trotzdem – ohne eure Sicht, mit Spekulationen | eine Stimme, kurze abgestimmte Aussage, Belegschaft vorher informieren |
| **Den Kunden mit der Mail nicht zurückrufen** | peinlich, und man weiß noch nichts Genaues | von euch geht möglicherweise eine Gefahr aus; Geschäftspartner erfahren es anders | am selben Tag warnen, mit Handlungsanweisung und Ansprechpartner |
| **Die Einsatzleitung arbeitet selbst mit** | sie ist meist die fachlich stärkste Person | niemand hat den Überblick; Aufgaben werden doppelt und gar nicht gemacht | Rollentrennung vorher festlegen und durchhalten |
| **Nach dem Wiederanlauf sofort freigeben** | alle wollen zurück in den Normalbetrieb | ein unsauberer Stand geht produktiv; die Rückkehr wird zur zweiten Runde | fachlicher Test, benannte Freigabe, erhöhte Beobachtung |
| **Kein formelles Ende des Notbetriebs** | es „läuft ja wieder“ | Papier- und Systemverfahren laufen wochenlang parallel, die Bestände stimmen nicht | Zeitpunkt benennen, Nacherfassung abschließen, Abgleich durchführen |

!!! tip "Woran ihr eine starke Lösung erkennt"
    Nicht daran, dass alles richtig war – sondern an sechs Merkmalen:

    1. Die **Einstufung** wurde in Runde 1 oder spätestens Runde 2 hochgezogen, und die Begründung steht im Protokoll.
    2. Es gibt ein **durchgehendes Protokoll** von Runde 1 bis Runde 5, mit Begründungen und verworfenen Optionen.
    3. Die Gruppe hat **das Backup-NAS und die Standortverbindung** als eigene Ziele erkannt, nicht nur die betroffenen Server.
    4. Der **Datenschutz** kam ins Spiel, bevor jemand nach der Frist gefragt hat.
    5. Es wurde ein **Mindestbetriebsniveau** festgelegt – der Notbetrieb versucht nicht, den Normalbetrieb nachzubilden.
    6. Die **Maßnahmenliste** zeigt auf konkrete Stellen im Verlauf zurück, nicht auf allgemeine gute Vorsätze.

---

### Reflexionsfragen für die Auswertung

Diese Fragen gehören ins Plenum, nicht in die Gruppenarbeit. Zwei bis drei davon füllen eine gute Auswertung.

1. **Ab wann war klar, dass es kein Anwendungsfehler ist – und was hat euch gehindert, das eine Runde früher auszusprechen?** Fast jede Gruppe erkennt die Lage vor der Runde, in der sie handelt. Der Abstand dazwischen ist die eigentliche Erkenntnis.

2. **Welche eurer Entscheidungen in Runde 1 oder 2 hat sich in Runde 3 gerächt?** Und woran hättet ihr das damals erkennen können, ohne zu wissen, was kommt?

3. **Der Datenverlust betrug zehn Tage statt einem. Ist das ein technisches oder ein organisatorisches Versagen?** Beides ist vertretbar – die Begründung ist interessanter als die Antwort. Anschlussfrage: Wie viele Betriebe, die ihr kennt, hätten dieselbe Sicherungsarchitektur?

4. **Wer hätte in eurem eigenen Betrieb die Entscheidung getroffen, die Fertigung anzuhalten oder weiterlaufen zu lassen – und weiß diese Person das?** Wenn die Antwort unsicher ausfällt, habt ihr die wertvollste Erkenntnis des Vormittags.

5. **Was hätte diesen Vorfall am billigsten verhindert?** Ordnet die zehn Maßnahmen aus der Liste nach Wirkung geteilt durch Aufwand. Was steht oben – und warum ist es trotzdem in vielen Betrieben nicht umgesetzt?

6. **Wenn ihr nur eine einzige Sache mitnehmen dürftet: Was ändert ihr am Montag nach dieser Übung?** Eine Sache, konkret, mit einem Namen daran. Alles andere ist ein guter Vorsatz.

---

## Weiterlesen

- [Incident Response & Business Continuity](incident-und-bcm.md): die Theorie zu dieser Übung – Phasen, Rollen, Kommunikationsplan, BCM
- [Backup & Recovery](backup-und-recovery.md): warum die Sicherungsarchitektur in diesem Szenario scheitern musste
- [Monitoring & Betrieb](monitoring.md): warum die erhöhte Schreiblast niemanden erreicht hat
- [Sicherheitsvorfälle](../it-sicherheit/sicherheitsvorfaelle.md): Erkennung, Bewertung und Sofortmaßnahmen aus Sicherheitssicht
- [Beweissicherung & Prävention](../it-sicherheit/beweissicherung-und-praevention.md): Spuren sichern, ohne sie zu zerstören
- [Risikomanagement](../it-sicherheit/risikomanagement.md): RTO, RPO und die Business Impact Analyse, aus denen die Zielwerte dieses Szenarios stammen
