// Abend 3 – Routing, VLAN und Sicherheit: das Finale des Netzwerkblocks
//
// Bauen:   node 03-routing-vlan-sicherheit.js
// Prüfen:  ../.venv/bin/python pruefen.py dist/03-routing-vlan-sicherheit.pptx
// Ansehen: ../.venv/bin/python vorschau.py dist/03-routing-vlan-sicherheit.pptx
//
// Quellen: docs/netzwerke/routing-und-switching.md, segmentierung-und-vpn.md,
//          netzwerk-sicherheit.md, praxis-netzwerk-notruf.md
// Gewichtung laut Standortbestimmung: Routing-Konzept sitzt (Gateway 14/14),
// VLAN/Segmentierung Mittelzone (3,2–3,4) – dort liegt der Theorie-Schwerpunkt.

const path = require("path");
const { createDeck } = require("./lib/theme");
const { svgPng } = require("./lib/icons");
const D = require("./lib/diagramme");

// Vor dem Unterricht prüfen: Das Ergebnis-Dokument legt Jacob je Termin neu an.
const LINK_UEBUNG = "jacobmenge.github.io/kurs-unterlagen/netzwerke/praxis-netzwerk-notruf/";
const LINK_DOKUMENT = "<Link zum Ergebnis-Dokument hier eintragen>";

const LOGO = {
  cloudhelden: svgPng(
    path.join(__dirname, "assets", "logos", "cloudhelden.svg"),
    "cloudhelden"
  ),
};

const deck = createDeck({
  title: "Routing, VLAN und Sicherheit",
  subject: "Abend 3 im Themenblock Planung, Konzeptionierung, Integration",
  akzent: "blau",
});

const { C, T } = deck.api;

// ============================================================ Titel

deck.title({
  eyebrow: "Thema 1 · Abend 3",
  title: "Routing, VLAN und Sicherheit",
  subtitle: "Das Finale des Netzwerkblocks – am Ende beantwortet ihr die Frage vom ersten Abend",
  note: "Mittwoch, 2. September 2026 · 18:00–21:00 Uhr",
  logo: LOGO.cloudhelden,
});

// ============================================================ Einstieg
deck.abschnitt("Einstieg", "blau");

deck.content("Was uns heute Abend erwartet", "Ablauf", (s, api) => {
  api.schedule(
    s,
    [
      ["18:00", "Warmup: eine Kopfrechenaufgabe von Montag"],
      ["18:10", "Routing: Wie ein Paket seinen Weg findet"],
      ["18:25", "Netze trennen: VLAN, DMZ und die Firewall dazwischen"],
      ["18:45", "Pause"],
      ["18:55", "Quickcheck DNS und DHCP, dann das Zonenmodell"],
      ["19:15", "Briefing für die Breakout-Übung"],
      ["19:25", "Breakout: Netzwerk-Notruf – fünf Fälle"],
      ["20:15", "Auswertung: eure Diagnosen"],
      ["20:35", "Das Finale: github.com – ihr erzählt, ich klicke"],
      ["20:55", "Blockabschluss und Ausblick auf Montag"],
    ],
    { y: 1.92, rowH: 0.26, fontSize: 10.5 }
  );
  api.kicker(s, "Ab Montag heißt es Virtualisierung – heute machen wir das Netz fertig.", { y: 4.6 });
});

// Warmup als Klick-Auflösung – knüpft an Montag an
deck.content("Warmup", "Antwort in den Chat – 40 Sekunden", (s, api) => {
  api.statement(s, "Ein /27-Netz:\nWie viele Geräte passen hinein?", { y: 2.0, h: 1.3, fontSize: 26 });
  api.kicker(s, "Das Rezept von Montag: Hostbits → Blockgröße → minus zwei.", { y: 4.5, color: C.textLeise });
});

deck.content("Warmup", "Auflösung", (s, api) => {
  api.statement(s, "Ein /27-Netz:\nWie viele Geräte passen hinein?", { y: 2.0, h: 1.3, fontSize: 26 });
  api.card(s, {
    y: 3.5,
    h: 1.0,
    titel: "30 Geräte",
    body: "5 Hostbits → 2⁵ = 32 Adressen, minus Netzadresse und Broadcast. Wer 32 gesagt hat: willkommen im Klub von Montag – jetzt sitzt es.",
    fontSize: 11.5,
    titleH: 0.28,
    akzent: "teal",
  });
});

