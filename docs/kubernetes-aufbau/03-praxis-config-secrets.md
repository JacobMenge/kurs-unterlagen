---
title: "Praxis: Config & Secrets"
description: "Angeleitete Übung: eine ConfigMap und ein Secret anlegen, sie dem Deployment per envFrom injizieren, die Werte im Pod und auf der Web-Seite wiederfinden, das Secret als bloßes base64 entlarven und eine Konfigurationsänderung per rollout restart ausrollen – mit eigener Aufgabe und Lösung."
---

# Praxis – ConfigMap & Secret

Jetzt schließt du die erste Lücke selbst: Du holst Konfiguration und ein Geheimnis **aus dem Image heraus** in eine **ConfigMap** und ein **Secret**, reichst beide dem Deployment hinein und siehst die Werte auf der Seite wieder. Zum Schluss änderst du eine Einstellung im laufenden Betrieb – ohne ein einziges Mal das Image anzufassen.

Damit du den Effekt siehst, zeigt unsere Demo-App diesmal eine Zeile mehr: unter der großen **Version** steht jetzt der **Standort** – ein Wert, der aus der ConfigMap kommt.

!!! info "Voraussetzung"
    Dein Cluster läuft (`kubectl get nodes` zeigt `Ready`) und die Projektdateien liegen lokal:

    ```bash
    git clone https://github.com/JacobMenge/kurs-unterlagen.git
    cd kurs-unterlagen/apps/kubernetes-aufbau
    ```

    Alle `kubectl apply`-Befehle gehen relativ von diesem Ordner aus (`manifests/...`).

!!! tip "Zeitrahmen"
    Rund **45 Minuten bis eine Stunde**: erst die angeleitete Übung, dann die Aufgabe zum Selbermachen. Halte am besten zwei Terminals bereit – eines bleibt später für den `port-forward`-Tunnel offen.

---

## Schritt für Schritt

### Schritt 1 – Das Manifest ansehen

Öffne `manifests/webserver-config.yaml`. Es enthält **drei** Objekte in einer Datei, durch `---` getrennt: eine **ConfigMap**, ein **Secret** und das **Deployment**, das beide nutzt. Der entscheidende neue Teil ist oben und in der Mitte:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: webserver-config
data:
  VERSION: "1"
  COLOR: "#2563a8"
  STANDORT: "Rechenzentrum Nord"     # dieser Wert erscheint gleich auf der Seite
---
apiVersion: v1
kind: Secret
metadata:
  name: webserver-secret
type: Opaque
stringData:
  APP_TOKEN: "s3hr-geheim-42"        # steht für ein Passwort / einen API-Schlüssel
---
# ... darunter das Deployment, das beide per envFrom einzieht:
#     envFrom:
#       - configMapRef: { name: webserver-config }
#       - secretRef:    { name: webserver-secret }
```

!!! note "Kurz erklärt: `stringData` vs. `data` im Secret"
    Wir schreiben das Token im Klartext unter `stringData` – das ist die bequeme Variante: Kubernetes kodiert den Wert beim Anlegen selbst nach base64. Schaust du das fertige Secret später an, steht dort unter `data` die kodierte Form. Beides beschreibt dasselbe Secret.

---

### Schritt 2 – Anlegen und ansehen

Wende die Datei an – alle drei Objekte auf einmal:

```bash
kubectl apply -f manifests/webserver-config.yaml
```

```text
configmap/webserver-config created
secret/webserver-secret created
deployment.apps/webserver created
```

Sieh dir an, was entstanden ist:

```bash
kubectl get configmap webserver-config
kubectl get secret webserver-secret
kubectl get pods -l app=webserver
```

```text
NAME               DATA   AGE
webserver-config   3      19s

NAME               TYPE     DATA   AGE
webserver-secret   Opaque   1      19s

