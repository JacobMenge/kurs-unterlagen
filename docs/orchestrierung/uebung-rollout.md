---
title: "Übung: Rollout-Plan"
description: "Gruppenübung für 3–5 Personen: Ein Betrieb mit 460 Arbeitsplätzen an drei Standorten stellt sein ERP-System auf eine neue Hauptversion um. Die Gruppe entwirft den vollständigen Rollout-Plan – Reihenfolge, Ringe, Pilotgruppe mit Freigabekriterien, Wartungsfenster, Rückfallplan, Abbruchkriterien und Kommunikation an die Anwender. Mit Hilfekarten, ausführlicher Musterlösung und Reflexionsfragen."
---

# Übung: Der Rollout-Plan

<span class='badge badge-praxis'>Gruppenarbeit</span> &nbsp; Ihr seid das Rollout-Team eines mittelständischen Betriebs. Die neue Hauptversion des ERP-Systems steht bereit – und ihr müsst entscheiden, **in welcher Reihenfolge, wann, mit welchem Rückweg und mit welcher Ankündigung** sie in Betrieb geht.

Diese Übung braucht keinen Rechner. Sie braucht ein Flipchart oder ein leeres Dokument, die Seite [Softwareverteilung & Deployment](softwareverteilung.md) als Nachschlagewerk und eine Gruppe, die bereit ist, sich auf Zahlen festzulegen. Genau darin liegt die Schwierigkeit: Ein Rollout-Plan, der keine Zahlen und keine Namen enthält, ist kein Plan.

!!! abstract "Worum es geht"
    - Ihr entwickelt einen **vollständigen Rollout-Plan** für eine ERP-Hauptversion auf 460 Arbeitsplätzen und sieben Servern
    - Ihr entscheidet über **Reihenfolge, Ringe, Pilotgruppe, Zeitfenster, Rückfallplan, Abbruchkriterien und Kommunikation**
    - Ihr müsst **begründen**, nicht nur festlegen – jede Entscheidung braucht einen Satz, warum sie so und nicht anders getroffen wurde
    - Ihr rechnet zwei Randbedingungen nach: **Bandbreite** und **Kapazität des Service Desks**

!!! info "Rahmen"
    **Gruppengröße:** 3–5 Personen · **Dauer:** 60–90 Minuten · **Material:** Flipchart oder Dokument, Taschenrechner

    Danach stellt jede Gruppe ihren Plan in wenigen Minuten vor. Erwartet werden **unterschiedliche** Lösungen – es gibt hier keinen einen richtigen Plan, sondern gut und schlecht begründete.

---

## Der Betrieb

Die **Nordharz Kunststofftechnik GmbH** verarbeitet Kunststoff im Spritzgussverfahren und beliefert vor allem die Automobil- und Medizintechnikbranche. 390 Beschäftigte, drei Standorte.

### Standorte und Geräte

| Standort | Was dort passiert | Arbeitsplätze | Netzanbindung |
|---|---|---|---|
| **A – Zentrale** | Verwaltung, Vertrieb, Einkauf, Konstruktion, Buchhaltung; eigenes kleines Rechenzentrum | **250** | internes Gigabit-Netz, Verteilserver im Rechenzentrum |
| **B – Werk 2** | Fertigung, Werkzeugbau, Logistik, Arbeitsvorbereitung, Qualitätssicherung | **140**, davon **34 Fertigungsterminals** an Maschinen und im Wareneingang | Standleitung **200 Mbit/s** zur Zentrale |
| **C – Vertriebsbüro** | Innendienst und Außendienst | **70**, davon **45 Notebooks** im Außendienst | Standleitung **100 Mbit/s**; Notebooks meist per VPN über Mobilfunk |

**Summe: 460 Arbeitsplätze.**

Im Rechenzentrum der Zentrale laufen virtualisiert **sieben Server**, die zum ERP-System gehören:

| Server | Aufgabe |
|---|---|
| `erp-db-01` | Datenbankserver – hält den gesamten ERP-Datenbestand |
| `erp-app-01`, `erp-app-02` | Anwendungsserver hinter einem Lastverteiler |
| `erp-if-01` | Schnittstellenserver: Anbindung der Maschinendatenerfassung und des Etikettendrucks in Werk 2 |
| `erp-ts-01` bis `erp-ts-03` | Terminalserver – darüber arbeiten die 34 Fertigungsterminals und der Außendienst per VPN |

### Die Software

Das ERP-System **Kontura** wird von Version 8 auf **Version 9** gehoben – eine Hauptversion, kein Servicepack.

- Das **Client-Paket** ist **1,4 GB** groß und liegt fertig paketiert und getestet vor (stille Installation, Erkennungsregel, Deinstallationspaket).
- Der Hersteller sichert **N-1-Kompatibilität** zu: Ein **Client der Version 8 arbeitet weiter gegen einen Server der Version 9**. Umgekehrt gilt das nicht – ein Client 9 kann mit einem Server 8 nichts anfangen.
- Das **Server-Upgrade migriert das Datenbankschema**. Der Hersteller gibt für diese Datenmenge **60 bis 90 Minuten** an. Nach der Migration kann die Version-8-Serversoftware mit dem Datenbestand nicht mehr arbeiten.
- Die **Wiederherstellung** der ERP-Datenbank aus der Vollsicherung wurde zuletzt geübt und dauerte **3,5 Stunden**. Eine Vollsicherung der Datenbank dauert **45 Minuten**.
- Das Zusatzmodul **Kontura Label** (Etikettendruck an den Fertigungslinien und im Wareneingang) ist bisher **nur für Version 8 freigegeben**. Der Hersteller hat die Freigabe für Version 9 angekündigt, aber noch nicht erteilt. Betroffen sind die **34 Fertigungsterminals** in Werk 2.

### Betriebliche Randbedingungen

