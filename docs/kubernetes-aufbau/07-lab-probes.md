---
title: "Lab: Probes & Ingress (Pluralsight)"
description: "Deutscher Begleiter zum geführten Lab „Services, Networking & Probes for CKAD“: auf einer gestellten Umgebung eine App per Service erreichbar machen, readiness- und liveness-Probes einbauen und eine kaputte Probe beobachten, dazu als Ausblick ein Ingress für Routing von außen – Schritt für Schritt."
---

# Lab: Probes & Ingress (Pluralsight)

!!! quote "Der Kerngedanke"
    Das hier ist die **Praxis zu [Probes & Limits](04-probes-und-limits.md)** als geführtes Lab – auf einer fertig gestellten Umgebung, ohne eigene Installation. Kern ist wieder: Kubernetes selbst prüfen lassen, ob deine App **bereit** und **gesund** ist. Dazu gibt es zwei Zugaben, die genau dein Teil-2-Ausblick sind: einen **Service** davor (Wiederholung aus Teil 1) und ein **Ingress** für sauberes Routing von außen.

## Worum es geht

Du schlüpfst in die Rolle einer DevOps-Ingenieurin bei der Firma „CarvedRock" und machst eine Web-App **hochverfügbar und überwacht**. Drei Aufgaben, die aufeinander aufbauen:

1. **Services** (ClusterIP und NodePort) – die App erreichbar machen. Das ist **Wiederholung** aus dem lokalen Kubernetes-Teil 1.
2. **Probes** (readiness und liveness) – der **Teil-2-Kern**: Gesundheitschecks einbauen und eine kaputte Probe live beobachten.
3. **Ingress** – sauberes Routing von außen unter einem Pfad. Das ist der **Ausblick** aus deinem Teil-2-Rückblick, hier zum Anfassen.

<figure>
<svg viewBox="0 0 660 210" width="100%" height="210" role="img" aria-label="Von aussen fuehrt ein Ingress unter dem Pfad /web auf einen Service, der auf einen httpd-Pod mit readiness- und liveness-Probe zeigt">
  <circle cx="46" cy="105" r="26" fill="rgba(122,162,255,0.12)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="46" y="102" text-anchor="middle" fill="#7aa2ff" font-size="11">außen</text>
  <text x="46" y="118" text-anchor="middle" fill="#8fa498" font-size="9">curl /web</text>

  <path d="M76 105 L120 105" fill="none" stroke="#7aa2ff" stroke-width="2" marker-end="url(#pa)"/>

  <rect x="122" y="80" width="120" height="50" rx="7" fill="rgba(224,160,90,0.12)" stroke="#e0a05a" stroke-width="2"/>
  <text x="182" y="101" text-anchor="middle" fill="#e0a05a" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold">Ingress</text>
  <text x="182" y="118" text-anchor="middle" fill="#8fa498" font-size="10">Pfad /web</text>

  <path d="M244 105 L288 105" fill="none" stroke="#7aa2ff" stroke-width="2" marker-end="url(#pa)"/>

  <rect x="290" y="80" width="120" height="50" rx="7" fill="rgba(122,162,255,0.10)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="350" y="101" text-anchor="middle" fill="#7aa2ff" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold">Service</text>
  <text x="350" y="118" text-anchor="middle" fill="#8fa498" font-size="10">web-svc</text>

  <path d="M412 105 L456 105" fill="none" stroke="#56c374" stroke-width="2" marker-end="url(#pg)"/>

  <rect x="458" y="66" width="170" height="80" rx="8" fill="rgba(46,158,91,0.10)" stroke="#2e9e5b" stroke-width="2"/>
  <text x="543" y="90" text-anchor="middle" fill="#c9d4e3" font-size="12">httpd-Pod</text>
  <text x="543" y="112" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="10">readiness</text>
  <text x="543" y="128" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="10">liveness</text>

  <text x="330" y="176" text-anchor="middle" fill="#8fa498" font-size="12">Von außen über Ingress und Service zum Pod – nur wenn readiness „grün" ist, kommt Verkehr an.</text>
  <defs>
    <marker id="pa" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#7aa2ff"/></marker>
    <marker id="pg" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#56c374"/></marker>
  </defs>
</svg>
<figcaption>Das Ziel: Eine Anfrage von außen läuft über das Ingress (Pfad /web) auf den Service und von dort auf den Pod – dessen readiness- und liveness-Probe entscheiden, ob und wie lange er Verkehr bekommt.</figcaption>
</figure>

!!! note "Angenehm: dieses Lab bringt den Cluster fertig mit"
    Anders als das [Config-Lab](06-lab-config-secrets.md) baust du hier **keinen** Cluster von Hand. Ein Skript startet dir ein fertiges **minikube** samt Ingress-Controller. Du bist also schnell beim eigentlichen Thema.

---

## Los geht's – so startest du das Lab

