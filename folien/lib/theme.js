// Folien-Design für den Kurs "Systemintegration und Vernetzung"
//
// Gestaltungsidee: aufgeräumt und seriös, angelehnt an den Auftritt von
// Cloudhelden – weißer Grund, Indigo-Blau als Leitfarbe, dunkles Navy für
// Überschriften, viel Weißraum. Farbe wird sparsam eingesetzt und trägt
// Bedeutung: Sekundärfarben nur, wo etwas unterschieden werden soll.
//
// Schriftwahl: Arial und Courier New sind auf Windows und macOS vorinstalliert.
// Calibri und Consolas gibt es nur mit Microsoft Office – fehlt Office, ersetzt
// das Präsentationsprogramm sie durch eine breitere Schrift, und der Text läuft
// aus seinen Kästen.
//
// Nutzung:
//   const { createDeck } = require("./lib/theme");
//   const deck = createDeck({ title: "...", akzent: "blau" });
//   deck.title({ eyebrow, title, subtitle, note });
//   deck.abschnitt("Fußzeilen-Label", "blau");
//   deck.kapitel("Überschrift", "Untertitel", { nummer: "2" });
//   deck.content("Überschrift", "Label", (s, api) => { ... });
//   await deck.save("datei.pptx");

const pptxgen = require("pptxgenjs");

// ---------------------------------------------------------------- Farben

const C = {
  bg: "FFFFFF", // Folienhintergrund
  bgTief: "F5F6FC", // ruhige Fläche für Kapiteltrenner und Schluss
  flaeche: "F5F6FC", // Karten
  flaecheHell: "EEF0FB", // hervorgehobene Karten
  linie: "DFE3F0", // Trennlinien und Rahmen

  text: "434A63", // Fließtext
  textStark: "272E52", // Überschriften, Navy
  textLeise: "5C6377", // Nebeninformationen

  // Leitfarbe: das Blau von Cloudhelden
  blau: "3843AF",
  blauTief: "EEF0FB",
  // Sekundärfarben, bewusst gedämpft
  teal: "0F7C86",
  tealTief: "E6F4F5",
  bernstein: "A96D12",
  bernsteinTief: "FBF2E3",
  rot: "B33A3A",
  rotTief: "FAECEC",
};

const AKZENTE = {
  blau: { farbe: C.blau, tief: C.blauTief },
  teal: { farbe: C.teal, tief: C.tealTief },
  bernstein: { farbe: C.bernstein, tief: C.bernsteinTief },
  rot: { farbe: C.rot, tief: C.rotTief },
};

const FONT_BODY = "Arial";
const FONT_MONO = "Courier New";

const SLIDE_W = 10;
const SLIDE_H = 5.625;
const RAND = 0.62;
const TITEL_Y = 0.42;
const INHALT_Y = 1.62; // direkt unter der Überschrift
const INHALT_NACH_LEAD = 2.16; // wenn ein Einleitungssatz darübersteht
const FUSS_Y = SLIDE_H - 0.46;

const T = {
  C,
  FONT_BODY,
  FONT_MONO,
  SLIDE_W,
  SLIDE_H,
  RAND,
  INHALT_Y,
  INHALT_NACH_LEAD,
  INHALT_W: SLIDE_W - 2 * RAND,
};

// ------------------------------------------------------------- Bausteine

function akzentlinie(pres, slide, akzent) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: RAND,
    y: TITEL_Y - 0.2,
    w: 0.52,
    h: 0.055,
    fill: { color: akzent.farbe },
    line: { type: "none" },
  });
}

function fusszeile(pres, slide, label, nummer, gesamt, akzent) {
  slide.addShape(pres.shapes.LINE, {
    x: RAND,
    y: FUSS_Y - 0.1,
    w: SLIDE_W - 2 * RAND,
    h: 0,
    line: { color: C.linie, width: 0.75 },
  });
  if (label) {
    slide.addText(label, {
      x: RAND,
      y: FUSS_Y,
      w: 5.5,
      h: 0.26,
      fontFace: FONT_BODY,
      fontSize: 10.5,
      color: C.textLeise,
      charSpacing: 0.3,
      valign: "middle",
      margin: 0,
    });
  }
  slide.addText(`${nummer}/${gesamt}`, {
    x: SLIDE_W - RAND - 0.6,
    y: FUSS_Y,
    w: 0.6,
    h: 0.26,
    fontFace: FONT_BODY,
    fontSize: 10.5,
    color: C.textLeise,
    align: "right",
    valign: "middle",
    margin: 0,
  });
}

