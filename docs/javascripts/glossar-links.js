// Macht alle <abbr>-Elemente klickbar und verlinkt sie zum Glossar.
// Quelle: adaptiert aus dem frueheren kurs-25-06-Projekt.
document.addEventListener("DOMContentLoaded", function () {
  // Auf der Glossar-Seite selbst keine zusaetzlichen Links erzeugen
  if (window.location.pathname.indexOf("glossar") !== -1) return;

  // 1) Versuche, die Basis-URL aus dem <link rel="canonical">-Element zu lesen
  //    Material setzt das automatisch, wenn site_url in mkdocs.yml gesetzt ist.
  var canonical = document.querySelector('link[rel="canonical"]');

  // 2) Fallback: bestimme das Site-Root relativ zur aktuellen Seite.
  //    Wir bauen damit einen Pfad, der sowohl lokal (mkdocs serve)
  //    als auch unter GitHub Pages Subpaths funktioniert.
  function buildGlossarBase() {
    if (canonical && canonical.href) {
      // canonical.href ist die vollstaendige URL der aktuellen Seite.
      // Wir schneiden den aktuellen Seitenpfad ab und ersetzen ihn
      // durch den Pfad zum Glossar. Dazu brauchen wir das Site-Root
      // aus dem Meta-Tag `base` oder einer MkDocs-internen Variable.
      // Einfachste zuverlaessige Methode: relativer Pfad ueber MkDocs'
      // base_url (wird von Material als <base>-Tag gesetzt, wenn vorhanden).
      var base = document.querySelector("base");
      if (base && base.href) {
        return base.href.replace(/\/+$/, "") + "/glossar/#";
      }
    }
    // Letzter Fallback: absoluter Pfad vom Site-Root, funktioniert auf
    // GitHub Pages mit Repo-Subpath nur bedingt – deshalb ist der
    // canonical-Weg oben bevorzugt.
    return "/glossar/#";
  }

  var glossarBase = buildGlossarBase();

  // Robuste Slugify-Funktion, die zur Konvention der Glossar-Anker passt.
  // Regeln:
  //   - Begriff in Kleinbuchstaben
  //   - Whitespace, Slash, Punkt und Underscore werden zu '-'
  //   - Mehrfach-Bindestriche zusammengefasst
  //   - Bindestriche an Anfang/Ende getrimmt
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

  document.querySelectorAll("abbr").forEach(function (abbr) {
    // Wenn die Abkuerzung schon innerhalb eines Links liegt, nichts tun
    if (abbr.closest("a")) return;

    var anchor = slugify(abbr.textContent);

    var link = document.createElement("a");
    link.href = glossarBase + anchor;
    link.title = (abbr.title || abbr.textContent) + " – Im Glossar nachschlagen";
    link.className = "glossar-link";

    abbr.parentNode.insertBefore(link, abbr);
    link.appendChild(abbr);
  });
});
