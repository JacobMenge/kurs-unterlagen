---
title: "Weitere Übungen"
description: "Elf Zusatzübungen zum Helm-Block in drei Stufen – vom zweiten Release desselben Charts über den „default“-Filter und die quote-Falle bis zum Paketieren und zum Lesen fremder Charts. Jede Übung mit aufklappbarer Lösung."
---

# Weitere Übungen – Helm

<span class='badge badge-bonus'>Bonus</span> &nbsp; **Diese Seite ist Kür, kein Pflichtprogramm.** Du bist mit der [Praxis](05-praxis-upgrade-rollback.md) und der [Praxis: Drei Umgebungen](07-lab-drei-umgebungen.md) durch und hast noch Zeit? Dann ist das hier deine Spielwiese. Alle Übungen laufen mit **demselben Chart**, das schon in `apps/kubernetes-helm/` liegt – du brauchst nichts Neues herunterzuladen.

Diese Seite ist auch als **Selbstlern-Material für danach** gedacht. Du musst sie nicht heute schaffen und nicht der Reihe nach durchgehen. Nimm dir raus, was dich interessiert.

!!! abstract "Die drei Stufen"
    - **Einstieg** – die Handgriffe aus der Praxis noch einmal, aus einem anderen Blickwinkel
    - **Fortgeschritten** – du fasst das Chart selbst an und baust Vorlagen um
    - **Knifflig** – Paketieren, Vorrangregeln und fremde Charts lesen

---

## Voraussetzung für alle Übungen

- **Helm ist da.** Schneller Check:

    ```bash
    helm version
    ```

    ```text
    version.BuildInfo{Version:"v4.2.3", GitCommit:"43e8b7feece8beb0fcba47059ec9b522fd929a64", GitTreeState:"clean", GoVersion:"go1.26.5", KubeClientVersion:"v1.36"}
    ```

- **Dein Cluster läuft.** `kubectl get nodes` zeigt einen Node mit Status `Ready`. Falls nicht: [minikube starten](../kubernetes-praxis/03-installation.md).
- **Die Projektdateien liegen lokal.** Alle Befehle auf dieser Seite gehen von diesem Ordner aus:

    ```bash
    git clone https://github.com/JacobMenge/kurs-unterlagen.git
    cd kurs-unterlagen/apps/kubernetes-helm
    ```

!!! tip "Kaputt gemacht? Ein Befehl räumt auf"
    Ab der Stufe *Fortgeschritten* änderst du Dateien im Chart. Wenn du dich verrennst, hol dir den Auslieferungszustand zurück – Git kennt ihn noch:

    ```bash
    git restore .
    ```

    Und wenn im Cluster zu viel herumliegt: `helm list -A` zeigt dir alle Releases, `helm uninstall <name>` entfernt eines davon.

---

## Einstieg

### Übung 1 – Zwei Releases aus einem Chart

!!! info "Was du lernst"
    - Ein Chart ist eine **Vorlage**, kein Einzelstück – du kannst es beliebig oft installieren
    - Warum sich zwei Releases im selben Namespace nicht in die Quere kommen
    - Wie du am Release-Namen erkennst, welcher Pod zu wem gehört

#### Aufgabe

Installiere **dasselbe** Chart zweimal nebeneinander im Namespace `default`: einmal als Release `nord` (Standardfarbe), einmal als Release `ost` in Orange (`#c2680a`) mit einem anderen Standort. Weise nach, dass beide unabhängig voneinander laufen: `helm list` zeigt zwei Releases, `kubectl get pods` zeigt zwei Gruppen von Pods.

Überleg vorher: Warum überschreibt die zweite Installation die erste eigentlich nicht? Die ConfigMap hieß in Teil 2 doch fest `webserver-config`.

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – beide Releases installieren:**

    ```bash
    helm install nord ./webserver --set standort="Rechenzentrum Nord"
    helm install ost ./webserver --set standort="Rechenzentrum Ost" --set color="#c2680a"
    ```

    **Schritt 2 – nachsehen, was entstanden ist:**

    ```bash
    helm list
    kubectl get pods
    kubectl get configmap
    ```

    `helm list` zeigt **zwei** Zeilen, `nord` und `ost`, beide mit Status `deployed` und Revision 1. Bei `kubectl get pods` siehst du **vier** Pods: zwei, deren Name mit `nord-` beginnt, zwei mit `ost-`. Und bei den ConfigMaps liegen `nord-config` und `ost-config` friedlich nebeneinander.

    Gezielt nach einer Gruppe fragen kannst du über das Label:

    ```bash
    kubectl get pods -l app=nord
    kubectl get pods -l app=ost
    ```

    **Schritt 3 – beide Seiten ansehen.** Zwei Terminals, zwei Tunnel:

    ```bash
    kubectl port-forward svc/nord 8080:80
    ```

    ```bash
    kubectl port-forward svc/ost 8081:80
    ```

    <http://localhost:8080> ist blau mit „Rechenzentrum Nord“, <http://localhost:8081> ist orange mit „Rechenzentrum Ost“. Gleiches Chart, gleiches Image – zwei komplett getrennte Dienste.

    **Warum kollidiert nichts?** Weil in den Vorlagen kein einziger Name fest steht. Überall, wo ein Objekt benannt wird, steht der Platzhalter für den Release-Namen:

    ```yaml
    metadata:
      name: {{ .Release.Name }}-config
    ```

    Beim Installieren setzt Helm dort `nord` beziehungsweise `ost` ein. Dasselbe gilt für Deployment, Service und den Selektor. Genau dafür gibt es `.Release.Name`.

    **Aufräumen:**

    ```bash
    helm uninstall nord ost
    ```

