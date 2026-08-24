---
title: "Übungen: Ressourcen planen"
description: "Acht Einzelaufgaben nur zur Ressourcenplanung: die vier Dimensionen an einem echten Terminkonflikt, Dreipunktschätzung rechnen, Qualifikationslücken schließen, Ressourcen nach Risiko und Verfügbarkeit bewerten, Migrationsstrategie wählen, einen Rückfallplan schreiben, CapEx gegen OpEx sortieren und eine TCO-Rechnung über fünf Jahre aufstellen. Jede Aufgabe mit ausführlicher Musterlösung."
---

# Übungen – Ressourcen planen

<span class='badge badge-praxis'>Aufgaben</span> &nbsp; Acht Aufgaben, die ausschließlich um die Inhalte der Seite [Ressourcen planen](ressourcen-planen.md) kreisen. Jede Aufgabe steht für sich. Die große Aufgabensammlung zum durchgehenden Szenario findest du unter [Übungsaufgaben](uebungen.md).

Mehrere Aufgaben verlangen eine Rechnung. Rechne **erst selbst**, dann aufklappen – bei Kostenaufgaben ist der Rechenweg wichtiger als die Endsumme, weil in Prüfung und Praxis die Annahmen bewertet werden und nicht die letzte Stelle hinter dem Komma. Alle Preise sind gerundete Beispielwerte.

---

## Die Aufgaben

### Aufgabe 1 – Vier Dimensionen, ein Engpass

!!! info "Worum es geht"
    - Ressourcen in **vier Dimensionen** sortieren statt nur ans Budget zu denken
    - Erkennen, dass der eigentliche Engpass oft aus dem Zusammenspiel entsteht
    - Theorie dazu: [Ressourcen planen](ressourcen-planen.md)

Bei der **Kessler Metallbau GmbH** (85 Beschäftigte) soll dieses Jahr die IT umgebaut werden: neue Netzwerktechnik, Virtualisierung, dazu die Anbindung der Fertigungssteuerung. Aus dem Auftaktgespräch stammen acht Aussagen.

| Nr. | Aussage aus dem Auftaktgespräch |
|---|---|
| a | „Die neuen Switches haben 8 Wochen Lieferzeit." |
| b | „Frau Berger ist die Einzige, die die Fertigungssteuerung versteht – sie ist ab Mai drei Monate in Elternzeit." |
| c | „Für dieses Jahr stehen 45.000 Euro im Budget." |
| d | „Der vorhandene Hypervisor hat noch Reserven für vier weitere VMs." |
| e | „Umgestellt werden darf nur während der Betriebsferien in den letzten beiden Augustwochen." |
| f | „Für die neue Plattform braucht das Team eine Schulung – die gibt es zweimal im Jahr." |
| g | „Die laufenden Kosten dürfen 500 Euro im Monat nicht übersteigen." |
| h | „Unser Dienstleister hat frühestens ab September wieder Kapazität." |

1. **Ordne jede Aussage einer der vier Dimensionen zu.** Wo zwei passen, nenne beide.
2. **Wo liegt der eigentliche Engpass des Projekts?** Begründe mit mindestens drei der Aussagen.
3. **Nenne zwei Auswege** aus dieser Lage.

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Nr. | Dimension |
    |---|---|
    | a | **zeitlich** (Lieferzeit), mit technischem Bezug |
    | b | **personell** |
    | c | **finanziell** |
    | d | **technisch** |
    | e | **zeitlich** |
    | f | **personell** und **zeitlich** – das Wissen fehlt und der Termin dafür ist fremdbestimmt |
    | g | **finanziell** |
    | h | **personell** (externe Kapazität) und **zeitlich** |

    *Teil 2 – der Engpass:* Nicht das Geld. Der Engpass ist das **Zeitfenster**, in dem alle nötigen Ressourcen gleichzeitig verfügbar wären – und dieses Fenster gibt es nicht:

    - Umgestellt werden darf nur in den letzten beiden Augustwochen (e).
    - Frau Berger, ohne die die Fertigungssteuerung niemand anfassen kann, ist bis Ende Juli weg (b) – sie wäre gerade eben zurück.
    - Der Dienstleister kann erst ab September (h) – also **nach** dem einzigen erlaubten Fenster.
    - Und die Hardware braucht 8 Wochen (a), muss also spätestens Mitte Juni bestellt sein.

    Das Budget von 45.000 Euro (c) ist dabei nie das Problem. Genau das ist die Pointe der Aufgabe.

    *Teil 3 – zwei Auswege* (zwei genügen):

    - **Umfang aufteilen.** Netzwerk und Virtualisierung im August umstellen – die Anbindung der Fertigungssteuerung als eigener Schritt im Herbst, wenn Frau Berger wieder da ist und der Dienstleister Kapazität hat. Ein Projekt, das nicht in ein Fenster passt, braucht zwei Fenster.
    - **Externe Kapazität früher sichern.** Den Dienstleister jetzt für August verbindlich buchen oder einen zweiten anfragen. Kapazität, die man erst im Juli anfragt, ist im August ausgebucht.
    - **Das Wissen verbreitern.** Vor der Elternzeit von Frau Berger eine zweite Person einarbeiten. Das kostet Zeit, die man im Mai noch hat – und löst nebenbei ein Risiko, das über das Projekt hinaus besteht.
    - **Das Zeitfenster hinterfragen.** „Nur in den Betriebsferien" ist eine Annahme, keine Naturkonstante. Für welche Teilschritte gilt sie wirklich? Netzwerktechnik lässt sich oft an einem Wochenende umstellen.

    **2. Warum so?** – Die vier Dimensionen sind kein Ordnungsschema für Listen, sondern ein Warnsystem. Wer nur die finanzielle Dimension prüft, bekommt hier grünes Licht: 45.000 Euro reichen. Wer alle vier prüft, sieht, dass drei davon auf denselben Zeitraum zulaufen – und dass sie sich gegenseitig blockieren.

    Genau deshalb steht in der Theorie der Satz, dass Projekte seltener an der Technik scheitern als an fehlender Zeit oder fehlendem Wissen. Aussage d ist die einzige rein technische im ganzen Gespräch und die einzige, die keine Sorgen macht.

    **3. Auch gut wäre ...** – die Abhängigkeiten als **Terminkette rückwärts** zu rechnen, statt sie einzeln zu betrachten: Umstellung Mitte August → Hardware muss zwei Wochen vorher da und aufgebaut sein → Bestellung wegen 8 Wochen Lieferzeit spätestens Anfang Juni → Freigabe des Budgets und Angebotsprüfung davor. Wer so rückwärts rechnet, findet den kritischen Termin, statt ihn zu erleben. Ebenfalls stark ist der Hinweis, dass die Schulung (f) mit ihren zwei Terminen im Jahr eine versteckte Vorlaufzeit ist: Wenn der nächste Termin erst im Oktober liegt, ist die Plattform im August unbedienbar, egal wie gut die Hardware steht.

    **4. Typischer Stolperstein** – die Dimensionen sauber zu sortieren und dann nicht weiterzudenken. Die Sortierung ist die Fingerübung, der Engpass ist die Aufgabe. Der zweite Stolperstein ist, Aussage b nur als Terminfrage zu lesen. Sie ist zuerst ein **Risiko**: Dass eine einzige Person ein produktionskritisches System versteht, ist unabhängig von jeder Elternzeit ein Problem – die Elternzeit macht es nur sichtbar.

