---
title: "Praxis: Deine App auf AWS mit EKS"
description: "Schritt-für-Schritt-Anleitung zum EKS-Lab: einen echten Kubernetes-Cluster bei AWS anlegen, eine Web-App darauf ausrollen, über einen Load-Balancer öffentlich erreichbar machen und die Selbstheilung bei einem Server-Ausfall testen – anfängerfreundlich erklärt, mit dem Warum bei jedem Schritt."
---

# Praxis: Deine App auf AWS mit EKS

!!! quote "Der Kerngedanke"
    Du baust einen **echten Kubernetes-Cluster bei Amazon** (EKS), rollst eine Web-App darauf aus, machst sie über einen **Load-Balancer aus dem Internet erreichbar** und testest, ob der Cluster einen **Server-Ausfall von selbst wegsteckt**. Alles über die Kommandozeile – genau so, wie es echte Teams im Betrieb machen.

## Deine Mission

Stell dir vor, du bist im Infrastruktur-Team einer Firma. Deine Aufgabe: eine kleine Web-App auf einem Cluster aus mehreren Servern zum Laufen bringen, sie öffentlich erreichbar machen und sicherstellen, dass sie **auch dann weiterläuft, wenn ein Server ausfällt**. Genau das machst du jetzt – auf echter AWS-Infrastruktur, die dir das Lab kostenlos stellt.

In drei großen Schritten:

1. **Den Cluster anlegen** – die Server, das Netzwerk und die Kubernetes-Steuerung bei AWS aufsetzen.
2. **Die App ausrollen und öffentlich erreichbar machen** – über einen Load-Balancer mit echter Internet-Adresse.
3. **Die Hochverfügbarkeit testen** – Server abschalten und zusehen, wie der Cluster sich selbst heilt.

<figure>
<svg viewBox="0 0 680 300" width="100%" height="300" role="img" aria-label="Ein Nutzer aus dem Internet erreicht über einen Load-Balancer mit öffentlicher Adresse einen EKS-Cluster mit zwei Knoten, auf denen je ein App-Pod läuft">
  <circle cx="52" cy="150" r="30" fill="rgba(122,162,255,0.12)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="52" y="147" text-anchor="middle" fill="#7aa2ff" font-size="12">Nutzer</text>
  <text x="52" y="163" text-anchor="middle" fill="#8fa498" font-size="10">Internet</text>

  <path d="M84 150 L164 150" fill="none" stroke="#7aa2ff" stroke-width="2" marker-end="url(#eksA)"/>

  <rect x="166" y="116" width="140" height="68" rx="8" fill="rgba(224,160,90,0.12)" stroke="#e0a05a" stroke-width="2.5"/>
  <text x="236" y="144" text-anchor="middle" fill="#e0a05a" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold">Load-Balancer</text>
  <text x="236" y="163" text-anchor="middle" fill="#8fa498" font-size="10">öffentliche Adresse</text>

  <rect x="356" y="44" width="310" height="212" rx="10" fill="rgba(125,255,154,0.03)" stroke="#7dff9a" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="372" y="64" fill="#8fa498" font-size="11">EKS-Cluster (AWS)</text>

  <rect x="470" y="80" width="180" height="66" rx="6" fill="rgba(125,255,154,0.05)" stroke="#56c374" stroke-width="2"/>
  <text x="502" y="118" text-anchor="middle" fill="#8fa498" font-size="10">Knoten 1</text>
  <rect x="548" y="96" width="86" height="34" rx="5" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="591" y="117" text-anchor="middle" fill="#7aa2ff" font-size="11">App-Pod</text>

  <rect x="470" y="168" width="180" height="66" rx="6" fill="rgba(125,255,154,0.05)" stroke="#56c374" stroke-width="2"/>
  <text x="502" y="206" text-anchor="middle" fill="#8fa498" font-size="10">Knoten 2</text>
  <rect x="548" y="184" width="86" height="34" rx="5" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="591" y="205" text-anchor="middle" fill="#7aa2ff" font-size="11">App-Pod</text>

  <path d="M306 140 L466 113" fill="none" stroke="#56c374" stroke-width="2" marker-end="url(#eksG)"/>
  <path d="M306 160 L466 201" fill="none" stroke="#56c374" stroke-width="2" marker-end="url(#eksG)"/>

  <defs>
    <marker id="eksA" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#7aa2ff"/></marker>
    <marker id="eksG" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#56c374"/></marker>
  </defs>
