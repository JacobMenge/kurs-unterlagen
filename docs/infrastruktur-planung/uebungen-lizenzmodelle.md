---
title: "Übungen: Lizenzmodelle"
description: "Neunzehn Einzelaufgaben nur zu Lizenzmodellen: die günstigste Zählweise ausrechnen, Kauf und Abo bis zum Break-even vergleichen, Einzelplatz gegen Volumenvertrag mit Staffelpreisen stellen, kernbasierte Lizenzen auf Host und VM durchrechnen, Open-Source-Pflichten beurteilen, Unter- und Überlizenzierung erkennen, eine Nutzwertanalyse kippen lassen, Vertragslücken finden, den Lizenz-Turm analysieren, aus einer Rohliste ein Lizenzinventar bauen, falsche Lizenzarten enttarnen, einen Lizenzverwaltungsprozess entwerfen und zu jedem Lizenztyp Beispiele recherchieren – dazu vier Artikelaufgaben zu Audits, Open-Source-Verfahren, Unterlizenzierung und dem Streit um Cloud-Lizenzen. Jede Aufgabe mit ausführlicher Musterlösung."
---

# Übungen – Lizenzmodelle

<span class='badge badge-praxis'>Aufgaben</span> &nbsp; Neunzehn Aufgaben, die ausschließlich um die Inhalte der Seite [Lizenzmodelle](lizenzmodelle.md) kreisen. Jede Aufgabe steht für sich. Die große Aufgabensammlung zum durchgehenden Szenario findest du unter [Übungsaufgaben](uebungen.md).

