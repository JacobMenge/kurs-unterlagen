---
title: "Warum Monitoring?"
description: "Einordnung: was Monitoring ist, warum es im Betrieb unverzichtbar ist und was du in diesem Block lernst – an realen Beispielen erklärt."
---

# Warum Monitoring?

!!! quote "Der Kerngedanke"
    Ein System, das niemand beobachtet, fällt nicht leiser aus – man merkt es nur **später**. Meistens dann, wenn sich schon jemand beschwert.

## Was ist Monitoring?

**Monitoring** heißt: ein laufendes System **kontinuierlich messen**, um zu wissen, ob es gesund ist – und **automatisch gewarnt zu werden**, bevor etwas kaputtgeht. Nicht „einmal gucken, ob's läuft", sondern dauerhaft die wichtigen Werte im Blick: Auslastung, Antwortzeiten, Fehlerraten, freier Speicherplatz.

Ein Bild dazu: das **Cockpit eines Flugzeugs**. Niemand fliegt blind. Es gibt eine Anzeige für jeden wichtigen Wert, eine Warnung **bevor** etwas kritisch wird und einen klaren Blick darauf, wo es klemmt.

---

## Wozu im echten Betrieb? Drei reale Situationen

- **Ein Webshop wird langsam.** Die Antwortzeiten steigen langsam an. Mit Monitoring sieht das Team den Trend und reagiert, **bevor** Kunden abspringen. Ohne Monitoring kommt die erste Meldung per Beschwerde.
- **Eine Festplatte läuft voll.** Der freie Speicher sinkt seit Tagen. Ein Schwellwert-Alarm meldet sich bei 90 % – statt dass nachts ein Dienst abstürzt, weil nichts mehr passt.
- **Ein Dienst ist nicht erreichbar.** Eine Schnittstelle antwortet nicht mehr. Das Monitoring erkennt das in Sekunden und alarmiert – nicht erst der Anwender am nächsten Morgen.

> In einem vernetzten System mit vielen Komponenten ist die Frage nicht **ob** mal etwas klemmt, sondern **wann** – und ob du es vor allen anderen merkst.

---

## Warum das für Systemintegration und Vernetzung zählt

Dein Job ist es, Systeme zu **verbinden und in Betrieb zu nehmen**. Die Arbeit hört am Tag der Inbetriebnahme aber nicht auf – sie fängt da erst an. Sobald ein vernetztes System produktiv läuft, sorgst du dafür, dass es **zuverlässig weiterläuft**. Und das geht nur, wenn du es **sehen** kannst:

- **Störungen früh erkennen**, bevor ein Nutzer oder eine Maschine den Ausfall meldet
- **Engpässe vorhersehen**, wenn Last oder Speicher in den roten Bereich wandern
- **Fehler systematisch suchen** – erst messen, dann schrauben
- **Verfügbarkeit belegen** – „läuft stabil" ist eine Behauptung, ein Dashboard ist ein Beleg

---

## „Läuft" ist nicht „gesund"

!!! warning "Merksatz"
    Ein Dienst kann **laufen** und trotzdem überlastet, quälend langsam oder kurz vor dem Absturz sein. Ein grüner „läuft"-Status sagt dir **nicht**, ob der Dienst **gesund** ist. Das zeigen erst Metriken.

Gutes Monitoring beantwortet drei Fragen:

| Frage | Beispiel |
|---|---|
| **Läuft es?** | Antwortet der Dienst überhaupt? |
| **Wird es bald eng?** | Steigt der Speicherverbrauch Richtung Limit? |
| **Wo klemmt es?** | Welcher Teil ist langsam oder fehlerhaft? |

---

## Was du in diesem Block tust

Du richtest die zwei wichtigsten Open-Source-Werkzeuge der Branche ein – **Prometheus** und **Grafana** – und überwachst damit eine kleine Anwendung. Du liest Metriken, baust ein Dashboard und löst einen Alarm aus.

!!! info "Unser Beispiel"
    Die Anwendung, die wir überwachen, ist als **kleine Raumstation** gestaltet – das macht die Werte anschaulich (Sauerstoff, Energielast). Lass dich davon nicht täuschen: technisch liefert sie genau das, was auch ein echter Webdienst liefert (Anfragen, Antwortzeiten, Erreichbarkeit). Die „Sauerstoff"-Anzeige steht stellvertretend für jeden **fachlichen** Wert, den man in echt überwacht – etwa Bestellungen pro Minute oder die Temperatur im Serverraum.

---

## Weiter

- [Grundlagen](02-grundlagen.md) – die Werkzeuge und Begriffe, die du gleich brauchst
