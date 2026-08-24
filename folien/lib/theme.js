// Gemeinsames Folien-Theme für den Kurs
// "Geprüfter Berufsspezialist für Systemintegration und Vernetzung"
//
// Nutzung:
//   const { createDeck } = require("./lib/theme");
//   const deck = createDeck({ title: "...", subject: "..." });
//   deck.title({ eyebrow: "...", title: "...", subtitle: "...", note: "..." });
//   deck.content("Überschrift", "Eyebrow", (s, api) => { api.bullets(s, [...]); });
//   deck.save("dateiname.pptx");
//
// Die Foliennummern im Footer werden automatisch vergeben. Der Footer wird
// erst beim Speichern geschrieben, damit die Gesamtzahl stimmt.

const pptxgen = require("pptxgenjs");

// ---------------------------------------------------------------- Theme

const C = {
  bg: "FFFFFF",
  title: "0F172A", // slate-900
  body: "334155", // slate-700
  muted: "64748B", // slate-500
  faint: "94A3B8", // slate-400
  accent: "0E7490", // cyan-700
  accentDark: "155E75", // cyan-800
  accentSoft: "ECFEFF", // cyan-50
  border: "E2E8F0", // slate-200
  codeBg: "F8FAFC", // slate-50
  codeText: "0F172A",
  highlightBg: "F1F5F9", // slate-100
  good: "0F766E", // teal-700
  goodSoft: "F0FDFA", // teal-50
  warn: "B45309", // amber-700
  warnSoft: "FFFBEB", // amber-50
  bad: "B91C1C", // red-700
  badSoft: "FEF2F2", // red-50
};

const FONT_BODY = "Calibri";
const FONT_CODE = "Consolas";

const SLIDE_W = 10;
const SLIDE_H = 5.625;
const MARGIN_X = 0.5;
const TITLE_Y = 0.4;
const CONTENT_TOP = 1.55; // erste freie Zeile unter dem Titel
const CONTENT_BOTTOM = 4.95; // oberhalb der Footer-Linie

const T = {
  C,
  FONT_BODY,
  FONT_CODE,
  SLIDE_W,
  SLIDE_H,
  MARGIN_X,
  TITLE_Y,
  CONTENT_TOP,
  CONTENT_BOTTOM,
  CONTENT_W: SLIDE_W - 2 * MARGIN_X,
};

// ------------------------------------------------------------- Bausteine

function accentBar(pres, slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: 0.06,
    fill: { color: C.accent },
    line: { type: "none" },
  });
}

function footer(pres, slide, sectionLabel, number, total) {
  slide.addShape(pres.shapes.LINE, {
    x: MARGIN_X,
    y: SLIDE_H - 0.42,
    w: SLIDE_W - 2 * MARGIN_X,
    h: 0,
    line: { color: C.border, width: 0.75 },
  });
  if (sectionLabel) {
    slide.addText(sectionLabel, {
      x: MARGIN_X,
      y: SLIDE_H - 0.36,
      w: 6,
      h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 9,
      color: C.muted,
      align: "left",
      valign: "middle",
      margin: 0,
    });
  }
  slide.addText(`${number} / ${total}`, {
    x: SLIDE_W - MARGIN_X - 1.5,
    y: SLIDE_H - 0.36,
    w: 1.5,
    h: 0.3,
    fontFace: FONT_BODY,
    fontSize: 9,
    color: C.muted,
    align: "right",
    valign: "middle",
    margin: 0,
  });
}

function heading(slide, title, eyebrow) {
  if (eyebrow) {
    slide.addText(String(eyebrow).toUpperCase(), {
      x: MARGIN_X,
      y: TITLE_Y - 0.05,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 11,
      color: C.accent,
      bold: true,
      charSpacing: 4,
      margin: 0,
    });
  }
  slide.addText(title, {
    x: MARGIN_X,
    y: eyebrow ? TITLE_Y + 0.25 : TITLE_Y,
    w: SLIDE_W - 2 * MARGIN_X,
    h: 0.8,
    fontFace: FONT_BODY,
    fontSize: 30,
    color: C.title,
    bold: true,
    valign: "top",
    margin: 0,
  });
}

// ------------------------------------------------------------------- API
// Alle Helfer bekommen die Folie als erstes Argument.

