#!/usr/bin/env python3
"""Voltrad Empfänger: Wo die Alarme ankommen.

Der Alertmanager schickt jede Meldung als Webhook an eine von drei Adressen.
Diese Seite zeigt, was wo angekommen ist:

    /diensthandy       das Diensthandy der Rufbereitschaft
    /ticketsystem      das Ticketsystem der IT, gelesen am nächsten Arbeitstag
    /postfach-brandt   das Postfach des früheren Administrators, liest niemand

Es braucht nur die Standardbibliothek von Python.
"""

import json
import os
import threading
import time
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ORDNER = os.path.dirname(os.path.abspath(__file__))
WERK_ZEIT = os.environ.get("WERK_ZEIT", "http://werk:8090/api/zeit")
KANAELE = ["diensthandy", "ticketsystem", "postfach-brandt"]

schloss = threading.Lock()
meldungen = []
laufende_nummer = 0


def werkszeit():
    """Fragt das Werk nach seiner Zeit. Im Normalbetrieb gibt es keine."""
    try:
        with urllib.request.urlopen(WERK_ZEIT, timeout=1) as antwort:
            return json.loads(antwort.read()).get("werkszeit")
    except Exception:
        return None


class Empfang(BaseHTTPRequestHandler):
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

    def do_GET(self):
        pfad = self.path.split("?")[0]
        if pfad == "/":
            with open(os.path.join(ORDNER, "empfaenger.html"), "rb") as f:
                self.sende(200, f.read(), "text/html; charset=utf-8")
        elif pfad == "/api/meldungen":
            with schloss:
                self.sende(200, json.dumps(meldungen, ensure_ascii=False), "application/json; charset=utf-8")
        else:
            self.sende(404, "Nicht gefunden.\n", "text/plain; charset=utf-8")

    def do_POST(self):
        global laufende_nummer
        pfad = self.path.split("?")[0].strip("/")
        laenge = int(self.headers.get("Content-Length") or 0)
        roh = self.rfile.read(laenge)
        if pfad == "api/leeren":
            with schloss:
                meldungen.clear()
            self.sende(200, "{}", "application/json")
            return
        if pfad not in KANAELE:
            self.sende(404, "Diesen Empfänger gibt es nicht.\n", "text/plain; charset=utf-8")
            return
        try:
            daten = json.loads(roh or b"{}")
        except ValueError:
            daten = {}
        im_werk = werkszeit()
        with schloss:
            for alarm in daten.get("alerts", []):
                labels = alarm.get("labels", {})
                texte = alarm.get("annotations", {})
                laufende_nummer += 1
                meldungen.append({
                    "nr": laufende_nummer,
                    "kanal": pfad,
                    "status": "entwarnung" if alarm.get("status") == "resolved" else "alarm",
                    "name": labels.get("alertname", "ohne Namen"),
                    "server": labels.get("server", ""),
                    "stufe": labels.get("stufe", ""),
                    "titel": texte.get("summary", ""),
                    "text": texte.get("description", ""),
                    "zeit": time.time(),  # die Seite zeigt daraus die Uhrzeit des Browsers
                    "werkszeit": im_werk,
                })
            del meldungen[:-300]
        self.sende(200, "{}", "application/json")


if __name__ == "__main__":
    print("Voltrad Empfänger läuft auf Port 8091", flush=True)
    ThreadingHTTPServer(("0.0.0.0", 8091), Empfang).serve_forever()