??? success "Erwartung"
    Du hast begriffen, dass ein Chart ein **Bauplan** ist und ein Release eine **konkrete Ausprägung** davon. Solange alle Namen aus `.Release.Name` kommen, kannst du dasselbe Chart so oft installieren, wie du willst – im selben Namespace oder in verschiedenen. Genau das nutzt du in der [Praxis: Drei Umgebungen](07-lab-drei-umgebungen.md) für drei Umgebungen.

---

### Übung 2 – Was liegt wirklich im Cluster?

!!! info "Was du lernst"
    - Der Unterschied zwischen `helm template` (rendert lokal) und `helm get manifest` (holt aus dem Cluster)
    - Warum die beiden auseinanderlaufen können
    - Dass Helm den Release-Zustand **im Cluster** speichert, nicht auf deinem Laptop

#### Aufgabe

Installiere das Release `station` mit den Standardwerten. Ändere es dann per Upgrade auf Grün und Version 2. Finde danach heraus:

1. Was liegt **jetzt im Cluster**?
2. Was würde das Chart **auf deiner Platte** gerade rendern?
3. Welche Werte hast **du** eigentlich mitgegeben – im Unterschied zu denen, die aus `values.yaml` kommen?

Die drei Fragen beantworten drei verschiedene Befehle. Vergleich die Ausgaben.

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – installieren und ändern:**

    ```bash
    helm install station ./webserver
    helm upgrade station ./webserver --set color="#2e9e5b" --set version=2
    ```

    **Schritt 2 – was im Cluster liegt:**

    ```bash
    helm get manifest station
    ```

    Du bekommst die vier fertigen Objekte, so wie sie beim letzten Upgrade angewendet wurden: ConfigMap, Secret, Deployment und Service – ganz ohne Platzhalter. Ganz oben in der ConfigMap steht `VERSION: "2"` und die grüne Farbe.

    **Schritt 3 – was das Chart gerade rendern würde:**

    ```bash
    helm template station ./webserver
    ```

    Sieht fast gleich aus – aber in der ConfigMap steht `VERSION: "1"` und Blau. Kein Widerspruch: `helm template` nimmt die Werte aus `values.yaml` und weiß **nichts** von deinem `--set` beim Upgrade. Es rendert die Vorlage, es fragt den Cluster nicht.

    **Schritt 4 – deine eigenen Werte:**

    ```bash
    helm get values station
    ```

    Hier stehen nur die Werte, die **du** per `--set` oder `-f` mitgegeben hast – also `color` und `version`. Alles andere kommt weiterhin aus `values.yaml` und taucht deshalb nicht auf.

    **Der Merksatz dazu:** `helm get ...` fragt den **Cluster**, `helm template` fragt deine **Festplatte**.

??? success "Erwartung"
    Dir ist klar, woher `helm get manifest` seine Antwort nimmt: aus dem Secret, das Helm zum Release im Cluster ablegt (`sh.helm.release.v1.station.v2`). Deshalb sieht auch deine Kollegin dieselben Releases, obwohl sie deinen Laptop nie gesehen hat. Und dir ist klar, warum `helm template` beim Fehlersuchen zwar hilfreich, aber eben **keine** Aussage über den laufenden Betrieb ist.

---

### Übung 3 – Die NOTES um eine eigene Zeile erweitern

!!! info "Was du lernst"
    - `NOTES.txt` ist selbst eine Vorlage – Platzhalter funktionieren dort genauso
    - `helm status` zeigt die NOTES noch einmal, ohne dass du irgendetwas neu installierst
    - Welche Angaben aus dem Chart-Steckbrief du in Vorlagen benutzen kannst

!!! note "Voraussetzung: das Release `station` läuft"
    Diese Übung arbeitet mit `station` weiter. Läuft es nicht (prüf mit `helm list`), hol es dir mit einem Befehl:

    ```bash
    helm install station ./webserver
    ```

#### Aufgabe

Ergänze `webserver/templates/NOTES.txt` um eine eigene Zeile, die Chart-Name, Chart-Version und den Namespace des Releases ausgibt. Bring die neue Zeile danach auf den Bildschirm – einmal beim Ausrollen und einmal, ohne etwas zu verändern.

**Kür:** Lass die NOTES melden, ob überhaupt ein Token gesetzt ist.

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – NOTES.txt ergänzen.** Häng unten an:

    ```text
    Chart: {{ .Chart.Name }}-{{ .Chart.Version }} (App-Version {{ .Chart.AppVersion }})
    Namespace: {{ .Release.Namespace }}
    ```

    `.Chart.*` greift auf `Chart.yaml` zu, `.Release.*` auf das, was beim Installieren entsteht.

    **Schritt 2 – ausrollen:**

    ```bash
    helm upgrade station ./webserver
    ```

    Unter der Meldung zum Upgrade druckt Helm die NOTES – jetzt mit deiner Zeile: `Chart: webserver-0.1.0 (App-Version 1)` und dem Namespace `default`.

    **Schritt 3 – noch einmal ansehen, ohne etwas zu tun:**

    ```bash
    helm status station
    ```

    Dieselben NOTES, ohne Upgrade. Praktisch, wenn du den `port-forward`-Befehl vergessen hast – der steht ja auch drin.

    !!! note "Reihenfolge beachten"
        `helm status` zeigt die NOTES, die beim **letzten** Install oder Upgrade gerendert wurden. Änderst du nur die Datei, ohne auszurollen, siehst du weiter die alte Fassung. Erst `helm upgrade`, dann `helm status`.

    **Kür – eine Bedingung in den NOTES:**

    ```text
    Token gesetzt: {{ if .Values.appToken }}ja{{ else }}nein{{ end }}
    ```

    Nach einem `helm upgrade station ./webserver` steht dort `ja`. Probier den Gegentest:

    ```bash
    helm upgrade station ./webserver --set appToken=""
    ```

    Jetzt steht dort `nein`. Vorlagen können also nicht nur einsetzen, sondern auch **entscheiden**.

    **Aufräumen:**

    ```bash
    git restore webserver/templates/NOTES.txt
    ```

