---
title: "In die Cloud: Überblick"
description: "Vom lokalen minikube zum echten managed Cluster in der Cloud: warum der Schritt sich lohnt, was ein geführtes Hands-on-Lab ist und was du heute machst – Hauptaufgabe EKS auf AWS, optional GKE auf Google und ein Wiederholungs-Lab. Umgebung wird gestellt, keine Cloud-Kosten."
---

# In die Cloud: Überblick

!!! quote "Der Kerngedanke"
    Bisher lief dein Cluster auf dem **eigenen Laptop**. Jetzt läuft er auf einer echten Maschine in einem **Rechenzentrum**, betrieben von einem Cloud-Anbieter – dieselben Befehle, dieselbe Denkweise, nur nicht mehr auf deinem Rechner. Die Umgebung dafür bekommst du **fertig gestellt**: kein eigenes Cloud-Konto, keine Kosten, kein Aufbau von Hand.

## Wo wir herkommen

Im [lokalen Block](index.md) hast du mit **minikube** alles Wichtige einmal selbst gemacht: einen **Pod** gestartet, ein **Deployment** angelegt, es **skaliert** und **geheilt**, ein **Rolling Update** ausgerollt und mit einem **Service** eine stabile Adresse davor gelegt. Das lief komplett auf deinem Rechner, den Zugang hast du dir jedes Mal mit `kubectl port-forward` auf `localhost` gebaut. Genau richtig zum Lernen.

Nur läuft ein echter Betrieb eben **nicht** auf einem Laptop, sondern auf vielen echten Maschinen in einem Rechenzentrum. Diesen Schritt gehst du jetzt – und diesmal ist er auch **inhaltlich neu**: ein **managed** Cluster in der Cloud, mit einem echten **Load-Balancer, der eine öffentliche Adresse aus dem Internet bekommt**.

<figure>
<svg viewBox="0 0 660 230" width="100%" height="230" role="img" aria-label="Links dein Laptop mit minikube und Zugang über localhost, rechts ein echter Cluster in der Cloud, dessen Umgebung dir fertig gestellt wird">
  <text x="150" y="24" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="13">Bisher – dein Laptop</text>
  <rect x="40" y="40" width="220" height="128" rx="8" fill="rgba(125,255,154,0.04)" stroke="#56c374" stroke-width="2"/>
  <rect x="95" y="66" width="110" height="70" rx="6" fill="rgba(125,255,154,0.06)" stroke="#56c374" stroke-width="2"/>
  <text x="150" y="60" text-anchor="middle" fill="#8fa498" font-size="10">Node "minikube"</text>
  <rect x="112" y="84" width="34" height="30" rx="4" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <rect x="154" y="84" width="34" height="30" rx="4" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="150" y="156" text-anchor="middle" fill="#e0a05a" font-family="JetBrains Mono, monospace" font-size="11">Zugang: port-forward → localhost</text>

  <path d="M272 104 L388 104" fill="none" stroke="#7dff9a" stroke-width="2.5" marker-end="url(#clarr)"/>
  <text x="330" y="94" text-anchor="middle" fill="#7dff9a" font-size="11">in die Cloud</text>

  <text x="510" y="24" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="13">Jetzt – Cluster in der Cloud</text>
  <rect x="400" y="40" width="230" height="128" rx="8" fill="rgba(125,255,154,0.04)" stroke="#7dff9a" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="415" y="60" fill="#8fa498" font-size="10">Rechenzentrum</text>
  <rect x="418" y="66" width="92" height="70" rx="6" fill="rgba(125,255,154,0.06)" stroke="#56c374" stroke-width="2"/>
  <rect x="522" y="66" width="92" height="70" rx="6" fill="rgba(125,255,154,0.06)" stroke="#56c374" stroke-width="2"/>
  <rect x="432" y="84" width="30" height="28" rx="4" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <rect x="466" y="84" width="30" height="28" rx="4" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <rect x="536" y="84" width="30" height="28" rx="4" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <rect x="570" y="84" width="30" height="28" rx="4" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="515" y="156" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="11">Umgebung wird gestellt</text>

  <text x="330" y="200" text-anchor="middle" fill="#8fa498" font-size="12">Gleiche Befehle, gleiche Denkweise – nur nicht mehr auf deinem Rechner.</text>

  <defs><marker id="clarr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#7dff9a"/></marker></defs>
</svg>
<figcaption>Links dein bisheriger lokaler Cluster auf dem Laptop, rechts ein echter Cluster in der Cloud. Was du gelernt hast, gilt eins zu eins weiter – nur die Umgebung ist eine andere.</figcaption>
</figure>

---

## Selbst installiert oder managed

In der Cloud gibt es zwei Arten, an einen Cluster zu kommen:

| Weg | Wer betreibt die Steuerung? | Beispiel |
|---|---|---|
| **Selbst installiert** | Du richtest Kubernetes selbst auf einer Maschine ein. | dein lokales **minikube** – das hast du schon gemacht |
| **Managed** | Der Cloud-Anbieter betreibt die Steuerung für dich. Du bekommst einen fertigen Cluster und nutzt ihn nur. | **EKS** von AWS (heute) und **GKE** von Google (optional) |