</svg>
<figcaption>Das Ziel: Ein Nutzer erreicht die App über den Load-Balancer mit öffentlicher Adresse. Der verteilt die Anfragen auf zwei Knoten (echte Server), auf denen je eine Kopie der App läuft. Fällt ein Knoten aus, holt der Cluster automatisch einen neuen.</figcaption>
</figure>

---

## Bevor du startest

1. Öffne das Lab **[Deploying a Web App Using Elastic Kubernetes Service in AWS](https://app.pluralsight.com/hands-on/labs/17d201ee-8a47-4364-a6c0-eba0391a9f22)** und klicke **Start Lab**. Nach etwa einer Minute ist die Umgebung bereit.
2. Rechts erscheinen die **Lab Credentials** (URL, Username, Password). Öffne die **AWS-Konsole** über die URL und melde dich mit diesen Zugangsdaten an.
3. **Wichtig:** Stelle die Region oben rechts auf **N. Virginia (us-east-1)**. Fast alle Fehler in diesem Lab kommen daher, dass man in der falschen Region arbeitet.

!!! tip "Alles auf Englisch – so liest du es auf Deutsch"
    Die AWS-Konsole und die Lab-Anleitung sind auf Englisch. Diese Seite hier ist deine deutsche Begleitung – arbeite sie parallel durch. Die englischen Menüpunkte (IAM, EC2, …) nenne ich im Original, damit du sie in der Konsole wiederfindest.

!!! info "Was es kostet: nichts"
    Die ganze AWS-Umgebung wird vom Lab gestellt und bezahlt. Du arbeitest mit temporären Zugangsdaten, hast kein eigenes AWS-Konto und bekommst keine Rechnung. Nach Ablauf des Timers wird alles automatisch abgebaut – auch der Cluster. Es kann nichts „aus Versehen weiterlaufen".

---

## Teil 1: Den Cluster anlegen

Das ist der längste Teil. Er hat drei Abschnitte: erst einen **Zugangsschlüssel** für die Werkzeuge, dann eine **Arbeitsstation** (ein kleiner Server), und darauf baust du schließlich den **Cluster**.

### 1a – Einen Zugangsschlüssel anlegen (IAM)

!!! note "Warum das?"
    Gleich richtest du auf einem kleinen Server zwei Werkzeuge ein, die bei AWS Dinge erstellen (den Cluster). Damit die das dürfen, müssen sie sich bei AWS **ausweisen** – dafür brauchen sie einen **Zugangsschlüssel**. Das ist wie ein Benutzername plus Passwort, nur für Programme statt für Menschen. Diesen Schlüssel legst du jetzt an.

1. Oben in der Menüleiste **IAM** auswählen. (Findest du es nicht, tippe `IAM` in die Suchleiste.)
2. Links im Menü **Users** → **Create user**.
3. Als **User name** `eks-user` eingeben → **Next**.
4. Bei **Permissions options** → **Attach policies directly** wählen.
5. In der Liste **AdministratorAccess** ankreuzen → **Next** → **Create user**.
6. Auf den neuen Benutzer **eks-user** klicken → Reiter **Security credentials**.
7. Unter **Access keys** → **Create access key** → **Command Line Interface (CLI)** wählen → den Haken bei „I understand…" setzen → **Next** → **Create access key**.
8. **Download .csv file** klicken und die Datei speichern → **Done**.

!!! warning "Die CSV-Datei aufheben"
    In dieser Datei stehen der **Access key** und der **Secret access key**. Die brauchst du gleich zum Einloggen der Werkzeuge. Lass die Datei offen oder gut auffindbar.

### 1b – Eine Arbeitsstation starten (EC2) und verbinden

!!! note "Warum das?"
    Die Befehle tippst du nicht im Browser, sondern auf einem kleinen **Linux-Server in der Cloud** – deiner „Kommandozentrale". Von dort aus baust du den Cluster. Diesen Server (eine EC2-Instanz) startest du jetzt.

1. Oben **EC2** auswählen → herunterscrollen → **Launch instance**.
2. **Name**: `eks-admin` eingeben.
3. Bei **Application and OS Images** unter **Quick Start** → **Amazon Linux** wählen (ist meist schon vorausgewählt).
4. Bei **Instance type** → **t3.medium** wählen.
5. Bei **Key pair (login)** → **Create new key pair** → Name `admin-key` → **Create key pair**.
6. Herunterscrollen zu **Network settings** → sicherstellen, dass **Auto-assign public IP** auf **Enable** steht.
7. Unten **Launch instance** → dann oben im Pfad auf **Instances** klicken.
8. Warte, bis der Status von **eks-admin** auf **Running** steht → Häkchen links setzen → **Connect**.
9. Auf der Seite **Connect to instance** den Reiter **EC2 Instance Connect** wählen (ist meist schon aktiv) → **Connect**.

!!! tip "Kein Passwort, kein SSH-Programm nötig"
    **EC2 Instance Connect** öffnet ein **Terminal direkt im Browser** – ohne Passwort, ohne dass du einen SSH-Client installierst. AWS regelt die Anmeldung im Hintergrund. Ab jetzt tippst du alle Befehle in dieses schwarze Terminal-Fenster.

### 1c – Werkzeuge einrichten und den Cluster bauen

Jetzt sagst du dem Server, wer du bist, lädst zwei Werkzeuge und baust den Cluster. Alle Befehle laufen im **EC2-Terminal** aus dem letzten Schritt.

**Anmelden mit dem Zugangsschlüssel:**

```bash
aws configure
```

Der Server fragt vier Dinge ab – nimm die Werte aus deiner CSV-Datei:

- **AWS Access Key ID**: den Access key aus der CSV einfügen.
- **AWS Secret Access Key**: den Secret access key aus der CSV einfügen.
- **Default region name**: `us-east-1`
- **Default output format**: `json`

!!! note "Kurz erklärt"
    `aws configure` hinterlegt deinen Zugangsschlüssel auf dem Server. Ab jetzt weiß jedes AWS-Werkzeug auf dieser Maschine, in wessen Namen es handeln darf – nämlich in deinem. (`aws` selbst ist auf Amazon Linux schon installiert. Käme hier „command not found", wäre das die Ausnahme – dann sag Bescheid.)

**kubectl herunterladen** (das Werkzeug, mit dem du Kubernetes steuerst). Wir holen gezielt die Version, die **zum Cluster passt** – Kubernetes **1.33**, die wir gleich beim Cluster-Bau festlegen:

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable-1.33.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl
mkdir -p $HOME/bin && cp ./kubectl $HOME/bin/kubectl && export PATH=$PATH:$HOME/bin
```

!!! note "Warum nicht der Link aus der Original-Anleitung?"
    Die Original-Anleitung lädt eine **veraltete** kubectl-Version (1.25 von 2023). `kubectl` und der Cluster müssen aber **zueinander passen** – höchstens eine Version Abstand, sonst gibt es Fehler. Deshalb holt die Zeile oben gezielt die aktuelle **1.33**er-Version, genau passend zum Cluster, den wir gleich mit `--version 1.33` bauen.

**eksctl herunterladen** (das Werkzeug, das den ganzen Cluster für dich baut):

```bash
curl --silent --location "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
eksctl version
```

Die letzte Zeile sollte eine Versionsnummer ausgeben – dann ist eksctl bereit.

**Den Cluster bauen:**

```bash
eksctl create cluster --support-type STANDARD --version 1.33 --name myeks --region us-east-1 --zones=us-east-1a,us-east-1b --nodegroup-name eks-workers --node-type t3.medium --nodes 2 --nodes-min 2 --nodes-max 4 --managed
```

!!! note "Kurz erklärt: was dieser eine Befehl macht"
    `eksctl create cluster` baut im Hintergrund alles auf, was ein Cluster braucht: die **Kubernetes-Steuerung**, ein **Netzwerk** und **zwei Arbeiter-Server** (`--nodes 2`, Typ `t3.medium`). Kurz zu den Zusätzen: `--version 1.33` legt die Kubernetes-Version fest (passend zu deinem `kubectl` von eben), `--zones` wählt zwei EKS-taugliche Rechenzonen (in `us-east-1` nötig, weil nicht jede Zone EKS kann), `--managed` lässt AWS die Server verwalten und `--support-type STANDARD` hält den Cluster im kostenlosen Standard-Support. Ein einziger Befehl – und du hast einen echten Cluster. Das **dauert 15 bis 20 Minuten**. Nicht abbrechen – nutze die Zeit für die Theorie.

**Verbinden und prüfen** (wenn der Cluster fertig ist):

```bash
aws eks update-kubeconfig --name myeks --region us-east-1
kubectl get nodes
```

`kubectl get nodes` sollte **zwei Knoten** mit Status **Ready** zeigen. Wenn ja: Der Cluster steht. Teil 1 geschafft.

---

## Teil 2: Die App ausrollen

Der Cluster ist leer. Jetzt bringst du eine kleine Web-App darauf. Du beschreibst sie – wie gewohnt – in einer YAML-Datei (ein **Deployment** für die App plus ein **Service** vom Typ `LoadBalancer` für die öffentliche Adresse) und wendest sie an.

**Die Datei anlegen.** Statt sie mühsam in einem Editor zu tippen, erzeugst du sie in einem Rutsch. Kopiere den **ganzen Block** und füge ihn ins Terminal ein (mit **Strg+Umschalt+V**):

```bash
cat > app.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: vote-service
  labels:
    app: vote
spec:
  selector:
    app: vote
  ports:
    - name: http
      port: 80
      targetPort: 80
  type: LoadBalancer
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vote-deployment
  labels:
    app: vote
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vote
  template:
    metadata:
      labels:
        app: vote
    spec:
      containers:
        - name: vote
          image: dockersamples/examplevotingapp_vote:before
          ports:
            - name: http
              containerPort: 80
EOF
```

!!! note "Kurz erklärt: was in der Datei steht"
    - Der **Service** vom Typ `LoadBalancer` sorgt für die **öffentliche Adresse** vor der App. Genau das gab es lokal nicht.
    - Das **Deployment** startet die App in **zwei Kopien** (`replicas: 2`) – eine je Knoten. Das Image `dockersamples/examplevotingapp_vote:before` ist eine kleine Beispiel-Web-App.
    - **Hinweis:** Die Original-Anleitung hat im Service zusätzlich einen zweiten Port (Name `udp`, Port 5000). Die Voting-App bedient ihn gar nicht – sie läuft nur auf Port 80. Deshalb ist er hier weggelassen; das hält die Datei sauber und schließt jedes Load-Balancer-Problem von vornherein aus.

Kontrollieren und anwenden:

```bash
cat app.yaml            # zeigt den Inhalt – nur zur Kontrolle
kubectl apply -f app.yaml
```

`kubectl apply` erstellt Service und Deployment im Cluster.

---

## Teil 3: Prüfen, dass die Seite läuft

Jetzt schaust du nach, ob alles läuft, und öffnest die App im Browser.

```bash
kubectl get deployment      # erwartet: 2/2 bereit
kubectl get pods            # erwartet: zwei Pods, Running
kubectl get svc             # unter EXTERNAL-IP steht die öffentliche Adresse
```

!!! warning "EXTERNAL-IP braucht einen Moment"
    Beim ersten `kubectl get svc` steht bei `vote-service` unter **EXTERNAL-IP** oft noch `<pending>`. Das ist normal – AWS richtet den Load-Balancer gerade ein. Warte ein bis drei Minuten und frag erneut ab. Sobald dort eine lange Adresse (…`elb.amazonaws.com`) steht, ist sie bereit.

Kopiere diese Adresse und teste sie – im Terminal und im Browser:

```bash
curl <DIE-ADRESSE-AUS-EXTERNAL-IP>
```

Es kommt HTML zurück (mit `<title>…</title>`). Öffne dieselbe Adresse zusätzlich in einem **Browser-Tab** – die App erscheint. **Das ist der Moment:** eine echte Seite, aus dem echten Internet erreichbar, bedient von deinem Cluster in einem AWS-Rechenzentrum.

---

## Teil 4: Die Hochverfügbarkeit testen

Jetzt der spannende Teil – was passiert, wenn ein Server ausfällt?

1. Zurück in die **EC2**-Konsole → oben im Pfad auf **Instances**.
2. In der Liste siehst du drei laufende Instanzen: deine **eks-admin** (die Kommandozentrale) und **zwei `myeks`-Arbeiter-Knoten**.
3. Setze die Häkchen bei den **beiden `myeks`-Knoten** (nicht bei eks-admin!).
4. Oben **Instance state** → **Terminate instance** → im Pop-up **Terminate** bestätigen.
5. Beide Knoten wechseln auf **Shutting-down**. Schau kurz zu: Nach kurzer Zeit taucht **automatisch ein neuer Knoten** in der Liste auf, mit Status **Initializing**.

!!! quote "Der Aha-Moment: Selbstheilung auf Server-Ebene"
    Lokal hast du gesehen: Stirbt ein **Pod**, startet Kubernetes von selbst einen neuen. Hier gehst du eine Ebene tiefer. Du hast gerade **die Arbeiter-Server komplett abgeschaltet** – so, als wäre im Rechenzentrum die Hardware ausgefallen. Und der Cluster? Merkt, dass Knoten fehlen, und **fährt automatisch neue Server hoch**. Nicht nur der Container heilt, sondern die **Maschine dahinter**. Genau so halten echte Betriebe ihre Dienste am Laufen, ohne dass nachts jemand an die Konsole muss.

Damit hast du die drei Ziele erreicht: Cluster gebaut, App öffentlich erreichbar gemacht und die Selbstheilung bewiesen. **Geschafft.**

---

## Aufräumen

Du musst nichts abschalten oder löschen: Der Timer des Labs baut die ganze Umgebung am Ende **automatisch** ab, und es entstehen keine Kosten. Wenn du fertig bist, kannst du oben **End Lab → Quit Lab** wählen.

!!! tip "Sauber von Hand aufräumen (optional)"
    Wenn du den Cluster selbst entfernen willst, bevor du das Lab beendest, geht das mit einem Befehl im Terminal: `eksctl delete cluster --name myeks --region us-east-1 --wait`. Im Lab ist das nicht nötig – der Abbau passiert automatisch –, aber im echten Betrieb räumt man so hinter sich auf.

!!! note "Am Ende kommt eine Fehlerseite – kein Grund zur Sorge"
    Beendest du das Lab, wird die Umgebung sofort abgebaut. Ein noch offener Terminal- oder Konsolen-Tab kann sich dann nicht mehr verbinden und zeigt eine **Fehlerseite**. Das ist **völlig normal** – es heißt nur, dass sauber aufgeräumt wurde. Schließ den Tab einfach.

---

## Worauf du achten musst

!!! warning "Die häufigsten Stolpersteine"
    - **Falsche Region.** Alles läuft in **us-east-1** (N. Virginia). Prüfe das oben rechts in der Konsole, bevor du IAM oder EC2 öffnest – falsche Region ist der häufigste Grund, warum etwas „nicht da" ist.
    - **Der Cluster-Aufbau dauert 15-20 Minuten.** Das ist normal, nicht abbrechen.
    - **EXTERNAL-IP steht auf `<pending>`.** Kurz warten und `kubectl get svc` erneut ausführen.
    - **Bei Teil 4 die richtigen Instanzen abschalten** – nur die beiden **`myeks`**-Knoten, nicht `eks-admin`.
    - **Einfügen ins Terminal** geht mit **Strg+Umschalt+V** – praktisch für die Zugangsschlüssel und den YAML-Block.

!!! note "Das kennst du zum Teil schon"
    Teil 2 und 3 (Deployment, Service, `kubectl apply`, `kubectl get`) sind dein lokaler Stoff – nur auf echter AWS-Infrastruktur. **Wirklich neu** sind der managed Cluster, der **Load-Balancer mit öffentlicher Adresse** und die **Selbstheilung auf Server-Ebene** aus Teil 4.

---

## Mitnehmen

!!! quote "Die drei wichtigsten Punkte"
    1. **Ein Befehl baut den ganzen Cluster.** `eksctl create cluster` erzeugt Steuerung, Netzwerk und Server – das nimmt dir AWS als „managed" Dienst ab.
    2. **Der Load-Balancer bringt die App ins Internet.** Ein `Service` vom Typ `LoadBalancer` bekommt eine echte öffentliche Adresse vor den Pods.
    3. **Der Cluster heilt sich bis auf die Server-Ebene.** Fällt Hardware aus, kommt automatisch Ersatz – die Grundlage für Dienste, die immer laufen.

---

## Weiter

- [In die Cloud: Überblick](11-cloud-labs.md) – die Einordnung und die optionalen Labs (GKE, Wiederholung).
- [Rückblick & Ausblick](10-rueckblick.md) – was du aus dem ganzen Kubernetes-Block mitnimmst.
