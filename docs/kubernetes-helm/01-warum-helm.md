---
title: "Warum Helm?"
description: "Dieselbe App soll in Dev, Test und Prod laufen – der naive Weg ist, das Manifest dreimal zu kopieren und genau daran geht er kaputt. Helm ist der Paketmanager für Kubernetes: ein Chart als Vorlage, beliebig viele Releases daraus. Was Helm ist, was es ausdrücklich nicht ist – Helm ersetzt „kubectl“ nicht – und die vier Begriffe, die du dafür brauchst."
---

# Warum Helm?

Am Ende von Teil 2 hattest du eine Datei, mit der alles stimmte: `webserver-config.yaml`. Drei Objekte darin – ConfigMap, Secret, Deployment –, sauber getrennt, jede Einstellung außerhalb des Images. Farbe ändern? Ein Wert in der ConfigMap, `apply`, `rollout restart`, fertig. Genau so soll es aussehen.

Dann fällt der Satz, der in jedem Betrieb irgendwann fällt: **„Das brauchen wir auch auf Test. Und auf Produktion."**

Und plötzlich ist die schöne Datei ein Problem.

---

## Der Schmerz: dreimal dieselbe Datei

Dieselbe App, drei Umgebungen – aber eben nicht **ganz** dieselbe. Auf Entwicklung reicht ein Pod, auf Produktion sollen es drei sein. Der Standort ist ein anderer, die Version ist eine andere, die Farbe auch. Alles Übrige ist identisch.

Der naive Weg liegt nahe, weil er sofort funktioniert: Datei kopieren, ein paar Werte anpassen, dreimal `apply`.

```text
manifests/
  webserver-dev.yaml    ->  replicas: 1   VERSION "1-dev"    STANDORT "Entwicklung"
  webserver-test.yaml   ->  replicas: 2   VERSION "1-test"   STANDORT "Testsystem"
  webserver-prod.yaml   ->  replicas: 3   VERSION "1"        STANDORT "Rechenzentrum Nord"
```

Sieht harmlos aus. Was der Ausschnitt verschweigt: Über diesen paar unterschiedlichen Werten stehen in jeder der drei Dateien **rund 60 Zeilen, die vollkommen gleich sind**. Und drei Kopien von etwas Gleichem sind keine drei Dateien – es sind drei Versprechen, die du ab jetzt synchron halten musst.

Das kippt an drei Stellen:

**1. Jede Änderung musst du dreimal nachziehen.** Du baust eine readiness-Probe ein – die aus Teil 2. Ein Handgriff, sechs Zeilen. Aber du machst ihn dreimal. Beim vierten Dienst und der zwölften Datei vergisst du eine. Und zwar nicht die von Dev, sondern die von Prod – denn genau die fasst man am seltensten an.

**2. Copy-Paste-Fehler sind unsichtbar.** Du kopierst `webserver-prod.yaml` nach `webserver-test.yaml` und änderst brav Standort, Version und Farbe. Was du übersiehst: den Namen. Jetzt zeigt dein Test-Deployment auf die Prod-ConfigMap. Das Fiese daran ist nicht der Fehler – das Fiese ist, dass nichts kaputtgeht. Kein Fehler beim `apply`, kein roter Pod. Die Seite sieht nur „irgendwie falsch" aus. Solche Fehler findet man abends um sieben.

**3. Es gibt kein „zurück".** `kubectl apply` kennt kein Rückgängig. Der neue Stand ist einfach da. Willst du zurück, musst du wissen, **was vorher drinstand** – die alte Datei rekonstruieren – aus dem Gedächtnis oder aus Git – und sie erneut anwenden. Das ist im Ernstfall genau der Moment, in dem niemand Zeit hat, in der Historie zu graben.

!!! warning "Und das ist erst der kleine Fall"
    Drei Umgebungen mal eine App – das sind drei Dateien. Damit kommt man durch. Aber ein echtes Team betreibt nicht eine App, sondern ein Dutzend. Drei Umgebungen mal zwölf Dienste sind **36 Dateien**, von denen jede zu 90 Prozent aus derselben Handarbeit besteht. Ab da ist Kopieren keine Abkürzung mehr, sondern eine Fehlerquelle mit Vollzeitstelle.

    Und diese zwölf Dienste stehen nicht nebeneinander, sie hängen aneinander: Der eine ruft den anderen, der dritte liest aus derselben Datenbank. Wenn du sie in Test und Produktion nicht **gleich** ausrollen kannst, testest du am Ende ein System, das es so nur bei dir gibt.