!!! note "Kurz erklärt: was „managed" bedeutet"
    Ein Kubernetes-Cluster hat einen **Steuerungsteil** (er hält den Soll-Zustand, verteilt die Pods, überwacht alles) und die **Arbeiter-Knoten**, auf denen die Container laufen. Bei **managed Kubernetes** übernimmt der Anbieter den Steuerungsteil komplett – du musst ihn nicht selbst aufsetzen und warten. Bei AWS heißt dieser Dienst **EKS** (Elastic Kubernetes Service), bei Google **GKE** (Google Kubernetes Engine). Genau das nutzen große Betriebe, damit sich niemand um die Cluster-Steuerung von Hand kümmern muss.

---

## Was wir heute machen

Wir arbeiten mit den **geführten Hands-on-Labs** von Pluralsight. Jedes Lab bringt seine eigene, fertig eingerichtete Umgebung mit. Du musst nichts installieren – du brauchst nur einen Browser.

**1. Hauptaufgabe: [Deine App auf AWS mit EKS](12-praxis-eks.md).**
Das machst du heute. Du legst einen echten **EKS-Cluster** bei Amazon an, rollst eine Web-App darauf aus, machst sie über einen **Load-Balancer mit öffentlicher Adresse** aus dem Internet erreichbar und testest zum Schluss die **Selbstheilung**, indem du Server abschaltest und zusiehst, wie der Cluster sie ersetzt. Die vollständige deutsche Schritt-für-Schritt-Anleitung findest du auf der [EKS-Praxis-Seite](12-praxis-eks.md).

**2. Optional: [Dasselbe auf Google mit GKE](13-praxis-gke.md).**
Wer mit EKS schnell durch ist oder den Vergleich sehen will: dieselbe Idee auf Google Kubernetes Engine – ein Stück einfacher, ebenfalls deutsch begleitet. Kein Muss.

**3. Optional zum Wiederholen: [Guided: Deploy and Manage Your First App on Kubernetes](https://app.pluralsight.com/hands-on/labs/f6354a5d-bf65-4ac2-9945-b339ac6cec72).**
Wer den lokalen Stoff (Deployment, Service, skalieren, aufräumen) noch einmal in Ruhe festigen will, macht dieses Einsteiger-Lab – eine reine Wiederholung in der Cloud.

---

## Kosten und Zugang – kurz und beruhigend

!!! info "Was es dich kostet: nichts"
    Für dich entstehen **keine Cloud-Kosten** und **keine Rechnung**. Die Umgebung wird komplett von der Plattform gestellt und bezahlt. Du arbeitest mit **temporären Zugangsdaten** in einer fertig eingerichteten Lab-Umgebung – **ohne eigenes Cloud-Konto**. Nach Ablauf des Timers wird alles automatisch wieder aufgeräumt, auch der erzeugte Cluster. Es kann also nichts „aus Versehen weiterlaufen" und Geld kosten.

Das Einzige, was du brauchst, ist ein **Pluralsight-Zugang, der die Hands-on-Labs freischaltet**. Deine Zugangsdaten dafür bekommst du im Kurs.

---

## So läuft diese Einheit

1. **Kurze Theorie und Einordnung** – wir klären gemeinsam, worum es geht: managed Kubernetes, ein Cluster in der Cloud und ein Load-Balancer mit öffentlicher Adresse. So weißt du, was gleich passiert.
2. **Den Anfang gehen wir zusammen durch** – das [EKS-Lab](12-praxis-eks.md) starten, in AWS anmelden und den Cluster in Gang setzen. Der Cluster-Aufbau dauert 15-20 Minuten – die Zeit nutzen wir für die Erklärung.
3. **Dann selbst weiter** – ab da machst du die EKS-Anleitung in deinem Tempo zu Ende: App ausrollen, öffentlich erreichbar machen, Hochverfügbarkeit testen. Wir gehen herum und helfen, wo es hakt.
4. **Wer schnell durch ist oder lieber übt** – nimmt optional das [GKE-Lab](13-praxis-gke.md) oder das [Einsteiger-Lab](https://app.pluralsight.com/hands-on/labs/f6354a5d-bf65-4ac2-9945-b339ac6cec72) zum Wiederholen.

!!! quote "Mitnehmen"
    1. **Was du lokal gelernt hast, gilt in der Cloud eins zu eins.** Deployment, Service, `kubectl`, skalieren – dieselben Werkzeuge, nur auf echter Infrastruktur.
    2. **„Managed" nimmt dir die Cluster-Steuerung ab.** Bei EKS/GKE betreibt der Anbieter den Steuerungsteil, du nutzt den fertigen Cluster – so machen es echte Betriebe.
    3. **Der Load-Balancer bringt die App ins Internet.** Eine öffentliche Adresse vor den Pods – das ist der Schritt, der auf dem Laptop nicht ging.

---

## Voraussetzungen

- Ein **Pluralsight-Zugang**, der die Hands-on-Labs freischaltet (Zugangsdaten bekommst du im Kurs).
- Einen **Browser** – mehr nicht. Es wird nichts auf deinem Rechner installiert.
- Den [lokalen Kubernetes-Block](index.md) im Rücken: Pod, Deployment, Service und `kubectl` solltest du schon einmal selbst bedient haben.

---

## Weiter

- **Deine Hauptaufgabe:** [Praxis: Deine App auf AWS mit EKS](12-praxis-eks.md) – die vollständige Anleitung.
- [Optional: Dasselbe auf Google mit GKE](13-praxis-gke.md) – die Zusatzaufgabe.
- [Rückblick & Ausblick](10-rueckblick.md) – was du aus dem ganzen Kubernetes-Block mitnimmst und welche Themen von hier aus weiterführen.
