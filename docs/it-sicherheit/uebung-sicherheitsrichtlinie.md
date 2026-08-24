---
title: "Übung: Sicherheitsrichtlinie entwerfen"
description: "Gruppenübung für 3 bis 5 Personen: Für einen Gebäudetechnikbetrieb nach einem Gerätediebstahl eine vollständige Sicherheitsrichtlinie entwerfen – wahlweise zu mobilen Geräten und Heimarbeit oder zum Umgang mit Zugangsdaten. Mit Schutzbedarfsbegründung je Schutzziel, prüfbar formulierten Regeln, dokumentierter Abwägung zwischen Sicherheit und Praktikabilität, Ausnahme- und Verstoßregelung sowie einem Prüfplan. Enthält Szenario, Rollenverteilung, sechs Hilfekarten, ein Bewertungsraster über 50 Punkte, zwei ausführliche Musterlösungen mit vollständigem Richtlinientext und Reflexionsfragen für die Auswertung."
---

# Übung – Eine Sicherheitsrichtlinie entwerfen

<span class='badge badge-praxis'>Gruppenarbeit</span> &nbsp; Eine Richtlinie zu **lesen** ist einfach. Eine zu **schreiben**, die verbindlich, prüfbar und trotzdem im Alltag durchhaltbar ist, ist die eigentliche Arbeit – und genau die macht ihr hier.

In dieser Übung entwerft ihr für einen konkreten Betrieb eine vollständige Sicherheitsrichtlinie zu einem Thema, das ihn gerade schmerzt. Ihr müsst dabei alles zusammenbringen, was in diesem Block behandelt wurde: den **Schutzbedarf** begründen, aus dem Szenario die **Risiken** ableiten, daraus **Maßnahmen** machen, die Maßnahmen so **formulieren**, dass man ihre Einhaltung prüfen kann – und zwischendurch die unbequemste Entscheidung überhaupt treffen: wie viel Sicherheit ein Betrieb verträgt, ohne dass die Regel umgangen wird.

!!! abstract "Was ihr in dieser Übung trainiert"
    - aus einem betrieblichen Sachverhalt den **Schutzbedarf je Schutzziel** ableiten und begründen
    - **prüfbare Regeln** formulieren statt Appelle – mit Verbindlichkeitsgraden
    - die Abwägung zwischen **Sicherheit und Praktikabilität** bewusst treffen und schriftlich begründen
    - **Ausnahmen, Verstöße und Zuständigkeiten** regeln, statt sie offenzulassen
    - einen **Prüfplan** entwerfen: Wer stellt woran fest, ob die Regel eingehalten wird?
    - eure Lösung gegenüber einer kritischen Rückfrage **verteidigen** – so, wie es die Prüfung verlangt

!!! info "Was ihr vorher gelesen haben solltet"
    [Grundlagen & Schutzziele](grundlagen.md) für Schutzziele und Schutzbedarf, [ISMS & Standards](isms.md) für Dokumentenhierarchie, Richtlinienaufbau und Überwachung der Einhaltung. Wer zusätzlich [Risikomanagement](risikomanagement.md) kennt, tut sich bei Teil 1 leichter.

---

## Der Rahmen

| | |
|---|---|
| **Gruppengröße** | 3 bis 5 Personen |
| **Zeitrahmen** | 60 bis 90 Minuten Gruppenarbeit, danach gemeinsame Auswertung |
| **Material** | Papier oder ein gemeinsames Dokument, mehr nicht. Keine Software nötig. |
| **Ergebnis** | ein Richtlinienentwurf von **höchstens zwei Seiten**, ein Begründungsblatt und eine Kurzvorstellung von etwa fünf Minuten |

!!! tip "Zwei Varianten – teilt sie im Kurs auf"
    Es gibt zwei Themen zur Auswahl. Am meisten bringt die Auswertung, wenn **beide** bearbeitet werden: Etwa die Hälfte der Gruppen nimmt Variante A, die andere Variante B. In der Auswertung sieht man dann, dass dieselbe Methode zu sehr verschiedenen Richtlinien führt – und wo beide sich überschneiden.

    - **Variante A – Mobile Geräte und Heimarbeit**
    - **Variante B – Umgang mit Zugangsdaten und Fernwartungszugängen**

---

## Der Betrieb

**Nordwerk Gebäudetechnik GmbH**, 165 Beschäftigte, zwei Standorte. Der Betrieb plant, baut und wartet gebäudetechnische Anlagen: Elektroinstallation, Heizung, Lüftung und Klima sowie – das ist der wachsende Bereich – **Sicherheitstechnik**: Schließanlagen, Zutrittskontrolle, Einbruchmelde- und Videoanlagen.

### Struktur und Menschen

| Bereich | Personen | Arbeitsweise |
|---|---|---|
| Planung und Kalkulation | 40 | CAD, Angebotskalkulation, überwiegend am Schreibtisch; Heimarbeit stark genutzt |
| Montage und Kundendienst | 95 | ganztägig auf Baustellen und in Kundenobjekten, mit Servicefahrzeug |
| Verwaltung, Einkauf, Personal | 30 | Hauptsitz, teilweise Heimarbeit |
| IT | 2 (plus ein externer Dienstleister) | betreuen beide Standorte |

### Technik im Einsatz

- Windows-Domäne mit Dateiserver, Handwerkersoftware für Aufträge und Kalkulation, Mail in einem Cloud-Dienst, VPN-Zugang für die Heimarbeit
- **60 Notebooks** (Planung, Verwaltung, Führungskräfte), **25 feste Arbeitsplätze**, **95 Tablets** in den Servicefahrzeugen mit einer Auftrags-App: Auftragsdaten, Fotodokumentation, digitale Unterschrift des Kunden
- **Keine zentrale Geräteverwaltung.** Geräte werden von der IT von Hand eingerichtet und ausgegeben. Eine Geräteliste existiert als Tabelle, gepflegt „so gut es geht“.
- Festplattenverschlüsselung ist „auf den meisten neueren Notebooks“ aktiv – wo genau, weiß niemand. Auf den Tablets ist sie nicht aktiviert.
- Die Techniker nutzen überwiegend **ihre privaten Mobiltelefone**: für Anrufe mit Kunden, für Kurznachrichtengruppen je Baustelle und für schnelle Fotos, weil das Tablet dafür zu unhandlich ist. Das ist nie geregelt, aber allen bekannt.
- Für die Heimarbeit gibt es keine Regelung außer einer Rundmail der Geschäftsführung: bis zu drei Tage pro Woche möglich, „nach Absprache mit der Führungskraft“.

### Was der Betrieb an Informationen hat

| Information | Besonderheit |
|---|---|
| Angebotskalkulationen, Nachkalkulationen | wirtschaftlich empfindlich, besonders vor Vergabeentscheidungen |
| CAD-Pläne und Anlagendokumentationen von Kundenobjekten | teilweise mit Angaben zu Leitungswegen, Technikräumen, Notstromversorgung |
| **Schließpläne, Zutrittskonzepte und Anlagenpläne der Sicherheitstechnik** | benennen für Kundenobjekte, wer wo hineinkommt, wo Melder sitzen und wie die Anlage scharfgeschaltet wird |
| Zugangsdaten für die **Fernwartung** der Gebäudeleittechnik bei rund 40 Kunden | ermöglichen den Eingriff in Heizung, Lüftung und teilweise Zutrittstechnik aus der Ferne |
| Kunden- und Auftragsdaten, Unterschriften, Fotos aus Objekten | teils personenbezogen |
| Personaldaten, Bescheinigungen aus der arbeitsmedizinischen Vorsorge | besonders geschützte Daten in der Verwaltung |

Zu den Kunden gehören unter anderem mehrere Arztpraxen, ein Pflegeheim, eine Filiale eines Finanzdienstleisters und der Verwaltungsbau eines mittelständischen Industriebetriebs.

### Der Anlass

Einem Servicetechniker wurde an einem Freitagabend das Fahrzeug aufgebrochen. Gestohlen wurden Werkzeug und das **Dienst-Tablet**. Auf dem Gerät lagen die Auftragsdaten der letzten Wochen, Fotos aus Kundenobjekten und mehrere heruntergeladene PDF-Dokumentationen, darunter der **Schließplan und die Meldergruppenübersicht eines Kundenobjekts**.