- **Fertigung Werk 2** läuft im Dreischichtbetrieb durchgehend. Die Produktionswoche beginnt mit der Nachtschicht am **Sonntag um 22:00 Uhr** und endet am **Samstag um 06:00 Uhr**. Nur dazwischen – Samstag 06:00 bis Sonntag 22:00 – steht die Fertigung still.
- **Verwaltung und Vertrieb** arbeiten werktags etwa von 07:00 bis 18:00 Uhr.
- Die **Buchhaltung** schließt den Monat jeweils in den **ersten fünf Arbeitstagen** ab. In dieser Zeit ist das ERP für sie nicht entbehrlich.
- Die **45 Außendienst-Notebooks** sind im Schnitt an **zwei Tagen je Woche** im Firmennetz (Bürotage), sonst per VPN über Mobilfunk mit begrenztem Datenvolumen.
- Der **Service Desk** besteht aus drei Personen, davon eine in Werk 2. Jede Person hat rund **7 produktive Stunden** am Tag, von denen etwa **60 Prozent** durch das laufende Tagesgeschäft gebunden sind.
- **Erfahrungswert aus früheren Rollouts in diesem Betrieb:** Bei einem Hauptversionswechsel melden sich rund **8 Prozent** der umgestellten Anwender innerhalb der ersten zwei Arbeitstage. Eine Meldung bindet im Schnitt **25 Minuten**.
- Für die Verteilung über die Standleitungen dürfen höchstens **30 Prozent** der Bandbreite genutzt werden, damit der laufende Betrieb nicht leidet.

---

## Eure Aufgabe

Erstellt einen **Rollout-Plan**, den ihr der Geschäftsführung vorlegen könntet. Er besteht aus fünf Teilen, und zu jedem Teil gehört eine **Begründung in einem Satz**.

!!! tip "Verteilt Rollen – das spart Zeit"
    | Rolle | Aufgabe in der Gruppe |
    |---|---|
    | **Rollout-Leitung** | hält die Reihenfolge der Aufgaben ein, trifft Entscheidungen, wenn die Gruppe sich festfährt |
    | **IT-Betrieb** | achtet auf Technik: Server, Bandbreite, Abhängigkeiten, Rückwege |
    | **Fachbereich** | vertritt Fertigung, Buchhaltung und Außendienst – widerspricht, wenn ein Fenster nicht passt |
    | **Service Desk** | rechnet die Belastung nach und meldet, wenn ein Ring zu groß wird |
    | **Dokumentation** | schreibt den Plan mit, achtet darauf, dass zu jeder Entscheidung eine Begründung steht |

### Teilaufgabe 1 – Reihenfolge und Ringe (ca. 20 Minuten)

1. Legt fest, **was zuerst umgestellt wird**: die Server oder die Clients? Begründet die Reihenfolge mit einer Eigenschaft der Software, nicht mit Bequemlichkeit.
2. Legt die **Reihenfolge innerhalb der Server** fest.
3. Schneidet die 460 Arbeitsplätze in **Ringe**. Gebt zu jedem Ring an: Nummer, wer dazugehört, wie viele Geräte, und warum dieser Ring an dieser Stelle steht.
4. **Die Summe eurer Ringe muss 460 ergeben.** Prüft das nach.

### Teilaufgabe 2 – Pilotgruppe und Freigabekriterien (ca. 15 Minuten)

1. Stellt die **Pilotgruppe** zusammen: Wie viele Geräte, aus welchen Bereichen, von welchen Standorten? Nennt das Kriterium, nach dem ihr auswählt.
2. Legt fest, **wie lange** der Pilot läuft, und begründet die Dauer fachlich.
3. Formuliert **drei Freigabekriterien**, an denen ihr messt, ob der Pilot bestanden ist. Sie müssen überprüfbar sein – „läuft gut“ ist keines.

### Teilaufgabe 3 – Zeitfenster (ca. 15 Minuten)

1. Legt das **Wartungsfenster für die Serverumstellung** fest: Beginn, Ende, Länge. Rechnet nach, ob eure Länge reicht.
2. Legt fest, **wann die Client-Ringe** laufen – und beachtet dabei Schichtbetrieb, Monatsabschluss und die Bürotage des Außendienstes.
3. Rechnet nach, wie lange die **Übertragung des Pakets nach Werk 2** dauert, und entscheidet, was ihr dagegen tut.
4. Rechnet nach, **wie viele Geräte** der Service Desk an einem Tag verkraftet.

### Teilaufgabe 4 – Rückfallplan und Abbruchkriterien (ca. 20 Minuten)

1. Beschreibt für **jede Ebene** (Client, Anwendungsserver, Datenbank) den konkreten Rückweg mit seiner Dauer.
2. Bestimmt den **Point of no Return**: Ab welchem Moment ist der einfache Rückweg vorbei – und warum genau dort?
3. Formuliert **mindestens vier Abbruchkriterien**. Jedes braucht eine messbare Schwelle **und** eine festgelegte Folge.
4. Legt fest, **wer** die Abbruchentscheidung trifft und wer vertritt.

### Teilaufgabe 5 – Kommunikation (ca. 15 Minuten)

1. Erstellt einen **Kommunikationsplan**: Wer erfährt wann was, über welchen Kanal?
2. Formuliert die **Nachricht an die Anwender** vor dem Rollout aus – drei bis fünf Sätze, in der Sprache der Empfänger, nicht in IT-Sprache.
3. Nennt eine Gruppe, die eine **eigene, andere** Nachricht braucht, und sagt warum.

!!! note "Wenn die Zeit knapp wird"
    Bearbeitet Teilaufgabe 1, 3 und 4 vollständig – das ist der Kern. Teilaufgabe 2 lässt sich auf die drei Freigabekriterien verkürzen, Teilaufgabe 5 auf die ausformulierte Anwendernachricht.

---

## Hilfekarten

!!! tip "Spielregel"
    Klappt eine Karte erst auf, wenn ihr mindestens fünf Minuten selbst an der Frage gearbeitet habt. Die Karten geben Denkrichtungen, keine Lösungen.

