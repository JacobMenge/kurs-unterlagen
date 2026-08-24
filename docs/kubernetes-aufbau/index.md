---
title: "Kubernetes – Aufbau: betriebsreif machen"
description: "Dein Deployment läuft – aber ist es auch betriebsreif? In diesem Aufbau-Block machst du drei Schritte, die aus einem laufenden Dienst einen echten Produktionsdienst machen: Konfiguration und Geheimnisse aus dem Image lösen (ConfigMap & Secret), Kubernetes prüfen lassen, ob die App gesund ist (Health-Probes) und den Ressourcenhunger begrenzen (Requests & Limits) – im Wechsel aus Theorie und Praxis auf deinem minikube."
---

# Kubernetes – Aufbau: betriebsreif machen

In [Teil 1](../kubernetes-praxis/index.md) hast du einen Dienst zum Laufen gebracht: **Pod**, **Deployment**, **Service**, dazu Skalierung, Selbstheilung und Rolling Update. Der Dienst **läuft** – und das ist viel. Aber „läuft auf meinem Cluster" ist noch nicht „**betriebsreif**". Zwischen beidem liegen ein paar Handgriffe, die im echten Betrieb den Unterschied machen. Genau die machst du in diesem Block.

!!! info "Worauf wir aufbauen"
    Wir bleiben bei **derselben** kleinen Demo-App und **demselben** lokalen Cluster wie in Teil 1: ein schlankes nginx, das dir groß seine **Version** und den **Pod-Namen** anzeigt. Neu ist nicht die App, sondern was wir **um sie herum** bauen. Du brauchst also kein neues Vorwissen – nur einen laufenden minikube und die Handgriffe aus Teil 1.

Drei Lücken schließen wir – und zu jeder gibt es eine sichtbare Übung:

- **Konfiguration steckt noch im Image.** Farbe, Version, Standort, ein Passwort – alles fest eingebacken. Ändern hieße: neues Image bauen. Das lösen wir mit **ConfigMap** und **Secret**.
- **Kubernetes weiß nicht, ob deine App wirklich gesund ist.** „Der Prozess läuft" heißt nicht „die App antwortet". Das klären **Health-Probes** (readiness und liveness).
- **Ein Pod darf sich nehmen, was er will.** Ein Speicherleck – und ein einziger Container zieht den ganzen Node mit runter. Das begrenzen **Requests und Limits**.

---

## Was du in diesem Block lernst

- **Konfiguration vom Image trennen** – dieselbe App, verschiedene Umgebungen, ohne neues Image
- der Unterschied zwischen **ConfigMap** (offene Werte) und **Secret** (Geheimnisse) – und warum ein Secret noch **keine** Verschlüsselung ist
- **readiness** und **liveness** – wie Kubernetes selbst prüft, ob ein Pod **bereit** ist und ob er noch **lebt**
- warum eine kaputte Readiness-Probe ein fehlerhaftes Update **stoppt**, statt den Dienst mitzureißen
- **Requests und Limits** – wie viel ein Container reserviert bekommt und was passiert, wenn er sein Limit sprengt (**OOMKilled**)

---

## So ist dieser Block aufgebaut

Gleicher roter Faden wie in Teil 1: erst ein Konzept verstehen, dann sofort selbst anfassen.

```mermaid
flowchart LR
  W["Theorie<br/>Warum betriebsreif?"] --> T1["Theorie<br/>ConfigMap & Secret"]
  T1 --> P1["Praxis<br/>Config & Secrets"]
  P1 --> T2["Theorie<br/>Probes & Limits"]
  T2 --> P2["Praxis<br/>Probes & Limits"]
```

| Seite | Inhalt | Art |
|-------|--------|-----|
| [Warum betriebsreif?](01-warum-betriebsreif.md) | Was zwischen „läuft" und „produktionsreif" fehlt – die drei Lücken | Theorie |
| [ConfigMap & Secret](02-config-und-secrets.md) | Konfiguration und Geheimnisse aus dem Image lösen | Theorie |
| [Praxis: Config & Secrets](03-praxis-config-secrets.md) | ConfigMap und Secret anlegen, injizieren, ändern, neu ausrollen | Praxis |
| [Probes & Limits](04-probes-und-limits.md) | Gesundheitschecks und Ressourcengrenzen erklärt | Theorie |
| [Praxis: Probes & Limits](05-praxis-probes-limits.md) | Probes einbauen, absichtlich brechen, ein Limit sprengen | Praxis |
| [Lab: Config & Secrets (Pluralsight)](06-lab-config-secrets.md) | Dieselben Themen als geführtes Lab auf gestellter Umgebung | Lab |
| [Lab: Probes & Ingress (Pluralsight)](07-lab-probes.md) | Probes als geführtes Lab, dazu Services und Ingress | Lab |
| [Hilfekarten](08-hilfekarten.md) | Abgestufte Hinweise, wenn etwas hakt | Referenz |
| [Rückblick & Ausblick](09-rueckblick.md) | Was du mitnimmst und wie es weitergeht | Referenz |

!!! tip "So arbeitest du dich durch"
    Der Theorieteil (die drei Theorieseiten) ist als **rund 45 Minuten Input** gedacht – danach geht es an die Praxis. Du hast **zwei Wege**, die dasselbe üben:

    - die **lokalen Übungen** auf deinem minikube ([Config & Secrets](03-praxis-config-secrets.md), [Probes & Limits](05-praxis-probes-limits.md)) – komplett angeleitet, mit eigener Aufgabe und Lösung,
    - oder die **geführten Labs auf der Lernplattform** ([Config & Secrets](06-lab-config-secrets.md), [Probes & Ingress](07-lab-probes.md)) – auf einer fertig gestellten Umgebung, ganz ohne eigene Installation.

    Beides deckt die Kernthemen ab. Nimm, was dir lieber ist – oder das Lab als Vertiefung nach der lokalen Übung.

---

## Voraussetzungen

- **Teil 1 sitzt.** Pod, Deployment, Service, `kubectl apply`, `port-forward` – wenn dir diese Begriffe etwas sagen, bist du bereit. Falls nicht: [Teil 1](../kubernetes-praxis/index.md) zuerst.
- Dein **lokaler Cluster läuft**. Schneller Check:

    ```bash
    kubectl get nodes
    ```

    Erwartet: ein Node mit Status `Ready`. Falls nicht, [minikube starten](../kubernetes-praxis/03-installation.md).
- Die **Projektdateien** liegen lokal. Die Manifeste dieses Blocks liegen in einem eigenen Ordner:

    ```bash
    git clone https://github.com/JacobMenge/kurs-unterlagen.git
    cd kurs-unterlagen/apps/kubernetes-aufbau
    ```

    Alle `kubectl apply`-Befehle in diesem Block gehen relativ von diesem Ordner aus (`manifests/...`).

---

## Leitfrage

> **Mein Dienst läuft im Cluster – aber wie mache ich ihn so, dass ich seine Konfiguration ändern kann ohne neues Image, dass Kubernetes einen kranken Pod selbst erkennt und dass ein einzelner Container nicht den ganzen Node mitreißt?**

Wer das am Ende mit ConfigMap, Secret, Probes und Limits beantworten kann, hat den Schritt von „läuft" zu „betriebsreif" gemacht.

---

## Weiter

- [Warum betriebsreif?](01-warum-betriebsreif.md) – der Einstieg