Das Tablet war nicht verschlüsselt und mit einer vierstelligen PIN gesichert. Die Auftrags-App war dauerhaft angemeldet. Der Techniker meldete den Verlust am **Montagmorgen** – er wusste nicht, wen er am Wochenende hätte anrufen sollen, und wollte „nicht wegen eines Tablets jemanden im Urlaub stören“.

Zwei Wochen später verlangt der betroffene Kunde schriftlich einen Nachweis darüber, wie Nordwerk mit den Unterlagen seiner Objekte umgeht. Ohne belastbare Antwort wird der Wartungsvertrag nicht verlängert. Die Geschäftsführung hat daraufhin entschieden: Es wird eine verbindliche Richtlinie geben – und zwar eine, die im Alltag der Techniker funktioniert.

### Randbedingungen, die ihr einhalten müsst

- **Budget:** vorhanden, aber begrenzt. Eine zentrale Geräteverwaltung ist finanzierbar. Der Austausch aller 95 Tablets im laufenden Jahr ist es nicht.
- **Es gibt einen Betriebsrat.** Alles, was das Verhalten von Beschäftigten auswertbar macht, muss mit ihm abgestimmt werden.
- **Akzeptanz entscheidet.** Die Techniker arbeiten unter Zeitdruck, tragen oft Handschuhe, stehen im Regen auf Gerüsten und sind mehrheitlich nicht IT-affin. Eine Regel, die auf der Baustelle nicht durchhaltbar ist, wird nicht eingehalten – dann steht der Betrieb schlechter da als vorher.
- **Der Mobilfunkempfang** in Technikräumen, Kellern und Tiefgaragen ist häufig schlecht bis nicht vorhanden. Rein online arbeitende Lösungen scheitern dort.
- Ihr schreibt eine **Richtlinie**, kein Konzept und keine Arbeitsanweisung. Produktnamen und Menüwege gehören nicht hinein.

---

## Euer Auftrag

Wählt eine Variante und liefert **fünf Teilergebnisse** ab.

=== "Variante A – Mobile Geräte und Heimarbeit"

    Entwerft die Richtlinie **„Mobile Geräte und Arbeiten außerhalb der Betriebsstätten“**.

    Sie muss mindestens abdecken: dienstliche Notebooks, Tablets und Mobiltelefone; die Frage privater Geräte; das Arbeiten im Home-Office und beim Kunden; den Umgang mit Papierunterlagen außerhalb des Betriebs; die Nutzung fremder Netze; und den Fall, um den es hier eigentlich geht – **Verlust oder Diebstahl eines Geräts**.

=== "Variante B – Zugangsdaten und Fernwartung"

    Entwerft die Richtlinie **„Umgang mit Zugangsdaten und Fernwartungszugängen“**.

    Zusätzlich zum Szenario oben gilt für diese Variante folgender Ist-Zustand, den die IT bei einer Bestandsaufnahme festgestellt hat:

    - Die Zugangsdaten für die Fernwartung der rund 40 Kundenanlagen liegen in einer Tabellendatei auf dem Dateiserver, lesbar für alle Beschäftigten des Bereichs Service.
    - Bei etwa der Hälfte der Anlagen ist noch das **Standardkennwort des Herstellers** gesetzt.
    - Auf den Anlagen existiert häufig nur ein einziges Konto namens `service`, das alle Techniker gemeinsam nutzen.
    - Kennwörter werden untereinander per Kurznachricht weitergegeben, wenn jemand auf der Baustelle nicht weiterkommt.
    - Nach dem Ausscheiden von Beschäftigten wurden Kennwörter noch nie geändert. In den letzten zwei Jahren haben elf Personen den Betrieb verlassen.
    - Das Administratorkonto der Windows-Domäne wird von beiden IT-Mitarbeitenden und dem externen Dienstleister gemeinsam genutzt.
    - Der VPN-Zugang für die Heimarbeit funktioniert mit Benutzername und Kennwort, ohne zweiten Faktor.

### Die fünf Teilergebnisse

| Teil | Was ihr abgebt | Umfang |
|---|---|---|
| **1 – Schutzbedarf** | Eine Tabelle: Welche Informationen sind betroffen, und wie hoch ist der Schutzbedarf **je Schutzziel** (Vertraulichkeit, Integrität, Verfügbarkeit)? Mit je einem Satz Begründung. | ½ Seite |
| **2 – Die Richtlinie** | Der eigentliche Entwurf mit allen Pflichtabschnitten. Regeln als nummerierte Punkte, mit Verbindlichkeitsgrad. | max. 2 Seiten |
| **3 – Abwägungsblatt** | Drei bis fünf Entscheidungen, bei denen ihr zwischen Sicherheit und Praktikabilität abwägen musstet: Welche Möglichkeiten gab es, wofür habt ihr euch entschieden, **warum** – und welches Restrisiko bleibt? | ½ bis 1 Seite |
| **4 – Prüfplan** | Für mindestens fünf eurer Regeln: Wer prüft die Einhaltung, woran genau, wie oft, und was passiert bei Abweichung? | ½ Seite |
| **5 – Kurzvorstellung** | Fünf Minuten vor dem Plenum: der Kern eurer Richtlinie und die **eine Entscheidung**, über die ihr am längsten gestritten habt. | mündlich |

!!! warning "Die Falle, in die fast jede Gruppe tappt"
    Der erste Reflex ist, sofort Regeln zu schreiben – meist die, die man selbst schon einmal irgendwo gelesen hat. Dann steht am Ende eine Richtlinie, die zu jedem Betrieb der Welt passt und zu diesem hier nicht besonders.

    Nehmt euch die ersten Minuten für **Teil 1**. Wer den Schutzbedarf benannt hat, schreibt danach andere Regeln – und kann sie begründen, wenn jemand fragt. Genau diese Begründung ist in der Prüfung der Teil, für den es Punkte gibt.

---

## Rollen in der Gruppe

Verteilt die Rollen zu Beginn. Wechseln könnt ihr immer noch.

| Rolle | Aufgabe |
|---|---|
| **Schreibkraft** | führt das Dokument, formuliert die Regeln aus. Nur eine Person schreibt – sonst entstehen drei Fassungen. |
| **Anwältin oder Anwalt der Technikerin** | vertritt konsequent die Sicht der Person auf der Baustelle: Handschuhe, Zeitdruck, kein Empfang. Fragt bei jeder Regel: „Wie mache ich das im Regen um sieben Uhr morgens?“ |
| **Anwältin oder Anwalt des Kunden** | vertritt den Kunden aus dem Anlass. Fragt bei jeder Regel: „Reicht mir das als Nachweis? Würde ich damit den Vertrag verlängern?“ |
| **Prüferin oder Prüfer** | verantwortet Teil 4. Fragt bei jeder Regel: „Woran stelle ich fest, ob sich jemand daran hält?“ Streicht alles, was nicht prüfbar ist. |
| **Zeitwächter und Vortrag** | achtet auf die Phasen, hält Teil 3 fest und stellt am Ende vor. |

Bei drei Personen fasst ihr die letzten beiden Rollen zusammen und lasst die Kundenrolle rundenweise wandern.

---

## Vorgeschlagener Ablauf

| Phase | Dauer | Was passiert |
|---|---|---|
| **Verstehen** | ca. 10 Min. | Szenario gemeinsam durchgehen. Sammelt zunächst nur: Was kann hier alles schiefgehen? Zehn Stichpunkte reichen. |
| **Teil 1: Schutzbedarf** | ca. 10 Min. | Tabelle bauen, je Schutzziel bewerten, jeweils ein Satz Begründung. |
| **Teil 2: Regeln entwerfen** | ca. 25 Min. | Erst sammeln, dann formulieren. Die Prüferrolle streicht mit. |
| **Teil 3: Abwägen** | ca. 15 Min. | Die strittigen Punkte durchgehen: Welche Möglichkeiten, welche Entscheidung, welches Restrisiko? |
| **Teil 4: Prüfplan** | ca. 10 Min. | Fünf Regeln aussuchen und den Prüfweg beschreiben. |
| **Aufräumen und Vortrag vorbereiten** | ca. 10 Min. | Kürzen! Alles, was ins Konzept oder in eine Arbeitsanweisung gehört, fliegt raus. |

---

