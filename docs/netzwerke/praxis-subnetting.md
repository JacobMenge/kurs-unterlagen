---
title: "Praxis: Subnetz-Architekten"
description: "Ein Subnetting-Design-Wettbewerb in Gruppen: Teilt das Netz 192.168.10.0/24 sauber in Abteilungs-Subnetze auf. Nur Papier und Stift nötig, optional ein Online-Subnetz-Rechner zum Selbstcheck."
---

# Praxis: Subnetz-Architekten

<span class='badge badge-praxis'>Praxis</span> &nbsp; Schluss mit Theorie – jetzt baust du selbst ein echtes Firmennetz, gegen die Uhr und gegen die anderen Gruppen.

!!! info "Auf einen Blick"
    - **Dauer:** ca. 50 Minuten
    - **Gruppen:** 3–4 Personen – dieselben wie beim Schichten-Check.
    - **Material:** Papier und Stift. Optional ein Online-Subnetz-Rechner zum Selbstcheck.
    - **Festhalten:** Eure fertige Planungstabelle kommt ins gemeinsame Ergebnis-Dokument – den Link zeigt die Briefing-Folie.
    - **Für die Auswertung:** Der Sprecher eurer Gruppe zeigt nachher die Tabelle – kurz, nur die Eckwerte.
    - **Kein PC nötig** – ihr rechnet im Kopf und auf dem Papier.
    - **Voraussetzung:** Du hast [Adressierung (MAC, IPv4, IPv6, Subnetting)](adressierung.md) gelesen und kannst die drei Standard-Aufgaben.

---

## Das Szenario

Die fiktive **Müller GmbH** zieht in ein neues Gebäude. Die Verkabelung liegt, die Switches stehen im Rack – aber das Netz ist noch komplett ungeplant. **Du bist der Netzwerk-Architekt.**

Dein Chef gibt dir genau **ein** Netz an die Hand:

```text
192.168.10.0/24
```

Das ist ein klassisches Klasse-C-Netz mit 254 nutzbaren Adressen. Daraus sollst du **saubere, getrennte Subnetze** für die einzelnen Abteilungen schneiden – jede Abteilung bekommt ihren eigenen Adressbereich.

Diese Abteilungen wollen versorgt werden:

| Abteilung | Geräte (Hosts) |
|---|---:|
| **Büro** | 100 |
| **Gäste-WLAN** | 50 |
| **Produktion** | 20 |
| **Server** | 10 |

!!! question "Warum überhaupt aufteilen? Ein /24 hätte doch Platz für alle 180 Geräte."
    Stimmt – rein von der Anzahl her würde alles in ein `/24` passen. Aber wer alles in **ein** Netz wirft, baut sich Ärger ein: ein einziger Broadcast-Sturm legt dann das ganze Haus lahm und die Gäste-Tablets hängen im selben Netz wie die Produktionssteuerung. Sauber getrennte Subnetze sind die Grundlage für **Ordnung, Performance und Sicherheit**. Genau das übst du hier.

---

## Eure Aufgabe – Schritt für Schritt

Arbeitet als Team. Diskutiert laut, rechnet gemeinsam, schreibt mit.

**Schritt 1 – Hostbits bestimmen.**
Geht jede Abteilung durch und fragt euch: **Wie viele Hostbits brauche ich?** Die Formel kennst du:

```text
nutzbare Hosts = 2^Hostbits − 2
```

(Die `− 2` sind die Netzadresse und die Broadcast-Adresse, die in jedem Subnetz reserviert sind.) Sucht für jede Abteilung die **kleinste** Anzahl Hostbits, deren nutzbare Adressen noch reichen.

**Schritt 2 – Größte zuerst zuteilen.**
Sortiert die Abteilungen nach Größe – **die größte zuerst**. Dann wählt ihr für jede die passende **Präfixlänge** (CIDR) und damit die **Subnetzmaske**. Merke: `Präfixlänge = 32 − Hostbits`.

