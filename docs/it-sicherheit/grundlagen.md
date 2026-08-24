---
title: "Grundlagen & Schutzziele"
description: "Die drei Schutzziele Vertraulichkeit, Integrität und Verfügbarkeit mit typischen Verletzungen, warum in Produktion und Anlagen die Verfügbarkeit zuerst kommt und Safety dazutritt, die erweiterten Ziele Authentizität, Verbindlichkeit und Zurechenbarkeit, die saubere Abgrenzung von Informationssicherheit, IT-Sicherheit und Datenschutz, die Schutzbedarfskategorien mit Maximumprinzip, Kumulations- und Verteilungseffekt, das Begriffsdreieck aus Bedrohung, Schwachstelle und Risiko, Angreifertypen und ihre Motive sowie die Grundprinzipien minimale Rechte, Standardverweigerung, mehrschichtige Verteidigung, Aufgabentrennung und Härtung."
---

# Grundlagen & Schutzziele

<span class='badge badge-pruefung'>Prüfungsrelevant</span> &nbsp; Bevor man Sicherheit *macht*, muss man wissen, **was** man eigentlich schützt – und **wogegen**. Genau das klären die Schutzziele.

„Das muss aber sicher sein.“ Kaum ein Satz fällt in Betriebsbesprechungen so oft und bleibt so folgenlos. Er klingt nach einer Anforderung, ist aber keine: Er sagt nicht, was passieren darf und was nicht, er lässt sich nicht prüfen, und er hilft bei keiner einzigen Entscheidung. Erst wenn jemand nachfragt – *sicher wogegen? sicher für wen? und was darf das kosten?* – wird aus dem Wunsch eine Aufgabe. Die Schutzziele sind das Vokabular für genau diese Nachfrage. Sie zerlegen das große Wort „Sicherheit“ in drei bis sechs Fragen, die man einzeln beantworten, einzeln begründen und einzeln überprüfen kann. Wer sie beherrscht, kann in einer Besprechung sagen, welches Ziel eine Maßnahme schützt und welches sie nebenbei beschädigt – und das ist der Unterschied zwischen Sicherheitsarbeit und Sicherheitsgefühl.

!!! abstract "Was du auf dieser Seite lernst"
    - die drei klassischen Schutzziele **Vertraulichkeit, Integrität, Verfügbarkeit** – jeweils mit typischen Verletzungen aus dem Betriebsalltag
    - warum in **Produktion und Anlagentechnik** die Verfügbarkeit meist zuerst kommt und **Betriebssicherheit (Safety)** als eigenes Ziel dazutritt
    - die erweiterten Ziele **Authentizität, Verbindlichkeit und Zurechenbarkeit** und worauf sie aufbauen
    - wie sich **Informationssicherheit, IT-Sicherheit und Datenschutz** sauber voneinander abgrenzen – die häufigste Vermischung in Prüfungsaufgaben
    - wie man den **Schutzbedarf** feststellt: normal, hoch, sehr hoch – mit Maximumprinzip, Kumulations- und Verteilungseffekt
    - welche **Angreifertypen** es gibt, was sie antreibt – und welche **Grundprinzipien** unabhängig von der Technik immer gelten

---

## „Sicher“ ist kein Zustand, sondern eine Richtung

Ein Haus ist auch nicht einfach „sicher“. Es ist sicher **gegen Einbruch**, wenn Schlösser, Fenster und Beleuchtung stimmen. Es ist sicher **gegen Feuer**, wenn Rauchmelder, Fluchtwege und Brandabschnitte stimmen. Und es ist sicher **gegen Wasserschaden**, wenn Dach, Rückstauklappe und Abdichtung stimmen. Die drei Fragen haben fast nichts miteinander zu tun: Das beste Schloss der Welt hilft gegen kein einziges Feuer, und ein Rauchmelder hält keinen Einbrecher auf. Wer ein Haus absichern will, muss die Fragen deshalb **einzeln** stellen – sonst kauft er dreimal dasselbe und lässt zwei Risiken unberührt.

In der Informationssicherheit ist es genauso, nur heißen die Fragen anders. Sie lauten:

- Sehen die Informationen nur die, die sie sehen dürfen? → **Vertraulichkeit**
- Sind die Informationen noch die, die sie sein sollten? → **Integrität**
- Sind sie da, wenn jemand sie braucht? → **Verfügbarkeit**

Diese drei heißen zusammen die **Schutzziele der Informationssicherheit**, im Englischen nach den Anfangsbuchstaben **CIA** – *Confidentiality, Integrity, Availability*. Die Abkürzung hat nichts mit dem Geheimdienst zu tun, taucht aber in jeder englischsprachigen Quelle auf, deshalb sollte man sie kennen.

Der praktische Wert dieser Dreiteilung zeigt sich in dem Moment, in dem eine Maßnahme auf dem Tisch liegt. Jede Maßnahme lässt sich auf mindestens ein Schutzziel zurückführen – und wer sie nicht zuordnen kann, hat entweder das Ziel nicht verstanden oder die Maßnahme nicht gebraucht.

| Maßnahme | schützt vor allem | und nebenbei |
|---|---|---|
| Festplattenverschlüsselung auf Notebooks | Vertraulichkeit | – |
| Prüfsumme nach einer Datenübertragung | Integrität | – |
| Zweiter Internetanschluss über einen anderen Anbieter | Verfügbarkeit | – |
| Backup auf ein getrenntes, schreibgeschütztes Medium | Verfügbarkeit | Integrität (Rückfallpunkt auf einen sauberen Stand) |
| Persönliche Benutzerkonten statt eines geteilten Kontos | Zurechenbarkeit | Vertraulichkeit (Rechte lassen sich einzeln vergeben) |
| Digitale Signatur unter einem Firmware-Paket | Authentizität | Integrität (Veränderung fällt beim Prüfen auf) |

---

## Die drei Schutzziele im Einzelnen

### Vertraulichkeit – nur wer darf, bekommt es zu sehen

**Vertraulichkeit** bedeutet: Informationen sind ausschließlich Befugten zugänglich. „Befugt“ ist dabei eine organisatorische Festlegung, keine technische – die Technik setzt sie nur durch.

Im Betrieb hängt an diesem Ziel mehr, als man auf Anhieb denkt: Gehaltsdaten und Personalakten, Konstruktionszeichnungen und Rezepturen, Angebotskalkulationen vor der Abgabe, Kundenlisten, Verträge, medizinische Befunde – und in manchen Branchen Dinge, die sofort einleuchten, wenn man sie ausspricht. Ein Gebäudetechnikbetrieb hat die **Schließpläne und Alarmanlagen-Dokumentationen seiner Kunden** in der Ablage. Wer die abgreift, braucht danach keine Hackerwerkzeuge mehr.

Typische Verletzungen sehen selten nach Angriff aus:

- eine Freigabe auf dem Dateiserver, die „vorübergehend“ für alle geöffnet wurde und seit drei Jahren offen ist
- eine Mail an den falschen Verteiler oder ein falsch ausgewählter Empfänger in der Autovervollständigung
- ein ausgemustertes Notebook, das ohne Löschung des unverschlüsselten Datenträgers weitergegeben wird
- ein Cloud-Speicher, dessen Freigabelink „für jeden mit dem Link“ gilt und in einer Mail landet
- der Blick über die Schulter im Zug, das Telefonat auf dem Bahnsteig, der Ausdruck im Drucker im Flur
- unverschlüsselter Datenverkehr in einem Gastnetz oder Hotel-WLAN

