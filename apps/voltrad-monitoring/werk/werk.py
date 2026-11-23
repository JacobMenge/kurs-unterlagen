#!/usr/bin/env python3
"""Voltrad Werk: Simulator für die Monitoring-Übung.

Das Programm stellt sieben Systeme der Voltrad GmbH als Messpunkte bereit,
so wie es im Betrieb ein Exporter auf jedem Server täte:

    Port 9100   Messwerte im Prometheus-Format. Welches System antwortet,
                entscheidet der Name, unter dem Prometheus anfragt
                (dc-01, file-01, erp-db, mes-01, web-01, backup-01, sensor-01).
    Port 8090   Bedienseite: Störungen auslösen, verdeckte Störung,
                Zeitraffer der Woche vor dem Angriff.

Es braucht nur die Standardbibliothek von Python.
"""

import json
import math
import os
import random
import threading
import time
from collections import defaultdict
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ORDNER = os.path.dirname(os.path.abspath(__file__))

SYSTEME = {
    "dc-01": ("DC-01", "Domänencontroller: prüft die Anmeldung aller Mitarbeitenden"),
    "file-01": ("FILE-01", "Dateiablage, auch für Vertrieb und Personal"),
    "erp-db": ("ERP-DB", "Datenbank der Warenwirtschaft"),
    "mes-01": ("MES-01", "Fertigungsleitsystem: gibt jedem Montageplatz den nächsten Auftrag"),
    "web-01": ("WEB-01", "Konfigurator und Händlerportal"),
    "backup-01": ("BACKUP-01", "Datensicherung im Werk, nachts eine Kopie in die Cloud"),
    "sensor-01": ("SENSOR-01", "Fühler im Serverraum: Temperatur und Luftfeuchte"),
}

STOERUNGEN = {
    "mes_aus": "MES-01 fällt aus",
    "platte_voll": "FILE-01: Laufwerk D: läuft voll",
    "klima_aus": "Die Klimaanlage im Serverraum fällt aus",
    "passwort_raten": "Jemand probiert am DC-01 Kennwörter durch",
    "web_fehler": "WEB-01 beantwortet Anfragen mit Fehlern",
    "cpu_flattern": "ERP-DB: Die CPU-Last pendelt um 90 Prozent",
    "cpu_dauerlast": "ERP-DB: Die CPU-Last liegt dauerhaft bei 97 Prozent",
}
# Aus diesen wählt die verdeckte Störung zufällig eine aus.
VERDECKT_AUSWAHL = ["mes_aus", "platte_voll", "klima_aus", "passwort_raten", "web_fehler"]

# Zeitraffer: Dienstag, 2. März 2027, 12:00 Uhr bis Montag, 8. März, 6:10 Uhr.
# Eine Stunde im Werk dauert vier Sekunden.
ZR_START = datetime(2027, 3, 2, 12, 0, 0)
ZR_ENDE = datetime(2027, 3, 8, 6, 10, 0)
ZR_FAKTOR = 900.0
WOCHENTAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]

# Ruhewerte je Server: CPU in Prozent, Arbeitsspeicher in Prozent,
# gesendete Bytes je Sekunde am Tag und in der Nacht.
GRUND = {
    "dc-01": (12, 48, 40_000, 5_000),
    "file-01": (18, 55, 600_000, 15_000),
    "erp-db": (30, 72, 200_000, 20_000),
    "mes-01": (25, 61, 150_000, 10_000),
    "web-01": (15, 44, 400_000, 80_000),
    "backup-01": (6, 38, 10_000, 10_000),
}
LAUFWERKE = {
    "dc-01": {"C:": 41.0},
    "file-01": {"C:": 37.0, "D:": 92.0},
    "erp-db": {"C:": 52.0, "E:": 63.0},
    "mes-01": {"C:": 58.0},
    "web-01": {"/": 71.0},
    "backup-01": {"C:": 33.0, "R:": 68.0},
}