---

### Aufgabe 2 – Dreipunktschätzung

!!! info "Worum es geht"
    - Aus drei Werten je Aufgabe eine belastbare Aussage machen
    - Am **Abstand** der Werte erkennen, wo das unerkannte Risiko sitzt
    - Theorie dazu: [Ressourcen planen](ressourcen-planen.md)

Drei Kolleginnen und Kollegen schätzen die drei Arbeitspakete des Kessler-Projekts unabhängig voneinander. Ergebnis in **Personentagen**:

| Arbeitspaket | optimistisch | realistisch | pessimistisch |
|---|---|---|---|
| Netzwerk umbauen | 3 | 4 | 6 |
| Fertigungssteuerung anbinden | 5 | 10 | 25 |
| 85 Arbeitsplätze umstellen | 6 | 8 | 11 |

1. **Welches Arbeitspaket trägt das größte Risiko?** Woran erkennst du das – ohne zu rechnen?
2. **Bilde für jedes Paket einen gewichteten Erwartungswert** nach der üblichen Formel `(optimistisch + 4 × realistisch + pessimistisch) / 6` und summiere. Vergleich das Ergebnis mit der einfachen Summe der realistischen Werte.
3. **Welche Zahl nennst du der Geschäftsführung** – und was schreibst du dazu?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – das Risikopaket:* Die **Anbindung der Fertigungssteuerung**. Erkennbar am **Abstand** zwischen optimistischem und pessimistischem Wert: 25 − 5 = **20 Personentage Spanne**, während die beiden anderen Pakete bei 3 beziehungsweise 5 Tagen Spanne liegen. Ein großer Abstand heißt: Die Schätzenden wissen selbst nicht, worauf sie sich einlassen. Genau dort sitzt das Risiko – nicht beim größten Mittelwert, sondern bei der größten Unsicherheit.

    *Teil 2 – die Rechnung:*

    ```text
    Formel:  (optimistisch + 4 x realistisch + pessimistisch) / 6

    Netzwerk:          ( 3 + 4x 4 +  6) / 6  =  25 / 6  =   4,17 Personentage
    Fertigungssteuerung:( 5 + 4x10 + 25) / 6  =  70 / 6  =  11,67 Personentage
    Arbeitsplaetze:    ( 6 + 4x 8 + 11) / 6  =  49 / 6  =   8,17 Personentage
                                                            ---------------
    Gewichtete Summe:                                       24,00 Personentage

    Zum Vergleich:
      Summe der realistischen Werte:    4 + 10 +  8  =  22 Personentage
      Summe der optimistischen Werte:   3 +  5 +  6  =  14 Personentage
      Summe der pessimistischen Werte:  6 + 25 + 11  =  42 Personentage
    ```

    Der gewichtete Wert liegt mit **24 Tagen über** der einfachen realistischen Summe von 22 Tagen. Der Grund steckt ausschließlich im zweiten Paket: Sein pessimistischer Wert liegt so weit oben, dass er den Erwartungswert nach oben zieht. Die Formel bildet damit ab, was jeder aus Erfahrung kennt – Aufgaben werden selten deutlich schneller fertig als geplant, aber regelmäßig deutlich langsamer.

    *Teil 3 – was du der Geschäftsführung sagst:*

    > „Wir rechnen mit rund **24 Personentagen**, plus 20 % offen ausgewiesener Reserve, also **29 Personentagen**. Die Bandbreite liegt zwischen 14 und 42 Tagen – die gesamte Unsicherheit steckt in der Anbindung der Fertigungssteuerung. Wir schlagen vor, dafür zuerst einen Tag Voranalyse zu investieren; danach können wir die Zahl deutlich enger angeben."

    **2. Warum so?** – Eine Dreipunktschätzung liefert zwei Informationen – die zweite ist die wertvollere. Die erste ist der Erwartungswert. Die zweite ist die **Spanne** – sie sagt dir, wie viel du deiner eigenen Schätzung glauben darfst.

    Deshalb ist die Reaktion auf Paket 2 auch nicht „mehr Puffer einplanen", sondern „vorher nachsehen". Unsicherheit lässt sich mit Geld zudecken oder mit Wissen auflösen. Ein Tag Voranalyse kostet einen Tag und kann zwanzig sparen – das ist die beste Investition im ganzen Projekt.

    Der Puffer schließlich gehört **offen** in den Plan, nicht heimlich in die Einzelposten. Ein versteckter Puffer wird in der nächsten Budgetrunde wegverhandelt, weil ihn niemand sieht und verteidigen kann. Ein offener Puffer ist verhandelbar – aber jeder weiß, worüber verhandelt wird.

    **3. Auch gut wäre ...** – anzumerken, dass Personentage noch keine Kalenderzeit sind. 29 Personentage bei einem Kollegen, der zu 50 % im Tagesgeschäft steckt, sind rund 58 Arbeitstage, also fast drei Monate – und darin ist kein Urlaub, keine Krankheit und keine Wartezeit auf Lieferungen enthalten. Diese Umrechnung wird häufiger vergessen als jede Formel. Ebenfalls stark ist der Hinweis, dass die drei Werte von **verschiedenen** Personen kommen sollten: Wo deren Schätzungen weit auseinandergehen, liegt entweder unterschiedliches Wissen oder ein unterschiedliches Verständnis der Aufgabe – beides ist es wert, ausgesprochen zu werden.

    **4. Typischer Stolperstein** – die drei Werte zu mitteln, also `(3 + 4 + 6) / 3`. Das gewichtet den realistischen Wert genauso stark wie die beiden Randfälle und liefert bei schiefen Verteilungen falsche Ergebnisse. Der Faktor 4 auf dem mittleren Wert ist genau der Punkt der Formel. Der zweite Stolperstein: den optimistischen Wert zu nennen, weil er sich im Gespräch besser anfühlt. Er beschreibt den Fall, dass **nichts** dazwischenkommt – und das ist kein Plan, sondern die unwahrscheinlichste aller Varianten.