## Das Gerüst für Teil 2

Nutzt diese Abschnitte – sie sind zugleich die Gliederung, nach der im Bewertungsraster Punkte vergeben werden.

```text
1  Zweck und Ziel
   Wovor schützt diese Richtlinie? Welches Schutzziel steht dahinter?

2  Geltungsbereich
   Für wen gilt sie (auch: Leiharbeit, Auszubildende, externe Dienstleister)?
   Für welche Geraete, Daten, Orte? Und wofuer gilt sie ausdruecklich nicht?

3  Begriffe
   Nur die wenigen, die missverstanden werden koennen.

4  Regeln
   Nummeriert. Jede Regel mit Verbindlichkeitsgrad: MUSS / SOLL / KANN.
   Jede Regel so, dass ein Aussenstehender ihre Einhaltung feststellen kann.

5  Rollen und Verantwortung
   Wer setzt um, wer entscheidet, wer prueft, wer meldet an wen?

6  Ausnahmen
   Wie beantragt man eine, wer genehmigt sie, wie lange gilt sie,
   wo wird sie dokumentiert?

7  Verstoesse
   Was passiert bei Nichteinhaltung? Und was passiert bei einer Meldung?

8  Inkrafttreten, Geltungsdauer, Ueberpruefung
   Ab wann, Version, wann wird sie das naechste Mal geprueft?
```

---

## Hilfekarten

!!! tip "Spielregel"
    Klappt eine Karte erst auf, wenn ihr an genau diesem Punkt wirklich feststeckt – und dann nur diese eine. Der Erkenntnisgewinn dieser Übung steckt im Ringen um die Formulierung, nicht im fertigen Text.

??? info "Hilfekarte 1 – „Wir wissen nicht, wo wir anfangen sollen“"
    Fangt nicht bei den Regeln an, sondern bei einer Liste. Zwei Fragen, jede fünf Minuten:

    **Erstens: Was kann hier schiefgehen?** Geht das Szenario Absatz für Absatz durch und schreibt zu jedem Absatz einen Satz nach dem Muster *„Weil …, kann … passieren, wodurch …“*. Aus dem Anlass ergibt sich sofort einer: *Weil Tablets unverschlüsselt sind und Objektunterlagen lokal gespeichert werden, kann bei einem Fahrzeugaufbruch ein Schließplan in fremde Hände geraten, wodurch ein Kundenobjekt angreifbar wird und der Wartungsvertrag verloren geht.*

    **Zweitens: Was von dem, was schiefgehen kann, betrifft dieses Thema?** Streicht alles andere. Ihr schreibt eine Richtlinie zu einem Thema, nicht das Sicherheitskonzept des Betriebs.

    Was übrig bleibt, ist die Liste, gegen die eure Regeln arbeiten. Jede Regel muss auf mindestens einen Punkt dieser Liste zeigen – und für jeden Punkt der Liste sollte es mindestens eine Regel geben.

??? info "Hilfekarte 2 – „Unsere Regeln klingen alle wie Appelle“"
    Das ist der häufigste Befund. Der Test dagegen ist einfach: **Kann eine außenstehende Person ohne Rückfrage feststellen, ob die Regel eingehalten wurde?** Wenn nicht, ist es kein Satz für eine Richtlinie.

    | Appell | Regel |
    |---|---|
    | „Auf Vertraulichkeit ist zu achten.“ | „Unterlagen zu Kundenobjekten dürfen außerhalb der Betriebsstätten nur auf dienstlichen, verschlüsselten Geräten geöffnet werden.“ |
    | „Geräteverluste sind zeitnah zu melden.“ | „Der Verlust eines dienstlichen Geräts ist unverzüglich, spätestens innerhalb einer Stunde nach Bemerken, an die Rufbereitschaft (Nummer …) zu melden – auch an Wochenenden.“ |
    | „Passwörter sind sicher zu wählen.“ | „Dienstliche Konten sind mit einem Kennwort von mindestens zwölf Zeichen zu schützen. Für Zugänge von außerhalb des Betriebsnetzes ist zusätzlich ein zweiter Faktor zu verwenden.“ |
    | „Private Geräte sind möglichst nicht zu verwenden.“ | „Betriebliche Daten dürfen nicht auf privaten Geräten gespeichert werden. Für dienstliche Telefonate und Kurznachrichten mit Kunden stellt der Betrieb ein dienstliches Mobiltelefon.“ |

    Und legt die drei Verbindlichkeitsgrade am Anfang der Richtlinie fest: **MUSS** (zwingend), **SOLL** (Regelfall, Abweichung begründen und dokumentieren), **KANN** (Möglichkeit). Danach steht hinter jeder Regel einer davon.

??? info "Hilfekarte 3 – „Wir streiten über private Geräte“"
    Der Streit ist richtig – er ist der Kern dieser Übung. Bringt ihn in eine Form, indem ihr die drei möglichen Antworten mit ihren Konsequenzen aufschreibt, statt sie durcheinander zu diskutieren:

    | Möglichkeit | Was sie kostet | Was sie bringt | Was übrig bleibt |
    |---|---|---|---|
    | **Verbot ohne Ersatz** – private Geräte dürfen dienstlich nicht genutzt werden | nichts an Geld | auf dem Papier maximale Klarheit | Die Kundenkommunikation läuft trotzdem weiter, nur unsichtbar. Wahrscheinlich die schlechteste Lösung. |
    | **Verbot mit Ersatz** – dienstliches Mobiltelefon für alle, die Kundenkontakt haben | Geräte, Verträge, Verwaltungsaufwand | Betriebliche Daten liegen auf betrieblichen Geräten, Fernlöschung möglich, Nummer bleibt beim Betrieb | Kosten; die Umstellung braucht Zeit und eine Übergangsfrist |
    | **Erlaubnis mit Bedingungen** (BYOD) – private Geräte dürfen genutzt werden, wenn sie zentral verwaltet werden | Verwaltungssoftware, Vereinbarung mit jedem Einzelnen, Mitbestimmung | keine Gerätekosten | Zugriff auf Privatgeräte ist rechtlich und menschlich heikel; die Trennung privat/dienstlich muss technisch sauber sein |

    Ihr müsst euch entscheiden – und die Entscheidung gehört mit dieser Begründung auf das Abwägungsblatt (Teil 3). Denkt dabei an eine **Übergangsfrist** und daran, was mit dem Zwischenzustand passiert: Was gilt, solange die neuen Geräte noch nicht da sind?

??? info "Hilfekarte 4 – „Uns fällt zur Praktikabilität nichts ein“"
    Geht euren Regelentwurf einmal komplett aus der Sicht des Technikers durch. Diese sieben Fragen decken erfahrungsgemäß alles auf:

    1. Muss ich für diese Regel etwas tun, wofür ich beide Hände brauche?
    2. Funktioniert sie ohne Mobilfunkempfang – im Keller, in der Tiefgarage, im Technikraum?
    3. Wie oft am Tag muss ich das tun? (Eine Bildschirmsperre nach 30 Sekunden bedeutet bei Fotodokumentation dreißig Entsperrvorgänge pro Stunde.)
    4. Wen rufe ich an, wenn es nicht klappt – und ist der um sieben Uhr morgens oder am Samstag erreichbar?
    5. Was mache ich, wenn ich die Unterlage brauche und sie nicht öffnen darf? Gibt es einen erlaubten Weg?
    6. Verstehe ich die Regel beim ersten Lesen, ohne jemanden zu fragen?
    7. Was passiert, wenn ich sie nicht einhalte – und was, wenn ich einen Fehler melde?

    Jede Regel, bei der eine dieser Antworten unangenehm ausfällt, braucht entweder eine Anpassung oder eine begleitende Maßnahme. Beispiel: Die Sperrzeit wird länger, dafür kommt die Trennung von privaten und dienstlichen Daten dazu.