??? success "Erwartung"
    Du hast die NOTES als das erkannt, was sie sind: eine Vorlage wie jede andere, nur dass ihr Ergebnis nicht im Cluster landet, sondern auf dem Bildschirm. Das ist der Ort, an dem ein Chart seinen Nutzern sagt, was sie als Nächstes tun sollen.

---

## Fortgeschritten

### Übung 4 – Ein Wert fehlt: der default-Filter

!!! info "Was du lernst"
    - Wie `default` eine Vorlage gegen fehlende Werte absichert
    - Warum die **Reihenfolge** in einer Filterkette entscheidend ist
    - Dass `helm template` das schnellste Prüfwerkzeug für solche Änderungen ist

!!! note "Voraussetzung: das Release `station` läuft"
    Läuft es nicht (prüf mit `helm list`), hol es dir mit `helm install station ./webserver`.

#### Aufgabe

Lösch in `webserver/values.yaml` die Zeile mit `standort`. Sieh dir mit `helm template` an, was jetzt aus der ConfigMap-Zeile wird. Sorg dann dafür, dass die Vorlage in diesem Fall den Text `unbekannt` einsetzt – ohne den Wert wieder in `values.yaml` zu schreiben.

Prüf zum Schluss zweierlei:

1. Die Seite zeigt **Standort: unbekannt**.
2. Ein `--set standort="..."` sticht den Ersatzwert trotzdem aus.

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – Wert entfernen.** In `webserver/values.yaml` die Zeile `standort: "Rechenzentrum Nord"` löschen.

    **Schritt 2 – hinsehen, bevor du reparierst:**

    ```bash
    helm template station ./webserver
    ```

    Schau dir die `STANDORT`-Zeile in der ConfigMap an. Da steht kein Wert mehr – die Vorlage hat nichts einzusetzen. Genau das ist die Lücke, die `default` schließt.

    **Schritt 3 – den Filter einbauen.** In `webserver/templates/configmap.yaml`:

    ```yaml
    data:
      VERSION: {{ .Values.version | quote }}
      COLOR: {{ .Values.color | quote }}
      STANDORT: {{ .Values.standort | default "unbekannt" | quote }}
    ```

    Lies die Zeile von links nach rechts wie ein Fließband: nimm `.Values.standort`, **falls leer nimm „unbekannt“** und setz am Ende Anführungszeichen drum.

    **Schritt 4 – prüfen:**

    ```bash
    helm template station ./webserver
    ```

    Jetzt steht dort `STANDORT: "unbekannt"`.

    **Schritt 5 – ausrollen und ansehen:**

    ```bash
    helm upgrade station ./webserver
    kubectl port-forward svc/station 8080:80
    ```

    <http://localhost:8080> zeigt **Standort: unbekannt**. Beachte: Du musstest **kein** `kubectl rollout restart` eingeben. Die Annotation `checksum/config` im Deployment hat sich mitgeändert, weil sich die ConfigMap geändert hat – also sieht die Pod-Vorlage anders aus und Kubernetes rollt von selbst neu aus.

    **Schritt 6 – der Ersatzwert ist nur ein Ersatz:**

    ```bash
    helm upgrade station ./webserver --set standort="Rechenzentrum Ost"
    ```

    Die Seite zeigt wieder einen echten Standort. `default` greift nur, wenn nichts da ist.

    !!! warning "Die Reihenfolge ist keine Geschmacksfrage"
        `{{ .Values.standort | default "unbekannt" | quote }}` ist richtig. Dreh die beiden Filter um – `| quote | default "unbekannt"` – und der Ersatzwert greift nicht mehr. Grund: `quote` läuft zuerst und liefert schon eine fertige Zeichenkette ab. Für `default` ist danach nichts mehr „leer“, also hat es nichts zu tun. **Erst entscheiden, dann verpacken.**

    **Aufräumen:**

    ```bash
    git restore .
    ```

??? success "Erwartung"
    Du kannst eine Vorlage so schreiben, dass sie auch dann noch etwas Sinnvolles liefert, wenn ein Wert fehlt. Das ist genau der Grund, warum fremde Charts so viele Werte kennen, die du nie setzt: Für alles gibt es einen vernünftigen Standard.

---

### Übung 5 – Einen neuen Wert durchschleifen

!!! info "Was du lernst"
    - Den Weg eines Wertes von `values.yaml` bis in den Container – einmal komplett
    - Dass `envFrom` neue Schlüssel automatisch mitnimmt (wie schon in [Teil 2](../kubernetes-aufbau/03-praxis-config-secrets.md))
    - Wie du im Container nachweist, dass der Wert wirklich angekommen ist

