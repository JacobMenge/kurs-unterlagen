# kubernetes-praxis – Begleitdateien

Fertige Kubernetes-Manifeste für den Praxis-Block **[Praxis: Kubernetes](https://jacobmenge.github.io/kurs-unterlagen/kubernetes-praxis/)**.
Du schreibst diese Dateien in den Übungen nicht selbst – sie liegen hier fertig zum Anwenden.

## Voraussetzungen

- Ein lokaler Kubernetes-Cluster (z.B. **minikube** mit Docker-Treiber) und **kubectl**.
- Einrichtung Schritt für Schritt: siehe die Seite **Installation** im Block.

## Schnellstart

```bash
# in diesen Ordner wechseln
cd kurs-unterlagen/apps/kubernetes-praxis

# Cluster prüfen
kubectl get nodes

# Deployment (3 Pods) und Service anlegen
kubectl apply -f manifests/hello-deployment.yaml
kubectl apply -f manifests/hello-service.yaml

# Zustand ansehen
kubectl get deploy,rs,pods,svc

# im Browser erreichbar machen
kubectl port-forward service/hello 8080:80
# -> http://localhost:8080
```

## Die Dateien

| Datei | Zweck | Genutzt in |
|-------|-------|-----------|
| `manifests/hello-pod.yaml` | ein einzelner Pod (die kleinste Einheit) | Praxis 1 |
| `manifests/hello-deployment.yaml` | Deployment mit 3 Replicas (Soll-Zustand, Selbstheilung) | Praxis 2 |
| `manifests/hello-service.yaml` | Service (ClusterIP) als stabile Adresse + Load-Balancing | Praxis 3 |
| `manifests/hello-service-nodeport.yaml` | Service-Variante für Zugriff von außen (NodePort) | Praxis 3 (Bonus) |

Das verwendete Image `nginxdemos/hello` zeigt den **Pod-Namen** an, der die Anfrage beantwortet hat –
ideal, um Skalierung und Load-Balancing sichtbar zu machen. Für einen sichtbaren Rolling Update
gibt es zusätzlich den Tag `nginxdemos/hello:plain-text`.

## Aufräumen

```bash
kubectl delete -f manifests/hello-service.yaml -f manifests/hello-deployment.yaml
# oder den ganzen Cluster zurücksetzen:
minikube delete
```
