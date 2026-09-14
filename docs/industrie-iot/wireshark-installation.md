---
title: "Wireshark installieren"
description: "Wireshark für Windows, macOS und Linux installieren: Schritt für Schritt, mit dem wichtigen Hinweis zu Npcap."
---

# Wireshark installieren

**Wireshark** ist das Standard-Werkzeug, um Netzwerkverkehr sichtbar zu machen. Es zeigt jedes einzelne Paket mit allen Feldern, kann nach Protokollen filtern und versteht Hunderte Formate, von HTTP über DNS bis zu den Industrie-Protokollen dieses Blocks.

!!! note "Für unsere Übung reicht die halbe Miete"
    Wir **öffnen eine fertige Mitschnitt-Datei**. Dafür braucht Wireshark keine Sonderrechte und keinen Treiber. Live-Mitschnitte von der eigenen Netzwerkkarte sind ein Extra, das ihr für den Kurs nicht braucht (der Hinweis dazu steht bei den jeweiligen Systemen).

## Installation

=== "Windows"

    1. Lade den Installer von <https://www.wireshark.org/download.html> (Windows x64 Installer).
    2. Installer starten und durchklicken. Die Vorgaben passen.
    3. Der Installer fragt nach **Npcap**: Das ist der Treiber für Live-Mitschnitte. Du kannst ihn mitinstallieren (Vorgabe) oder weglassen, für unsere Übung mit der Datei ist er egal.
    4. Test: Wireshark aus dem Startmenü öffnen. Es erscheint die Startseite mit der Schnittstellenliste.

=== "macOS"

    1. Lade das dmg von <https://www.wireshark.org/download.html> (Arm oder Intel, je nach Mac).
    2. Wireshark in den Programme-Ordner ziehen und starten.
    3. Die Frage nach „ChmodBPF" betrifft nur Live-Mitschnitte, für die Übung mit der Datei kannst du sie überspringen.
    4. Alternativ mit Homebrew:
       ```bash
       brew install --cask wireshark
       ```

=== "Linux"

    ```bash
    sudo apt update
    sudo apt install wireshark
    ```

    Bei der Frage, ob auch normale Benutzer mitschneiden dürfen, kannst du für die Übung ruhig **Nein** lassen. Zum Öffnen von Dateien braucht es keine Sonderrechte.

## Funktioniert es?

Wireshark starten. Du siehst die Startseite. Mehr braucht es nicht: Den Mitschnitt für die Übung öffnest du dann über **Datei → Öffnen** (englisch: File → Open).

!!! tip "Deutsch oder Englisch?"
    Wireshark übernimmt die Sprache deines Systems. In den Anleitungen nennen wir beide Bezeichnungen, zum Beispiel **Statistiken/Statistics**. Gemeint ist dasselbe Menü.
