---
title: "Ein Chart von innen"
description: "Ein Chart ist nichts weiter als ein Ordner mit fester Struktur: Chart.yaml als Steckbrief, values.yaml als Stellschrauben, templates/ als Manifeste mit Platzhaltern. Wir gehen jede Datei einzeln durch, halten „version“ und „appVersion“ sauber auseinander und stellen die handgeschriebene ConfigMap aus Teil 2 direkt ihrer Template-Fassung gegenüber."
---

# Ein Chart von innen

„Chart" klingt nach einem Format, das man erst lernen muss. Ist es nicht. Ein **Chart ist ein Ordner** mit ein paar Dateien an festgelegten Plätzen. Mehr steckt nicht dahinter. Wenn du die Struktur einmal gesehen hast, kannst du jedes fremde Chart im Netz öffnen und dich sofort zurechtfinden – denn alle sehen gleich aus.

Genau das ist der Trick: Helm schreibt dir nicht vor, **was** in deinen Manifesten steht. Helm schreibt nur vor, **wo** die Dateien liegen. Den Rest kennst du schon aus Teil 1 und Teil 2.

---

## Der Ordner

Ein leeres Beispiel-Chart legt dir Helm selbst an:

```bash
helm create demo
```

Danach steht ein Ordner `demo/` da, fertig gefüllt mit einem lauffähigen Beispiel. Für den Kurs ist dieses Beispiel allerdings ziemlich überladen – wir haben es auf das Wesentliche abgespeckt. So sieht **unser** Chart aus:

```text
webserver/
+-- Chart.yaml            <- der Steckbrief: Name, Version, appVersion
+-- values.yaml           <- die Stellschrauben: alle Standardwerte
+-- .helmignore           <- was beim Paketieren draussen bleibt
+-- templates/            <- die Manifeste, jetzt mit Platzhaltern
    +-- deployment.yaml
    +-- service.yaml
    +-- configmap.yaml
    +-- secret.yaml
    +-- NOTES.txt         <- wird nach "helm install" ausgegeben
```