---

### Aufgabe 3 – Wer kann das eigentlich?

!!! info "Worum es geht"
    - Eine **Qualifikationsmatrix** aufstellen und die Lücken benennen
    - Die drei Antworten auf eine Lücke bewusst wählen: schulen, einkaufen, einstellen
    - Theorie dazu: [Ressourcen planen](ressourcen-planen.md)

Für das Kessler-Projekt stehen fünf Aufgaben an. Im Haus gibt es drei Personen:

- **Herr Marx**, Administrator, seit 9 Jahren im Haus, voll verfügbar
- **Frau Berger**, Fertigungsplanung mit IT-Anteil, zu etwa 30 % verfügbar
- **eine Auszubildende** im zweiten Lehrjahr

| Aufgabe | Herr Marx | Frau Berger | Auszubildende |
|---|---|---|---|
| Netzwerk und VLANs einrichten | kann es | kann es nicht | mit Anleitung |
| Virtualisierung betreuen | kann es | kann es nicht | kann es nicht |
| Backup-Konzept aufbauen und testen | mit Anleitung | kann es nicht | kann es nicht |
| Fertigungssteuerung anbinden | kann es nicht | **kann es** | kann es nicht |
| Container-Plattform betreiben | kann es nicht | kann es nicht | kann es nicht |

1. **Benenne die drei Lücken** und entscheide für jede: schulen, einkaufen oder einstellen? Begründe.
2. **Welche Zeile ist unabhängig vom Projekt das größte Risiko** – und warum?
3. **Welcher Aufwand fehlt in dieser Matrix vollständig?**

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Lücke | Entscheidung | Begründung |
    |---|---|---|
    | **Backup-Konzept** – Herr Marx kann es nur mit Anleitung | **schulen** | Die günstigste und schnellste Lücke: Das Wissen ist halb da, es fehlt Anleitung und Übung. Das Backup wird jahrelang betrieben – dieses Wissen muss zwingend im Haus bleiben. |
    | **Container-Plattform** – niemand kann es | **einkaufen für den Aufbau, schulen für den Betrieb** | Für den Projekttermin reicht die Lernzeit nicht, also baut ein Dienstleister die Plattform auf. Parallel wird Herr Marx geschult und arbeitet mit – sonst betreibt das Haus danach etwas, das es nicht versteht. |
    | **Fertigungssteuerung** – nur Frau Berger kann es, bei 30 % Kapazität | **schulen (zweite Person aufbauen)**, ergänzt durch Wissenstransfer | Einkaufen hilft hier wenig, weil das Wissen anlagenspezifisch ist. Eine zweite Person einzuarbeiten löst gleichzeitig das Projektproblem und das Dauerrisiko. |

    *Teil 2 – das größte Risiko:* Die Zeile **Fertigungssteuerung**. Sie enthält genau ein „kann es" – und dieses eine steht bei einer Person mit 30 % Verfügbarkeit. Damit ist Frau Berger ein Engpass, durch den jede Aufgabe dieser Zeile muss – und gleichzeitig ein einzelner Ausfallpunkt: Krankheit, Urlaub, Elternzeit oder Kündigung legen ein **produktionskritisches** System still. Dieses Risiko besteht unabhängig vom Projekt und wird durch das Projekt nur sichtbar.

    *Teil 3 – der fehlende Aufwand:* Die **Lernzeit** selbst. Die Matrix sagt, wer was kann – sie sagt nicht, wie lange jemand braucht, um von „kann es nicht" auf „kann es" zu kommen – und schon gar nicht, dass diese Stunden **neben dem Tagesgeschäft** anfallen. Eine neue Plattform bedeutet für jedes Teammitglied Übungszeit; ein Plan, der die Plattform einrechnet, aber die Lernzeit nicht, hat die halbe Wahrheit aufgeschrieben.

    **2. Warum so?** – Die drei Antworten auf eine Qualifikationslücke unterscheiden sich in drei Größen: Zeit, Geld und wo das Wissen danach liegt.

    | | Dauer | Kosten | Wissen danach |
    |---|---|---|---|
    | **schulen** | mittel bis lang | mittel | bleibt im Haus |
    | **einkaufen** | sofort | hoch | geht mit dem Dienstleister |
    | **einstellen** | am längsten | langfristig am günstigsten | bleibt im Haus |

    Daraus folgt die Faustregel, die in der Musterlösung zweimal auftaucht: **Für den Aufbau einkaufen, für den Betrieb schulen.** Wer nur einkauft, hat pünktlich eine laufende Plattform und niemanden, der sie im Störungsfall versteht. Der Dienstleister ist dann nicht mehr Beschleuniger, sondern Abhängigkeit.

    **3. Auch gut wäre ...** – die Auszubildende bewusst einzuplanen statt sie als Restposten zu behandeln: „mit Anleitung" beim Netzwerk ist eine Chance, gemeinsam mit Herrn Marx zu arbeiten und dabei genau die zweite Besetzung aufzubauen, die dem Team fehlt. Ebenfalls stark ist der Hinweis, dass die Matrix zwei Spalten braucht, nicht eine: **Können** und **Zeit haben** sind verschiedene Dinge. Herr Marx kann Netzwerk und Virtualisierung – aber er kann nicht beides gleichzeitig neben dem Tagesgeschäft.

    **4. Typischer Stolperstein** – „einkaufen" als saubere Lösung zu behandeln, weil sie im Projektplan alle Lücken schließt. Sie schließt sie **für die Projektdauer**. Der zweite Stolperstein ist, die Zeile mit dem einzigen Könner als Stärke zu lesen („wir haben ja jemanden dafür"). Genau eine Person, die etwas kann, ist die Definition eines Engpasses – und je wichtiger das System, desto teurer wird dieser Engpass genau dann, wenn es ungünstig ist.

---

### Aufgabe 4 – Drei Fragen an jede Ressource

!!! info "Worum es geht"
    - Ressourcen nach **Risiko, Verfügbarkeit und Nachhaltigkeit** bewerten
    - Aus einer Liste einen Plan machen
    - Theorie dazu: [Ressourcen planen](ressourcen-planen.md)