function ueberschrift(slide, titel, label, akzent) {
  if (label) {
    slide.addText(String(label).toUpperCase(), {
      x: RAND,
      y: TITEL_Y,
      w: SLIDE_W - 2 * RAND,
      h: 0.26,
      fontFace: FONT_BODY,
      fontSize: 11.5,
      color: akzent.farbe,
      bold: true,
      charSpacing: 1.8,
      valign: "middle",
      margin: 0,
    });
  }
  slide.addText(titel, {
    x: RAND,
    y: label ? TITEL_Y + 0.38 : TITEL_Y + 0.24,
    w: SLIDE_W - 2 * RAND,
    h: 0.66,
    fontFace: FONT_BODY,
    fontSize: 26,
    color: C.textStark,
    bold: true,
    valign: "top",
    margin: 0,
  });
}

// ------------------------------------------------------------------- API

function makeApi(pres, holeAkzent) {
  const api = {
    T,
    C,
    AKZENTE,

    lead(slide, text, opts = {}) {
      slide.addText(text, {
        x: RAND,
        y: opts.y ?? 1.58,
        w: opts.w ?? SLIDE_W - 2 * RAND,
        h: opts.h ?? 0.48,
        fontFace: FONT_BODY,
        fontSize: opts.fontSize ?? 13,
        color: opts.color ?? C.textLeise,
        valign: "top",
        margin: 0,
      });
    },

    /** Aufzählung mit farbigen Merkzeichen. */
    bullets(slide, items, opts = {}) {
      const akzent = opts.akzent ? AKZENTE[opts.akzent] : holeAkzent();
      const arr = [];
      items.forEach((it, i) => {
        const isObj = typeof it === "object" && it !== null;
        arr.push({
          text: opts.numbered ? `${i + 1}   ` : "▸   ",
          options: { color: akzent.farbe, bold: true, breakLine: false },
        });
        arr.push({
          text: isObj ? it.text : it,
          options: {
            color: isObj && it.color ? it.color : opts.color ?? C.text,
            bold: isObj ? !!it.bold : false,
            breakLine: i < items.length - 1,
            paraSpaceAfter: opts.spaceAfter ?? 9,
          },
        });
      });
      slide.addText(arr, {
        x: opts.x ?? RAND,
        y: opts.y ?? INHALT_Y,
        w: opts.w ?? SLIDE_W - 2 * RAND,
        h: opts.h ?? 2.8,
        fontFace: FONT_BODY,
        fontSize: opts.fontSize ?? 14.5,
        lineSpacingMultiple: opts.lineSpacing ?? 0.92,
        valign: "top",
        margin: 0,
      });
    },

    /** Terminal-Kasten für Befehle. */
    code(slide, text, opts = {}) {
      const x = opts.x ?? RAND;
      const y = opts.y ?? INHALT_Y;
      const w = opts.w ?? SLIDE_W - 2 * RAND;
      const h = opts.h ?? 2.3;
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h,
        fill: { color: C.flaecheHell },
        line: { color: C.linie, width: 1 },
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h: 0.24,
        fill: { color: C.flaeche },
        line: { type: "none" },
      });
      slide.addText(opts.titel ?? "Terminal", {
        x: x + 0.16,
        y: y + 0.01,
        w: w - 0.32,
        h: 0.22,
        fontFace: FONT_MONO,
        fontSize: 10,
        color: C.textLeise,
        valign: "middle",
        margin: 0,
      });
      slide.addText(text, {
        x: x + 0.2,
        y: y + 0.34,
        w: w - 0.4,
        h: h - 0.48,
        fontFace: FONT_MONO,
        fontSize: opts.fontSize ?? 12,
        color: opts.color ?? C.textStark,
        valign: "top",
        margin: 0,
        paraSpaceAfter: 0,
      });
    },

    /** Karte mit farbiger Kante links statt Rahmen ringsum. */
    card(slide, opts = {}) {
      const akzent = opts.akzent ? AKZENTE[opts.akzent] : holeAkzent();
      const x = opts.x ?? RAND;
      const y = opts.y ?? INHALT_Y;
      const w = opts.w ?? SLIDE_W - 2 * RAND;
      const h = opts.h ?? 1.2;

      slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h,
        fill: { color: opts.hell ? C.flaecheHell : C.flaeche },
        line: { type: "none" },
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 0.045, h,
        fill: { color: akzent.farbe },
        line: { type: "none" },
      });

      let cursor = y + 0.16;
      const innenX = x + 0.26;
      const innenW = w - 0.44;

      if (opts.icon) {
        const ig = opts.iconGroesse ?? 0.3;
        slide.addImage({
          path: opts.icon,
          x: x + w - ig - 0.16,
          y: y + 0.14,
          w: ig,
          h: ig,
        });
      }

      if (opts.nummer) {
        slide.addText(String(opts.nummer), {
          x: innenX,
          y: cursor - 0.06,
          w: 0.42,
          h: 0.45,
          fontFace: FONT_MONO,
          fontSize: 20,
          color: akzent.farbe,
          bold: true,
          valign: "top",
          margin: 0,
        });
      }
      const textX = opts.nummer ? innenX + 0.54 : innenX;
      const textW = opts.nummer ? innenW - 0.54 : innenW;

      if (opts.titel) {
        const titleH = opts.titleH ?? 0.28;
        slide.addText(opts.titel, {
          x: textX,
          y: cursor,
          w: textW,
          h: titleH,
          fontFace: FONT_BODY,
          fontSize: opts.titleSize ?? 13,
          color: C.textStark,
          bold: true,
          valign: "top",
          margin: 0,
        });
        cursor += titleH + 0.05;
      }

      if (opts.body) {
        const body = Array.isArray(opts.body)
          ? opts.body.map((b, i) => ({
              text: b,
              options: { breakLine: i < opts.body.length - 1, paraSpaceAfter: 5 },
            }))
          : opts.body;
        slide.addText(body, {
          x: textX,
          y: cursor,
          w: textW,
          h: y + h - cursor - 0.13,
          fontFace: FONT_BODY,
          fontSize: opts.fontSize ?? 12,
          color: C.text,
          lineSpacingMultiple: 0.92,
          valign: "top",
          margin: 0,
        });
      }
    },

    /** Mehrere Karten nebeneinander. opts.akzente: Farbnamen je Karte. */
    cardRow(slide, cards, opts = {}) {
      const y = opts.y ?? INHALT_Y;
      const h = opts.h ?? 2.5;
      const gap = opts.gap ?? 0.24;
      const gesamt = SLIDE_W - 2 * RAND;
      const w = (gesamt - gap * (cards.length - 1)) / cards.length;
      const reihe = opts.akzente ?? [];
      cards.forEach((c, i) => {
        api.card(slide, {
          ...c,
          akzent: c.akzent ?? reihe[i],
          x: RAND + i * (w + gap),
          y,
          w,
          h,
          fontSize: c.fontSize ?? opts.fontSize ?? 11.5,
          titleSize: c.titleSize ?? opts.titleSize ?? 13,
          titleH: c.titleH ?? opts.titleH ?? 0.28,
        });
      });
    },

    /**
     * Gestapelte Chips mit Technologie-Logo und Name.
     * items: [{ icon?: PNG-Pfad, label }], opts: x, y, w, chipH, gap, fontSize
     */
    logoChips(slide, items, opts = {}) {
      const x = opts.x ?? RAND;
      const w = opts.w ?? 2.8;
      const chipH = opts.chipH ?? 0.42;
      const gap = opts.gap ?? 0.12;
      let y = opts.y ?? INHALT_Y;
      items.forEach((it) => {
        slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
          x,
          y,
          w,
          h: chipH,
          rectRadius: 0.05,
          fill: { color: C.flaeche },
          line: { color: C.linie, width: 0.75 },
        });
        const iconW = it.icon ? 0.26 : 0;
        if (it.icon) {
          slide.addImage({
            path: it.icon,
            x: x + 0.14,
            y: y + (chipH - 0.26) / 2,
            w: 0.26,
            h: 0.26,
          });
        }
        slide.addText(it.label, {
          x: x + 0.14 + (it.icon ? iconW + 0.12 : 0.04),
          y,
          w: w - 0.28 - (it.icon ? iconW + 0.12 : 0),
          h: chipH,
          fontFace: FONT_BODY,
          fontSize: opts.fontSize ?? 11.5,
          color: C.textStark,
          bold: true,
          valign: "middle",
          margin: 0,
        });
        y += chipH + gap;
      });
    },

    /** Ablaufplan mit Monospace-Marken. */
    schedule(slide, rows, opts = {}) {
      const akzent = opts.akzent ? AKZENTE[opts.akzent] : holeAkzent();
      const y = opts.y ?? INHALT_Y;
      const rowH = opts.rowH ?? 0.38;
      const labelW = opts.labelW ?? 1.1;
      rows.forEach((r, i) => {
        const ry = y + i * rowH;
        if (opts.streifen !== false && i % 2 === 0) {
          slide.addShape(pres.shapes.RECTANGLE, {
            x: RAND - 0.14,
            y: ry,
            w: SLIDE_W - 2 * RAND + 0.28,
            h: rowH,
            fill: { color: C.flaeche },
            line: { type: "none" },
          });
        }
        slide.addText(r[0], {
          x: RAND,
          y: ry,
          w: labelW,
          h: rowH,
          fontFace: FONT_MONO,
          fontSize: opts.fontSize ?? 11,
          color: akzent.farbe,
          bold: true,
          valign: "middle",
          margin: 0,
        });
        slide.addText(r[1], {
          x: RAND + labelW,
          y: ry,
          w: SLIDE_W - 2 * RAND - labelW,
          h: rowH,
          fontFace: FONT_BODY,
          fontSize: opts.fontSize ?? 11,
          color: C.text,
          valign: "middle",
          margin: 0,
        });
      });
    },

    /** Waagerechter Ablauf mit Stationen. */
    timeline(slide, stationen, opts = {}) {
      const akzent = opts.akzent ? AKZENTE[opts.akzent] : holeAkzent();
      const y = opts.y ?? 2.9;
      const boxW = opts.boxW ?? 1.32;
      const x0 = RAND + boxW / 2;
      const w = SLIDE_W - 2 * RAND - boxW;
      slide.addShape(pres.shapes.LINE, {
        x: x0, y, w, h: 0,
        line: { color: C.linie, width: 2 },
      });
      const step = stationen.length > 1 ? w / (stationen.length - 1) : 0;
      stationen.forEach((st, i) => {
        const cx = x0 + i * step;
        const letzte = i === stationen.length - 1;
        const farbe = letzte ? C.rot : akzent.farbe;
        slide.addShape(pres.shapes.OVAL, {
          x: cx - 0.085,
          y: y - 0.085,
          w: 0.17,
          h: 0.17,
          fill: { color: farbe },
          line: { type: "none" },
        });
        slide.addText(st.label, {
          x: cx - boxW / 2,
          y: y - 0.6,
          w: boxW,
          h: 0.44,
          fontFace: FONT_BODY,
          fontSize: opts.fontSize ?? 11.5,
          color: farbe,
          bold: true,
          align: "center",
          valign: "bottom",
          margin: 0,
        });
        if (st.sub) {
          slide.addText(st.sub, {
            x: cx - boxW / 2,
            y: y + 0.18,
            w: boxW,
            h: 0.78,
            fontFace: FONT_BODY,
            fontSize: opts.subSize ?? 11,
            color: C.textLeise,
            align: "center",
            valign: "top",
            margin: 0,
          });
        }
      });
    },

    /** Große Kennzahl als Blickfang. */
    kennzahl(slide, opts = {}) {
      const akzent = opts.akzent ? AKZENTE[opts.akzent] : holeAkzent();
      const x = opts.x ?? RAND;
      const y = opts.y ?? INHALT_Y;
      const w = opts.w ?? 2.4;
      const zahlH = opts.zahlH ?? 0.8;
      slide.addText(String(opts.zahl), {
        x, y, w,
        h: zahlH,
        fontFace: FONT_BODY,
        fontSize: opts.fontSize ?? 40,
        color: akzent.farbe,
        bold: true,
        align: opts.align ?? "left",
        valign: "top",
        margin: 0,
      });
      if (opts.label) {
        slide.addText(opts.label, {
          x,
          y: y + zahlH,
          w,
          h: opts.labelH ?? 0.85,
          fontFace: FONT_BODY,
          fontSize: opts.labelSize ?? 11.5,
          color: C.textLeise,
          align: opts.align ?? "left",
          valign: "top",
          margin: 0,
        });
      }
    },

    /** Große, zentrierte Aussage. */
    statement(slide, text, opts = {}) {
      const akzent = opts.akzent ? AKZENTE[opts.akzent] : holeAkzent();
      slide.addText(text, {
        x: RAND + 0.3,
        y: opts.y ?? 2.0,
        w: SLIDE_W - 2 * RAND - 0.6,
        h: opts.h ?? 1.25,
        fontFace: FONT_BODY,
        fontSize: opts.fontSize ?? 27,
        color: opts.color ?? akzent.farbe,
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
    },

    /** Abschlusszeile mit farbigem Strich davor. */
    kicker(slide, text, opts = {}) {
      const akzent = opts.akzent ? AKZENTE[opts.akzent] : holeAkzent();
      const y = Math.min(opts.y ?? 4.52, 4.64);
      slide.addShape(pres.shapes.RECTANGLE, {
        x: RAND,
        y: y + 0.05,
        w: 0.035,
        h: 0.28,
        fill: { color: akzent.farbe },
        line: { type: "none" },
      });
      slide.addText(text, {
        x: RAND + 0.2,
        y,
        w: SLIDE_W - 2 * RAND - 0.2,
        h: 0.44,
        fontFace: FONT_BODY,
        fontSize: opts.fontSize ?? 12,
        color: opts.color ?? C.text,
        italic: opts.italic ?? false,
        bold: opts.bold ?? true,
        valign: "middle",
        margin: 0,
      });
    },

    /** Bild mit farbigem Rahmenakzent; ohne Datei ein Platzhalter. */
    photo(slide, opts = {}) {
      const akzent = opts.akzent ? AKZENTE[opts.akzent] : holeAkzent();
      const x = opts.x ?? RAND;
      const y = opts.y ?? INHALT_Y;
      const w = opts.w ?? 2.4;
      const h = opts.h ?? 2.4;
      if (opts.path) {
        slide.addShape(pres.shapes.RECTANGLE, {
          x: x - 0.045,
          y: y - 0.045,
          w: w + 0.09,
          h: h + 0.09,
          fill: { color: akzent.farbe },
          line: { type: "none" },
        });
        slide.addImage({ path: opts.path, x, y, w, h, sizing: { type: "cover", w, h } });
      } else {
        slide.addShape(pres.shapes.RECTANGLE, {
          x, y, w, h,
          fill: { color: C.flaeche },
          line: { color: C.linie, width: 1, dashType: "dash" },
        });
        slide.addText(opts.placeholder ?? "Foto", {
          x, y, w, h,
          fontFace: FONT_BODY,
          fontSize: 11,
          color: C.textLeise,
          align: "center",
          valign: "middle",
          margin: 0,
        });
      }
    },
  };
  return api;
}