function makeApi(pres) {
  const api = {
    T,
    C,

    /** Einleitungssatz direkt unter der Überschrift. */
    lead(slide, text, opts = {}) {
      slide.addText(text, {
        x: MARGIN_X,
        y: opts.y ?? 1.45,
        w: opts.w ?? SLIDE_W - 2 * MARGIN_X,
        h: opts.h ?? 0.45,
        fontFace: FONT_BODY,
        fontSize: opts.fontSize ?? 14,
        color: opts.color ?? C.muted,
        valign: "top",
        margin: 0,
      });
    },

    /** Aufzählung. items: string[] oder {text, bold}[] */
    bullets(slide, items, opts = {}) {
      const arr = items.map((it, i) => {
        const isObj = typeof it === "object" && it !== null;
        return {
          text: isObj ? it.text : it,
          options: {
            bullet: opts.numbered ? { type: "number" } : { code: "2022" },
            breakLine: i < items.length - 1,
            paraSpaceAfter: opts.spaceAfter ?? 8,
            bold: isObj ? !!it.bold : false,
            color: isObj && it.color ? it.color : undefined,
          },
        };
      });
      slide.addText(arr, {
        x: opts.x ?? MARGIN_X,
        y: opts.y ?? CONTENT_TOP + 0.25,
        w: opts.w ?? SLIDE_W - 2 * MARGIN_X,
        h: opts.h ?? 3.1,
        fontFace: FONT_BODY,
        fontSize: opts.fontSize ?? 16,
        color: opts.color ?? C.body,
        valign: "top",
        margin: 0,
        indentLevel: 0,
      });
    },

    /** Monospace-Block mit hellem Hintergrund. */
    code(slide, text, opts = {}) {
      const x = opts.x ?? MARGIN_X;
      const y = opts.y ?? CONTENT_TOP;
      const w = opts.w ?? SLIDE_W - 2 * MARGIN_X;
      const h = opts.h ?? 2.8;
      slide.addShape(pres.shapes.RECTANGLE, {
        x,
        y,
        w,
        h,
        fill: { color: opts.fill ?? C.codeBg },
        line: { color: C.border, width: 0.75 },
      });
      slide.addText(text, {
        x: x + 0.18,
        y: y + 0.12,
        w: w - 0.36,
        h: h - 0.24,
        fontFace: FONT_CODE,
        fontSize: opts.fontSize ?? 13,
        color: C.codeText,
        valign: "top",
        margin: 0,
        paraSpaceAfter: 0,
      });
    },

    /**
     * Karte mit optionalem Titel.
     * opts: x, y, w, h, title, tint ("accent"|"good"|"warn"|"bad"|"plain"),
     *       body (string oder string[]), fontSize
     */
    card(slide, opts = {}) {
      const tints = {
        accent: { fill: C.accentSoft, line: C.accent, title: C.accentDark },
        good: { fill: C.goodSoft, line: C.good, title: C.good },
        warn: { fill: C.warnSoft, line: C.warn, title: C.warn },
        bad: { fill: C.badSoft, line: C.bad, title: C.bad },
        plain: { fill: C.highlightBg, line: C.border, title: C.title },
      };
      const t = tints[opts.tint ?? "plain"] ?? tints.plain;
      const x = opts.x ?? MARGIN_X;
      const y = opts.y ?? CONTENT_TOP;
      const w = opts.w ?? SLIDE_W - 2 * MARGIN_X;
      const h = opts.h ?? 1.2;

      slide.addShape(pres.shapes.RECTANGLE, {
        x,
        y,
        w,
        h,
        fill: { color: t.fill },
        line: { color: t.line, width: opts.tint && opts.tint !== "plain" ? 1 : 0.75 },
      });
      let cursor = y + 0.14;
      if (opts.title) {
        const titleH = opts.titleH ?? 0.3;
        slide.addText(opts.title, {
          x: x + 0.18,
          y: cursor,
          w: w - 0.36,
          h: titleH,
          fontFace: FONT_BODY,
          fontSize: opts.titleSize ?? 14,
          color: t.title,
          bold: true,
          valign: "top",
          margin: 0,
        });
        cursor += titleH + 0.06;
      }
      if (opts.body) {
        const body = Array.isArray(opts.body)
          ? opts.body.map((b, i) => ({
              text: b,
              options: { breakLine: i < opts.body.length - 1, paraSpaceAfter: 5 },
            }))
          : opts.body;
        slide.addText(body, {
          x: x + 0.18,
          y: cursor,
          w: w - 0.36,
          h: y + h - cursor - 0.12,
          fontFace: FONT_BODY,
          fontSize: opts.fontSize ?? 12,
          color: C.body,
          valign: "top",
          margin: 0,
        });
      }
    },

    /**
     * Mehrere gleich breite Karten nebeneinander.
     * cards: [{title, body, tint}], opts: y, h, gap, fontSize
     */
    cardRow(slide, cards, opts = {}) {
      const y = opts.y ?? CONTENT_TOP;
      const h = opts.h ?? 2.6;
      const gap = opts.gap ?? 0.22;
      const total = SLIDE_W - 2 * MARGIN_X;
      const w = (total - gap * (cards.length - 1)) / cards.length;
      cards.forEach((c, i) => {
        api.card(slide, {
          ...c,
          x: MARGIN_X + i * (w + gap),
          y,
          w,
          h,
          fontSize: c.fontSize ?? opts.fontSize ?? 12,
          titleSize: c.titleSize ?? opts.titleSize ?? 14,
          titleH: c.titleH ?? opts.titleH ?? 0.3,
        });
      });
    },

    /**
     * Zeilenweise Tabelle ohne Rahmen – für Agenden und Zeitpläne.
     * rows: [[links, rechts], ...]
     */
    schedule(slide, rows, opts = {}) {
      const y = opts.y ?? CONTENT_TOP;
      const rowH = opts.rowH ?? 0.42;
      const labelW = opts.labelW ?? 1.55;
      rows.forEach((r, i) => {
        const ry = y + i * rowH;
        if (i % 2 === 0) {
          slide.addShape(pres.shapes.RECTANGLE, {
            x: MARGIN_X,
            y: ry,
            w: SLIDE_W - 2 * MARGIN_X,
            h: rowH,
            fill: { color: C.highlightBg },
            line: { type: "none" },
          });
        }
        slide.addText(r[0], {
          x: MARGIN_X + 0.15,
          y: ry,
          w: labelW,
          h: rowH,
          fontFace: FONT_BODY,
          fontSize: opts.fontSize ?? 13,
          color: C.accentDark,
          bold: true,
          valign: "middle",
          margin: 0,
        });
        slide.addText(r[1], {
          x: MARGIN_X + 0.15 + labelW,
          y: ry,
          w: SLIDE_W - 2 * MARGIN_X - labelW - 0.3,
          h: rowH,
          fontFace: FONT_BODY,
          fontSize: opts.fontSize ?? 13,
          color: C.body,
          valign: "middle",
          margin: 0,
        });
      });
    },

    /**
     * Waagerechter Zeitstrahl mit Stationen. stations: [{label, sub}]
     * Die Beschriftungen der äußeren Stationen werden nach innen gerückt,
     * damit sie nicht über den Folienrand hinausragen.
     */
    timeline(slide, stations, opts = {}) {
      const y = opts.y ?? 2.5;
      const boxW = opts.boxW ?? 1.5;
      // Der Strahl beginnt und endet so weit innen, dass die halbe
      // Beschriftungsbreite noch auf die Folie passt.
      const x0 = MARGIN_X + boxW / 2;
      const w = SLIDE_W - 2 * MARGIN_X - boxW;
      slide.addShape(pres.shapes.LINE, {
        x: x0,
        y,
        w,
        h: 0,
        line: { color: C.border, width: 2 },
      });
      const step = stations.length > 1 ? w / (stations.length - 1) : 0;
      stations.forEach((st, i) => {
        const cx = x0 + i * step;
        const isLast = i === stations.length - 1;
        slide.addShape(pres.shapes.OVAL, {
          x: cx - 0.075,
          y: y - 0.075,
          w: 0.15,
          h: 0.15,
          fill: { color: isLast ? C.bad : C.accent },
          line: { type: "none" },
        });
        slide.addText(st.label, {
          x: cx - boxW / 2,
          y: y - 0.62,
          w: boxW,
          h: 0.5,
          fontFace: FONT_BODY,
          fontSize: opts.fontSize ?? 12,
          color: isLast ? C.bad : C.title,
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
            h: 0.8,
            fontFace: FONT_BODY,
            fontSize: opts.subSize ?? 11,
            color: C.muted,
            align: "center",
            valign: "top",
            margin: 0,
          });
        }
      });
    },

    /** Große, zentrierte Aussage – für Merksätze und Übergänge. */
    statement(slide, text, opts = {}) {
      slide.addText(text, {
        x: MARGIN_X + 0.3,
        y: opts.y ?? 2.0,
        w: SLIDE_W - 2 * MARGIN_X - 0.6,
        h: opts.h ?? 1.4,
        fontFace: FONT_BODY,
        fontSize: opts.fontSize ?? 26,
        color: opts.color ?? C.accentDark,
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
    },

    /** Abschlusszeile am unteren Rand, z. B. eine Leitfrage. */
    kicker(slide, text, opts = {}) {
      slide.addText(text, {
        x: MARGIN_X,
        y: opts.y ?? 4.5,
        w: SLIDE_W - 2 * MARGIN_X,
        h: 0.45,
        fontFace: FONT_BODY,
        fontSize: opts.fontSize ?? 14,
        color: opts.color ?? C.accentDark,
        bold: true,
        italic: opts.italic ?? true,
        valign: "middle",
        margin: 0,
      });
    },

    /** Bild mit Rahmen; ohne Datei wird ein beschrifteter Platzhalter gesetzt. */
    photo(slide, opts = {}) {
      const x = opts.x ?? MARGIN_X;
      const y = opts.y ?? CONTENT_TOP;
      const w = opts.w ?? 2.6;
      const h = opts.h ?? 2.6;
      if (opts.path) {
        slide.addImage({ path: opts.path, x, y, w, h, sizing: { type: "cover", w, h } });
      } else {
        slide.addShape(pres.shapes.RECTANGLE, {
          x,
          y,
          w,
          h,
          fill: { color: C.highlightBg },
          line: { color: C.faint, width: 1, dashType: "dash" },
        });
        slide.addText(opts.placeholder ?? "Foto", {
          x,
          y,
          w,
          h,
          fontFace: FONT_BODY,
          fontSize: 12,
          color: C.faint,
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
  pres.company = meta.company ?? "Cloudhelden";
  pres.title = meta.title ?? "";
  pres.subject = meta.subject ?? "";

  const api = makeApi(pres);
  // Folien mit ihrem Sektionslabel merken, damit der Footer am Ende
  // die richtige Gesamtzahl bekommt.
  const numbered = [];
  let section = "";

  const deck = {
    pres,
    api,

    /** Setzt das Label, das ab jetzt links im Footer steht. */
    section(label) {
      section = label;
      return deck;
    },

    /** Titelfolie ohne Footer. */
    title({ eyebrow, title, subtitle, note }) {
      const s = pres.addSlide();
      s.background = { color: C.bg };
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0,
        y: 0,
        w: 0.35,
        h: SLIDE_H,
        fill: { color: C.accent },
        line: { type: "none" },
      });
      if (eyebrow) {
        s.addText(String(eyebrow).toUpperCase(), {
          x: 0.9,
          y: 1.5,
          w: 8.6,
          h: 0.4,
          fontFace: FONT_BODY,
          fontSize: 12,
          color: C.muted,
          bold: true,
          charSpacing: 4,
          margin: 0,
        });
      }
      s.addText(title, {
        x: 0.9,
        y: 1.95,
        w: 8.6,
        h: 1.15,
        fontFace: FONT_BODY,
        fontSize: 48,
        color: C.title,
        bold: true,
        valign: "top",
        margin: 0,
      });
      if (subtitle) {
        s.addText(subtitle, {
          x: 0.9,
          y: 3.15,
          w: 8.6,
          h: 0.9,
          fontFace: FONT_BODY,
          fontSize: 22,
          color: C.accentDark,
          valign: "top",
          margin: 0,
        });
      }
      if (note) {
        s.addText(note, {
          x: 0.9,
          y: 4.45,
          w: 8.6,
          h: 0.4,
          fontFace: FONT_BODY,
          fontSize: 13,
          color: C.muted,
          margin: 0,
        });
      }
      return s;
    },

    /** Abschnittstrenner – volle Akzentfläche, kein Footer. */
    divider(title, subtitle) {
      const s = pres.addSlide();
      s.background = { color: C.accentDark };
      s.addText(title, {
        x: MARGIN_X + 0.4,
        y: 2.15,
        w: SLIDE_W - 2 * MARGIN_X - 0.8,
        h: 0.9,
        fontFace: FONT_BODY,
        fontSize: 36,
        color: "FFFFFF",
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      if (subtitle) {
        s.addText(subtitle, {
          x: MARGIN_X + 0.4,
          y: 3.05,
          w: SLIDE_W - 2 * MARGIN_X - 0.8,
          h: 0.5,
          fontFace: FONT_BODY,
          fontSize: 16,
          color: "A5F3FC", // cyan-200
          align: "center",
          valign: "top",
          margin: 0,
        });
      }
      return s;
    },

    /**
     * Inhaltsfolie mit Akzentbalken, Überschrift und Footer.
     * build(slide, api) füllt den Inhalt.
     */
    content(title, eyebrow, build) {
      const s = pres.addSlide();
      s.background = { color: C.bg };
      accentBar(pres, s);
      heading(s, title, eyebrow);
      numbered.push({ slide: s, section });
      if (typeof build === "function") build(s, api);
      return s;
    },

    /** Leere Folie mit Footer, ohne Überschrift. */
    blank(build) {
      const s = pres.addSlide();
      s.background = { color: C.bg };
      accentBar(pres, s);
      numbered.push({ slide: s, section });
      if (typeof build === "function") build(s, api);
      return s;
    },

    async save(file) {
      const total = numbered.length;
      numbered.forEach((entry, i) => footer(pres, entry.slide, entry.section, i + 1, total));
      await pres.writeFile({ fileName: file });
      return { file, slides: pres.slides.length, numbered: total };
    },
  };

  return deck;
}

module.exports = { createDeck, T, C, FONT_BODY, FONT_CODE };