??? info "Hilfekarte 5 – „Wie soll man die Einhaltung denn prüfen?“"
    Es gibt genau vier Wege. Für Teil 4 reicht es, jeder eurer fünf ausgewählten Regeln einen davon zuzuordnen:

    | Weg | Beispiel aus diesem Szenario |
    |---|---|
    | **Technisch messbar** – ein System kann es auswerten | Anteil der Geräte mit aktivierter Verschlüsselung; Anteil der Geräte, die sich in den letzten 30 Tagen bei der Geräteverwaltung gemeldet haben; Anteil der Zugänge mit zweitem Faktor |
    | **Stichprobe** – jemand sieht nach | Zweimal im Jahr werden zehn Fahrzeuge und zehn Heimarbeitsplätze in Absprache besucht: Liegen Papierunterlagen offen? Ist der Bildschirm gesperrt? |
    | **Nachweis** – ein Dokument belegt es | unterschriebenes Übergabeprotokoll je Gerät, Schulungsnachweis, dokumentierte und befristete Ausnahmegenehmigung |
    | **Meldung** – ein Ereignis wird erfasst und ausgewertet | Zahl und **Meldedauer** von Geräteverlusten; Zahl der beantragten Ausnahmen; Zahl der gemeldeten verdächtigen Vorgänge |

    Zwei Hinweise: Erstens gehört zu jeder Prüfung eine **Person** und ein **Takt** – „die IT, quartalsweise“ ist eine Angabe, „regelmäßig“ nicht. Zweitens gehört zu jeder Prüfung die Frage, **was bei Abweichung passiert**. Eine Prüfung ohne Folge ist eine Statistik.

??? info "Hilfekarte 6 – „Unsere Richtlinie ist sechs Seiten lang“"
    Dann steht Falsches darin. Geht sie durch und stellt bei jedem Satz die Ebenenfrage aus der Dokumentenhierarchie: **Ändert sich dieser Satz, wenn der Betrieb den Hersteller oder das Werkzeug wechselt?**

    - Ändert er sich **nicht** → er bleibt in der Richtlinie.
    - Ändert er sich → er gehört in ein **Konzept** oder eine **Arbeitsanweisung**.

    Typische Kandidaten zum Streichen: Produktnamen, Menüwege, Screenshots, technische Parameter jenseits des Notwendigen, Begründungen von mehr als einem Satz, Aufzählungen von Beispielen, Wiederholungen.

    Was hineingehört, ist der Satz *„Dienstliche mobile Geräte MÜSSEN in die zentrale Geräteverwaltung eingebunden sein.“* Was nicht hineingehört, ist, wie man sie einbindet. Für den Vortrag reicht ein Satz: „Die Umsetzung beschreibt ein eigenes Konzept.“

---

## Bewertungsraster

Bewertet euch am Ende gegenseitig: Jede Gruppe bekommt den Entwurf einer anderen Gruppe und geht ihn mit diesem Raster durch. Fremde Entwürfe zu prüfen bringt für die eigene Arbeit oft mehr als das Schreiben selbst.

| Kriterium | Worauf geachtet wird | Punkte |
|---|---|---|
| **Schutzbedarf begründet** | Betroffene Informationen benannt, je Schutzziel bewertet, jede Bewertung mit einem tragfähigen Satz begründet. Kein pauschales „alles hoch“. | 6 |
| **Geltungsbereich vollständig** | Personenkreis (auch Leiharbeit, Auszubildende, externe Dienstleister), Geräte, Daten, Orte. Und: Was gilt ausdrücklich **nicht**? | 4 |
| **Regeln prüfbar formuliert** | Keine Appelle, keine unbestimmten Begriffe. Verbindlichkeitsgrade vergeben und erklärt. | 8 |
| **Maßnahmen decken die Risiken** | Technische, organisatorische und personelle Maßnahmen. Der Anlassfall aus dem Szenario ist vollständig abgedeckt – einschließlich Meldeweg außerhalb der Arbeitszeit. | 8 |
| **Abwägung dokumentiert** | Mindestens drei echte Entscheidungen mit Alternativen, Begründung und benanntem Restrisiko. Nicht: „wir haben uns für die sichere Lösung entschieden“. | 6 |
| **Ausnahmen und Verstöße geregelt** | Antragsweg, Genehmigungsstelle, Befristung, Dokumentation. Bei Verstößen: Eskalation – und ausdrücklich, dass eine Meldung nicht bestraft wird. | 4 |
| **Prüfplan tragfähig** | Fünf Regeln mit Prüfweg, Person, Takt und Folge bei Abweichung. Mindestens zwei verschiedene der vier Prüfwege genutzt. | 6 |
| **Einführung mitgedacht** | Inkrafttreten, Übergangsfrist, wie die Regel bekannt gemacht wird, wer geschult wird, Beteiligung des Betriebsrats. | 4 |
| **Umfang und Verständlichkeit** | Höchstens zwei Seiten. Keine Produktnamen. Für eine Technikerin beim ersten Lesen verständlich. | 4 |
| | **Gesamt** | **50** |

!!! note "Wie ihr die Punkte lest"
    **40 und mehr:** Das ist ein Entwurf, mit dem ein Betrieb tatsächlich arbeiten könnte. **30 bis 39:** Inhaltlich tragfähig, aber an einer Stelle noch nicht prüfbar oder nicht durchhaltbar. **Unter 30:** Meist fehlt entweder die Begründung des Schutzbedarfs oder der Prüfplan – beides sind genau die Teile, für die es in der Prüfung Punkte gibt.

---

## Musterlösung Variante A