---

## Erst schätzen, dann nachsehen

!!! abstract "Schätzfrage an den Kurs"
    Ein vollständiger Monitoring-Stack für Kubernetes – **Prometheus** zum Sammeln, **Grafana** fürs Dashboard, **Alertmanager** für die Alarme, dazu die fertigen Alarmregeln und die passenden Rechte im Cluster.

    **Wie viele Zeilen YAML sind das?**

    Nenn eine Zahl, bevor du weiterliest. Schreib sie auf. Raten gilt – es geht nicht um Genauigkeit, sondern um die Größenordnung.

Die Auflösung: **rund 6.800 Zeilen YAML. 122 Objekte.** Aus **einem** Befehl.

Gemessen mit dem Chart `kube-prometheus-stack` in der Version 87.16.1. Die Zeilenzahl ändert sich mit jeder Chart-Version – die Größenordnung nicht. Ein paar der 122 Objekte kennst du längst (ConfigMap, Service, Deployment), die anderen sind Kubernetes-Objekte für Rechte und Messwerte. Die musst du heute nicht können – schau nur auf die Menge:

```text
  35 x PrometheusRule        11 x Service               5 x ClusterRole
  32 x ConfigMap              7 x ServiceAccount         3 x Deployment
  13 x ServiceMonitor         5 x ClusterRoleBinding     ... und einige mehr
```

Wenn deine Schätzung deutlich darunter lag, ist das kein Versagen – das ist der Punkt der Übung. Halt die Zahl mal gegen etwas, das du kennst: Die Datei `webserver-config.yaml` aus Teil 2 – ConfigMap, Secret und Deployment zusammen – hat rund **60 Zeilen**. An der hast du eine ganze Übung lang gesessen. Der Monitoring-Stack ist also ungefähr das **Hundertfache** davon. So ein Gefühl hat niemand, der so etwas nie selbst schreiben musste. Genau deshalb steht diese Frage hier.

!!! info "Du kennst genau diesen Stack"
    Prometheus, Grafana, Alertmanager – das ist **exakt** der Stack aus dem [Monitoring-Block](../monitoring-praxis/index.md). Dort hast du ihn **von Hand** in einer Compose-Datei verdrahtet: Dienste, Ports, Konfigurationsdateien, Datenquellen. Du weißt also aus eigener Erfahrung, wie lange das dauert – und damals war nicht einmal ein Cluster darunter, in dem Rechte, Service-Discovery und Alarmregeln dazukommen.

    Denselben Stack in einem Befehl in einen Cluster zu heben, siehst du auf [Fertige Charts nutzen](06-fertige-charts-nutzen.md). Da läuft er dann wirklich.

Ob du sechs Zeilen dreimal kopierst oder 6.800 Zeilen einmal von Hand schreibst – es ist derselbe Schmerz, nur in zwei Größen. Beide Male fehlt dasselbe Werkzeug.

---

## Was Helm ist

**Helm ist ein Paketmanager für Kubernetes.**

Den Begriff kennst du schon, du hast ihn nur bisher auf deinem eigenen Rechner benutzt. Wenn du unter Windows `winget install` tippst, unter Ubuntu `apt install` oder auf dem Mac `brew install`, dann passiert immer dasselbe: Jemand hat die ganze Arbeit – Dateien, Abhängigkeiten, Standardeinstellungen – einmal ordentlich in ein **Paket** gesteckt und du holst es dir mit einem Befehl. Du liest keine Installationsanleitung. Du tippst einen Namen.

Helm macht das für **Anwendungen im Cluster**. Statt einzelner Programme auf einem Laptop installiert es Deployments, Services, ConfigMaps und Secrets – gebündelt, mit Standardwerten, mit einem Befehl.

| Was du willst | Auf deinem Laptop (winget) | Im Cluster (Helm) |
|---|---|---|
| installieren | `winget install Helm.Helm` | `helm install station ./webserver` |
| aktualisieren | `winget upgrade Helm.Helm` | `helm upgrade station ./webserver` |
| nachsehen, was da ist | `winget list` | `helm list` |
| entfernen | `winget uninstall Helm.Helm` | `helm uninstall station` |