!!! warning "Die Verletzung, die man nicht bemerkt und nicht rückgängig machen kann"
    Vertraulichkeit hat eine unangenehme Eigenschaft, die sie von den anderen beiden Zielen unterscheidet: **Ihre Verletzung fällt oft gar nicht auf – und wenn sie auffällt, ist sie nicht reparierbar.** Ein ausgefallener Server lässt sich wieder starten, eine verfälschte Datei aus dem Backup zurückholen. Aber Wissen, das abgeflossen ist, holt niemand zurück. Deshalb sind bei diesem Schutzziel **vorbeugende** Maßnahmen – Rechte, Verschlüsselung, Trennung – so viel wichtiger als reagierende.

### Integrität – die Daten sind noch die, die sie waren

**Integrität** bedeutet: Informationen sind vollständig, korrekt und unverfälscht – und wenn sie es doch einmal nicht sind, fällt das auf. Der zweite Halbsatz ist der entscheidende. Kein System kann jede Veränderung verhindern; ein gutes System kann jede Veränderung **erkennbar** machen.

Woran das im Betrieb hängt: Stücklisten und Fertigungsparameter, Messwerte aus der Qualitätssicherung, Preise und Konditionen im Warenwirtschaftssystem, Bankverbindungen in Stammdaten, Konfigurationsdateien, Firmware auf Steuerungen und – leicht übersehen – die Protokolldateien selbst.

Typische Verletzungen:

- ein Import läuft zweimal, Bestände und Aufträge sind doppelt gebucht
- ein Sollwert in der Anlagensteuerung wird versehentlich um eine Kommastelle verschoben
- eine Stammdatenänderung setzt in einer Rechnung eine andere Bankverbindung ein („Rechnungsbetrug“)
- ein stiller Lesefehler auf einem Speichermedium verändert einzelne Blöcke, ohne dass jemand es merkt
- ein Angreifer räumt nach dem Zugriff die Protokolle auf und verwischt seine Spuren
- eine Software-Aktualisierung wird aus einer Quelle bezogen, deren Echtheit niemand geprüft hat

!!! danger "Die gefährlichste Integritätsverletzung ist die leise"
    Ein Ausfall meldet sich von selbst: Das Telefon klingelt, die Fertigung steht, jemand kümmert sich. Eine verfälschte Zahl meldet sich nicht. Sie wird weiterverarbeitet, in Berichte übernommen, an Kunden geschickt und in Backups mitgesichert. Bis der Fehler auffällt, liegt er in jeder Sicherung, die man zurückspielen könnte. Genau deshalb gehören zu diesem Schutzziel nicht nur Schutzmaßnahmen, sondern **Erkennungsmaßnahmen**: Prüfsummen, Signaturen, Plausibilitätsprüfungen, Vier-Augen-Prinzip bei kritischen Änderungen und eine Versionierung, die auch weit zurückreicht.

### Verfügbarkeit – da, wenn es gebraucht wird

**Verfügbarkeit** bedeutet: Informationen und Dienste sind zum vereinbarten Zeitpunkt in der vereinbarten Zeit nutzbar. Das „vereinbart“ ist wichtig – Verfügbarkeit ohne Bezugsgröße ist keine Anforderung. Ein Auswertungssystem, das nur montags gebraucht wird, hat andere Anforderungen als eine Kassensoftware im Einzelhandel.

Typische Verletzungen sind der Alltag jeder Betriebsmannschaft: Hardwaredefekt, Stromausfall, ausgefallene Klimatisierung, volle Datenträger, überlastete Leitungen, ein abgelaufenes Zertifikat, eine nicht verlängerte Lizenz, ein missglücktes Update, ein Überlastungsangriff aus dem Netz – und, mit Abstand am teuersten, Verschlüsselungstrojaner, die Verfügbarkeit und Integrität in einem Zug treffen.

Verfügbarkeit ist zugleich das Schutzziel, für das am ehesten Geld bewilligt wird, weil seine Verletzung als Einzige **sofort und für jeden sichtbar** ist. Das führt zu einer typischen Schieflage: Betriebe mit doppelter Firewall, doppeltem Server und doppelter Leitung, bei denen gleichzeitig jeder Mitarbeitende in jeden Ordner schauen darf.

| Schutzziel | Leitfrage | typische Verletzung | Fällt sie auf? | erste Maßnahmen |
|---|---|---|---|---|
| **Vertraulichkeit** | Sieht es nur, wer darf? | offene Freigabe, Mail an falschen Empfänger, verlorenes Notebook | oft nie | Berechtigungskonzept, Verschlüsselung, Klassifizierung, Trennung von Netzen |
| **Integrität** | Ist es noch richtig und vollständig? | Doppelbuchung, verfälschter Sollwert, manipulierte Stammdaten | oft spät | Prüfsummen, Signaturen, Vier-Augen-Prinzip, Änderungsverfahren, Versionierung |
| **Verfügbarkeit** | Ist es da, wenn es gebraucht wird? | Defekt, Stromausfall, Überlast, Ransomware | sofort | Redundanz, Backup und geübte Wiederherstellung, Kapazitätsplanung, Wartung, Monitoring |

!!! warning "Die Ziele arbeiten gegeneinander – das ist normal, nicht falsch"
    Fast jede Maßnahme, die ein Ziel stärkt, schwächt ein anderes. Ein paar Beispiele, die in jeder Praxis vorkommen:

    - **Verschlüsselung** stärkt die Vertraulichkeit. Ohne Verfahren zur Schlüsselhinterlegung vernichtet sie die Verfügbarkeit vollständig – ein verlorener Schlüssel ist ein endgültiger Datenverlust.
    - **Das Vier-Augen-Prinzip** stärkt Integrität und Zurechenbarkeit. Wenn nachts nur eine Person erreichbar ist, verhindert es genau dann die Störungsbehebung, wenn sie gebraucht wird.
    - **Mehr Backup-Kopien an mehr Orten** stärken die Verfügbarkeit. Jede Kopie ist zugleich ein weiterer Ort, an dem vertrauliche Daten liegen.
    - **Strenge Sperrzeiten und lange Passwörter** stärken die Vertraulichkeit. Werden sie unpraktikabel, klebt der Zettel am Monitor – und das Ziel ist schlechter erfüllt als vorher.

    Daraus folgt die vielleicht wichtigste Einsicht dieser Seite: **Man kann nicht alle Ziele gleichzeitig maximieren, man muss sie gewichten.** Diese Gewichtung ist eine Entscheidung des Betriebs, keine der IT – und sie gehört aufgeschrieben, damit sie später nachvollziehbar ist.

---

## Wenn die Reihenfolge kippt: Produktion, Anlagen und OT

In der Büro-IT lautet die stillschweigende Rangfolge meist **Vertraulichkeit vor Integrität vor Verfügbarkeit**. Ein Mailserver, der zwei Stunden steht, ist ärgerlich; eine Personalakte, die im Internet auftaucht, ist ein Vorfall mit Meldepflicht.