!!! note "Voraussetzung: das Release `station` läuft"
    Läuft es nicht (prüf mit `helm list`), hol es dir mit `helm install station ./webserver`.

#### Aufgabe

Bau einen **neuen** Wert `betreiber` in das Chart ein. Er soll in `values.yaml` einen Standard haben, als Schlüssel `BETREIBER` in der ConfigMap landen und im Container als Umgebungsvariable ankommen. Weise das mit `kubectl exec` nach – und zeig danach, dass `--set betreiber="..."` den Standard aussticht.

!!! note "Warum nicht auf der Seite?"
    Den Wert zusätzlich auf der Web-Seite anzuzeigen ginge auch, hieße aber, das HTML im Deployment umzubauen. Für den Lerneffekt reicht der Nachweis in der ConfigMap und in der Umgebungsvariablen – genau da entscheidet sich, ob dein Wert den Weg geschafft hat.

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – Standardwert setzen.** In `webserver/values.yaml`, zu den anderen Anzeige-Werten:

    ```yaml
    version: "1"
    color: "#2563a8"
    standort: "Rechenzentrum Nord"
    betreiber: "Aurora Station"
    ```

    **Schritt 2 – Vorlage erweitern.** In `webserver/templates/configmap.yaml` eine Zeile dazu:

    ```yaml
    data:
      VERSION: {{ .Values.version | quote }}
      COLOR: {{ .Values.color | quote }}
      STANDORT: {{ .Values.standort | quote }}
      BETREIBER: {{ .Values.betreiber | quote }}
    ```

    `| quote` nicht vergessen – warum, siehst du in Übung 6.

    **Schritt 3 – trocken prüfen:**

    ```bash
    helm template station ./webserver
    ```

    In der ConfigMap steht jetzt `BETREIBER: "Aurora Station"`.

    **Schritt 4 – ausrollen:**

    ```bash
    helm upgrade station ./webserver
    kubectl rollout status deployment/station
    ```

    **Schritt 5 – im Container nachsehen:**

    ```bash
    kubectl exec deploy/station -- sh -c 'echo BETREIBER=$BETREIBER'
    ```

    Die Ausgabe zeigt deinen Wert. Beachte, was du **nicht** getan hast: Du hast das Deployment nicht angefasst. Das Deployment zieht per `envFrom` immer **alle** Schlüssel der ConfigMap ein – ein neuer Schlüssel ist damit automatisch eine neue Umgebungsvariable.

    **Schritt 6 – überschreiben:**

    ```bash
    helm upgrade station ./webserver --set betreiber="Nordwerft"
    kubectl exec deploy/station -- sh -c 'echo BETREIBER=$BETREIBER'
    ```

    Jetzt kommt `Nordwerft` heraus. Der Wert ist eine echte Stellschraube des Pakets geworden.

    **Aufräumen:**

    ```bash
    git restore .
    ```

??? success "Erwartung"
    Du hast den ganzen Weg einmal selbst gelegt: `values.yaml` → Vorlage → ConfigMap → Umgebungsvariable → Container. Wenn du das kannst, kannst du jedes Chart um eine eigene Stellschraube erweitern.

---

### Übung 6 – Die quote-Falle selbst auslösen

!!! info "Was du lernst"
    - Warum `| quote` in einer ConfigMap Pflicht ist und keine Kosmetik
    - Dass `helm template`, `helm lint` **und** `--dry-run` diesen Fehler alle drei durchwinken
    - Wie die echte Fehlermeldung aussieht – damit du sie später wiedererkennst

#### Aufgabe

Bau den Fehler absichtlich ein: Entferne in `webserver/templates/configmap.yaml` das `| quote` hinter `.Values.version`. Installier dann ein Release namens `probe` mit `--set version=1`.

Lauf vorher aber der Reihe nach durch `helm template`, `helm lint` und `helm install --dry-run`. Notier dir für jedes: **Meldet es den Fehler?** Erst danach die echte Installation.

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – das quote entfernen.** In `webserver/templates/configmap.yaml`:

    ```yaml
    data:
      VERSION: {{ .Values.version }}
      COLOR: {{ .Values.color | quote }}
      STANDORT: {{ .Values.standort | quote }}
    ```

    **Schritt 2 – rendern:**

    ```bash
    helm template probe ./webserver --set version=1
    ```

    Läuft **klaglos** durch. In der ConfigMap steht `VERSION: 1` – ohne Anführungszeichen. Sieht harmlos aus. Ist es nicht: Ohne Anführungszeichen ist das für YAML keine Zeichenkette mehr, sondern eine **Zahl**. Und eine ConfigMap nimmt nur Text.

    **Schritt 3 – prüfen lassen:**

    ```bash
    helm lint ./webserver
    ```

    Meldet weiterhin `0 chart(s) failed`. Der Linter prüft den Bau des Charts, nicht was Kubernetes davon hält.

    **Schritt 4 – der Trockenlauf:**

    ```bash
    helm install probe ./webserver --set version=1 --dry-run
    ```

    Kein Fehler. Auch `--dry-run` findet es **nicht**.

    **Schritt 5 – die Wahrheit:**

    ```bash
    helm install probe ./webserver --set version=1
    ```

    ```text
    Error: INSTALLATION FAILED: server-side apply failed for object default/probe-config /v1, Kind=ConfigMap: failed to create typed patch object (default/probe-config; /v1, Kind=ConfigMap): .data.VERSION: expected string, got &value.valueUnstructured{Value:1}
    ```

    Das Entscheidende steht ganz hinten: **`expected string, got ...1`**. Der Cluster wollte Text, bekam eine Zahl.

    **Schritt 6 – die Leiche wegräumen.** Hier lauert die nächste Überraschung. Schau nach, was der Fehlversuch hinterlassen hat:

    ```bash
    helm list
    ```

    `probe` steht da – mit Status `failed`. Ein gescheiterter `install` verschwindet also **nicht** von selbst, er bleibt als misslungenes Release liegen. Genauer nachsehen kannst du mit `helm status probe` (zeigt `STATUS: failed`).

    Das hat eine Folge: Der Name ist belegt. Ein zweiter `install` unter demselben Namen bricht ab:

    ```text
    level=ERROR msg="release name check failed" error="cannot reuse a name that is still in use"
    ```

    Also erst aufräumen, dann reparieren:

    ```bash
    helm uninstall probe
    git restore webserver/templates/configmap.yaml
    helm install probe ./webserver --set version=1
    ```

    Mit `| quote` rendert dasselbe `--set version=1` sauber zu `VERSION: "1"` und die Installation geht durch.

    **Aufräumen:**

    ```bash
    helm uninstall probe
    ```