// ============================================================ Routing
deck.abschnitt("Routing", "blau");

deck.kapitel("Den Weg finden", "Was ein Router wirklich tut, wenn euer Paket ankommt", {
  nummer: "01",
});

deck.content("Wie ein Paket seinen Weg findet", "Die Routing-Tabelle", (s, api) => {
  s.addImage({ path: D.routingWeg(), x: T.RAND, y: 1.72, w: T.INHALT_W, h: 2.25 });
  api.card(s, {
    y: 4.12,
    h: 0.66,
    hell: true,
    body: "Und das passiert an jedem Hop neu: Kein Router kennt den ganzen Weg – jeder kennt nur seinen nächsten Schritt. Deshalb zeigt tracert eine Kette.",
    fontSize: 11.5,
  });
});

// ============================================================ Trennen
deck.abschnitt("Netze trennen", "teal");

deck.kapitel("Getrennt, obwohl verkabelt", "VLAN, DMZ und die Firewall dazwischen", {
  nummer: "02",
  akzent: "teal",
});

deck.content("VLAN – ein Switch, mehrere Netze", "Logische Trennung", (s, api) => {
  s.addImage({ path: D.vlanSwitch(), x: T.RAND, y: 1.72, w: T.INHALT_W, h: 2.4 });
  api.kicker(s, "Das ist die technische Antwort auf euren Subnetz-Plan von Montag: Gäste und Server trennt man nicht nur auf dem Papier.", { y: 4.5 });
});

deck.content("Das Zonenmodell", "Wer darf wohin?", (s, api) => {
  s.addImage({ path: D.zonenModell(), x: T.RAND, y: 1.7, w: T.INHALT_W, h: 2.35 });
  api.kicker(s, "Merkt euch das Muster – es kommt beim Sicherheitsblock wieder und trägt jede Infrastrukturplanung.", { y: 4.44 });
});

// ============================================================ Quickcheck
deck.abschnitt("Quickcheck", "teal");

deck.content("Quickcheck DNS & DHCP", "Antwort in den Chat", (s, api) => {
  api.lead(s, "Laut eurer Standortbestimmung sitzt beides – der Beweis in zwei Fragen.");
  api.cardRow(
    s,
    [
      {
        nummer: "1",
        titel: "DHCP",
        body: "Ein Gerät kommt frisch ins Netz und hat noch keine Adresse. Welche vier Schritte laufen ab – in der richtigen Reihenfolge?",
        akzent: "teal",
      },
      {
        nummer: "2",
        titel: "DNS",
        body: "Ihr ändert einen DNS-Eintrag, aber die halbe Welt sieht noch den alten. Welcher Mechanismus steckt dahinter?",
        akzent: "teal",
      },
    ],
    { y: 2.16, h: 1.9, titleH: 0.3, fontSize: 11.5 }
  );
  api.kicker(s, "Kein Nachschlagen – erst raten, dann klicke ich.", { y: 4.5, color: C.textLeise });
});

deck.content("Quickcheck DNS & DHCP", "Auflösung", (s, api) => {
  api.cardRow(
    s,
    [
      {
        nummer: "1",
        titel: "DORA",
        body: "Discover – Offer – Request – Acknowledge. Das Gerät ruft ins Netz, der Server bietet an, das Gerät nimmt an, der Server bestätigt und verleast die Adresse.",
        akzent: "teal",
      },
      {
        nummer: "2",
        titel: "TTL und Caching",
        body: "Jeder DNS-Eintrag trägt eine Lebensdauer. Resolver weltweit halten die alte Antwort, bis ihre TTL abläuft – deshalb dauert eine Umstellung Stunden, nicht Sekunden.",
        akzent: "teal",
      },
    ],
    { y: 1.9, h: 2.2, titleH: 0.3, fontSize: 11.5 }
  );
  api.kicker(s, "Beides kommt im Betrieb ständig vor – und beides steht ausführlich auf der Kursseite.", { y: 4.5 });
});

// ============================================================ Breakout
deck.abschnitt("Breakout", "bernstein");