??? tip "Musterlösung & Erläuterung – Mobile Geräte und Heimarbeit"
    Diese Lösung ist ein **Vorschlag**, keine einzig richtige Antwort. Eine Gruppe, die sich anders entscheidet und die Entscheidung sauber begründet, hat genauso richtig gearbeitet. Bewertet wird die Begründung, nicht die Übereinstimmung.

    ---

    ### Teil 1 – Schutzbedarf

    | Information | Vertraulichkeit | Integrität | Verfügbarkeit | Begründung |
    |---|---|---|---|---|
    | Schließpläne, Zutrittskonzepte, Meldergruppen von Kundenobjekten | **sehr hoch** | hoch | normal | Der Verlust ermöglicht Dritten den gezielten Zugriff auf fremde Gebäude – möglicher Schaden bei Kunden, Vertragsverlust, Haftungsfragen. Bei einem Pflegeheim oder einer Arztpraxis sind Menschen betroffen. |
    | Zugangsdaten für die Fernwartung der Gebäudeleittechnik | **sehr hoch** | **sehr hoch** | hoch | Wer sie hat, kann in fremde Anlagen eingreifen. Eine verfälschte Konfiguration wirkt physisch – Heizung, Lüftung, teils Zutritt. |
    | Angebots- und Nachkalkulationen | hoch | hoch | normal | Wirtschaftlicher Schaden bei Abfluss vor Vergabeentscheidungen; falsche Kalkulationsdaten führen zu Fehlangeboten. |
    | Auftragsdaten, Fotos aus Objekten, Kundenunterschriften | hoch | hoch | hoch | Teilweise personenbezogen; die Verfügbarkeit ist hoch, weil ohne sie der Serviceeinsatz nicht abgeschlossen und nicht abgerechnet werden kann. |
    | CAD-Pläne und Anlagendokumentationen | hoch | hoch | normal | Leitungswege und Technikräume sind für einen Angreifer wertvoll; Planungsfehler durch verfälschte Daten sind teuer. |
    | Personaldaten und arbeitsmedizinische Bescheinigungen | **sehr hoch** | hoch | normal | Besonders geschützte Daten; ein Abfluss trifft Menschen unmittelbar und ist meldepflichtig. |

    **Der entscheidende Satz für die Begründung:** Der Betrieb verwaltet Informationen, deren Verlust nicht primär ihn selbst trifft, sondern **seine Kunden** – und im Fall des Pflegeheims und der Arztpraxen deren Patientinnen und Bewohner. Das hebt den Vertraulichkeitsbedarf über das hinaus, was ein Handwerksbetrieb sonst hätte, und es ist der Grund, warum der Kunde einen Nachweis verlangt.

    **Verfügbarkeit differenziert betrachten:** Für die Objektunterlagen ist sie *normal* – ein Techniker kann im Zweifel nachfragen. Für die Auftragsdaten in der App ist sie *hoch*, weil ohne sie kein Einsatz abgeschlossen werden kann. Diese Unterscheidung ist wichtig, weil sie die Antwort auf die Offline-Frage vorgibt: Auftragsdaten müssen offline verfügbar sein, Schließpläne nicht.

    ---

    ### Teil 2 – Der Richtlinienentwurf

    ```text
    Richtlinie "Mobile Geraete und Arbeiten ausserhalb der Betriebsstaetten"
    Nordwerk Gebaeudetechnik GmbH · Version 1.0

    1  ZWECK UND ZIEL
    Diese Richtlinie schuetzt Informationen des Betriebs und seiner Kunden,
    wenn sie ausserhalb der Betriebsstaetten verarbeitet werden. Im
    Vordergrund steht die Vertraulichkeit von Unterlagen zu Kundenobjekten:
    Sie ermoeglichen im Fall eines Abflusses den Zugriff auf fremde Gebaeude.

    2  GELTUNGSBEREICH
    Diese Richtlinie gilt fuer alle Beschaeftigten einschliesslich
    Auszubildender, Aushilfen und Leiharbeitnehmern sowie fuer externe
    Dienstleister mit Zugriff auf betriebliche Daten. Sie gilt fuer alle
    dienstlichen Notebooks, Tablets und Mobiltelefone, fuer private Geraete
    im Rahmen von Regel 4.2 sowie fuer Unterlagen in Papierform ausserhalb
    der Betriebsstaetten. Sie gilt an allen Orten ausserhalb der beiden
    Betriebsstaetten, insbesondere im Servicefahrzeug, in Kundenobjekten
    und im haeuslichen Arbeitsplatz.
    Sie gilt nicht fuer die ortsfesten Arbeitsplaetze in den Betriebs-
    staetten; dafuer gilt die Richtlinie "Arbeitsplatz".

    3  VERBINDLICHKEIT
    MUSS  zwingend, Abweichung nur ueber eine genehmigte Ausnahme (Abschnitt 6)
    SOLL  Regelfall; eine Abweichung ist zu begruenden und zu dokumentieren
    KANN  Moeglichkeit

    4  REGELN

    4.1 Geraete
    (1) Betriebliche Daten duerfen ausschliesslich auf dienstlichen Geraeten
        verarbeitet und gespeichert werden. [MUSS]
    (2) Alle dienstlichen mobilen Geraete sind vollstaendig verschluesselt
        zu betreiben und in die zentrale Geraeteverwaltung eingebunden.
        Geraete, die diese Anforderung nicht erfuellen, duerfen nicht mehr
        ausgegeben werden. [MUSS]
    (3) Jedes ausgegebene Geraet ist einer Person namentlich zugeordnet und
        in der Geraeteliste erfasst. Die Uebergabe wird schriftlich
        bestaetigt. [MUSS]
    (4) Mobile Geraete sind mit einer Bildschirmsperre zu schuetzen, die
        sich nach spaetestens fuenf Minuten Untaetigkeit aktiviert. Der
        Zugang erfolgt ueber eine mindestens sechsstellige PIN oder ein
        biometrisches Merkmal. [MUSS]
    (5) Geraete duerfen nicht unbeaufsichtigt im Fahrzeug zurueckgelassen
        werden. Ist das unvermeidbar, sind sie ausgeschaltet und von aussen
        nicht sichtbar zu verwahren. [MUSS]

    4.2 Private Geraete
    (1) Betriebliche Daten duerfen nicht auf privaten Geraeten gespeichert
        werden. Das gilt ausdruecklich auch fuer Fotos aus Kundenobjekten
        und fuer Kurznachrichten mit Auftragsbezug. [MUSS]
    (2) Fuer dienstliche Kommunikation stellt der Betrieb allen Beschaeftigten
        mit Kundenkontakt ein dienstliches Mobiltelefon zur Verfuegung.
        Bis zur vollstaendigen Ausgabe gilt die Uebergangsregelung in
        Abschnitt 8. [MUSS]
    (3) Die private Nutzung dienstlicher Geraete in angemessenem Umfang
        ist gestattet. Eine Auswertung privater Inhalte findet nicht statt.
        [KANN]

    4.3 Umgang mit Unterlagen zu Kundenobjekten
    (1) Unterlagen zu Kundenobjekten - insbesondere Schliessplaene,
        Zutrittskonzepte und Meldergruppenuebersichten - duerfen nicht
        dauerhaft auf mobilen Geraeten gespeichert werden. Sie sind
        einsatzbezogen aus der Auftrags-App zu oeffnen und werden nach
        Abschluss des Auftrags automatisch entfernt. [MUSS]
    (2) Auftragsdaten und Fotos des laufenden Einsatzes duerfen offline
        vorgehalten werden, solange kein Netz verfuegbar ist. Sie sind bei
        naechster Gelegenheit zu uebertragen. [SOLL]
    (3) Papierunterlagen zu Kundenobjekten duerfen ausserhalb der Betriebs-
        staetten nur mitgefuehrt werden, wenn sie fuer den Einsatz
        erforderlich sind. Sie sind nach Rueckkehr in den betrieblichen
        Ablauf zurueckzufuehren oder im Betrieb zu vernichten; eine
        Entsorgung im Hausmuell oder im Fahrzeug ist unzulaessig. [MUSS]

    4.4 Arbeiten ausserhalb der Betriebsstaetten
    (1) Der Zugriff auf betriebliche Systeme aus fremden Netzen erfolgt
        ausschliesslich ueber den betrieblichen VPN-Zugang. [MUSS]
    (2) Bildschirme sind so auszurichten, dass Dritte nicht mitlesen
        koennen. Beim Verlassen des Arbeitsplatzes ist der Bildschirm zu
        sperren - auch im haeuslichen Umfeld. [MUSS]
    (3) Vertrauliche Telefonate und Videobesprechungen sind nicht in
        oeffentlich zugaenglichen Bereichen zu fuehren. [SOLL]
    (4) Am haeuslichen Arbeitsplatz sind betriebliche Unterlagen und
        Geraete so aufzubewahren, dass Haushaltsangehoerige und Besuch
        keinen Zugriff haben. [MUSS]

    4.5 Verlust und Diebstahl
    (1) Der Verlust oder Diebstahl eines dienstlichen Geraets sowie der
        Verlust von Unterlagen zu Kundenobjekten ist unverzueglich,
        spaetestens innerhalb einer Stunde nach Bemerken, an die
        Rufbereitschaft zu melden - Telefon 0xxx / xxx xx xx, rund um die
        Uhr, auch an Wochenenden und Feiertagen. [MUSS]
    (2) Die Meldung erfolgt ohne Ruecksicht auf Uhrzeit, Wochentag oder
        eigene Verantwortung fuer den Verlust. Eine rechtzeitige Meldung
        wird nicht sanktioniert. [MUSS]
    (3) Die Rufbereitschaft veranlasst umgehend die Fernloeschung des
        Geraets, die Sperrung der zugehoerigen Konten und die Pruefung,
        welche Kundenobjekte betroffen sind. [MUSS]
    (4) Betroffene Kunden werden durch die Geschaeftsfuehrung informiert.
        Bei personenbezogenen Daten prueft die oder der Datenschutz-
        beauftragte unverzueglich die Meldepflicht. [MUSS]

    5  ROLLEN UND VERANTWORTUNG
    Geschaeftsfuehrung  setzt diese Richtlinie in Kraft, stellt Mittel bereit,
                        informiert betroffene Kunden
    IT-Leitung          betreibt die Geraeteverwaltung, fuehrt die Geraete-
                        liste, wertet die Kennzahlen aus Abschnitt 7 aus
    Rufbereitschaft     nimmt Verlustmeldungen entgegen und leitet die
                        Sofortmassnahmen ein
    Fuehrungskraefte    stellen sicher, dass ihre Beschaeftigten die
                        Richtlinie kennen; genehmigen Ausnahmen im Rahmen
                        von Abschnitt 6
    Alle Beschaeftigten halten die Regeln ein und melden Verluste sowie
                        Auffaelligkeiten

    6  AUSNAHMEN
    Ausnahmen sind schriftlich bei der Bereichsleitung zu beantragen; die
    Genehmigung erfolgt im Einvernehmen mit der IT-Leitung. Jede Ausnahme
    ist zu begruenden, auf hoechstens zwoelf Monate zu befristen und in der
    Ausnahmeliste zu dokumentieren. Die Liste wird der Geschaeftsfuehrung
    jaehrlich vorgelegt.

    7  UEBERPRUEFUNG DER EINHALTUNG
    (1) Die IT-Leitung wertet quartalsweise aus: Anteil verschluesselter
        Geraete, Anteil in der Geraeteverwaltung eingebundener Geraete,
        Geraete ohne Rueckmeldung seit mehr als 30 Tagen, Anzahl und
        Meldedauer von Verlustmeldungen.
    (2) Zweimal jaehrlich findet eine angekuendigte Stichprobe statt:
        zehn Servicefahrzeuge und fuenf haeusliche Arbeitsplaetze,
        letztere nur mit Einverstaendnis und ohne Betreten der Wohnung
        (Sichtpruefung nach Vereinbarung).
    (3) Die Ergebnisse werden der Geschaeftsfuehrung vorgelegt und im
        Betriebsrat besprochen. Personenbezogene Auswertungen finden nicht
        statt.

    8  VERSTOESSE
    Verstoesse werden zunaechst durch die Fuehrungskraft angesprochen. Bei
    Wiederholung erfolgt eine dokumentierte Ermahnung; weitergehende
    Schritte liegen bei der Personalabteilung unter Beteiligung des
    Betriebsrats. Das unterlassene oder verzoegerte Melden eines Verlusts
    gilt als eigenstaendiger Verstoss - eine rechtzeitige Meldung dagegen
    nie.

    9  INKRAFTTRETEN, UEBERGANG, UEBERPRUEFUNG
    Diese Richtlinie tritt zum Zeitpunkt ihrer Bekanntgabe in Kraft. Fuer
    Regel 4.2 (2) gilt eine Uebergangsfrist von sechs Monaten; bis dahin
    duerfen private Telefone fuer Anrufe genutzt werden, nicht jedoch fuer
    Fotos, Dokumente oder Kurznachrichten mit Auftragsbezug. Regel 4.1 (2)
    gilt fuer neu ausgegebene Geraete sofort, fuer den Bestand nach
    Abschluss der Umruestung, spaetestens nach neun Monaten.
    Die Richtlinie wird jaehrlich sowie nach jedem Vorfall ueberprueft.
    Verantwortlich: IT-Leitung. Freigabe: Geschaeftsfuehrung.
    ```

    ---

    ### Teil 3 – Abwägungsblatt

    **Entscheidung 1: Private Mobiltelefone – Verbot mit Ersatz statt Verbot ohne Ersatz.**
    Möglich wären drei Wege gewesen: schlichtes Verbot, Verbot mit Bereitstellung dienstlicher Geräte oder Erlaubnis privater Geräte unter zentraler Verwaltung. Ein schlichtes Verbot hätte nichts gekostet und nichts bewirkt: Die Kundenkommunikation existiert, sie hört nicht auf, sie würde nur unsichtbar. Die Verwaltung privater Geräte wäre günstiger gewesen, greift aber tief in Privateigentum ein, ist mitbestimmungspflichtig und bei einer Belegschaft mit geringer IT-Affinität schwer vermittelbar. Entschieden wurde für dienstliche Geräte mit sechs Monaten Übergangsfrist.
    *Restrisiko:* Während der Übergangsfrist bleibt die Lage weitgehend wie bisher. Deshalb ist der Übergang eng gefasst – Fotos und Dokumente sind ab sofort ausgeschlossen, nur Telefonate bleiben erlaubt.

    **Entscheidung 2: Bildschirmsperre nach fünf Minuten statt nach 30 Sekunden.**
    Sicherheitstechnisch wären 30 Sekunden besser. Bei Fotodokumentation in einem Technikraum bedeutet das aber Dutzende Entsperrvorgänge pro Stunde, oft mit Handschuhen. Eine Regel, die auf der Baustelle nicht durchhaltbar ist, führt dazu, dass die Sperre ganz deaktiviert wird. Fünf Minuten sind ein tragfähiger Kompromiss, weil die Regel dadurch überhaupt gilt.
    *Restrisiko:* Ein Gerät, das innerhalb dieser Minuten entwendet wird, ist entsperrt. Kompensiert wird das durch die Verschlüsselung, die Fernlöschung und dadurch, dass Objektunterlagen nicht dauerhaft lokal liegen.

    **Entscheidung 3: Objektunterlagen nur einsatzbezogen, Auftragsdaten offline erlaubt.**
    Die naheliegende Regel wäre gewesen: nichts wird lokal gespeichert. Das scheitert an der Wirklichkeit – in Technikräumen und Tiefgaragen gibt es keinen Empfang, und ein Techniker ohne Auftragsdaten kann nicht arbeiten. Also wurde nach Schutzbedarf getrennt: Auftragsdaten (hohe Verfügbarkeit, hohe Vertraulichkeit) dürfen offline vorliegen, Schließpläne (sehr hohe Vertraulichkeit, normale Verfügbarkeit) nur für die Dauer des Einsatzes.
    *Restrisiko:* Während eines laufenden Einsatzes liegen sensible Unterlagen auf dem Gerät. Das ist der Zeitraum, in dem das Gerät auch am ehesten in Gebrauch und beaufsichtigt ist.

    **Entscheidung 4: Meldeweg mit Rufbereitschaft rund um die Uhr.**
    Der Anlassfall entstand nicht durch fehlende Technik, sondern weil eine Nummer fehlte. Eine Rufbereitschaft kostet Geld und Bereitschaftszeit. Die Alternative – Meldung am nächsten Arbeitstag – hätte den Vorfall exakt reproduziert. Entschieden wurde für die Rufbereitschaft, ergänzt um den ausdrücklichen Satz, dass eine rechtzeitige Meldung nicht sanktioniert wird.
    *Restrisiko:* Kosten und Belastung der Bereitschaft. Dafür sinkt die Zeit bis zur Fernlöschung von drei Tagen auf unter eine Stunde.

    **Entscheidung 5: Stichproben am häuslichen Arbeitsplatz nur angekündigt und mit Einverständnis.**
    Eine unangekündigte Prüfung wäre aussagekräftiger. Sie ist in einer Privatwohnung aber weder durchsetzbar noch verhältnismäßig und würde das Vertrauen zerstören, das für Meldungen nötig ist. Entschieden wurde für angekündigte Sichtprüfungen nach Vereinbarung, kombiniert mit einer Selbstauskunft.
    *Restrisiko:* Die Prüfung zeigt den vorbereiteten Zustand, nicht den Alltag. Als Ausgleich wird die Regelkenntnis über Schulungsnachweise geprüft.

    ---

    ### Teil 4 – Prüfplan

    | Regel | Prüfweg | Wer, wie oft | Woran genau | Folge bei Abweichung |
    |---|---|---|---|---|
    | 4.1 (2) Verschlüsselung und Geräteverwaltung | technisch messbar | IT-Leitung, quartalsweise | Anteil der Geräte in der Verwaltung mit aktiver Verschlüsselung; Zielwert 100 % nach Ablauf der Übergangsfrist | Geräteliste abgleichen, betroffene Geräte einziehen und nachrüsten |
    | 4.1 (3) Zuordnung und Übergabeprotokoll | Nachweis | IT, bei jeder Ausgabe; Prüfung jährlich | Für jedes Gerät der Liste existiert ein unterschriebenes Protokoll | fehlende Protokolle nacherheben; Geräte ohne Zuordnung sperren |
    | 4.3 (3) Papierunterlagen im Fahrzeug | Stichprobe | IT und Bereichsleitung, zweimal jährlich, zehn Fahrzeuge | Liegen Objektunterlagen offen im Fahrzeug? | Ergebnis anonymisiert auswerten; bei Häufung Ursache prüfen (fehlt ein Rückgabeweg?) |
    | 4.5 (1) Meldefrist bei Verlust | Meldung | Rufbereitschaft erfasst, IT wertet quartalsweise aus | Zeitspanne zwischen Bemerken und Meldung, je Fall | Median über einer Stunde ⇒ Meldeweg und Bekanntheit prüfen, nicht die Person |
    | 4.4 (1) Zugriff nur über VPN | technisch messbar | IT-Leitung, monatlich | Zugriffe auf betriebliche Dienste außerhalb des VPN | Zugriffswege technisch schließen; Ausnahmen prüfen |

    ---

    ### Was diese Lösung besonders macht

    Drei Punkte, an denen sich eine gute von einer durchschnittlichen Bearbeitung unterscheidet:

    1. **Die Regeln sind nach Schutzbedarf abgestuft, nicht pauschal.** Wer alles auf „sehr hoch“ setzt, kommt zu einer Richtlinie, die niemand einhalten kann. Die Trennung zwischen Auftragsdaten und Objektunterlagen ist der Kern der Lösung – und sie stammt direkt aus Teil 1.
    2. **Der Anlassfall ist vollständig geschlossen.** Verschlüsselung (das Gerät war unverschlüsselt), PIN-Länge (vierstellig), Fernlöschung (nicht möglich mangels Geräteverwaltung), lokale Objektunterlagen (lagen dauerhaft auf dem Gerät) und der Meldeweg (fehlte). Fünf Ursachen, fünf Regeln.
    3. **Die Richtlinie regelt das Melden ausdrücklich sanktionsfrei.** Ohne diesen Satz reproduziert der Betrieb den Ursprungsfall: Der Techniker meldete spät, weil er niemanden stören wollte. Menschen melden nicht, wenn Melden unangenehm ist.

    Was in einer schwächeren Bearbeitung typischerweise fehlt: die Übergangsfrist (eine Regel, die am Tag der Bekanntgabe von 95 Geräten nicht erfüllt werden kann, ist keine Regel), der Betriebsrat, die Frage „was gilt für den externen Dienstleister?“ und ein Prüfplan, der über „die IT prüft regelmäßig“ hinausgeht.

