---
title: "Lab: Config & Secrets (Pluralsight)"
description: "Deutscher Begleiter zum geführten Lab „Config, Secrets & Security for CKAD“: auf einer gestellten Umgebung einen echten Zwei-Knoten-Cluster bauen, dann ConfigMap und Secret als Umgebungsvariablen einspeisen, ein Secret als Datei in den Pod mounten und zum Abschluss mit ServiceAccounts arbeiten – Schritt für Schritt, mit dem Warum bei jedem Schritt."
---

# Lab: Config & Secrets (Pluralsight)

!!! quote "Der Kerngedanke"
    Das hier ist **dasselbe Thema** wie in [Praxis: Config & Secrets](03-praxis-config-secrets.md) – Konfiguration und Geheimnisse aus dem Image lösen –, nur als **geführtes Lab auf einer gestellten Umgebung**. Du installierst nichts auf deinem Rechner: Das Lab bringt seine eigenen Server mit, du arbeitest im Browser. Und du gehst zwei Schritte weiter als lokal: ein Secret **als Datei** mounten und ein erster Blick auf **ServiceAccounts**.

## Worum es geht

Du kennst ConfigMap und Secret schon von deinem minikube. In diesem Lab machst du es auf einer **echten, gestellten Cloud-Umgebung** – und lernst zwei zusätzliche Wege kennen, an Geheimnisse zu kommen:

1. **Als Umgebungsvariablen** – über `envFrom`, genau wie in Teil 2 (Wiederholung auf echter Infrastruktur).
2. **Als Datei im Pod** – das Secret wird ins Dateisystem des Containers **gemountet**, statt als Variable gesetzt.
3. **ServiceAccount (Bonus)** – ein Konto für einen Pod, mit dem er selbst bei der Kubernetes-API nachfragen darf. Das geht über den Teil-2-Stoff hinaus, ist aber ein guter Ausblick.

!!! warning "Ehrlich vorab: dieses Lab baut erst einen ganzen Cluster"
    Anders als bei deinem fertigen minikube **baust du hier den Cluster selbst** – aus zwei Servern (eine **Control Plane** und ein **Worker Node**), zusammengesteckt mit `kubeadm`. Das ist der **längste und fummeligste** Teil (Anmelden, Skripte laufen lassen, die beiden Knoten verbinden) und dauert **10 bis 20 Minuten**. Das eigentliche Config/Secret-Thema kommt erst danach. Plane also Zeit ein – oder lass dir beim Aufbau helfen.

---

## Los geht's – so startest du das Lab

