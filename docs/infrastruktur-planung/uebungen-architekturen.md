---
title: "Übungen: Architekturen"
description: "Neun Einzelaufgaben nur zu Architekturen: zentral gegen dezentral, den Entscheidungsweg pro Komponente, IaaS/PaaS/SaaS zuordnen, die Verantwortungstabelle an echten Betriebsaufgaben prüfen, Private und Community Cloud, vertikal gegen horizontal skalieren, Single Points of Failure finden, Homogenisierung und die Kopplung von Office-IT und Maschinenhalle. Jede Aufgabe mit ausführlicher Musterlösung."
---

# Übungen – Architekturen: zentral, dezentral, Cloud

<span class='badge badge-praxis'>Aufgaben</span> &nbsp; Neun Aufgaben, die ausschließlich um die Inhalte der Seite [Architekturen: zentral, dezentral, Cloud](architekturen.md) kreisen. Jede Aufgabe bringt ihren eigenen kleinen Fall mit – du kannst also einsteigen, wo du willst. Die große Aufgabensammlung zum durchgehenden Szenario findest du weiterhin unter [Übungsaufgaben](uebungen.md).

Arbeite wie immer: erst selbst schriftlich antworten, dann die Musterlösung aufklappen. Bei Architekturaufgaben gilt eine Besonderheit, die du dir merken solltest – **es gibt selten genau eine richtige Antwort.** Bewertet wird die Begründung. Eine gut begründete andere Zuordnung ist mehr wert als eine schwach begründete „richtige".

---

## Die Aufgaben

### Aufgabe 1 – Zentral, dezentral oder beides?

!!! info "Worum es geht"
    - Die älteste Architekturfrage an drei sehr unterschiedlichen Fällen entscheiden
    - Die Abwägung an den vier Kriterien festmachen: Administration, Ausfallwirkung, Latenz, Datenkonsistenz
    - Theorie dazu: [Architekturen: zentral, dezentral, Cloud](architekturen.md)

Drei Betriebe, drei Ausgangslagen. **Entscheide für jeden, ob die Dienste zentral oder dezentral betrieben werden sollten – und begründe mit mindestens zwei der vier Kriterien.**

| Fall | Ausgangslage |
|---|---|
| **A** | Ein Bauunternehmen betreibt drei Baustellenbüros. Angebunden sind sie per Mobilfunk, die Verbindung bricht mehrmals täglich für Minuten weg. Gearbeitet wird mit großen CAD-Plänen, teils mehrere hundert Megabyte. |
| **B** | Ein Versicherungsmakler hat fünf Filialen, alle mit Glasfaser angebunden. Im Beratungsgespräch muss immer der aktuelle Stand der Kundenakte sichtbar sein – auch wenn der Kunde gestern in einer anderen Filiale war. |
| **C** | Eine Einzelhandelskette betreibt 40 Filialen. Die Kassen müssen kassieren können, auch wenn die Leitung ausfällt. Abends laufen Umsätze und Lagerbewegungen in die Zentrale. |

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Fall | Entscheidung | Begründung |
    |---|---|---|
    | **A** | **dezentral** – lokale Ablage in jedem Büro, Abgleich im Hintergrund | **Latenz und Anbindung:** Ein zentraler Zugriff auf hunderte Megabyte über eine wackelige Mobilfunkstrecke ist unbrauchbar. **Ausfallwirkung:** Bricht die Verbindung weg, muss vor Ort weitergearbeitet werden können. Den Preis zahlst du bei der Datenkonsistenz – deshalb braucht es klare Regeln, wer welchen Plan bearbeiten darf. |
    | **B** | **zentral** | **Datenkonsistenz:** Der Beratungsfall verlangt genau eine Wahrheit; zwei Versionen einer Kundenakte sind hier ein Haftungsproblem, kein Schönheitsfehler. **Administration:** Ein System, ein Wartungsfenster, ein Backup. Die Glasfaseranbindung nimmt der Latenz ihren Schrecken. |
    | **C** | **beides – dezentral betrieben, zentral verwaltet** | **Ausfallwirkung:** Eine Kasse, die ohne Leitung nicht kassiert, ist keine Kasse. Also läuft das Kassensystem lokal in der Filiale. **Administration und Datenkonsistenz:** 40 Filialen einzeln zu pflegen ist nicht zu stemmen – Konfiguration, Preise und Software kommen zentral, die Umsätze fließen abends zentral zusammen. |

    **2. Warum so?** – Die Kriterien ziehen in verschiedene Richtungen und genau das ist der Punkt der Aufgabe. In Fall A gewinnt die Anbindung, in Fall B die Datenkonsistenz. Fall C zeigt die Auflösung, die moderne Architekturen fast überall wählen: **Man trennt, wo die Last läuft, von dem, wo die Verwaltung sitzt.** Die Filiale arbeitet autonom weiter, die Steuerung bleibt an einem Ort. Dasselbe Muster findest du im Kubernetes-Block wieder – falls du ihn schon kennst: eine API und eine Konfiguration, aber Pods auf vielen Nodes.

    Prüf bei jeder Architekturentscheidung deshalb zuerst die harte Randbedingung: **Was muss auch dann funktionieren, wenn die Leitung weg ist?** Diese Frage entscheidet öfter als jede Kostenrechnung.

    **3. Auch gut wäre ...** – in Fall A einen Mittelweg vorzuschlagen: zentrale Ablage als führender Bestand plus lokaler Zwischenspeicher, der offline weiterarbeitet und später abgleicht. Das ist technisch aufwendiger, löst aber das Konsistenzproblem sauberer als reine Inseln. In Fall B ist der Hinweis stark, dass „zentral" hier den Ausfallpunkt schafft: Steht die Zentrale, stehen alle fünf Filialen – die Konsequenz ist Redundanz an genau dieser Stelle, nicht der Rückzug ins Dezentrale. Und in Fall C ist die Anmerkung richtig, dass der abendliche Abgleich ein eigenes Risiko ist: Läuft er nicht, merkt es ohne Monitoring niemand.

    **4. Typischer Stolperstein** – „dezentral ist ausfallsicherer" als Pauschalsatz. Dezentral begrenzt die **Reichweite** eines Ausfalls, macht Ausfälle aber nicht seltener – im Gegenteil, drei alte Server in drei Büros fallen häufiger aus als ein gut gewarteter im Rechenzentrum. Der zweite Stolperstein ist, die Frage als Entweder-oder zu behandeln. Fall C ist kein Kompromiss aus Ratlosigkeit, sondern die bewusst beste Lösung.