---

## Musterlösung Variante B

??? tip "Musterlösung & Erläuterung – Zugangsdaten und Fernwartung"

    ### Teil 1 – Schutzbedarf

    | Information | Vertraulichkeit | Integrität | Verfügbarkeit | Begründung |
    |---|---|---|---|---|
    | Zugangsdaten zur Fernwartung von 40 Kundenanlagen | **sehr hoch** | **sehr hoch** | hoch | Sie erlauben Eingriffe in fremde Gebäudetechnik. Ein Missbrauch wirkt physisch und trifft Dritte. Ohne sie ist keine Fernentstörung möglich. |
    | Kennwörter der Domänen-Administration | **sehr hoch** | **sehr hoch** | **sehr hoch** | Wer sie hat, hat den gesamten Betrieb. Verfügbarkeit sehr hoch, weil ohne Administration nichts mehr behoben werden kann. |
    | VPN-Zugangsdaten der Beschäftigten | hoch | hoch | hoch | Sie öffnen den Weg ins Betriebsnetz; ohne sie steht die Heimarbeit. |
    | Protokolle über Fernwartungszugriffe | hoch | **sehr hoch** | hoch | Sie sind der einzige Nachweis darüber, wer wann in eine Kundenanlage eingegriffen hat – gegenüber Kunden und im Streitfall. Ihre Integrität ist deshalb entscheidend. |

    Der Schlüsselgedanke: Bei Zugangsdaten ist die **Zurechenbarkeit** ein eigenständiges Ziel. Ein gemeinsames Konto `service` macht jeden Nachweis unmöglich – auch den entlastenden. Genau das wird der Kunde fragen: „Wer war am Dienstag in meiner Anlage?“

    ### Teil 2 – Der Richtlinienentwurf (gekürzt auf die Regeln)

    ```text
    Richtlinie "Umgang mit Zugangsdaten und Fernwartungszugaengen"
    Nordwerk Gebaeudetechnik GmbH · Version 1.0

    4  REGELN

    4.1 Grundsaetze
    (1) Jeder Zugang ist einer Person zugeordnet. Gemeinsam genutzte Konten
        sind unzulaessig. Wo eine Anlage technisch nur ein Konto vorsieht,
        ist dies in der Anlagenliste zu vermerken und mit dem Hersteller
        eine Loesung zu klaeren; bis dahin gilt Regel 4.4 (3). [MUSS]
    (2) Zugangsdaten duerfen nicht per E-Mail, Kurznachricht oder muendlich
        weitergegeben werden. [MUSS]
    (3) Alle dienstlichen Zugangsdaten werden ausschliesslich im
        betrieblichen Kennwortverwalter gespeichert. Ablagen in Tabellen,
        Textdateien, Notizzetteln oder Browsern sind unzulaessig. [MUSS]
    (4) Kennwoerter fuer dienstliche Konten sind mindestens zwoelf Zeichen
        lang. Ein anlassloser regelmaessiger Wechsel findet nicht statt;
        gewechselt wird bei Verdacht auf Kenntnisnahme durch Dritte, beim
        Ausscheiden von Zugangsberechtigten und nach jedem Vorfall. [MUSS]

    4.2 Zugaenge von aussen
    (1) Jeder Zugriff auf betriebliche Systeme von ausserhalb des
        Betriebsnetzes erfordert einen zweiten Faktor. [MUSS]
    (2) Privilegierte Taetigkeiten erfolgen ausschliesslich mit einem
        gesonderten Administrationskonto, niemals mit dem Konto fuer die
        taegliche Arbeit. [MUSS]

    4.3 Fernwartungszugaenge zu Kundenanlagen
    (1) Fuer jede Kundenanlage wird in der Anlagenliste gefuehrt: Kunde,
        Anlage, Zugangsart, berechtigte Personen, Datum der letzten
        Kennwortaenderung. [MUSS]
    (2) Herstellerseitige Standardkennwoerter sind vor Inbetriebnahme zu
        aendern. Bestandsanlagen sind nach dem Plan aus Abschnitt 9
        nachzuziehen. [MUSS]
    (3) Fernwartungszugaenge sind nur waehrend des Einsatzes freigeschaltet
        und werden danach wieder geschlossen. Dauerhaft offene Zugaenge
        beduerfen einer befristeten Ausnahme. [MUSS]
    (4) Jeder Fernzugriff wird protokolliert: Person, Zeitpunkt, Anlage,
        Anlass. Das Protokoll ist dem Kunden auf Anfrage vorzulegen. [MUSS]
    (5) Zugaenge, die der Kunde bereitstellt, unterliegen zusaetzlich
        dessen Vorgaben. Abweichungen sind mit der Bereichsleitung zu
        klaeren. [SOLL]

    4.4 Ausscheiden, Wechsel, Vertretung
    (1) Beim Ausscheiden einer Person werden ihre Konten am letzten
        Arbeitstag deaktiviert. Zugangsdaten, die sie kannte und die nicht
        personengebunden sind, werden innerhalb von fuenf Arbeitstagen
        geaendert. [MUSS]
    (2) Bei Wechsel des Aufgabenbereichs werden nicht mehr benoetigte
        Berechtigungen entzogen; die Fuehrungskraft meldet den Wechsel der
        IT. [MUSS]
    (3) Wo eine Anlage technisch nur ein gemeinsames Konto zulaesst, wird
        die Zurechenbarkeit organisatorisch hergestellt: Der Zugriff wird
        vor Beginn im Einsatzsystem eingetragen; das Kennwort wird ueber
        den Kennwortverwalter einzeln freigegeben und nach jedem
        Personalwechsel geaendert. [MUSS]

    4.5 Verdacht und Vorfall
    (1) Der Verdacht, dass ein Zugang Dritten bekannt geworden ist, ist
        unverzueglich der IT zu melden - unabhaengig von Uhrzeit und
        eigener Verantwortung. Eine rechtzeitige Meldung wird nicht
        sanktioniert. [MUSS]
    (2) Die IT sperrt oder aendert den betroffenen Zugang unverzueglich und
        prueft, welche Kundenanlagen betroffen sind. [MUSS]
    ```

    Dazu die Abschnitte 1 bis 3 und 5 bis 9 wie in Variante A: Zweck, Geltungsbereich, Verbindlichkeit, Rollen, Ausnahmen, Prüfung, Verstöße, Inkrafttreten.

    ### Teil 3 – Abwägungsblatt (Auszug)

    **Kein anlassloser Kennwortwechsel.** Die naheliegende Regel „alle 90 Tage wechseln“ steht in vielen alten Richtlinien. Sie führt in der Praxis zu vorhersehbaren Ableitungen (`Sommer2024!`, dann `Herbst2024!`) und zu Zetteln. Die heutige Empfehlung geht zu **langen Kennwörtern plus zweitem Faktor**, gewechselt wird **anlassbezogen**. Entschieden wurde für diesen Weg – mit ausdrücklich benannten Anlässen, damit die Regel nicht als Nachlässigkeit missverstanden wird.
    *Restrisiko:* Ein unbemerkt abgeflossenes Kennwort bleibt länger gültig. Kompensiert durch den zweiten Faktor und die Protokollierung.

    **Gemeinsames Konto auf Altanlagen: organisatorisch kompensieren statt verbieten.** Ein Verbot wäre sauber und technisch unerfüllbar – bei rund der Hälfte der Anlagen liegt die Beschränkung beim Hersteller. Ein unerfüllbares MUSS entwertet die ganze Richtlinie. Deshalb: Verbot als Grundsatz, dokumentierte technische Ausnahme, und die Zurechenbarkeit wird organisatorisch hergestellt (Voreintrag im Einsatzsystem, Einzelfreigabe des Kennworts).
    *Restrisiko:* Die Zuordnung beruht auf einem Eintrag, nicht auf einer technischen Anmeldung. Sie ist schwächer, aber besser als keine – und sie ist gegenüber dem Kunden darstellbar.

    **Zugänge nur während des Einsatzes offen.** Dauerhaft offene Zugänge sind bequem und bei Störungsmeldungen schneller. Die Abwägung fällt hier klar aus: Die Anlagen stehen bei Dritten, ein Missbrauch trifft Kunden. Der Zeitverlust beim Freischalten ist die geringere Last.
    *Restrisiko:* Bei Störungen außerhalb der Bürozeiten dauert die Entstörung länger. Ausgleich: befristete Ausnahmen für Anlagen mit vereinbarter Rufbereitschaft.

    **Elf ausgeschiedene Personen, deren Kenntnisse nie zurückgesetzt wurden.** Das ist kein Richtlinienthema, sondern ein Altlastenthema. Es gehört als **Sofortmaßnahme mit Termin** neben die Richtlinie: Kennwörter aller nicht personengebundenen Zugänge ändern, priorisiert nach Schutzbedarf – zuerst Domänen-Administration, dann Fernwartungszugänge der Objekte mit besonderem Schutzbedarf, dann der Rest.

    ### Teil 4 – Prüfplan (Auszug)

    | Regel | Prüfweg | Wer, wie oft | Woran genau |
    |---|---|---|---|
    | 4.1 (1) Keine gemeinsamen Konten | Nachweis + Stichprobe | IT, halbjährlich | Anlagenliste gegen tatsächlich vorhandene Konten; Zahl der dokumentierten technischen Ausnahmen (Ziel: sinkend) |
    | 4.2 (1) Zweiter Faktor von außen | technisch messbar | IT, monatlich | Anteil der Zugänge von außen mit zweitem Faktor; Zielwert 100 % |
    | 4.3 (2) Standardkennwörter | technisch messbar | IT, quartalsweise | Anzahl Anlagen ohne dokumentierte Kennwortänderung – aus der Anlagenliste |
    | 4.3 (4) Protokollierung der Fernzugriffe | Nachweis | Bereichsleitung, stichprobenweise je Quartal | Zu fünf zufälligen Zugriffen existiert ein Protokolleintrag mit Person, Zeit, Anlass |
    | 4.4 (1) Austrittsprozess | technisch messbar | IT, je Austritt, Auswertung halbjährlich | Zeitspanne zwischen letztem Arbeitstag und Deaktivierung; Ziel: null Tage |

    ### Der Kernsatz dieser Variante

    Bei Zugangsdaten geht es nicht in erster Linie um Geheimhaltung, sondern um **Zurechenbarkeit**. Der Kunde fragt nicht „ist euer Kennwort lang genug?“, sondern „wer war am Dienstag in meiner Anlage?“. Eine Richtlinie, die darauf keine Antwort ermöglicht, erfüllt ihren Zweck nicht – egal wie streng ihre Kennwortregeln sind.