**Schritt 3 – Subnetze schneiden.**
Beginnt bei `192.168.10.0` und legt die Subnetze **lückenlos hintereinander**. Für jedes Subnetz bestimmt ihr:

- die **Netzadresse** (die erste Adresse des Blocks)
- die **erste nutzbare** Adresse (Netzadresse + 1)
- die **letzte nutzbare** Adresse (Broadcast − 1)
- die **Broadcast-Adresse** (die letzte Adresse des Blocks)
- die **Subnetzmaske**

!!! tip "Tipp: Blockgröße als Sprungweite"
    Die **Blockgröße** ist `256 − Maskenwert` (im vierten Oktett). Sie sagt euch, **wo das nächste Subnetz anfängt**. Beispiel: bei der Maske `255.255.255.128` (`/25`) ist die Blockgröße `256 − 128 = 128` – die Subnetze starten also bei `.0` und `.128`. So springt ihr von Block zu Block, ohne euch zu verrechnen. (Das ist übrigens dieselbe Zahl wie `2^Hostbits` – nur ein schnellerer Rechenweg dorthin.)

**Schritt 4 – Planungstabelle ausfüllen.**
Übertragt alles in diese Tabelle. Sie ist eure **Abgabe** – schreibt sie ins gemeinsame Dokument oder aufs Papier:

| Abteilung | benötigt | Präfix | Netzadresse | erste nutzbare | letzte nutzbare | Broadcast |
|---|---:|---|---|---|---|---|
| Büro | 100 |  |  |  |  |  |
| Gäste-WLAN | 50 |  |  |  |  |  |
| Produktion | 20 |  |  |  |  |  |
| Server | 10 |  |  |  |  |  |

---

## Bonus-Runde

Wenn ihr früh fertig seid – hier gibt es Extrapunkte:

!!! note "Bonus-Fragen"
    1. **Welche Abteilung gehört in ein eigenes VLAN?** Begründet eure Wahl. (Tipp: Es kann durchaus mehr als eine sein.)
    2. **Warum sollten die Gäste vom Rest des Netzes isoliert werden?** Was könnte sonst passieren?