1. **Lab öffnen** (eingeloggt sein): **[Services, Networking & Probes for CKAD](https://app.pluralsight.com/hands-on/labs/2d0764e0-681b-439a-b755-dbee73d1458b)**. Alternativ: Menü oben links → **Hands-on** → Reiter **Hands-on Labs** → Titel suchen.
2. **Start Lab** klicken. Rechts erscheinen die **Lab Credentials** (Public IP und Password).
3. **Instant Terminal** öffnen und auf die Maschine verbinden:

    ```bash
    ssh cloud_user@<PUBLIC_IP>
    ```

    Mit `y` bestätigen, dann das **Password** einfügen (**Strg+Umschalt+V**).
4. Das mitgelieferte Setup starten – es startet minikube und den NGINX-Ingress-Controller (**dauert vier bis sieben Minuten**):

    ```bash
    ./setup.sh
    kubectl get nodes
    ```

    Erwartet: ein Knoten `minikube` im Status `Ready`.

!!! tip "Englischer Guide, deutsch lesen"
    Die Lab-Anleitung ist auf Englisch. Diese Seite begleitet dich auf Deutsch. Den Original-Guide kannst du im Browser übersetzen lassen: **Rechtsklick → „Auf Deutsch übersetzen"**. Alle Befehle tippst du im **Linux-Terminal** des Labs – `grep`, `awk` und Co. sind dort normale Bordmittel.

---

## Aufgabe 1: Service anlegen (Wiederholung)

Das kennst du aus Teil 1 – hier schnell wiederholt. Leg eine kleine Web-App an (Apache/`httpd`) und stell einen **ClusterIP**-Service davor:

```bash
kubectl create deployment web-deploy --image=httpd --port=80
kubectl expose deployment web-deploy --name=web-svc --port=80 --target-port=80 --type=ClusterIP
kubectl get services
```

Teste den Service cluster-intern über einen Tunnel:

```bash
kubectl port-forward svc/web-svc 8080:80 &
curl localhost:8080
```

Es kommt die Apache-Standardseite (HTML) zurück – der Service funktioniert. Beende den Tunnel wieder:

```bash
kill %1
```

Jetzt ein **NodePort**-Service, der die App über einen festen Port von außen erreichbar macht:

```bash
kubectl create service nodeport web-node --tcp=80:80 --node-port=30036
kubectl patch service web-node -p '{"spec":{"selector":{"app":"web-deploy"}}}'
```

Kontrolliere kurz, dass der NodePort und der Selektor stimmen, dann ruf die App ab:

```bash
kubectl get service web-node -o yaml     # nodePort 30036? selector app=web-deploy?
curl $(minikube ip):30036
```

Wieder die Apache-Seite – diesmal über den NodePort.

!!! note "Kurz erklärt: ClusterIP vs. NodePort"
    Ein **ClusterIP**-Service ist nur **innerhalb** des Clusters erreichbar, ein **NodePort** öffnet zusätzlich einen festen Port **am Knoten** für den Zugriff von außen. Das `kubectl patch` korrigiert hier den Selektor, damit der NodePort-Service wirklich auf die Pods von `web-deploy` zeigt. Beide Service-Typen kennst du aus [Teil 1](../kubernetes-praxis/07-services-netzwerk.md).

---

## Aufgabe 2: Readiness- und Liveness-Probes

Jetzt der Teil-2-Kern. Schau zuerst nach – das Deployment hat **noch keine** Probes:

```bash
kubectl get deployment web-deploy -o yaml | grep -A 5 containers:
```

Füge eine **readiness-Probe** hinzu (sie prüft per HTTP, ob der Pod bereit ist):

```bash
kubectl patch deployment web-deploy --type=json -p='[{"op": "add", "path": "/spec/template/spec/containers/0/readinessProbe", "value": {"httpGet": {"path": "/", "port": 80}, "initialDelaySeconds": 5, "periodSeconds": 5}}]'
kubectl describe deployment web-deploy | grep -A4 Readiness
```

Dann eine **liveness-Probe** (sie startet den Container neu, wenn er hängt):

```bash
kubectl patch deployment web-deploy --type=json -p='[{"op": "add", "path": "/spec/template/spec/containers/0/livenessProbe", "value": {"httpGet": {"path": "/", "port": 80}, "initialDelaySeconds": 5, "periodSeconds": 3}}]'
kubectl describe deployment web-deploy | grep -A4 Liveness
```

Beide Probes sind gesund (Pfad `/` antwortet), die Pods laufen also ruhig weiter. Wenn du magst, schau ihnen kurz zu und beende die Beobachtung dann mit **Strg+C**:

```bash
kubectl get pods -w
```

!!! note "Kurz erklärt: `kubectl patch` statt Datei-Bearbeiten"
    Im Lab werden die Probes mit `kubectl patch --type=json` nachträglich ins Deployment „hineinoperiert" – das ist derselbe Effekt wie in [Praxis: Probes & Limits](05-praxis-probes-limits.md), wo du sie im YAML einträgst und neu anwendest. Der `path` zeigt auf den ersten Container (`containers/0`), `value` ist die Probe. Beide Wege beschreiben denselben Soll-Zustand.

### Die kaputte Probe live sehen

Das ist der Aha-Moment aus Teil 2, hier im Lab. Leg absichtlich ein Deployment mit einer **fehlschlagenden** readiness-Probe an (Pfad, den es nicht gibt):

```bash
kubectl create deployment probe-test --image=httpd
kubectl patch deployment probe-test --type=json -p='[{"op": "add", "path": "/spec/template/spec/containers/0/readinessProbe", "value": {"httpGet": {"path": "/nonexistent-path", "port": 80}, "initialDelaySeconds": 5, "periodSeconds": 5}}]'
kubectl get pods | grep probe-test
```

Der Pod ist `Running`, steht aber auf **`0/1`** – **läuft, ist aber nicht bereit**, weil die readiness-Probe scheitert. Genau wie in Teil 2. Der Beleg steht in den Events:

```bash
kubectl describe pod $(kubectl get pods | grep probe-test | awk '{print $1}')
```

Weiter oben in der Ausgabe findest du ein Event **`Readiness probe failed`**. Räum das Test-Deployment wieder weg:

```bash
kubectl delete deployment probe-test
```

!!! note "Kurz erklärt: `0/1` heißt „läuft, aber nicht bereit""
    Dasselbe Bild wie auf deinem minikube: readiness scheitert → der Pod bleibt aus dem Verkehr (`0/1`), wird aber **nicht** neu gestartet. Erst wenn er bereit meldet, bekommt er Anfragen. Eine scheiternde **liveness**-Probe hätte den Container dagegen neu gestartet (RESTARTS steigt).

---

## Aufgabe 3 (Ausblick): Ingress für Routing von außen

Das ist genau der Teil-2-Ausblick zum Anfassen. Prüfe, dass der Ingress-Controller läuft (das `setup.sh` hat ihn gestartet):

```bash
kubectl get pods -n ingress-nginx
```

Leg ein **Ingress** an, das Anfragen unter dem Pfad `/web` auf deinen Service leitet:

```bash
kubectl create ingress web-ingress --class=nginx --rule="/web=web-svc:80"
kubectl annotate ingress web-ingress nginx.ingress.kubernetes.io/rewrite-target=/
kubectl describe ingress web-ingress
```

Teste das Routing über einen Tunnel auf den Ingress-Controller:

```bash
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80 &
curl localhost:8080/web
```

Es kommt wieder die Apache-Seite – aber diesmal über den **Pfad `/web`**, geroutet vom Ingress. Beende den Tunnel:

```bash
kill %1
```

!!! note "Kurz erklärt: wozu ein Ingress?"
    Bisher brauchtest du für jeden Dienst ein eigenes `port-forward` oder einen eigenen NodePort. Ein **Ingress** ist die zentrale Eingangstür: Es nimmt Anfragen von außen an und verteilt sie **nach Pfad** (`/web`, `/api`, …) auf die passenden Services. Die `rewrite-target`-Annotation sorgt dafür, dass aus `/web` beim Dienst wieder `/` wird. Genau dieser Baustein stand in deinem [Rückblick](09-rueckblick.md) als nächster Schritt – jetzt hast du ihn einmal selbst gebaut.

---

## Worauf du achten musst

!!! warning "Die häufigsten Stolpersteine"
    - **`./setup.sh` braucht ein paar Minuten.** Warte, bis `kubectl get nodes` den Knoten `minikube` als `Ready` zeigt, bevor du weitermachst.
    - **Der `&` am Ende von `port-forward`** schickt den Tunnel in den Hintergrund; danach einmal **Enter** drücken, um wieder einen Prompt zu bekommen. Beenden mit `kill %1`.
    - **Die langen `patch`-Befehle** am besten komplett kopieren und einfügen (**Strg+Umschalt+V**) – ein fehlendes Anführungszeichen im JSON lässt den Befehl fehlschlagen.
    - **Pod-Namen** holst du dir mit `kubectl get pods`; das Lab setzt sie mit `$(… awk …)` automatisch ein.

!!! note "Das kennst du aus Teil 2"
    Aufgabe 2 (readiness und liveness, die kaputte Probe mit `0/1`) ist **genau** dein Stoff aus [Probes & Limits](04-probes-und-limits.md) und [Praxis: Probes & Limits](05-praxis-probes-limits.md) – nur mit `kubectl patch` statt YAML-Datei. Aufgabe 1 (Services) ist Wiederholung aus Teil 1, Aufgabe 3 (Ingress) der Ausblick nach vorn.

---

## Aufräumen

Nichts zu tun: Der Lab-Timer baut die Umgebung am Ende **automatisch** ab, ohne Kosten. Zum vorzeitigen Beenden oben **End Lab → Quit Lab**.

!!! note "Fehlerseite am Ende – normal"
    Nach dem Beenden wird die Umgebung sofort abgebaut; ein offener Terminal-Tab zeigt dann eine **Fehlerseite**. Das heißt nur, dass sauber aufgeräumt wurde. Schließ den Tab einfach.

---

## Weiter

- [Hilfekarten](08-hilfekarten.md) – wenn bei den lokalen Übungen etwas hakt.
- [Rückblick & Ausblick](09-rueckblick.md) – was du aus dem ganzen Aufbau-Block mitnimmst und wie es weitergeht.