---

### Aufgabe 2 – Wo gehört diese Komponente hin?

!!! info "Worum es geht"
    - Den **Entscheidungsweg** von der Theorieseite pro Komponente anwenden
    - Erkennen, wo ein Entscheidungsdiagramm an seine Grenze stößt
    - Theorie dazu: [Architekturen: zentral, dezentral, Cloud](architekturen.md)

Das **Möbelhaus Lindner** (drei Filialen, 120 Beschäftigte) plant seine IT neu. Fünf Komponenten stehen zur Verortung an. **Lauf für jede den Entscheidungsweg von der Theorieseite durch** – notiere den Pfad („strenge Vorgaben? → nein → schwankende Last? → …") und das Ergebnis.

1. **Warenwirtschaft mit Lagerbestand.** Muss im Lager auch dann Ware buchen können, wenn die Internetleitung ausfällt.
2. **E-Mail und Bürosoftware** für 120 Beschäftigte.
3. **Webshop.** Im Normalbetrieb wenig Last, in den vier Aktionswochen im Jahr das Zwanzigfache.
4. **Videoüberwachung der Lagerhalle.** 24 Kameras, Aufzeichnungen 30 Tage vorhalten.
5. **Lohnabrechnung.**

**Zusatzfrage:** Bei welcher Komponente liefert der Entscheidungsweg keine brauchbare Antwort – und welches Kriterium fehlt ihm?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Komponente | Pfad durch den Entscheidungsweg | Ergebnis |
    |---|---|---|
    | **Warenwirtschaft** | strenge Vorgaben? → nein → schwankende Last? → nein → fertiger Dienst? → ja, aber ... | **on-premise oder hybrid.** Der Weg würde „SaaS prüfen" sagen – die Offline-Anforderung im Lager sticht das. Ein lokaler Server in der Filiale, der zentral abgeglichen wird, trägt die Anforderung. |
    | **E-Mail und Bürosoftware** | strenge Vorgaben? → nein → schwankende Last? → nein → fertiger Dienst? → ja | **SaaS.** Der Standardfall: 120 Postfächer selbst zu betreiben bringt keinen Vorteil, den man kaufen könnte. |
    | **Webshop** | strenge Vorgaben? → nein → schwankende Last? → **ja** | **Public Cloud (IaaS oder PaaS).** Das Zwanzigfache an vier Wochen im Jahr ist das Musterprofil: Eigene Hardware müsste für die Spitze gekauft werden und langweilt sich 48 Wochen. |
    | **Videoüberwachung** | strenge Vorgaben? → **ja** (personenbezogene Daten, Aufbewahrungsfristen, Zugriffsbeschränkung) | **on-premise.** Zusätzlich ein handfestes Bandbreitenargument: 24 Kameras rund um die Uhr in die Cloud zu schieben, füllt jede Leitung. |
    | **Lohnabrechnung** | strenge Vorgaben? → **ja** (besonders schutzwürdige Daten) | **on-premise oder Private Cloud** – in der Praxis sehr häufig ausgelagert an einen spezialisierten Dienstleister mit Auftragsverarbeitungsvertrag. Auch das ist eine begründbare Antwort. |

    *Zusatzfrage:* Bei der **Warenwirtschaft** versagt der Weg. Er fragt nach Datenstandort, Lastprofil und Verfügbarkeit fertiger Dienste – aber nicht nach der **Anbindung und der Offline-Fähigkeit**. Genau daran hängt hier aber alles: Ein SaaS-Lager, das ohne Internet nicht bucht, hält den Wareneingang an.

    **2. Warum so?** – Ein Entscheidungsdiagramm ist eine Denkhilfe, kein Automat. Es bildet die häufigsten drei Kriterien ab und trifft damit die Mehrheit der Fälle. Genau deshalb gehört zu jeder Anwendung die Gegenprobe: **Passt das Ergebnis zur Wirklichkeit dieses Betriebs?** Wenn nicht, fehlt dem Diagramm ein Kriterium – und du hast eine Erkenntnis gewonnen, statt einen Fehler gemacht.

    Bemerkenswert ist auch, dass alle fünf Komponenten in derselben Firma zu **drei verschiedenen** Ergebnissen führen. Genau das ist gemeint, wenn es heißt: Hybrid ist der Normalfall. Nicht als Kompromiss, sondern weil jede Komponente ihre eigene beste Antwort hat.

    **3. Auch gut wäre ...** – beim Webshop zu prüfen, ob ein fertiger Shop-Dienst (also SaaS) das Lastproblem gleich mit erledigt: Dann skaliert der Anbieter, nicht du. Das ist für einen Möbelhändler oft die bessere Antwort als eine selbst betriebene Shop-Software auf Cloud-Servern. Bei der Videoüberwachung ist der Hinweis stark, dass es Mischformen gibt – lokale Aufzeichnung, aber zentrale Verwaltung und ein verschlüsselter Auslagerungspfad für Vorfälle. Und bei der Lohnabrechnung ist die Anmerkung richtig, dass „strenge Vorgaben" nicht automatisch „im eigenen Keller" heißt: Ein spezialisierter Dienstleister mit passendem Vertrag schützt die Daten in der Regel besser als ein Server, um den sich niemand kümmert.

    **4. Typischer Stolperstein** – dem Diagramm blind zu folgen und die Warenwirtschaft als SaaS zu verorten, weil der Pfad dort endet. Der zweite Stolperstein ist die pauschale Gleichsetzung „personenbezogene Daten = darf nicht in die Cloud". Das ist rechtlich falsch: Personenbezogene Daten dürfen verarbeitet werden, es braucht nur die passende Grundlage und Absicherung. Das Argument bei der Videoüberwachung ist nicht „verboten", sondern eine Abwägung aus Schutzbedarf, Zugriffskontrolle und ganz nüchtern Bandbreite.

---

### Aufgabe 3 – IaaS, PaaS oder SaaS?

!!! info "Worum es geht"
    - Angebote nach der einzigen Leitfrage einordnen: **Wer betreibt welche Schicht?**
    - Die Modelle an Formulierungen erkennen, wie sie in echten Angeboten stehen
    - Theorie dazu: [Architekturen: zentral, dezentral, Cloud](architekturen.md)

**Ordne jedes der acht Angebote dem Modell IaaS, PaaS oder SaaS zu** und nenne jeweils in einem Halbsatz, welche Schicht die Grenze markiert.

1. „Sie mieten eine virtuelle Maschine. Betriebssystem, Updates und Anwendung liegen bei Ihnen."
2. „Wir betreiben Ihre PostgreSQL-Datenbank inklusive Updates und Sicherung. Sie bringen Schema und Daten mit."
3. „Ticketsystem im Browser. Konto anlegen, Team einladen, loslegen."
4. „Gemanagtes Kubernetes: Sie liefern Ihre Deployments, wir patchen Control Plane und Nodes."
5. „Objektspeicher für Ihre Backups, abgerechnet pro Gigabyte und Monat."
6. „Virtuelle Netzwerke, Subnetze und Firewall-Regeln buchen Sie über unser Portal."
7. „Ihre Lohnabrechnung läuft bei uns. Sie pflegen nur die Stammdaten."
8. „Laden Sie Ihren Anwendungscode hoch – Laufzeitumgebung und Skalierung übernehmen wir."

**Zusatzfrage:** Bei welchen dieser Angebote bist du für ein Backup **deiner Daten** verantwortlich?

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Nr. | Modell | Wo die Grenze verläuft |
    |---|---|---|
    | 1 | **IaaS** | Der Anbieter endet bei der Virtualisierung, ab dem Betriebssystem bist du dran. |
    | 2 | **PaaS** | Der Anbieter betreibt Betriebssystem und Datenbank-Software; deine Ebene beginnt beim Schema. |
    | 3 | **SaaS** | Der Anbieter betreibt die komplette Anwendung; du bringst nur Nutzer und Inhalte mit. |
    | 4 | **PaaS** | Der Anbieter betreibt die Plattform (Control Plane, Nodes, Kernel); deine Ebene beginnt beim Deployment. |
    | 5 | **IaaS** | Speicher ist eine Infrastruktur-Ressource – der Anbieter liefert den Ablageraum, was hineinkommt, ist deine Sache. |
    | 6 | **IaaS** | Netzwerk ist ebenfalls Infrastruktur; die Regeln darin definierst du. |
    | 7 | **SaaS** | Fertige Fachanwendung; du hast keinen Zugriff auf Betriebssystem oder Anwendungscode. |
    | 8 | **PaaS** | Klassische Plattform-Beschreibung: Code rein, Betrieb ist Sache des Anbieters. |

    *Zusatzfrage:* **Bei allen acht.** Die oberste Zeile der Verantwortungstabelle ändert sich nie – für deine Daten bist du auf jeder Stufe verantwortlich. Was sich ändert, ist nur das **Werkzeug**: Bei IaaS legst du selbst Sicherungen an oder buchst einen Snapshot-Dienst. Bei PaaS bietet der Anbieter meist eine Wiederherstellung auf einen früheren Zeitpunkt an – du musst sie aber aktivieren und ihre Aufbewahrungsdauer kennen. Bei SaaS musst du im Vertrag nachlesen, ob und wie lange sich ein versehentlich gelöschter Datenbestand zurückholen lässt; reicht das nicht, brauchst du ein zusätzliches Backup des Dienstes.

    **2. Warum so?** – Die einzige Frage, die du brauchst, lautet: **Wo hört der Anbieter auf?** Danach ordnest du dich in der Treppe ein – Hardware, Virtualisierung, Betriebssystem, Laufzeitumgebung, Anwendung, Daten. Fällt die Grenze zwischen Virtualisierung und Betriebssystem, ist es IaaS. Fällt sie zwischen Laufzeitumgebung und Anwendung, ist es PaaS. Fällt sie zwischen Anwendung und Daten, ist es SaaS.

    Angebot 4 ist der interessanteste Fall, weil es dieselbe Technik ist, die du in minikube komplett selbst betrieben hast. Der Unterschied ist nicht das Produkt, sondern die Grenze: Sobald jemand anderes die Control Plane patcht und die Nodes tauscht, hast du eine Plattform gekauft und keine Infrastruktur.

    **3. Auch gut wäre ...** – anzumerken, dass die Grenzen in echten Angeboten weniger sauber liegen als in der Tabelle. Ein SaaS-Anbieter, der Erweiterungen per eigenem Code zulässt, verschiebt seine Grenze nach unten. Ein IaaS-Anbieter mit fertigen Betriebssystem-Abbildern und automatischem Patchdienst verschiebt sie nach oben. Die Treppe ist ein Ordnungsraster, keine Rechtsnorm. Ebenfalls stark ist der Hinweis, dass mit jeder Stufe nach oben nicht nur der Betriebsaufwand sinkt, sondern auch der Gestaltungsspielraum – und dass diese zweite Hälfte des Deals bei der Auswahl gern unterschlagen wird.

    **4. Typischer Stolperstein** – am Produktnamen zu erkennen statt an der Verantwortungsgrenze. „Kubernetes" ist keine Modellzuordnung: Selbst betrieben ist es dein Ding von der Hardware an, beim Anbieter gemanagt ist es PaaS. Der zweite Stolperstein ist die Annahme, ein Anbieter, der die Plattform hochverfügbar betreibt, sichere damit auch deine Daten. Redundanz schützt gegen Hardware-Ausfall, nicht gegen ein versehentliches `DELETE`.

---

### Aufgabe 4 – Wer macht das eigentlich?

!!! info "Worum es geht"
    - Die Verantwortungstabelle an **echten Betriebsaufgaben** prüfen statt an Schichtnamen
    - Die eine Zeile finden, die sich nie ändert
    - Theorie dazu: [Architekturen: zentral, dezentral, Cloud](architekturen.md)

Sechs Aufgaben aus dem Betriebsalltag. **Sag für jede, wer sie erledigt – du oder der Anbieter – und zwar getrennt für IaaS, PaaS und SaaS.** Wo die Antwort „kommt darauf an" lautet, schreib dazu, worauf.

| Nr. | Aufgabe |
|---|---|
| a | Ein Sicherheitsupdate für das Betriebssystem einspielen |
| b | Eine neue Version der eigenen Anwendung ausrollen |
| c | Eine defekte Festplatte im Rechenzentrum tauschen |
| d | Benutzerkonten anlegen und Berechtigungen pflegen |
| e | 2.000 versehentlich gelöschte Datensätze zurückholen |
| f | Entscheiden, welche personenbezogenen Daten überhaupt gespeichert werden |

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Nr. | IaaS | PaaS | SaaS |
    |---|---|---|---|
    | a | **du** | Anbieter | Anbieter |
    | b | **du** | **du** | entfällt – der Anbieter bestimmt, wann welche Version läuft |
    | c | Anbieter | Anbieter | Anbieter |
    | d | **du** | **du** | **du** |
    | e | **du** (aus deiner Sicherung) | **du**, mit dem Werkzeug des Anbieters (Wiederherstellung auf einen Zeitpunkt) – sofern aktiviert und die Aufbewahrungsfrist reicht | **kommt darauf an**: nur wenn der Anbieter eine Wiederherstellung anbietet und die Frist nicht abgelaufen ist. Sonst gar nicht. |
    | f | **du** | **du** | **du** |

    **2. Warum so?** – Zeile für Zeile lässt sich das an der Treppe ablesen, mit drei Beobachtungen, die über die Tabelle hinausgehen:

    **Zeile b ist die stille Nebenwirkung von SaaS.** Du rollst nichts aus – aber du entscheidest auch nicht, wann sich die Oberfläche ändert oder eine Funktion verschwindet. Was Betriebsentlastung ist, ist gleichzeitig Kontrollverlust. Genau der Deal aus dem Merksatz.

    **Zeile d ändert sich nie**, weil Identitäten und Rechte zu deiner Organisation gehören, nicht zur Plattform. Kein Anbieter weiß, wer bei dir die Personalabteilung ist. Das ist zugleich die häufigste reale Sicherheitslücke in SaaS-Umgebungen – nicht die Technik des Anbieters, sondern Konten, die nach dem Ausscheiden von Mitarbeitenden aktiv bleiben.

    **Zeile e ist die wichtigste der Aufgabe.** Der Anbieter schützt dich gegen **seine** Ausfälle, nicht gegen **deine** Fehler. Ein gelöschter Datensatz ist aus Sicht der Plattform eine korrekt ausgeführte Anweisung. Deshalb bleibt die Datenverantwortung auf allen drei Stufen bei dir – nur das Werkzeug wechselt.

    Zeile f schließlich ist gar keine technische Frage. Sie ist der Beweis dafür, dass die oberste Zeile der Verantwortungstabelle nicht durch ein Servicemodell wandern kann: Kein Anbieter kann für dich entscheiden, welche Daten du überhaupt erheben darfst.

    **3. Auch gut wäre ...** – bei Zeile a zu ergänzen, dass auch bei PaaS und SaaS **ein Zeitfenster** bleibt, das dich betrifft: Der Anbieter patcht, aber er kündigt Wartungsfenster an und deine Anwendung muss den Neustart überstehen. „Der Anbieter macht das" heißt nicht „es betrifft mich nicht". Ebenfalls stark ist der Hinweis, dass Zeile c zwar überall beim Anbieter liegt, du aber trotzdem etwas davon merkst: Bei IaaS kann der Tausch einen Neustart deiner VM bedeuten, wenn du keine Redundanz eingeplant hast.

    **4. Typischer Stolperstein** – Zeile e mit „der Anbieter macht doch Backups" zu beantworten. Anbieter sichern ihre Plattform gegen Hardware- und Rechenzentrumsausfälle. Ob sie dir eine punktgenaue Wiederherstellung deiner Daten anbieten, steht im Vertrag – und bei vielen SaaS-Diensten steht dort eine kurze Frist oder gar nichts. Der zweite Stolperstein: Zeile b bei SaaS als „der Anbieter macht das" abzuhaken, statt zu erkennen, dass die Frage sich gar nicht mehr stellt – und dass genau darin der Verlust steckt.

---

### Aufgabe 5 – Private, Public, Hybrid oder Community?

!!! info "Worum es geht"
    - Die vier Betriebsformen an der richtigen Frage unterscheiden: **Wer teilt sich die Plattform?**
    - Den häufigsten Irrtum ausräumen – Private Cloud heißt nicht „im eigenen Keller"
    - Theorie dazu: [Architekturen: zentral, dezentral, Cloud](architekturen.md)

**Ordne jede der fünf Beschreibungen einer Betriebsform zu** und nenne das entscheidende Merkmal.

1. Sieben Kliniken eines Verbunds betreiben gemeinsam eine Plattform für Bilddaten. Andere Häuser haben keinen Zugang.
2. Ein Konzern betreibt im eigenen Rechenzentrum ein Selbstbedienungs-Portal: Fachabteilungen buchen sich VMs, der Verbrauch wird intern verrechnet.
3. Ein Start-up mietet Rechenleistung, Speicher und Datenbanken bei einem großen Anbieter.
4. Die Fertigungssteuerung läuft im Werk, die Auswertung der Produktionsdaten läuft bei einem großen Anbieter.
5. Ein IT-Dienstleister betreibt in **seinem** Rechenzentrum eine dedizierte Umgebung, die exklusiv einem einzigen Kunden zur Verfügung steht.

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    | Nr. | Betriebsform | Entscheidendes Merkmal |
    |---|---|---|
    | 1 | **Community Cloud** | Mehrere Organisationen mit ähnlichen Anforderungen teilen sich eine Umgebung, die nach außen geschlossen ist. |
    | 2 | **Private Cloud** | Cloud-Eigenschaften – Selbstbedienung, Automatisierung, verbrauchsabhängige Verrechnung – auf einer Plattform, die einer Organisation allein gehört. |
    | 3 | **Public Cloud** | Ein Anbieter, viele Kunden auf gemeinsamer Infrastruktur, logisch getrennt. |
    | 4 | **Hybrid Cloud** | Bewusste Kombination: Sensibles und Echtzeitnahes bleibt lokal, Skalierbares läuft public. |
    | 5 | **Private Cloud** (gehostet beziehungsweise gemanagt) | Entscheidend ist die **Exklusivität**, nicht der Ort. Die Umgebung gehört einem Kunden allein – auch wenn das Blech einem Dienstleister gehört. |

    **2. Warum so?** – Es gibt genau eine Frage, die die vier Formen trennt: **Wer teilt sich die Plattform?** Niemand → privat. Viele Kunden eines Anbieters → public. Eine geschlossene Gruppe mit gemeinsamen Anforderungen → Community. Zwei der obigen gleichzeitig, bewusst kombiniert → hybrid.

    Fall 5 ist der Prüfungsklassiker. Viele ordnen ihn reflexhaft als Public Cloud ein, weil das Rechenzentrum jemand anderem gehört. Das verwechselt zwei Achsen: **Wem gehört die Hardware** (on-premise gegen gehostet) ist eine andere Frage als **wer teilt sie sich** (privat gegen public). Eine Private Cloud kann im eigenen Keller stehen oder beim Dienstleister gemietet sein – privat bleibt sie, solange sie nicht geteilt wird.

    Fall 2 ist die zweite lehrreiche Stelle: Ein Rechenzentrum voller VMs ist noch keine Private Cloud. Erst Selbstbedienung, Automatisierung und verbrauchsabhängige Abrechnung machen aus Virtualisierung eine Cloud. Ohne diese Eigenschaften ist es einfach ein klassisch betriebener Hypervisor.

    **3. Auch gut wäre ...** – bei Fall 1 zu erwähnen, warum die Community Cloud gerade in diesem Umfeld auftaucht: Sieben Kliniken haben identische regulatorische Anforderungen und einzeln nicht das Budget für eine eigene Plattform – gemeinsam schon. Genau dafür gibt es die Form. Ebenfalls richtig ist der Hinweis, dass Fall 5 in der Praxis meist teurer ist als Public Cloud: Exklusivität heißt, dass niemand sonst die Leerlaufzeiten bezahlt.

    **4. Typischer Stolperstein** – „privat" mit „im eigenen Haus" gleichzusetzen. Der zweite Stolperstein ist, „hybrid" als Verlegenheitsantwort zu benutzen, sobald irgendwo zwei Dinge vorkommen. Hybrid ist eine **bewusste Aufteilung entlang von Kriterien** – nicht der Zustand, dass historisch beides irgendwie da ist. Wer alles Mögliche als hybrid bezeichnet, hat den Begriff entwertet.

---

### Aufgabe 6 – Vertikal oder horizontal?

!!! info "Worum es geht"
    - Die beiden Skalierungsrichtungen an konkreten Maßnahmen erkennen
    - Verstehen, warum die eine Richtung eine harte Grenze hat und die andere nicht
    - Theorie dazu: [Architekturen: zentral, dezentral, Cloud](architekturen.md)

1. **Ordne die vier Maßnahmen ein** – vertikal oder horizontal?

    | Nr. | Maßnahme |
    |---|---|
    | a | Der Datenbankserver der Warenwirtschaft bekommt statt 32 GB nun 64 GB RAM |
    | b | Aus einem Webshop-Container werden fünf hinter einem Lastverteiler |
    | c | Im Deployment wird `replicas` von 1 auf 4 gesetzt |
    | d | Die gebuchte VM-Größe wechselt beim Anbieter von „medium" auf „large" |

2. **Welche der beiden Richtungen bedeutet in der Regel eine Unterbrechung?** Begründe.
3. **Warum lässt sich eine klassische relationale Datenbank schwerer horizontal skalieren als ein zustandsloser Webserver?**

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1:*

    | Nr. | Richtung | Kurz |
    |---|---|---|
    | a | **vertikal** | dieselbe Maschine wird größer |
    | b | **horizontal** | mehr gleiche Instanzen nebeneinander |
    | c | **horizontal** | Lehrbuchfall: vier gleiche Pods statt einem größeren |
    | d | **vertikal** | dieselbe Rolle, nur mit mehr Ressourcen |

    *Teil 2 – die Unterbrechung.* In der Regel die **vertikale** Skalierung: Um einer Maschine mehr CPU oder RAM zu geben, muss sie meist heruntergefahren und neu gestartet werden. Manche Hypervisoren und Cloud-Anbieter können RAM oder CPU im laufenden Betrieb hinzufügen, das ist aber die Ausnahme und an Bedingungen geknüpft. Horizontal skalieren kommt dagegen ohne Unterbrechung aus: Die neue Instanz startet, meldet sich am Lastverteiler an und übernimmt Anfragen – die alten laufen die ganze Zeit weiter. Genau deshalb ist horizontale Skalierung das Mittel der Wahl, wenn ein Dienst nicht stehen darf.

    *Teil 3 – warum Datenbanken sperriger sind.* Ein Webserver ohne eigenen Zustand ist beliebig vervielfältigbar: Jede Anfrage ist unabhängig, jede Instanz kann sie beantworten, es ist egal, welche es tut. Eine Datenbank hält dagegen **den Zustand** – und der muss über alle Knoten hinweg widerspruchsfrei bleiben. Zwei Knoten, die denselben Datensatz gleichzeitig ändern, brauchen ein Verfahren, das entscheidet, welche Änderung gilt. Lesende Zugriffe lassen sich noch vergleichsweise einfach verteilen (Kopien, die nur gelesen werden). Bei **schreibenden** Zugriffen wird es aufwendig – deshalb wachsen Datenbankserver in der Praxis lange Zeit vertikal, bevor jemand die Verteilung angeht.

    **2. Warum so?** – Hinter der Unterscheidung steckt eine Frage, die weit über Skalierung hinaus trägt: **Hat diese Komponente einen Zustand?** Zustandslose Komponenten skalieren horizontal, kosten wenig Nachdenken und überleben den Ausfall einzelner Instanzen. Zustandsbehaftete Komponenten – Datenbanken, Dateiablagen, Sitzungsspeicher – sind die eigentliche Arbeit jeder Architektur. Das ist auch der Grund, warum in Container-Umgebungen die Anwendung meist im Cluster liegt und die Datenbank als gemanagter Dienst dazugekauft wird.

    Und die harte Grenze der vertikalen Richtung ist banal, aber real: Irgendwann gibt es keinen größeren Server mehr zu kaufen. Bei der horizontalen Richtung stellt sich diese Frage nie – dafür verlangt sie eine Anwendung, die mitspielt.

    **3. Auch gut wäre ...** – anzumerken, dass die beiden Richtungen sich nicht ausschließen, sondern in echten Umgebungen kombiniert werden: erst die Instanz auf eine vernünftige Größe bringen (vertikal), dann davon mehrere betreiben (horizontal). Ebenfalls stark ist der Hinweis auf die Kostenseite: Vertikal wächst der Preis oft überproportional – die doppelt so große Maschine kostet mehr als das Doppelte, weil große Maschinen ein Nischenprodukt sind. Horizontal wächst er linear, dafür kommen Lastverteiler und Betriebsaufwand hinzu.

    **4. Typischer Stolperstein** – „horizontal ist immer besser". Für eine kleine Anwendung mit stabiler Last ist ein größerer Server einfacher, günstiger und schneller umgesetzt als eine verteilte Architektur samt Lastverteiler, Sitzungsverwaltung und gemeinsamem Speicher. Der zweite Stolperstein ist die Annahme, horizontales Skalieren sei eine reine Infrastrukturentscheidung. Es ist zuerst eine **Anwendungs**entscheidung: Eine Software, die Daten lokal im Arbeitsspeicher der einen Instanz hält, wird durch vier Instanzen nicht schneller, sondern kaputt.

---

### Aufgabe 7 – Single Points of Failure finden

!!! info "Worum es geht"
    - Eine Architektur auf **einzelne Punkte** abklopfen, an denen alles hängt
    - Erkennen, dass nicht jeder Ausfallpunkt ein Gerät ist
    - Theorie dazu: [Architekturen: zentral, dezentral, Cloud](architekturen.md)

So sieht die Zentrale des Möbelhauses Lindner heute aus:

- ein Internetanschluss, 100 Mbit/s, ein Anbieter
- ein Router, eine Firewall
- ein Hypervisor, darauf sechs VMs (Datei, Druck, Verzeichnisdienst, Monitoring, Testsystem, Terminalserver)
- ein NAS: darauf liegen die Dateifreigaben **und** die Backups der VMs
- die Warenwirtschaft läuft als SaaS beim Hersteller
- Administrator ist ein einzelner Kollege, seit elf Jahren im Haus

**Finde vier Single Points of Failure und schlage zu jedem eine Gegenmaßnahme vor.** Mindestens einer deiner vier Punkte darf kein Gerät sein.

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort** – vier genügen, hier sechs zur Auswahl:

    | Single Point of Failure | Wirkung im Ernstfall | Gegenmaßnahme |
    |---|---|---|
    | **Der eine Internetanschluss** | Die Warenwirtschaft läuft als SaaS – ohne Leitung steht der Verkauf, nicht nur die E-Mail. | Zweiter Anschluss über eine **andere Technik und einen anderen Anbieter** (etwa Mobilfunk als Rückfallebene), mit automatischer Umschaltung. |
    | **Der eine Hypervisor** | Sechs VMs auf einmal weg – darunter der Verzeichnisdienst, ohne den sich niemand mehr anmeldet. | Zweiter Hypervisor mit gemeinsamem Speicher, damit VMs im Fehlerfall dort neu starten. |
    | **Das eine NAS in Doppelrolle** | Dateifreigaben und Backups sterben gemeinsam – der Ausfall nimmt die Rettung gleich mit. | Backups **trennen**: eigenes Ziel, zusätzlich eine Kopie außer Haus (3-2-1). |
    | **Router und Firewall als Einzelgeräte** | Kein Zugang nach außen, damit wieder: keine Warenwirtschaft. | Ersatzgerät mit gesicherter Konfiguration im Schrank – ein Cluster, wenn die Ausfallzeit teuer ist. |
    | **Der einzelne Administrator** | Krankheit, Urlaub, Kündigung: Niemand kennt Passwörter, Verträge und Eigenheiten der Umgebung. | Vertretung aufbauen, Dokumentation erzwingen, Zugangsdaten im Vier-Augen-Verfahren hinterlegen, Rahmenvertrag mit einem Dienstleister. |
    | **Die Stromversorgung des Serverraums** | Ein Stromausfall reißt alles gleichzeitig herunter – im ungünstigen Moment mit Datenverlust. | USV für geordnetes Herunterfahren, bei höherem Anspruch ein Notstromkonzept. |

    **2. Warum so?** – Ein Single Point of Failure ist jede Stelle, deren Ausfall den Betrieb anhält, weil es keine zweite gibt. Die Suche danach ist ein mechanischer Durchgang: **Geh jede Komponente durch und streich sie gedanklich weg. Was funktioniert dann nicht mehr?** Bleibt „fast alles" übrig, hast du einen gefunden.

    Zwei Dinge machen diese Aufgabe interessant. Erstens die **SaaS-Falle**: Der Wechsel der Warenwirtschaft in die Cloud hat einen Ausfallpunkt aus dem Serverraum entfernt und dafür die Internetleitung zur Lebensader gemacht. Auslagern verschiebt Risiken, es löscht sie nicht. Zweitens der **organisatorische** Ausfallpunkt: Der Kollege mit elf Jahren Erfahrung ist der wertvollste Mensch im Haus und gleichzeitig das größte Einzelrisiko. Diese Sorte Ausfallpunkt steht in keinem Netzplan und fällt trotzdem am längsten aus – ein Router ist in zwei Tagen ersetzt, elf Jahre Wissen nicht.

    **3. Auch gut wäre ...** – zu priorisieren, statt alles gleichzeitig beheben zu wollen. Redundanz kostet und nicht jeder Punkt ist es wert: Der Ausfall des Testsystems tut niemandem weh, der Ausfall des Verzeichnisdienstes legt das Haus lahm. Eine saubere Antwort sortiert deshalb nach Ausfallwirkung mal Eintrittswahrscheinlichkeit und fängt oben an. Ebenfalls stark ist der Hinweis, dass die billigste Maßnahme in dieser Liste die Trennung von Freigaben und Backups ist – sie kostet fast nichts und entschärft das gefährlichste Szenario.

    **4. Typischer Stolperstein** – nur Geräte zu zählen. Leitungen, Verträge, Zugangsdaten und Menschen sind genauso Ausfallpunkte, oft mit der längeren Wiederherstellzeit. Der zweite Stolperstein ist, Redundanz beim selben Anbieter oder über dieselbe Technik einzukaufen: Zwei Anschlüsse desselben Anbieters durch dasselbe Kabelrohr sind ein Ausfallpunkt mit zwei Rechnungen.

---

### Aufgabe 8 – Homogenisierung: Nutzen und Grenzen

!!! info "Worum es geht"
    - Die Kosten von gewachsenem Wildwuchs **konkret** benennen
    - Erkennen, wo Vereinheitlichung an ihre Grenze stößt
    - Theorie dazu: [Architekturen: zentral, dezentral, Cloud](architekturen.md)

Beim Möbelhaus Lindner findet die Bestandsanalyse: drei Betriebssystem-Generationen auf den Servern, zwei verschiedene Virtualisierungs-Plattformen (eine kam mit einer übernommenen Filiale ins Haus), vier verschiedene Backup-Werkzeuge, dazu ein Server, der die Zuschnitt-Anlage im Lager steuert und laut Hersteller nur mit einer bestimmten, alten Betriebssystemversion freigegeben ist.

1. **Nenne drei konkrete Kosten**, die dieser Zustand im Alltag verursacht – nicht „ist unübersichtlich", sondern was er tatsächlich kostet.
2. **Welche Systeme dürfen aus guten Gründen Sonderfälle bleiben?** Nenne zwei Arten und begründe.
3. **Warum sind Container das stärkste Homogenisierungs-Werkzeug – und wo endet ihr Versprechen?**

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – drei konkrete Kosten:*

    - **Vervielfachter Pflegeaufwand:** Vier Backup-Werkzeuge heißen vier Update-Zyklen, vier Wiederherstellungsverfahren, vier Sorten Fehlermeldung – und vier Gelegenheiten, dass eines davon seit Monaten stillschweigend nicht mehr läuft.
    - **Wissen, das nicht vertretbar ist:** Für jede Sonderlocke braucht es jemanden, der sie kennt. Fällt diese Person aus, ist die Vertretung nicht handlungsfähig – der Aufwand wird zum Risiko.
    - **Automatisierung wird unmöglich:** Ein Skript, das drei Betriebssystem-Generationen und zwei Hypervisoren bedienen muss, ist teurer zu bauen und zu pflegen als die Handarbeit, die es ersetzen sollte. Also bleibt es Handarbeit.
    - Ebenfalls richtig: **doppelte Lizenz- und Wartungsverträge**, längere Störungssuche (jede Fehlermeldung muss erst der richtigen Welt zugeordnet werden) und uneinheitliche Sicherheitsstände, weil ein Härtungs-Standard nicht auf alles passt.

    *Teil 2 – legitime Sonderfälle:*

    - **Systeme mit Herstellerfreigabe an eine bestimmte Version** – wie der Steuerungsserver der Zuschnitt-Anlage. Wird er gegen den Willen des Herstellers modernisiert, verliert der Betrieb Gewährleistung und Support; bei einem Schaden steht er allein da. Die richtige Antwort ist hier nicht Vereinheitlichung, sondern **Isolation**: eigenes Netzsegment, streng begrenzte Zugänge, dokumentierter Sonderstatus.
    - **Zertifizierte oder regulierte Systeme**, bei denen jede Änderung eine erneute Prüfung oder Zulassung auslöst. Der Aufwand einer Vereinheitlichung übersteigt hier ihren Nutzen bei Weitem.
    - Ebenfalls vertretbar: Systeme kurz vor der geplanten Ablösung – sie zu homogenisieren wäre Arbeit an einem Auslaufmodell.

    *Teil 3 – Container und ihre Grenze:* Ein Container-Image bringt seine Umgebung mit. Dieselbe Anwendung läuft damit auf deinem Laptop, in minikube und im Cluster des Anbieters gleich – die Unterschiede darunter werden unsichtbar. Das ist Homogenisierung, ohne dass jemand ein Altsystem anfassen muss.

    Das Versprechen endet dort, wo es aufhört, ein Anwendungsproblem zu sein:

    - Container homogenisieren die **Anwendungsschicht**, nicht die Hosts. Die Nodes darunter brauchen weiterhin einen einheitlichen Stand – Kernel, Container-Laufzeit, Härtung, Patches.
    - Container teilen sich den **Kernel des Hosts**. Eine Anwendung, die zwingend ein anderes Betriebssystem braucht, wird durch Containerisierung nicht portabel – sie braucht weiterhin einen passenden Host.
    - Auch die **Prozessorarchitektur** bleibt sichtbar: Ein Image für die eine Architektur läuft nicht ohne Weiteres auf der anderen.
    - Und Altsysteme wie der Steuerungsserver lassen sich oft überhaupt nicht containerisieren – sie brauchen direkten Zugriff auf Hardware und Schnittstellen.

    **2. Warum so?** – Homogenisierung ist keine Ordnungsliebe, sondern eine Rechnung: **Jede zusätzliche Variante multipliziert den Betriebsaufwand, statt ihn zu addieren.** Zwei Betriebssysteme sind nicht doppelt so aufwendig wie eines, sondern mehr – weil jede Schnittstelle zwischen den Welten selbst wieder gepflegt werden will.

    Genauso wichtig ist aber die Gegenrichtung, die Teil 2 abfragt. Ein Homogenisierungs-Projekt, das keine Ausnahmen zulässt, scheitert an der Wirklichkeit oder richtet Schaden an. Die professionelle Haltung ist nicht „alles gleich", sondern: **so wenige Varianten wie möglich – und jede verbleibende bewusst entschieden, dokumentiert und isoliert.** Ein Sonderfall, den man kennt und begründet, ist kein Wildwuchs. Wildwuchs ist der Sonderfall, den niemand mehr erklären kann.

    **3. Auch gut wäre ...** – einen Weg statt eines Ziels vorzuschlagen: Wildwuchs verschwindet nicht durch ein Projekt, sondern durch eine Regel für Neues. „Ab heute kommt nichts mehr ins Haus, das nicht auf den Standard passt" halbiert das Problem über die Zeit, ohne ein einziges Altsystem anzufassen. Ebenfalls stark ist der Hinweis, dass Homogenisierung auch ein Risiko hat: Wer alles auf eine Plattform stellt, macht sich von diesem einen Hersteller abhängig – Vereinheitlichung senkt den Betriebsaufwand und erhöht die Abhängigkeit.

    **4. Typischer Stolperstein** – bei Teil 1 nur Adjektive zu liefern („unübersichtlich", „ineffizient", „unsicher"). Gefragt sind Kosten, also Stunden, Verträge, Risiken mit Namen. Der zweite Stolperstein ist, den Steuerungsserver als „müssen wir halt auch modernisieren" abzuhandeln. Genau dieser Reflex kostet Betriebe regelmäßig ihre Herstellerfreigabe – und im Schadensfall die Versicherungsleistung.

---

### Aufgabe 9 – Wenn Office-IT auf die Maschinenhalle trifft

!!! info "Worum es geht"
    - Die Kopplung zweier Welten mit **verschiedenen Anforderungen** planen
    - Rückwirkungsfreiheit als Architekturziel verstehen
    - Theorie dazu: [Architekturen: zentral, dezentral, Cloud](architekturen.md)

Das Möbelhaus Lindner will die Auslastung seiner Zuschnitt-Anlage in einem Dashboard sehen. Die Anlage hat eine Steuerung, die über ein Bussystem mit Sensoren und Antrieben spricht. Ein Kollege schlägt vor: „Wir hängen die Steuerung einfach mit ins Firmennetz, dann kommt das Dashboard direkt dran."

1. **Nenne zwei Gründe, warum dieser Vorschlag so nicht tragfähig ist.**
2. **Skizziere eine tragfähige Kopplung** – nenne drei Bausteine.
3. **Formuliere die wichtigste nicht-funktionale Anforderung** an diese Kopplung.

??? tip "Musterlösung & Erklärung"
    **1. Musterantwort**

    *Teil 1 – zwei Gründe:*

    - **Andere Fehlertoleranz.** In der Office-IT ist eine Verzögerung ärgerlich, in der Maschinenwelt gefährlich. Ein Broadcast-Sturm, ein Netzwerk-Scan oder ein überlastetes Segment sind im Büro ein Ticket – an einer laufenden Anlage können sie die Steuerung stören. Die Maschinenwelt darf nicht davon abhängen, was im Firmennetz gerade passiert.
    - **Andere Sicherheitsvoraussetzungen.** Viele Bus-Protokolle stammen aus einer Zeit abgeschotteter Netze: Sie senden unverschlüsselt und kennen oft keine Anmeldung – wer im Netz ist, darf mitreden. Im Firmennetz hängt aber auch der Rechner, an dem jemand einen Anhang öffnet. Dazu kommt: Steuerungssysteme lassen sich nicht beliebig patchen, weil ein Update die Herstellerfreigabe berührt und ein Neustart die Produktion anhält.

    *Teil 2 – drei Bausteine einer tragfähigen Kopplung:*

    - **Netztrennung**: Die Maschinenwelt bekommt ein eigenes, physisch oder logisch getrenntes Segment. Kein Gerät steht in beiden Welten gleichzeitig.
    - **Ein kontrollierter Übergang** – ein Gateway, das genau eine Aufgabe hat: Messwerte aus der Anlage abholen und in Richtung Office-IT weitergeben. Alles andere ist verboten, nicht nur unerwünscht.
    - **Eine Richtung**: Daten fließen aus der Anlage heraus, Steuerbefehle fließen nicht hinein. Das Dashboard liest, es schaltet nicht.
    - Ebenfalls richtig: **verschlüsselter Übergang** ab dem Gateway, **Protokollierung** aller Zugriffe über den Übergang sowie eine **Pufferung** der Messwerte, damit ein Ausfall auf der Office-Seite keine Rückwirkung hat.

    *Teil 3 – die wichtigste nicht-funktionale Anforderung:*

    > „Ein Ausfall, eine Überlastung oder eine Störung der Office-IT oder des Dashboards darf den Betrieb der Zuschnitt-Anlage zu keinem Zeitpunkt beeinträchtigen."

    Das ist **Rückwirkungsfreiheit** – und es ist eine nicht-funktionale Anforderung, weil sie nicht beschreibt, was das System tut, sondern unter welcher Bedingung es weiter funktionieren muss.

    **2. Warum so?** – Die Kopplung von Office-IT und Maschinenwelt ist kein Netzwerkprojekt, sondern eine **Architekturentscheidung mit einer klaren Rangfolge**: Die Produktion hat Vorrang. Alles, was du an Auswertung, Dashboard und Datenfluss baust, darf ein Zusatznutzen sein – niemals eine neue Abhängigkeit der Anlage. Aus dieser Rangfolge folgt fast alles Übrige von selbst: die Trennung, die Einbahnstraße, die Pufferung.

    Der zweite Gedanke dahinter: Die Maschinenwelt kann sich nicht anpassen. Ihre Protokolle sind alt, ihre Systeme sind an Herstellerfreigaben gebunden, ihre Wartungsfenster sind Produktionsstillstand. Also muss die Absicherung von außen dazukommen – durch Segmentierung und Gateways statt durch Änderungen an der Steuerung.

    **3. Auch gut wäre ...** – zu ergänzen, dass die Kopplung eine **organisatorische** Klärung braucht, nicht nur eine technische: Wem gehört das Gateway – der IT oder der Instandhaltung? Wer darf die Anlage abschalten, wenn der Übergang auffällig wird? Ohne diese Antworten steht das Gerät zwischen zwei Zuständigkeiten und wird von beiden Seiten nicht gepflegt. Ebenfalls stark ist der Hinweis, dass die reine Datenauswertung heute oft gar nicht mehr im Haus stattfindet, sondern in der Cloud – dann kommt zur Netztrennung noch die Frage, welche Produktionsdaten das Haus verlassen dürfen.

    **4. Typischer Stolperstein** – „dann setzen wir eben eine Firewall davor" als vollständige Antwort. Eine Firewall zwischen zwei Welten ist notwendig und reicht nicht: Sie filtert Verbindungen, sie macht aus einem unverschlüsselten Protokoll kein sicheres und sie verhindert nicht, dass ein kompromittierter Rechner im erlaubten Pfad Unsinn spricht. Der zweite Stolperstein ist, die Richtung offenzulassen. Sobald das Dashboard „auch mal etwas einstellen" können soll, ist aus der Auswertung eine Fernsteuerung geworden – mit völlig anderen Anforderungen an Absicherung und Haftung.

---

## Was du jetzt kannst

Wer diese neun Aufgaben durchgearbeitet hat, trifft Architekturentscheidungen begründet statt aus dem Bauch: Du wägst zentral gegen dezentral an vier Kriterien ab, verortest jede Komponente einzeln statt die ganze Firma pauschal, ordnest Angebote sicher in IaaS, PaaS und SaaS ein und weißt an jeder Betriebsaufgabe, wer sie erledigt – und welche Verantwortung dir kein Servicemodell abnimmt. Du unterscheidest Private, Public, Hybrid und Community an der richtigen Frage, kennst beide Skalierungsrichtungen samt ihrer Grenzen, findest Single Points of Failure auch dort, wo sie kein Gerät sind. Und du weißt, wo Vereinheitlichung nützt und wo sie schadet.

!!! tip "Weiter geht es"
    Der nächste Themenblock ist [Speicherlösungen](speicherloesungen.md) – mit eigenem Aufgabensatz unter [Übungen: Speicherlösungen](uebungen-speicherloesungen.md). Wer die Architekturfragen am durchgehenden Szenario anwenden will, findet sie in den [großen Übungsaufgaben](uebungen.md) zur TransRegio Spedition.