In der Produktions- und Anlagentechnik – üblicherweise **OT** genannt, für *Operational Technology* – dreht sich die Reihenfolge um: **Verfügbarkeit vor Integrität vor Vertraulichkeit**, im Englischen entsprechend **AIC** statt CIA. Der Grund ist wirtschaftlich und physikalisch zugleich. Eine Fertigungslinie, die steht, kostet ab der ersten Minute Geld, das nicht nachgeholt werden kann. Und die Daten, die dort fließen, sind Temperaturen, Drehzahlen und Positionswerte – für Außenstehende weitgehend wertlos, für die Anlage lebenswichtig.

| | Büro-IT | Produktion / OT |
|---|---|---|
| Rangfolge der Schutzziele | Vertraulichkeit → Integrität → Verfügbarkeit | Verfügbarkeit → Integrität → Vertraulichkeit |
| Lebensdauer der Systeme | drei bis fünf Jahre | zehn bis zwanzig Jahre und mehr |
| Aktualisierung | regelmäßig, teils automatisch | nur mit Freigabe des Anlagenherstellers, oft im Jahresstillstand |
| Neustart zum Testen | jederzeit möglich | bedeutet Produktionsstillstand |
| Zeitverhalten | Verzögerungen sind unschön | Verzögerungen sind funktionsrelevant (Echtzeit) |
| Protokolle | authentifiziert und verschlüsselt | historisch oft ohne jede Authentifizierung gebaut |
| Wer entscheidet | IT-Leitung | Produktions- und Anlagenverantwortung |

Aus dieser Tabelle folgt die praktische Konsequenz, die in Prüfungsaufgaben gern abgefragt wird: **In der OT verbietet sich das Standardrezept der Büro-IT.** Man kann eine Steuerung nicht einfach patchen, weil ein Update ohne Herstellerfreigabe die Gewährleistung und im Zweifel die Betriebserlaubnis kostet. Wenn das Patchen ausfällt, muss der Schutz von außen kommen – durch **Segmentierung**: eigene Netzbereiche für die Anlagentechnik, kontrollierte Übergänge zur Büro-IT, keine direkte Verbindung ins Internet, Fernwartungszugänge nur zeitlich befristet und protokolliert. Wie das technisch aussieht, steht unter [Segmentierung & VPN](../netzwerke/segmentierung-und-vpn.md); die Eigenheiten der Feldbus- und Automatisierungsprotokolle stehen unter [Industrie-Protokolle](../netzwerke/industrie-protokolle.md).

### Safety und Security – ein deutsches Wort für zwei Dinge

Das Deutsche hat für zwei sehr verschiedene Sachverhalte nur das eine Wort „Sicherheit“. Im Englischen sind es zwei:

- **Safety** – Betriebssicherheit oder funktionale Sicherheit: Die Anlage darf **Menschen und Umwelt nicht schaden**. Not-Halt-Schalter, Lichtschranken an der Presse, Schutztüren mit Verriegelung, Abschaltung bei Übertemperatur.
- **Security** – Angriffssicherheit: Die Anlage muss vor **unbefugtem Zugriff und Manipulation** geschützt sein. Zugangskontrolle, Netztrennung, Authentifizierung, Protokollierung.

Sobald Anlagen vernetzt werden, hängen beide zusammen – und zwar in beide Richtungen. Ein Angriff auf die Steuerung kann eine Safety-Funktion aushebeln, indem er einen Grenzwert verschiebt oder eine Verriegelung überbrückt; dann wird aus einem IT-Problem eine Gefahr für Menschen. Umgekehrt darf eine Security-Maßnahme keine Safety-Funktion behindern: Ein Schutzsystem, das bei Angriffsverdacht automatisch die Steuerung abschaltet, kann in einem laufenden Prozess genau dadurch einen gefährlichen Zustand erzeugen.

!!! tip "Dieselbe Frage, zwei entgegengesetzte richtige Antworten"
    Sehr anschaulich wird der Unterschied am Verhalten im Fehlerfall. Was soll eine Komponente tun, wenn sie ausfällt?

    - Eine **Fluchttür** mit elektrischem Schloss muss bei Stromausfall **aufgehen** – Safety zuerst. Das nennt man *fail safe*.
    - Eine **Firewall** muss bei einem Fehler **dichtmachen** – Security zuerst. Das nennt man *fail secure*.

    Beide Antworten sind richtig, und beide Male ist es dasselbe deutsche Wort. Wer in einer Aufgabenstellung über „Sicherheit“ liest, sollte deshalb zuerst klären, welche der beiden gemeint ist. In der Anlagentechnik ist die Antwort fast immer: beide.

---

## Die erweiterten Schutzziele

Die drei klassischen Ziele reichen aus, um Daten zu beschreiben – aber nicht, um **Handlungen** zu beschreiben. Sobald es um Vorgänge zwischen Menschen und Systemen geht, kommen drei weitere Ziele dazu.

| Ziel | Frage, die es beantwortet | typische Verletzung | typische Maßnahmen |
|---|---|---|---|
| **Authentizität** | Ist das wirklich der, der er zu sein behauptet – und ist das wirklich das Original? | gefälschte Absenderadresse, untergeschobenes Update, vorgetäuschter Anruf der Geschäftsführung | Signaturen, Zertifikate, Mehr-Faktor-Anmeldung, Rückrufverfahren, Prüfung von Bezugsquellen |
| **Verbindlichkeit** (Nichtabstreitbarkeit) | Kann der Urheber die Handlung später bestreiten? | eine Freigabe, die niemand mehr zugeben will; ein Auftrag ohne belastbaren Nachweis | qualifizierte elektronische Signatur, Zeitstempel, revisionssichere Ablage |
| **Zurechenbarkeit** | Lässt sich jede Handlung genau einer Person zuordnen? | fünf Personen kennen dasselbe Administratorkennwort | persönliche Konten, keine Sammelkonten, Protokollierung, synchrone Zeitquelle |

Diese drei Ziele sind keine Ergänzung nach Geschmack, sondern **bauen auf den ersten dreien auf**. Zurechenbarkeit setzt Protokolle voraus, die vollständig (Verfügbarkeit) und unverfälscht (Integrität) sind – wer die Protokolle löschen oder ändern kann, für den existiert keine Zurechenbarkeit. Und Verbindlichkeit setzt Authentizität voraus: Eine Unterschrift, deren Echtheit man nicht prüfen kann, verpflichtet niemanden.

!!! example "Warum ein geteiltes Administratorkonto ein Sicherheitsproblem ist"
    In vielen kleineren Betrieben arbeiten drei bis fünf Personen mit demselben privilegierten Konto. Das ist bequem, spart die Rechteverwaltung und funktioniert – bis etwas passiert.

    Angenommen, in einer Nacht wird eine Firewall-Regel geändert, die den Fernzugriff öffnet. Am Morgen ist der Betrieb kompromittiert. Im Protokoll steht: „administrator“. Damit ist **jede** der fünf Personen gleichermaßen verdächtig und keine überführbar. Der Verdacht bleibt an allen hängen, aufklären lässt sich nichts, und Konsequenzen kann niemand ziehen. Es kommt schlimmer: Auch der Beschäftigte, der vor vier Monaten ausgeschieden ist, kennt das Kennwort noch – und niemand weiß, ob es seitdem geändert wurde.

    Das ist keine Frage von Misstrauen, sondern von **Nachvollziehbarkeit**. Persönliche Konten schützen im Regelfall vor allem die Beschäftigten selbst: Wer nachweisen kann, dass er es nicht war, steht besser da als jemand, bei dem es niemand nachweisen kann.