??? info "Hilfekarte 1 – Wir wissen nicht, ob Server oder Clients zuerst"
    Sucht im Szenario nach dem Satz über die **Kompatibilität**. Dort steht eine Asymmetrie: Eine Richtung funktioniert, die andere nicht.

    Malt euch beide Möglichkeiten auf:

    - *Clients zuerst:* Neue Clients treffen auf alte Server. Was sagt der Hersteller dazu?
    - *Server zuerst:* Alte Clients treffen auf neue Server. Was sagt der Hersteller dazu?

    Eine der beiden Reihenfolgen zwingt euch, **alles an einem Wochenende** umzustellen. Die andere lässt euch Zeit. Genau das ist der Grund, warum Hersteller diese Zusicherung überhaupt geben.

??? info "Hilfekarte 2 – Wie schneiden wir die Ringe?"
    Vier Kriterien, nach denen Ringe geschnitten werden – nutzt sie in dieser Reihenfolge:

    1. **Wer kann einen Fehler selbst erkennen und aushalten?** → zuerst
    2. **Wer deckt möglichst viel Vielfalt ab?** (Standorte, Gerätetypen, Abteilungen) → als Pilot
    3. **Wer ist zahlenmäßig groß, aber unkritisch?** → die breite Mitte
    4. **Wo darf nichts ausfallen?** → zuletzt

    Achtet außerdem auf die **Obergrenze**, die euch der Service Desk vorgibt. Ein Ring, der größer ist als das, was drei Personen an einem Tag auffangen können, ist zu groß – egal wie logisch er sonst geschnitten ist.

    Und: Es gibt in diesem Szenario eine Gruppe, die **gar nicht** umgestellt werden darf, solange etwas fehlt. Sucht danach.

??? info "Hilfekarte 3 – Was gehört in eine Pilotgruppe?"
    Eine Pilotgruppe wird nach **Repräsentativität** zusammengestellt, nicht nach Freiwilligkeit. Fragt euch:

    - Kommt jeder **Standort** darin vor?
    - Kommt jede **Nutzungsart** vor – stationärer Arbeitsplatz, Notebook, Terminalserver-Sitzung?
    - Kommt jeder **fachliche Prozess** vor, den das ERP abdeckt: Auftrag anlegen, Einkauf, Konstruktion, Logistik, Buchhaltung?

    Für die Freigabekriterien gilt: Ein Kriterium ist erst brauchbar, wenn man es **abhaken oder ablehnen** kann. Drei Bausteine helfen:

    - eine **Mindestnutzung** (haben die Leute die Software überhaupt benutzt?)
    - eine **Fehlergrenze** (wie viele Meldungen welcher Schwere sind noch in Ordnung?)
    - eine **Mindestdauer**, die einen vollständigen fachlichen Zyklus abdeckt

??? info "Hilfekarte 4 – Wie finden wir ein Wartungsfenster?"
    Ein Fenster ist erst dann lang genug, wenn **auch der Rückweg hineinpasst**:

    ```text
    Fensterlaenge  >=  Sicherung
                    +  Umstellung
                    +  Funktionspruefung
                    +  Rueckweg (falls noetig)
                    +  Puffer
    ```

    Alle Zahlen dafür stehen im Szenario. Sucht nach: Dauer der Vollsicherung, Dauer der Schemamigration, Dauer der Wiederherstellung.

    Für die **Lage** des Fensters gibt es genau eine Zeitangabe im Szenario, die euch begrenzt: Wann steht die Fertigung still? Der Rest ergibt sich daraus.

??? info "Hilfekarte 5 – Wo liegt der Point of no Return?"
    Der Point of no Return ist **nicht** der Moment, in dem die Umstellung beginnt, und auch nicht der Moment, in dem sie technisch abgeschlossen ist. Es ist der Moment, ab dem der Rückweg **etwas kostet, das man nicht zurückbekommt**.

    Fragt euch: Was geht bei einer Wiederherstellung der Datenbank verloren? Antwort: alles, was seit der Sicherung entstanden ist. Solange **niemand arbeitet**, ist das nichts – die Wiederherstellung kostet dann nur Zeit. Sobald der erste Mensch produktiv bucht, ändert sich das.

    Sucht also den Zeitpunkt, an dem im Betrieb wieder gearbeitet wird. In diesem Szenario ist das nicht der Montagmorgen.

??? info "Hilfekarte 6 – Unsere Abbruchkriterien klingen schwammig"
    Ein Abbruchkriterium hat immer zwei Teile:

    | Teil | Beispiel gut | Beispiel unbrauchbar |
    |---|---|---|
    | **messbare Schwelle** | „mehr als 10 % der Geräte eines Rings melden einen Installationsfehler“ | „es gibt zu viele Probleme“ |
    | **festgelegte Folge** | „→ Ring anhalten, keine weiteren Geräte, Ursachenanalyse“ | (fehlt) |

    Denkt in vier Kategorien, dann findet ihr sie:

    1. **Zeit** – was, wenn wir bis Zeitpunkt X nicht fertig sind?
    2. **Fehlerzahl** – ab welchem Anteil ist es kein Einzelfall mehr?
    3. **Funktion** – welche drei Dinge müssen unbedingt gehen, sonst steht der Betrieb?
    4. **Daten** – hier gibt es keine Prozentgrenze. Warum nicht?

??? info "Hilfekarte 7 – Die Bandbreitenrechnung geht nicht auf"
    Rechnet in drei Schritten und achtet auf die Einheiten:

    ```text
    1) Datenmenge  =  Anzahl Geraete  x  Paketgroesse
    2) Leitung in MB/s  =  Mbit/s geteilt durch 8
    3) davon nutzbarer Anteil  =  MB/s  x  erlaubter Prozentsatz
    4) Zeit  =  Datenmenge in MB  /  nutzbare MB/s
    ```

    Merkhilfe: 200 Mbit/s sind 25 MB/s. 100 Mbit/s sind 12,5 MB/s.

    Wenn euch das Ergebnis unrealistisch lang vorkommt: Das ist die richtige Reaktion. Die Frage lautet dann nicht „wie machen wir die Leitung schneller?“, sondern **„wie oft muss das Paket überhaupt über diese Leitung?“**

---

## Musterlösung

!!! warning "Erst selbst arbeiten"
    Die Musterlösung ist eine **gut begründete** Lösung, nicht die einzig richtige. Bei der Auswertung ist die Begründung wichtiger als die Übereinstimmung.