# Einzelne Ereignisse im Zeitraffer, die als Zählerschritt sichtbar werden.
EREIGNISSE = [
    (datetime(2027, 3, 2, 18, 22, 41), ("web-01", "voltrad_http_requests_total", 'code="404"'), 2),
    (datetime(2027, 3, 4, 2, 14, 7), ("web-01", "voltrad_http_requests_total", 'code="500"'), 1),
    (datetime(2027, 3, 4, 2, 19, 12), ("dc-01", "voltrad_logins_total", 'result="success"'), 1),
    (datetime(2027, 3, 5, 1, 12, 33), ("dc-01", "voltrad_logins_total", 'result="success"'), 3),
]
EXFIL = [
    (datetime(2027, 3, 5, 23, 50, 18), datetime(2027, 3, 6, 4, 2, 0)),
    (datetime(2027, 3, 6, 23, 47, 2), datetime(2027, 3, 7, 3, 52, 0)),
    (datetime(2027, 3, 7, 23, 52, 40), datetime(2027, 3, 8, 3, 33, 0)),
]
T_ADMINS = datetime(2027, 3, 4, 2, 31, 40)
T_SICHERUNG_WEG = datetime(2027, 3, 8, 5, 42, 30)
T_FILE_VERSCHL = datetime(2027, 3, 8, 5, 58, 31)
T_ERP_VERSCHL = datetime(2027, 3, 8, 6, 1, 14)
T_MES_AUS = datetime(2027, 3, 8, 6, 3, 40)


def rauschen(wert, anteil=0.05):
    return wert * (1 + random.uniform(-anteil, anteil))


