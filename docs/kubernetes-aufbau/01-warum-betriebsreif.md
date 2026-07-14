---
title: "Warum betriebsreif?"
description: "Der Unterschied zwischen „läuft“ und „produktionsreif“: Ein Deployment hält deine App am Leben – aber Konfiguration steckt noch im Image, Kubernetes kennt den echten Gesundheitszustand nicht und ein Container darf beliebig viel Speicher fressen. Drei Lücken, die dieser Block schließt."
---

# Warum betriebsreif?

Am Ende von Teil 1 lief dein Dienst rund: drei Pods, eine stabile Adresse davor, Selbstheilung, Updates ohne Ausfall. Man könnte meinen, damit ist alles getan. Ist es aber nicht – und das merkt man nicht am ersten Tag, sondern am ersten **schlechten** Tag: wenn sich eine Einstellung ändern soll, wenn eine App still hängen bleibt oder wenn ein Speicherleck einen ganzen Server lahmlegt.

„Läuft" und „betriebsreif" sind zwei verschiedene Dinge. Der Sprung dazwischen sind ein paar Zeilen im Manifest – aber genau die trennen ein Bastelprojekt von einem Dienst, den man nachts laufen lässt, ohne wach zu liegen.

!!! quote "Der rote Faden"
    Ein Auto, das anspringt und fährt, ist noch kein Auto, mit dem du auf die Autobahn gehst. Dazu gehören Tankanzeige, Warnleuchten und eine Sicherung, die durchbrennt, bevor das ganze Bordnetz schmort. Genau diese drei Dinge – ablesbare Einstellungen, Warnleuchten, Sicherung – rüsten wir jetzt an deinem Dienst nach.

---

## Die drei Lücken

<figure>
<svg viewBox="0 0 660 250" width="100%" height="250" role="img" aria-label="Drei Luecken zwischen laufendem und betriebsreifem Dienst: Konfiguration im Image, unbekannte Gesundheit, unbegrenzter Ressourcenhunger">
  <!-- Lücke 1 -->
  <rect x="20" y="50" width="195" height="150" rx="10" fill="rgba(122,162,255,0.10)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="117" y="82" text-anchor="middle" fill="#7aa2ff" font-family="system-ui, sans-serif" font-size="15" font-weight="800">1 · Konfiguration</text>
  <text x="117" y="108" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="12">Farbe, Version, Passwort</text>
  <text x="117" y="127" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="12">stecken im Image.</text>
  <text x="117" y="153" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">Ändern = neues Image</text>
  <text x="117" y="171" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="11">→ ConfigMap &amp; Secret</text>

  <!-- Lücke 2 -->
  <rect x="232" y="50" width="196" height="150" rx="10" fill="rgba(122,162,255,0.10)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="330" y="82" text-anchor="middle" fill="#7aa2ff" font-family="system-ui, sans-serif" font-size="15" font-weight="800">2 · Gesundheit</text>
  <text x="330" y="108" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="12">Prozess läuft ≠</text>
  <text x="330" y="127" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="12">App antwortet.</text>
  <text x="330" y="153" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">Hängt still weiter</text>
  <text x="330" y="171" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="11">→ Health-Probes</text>

  <!-- Lücke 3 -->
  <rect x="445" y="50" width="195" height="150" rx="10" fill="rgba(122,162,255,0.10)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="542" y="82" text-anchor="middle" fill="#7aa2ff" font-family="system-ui, sans-serif" font-size="15" font-weight="800">3 · Ressourcen</text>
  <text x="542" y="108" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="12">Ein Container darf</text>
  <text x="542" y="127" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="12">alles auffressen.</text>
  <text x="542" y="153" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">Reißt den Node mit</text>
  <text x="542" y="171" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="11">→ Requests &amp; Limits</text>

  <text x="330" y="30" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="13">Vom laufenden zum betriebsreifen Dienst – drei Nachrüstungen</text>
  <text x="330" y="228" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="12">Jede Lücke bekommt gleich ihre eigene, sichtbare Übung.</text>