### Zu Teilaufgabe 1 – Reihenfolge und Ringe

??? tip "Musterlösung aufklappen"
    **1. Server zuerst.** Der Grund steht in der N-1-Zusicherung: Ein Client 8 arbeitet gegen einen Server 9 weiter, ein Client 9 nicht gegen einen Server 8.

    Daraus folgt zwingend:

    - Stellt man **die Clients zuerst** um, muss der Server im selben Moment mitkommen – jedes umgestellte Gerät wäre sonst sofort arbeitsunfähig. Das erzwingt einen Big-Bang: alles an einem Wochenende, 460 Geräte, kein Pilot, kein Ring, maximaler Schaden im Fehlerfall.
    - Stellt man **den Server zuerst** um, arbeiten alle 460 Geräte danach zunächst unverändert weiter – auf Client 8 gegen Server 9. Die Clients können anschließend **in Ruhe, in Ringen und über Wochen** nachgezogen werden.

    Die Zusicherung ist also nicht Beiwerk, sondern genau das, was den gestaffelten Rollout überhaupt erst möglich macht.

    **2. Reihenfolge innerhalb der Server** – von der Abhängigkeit nach unten:

    | Schritt | System | Warum hier |
    |---|---|---|
    | 1 | Vollsicherung `erp-db-01` | der Rückweg entsteht **vor** der Änderung, nicht danach |
    | 2 | `erp-db-01` – Schemamigration | alles andere hängt daran; die Anwendungsserver können ohne migriertes Schema nicht starten |
    | 3 | `erp-app-01`, `erp-app-02` | die eigentliche Anwendung; nacheinander, damit der Lastverteiler immer einen erreichbaren Knoten hat |
    | 4 | `erp-if-01` | Schnittstellen zuletzt, weil sie gegen die fertige Anwendung geprüft werden müssen |
    | 5 | Funktionsprüfung durch den Fachbereich | technisch fertig heißt nicht fachlich in Ordnung |

    Die **Terminalserver `erp-ts-01` bis `-03` bleiben zunächst auf Client 8.** Auf ihnen arbeiten die Fertigungsterminals, und deren Etikettendruck ist für Version 9 nicht freigegeben. Sie kommen erst später, als eigener Ring.

    **3. Die Ringe:**

    | Ring | Wer | Geräte | Warum an dieser Stelle |
    |---|---|---:|---|
    | **0** | IT-Abteilung, Zentrale | 12 | Erkennen Fehler selbst, können sie beheben, haben keinen Anspruch auf Störungsfreiheit |
    | **1** | **Pilotgruppe**, verteilt über alle drei Standorte | 35 | deckt die Vielfalt ab, ist klein genug für enge Betreuung – Zusammensetzung siehe Teilaufgabe 2 |
    | **2** | Zentrale, restliche Arbeitsplätze | 220 | größte, aber unkritischste Gruppe; kurze Wege zum Service Desk; **auf zwei Tage aufteilen** |
    | **3** | Werk 2 ohne Fertigungsterminals: Logistik, Arbeitsvorbereitung, Werkzeugbau, Qualitätssicherung | 94 | eigener Standort, eigene Bandbreitenfrage, eigener Service-Desk-Kontakt vor Ort |
    | **4** | Standort C: 22 stationäre Arbeitsplätze, 43 Außendienst-Notebooks | 65 | Notebooks brauchen ihre Bürotage – der Ring läuft deshalb über zwei Wochen |
    | **5** | Terminalserver und **34 Fertigungsterminals** | 34 | **erst nach der Herstellerfreigabe für Kontura Label** – bis dahin bleiben sie auf Client 8 |

    ```text
    Summenprobe:  12 + 35 + 220 + 94 + 65 + 34  =  460   ✓
    ```

    Der wichtigste Einzelbefund dieser Aufgabe ist **Ring 5**. Das fehlende Modul ist kein Detail, sondern die zentrale Weichenstellung: Weil die Fertigungsterminals nicht umgestellt werden dürfen und die N-1-Kompatibilität sie trotzdem weiterarbeiten lässt, kann der Rollout überhaupt starten. Ohne die Zusicherung des Herstellers müsste der gesamte Rollout warten, bis die Freigabe kommt.

    **Was auch richtig ist:** Ring 2 weiter zu unterteilen – etwa die Buchhaltung als eigenen kleinen Ring, der bewusst außerhalb des Monatsabschlusses liegt. Ebenfalls stark: die Konstruktion getrennt zu betrachten, weil dort mit großen Datenmengen und CAD-Schnittstellen gearbeitet wird.

    **Typischer Fehler:** Ringe nach Abteilungen zu schneiden, ohne die Standorte zu berücksichtigen. Werk 2 hat eine eigene Leitung, einen eigenen Schichtrhythmus und eine eigene Service-Desk-Person – das macht den Standort zum natürlichen Ringgrenze, nicht die Abteilung.

### Zu Teilaufgabe 2 – Pilotgruppe und Freigabekriterien