**Bewerte die vier Positionen anhand der drei Kriterien** – je ein bis zwei Sätze pro Feld. Nenne zum Schluss, welche Position du als Erstes absichern würdest.

| Nr. | Position |
|---|---|
| 1 | Zwei neue Server, Lieferzeit laut Angebot 8 Wochen |
| 2 | Frau Berger als einzige Wissensträgerin der Fertigungssteuerung |
| 3 | Der externe Dienstleister, der die Migration begleiten soll |
| 4 | Weiterverwendung von 20 vorhandenen Arbeitsplatzrechnern, 4 Jahre alt |

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Position | Risiko | Verfügbarkeit | Nachhaltigkeit |
    |---|---|---|---|
    | **1 – zwei neue Server** | Verzögert sich die Lieferung, verschiebt sich das gesamte Umstellungsfenster. Das Risiko ist nicht der Server, sondern der Termin. | 8 Wochen sind eine Zusage, keine Garantie. Bestellung muss mit Reserve erfolgen, Liefertermin schriftlich. | Energieverbrauch im Dauerbetrieb, erwartete Nutzungsdauer 5 Jahre, Herstellersupport prüfen. Neue Geräte brauchen deutlich weniger Strom als die abzulösenden. |
    | **2 – Frau Berger** | **Höchstes Risiko der Liste.** Ausfall, Elternzeit oder Kündigung legen ein produktionskritisches System still – und zwar ohne Ersatzmöglichkeit am Markt, weil das Wissen anlagenspezifisch ist. | 30 % Kapazität, zeitweise gar nicht verfügbar. Jede Aufgabe dieser Art muss durch diesen Flaschenhals. | Nicht übertragbar, solange es nur in einem Kopf steckt. Dokumentation und eine zweite eingearbeitete Person sind die einzige nachhaltige Antwort. |
    | **3 – Dienstleister** | Der Anbieter ist ausgebucht, priorisiert einen größeren Kunden oder stellt eine andere Person als besprochen. | Frühestens ab September – das schlägt direkt auf das Zeitfenster durch. | Kauft Kapazität, aber kein bleibendes Wissen. Ohne Wissenstransfer entsteht eine Abhängigkeit, die jedes Jahr Geld kostet. |
    | **4 – 20 alte Rechner** | Gering für das Projekt, steigend für den Betrieb: 4 Jahre alte Geräte fallen häufiger aus und laufen irgendwann aus dem Herstellersupport. | Sofort verfügbar – der einzige Posten ohne Wartezeit. | Zwei Seiten: Weiterverwenden spart Anschaffung und vermeidet Elektroschrott. Dagegen steht der höhere Stromverbrauch. |

    *Zur Nachhaltigkeit von Position 4 lohnt eine kurze Rechnung.* Angenommen, ein alter Rechner zieht im Mittel 45 Watt mehr als ein neues Gerät und läuft 2.000 Stunden im Jahr:

    ```text
    Mehrverbrauch je Geraet:   0,045 kW x 2.000 h  =    90 kWh pro Jahr
    20 Geraete:                90 kWh x 20         = 1.800 kWh pro Jahr
    Bei 0,30 EUR/kWh:          1.800 x 0,30        =   540 EUR pro Jahr
    Ueber 3 Jahre:                                  = 1.620 EUR
    ```

    1.620 Euro über drei Jahre sind deutlich weniger als 20 neue Rechner kosten würden – wirtschaftlich trägt die Weiterverwendung also. Das eigentliche Gegenargument ist ein anderes: **Sicherheitsupdates und Support.** Sobald die Geräte aus der Herstellerunterstützung fallen, ist die Rechnung hinfällig, weil dann nicht mehr Strom gegen Anschaffung steht, sondern Anschaffung gegen ein Sicherheitsrisiko.

    *Was zuerst absichern?* **Position 2.** Sie hat die höchste Ausfallwirkung, die geringste Verfügbarkeit und die einzige Gegenmaßnahme, die Vorlaufzeit braucht. Server kann man nachbestellen, Dienstleister wechseln, Rechner ersetzen – Wissen im Kopf eines Menschen lässt sich nicht kurzfristig beschaffen.

    **2. Warum so?** – Die drei Kriterien fragen nacheinander: **Was, wenn es fehlt? Ist es rechtzeitig da? Trägt es über die Nutzungsdauer?** Erst die Kombination ergibt eine Rangfolge. Position 1 hat ein hohes Terminrisiko, aber eine klare Gegenmaßnahme (früh bestellen). Position 2 hat ein hohes Risiko **und** eine schlechte Verfügbarkeit **und** eine Gegenmaßnahme, die Monate braucht – deshalb steht sie oben.

    Auffällig ist, dass die riskanteste Position der Liste kein Gerät ist. Das ist kein Zufall: In den meisten Vorhaben ist die kritischste Ressource ein Mensch – und Menschen tauchen in keiner Bestellliste auf.

    **3. Auch gut wäre ...** – bei Position 1 die klassische Gegenmaßnahme zu nennen: den Liefertermin verbindlich zusagen lassen und parallel ein Alternativangebot einholen, damit der Wechsel nicht bei null beginnt. Bei Position 3 ist der Vorschlag stark, den Wissenstransfer **vertraglich** zu verankern – gemeinsame Arbeit statt Übergabe am Ende, dokumentierte Konfiguration als Teil der Leistung. Und bei Position 4 ist der Hinweis richtig, dass die Entscheidung nicht pauschal fallen muss: Die Rechner der Fertigung, die nur ein Terminal bedienen, laufen problemlos weiter – die der Konstruktion mit rechenintensiver Software vielleicht nicht.

    **4. Typischer Stolperstein** – Nachhaltigkeit als Umweltthema abzuhandeln und dann abzuhaken. Sie fragt hier nach der **Tragfähigkeit über die Nutzungsdauer** und hat damit eine ökologische und eine wirtschaftliche Seite; Position 4 zeigt beide. Der zweite Stolperstein ist, aus der Bewertung keine Reihenfolge abzuleiten. Eine Bewertung, die alle vier Positionen gleich behandelt, hat nichts entschieden – der Zweck der drei Fragen ist, zu wissen, wo man anfängt.

---

### Aufgabe 5 – Welche Migrationsstrategie?