---

## Informationssicherheit, IT-Sicherheit und Datenschutz sauber trennen

Diese drei Begriffe werden im Alltag – und in Aufgabenstellungen – regelmäßig durcheinandergeworfen. Sie hängen zusammen, sind aber weder Synonyme noch Teilmengen im gleichen Sinn.

<figure>
<svg viewBox="0 0 720 380" width="100%" height="380" role="img" aria-label="Ein Schaubild aus drei ineinander- und übereinandergreifenden Flächen. Die große Fläche links heißt Informationssicherheit und enthält alles, was Informationen betrifft, auch ohne Technik: Papierakte, Gespräch, Whiteboard, Wissen im Kopf. Vollständig darin liegt eine kleinere Fläche namens IT-Sicherheit mit Servern, Netzen, Clients, Anwendungen, Datenbanken, Protokollen und Sicherungen. Von rechts ragt eine dritte Fläche namens Datenschutz herein. Sie überlappt sowohl den Nicht-Technik-Teil der Informationssicherheit als auch die IT-Sicherheit. In der Überlappung mit der IT-Sicherheit stehen personenbezogene Daten. Der Teil des Datenschutzes, der außerhalb der Informationssicherheit liegt, enthält Rechtsgrundlage, Zweckbindung, Betroffenenrechte und Löschfristen.">
  <rect x="40" y="55" width="430" height="265" rx="10" fill="rgba(125,255,154,0.08)" stroke="#56c374" stroke-width="2"/>
  <text x="58" y="82" fill="#7dff9a" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Informationssicherheit</text>
  <text x="58" y="106" fill="#e2ece6" font-family="system-ui, sans-serif" font-size="12">Papierakte im Schrank, Gespräch im Zug,</text>
  <text x="58" y="124" fill="#e2ece6" font-family="system-ui, sans-serif" font-size="12">Whiteboard, Wissen im Kopf</text>
  <rect x="62" y="150" width="386" height="150" rx="8" fill="rgba(122,162,255,0.12)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="80" y="176" fill="#7aa2ff" font-family="system-ui, sans-serif" font-size="15" font-weight="700">IT-Sicherheit</text>
  <text x="80" y="204" fill="#e2ece6" font-family="system-ui, sans-serif" font-size="12">Server, Netze, Clients,</text>
  <text x="80" y="222" fill="#e2ece6" font-family="system-ui, sans-serif" font-size="12">Anwendungen, Datenbanken,</text>
  <text x="80" y="240" fill="#e2ece6" font-family="system-ui, sans-serif" font-size="12">Protokolle, Sicherungen</text>
  <rect x="332" y="100" width="348" height="220" rx="10" fill="rgba(224,179,92,0.13)" stroke="#e0b35c" stroke-width="2"/>
  <text x="662" y="128" text-anchor="end" fill="#e0b35c" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Datenschutz</text>
  <text x="580" y="186" text-anchor="middle" fill="#e2ece6" font-family="system-ui, sans-serif" font-size="12">Rechtsgrundlage,</text>
  <text x="580" y="204" text-anchor="middle" fill="#e2ece6" font-family="system-ui, sans-serif" font-size="12">Zweckbindung,</text>
  <text x="580" y="222" text-anchor="middle" fill="#e2ece6" font-family="system-ui, sans-serif" font-size="12">Betroffenenrechte,</text>
  <text x="580" y="240" text-anchor="middle" fill="#e2ece6" font-family="system-ui, sans-serif" font-size="12">Löschfristen</text>
  <text x="390" y="212" text-anchor="middle" fill="#e2ece6" font-family="system-ui, sans-serif" font-size="12">personen-</text>
  <text x="390" y="230" text-anchor="middle" fill="#e2ece6" font-family="system-ui, sans-serif" font-size="12">bezogene</text>
  <text x="390" y="248" text-anchor="middle" fill="#e2ece6" font-family="system-ui, sans-serif" font-size="12">Daten</text>
  <text x="40" y="352" fill="#8fa498" font-family="system-ui, sans-serif" font-size="12">IT-Sicherheit liegt ganz in der Informationssicherheit – der Datenschutz überlappt beide.</text>
</svg>
<figcaption>Die IT-Sicherheit ist ein Teil der Informationssicherheit. Der Datenschutz schneidet quer hindurch: Er verlangt Sicherheit, geht aber über sie hinaus und stellt Fragen, die mit Technik nichts zu tun haben.</figcaption>
</figure>

| | **Informationssicherheit** | **IT-Sicherheit** | **Datenschutz** |
|---|---|---|---|
| **Was wird geschützt?** | Informationen – auf jedem Träger | IT-Systeme und die darin verarbeiteten Daten | **Menschen**, nicht Daten |
| **Gegenstand** | alles Wissenswerte des Betriebs | Technik: Server, Netze, Clients, Anwendungen | personenbezogene Daten |
| **Maßstab** | Schutzbedarf des Betriebs, Verträge, Normen | Schutzbedarf, Stand der Technik | Gesetz (DSGVO, BDSG) |
| **Kernfrage** | Sind unsere Informationen vertraulich, integer, verfügbar? | Sind unsere Systeme dagegen gewappnet? | Dürfen wir das überhaupt – und wie lange? |
| **Wer treibt es** | Leitung, Informationssicherheitsbeauftragte | IT-Leitung und Betrieb | Datenschutzbeauftragte, Rechtsabteilung |
| **Beispiel** | Konstruktionszeichnung wird nicht offen im Flur ausgehängt | Dateiserver mit Berechtigungen und Sicherung | Bewerbungsunterlagen werden nach Fristablauf gelöscht |

Drei Punkte machen die Abgrenzung im Kopf wasserdicht:

**Erstens: Informationssicherheit ist mehr als IT-Sicherheit.** Der teuerste Vertraulichkeitsverlust vieler Betriebe passiert ohne einen einzigen Rechner – im Zugabteil, an der Messestandtheke, im Aufzug oder im Papiercontainer hinter dem Haus. Wer sein Sicherheitskonzept auf Technik beschränkt, sichert die Tür und lässt das Fenster offen.

**Zweitens: Der Datenschutz schützt nicht Daten, sondern Personen.** Das ist der Satz, an dem sich Prüfungsantworten entscheiden. Gegenstand ist das Recht auf informationelle Selbstbestimmung: Jeder Mensch soll grundsätzlich selbst bestimmen können, wer was über ihn weiß. Deshalb stellt der Datenschutz Fragen, die die Informationssicherheit gar nicht kennt – ob es überhaupt eine Rechtsgrundlage für die Verarbeitung gibt, ob der Zweck festgelegt ist, ob nicht weniger Daten reichen würden, wie lange gespeichert werden darf, und welche Rechte die betroffene Person hat.

**Drittens: Der Datenschutz verlangt Sicherheit – deshalb überlappen sie.** Die DSGVO fordert in Artikel 32 („Sicherheit der Verarbeitung“) ausdrücklich geeignete technische und organisatorische Maßnahmen und nennt dabei Vertraulichkeit, Integrität, Verfügbarkeit und Belastbarkeit beim Namen. Die Schutzziele stehen also im Gesetz. Umgekehrt gilt das nicht: Informationssicherheit kümmert sich auch um Daten, die mit Personen nichts zu tun haben.

