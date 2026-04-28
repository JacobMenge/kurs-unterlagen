// Macht alle <abbr>-Elemente klickbar und verlinkt sie zum Glossar.
//
// Funktioniert mit Material for MkDocs und dessen "navigation.instant"-
// Feature (SPA-artiges Nachladen von Seiten). Nutzt dafür das offizielle
// document$-Observable, das bei jedem (auch AJAX-)Page-Load feuert.
//
// Warum das nicht trivial ist:
//
//   1. Bei navigation.instant ersetzt Material den Body, aber das
//      <script id="__config">-Element im Head (mit cfg.base) wird NICHT
//      aktualisiert. Liest man cfg.base bei jedem subscribe-Aufruf, hat man
//      deshalb auf nachfolgenden Seiten einen veralteten relativen Pfad
//      und landet bei Klicks im 404.
//   2. Lösung: Den absoluten Site-Root EINMAL beim allerersten Page-Load
//      bestimmen (cfg.base + canonical.href) und in einer Modul-Variable
//      festhalten. Danach reicht der absolute Pfad – egal, von welcher
//      Seite aus geklickt wird.

(function () {
  "use strict";

  // Slugify – muss zur Anker-Konvention der glossar.md passen.
  // Whitespace, Slash, Punkt und Underscore werden zu '-'.
  // Beispiele:
  //   "CI/CD"                    -> "ci-cd"
  //   "compose.yaml"             -> "compose-yaml"
  //   "depends_on"               -> "depends-on"
  //   "x86_64"                   -> "x86-64"
  //   "Virtualization.framework" -> "virtualization-framework"
  function slugify(term) {
    return term
      .trim()
      .toLowerCase()
      .replace(/[\s\/._]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Wird einmalig beim ersten Lauf gesetzt und bleibt für die gesamte
  // Session stabil. Kein Wiederlesen aus dem DOM nach Navigation.
  var siteGlossarPath = null;

  // Bestimmt den absoluten URL-Pfad der Glossar-Seite.
  // Bevorzugt cfg.base (von Material in <script id="__config"> exponiert)
  // und kombiniert ihn mit der canonical-URL der aktuellen Seite, um den
  // Site-Root absolut zu bestimmen. Fällt zurück auf simple Pfad-Heuristik.
  function determineGlossarPath(doc) {
    // Variante A – am verlässlichsten: __config.base relativ zur aktuellen
    // canonical-URL auflösen.
    try {
      var configEl = doc.getElementById("__config");
      var canonical = doc.querySelector('link[rel="canonical"]');
      if (configEl && canonical && canonical.href) {
        var cfg = JSON.parse(configEl.textContent);
        if (cfg && typeof cfg.base === "string") {
          // cfg.base ist z.B. "../.." oder "."
          var rootUrl = new URL(cfg.base + "/", canonical.href);
          // siteRootPath kommt z.B. als "/kurs-unterlagen/" raus
          var rootPath = rootUrl.pathname.replace(/\/+$/, "");
          return (rootPath || "") + "/glossar/";
        }
      }
    } catch (e) {
      // Stillschweigend zum Fallback gehen.
    }

    // Variante B – Pfad aus location ableiten. Funktioniert, wenn die Site
    // unter einem Subpath wie "/kurs-unterlagen/" läuft und dieser Subpath
    // sich aus dem ersten Pfad-Segment ableiten lässt. Wir suchen das
    // Segment, das auch in der Sitemap vorkommt.
    var loc = (doc.defaultView || window).location;
    var parts = loc.pathname.split("/").filter(Boolean);
    // Einfacher Fallback: nimm das erste Segment als Subpath an
    // (für GitHub-Pages-Setups wie /kurs-unterlagen/...).
    if (parts.length >= 1) {
      return "/" + parts[0] + "/glossar/";
    }
    return "/glossar/";
  }

  function processAbbrs(doc) {
    doc = doc || document;

    // Auf der Glossar-Seite selbst keine zusätzlichen Links erzeugen.
    var loc = (doc.defaultView || window).location;
    if (/\/glossar\/?$/.test(loc.pathname)) {
      return;
    }

    // Site-Root einmalig festnageln – siehe Doku oben, warum.
    if (siteGlossarPath === null) {
      siteGlossarPath = determineGlossarPath(doc);
    }

    var abbrs = doc.querySelectorAll("abbr");
    for (var i = 0; i < abbrs.length; i++) {
      var abbr = abbrs[i];

      // Schon innerhalb eines Links → nichts tun (Material setzt z.B. in
      // ToCs Anchor-Links, die ihre eigenen <abbr>-Inhalte tragen können).
      if (abbr.closest("a")) continue;

      // Schon von uns verarbeitet – nochmal-Wickeln verhindern.
      if (abbr.parentNode &&
          abbr.parentNode.classList &&
          abbr.parentNode.classList.contains("glossar-link")) {
        continue;
      }

      var anchor = slugify(abbr.textContent);
      if (!anchor) continue;

      var link = doc.createElement("a");
      link.href = siteGlossarPath + "#" + anchor;
      link.title =
        (abbr.title || abbr.textContent) + " – Im Glossar nachschlagen";
      link.className = "glossar-link";

      abbr.parentNode.insertBefore(link, abbr);
      link.appendChild(abbr);
    }
  }

  // Aufhängen: bei navigation.instant über document$, sonst klassisch.
  function bind() {
    if (typeof window !== "undefined" &&
        window.document$ &&
        typeof window.document$.subscribe === "function") {
      window.document$.subscribe(function (doc) {
        processAbbrs(doc || document);
      });
      return;
    }
    if (typeof document$ !== "undefined" &&
        typeof document$.subscribe === "function") {
      document$.subscribe(function (doc) {
        processAbbrs(doc || document);
      });
      return;
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        processAbbrs(document);
      });
    } else {
      processAbbrs(document);
    }
  }

  bind();
})();