!!! info "Worum es geht"
    - Big Bang, schrittweise und Parallelbetrieb an konkreten Fällen unterscheiden
    - Die Wahl als **Zeit-Geld-Risiko-Abwägung** begründen
    - Theorie dazu: [Ressourcen planen](ressourcen-planen.md)

**Wähle für jeden der drei Fälle eine Migrationsstrategie und begründe mit mindestens zwei der drei Größen Zeit, Geld und Risiko.**

| Fall | Vorhaben |
|---|---|
| **A** | Die Telefonanlage wird auf IP-Telefonie umgestellt. Die Rufnummern werden zu einem festen Termin zum neuen Anbieter übertragen – ab diesem Zeitpunkt ist die alte Anlage tot. |
| **B** | Der Fileserver wird durch eine zentrale Ablage ersetzt. 85 Beschäftigte in sechs Abteilungen, jede mit eigenen Ordnerstrukturen. |
| **C** | Ein neues ERP-System löst die gesamte Auftragsabwicklung ab: Angebote, Aufträge, Lieferscheine, Rechnungen. |

**Zusatzfrage:** Was ist das größte praktische Problem beim Parallelbetrieb?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Fall | Strategie | Begründung |
    |---|---|---|
    | **A** | **Big Bang** – erzwungen | **Risiko:** Es gibt keine Wahl. Mit der Rufnummernportierung ist die alte Anlage in dem Moment tot, in dem die neue lebt; ein Nebeneinander ist technisch nicht möglich. **Zeit und Geld** sprechen ebenfalls dafür: keine Übergangsphase, keine doppelten Kosten. Der Preis ist das fehlende Netz – also braucht dieser Fall den ausführlichsten Rückfallplan von allen dreien. |
    | **B** | **schrittweise**, Abteilung für Abteilung | **Risiko:** Jeder Schritt bleibt klein. Läuft es in der ersten Abteilung schief, sind fünf Kollegen betroffen und nicht 85 – und die Erfahrung fließt in die nächste Abteilung ein. **Zeit:** Der Umstieg zieht sich, dafür braucht kein einziger Termin ein Wochenende mit Vollbelastung. |
    | **C** | **Parallelbetrieb** | **Risiko:** Ein ERP trägt die gesamte Auftragsabwicklung – ein misslungener Stichtag bedeutet, dass das Unternehmen weder liefern noch fakturieren kann. Das Alte als Rückzugsort ist hier jeden Euro wert. **Geld:** Der Preis sind doppelte Lizenzen, doppelte Pflege und Personal, das eine Zeit lang zweimal erfasst – bewusst akzeptiert. |

    *Zusatzfrage – das größte praktische Problem:* **Welcher Datenstand gilt?** Solange beide Systeme laufen, entstehen in beiden Daten. Wird ein Auftrag nur im neuen System erfasst, fehlt er im alten – und der Rückweg ist verbaut. Wird alles doppelt erfasst, kostet das Personal und erzeugt Abweichungen, sobald jemand einmal vergisst. Deshalb braucht jeder Parallelbetrieb vorab eine klare Regel: **Welches System ist führend, wer erfasst wo und wie werden die Bestände abgeglichen?** Wer das erst während des Parallelbetriebs klärt, hat am Ende zwei unvollständige Datenbestände statt einem vollständigen.

    **2. Warum so?** – Die drei Strategien tauschen dieselben drei Größen gegeneinander:

    | Strategie | Zeit | Geld | Risiko |
    |---|---|---|---|
    | **Big Bang** | wenig | wenig | **viel** |
    | **Schrittweise** | mittel | mittel | mittel |
    | **Parallelbetrieb** | viel | viel | **wenig** |

    Die Wahl folgt deshalb nicht dem Geschmack, sondern der Frage: **Wie viel Risiko trägt dieses System?** Bei einem ERP hängt der Umsatz daran, bei einer Dateiablage die Bequemlichkeit – entsprechend unterschiedlich darf man einkaufen.

    Fall A ist der lehrreichste, weil die Strategie dort gar nicht gewählt wird: Manche Umstellungen **sind** ein Big Bang, weil ein Nebeneinander technisch ausgeschlossen ist. Die richtige Reaktion ist dann nicht, sich eine andere Strategie zu wünschen, sondern das Risiko dort abzufangen, wo es abfangbar ist – mit Vorbereitung, Test und Rückfallplan.

    **3. Auch gut wäre ...** – bei Fall B eine **Pilotabteilung** vorzuschlagen und sie bewusst zu wählen: nicht die größte und nicht die kritischste, aber eine mit wohlwollenden Kollegen und typischen Abläufen. Der Pilot ist die einzige Stelle im ganzen Projekt, an der Fehler noch billig sind. Bei Fall C ist der Hinweis stark, dass Parallelbetrieb ein **Enddatum** braucht: Ohne festgelegten Abschalttermin läuft das Altsystem noch Jahre mit, weil sich niemand traut, es abzuschalten – und die doppelten Kosten werden dauerhaft. Und bei Fall A ist es richtig, den Termin bewusst zu legen: eine Umstellung am Freitagabend gibt zwei Tage Puffer, eine am Montagmorgen keinen.

    **4. Typischer Stolperstein** – Parallelbetrieb als „die sicherste und deshalb beste" Strategie zu wählen. Er ist die sicherste und die teuerste; für eine Dateiablage wäre er Verschwendung. Der zweite Stolperstein ist, Big Bang als Anfängerfehler abzutun. Bei erzwungenen Stichtagen ist er die einzige Möglichkeit – und bei kleinen, gut verstandenen Umstellungen ist er die vernünftigste, weil eine Übergangsphase mehr Probleme schafft als löst.

---

### Aufgabe 6 – Der Rückfallplan

!!! info "Worum es geht"
    - Vor der Umstellung beantworten, **was passiert, wenn es nicht klappt**
    - Einen Rückfallplan schreiben, der um zwei Uhr nachts trägt
    - Theorie dazu: [Ressourcen planen](ressourcen-planen.md)

Die Umstellung der Telefonanlage aus Fall A ist geplant: Freitag, 18 Uhr, das Team hat das Wochenende. Montag um 7 Uhr müssen 85 Beschäftigte telefonieren können.

**Schreib den Rückfallplan.** Er soll fünf Punkte enthalten. Formuliere jeden so konkret, dass ihn auch jemand ausführen könnte, der nicht an der Planung beteiligt war.

