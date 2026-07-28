---
title: "Übungen: Lizenzmodelle"
description: "Acht Einzelaufgaben nur zu Lizenzmodellen: die günstigste Zählweise ausrechnen, Kauf und Abo bis zum Break-even vergleichen, Open-Source-Pflichten an vier Fällen beurteilen, Unter- und Überlizenzierung erkennen, eine Nutzwertanalyse rechnen und kippen lassen, Vertragslücken finden, mit nachträglichen Lizenzänderungen umgehen und Lizenzkosten in der Cloud verorten. Jede Aufgabe mit ausführlicher Musterlösung."
---

# Übungen – Lizenzmodelle

<span class='badge badge-praxis'>Aufgaben</span> &nbsp; Acht Aufgaben, die ausschließlich um die Inhalte der Seite [Lizenzmodelle](lizenzmodelle.md) kreisen. Jede Aufgabe steht für sich. Die große Aufgabensammlung zum durchgehenden Szenario findest du unter [Übungsaufgaben](uebungen.md).

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

## Was du jetzt kannst

Wer diese acht Aufgaben durchgearbeitet hat, hat die Lizenzseite eines Vorhabens im Griff: Du rechnest Zählweisen gegeneinander und weißt, dass die günstigste Metrik mit dem Nutzungsmuster kippt. Du vergleichst Kauf und Abo über die Nutzungsdauer bis zum Break-even und weißt, was in diesem Vergleich noch fehlt. Du beurteilst Open-Source-Pflichten an der richtigen Trennlinie zwischen Nutzung und Weitergabe, erkennst Unterlizenzierung, Überlizenzierung und die schlecht passende Metrik als drei verschiedene Probleme, rechnest eine Nutzwertanalyse und lässt sie bewusst kippen. Und du liest ein Lizenzangebot so, wie man es lesen sollte – rückwärts, beim Ausstieg beginnend.

!!! quote "Der Bogen ist geschlossen"
    Damit sind alle fünf Themenblöcke von [Infrastruktur & Architektur](index.md) mit eigenen Aufgabensätzen abgedeckt: vom Bedarf über die Architektur und den Speicher bis zu den Ressourcen und den Rechten, das Ganze zu betreiben. Was jetzt noch fehlt, ist die Anwendung am Stück – dafür sind die [Übungsaufgaben](uebungen.md) zur TransRegio Spedition da, in denen alle fünf Themen an einem durchgehenden Szenario zusammenlaufen.
