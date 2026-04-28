// Macht alle <abbr>-Elemente klickbar und verlinkt sie zum Glossar.
//
// Funktioniert mit Material for MkDocs und dessen "navigation.instant"-Feature
// (SPA-artiges Nachladen von Seiten). Nutzt dafür das offizielle document$-
// Observable, das bei jedem (auch AJAX-)Page-Load feuert.
//
// Site-Root: aus <script id="__config">{"base": "../.."}</script>, das
// Material in jedem gerenderten HTML setzt. Damit funktionieren Glossar-
// Links sowohl lokal (mkdocs serve, mit/ohne Subpath) als auch auf
// GitHub Pages mit Repository-Subpath.

(function () {
  "use strict";

  // Slugify-Funktion, die zur Konvention der Glossar-Anker passt.
  // Regeln:
  //   - Begriff in Kleinbuchstaben
  //   - Whitespace, Slash, Punkt und Underscore werden zu '-'
  //   - Mehrfach-Bindestriche zusammengefasst, Anfang/Ende getrimmt
  // Beispiele:
  //   "CI/CD"                   -> "ci-cd"
  //   "compose.yaml"            -> "compose-yaml"
  //   "depends_on"              -> "depends-on"
  //   "x86_64"                  -> "x86-64"
  //   "Virtualization.framework"-> "virtualization-framework"
  function slugify(term) {
    return term
      .trim()
      .toLowerCase()
      .replace(/[\s\/._]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Liefert den Pfad zur Glossar-Seite, robust für alle Hosting-Varianten.
  function buildGlossarUrl() {
    // 1) Bevorzugt: Material exponiert den Site-Root als relativen Pfad
    //    in einem <script id="__config">{"base":"../.."}-Block.
    var configEl = document.getElementById("__config");
    if (configEl) {
      try {
        var cfg = JSON.parse(configEl.textContent);
        if (cfg && typeof cfg.base === "string") {
          var base = cfg.base.replace(/\/+$/, "");
          return (base ? base + "/" : "") + "glossar/";
        }
      } catch (e) {
        // JSON-Parse fehlgeschlagen — fallback unten.
      }
    }

    // 2) Fallback: aus <link rel="canonical"> ableiten. Hier raten wir,
    //    wo die Glossar-Seite liegt, indem wir relativ zur aktuellen
    //    Seite navigieren.
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.href) {
      try {
        // canonical.href = http://host/site-root/aktueller/pfad/
        // new URL("../glossar/", canonical.href) wäre falsch, weil wir
        // die Tiefe nicht kennen. Wir nutzen stattdessen den Pfad und
        // suchen nach einem stabilen Anker. Pragmatisch: vom Pfad
        // alle Segmente nach einem bekannten Pfad abschneiden.
        var url = new URL(canonical.href);
        // Last resort: gehe ein Verzeichnis hoch von der aktuellen Seite,
        // dann eines wieder rein nach 'glossar/'.
        return new URL("../glossar/", url).href;
      } catch (e) {
        // ignorieren
      }
    }

    // 3) Letzter Fallback (funktioniert nur auf root-deployten Sites).
    return "/glossar/";
  }

  // Hauptlogik: alle <abbr>-Elemente in klickbare Glossar-Links wickeln.
  function processAbbrs() {
    // Auf der Glossar-Seite selbst keine zusätzlichen Links erzeugen.
    if (/\/glossar\/?($|[?#])/.test(window.location.pathname + window.location.search + window.location.hash)) {
      return;
    }

    var glossarUrl = buildGlossarUrl();

    var abbrs = document.querySelectorAll("abbr");
    for (var i = 0; i < abbrs.length; i++) {
      var abbr = abbrs[i];

      // Wenn die Abkürzung schon innerhalb eines Links liegt, nichts tun.
      if (abbr.closest("a")) continue;

      // Mehrfach-Verarbeitung verhindern (falls processAbbrs zweimal läuft
      // ohne dass das DOM komplett ersetzt wurde).
      if (abbr.parentNode &&
          abbr.parentNode.classList &&
          abbr.parentNode.classList.contains("glossar-link")) {
        continue;
      }

      var anchor = slugify(abbr.textContent);
      if (!anchor) continue;

      var link = document.createElement("a");
      link.href = glossarUrl + "#" + anchor;
      link.title = (abbr.title || abbr.textContent) + " – Im Glossar nachschlagen";
      link.className = "glossar-link";

      abbr.parentNode.insertBefore(link, abbr);
      link.appendChild(abbr);
    }
  }

  // SPA-fähiges Aufhängen:
  //  - Mit navigation.instant: document$ feuert bei jedem Seitenwechsel.
  //  - Ohne navigation.instant: einmal beim DOMContentLoaded.
  if (typeof window !== "undefined" &&
      typeof window.document$ !== "undefined" &&
      typeof window.document$.subscribe === "function") {
    window.document$.subscribe(processAbbrs);
  } else if (typeof document$ !== "undefined" &&
             typeof document$.subscribe === "function") {
    document$.subscribe(processAbbrs);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", processAbbrs);
  } else {
    processAbbrs();
  }
})();