??? tip "Musterlösung aufklappen"
    **1. Zusammensetzung – 35 Geräte, rund 8 Prozent der Gesamtzahl:**

    | Herkunft | Geräte | Warum |
    |---|---:|---|
    | Zentrale: Vertrieb, Einkauf, Konstruktion, Buchhaltung | 18 | deckt die vier großen fachlichen Prozesse ab |
    | Werk 2: Logistik, Arbeitsvorbereitung, Qualitätssicherung | 12 | zweiter Standort, andere Leitung, andere Prozesse – **keine** Fertigungsterminals |
    | Standort C: 3 stationäre Plätze, 2 Außendienst-Notebooks | 5 | dritter Standort und die Nutzungsart „Notebook per VPN“ |

    Das Auswahlkriterium ist **Repräsentativität**: Jeder Standort, jede Nutzungsart und jeder fachliche Kernprozess muss vertreten sein. Freiwilligkeit ist ein schlechtes Kriterium – Freiwillige sind überdurchschnittlich technikaffin und melden Probleme, die andere gar nicht erst bemerken, während sie über Probleme hinweggehen, an denen weniger geübte Anwender scheitern.

    Zwei Punkte, die leicht untergehen:

    - Der Pilot muss auch den **N-1-Betrieb** prüfen, also Client 8 gegen Server 9 – denn genau so arbeiten während des gesamten Rollouts die noch nicht umgestellten 425 Geräte. Diese Prüfung gehört unmittelbar nach die Serverumstellung, noch vor Ring 0.
    - Die **Fertigungsterminals** dürfen nicht im Pilot sein. Sie sind der Fall, der bewusst zurückgestellt wird.

    **2. Dauer: mindestens fünf Arbeitstage.** Die Begründung ist fachlich, nicht technisch: Erst über eine volle Arbeitswoche kommen alle wiederkehrenden Vorgänge vor – Wochenabschluss, Serienbriefe, Auswertungen, der Lieferantenlauf im Einkauf. Ein Pilot über zwei Tage prüft nur, ob sich das Programm öffnen lässt.

    Wenn der Monatsabschluss in die Pilotzeit fällt, ist das kein Problem, sondern ein Vorteil – vorausgesetzt, mindestens ein Buchhaltungsarbeitsplatz ist im Pilot und die Rückkehr auf Version 8 ist für dieses Gerät jederzeit möglich.

    **3. Drei Freigabekriterien:**

    | Kriterium | Schwelle | Warum überprüfbar |
    |---|---|---|
    | **Mindestnutzung** | mindestens 80 % der Pilotgeräte haben Kontura an mindestens drei der fünf Tage produktiv benutzt | wird aus den Anmeldedaten des ERP abgelesen, nicht geschätzt |
    | **Fehlergrenze** | keine schwerwiegende Störung (Datenverlust, Prozess blockiert); höchstens fünf leichte Meldungen, alle mit bekannter Umgehung | Schweregrade sind vorher definiert, jede Meldung ist ein Ticket |
    | **Fachliche Kernfunktionen** | Auftrag anlegen, Fertigungsauftrag rückmelden und Lieferschein drucken funktionieren an mindestens einem Gerät je Standort nachweislich | wird als Prüfprotokoll abgezeichnet |

    **Typischer Fehler:** „Keine Beschwerden“ als Freigabekriterium. Das kann auch bedeuten, dass niemand die Software benutzt hat – deshalb steht die Mindestnutzung an erster Stelle. Ein Pilot ohne Nutzungsnachweis ist eine Wartezeit, keine Prüfung.

### Zu Teilaufgabe 3 – Zeitfenster

??? tip "Musterlösung aufklappen"
    **1. Wartungsfenster für die Server: Samstag 06:00 bis 18:00 Uhr, zwölf Stunden.**

    Die Lage ergibt sich zwingend aus dem Schichtbetrieb: Die Produktionswoche endet Samstag um 06:00 Uhr und beginnt erst Sonntag um 22:00 Uhr wieder. Das einzige Fenster, in dem das ERP von niemandem gebraucht wird, ist also die Spanne dazwischen – es beginnt **Samstag um 06:00 Uhr** und endet mit dem Anlauf der Nachtschicht.

    Der Ablauf innerhalb des Fensters:

    ```text
    06:00 - 06:45   Vollsicherung erp-db-01                        45 min
    06:45 - 08:15   Schemamigration (Herstellerangabe 60-90 min)   90 min
    08:15 - 09:15   erp-app-01, erp-app-02, erp-if-01              60 min
    09:15 - 11:00   Funktionspruefung durch den Fachbereich       105 min
    11:00           Entscheidungspunkt: Freigabe oder Rueckweg
    ```

    Die Fensterprüfung:

    ```text
    Sicherung          45 min
    Umstellung        150 min   (90 + 60)
    Funktionspruefung 105 min
    Rueckweg          210 min   (3,5 h Wiederherstellung, gemessen)
    Puffer            150 min
                      -------
    Summe             660 min  =  11 Stunden   ->  passt in 12 Stunden   ✓
    ```

    Entscheidet man um 11:00 Uhr gegen die Freigabe, ist die Wiederherstellung um 14:30 Uhr abgeschlossen, und es bleiben noch dreieinhalb Stunden, um den Version-8-Stand zu prüfen. Das ist der Grund, warum der Entscheidungspunkt **nicht** ans Fensterende gelegt wird.

    **2. Lage der Client-Ringe:**

    | Ring | Wann | Warum |
    |---|---|---|
    | N-1-Prüfung | direkt im Serverfenster, Samstagvormittag | muss stehen, bevor Sonntagnacht die Fertigung anläuft |
    | Ring 0 (IT) | erster Arbeitstag nach dem Serverfenster | sofort, damit Fehler früh auffallen |
    | Ring 1 (Pilot) | zweiter Arbeitstag, dann fünf Arbeitstage Beobachtung | volle Arbeitswoche als fachlicher Zyklus |
    | Ring 2 (Zentrale, 220) | zwei aufeinanderfolgende Arbeitstage, Installation über Nacht | Geräte bleiben angeschaltet; Anwender finden morgens die neue Version vor |
    | Ring 3 (Werk 2, 94) | an einem Arbeitstag, Installation in der Schichtübergabe früh morgens | Fertigung läuft weiter, Büro- und Logistikplätze sind kurz entbehrlich |
    | Ring 4 (Standort C, 65) | über zwei Wochen, jeweils an den Bürotagen | die 43 Notebooks sind nur an ihren Bürotagen im Netz |
    | Ring 5 (Terminals, 34) | eigenes Wochenendfenster **nach** der Herstellerfreigabe | Etikettendruck ist fertigungskritisch, Prüfung muss ohne laufende Schicht möglich sein |

    **Zwei Sperrzeiten**, die im Plan stehen müssen:

    - **Die ersten fünf Arbeitstage jedes Monats**: kein Ring, der Buchhaltungsarbeitsplätze enthält. Der Monatsabschluss ist der Vorgang mit der geringsten Fehlertoleranz im ganzen Haus.
    - **Kein Client-Ring am letzten Arbeitstag einer Woche.** Wer freitags umstellt, überlässt die Fehlersuche dem Wochenende – und der Service Desk ist nicht da.

    **3. Bandbreite nach Werk 2:**

    ```text
    Datenmenge   =  140 Geraete  x  1,4 GB  =  196 GB  =  196.000 MB
    Leitung      =  200 Mbit/s / 8           =  25 MB/s
    davon 30 %   =  7,5 MB/s

    Uebertragungszeit  =  196.000 MB / 7,5 MB/s  =  26.133 s  =  rund 7,3 Stunden
    ```

    Über sieben Stunden Dauerlast auf der Standleitung, und das für ein einziges Paket – das ist keine tragbare Lösung, selbst wenn es nachts liefe. Denn die Leitung trägt auch die Maschinendatenerfassung und den Zugriff der Fertigungsterminals auf die Terminalserver, und die laufen im Dreischichtbetrieb durch.

    **Die Lösung: ein Verteilpunkt in Werk 2.** Ein Server am Standort holt das Paket **einmal** und gibt es lokal an die 140 Geräte aus:

    ```text
    1.400 MB / 7,5 MB/s  =  187 s  =  gut 3 Minuten ueber die Standleitung
    ```

    Aus 7,3 Stunden werden drei Minuten. Die Ausgabe an die 140 Geräte läuft danach im lokalen Netz von Werk 2 und belastet die Standleitung überhaupt nicht mehr.

    Für **Standort C** gilt dasselbe in kleinerem Maßstab. Ohne Verteilpunkt für die 22 stationären Geräte:

    ```text
    22  x  1,4 GB  =  30,8 GB  =  30.800 MB
    100 Mbit/s / 8  =  12,5 MB/s,  davon 30 %  =  3,75 MB/s
    30.800 / 3,75   =  8.213 s  =  rund 2,3 Stunden
    ```

    Das ist über eine Nacht vertretbar; ein Verteilpunkt lohnt sich hier nicht zwingend. Die **43 Notebooks** brauchen dagegen eine eigene Regel: Sie holen das Paket **nur im Firmennetz**, nie über die getaktete Mobilfunkverbindung. Technisch wird das über die Unterscheidung getakteter und ungetakteter Verbindungen im Verteilungswerkzeug abgebildet.

    **4. Kapazität des Service Desks:**

    ```text
    Kapazitaet je Tag  =  3 Personen x 7 h x 40 %  =  8,4 h  =  504 Minuten
    Meldungen je Tag   =  504 min / 25 min je Meldung  =  rund 20 Meldungen
    Geraete je Tag     =  20 Meldungen / 0,08         =  rund 250 Geraete
    ```

    **Rund 250 Geräte je Tag** ist die Obergrenze – und das nur, wenn an diesem Tag kein anderer Ring nachbetreut wird. Daraus folgt unmittelbar, dass Ring 2 mit 220 Geräten zwar rechnerisch an einem Tag ginge, aber praktisch auf zwei Tage gehört: Ring 1 ist zu diesem Zeitpunkt noch in Beobachtung, und ein Puffer für Unerwartetes fehlt sonst völlig.

    Eine Ergänzung, die in der Auswertung oft kommt und richtig ist: Die Zahl lässt sich **erhöhen**, ohne mehr Personal einzustellen – durch eine Kurzanleitung, die die drei häufigsten Fragen vorwegnimmt, und durch eine gebündelte Sprechstunde am Morgen nach jedem Ring statt Einzelanrufen über den Tag.