NAME                        READY   STATUS    RESTARTS   AGE
webserver-78d767dc9-bp5wr   1/1     Running   0          20s
webserver-78d767dc9-h9rkc   1/1     Running   0          20s
```

Die ConfigMap hat `DATA 3` (drei Schlüssel), das Secret `DATA 1` (ein Schlüssel) und zwei Pods laufen.

---

### Schritt 3 – Die Werte im Pod wiederfinden

Schau direkt in einen laufenden Pod, welche Umgebungsvariablen dort angekommen sind:

```bash
kubectl exec deploy/webserver -- sh -c 'echo VERSION=$VERSION; echo STANDORT=$STANDORT; echo APP_TOKEN=$APP_TOKEN'
```

```text
VERSION=1
STANDORT=Rechenzentrum Nord
APP_TOKEN=s3hr-geheim-42
```

Alle drei sind da – die offenen Werte aus der ConfigMap **und** das Token aus dem Secret. Für den Container ist am Ende beides einfach eine Umgebungsvariable.

!!! note "Kurz erklärt: `kubectl exec deploy/webserver`"
    `kubectl exec` führt einen Befehl **im** Container aus. Gibst du ein Deployment an, sucht sich Kubernetes einen seiner Pods aus. Das `-- sh -c '…'` heißt: „starte darin eine Shell und lass sie diese Zeile ausführen". So schaust du dich im Container um, ohne ihn zu verändern.

---

### Schritt 4 – Die Seite im Browser

Mach das Deployment erreichbar. **Dieses Terminal bleibt offen**, solange der Tunnel steht:

```bash
kubectl port-forward deployment/webserver 8080:80
```

Öffne <http://localhost:8080>. Du siehst die blaue Seite – und darunter jetzt die neue Zeile mit dem **Standort** aus der ConfigMap:

```text
+-------------------------------------------+
|                                           |
|               Version 1                   |   (blauer Hintergrund)
|         Standort: Rechenzentrum Nord      |
|                                           |
|   Server name: webserver-78d767dc9-bp5wr  |
|                                           |
+-------------------------------------------+
```

Genau dieser Standort-Text kommt aus der ConfigMap – gleich änderst du ihn, ohne das Image anzufassen.

---

### Schritt 5 – Das Secret entlarven: base64, nicht verschlüsselt

Jetzt der ehrliche Blick. Lass dir den rohen Inhalt des Secrets zeigen (nutz dafür dein **zweites** Terminal, der Tunnel bleibt offen):

```bash
kubectl get secret webserver-secret -o jsonpath='{.data.APP_TOKEN}'
```

```text
czNoci1nZWhlaW0tNDI=
```

Sieht kryptisch aus – ist aber kein Schutz. Dekodiere es (nimm den Reiter für dein System):

=== "Windows (PowerShell)"
    ```powershell
    $b64 = kubectl get secret webserver-secret -o jsonpath='{.data.APP_TOKEN}'
    [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($b64))
    ```

=== "macOS / Linux"
    ```bash
    kubectl get secret webserver-secret -o jsonpath='{.data.APP_TOKEN}' | base64 -d
    ```

```text
s3hr-geheim-42
```

Das Passwort steht wieder im Klartext da. **Base64 ist keine Verschlüsselung**, nur eine Umschreibung. Das Secret ist trotzdem der richtige Ort für Geheimnisse (Kubernetes behandelt es strenger als eine ConfigMap) – aber „geheim" ist der Inhalt für jeden, der das Secret lesen darf, nicht.

!!! warning "Merksatz zum Mitnehmen"
    **Passwörter gehören ins Secret, nicht in die ConfigMap – aber base64 schützt sie nicht.** Wer im Cluster das Secret lesen darf, liest den Klartext. Echter Schutz kommt über Zugriffsrechte (RBAC) und Verschlüsselung, nicht über das Secret allein.

---

### Schritt 6 – Konfiguration ändern, ohne neues Image

Jetzt der eigentliche Gewinn: Du änderst den **Standort** im laufenden Betrieb. Öffne `manifests/webserver-config.yaml` und ändere in der ConfigMap eine Zeile:

```yaml
  STANDORT: "Rechenzentrum Süd"