**Zusatzfrage:** Warum reicht es nicht, den Rückweg aufzuschreiben?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort** – ein Rückfallplan, der trägt:

    | Punkt | Inhalt |
    |---|---|
    | **1. Abbruchkriterium** | Woran erkennen wir, dass es nicht klappt? Konkret: „Wenn bis Samstag 12 Uhr nicht alle sechs Abteilungen intern und extern telefonieren können und keine Anrufe von außen ankommen, wird abgebrochen." Ein Kriterium ohne Uhrzeit und ohne Messbarkeit ist keins. |
    | **2. Point of no return** | Bis wann ist der Rückweg überhaupt noch offen? „Rückkehr zur alten Anlage ist bis Sonntag 18 Uhr möglich; danach ist die Rufnummernübertragung beim alten Anbieter endgültig abgeschlossen." Diesen Zeitpunkt muss man vorher beim Anbieter erfragen – er ist der wichtigste Termin des ganzen Wochenendes. |
    | **3. Wer entscheidet** | Namentlich, mit Vertretung und erreichbarer Telefonnummer. „Die Abbruchentscheidung trifft Herr Marx, in seiner Abwesenheit Frau Berger. Erreichbar unter …". Um zwei Uhr nachts darf niemand suchen müssen, wer entscheiden darf. |
    | **4. Der Weg zurück, in Schritten** | Was genau ist zu tun: alte Anlage wieder in Betrieb nehmen, Konfiguration aus der gesicherten Datei einspielen, Verkabelung zurückstecken (Bild vom Vorher-Zustand liegt bei), Rückportierung beim Anbieter auslösen – mit der Nummer der Störungshotline und der Vertragsnummer. Dazu die Angabe, wie lange der Rückweg dauert. |
    | **5. Kommunikation** | Wer informiert wen: Geschäftsführung, Empfang, Vertrieb, gegebenenfalls Kunden. Dazu ein vorbereiteter Text und die Regel, wie Montagmorgen kommuniziert wird, falls doch nicht alles läuft. |

    *Zusatzfrage – warum Aufschreiben nicht reicht:* Weil ein ungetesteter Rückweg genauso unsicher ist wie der Hinweg. Steht in Punkt 4 „Konfiguration aus der gesicherten Datei einspielen" und stellt sich am Samstagnachmittag heraus, dass die Sicherung unvollständig ist oder das Format nicht mehr passt, ist der Rückfallplan Papier. Deshalb gehört zur Vorbereitung mindestens: die Sicherung der alten Konfiguration **testweise zurückspielen**, die alte Anlage nicht sofort abbauen und den Zustand vor dem Umbau fotografieren.

    Dazu kommt der menschliche Teil: Um zwei Uhr nachts nach zwölf Stunden Arbeit trifft niemand gute Entscheidungen. Genau deshalb steht das Abbruchkriterium **vorher** fest – es ist der Beschluss der ausgeruhten Version des Teams, an den sich die müde Version halten kann.

    **2. Warum so?** – Ein Rückfallplan ist kein Pessimismus, sondern die Bedingung dafür, dass man überhaupt starten darf. Er beantwortet vier Fragen, die im Ernstfall alle gleichzeitig gestellt werden: Ist das schon der Ernstfall? Können wir noch zurück? Wer sagt es an? Wie geht es konkret?

    Der wichtigste der fünf Punkte ist der **Point of no return**, weil er der einzige ist, der sich nicht beeinflussen lässt. Er ergibt sich aus der Technik oder aus dem Vertrag – und er entscheidet, wie viel Zeit das Team für seine Versuche hat. Wer ihn nicht kennt, merkt erst nach dem Überschreiten, dass es keinen Rückweg mehr gibt.

    Das Prinzip begegnet dir im Kleinen bei `helm rollback`: genau so ein vorbereiteter Weg zurück – bekannt, geübt, ein Befehl. Bei einer Infrastruktur-Migration wird er nicht mitgeliefert. Er muss geplant werden.

    **3. Auch gut wäre ...** – einen sechsten Punkt zu ergänzen: **Was gilt als Erfolg?** Ein Plan, der nur den Abbruch definiert, lässt offen, wann das Team nach Hause darf. Ebenfalls stark ist der Hinweis, dass Punkt 4 **Zeitangaben** braucht: „Der Rückweg dauert etwa drei Stunden" ist die Information, die das Abbruchkriterium aus Punkt 1 überhaupt erst berechenbar macht – wer um 18 Uhr am Sonntag zurückmuss und drei Stunden braucht, muss um 15 Uhr entscheiden, nicht um 17:45 Uhr.

    **4. Typischer Stolperstein** – „im Notfall spielen wir das Backup zurück" als Rückfallplan zu verkaufen. Das ist eine Absichtserklärung ohne Kriterium, ohne Frist, ohne Zuständigkeit und ohne Test. Der zweite Stolperstein ist, den Rückfallplan erst am Umstellungstag zu schreiben. Er gehört in die Planung, weil er Vorbereitungen auslöst – die alte Anlage stehen lassen, die Konfiguration sichern, den Point of no return beim Anbieter erfragen. Wer ihn am Freitag um 17 Uhr schreibt, stellt fest, dass die Hälfte davon nicht mehr möglich ist.

---

### Aufgabe 7 – CapEx, OpEx und die Frage, ab wann es sich lohnt

!!! info "Worum es geht"
    - Kostenpositionen sicher in **Investition** und **laufenden Betrieb** einsortieren
    - Den Punkt ausrechnen, ab dem Pay-as-you-go teurer wird als Besitz
    - Theorie dazu: [Ressourcen planen](ressourcen-planen.md)

1. **Sortiere die neun Positionen in CapEx und OpEx.**

    | Nr. | Position |
    |---|---|
    | a | Kauf von zwei Servern |
    | b | Die monatliche Cloud-Rechnung |
    | c | Verkabelung des neuen Anbaus |
    | d | Wartungsvertrag für die Firewall |
    | e | Strom für den Serverraum |
    | f | Kauflizenz für die CAD-Software |
    | g | Abo für die Bürosoftware |
    | h | Gehalt des Administrators |
    | i | Anschaffung einer USV |

