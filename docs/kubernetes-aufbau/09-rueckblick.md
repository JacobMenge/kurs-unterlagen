---
title: "Rückblick & Ausblick"
description: "Was du im Aufbau-Block mitnimmst: Konfiguration und Geheimnisse aus dem Image gelöst, Kubernetes prüfen lassen, ob die App gesund ist und den Ressourcenhunger begrenzt – die wichtigsten Merksätze und wie es von hier weitergeht (Ingress, Helm, Autoscaling)."
---

# Rückblick & Ausblick

Aus „mein Dienst läuft" ist „mein Dienst ist betriebsreif" geworden. Du hast dieselbe kleine App genommen und ihr drei Dinge mitgegeben, die im echten Betrieb den Unterschied machen: sie ist **konfigurierbar**, ihr Zustand ist **prüfbar** und ihr Verbrauch ist **begrenzt**.

---

## Was du gelernt hast

Du hast an einem echten Cluster alle Handgriffe einmal selbst gemacht. Konkret hast du:

- Konfiguration in eine **ConfigMap** und ein Geheimnis in ein **Secret** gelegt und beide per `envFrom` in den Container gereicht – dieselbe App, andere Werte, **ohne neues Image**,
- ein **Secret als bloßes base64** entlarvt und verstanden, dass es der richtige Ort für Passwörter ist, aber keine Verschlüsselung,
- eine Konfigurationsänderung per **`kubectl rollout restart`** bewusst ausgerollt,
- **readiness**- und **liveness**-Probes eingebaut und beide absichtlich gebrochen: die kaputte readiness-Probe hat den **Rollout gestoppt** (0/1, alte Pods bedienen weiter), die kaputte liveness-Probe hat den Container **neu gestartet** (RESTARTS steigt),
- **Requests und Limits** gesetzt und ein Speicher-Limit bis **`OOMKilled`** gesprengt – und gesehen, dass eine zu hohe request den Pod in **`Pending`** hält.

---

## Die drei wichtigsten Merksätze

!!! quote "Mitnehmen"
    1. **Konfiguration gehört nicht ins Image.** ConfigMap für offene Werte, Secret für Geheimnisse – dieselbe App läuft so in jeder Umgebung anders, ohne neu gebaut zu werden. Und: ein Secret ist base64, **nicht** verschlüsselt.
    2. **Kubernetes weiß nur so viel über deine App, wie du es prüfen lässt.** readiness steuert den Verkehr (bereit oder nicht), liveness entscheidet über den Neustart (lebt oder hängt). Eine gute readiness-Probe ist zugleich deine Rollout-Bremse.
    3. **Jeder Container braucht eine Zusage und eine Grenze.** request plant ein, limit deckelt. Zu knapp bringt `OOMKilled`, zu großzügig bringt `Pending` – betriebsreif heißt, beides bewusst zu wählen.

---

## Wie es weitergeht

Du hast den Dienst betriebsreif gemacht. Von hier führen mehrere Wege weiter – jeder ein eigenes Thema:

!!! info "Ab hier: nach außen und automatisch"
    Bisher erreichst du deine App über `port-forward` – gut zum Üben, aber nichts für den echten Betrieb. Der nächste große Schritt ist ein sauberer **Zugang von außen** und mehr **Automatik**.

- **Ingress** – regelt das HTTP-Routing von außen: mehrere Dienste unter sauberen Adressen und Pfaden, mit echtem DNS und TLS, statt für jeden ein `port-forward`. In minikube probierst du das mit dem Ingress-Addon.
- **Helm** – ein Paketmanager für Kubernetes: fertige Anwendungen aus vorgefertigten Paketen installieren, statt jedes Manifest von Hand zu schreiben.
- **Autoscaling (HPA)** – der **Horizontal Pod Autoscaler** ändert die `replicas` automatisch anhand der Last. Deine `requests` aus diesem Block sind genau die Grundlage, auf der er rechnet.
- **Persistente Daten** – **PersistentVolumes** und **StatefulSets** für Dienste, die Daten behalten müssen (Datenbanken), statt bei jedem Neustart von vorn zu beginnen.
- **In der Cloud** – all das auf einem echten Managed-Cluster erproben: die [Cloud-Labs](../kubernetes-praxis/11-cloud-labs.md) aus Teil 1.

!!! tip "Eins nach dem anderen"
    Lass dich von der Liste nicht erschlagen. Wichtig ist, dass du die **Bausteine** eines betriebsreifen Dienstes kennst – Konfiguration, Gesundheit, Ressourcen. Darauf baut alles Weitere auf.

---

## Leitfrage – nochmal

> **Mein Dienst läuft im Cluster – aber wie mache ich ihn so, dass ich seine Konfiguration ändern kann ohne neues Image, dass Kubernetes einen kranken Pod selbst erkennt und dass ein einzelner Container nicht den ganzen Node mitreißt?**

Die Antwort hast du selbst gebaut:

- **Konfiguration ändern ohne neues Image?** ConfigMap und Secret per `envFrom`, Änderung mit `kubectl rollout restart` ausrollen.
- **Kranken Pod erkennen?** readiness (bereit für Verkehr) und liveness (lebt noch) – Kubernetes prüft selbst und reagiert.
- **Nicht den Node mitreißen?** requests und limits – wer sein Limit sprengt, wird allein beendet (`OOMKilled`), der Rest bleibt verschont.

---

## Geschafft

Du hast einen laufenden Dienst betriebsreif gemacht: konfigurierbar, überwacht und begrenzt. Das sind die Bausteine, mit denen in echten Betrieben produktive Dienste laufen. Zum Nachschlagen geht es zurück zum [Überblick](index.md) oder zu den [Hilfekarten](08-hilfekarten.md) – und wenn du weiter willst, wartet der Weg [in die Cloud](../kubernetes-praxis/11-cloud-labs.md).