??? info "Denkanstoß zur Bonus-Runde (erst selbst überlegen!)"
    - **VLANs:** Sinnvoll ist ein eigenes VLAN pro Abteilung – besonders aber für **Server**, **Produktion** und **Gäste-WLAN**. Server enthalten schützenswerte Daten, die Produktion steuert Maschinen (ein Ausfall kostet sofort Geld) und Gäste sind schlicht nicht vertrauenswürdig.
    - **Gäste-Isolation:** Ein Gästegerät ist ein **fremdes, unkontrolliertes Gerät** in eurem Haus – vielleicht mit Schadsoftware, vielleicht neugierig. Liegt es im selben Netz wie die Server, kann es sie direkt ansprechen, scannen und angreifen. In einem eigenen, isolierten Segment (eigenes VLAN, Firewall-Regel „nur ins Internet, nicht ins LAN") kann ein infiziertes Gästegerät keinen Schaden im Firmennetz anrichten.

    Mehr dazu in [Segmentierung und VPN](segmentierung-und-vpn.md).

---

## Bewertung

!!! tip "So wird gewertet"
    - **Schnelligkeit:** Die **schnellste korrekte** Lösung gewinnt die Runde.
    - **Sauberkeit:** Die **lesbarste, ordentlichste Doku** bekommt Extrapunkte – eine korrekte Lösung, die niemand entziffern kann, ist in der Praxis wertlos.
    - **Selbstcheck:** Prüft eure Werte zum Schluss mit einem **Online-Subnetz-Rechner** (Suchbegriff: „Subnetzrechner" oder „IP subnet calculator"). Gebt z.B. `192.168.10.0/25` ein und vergleicht Netzadresse, erste/letzte nutzbare Adresse und Broadcast mit eurem Blatt.

    Aufgepasst beim Selbstcheck: Der Rechner verrät euch zwar, ob ein **einzelnes** Subnetz stimmt – aber **nicht**, ob ihr die Abteilungen klug aufgeteilt und lückenlos angeordnet habt. Das ist euer Job als Architekt.

---

## Hilfekarten

Nutzt diese Karten **nur**, wenn ihr feststeckt. Erst im Team überlegen – dann aufklappen.

??? info "Hilfekarte 1 – Zweierpotenzen-Spickzettel"
    Die Zweierpotenzen, die ihr für Subnetting im Kopf braucht:

    | Hostbits | 2^Hostbits (Adressen total) | nutzbar (− 2) |
    |---:|---:|---:|
    | 1 | 2 | 0 |
    | 2 | 4 | 2 |
    | 3 | 8 | 6 |
    | 4 | 16 | 14 |
    | 5 | 32 | 30 |
    | 6 | 64 | 62 |
    | 7 | 128 | 126 |
    | 8 | 256 | 254 |

    Lest die Tabelle von oben nach unten und nehmt die **erste** Zeile, deren „nutzbar" reicht. Für 100 Geräte z.B.: 62 ist zu klein, **126 reicht** → also 7 Hostbits.

??? info "Hilfekarte 2 – Hostbits in Präfix umrechnen"
    Eine IPv4-Adresse hat **32 Bit**. Davon sind die Hostbits hinten, der Rest ist Netz:

    ```text
    Präfixlänge = 32 − Hostbits
    ```

    | Hostbits | Präfix | Maske (4. Oktett) |
    |---:|---|---|
    | 7 | `/25` | `255.255.255.128` |
    | 6 | `/26` | `255.255.255.192` |
    | 5 | `/27` | `255.255.255.224` |
    | 4 | `/28` | `255.255.255.240` |

??? info "Hilfekarte 3 – Blockgröße = 256 − Maskenwert"
    Die **Blockgröße** ist die Sprungweite zum nächsten Subnetz. Sie ergibt sich aus dem Maskenwert im vierten Oktett:

    ```text
    Blockgröße = 256 − Maskenwert
    ```

    | Maske (4. Oktett) | Präfix | Blockgröße | Subnetze starten bei … |
    |---|---|---:|---|
    | `128` | `/25` | 128 | .0, .128 |
    | `192` | `/26` | 64 | .0, .64, .128, .192 |
    | `224` | `/27` | 32 | .0, .32, .64, .96, .128, … |
    | `240` | `/28` | 16 | .0, .16, .32, .48, … |

    **So nutzt ihr das:** Netzadresse + Blockgröße = Netzadresse des nächsten Subnetzes. Die Broadcast-Adresse ist immer **eine weniger** als der nächste Start.

??? info "Hilfekarte 4 – Die richtige Reihenfolge"
    Die wichtigste Regel beim Aufteilen ungleich großer Subnetze:

    > **Das größte Subnetz zuerst zuteilen, dann absteigend.**

    Warum? Große Blöcke müssen an „runden" Grenzen anfangen (ein `/25` darf nur bei `.0` oder `.128` starten). Wenn ihr zuerst kleine Blöcke verteilt, verbaut ihr euch diese Grenzen und die großen passen nicht mehr sauber rein. Groß zuerst = es geht immer auf.

    Reihenfolge hier also: **Büro (100) → Gäste (50) → Produktion (20) → Server (10)**.

---

## Lösung

!!! warning "Erst nach der eigenen Arbeit aufklappen!"
    Rechnet zuerst selbst. Diese Lösung ist zum **Vergleichen** da, nicht zum Abschreiben.

??? success "Vollständige Lösung – Schritt für Schritt"
    **Schritt 1 + 2 – Hostbits und Präfix pro Abteilung (größte zuerst):**

    | Abteilung | benötigt | Hostbits | 2^h − 2 | Präfix |
    |---|---:|---:|---:|---|
    | Büro | 100 | 7 | 126 | `/25` |
    | Gäste-WLAN | 50 | 6 | 62 | `/26` |
    | Produktion | 20 | 5 | 30 | `/27` |
    | Server | 10 | 4 | 14 | `/28` |

    Begründung der Hostbits:

    - **Büro (100):** 6 Hostbits = 62 nutzbar → zu klein. 7 Hostbits = 126 nutzbar → reicht. → `/25`
    - **Gäste (50):** 5 Hostbits = 30 → zu klein. 6 Hostbits = 62 → reicht. → `/26`
    - **Produktion (20):** 4 Hostbits = 14 → zu klein. 5 Hostbits = 30 → reicht. → `/27`
    - **Server (10):** 3 Hostbits = 6 → zu klein. 4 Hostbits = 14 → reicht. → `/28`

    **Schritt 3 – Subnetze lückenlos schneiden** (Start bei `192.168.10.0`):

    - **Büro `/25`** – Blockgröße 128, startet bei `.0`, endet bei `.127`.
    - **Gäste `/26`** – Blockgröße 64, startet beim nächsten freien Punkt `.128`, endet bei `.191`.
    - **Produktion `/27`** – Blockgröße 32, startet bei `.192`, endet bei `.223`.
    - **Server `/28`** – Blockgröße 16, startet bei `.224`, endet bei `.239`.

    **Schritt 4 – Fertige Planungstabelle:**

    | Abteilung | benötigt | Präfix | Netzadresse | erste nutzbare | letzte nutzbare | Broadcast |
    |---|---:|---|---|---|---|---|
    | Büro | 100 | `/25` | `192.168.10.0` | `192.168.10.1` | `192.168.10.126` | `192.168.10.127` |
    | Gäste-WLAN | 50 | `/26` | `192.168.10.128` | `192.168.10.129` | `192.168.10.190` | `192.168.10.191` |
    | Produktion | 20 | `/27` | `192.168.10.192` | `192.168.10.193` | `192.168.10.222` | `192.168.10.223` |
    | Server | 10 | `/28` | `192.168.10.224` | `192.168.10.225` | `192.168.10.238` | `192.168.10.239` |

    **Probe – passt das zusammen in ein `/24`?**

    Die Blockgrößen addiert: `128 + 64 + 32 + 16 = 240`. Das ist **kleiner als 256** – passt also locker in das `/24`. ✓

    Die Adressen `192.168.10.240` bis `192.168.10.255` (16 Adressen) bleiben **frei** – das ist kein Fehler, sondern Reserve für eine spätere fünfte Abteilung oder zum Wachsen.

    !!! tip "Selbstcheck mit dem Online-Rechner"
        Gebt jedes Subnetz einzeln im Subnetzrechner ein (z.B. `192.168.10.128/26`) und vergleicht Netzadresse, ersten/letzten Host und Broadcast mit der Tabelle oben. Alle vier müssen exakt passen.

---

## Was du dabei gelernt hast

- **Broadcast-Domänen verkleinern:** Jedes Subnetz ist eine eigene Broadcast-Domäne. Statt 180 Geräten in einem großen, lauten Netz hast du vier kleine, ruhige Netze – ein Broadcast-Sturm bleibt lokal.
- **Ordnung schaffen:** Jede Abteilung hat einen klar abgegrenzten Adressbereich. Du siehst an der IP sofort, wohin ein Gerät gehört – das macht Fehlersuche und Verwaltung viel einfacher.
- **Adressen sinnvoll nutzen:** Mit „größte zuerst" teilst du den knappen Adressraum sauber und lückenlos auf – und behältst trotzdem Reserve für später (`.240`–`.255`).
- **Sicherheit durch Isolation:** Getrennte Subnetze sind die Grundlage, um Abteilungen per VLAN und Firewall voneinander abzuschotten – Gäste kommen nicht an die Server, die Produktion läuft ungestört.

Wenn dir bei einem Schritt die Theorie gefehlt hat, lies nochmal in [Adressierung (MAC, IPv4, IPv6, Subnetting)](adressierung.md) nach – besonders den Abschnitt „Subnetting im Kopf".