2. Eine virtuelle Maschine kostet beim Cloud-Anbieter **0,20 Euro je Stunde**. Ein vergleichbarer eigener Server kostet **3.000 Euro** und wird über **5 Jahre** abgeschrieben. **Ab wie vielen Betriebsstunden im Monat kostet die Cloud-VM mehr als die Abschreibung des eigenen Servers?**
3. Nimm für den eigenen Server zusätzlich **80 Watt** Dauerverbrauch bei **0,30 Euro/kWh** an. **Wie verschiebt sich der Punkt?**
4. **Warum ist diese Rechnung trotzdem unvollständig?** Nenne je zwei fehlende Posten auf beiden Seiten.

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – die Sortierung:*

    | CapEx – einmalige Investition | OpEx – laufende Ausgabe |
    |---|---|
    | a – Kauf von zwei Servern | b – monatliche Cloud-Rechnung |
    | c – Verkabelung des Anbaus | d – Wartungsvertrag Firewall |
    | f – Kauflizenz CAD-Software | e – Strom für den Serverraum |
    | i – Anschaffung einer USV | g – Abo für die Bürosoftware |
    | | h – Gehalt des Administrators |

    *Teil 2 – der Punkt ohne Strom:*

    ```text
    Abschreibung eigener Server:  3.000 EUR / 60 Monate  =  50,00 EUR je Monat

    Break-even:  50,00 EUR / 0,20 EUR je Stunde  =  250 Stunden je Monat
                 250 h / 30 Tage                 =  rund 8,3 Stunden je Tag
    ```

    Ab **250 Betriebsstunden im Monat** kostet die Cloud-VM mehr als die reine Abschreibung.

    *Teil 3 – mit Strom:*

    ```text
    Stromkosten:  0,08 kW x 720 h  =  57,6 kWh je Monat
                  57,6 kWh x 0,30 EUR  =  17,28 EUR je Monat

    Eigener Server gesamt:  50,00 + 17,28  =  67,28 EUR je Monat

    Break-even:  67,28 EUR / 0,20 EUR je Stunde  =  336 Stunden je Monat
                 336 h / 30 Tage                 =  rund 11,2 Stunden je Tag
    ```

    Der Punkt wandert von 250 auf **336 Stunden**. Zur Einordnung: Eine Testumgebung, die nur zur Arbeitszeit läuft, kommt auf rund 176 Stunden im Monat – sie liegt klar darunter, die Cloud ist günstiger. Eine VM im Dauerbetrieb kommt auf 720 Stunden und kostet 144 Euro im Monat – sie liegt klar darüber.

    *Teil 4 – was fehlt:*

    | Beim eigenen Server fehlen | Bei der Cloud fehlen |
    |---|---|
    | Stellplatz, Kühlung, USV-Anteil, Brandschutz | Kosten für Speicher über das Grundpaket hinaus |
    | Admin-Zeit für Betrieb, Patches, Störungen | Kosten für ausgehenden Datenverkehr |
    | Ersatzteile und Ausfallrisiko ohne Redundanz | ein Backup-Dienst, falls nicht enthalten |
    | Betriebssystem-Lizenz, Entsorgung am Ende | die Anbindung: Ohne tragfähige, notfalls redundante Leitung ist die VM nicht erreichbar |

    **2. Warum so?** – CapEx und OpEx unterscheiden sich nicht am Betrag, sondern am **Charakter**: einmal für Besitz gegen laufend für Betrieb. Die praktische Bedeutung steckt in der Flexibilität – gekauft ist gekauft, ein Abo ist kündbar. Deshalb ist die Cloud-Entscheidung immer auch eine Entscheidung über die Kostenstruktur, nicht nur über die Kostenhöhe.

    Teil 2 und 3 zeigen den Kern von Pay-as-you-go: **Der Stundenpreis ist nur dann ein Vorteil, wenn nicht rund um die Uhr Stunden anfallen.** Und Teil 3 zeigt die zweite Hälfte der Wahrheit: Auch der gekaufte Server hat laufende Kosten – die Anschaffung ist CapEx, aber Strom, Kühlung und Betreuung sind OpEx und laufen daneben weiter. „CapEx gegen OpEx" beschreibt den Schwerpunkt, nicht eine saubere Trennung.

    **3. Auch gut wäre ...** – anzumerken, dass abschaltbare Umgebungen nur sparen, wenn sie **wirklich abgeschaltet werden**. Eine Testumgebung, die jemand freitags vergisst, läuft übers Wochenende 48 Stunden für knapp 10 Euro – das summiert sich über ein Jahr auf mehr, als die geplante Nutzung kostet. Automatische Zeitpläne sind deshalb kein Komfort, sondern Teil der Kalkulation. Ebenfalls stark ist der Hinweis, dass Cloud-Anbieter für planbare Dauerlast **reservierte Kapazität** zu deutlich niedrigeren Preisen anbieten – die Rechnung oben vergleicht Stundenpreis gegen Besitz, nicht Cloud gegen Keller.

    **4. Typischer Stolperstein** – bei Position e und h zu zögern, weil beides irgendwie „Grundkosten" sind. Beide sind eindeutig OpEx: Sie fließen laufend, damit der Betrieb weiterläuft. Der zweite Stolperstein ist Teil 3 falsch zu lesen: Der Break-even verschiebt sich **nach oben**, weil der eigene Server durch den Strom teurer wird – die Cloud darf also länger laufen, bevor sie im Vergleich verliert.

---

### Aufgabe 8 – Die Gesamtrechnung: TCO über fünf Jahre

!!! info "Worum es geht"
    - Alle Kosten über die Nutzungsdauer zusammenrechnen statt Preisschilder zu vergleichen
    - Erkennen, wie stark die Personalzeit den Vergleich verschiebt
    - Theorie dazu: [Ressourcen planen](ressourcen-planen.md)

Kessler Metallbau soll eine Anwendung fünf Jahre lang betreiben. Zwei Angebote liegen vor:

**Variante 1 – eigener Server**

- Anschaffung: 6.000 Euro
- Stromverbrauch: 150 Watt im Dauerbetrieb, 0,30 Euro/kWh, 8.760 Stunden im Jahr
- Wartungsvertrag: 600 Euro pro Jahr
- Administration: 2 Stunden pro Monat, intern kalkuliert mit 60 Euro pro Stunde

**Variante 2 – Cloud**

- 220 Euro pro Monat, Betrieb der Plattform inklusive
- Administration: 0,5 Stunden pro Monat, ebenfalls 60 Euro pro Stunde