deck.kapitel("Netzwerk-Notruf", "50 Minuten in Gruppen – fünf Anrufe, fünf Diagnosen", {
  nummer: "03",
  akzent: "bernstein",
});

deck.content("Der Auftrag", "Breakout · 50 Minuten", (s, api) => {
  api.lead(s, "Fünf Störungsmeldungen, zu jeder ein paar echte Befehlsausgaben. Ihr benennt Schicht, Ursache und Fix – die Checkliste führt euch.");
  api.schedule(
    s,
    [
      ["Fall 1", "„Ich komme nirgendwo hin“ – der Klassiker zum Warmwerden"],
      ["Fall 2", "„Webseiten gehen nicht, aber …“ – genau hinsehen"],
      ["Fall 3", "„Nur das Internet fehlt“ – Montag hilft"],
      ["Fall 4", "„Komische Adresse“ – Montag hilft sehr"],
      ["Fall 5", "„Server pingt, aber die App nicht“ – der Mittwochsfall"],
    ],
    { y: 2.16, rowH: 0.34, labelW: 0.95, fontSize: 11.5, akzent: "bernstein" }
  );
  api.card(s, {
    y: 3.96,
    h: 0.92,
    hell: true,
    titel: "Jetzt öffnen – beides braucht ihr gleich im Raum",
    body: [
      "Fälle und Checkliste:  " + LINK_UEBUNG,
      "Diagnosen eintragen:  " + LINK_DOKUMENT,
    ],
    fontSize: 10.5,
    titleH: 0.24,
    akzent: "bernstein",
  });
});

deck.content("So arbeitet ihr", "Spielregeln", (s, api) => {
  api.bullets(
    s,
    [
      "Gleiche Gruppen, gleiche Sprecher. Eine Person teilt den Bildschirm.",
      "Arbeitet die Checkliste von unten nach oben ab – sie ist euer Werkzeug, nicht eure Fessel.",
      "Pro Fall festhalten: Schicht, Beweis aus der Ausgabe, Ursache, Fix – ein Satz je Punkt reicht.",
      "Hilfekarten erst nach ehrlichem Versuch. Die Lösungen bleiben zu, bis wir auswerten.",
      "Wenn es klemmt: in eurem Raum auf „Um Hilfe bitten“ klicken.",
    ],
    { y: 1.86, h: 2.2, fontSize: 12.5, akzent: "bernstein" }
  );
  api.card(s, {
    y: 3.94,
    h: 0.9,
    titel: "Um 20:15 sind alle wieder hier",
    body: "Jede Gruppe übernimmt in der Auswertung einen Fall – bearbeitet trotzdem alle fünf.",
    fontSize: 11.5,
    titleH: 0.26,
    akzent: "bernstein",
  });
});

// ============================================================ Auswertung
deck.abschnitt("Auswertung", "blau");

deck.content("Eure Diagnosen", "Auswertung · 20 Minuten", (s, api) => {
  api.schedule(
    s,
    [
      ["1", "Jede Gruppe stellt ihren Fall vor: Schicht, Beweis, Ursache, Fix"],
      ["2", "Das Plenum prüft: Hätte ein anderer Befehl schneller ans Ziel geführt?"],
      ["3", "Der fünfte Fall gemeinsam – wer hat ihn geknackt?"],
      ["4", "Dann die Auflösungstabelle – und die Fälle, wo Montag geholfen hat"],
    ],
    { y: 1.96, rowH: 0.44, labelW: 0.45, fontSize: 12 }
  );
  api.card(s, {
    y: 4.1,
    h: 0.66,
    hell: true,
    body: "Die Diagnose zählt mehr als der Fix: Wer die Schicht sauber belegt hat, bekommt den Rest geschenkt.",
    fontSize: 11.5,
  });
});

deck.content("Die Auflösung der fünf Fälle", "Auswertung", (s, api) => {
  api.schedule(
    s,
    [
      ["Fall 1", "APIPA, kein DHCP erreichbar – Symptom auf 3, Ursache dahinter"],
      ["Fall 2", "DNS antwortet nicht – IP-Ping läuft, Namen sterben (Schicht 7)"],
      ["Fall 3", "Falsches Default-Gateway – lokal alles gut, draußen nichts (Schicht 3)"],
      ["Fall 4", "Falsche Subnetzmaske /24 statt /25 – der Montags-Fall in freier Wildbahn"],
      ["Fall 5", "Firewall blockt den Port – ping ja, Dienst nein (Schicht 4)"],
    ],
    { y: 1.9, rowH: 0.42, labelW: 0.95, fontSize: 11.5 }
  );
  api.kicker(s, "Fünf Fälle, fünf Schichten – und jedes Mal hat die Checkliste den Weg gezeigt, nicht das Raten.", { y: 4.5 });
});

