---
title: "Optional: Dasselbe auf Google mit GKE"
description: "Optionale Zusatzaufgabe: dieselbe Idee wie beim EKS-Lab, nur auf Google Kubernetes Engine (GKE) – Cluster anlegen, App ausrollen, über einen Load-Balancer öffentlich erreichbar machen und skalieren. Etwas einfacher als der AWS-Weg, deutsch begleitet."
---

# Optional: Dasselbe auf Google mit GKE

!!! abstract "Für wen ist diese Seite?"
    Das hier ist eine **optionale Zusatzaufgabe** – für alle, die mit dem [EKS-Lab](12-praxis-eks.md) schnell durch sind oder sehen wollen, wie **derselbe Gedanke bei Google** aussieht. Es ist dasselbe Prinzip (managed Kubernetes, App, Load-Balancer, skalieren), nur ein Stück **einfacher** als der AWS-Weg. Kein Muss.

Du legst einen echten **GKE-Cluster** (Google Kubernetes Engine) an, rollst eine App darauf aus, machst sie über einen Load-Balancer öffentlich erreichbar und skalierst sie. Die Befehle kennst du im Kern schon.

---

## Los geht's – so startest du das GKE-Lab

Die Lab-Anleitung ist auf **Englisch** – unten steht alles noch einmal auf Deutsch. Arbeite die Schritte der Reihe nach ab:

