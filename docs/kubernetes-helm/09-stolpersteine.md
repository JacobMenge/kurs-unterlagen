---
title: "Stolpersteine"
description: "Die Fallen dieses Blocks zum Nachschlagen – von „helm wird nicht als Name eines Cmdlet erkannt“ direkt nach der Installation über den lautlos ersetzten Kommentar und das fehlende „| quote“ bis zum vergessenen Namespace. Jeder Eintrag mit Symptom, Ursache und Lösung."
---

# Stolpersteine

Diese Seite ist zum Nachschlagen da: Du hängst fest, du suchst dein **Symptom** in einer Überschrift, du liest **Ursache** und **Lösung**. Die Fehlermeldungen hier sind echt – jede einzelne ist beim Bauen dieses Blocks tatsächlich aufgetreten, keine ist nachgestellt.

!!! tip "Wenn du zwischen zwei Kandidaten schwankst"
    Drei Befehle sagen dir fast immer, in welchem Zustand dein Release wirklich ist: `helm list -A` (was gibt es?), `helm status station` (wie steht es?) und `helm history station` (was ist passiert?). Frag zuerst Helm, dann rate.

---

## Beim Einrichten

### „Die Benennung `helm` wurde nicht als Name eines Cmdlet … erkannt"

Du hast Helm gerade installiert:

```powershell
winget install --id Helm.Helm --exact
```

winget meldet Erfolg. Du tippst `helm version` in dasselbe Fenster – und PowerShell behauptet, es kenne kein `helm`:

```text
Die Benennung "helm" wurde nicht als Name eines Cmdlet, einer Funktion, einer
Skriptdatei oder eines ausführbaren Programms erkannt. Überprüfen Sie die
Schreibweise des Namens, oder ob der Pfad korrekt ist (sofern enthalten), und
wiederholen Sie den Vorgang.
```

**Ursache:** Die Installation hat Helm in den **PATH** eingetragen. Aber dein **laufendes** PowerShell-Fenster kennt den PATH nur so, wie er beim Öffnen des Fensters aussah. Ein Eintrag, der danach dazukommt, erreicht diese Sitzung nicht mehr. Helm ist da – nur dein Fenster weiß es nicht.

**Lösung:** PowerShell **schließen** und ein **neues** Fenster öffnen. Darin:

```powershell
helm version
```

```text
version.BuildInfo{Version:"v4.2.3", GitCommit:"43e8b7feece8beb0fcba47059ec9b522fd929a64", GitTreeState:"clean", GoVersion:"go1.26.5", KubeClientVersion:"v1.36"}
```

Das ist **die** Falle beim Einstieg – und sie erwischt fast jeden genau einmal. Merk dir das Muster, es gilt für jedes Werkzeug, das du per `winget` nachinstallierst: erst die neue Sitzung macht den Befehl sichtbar.

