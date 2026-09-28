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

    1. Öffne <https://www.wireshark.org/download.html> und lade unter **Stable Release** den **Windows x64 Installer**. Nur wer ein Notebook mit Snapdragon-Prozessor hat (Windows auf ARM), nimmt den **Windows Arm64 Installer**. Welcher Prozessor drinsteckt, zeigt **Einstellungen → System → Info** unter „Systemtyp".
    2. Installer starten und durchklicken. Die Vorgaben passen. Windows fragt einmal nach Administratorrechten.
    3. Der Installer fragt nach **Npcap**: Das ist der Treiber für Live-Mitschnitte. Du kannst ihn mitinstallieren (Vorgabe) oder weglassen, für unsere Übung mit der Datei ist er egal.
    4. Test: Wireshark aus dem Startmenü öffnen. Es erscheint die Startseite.

    !!! warning "Keine Administratorrechte, zum Beispiel auf einem Firmenrechner?"
        Dann nimm die **portable Version**: auf derselben Seite **Windows x64 PortableApps®** laden, die Datei starten und als Zielordner einen Ordner wählen, in dem du schreiben darfst, zum Beispiel `Downloads\WiresharkPortable`. Danach in diesem Ordner **WiresharkPortable64.exe** starten. Eine Installation ist nicht nötig. Die Frage nach Npcap kannst du verneinen, zum Öffnen der Übungsdatei braucht es ihn nicht.

=== "macOS"

    1. Lade von <https://www.wireshark.org/download.html> unter **Stable Release** das **macOS Universal Disk Image**. Es läuft auf jedem Mac, egal ob mit Apple- oder Intel-Prozessor.
    2. Das dmg öffnen, Wireshark in den Programme-Ordner ziehen und starten.
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