1. **Rechne die TCO beider Varianten über 5 Jahre aus.**
2. Der Einkauf sagt: „6.000 gegen 13.200 Euro – der eigene Server gewinnt doch klar." **Was entgegnest du?**
3. **Ab welchem monatlichen Cloud-Preis kippt der Vergleich** zugunsten des eigenen Servers?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – die beiden Gesamtrechnungen:*

    ```text
    VARIANTE 1 - eigener Server, 5 Jahre

      Anschaffung                                          6.000,00 EUR
      Strom      0,15 kW x 8.760 h  = 1.314 kWh je Jahr
                 1.314 kWh x 0,30 EUR = 394,20 EUR je Jahr
                 394,20 x 5                                1.971,00 EUR
      Wartung    600 EUR je Jahr x 5                        3.000,00 EUR
      Admin      2 h/Monat x 12 x 60 EUR = 1.440 EUR/Jahr
                 1.440 x 5                                  7.200,00 EUR
                                                          --------------
      TCO Variante 1                                       18.171,00 EUR

    VARIANTE 2 - Cloud, 5 Jahre

      Cloud      220 EUR/Monat x 60 Monate                 13.200,00 EUR
      Admin      0,5 h/Monat x 12 x 60 EUR = 360 EUR/Jahr
                 360 x 5                                    1.800,00 EUR
                                                          --------------
      TCO Variante 2                                       15.000,00 EUR

      Differenz zugunsten der Cloud                         3.171,00 EUR
    ```

    *Teil 2 – die Entgegnung:*

    > „Die 6.000 Euro sind der Kaufpreis, nicht die Kosten. Über fünf Jahre kommen Strom, Wartungsvertrag und vor allem Administration dazu – zusammen 12.171 Euro, also gut das Doppelte der Anschaffung. Der größte Posten ist dabei nicht die Technik, sondern unsere eigene Arbeitszeit: 7.200 Euro. In der Cloud-Rechnung sind Betrieb, Strom und Hardware-Tausch schon enthalten. Ein fairer Vergleich stellt deshalb Gesamtkosten gegen Gesamtkosten – und dann liegt die Cloud um 3.171 Euro vorn."

    *Teil 3 – der Kipppunkt:*

    ```text
    TCO Variante 1                        18.171,00 EUR
    - Admin-Anteil der Cloud-Variante      1.800,00 EUR
                                          --------------
    Budget fuer die reine Cloud-Leistung  16.371,00 EUR

    16.371,00 EUR / 60 Monate  =  272,85 EUR je Monat
    ```

    Ab einem Cloud-Preis von rund **273 Euro im Monat** wird der eigene Server günstiger. Das Angebot über 220 Euro hat also gut 50 Euro Luft nach oben, bevor die Entscheidung kippt – nützlich zu wissen, wenn der Anbieter Preisanpassungsklauseln im Vertrag hat.

    **2. Warum so?** – Die Rechnung macht sichtbar, was beim Kaufpreisvergleich unsichtbar bleibt: **Der größte Einzelposten in Variante 1 ist die Personalzeit.** 7.200 Euro Administration übersteigen die Anschaffung. Genau diese Position steht auf keiner Rechnung, sondern in der Gehaltsabrechnung – deshalb wird sie in Vergleichen so zuverlässig vergessen.

    Der zweite Grund, warum erst TCO vergleichbar macht: Die Cloud-Rechnung ist ein **Paketpreis**. Sie enthält Strom, Kühlung, Hardware-Tausch, Redundanz und einen Teil des Betriebs. Beim eigenen Server stehen dieselben Leistungen auf vier verschiedenen Rechnungen und in Arbeitszeit. Wer Mietpreis gegen Kaufpreis stellt, vergleicht ein Rundum-Paket mit einem nackten Blech.

    Und Teil 3 zeigt, wozu eine TCO-Rechnung darüber hinaus taugt: Sie liefert nicht nur ein Ergebnis, sondern eine **Grenze**. Ab wann kippt die Entscheidung? Diese Zahl ist im Vertragsgespräch mehr wert als das Ergebnis selbst.

    **3. Auch gut wäre ...** – die Annahmen offenzulegen und zu hinterfragen, statt sie zu übernehmen. Sind 2 Stunden Administration im Monat realistisch – oder werden es bei Störungen mehr? Läuft der Server wirklich fünf Jahre – oder braucht er nach vier Jahren neue Platten? Ist der Cloud-Preis für fünf Jahre garantiert? Eine TCO-Rechnung ist nur so gut wie ihre Annahmen – und die gehören sichtbar dazugeschrieben. Ebenfalls stark ist der Hinweis auf Posten, die in **beiden** Varianten fehlen: In Variante 1 der Stellplatz und das Ausfallrisiko ohne zweiten Server, in Variante 2 der Datenverkehr und die Frage, was passiert, wenn die Internetleitung ausfällt.

    **4. Typischer Stolperstein** – die eigene Arbeitszeit mit null anzusetzen, weil „der Kollege ist ja sowieso da". Das ist buchhalterisch bequem und sachlich falsch: Die Stunden, die in den Serverbetrieb fließen, fehlen woanders. Wer sie nicht einrechnet, rechnet jede Eigenbetriebs-Variante systematisch schön. Der zweite Stolperstein ist, aus dem Ergebnis eine allgemeine Regel zu machen. Hier gewinnt die Cloud um 3.171 Euro – bei anderem Lastprofil, größerem Umfang oder mehreren Systemen auf demselben Server kann dieselbe Rechnung genau andersherum ausgehen.

---

## Was du jetzt kannst

Wer diese acht Aufgaben durchgearbeitet hat, plant Vorhaben so, dass Engpässe am Planungstisch auffallen statt im fünften Monat: Du sortierst Ressourcen in vier Dimensionen und findest den Engpass dort, wo sie sich überschneiden. Du rechnest eine Dreipunktschätzung, liest aus der Spanne das Risiko heraus und weist den Puffer offen aus. Du schließt Qualifikationslücken bewusst mit schulen, einkaufen oder einstellen, bewertest jede Position nach Risiko, Verfügbarkeit und Nachhaltigkeit und wählst die Migrationsstrategie als Zeit-Geld-Risiko-Abwägung – mit einem Rückfallplan, der auch nachts um zwei trägt. Und du rechnest Kosten so, wie sie tatsächlich anfallen: als Gesamtkosten über die Nutzungsdauer, inklusive der eigenen Arbeitszeit.

!!! tip "Weiter geht es"
    Ein Kostenblock fehlt in diesen Rechnungen noch – oft ist er einer der größten: die Lizenzen. Der nächste Themenblock ist [Lizenzmodelle](lizenzmodelle.md), mit eigenem Aufgabensatz unter [Übungen: Lizenzmodelle](uebungen-lizenzmodelle.md). Wie sich Ressourcenfragen im großen Szenario auswirken, zeigen die [Übungsaufgaben](uebungen.md) zur TransRegio Spedition.