1. **Lab öffnen** (eingeloggt sein): **[Config, Secrets & Security for CKAD](https://app.pluralsight.com/hands-on/labs/1f2efa13-e839-40a6-bc6d-5bf35c0fef8a)**. Alternativ: Menü oben links → **Hands-on** → Reiter **Hands-on Labs** → Titel suchen.
2. **Start Lab** klicken. Nach kurzer Zeit erscheinen rechts die **Lab Credentials** (Public IP und Password der Server).
3. **Instant Terminal** öffnen (rechts oben) – das ist ein Terminal direkt im Browser, dein Sprungbrett auf die Server.

!!! tip "Alles auf Englisch – so liest du es auf Deutsch"
    Die Lab-Anleitung („Project Guide") ist auf Englisch. Diese Seite ist deine deutsche Begleitung – arbeite sie parallel durch. Den englischen Guide kannst du dir im Browser zusätzlich übersetzen lassen: **Rechtsklick auf die Seite → „Auf Deutsch übersetzen"** (Chrome/Edge).

!!! note "Wo du tippst: im Linux-Terminal des Labs"
    Alle Befehle unten tippst du **im Terminal der Lab-Server** (Linux), nicht auf deinem eigenen Rechner. Deshalb funktionieren hier auch `base64`, `grep` und Co. ganz normal – das sind Linux-Bordmittel. Einfügen ins Browser-Terminal geht mit **Strg+Umschalt+V**.

---

## Teil 0: Den Cluster aufbauen

Das ist die Umgebung. Drei Schritte: Control Plane verbinden, Kubernetes darauf einrichten, dann den Worker Node dazuhängen.

### Control Plane verbinden und einrichten

Rechts unter **Lab Credentials** stehen **Public IP** und **Password** der **Control Plane**. Im Instant Terminal:

```bash
ssh cloud_user@<PUBLIC_IP_CONTROL_PLANE>
```

Mit `y` bestätigen, dann das **Password** einfügen. Du bist jetzt auf dem Server (`cloud_user@…`). Lade und starte die zwei Einrichtungs-Skripte:

```bash
wget -L https://raw.githubusercontent.com/ps-interactive/lab_config-secrets-security-for-ckad/refs/heads/main/CKAD_setup.sh
chmod u+x CKAD_setup.sh
./CKAD_setup.sh
```

Beim Nachfragen wieder das **Password** eingeben. Das Skript installiert Kubernetes; laut Lab endet die Ausgabe sinngemäß mit Zeilen wie `kubelet set on hold`, `kubeadm set on hold`, … Danach das zweite Skript, das die Control Plane fertig einrichtet:

```bash
wget -L https://raw.githubusercontent.com/ps-interactive/lab_config-secrets-security-for-ckad/refs/heads/main/CP_setup.sh
chmod u+x CP_setup.sh
./CP_setup.sh
```

Prüfe, dass die System-Pods laufen (das dauert ein, zwei Minuten):

```bash
kubectl get pods --all-namespaces
```

Sobald alle `Running` sind, erzeuge den **Verbindungsbefehl** für den Worker und **merke ihn dir** (kopieren):

```bash
kubeadm token create --print-join-command
```

!!! note "Kurz erklärt: was hier passiert"
    `kubeadm` ist das offizielle Werkzeug, um einen Kubernetes-Cluster von Hand aufzubauen. Die Skripte installieren die Bausteine (kubelet, kubeadm, kubectl, containerd) und richten die **Control Plane** ein – den Steuerungsteil, den dir bei EKS oder GKE der Anbieter abnimmt. Der `join`-Befehl ist die „Einladung", mit der sich gleich der zweite Server als Arbeiter anmeldet.

### Worker Node verbinden und dazuhängen

Rechts unter Lab Credentials klappst du den Abschnitt **Node** auf und kopierst dessen **Public IP**. Öffne ein weiteres **Instant Terminal** und verbinde dich:

```bash
ssh cloud_user@<PUBLIC_IP_NODE>
```

`y`, dann Password. Richte Kubernetes auch hier ein:

```bash
wget -L https://raw.githubusercontent.com/ps-interactive/lab_config-secrets-security-for-ckad/refs/heads/main/Node.sh
chmod u+x Node.sh
./Node.sh
```

Jetzt hängst du den Worker an die Control Plane. Tippe `sudo ` (mit Leerzeichen) und füge **direkt dahinter** den kompletten Befehl ein, den du dir eben gemerkt hast – er beginnt selbst mit `kubeadm join …`, du tippst also **kein** zweites `kubeadm join`:

```bash
sudo <hier den gemerkten kubeadm-join-Befehl einfügen>
```

Ausgeschrieben sieht das dann etwa so aus (deine Werte sind andere):

```bash
sudo kubeadm join 10.0.1.10:6443 --token abcdef.0123456789abcdef --discovery-token-ca-cert-hash sha256:1234...
```

Zurück im **Control-Plane-Terminal** prüfst du, bis **beide** Knoten `Ready` sind (ein paar Mal wiederholen):

```bash
kubectl get nodes
```

Ab jetzt bleibst du auf der **Control Plane** – dort läuft der Rest des Labs.

---

## Teil 1: ConfigMap und Secret als Umgebungsvariablen

Das ist die Wiederholung deines Teil-2-Wissens auf echter Infrastruktur. Lege eine ConfigMap und ein Secret an:

```bash
kubectl --namespace kube-system create configmap my-configmap --from-literal=ENV=dev
kubectl create secret generic db-user-pass --from-literal=username=admin --from-literal=password='pass123' --namespace kube-system
```

!!! note "Kurz erklärt: `--from-literal` und der Namespace"
    `--from-literal=SCHLÜSSEL=WERT` legt ein Schlüssel-Wert-Paar direkt auf der Kommandozeile an – ohne YAML-Datei. Das Lab arbeitet der Einfachheit halber im vorhandenen Namespace **`kube-system`**. Im echten Betrieb nimmst du dafür einen **eigenen** Namespace, nicht den der Systemkomponenten – aber fürs Üben ist es hier egal.

Hol dir das fertige Deployment und schau es an:

```bash
wget -L https://raw.githubusercontent.com/ps-interactive/lab_config-secrets-security-for-ckad/refs/heads/main/app.yaml
cat app.yaml
```

Der Kern ist der `envFrom`-Block – genau wie in Teil 2:

```yaml
      containers:
      - name: nginx
        image: nginx:1.14.2
        envFrom:
            - configMapRef:
                name: my-configmap
            - secretRef:
                name: db-user-pass
        ports:
        - containerPort: 80
```

!!! note "Zum Image-Tag `nginx:1.14.2`"
    Der Tag stammt **unverändert aus dem Original-Lab** und ist bewusst so übernommen, damit die Seite zum echten Lab passt. Er ist alt (Version von 2019) – im echten Betrieb würdest du eine **aktuelle, gepflegte** Version wählen. Für diese Übung ist die Version egal.

Anwenden und den Pod-Namen ablesen:

```bash
kubectl --namespace kube-system apply -f app.yaml
kubectl get pods --namespace kube-system
```

Schau die Umgebungsvariablen im Pod an (setz deinen echten Pod-Namen mit Suffix ein):

```bash
kubectl --namespace kube-system exec -it nginx-deployment-<suffix> -- env | grep ENV
```

`ENV=dev` erscheint – der Wert aus der ConfigMap ist als Umgebungsvariable im Container angekommen. Genau das Muster aus Teil 2.

---

## Teil 2: Ein Secret als Datei mounten

Neu gegenüber Teil 2: Statt das Secret als Variable zu setzen, legst du es als **Datei** ins Dateisystem des Pods. Erst das alte Deployment weg:

```bash
kubectl -n kube-system delete deploy nginx-deployment
```

Erzeuge den base64-Wert des Wortes `Password` und lege damit ein Secret an:

```bash
echo -n 'Password' | base64
```

```text
UGFzc3dvcmQ=
```

```bash
kubectl create secret generic db-password --from-literal=password=UGFzc3dvcmQ= --namespace kube-system
```

!!! warning "Wieder der ehrliche Hinweis: base64 ist keine Sicherheit"
    Das kennst du aus Teil 2: `base64` ist nur eine Umschreibung, keine Verschlüsselung. Gleich machst du es selbst wieder rückgängig. Ein echtes Passwort wäre länger, verschlüsselt und käme nicht so ins Repo.

Hol das zweite Deployment und sieh dir an, **wie** das Secret gemountet wird:

```bash
wget -L https://raw.githubusercontent.com/ps-interactive/lab_config-secrets-security-for-ckad/refs/heads/main/app2.yaml
cat app2.yaml
```

```yaml
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
        volumeMounts:
            - name: db-password
              mountPath: /etc/secrets       # hier landet das Secret als Datei
      volumes:
        - name: db-password
          secret:
            secretName: db-password
```

Anwenden, Pod-Namen holen und die gemountete Datei auslesen:

```bash
kubectl --namespace kube-system apply -f app2.yaml
kubectl get pods --namespace kube-system
kubectl --namespace kube-system exec -it nginx-deployment-<suffix> -- cat /etc/secrets/password
```

Ausgegeben wird `UGFzc3dvcmQ=` – nicht etwa `Password`. Das ist wichtig zu verstehen: **Anders als in [Praxis 03](03-praxis-config-secrets.md)**, wo der Secret-Wert der Klartext war, hast du hier die **base64-Zeichenkette selbst** als Wert ins Secret gelegt (`--from-literal=password=UGFzc3dvcmQ=`). Kubernetes dekodiert sie **nicht** für dich – die gemountete Datei enthält also genau diesen Literalwert. Deshalb wandelst du ihn zur Kontrolle noch von Hand zurück:

```bash
base64 -d <<< UGFzc3dvcmQ=
```

```text
Password
```

!!! note "Kurz erklärt: Variable oder Datei?"
    Zwei Wege, dasselbe Secret in den Pod zu bekommen: als **Umgebungsvariable** (Teil 1, bequem) oder als **gemountete Datei** (Teil 2, hier). Die Datei-Variante ist praktisch, wenn eine Anwendung ihr Geheimnis ohnehin aus einer Datei liest (z.B. ein Zertifikat) – dann muss der Code gar nicht wissen, dass es aus einem Secret kommt.

---

## Teil 3 (Bonus): ServiceAccounts

!!! abstract "Das geht über Teil 2 hinaus"
    Dieser Abschnitt ist ein Ausblick in Richtung **Sicherheit/Rechte** und nicht mehr Teil-2-Kernstoff. Mach ihn mit, wenn Zeit und Neugier da sind.

Ein **ServiceAccount** ist ein Konto **für einen Pod** – damit darf eine Anwendung selbst kontrolliert bei der Kubernetes-API nachfragen. Räum erst auf und schau die vorhandenen Konten an:

```bash
kubectl -n kube-system delete deploy nginx-deployment
kubectl get serviceaccounts
```

Leg ein neues Konto an und teste, ob es Pods auflisten darf (darf es noch nicht):

```bash
kubectl create serviceaccount podreader
kubectl auth can-i list pods --as=system:serviceaccount:default:podreader
```

```text
no
```

Gib ihm über eine **Role** und ein **RoleBinding** genau das Recht, Pods zu lesen:

```bash
kubectl create role podreaderrole --verb=get,list --resource=pods
kubectl create rolebinding demorolebinding --role=podreaderrole --serviceaccount=default:podreader
kubectl auth can-i list pods --as=system:serviceaccount:default:podreader
```

```text
yes
```

!!! note "Kurz erklärt: Role und RoleBinding"
    Eine **Role** beschreibt **welche** Aktionen auf **welchen** Objekten erlaubt sind (hier: `get`, `list` auf `pods`). Ein **RoleBinding** verbindet diese Role mit einem Konto (hier: dem ServiceAccount `podreader`). Erst beide zusammen geben das Recht. Das ist **RBAC** – die Rechteverwaltung von Kubernetes.

Zum Abschluss hängst du das Konto an einen Pod und fragst aus dem Pod heraus die API ab. Hol das Deployment und schau, wie es den ServiceAccount setzt:

```bash
wget -L https://raw.githubusercontent.com/ps-interactive/lab_config-secrets-security-for-ckad/refs/heads/main/deploy.yaml
cat deploy.yaml
```

```yaml
    spec:
      serviceAccount: podreader          # dieser Pod handelt als "podreader"
      containers:
      - image: nginx
        name: nginx
```

!!! note "Randnotiz: `serviceAccount` vs. `serviceAccountName`"
    Das Feld heißt hier `serviceAccount` – das ist ein **alter Alias**. Aktuell schreibt man `serviceAccountName: podreader`. Beides funktioniert; das Lab nutzt die alte Schreibweise, deshalb steht sie auch hier so.

Anwenden, in den Pod wechseln und mit dem mitgelieferten Token die API abfragen:

```bash
kubectl apply -f deploy.yaml
kubectl get pods
kubectl exec nginx-<suffix> -it -- /bin/bash
```

Im Pod (`root@nginx-…`):

```bash
TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
CACERT=/var/run/secrets/kubernetes.io/serviceaccount/ca.crt
curl --cacert $CACERT --header "Authorization: Bearer $TOKEN" -X GET https://kubernetes.default.svc/api/v1/namespaces/default/pods
```

Im Lab sollte JSON zurückkommen, das mit `"kind": "PodList"` beginnt – der Pod durfte über sein Konto die Pods auflisten. Der ServiceAccount funktioniert.

---

## Worauf du achten musst

!!! warning "Die häufigsten Stolpersteine"
    - **Der Cluster-Aufbau ist der schwierigste Teil.** Zweimal einloggen (Control Plane und Node), Skripte laufen lassen, den `join`-Befehl korrekt übertragen. Wenn etwas hakt, liegt es fast immer hier – nicht am Config/Secret-Teil.
    - **Den richtigen Server erwischen.** ConfigMap, Secret und die App-Befehle laufen auf der **Control Plane**. Der Worker Node wird nur einmal eingerichtet und angehängt.
    - **Pod-Namen mit Suffix einsetzen.** Überall, wo `nginx-deployment-<suffix>` steht, den echten Namen aus `kubectl get pods` verwenden.
    - **Einfügen ins Terminal** geht mit **Strg+Umschalt+V** – praktisch für das Password und den langen `join`-Befehl.

!!! note "Das kennst du aus Teil 2"
    Teil 1 (ConfigMap und Secret per `envFrom`) ist **genau** dein lokaler Stoff aus [Praxis: Config & Secrets](03-praxis-config-secrets.md) – nur auf echter Infrastruktur. **Neu** sind der selbst gebaute Cluster, das **gemountete Secret** und der **ServiceAccount**.

---

## Aufräumen

Du musst nichts löschen: Der Timer des Labs baut die ganze Umgebung am Ende **automatisch** ab, es entstehen keine Kosten. Wenn du fertig bist, wählst du oben **End Lab → Quit Lab**.

!!! note "Am Ende kommt eine Fehlerseite – kein Grund zur Sorge"
    Beendest du das Lab, wird die Umgebung sofort abgebaut. Ein noch offener Terminal-Tab kann sich dann nicht mehr verbinden und zeigt eine **Fehlerseite**. Das ist normal – es heißt nur, dass sauber aufgeräumt wurde. Schließ den Tab einfach.

---

## Weiter

- [Lab: Probes & Ingress (Pluralsight)](07-lab-probes.md) – das zweite Lab: Gesundheitschecks und Routing von außen.
- [Rückblick & Ausblick](09-rueckblick.md) – was du aus dem ganzen Aufbau-Block mitnimmst.