class Werk:
    def __init__(self):
        self.schloss = threading.Lock()
        self.modus = "normal"  # normal, zeitraffer, ende
        self.pause = False
        self.zr_sekunden = 0.0
        self.stoerung = {k: False for k in STOERUNGEN}
        self.verdeckt = None
        self.verdeckt_seit = None
        self.zaehler = defaultdict(float)
        self.erledigt = set()
        self.temperatur = 22.4
        self.platte_d = 92.0
        self.raeder_heute = 68.0
        self.start = time.time()
        self.werte = {}
        self.stumm = set()
        self.schritt(0.0)

    # ------------------------------------------------------------ Zeit

    def werkszeit(self):
        if self.modus == "normal":
            return None
        return ZR_START + timedelta(seconds=self.zr_sekunden)

    def werkszeit_text(self):
        z = self.werkszeit()
        if z is None:
            return None
        return f"{WOCHENTAGE[z.weekday()]} {z:%d.%m.}, {z:%H:%M} Uhr"

    def aktiv(self, schluessel):
        """Ist die Störung an, von Hand oder verdeckt?"""
        if self.modus != "normal":
            return False
        return self.stoerung[schluessel] or self.verdeckt == schluessel

    # ------------------------------------------------------------ Lage

    def lage(self):
        """Was im Werk gerade los ist: Schicht, Büro, Sicherung, Angriff."""
        z = self.werkszeit()
        if z is None:
            return dict(produktion=True, buero=True, tag=True, frueh=False, backup=False, cloudkopie=False,
                        exfil=False, admins=3, sicherungen=14, file_verschl=False, erp_verschl=False,
                        mes_aus=False, backup_alter=None, raeder=None)
        werktag = z.weekday() < 5
        stunde = z.hour + z.minute / 60
        produktion = werktag and 6 <= stunde < 22
        buero = werktag and 7 <= stunde < 17
        tag = produktion or (not werktag and 8 <= stunde < 22)
        frueh = werktag and 7 <= stunde < 9
        backup = 22.0 <= stunde < 22.8
        cloudkopie = 23.0 <= stunde < 23.65
        exfil = any(a <= z < b for a, b in EXFIL)
        letzte = z.replace(hour=22, minute=47, second=31)
        if letzte > z:
            letzte -= timedelta(days=1)
        if not werktag:
            raeder = 0.0
        elif stunde < 6:
            raeder = 0.0
        else:
            raeder = min(120.0, (stunde - 6) * 7.5)
        return dict(produktion=produktion, buero=buero, tag=tag, frueh=frueh, backup=backup,
                    cloudkopie=cloudkopie, exfil=exfil,
                    admins=4 if z >= T_ADMINS else 3,
                    sicherungen=0 if z >= T_SICHERUNG_WEG else 14,
                    file_verschl=z >= T_FILE_VERSCHL, erp_verschl=z >= T_ERP_VERSCHL,
                    mes_aus=z >= T_MES_AUS,
                    backup_alter=(z - letzte).total_seconds() / 3600, raeder=raeder)

    # ------------------------------------------------------------ Takt

    def schritt(self, dt):
        """Rechnet alle Messwerte neu. dt ist die echte Zeit seit dem letzten Schritt."""
        if self.modus == "zeitraffer" and not self.pause:
            self.zr_sekunden += dt * ZR_FAKTOR
            grenze = (ZR_ENDE - ZR_START).total_seconds()
            if self.zr_sekunden >= grenze:
                self.zr_sekunden = grenze
                self.modus = "ende"
        # Steht die Werkszeit (Pause oder Ende), laufen die Zähler mit den
        # Werten dieses Augenblicks weiter. So bricht keine Kurve künstlich ein.
        la = self.lage()
        z = self.werkszeit()

        # Einzelereignisse des Zeitraffers
        if z is not None:
            for i, (wann, schluessel, menge) in enumerate(EREIGNISSE):
                if z >= wann and i not in self.erledigt:
                    self.erledigt.add(i)
                    self.zaehler[schluessel] += menge

        # Träge Größen: Temperatur, Laufwerk D:, Räder
        klima = self.aktiv("klima_aus")
        ziel = 38.0 if klima else 22.4
        tempo = 5.0 if klima else 6.0
        if self.temperatur < ziel:
            self.temperatur = min(ziel, self.temperatur + tempo * dt / 60)
        else:
            self.temperatur = max(ziel, self.temperatur - tempo * dt / 60)
        if self.aktiv("platte_voll"):
            self.platte_d = min(100.0, self.platte_d + 1.5 * dt / 60)
        elif self.modus == "normal" and self.platte_d > 92.05:
            self.platte_d = 92.0
        elif self.modus != "normal":
            self.platte_d = 92.0 + self.zr_sekunden / 86400 * 0.04
        hitze = max(0.0, self.temperatur - 28.0)

        mes_aus = self.aktiv("mes_aus") or la["mes_aus"]
        self.stumm = {"mes-01"} if mes_aus else set()

        if la["produktion"] and not mes_aus:
            raeder_je_stunde = max(0.0, rauschen(7.5, 0.03) - hitze * 0.31)
        else:
            raeder_je_stunde = 0.0
        if la["raeder"] is None:
            self.raeder_heute = min(120.0, self.raeder_heute + raeder_je_stunde * dt / 3600)
            raeder_heute = self.raeder_heute
        else:
            raeder_heute = la["raeder"]

        werte = {}
        for system, (cpu, ram, netz_tag, netz_nacht) in GRUND.items():
            # Die internen Server arbeiten, wenn Büro oder Montage arbeiten.
            # WEB-01 hat auch am Wochenende Besuch.
            belebt = la["tag"] if system == "web-01" else (la["produktion"] or la["buero"])
            last = cpu if belebt else cpu * 0.35
            netz = netz_tag if belebt else netz_nacht
            if system == "backup-01":
                if la["backup"]:
                    last = 65
                if la["cloudkopie"]:
                    last, netz = 40, 12_000_000
            if system == "file-01":
                if la["exfil"]:
                    last, netz = last + 14, netz + 4_700_000
                if la["file_verschl"]:
                    last = 97
            if system == "erp-db":
                if la["erp_verschl"] or self.aktiv("cpu_dauerlast"):
                    last = 97
                elif self.aktiv("cpu_flattern"):
                    # 12 Sekunden über 90 Prozent, 12 Sekunden darunter
                    last = 95 if int(time.time() / 12) % 2 == 0 else 84
            if system == "dc-01" and self.aktiv("passwort_raten"):
                last += 25
            last = min(100.0, rauschen(last, 0.06) + hitze * 7.5)
            g = {
                "voltrad_cpu_usage_percent": [("", round(last, 1))],
                "voltrad_memory_used_percent": [("", round(rauschen(ram, 0.01), 1))],
            }
            platten = []
            for laufwerk, belegt in LAUFWERKE[system].items():
                if system == "file-01" and laufwerk == "D:":
                    belegt = self.platte_d
                if system == "backup-01" and laufwerk == "R:" and la["sicherungen"] == 0:
                    belegt = 3.0
                platten.append((f'volume="{laufwerk}"', round(belegt, 2)))
            g["voltrad_disk_used_percent"] = platten
            self.zaehler[(system, "voltrad_network_sent_bytes_total", "")] += rauschen(netz, 0.1) * dt
            werte[system] = g

        # DC-01: Anmeldungen und Administratoren
        if z is None:
            anmeldungen = 0.0025
        elif la["frueh"]:
            anmeldungen = 0.011
        elif la["buero"]:
            anmeldungen = 0.0017
        else:
            anmeldungen = 0.0
        fehl = anmeldungen * 0.03 + (3.0 if self.aktiv("passwort_raten") else 0.0)
        self.zaehler[("dc-01", "voltrad_logins_total", 'result="success"')] += anmeldungen * dt
        self.zaehler[("dc-01", "voltrad_logins_total", 'result="failed"')] += fehl * dt
        werte["dc-01"]["voltrad_group_members"] = [('group="Domain Admins"', la["admins"])]

        # WEB-01: Anfragen nach Antwortcode
        anfragen = rauschen(3.0 if la["tag"] else 0.4, 0.1)
        fehler = anfragen * 0.35 if self.aktiv("web_fehler") else 0.0
        self.zaehler[("web-01", "voltrad_http_requests_total", 'code="200"')] += (anfragen - fehler) * 0.98 * dt
        self.zaehler[("web-01", "voltrad_http_requests_total", 'code="404"')] += anfragen * 0.02 * dt
        self.zaehler[("web-01", "voltrad_http_requests_total", 'code="500"')] += fehler * dt

        # MES-01: Antwortzeit und Montage
        antwort = (0.12 if la["produktion"] else 0.06) + hitze * 0.1225
        werte["mes-01"]["voltrad_mes_response_seconds"] = [("", round(rauschen(antwort, 0.08), 3))]
        werte["mes-01"]["voltrad_montage_bikes_per_hour"] = [("", round(raeder_je_stunde, 2))]
        werte["mes-01"]["voltrad_montage_bikes_today"] = [("", int(raeder_heute))]

        # BACKUP-01: Alter der letzten Sicherung und Zahl der Sicherungen im Werk
        if la["backup_alter"] is None:
            jetzt = datetime.now()
            letzte = jetzt.replace(hour=22, minute=47, second=31, microsecond=0)
            if letzte > jetzt:
                letzte -= timedelta(days=1)
            alter = (jetzt - letzte).total_seconds() / 3600
        else:
            alter = la["backup_alter"]
        werte["backup-01"]["voltrad_backup_age_hours"] = [("", round(alter, 2))]
        werte["backup-01"]["voltrad_backup_restore_points"] = [("", la["sicherungen"])]

        # SENSOR-01: der Serverraum
        werte["sensor-01"] = {
            "voltrad_room_temperature_celsius": [('room="Serverraum"', round(rauschen(self.temperatur, 0.004), 1))],
            "voltrad_room_humidity_percent": [('room="Serverraum"', round(rauschen(45, 0.02), 1))],
        }
        self.werte = werte

    # ------------------------------------------------------------ Ausgabe

    def messwerte(self, system):
        """Die Messwerte eines Systems im Textformat von Prometheus."""
        zeilen = []
        gezeigt = set()

        def kopf(name):
            if name not in gezeigt:
                gezeigt.add(name)
                hilfe, typ = BESCHREIBUNG[name]
                zeilen.append(f"# HELP {name} {hilfe}")
                zeilen.append(f"# TYPE {name} {typ}")

        for name, reihen in self.werte.get(system, {}).items():
            kopf(name)
            for labels, wert in reihen:
                zeilen.append(f"{name}{{{labels}}} {wert}" if labels else f"{name} {wert}")
        for (sys_, name, labels), wert in sorted(self.zaehler.items()):
            if sys_ != system:
                continue
            kopf(name)
            zahl = int(wert)
            zeilen.append(f"{name}{{{labels}}} {zahl}" if labels else f"{name} {zahl}")
        return "\n".join(zeilen) + "\n"

    def status(self):
        dauer = (ZR_ENDE - ZR_START).total_seconds()
        return {
            "modus": self.modus,
            "pause": self.pause,
            "werkszeit": self.werkszeit_text(),
            "fortschritt": round(self.zr_sekunden / dauer, 4) if self.modus != "normal" else 0,
            "stoerungen": [{"schluessel": k, "name": n, "an": self.stoerung[k]} for k, n in STOERUNGEN.items()],
            "verdeckt": self.verdeckt is not None,
            "verdeckt_seit": self.verdeckt_seit,
            "auswahl": [{"schluessel": k, "name": STOERUNGEN[k]} for k in VERDECKT_AUSWAHL],
            "systeme": [{"adresse": f"{k}:9100", "pfad": k, "name": n, "aufgabe": a} for k, (n, a) in SYSTEME.items()],
        }


