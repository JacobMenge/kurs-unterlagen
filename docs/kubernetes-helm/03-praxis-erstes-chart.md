---
title: "Praxis: Dein erstes Chart"
description: "Angeleitete Übung: das fertige Chart der Demo-App lesen, es mit „helm lint“ prüfen, mit „helm template“ ohne Cluster rendern, mit „helm install“ als Release ausrollen, die Seite im Browser wiederfinden und zum Schluss einen Wert per „--set“ im laufenden Betrieb ändern – mit eigener Aufgabe und Lösung."
---

# Praxis – dein erstes Chart

<span class='badge badge-praxis'>Praxis – Pflicht</span> &nbsp; Jetzt wird aus dem Manifest-Stapel aus Teil 2 ein **Paket**. Du liest ein fertiges Chart, prüfst es, lässt dir zeigen, was Helm daraus macht, installierst es als **Release** – und drehst am Ende einen Wert im laufenden Betrieb, ohne eine einzige Manifest-Datei anzufassen.

Die App ist dieselbe wie immer: das schlanke nginx, das dir groß seine **Version**, darunter den **Standort** und den **Pod-Namen** anzeigt. Neu ist nicht die App, neu ist der Weg, auf dem sie in den Cluster kommt.

!!! info "Voraussetzung"
    Dein Cluster läuft (`kubectl get nodes` zeigt `Ready`) und die Projektdateien liegen lokal:

    ```bash
    git clone https://github.com/JacobMenge/kurs-unterlagen.git
    cd kurs-unterlagen/apps/kubernetes-helm
    ```

    Alle `helm`-Befehle dieser Seite gehen relativ von diesem Ordner aus (`./webserver`). Prüf kurz, ob Helm bereit ist:

    ```bash
    helm version
    ```

    ```text
    version.BuildInfo{Version:"v4.2.3", GitCommit:"43e8b7feece8beb0fcba47059ec9b522fd929a64", GitTreeState:"clean", GoVersion:"go1.26.5", KubeClientVersion:"v1.36"}
    ```

    Kennt dein Terminal den Befehl `helm` nicht, obwohl du ihn gerade installiert hast: **PowerShell schließen und neu öffnen**. Der Suchpfad ist erst in einer neuen Sitzung da – das laufende Fenster weiß von der Installation noch nichts.

    Falls dein Cluster gerade nicht läuft: [minikube starten](../kubernetes-praxis/03-installation.md).

!!! tip "Zeitrahmen"
    Rund **45 Minuten bis eine Stunde**: erst die angeleitete Übung, dann die Aufgabe zum Selbermachen. Halte am besten zwei Terminals bereit – eines bleibt später für den `port-forward`-Tunnel offen.

---

## Schritt für Schritt

### Schritt 1 – Das Chart-Gerüst ansehen

Das fertige Chart liegt schon im Repo. Du schreibst es nicht von null – du **liest** es erst und **änderst** es gleich selbst. Schau dir an, was im Ordner liegt:

```bash
ls
```

Der Ordner ist so aufgebaut:

```text
apps/kubernetes-helm/
  webserver/              <- das Chart: der Ordnername ist der Chart-Name
    Chart.yaml            <- der Steckbrief
    values.yaml           <- die Stellschrauben
    templates/            <- die Vorlagen, aus denen Manifeste werden
      configmap.yaml
      secret.yaml
      deployment.yaml
      service.yaml
      NOTES.txt           <- der Zettel, der nach dem Installieren erscheint
  values-dev.yaml         <- kommt erst bei Drei Umgebungen dran
  values-test.yaml
  values-prod.yaml
```

Nichts davon ist neu erfunden: In `templates/` liegen genau die vier Objektarten, die du in Teil 1 und Teil 2 von Hand geschrieben hast – Deployment, Service, ConfigMap, Secret. Sie haben nur Platzhalter bekommen.