1. **Lab öffnen:** Am einfachsten direkt über diesen Link (eingeloggt sein): **[Deploying and Scaling Applications on GKE](https://app.pluralsight.com/hands-on/labs/00b5ff89-3931-4d59-9f33-ae5d53f00dec)**. Alternativ: Menü oben links → **Hands-on** → Reiter **Hands-on Labs** → Titel suchen.
2. **Starten:** Auf **Start Lab** klicken. Die Umgebung ist praktisch sofort da. Rechts erscheinen die **Lab Credentials** – die brauchst du gleich.
3. **Terminal öffnen:** Unter **Lab Tools** auf **Instant Terminal** klicken (öffnet sich in einem neuen Tab).

!!! warning "Der fummeligste Teil: die Anmeldung – hier langsam vorgehen"
    Bis zum Cluster meldest du dich **zweimal** an. Nimm dir dafür kurz Zeit:

    1. **Auf die Lab-VM verbinden.** Im Instant Terminal tippst du (die **Public IP** und das **Passwort** stehen rechts unter Lab Credentials bei **my-vm**):
       ```bash
       ssh cloud_user@<PUBLIC_IP>
       ```
       Frage nach dem Fingerprint mit `yes` bestätigen, dann das Passwort einfügen (im Terminal mit **Strg+Umschalt+V**).
    2. **Google-Anmeldung.** Auf der VM:
       ```bash
       gcloud auth login
       ```
       Das gibt eine **lange URL** aus. Kopiere sie in einen Browser, melde dich mit dem **Google Labs Account** an (Zugangsdaten ebenfalls rechts unter Lab Credentials), bestätige, und **kopiere den angezeigten Code zurück ins Terminal**. Danach ist die Anmeldung fertig.

!!! tip "Die englische Anleitung auf Deutsch lesen"
    Der „Project Guide" läuft im Browser – Chrome oder Edge übersetzen ihn automatisch: **Rechtsklick auf die Seite → „Auf Deutsch übersetzen"**.

---

## Der Ablauf – die drei Aufgaben auf Deutsch

Drei Aufgaben, die aufeinander aufbauen. Alle Befehle tippst du im Terminal auf der VM (nach der Anmeldung oben).

### 1 – GKE-Cluster anlegen

Erst das Projekt und die Zone einstellen, dann den Cluster bauen. `us-central1-a` ist eine **Zone** (eine einzelne Rechenzone innerhalb der Region `us-central1`) – deshalb `compute/zone` und nicht `compute/region`. Die **Projekt-ID** findest du in der Google-Cloud-Konsole (oben in der Projektauswahl):

```bash
gcloud config set project <PROJECT_ID>
gcloud config set compute/zone us-central1-a

gcloud container clusters create ps-cluster \
  --num-nodes=1 \
  --machine-type e2-standard-2 \
  --disk-size 30GB \
  --enable-ip-alias \
  --release-channel regular \
  --cluster-version=1.33
```

Der Cluster-Aufbau dauert **6 bis 10 Minuten** – das ist normal. Danach holst du dir den Zugang und prüfst, dass `kubectl` mit dem Cluster spricht:

```bash
gcloud container clusters get-credentials ps-cluster
kubectl get nodes        # erwartet: ein Knoten, Status Ready
```

### 2 – App ausrollen und öffentlich erreichbar machen

Die fertigen Manifeste kommen aus einem Repo – **kein YAML selbst schreiben**:

```bash
git clone https://github.com/pluralsight-cloud/Lab-Deploying-and-Scaling-Applications-on-Google-Kubernetes-Engine.git
cd Lab-Deploying-and-Scaling-Applications-on-Google-Kubernetes-Engine

kubectl apply -f deployment.yaml     # die App (hello-app)
kubectl get po                       # Pod sollte Running sein

kubectl apply -f service.yaml        # Service vom Typ LoadBalancer
kubectl get po
kubectl logs <POD_NAME>              # Log-Zeilen der App ansehen

kubectl get svc                      # unter EXTERNAL-IP steht die öffentliche IP
```

Die `EXTERNAL-IP` des Load-Balancers braucht **kurz** (ein, zwei Minuten), bis sie erscheint – vorher steht dort `<pending>`. Sobald sie da ist, **öffne sie im Browser** – die App antwortet aus dem echten Internet.

### 3 – Skalieren und aktualisieren

Jetzt der Vorteil von Kubernetes – wie lokal, nur auf echter Cloud:

```bash
kubectl scale deployment/hello-app --replicas=3
kubectl get po                       # jetzt drei Pods (oder: kubectl get deployment)

kubectl rollout restart deployment/hello-app
kubectl get po                       # zusehen, wie die Pods nacheinander neu erstellt werden
```

Fertig. Du hast einen managed Cluster in der Cloud gebaut, eine App ausgerollt, sie öffentlich erreichbar gemacht, skaliert und neu ausgerollt.

---

## Worauf du achten musst

!!! warning "Die häufigsten Stolpersteine"
    - **Die Anmeldung ist der schwierigste Teil.** Geh die zwei Schritte oben (SSH auf die VM, dann `gcloud auth login`) langsam durch. Wenn etwas hakt, liegt es fast immer hier – nicht an Kubernetes.
    - **Projekt-ID einsetzen.** `<PROJECT_ID>` durch die echte ID aus der Google-Konsole ersetzen, sonst schlägt `gcloud config set project` fehl.
    - **`EXTERNAL-IP` braucht kurz.** Steht bei `kubectl get svc` noch `<pending>`, einfach ein paar Sekunden warten und erneut abfragen.
    - **Einfügen im Terminal** geht mit **Strg+Umschalt+V** (nicht Strg+V) – praktisch für Passwort, URL und die langen Befehle.

!!! note "Am Ende kommt eine Fehlerseite – kein Grund zur Sorge"
    Schließt du das Lab ab oder beendest es über **End Lab → Quit Lab**, wird die Umgebung sofort abgebaut. Ein noch offener Terminal- oder Umgebungs-Tab kann sich dann nicht mehr verbinden und zeigt eine **Fehlerseite**. Das ist **völlig normal** – es heißt nur, dass alles sauber aufgeräumt wurde. Schließ den Tab einfach.

---

## Weiter

- [Praxis: Deine App auf AWS mit EKS](12-praxis-eks.md) – die Hauptaufgabe, falls du hier gelandet bist, ohne sie gemacht zu haben.
- [In die Cloud: Überblick](11-cloud-labs.md) – die Einordnung zur ganzen Cloud-Einheit.