BESCHREIBUNG = {
    "voltrad_cpu_usage_percent": ("Auslastung des Prozessors in Prozent", "gauge"),
    "voltrad_memory_used_percent": ("Belegter Arbeitsspeicher in Prozent", "gauge"),
    "voltrad_disk_used_percent": ("Belegter Speicherplatz je Laufwerk in Prozent", "gauge"),
    "voltrad_network_sent_bytes_total": ("Gesendete Bytes seit dem Start, zählt nur aufwärts", "counter"),
    "voltrad_logins_total": ("Anmeldungen am Domänencontroller seit dem Start, nach Ergebnis", "counter"),
    "voltrad_group_members": ("Zahl der Mitglieder einer Gruppe im Verzeichnis", "gauge"),
    "voltrad_http_requests_total": ("Beantwortete Anfragen seit dem Start, nach Antwortcode", "counter"),
    "voltrad_mes_response_seconds": ("Antwortzeit des Fertigungsleitsystems in Sekunden", "gauge"),
    "voltrad_montage_bikes_per_hour": ("Fertige Räder je Stunde, vom Fertigungsleitsystem gemeldet", "gauge"),
    "voltrad_montage_bikes_today": ("Fertige Räder seit Schichtbeginn", "gauge"),
    "voltrad_backup_age_hours": ("Alter der letzten erfolgreichen Sicherung in Stunden", "gauge"),
    "voltrad_backup_restore_points": ("Zahl der Sicherungen, die im Werk zum Zurückspielen bereitliegen", "gauge"),
    "voltrad_room_temperature_celsius": ("Temperatur im Raum in Grad Celsius", "gauge"),
    "voltrad_room_humidity_percent": ("Relative Luftfeuchte im Raum in Prozent", "gauge"),
}