??? tip "Optional: ein leeres Gerüst zum Vergleich erzeugen"
    Helm bringt einen Generator mit. Wenn du sehen willst, womit ein echtes Chart-Projekt startet:

    ```bash
    helm create demo
    ```

    Das legt einen Ordner `demo/` an – mit derselben Struktur wie unser `webserver/`, aber deutlich mehr Beiwerk: `_helpers.tpl`, Ingress, ServiceAccount, Autoscaling, in Helm 4 zusätzlich eine `httproute.yaml`. Für den Einstieg ist das zu viel Rauschen, deshalb ist unser Chart bewusst nackt. Sieh es dir an, vergleich es – und räum es danach wieder weg:

    ```bash
    rm -r demo
    ```

---

### Schritt 2 – Chart.yaml und values.yaml lesen

Öffne `webserver/Chart.yaml`. Das ist der **Steckbrief** des Pakets – wer bin ich, welche Version bin ich:

```yaml
apiVersion: v2
name: webserver
description: Die Demo-App der Aurora Station als Helm-Chart
type: application
version: 0.1.0
appVersion: "1"
```

Zwei Versionen, zwei Bedeutungen: `version` ist der Stand des **Pakets** (ändert sich, wenn du am Chart schraubst), `appVersion` der Stand der **Software** darin. Gleich kommt noch ein dritter Zähler dazu – die **Revision** des Releases. Drei verschiedene Dinge, die man leicht verwechselt.

Jetzt der interessante Teil. Öffne `webserver/values.yaml`:

```yaml
replicaCount: 2

image:
  repository: nginx
  tag: "1.27-alpine"

version: "1"                      # große Beschriftung -> "Version 1"
color: "#2563a8"                  # Hintergrundfarbe: Blau = Version 1
standort: "Rechenzentrum Nord"    # frei änderbarer Text auf der Seite

appToken: "s3hr-geheim-42"

service:
  type: ClusterIP
  port: 80
```

Erkennst du die drei Werte in der Mitte wieder? `version`, `color`, `standort` – **genau die** standen in Teil 2 noch als fester Text in deiner handgeschriebenen [ConfigMap](../kubernetes-aufbau/03-praxis-config-secrets.md). Damals musstest du die Datei öffnen und den Text ändern. Jetzt sind sie **Stellschrauben des Pakets**: Alles, was hier steht, kannst du beim Installieren überschreiben, ohne das Chart anzufassen.

!!! warning "Ein echtes Passwort gehört hier nicht hin"
    `appToken` steht in `values.yaml`, damit die Übung ohne Umwege läuft. Im echten Leben liegt diese Datei im Git-Repo – und damit läge das Passwort im Git-Repo. Merk dir die Stelle, wir kommen darauf zurück.

---

### Schritt 3 – Die ConfigMap als Vorlage

Öffne `webserver/templates/configmap.yaml`. Vergleich sie mit dem, was du in Teil 2 geschrieben hast.

**Vorher (Teil 2, von Hand):**

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

**Nachher (als Vorlage im Chart):**

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

Dasselbe Objekt, dieselben drei Schlüssel – nur stehen die Werte nicht mehr fest im Text. Drei Dinge passieren hier:

- `.Release.Name` ist der Name, den **du** beim Installieren vergibst. Aus `helm install station ./webserver` wird `station-config`.
- `.Values.version` holt den Wert aus `values.yaml` – oder das, was du beim Installieren stattdessen mitgibst.
- `| quote` setzt Anführungszeichen drumherum. Das ist keine Kosmetik: Eine ConfigMap nimmt nur **Text**. Ohne `quote` würde aus einer `1` eine **Zahl** – und die Installation bricht ab. Diese Falle sehen wir uns bei den [Stolpersteinen](09-stolpersteine.md) genauer an.

Wirf auch einen Blick in `templates/deployment.yaml` und `templates/service.yaml`. Es ist dasselbe Muster: bekanntes Manifest, Platzhalter an den Stellen, die sich ändern dürfen. Eine Zeile im Deployment ist neu und wichtig:

```yaml
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
```