!!! note "Kurz erklärt: macOS und Linux"
    Auf macOS installierst du mit `brew install helm`, auf Linux nach der [Anleitung auf helm.sh](https://helm.sh/docs/intro/install/). Das Prinzip bleibt gleich: Wenn die Shell den neuen Befehl nicht kennt, öffne ein neues Terminal.

### „cluster unreachable" – obwohl minikube läuft

Der zweitwahrscheinlichste Fehler beim Einstieg, besonders wenn dein Rechner seit der letzten Übung aus war:

```text
Error: INSTALLATION FAILED: cluster reachability check failed: kubernetes cluster unreachable: Get "https://127.0.0.1:55370/version": EOF
```

Verwirrend daran: `minikube status` sagt `Running`, der Cluster ist also gar nicht kaputt. Trotzdem findet ihn niemand.

**Ursache:** minikube läuft als Docker-Container. Beim Start vergibt Docker einen **zufälligen Port** auf deinem Rechner, hinter dem der Kubernetes-API-Server sitzt. Wird der Container gestoppt und wieder gestartet – Docker Desktop neu gestartet, Rechner neu gebootet – bekommt er einen **neuen** Port. Deine `kubeconfig` merkt davon nichts und zeigt weiter auf den alten. Die Zahl in der Fehlermeldung (bei dir eine andere) ist genau dieser tote Port.

**Lösung:** Ein Befehl richtet die `kubeconfig` wieder auf den echten Port aus:

```bash
minikube update-context
```

```text
* Der Kontext "minikube" wurde aktualisiert, um auf 127.0.0.1:56090 zu zeigen
* Der aktuelle Kontext ist "minikube"
```

Danach läuft alles wieder. Gegenprobe:

```bash
kubectl get nodes
helm list
```

!!! tip "Woran du es sicher erkennst"
    Vergleich die beiden Zahlen. Was deine `kubeconfig` glaubt:

    ```bash
    kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'
    ```

    Und was der Container wirklich anbietet:

    ```bash
    docker port minikube
    ```

    Stehen dort verschiedene Ports, ist es genau dieser Fall. `minikube start` räumt das übrigens auch auf – `update-context` ist nur der schnellere Weg, weil es den Cluster nicht anfasst.

### Die Anleitung im Netz passt nicht zu dem, was du siehst

Du folgst einem Tutorial, aber die Flags stimmen nicht oder die Ausgabe sieht anders aus als beschrieben.

**Ursache:** Du hast **Helm 4**. Praktisch alles im Netz – Blogposts, Videos, Antworten auf Stack Overflow – ist für **Helm 3** geschrieben. Das ist kein Fehler deiner Installation, sondern schlicht Zeitverzug.

Für alles in diesem Block ist das folgenlos: Charts sind abwärtskompatibel und `install`, `upgrade`, `rollback`, `history`, `template`, `lint` sowie `repo` verhalten sich identisch. Zwei Flags haben neue Namen bekommen – du brauchst sie hier nicht, aber du sollst sie wiedererkennen:

| Helm 3 | Helm 4 |
|--------|--------|
| `--force` | `--force-replace` |
| `--atomic` | `--rollback-on-failure` |

Die alten Namen funktionieren weiter, geben aber eine Deprecation-Warnung aus.

**Lösung:** `helm version` zeigt dir schwarz auf weiß, was du hast. Steht dort `Version:"v4…"`, dann schlägt bei Widersprüchen die [offizielle Dokumentation](https://helm.sh/docs/) das Tutorial.

!!! note "Kurz erklärt: warum du das trotzdem entspannt sehen kannst"
    Helm 3 bekommt bis zum 10.02.2027 Sicherheitsfixes – dein Kollege mit Helm 3 arbeitet also nicht falsch, ihr arbeitet nur mit verschiedenen Ständen. Eine sichtbare Neuerung am Rande: `helm create` legt in Helm 4 zusätzlich eine `templates/httproute.yaml` an. Für unser Chart brauchen wir die nicht – raus damit.

---

## Beim Bauen des eigenen Charts

### `parse error: unexpected <.> in operand` beim Linten

Du hast an einer Vorlage nichts weiter getan als einen **Kommentar** ergänzt. Trotzdem:

```bash
helm lint ./webserver
```

```text
[ERROR] templates/: parse error at (webserver/templates/deployment.yaml:1): unexpected <.> in operand
Error: 1 chart(s) linted, 1 chart(s) failed
```

**Ursache:** In der Kommentarzeile steht ein Platzhalter in doppelten geschweiften Klammern. Das `#` macht daraus einen **YAML**-Kommentar – aber Helm rendert die Datei, **bevor** sie YAML ist. Für den Renderer ist deine Vorlage nur Text. Er sieht die Klammern auch im Kommentar und versucht, sie auszuführen. Ist die Syntax darin ungültig, bricht er ab. Der Kommentar schützt dich nicht.

**Lösung:** Keine geschweiften Klammern in Kommentaren. Beschreib den Platzhalter in Worten:

```yaml
# So nicht - der Renderer liest das mit:
# Neu sind nur die {{ ... }}-Stellen.

# So schon - in Worten:
# Neu sind nur die Platzhalter in doppelten geschweiften Klammern.
```

Genau diese Zeile hat beim Bau des Kurs-Charts zugeschlagen: Die drei Punkte sind für dich eine Auslassung, für den Renderer der Anfang eines Ausdrucks – und `.` allein ist keiner.

Genau deshalb steht in unserem `webserver/templates/deployment.yaml` im Kopfkommentar der Hinweis ausgeschrieben statt als Platzhalter.

!!! warning "Der fiese Zwilling: gültige Syntax, kein Fehler"
    Ist die Syntax im Kommentar **gültig**, gibt es überhaupt keine Fehlermeldung – Helm ersetzt den Platzhalter **lautlos**, auch im Kommentar. Aus der Zeile

    ```yaml
    # {{ .Release.Name }} ist der Name des Release
    ```

    wird nach `helm install station` im Ergebnis

    ```yaml
    # station ist der Name des Release
    ```

    Nichts stürzt ab, nichts warnt – aber wer das gerenderte YAML später liest, wundert sich über einen Kommentar, der plötzlich von „station" redet. Nachsehen kannst du das jederzeit mit `helm template station ./webserver`.

### „expected string, got …" beim Installieren, obwohl `template` und `lint` sauber waren

Zum Nachstellen: Nimm `| quote` aus der Vorlage heraus, sodass dort nur noch `VERSION: {{ .Values.version }}` steht. `helm template` rendert klaglos, `helm lint` meldet nichts, `helm install --dry-run` meldet auch nichts. Dann der echte Versuch:

```bash
helm install probe ./webserver --set version=1
```

```text
Error: INSTALLATION FAILED: server-side apply failed for object default/probe-config /v1, Kind=ConfigMap: failed to create typed patch object (default/probe-config; /v1, Kind=ConfigMap): .data.VERSION: expected string, got &value.valueUnstructured{Value:1}
```

**Ursache:** `--set version=1` liefert eine **Zahl**. Ohne `| quote` rendert Helm daraus `VERSION: 1` – und unter `data` nimmt eine ConfigMap ausschließlich **Text**. Es ist also nicht Helm, das meckert, sondern der API-Server des Clusters.

**Lösung:** `| quote` in die Vorlage. So steht es in `webserver/templates/configmap.yaml`:

```yaml
data:
  VERSION: {{ .Values.version | quote }}
  COLOR: {{ .Values.color | quote }}
  STANDORT: {{ .Values.standort | quote }}
```

Dasselbe `--set version=1` rendert damit sauber zu:

```text
VERSION: "1"
```

!!! warning "Merksatz 'Der Probelauf prüft deine Vorlage, nicht dein Cluster'"
    Das ist der lehrreichste Teil dieser Falle: **`--dry-run` findet den Fehler nicht.** Weder `helm template` noch `helm lint` noch `helm install --dry-run` kennen das Schema einer ConfigMap – sie erzeugen nur YAML und prüfen es auf Form. Ob der Inhalt zum Objekt passt, weiß erst der API-Server. Faustregel fürs Chart-Bauen: **Jeder Wert, der Text sein soll, bekommt `| quote`.** Ist er ohnehin schon Text, kostet es nichts.

---

## Beim Installieren und im Betrieb

### Die Seite zeigt nach dem Upgrade noch den alten Wert

`helm upgrade` lief durch, `helm list` zeigt die neue Revision – der Browser zeigt trotzdem Blau statt Grün. Drei Ursachen, in dieser Reihenfolge:

**Ursache A – der Tunnel hängt am alten Pod.** `kubectl port-forward` verbindet sich mit einem **konkreten** Pod. Beim Ausrollen wird der ausgetauscht, der Tunnel reißt ab oder zeigt ins Leere. Das kennst du schon aus Teil 1 und Teil 2. Beende ihn im Tunnel-Terminal mit **Ctrl+C** und starte ihn neu:

```bash
kubectl port-forward svc/station 8080:80
```

**Ursache B – der Browser zeigt eine alte Seite.** Einmal hart neu laden (**Ctrl+F5**). Unsere Demo-App lädt sich zwar alle zwei Sekunden selbst neu, aber das kostet dich nur einen Tastendruck – geprüft ist geprüft.

**Ursache C – die Pods wurden gar nicht ausgetauscht.** Aus Teil 2 kennst du das: Eine geänderte ConfigMap allein tauscht keine Pods aus, die Variablen bekommt ein Container beim **Start**. Dort brauchtest du dafür `kubectl rollout restart`.

**Bei unserem Chart entfällt dieser Schritt.** In `templates/deployment.yaml` steht die Annotation `checksum/config`: Sie enthält eine Prüfsumme der gerenderten ConfigMap. Ändert sich ein Wert, ändert sich die Prüfsumme – damit sieht die Pod-Vorlage anders aus und Kubernetes rollt von selbst neu aus. Zusehen kannst du dabei:

```bash
kubectl rollout status deployment/station
```

```text
Waiting for deployment "station" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "station" rollout to finish: 1 old replicas are pending termination...
deployment "station" successfully rolled out
```

Arbeitest du dagegen mit einem Chart **ohne** diese Annotation, bleibt dir weiterhin `kubectl rollout restart deployment/<name>`. Das ist dann kein Fehler von Helm, sondern eine fehlende Zeile im Chart.

### Ein bitnami-Chart bricht

Das Tutorial sagt `bitnami/…`, du machst es genau nach – und es zieht nicht oder du bekommst eine ganz andere Version, als du angegeben hast.

**Ursache:** Broadcom hat den Bitnami-Katalog Ende August 2025 umgestellt. Versionierte Images sind aus `docker.io/bitnami` verschwunden: `docker pull bitnami/nginx:1.27` läuft in ein „not found", nur `bitnami/nginx:latest` zieht noch. Entsprechend rendert das Chart `bitnami/nginx` heute ein `image: …bitnami/nginx:latest`.

**Lösung:** In diesem Kurs keine bitnami-Charts nehmen – obwohl viele Anleitungen im Netz genau die verwenden. Getestet ist `prometheus-community/kube-prometheus-stack`, ansonsten nimm dein eigenes Chart.

Die ganze Geschichte dahinter – und warum sie mehr ist als eine Randnotiz – steht auf [Fertige Charts nutzen](06-fertige-charts-nutzen.md).

### `helm install` bricht ab, weil es den Namen schon gibt

```text
level=ERROR msg="release name check failed" error="cannot reuse a name that is still in use"
```

**Ursache:** In diesem Namespace gibt es bereits ein Release mit diesem Namen. `helm install` legt **neu** an – und Helm weigert sich, dir dabei stillschweigend dein laufendes Release zu überschreiben.

**Der fiese Fall:** Auch ein **fehlgeschlagener** Install belegt den Namen. Das Release bleibt mit Status `failed` liegen und ist damit im Weg, obwohl nie etwas richtig lief. Wer den Fehler behebt und einfach nochmal `helm install` tippt, läuft genau hier hinein.

**Lösung:** Erst nachsehen, was da ist:

```bash
helm list
```

`helm list` zeigt dir in Helm 4 von sich aus **jeden** Status – auch `failed`. (Falls du Helm-3-Anleitungen liest: Dort listete `helm list` ohne Zusatz `deployed` und `failed`; für `superseded` oder `uninstalled` brauchte es `--all`. Genau dieses Flag gibt es in Helm 4 nicht mehr – gebraucht wird es auch nicht.)

Steht dein Release in der Liste, willst du fast immer ein **Upgrade** statt einer Neuinstallation:

```bash
helm upgrade station ./webserver
```

Willst du wirklich bei null anfangen:

```bash
helm uninstall station
helm install station ./webserver
```

!!! note "Kurz erklärt: warum Helm hier stur ist"
    Der Release-Name ist Helms Schlüssel zu allem: Unter ihm liegen die Revisionen, an ihm hängen `history`, `rollback` und `uninstall`. Zwei Releases mit demselben Namen im selben Namespace würden diese Buchführung zerreißen. Die Absage ist also keine Schikane, sondern der Schutz deiner Historie.

### Passwörter in `values.yaml`

Kein Fehler, keine Meldung, nichts bricht – und trotzdem der schwerwiegendste Punkt auf dieser Seite.

**Ursache:** `values.yaml` ist eine ganz normale Datei im Repository. Was dort steht, steht im Git: in jedem Klon, in jedem Fork, in der Historie – auch noch, nachdem du es wieder herausgelöscht hast. Unser Übungs-Chart macht das **bewusst falsch**:

```yaml
# webserver/values.yaml
appToken: "s3hr-geheim-42"
```

Es steht dort, damit die Übung ohne Umwege läuft und weil in einem Kursordner kein echtes Geheimnis auf dem Spiel steht. Im Betrieb ist genau das der Klassiker, mit dem Zugangsdaten in die Welt gelangen.

**Lösung im echten Betrieb:** Der Wert kommt nicht aus der Datei, sondern erst beim Installieren dazu – aus einem Passwort-Speicher:

=== "Windows (PowerShell)"
    ```powershell
    helm install station ./webserver --set appToken=$env:APP_TOKEN
    ```

=== "macOS / Linux"
    ```bash
    helm install station ./webserver --set appToken="$APP_TOKEN"
    ```

Die andere gängige Variante: Das Secret wird **vorher** angelegt – von Hand oder von einem Werkzeug – und das Chart verweist nur darauf, statt es selbst zu erzeugen.

!!! warning "Merksatz 'Was im Git liegt, ist kein Geheimnis'"
    Und der Punkt aus Teil 2 gilt unverändert weiter: Ein Secret ist **base64**, keine Verschlüsselung. Wer es im Cluster lesen darf, liest den Klartext. Helm ändert daran nichts – es verpackt nur, was du ihm gibst. Zum Nachlesen: [ConfigMap & Secret](../kubernetes-aufbau/02-config-und-secrets.md).

### `helm list` zeigt nichts, obwohl etwas läuft

Deine Pods laufen, die Seite ist erreichbar – aber `helm list` liefert eine leere Liste.

**Ursache:** `helm list` zeigt nur die Releases **deines aktuellen Namespace**. Hast du mit `-n prod` installiert oder dir mit `--create-namespace` einen neuen angelegt, dann fragst du jetzt schlicht im falschen Raum nach. Helm verschweigt dir nichts.

**Lösung:** Entweder über alle Namespaces:

```bash
helm list -A
```

```text
NAME   	NAMESPACE	REVISION	UPDATED                               	STATUS  	CHART          	APP VERSION
station	default  	3       	2024-03-15 15:01:20.7176141 +0100 CET 	deployed	webserver-0.1.0	1
station	dev      	1       	2024-03-15 15:01:41.5624155 +0100 CET 	deployed	webserver-0.1.0	1
station	prod     	1       	2024-03-15 15:01:42.391452 +0100 CET  	deployed	webserver-0.1.0	1
station	test     	1       	2024-03-15 15:01:41.9583803 +0100 CET 	deployed	webserver-0.1.0	1
```

Oder gezielt in einem Namespace:

```bash
helm list -n prod
```

Vier Releases namens `station` nebeneinander sind übrigens kein Widerspruch, sondern genau das Muster aus der [Praxis: Drei Umgebungen](07-lab-drei-umgebungen.md): Der Name muss nur **innerhalb** eines Namespace eindeutig sein.

Dasselbe gilt für `helm status`, `helm history`, `helm upgrade` und `helm uninstall`: Ohne `-n <namespace>` arbeiten sie im aktuellen Namespace. Der häufigste Folgefehler ist ein `helm upgrade`, das im falschen Namespace landet und dort auf den Namen schimpft, statt das gemeinte Release anzufassen.

!!! note "Kurz erklärt: warum der Namespace mehr als ein Filter ist"
    Helm merkt sich den Zustand eines Release **im Cluster** – als Secret im Namespace des Release, benannt nach dem Muster `sh.helm.release.v1.<release>.v<revision>`. Der Namespace ist also nicht nur eine Anzeige-Einstellung, sondern der Ort, an dem die Information tatsächlich liegt. Deshalb sieht auch deine Kollegin dieselben Releases wie du – und deshalb findest du nichts, wenn du am falschen Ort suchst.

---

## Wenn nichts davon passt

Dann arbeite dich in dieser Reihenfolge vor – von „was denkt Helm" über „was liegt im Cluster" zu „was hätte Helm überhaupt geschickt":

1. **Was weiß Helm?** `helm list -A`, dann `helm status station` und `helm history station`.
2. **Was liegt wirklich im Cluster?** `kubectl get all -l app=station` und bei einem hängenden Pod `kubectl describe pod <name>`.
3. **Was hätte Helm geschickt?** `helm template station ./webserver` rendert dasselbe YAML lokal, ohne etwas zu installieren – lies es einmal von oben nach unten.
4. **Zurück auf einen Stand, der lief:** `helm rollback station 1`. Das ist der Vorteil des Pakets: Du musst den Fehler nicht erst verstehen, um wieder arbeitsfähig zu sein – verstehen kannst du ihn danach in Ruhe.

---

## Weiter

- [Rückblick & Abschluss](10-rueckblick.md) – was du aus dem Helm-Block mitnimmst
- [Helm-Cheatsheet](../cheatsheets/helm.md) – alle Befehle dieses Blocks kompakt auf einer Seite
- [Übungen](08-uebungen.md) – hier kannst du die Fallen von oben gezielt selbst auslösen