!!! warning "Die Vermischung, die in Aufgaben am häufigsten passiert"
    „Wir haben die Kundendaten verschlüsselt, damit sind wir DSGVO-konform.“ Der Satz ist in beide Richtungen falsch.

    **Sicher, aber unzulässig:** Ein Betrieb kann Bewerbungsunterlagen mustergültig verschlüsseln, sichern und mit strengen Rechten versehen – und trotzdem gegen den Datenschutz verstoßen, wenn er sie zwölf Jahre lang ohne Anlass aufbewahrt. Das ist kein Sicherheits-, sondern ein Zulässigkeitsproblem.

    **Zulässig, aber unsicher:** Ein Betrieb kann eine einwandfreie Rechtsgrundlage und eine saubere Zweckbindung haben – und die Daten dann auf einem Dateiserver ablegen, auf den alle Beschäftigten Vollzugriff haben. Dann ist die Verarbeitung erlaubt, aber die geforderten Maßnahmen fehlen.

    Merke: **Datenschutz fragt „dürfen wir?“, Informationssicherheit fragt „schützen wir es?“.** Beides muss stimmen. Der Begriff **Datensicherheit** meint übrigens genau die zweite Frage, bezogen auf Daten – er ist ein Teil der Informationssicherheit, nicht ein Synonym für Datenschutz.

Die rechtliche Seite wird im Block [Recht & Organisation](../recht-organisation/index.md) ausgearbeitet, insbesondere unter [Datenschutz & DSGVO](../recht-organisation/datenschutz-dsgvo.md).

---

## Schutzbedarf: wie viel Schutz ist angemessen?

Die Schutzziele sagen, **wogegen** geschützt wird. Sie sagen nicht, **wie viel** Aufwand angemessen ist. Diese Lücke schließt die **Schutzbedarfsfeststellung**. Sie beantwortet für jedes System und jede Anwendung die Frage: Wie schlimm wäre es, wenn hier etwas passiert?

Der Schutzbedarf wird nicht in Euro angegeben, sondern in **Auswirkung**, und dafür haben sich drei Stufen durchgesetzt:

| Stufe | Die Schadensauswirkungen … | Beispiel aus einem Handwerks- oder Industriebetrieb |
|---|---|---|
| **normal** | … sind begrenzt und überschaubar; der Betrieb fängt sie ohne besondere Anstrengung auf | Speiseplan im Intranet, interne Raumbuchung, Testumgebung |
| **hoch** | … können beträchtlich sein: Vertragsstrafen, spürbare Verluste, erheblicher Nacharbeitsaufwand, Ansehensverlust | Angebotskalkulationen, Konstruktionsdaten, das Ticketsystem des Kundendienstes |
| **sehr hoch** | … können ein existenziell bedrohliches Ausmaß erreichen – für den Betrieb oder für betroffene Menschen | Fertigungssteuerung, Schließpläne von Kundenobjekten, Gesundheitsdaten |

Zwei Dinge sind daran wichtiger als die Stufen selbst.

**Der Schutzbedarf gilt je Schutzziel, nicht je System.** Ein System bekommt drei Bewertungen, nicht eine. Die Steuerung einer Fräse hat einen normalen Vertraulichkeitsbedarf – Drehzahlen interessieren niemanden – und gleichzeitig einen sehr hohen Bedarf bei Integrität und Verfügbarkeit. Wer nur „wichtig“ oder „unwichtig“ vergibt, verliert genau diese Unterscheidung und baut anschließend Verschlüsselung, wo Redundanz gefehlt hätte.

**Der Schutzbedarf wird von den Anwendungen auf die Systeme vererbt.** Dabei gelten drei Prinzipien:

| Prinzip | Regel | Beispiel |
|---|---|---|
| **Maximumprinzip** | Ein System erbt den **höchsten** Schutzbedarf aller Anwendungen, die darauf laufen – nicht den Durchschnitt | Auf einem Virtualisierungshost liegen sechs Testmaschinen und die Warenwirtschaft. Der Host ist „hoch“. |
| **Kumulationseffekt** | Viele Einzelposten mit normalem Bedarf ergeben zusammen einen höheren | Der Dateiserver trägt die Ablagen aller Abteilungen. Jede für sich wäre verkraftbar; fällt er aus, steht das Haus. |
| **Verteilungseffekt** | Der Bedarf eines einzelnen Systems kann **sinken**, wenn es nur einen Teil der Aufgabe trägt | Eine Anwendung läuft auf drei gleichwertigen, wirklich unabhängigen Knoten – der einzelne Knoten erbt das „sehr hoch“ nicht. |

!!! warning "Der Verteilungseffekt ist der einzige, der nach unten wirkt"
    Genau deshalb wird er am häufigsten missbraucht. Er gilt nur, wenn die Verteilung tatsächlich trägt. Die Prüffrage lautet immer: **Welches einzelne Ereignis trifft alle Teile gleichzeitig?** Drei Knoten im selben Rack an derselben Steckdosenleiste sind keine Verteilung, sondern eine Kumulation mit besserem Namen.

Diese Systematik stammt aus dem **IT-Grundschutz des BSI**; das Verfahren dahinter – wie man von der Schutzbedarfsfeststellung zur bewerteten Risikoliste und zu Maßnahmen kommt – steht ausführlich auf [Risikomanagement](risikomanagement.md), die dazugehörigen Standards auf [ISMS & Standards](isms.md).

---

## Bedrohung, Schwachstelle, Risiko – das Begriffsdreieck

Wer über Sicherheit spricht, braucht drei Begriffe, die im Alltag synonym benutzt werden und es nicht sind:

- Eine **Bedrohung** ist ein Umstand oder Ereignis, das einem Wert schaden kann – Feuer, Schadsoftware, Stromausfall, Fehlbedienung, Diebstahl. Sie existiert unabhängig von dir und ist für alle Betriebe der Branche ungefähr gleich.
- Eine **Schwachstelle** ist eine Eigenschaft deines Systems oder deiner Organisation, die eine Bedrohung wirksam werden lässt – ein ungepatchter Dienst, eine fehlende Vertretungsregelung, ein Serverraum ohne Brandmeldung, eine Freigabe für alle.
- Ein **Risiko** entsteht erst, wenn **beides zusammentrifft** – ausgedrückt als Kombination aus Eintrittswahrscheinlichkeit und Schadenshöhe.

Der praktische Hebel steckt in dieser Trennung: **Die Bedrohung kommt von außen auf dich zu, die Schwachstelle gehört dir.** Deshalb steht in keiner brauchbaren Maßnahmenliste „Feuer verhindern“, sondern „Brandfrüherkennung installieren“. Gearbeitet wird immer an der eigenen Seite der Gleichung.

Ein vierter Begriff gehört dazu, weil er in Sicherheitskonzepten ständig auftaucht: die **Angriffsfläche**. Sie ist die Summe aller Stellen, an denen ein Angreifer überhaupt ansetzen könnte – offene Ports, erreichbare Anwendungen, Benutzerkonten, Schnittstellen, Wechseldatenträger, Fernwartungszugänge, Lieferanten mit Zugriff. Jede Maßnahme, die etwas abschaltet, entfernt oder einschränkt, verkleinert sie. Das ist der Grund, warum „weniger“ in der Sicherheit fast immer „besser“ heißt.