Was die tut, siehst du in Schritt 9 – und zwar von selbst.

---

### Schritt 4 – Prüfen, bevor irgendetwas passiert

Bisher hat der Cluster von alldem nichts mitbekommen. Lass Helm das Chart erst einmal auf offensichtliche Fehler abklopfen:

```bash
helm lint ./webserver
```

```text
==> Linting ./webserver
[INFO] Chart.yaml: icon is recommended

1 chart(s) linted, 0 chart(s) failed
```

Wichtig ist die letzte Zeile: **0 chart(s) failed**. Der `[INFO]`-Hinweis ist kein Fehler – Helm merkt nur an, dass ein Chart üblicherweise ein Icon mitbringt (für Chart-Kataloge). Für uns egal. Lies solche Ausgaben immer von unten nach oben: erst `failed`, dann die Details.

---

### Schritt 5 – Trocken rendern: was würde Helm schicken?

Jetzt der Befehl, der dich vor den meisten schlechten Abenden bewahrt. `helm template` rendert die Vorlagen zu fertigen Manifesten und schreibt sie ins Terminal – **ohne** den Cluster überhaupt anzufassen:

```bash
helm template station ./webserver
```

Du bekommst alle vier Objekte am Stück. Der Teil für die ConfigMap sieht so aus (gekürzt – die Kommentarzeilen aus der Vorlage stehen auch mit drin):

```text
# Source: webserver/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: station-config
data:
  VERSION: "1"
  COLOR: "#2563a8"
  STANDORT: "Rechenzentrum Nord"
```

Da ist sie wieder – die ConfigMap aus Teil 2, Zeile für Zeile. `station-config`, weil du das Release `station` genannt hast. Die drei Werte kommen aus `values.yaml`. Und `| quote` hat aus `1` sauber `"1"` gemacht.

!!! tip "Merksatz"
    **Fehler findet man links, nicht im Cluster.** `helm template` kostet dich zwei Sekunden und zeigt dir exakt das YAML, das gleich abgeschickt wird. Gewöhn dir an, vor jedem `install` und jedem `upgrade` einmal drüberzuschauen – besonders, wenn du Werte überschreibst.

---

### Schritt 6 – Installieren

Jetzt darf der Cluster ran. Der Befehl liest sich wie ein Satz: installiere **als Release `station`** das Chart, das **hier** liegt.

```bash
helm install station ./webserver
```

```text
NAME: station
LAST DEPLOYED: Thu Jul 16 15:00:33 2026
NAMESPACE: default
STATUS: deployed
REVISION: 1
DESCRIPTION: Install complete
TEST SUITE: None
NOTES:
Das Release station ist installiert (Revision 1).

Anzeigen im Browser:

  kubectl port-forward svc/station 8080:80

Dann http://localhost:8080 oeffnen. Erwartet: Version 1,
Standort "Rechenzentrum Nord", 2 Pods im Wechsel.

Was ist installiert?

  helm list
  helm status station
```

Vier Objekte in einem Befehl – kein `apply` pro Datei, keine Reihenfolge zum Merken. Oben der Steckbrief: Name `station`, Namespace `default`, Status `deployed`, **REVISION 1**. Das ist der dritte Zähler von vorhin: Revision 1 heißt „erster Stand dieses Releases".

Und dann der Teil, der leicht übersehen wird: **NOTES**. Das ist `templates/NOTES.txt`, gerendert mit deinen Werten. Das Paket **erklärt sich selbst** – es sagt dir den passenden `port-forward`-Befehl mit deinem Release-Namen, was du erwarten sollst und wie du nachschaust. Genau so fühlen sich fremde Charts an, wenn sie gut gemacht sind: Du installierst etwas Unbekanntes und bekommst die nächsten Schritte gleich mitgeliefert.

---

### Schritt 7 – Was ist da eigentlich entstanden?

Frag zuerst Helm, was es von sich weiß:

```bash
helm list
```