### Zu Teilaufgabe 4 – Rückfallplan und Abbruchkriterien

??? tip "Musterlösung aufklappen"
    **1. Der Rückweg je Ebene:**

    | Ebene | Rückweg | Dauer | Solange möglich, wie … |
    |---|---|---|---|
    | **Client** | Deinstallationspaket Version 9, anschließend Version-8-Paket neu verteilen | rund 25 Minuten je Gerät, automatisiert und parallel für einen ganzen Ring | … der Server auf Version 9 läuft – dank N-1 ist das **dauerhaft** möglich |
    | **Anwendungs- und Schnittstellenserver** | Rücktausch auf den Version-8-Stand aus dem Abbild der virtuellen Maschine | rund 45 Minuten | … das Datenbankschema noch auf Stand 8 ist |
    | **Datenbankschema** | Wiederherstellung der Vollsicherung von 06:00 Uhr | **3,5 Stunden**, gemessen | … noch niemand produktiv im neuen Schema gearbeitet hat |

    Die entscheidende Zeile ist die erste: Weil ein Client 8 gegen einen Server 9 arbeiten kann, ist der Client-Rückweg **nicht an ein Zeitfenster gebunden**. Stellt sich in Ring 3 ein Problem heraus, kann man diesen Ring zurückrollen, ohne die Server anzufassen und ohne die schon umgestellten Ringe 0 bis 2 zu stören. Das ist der praktische Wert der N-1-Zusicherung – und der Grund, warum die Reihenfolge aus Teilaufgabe 1 so wichtig war.

    **2. Der Point of no Return: Sonntag 22:00 Uhr, mit dem Beginn der Nachtschicht.**

    Die Begründung: Eine Wiederherstellung der Datenbank setzt den Datenbestand auf den Stand der Sicherung von Samstag 06:00 Uhr zurück. Solange im Betrieb niemand arbeitet, geht dabei **nichts** verloren – die Wiederherstellung kostet nur Zeit. Sobald die Nachtschicht anläuft, entstehen Fertigungsrückmeldungen, Wareneingänge und Buchungen. Ab diesem Moment kostet jede Wiederherstellung Daten, die von Hand nachzuerfassen wären.

    Damit gibt es zwei verschiedene Grenzen, die man sauber unterscheiden muss:

    - Der Abschluss der Schemamigration (etwa 08:15 Uhr) beendet den **billigen** Rückweg. Danach geht es nur noch über die Wiederherstellung.
    - Der Schichtbeginn Sonntag 22:00 Uhr beendet den **verlustfreien** Rückweg. Als praktische Entscheidungsgrenze setzt man ihn zwei Stunden früher an, damit die Wiederherstellung im Ernstfall noch anlaufen kann – auch wenn sie dann in die Schicht hineinreicht.

    Für die Anwender bedeutet das eine Ansage, die in den Kommunikationsplan gehört: **Bis Sonntag 20:00 Uhr darf niemand produktiv im ERP arbeiten** – auch niemand, der „nur schnell etwas nachtragen“ will.

    **3. Abbruchkriterien:**

    | # | Schwelle | Folge |
    |---|---|---|
    | 1 | Die Schemamigration ist um **09:00 Uhr** nicht abgeschlossen (Herstellerangabe plus 100 % Puffer überschritten) | Abbruch, Wiederherstellung aus der Sicherung, neuer Termin mit dem Hersteller |
    | 2 | Eine der drei fachlichen Kernfunktionen – **Auftrag anlegen, Fertigungsauftrag rückmelden, Lieferschein drucken** – funktioniert nach der Serverumstellung nicht | Abbruch, Wiederherstellung |
    | 3 | Der **N-1-Betrieb** funktioniert nicht: Ein Client 8 kann gegen Server 9 nicht arbeiten | **sofortiger Abbruch**, unabhängig von allem anderen – ohne N-1 stünden Sonntagnacht 460 Arbeitsplätze |
    | 4 | Um **11:00 Uhr** liegt keine Freigabe des Fachbereichs vor | Rückweg einleiten, weil die Wiederherstellung 3,5 Stunden braucht und danach noch geprüft werden muss |
    | 5 | In einem Client-Ring melden mehr als **10 %** der Geräte einen Installationsfehler | Ring anhalten, keine weiteren Geräte, Ursachenanalyse vor Fortsetzung |
    | 6 | Es tritt **ein einziger** Fehler auf, der Daten verändert oder verliert | sofortiger Abbruch – hier gibt es keine Prozentgrenze |

    Kriterium 6 verdient eine eigene Erklärung, weil es in der Auswertung regelmäßig hinterfragt wird. Bei allen anderen Kriterien geht es um **Verfügbarkeit**: Ein Ausfall ist ärgerlich, aber er endet, wenn das System wieder läuft. Ein Datenfehler endet nicht – er wandert in Auswertungen, in Lieferscheine, in die Buchhaltung und wird mit jeder Stunde teurer zu finden. Deshalb ist der erste Fall bereits einer zu viel.

    **4. Entscheidung.** Die Abbruchentscheidung trifft die **Rollout-Leitung**, im Serverfenster in Abstimmung mit einer benannten Vertretung des Fachbereichs Fertigung. Beide sind während des gesamten Fensters erreichbar, mit Rufnummer im Plan. Für den Fall, dass die Rollout-Leitung nicht erreichbar ist, ist eine Vertretung benannt – Rollouts gehen selten zu Bürozeiten schief.

    Was ebenfalls in den Plan gehört: Wer darf **nicht** entscheiden. Die Person, die gerade seit sechs Stunden an der Migration sitzt, ist die schlechteste Wahl für die Frage, ob man abbricht. Genau dafür sind die Kriterien vorher aufgeschrieben worden.