---

## Reflexionsfragen für die Auswertung

Diese Fragen gehören ins Plenum, nachdem alle Gruppen vorgestellt haben. Sie sind der eigentliche Ertrag der Übung.

1. **Vergleicht die Schutzbedarfstabellen der Gruppen.** Wo weichen sie voneinander ab? Liegt das an unterschiedlichen Annahmen über den Betrieb – oder an unterschiedlichen Maßstäben? Was folgt daraus für ein echtes Projekt, in dem mehrere Personen bewerten?

2. **Sucht in allen Entwürfen die strengste Regel.** Würde sie den Alltag der Techniker überstehen? Und die umgekehrte Frage: Sucht die schwächste Regel – reicht sie aus, um dem Kunden aus dem Anlassfall zu antworten?

3. **Wie viele Regeln in eurem Entwurf könnte eine Außenstehende ohne Rückfrage prüfen?** Zählt sie. Was hättet ihr anders formuliert, wenn ihr den Prüfplan **zuerst** geschrieben hättet?

4. **Welche Entscheidung hat in eurer Gruppe am längsten gedauert – und warum?** Ging es um Fachliches oder um unterschiedliche Vorstellungen davon, wie viel Sicherheit ein Betrieb verträgt?

5. **Alle Entwürfe verbieten irgendetwas.** Geht sie durch: Steht neben jedem Verbot ein erlaubter Weg? Wo nicht – was wird dort vermutlich passieren?