// ============================================================ Finale
deck.abschnitt("Das Finale", "blau");

deck.kapitel("Die Leitfrage", "Was passiert, wenn ich github.com eintippe? Ihr erzählt – ich klicke.", {
  nummer: "04",
});

for (let stufe = 0; stufe <= 5; stufe++) {
  deck.content(
    "Die Leitfrage vom ersten Abend",
    stufe === 0 ? "Eure Antwort, Station für Station" : `Station ${stufe} von 5`,
    (s, api) => {
      s.addImage({ path: D.wegGithub(stufe), x: T.RAND, y: 1.75, w: T.INHALT_W, h: 2.5 });
      if (stufe === 5) {
        api.kicker(s, "Vom ersten Abend bis heute: Modell, Adressen, Weg, Trennung – alles steckt in dieser einen Antwort.", { y: 4.52 });
      }
    }
  );
}

// ============================================================ Abschluss
deck.abschnitt("Abschluss", "blau");

deck.content("Was der Netzwerkblock euch gegeben hat", "Drei Abende, ein Werkzeugkasten", (s, api) => {
  api.cardRow(
    s,
    [
      {
        titel: "Ein Raster",
        body: "Die Schichten als Suchraster: von unten nach oben, jeder Befehl beweist seine Schicht. Heute habt ihr fünf echte Fälle damit gelöst.",
      },
      {
        titel: "Ein Handwerk",
        body: "Subnetze rechnen und Netze planen – Maske, Blockgröße, minus zwei. Das tragt ihr in jede Infrastruktur, die noch kommt.",
        akzent: "teal",
      },
      {
        titel: "Ein Muster",
        body: "Netze trennt man mit Absicht: VLAN, DMZ, Firewall-Regeln. Das Zonenmodell seht ihr im Sicherheitsblock wieder.",
        akzent: "bernstein",
      },
    ],
    { y: 1.95, h: 2.15, titleH: 0.28, fontSize: 11 }
  );
  api.card(s, {
    y: 4.24,
    h: 0.56,
    hell: true,
    body: "Alles bleibt online zum Nachschlagen – inklusive der Seiten, die wir nicht gemeinsam behandelt haben.",
    fontSize: 11.5,
  });
});

deck.content("Bis Montag", "Ausblick", (s, api) => {
  api.lead(s, "Ab Montag bauen wir – der Netzwerkblock ist geschafft.");
  api.cardRow(
    s,
    [
      {
        titel: "Virtualisierung",
        body: "Hypervisor, virtuelle Maschinen, virtuelle Netze – und ihr startet eure erste eigene VM. Das Werkzeug dafür richten wir gemeinsam ein.",
      },
      {
        titel: "Nichts vorbereiten",
        body: "Ihr braucht nur euren Rechner. Wer mag, liest vorab die Seite „Virtualisierung“ auf der Kursseite an – Pflicht ist das nicht.",
      },
      {
        titel: "Offene Rechnungen",
        body: "Wer bei den Fällen 3 und 4 geschwommen ist: Die Montags-Seiten zu Adressierung und Routing schließen die Lücke.",
      },
    ],
    { y: 2.16, h: 2.1, titleH: 0.28 }
  );
  api.kicker(s, "Nächster Termin: Montag, 7. September, 18:00 Uhr – Virtualisierung.", { y: 4.5 });
});

deck.schluss({
  title: "Netzwerkblock: geschafft.",
  subtitle: "Drei Abende, zwei Übungen, eine beantwortete Leitfrage – alles zum Nachlesen auf der Kursseite.",
  note: "Montag, 7. September · Virtualisierung",
});

// ============================================================ Bauen

deck.save(path.join(__dirname, "dist", "03-routing-vlan-sicherheit.pptx")).then((r) => {
  console.log(`Fertig: ${r.file} – ${r.slides} Folien`);
});