Du bekommst eine Zeile: Release `station` im Namespace `default`, `REVISION 1`, Status `deployed`, Chart `webserver-0.1.0`, App-Version `1`. Das ist Helms Sicht – die Paketsicht.

Jetzt die Cluster-Sicht. Frag wie immer `kubectl`:

```bash
kubectl get pods -l app=station
```

```text
NAME                       READY   STATUS    RESTARTS   AGE
station-697cc5d946-t8qr6   1/1     Running   0          30s
station-697cc5d946-zbbmj   1/1     Running   0          30s
```

Zwei Pods, `Running`, benannt nach dem Release. Die anderen Objekte tragen ebenfalls den Release-Namen – hol sie dir einzeln:

```bash
kubectl get deployment station
kubectl get svc station
kubectl get configmap station-config
kubectl get secret station-secret
```

Vier ganz gewöhnliche Kubernetes-Objekte. Dieselben Arten, dieselben Felder, dieselben Befehle wie in Teil 1 und Teil 2. Der Beweis liegt in der ConfigMap:

```bash
kubectl get configmap station-config -o jsonpath='{.data}'
```

```text
{"COLOR":"#2563a8","STANDORT":"Rechenzentrum Nord","VERSION":"1"}
```

Drei Schlüssel, Text, genau wie handgeschrieben. Der Cluster weiß gar nicht, dass Helm im Spiel war.

!!! note "Merksatz: Helm ersetzt `kubectl` nicht"
    Helm ist der **Paketierer**, nicht der Ersatz. Es rendert Manifeste und schickt sie an dieselbe Kubernetes-API, an die auch `kubectl apply` geht. Danach ist alles wie immer: `kubectl get`, `describe`, `logs`, `exec` – dein ganzes Werkzeug aus Teil 1 und Teil 2 funktioniert unverändert weiter. Wenn ein Pod nicht startet, debuggst du den **Pod**, nicht Helm.

!!! tip "Warum `-l app=station` nicht alles findet"
    Der Filter `-l app=station` sucht nach einem **Label**. In unserem Chart tragen es das Deployment, seine Pods und der Service – **ConfigMap und Secret nicht**. Helm vergibt Labels nämlich **nicht** von allein: Was gelabelt wird, entscheidet die Vorlage. Deshalb holst du diese beiden über ihren Namen statt über den Filter.

---

### Schritt 8 – Die Seite im Browser

Mach das Release erreichbar – über den Service, den das Chart mitgebracht hat. **Dieses Terminal bleibt offen**, solange der Tunnel steht:

```bash
kubectl port-forward svc/station 8080:80
```

Öffne <http://localhost:8080>:

```text
+-------------------------------------------+
|                                           |
|                 Version 1                 |   (blauer Hintergrund)
|       Standort: Rechenzentrum Nord        |
|                                           |
|   Server name: station-697cc5d946-t8qr6   |
|                                           |
+-------------------------------------------+
```

Blau, Version 1, Standort „Rechenzentrum Nord". Exakt die Werte, die in `values.yaml` stehen – über die ConfigMap in den Container gewandert und dort auf die Seite geschrieben.

!!! note "Kurz erklärt: warum der `Server name` sich nicht ändert"
    Zwei Pods laufen, aber die Seite zeigt immer denselben Namen – auch wenn sie sich alle zwei Sekunden neu lädt. Das ist richtig so: **`kubectl port-forward` tunnelt zu genau einem Pod** und bleibt dabei. Es ist ein Debug-Werkzeug, kein Lastverteiler. Die Verteilung macht der Service erst, wenn der Verkehr wirklich über ihn läuft – so wie du es in [Teil 1](../kubernetes-praxis/08-praxis-service.md) aus einem Test-Pod heraus gesehen hast.

---

### Schritt 9 – Der erste eigene Dreh

Jetzt der Moment, für den das ganze Chart gebaut ist. Der Standort soll sich ändern. Kein Editor, keine Datei, kein `kubectl apply` – nur ein Regler am Paket. Nimm dafür dein **zweites** Terminal, der Tunnel bleibt offen:

```bash
helm upgrade station ./webserver --set standort="Halle 4"
```

```text
Release "station" has been upgraded. Happy Helming!
```

Darunter wiederholt Helm den Steckbrief des Releases. Achte auf die Zeile `REVISION` – sie steht jetzt auf **2**. Dasselbe Chart, ein anderer Wert, ein neuer Stand.

Der `port-forward` aus Schritt 8 hing an einem alten Pod und **reißt beim Austausch ab** – genau wie in Teil 2. Beende ihn in Terminal 1 mit **Ctrl+C** und starte ihn neu:

```bash
kubectl port-forward svc/station 8080:80
```

Lade <http://localhost:8080> neu: **Standort: Halle 4**. Gleiches Image, gleiche App, neuer Wert.

Und jetzt schau genau hin, was du **nicht** gemacht hast: kein `kubectl rollout restart`. In Teil 2 war das noch Pflicht – die ConfigMap war `configured`, das Deployment `unchanged`, die Pods behielten ihre alten Variablen. Hier rollt Kubernetes von selbst neu aus.

!!! note "Kurz erklärt: die checksum-Annotation"
    Schuld ist die Zeile aus Schritt 3. Die Annotation `checksum/config` enthält eine **Prüfsumme der gerenderten ConfigMap**. Ändert sich ein Wert darin, ändert sich die Prüfsumme – und damit sieht die **Pod-Vorlage** anders aus. Für Kubernetes ist das eine echte Änderung am Deployment, also rollt es neu aus. Der Trick verpackt „Konfiguration geändert" in „Deployment geändert". Ausführlich steht das auf [Templating & Releases](04-templating-und-releases.md).

Wenn du sehen willst, wie der Austausch abläuft:

```bash
kubectl rollout status deployment/station
```

```text
Waiting for deployment "station" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "station" rollout to finish: 1 old replicas are pending termination...
deployment "station" successfully rolled out
```

Das Rolling Update aus Teil 1 – unverändert, nur diesmal von Helm angestoßen.

---

## Übungsaufgabe – selbst am Regler drehen

Jetzt du. Versuch es erst **ohne** zu spicken – die Lösung ist darunter.

#### Aufgabe

1. Setz per `--set` die Farbe auf **Grün** (`#2e9e5b`) und die `version` auf `2`. Was passiert mit der Seite?
2. Zieh die Zahl der Pods auf **vier** hoch – ebenfalls per `--set` – und weise mit `kubectl get pods` nach, dass wirklich vier laufen.
3. **Kür:** Finde heraus, welche Werte für das Release `station` gerade gelten, **ohne** in `values.yaml` zu schauen.

