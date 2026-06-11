---
title: "Praxis 2: Deployment"
description: "Angeleitete Übung: ein Deployment anlegen, live skalieren, einen Pod-Ausfall heilen lassen, eine neue Version per Rolling Update ausrollen und wieder zurückrollen – Schritt für Schritt mit eigener Aufgabe und Lösung."
---

# Praxis 2 – Deployment, Skalierung, Selbstheilung, Rolling Update

In [Praxis 1](04-praxis-hello-world.md) hast du einen einzelnen Pod gestartet – und gesehen, dass er **nicht** zurückkommt, wenn du ihn löschst. Jetzt machst du es richtig: Du legst ein **Deployment** an. Damit beschreibst du nur noch den **Soll-Zustand** („halte mir so viele Kopien am Laufen") – um den Rest kümmert sich Kubernetes. Du wirst gleich live sehen, wie ein gelöschter Pod von selbst ersetzt wird, wie aus drei Kopien fünf werden und wie du eine neue Version ohne Ausfall ausrollst.

!!! info "Voraussetzung"
    Dein Cluster läuft (siehe [Installation](03-installation.md)). Schneller Check:

    ```bash
    kubectl get nodes
    ```

    Erwartet: ein Node mit Status `Ready`. Außerdem brauchst du die Projektdateien lokal:

    ```bash
    git clone https://github.com/JacobMenge/kurs-unterlagen.git
    cd kurs-unterlagen/apps/kubernetes-praxis
    ```

    Alle `kubectl apply`-Befehle gehen relativ von diesem Ordner aus (`manifests/...`).

!!! tip "Zeitrahmen"
    Plane rund **60–90 Minuten** ein: erst die angeleitete Übung Schritt für Schritt, dann die Aufgabe zum Selbermachen. Lass dir Zeit beim Beobachten – das Zusehen *ist* der Lerneffekt.

---

## Schritt für Schritt

Arbeite das **allein oder zu zweit** durch. Jeder Schritt schließt mit einer kurzen Einordnung, damit du nicht nur tippst, sondern verstehst, was passiert.

### Schritt 1 – Das Deployment anlegen

Schau dir zuerst das Manifest an. Es ist dieselbe Datei, die im Projekt liegt – und du erkennst die vier Felder aus [Deployments & Skalierung](05-deployments-skalierung.md) wieder: `apiVersion`, `kind`, `metadata`, `spec`.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello
  labels:
    app: hello
spec:
  replicas: 3                 # gewünschte Anzahl gleicher Pods
  selector:
    matchLabels:
      app: hello              # dieses Deployment verwaltet Pods mit diesem Label
  template:                   # die Vorlage, nach der jeder Pod gebaut wird
    metadata:
      labels:
        app: hello            # jeder erzeugte Pod bekommt dieses Label
    spec:
      containers:
        - name: hello
          image: nginxdemos/hello:latest   # zeigt den Pod-Namen an
          ports:
            - containerPort: 80
```

Die wichtigsten Zeilen: `replicas: 3` ist dein **Soll** – drei Kopien. Der `selector` und die Labels in der `template` müssen zusammenpassen – so weiß das Deployment, **welche** Pods zu ihm gehören. Jetzt anwenden:

```bash
kubectl apply -f manifests/hello-deployment.yaml
```

Erwartete Ausgabe:

```text
deployment.apps/hello created
```

!!! note "Kurz erklärt: was `apply` tut"
    `kubectl apply` schickt den **Soll-Zustand** aus der Datei an den Cluster: „So soll es aussehen." Kubernetes vergleicht das mit dem Ist-Zustand und legt los – hier erzeugt es ein Deployment, dieses ein ReplicaSet und das wiederum drei Pods. Dasselbe `apply` nutzt du auch zum **Ändern**: Datei anpassen, erneut `apply` – Kubernetes gleicht den Unterschied an, statt alles neu zu bauen.

---

### Schritt 2 – Den Baum ansehen: Deployment, ReplicaSet, Pods

Lass dir die drei Ebenen auf einmal zeigen:

```bash
kubectl get deploy,rs,pods
```

Du siehst genau einen Strang: **ein** Deployment, **ein** ReplicaSet, **drei** Pods.

```text
NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/hello   3/3     3            3           20s

NAME                               DESIRED   CURRENT   READY   AGE
replicaset.apps/hello-7d9c8f5b6c   3         3         3       20s

NAME                          READY   STATUS    RESTARTS   AGE
pod/hello-7d9c8f5b6c-2xk4p    1/1     Running   0          20s
pod/hello-7d9c8f5b6c-9fghd    1/1     Running   0          20s
pod/hello-7d9c8f5b6c-q7m2t    1/1     Running   0          20s
```

`READY 3/3` heißt: alle drei Pods laufen. Achte auf die **Pod-Namen** – sie beginnen mit `hello-`, dann folgt eine zufällige Kennung. Genau diesen Namen zeigt dir das Web-Image gleich an.

!!! note "Kurz erklärt: die drei Ebenen"
    - **Deployment** – dein Soll-Zustand plus die Logik fürs Updaten.
    - **ReplicaSet** – das Rädchen darunter, das die Zahl hält („genau 3 Stück").
    - **Pods** – die laufenden Kopien deiner App.

    Du bedienst fast immer nur das **Deployment**. ReplicaSet und Pods entstehen daraus von selbst – darum musst du dich nicht kümmern.

---

### Schritt 3 – Skalieren: aus drei mach fünf (und zurück)

Jetzt änderst du die Soll-Zahl – ganz ohne die Datei anzufassen:

```bash
kubectl scale deployment hello --replicas=5
```

Beobachte live, wie zwei neue Pods entstehen:

```bash
kubectl get pods -w
```

Das `-w` (für *watch*) hält die Anzeige offen und aktualisiert sie laufend. Du siehst die neuen Pods von `Pending` über `ContainerCreating` zu `Running` wandern. Wenn alle fünf `Running` sind, beendest du das Zusehen mit **Ctrl+C**.

Dann wieder herunter auf zwei:

```bash
kubectl scale deployment hello --replicas=2
```

Mit `kubectl get pods` siehst du: Kubernetes hat drei Pods beendet, zwei bleiben übrig.

!!! note "Kurz erklärt: Skalieren heißt eine Zahl ändern"
    Skalieren ist in Kubernetes kein Aufwand: Du sagst nur die neue **Soll-Zahl**, den Rest macht das System. Hoch- wie Herunterskalieren – immer dieselbe Bewegung. Genau das nimmt dir Kubernetes ab, was du sonst von Hand mit zehn `docker run`-Befehlen machen müsstest.

---

### Schritt 4 – Selbstheilung: einen Pod „abschießen"

Das ist der Moment, auf den du in Praxis 1 gewartet hast. Lass dir erst die Pods anzeigen und **merke dir einen Namen**:

```bash
kubectl get pods
```

```text
NAME                      READY   STATUS    RESTARTS   AGE
hello-7d9c8f5b6c-2xk4p    1/1     Running   0          5m
hello-7d9c8f5b6c-9fghd    1/1     Running   0          5m
```

Jetzt lösch einen davon (setz deinen echten Namen ein):

```bash
kubectl delete pod hello-7d9c8f5b6c-2xk4p
```

Und sofort wieder nachsehen:

```bash
kubectl get pods
```

Du siehst: Der gelöschte Pod ist weg – aber ein **neuer** mit anderem Namen ist schon da (vielleicht kurz noch `ContainerCreating`). Die Soll-Zahl 2 wird sofort wieder erreicht. Beim **einzelnen Pod** aus Praxis 1 wäre an dieser Stelle nichts nachgekommen – der Unterschied liegt am Deployment.

!!! note "Kurz erklärt: der Regelkreis in Aktion"
    Das ist die **Selbstheilung** aus der Theorie, live. Das ReplicaSet vergleicht laufend Soll (2) mit Ist. Durch das Löschen war das Ist kurz 1 – also fehlte einer. Kubernetes hat den Unterschied bemerkt und sofort Ersatz gestartet. Niemand musste eingreifen. Genau dafür baut man Deployments statt einzelner Pods.

---

### Schritt 5 – Die App im Browser öffnen

Damit du etwas siehst, machst du das Deployment über `port-forward` erreichbar:

```bash
kubectl port-forward deployment/hello 8080:80
```

Das Terminal bleibt jetzt offen („Forwarding from 127.0.0.1:8080 -> 80"). Öffne im Browser:

> **<http://localhost:8080>**

Du siehst die nginx-Hello-Seite mit einer Zeile **„Server name: hello-…"** – das ist der Name des Pods, der gerade antwortet. Zum Beenden des Forwardings später **Ctrl+C** drücken (oder das Terminal offen lassen und ein zweites öffnen).

!!! note "Kurz erklärt: port-forward auf ein Deployment"
    `port-forward` baut einen direkten Tunnel von deinem Rechner (Port 8080) zu einem Pod (Port 80). Gibst du ein **Deployment** an, sucht sich Kubernetes **einen** seiner Pods aus und verbindet dorthin. Du siehst deshalb immer **denselben** Pod-Namen – das echte Verteilen auf mehrere Pods kommt erst in [Praxis 3](08-praxis-service.md) mit dem Service. `port-forward` funktioniert überall gleich (minikube wie Docker Desktop) – darum nutzen wir es durchgehend.

---

### Schritt 6 – Rolling Update: eine neue Version ausrollen

Lass das `port-forward`-Terminal aus Schritt 5 offen und öffne ein **zweites** Terminal (im selben Projektordner). Dort rollst du eine neue Image-Variante aus:

```bash
kubectl set image deployment/hello hello=nginxdemos/hello:plain-text
```

Der Container im Deployment heißt `hello` – darum `hello=...`. Beobachte den Austausch:

```bash
kubectl rollout status deployment/hello
```

Du siehst Zeilen wie „Waiting for deployment … 1 out of 2 new replicas have been updated", bis am Ende steht:

```text
deployment "hello" successfully rolled out
```

Jetzt **lade <http://localhost:8080> neu**: Statt der bunten HTML-Seite kommt nun reiner **Klartext** zurück (`Server name: hello-…`). Die Änderung ist sichtbar – ohne dass der Dienst je weg war. Zum Schluss die Historie ansehen:

```bash
kubectl rollout history deployment/hello
```

```text
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

!!! note "Kurz erklärt: wellenweiser Tausch ohne Ausfall"
    Beim Rolling Update legt das Deployment ein **neues ReplicaSet** mit der neuen Version an und tauscht dann **Pod für Pod**: einen neuen hochfahren, einen alten beenden – so lange, bis alle erneuert sind. Weil dabei immer genug Pods laufen, gibt es **keine Ausfallzeit**. Jede Version bekommt eine **Revision**-Nummer – die brauchst du gleich fürs Zurückrollen.

!!! warning "Ehrlich eingeordnet"
    Wir wechseln hier nur die **Variante** desselben Images (`:latest` → `:plain-text`), damit die Änderung sofort sichtbar ist. Im echten Leben wäre das eine neue **Versionsnummer** deiner eigenen App (z.B. `meineapp:1.4` → `meineapp:1.5`). Der Mechanismus ist exakt derselbe – nur die sichtbare Änderung ist hier didaktisch gewählt.

---

### Schritt 7 – Rollback: zurück zur vorigen Version

Angenommen, die neue Version macht Ärger – dann willst du **sofort** zurück. Genau dafür gibt es `rollout undo`:

```bash
kubectl rollout undo deployment/hello
kubectl rollout status deployment/hello
```

**Lade <http://localhost:8080> noch einmal neu**: Du bekommst wieder die bunte **HTML-Seite**. Der Rollback lief genauso unterbrechungsfrei wie das Update.

!!! note "Kurz erklärt: undo nutzt das alte ReplicaSet"
    `rollout undo` erfindet nichts Neues: Das alte ReplicaSet der vorigen Version war noch da (nur auf 0 Pods heruntergefahren). Kubernetes fährt es einfach wieder hoch und das neue herunter – wieder Pod für Pod. Deshalb ist ein Rollback schnell und sicher. Mit `--to-revision=N` kannst du auch gezielt zu einer bestimmten älteren Revision springen – das probierst du in der Aufgabe.

---

## Übungsaufgabe – selbst skalieren und ausrollen

Jetzt du. Versuch es erst **ohne** zu spicken – die Lösung ist darunter.

#### Aufgabe

1. Skaliere das Deployment auf **4** Replicas.
2. Rolle einen Rolling Update zurück auf die HTML-Variante `nginxdemos/hello:latest` aus (falls dein Deployment gerade auf `:plain-text` steht).
3. Sieh dir mit `kubectl rollout history` die **Revisionen** an.
4. Spring gezielt auf eine **frühere Revision** zurück (`--to-revision=N`) und prüfe im Browser, dass sich die Ausgabe entsprechend ändert.

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – auf 4 skalieren:**

    ```bash
    kubectl scale deployment hello --replicas=4
    kubectl get pods
    ```

    Erwartet: vier Pods mit Status `Running`.

    **Schritt 2 – auf die HTML-Variante ausrollen:**

    ```bash
    kubectl set image deployment/hello hello=nginxdemos/hello:latest
    kubectl rollout status deployment/hello
    ```

    Bei offenem `port-forward` (`kubectl port-forward deployment/hello 8080:80`) zeigt <http://localhost:8080> nach dem Neuladen wieder die bunte HTML-Seite.

    **Schritt 3 – Revisionen ansehen:**

    ```bash
    kubectl rollout history deployment/hello
    ```

    Du siehst eine Liste mit `REVISION`-Nummern. Jede Image-Änderung hat eine neue Zeile erzeugt. Merke dir die Nummer der Revision, zu der du zurück willst (z.B. die mit der `:plain-text`-Variante).

    **Schritt 4 – gezielt zurückspringen** (setz für `N` deine Wunsch-Revision ein):

    ```bash
    kubectl rollout undo deployment/hello --to-revision=2
    kubectl rollout status deployment/hello
    ```

    Lade <http://localhost:8080> neu – die Ausgabe entspricht jetzt der gewählten Revision (z.B. wieder Klartext, wenn Revision 2 die `:plain-text`-Variante war).

    !!! tip "Welche Revision war was?"
        `kubectl rollout history deployment/hello --revision=2` zeigt die Details einer einzelnen Revision, inklusive des damals verwendeten Images. So findest du sicher die richtige Nummer.

??? success "Erwartung"
    Du hast auf 4 Pods skaliert, zweimal eine andere Image-Variante ausgerollt und konntest an der Browser-Ausgabe ablesen, welche Version gerade läuft. Über `rollout history` und `--to-revision` springst du gezielt zwischen Versionen hin und her – ohne Ausfall. Damit beherrschst du den kompletten Lebenszyklus eines Deployments: anlegen, skalieren, heilen, updaten, zurückrollen.

---

## Lass es laufen

**Lösche das Deployment jetzt noch nicht.** In [Praxis 3](08-praxis-service.md) bauen wir einen **Service** davor – eine stabile Adresse, die die Last auf alle Pods verteilt. Dafür sollen die Pods weiterlaufen.

Falls du eine Pause machst und alles trotzdem abgeräumt hast: kein Problem, du legst das Deployment mit demselben Befehl wie in Schritt 1 wieder an.

```bash
kubectl apply -f manifests/hello-deployment.yaml
```

!!! tip "Forwarding beenden, Cluster behalten"
    Das `port-forward`-Terminal kannst du gefahrlos mit **Ctrl+C** schließen – das beendet nur den Tunnel, nicht die Pods. Der Cluster und dein Deployment laufen weiter.

---

## Wenn etwas hakt

Bleibt ein Pod in `Pending` oder `ContainerCreating` hängen, läuft `port-forward` ins Leere oder zeigt `kubectl` ins Leere? Die abgestuften Hinweise stehen in den [Hilfekarten](09-hilfekarten.md) – besonders [Hilfekarte 3](09-hilfekarten.md#hilfekarte-3-pod-hangt-in-pending-oder-containercreating) (Pod hängt) und [Hilfekarte 6](09-hilfekarten.md#hilfekarte-6-port-forward-klappt-nicht) (port-forward).

---

## Weiter

- [Services & Netzwerk](07-services-netzwerk.md) – warum Pods eine stabile Adresse davor brauchen und wie sich die Last verteilt