Die rechte Spalte ist keine Analogie, die irgendwann hinkt. Das sind die echten Befehle dieses Blocks – du wirst sie alle vier heute tippen.

---

## Was Helm nicht ist

Das hier ist die wichtigste Abgrenzung der ganzen Seite und sie räumt die häufigste Fehlvorstellung ab:

!!! warning "Helm ersetzt `kubectl` nicht"
    Helm ist **kein zweiter Cluster** und **keine neue Welt neben Kubernetes**. Helm nimmt deine Vorlagen, setzt die Werte ein und schickt **fertige Manifeste an dieselbe Kubernetes-API**, an die `kubectl apply` sie geschickt hat.

    Was danach im Cluster liegt, ist **exakt dasselbe** wie vorher: Deployments, Services, ConfigMaps, Secrets. Kein Helm-Objekt, kein Sonderformat. Ein `kubectl get pods` sieht dieselben Pods wie immer.

Das heißt konkret: Alles aus Teil 1 und Teil 2 bleibt gültig. `kubectl get`, `kubectl describe`, `kubectl logs`, `port-forward`, Probes, Limits – nichts davon lernst du neu, nichts davon wirfst du weg. Du hörst nur auf, das YAML selbst zu tippen.

> **Helm ist die Schreibmaschine, nicht ein neuer Cluster.**

Merk dir den Satz. Er beantwortet später die Hälfte aller Fragen, die beim Debuggen aufkommen – zum Beispiel die, warum du einen kaputten Pod aus einem Helm-Release ganz normal mit `kubectl describe pod` untersuchst.

---

## Die vier Begriffe

Vier Wörter brauchst du, um über Helm zu reden. Drei davon kennst du aus der winget-Welt schon, ohne sie je so genannt zu haben.

| Begriff | Was es ist | Bei winget | Bei uns heute |
|---|---|---|---|
| **Chart** | das **Paket**: die Vorlagen plus die Standardwerte | das Installationspaket im Katalog | der Ordner `webserver/` |
| **Release** | eine **Installation** davon – mit einem **Namen**, den du vergibst | die installierte Software auf deinem Rechner | `helm install station ./webserver` erzeugt das Release `station` |
| **Revision** | ein **Stand** dieser Installation, fortlaufend nummeriert | – (winget kennt so etwas nicht) | Revision 1 ist blau, Revision 2 ist grün, zurück auf 1 geht per Befehl |
| **Repository** | die **Bezugsquelle**, aus der Charts kommen | die winget-Quelle | `prometheus-community` für den Monitoring-Stack |

Ein Chart ist eine **Vorlage**, kein fertiges Ding – so wie ein Kuchenrezept kein Kuchen ist. Und daraus folgt der Punkt, an dem die winget-Analogie aufhört und Helm besser wird:

!!! tip "Ein Chart, viele Releases"
    Firefox kannst du auf deinem Laptop genau **einmal** installieren. Ein zweites Firefox daneben, mit anderen Einstellungen? Geht nicht.

    Bei Helm schon. Dasselbe Chart installierst du **beliebig oft** im selben Cluster – unter verschiedenen Namen, mit verschiedenen Werten. Jede Installation ist ein eigenes **Release**, das sein eigenes Leben führt: eigene Pods, eigene ConfigMap, eigene Revisionen, eigenes Rollback.

    **Genau daraus werden deine drei Umgebungen.** Nicht drei kopierte Dateien, sondern ein Chart, dreimal installiert: einmal als Dev, einmal als Test, einmal als Prod. Die drei Dateien von oben schrumpfen zu drei kurzen Werte-Listen mit je vier Zeilen. Das baust du in der [Praxis: Drei Umgebungen](07-lab-drei-umgebungen.md) selbst.

Ein Hinweis, der später Verwirrung erspart: **Revision ist nicht die Version des Charts.** Und die Version des Charts ist nicht die Version deiner App. Das sind drei verschiedene Zähler, die unabhängig voneinander laufen. Warum das so sein muss, siehst du auf der [nächsten Seite](02-chart-anatomie.md).

---

## Wie Helm arbeitet