Wie aus diesen Begriffen ein Verfahren mit Bewertung, Matrix und Steuerungsstrategien wird, steht auf [Risikomanagement](risikomanagement.md) – diese Seite liefert nur die Vokabeln dazu.

---

## Wer greift an – und warum

Die Frage nach dem Angreifer ist keine akademische. Sie entscheidet, welche Maßnahmen überhaupt wirken: Gegen einen automatisierten Massenangriff hilft Aktualität; gegen einen entschlossenen Innentäter hilft Aktualität überhaupt nichts.

| Typ | Motivation | typisches Vorgehen | was am meisten hilft |
|---|---|---|---|
| **Automatisierte Massenangriffe** | alles, was sich verwerten lässt: Rechenleistung, Zugänge, Lösegeld | Scannen des ganzen Adressraums, bekannte Lücken, Standardkennwörter, Massen-Phishing | zügiges Einspielen von Updates, keine Standardkennwörter, nichts unnötig aus dem Internet erreichbar |
| **Organisierte Kriminalität** | Geld, arbeitsteilig und professionell organisiert | gekaufte oder erbeutete Zugangsdaten, Rechteausweitung, erst Datenabfluss, dann Verschlüsselung („doppelte Erpressung“) | Mehr-Faktor-Anmeldung, Netzsegmentierung, minimale Rechte, vom Netz getrennte Sicherungen |
| **Fahrlässige Innentäter** | keine – sie wollen nur ihre Arbeit erledigen | falscher Verteiler, offene Freigabe, privater Cloud-Dienst, Fehlkonfiguration | verständliche Regeln, praktikable Werkzeuge, Schulung, Vier-Augen-Prinzip bei kritischen Schritten |
| **Vorsätzliche Innentäter** | Frust, Kündigung, Geld, Loyalität zum künftigen Arbeitgeber | Missbrauch legitimer Zugänge – ein Einbruch ist gar nicht nötig | Rechte auf das Nötige begrenzen, Protokollierung, sauberer Austrittsprozess, Aufgabentrennung |
| **Wettbewerber / Industriespionage** | Konstruktionsdaten, Kalkulationen, Kundenlisten | gezielt, geduldig, oft über Menschen statt über Technik | Klassifizierung, Vertraulichkeitsvereinbarungen, Zugriffsbeschränkung, Sensibilisierung |
| **Staatlich unterstützte Akteure** | Informationen, Einflussnahme, im Extremfall Sabotage | langfristig, gut ausgestattet, häufig über die Lieferkette | Lieferantenprüfung, Segmentierung, Erkennung statt nur Abwehr |
| **Hacktivisten** | Aufmerksamkeit für ein Anliegen | Überlastungsangriffe, Verunstaltung von Webseiten, Veröffentlichung von Daten | Absicherung der öffentlich erreichbaren Systeme, Vorbereitung der Kommunikation |

!!! danger "Der Irrtum „Wir sind zu klein, um interessant zu sein“"
    Dieser Satz hält sich hartnäckig, weil er ein falsches Bild vom Angreifer voraussetzt: einen Menschen, der sich für dein Unternehmen entscheidet. Der überwiegende Teil der Angriffe funktioniert anders. Automatisierte Werkzeuge suchen den gesamten erreichbaren Adressraum nach bekannten Schwachstellen ab, ohne zu wissen oder sich dafür zu interessieren, wem das System gehört. Wer verwundbar ist, wird gefunden – **Ziel zu sein und Beifang zu sein ist für den Schaden kein Unterschied.**

    Dazu kommt ein zweiter Punkt, der kleinere Betriebe besonders trifft: Sie sind oft als **Zulieferer** interessant. Wer selbst nichts Spannendes hat, hat vielleicht einen Fernwartungszugang zum Kunden, eine gemeinsame Datenablage oder eine Mailbeziehung, der beim Kunden vertraut wird.

Zwei Ergänzungen zur Tabelle gehören dazu. Erstens ist die mit Abstand größte Gruppe die der **fahrlässigen Innentäter** – nicht, weil Beschäftigte unvorsichtig wären, sondern weil sie am häufigsten handeln. Deshalb sind Regeln, die unpraktikabel sind, ein Sicherheitsproblem und keine Sicherheitsmaßnahme: Sie erzeugen Umgehungen. Zweitens ist **Social Engineering** der gemeinsame Nenner fast aller Typen – der Versuch, nicht die Technik, sondern den Menschen zu überwinden: Anruf des vermeintlichen Dienstleisters, dringende Mail der vermeintlichen Geschäftsführung, freundlicher Besucher ohne Ausweis, der mit durch die Tür geht. Technik allein hat gegen dieses Vorgehen wenig auszurichten.

Und schließlich: **Nicht jede Ursache hat einen Täter.** Stromausfall, Wasserrohrbruch, Hardwaredefekt, Bedienfehler und Softwarefehler verursachen zusammen mindestens so viel Schaden wie alle Angreifer zusammen. Ein Sicherheitskonzept, das nur an Angriffe denkt, hat die Hälfte des Problems nicht gesehen.

---

## Grundprinzipien, die fast immer gelten

Technik ändert sich, diese Prinzipien nicht. Sie sind der Kern dessen, was in einer Prüfungsaufgabe als Begründung erwartet wird.

**Minimale Rechte (Least Privilege).** Jedes Konto, jeder Dienst und jedes Programm erhält genau die Rechte, die für die Aufgabe nötig sind – nicht mehr, und nur so lange, wie sie gebraucht werden. In der Praxis heißt das: getrennte Konten für Administration und Alltagsarbeit, Dienstkonten ohne weitreichende Rechte, befristete Rechte für Projekte, ein Austrittsprozess, der Konten wirklich deaktiviert. Die verwandte Regel **Need to know** wendet dasselbe auf Informationen an: Nicht wer Interesse hat, bekommt Zugriff, sondern wer ihn für seine Aufgabe braucht.

**Standardverweigerung (Default Deny).** Was nicht ausdrücklich erlaubt ist, ist verboten. Eine Firewall lässt zuerst nichts durch und wird dann gezielt geöffnet; eine Dateifreigabe erlaubt zuerst niemandem etwas; auf einem gehärteten System läuft nur, was ausdrücklich zugelassen wurde. Der Gegenentwurf – alles erlauben und die bekannten schlechten Dinge verbieten – muss vollständig sein, um zu wirken. Das ist er nie.

**Mehrschichtige Verteidigung (Defense in Depth).** Keine einzelne Maßnahme hält alles auf, also legt man mehrere hintereinander, die unabhängig voneinander wirken. Bei einer Mail mit Schadanhang: Spam- und Anhangsfilter, gesperrte Makros, Endpunktschutz, ein Benutzerkonto ohne Administratorrechte, ein Netzsegment, das den Weg zum Server begrenzt, und ganz hinten eine getrennte Sicherung. Jede Schicht darf durchlässig sein; entscheidend ist, dass sie **verschiedene** Fehler machen. Zwei Filter desselben Herstellers sind eine Schicht mit zwei Rechnungen.

**Trennung von Aufgaben (Segregation of Duties) und Vier-Augen-Prinzip.** Kritische Vorgänge werden so aufgeteilt, dass eine einzelne Person sie nicht allein durchführen kann. Wer eine Rechnung anlegt, gibt sie nicht selbst frei. Wer Berechtigungen vergibt, prüft sie nicht selbst. Wer Protokolle erzeugt, darf sie nicht löschen können. Das schützt gegen Vorsatz **und** gegen Versehen – letzteres ist der häufigere Fall.