WERK = Werk()


def takt():
    letzter = time.time()
    while True:
        time.sleep(0.5)
        jetzt = time.time()
        with WERK.schloss:
            WERK.schritt(jetzt - letzter)
        letzter = jetzt


# ---------------------------------------------------------------- Messwerte (Port 9100)

class Messpunkt(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        system = (self.headers.get("Host") or "").split(":")[0].lower()
        if self.path.split("?")[0] != "/metrics" or system not in SYSTEME:
            text = "Hier antworten nur die Systeme des Werks unter /metrics: " + ", ".join(SYSTEME) + "\n"
            self.antwort(404, text)
            return
        with WERK.schloss:
            if system in WERK.stumm:
                self.antwort(503, f"{SYSTEME[system][0]} antwortet nicht\n")
                return
            text = WERK.messwerte(system)
        self.antwort(200, text)

    def antwort(self, code, text):
        daten = text.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "text/plain; version=0.0.4; charset=utf-8")
        self.send_header("Content-Length", str(len(daten)))
        self.end_headers()
        self.wfile.write(daten)


# ---------------------------------------------------------------- Bedienseite (Port 8090)

class Bedienung(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def sende(self, code, daten, typ):
        if isinstance(daten, str):
            daten = daten.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", typ)
        self.send_header("Content-Length", str(len(daten)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(daten)

    def json(self, objekt, code=200):
        self.sende(code, json.dumps(objekt, ensure_ascii=False), "application/json; charset=utf-8")

    def do_GET(self):
        pfad = self.path.split("?")[0]
        if pfad == "/":
            with open(os.path.join(ORDNER, "werk.html"), "rb") as f:
                self.sende(200, f.read(), "text/html; charset=utf-8")
        elif pfad == "/api/status":
            with WERK.schloss:
                self.json(WERK.status())
        elif pfad == "/api/zeit":
            with WERK.schloss:
                self.json({"modus": WERK.modus, "werkszeit": WERK.werkszeit_text()})
        elif pfad.startswith("/messwerte/"):
            system = pfad.split("/")[2].lower()
            if system not in SYSTEME:
                self.sende(404, "Dieses System gibt es im Werk nicht.\n", "text/plain; charset=utf-8")
                return
            with WERK.schloss:
                if system in WERK.stumm:
                    self.sende(503, f"{SYSTEME[system][0]} antwortet nicht\n", "text/plain; charset=utf-8")
                    return
                text = WERK.messwerte(system)
            self.sende(200, text, "text/plain; charset=utf-8")
        else:
            self.sende(404, "Nicht gefunden.\n", "text/plain; charset=utf-8")

    def do_POST(self):
        laenge = int(self.headers.get("Content-Length") or 0)
        try:
            daten = json.loads(self.rfile.read(laenge) or b"{}")
        except ValueError:
            daten = {}
        pfad = self.path.split("?")[0]
        with WERK.schloss:
            if pfad == "/api/stoerung":
                k = daten.get("schluessel")
                if k in STOERUNGEN and WERK.modus == "normal":
                    WERK.stoerung[k] = bool(daten.get("an"))
                self.json(WERK.status())
            elif pfad == "/api/verdeckt":
                aktion = daten.get("aktion")
                if aktion == "start" and WERK.modus == "normal":
                    for k in STOERUNGEN:
                        WERK.stoerung[k] = False
                    WERK.verdeckt = random.choice(VERDECKT_AUSWAHL)
                    WERK.verdeckt_seit = time.time()
                    self.json(WERK.status())
                elif aktion == "tipp" and WERK.verdeckt:
                    richtig = daten.get("tipp") == WERK.verdeckt
                    antwort = {"richtig": richtig}
                    if richtig:
                        antwort["name"] = STOERUNGEN[WERK.verdeckt]
                        WERK.verdeckt = None
                    self.json(antwort)
                elif aktion == "aufloesen" and WERK.verdeckt:
                    name = STOERUNGEN[WERK.verdeckt]
                    WERK.verdeckt = None
                    self.json({"name": name})
                else:
                    self.json(WERK.status())
            elif pfad == "/api/zeitraffer":
                aktion = daten.get("aktion")
                if aktion == "start":
                    for k in STOERUNGEN:
                        WERK.stoerung[k] = False
                    WERK.verdeckt = None
                    WERK.modus, WERK.pause, WERK.zr_sekunden = "zeitraffer", False, 0.0
                    WERK.erledigt = set()
                elif aktion == "pause" and WERK.modus == "zeitraffer":
                    WERK.pause = True
                elif aktion == "weiter" and WERK.modus == "zeitraffer":
                    WERK.pause = False
                elif aktion == "normal":
                    WERK.modus, WERK.pause, WERK.zr_sekunden = "normal", False, 0.0
                    WERK.raeder_heute = 68.0
                WERK.schritt(0.0)
                self.json(WERK.status())
            else:
                self.json({"fehler": "unbekannt"}, 404)


def main():
    threading.Thread(target=takt, daemon=True).start()
    messpunkt = ThreadingHTTPServer(("0.0.0.0", 9100), Messpunkt)
    threading.Thread(target=messpunkt.serve_forever, daemon=True).start()
    print("Voltrad Werk läuft: Bedienseite auf Port 8090, Messwerte auf Port 9100", flush=True)
    ThreadingHTTPServer(("0.0.0.0", 8090), Bedienung).serve_forever()


if __name__ == "__main__":
    main()