// ----------------------------------------------------------------- Deck

function createDeck(meta = {}) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = meta.author ?? "Jacob Menge";
  pres.company = meta.company ?? "";
  pres.title = meta.title ?? "";
  pres.subject = meta.subject ?? "";

  let aktiverAkzent = AKZENTE[meta.akzent ?? "blau"];
  const holeAkzent = () => aktiverAkzent;
  const api = makeApi(pres, holeAkzent);

  const nummeriert = [];
  let label = "";

  const deck = {
    pres,
    api,
    AKZENTE,

    /** Setzt Fußzeilen-Label und Akzentfarbe für die folgenden Folien. */
    abschnitt(neuesLabel, akzentName) {
      label = neuesLabel;
      if (akzentName && AKZENTE[akzentName]) aktiverAkzent = AKZENTE[akzentName];
      return deck;
    },

    /** Titelfolie. logo: Pfad zu einem PNG, erscheint oben rechts. */
    title({ eyebrow, title, subtitle, note, logo }) {
      const s = pres.addSlide();
      s.background = { color: C.bg };
      const ak = aktiverAkzent;

      if (logo) {
        s.addImage({ path: logo, x: 8.45, y: 0.4, w: 0.95, h: 0.95 });
      }

      s.addShape(pres.shapes.RECTANGLE, {
        x: 0, y: 0, w: 0.14, h: SLIDE_H,
        fill: { color: ak.farbe },
        line: { type: "none" },
      });

      if (eyebrow) {
        s.addText(String(eyebrow).toUpperCase(), {
          x: 1.0, y: 1.4, w: 8.35, h: 0.3,
          fontFace: FONT_BODY,
          fontSize: 12,
          color: ak.farbe,
          bold: true,
          charSpacing: 2.2,
          margin: 0,
        });
      }
      s.addText(title, {
        x: 1.0, y: 1.84, w: 8.35, h: 1.12,
        fontFace: FONT_BODY,
        fontSize: 42,
        color: C.textStark,
        bold: true,
        valign: "top",
        margin: 0,
      });
      if (subtitle) {
        s.addText(subtitle, {
          x: 1.0, y: 3.02, w: 8.35, h: 0.78,
          fontFace: FONT_BODY,
          fontSize: 17,
          color: C.text,
          valign: "top",
          margin: 0,
        });
      }
      if (note) {
        s.addShape(pres.shapes.LINE, {
          x: 1.0, y: 4.36, w: 2.0, h: 0,
          line: { color: C.linie, width: 1 },
        });
        s.addText(note, {
          x: 1.0, y: 4.46, w: 8.35, h: 0.3,
          fontFace: FONT_BODY,
          fontSize: 11,
          color: C.textLeise,
          margin: 0,
        });
      }
      return s;
    },

    /** Kapiteltrenner mit großer Nummer. */
    kapitel(titel, untertitel, opts = {}) {
      const ak = opts.akzent ? AKZENTE[opts.akzent] : aktiverAkzent;
      const s = pres.addSlide();
      s.background = { color: C.bg };

      s.addShape(pres.shapes.RECTANGLE, {
        x: 6.95, y: 0, w: 3.05, h: SLIDE_H,
        fill: { color: ak.tief },
        line: { type: "none" },
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: 6.95, y: 0, w: 0.05, h: SLIDE_H,
        fill: { color: ak.farbe },
        line: { type: "none" },
      });

      if (opts.nummer) {
        s.addText(String(opts.nummer), {
          x: 7.25, y: 1.6, w: 2.4, h: 1.9,
          fontFace: FONT_BODY,
          fontSize: 84,
          color: ak.farbe,
          bold: true,
          align: "center",
          valign: "middle",
          margin: 0,
        });
      }

      s.addShape(pres.shapes.RECTANGLE, {
        x: RAND, y: 2.06, w: 0.52, h: 0.055,
        fill: { color: ak.farbe },
        line: { type: "none" },
      });
      s.addText(titel, {
        x: RAND, y: 2.28, w: 5.9, h: 0.95,
        fontFace: FONT_BODY,
        fontSize: 30,
        color: C.textStark,
        bold: true,
        valign: "top",
        margin: 0,
      });
      if (untertitel) {
        s.addText(untertitel, {
          x: RAND, y: 3.3, w: 5.9, h: 0.6,
          fontFace: FONT_BODY,
          fontSize: 13.5,
          color: C.textLeise,
          valign: "top",
          margin: 0,
        });
      }
      return s;
    },

    /** Inhaltsfolie. */
    content(titel, kopflabel, build) {
      const s = pres.addSlide();
      s.background = { color: C.bg };
      const ak = aktiverAkzent;
      akzentlinie(pres, s, ak);
      ueberschrift(s, titel, kopflabel, ak);
      nummeriert.push({ slide: s, label, akzent: ak });
      if (typeof build === "function") build(s, api);
      return s;
    },

    /** Folie ohne Überschrift. */
    blank(build) {
      const s = pres.addSlide();
      s.background = { color: C.bg };
      nummeriert.push({ slide: s, label, akzent: aktiverAkzent });
      if (typeof build === "function") build(s, api);
      return s;
    },

    /** Schlussfolie ohne Fußzeile. */
    schluss({ title, subtitle, note }) {
      const s = pres.addSlide();
      s.background = { color: C.bgTief };
      const ak = aktiverAkzent;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0, y: SLIDE_H - 0.14, w: SLIDE_W, h: 0.14,
        fill: { color: ak.farbe },
        line: { type: "none" },
      });
      s.addText(title, {
        x: RAND, y: 2.0, w: SLIDE_W - 2 * RAND, h: 1.0,
        fontFace: FONT_BODY,
        fontSize: 32,
        color: C.textStark,
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      if (subtitle) {
        s.addText(subtitle, {
          x: RAND, y: 3.05, w: SLIDE_W - 2 * RAND, h: 0.5,
          fontFace: FONT_BODY,
          fontSize: 14,
          color: C.textLeise,
          align: "center",
          valign: "top",
          margin: 0,
        });
      }
      if (note) {
        s.addText(note, {
          x: RAND, y: 3.72, w: SLIDE_W - 2 * RAND, h: 0.5,
          fontFace: FONT_BODY,
          fontSize: 16,
          color: ak.farbe,
          bold: true,
          align: "center",
          valign: "top",
          margin: 0,
        });
      }
      return s;
    },

    async save(file) {
      const gesamt = nummeriert.length;
      nummeriert.forEach((e, i) =>
        fusszeile(pres, e.slide, e.label, i + 1, gesamt, e.akzent)
      );
      await pres.writeFile({ fileName: file });
      return { file, slides: pres.slides.length, numbered: gesamt };
    },
  };

  return deck;
}

module.exports = { createDeck, T, C, AKZENTE, FONT_BODY, FONT_MONO };