<figure>
<svg viewBox="0 0 680 280" width="100%" height="280" role="img" aria-label="Chart mit Vorlagen und values.yaml mit den Werten gehen in helm hinein, helm erzeugt daraus fertige Manifeste wie Deployment, Service, ConfigMap und Secret, die an die Kubernetes-API geschickt werden">
  <text x="340" y="30" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="13">Von der Vorlage zum Objekt im Cluster</text>

  <!-- Chart -->
  <rect x="16" y="54" width="150" height="72" rx="8" fill="rgba(122,162,255,0.12)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="91" y="82" text-anchor="middle" fill="#7aa2ff" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold">Chart</text>
  <text x="91" y="105" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="12">die Vorlagen</text>

  <!-- values.yaml -->
  <rect x="16" y="140" width="150" height="72" rx="8" fill="rgba(122,162,255,0.12)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="91" y="168" text-anchor="middle" fill="#7aa2ff" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold">values.yaml</text>
  <text x="91" y="191" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="12">die Werte</text>

  <path d="M166 90 L206 120" fill="none" stroke="#8fa498" stroke-width="2" marker-end="url(#hwarr)"/>
  <path d="M166 176 L206 148" fill="none" stroke="#8fa498" stroke-width="2" marker-end="url(#hwarr)"/>

  <!-- helm -->
  <rect x="214" y="96" width="104" height="76" rx="8" fill="rgba(125,255,154,0.08)" stroke="#7dff9a" stroke-width="2"/>
  <text x="266" y="132" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="16" font-weight="bold">helm</text>
  <text x="266" y="154" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">setzt ein</text>

  <path d="M318 134 L368 134" fill="none" stroke="#8fa498" stroke-width="2" marker-end="url(#hwarr)"/>
  <text x="345" y="124" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="10">erzeugt</text>

  <!-- fertige Manifeste -->
  <rect x="376" y="72" width="148" height="120" rx="8" fill="rgba(143,164,152,0.12)" stroke="#8fa498" stroke-width="2"/>
  <text x="450" y="96" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">fertige Manifeste</text>
  <text x="450" y="122" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="11">Deployment</text>
  <text x="450" y="140" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="11">Service</text>
  <text x="450" y="158" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="11">ConfigMap</text>
  <text x="450" y="176" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="11">Secret</text>

  <path d="M524 134 L574 134" fill="none" stroke="#8fa498" stroke-width="2" marker-end="url(#hwarr)"/>
  <text x="551" y="124" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="10">schickt</text>

  <!-- Kubernetes-API -->
  <rect x="582" y="96" width="90" height="76" rx="8" fill="rgba(46,158,91,0.12)" stroke="#2e9e5b" stroke-width="2"/>
  <text x="627" y="130" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold">Kubernetes</text>
  <text x="627" y="150" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold">-API</text>

  <text x="340" y="234" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">dieselbe API, an die auch „kubectl apply“ seine Manifeste schickt</text>
  <text x="340" y="262" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="12">Helm schreibt das YAML, das du bisher von Hand geschrieben hast.</text>

  <defs>
    <marker id="hwarr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#8fa498"/></marker>
  </defs>
</svg>
<figcaption>Links die Vorlage plus die Werte, rechts das Ergebnis: ganz normale Kubernetes-Objekte. Helm steht in der Mitte und tippt – mehr nicht.</figcaption>
</figure>

Lies das Bild von links nach rechts, dann hast du den ganzen Block: Die **Vorlagen** haben Lücken. Die **Werte** füllen sie. **Helm** setzt beides zusammen und schickt das Ergebnis an den Cluster. Und weil die Werte austauschbar sind, wird aus **einer** Vorlage mit **drei** Werte-Listen genau das, wofür du vorhin drei Dateien kopiert hättest.

---

!!! quote "Mitnehmen"
    1. **Helm ist der Paketmanager für Kubernetes.** Ein Chart ist die Vorlage, ein Release eine benannte Installation daraus – und dasselbe Chart kannst du beliebig oft installieren, jedes Mal mit anderen Werten. Genau das ersetzt die kopierten Dateien.
    2. **Helm ersetzt `kubectl` nicht, es tippt für dich.** Am Ende liegen im Cluster dieselben Deployments, Services und ConfigMaps wie vorher. Helm ist die Schreibmaschine, nicht ein neuer Cluster.
    3. **Der Gewinn wächst mit der Größe.** Eine ConfigMap schreibt man von Hand. Drei Kopien hält man noch synchron. Rund 6.800 Zeilen nicht mehr – und genau da fängt der Alltag an.

---

## Weiter

- [Ein Chart von innen](02-chart-anatomie.md) – welche Dateien ein Chart ausmachen und wo die Lücken in den Vorlagen sitzen