??? success "Erwartung"
    Der Lernpunkt ist größer als das eine `quote`: **`helm template` und `--dry-run` sind kein Beweis, dass etwas funktioniert.** Beide fragen den Cluster nicht wirklich – sie zeigen dir nur, was Helm verschicken würde. Ob Kubernetes das annimmt, weißt du erst beim echten Anwenden. Wenn dich also eine Fehlermeldung mit `expected string` trifft: Da fehlt fast immer ein `| quote`.

    Der zweite Lernpunkt kam gratis dazu: **Ein gescheiterter `install` räumt nicht hinter sich auf.** Das Release bleibt mit Status `failed` liegen und blockiert seinen Namen. Genau deshalb steht `helm uninstall` vor dem zweiten Versuch.

---

### Übung 7 – Die Kommentar-Falle selbst auslösen

!!! info "Was du lernst"
    - Dass Helm die Datei rendert, **bevor** sie YAML ist – ein `#` schützt vor gar nichts
    - Warum ein Fehler im Kommentar das ganze Chart lahmlegen kann
    - Der fiesere Fall: Es funktioniert und ist trotzdem falsch

#### Aufgabe

Schreib in `webserver/templates/deployment.yaml` einen Platzhalter in eine **Kommentarzeile** – zum Beispiel, um zu erklären, wie das Deployment heißt. Rendere das Chart und sieh dir den Kommentar in der Ausgabe an.

Frag dich vorher: Ein Kommentar ist doch nur Text für Menschen. Was sollte da schon passieren?

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – gut gemeinten Kommentar schreiben.** Ganz oben in `webserver/templates/deployment.yaml`:

    ```yaml
    # {{ .Release.Name }} ist der Name des Deployments.
    apiVersion: apps/v1
    kind: Deployment
    ```

    **Schritt 2 – rendern:**

    ```bash
    helm template station ./webserver
    ```

    Sieh dir die erste Zeile der Ausgabe an. Aus deinem Kommentar ist geworden:

    ```yaml
    # station ist der Name des Deployments.
    ```

    Helm hat den Platzhalter **im Kommentar** ersetzt. Kein Fehler, keine Warnung – der Renderer sieht die Datei einfach als Text und tauscht jede Fundstelle. Dass ein `#` davorsteht, weiß er nicht, denn YAML wird die Datei erst **danach**.

    Fies daran: Es fällt niemandem auf. Der Kommentar im Chart erklärt etwas Allgemeines, in der Ausgabe steht plötzlich ein konkreter Name – wer die Ausgabe liest, hält `station` für einen festen Bestandteil des Charts.

    **Schritt 3 – jetzt der laute Fall.** Bau im Kommentar einen Tippfehler in die Klammern ein, sodass die Syntax nicht mehr aufgeht. Lass dann den Linter drüberlaufen:

    ```bash
    helm lint ./webserver
    ```

    Ein kaputter Platzhalter im Kommentar bringt das **ganze Chart** zu Fall – mit einer Meldung dieser Art:

    ```text
    [ERROR] templates/: parse error at (webserver/templates/deployment.yaml:1): unexpected <.> in operand
    Error: 1 chart(s) linted, 1 chart(s) failed
    ```

    Beachte die Zeilennummer: Sie zeigt auf die **Kommentarzeile**. Nichts an deinem eigentlichen Deployment ist kaputt.

    **Aufräumen:**

    ```bash
    git restore webserver/templates/deployment.yaml
    ```

??? success "Erwartung"
    Du hast die Reihenfolge verstanden, die hinter vielen Helm-Überraschungen steckt: **Erst rendert Helm Text, dann liest Kubernetes YAML.** Deshalb darf in einem Chart-Kommentar kein Platzhalter stehen – im besten Fall wird er lautlos ersetzt, im schlechteren fällt dir das Chart um. Und wenn du im Kommentar über einen Platzhalter *sprechen* willst, beschreib ihn in Worten, statt ihn hinzuschreiben.

---

## Knifflig

### Übung 8 – Das Chart paketieren

!!! info "Was du lernst"
    - `helm package` – die Form, in der Charts tatsächlich verteilt werden
    - Dass der Dateiname aus `Chart.yaml` kommt, nicht aus deiner Laune
    - Dass ein `.tgz` alles kann, was ein Ordner kann

#### Aufgabe