**Härtung und Minimalprinzip.** Ein System wird auf das reduziert, was es tatsächlich tun soll: nicht benötigte Dienste abgeschaltet, Beispiel- und Standardkonten entfernt, Standardkennwörter geändert, Verwaltungsschnittstellen nicht aus dem Internet erreichbar, Konfiguration nach einer dokumentierten Vorgabe. Jeder abgeschaltete Dienst ist eine Schwachstelle weniger, die nie gepatcht werden muss.

**Nachvollziehbarkeit.** Sicherheitsrelevante Ereignisse werden protokolliert, die Uhren aller Systeme laufen synchron, und Protokolle werden dort abgelegt, wo derjenige, dessen Handlungen sie festhalten, sie nicht verändern kann. Ohne das gibt es keine Zurechenbarkeit und nach einem Vorfall keine Aufklärung – siehe [Sicherheitsvorfälle](sicherheitsvorfaelle.md).

!!! tip "Das Prinzip, das über allen steht: Sicherheit muss praktikabel sein"
    Eine Regel, die die Arbeit unmöglich macht, wird umgangen – nicht aus Böswilligkeit, sondern weil die Arbeit trotzdem erledigt werden muss. Das Ergebnis heißt **Schatten-IT**: der private Cloud-Speicher für den Dateiaustausch, die Messenger-Gruppe neben dem Ticketsystem, das gemeinsame Kennwort im Teamkalender. Diese Umgehungen sind unsichtbar und deshalb ungeschützt – die Lage ist am Ende schlechter als vor der strengen Regel.

    Deshalb gilt: **Die wirksamste Regel ist nicht die strengste, sondern die, die eingehalten wird.** Wer eine Regel aufstellt, muss den erlaubten Weg mitliefern und ihn mindestens so bequem machen wie den verbotenen.

| Prinzip | schützt vor allem | ein Satz, an dem man es erkennt |
|---|---|---|
| Minimale Rechte | Vertraulichkeit, Integrität | „Wozu braucht dieses Konto dieses Recht?“ |
| Standardverweigerung | alle drei | „Was ist ausdrücklich erlaubt – und wer hat das freigegeben?“ |
| Mehrschichtige Verteidigung | alle drei | „Was passiert, wenn genau diese Maßnahme versagt?“ |
| Aufgabentrennung | Integrität, Zurechenbarkeit | „Kann eine Person das allein durchziehen?“ |
| Härtung | alle drei | „Was läuft hier, das niemand braucht?“ |
| Nachvollziehbarkeit | Zurechenbarkeit, Verbindlichkeit | „Wer war das – und woher wissen wir das?“ |

---

## Was du jetzt wissen solltest

- **Sicherheit ist kein Zustand, sondern eine Menge von Zielen.** Die drei klassischen sind **Vertraulichkeit, Integrität und Verfügbarkeit** (CIA).
- **Jede Maßnahme lässt sich einem Schutzziel zuordnen.** Wer die Zuordnung nicht hinbekommt, braucht die Maßnahme meist nicht.
- **Die Ziele arbeiten gegeneinander.** Man kann sie nicht alle maximieren, sondern muss sie begründet gewichten – das ist eine Entscheidung des Betriebs.
- **In der Produktion und Anlagentechnik kippt die Reihenfolge zu Verfügbarkeit vor Integrität vor Vertraulichkeit**, und **Safety** (Schutz von Menschen) tritt als eigenes Ziel daneben.
- **Authentizität, Verbindlichkeit und Zurechenbarkeit** ergänzen die drei klassischen Ziele um alles, was mit Handlungen und Nachweisen zu tun hat.
- **Informationssicherheit ⊃ IT-Sicherheit**, und der **Datenschutz** schneidet quer hindurch: Er schützt Menschen, nicht Daten, und fragt „dürfen wir?“, nicht nur „schützen wir es?“.
- **Der Schutzbedarf** wird je Schutzziel in normal, hoch und sehr hoch bewertet und mit **Maximumprinzip**, **Kumulationseffekt** und **Verteilungseffekt** auf Systeme übertragen.
- **Ein Risiko entsteht erst, wenn eine Bedrohung auf eine Schwachstelle trifft** – und geändert wird immer an der Schwachstelle.
- **Die größte Angreifergruppe hat keine Absicht**: Fahrlässigkeit richtet mehr Schaden an als Vorsatz – und unpraktikable Regeln erzeugen sie.
- **Minimale Rechte, Standardverweigerung, mehrschichtige Verteidigung, Aufgabentrennung, Härtung und Nachvollziehbarkeit** gelten unabhängig von der eingesetzten Technik.

---

## Fragen zur Selbstkontrolle

??? question "Frage 1: Ein Kollege sagt: „Wir haben doch ein tägliches Backup, damit sind unsere Daten sicher.“ Welche Schutzziele deckt das ab – und welche nicht?"
    Das Backup deckt vor allem die **Verfügbarkeit** ab: Nach Defekt, Löschung oder Verschlüsselung gibt es einen Stand, auf den man zurückkann. Es leistet außerdem einen Beitrag zur **Integrität**, weil es einen unverfälschten Rückfallpunkt bietet – vorausgesetzt, die Verfälschung wird bemerkt, bevor alle Sicherungsstände sie enthalten.

    Zur **Vertraulichkeit** trägt es nichts bei – im Gegenteil: Jede Sicherungskopie ist ein weiterer Ort, an dem dieselben vertraulichen Daten liegen. Ein unverschlüsseltes Sicherungsmedium im offenen Schrank ist ein Vertraulichkeitsrisiko, kein Schutz. Zur **Zurechenbarkeit** trägt es ebenfalls nichts bei.

    Und eine Einschränkung auch bei der Verfügbarkeit: Ein Backup, dessen Wiederherstellung nie geübt wurde, ist eine Vermutung. Erst die erfolgreiche Rücksicherung macht daraus eine Aussage – siehe [Backup & Recovery](../betrieb/backup-und-recovery.md).

??? question "Frage 2: Warum kann man eine Maschinensteuerung nicht einfach nach dem Standardverfahren der Büro-IT patchen – und was tut man stattdessen?"
    Drei Gründe kommen zusammen. Erstens ist die **Verfügbarkeit** das oberste Schutzziel: Jeder Neustart ist Produktionsstillstand, und Wartungsfenster gibt es nur selten. Zweitens braucht ein Update in der Regel die **Freigabe des Anlagenherstellers** – ohne sie sind Gewährleistung und im Zweifel die Betriebserlaubnis in Gefahr. Drittens laufen solche Systeme **zehn bis zwanzig Jahre**, oft mit einem Betriebssystem, für das es längst keine Aktualisierungen mehr gibt.

    Wenn das Patchen als Maßnahme ausfällt, muss der Schutz von außen kommen. Das Standardrezept dafür heißt **kompensierende Maßnahmen**: eigene Netzsegmente für die Anlagentechnik, kontrollierte und dokumentierte Übergänge zur Büro-IT, kein direkter Weg ins Internet, Fernwartung nur befristet und nur nach Freischaltung, dazu Protokollierung und Überwachung der Übergänge. Man senkt also nicht die Schwachstelle, sondern die Erreichbarkeit – siehe [Segmentierung & VPN](../netzwerke/segmentierung-und-vpn.md).