Die Aufgaben 1 bis 15 rechnest und beurteilst du am Material dieser Seite. Die vier **[Aufgaben mit Artikeln](#aufgaben-mit-artikeln)** am Ende funktionieren anders: Dort wertet ihr echte Fachbeiträge und Nachrichten aus – gut geeignet für Gruppenarbeit im Unterricht.

Ein Hinweis vorweg: Auf dieser Seite geht es um **Modelle, Metriken und Kalkulation** – nicht um Rechtsberatung. Alle Preise, Prozentsätze und Vertragstexte sind erfundene Beispielwerte. Im Ernstfall entscheidet immer der konkrete Lizenzvertrag des Herstellers – bei größeren Beträgen schaut außerdem jemand mit juristischem Blick darauf.

---

## Die Aufgaben

### Aufgabe 1 – Welche Zählweise ist die günstigste?

!!! info "Worum es geht"
    - Die drei Zählweisen **pro Gerät**, **Named User** und **Concurrent User** durchrechnen statt zu schätzen
    - Erkennen, dass die günstigste Metrik am **Nutzungsmuster** hängt – und sich mit ihm ändert
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

Ein Fertigungsbetrieb setzt eine Fachanwendung ein. **80 Beschäftigte** arbeiten damit, allerdings im Drei-Schicht-Betrieb: Nie sind mehr als **30 gleichzeitig** angemeldet. Sie teilen sich **45 Arbeitsplätze** im Haus. Der Hersteller bietet drei Metriken an:

| Metrik | Preis je Lizenz und Jahr |
|---|---|
| Named User | 240 Euro |
| Concurrent User | 550 Euro |
| pro Gerät | 320 Euro |

1. **Rechne alle drei Varianten durch.** Welche ist die günstigste?
2. Der Betrieb führt Home-Office ein: 25 Beschäftigte arbeiten zusätzlich auf eigenen Notebooks, die Zahl der gleichzeitig Angemeldeten steigt dadurch auf 35. **Rechne erneut.** Was ändert sich?
3. **Welchen praktischen Stolperstein hat die Concurrent-Variante?**

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – die Ausgangslage:*

    ```text
    Named User:       80 Personen    x 240 EUR  =  19.200 EUR je Jahr
    Concurrent User:  30 gleichzeitig x 550 EUR  =  16.500 EUR je Jahr
    pro Geraet:       45 Arbeitsplaetze x 320 EUR =  14.400 EUR je Jahr
    ```

    Günstigste Variante: **pro Gerät** mit 14.400 Euro. Der Grund liegt im Schichtbetrieb: 80 Personen teilen sich 45 Arbeitsplätze, gezählt werden aber nur die Geräte.

    *Teil 2 – mit Home-Office:*

    ```text
    Named User:       80 Personen        x 240 EUR  =  19.200 EUR  (unveraendert)
    Concurrent User:  35 gleichzeitig    x 550 EUR  =  19.250 EUR
    pro Geraet:       45 + 25 = 70 Geraete x 320 EUR =  22.400 EUR
    ```

    Das Bild dreht sich vollständig: Die vorher günstigste Variante ist jetzt die teuerste, weil jedes private Notebook mitzählt. Am günstigsten ist nun **Named User** mit 19.200 Euro – aber nur um 50 Euro vor Concurrent. Bei so knappen Abständen entscheidet nicht mehr der Preis, sondern der Verwaltungsaufwand und die Frage, welche Metrik das nächste Wachstum besser verträgt.

    *Teil 3 – der Stolperstein bei Concurrent:*

    - Es braucht einen **Lizenzserver**, der die Gleichzeitigkeit zählt und durchsetzt. Das ist zusätzliche Technik, die betrieben, überwacht und im Störungsfall repariert werden muss – fällt sie aus, arbeitet unter Umständen niemand mehr.
    - Ist die Grenze erreicht, kommt die 31. Person **nicht** hinein. Das ist kein technisches Problem, sondern ein organisatorisches: Wer in der Schichtübergabe zehn Minuten warten muss, ist genau in dem Moment blockiert, in dem es eng wird.
    - Die Zahl 30 ist eine **Messung**, keine Schätzung. Sie gehört über mehrere Wochen erhoben, inklusive der Spitzen zum Monatsabschluss – wer den Mittelwert lizenziert, lizenziert zu knapp.

    **2. Warum so?** – Es gibt keine Metrik, die „an sich" günstig ist. Es gibt nur Metriken, die zum Nutzungsmuster passen oder nicht:

    | Metrik | Günstig, wenn ... | Teuer, wenn ... |
    |---|---|---|
    | pro Gerät | wenige Geräte von vielen geteilt werden (Schichtbetrieb, Terminals) | jeder mehrere Geräte nutzt (Home-Office, Zweitgerät, Notebook plus Desktop) |
    | Named User | jede Person auf vielen Geräten arbeitet | viele Teilzeitkräfte oder seltene Nutzer die volle Lizenz kosten |
    | Concurrent User | die Nutzung sich über den Tag verteilt | alle gleichzeitig arbeiten – dann bringt sie nichts |

    Teil 2 ist die eigentliche Lehre der Aufgabe: **Eine Lizenzentscheidung ist keine Rechnung von heute, sondern eine Wette auf das Nutzungsmuster von morgen.** Eine einzige organisatorische Änderung – Home-Office – hat hier die Reihenfolge komplett gedreht, ohne dass sich an der Software etwas geändert hätte. Deshalb gehört zu jedem Lizenzvertrag die Frage: Was passiert, wenn sich unsere Arbeitsweise ändert?

    **3. Auch gut wäre ...** – anzumerken, dass die drei Rechnungen dieselbe Software vergleichen, aber nicht denselben Verwaltungsaufwand. Named User müssen gepflegt werden – wer geht, muss abgemeldet werden, sonst zahlt der Betrieb für Karteileichen. Gerätelizenzen müssen bei jedem Hardwaretausch nachgezogen werden. Concurrent braucht einen laufenden Dienst. Diese Kosten stehen in keinem Angebot und fallen trotzdem an. Ebenfalls stark ist die Anschlussfrage, ob sich Metriken **mischen** lassen: Manche Hersteller erlauben Named-User-Lizenzen für die Vielnutzer plus einen Pool an Concurrent-Lizenzen für alle anderen – das ist oft die günstigste Kombination und wird selten von allein angeboten.

    **4. Typischer Stolperstein** – die Personenzahl reflexhaft als Lizenzzahl zu nehmen. 80 Beschäftigte heißen bei keiner der drei Metriken automatisch 80 Lizenzen. Der zweite Stolperstein ist Teil 2: Beim Home-Office nur an die Nutzer zu denken und zu übersehen, dass in der Gerätemetrik jedes private Notebook ein weiteres **Gerät** ist. Genau dieser Punkt taucht in echten Audits regelmäßig auf.

---

### Aufgabe 2 – Kaufen oder abonnieren?

!!! info "Worum es geht"
    - Kauflizenz und Abo über die **gesamte Nutzungsdauer** vergleichen
    - Den **Break-even** ausrechnen und richtig interpretieren
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

Das **Ingenieurbüro Vogt & Partner** braucht eine Fachsoftware für **80 Arbeitsplätze**. Zwei Angebote:

- **Kauflizenz:** 350 Euro je Arbeitsplatz, einmalig. Wartung und Updates: 18 % des Kaufpreises pro Jahr, erstmals ab dem zweiten Jahr.
- **Abo:** 12 Euro je Arbeitsplatz und Monat, Updates und Support enthalten.

1. **Stell die kumulierten Kosten beider Varianten für 5 Jahre gegenüber.**
2. **Wann genau liegt der Break-even?** Rechne ihn aus.
3. **Wann ist welche Variante die richtige Wahl?** Nenne je zwei Situationen.
4. **Was fehlt in diesem Vergleich?**

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – die Gegenüberstellung:*

    ```text
    Kauf:    80 x 350 EUR                  = 28.000 EUR einmalig
             Wartung 18 % von 28.000 EUR   =  5.040 EUR je Jahr, ab Jahr 2

    Abo:     80 x 12 EUR x 12 Monate       = 11.520 EUR je Jahr

    Kumulierte Kosten
                 Jahr 1    Jahr 2    Jahr 3    Jahr 4    Jahr 5
      Kauf       28.000    33.040    38.080    43.120    48.160
      Abo        11.520    23.040    34.560    46.080    57.600
    ```

    *Teil 2 – der Break-even:* Gesucht ist der Zeitpunkt, an dem beide Kurven sich schneiden.

    ```text
    Kauf(t)  =  28.000 + 5.040 x (t - 1)
    Abo(t)   =  11.520 x t

    28.000 + 5.040 t - 5.040  =  11.520 t
                      22.960  =   6.480 t
                           t  =  3,54 Jahre
    ```

    Der Break-even liegt bei rund **3,5 Jahren**, also im Lauf des vierten Jahres. Das passt zur Tabelle: In Jahr 3 liegt der Kauf noch vorn (38.080 gegen 34.560), in Jahr 4 hat das Abo überholt (43.120 gegen 46.080).

    *Teil 3 – wann welche Variante:*

    | Abo ist richtig, wenn ... | Kauf ist richtig, wenn ... |
    |---|---|
    | die Nutzungsdauer unsicher ist oder unter dem Break-even liegt | die Software erfahrungsgemäß viele Jahre bleibt (Fachanwendungen, CAD) |
    | ein Produktwechsel absehbar ist oder erst noch erprobt wird | das Budget eine Investition erlaubt und laufende Kosten schwer durchzusetzen sind |
    | die Zahl der Arbeitsplätze schwankt – ein Abo lässt sich anpassen, eine Kauflizenz nicht zurückgeben | Planungssicherheit über den Preis wichtiger ist als Flexibilität |

    *Teil 4 – was fehlt:* Auf der **Kaufseite fehlt der Betrieb**. Die Software läuft auf eigenen Servern: Hardware, Strom, Backup, Update-Einspielung und Admin-Zeit kommen obendrauf. Im Abo sind Betrieb und Updates enthalten. Ein sauberer Vergleich stellt deshalb Gesamtkosten gegen Gesamtkosten – genau die TCO-Logik von der Seite [Ressourcen planen](ressourcen-planen.md).

    Zwei weitere Lücken: Bei der Kaufvariante ist offen, **was passiert, wenn die Wartung gekündigt wird** – die Software läuft weiter, bekommt aber keine Sicherheitsupdates mehr und ist damit in ein bis zwei Jahren nicht mehr betreibbar. Und im Abo ist offen, ob der Preis über fünf Jahre stabil bleibt.

    **2. Warum so?** – Der Break-even ist eine der nützlichsten Zahlen in jeder Beschaffung, weil er die Diskussion umdreht. Ohne ihn streitet das Team darüber, ob Abos „modern" oder „Abzocke" sind. Mit ihm lautet die Frage: **Bleiben wir länger oder kürzer als dreieinhalb Jahre bei dieser Software?** Das ist eine Frage, die man beantworten kann – und die richtigen Leute im Haus können sie besser beantworten als jede Kalkulation.

    Wichtig ist dabei, den Break-even nicht als Empfehlung zu lesen. Er sagt nur, wo der Vergleich kippt. Ob man rechts oder links davon landen **will**, entscheidet sich an Flexibilität, Budgetstruktur und Risiko.

    **3. Auch gut wäre ...** – die Rechnung über zehn Jahre zu verlängern, weil Fachsoftware im Ingenieurbüro selten nach fünf Jahren wechselt: Kauf 28.000 + 9 × 5.040 = 73.360 Euro, Abo 10 × 11.520 = 115.200 Euro. Über zehn Jahre kostet das Abo also gut 40.000 Euro mehr – der Abstand wird jedes Jahr größer. Ebenfalls stark ist der Hinweis, dass die Wartungsklausel genau geprüft gehört: Ist die Wartung optional oder Pflicht? Steigt der Prozentsatz? Bleibt die Software ohne Wartung nutzbar? Zwischen „ab Jahr 1" und „ab Jahr 2" liegen in dieser Rechnung 5.040 Euro – solche Details entscheiden den Vergleich, bevor irgendjemand über Funktionen spricht.

    **4. Typischer Stolperstein** – nur das erste Jahr zu vergleichen. 11.520 gegen 28.000 Euro sieht nach einer klaren Sache aus und ist das genaue Gegenteil einer Entscheidungsgrundlage. Der zweite Stolperstein ist, die Wartung beim Kauf zu vergessen oder für optional zu halten. Eine Kauflizenz ohne Updates ist nach zwei Jahren ein Sicherheitsrisiko – die 5.040 Euro pro Jahr sind kein Zusatz, sondern Teil des Preises.

---

### Aufgabe 3 – Open Source: Was ist erlaubt?

!!! info "Worum es geht"
    - **Permissive** und **Copyleft**-Lizenzen an ihren Pflichten unterscheiden
    - Verstehen, wann Copyleft überhaupt greift – und wann nicht
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

**Beurteile die vier Fälle:** erlaubt, erlaubt mit Auflagen oder problematisch? Nenne jeweils die Pflicht, die dabei zu beachten ist.

| Fall | Situation |
|---|---|
| **A** | Das Büro setzt eine Serversoftware unter GPL intern ein – unverändert, nur für die eigenen Mitarbeitenden. |
| **B** | Eine Entwicklerin baut eine Bibliothek unter MIT-Lizenz in ein Produkt ein, das an Kunden verkauft wird. Der eigene Quellcode soll geschlossen bleiben. |
| **C** | Das Büro verändert eine GPL-Software und gibt die veränderte Fassung an einen Kunden weiter. |
| **D** | Die Geschäftsführung sagt: „Wir nehmen die Open-Source-Variante, dann fallen keine Kosten an." |

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Fall | Bewertung | Die Pflicht dahinter |
    |---|---|---|
    | **A** | **erlaubt, ohne besondere Auflagen** | Copyleft greift bei der **Weitergabe** der Software, nicht beim internen Einsatz. Wer eine GPL-Software nur selbst betreibt, muss nichts offenlegen. Die Lizenzbedingungen gelten trotzdem – man darf sie nur meist mühelos einhalten. |
    | **B** | **erlaubt mit Auflagen** | Permissive Lizenzen wie MIT oder Apache erlauben ausdrücklich den Einbau in geschlossene Produkte. Die Auflage ist der **Urhebervermerk**: Copyright-Hinweis und Lizenztext müssen erhalten bleiben und dem Kunden mitgeliefert werden – üblicherweise in einer Datei mit den Lizenzhinweisen aller verwendeten Komponenten. |
    | **C** | **erlaubt, aber mit der vollen Copyleft-Pflicht** | Hier greift genau das, was in Fall A nicht griff: Wer eine veränderte GPL-Software **weitergibt**, muss dem Empfänger den Quellcode der Änderungen unter derselben Lizenz zugänglich machen. Das ist nicht verboten, sondern der Kern des Modells – es muss nur bewusst geschehen und nicht aus Versehen. |
    | **D** | **so nicht haltbar** | Open Source spart die **Lizenzgebühr**, nicht die Kosten. Betrieb, Einarbeitung, Schulung, Anpassungen und im Ernstfall bezahlter Support bleiben. Bei vielen Projekten gibt es zusätzlich eine kostenpflichtige Enterprise-Variante, deren Support genau das ist, wofür ein Betrieb sonst den Hersteller hat. |

    **2. Warum so?** – Die entscheidende Trennlinie im Open-Source-Recht ist nicht „frei gegen unfrei", sondern **Nutzung gegen Weitergabe**. Die Fälle A und C zeigen dieselbe Lizenz mit völlig verschiedenen Folgen, weil sich genau dieser eine Umstand unterscheidet. Wer das verstanden hat, beantwortet die meisten Praxisfragen richtig:

    | Was passiert | Was folgt daraus |
    |---|---|
    | Software wird nur selbst eingesetzt | Copyleft-Pflichten greifen in der Regel nicht |
    | Software wird verändert weitergegeben | Copyleft-Pflichten greifen |
    | Permissive Lizenz, egal wie eingesetzt | Urhebervermerk erhalten, sonst frei |

    Fall D ist der wichtigste für die Planung, weil er in Kostenvergleichen ständig auftaucht. „Kostenlos" bezieht sich auf den Preis der Lizenz. In einer TCO-Rechnung ist das eine Zeile von vielen – und oft nicht die größte.

    **3. Auch gut wäre ...** – anzumerken, dass es Lizenzen gibt, bei denen schon das **Bereitstellen über ein Netzwerk** als Weitergabe gilt. Wer eine so lizenzierte Software als Dienst für Dritte betreibt, kann die Offenlegungspflicht auslösen, obwohl er nie eine Datei herausgegeben hat. Für den reinen internen Einsatz ändert das nichts, für ein eigenes Produkt sehr wohl – deshalb gehört zu jeder eingebauten Komponente die Frage nach ihrer konkreten Lizenz.

    Ebenfalls stark ist der Hinweis, dass ein Betrieb wissen muss, **welche Open-Source-Komponenten überhaupt im Haus sind**. In Eigenentwicklungen stecken oft dutzende Bibliotheken mit verschiedenen Lizenzen – ohne eine Übersicht darüber ist Fall B nicht sauber erfüllbar, weil niemand weiß, welche Vermerke mitzuliefern wären.

    **4. Typischer Stolperstein** – Fall A und Fall C zu verwechseln und daraus zu schließen, GPL-Software dürfe im Unternehmen gar nicht eingesetzt werden. Das ist falsch und würde einen großen Teil der Serverlandschaft ausschließen. Der zweite Stolperstein ist Fall B: Die MIT-Lizenz ist so kurz und großzügig, dass ihre einzige Auflage gern übersehen wird – der Urhebervermerk ist keine Höflichkeit, sondern die Bedingung, unter der die Nutzung erlaubt ist.

---

### Aufgabe 4 – Unterlizenziert, überlizenziert oder falsch gezählt?

!!! info "Worum es geht"
    - Die beiden Schieflagen erkennen und ihre **sehr unterschiedlichen** Folgen benennen
    - Den dritten Fall sehen, den die Theorie-Tabelle nicht abbildet: eine Metrik, die nicht passt
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

Eine Lizenzinventur im Ingenieurbüro ergibt drei Befunde:

| Nr. | Befund |
|---|---|
| 1 | **Software A**: 60 Installationen im Netz, 45 gekaufte Lizenzen |
| 2 | **Software B**: 30 gekaufte Lizenzen, 12 Personen haben sie im letzten halben Jahr benutzt |
| 3 | **Software C**: 20 Named-User-Lizenzen. Installiert ist sie auf 20 Rechnern in der Konstruktion – dort arbeiten aber 35 Personen im Wechsel damit. |

1. **Benenne für jeden Befund die Schieflage** und ihre Folge.
2. **Wie fliegt jede der drei Schieflagen typischerweise auf?**
3. Ein Kollege schlägt vor, die 18 überzähligen Lizenzen von Software B für Software A einzusetzen. **Was sagst du dazu?**

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Nr. | Schieflage | Folge |
    |---|---|---|
    | 1 | **Unterlizenzierung** – 15 Installationen zu viel | Ein rechtliches Risiko. Bei einem Audit droht die Nachzahlung zu Listenpreisen, häufig mit Aufschlag; im Ernstfall kommen Schadensersatzforderungen dazu. Bis dahin merkt es niemand – die Software läuft ja. |
    | 2 | **Überlizenzierung** – 18 Lizenzen ohne Nutzung | Kein rechtliches Problem, aber totes Kapital: gebundenes Budget, das anderswo fehlt, plus laufende Wartungsgebühren auf Lizenzen, die niemand benutzt. |
    | 3 | **Falsche Metrik** – und damit faktisch unterlizenziert | Named User zählt **Personen**, nicht Geräte. 35 Personen brauchen 35 Named-User-Lizenzen, egal auf wie vielen Rechnern sie arbeiten. Die Zählweise passt nicht zum Nutzungsmuster: Hier wäre eine Gerätemetrik oder Concurrent User die richtige Wahl gewesen. |

    *Teil 2 – wie es auffliegt:*

    - Befund 1 fliegt beim **Hersteller-Audit** auf. Große Hersteller lassen sich in ihren Verträgen das Recht einräumen, die Lizenznutzung beim Kunden zu prüfen – der Prüfer gleicht Installationen gegen erworbene Lizenzen ab, jede Differenz wird zur Rechnung.
    - Befund 2 fliegt bei der **internen Kostenkontrolle** auf – oder nie. Niemand außerhalb des Hauses hat ein Interesse daran, dass ein Kunde zu viele Lizenzen hat.
    - Befund 3 fliegt ebenfalls beim **Audit** auf und ist der unangenehmste Fall, weil das Büro subjektiv alles richtig gemacht hat: Es hat für jede Installation eine Lizenz gekauft. Der Fehler steckt nicht in der Menge, sondern im Verständnis der Metrik.

    *Teil 3 – die Lizenzen verschieben:* Das geht **nicht**. Lizenzen sind produktbezogen: Eine Lizenz für Software B berechtigt zur Nutzung von Software B, nicht von Software A. Sie sind auch selten frei übertragbar – ob und unter welchen Bedingungen eine Weitergabe zulässig ist, steht im Vertrag. Was der Kollege eigentlich meint, ist eine sinnvolle Idee mit falschem Weg: Die 18 ungenutzten Lizenzen von Software B sollten zur nächsten Vertragsverlängerung **abbestellt** werden, damit die Wartungsgebühr entfällt – und das eingesparte Geld deckt die 15 fehlenden Lizenzen von Software A.

    **2. Warum so?** – Die beiden klassischen Schieflagen unterscheiden sich in ihrem Charakter, nicht in ihrer Größe:

    | | Charakter | Verlauf |
    |---|---|---|
    | **Unterlizenzierung** | rechtliches Risiko | fällt schlagartig an, von außen ausgelöst |
    | **Überlizenzierung** | wirtschaftliches Loch | läuft leise weiter, fällt nur intern auf |

    Deshalb ist Unterlizenzierung dringender – aber Überlizenzierung nicht harmlos. In vielen Betrieben bezahlen beide Schieflagen nebeneinander, weil niemand einen aktuellen Überblick hat.

    Befund 3 ist der lehrreichste, weil er zeigt, dass ein Lizenzinventar mehr können muss als zählen. Es muss zu jedem Produkt festhalten, **wonach** gezählt wird: Geräte, Personen, gleichzeitige Nutzer, Prozessorkerne. Ohne diese Angabe ist die Zahl der Lizenzen ohne Aussagekraft.

    **3. Auch gut wäre ...** – vorzuschlagen, den Lizenzbestand als Configuration Items in die **CMDB** aufzunehmen, mit Metrik, Stückzahl, Laufzeit und Nachweis. Lizenzen sind Bestandteile der Infrastruktur wie Server und Switches auch, nur eben aus Papier – und in der CMDB stehen sie neben genau den Systemen, auf denen sie eingesetzt werden. Ebenfalls stark ist der Hinweis, dass Befund 1 sofort eine **Sofortmaßnahme** verdient: 15 Installationen zurückbauen oder 15 Lizenzen nachkaufen – und zwar bevor jemand von außen fragt. Wer eine Unterlizenzierung selbst entdeckt und behebt, verhandelt aus einer völlig anderen Position als jemand, dem sie nachgewiesen wird.

    **4. Typischer Stolperstein** – Überlizenzierung als „auf der sicheren Seite" abzutun. Sie ist gebundenes Geld plus laufende Wartungsgebühren auf Nichts. Der zweite Stolperstein ist Befund 3: die Zahl der Installationen mit der Zahl der Lizenzen zu vergleichen und daraus „passt" abzuleiten, ohne die Metrik zu prüfen. Bei Named User ist die Zahl der Installationen schlicht die falsche Bezugsgröße.

---

### Aufgabe 5 – Nutzwertanalyse: rechnen und kippen lassen

!!! info "Worum es geht"
    - Eine **Nutzwertanalyse** korrekt rechnen
    - Verstehen, dass ihr Wert in der offengelegten Gewichtung liegt, nicht im Ergebnis
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

Das Ingenieurbüro vergleicht zwei Angebote: **Produkt A** als Kauflizenz, **Produkt B** als Abo. Punktskala 1 bis 10.

| Kriterium | Gewichtung | Produkt A (Kauf) | Produkt B (Abo) |
|---|---|---|---|
| Kosten über 5 Jahre | 30 % | 9 | 6 |
| Service & Support | 25 % | 5 | 9 |
| Funktionsumfang | 20 % | 7 | 8 |
| Datenstandort | 15 % | 9 | 4 |
| Unabhängigkeit vom Anbieter | 10 % | 8 | 3 |

1. **Rechne die gewichteten Summen aus.** Welches Produkt gewinnt?
2. Die Geschäftsführung sagt: „Support ist uns viel wichtiger als der Preis." **Setz die Gewichtung für Kosten auf 10 % und für Service & Support auf 45 %** – die übrigen bleiben. Rechne erneut.
3. **Was ist der eigentliche Wert der Methode** – und was ist ihre Schwäche?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – die ursprüngliche Gewichtung:*

    ```text
    Produkt A:  0,30 x 9  =  2,70
                0,25 x 5  =  1,25
                0,20 x 7  =  1,40
                0,15 x 9  =  1,35
                0,10 x 8  =  0,80
                            ------
                             7,50

    Produkt B:  0,30 x 6  =  1,80
                0,25 x 9  =  2,25
                0,20 x 8  =  1,60
                0,15 x 4  =  0,60
                0,10 x 3  =  0,30
                            ------
                             6,55
    ```

    **Produkt A gewinnt** mit 7,50 gegen 6,55.

    *Teil 2 – Kosten auf 10 %, Support auf 45 %* (Summe bleibt 100 %):

    ```text
    Produkt A:  0,10 x 9 + 0,45 x 5 + 0,20 x 7 + 0,15 x 9 + 0,10 x 8
             =  0,90    + 2,25     + 1,40     + 1,35     + 0,80     =  6,70

    Produkt B:  0,10 x 6 + 0,45 x 9 + 0,20 x 8 + 0,15 x 4 + 0,10 x 3
             =  0,60    + 4,05     + 1,60     + 0,60     + 0,30     =  7,15
    ```

    Das Ergebnis **kippt**: Jetzt gewinnt Produkt B mit 7,15 gegen 6,70. Dabei hat sich an keinem einzigen Angebot etwas geändert – nur an der Frage, was dem Büro wichtig ist.

    *Teil 3 – Wert und Schwäche der Methode:*

    Der **Wert** liegt nicht im Endergebnis, sondern darin, dass die Methode zwei Dinge sichtbar macht, die sonst unausgesprochen bleiben: die **Kriterien** und die **Gewichte**. Danach streitet ein Team nicht mehr über „Gefühl A gegen Gefühl B", sondern über die Frage „Ist uns Support wirklich viereinhalbmal so wichtig wie der Preis?" – und das ist eine Diskussion, die man führen und protokollieren kann. Teil 2 ist der Beweis: Die Gewichtung ist die eigentliche Entscheidung, die Rechnung führt sie nur aus.

    Die **Schwäche** ist die Kehrseite davon. Gewichte und Punkte sind subjektiv – wer das Ergebnis kennt, kann sie so lange nachjustieren, bis das gewünschte Produkt gewinnt. Eine Nutzwertanalyse liefert deshalb keine objektive Wahrheit – sie liefert eine **nachvollziehbare** Entscheidung. Der Schutz dagegen ist einfach: Kriterien und Gewichte werden festgelegt und dokumentiert, **bevor** die Angebote bewertet werden.

    **2. Warum so?** – Rechnerisch ist die Methode simpel: Punkte mal Gewicht, aufsummieren. Die zwei Regeln, an denen sie in Prüfungen scheitert, sind ebenso simpel: **Die Gewichte müssen zusammen 100 % ergeben** und **alle Alternativen werden auf derselben Skala bewertet**. Wer in Teil 2 nur die Kosten auf 10 % senkt und Support auf 45 % erhöht, ohne die Summe zu prüfen, rechnet mit 105 % und bekommt zwei nicht vergleichbare Ergebnisse.

    Inhaltlich zeigt der Vergleich der beiden Durchläufe genau das Muster aus der Theorie: Der Kauf punktet bei Kosten, Datenstandort und Unabhängigkeit, das Abo bei Support und Funktionsumfang. Welche Seite gewinnt, hängt allein daran, welche dieser Eigenschaften dem Büro etwas wert ist.

    **3. Auch gut wäre ...** – **Ausschlusskriterien** vor die Analyse zu stellen. Manche Anforderungen sind nicht gewichtbar, sondern zwingend: Wenn Mandanten- oder Projektdaten das Land nicht verlassen dürfen, hilft es nicht, dass Produkt B beim Support neun Punkte holt – es wäre schlicht raus. Solche K.-o.-Kriterien gehören vor die Punktevergabe, nicht in die Tabelle. Ebenfalls stark ist der Hinweis, eine **Sensitivitätsbetrachtung** anzuschließen: Wie stark muss man an einem Gewicht drehen, bis das Ergebnis kippt? Liegt die Grenze knapp daneben, ist die Entscheidung fragil und man sollte weitere Informationen beschaffen, statt sich auf 0,15 Punkte Vorsprung zu verlassen.

    **4. Typischer Stolperstein** – die Punkte in verschiedene Richtungen zu vergeben. Wenn hohe Punktzahl bei „Kosten" günstig heißt, muss sie bei allen Kriterien „gut" heißen – wer bei einem Kriterium plötzlich niedrig als besser wertet, dreht das Ergebnis unbemerkt um. Der zweite Stolperstein ist, das Ergebnis für objektiv zu halten. 7,50 gegen 6,55 sieht nach Messwert aus und ist eine gewichtete Meinung – nachvollziehbar, aber keine Naturkonstante.

---

### Aufgabe 6 – Was steht nicht im Angebot?

!!! info "Worum es geht"
    - Ein Lizenzangebot gegen die **Prüfpunkte** aus der Theorie abklopfen
    - Erkennen, welche Lücke die teuerste ist
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

Das Ingenieurbüro erhält ein SaaS-Angebot. Das ist der vollständige Text:

> „Nutzung der Software **PlanFlow** für bis zu 60 benannte Nutzer. Preis: 15 Euro je Nutzer und Monat. Mindestlaufzeit 24 Monate. Support per E-Mail. Die Daten werden in einem Rechenzentrum in der EU gespeichert."

1. **Geh die Prüfpunkte aus der Theorie durch** – Laufzeit, Metrik, regionale Gültigkeit, Weitergabe, Ausstieg und Datenexport, Audit-Klauseln – und sag zu jedem: beantwortet, halb beantwortet oder offen.
2. **Welche Lücke ist die gefährlichste?** Begründe.
3. **Formuliere drei Rückfragen**, die vor einer Unterschrift geklärt sein müssen.

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Prüfpunkt | Stand | Was fehlt |
    |---|---|---|
    | **Laufzeit** | halb beantwortet | 24 Monate Mindestlaufzeit stehen da. Offen: Verlängert sich der Vertrag automatisch und um wie lange? Welche Kündigungsfrist gilt? Darf der Anbieter den Preis anpassen und in welchem Rahmen? |
    | **Metrik** | halb beantwortet | „60 benannte Nutzer" ist klar. Offen: Was kostet der 61. Nutzer? Lassen sich Nutzer umbenennen, wenn jemand das Büro verlässt – oder ist der Name für die Laufzeit gebunden? Zählt ein Projektpartner von außen als Nutzer? |
    | **Regionale Gültigkeit** | halb beantwortet | „Rechenzentrum in der EU" ist eine Aussage über den Speicherort. Offen: In welchem Land genau? Werden Subunternehmer eingesetzt und wo sitzen die? Wo findet der Support statt, der auf die Daten sieht? |
    | **Weitergabe & Übertragbarkeit** | **offen** | Nicht erwähnt. Relevant bei Umfirmierung, Standortgründung oder Übernahme – darf der Vertrag mitgehen? |
    | **Ausstieg & Datenexport** | **offen** | Kein Wort. Weder Format noch Frist noch Mitwirkung des Anbieters. |
    | **Audit-Klauseln** | offen, hier aber nachrangig | Bei SaaS zählt der Anbieter die Nutzung ohnehin selbst – ein klassisches Audit im Haus des Kunden ist unwahrscheinlich. Wichtiger wäre die Gegenrichtung: Welche Nachweise über Sicherheit und Verfügbarkeit legt der Anbieter vor? |

    *Teil 2 – die gefährlichste Lücke:* **Ausstieg und Datenexport.** Alle anderen Punkte kosten im Zweifel Geld oder Ärger. Dieser eine kostet die Handlungsfähigkeit: Ohne geregelten Export liegen die Projektdaten des Büros beim Anbieter, ohne dass jemand weiß, in welchem Format und in welcher Frist sie herauszubekommen sind. Damit ist ein Anbieterwechsel praktisch unmöglich – die Abhängigkeit heißt **Vendor Lock-in**. Und sie wirkt sofort auf alles andere: Ein Anbieter, den man nicht verlassen kann, verhandelt bei der nächsten Preiserhöhung aus einer sehr komfortablen Position.

    *Teil 3 – drei Rückfragen* (drei genügen):

    1. „In welchem Format, in welcher Frist und mit welcher Mitwirkung Ihrerseits erhalten wir bei Vertragsende unseren vollständigen Datenbestand – inklusive Dateianhängen und Historie?"
    2. „Verlängert sich der Vertrag nach 24 Monaten automatisch, mit welcher Frist ist er kündbar und unter welchen Bedingungen dürfen Sie den Preis anpassen?"
    3. „Was gilt als Support-Reaktionszeit, zu welchen Zeiten ist der Support erreichbar und welche Verfügbarkeit sagen Sie für den Dienst zu – mit welchem Bezugszeitraum?"
    4. Ebenfalls richtig: „Können benannte Nutzer bei Personalwechsel übertragen werden und was kostet eine Erweiterung über 60 hinaus?"

    **2. Warum so?** – Ein Lizenzvertrag regelt drei Zeitpunkte: den **Anfang** (was bekomme ich, was kostet es), die **Laufzeit** (was passiert bei Änderungen) und das **Ende** (wie komme ich wieder heraus). Das vorliegende Angebot beantwortet nur den ersten – und genau das ist der Normalfall bei Angeboten, weil sie zum Verkaufen geschrieben sind, nicht zum Beenden.

    Deshalb liest man Lizenzangebote am besten rückwärts: **Zuerst die Ausstiegsklausel, dann die Laufzeit, zuletzt den Preis.** Der Preis ist die Zahl, über die am leichtesten verhandelt wird. Die Ausstiegsklausel ist die, die am schwersten nachträglich hineinkommt – nach der Unterschrift gar nicht mehr.

    Der Punkt „Support per E-Mail" verdient noch eine eigene Bemerkung: Er ist keine Zusage, sondern die Beschreibung eines Kanals. Ohne Servicezeiten und Reaktionszeiten bedeutet er im Streitfall gar nichts – Service und Support gehören mit Zahlen in den Vertrag, nicht mit Adjektiven.

    **3. Auch gut wäre ...** – zu ergänzen, dass bei einem SaaS-Dienst mit Projekt- und Kundendaten weitere Dokumente dazugehören, die im Angebot ebenfalls fehlen: eine Vereinbarung zur Auftragsverarbeitung, Angaben zu eingesetzten Subunternehmern und eine Aussage darüber, wie der Anbieter selbst sichert und wie lange er Wiederherstellungen anbietet. Ebenfalls stark ist der Hinweis, dass 24 Monate Mindestlaufzeit bei einem noch nicht erprobten Produkt lang sind – eine kürzere Erstlaufzeit oder eine Testphase mit Ausstiegsmöglichkeit wäre die naheliegende Gegenforderung.

    **4. Typischer Stolperstein** – das Angebot als „schlank und übersichtlich" positiv zu bewerten. Kürze in einem Lizenzangebot bedeutet fast immer, dass die offenen Punkte später von den Allgemeinen Geschäftsbedingungen des Anbieters beantwortet werden – also in seinem Sinne. Der zweite Stolperstein ist, sich auf den Preis zu konzentrieren: 60 × 15 × 12 = 10.800 Euro im Jahr sind schnell verglichen und sagen nichts darüber, was der Vertrag im dritten Jahr kostet oder was der Ausstieg kostet.

---

### Aufgabe 7 – Wenn sich die Lizenzbedingungen ändern

!!! info "Worum es geht"
    - Mit **Freemium**-Modellen und nachträglichen Änderungen umgehen
    - Lizenzen als Daueraufgabe verstehen, nicht als einmalige Beschaffung
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

Das Ingenieurbüro (60 Beschäftigte) nutzt seit drei Jahren ein Entwicklungswerkzeug in der kostenlosen Community-Ausgabe – es steht auf 18 Rechnern. Der Hersteller ändert seine Bedingungen: Ab einer Unternehmensgröße von 50 Beschäftigten ist ein kostenpflichtiges Abo verpflichtend, 9 Euro je Nutzer und Monat. Übergangsfrist: 12 Monate.

1. **Was bedeutet das konkret** – ab wann, für wen, in welcher Höhe?
2. **Welche drei Optionen hat das Büro?** Nenne zu jeder einen Vorteil und einen Nachteil.
3. **Welche Lehre folgt daraus** für den Umgang mit Lizenzen im Betrieb?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – konkret:* Mit 60 Beschäftigten liegt das Büro über der Schwelle. Nach Ablauf der 12 Monate ist die kostenlose Nutzung im Betrieb nicht mehr zulässig – die weitere Nutzung ohne Abo wäre Unterlizenzierung. Betroffen sind die Personen, die das Werkzeug tatsächlich nutzen; bei 18 Arbeitsplätzen und nutzerbezogener Abrechnung:

    ```text
    18 Nutzer x 9 EUR x 12 Monate  =  1.944 EUR je Jahr
    ```

    Wichtig ist die Reihenfolge: **Zuerst zählen, dann rechnen.** Ob es wirklich 18 Lizenzen sind, hängt daran, ob alle 18 Rechner regelmäßig genutzt werden und wie der Hersteller zählt – Person oder Gerät.

    *Teil 2 – drei Optionen:*

    | Option | Vorteil | Nachteil |
    |---|---|---|
    | **Abo abschließen** | Sofort rechtssicher, keine Umstellung, das Team arbeitet weiter wie bisher. | Neue laufende Kosten von rund 1.944 Euro im Jahr, die im Budget bisher nicht vorkamen – und die der Hersteller künftig anheben kann. |
    | **Auf eine Alternative wechseln** | Keine Lizenzkosten, wenn es eine wirklich freie Alternative gibt. Löst die Abhängigkeit vom Hersteller. | Umstellungsaufwand, Einarbeitung, Reibungsverluste – gut möglich, dass die Arbeitszeit für den Wechsel mehr kostet als das Abo für zwei Jahre. |
    | **Prüfen, ob es eine tatsächlich freie Variante desselben Herstellers gibt** | Manchmal betrifft die Änderung nur ein bestimmtes Produkt, während die zugrundeliegenden Werkzeuge frei bleiben. Bei Docker etwa ist **Docker Desktop** ab einer Unternehmensgröße abopflichtig, die reine Container-Laufzeit unter Linux ist es nicht. | Setzt voraus, dass die Arbeitsweise sich anpassen lässt – und die Prüfung selbst kostet Zeit, bevor klar ist, ob sie etwas bringt. |

    *Teil 3 – die Lehre:* **Lizenzbedingungen sind nicht statisch.** Was heute gratis ist, kann morgen abopflichtig sein – und die Änderung erreicht den Betrieb ohne Vorwarnung. Daraus folgen drei praktische Konsequenzen:

    - Lizenzen gehören **auf Wiedervorlage**, nicht einmalig in einen Ordner. Einmal im Jahr den Bestand gegen die aktuellen Bedingungen prüfen.
    - Der Lizenzbestand muss **vollständig** sein – auch kostenlose Werkzeuge gehören hinein. Genau die fehlen in den meisten Inventaren, weil sie nie über den Einkauf gelaufen sind.
    - Für Werkzeuge, die kostenlos im Betrieb laufen, gehört ein **Budgetrisiko** in die Planung: Was würde es kosten, wenn das morgen kostenpflichtig würde?

    **2. Warum so?** – Freemium funktioniert für den Hersteller genau deshalb, weil das Werkzeug erst kostenlos in die Betriebe hineinwächst und dann schwer zu ersetzen ist. Das ist kein Vorwurf – es ist ein Geschäftsmodell, das man kennen sollte, bevor man sich darauf einlässt. Die Übergangsfrist von 12 Monaten ist dabei die eigentliche Ressource: Sie reicht für eine ordentliche Prüfung und einen geplanten Wechsel. Wer sie verstreichen lässt, hat am Ende keine Wahl mehr, sondern nur noch eine Rechnung.

    Und ein Punkt, der leicht untergeht: Die Schwelle bezieht sich auf die **Unternehmensgröße**, nicht auf die Zahl der Nutzer. Ein Büro mit 60 Beschäftigten und zwei Nutzern des Werkzeugs ist genauso betroffen wie eines mit 60 Nutzern. Bedingungen so zu lesen, wie sie dastehen, gehört zur Aufgabe.

    **3. Auch gut wäre ...** – anzumerken, dass diese Änderung eine gute Gelegenheit ist, überhaupt einmal zu prüfen, **wer das Werkzeug wirklich braucht**. Wenn von 18 Installationen nur 11 regelmäßig genutzt werden, kostet das Abo statt 1.944 nur 1.188 Euro im Jahr. Eine Lizenzänderung ist immer auch ein Anlass zur Bestandsbereinigung. Ebenfalls stark ist der Hinweis, dass die Entscheidung dokumentiert gehört: Wer sich bewusst gegen den Wechsel entscheidet, sollte das mit Begründung festhalten – sonst stellt in zwei Jahren jemand dieselbe Frage von vorn.

    **4. Typischer Stolperstein** – die Übergangsfrist als Aufschub zu behandeln und nichts zu tun. Zwölf Monate klingen nach viel und sind bei einem Werkzeugwechsel samt Einarbeitung knapp. Der zweite Stolperstein ist die Annahme, „wir haben es ja schon vorher benutzt, für uns gilt das nicht". Bestandsschutz gibt es bei solchen Änderungen in der Regel nicht – genau dafür ist die Übergangsfrist da.

---

### Aufgabe 8 – Wo landen die Lizenzkosten in der Cloud?

!!! info "Worum es geht"
    - Erkennen, wann eine Lizenz **eingepreist** ist und wann sie ein eigener Posten bleibt
    - Die Falle sehen, wenn eigene Kauflizenzen auf fremde Infrastruktur wandern
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

**Ordne die fünf Situationen zu:** Ist die Lizenz im Preis enthalten oder ein eigener Kostenposten? Und ist sie CapEx oder OpEx?

| Nr. | Situation |
|---|---|
| a | Eine VM beim Cloud-Anbieter, gebucht mit einem fertigen Windows-Server-Abbild, Abrechnung pro Stunde |
| b | Ein eigener Server im Haus mit gekaufter Betriebssystem-Lizenz |
| c | Bürosoftware als SaaS, 12 Euro je Nutzer und Monat |
| d | Eine gekaufte Datenbank-Lizenz des Büros, betrieben auf einer gemieteten Cloud-VM |
| e | Eine Open-Source-Datenbank auf einer gemieteten Cloud-VM |

**Zusatzfrage:** In Situation d steckt eine Falle, die in echten Projekten teuer wird. Welche?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Nr. | Lizenz | Kostenart |
    |---|---|---|
    | a | **eingepreist** – der Stundenpreis enthält die Betriebssystem-Lizenz | **OpEx**, nutzungsabhängig |
    | b | **eigener Posten** – einmalig gekauft | **CapEx** (die Wartung darauf ist OpEx) |
    | c | **eingepreist** – Software, Betrieb und Lizenz sind derselbe Preis | **OpEx** |
    | d | **eigener Posten** – die Lizenz gehört dem Büro, die Maschine dem Anbieter | Lizenz **CapEx**, VM-Miete **OpEx** – die Rechnung ist geteilt |
    | e | **keine Lizenzgebühr** – aber Betriebskosten für die VM und Arbeitszeit | **OpEx** |

    *Zusatzfrage – die Falle in Situation d:* **Nicht jede Kauflizenz darf auf fremder Infrastruktur betrieben werden.** Viele Hersteller binden ihre Lizenzen an Bedingungen, die auf eigene Hardware zugeschnitten sind – etwa an eine feste Zahl von **Prozessorkernen**, an einen bestimmten **physischen Host** oder an die Zusage, dass die Hardware nicht mit anderen Kunden geteilt wird. In einer Cloud-Umgebung sind diese Voraussetzungen oft nicht erfüllt oder nicht nachweisbar.

    Die praktische Folge: Wer eine vorhandene Lizenz einfach mit in die Cloud nimmt, kann dort unterlizenziert sein, ohne es zu merken – die Software läuft ja. Auffallen kann es beim nächsten Audit – und dann wird zu Listenpreisen nachberechnet. **Vor** jeder Verlagerung gehört deshalb geklärt: Erlaubt der Lizenzvertrag den Betrieb auf gemieteter, geteilter Infrastruktur – und wenn ja, nach welcher Zählweise?

    **2. Warum so?** – Die Cloud verschiebt Lizenzkosten aus der Investitionsplanung in die laufende, nutzungsbasierte Abrechnung. Der Anbieter kauft die Lizenz im Großen ein und legt sie auf den Stundenpreis um – aus einer einmaligen Ausgabe wird ein Bestandteil der Monatsrechnung. Das hat zwei Seiten:

    - **Vorteil:** keine Vorabinvestition, keine Über- oder Unterlizenzierung, keine Verwaltung. Wer abschaltet, zahlt nicht mehr.
    - **Nachteil:** Die Lizenz ist nicht mehr sichtbar. Sie steckt in einem Stundenpreis und wandert damit aus dem Blickfeld der Lizenzverwaltung – bis jemand vergleicht und feststellt, dass dieselbe Software im eigenen Haus günstiger wäre, weil die Kauflizenz längst bezahlt ist.

    Situation e ist der Gegenpol und der Grund, warum Open Source in Cloud-Umgebungen so verbreitet ist: Es gibt keine Lizenz, die pro Stunde mitgezählt werden müsste. Kostenlos ist damit trotzdem nichts – die VM, der Speicher und die Betreuung kosten unverändert.

    **3. Auch gut wäre ...** – anzumerken, dass es zwischen a und d oft eine dritte Möglichkeit gibt: Manche Hersteller erlauben ausdrücklich, vorhandene Lizenzen zum Anbieter mitzunehmen, teils mit eigenem Programm dafür. Ob das günstiger ist als die eingepreiste Variante, ist eine Rechenaufgabe – bei Dauerbetrieb lohnt sich die eigene Lizenz häufiger als bei zeitweiser Nutzung, weil der Aufschlag im Stundenpreis rund um die Uhr mitläuft. Ebenfalls stark ist der Hinweis, dass auch eingepreiste Lizenzen ins Inventar gehören: Nur weil sie keine eigene Rechnung haben, verschwinden sie nicht aus dem Bestand – und beim Kostenvergleich braucht man sie.

    **4. Typischer Stolperstein** – Situation e als „kostenlos" zu verbuchen. Die Lizenz ist kostenlos, der Betrieb nicht: VM, Speicher, Sicherung, Updates und Arbeitszeit fallen genauso an wie bei jeder anderen Datenbank – bei einer gemanagten Datenbank des Anbieters wären Teile davon im Preis enthalten. Der zweite Stolperstein ist Situation d: anzunehmen, eine bezahlte Lizenz sei „unsere" und dürfe deshalb überall laufen. Was eine Lizenz erlaubt, steht im Vertrag – und der wurde für eine Welt geschrieben, in der Server im eigenen Keller standen.

---

### Aufgabe 9 – Der Lizenz-Turm: wo entstehen die Pflichten?

!!! info "Worum es geht"
    - Erkennen, dass Lizenzpflichten in jeder Schicht eines Systems entstehen – nicht nur im Einkauf
    - Lizenzrisiko und Sicherheitsrisiko in derselben Schicht auseinanderhalten
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

Das Ingenieurbüro betreibt eine selbst entwickelte Projektverwaltung. Der Stapel darunter sieht so aus:

| Ebene | Was dort läuft |
|---|---|
| **5 Eigener Code** | die Projektverwaltung, geschrieben von zwei Beschäftigten des Büros |
| **4 Bibliotheken** | 340 Pakete aus einem öffentlichen Register, davon 12 direkt eingebunden |
| **3 Framework** | ein verbreitetes Web-Framework, Open Source |
| **2 Basis-Image** | ein Container-Image mit einer Linux-Distribution, zuletzt vor 14 Monaten aktualisiert |
| **1 Cloud-Plattform** | eine gemietete VM bei einem Anbieter, dazu ein verwalteter Datenbankdienst |

1. **Nenne für jede der fünf Ebenen ein Lizenzrisiko und ein Sicherheitsrisiko.**
2. **Wie viele Lizenzen sind hier im Spiel** – und wer im Büro weiß das?
3. **Was schlägst du vor**, damit dieser Stapel beherrschbar wird? Nenne drei Maßnahmen.
4. Die Geschäftsführung fragt: „Wir haben doch nichts gekauft – wo soll da ein Lizenzproblem sein?" **Antworte in drei Sätzen.**

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Ebene | Lizenzrisiko | Sicherheitsrisiko |
    |---|---|---|
    | **5 Eigener Code** | Unter welcher Lizenz steht er selbst – und verträgt sie sich mit allem darunter? Wer Copyleft-Code einbindet und das Ergebnis weitergibt, erbt dessen Pflichten. | Zugangsdaten im Klartext, fest verdrahtete Geheimnisse in der Konfiguration |
    | **4 Bibliotheken** | 340 Pakete heißt bis zu 340 verschiedene Lizenzen, darunter mit Sicherheit welche, die niemand gelesen hat. Einzelne können ihre Lizenz ändern. | Angriffe über die Lieferkette: ein übernommenes Paket bringt Schadcode direkt in den Build |
    | **3 Framework** | Lizenzwechsel des Herstellers (siehe Terraform, Grafana, Redis) – aus permissiv wird Copyleft oder Source Available | bekannte Schwachstellen im Framework, die ohne Update offen bleiben |
    | **2 Basis-Image** | Enthält das Image proprietäre Bestandteile? Bei einem Server-Betriebssystem: ist es für diesen Betrieb korrekt lizenziert? | 14 Monate ohne Aktualisierung heißt: alle seither veröffentlichten Schwachstellen sind offen |
    | **1 Cloud-Plattform** | Sind die Lizenzen im Stundenpreis enthalten? Darf eine eigene Lizenz auf gemieteter, geteilter Hardware laufen? | Datenstandort, Zugriffsrechte, Abhängigkeit von einem einzigen Anbieter |

    *Teil 2 – wie viele Lizenzen:* Ehrlich beantwortet: **niemand weiß es.** Zwölf Pakete wurden bewusst eingebunden, 328 kamen als Abhängigkeiten von Abhängigkeiten mit. Dazu die Lizenz des Frameworks, die des Basis-Images samt aller darin enthaltenen Programme, dazu die Bedingungen des Cloud-Anbieters. Realistisch sind es mehrere hundert Lizenztexte – und der Einkauf hat keinen einzigen davon gesehen, weil nie jemand etwas gekauft hat.

    *Teil 3 – drei Maßnahmen:*

    - **Lizenz-Scanner in den Build einbauen.** Ein Werkzeug, das bei jedem Durchlauf die Abhängigkeiten ausliest und die enthaltenen Lizenzen meldet. Ergebnis ist eine Liste statt eines Gefühls.
    - **SBOM erzeugen und aufbewahren.** Die maschinenlesbare Stückliste aller Komponenten beantwortet zwei Fragen auf einmal: welche Lizenzen drinstecken – und ob man von der nächsten gemeldeten Schwachstelle betroffen ist.
    - **Regeln festlegen, bevor gebaut wird.** Welche Lizenzfamilien sind erlaubt, welche nur nach Rücksprache, welche gar nicht? Diese Liste gehört ins Projekt, nicht in den Kopf einer einzelnen Person. Ergänzend: ein fester Update-Rhythmus für das Basis-Image, denn 14 Monate sind keine Wartung.

    *Teil 4 – die Antwort an die Geschäftsführung:* „Wir haben nichts gekauft, aber wir nutzen mehrere hundert fremde Softwarebestandteile – und jeder davon kommt mit Bedingungen. Solange wir die Anwendung nur selbst betreiben, sind die meisten davon leicht einzuhalten. Sobald wir sie an einen Kunden weitergeben oder als Dienst anbieten, greifen Pflichten, die wir heute nicht kennen – und die wir dann nachweisen müssten."

    **2. Warum so?** – Der entscheidende Perspektivwechsel dieser Aufgabe: Lizenzpflichten entstehen heute überwiegend **beim Installieren, nicht beim Einkaufen**. Der klassische Lizenzprozess ist auf Beschaffung ausgelegt – Angebot, Bestellung, Vertrag, Ordner. Ein Paket aus einem öffentlichen Register durchläuft nichts davon. Es kommt mit einem einzigen Befehl ins Projekt, ohne Vertrag, ohne Unterschrift, ohne dass jemand außerhalb des Entwicklungsteams davon erfährt.

    Deshalb ist die richtige Antwort hier auch keine bessere Sorgfalt, sondern ein **Werkzeug**. Bei 340 Paketen ist Lesen keine Option; Scannen ist eine.

    **3. Auch gut wäre ...** – zu erwähnen, dass die zwölf direkt eingebundenen Pakete eine eigene Betrachtung verdienen: Wie aktiv ist das Projekt dahinter, wie viele Menschen pflegen es, was passiert, wenn die Entwicklung eingestellt wird? Eine Bibliothek, an der eine einzige Person arbeitet, ist ein Single Point of Failure in der eigenen Anwendung – dieselbe Logik wie bei Hardware, nur unsichtbar. Ebenfalls stark ist der Hinweis, dass die Ebenen 1 und 2 sich überschneiden: In einem verwalteten Datenbankdienst steckt ein Betriebssystem samt Lizenz, um das sich der Anbieter kümmert – das ist ein Vorteil, den man in einem Kostenvergleich gegen den Selbstbetrieb mitrechnen sollte.

    **4. Typischer Stolperstein** – Lizenz- und Sicherheitsrisiko in einen Topf zu werfen. Beide sitzen in derselben Schicht und werden von denselben Werkzeugen gefunden, sind aber verschiedene Probleme mit verschiedenen Folgen: Eine Schwachstelle bedroht den Betrieb, ein Lizenzverstoß bedroht das Unternehmen rechtlich. Der zweite Stolperstein ist Ebene 5: anzunehmen, eigener Code sei lizenzfrei. Er ist es nicht – er hat eine Lizenz, spätestens wenn er das Haus verlässt – und diese Lizenz muss zu allem passen, was darunter liegt.

---

### Aufgabe 10 – Vom Wildwuchs zum Prozess

!!! info "Worum es geht"
    - Aus einzelnen Befunden einen **wiederholbaren Ablauf** machen statt einer einmaligen Aufräumaktion
    - Die Auslöser benennen, an denen Lizenzarbeit tatsächlich hängt
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

Ein Softwarehaus ist in drei Jahren von **20 auf 50 Beschäftigte** gewachsen. Lizenzen wurden bisher „nach Bedarf" gekauft: Wer etwas brauchte, schrieb der Buchhaltung. Eine Bestandsaufnahme ergibt:

- Für ein Fernwartungswerkzeug bestehen **22 Lizenzen**, benutzt haben es im letzten Quartal **9 Personen**. Sieben der 22 gehören Beschäftigten, die das Haus verlassen haben.
- Ein Grafikprogramm wurde vor zwei Jahren für die ganze Firma beschafft, seither hat sich das Team für ein anderes entschieden. Der Vertrag läuft weiter.
- Auf drei virtuellen Maschinen läuft eine Datenbank, die **nach Prozessorkernen** lizenziert wird. Eine der VMs hat vor vier Monaten mehr Kerne bekommen, weil sie zu langsam war.
- Niemand kann sagen, welche Open-Source-Bibliotheken in den eigenen Produkten stecken.

1. **Ordne die vier Befunde** den Kategorien Unterlizenzierung, Überlizenzierung oder „unbekannt" zu.
2. **Entwirf einen Lizenzverwaltungsprozess** in fünf Schritten.
3. **Nenne vier Auslöser**, bei denen dieser Prozess anspringen muss – und begründe, warum ein Jahrestermin allein nicht reicht.
4. **Welche eine Maßnahme** bringt hier am meisten pro investierter Stunde?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Befund | Einordnung | Warum |
    |---|---|---|
    | 22 Fernwartungs-Lizenzen, 9 Nutzer | **Überlizenzierung**, darunter 7 Zombie-Lizenzen | bezahlt für Konten, die keiner Person mehr zugeordnet sind |
    | Grafikprogramm ohne Nutzer | **Überlizenzierung** in Reinform | ein voll bezahlter Vertrag ohne einen einzigen Nutzer |
    | VM mit mehr Kernen | **Unterlizenzierung** – vermutlich seit vier Monaten | bei kernbasierter Metrik erhöht mehr Hardware den Lizenzbedarf, ohne dass jemand etwas bestellt |
    | Unbekannte Open-Source-Anteile | **unbekannt** – und damit der gefährlichste Befund | was man nicht kennt, kann man weder einhalten noch beziffern |

    *Teil 2 – der Prozess:*

    1. **Erfassen** – Welche Software läuft, in welcher Version, auf welchen Systemen? Auch die kostenlosen Werkzeuge, auch die Open-Source-Bibliotheken in den eigenen Produkten.
    2. **Zuordnen** – Zu jedem Eintrag: Metrik, Stückzahl, Vertrag, Laufzeit, Nachweis. Ohne die Metrik ist die Stückzahl wertlos.
    3. **Überwachen** – Tatsächliche Nutzung gegen den Bestand halten, in festen Abständen und automatisiert, wo es geht.
    4. **Bereinigen** – Fehlendes nachkaufen, Ungenutztes zur nächsten Verlängerung abbestellen. Beides zusammen, sonst wird aus dem Aufräumen ein Sparprogramm ohne Rechtssicherheit.
    5. **Wiedervorlage** – Bedingungen erneut prüfen, weil sie sich ändern. Danach wieder bei Schritt 1.

    Der Ort für das Ergebnis ist die CMDB: Lizenzen stehen dort neben genau den Systemen, auf denen sie eingesetzt werden.

    *Teil 3 – vier Auslöser:*

    - **Offboarding** – wer geht, gibt Lizenzen zurück. Genau das ist in Befund 1 sieben Mal nicht passiert.
    - **Onboarding** – wer kommt, bekommt Lizenzen zugeteilt statt selbst zu bestellen.
    - **Jede Änderung an einer Maschine** – neue VM, mehr Kerne, Umzug in die Cloud. Befund 3 wäre am Tag der Änderung aufgefallen statt vier Monate später.
    - **Jede Vertragsverlängerung** – der einzige Moment, in dem sich Überlizenzierung ohne Verlust abbauen lässt.

    Warum ein Jahrestermin nicht reicht: Er findet die Probleme, ändert aber nichts an ihrer Entstehung. Zwischen zwei Terminen laufen zwölf Monate Personalwechsel, Hardwareänderungen und Vertragsfristen weiter. Ein Jahrestermin ist eine **Kontrolle**, kein Prozess – beides braucht es, aber die Kontrolle allein produziert jedes Jahr dieselbe Liste.

    *Teil 4 – die wirksamste Maßnahme:* **Lizenzrückgabe fest ins Offboarding einbauen.** Sie kostet einen zusätzlichen Punkt auf einer ohnehin vorhandenen Checkliste und beseitigt die häufigste Ursache für Überlizenzierung dauerhaft. Alles andere in dieser Aufgabe – Inventar aufbauen, Scanner einführen, Verträge durchsehen – ist mehr Aufwand für weniger unmittelbaren Effekt.

    **2. Warum so?** – Der Kern dieser Aufgabe ist der Unterschied zwischen einer **Aufräumaktion** und einem **Prozess**. Ein Betrieb, der von 20 auf 50 Beschäftigte wächst, hat kein Lizenzproblem, weil jemand geschlampt hätte – er hat es, weil ein Verfahren, das bei 20 Personen im Kopf funktioniert, bei 50 nicht mehr funktioniert. Man kann so eine Lage einmal bereinigen; ohne Auslöser ist sie in achtzehn Monaten wieder da.

    Bemerkenswert ist außerdem die Kostenrichtung: Die Befunde 1 und 2 kosten Geld, Befund 3 kostet im Ernstfall eine Nachzahlung, Befund 4 kostet nichts – bis er etwas kostet. Deshalb bleibt Befund 4 in der Praxis am längsten liegen, obwohl er die größte offene Flanke ist.

    **3. Auch gut wäre ...** – vorzuschlagen, die Nutzung vor dem Abbestellen zu **messen** statt zu schätzen. Neun Nutzer im letzten Quartal heißt nicht automatisch neun Lizenzen: Vielleicht braucht das Werkzeug jemand nur im Jahresabschluss. Wer blind auf den gemessenen Wert kürzt, produziert die nächste Unterlizenzierung. Ebenfalls stark ist der Hinweis, den Einkauf zu bündeln: Solange jede Person selbst bei der Buchhaltung bestellt, entsteht kein Überblick, egal wie gut der Prozess dahinter ist.

    **4. Typischer Stolperstein** – nur zu sparen. Wer die 13 überzähligen Fernwartungs-Lizenzen abbestellt und das Grafikprogramm kündigt, hat eine schöne Zahl für die Geschäftsführung und die riskanteste Baustelle unangetastet gelassen. Der zweite Stolperstein ist Befund 3: die Kernänderung als Hardware-Thema zu behandeln. Sie ist eine Lizenzänderung, die zufällig in einem Hardware-Ticket steht.

---

### Aufgabe 11 – Recherche: ein Beispiel für jeden Lizenztyp

!!! info "Worum es geht"
    - Lizenztypen an echter, benannter Software wiedererkennen statt nur an Definitionen
    - Selbst herausfinden, wo die Lizenz eines Produkts überhaupt nachzulesen ist
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

Diese Aufgabe ist eine **Recherche** – am besten zu zweit, mit etwa 30 Minuten Zeit.

Sucht für **jeden** der folgenden Lizenztypen mindestens ein Produkt, das ihr benennen könnt. Nehmt möglichst Software, die ihr selbst nutzt oder aus dem Betrieb kennt – und **nicht** die Beispiele aus der Theorie-Seite – die Übersicht dort ist zum Vergleichen da, nicht zum Abschreiben.

| Lizenztyp | Produkt | Wo habt ihr das nachgelesen? |
|---|---|---|
| Kauflizenz, pro Gerät | | |
| Abo pro Named User | | |
| Concurrent / parallele Sitzungen | | |
| pro Prozessorkern | | |
| Freemium bzw. Open Core | | |
| SaaS mit eingepreister Lizenz | | |
| verbrauchsbasiert oder Credits | | |
| Open Source, permissiv | | |
| Open Source, Copyleft | | |
| Source Available (kein Open Source) | | |

1. **Füllt die Tabelle aus.** Zu jeder Zeile gehört die Quelle: die Lizenzseite des Herstellers, die Lizenzdatei im Quellcode-Register oder die Preisseite.
2. **Bei welchen Zeilen habt ihr am längsten gesucht?** Was sagt euch das?
3. **Sucht ein Produkt, das in mehrere Zeilen passt.** Wie kann das sein?
4. **Sucht ein Produkt, das seine Lizenz in den letzten Jahren geändert hat.** Was war vorher, was ist jetzt – und wen hat das getroffen?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort** – „Richtig" ist jede Zeile, die belegt ist. Diese Beispiele sind belastbar, falls euch selbst nichts einfällt:

    | Lizenztyp | Beispiel | Wo es steht |
    |---|---|---|
    | Kauflizenz, pro Gerät | Windows 11 Pro als OEM-Version | Lizenzbedingungen beim Gerätekauf |
    | Abo pro Named User | Microsoft 365, Adobe Creative Cloud, Jira | Preisseite: „je Nutzer und Monat" |
    | Concurrent / parallele Sitzungen | TeamViewer, viele CAD-Programme mit Floating License | Produktbeschreibung: „Kanäle" bzw. „gleichzeitige Sitzungen" |
    | pro Prozessorkern | Microsoft SQL Server, Oracle Database, VMware vSphere | Lizenzleitfaden des Herstellers |
    | Freemium / Open Core | Docker Desktop, GitLab, Proxmox VE | Vergleichstabelle Community gegen Enterprise |
    | SaaS mit eingepreister Lizenz | Google Workspace, Salesforce | Preisseite: ein Preis für Software und Betrieb |
    | verbrauchsbasiert / Credits | Cloud-VMs, KI-Schnittstellen mit Token-Abrechnung | Preisrechner des Anbieters |
    | Open Source, permissiv | React (MIT), Kubernetes (Apache 2.0), nginx (BSD) | Datei `LICENSE` im Quellcode-Register |
    | Open Source, Copyleft | Linux-Kernel (GPLv2), WordPress (GPLv2), Nextcloud (AGPLv3) | Datei `LICENSE` bzw. `COPYING` |
    | Source Available | Terraform (BUSL), MongoDB (SSPL), Redis | Lizenzdatei plus FAQ des Herstellers |

    *Teil 2 – wo die Suche hakt:* Erfahrungsgemäß dauern drei Zeilen am längsten:

    - **pro Prozessorkern**, weil die Metrik selten auf der Produktseite steht, sondern im Lizenzleitfaden – einem eigenen Dokument, das man erst finden muss.
    - **Source Available**, weil solche Produkte sich in ihrer Außendarstellung häufig weiter „open" nennen. Der Unterschied steht in der Lizenzdatei, nicht im Marketing.
    - **SaaS**, weil dort schlicht **keine** Lizenz sichtbar ist. Sie steckt im Preis – genau das ist die Erkenntnis.

    Was das sagt: **Je weiter die Lizenz vom Kaufvorgang wegrückt, desto schwerer ist sie zu finden.** Bei einer Kauflizenz liegt sie der Rechnung bei. Bei einer Bibliothek steht sie in einer Datei, die niemand öffnet. Bei SaaS gibt es sie als eigenes Dokument gar nicht mehr.

    *Teil 3 – ein Produkt, mehrere Zeilen:* Das ist der Normalfall, nicht die Ausnahme. Drei Muster:

    - **Dasselbe Produkt in verschiedenen Ausgaben.** Grafana gibt es als AGPL-Version zum Selbstbetrieb, als kostenpflichtige Enterprise-Ausgabe und als fertigen Cloud-Dienst – drei Zeilen, ein Name.
    - **Quelltext und ausgeliefertes Paket getrennt.** Bei Visual Studio Code steht der Quellcode unter MIT, das Installationspaket von Microsoft unter einer eigenen Lizenz. Die Frage „welche Lizenz?" braucht die Rückfrage „welche Datei?".
    - **Mehrere Metriken parallel.** Microsoft SQL Server ist wahlweise pro Kern oder über Server plus Zugriffslizenzen lizenzierbar – welche günstiger ist, hängt an der Zahl der Zugreifenden.

    *Teil 4 – ein Lizenzwechsel:* Beispiele mit Wirkung, alle gut belegt:

    | Produkt | Vorher | Nachher | Wen es getroffen hat |
    |---|---|---|---|
    | Terraform | Open Source | Business Source License (2023) | Anbieter, die darauf ein eigenes Produkt gebaut hatten – die Gemeinschaft hat mit OpenTofu abgespalten |
    | Grafana | Apache 2.0 | AGPLv3 (2021) | alle, die es in eigene Angebote eingebaut hatten |
    | Redis | Open Source | Source Available (2024) | Cloud-Anbieter, die Redis als Dienst verkauften – Abspaltung als Valkey |
    | VMware | Kauflizenz pro CPU | Abo pro Kern (nach der Broadcom-Übernahme) | praktisch jeden Betrieb mit eigener Virtualisierung |
    | Docker Desktop | für alle kostenlos | ab einer Unternehmensgröße abopflichtig | Betriebe, die es längst im Einsatz hatten |

    **2. Warum so?** – Der Sinn dieser Aufgabe liegt nicht in der ausgefüllten Tabelle, sondern in der **Suche**. Wer einmal versucht hat, die Lizenzmetrik eines Datenbankprodukts zu finden, vergisst nie wieder, dass diese Information existiert – und stellt sie beim nächsten Angebot von sich aus.

    Der zweite Ertrag ist die Erkenntnis aus Teil 3: Ein Produkt hat nicht „eine Lizenz". Es hat eine Lizenz **je Ausgabe, je Vertriebsweg und je Datei**. Wer das verinnerlicht hat, formuliert die Frage im Betrieb anders: nicht mehr „Ist das Open Source?", sondern „Welche Ausgabe setzen wir ein, unter welcher Lizenz steht genau die – und was dürfen wir damit?"

    **3. Auch gut wäre ...** – bei jedem gefundenen Produkt zusätzlich zu notieren, **wann die Lizenz zuletzt geändert wurde**. Diese Angabe steht im Quellcode-Register in der Versionsgeschichte der Lizenzdatei und ist der beste verfügbare Hinweis darauf, wie stabil die Bedingungen sind. Ebenfalls stark ist es, für ein selbst genutztes Werkzeug die Frage aus der Theorie durchzurechnen: Was würde es kosten, wenn es morgen kostenpflichtig wäre?

    **4. Typischer Stolperstein** – „kostenlos" mit „Open Source" gleichzusetzen. Beides fällt in dieser Tabelle in verschiedene Zeilen – es gibt alle vier Kombinationen: kostenlos und Open Source, kostenlos und proprietär, kostenpflichtig und Open Source, kostenpflichtig und proprietär. Der zweite Stolperstein ist, sich auf die Produktwebseite zu verlassen. Verbindlich ist die Lizenzdatei bzw. der Lizenzleitfaden – Marketingtexte sind es nie.

---

### Aufgabe 12 – Einzelplatz oder Volumenvertrag?

!!! info "Worum es geht"
    - Eine **Staffelpreis-Rechnung** aufstellen und den Punkt bestimmen, an dem der Volumenvertrag günstiger wird
    - Erkennen, was ein **Nachkauf** kostet – je nachdem, ob der Rahmenvertrag den Staffelpreis festhält oder nicht
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

Die **Nordkontor Handels GmbH** beschafft eine Warenwirtschaft für ihre Büroarbeitsplätze. Der Hersteller bietet zwei Wege an. Beide sind Kauflizenzen – es geht hier also nicht um Kauf gegen Abo, sondern um Einzelkauf gegen Rahmenvertrag:

- **Einzelplatzlizenz:** 210 Euro je Arbeitsplatz, einmalig, ohne weitere Gebühren.
- **Volumenvertrag:** einmalig 1.500 Euro für den Rahmenvertrag samt zentraler Lizenzverwaltung, dazu je Lizenz ein Staffelpreis.

| Menge im Vertrag | Preis je Lizenz |
|---|---|
| 1 bis 24 | 190 Euro |
| 25 bis 99 | 160 Euro |
| ab 100 | 135 Euro |

Der Staffelpreis gilt jeweils für die **gesamte** Menge, nicht nur für die Stücke oberhalb der Grenze. Eine **rückwirkende Anpassung bereits bezahlter Lizenzen sieht der Vertrag nicht vor**: Wer nachbestellt und dadurch in die nächste Staffel rutscht, bekommt für die früher gekauften Lizenzen nichts erstattet. Die Softwarepflege kostet in beiden Wegen **24 Euro je Lizenz und Jahr**, erstmals im zweiten Jahr.

Heute sind **34 Arbeitsplätze** zu versorgen. Die Übernahme eines Wettbewerbers ist bereits beschlossen: In 18 Monaten werden es **88 Arbeitsplätze** sein.

1. **Rechne beide Wege für die heutigen 34 Arbeitsplätze durch.** Ab welcher Stückzahl lohnt sich der Volumenvertrag?
2. Der Vertrag soll gleich auf die Zielgröße nach der Übernahme ausgelegt werden. **Rechne 88 gegen 100 Lizenzen** – und prüfe, was die Softwarepflege aus dem Ergebnis macht.
3. Angenommen, der Betrieb nimmt 88 Lizenzen und braucht ein Jahr später doch 12 weitere. **Rechne diesen Nachkauf für zwei Vertragsfassungen durch:** einmal mit Preisbindung auf die kumulierte Vertragsmenge, einmal ohne.
4. **Nenne drei Vorteile des Volumenvertrags, die nichts mit dem Preis zu tun haben** – und einen Nachteil.

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – die heutigen 34 Arbeitsplätze:*

    ```text
    Einzelplatz:   34 x 210 EUR                   =  7.140 EUR
    Volumen:       1.500 EUR + 34 x 160 EUR
                   1.500 + 5.440                  =  6.940 EUR
                                                     ------
    Vorteil Volumenvertrag                             200 EUR
    ```

    Die Softwarepflege steht in beiden Wegen bei 24 Euro je Lizenz und Jahr. Solange die Stückzahl dieselbe ist, fällt sie aus dem Vergleich heraus – deshalb taucht sie in Teil 1 nicht auf, in Teil 2 dagegen sehr wohl.

    Der Kipppunkt liegt nicht an der Staffelgrenze. Er muss für jede Staffel mit deren eigenem Preis gesucht werden:

    ```text
    Ansatz in der Staffel 25 bis 99 (160 EUR)
      210 x n  =  1.500 + 160 x n
       50 x n  =  1.500
            n  =  30 Lizenzen  ->  liegt in dieser Staffel, gilt also

    Ansatz in der Staffel 1 bis 24 (190 EUR)
      210 x n  =  1.500 + 190 x n
       20 x n  =  1.500
            n  =  75 Lizenzen  ->  liegt ausserhalb dieser Staffel, faellt weg

    Probe, jede Zeile mit dem Preis ihrer eigenen Staffel
      24 Lizenzen (190 EUR):  5.040 EUR  gegen  1.500 + 4.560 = 6.060 EUR  -> Einzelplatz
      25 Lizenzen (160 EUR):  5.250 EUR  gegen  1.500 + 4.000 = 5.500 EUR  -> Einzelplatz
      29 Lizenzen (160 EUR):  6.090 EUR  gegen  1.500 + 4.640 = 6.140 EUR  -> Einzelplatz
      30 Lizenzen (160 EUR):  6.300 EUR  gegen  1.500 + 4.800 = 6.300 EUR  -> gleichauf
      31 Lizenzen (160 EUR):  6.510 EUR  gegen  1.500 + 4.960 = 6.460 EUR  -> Volumen
    ```

    In der Staffel 1 bis 24 lohnt der Volumenvertrag also überhaupt nie: Der Ausgleich wäre dort erst bei 75 Lizenzen erreicht – 1.500 Euro Grundgebühr geteilt durch 20 Euro Preisunterschied –, die Staffel endet aber bei 24.

    **Antwort: Ab 31 Lizenzen ist der Volumenvertrag günstiger, bei 30 sind beide gleich teuer.** Bei den heutigen 34 Arbeitsplätzen beträgt der Vorsprung ganze 200 Euro – bei dieser Größe entscheidet also nicht der Preis, sondern das, was in Teil 4 steht.

    *Teil 2 – 88 oder gleich 100 Lizenzen:*

    ```text
     88 Lizenzen:  1.500 +  88 x 160 EUR  =  1.500 + 14.080  =  15.580 EUR
    100 Lizenzen:  1.500 + 100 x 135 EUR  =  1.500 + 13.500  =  15.000 EUR
                                                                 ------
    Vorteil der groesseren Bestellung                               580 EUR
    ```

    Die größere Bestellung ist billiger als die kleinere. Ab welcher Menge das gilt:

    ```text
    n x 160 EUR  =  100 x 135 EUR  =  13.500 EUR
              n  =  84,375  ->  ab 85 Lizenzen lohnt der Sprung auf 100

    Probe
      84 Lizenzen:  13.440 EUR  gegen  13.500 EUR  ->  84 bleiben guenstiger
      85 Lizenzen:  13.600 EUR  gegen  13.500 EUR  ->  der Sprung lohnt
    ```

    Jetzt die Pflege. Sie hängt an der Zahl der Lizenzen, nicht an ihrem Preis:

    ```text
    Pflege je Jahr    88 Lizenzen:  88 x 24 EUR  =  2.112 EUR
                     100 Lizenzen: 100 x 24 EUR  =  2.400 EUR
    Mehrkosten je Jahr fuer die 12 Reservelizenzen  =    288 EUR

    Einmaliger Vorteil der Hunderterbestellung         580 EUR
      nach Jahr 2 (erste Pflegerechnung)               292 EUR
      nach Jahr 3                                        4 EUR
      nach Jahr 4                                     - 284 EUR
    ```

    **Antwort:** Die 100 Lizenzen kosten in der Anschaffung 580 Euro weniger als 88 – der Sprung in die nächste Staffel kostet nichts, er bringt etwas. Der Vorteil hält aber nur drei Jahre; danach zahlt der Betrieb dauerhaft für zwölf Lizenzen, die niemand nutzt. Die Entscheidung hängt damit nicht am Anschaffungspreis, sondern an einer Prognose: Wachsen wir innerhalb von drei Jahren über 88 Arbeitsplätze hinaus? Wenn ja, sind 100 Lizenzen eindeutig richtig – warum, zeigt Teil 3. Wenn nein, sind zwölf ungenutzte Lizenzen mit laufender Pflegegebühr genau die Überlizenzierung aus der Theorie, nur in schöner Verpackung.

    Ein Punkt gehört noch dazu, bevor die Menge 88 als neutraler Nullpunkt der Rechnung durchgeht: Besetzt sind heute 34 Plätze. Wer sofort 88 Lizenzen kauft, hält 54 Stück, die erst ab Monat 18 jemand benutzt – und zahlt darauf ab dem zweiten Jahr Pflege.

    ```text
    Pflege auf die 54 heute unbesetzten Plaetze   54 x 24 EUR  =  1.296 EUR je Jahr
    davon im zweiten Jahr auf niemanden gebucht (Monat 13 bis 18)     ca. 648 EUR
    ```

    Das ist ein kleiner Betrag, aber dieselbe Sorte Kosten wie bei den zwölf Reservelizenzen. Auch die 88 sind eine Prognoseentscheidung mit laufender Pflegerechnung – nur eine, die auf einem beschlossenen Vorgang beruht statt auf einer Hoffnung.

    *Teil 3 – der Nachkauf:*

    ```text
    Ausgangslage: 88 Lizenzen zu 160 EUR sind gekauft  =  14.080 EUR
    Ein Jahr spaeter werden 12 weitere gebraucht.

    Fassung A - Preisbindung auf die kumulierte Vertragsmenge
      Vertragsmenge erreicht 100 -> die 12 Stueck kosten je 135 EUR
        12 x 135 EUR                       =   1.620 EUR
      Lizenzkosten gesamt  14.080 + 1.620   =  15.700 EUR

    Fassung B - jede Bestellung wird fuer sich gestaffelt
      12 Stueck fallen in die Staffel 1 bis 24 -> je 190 EUR
        12 x 190 EUR                       =   2.280 EUR
      Lizenzkosten gesamt  14.080 + 2.280   =  16.360 EUR

    Zum Vergleich: 100 Lizenzen sofort      =  13.500 EUR
      (jeweils ohne die 1.500 EUR Vertragsgebuehr, die in allen drei Faellen anfaellt)

    Aufschlag gegenueber dem Sofortkauf
      Fassung A   15.700 - 13.500           =   2.200 EUR
      Fassung B   16.360 - 13.500           =   2.860 EUR

    Wert der Preisbindung bei diesem einen Nachkauf  =     660 EUR
    ```

    Diese Rechnung vergleicht bewusst nur die Lizenzkosten. Die Pflege zieht in die andere Richtung, aber nicht weit: Wer erst 88 Lizenzen hält, zahlt so lange Pflege auf 88 statt auf 100 Stück. Fällt in diese Zeit eine volle Jahresrechnung, spart der Nachkaufweg dort einmalig 288 Euro – der Aufschlag sinkt damit auf 1.912 Euro (Fassung A) bzw. 2.572 Euro (Fassung B). An der Aussage ändert das nichts: Der Nachkauf bleibt teurer als der Sofortkauf – der Unterschied zwischen den beiden Vertragsfassungen bleibt bei 660 Euro.

    Der entscheidende Satz im Vertrag lautet: Richtet sich die Staffel nach der **Gesamtmenge im Vertrag** oder nach der **Menge der einzelnen Bestellung**? Er ist bei diesem einen Nachkauf 660 Euro wert. Zwei Anschlussfragen gehören dazu. Erstens: Wird bei Erreichen der nächsten Staffel rückwirkend nachvergütet? In dieser Aufgabe steht die Antwort schon in der Angabe – nein, die bereits gekauften 88 Lizenzen bleiben bei 160 Euro. In echten Verträgen ist genau das der Normalfall; wer es anders haben will, muss es hineinverhandeln. Deshalb liegt selbst die gute Fassung A noch 2.200 Euro über dem Sofortkauf. Zweitens: Wie lange gilt die Preisbindung? Eine Bindung, die mit der Erstbestellung endet, ist keine.

    *Teil 4 – Vorteile jenseits des Preises:*

    | Vorteil | Was er im Alltag bedeutet |
    |---|---|
    | **Ein Vertrag statt vieler Einzelkäufe** | eine Laufzeit, ein Ansprechpartner, eine Rechnung – und beim Audit ein Dokument, das die gesamte Menge belegt, statt 88 Einzelrechnungen aus vier Jahren |
    | **Ein zentraler Lizenzschlüssel** | die Installation lässt sich automatisieren; beim Hardwaretausch muss niemand einen Schlüsselaufkleber am Gehäuse suchen |
    | **Bewegliche Zuordnung** | innerhalb der Vertragsmenge lassen sich Lizenzen typischerweise umhängen, wenn eine Person geht oder ein Gerät ersetzt wird – Einzelkäufe sind häufiger fest an ein Gerät gebunden |

    Der Nachteil: Ein Volumenvertrag lädt zum Vorratskauf ein. Wer die Menge großzügig ansetzt, hat eine bequeme Reserve und eine laufende Pflegerechnung darauf – der zweite Teil fällt niemandem auf, weil er nie als Entscheidung erscheint.

    Gefragt war ein Nachteil; ein zweiter gehört trotzdem erwähnt: die Bindung. Ein Rahmenvertrag über 100 Plätze macht den Wechsel zu einem anderen Produkt in drei Jahren nicht leichter.

    **2. Warum so?** – Der Kern von Teil 1 ist eine unscheinbare Zahl: die 1.500 Euro Vertragsgebühr. Sie sorgt dafür, dass **Staffelgrenze und Kipppunkt nicht dasselbe sind**. Der Preis je Lizenz fällt bei 25 Stück, günstiger wird der Volumenvertrag aber erst ab 31 – die ersten Lizenzen der neuen Staffel arbeiten die Grundgebühr ab. Wer nur in die Preistabelle schaut, wechselt an der falschen Stelle. Daraus folgt eine Regel für jede Staffel mit Fixkosten: **Erst die Gesamtrechnung aufstellen, dann vergleichen** – niemals Stückpreis gegen Stückpreis.

    Die Teile 2 und 3 gehören zusammen; sie zeigen dieselbe Sache aus zwei Richtungen. Bei einer Mengenstaffel ist die Beschaffung keine Zählaufgabe, sondern eine **Prognose**. Was heute gekauft wird, ist billiger als dasselbe in einem Jahr – aber nur, wenn es auch gebraucht wird. Zu viel gekauft heißt laufende Pflege auf Lizenzen ohne Nutzer; zu wenig gekauft heißt Nachkauf zu einem Preis, den man einmal schon besser hatte. Die eigentliche Schwierigkeit liegt deshalb nicht in der Rechnung, sondern in einer belastbaren Zielgröße – und die kommt aus der Personalplanung, nicht aus der IT.

    **3. Auch gut wäre ...** – zu erkennen, dass Teil 1 bei bekannter Übernahme streng genommen die falsche Frage stellt. Wer heute weiß, dass in 18 Monaten 88 Plätze zu versorgen sind, entscheidet nicht über 34 Lizenzen, sondern über einen Vertrag, der 88 bis 100 tragen muss. Die 34er-Rechnung ist trotzdem nützlich, weil sie den Kipppunkt sichtbar macht – als Beschaffungsentscheidung taugt sie nur, wenn die Zukunft wirklich offen ist.

    Ebenfalls stark ist der Hinweis, dass Staffelpreise Listenpreise sind, also ein Verhandlungsangebot: Wer 88 Plätze braucht, kann nach dem Preis der Hunderterstaffel für 88 Lizenzen fragen – das kostet nichts außer einer Mail. Eine dritte gute Ergänzung betrifft den Änderungsvorbehalt: Darf der Hersteller die Staffel während der Laufzeit ändern? Eine Preisbindung, die sich auf die Staffel bezieht statt auf den Betrag, ist wertlos, sobald die Staffelpreise steigen.

    **4. Typischer Stolperstein** – die Staffelgrenze für den Kipppunkt zu halten und bei 25 Lizenzen in den Volumenvertrag zu wechseln. Dort ist er noch 250 Euro teurer als der Einzelkauf, weil die Grundgebühr erst abgearbeitet werden muss. Der zweite Stolperstein ist, die zwölf Reservelizenzen aus Teil 2 als kostenlos zu verbuchen, weil sie in der Anschaffung nichts gekostet haben. Sie kosten 288 Euro Pflege im Jahr – nach drei Jahren ist der Anschaffungsvorteil aufgebraucht, ab dem vierten zahlt der Betrieb drauf. Eine Lizenz ohne Nutzer wird nicht dadurch harmlos, dass sie im Paketpreis mitkam.

---

### Aufgabe 13 – Kernbasiert lizenzieren: was zählt der Hersteller?

!!! info "Worum es geht"
    - Eine **kernbasierte Metrik** durchrechnen – einmal nach den vCPUs der VM, einmal nach allen Kernen des Clusters
    - Den Preis einer beiläufigen Änderung sichtbar machen: „bitte vier Kerne mehr"
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

Die **Bergmann Werkzeugbau GmbH** betreibt einen Virtualisierungs-Cluster aus **drei Hosts**. Jeder Host hat **zwei Prozessoren mit je 16 Kernen**, also 32 physische Kerne je Host. Der Cluster verschiebt VMs selbstständig auf den Host mit der geringsten Last.

Darauf laufen drei Datenbank-Instanzen desselben Herstellers:

| VM | Zugewiesene vCPUs | Zweck |
|---|---|---|
| **ERP-DB** | 8 | Warenwirtschaft, produktiv |
| **BI-DB** | 4 | Auswertungen |
| **Test-DB** | 2 | Test- und Schulungsumgebung |

Die Lizenzbedingungen: **480 Euro je Kern und Jahr**, **Mindestkernzahl 4 je Instanz**. Der Vertrag lässt offen, wonach in einer virtualisierten Umgebung gezählt wird. Der Hersteller vertritt die Auffassung, dass **alle physischen Kerne jedes Hosts** zu lizenzieren sind, auf dem die VM laufen **kann**.

1. **Rechne beide Auslegungen durch:** Zählung nach den zugewiesenen vCPUs gegen Zählung nach allen physischen Kernen des Clusters.
2. Ein Ticket lautet: „ERP-DB ist zu langsam, bitte vier Kerne mehr." **Rechne aus, was dieses Ticket in beiden Auslegungen kostet** – und was dazukommt, wenn dafür ein vierter Host beschafft wird (32 Kerne, 11.000 Euro einmalig). Auch der Host gehört in beiden Auslegungen gerechnet.
3. **Nenne drei Gegenmaßnahmen** und rechne für jede die Ersparnis aus. Schreib dazu, gegen welchen Ausgangswert du rechnest.
4. **Was gehört ab sofort in jeden Änderungsantrag**, damit so etwas nicht mehr unbemerkt passiert?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – die beiden Auslegungen:*

    ```text
    Auslegung 1 - nach den zugewiesenen vCPUs, mit Mindestkernzahl 4

      ERP-DB    8 vCPU  ->   8 lizenzpflichtige Kerne
      BI-DB     4 vCPU  ->   4 lizenzpflichtige Kerne
      Test-DB   2 vCPU  ->   4 lizenzpflichtige Kerne (Mindestkernzahl)
                            --
                            16 Kerne x 480 EUR  =   7.680 EUR je Jahr

    Auslegung 2 - alle physischen Kerne des Clusters

      3 Hosts x 2 Prozessoren x 16 Kerne  =  96 Kerne
                            96 Kerne x 480 EUR  =  46.080 EUR je Jahr

    Unterschied    46.080 - 7.680  =   38.400 EUR je Jahr
    Faktor         46.080 : 7.680  =        6
    ueber 5 Jahre   5 x 38.400     =  192.000 EUR
    ```

    Zwei Beobachtungen schon hier. Erstens sind **14 vCPUs zugewiesen, aber 16 Kerne lizenzpflichtig** – die Mindestkernzahl macht aus der kleinen Test-VM mit 2 vCPUs eine Vier-Kern-Lizenz. Zweitens liegt zwischen 7.680 und 46.080 Euro im Jahr keine einzige Änderung an Last, Ausstattung oder Nutzung. Der Unterschied entsteht aus der Zählweise im Vertrag – zusammen mit einem technischen Umstand, den niemand als Kostenfrage gebaut hat: Der Cluster verschiebt VMs selbstständig.

    *Teil 2 – was das Ticket kostet:*

    ```text
    Auslegung 1 - nach vCPUs
      vorher    8 + 4 + 4 = 16 Kerne x 480 EUR  =   7.680 EUR je Jahr
      nachher  12 + 4 + 4 = 20 Kerne x 480 EUR  =   9.600 EUR je Jahr
      Mehrkosten                                =   1.920 EUR je Jahr
      ueber 5 Jahre                             =   9.600 EUR

    Auslegung 2 - nach den Hosts
      vorher   96 Kerne x 480 EUR               =  46.080 EUR je Jahr
      nachher  96 Kerne x 480 EUR               =  46.080 EUR je Jahr
      Mehrkosten                                =       0 EUR
      ... solange die vorhandenen Hosts reichen.
    ```

    Reichen sie nicht, kommt der vierte Host – und jetzt dreht sich das Bild um:

    ```text
    Vierter Host, Auslegung 1 (nach vCPUs)
      Hardware                                  =  11.000 EUR einmalig
      Lizenz                                    =       0 EUR je Jahr
        Die Bleche zaehlen nicht mit; lizenzpflichtig bleiben die 20 vCPU-Kerne.

    Vierter Host, Auslegung 2 (nach den Hosts)
      Hardware                                  =  11.000 EUR einmalig
      Lizenz   32 Kerne x 480 EUR               =  15.360 EUR je Jahr
      Cluster danach  128 Kerne x 480 EUR       =  61.440 EUR je Jahr
    ```

    In Auslegung 1 kostet ein Ticket mit einer Zeile Text **1.920 Euro im Jahr** – eine Summe, die in keinem Änderungsantrag steht, weil dort Kerne stehen und keine Preise. Der Host dagegen ist dort lizenzseitig gratis. In Auslegung 2 ist es genau umgekehrt: Das Ticket kostet nichts, der Host bringt zu 11.000 Euro Hardware Lizenzkosten von 15.360 Euro **je Jahr** mit, unabhängig davon, wie viel Datenbank tatsächlich darauf läuft. Schon im ersten Jahr kostet die Lizenz rund 40 Prozent mehr als die Maschine. In dieser Rechnung ist die Hardware der kleinste Posten.

    *Teil 3 – drei Gegenmaßnahmen:*

    | Maßnahme | Rechnung | Ersparnis je Jahr | gemessen an |
    |---|---|---|---|
    | **Alle lizenzpflichtigen VMs an denselben Host binden** – Affinitätsregel, technisch erzwungen und dokumentiert | 32 Kerne × 480 = 15.360 EUR | **30.720 EUR** | Clusterrechnung 46.080 EUR |
    | **Eigener kleiner Host für die lizenzpflichtigen Lasten** – 2 × 8 Kerne, rund 9.000 Euro Hardware | 16 Kerne × 480 = 7.680 EUR | **38.400 EUR** | Clusterrechnung 46.080 EUR |
    | **Konsolidieren** – BI-DB und Test-DB als eine Instanz mit 6 vCPUs | 8 + 6 = 14 Kerne × 480 = 6.720 EUR | **960 EUR** | vCPU-Rechnung 7.680 EUR |

    Die drei Zahlen liegen nicht im selben Topf; deshalb steht die Bezugsgröße daneben. Die ersten beiden Zeilen sind **Alternativen** – wer einen eigenen Host beschafft, braucht die Affinitätsregel im großen Cluster nicht mehr; die Ersparnisse addieren sich also nicht. Die dritte Zeile wirkt nur unter der vCPU-Auslegung: Zählt der Hersteller alle physischen Kerne, ändert das Zusammenlegen zweier VMs an der Rechnung **nichts** – 96 Kerne bleiben 96 Kerne, die Ersparnis ist dann null.

    Wichtig bei Zeile 1: Es genügt nicht, die ERP-DB zu binden. Wandern BI-DB und Test-DB weiter frei durch den Cluster, verlangt der Hersteller nach seiner Auslegung trotzdem alle 96 Kerne – die Ersparnis wäre dann ebenfalls null. Die 15.360 Euro gelten nur, wenn **alle drei Instanzen** auf denselben Host gebunden sind.

    Der eigene Host rechnet sich dabei schneller, als die Zahlen vermuten lassen:

    ```text
    Ersparnis  38.400 EUR je Jahr  ->  3.200 EUR je Monat
    Hardware    9.000 EUR einmalig ->  nach rund 2,8 Monaten bezahlt
    ```

    Damit ist die wichtigste Einschränkung noch nicht genannt – sie wiegt schwer: Beide Maßnahmen nehmen der **produktiven** ERP-DB den automatischen Ausweichhost. Fällt die eine Maschine aus, steht die Warenwirtschaft. Die übliche Auflösung ist ein **Paar aus zwei kleinen Hosts**, beide lizenziert – dann darf die Datenbank auf dem zweiten starten:

    ```text
    Zwei kleine Hosts  2 x 16 Kerne = 32 Kerne x 480 EUR  =  15.360 EUR je Jahr
    Ersparnis gegenueber der Clusterrechnung 46.080 EUR   =  30.720 EUR je Jahr
    Hardware  2 x 9.000 EUR                               =  18.000 EUR einmalig
      bei 2.560 EUR Ersparnis je Monat nach rund 7 Monaten bezahlt
    ```

    Die Verfügbarkeit kostet also ein Fünftel der Ersparnis – 7.680 Euro im Jahr. Bei einer produktiven Warenwirtschaftsdatenbank ist sie keine Option, sondern eine Anforderung – wer nur die Lizenzrechnung optimiert, verkauft still einen Teil des Betriebskonzepts.

    Zwei weitere Einschränkungen gehören dazu. Die Affinitätsregel hilft nur, wenn sie erzwungen wird und belegbar ist – dazu gleich mehr im Stolperstein. Und der kleine Host muss bei jeder Kernänderung mitgedacht werden: Nach dem Ticket aus Teil 2 wären 18 vCPUs zugewiesen, die auf 16 physischen Kernen nur mit Überbuchung laufen – für eine produktive Datenbank keine gute Idee.

    Die dritte Zeile der Tabelle ist die unauffälligste und trotzdem lehrreich: Bei einer Mindestkernzahl je Instanz sind **wenige große Instanzen billiger als viele kleine**. Das läuft dem entgegen, was man technisch gern tut – für jede Aufgabe eine eigene saubere VM. Betrieblich hat gerade dieses Beispiel aber einen Preis, der in keiner Lizenztabelle auftaucht: BI-DB und Test-DB zusammenzulegen hebt die Trennung von Auswertung und Testbetrieb auf. Schulungsdaten, Schemaänderungen und Neustarts aus der Testumgebung treffen dann die Auswertungen mit. Für 960 Euro im Jahr ist das selten ein guter Tausch. Die Regel selbst bleibt richtig – sie taugt dort, wo ohnehin zusammengehört, was heute getrennt läuft.

    *Teil 4 – was in den Änderungsantrag gehört:*

    - **Ein Pflichtfeld „Läuft auf dieser Maschine etwas kernbasiert Lizenziertes?"** mit Ja oder Nein. Bei Ja geht der Antrag ohne die nächsten beiden Angaben nicht weiter.
    - **Die lizenzpflichtige Kernzahl vorher und nachher** – nach der im Vertrag vereinbarten Zählweise, nicht nach der Zahl im Verwaltungswerkzeug.
    - **Die Kostenfolge je Jahr als Betrag.** Damit entscheidet die Freigabe über eine Änderung mit Preisschild statt über eine Konfigurationszeile.
    - **Rückmeldung in die [CMDB](anforderungen-und-sollkonzept.md)**, sobald die Änderung umgesetzt ist. Sonst stimmt der Lizenzbestand ab dem nächsten Tag nicht mehr.

    Dieselbe Prüfung muss an drei weiteren Stellen anspringen: bei **jeder neuen VM**, bei **jeder Cluster-Erweiterung oder -Umschichtung** und beim **Hardware-Einkauf**. Gerade der letzte Punkt wird übersehen: Hosts mit 2 × 24 statt 2 × 16 Kernen zu bestellen wirkt wie eine vernünftige Reserve. Bei Host-Lizenzierung bringt jeder solche Host 16 zusätzliche lizenzpflichtige Kerne mit – 7.680 Euro im Jahr, deutlich mehr als der Aufpreis für die größeren Prozessoren. Und die Rückrichtung gehört ebenso gemeldet: Wer eine VM abschaltet oder Kerne zurücknimmt, gibt Lizenzen frei, die zur nächsten Verlängerung abbestellt werden können.

    **2. Warum so?** – Der Unterschied zwischen 7.680 und 46.080 Euro entsteht nicht an der Last. Auf beiden Seiten läuft dieselbe Datenbank auf denselben Maschinen mit derselben Auslastung. Er entsteht an einer einzigen Frage: **Wird gezählt, was tatsächlich läuft – oder was laufen könnte?** Kernbasierte Metriken zählen in virtualisierten Umgebungen häufig die Möglichkeit. Sobald ein Cluster VMs selbstständig verschiebt, kann jede VM auf jedem Host landen – damit wird jeder Host zur Bemessungsgrundlage. Wer das erst im Audit erfährt, bekommt eine Nachforderung für Jahre, in denen niemand etwas falsch machen wollte.

    Daraus folgt das Denkmodell dahinter: Bei kernbasierter Lizenzierung ist **die Architektur der Preis**. Nicht die Nutzung, nicht die Zahl der Anwender, nicht die Auslastung – sondern die Frage, wie groß die Menge der Maschinen ist, auf denen die Software laufen darf. Deshalb ist die beste Antwort in Teil 3 auch keine kaufmännische, sondern eine bauliche: Die lizenzpflichtige Last bekommt einen klar abgegrenzten Bereich, statt frei im Cluster zu schwimmen.

    Teil 2 zeigt, warum das im Alltag niemandem auffällt. „Vier Kerne mehr" ist eine Änderung von zwei Minuten, die kein Beschaffungsverfahren durchläuft, keine Unterschrift braucht und in keinem Budget auftaucht. Sie ist trotzdem ein Kauf – nur ohne Bestellung. Dasselbe gilt für den vierten Host: In der einen Auslegung ist er eine Hardwarebestellung, in der anderen eine Lizenzbestellung, die zufällig als Hardwarebestellung erscheint.

    **3. Auch gut wäre ...** – die Auslegungsfrage aus Teil 1 gar nicht selbst zu beantworten, sondern sich **schriftlich bestätigen zu lassen**, wonach der Hersteller zählt. Bei einem Unterschied von 38.400 Euro im Jahr ist eine Mail mit klarer Frage und klarer Antwort die günstigste Absicherung, die es gibt – im Streitfall ist sie die einzige, die zählt.

    Ebenfalls stark ist der Hinweis, dass Verträge typischerweise auch regeln, **wie oft eine Lizenz zwischen physischen Hosts wechseln darf** – teils mit Mindestabständen. Wer Lizenzen an einen Host bindet, sollte das kennen, denn im Störungsfall will man die VM woanders starten dürfen; genau daran hängt auch die Frage, ob das Hostpaar von oben so funktioniert wie gedacht. Und die Test-DB verdient eine eigene Prüfung: Test- und Schulungssysteme sind ohne ausdrückliche Regelung genauso lizenzpflichtig wie produktive. Manche Hersteller bieten dafür günstigere Entwicklungslizenzen an – aber nur, wenn jemand danach fragt.

    **4. Typischer Stolperstein** – die zugewiesenen vCPUs für die lizenzpflichtige Kernzahl zu halten. Hier sind 14 vCPUs zugewiesen; lizenzpflichtig sind 16 Kerne nach der einen und 96 nach der anderen Auslegung. Die zugewiesene Zahl ist in beiden Fällen nicht die Antwort – die Metrik steht im Vertrag, nicht im Verwaltungswerkzeug. Der zweite Stolperstein ist, eine Affinitätsregel für erledigt zu halten, weil sie in der Oberfläche gesetzt ist. Entscheidend ist, ob sie technisch **erzwungen** wird und ob sich das über den Betriebszeitraum belegen lässt. Eine weiche Regel, die der Cluster im Notfall selbst übergeht, beantwortet die Frage des Herstellers nicht: Er fragt nicht, wo die VM gelaufen ist, sondern wo sie hätte laufen können.

---

### Aufgabe 14 – Aus einer Rohliste ein Lizenzinventar machen

!!! info "Worum es geht"
    - Aus einer gewachsenen Liste ein **inventartaugliches** Verzeichnis bauen: Produkt, Metrik, Stückzahl, Vertrag/Laufzeit, Nachweis, Status
    - Auszählen, welche Angabe tatsächlich fehlt – und warum ohne die Metrik jede Stückzahl wertlos ist
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

Du übernimmst die IT-Betreuung bei **Sandner Elektrotechnik** (70 Beschäftigte, zwei Standorte). Beim Übergabegespräch schiebt dir dein Vorgänger eine Tabellendatei herüber: „Das ist unsere Lizenzliste, die ist eigentlich ganz gut gepflegt." Wörtlich steht darin:

| Zeile | So steht es in der Tabelle |
|---|---|
| 1 | Office – 45x – gekauft 2021 |
| 2 | Zeichenprogramm – Abo – Frau Reinhardt |
| 3 | Datenbank – 2 Server |
| 4 | Fernwartung – 5 Kanäle? |
| 5 | Virenschutz – 60 Geräte – Verlängerung im Herbst |
| 6 | Statik-Programm – „läuft seit Jahren", kein Vertrag auffindbar |
| 7 | Zeiterfassung – Cloud – 12 EUR |
| 8 | Diagramm-Bibliothek – Open Source – im Kundenportal eingebaut |
| 9 | Mailarchivierung – Kauf 2019 – Rechnung im Ordner „IT alt" |

Beim Rundgang durch die Büros fällt dir zusätzlich ein **kostenloses Packprogramm** auf, das auf **34 Rechnern** installiert ist. In der Tabelle kommt es nicht vor.

1. **Bau daraus ein Lizenzinventar** mit den Spalten Produkt, Metrik, Stückzahl, Vertrag/Laufzeit, Nachweis, Status. Trag ein, was dasteht – markiere ausdrücklich, was offen ist.
2. **Zähl aus, welche Spalte am häufigsten leer bleibt.** Und welche fehlende Angabe wiegt am schwersten? Begründe beides.
3. **Welche drei Einträge klärst du zuerst?** Begründe deine Reihenfolge.
4. Das Packprogramm steht in keiner Rechnung. **Auf welchen zwei Wegen entsteht ein Lizenzinventar** – und was findet jeder Weg, was der andere übersieht?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – das Inventar:* Übernommen wird nur, was wirklich dasteht. Alles andere bekommt ein „offen" – Vermutungen dürfen hinein, aber erkennbar als Vermutung.

    | Produkt | Metrik | Stückzahl | Vertrag / Laufzeit | Nachweis | Status |
    |---|---|---|---|---|---|
    | Office-Paket | **offen** – Gerät oder Person? | 45 (wovon?) | Kauf 2021, Wartung offen | offen | zu klären |
    | Zeichenprogramm | vermutlich Named User | 1? – „Frau Reinhardt" ist ein Name, keine Zahl | Abo, Frist offen | offen | zu klären |
    | Datenbank | **offen** – „2 Server" ist keine Metrik | offen: Kerne je Server? | offen | offen | **Risiko** |
    | Fernwartung | vermutlich parallele Sitzungen („Kanäle"), Bindung offen | 5, laut Liste selbst unsicher | offen | offen | zu klären |
    | Virenschutz | pro Gerät | 60 | „im Herbst" – Datum fehlt | offen | zu klären, **Frist** |
    | Statik-Programm | offen | offen | offen – kein Vertrag auffindbar | **keiner** | **Risiko** |
    | Zeiterfassung | vermutlich je Nutzer und Monat | offen | offen – 12 EUR wofür? je Nutzer, je Monat, gesamt? | offen | zu klären |
    | Diagramm-Bibliothek | keine Stückzahl – es zählt die Lizenzfamilie | entfällt | keine Laufzeit, dafür Pflichten bei Weitergabe | offen – welche Lizenz genau? | zu klären, **Weitergabe** |
    | Mailarchivierung | offen | offen | Kauf 2019 | Rechnung im Ordner „IT alt" | zu klären |
    | Packprogramm | **offen** – „kostenlos" für wen? | 34 Installationen | offen | offen | **Risiko** |

    Das eigentliche Ergebnis steht in der letzten Spalte: **Keine einzige Zeile erreicht den Status „geklärt".** Die Datei war nie ein Inventar, sondern eine Merkhilfe für jemanden, der die fehlenden Angaben im Kopf hatte – deshalb überlebt sie den Personalwechsel nicht.

    *Teil 2 – die Auszählung:*

    | Spalte | belastbar ausgefüllt | Rest |
    |---|---|---|
    | Vertrag / Laufzeit | **kein einziges Enddatum**, keine Frist, kein Verlängerungstermin – zwei Zeilen nennen ein Kaufjahr (2021, 2019), eine ein Wort statt eines Datums („im Herbst") | 9 offen; bei der Diagramm-Bibliothek entfällt die Laufzeit |
    | Nachweis | **1 von 10** – und „Ordner IT alt" ist eine Ortsangabe, kein Beleg | 9 ohne jeden Beleg |
    | Metrik | 2 von 10 (Virenschutz „60 Geräte", Diagramm-Bibliothek) | 5 ganz offen, 3 nur vermutet |
    | Stückzahl | 4 von 10 wörtlich aus dem Sachverhalt (45, 5, 60, 34) – die 5 dort selbst mit Fragezeichen | 4 offen, 1 erschlossen („1?"), 1 entfällt |

    Am häufigsten fehlen damit **Nachweis und Laufzeit** – je 9 von 10 Zeilen. Ein Enddatum nennt sogar keine einzige. Die Metrik liegt mit 8 von 10 knapp dahinter; immerhin sind davon 3 begründet vermutet statt völlig unbekannt.

    Am schwersten wiegt trotzdem etwas anderes – und hier lohnt es sich, die Frage zu trennen:

    - **Für die Steuerung ist die Metrik die wichtigste Angabe.** Eine Stückzahl ohne Metrik ist eine Zahl ohne Einheit: „45x" beantwortet nichts – 45 Geräte, 45 Personen, 45 Installationen, 45 Postfächer? Erst die Metrik macht daraus eine Aussage, die sich mit der Wirklichkeit vergleichen lässt. Und sie bestimmt, **welches Ereignis** den Bedarf verändert: bei Named User eine Einstellung, bei einer Gerätelizenz ein zweites Notebook, bei einer kernbasierten Lizenz ein Hardware-Ticket, bei Kanälen eine zusätzliche gleichzeitige Sitzung. Wer die Metrik nicht kennt, kann nicht wissen, wann nachzukaufen wäre – er erfährt es beim Audit.
    - **Im Prüfungsfall ist der Nachweis die wichtigste Angabe.** Dort zählt nicht, was im Inventar steht, sondern was belegt ist: Rechnung, Vertrag, Lizenzschlüssel, Bestätigung aus dem Kundenportal des Herstellers. Eine Zeile ohne Nachweis ist eine Behauptung.
    - **Die Laufzeit ist die teuerste Lücke im Alltag**, weil sie ohne Zutun abläuft. Die anderen beiden warten geduldig auf dich; eine Frist nicht.

    „Die wichtigste Spalte" gibt es demnach nicht ohne die Frage, wofür. Genau deshalb hat ein Inventar mehrere Spalten statt einer.

    *Teil 3 – die ersten drei Klärungen:*

    1. **Zeile 3, Datenbank.** Datenbanken werden häufig nach Prozessorkernen lizenziert, oft mit einer Mindestkernzahl je Server. „2 Server" sagt darüber nichts; jede Vergrößerung einer VM seit der Beschaffung – deren Zeitpunkt hier nicht einmal bekannt ist – kann den Bedarf still erhöht haben. Höchstes Risiko bei völlig unbekannter Lage.
    2. **Das Packprogramm.** 34 Installationen sind die größte Stückzahl im ganzen Inventar – bei völlig ungeklärter Lizenzart. „Kostenlos" ist eine Preisaussage, keine Lizenzaussage: Etliche verbreitete Werkzeuge sind nur privat frei, im Betrieb ist derselbe Download kostenpflichtig. Trifft das hier zu, geht es nicht um einen Einzelplatz, sondern um 34.
    3. **Zeile 6, Statik-Programm.** Software im produktiven Einsatz, zu der sich kein einziger Beleg finden lässt. Ob damals bezahlt wurde, ist dabei nicht die Frage – im Audit ist eine unbelegte Zeile eine unbelegte Zeile. Und je länger der Kauf zurückliegt, desto unwahrscheinlicher taucht der Beleg noch auf.

    Zwei Zeilen liegen knapp dahinter, aus verschiedenen Gründen:

    - **Zeile 5, Virenschutz.** Hier läuft eine Frist, die niemand kennt. Fristen warten nicht, bis sie an der Reihe sind – deshalb erfragst du das Enddatum sofort, auch wenn die inhaltliche Klärung danach warten kann. „Im Herbst" endet entweder in einer stillen Verlängerung um ein weiteres Jahr oder darin, dass 60 Geräte ohne Schutz dastehen.
    - **Zeile 8, Diagramm-Bibliothek.** Sobald das Kundenportal ausgeliefert wird, greifen die Weitergabepflichten der jeweiligen Lizenz. Beim reinen Betrieb als Dienst kommt es dagegen auf die Lizenzfamilie an: Netzwerk-Copyleft wie die AGPL zieht auch dort Pflichten nach sich, permissive Lizenzen wie MIT oder Apache 2.0 nicht.

    Das Ordnungsprinzip lautet: **sortiert wird nach Risiko und Frist, nicht nach Aufwand.** Die schnell abzuräumenden Zeilen zuerst zu erledigen fühlt sich produktiv an und lässt genau die liegen, die etwas kosten.

    *Teil 4 – die zwei Wege ins Inventar:*

    | Weg | Findet | Übersieht |
    |---|---|---|
    | **Von den Verträgen her** – Rechnungen, Bestellungen, Vertragsordner, Buchhaltung | Was bezahlt wurde, mit Beleg, Preis, Laufzeit und in der Regel auch der vereinbarten Metrik | Alles, was nie über den Einkauf gelaufen ist: das Packprogramm, die Diagramm-Bibliothek, jede kostenlose oder mitgebrachte Lizenz |
    | **Von den Systemen her** – technische Erfassung der installierten Software, dazu die Abhängigkeitslisten der Eigenentwicklung | Was tatsächlich läuft, samt Version und Anzahl – die 34 Installationen wären so aufgefallen | Alles, was bezahlt ist, ohne zu laufen (die Zombie-Lizenzen), alles außerhalb eigener Geräte (die Cloud-Zeiterfassung) – und jede Vertragsbedingung, denn ein Scanner sieht Installationen, keine Metrik |

    Das Inventar ist keiner der beiden Wege, sondern ihr **Abgleich**. Die Differenzen sind das eigentliche Ergebnis: Was läuft ohne Vertrag, ist ein rechtliches Risiko; was bezahlt wird, ohne zu laufen, ist totes Geld. Zwei unabhängig entstandene Listen finden dabei deutlich mehr als eine einzelne, die aus der Erinnerung ergänzt wird. Deshalb reicht es auch nicht, den Vorgänger zu fragen – er ist die Quelle der Rohliste, nicht ihre Kontrolle.

    **2. Warum so?** – Ein Inventar ist keine Liste von Namen, sondern eine Liste von **Aussagen mit Beleg**. Die sechs Spalten sind sechs Fragen: Was läuft bei uns? Wonach wird gezählt? Wie viel davon? Wie lange zu welchen Bedingungen? Womit belege ich das? Und wo stehen wir damit gerade? Fehlt eine Antwort, ist die Zeile nicht falsch – sie ist nur nicht benutzbar. Genau das unterscheidet die Rohliste vom Inventar: Beide enthalten dieselben Produkte, aber nur eines lässt sich gegen die Wirklichkeit halten.

    Die unauffälligste Spalte ist die **Status**-Spalte – sie macht aus dem Dokument erst eine Arbeitsliste. Ein Inventar ohne Status wird einmal geschrieben und nie wieder angefasst; mit Status ist jede offene Zeile eine Aufgabe mit Adressat. Damit ist hier der erste Schritt des Lizenzprozesses getan: **erfassen**, soweit die vorhandenen Quellen reichen. Das Zuordnen ist eröffnet, aber erst abgeschlossen, wenn Metrik, Laufzeit und Nachweis gefüllt sind. Überwachen, bereinigen und Wiedervorlage bauen darauf auf.

    **3. Auch gut wäre ...** – weitere Spalten vorzuschlagen, sobald die Grundlage steht: eine verantwortliche Person je Eintrag, die betroffenen Systeme als Verknüpfung zur CMDB, ein Ablaufdatum als Wiedervorlage sowie die Herkunft der Angabe – gemessen oder per Zuruf. Die letzte klingt bürokratisch und trennt genau das, was in dieser Liste durcheinandergeht: Wissen von Vermutung.

    Ebenfalls stark ist der Hinweis auf das Zeitfenster: Der Vorgänger ist die einzige Quelle, die nach seinem letzten Arbeitstag nicht mehr existiert. Die offenen Felder gehören deshalb ins Übergabegespräch, nicht auf die Liste für nächsten Monat – und zwar als konkrete Fragen: Wonach zählt der Hersteller bei Zeile 1? Wo liegt der Vertrag zu Zeile 3? Wer hat Zeile 6 damals beschafft?

    **4. Typischer Stolperstein** – die Rohliste sauber abzutippen und das für die Aufgabe zu halten. Aus neun unklaren Zeilen werden dann neun hübsch formatierte unklare Zeilen; die Arbeit beginnt erst an den Fragezeichen. Der zweite Stolperstein ist, die Lücken mit plausiblen Annahmen zu füllen, ohne sie zu kennzeichnen: Aus „vermutlich pro Gerät" wird in zwei Wochen „pro Gerät" und in zwei Jahren die Grundlage einer Nachbestellung. Vermutungen dürfen ins Inventar – aber nur als Vermutung erkennbar.

---

### Aufgabe 15 – Die falsche Lizenzart

!!! info "Worum es geht"
    - Beurteilen, wann eine ordentlich beschaffte Lizenz für die tatsächliche Nutzung trotzdem die **falsche** ist
    - Die Entstehungswege erkennen – gute Absicht, Sparwille, ein Pilot ohne Ende – und sie mit einer Regel abstellen
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

Bei der **Wieland Kunststofftechnik** (120 Beschäftigte, Werk in Deutschland, seit einem Jahr eine Vertriebsniederlassung in der Schweiz) sieht die IT-Leitung den Softwarebestand durch. Fünf Fälle bleiben hängen. In allen fünf läuft die Software technisch einwandfrei, in allen fünf existiert eine echte Lizenz – in keinem hat jemand etwas Unerlaubtes gewollt. Was im Einzelfall gilt, steht im konkreten Lizenztext des Herstellers.

| Fall | Situation |
|---|---|
| **A** | Eine Projektassistentin wartet seit drei Wochen auf ihre Office-Lizenz. Damit sie arbeiten kann, hat sie ihre privat gekaufte Heimversion („für den privaten Gebrauch") auf dem Dienstnotebook installiert – selbst bezahlt. |
| **B** | Ein Werkstudent zeichnet Kundenaufträge mit der vergünstigten Studierendenlizenz eines CAD-Programms, die er aus der Hochschule mitgebracht hat. |
| **C** | Die acht Arbeitsplätze der Schweizer Niederlassung laufen auf Lizenzen aus dem deutschen Volumenvertrag. Dessen regionale Gültigkeit ist im Vertragstext auf Standorte in der EU begrenzt. |
| **D** | Ein Ticketsystem wurde vor 14 Monaten als 90-Tage-Test aufgesetzt. Der Anbieter hat zweimal um je 90 Tage verlängert, seither läuft es unverändert weiter – die Software prüft die Frist nicht. Inzwischen hängt der gesamte Kundendienst daran. |
| **E** | Beim Serverumzug im Frühjahr wurde eine Datenbank auf dem neuen Server neu aufgesetzt, wieder mit dem Installationspaket aus dem kostenlosen Entwicklerprogramm des Herstellers – Lizenz „für Entwicklung und Test". Seither liegen dort die Produktivdaten der Fertigung. Die Produktivlizenz kostet 2.400 Euro je Kern, der Server hat 8 Kerne. |

1. **Beurteile jeden Fall** – erlaubt, problematisch oder klarer Verstoß – mit Begründung.
2. **Nenne zu jedem Fall eine Sofortmaßnahme.**
3. **Warum entstehen genau solche Fälle so häufig?** Benenne die Muster dahinter.
4. **Welche eine organisatorische Regel** würde die meisten dieser Fälle verhindern – und welchen fängt sie nicht?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – die Beurteilung:*

    | Fall | Bewertung | Begründung |
    |---|---|---|
    | **A** | **klarer Verstoß** | Heimversionen sind typischerweise ausdrücklich auf die private, nicht gewerbliche Nutzung beschränkt: Der zulässige Zweck ist Teil des Vertrags, nicht bloß die Begründung für den niedrigen Preis. Dass die Kollegin selbst bezahlt hat, hilft dem Betrieb nicht – auf einem Dienstgerät verarbeitet eine Software Kundendaten, für die er weder Vertrag noch Nachweis hat. |
    | **B** | **klarer Verstoß** | Bildungs- und Studierendenlizenzen sind meist doppelt gebunden: an eine Person im Bildungsstatus **und** an einen Ausbildungszweck; kommerzielle Ergebnisse sind regelmäßig ausgeschlossen. Dass der Student wirklich studiert, ändert nichts – hier entstehen bezahlte Kundenaufträge. |
    | **C** | **Verstoß – offen ist nur die Heilung** | Die **regionale Gültigkeit** ist einer der Prüfpunkte aus der Theorie – hier greift er: Der Vertrag deckt laut Sachverhalt die EU ab, die Schweiz gehört nicht dazu. Damit steht der Befund fest – die acht Plätze laufen außerhalb des Lizenzgebiets. Offen ist erst die nächste Frage: Lässt sich das ohne Nachkauf heilen? Viele Rahmenverträge lassen verbundene Unternehmen ausdrücklich beitreten oder erlauben eine Erweiterung des Gebiets gegen Aufpreis. Dafür brauchst du die Anlagen zum Vertrag. |
    | **D** | **klarer Verstoß – seit rund fünf Monaten** | Drei Testphasen zu je 90 Tagen ergeben 270 Tage, also rund neun Monate; in Betrieb ist das System seit 14 Monaten. Eine Testlizenz erlaubt typischerweise die befristete Erprobung, nicht den Dauerbetrieb – der Kundendienst war auch während der gültigen Testphase nicht der vereinbarte Zweck. Dass die Software nicht sperrt, ist keine Erlaubnis: Technische Möglichkeit und vertragliche Erlaubnis sind zweierlei. |
    | **E** | **klarer Verstoß** | Lizenzen für Entwicklung und Test sind typischerweise ausdrücklich vom Produktivbetrieb ausgenommen; genau deshalb sind sie günstig oder kostenlos. Der Unterschied ist kein technischer, sondern ein vertraglicher – die Software ist dieselbe. |

    Für Fall D lässt sich der Zeitraum ausrechnen:

    ```text
    Testphase gesamt:   90 + 90 + 90 Tage  =  270 Tage  (rund 9 Monate)
    In Betrieb seit:                           14 Monate
    Ohne Lizenz seit:   14 - 9              =  rund 5 Monate
    ```

    Für Fall E lässt sich der Unterschied beziffern:

    ```text
    Produktivlizenz:   8 Kerne x 2.400 EUR je Kern  =  19.200 EUR
    Entwicklerlizenz:  kostenlos im Entwicklerprogramm des Herstellers
    ```

    Die 19.200 Euro gelten unter der Annahme, dass die 8 Kerne der Maschine gezählt werden. Wird gegen die physischen Kerne des Hosts lizenziert – bei kernbasierten Modellen verbreitet – liegt der Betrag höher; Mindestkernzahlen und der Verkauf in Zwei-Kern-Paketen können ihn zusätzlich anheben; Wartung ist darin ohnehin nicht enthalten. Der Betrag ist also eine Untergrenze. Er ist außerdem kein Preis für Technik, sondern der Preis für den erlaubten Zweck. Deshalb schauen Hersteller ausgerechnet bei dieser Unterscheidung besonders genau hin.

    *Teil 2 – die Sofortmaßnahmen:*

    - **A:** Installation entfernen, Beschaffung eskalieren. Die eigentliche Ursache sind die drei Wochen Wartezeit – wer sie nicht abstellt, bekommt denselben Fall wieder.
    - **B:** Auf eine kommerzielle Lizenz umziehen, notfalls über eine kurzfristig gemietete Monatslizenz. Danach prüfen, welche Zeichnungen so entstanden sind – und ob sie bereits beim Kunden liegen.
    - **C:** Anlagen zum Vertrag beschaffen, die Frage schriftlich an den Anbieter stellen, die Antwort ablegen. Bis zur Klärung keine weiteren Plätze in der Niederlassung ausrollen.
    - **D:** Eine Entscheidung mit Datum erzwingen – kaufen oder abschalten. Und den Hersteller selbst ansprechen, bevor er von allein fragt: Wer eine solche Lage meldet, verhandelt über einen Preis; wer sie nachgewiesen bekommt, über eine Nachforderung.
    - **E:** Produktivdaten auf eine korrekt lizenzierte Instanz umziehen oder die Lizenz nachkaufen, mit Termin. Danach Entwicklungs- und Produktivumgebung trennen, damit „ist doch derselbe Server" nicht erneut passiert.

    *Teil 3 – warum solche Fälle entstehen:*

    | Muster | Wo es wirkt |
    |---|---|
    | **Gute Absicht** | Fall A: Jemand will arbeiten statt warten – der Fehler entsteht aus Einsatzbereitschaft. |
    | **Sparwille** | Fälle B und E: Die günstigere Ausgabe ist technisch identisch. Wer keinen Unterschied sieht, empfindet die teure Variante als Verschwendung. |
    | **Ein Pilot ohne Ende** | Fall D: Pilotprojekte haben einen Anfangstermin, selten einen Endtermin. Mit jedem Monat wird das Abschalten teurer, weil mehr daran hängt. |
    | **Wachstum über eine Vertragsgrenze** | Fall C: Der Vertrag wurde für das Unternehmen von damals geschrieben – niemand hat entschieden, ihn zu verletzen. |

    Der gemeinsame Nenner: Überall funktioniert die Software einwandfrei. Der Unterschied zwischen erlaubt und nicht erlaubt ist **unsichtbar** – er steht in einem Dokument, nicht im Programm; es gibt also keinen Moment, in dem etwas auffällt. Dazu kommt die Richtung: Alle fünf Abweichungen sind billiger als die korrekte Variante. Sie sehen im Betrieb aus wie Sparsamkeit und werden deshalb nicht gemeldet, sondern weitererzählt.

    *Teil 4 – die eine Regel:* **Keine Software auf betrieblichen Geräten ohne Eintrag im Lizenzinventar.** Vor jeder Installation entsteht ein Eintrag mit Produkt, Lizenzart, zulässigem Zweck, Laufzeit und Nachweis, angelegt von einer benannten Stelle. Die Regel greift an der einzigen Stelle, an der vier der fünf Fälle vorbeikommen – der Installation:

    - **A und B** scheitern am Nachweis: Für eine privat oder über die Hochschule beschaffte Lizenz kann der Betrieb keinen vorlegen. Der Fall wird sichtbar, bevor er entsteht.
    - **D** scheitert am Feld Laufzeit. Ein Testzugang bekommt ein Enddatum, ein Enddatum erzeugt eine Wiedervorlage – aus dem Pilot ohne Ende wird eine Entscheidung mit Termin.
    - **E** ist eine neue Installation auf einem neuen Server. Das Feld „zulässiger Zweck" fragt genau danach: Entwicklung oder Produktivbetrieb?

    Bei **E** lohnt eine Ergänzung, denn der Fall wäre um Haaresbreite durchgerutscht: Wäre die Datenbank beim Umzug mitgenommen statt neu aufgesetzt worden, hätte es gar keine Installation gegeben, an der die Regel greifen könnte – nur eine Datenmigration. Der Auslöser darf deshalb nicht allein die Installation sein, sondern muss auch die **Zweckänderung einer bestehenden Installation** umfassen. Aus einer Testumgebung wird ein Produktivsystem in dem Moment, in dem echte Daten darauf liegen, nicht in dem Moment, in dem jemand etwas installiert.

    Nicht gefangen wird **Fall C**: Dort wurde korrekt installiert, aus einem Vertrag, der für den deutschen Standort gilt, mit Nachweis – falsch ist nicht die Installation, sondern der Ort. Dagegen hilft nur, den Prüfpunkt regionale Gültigkeit an ein anderes Ereignis zu hängen: an jeden neuen Standort, jede neue Gesellschaft, jede Verlagerung in eine andere Cloud-Region. Und die Regel braucht eine zweite Ergänzung, sonst scheitert sie an sich selbst: einen **schnellen** Weg zur regulären Lizenz. Eine Vorschrift, die drei Wochen Wartezeit bedeutet, wird umgangen – Fall A ist der Beweis.

    **2. Warum so?** – Eine Lizenz besteht aus mehr als Produkt und Stückzahl. Vier Fragen entscheiden darüber, ob sie zur tatsächlichen Nutzung passt:

    | Frage | Betroffene Fälle |
    |---|---|
    | **Wer** darf sie nutzen – welche Person, welcher Status, welches Unternehmen? | A, B, C |
    | **Wofür** – privat, Ausbildung, Test, Entwicklung, Produktivbetrieb? | A, B, D, E |
    | **Wo** – welches Land, welcher Standort, welche Cloud-Region? | C |
    | **Wie lange** – Frist, Verlängerung, Enddatum? | D |

    Die klassische Unterlizenzierung – mehr Nutzung als Lizenzen – findet man durch Zählen. Drei dieser Fälle findet man so nicht: Bei **C, D und E** gehört zu jeder Installation eine betriebliche Lizenz, die Mengenbilanz stimmt. Bei **A und B** zeigt eine Mengenbilanz sehr wohl eine Lücke, denn dem Betrieb gehört dort überhaupt keine Lizenz; sie gehört der Kollegin und dem Studenten. Das Zählen führt also in zwei von fünf Fällen zum Ziel und in drei Fällen nicht. Was in allen fünf nicht stimmt, ist die **Zuordnung** – deshalb prüft ein brauchbares Lizenzinventar nicht nur Menge gegen Menge, sondern auch Art gegen Nutzung.

    Und ein Punkt zur Haltung: In keinem der fünf Fälle hat jemand betrogen. Das ist der Normalfall – der übliche Weg in einen Lizenzverstoß führt über eine hilfsbereite Person unter Termindruck. Wer das als Disziplinproblem behandelt, bekommt beim nächsten Mal weniger Meldungen, aber nicht weniger Fälle.

    **3. Auch gut wäre ...** – bei Fall C sauber zwischen Befund und Heilung zu trennen: „Die Nutzung liegt außerhalb des Lizenzgebiets, das steht fest. Ob sie sich ohne Nachkauf heilen lässt, kann ich ohne die Anlagen nicht sagen." Das ist stärker als eine schnelle Gesamtbewertung in die eine oder andere Richtung. Dazu gehört der Blick über den Einzelfall hinaus – eine neue Niederlassung im Ausland löst dieselbe Prüfung für jeden anderen laufenden Vertrag aus.

    Ebenfalls stark ist es, die Fälle nach Dringlichkeit zu ordnen statt sie nur zu bewerten: **E** zuerst, weil es der einzige Fall mit bezifferbarem Risiko ist – mindestens 19.200 Euro – bei täglich wachsender Datenmenge; dann **D**, weil dort nicht nur die Lizenz hängt, sondern der Kundendienst an einer Testinstanz ohne Zusagen zu Verfügbarkeit und Wiederherstellung; dann **B**, weil die Ergebnisse bereits beim Kunden sind; dann **A**, in zehn Minuten behoben; zuletzt **C**, wo ohnehin auf eine Antwort gewartet wird. Zu B, C und D ist kein Betrag bekannt – die Reihenfolge stützt sich dort auf die Reichweite der Folgen, nicht auf eine Zahl.

    **4. Typischer Stolperstein** – die Fälle mit „es ist doch bezahlt" durchzuwinken. Bezahlt wurde mehrfach etwas anderes als das, was genutzt wird; der Preisunterschied zwischen einer Heim-, Bildungs- oder Testlizenz und der betrieblichen Variante ist genau der Betrag, um den es geht – und der Hersteller kennt ihn. Der zweite Stolperstein ist Fall D: aus „läuft doch noch" auf eine stillschweigende Erlaubnis zu schließen. Ob eine Nutzung erlaubt ist, entscheidet der Vertrag; ob sie technisch möglich ist, entscheidet der Hersteller aus ganz anderen Gründen – oft schlicht, weil eine harte Sperre mehr Support-Aufwand erzeugt als Nutzen.

---

## Aufgaben mit Artikeln

Die folgenden vier Aufgaben laufen anders: Ihr lest zuerst einen echten Fachbeitrag oder Nachrichtenartikel und beantwortet die Fragen daraus. Das ist Absicht: Lizenzthemen ändern sich schneller, als Lernmaterial nachkommt. Und die Fähigkeit, eine Meldung fachlich einzuordnen, gehört zum Beruf dazu.

!!! tip "So arbeitet ihr damit"
    Am besten zu zweit oder zu dritt, etwa 20 Minuten lesen, 10 Minuten vorstellen. Beantwortet zu jedem Artikel immer dieselben drei Fragen, bevor ihr in die Einzelfragen geht:

    1. **Worum geht es?** In eigenen Worten, drei bis vier Sätze – nicht abschreiben.
    2. **Was ist die Ursache, was die Folge?** Beides sauber getrennt.
    3. **Was heißt das für uns?** Welche konkrete Maßnahme leitet ihr für einen Betrieb daraus ab?

    Sollte ein Link nicht mehr erreichbar sein: Jede Musterlösung steht für sich – der angegebene Suchbegriff führt zu vergleichbaren Beiträgen. Ein toter Link ist übrigens selbst eine kleine Lektion – Quellen zu Lizenzthemen sind erstaunlich vergänglich.

### Aufgabe 16 – Artikel: Lizenz-Audits nehmen zu

!!! info "Worum es geht"
    - Einen aktuellen Fachbeitrag zu **Lizenz-Audits** auswerten
    - Erkennen, warum die Prüfungen zunehmen – und was ein Betrieb dagegen tun kann
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

**Artikel:** [The State of Software License Audits in 2025 (2-data.com)](https://www.2-data.com/knowledge-hub/the-state-of-software-license-audits-in-2025-heightened-risk-smarter-defenses-and-the-need-for-proactive-governance) &nbsp;·&nbsp; Suchbegriff, falls der Link nicht mehr geht: *software license audit trends*

1. **Welche Softwarehersteller** führen besonders häufig Lizenz-Audits durch?
2. **Welche Lizenzmodelle** werden als die heute üblichen genannt? Ordnet sie den Modellen aus der Theorie zu.
3. **Welche Risiken** entstehen einem Unternehmen, dessen Lizenzdaten unvollständig sind? Nennt drei verschiedene Arten von Folgen.
4. **Warum nehmen Audits gerade zu?** Formuliert eine Vermutung und begründet sie.
5. Eine Prüfung wird angekündigt. **Was sind eure ersten drei Schritte?**

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – die üblichen Prüfer:* Genannt werden regelmäßig **Microsoft, Oracle, SAP, IBM und Adobe**. Das ist kein Zufall: Es sind Anbieter mit komplexen Metriken, langen Vertragsbeziehungen und großen Kundenbeständen – genau die Konstellation, in der sich eine Prüfung wirtschaftlich lohnt.

    *Teil 2 – die üblichen Modelle:*

    | Im Artikel genannt | Entspricht in der Theorie |
    |---|---|
    | Subscription / Abonnement | Subscription statt Kauflizenz |
    | pro Kern bzw. nach Rechenleistung | kernbasierte Metrik |
    | hybride Lizenzen für eigenes Haus und Cloud | Lizenzmitnahme in die Cloud |
    | nutzungs- bzw. verbrauchsbasiert | nutzungsbasierte Abrechnung |
    | Credits | vorab gekauftes Guthaben |
    | parallele Nutzung / gleichzeitige Sitzungen | Concurrent User |

    *Teil 3 – drei Arten von Folgen:*

    - **Finanziell** – Nachzahlungen zu Listenpreisen, häufig mit Aufschlag, dazu der Aufwand der Prüfung selbst.
    - **Rechtlich** – Nutzungsuntersagung, Vertragsstrafen, im Ernstfall Schadensersatz.
    - **Verhandlungsposition und Ruf** – wer seine Zahlen nicht belegen kann, verhandelt aus der schwächeren Position. Bei Kunden mit eigenen Compliance-Anforderungen kann eine schwache Lizenzlage zum Ausschlusskriterium werden.

    *Teil 4 – warum jetzt:* Mehrere Entwicklungen wirken zusammen. Die Nutzung ist **unübersichtlicher geworden** – dieselbe Software läuft im eigenen Haus, in VMs, in Containern und in der Cloud, oft gleichzeitig. Die **Metriken sind komplexer** geworden, damit steigt die Wahrscheinlichkeit von Fehlern zugunsten des Herstellers. Und Audits sind für Hersteller in gesättigten Märkten eine **verlässliche Einnahmequelle**: Der Kunde ist bereits gewonnen, das Produkt bereits im Einsatz, es geht nur noch um die korrekte Menge.

    *Teil 5 – die ersten drei Schritte bei einer Ankündigung:*

    1. **Vertrag lesen, bevor Daten fließen.** Was genau darf der Hersteller prüfen, mit welcher Frist, in welchem Umfang? Diese Klausel bestimmt den Rahmen – nicht das Anschreiben des Prüfers.
    2. **Eigenen Bestand zuerst selbst ermitteln.** Man geht nicht in eine Prüfung, ohne die eigene Antwort zu kennen. Wer eine Lücke selbst findet, kann sie einordnen und vorbereiten.
    3. **Unterstützung hinzuziehen.** Spezialisierte Dienstleister für Software Asset Management kennen die Auslegung der Metriken und verhandeln sie mit. Bei größeren Beträgen gehört zusätzlich jemand mit juristischem Blick dazu.

    Und ein Schritt, der nicht auf die Liste gehört: ungeprüft Rohdaten liefern, weil jemand freundlich darum bittet.

    **2. Warum so?** – Der zentrale Punkt dieses Artikels für die Planung: Ein Audit ist **kein Zwischenfall, sondern ein vorgesehener Vorgang**. Er steht im Vertrag, den jemand unterschrieben hat. Damit ist er planbar – und alles Planbare gehört vorbereitet, nicht abgewartet.

    Der zweite Punkt ist die Verschiebung bei den Metriken. Solange nach Geräten gezählt wurde, war Lizenz-Compliance eine Inventarfrage. Sobald nach Kernen, Verbrauch oder Credits gezählt wird, ist sie eine **Betriebsfrage**: Jede Skalierung, jede neue VM, jeder Lastausgleich verändert die lizenzpflichtige Menge. Genau deshalb reicht ein Jahrestermin nicht mehr.

    **3. Auch gut wäre ...** – anzumerken, dass Audit-Klauseln verhandelbar sind, solange man noch nicht unterschrieben hat: Ankündigungsfrist, Häufigkeit, Umfang und die Frage, wer die Kosten der Prüfung trägt. Nach der Unterschrift ist diese Tür zu. Ebenfalls stark ist der Hinweis, dass ein sauberes Lizenzinventar zwei Zwecke auf einmal erfüllt – es schützt bei der Prüfung **und** deckt Überlizenzierung auf. Die Investition rechnet sich also auch dann, wenn nie ein Prüfer kommt.

    **4. Typischer Stolperstein** – ein Audit als Schuldvorwurf zu lesen und in die Verteidigung zu gehen. Es ist eine vertraglich vereinbarte Abgleichung – die überwiegende Zahl der gefundenen Differenzen entsteht aus komplexen Metriken, nicht aus Absicht. Der zweite Stolperstein ist Teil 2: die genannten Modelle als „neu" abzutun. Es sind dieselben Grundfragen wie immer – was wird gezählt, wer zahlt wie lange – nur in aktueller Verpackung.

### Aufgabe 17 – Artikel: Open-Source-Pflichten vor Gericht

!!! info "Worum es geht"
    - An echten Gerichtsverfahren sehen, dass Open-Source-Lizenzen **durchsetzbare Verträge** sind
    - Die Trennlinie zwischen Nutzung und Weitergabe an realen Fällen prüfen
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

**Artikel:** [Open Source License Compliance – Lessons from Two Landmark Court Cases (fossid.com)](https://fossid.com/articles/open-source-license-compliance-lessons-from-two-landmark-court-cases/) &nbsp;·&nbsp; Suchbegriff, falls der Link nicht mehr geht: *GPL enforcement court case*

1. **Worum ging es in den beschriebenen Verfahren?** Fasst jeden Fall in drei bis vier Sätzen zusammen.
2. **Welche Pflicht wurde jeweils verletzt?** Ordnet sie den drei Open-Source-Pflichten aus der Theorie zu.
3. **Was bedeutet es praktisch**, dass Gerichte diese Bedingungen durchsetzen? Nennt zwei Konsequenzen für einen Betrieb.
4. Ein Kollege sagt: „Open Source ist doch frei, da kann man nichts falsch machen." **Widerlegt das mit zwei konkreten Beispielen.**
5. **Was müsste ein Betrieb organisatorisch tun**, damit ihm so etwas nicht passiert?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort** – Die Fälle unterscheiden sich im Detail, das Muster ist dasselbe: Ein Unternehmen hat Open-Source-Code in ein eigenes Produkt eingebaut und dieses Produkt vertrieben, ohne die Lizenzpflichten zu erfüllen – kein Lizenztext, kein Urhebervermerk, bei Copyleft kein Quellcode. Die Gerichte haben entschieden, dass eine Open-Source-Lizenz nicht bloß eine Bitte ist: Wer ihre Bedingungen nicht einhält, hat **kein Nutzungsrecht** – und steht damit dort, wo jemand steht, der Software ohne Lizenz vertreibt.

    *Teil 2 – die verletzten Pflichten:*

    | Verletzt wurde ... | Das ist ... |
    |---|---|
    | Lizenztext und Urhebervermerk fehlten im ausgelieferten Produkt | die **Hinweis- und Copyright-Pflicht** – gilt auch bei MIT und Apache |
    | der Quellcode der Änderungen wurde nicht zugänglich gemacht | die **Quellcode-Veröffentlichung** – greift bei Copyleft ab Weitergabe |
    | das abgeleitete Produkt wurde unter eigenen, geschlossenen Bedingungen vertrieben | die **Lizenzbindung** – Ableitungen erben die Lizenz |

    *Teil 3 – zwei praktische Konsequenzen:*

    - **Eine Open-Source-Lizenz ist ein Vertrag mit Rechtsfolgen.** Verstöße können vor Gericht landen; die Ansprüche reichen vom Unterlassen über Nachlieferung des Quellcodes bis zu Schadensersatz. Im schärfsten Fall darf das eigene Produkt nicht weiter vertrieben werden – das trifft härter als jede Geldsumme.
    - **Der Ruf steht mit auf dem Spiel.** Solche Verfahren sind öffentlich – die Gemeinschaft hinter dem verletzten Projekt ist häufig genau die Gruppe, aus der ein Softwarehaus seine Fachkräfte rekrutiert.

    *Teil 4 – zwei Gegenbeispiele:*

    - **MIT ist nicht bedingungslos.** Die Lizenz ist eine halbe Seite lang und verlangt genau eine Sache: Urhebervermerk und Lizenztext mitliefern. Wer das vergisst, verstößt gegen die einfachste Open-Source-Lizenz, die es gibt.
    - **Copyleft färbt ab.** Wer GPL-Code in ein Produkt einbaut und dieses Produkt weitergibt, muss den Quellcode offenlegen. Das ist kein Randfall, sondern der Kern des Modells – und es ist genau die Konstellation, in der die Verfahren entstanden sind.

    Ergänzend richtig: Bei **AGPL** genügt schon der Betrieb als Dienst für Dritte. Man kann die Pflicht also auslösen, ohne je eine Datei herausgegeben zu haben.

    *Teil 5 – was organisatorisch nötig ist:*

    - **Wissen, was drin ist.** Ohne eine Liste der eingesetzten Komponenten samt Lizenzen ist keine dieser Pflichten erfüllbar. Ein Lizenz-Scanner im Build erzeugt diese Liste automatisch, eine SBOM hält sie fest.
    - **Regeln vor dem Einbauen.** Welche Lizenzfamilien sind für welchen Einsatzzweck erlaubt? Für internen Betrieb ist die Antwort fast immer „alle", für ein vertriebenes Produkt sieht sie anders aus.
    - **Die Hinweisdatei mitliefern.** Eine Datei mit den Lizenzhinweisen aller verwendeten Komponenten gehört zum Produkt wie das Handbuch. Sie zu erzeugen ist Fleißarbeit für ein Werkzeug – sie zu vergessen ist der häufigste Verstoß überhaupt.

    **2. Warum so?** – Die Trennlinie im Open-Source-Recht verläuft nicht zwischen „frei" und „unfrei", sondern zwischen **Nutzung und Weitergabe**. Diese Verfahren stehen alle auf der Weitergabe-Seite. Für ein Ingenieurbüro, das GPL-Software nur selbst betreibt, ändert sich durch sie nichts. Für ein Softwarehaus, das ein Produkt ausliefert, ändert sich alles.

    Der eigentliche Ertrag des Artikels ist aber ein anderer: Solange niemand klagt, wirkt eine Lizenzbedingung wie eine Empfehlung. Sobald Gerichte sie durchsetzen, ist sie das, was sie immer war – **eine Bedingung, unter der die Nutzung erlaubt ist**. Wer sie nicht erfüllt, hat kein Nutzungsrecht. Das ist die ganze Konstruktion – erstaunlich einfach.

    **3. Auch gut wäre ...** – darauf hinzuweisen, dass viele Verstöße gar nicht aus der eigenen Entwicklung stammen, sondern **eingekauft** werden: Ein Zulieferer liefert ein Gerät oder ein Modul mit Software, deren Lizenzlage niemand geprüft hat. Deshalb gehört die Frage nach Lizenzen und einer Komponentenliste in die Beschaffung, nicht nur in die Entwicklung. Ebenfalls stark ist der Hinweis, dass die meisten Projekte bei einem gemeldeten Verstoß zuerst zur Nachbesserung auffordern – die Verfahren entstehen typischerweise dort, wo darauf nicht reagiert wurde.

    **4. Typischer Stolperstein** – aus diesen Fällen zu schließen, man solle Open Source meiden. Das wäre die falsche Lehre und praktisch unmöglich: Ohne Open Source läuft in einem heutigen Stapel gar nichts. Die richtige Lehre ist, zu **wissen**, was man einsetzt. Der zweite Stolperstein ist, den internen Einsatz mit der Weitergabe zu verwechseln – die allermeisten Betriebe stehen auf der unproblematischen Seite dieser Linie und wissen es nur nicht.

### Aufgabe 18 – Artikel: Unterlizenzierung im Unternehmen

!!! info "Worum es geht"
    - Verstehen, warum Unterlizenzierung fast immer **unabsichtlich** entsteht
    - Die Mechanismen benennen, die sie so lange unsichtbar halten
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

**Artikel:** [Unterlizenzierung in Unternehmen (empowersuite.com)](https://www.empowersuite.com/de/blog/unterlizenzierung-in-unternehmen) &nbsp;·&nbsp; Suchbegriff, falls der Link nicht mehr geht: *Unterlizenzierung Software Compliance*

1. **Was bedeutet Unterlizenzierung?** Erklärt es an einem eigenen Beispiel mit Zahlen.
2. **Nennt zwei Gründe**, warum sie häufig unbemerkt bleibt.
3. **Welche Risiken entstehen**, obwohl niemand etwas Böses wollte?
4. **Warum ist Unterlizenzierung dringender als Überlizenzierung** – und warum ist Überlizenzierung trotzdem nicht harmlos?
5. **Was ist die wirksamste Gegenmaßnahme?**

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – mit Zahlen:* Unterlizenzierung heißt, dass die tatsächliche Nutzung die erworbenen Rechte übersteigt. Beispiel: Ein Betrieb hat **100 Lizenzen** für ein Zeichenprogramm gekauft, tatsächlich nutzen es aber **200 Personen**. Bezahlt wird für 100, genutzt wird doppelt so viel. Technisch läuft alles – die Software fragt nicht nach. Rechtlich fehlt für 100 Nutzungen die Grundlage.

    *Teil 2 – zwei Gründe für die Unsichtbarkeit:*

    - **Die Lizenzmodelle sind komplex.** Verschiedene Produkte zählen verschieden – Geräte, Personen, gleichzeitige Nutzer, Kerne. Wer nicht zu jedem Produkt weiß, **wonach** gezählt wird, kann die eigene Zahl gar nicht prüfen. Dazu kommt die Verwechslung von privaten und geschäftlichen Ausgaben desselben Produkts: Eine Heim- oder Bildungsversion im Betrieb einzusetzen ist ein Verstoß, auch wenn sie bezahlt wurde.
    - **Das Unternehmen wächst schneller als seine Verwaltung.** Neue Beschäftigte, neue Projekte, neue Geräte – jede einzelne Installation wirkt harmlos – niemand entscheidet bewusst, eine Grenze zu überschreiten. Ohne Dokumentation und ohne einen Ort, an dem der Bestand steht, verschiebt sich die Lage still.

    *Teil 3 – die Risiken:*

    - **Finanziell** – Nachzahlung zu Listenpreisen, häufig mit Strafaufschlag, dazu der Aufwand der Prüfung.
    - **Rechtlich** – Nutzungsuntersagung und Schadensersatzforderungen. Absicht ist keine Voraussetzung: Der Anspruch entsteht aus der fehlenden Berechtigung, nicht aus dem Vorsatz.
    - **Organisatorisch** – die Nachzahlung kommt schlagartig und ungeplant, in einem Jahr, in dem das Budget längst verteilt ist.

    *Teil 4 – die Dringlichkeit:*

    | | Unterlizenzierung | Überlizenzierung |
    |---|---|---|
    | Charakter | rechtliches Risiko | wirtschaftliches Loch |
    | Verlauf | fällt schlagartig an, von außen ausgelöst | läuft leise weiter |
    | Wer es merkt | der Hersteller beim Audit | die interne Kostenkontrolle – oder niemand |

    Unterlizenzierung ist dringender, weil sie fremdbestimmt ist: Den Zeitpunkt bestimmt der Hersteller, nicht der Betrieb. Harmlos ist Überlizenzierung deshalb trotzdem nicht – sie bindet Budget dauerhaft und zieht Wartungsgebühren auf Lizenzen nach sich, die niemand benutzt. In vielen Betrieben laufen beide gleichzeitig, weil niemand einen aktuellen Überblick hat.

    *Teil 5 – die wirksamste Gegenmaßnahme:* Ein **aktuelles Lizenzinventar mit Metrik**, geführt an denselben Auslösern wie der übrige Betrieb: Onboarding, Offboarding, jede neue Maschine, jede Vertragsverlängerung. Entscheidend ist die Angabe der Metrik – ohne sie ist die Zahl der Lizenzen nicht interpretierbar. Und: **Wer eine Lücke selbst entdeckt und schließt, verhandelt aus einer völlig anderen Position als jemand, dem sie nachgewiesen wird.**

    **2. Warum so?** – Die wichtigste Aussage dieses Artikels ist unscheinbar: Unterlizenzierung ist fast nie ein Fall von Absicht. Sie ist ein **Nebenprodukt von Wachstum**. Das ändert die richtige Reaktion grundlegend – wer sie als Disziplinproblem behandelt, sucht Schuldige; wer sie als Prozessproblem behandelt, baut Auslöser ein, an denen sie gar nicht erst entsteht.

    Der zweite Punkt: Unterlizenzierung ist ein Zustand ohne Symptome. Die Software läuft, niemand wird ausgesperrt, kein Monitoring schlägt an. Es gibt nur zwei Wege, davon zu erfahren – man sucht selbst danach, oder jemand von außen findet es. Der erste Weg ist erheblich billiger.

    **3. Auch gut wäre ...** – auf einen dritten Fall hinzuweisen, der weder Unter- noch Überlizenzierung ist und trotzdem teuer wird: die **falsche Metrik**. Wer 20 Named-User-Lizenzen für 20 Rechner kauft, an denen 35 Personen im Wechsel arbeiten, hat für jede Installation eine Lizenz und ist trotzdem im Verstoß – Named User zählt Personen, nicht Geräte. Ebenfalls stark ist der Hinweis, dass kostenlose Werkzeuge derselben Prüfung bedürfen: Genau dort entsteht Unterlizenzierung besonders leise, weil nie eine Rechnung durch den Einkauf lief.

    **4. Typischer Stolperstein** – anzunehmen, Unwissen schütze. Es schützt nicht: Verantwortlich ist das Unternehmen, unabhängig davon, wer die Software installiert hat. Der zweite Stolperstein ist, bei einem Fund erst einmal abzuwarten. Eine bekannte, aber nicht behobene Unterlizenzierung ist in der Verhandlung schlechter als eine unbekannte – und der Zeitpunkt der Prüfung liegt nicht in eurer Hand.

### Aufgabe 19 – Artikel: Der Streit um Cloud-Lizenzen

!!! info "Worum es geht"
    - Erkennen, dass Lizenzbedingungen über **Wettbewerb** entscheiden, nicht nur über Kosten
    - Die Frage „wo darf ich das betreiben?" als Teil jedes Cloud-Vergleichs verstehen
    - Theorie dazu: [Lizenzmodelle](lizenzmodelle.md)

**Artikel:** [Microsoft fights UK lawsuit over cloud computing licences (Reuters)](https://www.reuters.com/sustainability/boards-policy-regulation/microsoft-fights-28-billion-uk-lawsuit-over-cloud-computing-licences-2025-12-11) &nbsp;·&nbsp; Suchbegriff, falls der Link nicht mehr geht: *Microsoft cloud licensing lawsuit competition*

1. **Was wird dem Hersteller vorgeworfen?** Fasst den Kern in drei Sätzen zusammen.
2. **Warum ist das ein Wettbewerbsthema** und nicht nur eine Preisfrage?
3. Ein Betrieb vergleicht drei Cloud-Angebote für dieselbe Serveranwendung. **Welche Lizenzfrage muss vor dem Preisvergleich geklärt sein?**
4. **Welche Folgen hätte es für eure Planung**, wenn dieselbe Software beim Anbieter A halb so viel kostet wie bei B – allein wegen der Lizenzbedingungen?
5. **Was könnt ihr als Kunde tun**, wenn ihr in so einer Konstellation steckt? Nennt drei Möglichkeiten.

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – der Vorwurf:* In Großbritannien wurde eine Sammelklage in Milliardenhöhe gegen Microsoft eingereicht. Der Kern des Vorwurfs: Server-Lizenzen sind in der hauseigenen Cloud des Herstellers deutlich günstiger als beim Betrieb in konkurrierenden Clouds. Wer dieselbe Software woanders betreiben will, zahlt dafür mehr – nach Ansicht der Klägerseite ein Ausnutzen der starken Marktstellung bei Server-Software zugunsten des eigenen Cloud-Geschäfts.

    *Teil 2 – warum Wettbewerb:* Weil der Preisunterschied nicht aus einer Leistung entsteht, sondern aus einer **Vertragsbedingung**. Die Software ist dieselbe, die Hardware ist vergleichbar, der Aufwand für den Hersteller ist ähnlich – teurer wird es allein deshalb, weil sie bei einem Mitbewerber läuft. Damit wirkt die Lizenz wie eine Wechselgebühr: Sie verteuert nicht den Betrieb, sondern das Weggehen. Ein Kunde, der wechseln möchte, rechnet gegen einen Aufschlag an, den kein technisches Argument erklärt.

    *Teil 3 – die Frage vor dem Preisvergleich:* **Unter welchen Bedingungen darf die vorhandene Lizenz bei welchem Anbieter laufen – und was kostet sie dort?** Solange das offen ist, vergleicht man drei Angebote, deren Lizenzkosten gar nicht auf derselben Basis stehen. Konkret gehört geklärt: Ist die Lizenz im Stundenpreis enthalten oder ein eigener Posten? Darf eine eigene Kauflizenz auf gemieteter, geteilter Hardware betrieben werden? Nach welcher Metrik wird dort gezählt – und gibt es Mindestmengen?

    *Teil 4 – Folgen für die Planung:*

    - Der **Anbietervergleich verschiebt sich**: Die günstigere Infrastruktur kann durch teurere Lizenzen mehr als aufgezehrt werden. Verglichen wird deshalb die Summe aus Infrastruktur **und** Lizenz, nie eine der beiden Zahlen allein.
    - Es entsteht ein **Lock-in über den Preis** statt über die Technik. Technisch wäre der Wechsel möglich, wirtschaftlich lohnt er nicht – für die Abhängigkeit macht das keinen Unterschied.
    - Die **Bedingungen können sich ändern.** Genau das ist der Grund, warum solche Fälle vor Gericht landen: Sie wurden nachträglich verschärft. Ein Angebot, dessen Lizenzkosten heute passen, ist keine Zusage für fünf Jahre.

    *Teil 5 – drei Möglichkeiten als Kunde:*

    - **Vor dem Vertrag verhandeln**: Preisbindung über die Laufzeit, ausdrückliche Erlaubnis zum Betrieb bei Dritten, ein Änderungsvorbehalt, der zu euren Gunsten begrenzt ist.
    - **Alternativen ernsthaft prüfen**: Ein Produkt ohne solche Bindungen – häufig aus dem Open-Source-Bereich – nimmt die Frage komplett vom Tisch. Diese Prüfung kostet Zeit und ist trotzdem das stärkste Verhandlungsargument, das ihr habt.
    - **Ausstieg von Anfang an mitplanen**: Datenexport, Fristen und Migrationsaufwand vor der Unterschrift klären. Wer weiß, was ein Wechsel kostet, kann ihn androhen – und muss ihn deshalb selten durchführen.

    **2. Warum so?** – Diese Aufgabe erweitert den Blick um eine Dimension, die in Kostenrechnungen fehlt: Eine Lizenz ist nicht nur ein Preis, sondern ein **Steuerungsinstrument**. Über Metriken, Rabatte und Betriebsorte lässt sich lenken, wo Kunden ihre Systeme laufen lassen. Das ist legal, solange es den Wettbewerb nicht behindert – und wo diese Grenze verläuft, klären derzeit Gerichte und Aufsichtsbehörden.

    Für die eigene Planung folgt daraus eine einfache Regel: **Lizenzkosten sind ortsabhängig.** Wer eine Anwendung in die Cloud verlagert, verlagert nicht nur Rechenlast, sondern möglicherweise auch die Lizenzgrundlage. Diese Prüfung gehört vor die Migration, nicht in den ersten Audit-Bericht danach.

    **3. Auch gut wäre ...** – anzumerken, dass solche Verfahren Jahre dauern und der Ausgang offen ist. Für eine Planung, die in diesem Quartal entschieden wird, hilft das Verfahren nicht – die Bedingungen gelten, bis sie geändert werden. Was hilft, ist die Erkenntnis, dass Lizenzbedingungen ein Verhandlungsgegenstand sind. Ebenfalls stark ist der Hinweis, dass Aufsichtsbehörden in mehreren Ländern an derselben Frage arbeiten; wer langfristig plant, sollte solche Entwicklungen verfolgen, weil sie den Markt in beide Richtungen verändern können.

    **4. Typischer Stolperstein** – die Meldung als reine Konzern-Auseinandersetzung abzutun, die den eigenen Betrieb nichts angeht. Der Mechanismus dahinter – dieselbe Software kostet je nach Betriebsort unterschiedlich viel – trifft jeden, der eine Serveranwendung in die Cloud verlagern will, unabhängig von der Betriebsgröße. Der zweite Stolperstein ist, sich auf einen Ausgang des Verfahrens zu verlassen. Planungen bauen auf den Bedingungen von heute auf, nicht auf einem erhofften Urteil.

---

## Was du jetzt kannst

Wer diese neunzehn Aufgaben durchgearbeitet hat, hat die Lizenzseite eines Vorhabens im Griff: Du rechnest Zählweisen gegeneinander und weißt, dass die günstigste Metrik mit dem Nutzungsmuster kippt. Du vergleichst Kauf und Abo über die Nutzungsdauer bis zum Break-even und weißt, was in diesem Vergleich noch fehlt. Du beurteilst Open-Source-Pflichten an der richtigen Trennlinie zwischen Nutzung und Weitergabe, erkennst Unterlizenzierung, Überlizenzierung und die schlecht passende Metrik als drei verschiedene Probleme, rechnest eine Nutzwertanalyse und lässt sie bewusst kippen. Und du liest ein Lizenzangebot so, wie man es lesen sollte – rückwärts, beim Ausstieg beginnend. Du stellst Einzelkauf und Volumenvertrag mit Staffelpreisen gegeneinander und findest den Kipppunkt, statt ihn an der Staffelgrenze zu vermuten. Du rechnest eine kernbasierte Lizenz einmal nach zugewiesenen und einmal nach physischen Kernen durch und weißt danach, warum ein Hardware-Ticket eine Lizenzentscheidung sein kann. Du machst aus einer unordentlichen Rohliste ein Inventar, dem die entscheidende Spalte nicht fehlt. Und du erkennst die Lizenz, die bezahlt und trotzdem die falsche ist.

Dazu kommt der Blick, der über die Beschaffung hinausgeht: Du liest den Abhängigkeitsstapel eines Systems Schicht für Schicht und findest in jeder das Lizenz- und das Sicherheitsrisiko. Du machst aus einzelnen Befunden einen Prozess mit Auslösern statt einer Aufräumaktion. Du kannst zu jedem Lizenztyp Software benennen und weißt, wo die Lizenz eines Produkts überhaupt verbindlich nachzulesen ist. Und du wertest einen Fachartikel so aus, dass am Ende nicht eine Zusammenfassung steht, sondern eine Maßnahme.

!!! quote "Der Bogen ist geschlossen"
    Damit sind alle fünf Themenblöcke von [Infrastruktur & Architektur](index.md) mit eigenen Aufgabensätzen abgedeckt: vom Bedarf über die Architektur und den Speicher bis zu den Ressourcen und den Rechten, das Ganze zu betreiben. Was jetzt noch fehlt, ist die Anwendung am Stück – dafür sind die [Übungsaufgaben](uebungen.md) zur TransRegio Spedition da, in denen alle fünf Themen an einem durchgehenden Szenario zusammenlaufen.