### Zu Teilaufgabe 5 – Kommunikation

??? tip "Musterlösung aufklappen"
    **1. Kommunikationsplan:**

    | Wann | An wen | Kanal | Inhalt |
    |---|---|---|---|
    | zwei Wochen vorher | alle Beschäftigten | Intranet und Aushang in Werk 2 | was sich ändert, warum, grober Zeitrahmen, wo die Kurzanleitung liegt |
    | eine Woche vorher | Führungskräfte, Schichtleitungen | Besprechung | Ablauf, Sperrzeiten, wer im Ernstfall wen anruft |
    | zwei Tage vorher | alle Betroffenen des jeweiligen Rings | E-Mail und Aushang | konkretes Zeitfenster, was zu tun ist (Gerät angeschaltet lassen, Dateien speichern), Ansprechpartner |
    | am Vorabend | Schichtleitung Werk 2 | Telefon | Bestätigung, dass die Sperrzeit gilt: bis Sonntag 20:00 Uhr keine Arbeit im ERP |
    | während des Fensters | Service Desk, Führungskräfte | Kurznachricht nach jedem Meilenstein | Fortschritt, Auffälligkeiten, Sprachregelung für Rückfragen |
    | direkt danach | alle Betroffenen | E-Mail und Aushang | fertig; was neu ist; wo die Kurzanleitung steht; wie man ein Problem meldet |
    | eine Woche danach | Rollout-Team und Fachbereich | Auswertungsrunde | was lief, was nicht, was wir am nächsten Ring ändern |

    **Aushänge in Werk 2 sind kein Beiwerk.** Die Fertigungsterminals werden von Menschen bedient, die keinen persönlichen E-Mail-Zugang haben und keine Intranet-Seite lesen. Wer nur per E-Mail kommuniziert, erreicht einen ganzen Standort nicht.

    **2. Die Nachricht an die Anwender** (Ring 2, Zentrale):

    > **Kontura wird auf Version 9 aktualisiert**
    >
    > In der Nacht zum kommenden Mittwoch wird auf Ihrem Arbeitsplatzrechner die neue Version unseres ERP-Systems Kontura installiert. Bitte **lassen Sie Ihren Rechner am Dienstagabend eingeschaltet** und **schließen Sie Kontura**, bevor Sie gehen – Ihre Daten bleiben dabei unverändert erhalten.
    >
    > Am Mittwochmorgen finden Sie die neue Version vor. Sie sieht an einigen Stellen anders aus; die wichtigsten Änderungen stehen auf der einseitigen Kurzanleitung, die Sie an Ihrem Arbeitsplatz finden und die auch im Intranet liegt.
    >
    > Wenn etwas nicht funktioniert: Melden Sie sich beim Service Desk unter der bekannten Nummer. In der ersten Woche sind wir jeden Morgen zwischen 8 und 9 Uhr zusätzlich für kurze Fragen erreichbar.

    Woran man diese Nachricht erkennt: Sie sagt **was passiert**, **was der Empfänger tun muss**, **wann es fertig ist**, **wo Hilfe steht** – und sie benutzt kein einziges Wort aus der IT-Sprache. Kein „Deployment“, kein „Rollout“, kein „Client-Paket“, keine Versionsnummer im Betreff, mit der niemand etwas anfangen kann.

    **3. Eine Gruppe braucht eine andere Nachricht: die 34 Beschäftigten an den Fertigungsterminals.**

    Bei ihnen ändert sich **nichts** – und genau das muss man ihnen sagen. Denn sie hören von der Umstellung, sehen bei Kolleginnen und Kollegen eine neue Oberfläche und fragen sich, ob sie etwas übersehen haben. Ihre Nachricht lautet sinngemäß: *„An Ihrem Terminal ändert sich zunächst nichts. Der Etikettendruck läuft unverändert weiter. Sobald Ihre Arbeitsplätze umgestellt werden, informieren wir Sie rechtzeitig gesondert.“*

    Zwei weitere Gruppen mit eigenem Bedarf, die in der Auswertung genannt werden können:

    - Der **Außendienst**: Er muss wissen, dass die Installation nur an Bürotagen läuft und dass er das Notebook an diesen Tagen mit dem Firmennetz verbinden muss. Ohne diesen Hinweis bleiben Geräte monatelang auf der alten Version.
    - Die **Buchhaltung**: Sie braucht die ausdrückliche Zusage, dass die Umstellung außerhalb des Monatsabschlusses liegt – sonst plant sie vorsorglich Überstunden ein, die niemand braucht.