??? question "Frage 3: Ein Dateiserver trägt die Ablagen von 30 Abteilungen. Jede einzelne Ablage hat für sich einen normalen Schutzbedarf. Wie bewertest du den Server – und mit welcher Begründung?"
    Nach dem **Maximumprinzip** allein käme man auf „normal“, weil keine der Anwendungen darüber liegt. Genau hier greift jedoch der **Kumulationseffekt**: Viele Einzelposten mit normalem Bedarf ergeben auf einem gemeinsamen System zusammen einen höheren.

    Bei der **Verfügbarkeit** ist das offensichtlich – fällt der Server aus, steht nicht eine Abteilung, sondern das ganze Haus. Der Bedarf steigt auf mindestens „hoch“. Bei der **Vertraulichkeit** gilt dasselbe mit einem anderen Argument: Dreißig für sich unkritische Ablagen ergeben zusammen ein sehr vollständiges Bild des Betriebs – Kalkulationen, Kundenkontakte, Personalthemen. Auch hier ist „hoch“ die begründbare Bewertung.

    Wichtig für die Prüfung ist nicht die Stufe, sondern die **Begründung**: Man muss den Effekt beim Namen nennen und sagen, welches Schutzziel er anhebt.

??? question "Frage 4: Ein Betrieb speichert Bewerbungsunterlagen verschlüsselt, gesichert und mit strengen Berechtigungen – bewahrt sie aber ohne Anlass zwölf Jahre auf. Ist das ein Sicherheits- oder ein Datenschutzproblem?"
    Es ist ein **Datenschutzproblem**, kein Sicherheitsproblem. Die Informationssicherheit fragt: Sind die Daten vertraulich, integer und verfügbar? Diese Frage ist hier mustergültig beantwortet.

    Der Datenschutz stellt eine andere Frage: **Dürfen wir das überhaupt – und wie lange?** Personenbezogene Daten dürfen nur für einen festgelegten Zweck und nur so lange verarbeitet werden, wie dieser Zweck es erfordert. Ist die Stelle besetzt und die Frist für mögliche Ansprüche verstrichen, entfällt der Zweck; die Daten sind zu löschen. Die technische Absicherung ändert daran nichts.

    Der Fall zeigt die saubere Abgrenzung: **Sicher ≠ zulässig.** Und der umgekehrte Fall existiert genauso – eine einwandfreie Rechtsgrundlage macht einen Dateiserver mit Vollzugriff für alle nicht besser.

??? question "Frage 5: In einem Betrieb arbeiten fünf Administratoren mit demselben Konto „administrator“. Welche Schutzziele sind betroffen, und warum reicht „wir vertrauen uns“ als Antwort nicht?"
    Betroffen ist zuerst die **Zurechenbarkeit**: Keine Handlung lässt sich einer Person zuordnen. Steht im Protokoll nur der Kontoname, sind nach einem Vorfall alle fünf gleichermaßen verdächtig und niemand ist entlastet. Damit fällt auch die **Verbindlichkeit** weg – eine Freigabe, die niemandem zuzuordnen ist, verpflichtet niemanden.

    Betroffen ist außerdem die **Vertraulichkeit**, und zwar aus einem organisatorischen Grund: Mit einem Sammelkonto lassen sich Rechte nicht mehr abgestuft vergeben; jeder hat automatisch alles. Und beim Ausscheiden einer Person muss das gemeinsame Kennwort geändert und allen neu mitgeteilt werden – ein Schritt, der erfahrungsgemäß unterbleibt. Damit hat auch ein längst ausgeschiedener Kollege noch einen gültigen Zugang.

    „Wir vertrauen uns“ verfehlt das Thema, weil es Zurechenbarkeit mit Misstrauen verwechselt. Persönliche Konten schützen vor allem die Beschäftigten selbst: Wer belegen kann, dass er es nicht war, ist besser dran als jemand, bei dem es niemand belegen kann. Dazu kommt: Wird ein Konto von außen übernommen, unterscheidet der Angreifer nicht zwischen Vertrauen und Berechtigung.

??? question "Frage 6: Eine neue Regel verbietet den Versand von Dateien über private Cloud-Dienste. Drei Monate später kursieren im Betrieb mehr Freigabelinks als vorher. Was ist schiefgelaufen?"
    Die Regel hat den **verbotenen Weg beschrieben, aber keinen erlaubten angeboten**. Die Aufgabe – große Dateien mit Kunden austauschen – ist nicht verschwunden, also wurde sie weiterhin erledigt, nur unsichtbar. Das Ergebnis heißt **Schatten-IT** und ist gefährlicher als der Ausgangszustand: Vorher wusste man wenigstens, welcher Dienst benutzt wurde.

    Richtig wäre die umgekehrte Reihenfolge gewesen: erst einen betrieblichen Weg bereitstellen, der mindestens so bequem ist wie der private – etwa einen freigegebenen Dateiaustausch mit Ablaufdatum und Kennwortschutz –, diesen Weg kurz erklären und erst dann den anderen untersagen. Dazu gehört eine Ausnahmeregelung für die Fälle, die der neue Weg nicht abdeckt, und eine benannte Stelle, die sie genehmigt.

    Die dahinterliegende Regel: **Eine Sicherheitsregel ohne praktikable Alternative erzeugt Umgehungen, nicht Sicherheit.**

---

## Merksatz

!!! success "Merksatz"
    > **Sicherheit beginnt mit der Frage „wogegen?“. Die drei Schutzziele sind Vertraulichkeit (nur wer darf, sieht es), Integrität (es ist noch richtig – und Änderungen fallen auf) und Verfügbarkeit (es ist da, wenn es gebraucht wird); in der Anlagentechnik steht die Verfügbarkeit vorn und Safety daneben. Authentizität, Verbindlichkeit und Zurechenbarkeit kommen dazu, sobald es um Handlungen geht. Informationssicherheit ist mehr als IT-Sicherheit, und Datenschutz schützt Menschen, nicht Daten. Ein Risiko entsteht erst, wo eine Bedrohung auf eine Schwachstelle trifft – und geändert wird immer an der Schwachstelle.**

---

## Weiterlesen

- [Risikomanagement](risikomanagement.md): das Verfahren, mit dem aus Schutzbedarf und Bedrohungen eine begründete Rangfolge und konkrete Maßnahmen werden
- [ISMS & Standards](isms.md): der organisatorische Rahmen darum herum – PDCA, Leitlinie und Richtlinien, ISO 27001 und BSI-Grundschutz
- [Netzwerk-Sicherheit](../netzwerke/netzwerk-sicherheit.md): die technische Umsetzung mit Firewall, IDS/IPS, Zero Trust und Verschlüsselung
- [Segmentierung & VPN](../netzwerke/segmentierung-und-vpn.md): Netze trennen – das wichtigste Mittel, wenn Patchen ausfällt
- [Sicherheitsvorfälle](sicherheitsvorfaelle.md): was passiert, wenn ein Schutzziel trotzdem verletzt wurde
- [Datenschutz & DSGVO](../recht-organisation/datenschutz-dsgvo.md): die rechtliche Seite der Abgrenzung von dieser Seite
- [Glossar](../glossar.md): Nachschlagewerk für die Begriffe dieses Blocks