Pack das Chart zu einem Archiv und installier ein Release **aus dem Archiv** statt aus dem Ordner. Zähl danach die Chart-Version in `Chart.yaml` hoch, pack neu – und beobachte den Dateinamen.

Zusatzfrage: Was steckt eigentlich im Archiv? Wirf einen Blick in `webserver/.helmignore`, bevor du rätst.

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – paketieren:**

    ```bash
    helm package ./webserver
    ```

    Helm meldet dir den Pfad der erzeugten Datei. Im aktuellen Ordner liegt jetzt **`webserver-0.1.0.tgz`**. Der Name ist kein Zufall: Er setzt sich aus `name` und `version` aus `Chart.yaml` zusammen.

    **Schritt 2 – aus dem Archiv installieren:**

    ```bash
    helm install paket ./webserver-0.1.0.tgz
    ```

    Läuft genauso wie aus dem Ordner – inklusive NOTES. Für Helm ist ein `.tgz` nur ein zusammengepacktes Chart. Auch das geht:

    ```bash
    helm show values ./webserver-0.1.0.tgz
    helm show chart ./webserver-0.1.0.tgz
    ```

    Mit `helm list` siehst du in der Spalte `CHART`, aus welcher Chart-Version das Release gebaut wurde.

    **Schritt 3 – Version hochzählen.** In `webserver/Chart.yaml`:

    ```yaml
    version: 0.2.0
    ```

    ```bash
    helm package ./webserver
    ```

    Jetzt liegt zusätzlich `webserver-0.2.0.tgz` da. Die alte Datei bleibt liegen – das ist der Sinn der Sache: Ein Chart-Repository ist am Ende nichts anderes als ein Haufen solcher Archive plus eine Index-Datei, die auflistet, welche Versionen es gibt. Genau daraus bedient sich `helm install prometheus-community/kube-prometheus-stack`.

    **Schritt 4 – was ist drin?** `.helmignore` funktioniert wie eine `.dockerignore`: Was dort steht, wandert **nicht** ins Archiv. So landen `.git`-Reste oder lokale Notizen nicht bei deinen Nutzern.

    **Aufräumen:**

    ```bash
    helm uninstall paket
    git restore webserver/Chart.yaml
    rm webserver-0.1.0.tgz
    rm webserver-0.2.0.tgz
    ```

    (Die beiden `rm` stehen bewusst auf eigenen Zeilen: In PowerShell ist `rm` ein anderer Befehl als unter Linux und nimmt nur **einen** Dateinamen ohne weitere Angabe.)

??? success "Erwartung"
    Du weißt jetzt, was ein Chart aus einem Repository eigentlich ist: genau so ein `.tgz`, wie du es gerade selbst gebaut hast. Der Unterschied zwischen „mein Ordner“ und „das Chart von prometheus-community“ ist kleiner, als er aussieht.

---

### Übung 9 – Wer gewinnt: `-f` oder `--set`?

!!! info "Was du lernst"
    - Die Vorrangkette der Werte, nachgewiesen statt geglaubt
    - Dass `helm template` die schnellste Art ist, so etwas zu klären – ganz ohne Cluster
    - Warum diese Regel im Alltag über Fehlersuchen entscheidet

#### Aufgabe

Die Kette lautet: **`values.yaml` < eigene Datei per `-f` < `--set`** – was weiter rechts steht, gewinnt. Beweis es selbst.

`values.yaml` sagt `replicaCount: 2`, `values-prod.yaml` sagt `3`. Sag jetzt per `--set` die Zahl `5` dazu. **Sag deine Erwartung laut, bevor du Enter drückst.** Dann prüf sie.

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – alle drei Quellen ins Rennen schicken:**

    ```bash
    helm template station ./webserver -f values-prod.yaml --set replicaCount=5
    ```

    **Schritt 2 – gezielt nachsehen.** Die Ausgabe ist lang, filter sie:

    === "Windows (PowerShell)"
        ```powershell
        helm template station ./webserver -f values-prod.yaml --set replicaCount=5 | Select-String "replicas:"
        ```

    === "macOS / Linux"
        ```bash
        helm template station ./webserver -f values-prod.yaml --set replicaCount=5 | grep "replicas:"
        ```

    Ergebnis: `replicas: 5`. `values.yaml` sagte 2, `values-prod.yaml` sagte 3 – gewonnen hat `--set`.

    **Schritt 3 – die Probe aufs Exempel.** Lass das `--set` weg:

    ```bash
    helm template station ./webserver -f values-prod.yaml
    ```

    Jetzt steht dort `replicas: 3`, der Wert aus `values-prod.yaml`. Und ganz ohne `-f` steht dort `replicas: 2` aus `values.yaml`. Drei Läufe, drei Zahlen, eine Regel.

    **Schritt 4 – Kür: zwei Dateien gleichzeitig.** Auch unter mehreren `-f` gilt „rechts gewinnt“:

    ```bash
    helm template station ./webserver -f values-dev.yaml -f values-prod.yaml
    ```

    Sieh dir `replicas` und die Farbe an und dreh dann die beiden Dateien um. Die zuletzt genannte Datei setzt sich durch.

    !!! tip "Warum das im Alltag zählt"
        Wenn ein Release partout nicht den Wert nimmt, den du in der Datei siehst, ist die Ursache fast immer diese Kette: Irgendwo weiter rechts steht noch ein `--set` – im Skript, in der Pipeline, im Alias. `helm get values <release>` zeigt dir, was tatsächlich angekommen ist.