6. **Was in eurem Entwurf gehört eigentlich nicht in eine Richtlinie, sondern in ein Konzept oder eine Arbeitsanweisung?** Und was fehlt umgekehrt, weil ihr es für selbstverständlich gehalten habt?

7. **Angenommen, in einem Jahr ist wieder ein Gerät weg.** Woran würdet ihr erkennen, ob eure Richtlinie gewirkt hat? Welche Zahl aus eurem Prüfplan wäre die aussagekräftigste?

---

## Was du jetzt kannst

- aus einem betrieblichen Sachverhalt den **Schutzbedarf je Schutzziel** ableiten und so begründen, dass die Begründung eine Rückfrage übersteht
- eine **Sicherheitsrichtlinie** mit allen Pflichtabschnitten aufbauen – Zweck, Geltungsbereich, Regeln, Rollen, Ausnahmen, Verstöße, Inkrafttreten
- Regeln **prüfbar** formulieren und Verbindlichkeitsgrade sinnvoll vergeben
- die Abwägung zwischen **Sicherheit und Praktikabilität** bewusst treffen, das gewählte Vorgehen begründen und das verbleibende **Restrisiko** benennen
- einen **Prüfplan** entwerfen, der Person, Takt, Prüfmerkmal und Folge bei Abweichung benennt
- erkennen, welche Sätze in eine Richtlinie gehören und welche eine Ebene tiefer

!!! quote "Mitnehmen"
    1. **Eine Regel ohne Begründung überlebt die erste Rückfrage nicht.** Deshalb steht der Schutzbedarf vor den Regeln, nicht danach.
    2. **Eine Regel, die niemand prüfen kann, ist eine Empfehlung.** Der Prüfplan gehört zur Richtlinie, nicht dahinter.
    3. **Ein Verbot ohne erlaubten Weg erzeugt Umgehungen.** Die Aufgabe verschwindet nicht, wenn man den Weg dahin verbietet.
    4. **Übergangsfristen sind kein Zeichen von Nachlässigkeit.** Eine Regel, die am Tag ihrer Bekanntgabe für 95 Geräte unerfüllbar ist, entwertet das ganze Dokument.
    5. **Melden darf nie bestraft werden.** Der Anlassfall dieser Übung ist nicht durch fehlende Technik entstanden, sondern durch eine fehlende Telefonnummer und die Sorge, jemanden zu stören.

---

## Weiterlesen

- [ISMS & Standards](isms.md): Dokumentenhierarchie, Richtlinienaufbau, Audits und Kennzahlen – die Theorie zu dieser Übung
- [Grundlagen & Schutzziele](grundlagen.md): Schutzziele, Schutzbedarf und die Grundprinzipien, aus denen die Maßnahmen stammen
- [Risikomanagement](risikomanagement.md): das Verfahren hinter Teil 1 und Teil 3 – Bewertung, Matrix und die vier Steuerungsstrategien
- [Übungen: Risikoanalyse](uebungen-risikoanalyse.md): fünfzehn weitere Aufgaben zum Verfahren, jede mit Musterlösung
- [Sicherheitsvorfälle](sicherheitsvorfaelle.md): was nach einer Verlustmeldung tatsächlich passieren muss
