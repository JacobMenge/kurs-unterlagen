---
title: "Demo-Runde"
description: "Der Abschluss von Mission Control: Jede Gruppe zeigt ihre Station, den Logbuch-Beweis und ihre kniffligste Stelle."
---

# Demo-Runde

Um 20:30 Uhr kommen alle zurück. Jede Gruppe hat 3 bis 5 Minuten und
zeigt am geteilten Bildschirm:

1. **Die Station:** Wie viele Module leuchten? Einmal
   `docker compose ps` daneben halten.
2. **Der Beweis:** die Logbuch-Historie nach `down` und `up`. Warum
   überlebt sie den Neustart?
3. **Die knifflige Stelle:** Wo hing es am längsten und welche
   Funkhilfe-Stufe oder welches Log hat es gelöst?
4. **Wer in der Vertiefung war:** Störung der Andockschleuse, Ausfall im
   Logbuch oder der Tausch auf FastAPI, einmal kurz vorführen.

Punkte gibt es nur symbolisch und nur für Teamarbeit: Jede Rolle, die in
der Demo zu Wort kommt, zählt einen.

## Klärt vorher im Team

Diese vier Fragen kommen in der Demo-Runde und am Mittwoch wieder dran.
Sprecht die Antworten einmal durch, bevor ihr zurückkommt:

- Eure `compose.yaml`: Wie viele Zeilen beschreiben euren ganzen Stack?
- Der Unterschied zwischen `docker compose down` und
  `docker compose down -v` in einem Satz.
- Woran erkennt das Backend, dass ein Modul offline ist? (Zwei Zahlen
  gehören in die Antwort.)
- Die offene Frage für Mittwoch: Euer Stack spricht HTTP. Die Presse in
  einer Fabrikhalle, spricht die auch HTTP?