??? success "Erwartung"
    Du kannst die Vorrangkette nicht nur aufsagen, sondern in zehn Sekunden nachweisen – ohne etwas zu installieren. `helm template` ist dein Werkzeug für die Frage „was käme dabei raus?“.

---

### Übung 10 – Ein fremdes Chart lesen, ohne es zu installieren

!!! info "Was du lernst"
    - `helm show values` und `helm template` als Leseinstrument für fremde Charts
    - Wie viel ein einziger `helm install`-Befehl in Wahrheit anlegt
    - Warum man ein fremdes Chart liest, **bevor** man es laufen lässt

#### Aufgabe

Nimm dir `kube-prometheus-stack` vor – das Chart, das Prometheus und Grafana installiert, die du im [Monitoring-Block](../monitoring-praxis/index.md) noch von Hand in einer Compose-Datei verdrahtet hast. Finde heraus, **ohne** es zu installieren:

1. Wie viele Zeilen YAML würde ein `helm install` erzeugen?
2. Wie viele Kubernetes-Objekte wären das?
3. Wie viele Stellschrauben bietet das Chart an?

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – Repository bekannt machen:**

    ```bash
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    ```

    **Schritt 2 – nachschlagen, was es gibt:**

    ```bash
    helm search repo prometheus-community/kube-prometheus-stack
    ```

    ```text
    NAME                                      	CHART VERSION	APP VERSION	DESCRIPTION
    prometheus-community/kube-prometheus-stack	87.16.1      	v0.92.1    	kube-prometheus-stack collects Kubernetes manif...
    ```

    Zwei Versionen in einer Zeile: `CHART VERSION` ist der Stand des Pakets, `APP VERSION` der Stand der Software darin. Dasselbe Paar wie in deinem `Chart.yaml`.

    **Schritt 3 – die Stellschrauben lesen:**

    ```bash
    helm show values prometheus-community/kube-prometheus-stack
    ```

    Das rauscht durch. Schreib es in eine Datei und lies in Ruhe:

    ```bash
    helm show values prometheus-community/kube-prometheus-stack > werte.yaml
    ```

    Es sind mehrere tausend Zeilen. Genau das ist der Punkt: Das Chart hat für **alles** einen Standard, damit du nur die Handvoll Werte setzen musst, die dich betreffen. Dein eigenes `values.yaml` mit seiner Handvoll Werte ist dasselbe in klein.

    **Schritt 4 – zählen, was entstehen würde:**

    === "Windows (PowerShell)"
        ```powershell
        (helm template monitoring prometheus-community/kube-prometheus-stack | Measure-Object -Line).Lines
        (helm template monitoring prometheus-community/kube-prometheus-stack | Select-String "^kind:").Count
        ```

    === "macOS / Linux"
        ```bash
        helm template monitoring prometheus-community/kube-prometheus-stack | wc -l
        helm template monitoring prometheus-community/kube-prometheus-stack | grep -c "^kind:"
        ```

    Bei der Chart-Version **87.16.1** kommen dabei **rund 6.800 Zeilen YAML** und **rund 120 Objekte** heraus: Regeln, ConfigMaps, ServiceMonitors, Services, ServiceAccounts, Rollen, Rollenbindungen, Deployments. Bei dir kann die Zahl abweichen – das Chart wird ständig weiterentwickelt. Deshalb gehört zu jeder solchen Angabe die Chart-Version dazu.

    Halt einen Moment inne: **Ein** Befehl, rund 120 Objekte. Von Hand wäre das ein Arbeitstag – und ein Rückbau davon auch.

    **Schritt 5 – gezielt hineinschauen.** Welche Images würde das Chart ziehen?

    === "Windows (PowerShell)"
        ```powershell
        helm template monitoring prometheus-community/kube-prometheus-stack | Select-String "image:"
        ```

    === "macOS / Linux"
        ```bash
        helm template monitoring prometheus-community/kube-prometheus-stack | grep "image:"
        ```

    Das ist die Frage, die du bei **jedem** fremden Chart stellen solltest: Woher kommen die Images und welche Rechte will das Chart im Cluster haben (`ClusterRole` sagt: clusterweit)?

    !!! warning "Warum das keine Paranoia ist"
        Ende August 2025 hat Broadcom den Bitnami-Katalog umgestellt. Versionierte Images sind aus `docker.io/bitnami` verschwunden – `docker pull bitnami/nginx:1.27` findet nichts mehr, das Chart `bitnami/nginx` rendert heute ein `:latest`-Image. Wer eines dieser Charts blind eingebunden hatte, stand plötzlich ohne Image da. Deshalb in diesem Kurs **keine** bitnami-Charts, obwohl die halbe Tutorial-Welt sie nutzt. Ein Chart ist fremder Code mit clusterweiten Rechten. Lies es.

??? success "Erwartung"
    Du kannst ein fremdes Chart bewerten, bevor du es installierst: Was legt es an, welche Images zieht es, welche Rechte will es, welche Werte kannst du drehen? Das ist derselbe Reflex wie beim Blick in ein fremdes `docker-compose.yml` – nur dass hier deutlich mehr auf dem Spiel steht. Wenn du das Chart danach wirklich installieren willst: [Fertige Charts nutzen](06-fertige-charts-nutzen.md) zeigt den Weg.

---

### Übung 11 – Drei Zähler, die keiner verwechseln sollte

!!! info "Was du lernst"
    - Der Unterschied zwischen **Revision**, **Chart-Version** und **appVersion**
    - Dass `appVersion` reine Beschreibung ist und im Cluster nichts bewirkt
    - Wie du in `helm history` abliest, was sich wann geändert hat