</svg>
<figcaption>Drei Lücken trennen „läuft" von „betriebsreif". Jede schließt du in diesem Block mit ein paar Zeilen im Manifest – und siehst den Effekt sofort.</figcaption>
</figure>

### Lücke 1 – Konfiguration steckt im Image

Unsere Demo-App trägt ihre Farbe und Version in Umgebungsvariablen, die im Deployment fest verdrahtet sind. Im echten Betrieb ist das noch mehr: eine Datenbank-Adresse, ein API-Schlüssel, ein Standort-Name, ein Log-Level. Steckt all das **im Image oder fest im Manifest**, dann heißt jede Änderung: anfassen, neu ausrollen – und für Geheimnisse noch schlimmer: Wer das Image hat, hat das Passwort.

Betriebsreif heißt: **dieselbe App, verschiedene Umgebungen.** Test läuft mit anderen Werten als Produktion – aber mit demselben Image. Dafür gibt es **ConfigMap** (für offene Werte) und **Secret** (für Geheimnisse).

### Lücke 2 – Kubernetes kennt den Gesundheitszustand nicht

Kubernetes weiß bisher nur eines: **läuft der Prozess im Container oder nicht?** Das ist erstaunlich wenig. Eine App kann laufen und trotzdem kaputt sein – ein hängender Thread, eine verlorene Datenbankverbindung, eine Endlosschleife. Der Prozess lebt, aber es kommt keine Antwort mehr. Für Kubernetes sieht das „gesund" aus und es schickt fröhlich weiter Anfragen ins Leere.

Betriebsreif heißt: **Kubernetes prüft aktiv nach.** Über **Health-Probes** fragt es selbst regelmäßig: „Bist du **bereit** für Anfragen?" (readiness) und „**Lebst** du noch?" (liveness). Fällt die Antwort schlecht aus, hält es Anfragen zurück oder startet den Container neu.

### Lücke 3 – ein Container darf alles fressen

Auf einem Node teilen sich viele Pods denselben Speicher und dieselben CPU-Kerne. Bisher hat keiner gesagt, wie viel jeder nehmen darf. Läuft alles gut, fällt das nicht auf. Hat aber ein Container ein Speicherleck, frisst er so lange Arbeitsspeicher, bis der Node keinen mehr hat – und reißt dann **andere, gesunde Pods** mit in den Abgrund.

Betriebsreif heißt: **jeder Container bekommt eine Zusage und eine Grenze.** Über **Requests** reserviert Kubernetes eine Grundmenge (und plant den Pod danach ein), über **Limits** zieht es eine harte Obergrenze. Wer sein Speicher-Limit sprengt, wird gezielt beendet (**OOMKilled**) – statt den ganzen Node zu gefährden.

---

## Das große Ganze

Alle drei Lücken haben denselben Kern wie schon der Soll-Zustand aus Teil 1: **Du beschreibst im Manifest, wie es sein soll – und Kubernetes setzt es durch.** Nur beschreibst du jetzt nicht mehr nur „drei Kopien", sondern auch „so ist die App konfiguriert", „so erkennst du, ob sie gesund ist" und „so viel darf sie verbrauchen".

!!! note "Kurz erklärt: warum das im Job zählt"
    Genau diese drei Dinge – Konfiguration und Geheimnisse sauber trennen, den Betrieb überwachen und Ausfälle früh erkennen, Ressourcen bewusst zuteilen – trennen im echten Betrieb einen Dienst, der einfach läuft, von einem, den man ruhigen Gewissens laufen lässt. Es ist derselbe Gedanke wie beim [Monitoring](../monitoring-praxis/index.md) – nur hier direkt im Cluster verankert.

---

## Weiter

- [ConfigMap & Secret](02-config-und-secrets.md) – die erste Lücke schließen: Konfiguration raus aus dem Image