??? tip "Schritt für Schritt (Lösung)"
    **Aufgabe 1 – Farbe und Version.** Zwei Regler, zwei `--set`:

    ```bash
    helm upgrade station ./webserver --set color="#2e9e5b" --set version=2
    ```

    Tunnel in Terminal 1 neu starten (`Ctrl+C`, dann `kubectl port-forward svc/station 8080:80`) und <http://localhost:8080> neu laden: Die Seite ist **grün** und zeigt **Version 2**. Wieder ohne neues Image, ohne `rollout restart`.

    Und der Standort? Der steht wieder auf **Rechenzentrum Nord**, obwohl du gerade eben „Halle 4" gesetzt hast.

    !!! warning "Wichtig: jedes `upgrade` fängt wieder bei `values.yaml` an"
        Helm merkt sich deine `--set`-Werte **nicht** von einem Upgrade zum nächsten. Jeder Aufruf rendert das Chart frisch: `values.yaml` als Grundlage, darüber genau die Werte, die du **in diesem Aufruf** mitgibst. Alles andere fällt auf den Standard zurück. Willst du „Halle 4" behalten, musst du es wieder mitgeben:

        ```bash
        helm upgrade station ./webserver --set color="#2e9e5b" --set version=2 --set standort="Halle 4"
        ```

        Das ist kein Bug, sondern der Kern der Sache: Ein Release ist immer das **vollständige** Ergebnis eines Rendervorgangs, kein Stapel von Änderungen. Genau deshalb funktioniert später auch der Rollback so sauber.

    **Aufgabe 2 – vier Pods.** Der Regler heißt `replicaCount` (siehe `values.yaml`). Nimm die anderen Werte gleich mit, sonst springt die Seite wieder auf Blau:

    ```bash
    helm upgrade station ./webserver --set color="#2e9e5b" --set version=2 --set replicaCount=4
    kubectl get pods -l app=station
    ```

    Du siehst vier Zeilen, alle `1/1` und `Running`. Prüfen kannst du es auch am Deployment:

    ```bash
    kubectl get deployment station
    ```

    In der Spalte `READY` steht `4/4`.

    **Aufgabe 3 (Kür) – welche Werte gelten gerade?** Helm speichert den Zustand des Releases im Cluster, also kannst du ihn dort erfragen:

    ```bash
    helm get values station
    ```

    Das zeigt dir **nur die überschriebenen** Werte – also die, die du zuletzt per `--set` mitgegeben hast. Kurz und übersichtlich, aber es beantwortet nicht die Frage „und der Rest?". Dafür:

    ```bash
    helm get values station --all
    ```

    Das zeigt die **komplette** Werte-Liste, mit der das Release gerendert wurde: die Standardwerte aus `values.yaml` **plus** deine Änderungen, zusammengeführt zu einem Bild. Genau das, was das Chart beim letzten Upgrade tatsächlich gesehen hat.

    Vergleich die beiden Ausgaben in Ruhe – der Unterschied ist die ganze Idee: unten der Standard des Pakets, oben deine Abweichung.

??? success "Erwartung"
    Du hast ein Chart **gelesen**, mit `helm lint` **geprüft**, mit `helm template` **trocken gerendert**, mit `helm install` als Release **ausgerollt** und danach im laufenden Betrieb **umkonfiguriert** – Farbe, Version, Standort, Anzahl der Pods. Dabei hast du **keine einzige Manifest-Datei angefasst**. Genau das ist der Unterschied zwischen „Manifeste pflegen" und „ein Paket bedienen": Du drehst an vorgesehenen Reglern, statt YAML zu editieren. Und wenn dich jemand fragt, was gerade läuft, sagt es dir `helm get values station --all` in einem Befehl.

---

## Aufräumen oder weiterlaufen lassen

Am einfachsten: **lass das Release laufen**. Auf der nächsten Praxisseite arbeitest du mit genau diesem `station` weiter – sie setzt es im ersten Schritt mit zwei Befehlen auf den Ausgangsstand zurück, damit die Revisionen wieder bei 1 anfangen.

Wenn du trotzdem aufräumen willst:

```bash
helm uninstall station
```

Ein Befehl – und alle vier Objekte sind weg: Deployment, Service, ConfigMap, Secret. Kein Vergessen, kein „welche Dateien waren das nochmal?". Prüf es nach mit `helm list` (leer) und `kubectl get pods` (keine `station`-Pods mehr). Installieren kannst du es jederzeit neu, der Befehl ist derselbe wie in Schritt 6.

!!! tip "Forwarding beenden, Cluster behalten"
    Das `port-forward`-Terminal kannst du mit **Ctrl+C** schließen – das beendet nur den Tunnel, nicht die Pods.

---

## Wenn etwas hakt

`helm` wird nicht gefunden? Die Installation bricht mit einer Meldung über `expected string` ab? Die Seite zeigt den alten Wert? Der Release-Name ist schon vergeben? Die abgestuften Hinweise stehen in den [Stolpersteinen](09-stolpersteine.md).

---

## Weiter

- [Templating & Releases](04-templating-und-releases.md) – wie die Platzhalter wirklich funktionieren, was ein Release im Cluster ist und wo Helm sich das alles merkt