#### Aufgabe

In diesem Chart gibt es drei Zahlen, die alle nach „Version“ aussehen und drei völlig verschiedene Dinge zählen:

| Zähler | Wo er steht | Was er zählt |
|--------|-------------|--------------|
| **Revision** | vergibt Helm | die wievielte Änderung an diesem Release |
| **Chart-Version** | `Chart.yaml`, `version` | den Stand des **Pakets** |
| **appVersion** | `Chart.yaml`, `appVersion` | den Stand der **Software** darin |

Und dann gibt es noch `.Values.version` – das ist **keine** davon, sondern nur die große Zahl auf der Seite.

Setz in `Chart.yaml` die `appVersion` auf `"2"` und rolle das aus. Beantworte danach: Was hat sich in `helm history` geändert? Was auf der Seite? Und was ist mit den Pods passiert?

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – Ausgangslage:**

    ```bash
    helm uninstall station --ignore-not-found
    helm install station ./webserver
    kubectl get pods -l app=station
    ```

    Das `uninstall` vorweg ist Absicht: Diese Übung soll bei **Revision 1** anfangen, damit die Zähler zu dem passen, was du hier siehst. Und `--ignore-not-found` sorgt dafür, dass der Befehl auch dann durchläuft, wenn gar kein `station` da ist – ohne das Flag bekommst du an der Stelle eine Fehlermeldung.

    Merk dir die Pod-Namen.

    **Schritt 2 – appVersion hochsetzen.** In `webserver/Chart.yaml`:

    ```yaml
    version: 0.1.0
    appVersion: "2"
    ```

    **Schritt 3 – ausrollen und nachsehen:**

    ```bash
    helm upgrade station ./webserver
    helm history station
    ```

    In der Spalte `APP VERSION` steht bei der neuen Revision jetzt `2`, bei der alten weiterhin `1`. Die Spalte `CHART` steht unverändert auf `webserver-0.1.0`, denn die Chart-Version hast du nicht angefasst. Und die Revision ist um eins gestiegen.

    **Schritt 4 – die Seite ansehen:**

    ```bash
    kubectl port-forward svc/station 8080:80
    ```

    Die Seite zeigt weiterhin groß **Version 1**. Kein Widerspruch: Die große Zahl kommt aus `.Values.version`, nicht aus `appVersion`.

    **Schritt 5 – und die Pods?**

    ```bash
    kubectl get pods -l app=station
    ```

    Dieselben Pods wie vorher, `RESTARTS` steht auf 0. Kein Wunder: `appVersion` kommt in keiner einzigen Vorlage vor. Das gerenderte Ergebnis ist Zeichen für Zeichen dasselbe geblieben – es gibt für Kubernetes schlicht nichts zu tun. Trotzdem hat Helm eine neue Revision angelegt, denn das Release hat sich geändert: Es benutzt jetzt ein anderes Chart.

    **Schritt 6 – Kür: den dritten Zähler bewegen.** Setz zusätzlich `version: 0.2.0` in `Chart.yaml` und rolle noch einmal aus. Jetzt wandert auch die Spalte `CHART` auf `webserver-0.2.0`. Damit hast du alle drei Zähler einmal einzeln bewegt.

    **Aufräumen:**

    ```bash
    git restore webserver/Chart.yaml
    ```

??? success "Erwartung"
    Du verwechselst die drei nicht mehr. **Revision** ist die Historie deines Releases (und das, was du beim `helm rollback` angibst). **Chart-Version** zählst du hoch, wenn du am Paket schraubst. **appVersion** dokumentiert, welche Software drinsteckt – sie ist ein Etikett, kein Schalter. Wer `helm rollback station 2` eingibt und dabei an eine App-Version denkt, holt sich die falsche Revision zurück.

---

## Wenn du alles durch hast

!!! success "Geschafft – und jetzt?"
    Wenn du bis hierhin gekommen bist, hast du das Chart auseinandergenommen, wieder zusammengebaut, zweimal absichtlich zerstört und ein fremdes Chart gelesen, ohne es zu installieren. Damit kennst du Helm nicht nur von der Bedienoberfläche, sondern von innen.

    Zwei Seiten lohnen sich jetzt noch:

    - **[Stolpersteine](09-stolpersteine.md)** – die typischen Fallen im Überblick, samt der Meldungen, an denen du sie erkennst. Wenn dir in den Übungen etwas um die Ohren geflogen ist, findest du hier die Einordnung dazu.
    - **[Rückblick & Abschluss](10-rueckblick.md)** – was du aus dem Block mitnimmst und wie es weitergeht.

    Und für den Alltag danach: das [Helm-Cheatsheet](../cheatsheets/helm.md) mit allen Befehlen dieses Blocks auf einer Seite.

!!! tip "Cluster aufräumen"
    Falls aus den Übungen noch Releases herumliegen:

    ```bash
    helm list -A
    ```

    Jedes davon entfernst du mit `helm uninstall <name>` – bei Releases in einem eigenen Namespace mit `-n <namespace>` dahinter. Und `git restore .` im Ordner `apps/kubernetes-helm` bringt das Chart zurück in den Auslieferungszustand.

---

## Weiter

- [Stolpersteine](09-stolpersteine.md) – die Fallen aus diesen Übungen zum Nachschlagen, wenn es hakt
- [Rückblick & Abschluss](10-rueckblick.md) – was du aus dem Helm-Block mitnimmst