Vier Bestandteile, die du auseinanderhalten musst: **Chart.yaml**, **values.yaml**, **templates/** und **.helmignore**. Gehen wir sie einzeln durch.

---

## Chart.yaml – der Steckbrief

Diese Datei beschreibt das Paket selbst: Wie heißt es, was ist es, welchen Stand hat es? Sie ist kurz und du fasst sie selten an.

```yaml
apiVersion: v2
name: webserver
description: Die Demo-App der Aurora Station als Helm-Chart
type: application
version: 0.1.0        # Stand des PAKETS
appVersion: "1"       # Stand der SOFTWARE darin
```

- **`apiVersion: v2`** – die Chart-Generation. Alles Aktuelle ist `v2`, das setzt du einmal und vergisst es.
- **`name`** – der Name des Charts. Achtung: Das ist **nicht** der Name deiner späteren Installation. Den vergibst du erst beim Installieren.
- **`description`** – ein Satz für Menschen.
- **`type: application`** – es ist eine App (die Alternative `library` ist für Bausteine ohne eigene Manifeste; brauchst du hier nicht).
- **`version`** und **`appVersion`** – und genau hier wird es interessant.

### version und appVersion – die häufigste Verwirrung

Zwei Zeilen, beide heißen irgendwie „Version" und beide zählen etwas völlig Verschiedenes. Das sorgt zuverlässig für Stirnrunzeln, also machen wir es einmal sauber:

| | `version` | `appVersion` |
|---|---|---|
| **Zählt den Stand von** | dem **Paket** – also dem Chart selbst | der **Software**, die darin verpackt ist |
| **Hochzählen, wenn** | du am Chart schraubst: Template geändert, neuer Wert in `values.yaml`, Tippfehler korrigiert | die App eine neue Fassung hat: neue nginx-Version, neuer Stand deines Programms |
| **Bei uns** | `0.1.0` | `"1"` – der Stand unserer Demo-App |
| **Format** | muss `major.minor.patch` sein, Helm besteht darauf | frei – irgendein Text, deshalb in Anführungszeichen |

Ein Beispiel, das den Unterschied festnagelt: Du korrigierst einen Tippfehler in `templates/service.yaml`. Die App darin hat sich **kein Stück** verändert. Also zählst du `version` hoch (`0.1.0` -> `0.1.1`) und lässt `appVersion` in Ruhe. Umgekehrt: Du hebst die App von Version 1 auf 2, ohne ein Template anzufassen – dann wandert `appVersion` weiter.

!!! tip "Merksatz"
    **`version` beschreibt die Schachtel, `appVersion` den Inhalt.** Du kannst die Schachtel neu bekleben, ohne den Inhalt zu tauschen – und du kannst den Inhalt tauschen, ohne die Schachtel zu ändern.

!!! warning "Aufgepasst: die Zahl auf unserer Seite ist keine von beiden"
    Unsere Demo-Seite zeigt groß „Version 1" an – das sieht nach `appVersion` aus, ist es aber **nicht**. Die Zahl auf der Seite kommt aus `values.yaml` (dem Wert `version`, klein geschrieben) und wandert über die ConfigMap als Umgebungsvariable in den Container. `appVersion` steht im `Chart.yaml` und erreicht die Seite **nie**.

    Dass beide zufällig auf `1` stehen, macht es nicht leichter. Merk dir: Was du im Browser siehst, steuerst du mit `--set version=…`. Am `appVersion` ändert das nichts.

Und weil aller guten Dinge drei sind: Es gibt später noch einen **dritten** Zähler, die **Revision**. Die zählt, wie oft du **installiert oder aktualisiert** hast. Sie steht nirgends im Chart, sondern führt Helm im Cluster mit. Dazu mehr in [Templating & Releases](04-templating-und-releases.md).

---

## values.yaml – die Stellschrauben

Hier stehen alle Werte, an denen jemand drehen können soll. Das ist die Datei, die du beim Anpassen eines Charts als erstes öffnest – und oft die einzige.

```yaml
replicaCount: 2

image:
  repository: nginx
  tag: "1.27-alpine"

# Was die Seite anzeigt
version: "1"                      # große Beschriftung -> "Version 1"
color: "#2563a8"                  # Hintergrundfarbe: Blau = Version 1
standort: "Rechenzentrum Nord"    # frei änderbarer Text auf der Seite

# Das Geheimnis
appToken: "s3hr-geheim-42"

service:
  type: ClusterIP
  port: 80
```

Erkennst du die Werte wieder? `VERSION`, `COLOR`, `STANDORT`, das Token – die lagen in [Teil 2](../kubernetes-aufbau/03-praxis-config-secrets.md) noch fest in einer handgeschriebenen ConfigMap. Jetzt sind sie **Stellschrauben des Pakets**.

Der wichtigste Satz zu dieser Datei:

> **Alles in `values.yaml` ist ein Vorschlag.** Kein Wert ist in Stein gemeißelt. Jeder einzelne kann beim Installieren überschrieben werden – mit `--set` auf der Kommandozeile oder mit einer eigenen Werte-Datei per `-f`.

Deshalb gehören hier **sinnvolle Standardwerte** hinein, mit denen das Chart auf Anhieb läuft. Wer andere braucht, bringt sie beim Installieren mit. Genau das machst du in [Praxis: Upgrade & Rollback](05-praxis-upgrade-rollback.md) und in der [Praxis: Drei Umgebungen](07-lab-drei-umgebungen.md).

!!! warning "In values.yaml gehört kein echtes Passwort"
    Die `values.yaml` liegt **im Git-Repository**. Sie wird geklont, geforkt, in Pull Requests gelesen und liegt auf jedem Laptop im Team. Was hier steht, ist damit öffentlich – jedenfalls für jeden, der das Repo sehen darf. Ein echtes Passwort, ein API-Schlüssel oder ein Zertifikat haben hier **nichts** verloren.

    In unserem Übungs-Chart steht `appToken` trotzdem drin. Das ist eine bewusste Abkürzung, damit die Übung ohne Umwege läuft und du dich auf Helm konzentrieren kannst statt auf Geheimnis-Verwaltung. Im echten Betrieb würdest du das Token beim Installieren von außen hineinreichen oder ein Werkzeug dafür nutzen. Warum das mehr als Erbsenzählerei ist und welche Wege es gibt, steht in den [Stolpersteinen](09-stolpersteine.md).

---

## templates/ – die Manifeste mit Platzhaltern

Und hier kommt der Aha-Moment. In `templates/` liegen ganz normale Kubernetes-Manifeste. Dieselben, die du in Teil 1 und Teil 2 von Hand geschrieben hast. Deployment, Service, ConfigMap, Secret – alte Bekannte. Neu ist **eine einzige Sache**: An den Stellen, wo vorher ein fester Wert stand, steht jetzt ein **Platzhalter** in doppelten geschweiften Klammern.

Sieh dir das an unserer `templates/configmap.yaml` an. Das ist die **ganze** Datei – acht Zeilen YAML, im Chart stehen nur noch ein paar erklärende Kommentare darüber:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-config
data:
  VERSION: {{ .Values.version | quote }}
  COLOR: {{ .Values.color | quote }}
  STANDORT: {{ .Values.standort | quote }}
```

### Vorher und nachher

Jetzt daneben die handgeschriebene ConfigMap aus Teil 2 – die, die du selbst angelegt hast:

=== "Vorher (Teil 2, von Hand)"
    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: webserver-config
    data:
      VERSION: "1"
      COLOR: "#2563a8"
      STANDORT: "Rechenzentrum Nord"
    ```

=== "Nachher (als Template)"
    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: {{ .Release.Name }}-config
    data:
      VERSION: {{ .Values.version | quote }}
      COLOR: {{ .Values.color | quote }}
      STANDORT: {{ .Values.standort | quote }}
    ```

Schau genau hin: `apiVersion`, `kind`, `metadata`, `data` – **identisch**. Die Struktur ist Zeile für Zeile dieselbe. Es ist **dasselbe YAML**. Nur da, wo vorher `"Rechenzentrum Nord"` stand, steht jetzt ein Platzhalter, der sich den Wert aus `values.yaml` holt.

Das ist der ganze Zauber. Ein Template ist kein neues Format, das du lernen musst – es ist dein Manifest, bei dem die interessanten Stellen ausgeschnitten und durch Platzhalter ersetzt wurden.

Drei Dinge tauchen in dem Ausschnitt auf, die du dir merken kannst (ausführlich kommen sie in [Templating & Releases](04-templating-und-releases.md)):

- **`.Values.standort`** – hol den Wert `standort` aus `values.yaml`. Alles unter `.Values.` kommt von dort.
- **`.Release.Name`** – der Name, den **du** beim Installieren vergibst. Aus `helm install station ./webserver` wird hier `station-config`. Deshalb kann dasselbe Chart mehrfach im selben Cluster liegen, ohne dass sich die Objekte in die Quere kommen.
- **`| quote`** – setzt Anführungszeichen um den Wert. Sieht nach Kosmetik aus, ist aber keine: Eine ConfigMap nimmt ausschließlich **Text**. Ohne `quote` wird aus einer `1` eine **Zahl** – und die Installation bricht ab. Dieser Stolperstein ist so gemein, dass er eine eigene Ecke bekommen hat: [Stolpersteine](09-stolpersteine.md).

Die anderen Dateien in `templates/` folgen genau demselben Muster: `deployment.yaml` ist das Deployment aus Teil 2, `service.yaml` der Service aus Teil 1, `secret.yaml` das Secret mit seinem `stringData`. Überall dasselbe Bild – bekanntes Manifest, ein paar Platzhalter.

---

## NOTES.txt – die Bedienungsanleitung

Ein Sonderling im `templates/`-Ordner: `NOTES.txt` wird **kein** Kubernetes-Objekt. Helm rendert die Datei wie jedes andere Template, aber statt sie ins Cluster zu schicken, **druckt** Helm sie dir nach `helm install` in die Konsole.

Das ist der Zettel, der dem Paket beiliegt: Was hast du gerade installiert und wie kommst du dran? Unsere sieht so aus:

```text
Das Release {{ .Release.Name }} ist installiert (Revision {{ .Release.Revision }}).

Anzeigen im Browser:

  kubectl port-forward svc/{{ .Release.Name }} 8080:{{ .Values.service.port }}

Dann http://localhost:8080 öffnen. Erwartet: Version {{ .Values.version }},
Standort "{{ .Values.standort }}", {{ .Values.replicaCount }} Pods im Wechsel.

Was ist installiert?

  helm list
  helm status {{ .Release.Name }}
```

Weil auch hier Platzhalter stehen, ist die Anleitung **auf deine Installation zugeschnitten**. Installierst du das Release unter dem Namen `station`, steht im ausgedruckten Text der fertige Befehl `kubectl port-forward svc/station 8080:80` – abtippen oder kopieren, fertig. Kein Nachdenken, kein Nachschlagen.

!!! tip "Warum das mehr ist als Deko"
    Bei fremden Charts aus dem Netz ist `NOTES.txt` oft die **wichtigste** Ausgabe des ganzen Installationsvorgangs: Dort steht, wie du an das Anfangspasswort kommst, unter welcher Adresse der Dienst hört, was du als nächstes tun musst. Wenn die Ausgabe nach `helm install` durchrauscht, hol sie dir jederzeit mit `helm status <release>` zurück.

---

## .helmignore – was draußen bleibt

Die kürzeste Erklärung auf dieser Seite. Wenn du dein Chart zu einer Archivdatei schnürst (`helm package`), wandert normalerweise **alles** aus dem Ordner mit hinein. Nicht alles soll das:

```text
.DS_Store
.git/
.gitignore
*.swp
*.tmp
*.orig
```

Das Prinzip kennst du von `.gitignore` und `.dockerignore` – dieselbe Idee, andere Datei. Editor-Reste, der `.git`-Ordner, Betriebssystem-Krempel: raus aus dem Paket. Du fasst diese Datei praktisch nie an.

---

## Das Bild dahinter

<figure>
<svg viewBox="0 0 640 290" width="100%" height="290" role="img" aria-label="Der Chart-Ordner webserver mit Chart.yaml, values.yaml, templates und helmignore, daneben ein Pfeil helm template zum fertigen Manifest">
  <!-- Chart-Ordner -->
  <text x="150" y="45" text-anchor="middle" fill="#7dff9a" font-family="system-ui, sans-serif" font-size="13" font-weight="700">webserver/ – der Chart-Ordner</text>
  <rect x="25" y="55" width="250" height="190" rx="8" fill="none" stroke="#7dff9a" stroke-width="2"/>

  <rect x="45" y="70" width="210" height="34" rx="8" fill="rgba(122,162,255,0.12)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="57" y="92" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="12">Chart.yaml</text>
  <text x="243" y="92" text-anchor="end" fill="#8fa498" font-family="system-ui, sans-serif" font-size="10">Steckbrief</text>

  <rect x="45" y="112" width="210" height="34" rx="8" fill="rgba(255,196,120,0.10)" stroke="#e0b35c" stroke-width="2"/>
  <text x="57" y="134" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="12">values.yaml</text>
  <text x="243" y="134" text-anchor="end" fill="#8fa498" font-family="system-ui, sans-serif" font-size="10">Stellschrauben</text>

  <rect x="45" y="154" width="210" height="34" rx="8" fill="rgba(46,158,91,0.12)" stroke="#2e9e5b" stroke-width="2"/>
  <text x="57" y="176" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="12">templates/</text>
  <text x="243" y="176" text-anchor="end" fill="#8fa498" font-family="system-ui, sans-serif" font-size="10">YAML mit Platzhaltern</text>

  <rect x="45" y="196" width="210" height="34" rx="8" fill="rgba(143,164,152,0.12)" stroke="#8fa498" stroke-width="2"/>
  <text x="57" y="218" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="12">.helmignore</text>
  <text x="243" y="218" text-anchor="end" fill="#8fa498" font-family="system-ui, sans-serif" font-size="10">bleibt draußen</text>

  <!-- Pfeil -->
  <text x="330" y="138" text-anchor="middle" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="12">helm template</text>
  <text x="330" y="172" text-anchor="middle" fill="#7dff9a" font-size="26">→</text>
  <text x="330" y="196" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="10">Werte eingesetzt</text>

  <!-- Ergebnis -->
  <text x="500" y="45" text-anchor="middle" fill="#2e9e5b" font-family="system-ui, sans-serif" font-size="13" font-weight="700">fertiges Manifest</text>
  <rect x="385" y="55" width="230" height="190" rx="8" fill="rgba(46,158,91,0.12)" stroke="#2e9e5b" stroke-width="2"/>
  <text x="402" y="90" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="11">kind: ConfigMap</text>
  <text x="402" y="112" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="11">metadata:</text>
  <text x="402" y="134" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="11">  name: station-config</text>
  <text x="402" y="156" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="11">data:</text>
  <text x="402" y="178" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="11">  VERSION: "1"</text>
  <text x="402" y="200" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="11">  COLOR: "#2563a8"</text>
  <text x="402" y="222" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="11">  ...</text>

  <text x="320" y="275" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="12">Ein Ordner mit fester Struktur. Helm setzt die Werte in die Platzhalter – heraus kommt ganz normales Kubernetes-YAML.</text>
</svg>
<figcaption>Der Chart-Ordner ist die Vorlage, values.yaml liefert die Werte. Was am Ende ins Cluster geht, ist dasselbe YAML, das du in Teil 1 und Teil 2 von Hand geschrieben hast.</figcaption>
</figure>

---

## Noch ein Wort zu „helm create"

!!! note "Was `helm create` alles anlegt"
    Wenn du `helm create demo` ausprobierst, findest du in `templates/` deutlich mehr als bei uns: neben Deployment und Service auch `ingress.yaml`, `hpa.yaml` (automatische Skalierung), `serviceaccount.yaml`, einen `tests/`-Ordner, `_helpers.tpl` – und in Helm 4 zusätzlich `httproute.yaml` für die Gateway API.

    Das ist gut gemeint und für ein echtes Projekt oft der richtige Startpunkt. Zum **Lernen** ist es Ballast: Du suchst die drei Zeilen, auf die es ankommt, zwischen Hunderten, die du noch nicht brauchst. Deshalb ist unser Chart im Kursordner bewusst nackt – genau die Dateien, die oben im Ordnerbaum stehen, mehr nicht. Ein Chart darf so klein sein, wie du willst. In der [Praxis](03-praxis-erstes-chart.md) kannst du dir das volle Gerüst mit `helm create` zum Vergleich danebenlegen.

---

!!! quote "Mitnehmen"
    - Ein **Chart ist ein Ordner** mit fester Struktur. Kein neues Format, nur feste Plätze für Dateien.
    - **`Chart.yaml`** ist der Steckbrief. `version` beschreibt die **Schachtel**, `appVersion` den **Inhalt** – zwei Zähler, die nichts miteinander zu tun haben.
    - **`values.yaml`** hält die Stellschrauben. Alles darin ist ein **Vorschlag**, der beim Installieren überschrieben werden kann – und ein echtes Passwort gehört nicht hinein.
    - **`templates/`** enthält deine gewohnten Manifeste. Identisches YAML, nur die interessanten Werte sind **Platzhalter** geworden.
    - **`NOTES.txt`** ist die Bedienungsanleitung des Pakets und wird nach `helm install` ausgedruckt. **`.helmignore`** hält Müll aus dem Paket.

---

## Weiter

- [Praxis: Dein erstes Chart](03-praxis-erstes-chart.md) – Schluss mit Anschauen: Jetzt öffnest du genau diesen Ordner, prüfst ihn, installierst ihn und drehst am ersten Wert.