---

## Woran ihr einen guten Plan erkennt

Nutzt diese Liste bei der gemeinsamen Auswertung. Ein Plan ist tragfähig, wenn er alle acht Punkte erfüllt:

| # | Prüffrage | Erfüllt, wenn … |
|---|---|---|
| 1 | Steht die **Reihenfolge** fest und ist sie technisch begründet? | … die Begründung aus einer Eigenschaft der Software kommt, nicht aus Gewohnheit |
| 2 | Ergeben die **Ringe zusammen** die Gesamtzahl? | … die Summenprobe aufgeht und kein Gerät zweimal vorkommt |
| 3 | Ist die **Pilotgruppe repräsentativ**? | … jeder Standort, jede Nutzungsart und jeder Kernprozess darin vorkommt |
| 4 | Sind die **Freigabekriterien überprüfbar**? | … man sie abhaken oder ablehnen kann, ohne zu diskutieren |
| 5 | Passt in das **Wartungsfenster auch der Rückweg**? | … die Rechnung aufgeschrieben ist und aufgeht |
| 6 | Ist der **Point of no Return** benannt und begründet? | … er an dem Moment hängt, ab dem etwas Unwiederbringliches verloren geht |
| 7 | Haben die **Abbruchkriterien Schwelle und Folge**? | … zu jeder Zahl ein „dann tun wir Folgendes“ steht |
| 8 | Erreicht die **Kommunikation alle**? | … auch die Menschen ohne E-Mail-Zugang vorkommen |

!!! danger "Die vier häufigsten Schwächen"
    1. **Kein Rückweg für die Clients.** Der Serverteil ist sorgfältig durchdacht, aber niemand hat aufgeschrieben, wie 220 Arbeitsplätze wieder auf Version 8 kommen.
    2. **Das Fenster ist so lang wie die Umstellung.** Wer zwölf Stunden Arbeit in ein Zwölf-Stunden-Fenster legt, hat den Rückweg vergessen – und damit das Fenster.
    3. **Abbruchkriterien ohne Zahlen.** „Wenn es zu viele Probleme gibt, brechen wir ab“ ist nachts um drei kein Kriterium, sondern eine Diskussion.
    4. **Das fehlende Modul übersehen.** Wer die 34 Fertigungsterminals mit ausrollt, legt die Etikettierung in der Fertigung still – und merkt es erst, wenn die erste Schicht nicht verladen kann.

---

## Reflexionsfragen für die Auswertung

Diese Fragen gehören ins gemeinsame Gespräch, nicht in die Gruppenphase.

1. **Die N-1-Kompatibilität war in diesem Szenario die wichtigste einzelne Information.** Was hättet ihr anders planen müssen, wenn der Hersteller sie nicht zusichern würde – und was würde das für das Risiko bedeuten?

2. **Der Point of no Return lag nicht dort, wo die meisten ihn zuerst vermuten.** Warum ist der technische Abschluss einer Migration nicht derselbe Zeitpunkt wie das Ende des verlustfreien Rückwegs? Wo begegnet euch dieser Unterschied noch?

3. **Ihr habt Abbruchkriterien mit Zahlen versehen.** Wer im Betrieb müsste diese Zahlen eigentlich festlegen – die IT oder der Fachbereich? Und was passiert, wenn sich beide nicht einigen?

4. **Ein Ring von 220 Geräten war rechnerisch an einem Tag machbar, praktisch aber nicht.** Welche anderen Grenzen außer der Kapazität des Service Desks begrenzen in einem echten Betrieb die Ringgröße?

5. **Stellt euch dasselbe Szenario in einer Container-Umgebung vor**, in der die Anwendung als Deployment im Cluster läuft. Welche der fünf Teilaufgaben würde sich wesentlich vereinfachen – und welche bliebe genau so schwierig wie hier? (Siehe [Container-Orchestrierung](kubernetes-grundlagen.md).)

---

## Weiterlesen

- [Softwareverteilung & Deployment](softwareverteilung.md): die Theorie zu dieser Übung – Prozess, Strategien, Rollback-Plan, Abbruchkriterien
- [Container-Orchestrierung (Kubernetes)](kubernetes-grundlagen.md): dieselben Planungsfragen im Cluster
- [Risikomanagement](../it-sicherheit/risikomanagement.md): das Rollout-Risiko bewerten, bevor man es eingeht
- [Backup & Recovery](../betrieb/backup-und-recovery.md): warum eine gemessene Wiederherstellungszeit den Unterschied macht
- [Incident Response & Business Continuity](../betrieb/incident-und-bcm.md): was passiert, wenn der Abbruch nicht reicht
- [Schulung & Training](../projektmanagement/schulung-und-training.md): die Anwenderseite eines Versionswechsels