```

Wende die Datei erneut an:

```bash
kubectl apply -f manifests/webserver-config.yaml
```

```text
configmap/webserver-config configured
secret/webserver-secret configured
deployment.apps/webserver unchanged
```

Beachte: Die ConfigMap ist `configured`, das Deployment aber `unchanged` – und genau deshalb zeigt die Seite **noch den alten Standort**. (Dass das `secret` als `configured` gemeldet wird, obwohl du es nicht angefasst hast, ist eine Eigenheit von `stringData`-Secrets – ohne Wirkung hier.) Die laufenden Pods haben ihre Variablen beim Start bekommen. Du musst sie neu ausrollen:

```bash
kubectl rollout restart deployment/webserver
kubectl rollout status deployment/webserver
```

```text
deployment.apps/webserver restarted
Waiting for deployment "webserver" rollout to finish: 1 out of 2 new replicas have been updated...
deployment "webserver" successfully rolled out
```

Der `port-forward` aus Schritt 4 hing an einem alten Pod und **reißt beim Austausch ab** (wie schon in Teil 1). Beende ihn in Terminal 1 mit **Ctrl+C** und starte ihn neu:

```bash
kubectl port-forward deployment/webserver 8080:80
```

Lade <http://localhost:8080> neu – die Seite zeigt jetzt **Standort: Rechenzentrum Süd**. Gleiches Image, gleiche App, neuer Wert. Prüfen kannst du es auch ohne Browser:

```bash
kubectl exec deploy/webserver -- sh -c 'echo STANDORT=$STANDORT'
```

```text
STANDORT=Rechenzentrum Süd
```

!!! note "Kurz erklärt: `apply` ändert, `rollout restart` rollt aus"
    Das ist das Muster aus der Theorie in Aktion: **Ändern** (die ConfigMap per `apply`) und **Ausrollen** (die Pods per `rollout restart`) sind zwei Schritte. So bestimmst **du**, wann eine neue Einstellung greift – ein Tippfehler in der ConfigMap tauscht nicht sofort von allein alle Pods durch.

---

## Übungsaufgabe – selbst konfigurieren

Jetzt du. Versuch es erst **ohne** zu spicken – die Lösung ist darunter.

#### Aufgabe

1. Ändere über die **ConfigMap** die Farbe auf **Grün** (`COLOR: "#2e9e5b"`) und setze einen neuen `STANDORT` deiner Wahl.
2. Rolle die Änderung aus, sodass die Seite grün wird und den neuen Standort zeigt.
3. **Kür:** Füge der ConfigMap einen **neuen Schlüssel** `LOGLEVEL: "debug"` hinzu und weise nach, dass er im Pod als Umgebungsvariable ankommt (`kubectl exec …`).

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – ConfigMap anpassen.** In `manifests/webserver-config.yaml` im `data`-Block:

    ```yaml
    data:
      VERSION: "1"
      COLOR: "#2e9e5b"                # Grün statt Blau
      STANDORT: "Außenstelle West"    # dein neuer Standort
      LOGLEVEL: "debug"               # neuer Schlüssel (für die Kür)
    ```

    **Schritt 2 – anwenden und ausrollen:**

    ```bash
    kubectl apply -f manifests/webserver-config.yaml
    kubectl rollout restart deployment/webserver
    kubectl rollout status deployment/webserver
    ```

    Tunnel in Terminal 1 neu starten (`Ctrl+C`, dann `kubectl port-forward deployment/webserver 8080:80`) und <http://localhost:8080> neu laden: **grüne** Seite mit deinem neuen Standort.

    **Schritt 3 (Kür) – neuen Schlüssel nachweisen:**

    ```bash
    kubectl exec deploy/webserver -- sh -c 'echo LOGLEVEL=$LOGLEVEL'
    ```

    ```text
    LOGLEVEL=debug
    ```

    Der neue Schlüssel ist über `envFrom` automatisch als Umgebungsvariable im Container gelandet – ganz ohne Änderung am Deployment.

??? success "Erwartung"
    Du hast die Farbe und den Standort über die ConfigMap geändert und ausgerollt, ohne das Image oder das Deployment anzufassen – und du hast einen neuen Schlüssel hinzugefügt, der automatisch im Pod ankommt. Damit beherrschst du den Kern: **Konfiguration lebt außerhalb des Images** – und mit `apply` + `rollout restart` bringst du Änderungen kontrolliert in den Betrieb.

---

## Aufräumen oder weiterlaufen lassen

Für die nächste Praxis brauchst du diese Objekte nicht mehr – die nächste Seite bringt ihr eigenes Manifest mit, das das Deployment ersetzt. Du kannst also aufräumen:

```bash
kubectl delete -f manifests/webserver-config.yaml
```

Oder du lässt alles laufen und machst direkt weiter – das Anwenden des nächsten Manifests überschreibt das Deployment ohnehin sauber.

!!! tip "Forwarding beenden, Cluster behalten"
    Das `port-forward`-Terminal kannst du mit **Ctrl+C** schließen – das beendet nur den Tunnel, nicht die Pods.

---

## Wenn etwas hakt

Seite zeigt den alten Wert? Pod startet nicht? Die abgestuften Hinweise stehen in den [Hilfekarten](08-hilfekarten.md) – besonders [Hilfekarte 1](08-hilfekarten.md#hilfekarte-1-configmap-geandert-aber-die-seite-zeigt-den-alten-wert) (Änderung greift nicht) und [Hilfekarte 2](08-hilfekarten.md#hilfekarte-2-pod-startet-nicht-configmaps-secrets).

---

## Weiter

- [Probes & Limits](04-probes-und-limits.md) – die nächsten zwei Lücken: Gesundheitschecks und Ressourcengrenzen
