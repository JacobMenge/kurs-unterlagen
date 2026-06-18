---
title: "Services und Netzwerk"
description: "Warum Pods sterblich sind und ihre IP wechselt, wie ein Service eine stabile Adresse plus Load-Balancing liefert, was Labels, Selektoren, Cluster-DNS, Service-Typen und Endpoints bedeuten – mit dem Service-Manifest Zeile für Zeile."
---

# Services und Netzwerk

In [Praxis 2](06-praxis-deployment.md) hast du einen Pod gelöscht – und Kubernetes hat sofort einen neuen gestartet. Das war Selbstheilung in Aktion. Aber dir ist vielleicht etwas aufgefallen: Der neue Pod hatte einen **anderen Namen** und eine **andere IP-Adresse**. Genau hier beginnt das Problem dieser Seite.

!!! quote "Der Kerngedanke"
    Pods kommen und gehen – ihre Adressen auch. Trotzdem soll deine App **zuverlässig erreichbar** sein. Die Lösung heißt **Service**: eine feste Tür vor einer wechselnden Menge von Pods.

---

## Das Problem: Pods sind sterblich

Erinnere dich an den Merksatz aus den [Grundbegriffen](02-grundbegriffe.md): **Pods sind sterblich.** Ein Pod kann jederzeit verschwinden – weil er abstürzt, weil sein Node gewartet wird oder weil du herunterskalierst. Kubernetes startet dann Ersatz – aber dieser neue Pod bekommt eine **neue IP-Adresse** im Cluster.

Stell dir vor, du würdest die IP eines Pods irgendwo fest eintragen – im Code eines anderen Dienstes, in einer Konfigurationsdatei. Was passiert, sobald dieser Pod stirbt?

<figure>
<svg viewBox="0 0 600 250" width="100%" height="250" role="img" aria-label="Vorher und nachher: ein Pod mit fester IP stirbt, der Ersatz-Pod bekommt eine neue IP, die fest verdrahtete alte Adresse zeigt ins Leere">
  <!-- Vorher -->
  <text x="150" y="26" text-anchor="middle" fill="#8fa498" font-size="12">Vorher</text>
  <rect x="75" y="44" width="150" height="58" rx="6" fill="rgba(125,255,154,0.06)" stroke="#56c374" stroke-width="2"/>
  <text x="150" y="70" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="12">Pod hello-3kd</text>
  <text x="150" y="90" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="11">IP 10.244.0.17</text>

  <rect x="90" y="160" width="120" height="36" rx="5" fill="rgba(122,162,255,0.10)" stroke="#7aa2ff" stroke-width="1.5"/>
  <text x="150" y="176" text-anchor="middle" fill="#7aa2ff" font-size="10">fest verdrahtet</text>
  <text x="150" y="189" text-anchor="middle" fill="#8fa498" font-size="9">auf 10.244.0.17</text>
  <path d="M150 160 L150 105" fill="none" stroke="#7aa2ff" stroke-width="2" marker-end="url(#okv)"/>

  <!-- Uebergang -->
  <text x="300" y="62" text-anchor="middle" fill="#e0a05a" font-size="11">stirbt,</text>
  <text x="300" y="76" text-anchor="middle" fill="#8fa498" font-size="10">Ersatz startet</text>
  <path d="M225 91 L372 91" fill="none" stroke="#e0a05a" stroke-width="2.5" marker-end="url(#transv)"/>

  <!-- Nachher -->
  <text x="450" y="26" text-anchor="middle" fill="#8fa498" font-size="12">Nachher: Pod neu gestartet</text>
  <rect x="375" y="63" width="150" height="56" rx="6" fill="rgba(125,255,154,0.06)" stroke="#56c374" stroke-width="2"/>
  <text x="450" y="87" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="12">Pod hello-9xz</text>
  <text x="450" y="106" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="11">IP 10.244.0.31</text>

  <!-- toter alter IP-Verweis -->
  <rect x="375" y="142" width="150" height="40" rx="6" fill="rgba(224,108,108,0.05)" stroke="#e06c6c" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="450" y="160" text-anchor="middle" fill="#e06c6c" font-family="JetBrains Mono, monospace" font-size="11">10.244.0.17</text>
  <text x="450" y="174" text-anchor="middle" fill="#e06c6c" font-size="9">gibt es nicht mehr</text>
  <line x1="388" y1="148" x2="512" y2="176" stroke="#e06c6c" stroke-width="2"/>
  <line x1="512" y1="148" x2="388" y2="176" stroke="#e06c6c" stroke-width="2"/>

  <rect x="390" y="206" width="120" height="36" rx="5" fill="rgba(122,162,255,0.10)" stroke="#7aa2ff" stroke-width="1.5"/>
  <text x="450" y="222" text-anchor="middle" fill="#7aa2ff" font-size="10">fest verdrahtet</text>
  <text x="450" y="235" text-anchor="middle" fill="#8fa498" font-size="9">auf 10.244.0.17</text>
  <path d="M450 206 L450 185" fill="none" stroke="#e06c6c" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#deadv)"/>

  <defs>
    <marker id="okv" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#7aa2ff"/></marker>
    <marker id="transv" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#e0a05a"/></marker>
    <marker id="deadv" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#e06c6c"/></marker>
  </defs>
</svg>
<figcaption>Die Pod-IP gehört dem Pod nur, solange er lebt. Stirbt hello-3kd, bekommt der Ersatz hello-9xz eine neue IP – wer fest auf 10.244.0.17 verdrahtet war, zeigt jetzt ins Leere.</figcaption>
</figure>

Die alte Adresse zeigt ins Leere. Jeder, der sie kannte, läuft jetzt gegen eine Wand. **Eine Pod-IP fest zu verdrahten geht also nicht** – sie ist genauso kurzlebig wie der Pod selbst.

!!! note "Kurz erklärt: warum Pods überhaupt neue IPs bekommen"
    Kubernetes vergibt jede Pod-IP frisch beim Start aus einem Pool – ähnlich wie dein Router im Heimnetz Geräten per DHCP Adressen zuteilt. Eine IP gehört dem Pod nur, solange er lebt. Stirbt er, wandert die Adresse zurück in den Pool und der nächste Pod bekommt irgendeine andere. Deshalb braucht es eine Schicht **darüber**, die stabil bleibt.

---

## Der Service: stabile Adresse plus Load-Balancing

Die Lösung ist der **Service**. Das Bild dazu kennst du schon aus den [Grundbegriffen](02-grundbegriffe.md#service-die-stabile-adresse): Der Service ist die feste Tür, dahinter dürfen Pods kommen und gehen. Ein Service hat genau **zwei Jobs**:

1. **stabil erreichbar bleiben** – er hat einen festen Namen und eine gleichbleibende IP im Cluster, egal wie oft die Pods dahinter neu starten.
2. **die Last verteilen** – Anfragen verteilt er reihum auf **alle** passenden Pods (Load-Balancing).

<figure>
<svg viewBox="0 0 560 250" width="100%" height="250" role="img" aria-label="Ein Client schickt Anfragen an einen Service, der sie auf drei wechselnde Pods verteilt">
  <!-- Client -->
  <circle cx="60" cy="125" r="30" fill="rgba(122,162,255,0.12)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="60" y="122" text-anchor="middle" fill="#7aa2ff" font-size="12">Client</text>
  <text x="60" y="138" text-anchor="middle" fill="#8fa498" font-size="10">Anfrage</text>

  <!-- Service -->
  <rect x="170" y="92" width="140" height="66" rx="8" fill="rgba(125,255,154,0.1)" stroke="#7dff9a" stroke-width="2.5"/>
  <text x="240" y="118" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold">Service "hello"</text>
  <text x="240" y="137" text-anchor="middle" fill="#8fa498" font-size="11">stabiler Name + feste IP</text>
  <text x="240" y="150" text-anchor="middle" fill="#8fa498" font-size="11">verteilt die Last</text>

  <path d="M92 125 L170 125" fill="none" stroke="#7aa2ff" stroke-width="2" marker-end="url(#sv)"/>

  <!-- drei Pods -->
  <rect x="400" y="30" width="130" height="48" rx="6" fill="rgba(125,255,154,0.06)" stroke="#56c374" stroke-width="2"/>
  <text x="465" y="52" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="11">Pod hello-7f9</text>
  <text x="465" y="67" text-anchor="middle" fill="#8fa498" font-size="10">app=hello</text>

  <rect x="400" y="101" width="130" height="48" rx="6" fill="rgba(125,255,154,0.06)" stroke="#56c374" stroke-width="2"/>
  <text x="465" y="123" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="11">Pod hello-2c4</text>
  <text x="465" y="138" text-anchor="middle" fill="#8fa498" font-size="10">app=hello</text>

  <rect x="400" y="172" width="130" height="48" rx="6" fill="rgba(125,255,154,0.06)" stroke="#56c374" stroke-width="2"/>
  <text x="465" y="194" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="11">Pod hello-a1b</text>
  <text x="465" y="209" text-anchor="middle" fill="#8fa498" font-size="10">app=hello</text>

  <path d="M310 118 L400 54" fill="none" stroke="#56c374" stroke-width="2" marker-end="url(#sv)"/>
  <path d="M310 125 L400 125" fill="none" stroke="#56c374" stroke-width="2" marker-end="url(#sv)"/>
  <path d="M310 132 L400 196" fill="none" stroke="#56c374" stroke-width="2" marker-end="url(#sv)"/>

  <defs><marker id="sv" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#56c374"/></marker></defs>
</svg>
<figcaption>Der Client kennt nur den Service. Dahinter dürfen Pods sterben und neu starten – die Anfrage trifft immer einen lebenden Pod, die Last verteilt sich von selbst.</figcaption>
</figure>

!!! note "Kurz erklärt: was „Load-Balancing" hier heißt"
    **Load-Balancing** bedeutet: eingehende Anfragen werden gleichmäßig auf mehrere gleiche Pods verteilt, statt alle auf einen einzigen zu schicken. So teilt sich die Arbeit auf – und fällt ein Pod aus, schickt der Service einfach an die anderen weiter. Du musst dafür nichts einstellen: Jeder Service in Kubernetes verteilt automatisch.

---

## Labels und Selektoren

Woher weiß der Service, **welche** Pods zu ihm gehören? Über **Labels**. Das ist das wichtigste Bindemittel in Kubernetes.

Ein **Label** ist eine einfache Markierung an einem Objekt – ein Schlüssel-Wert-Paar wie `app: hello`. Deine Pods aus dem Deployment tragen genau dieses Label (es steht in der Pod-Vorlage des Deployments). Der Service hat einen **Selektor**, der sagt: „Schick alles an Pods mit dem Label `app: hello`."

<figure>
<svg viewBox="0 0 560 250" width="100%" height="250" role="img" aria-label="Der Service-Selektor app: hello trifft die drei Pods mit diesem Label, ein Pod mit anderem Label wird nicht bedient">
  <!-- Service / Selektor -->
  <rect x="25" y="92" width="160" height="74" rx="8" fill="rgba(125,255,154,0.1)" stroke="#7dff9a" stroke-width="2.5"/>
  <text x="105" y="116" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold">Service</text>
  <text x="105" y="136" text-anchor="middle" fill="#8fa498" font-size="11">selector:</text>
  <text x="105" y="153" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="12">app: hello</text>

  <!-- Pods -->
  <rect x="370" y="18" width="165" height="40" rx="6" fill="rgba(125,255,154,0.06)" stroke="#56c374" stroke-width="2"/>
  <text x="396" y="43" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="12">Pod</text>
  <text x="470" y="43" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="11">app=hello</text>

  <rect x="370" y="70" width="165" height="40" rx="6" fill="rgba(125,255,154,0.06)" stroke="#56c374" stroke-width="2"/>
  <text x="396" y="95" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="12">Pod</text>
  <text x="470" y="95" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="11">app=hello</text>

  <rect x="370" y="122" width="165" height="40" rx="6" fill="rgba(125,255,154,0.06)" stroke="#56c374" stroke-width="2"/>
  <text x="396" y="147" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="12">Pod</text>
  <text x="470" y="147" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="11">app=hello</text>

  <rect x="370" y="186" width="165" height="40" rx="6" fill="rgba(143,164,152,0.05)" stroke="#8fa498" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="396" y="211" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="12">Pod</text>
  <text x="468" y="211" text-anchor="middle" fill="#e06c6c" font-family="JetBrains Mono, monospace" font-size="11">app=andere</text>

  <!-- Pfeile, die passen -->
  <path d="M185 120 L368 38" fill="none" stroke="#56c374" stroke-width="2" marker-end="url(#gsel)"/>
  <path d="M185 127 L368 90" fill="none" stroke="#56c374" stroke-width="2" marker-end="url(#gsel)"/>
  <path d="M185 134 L368 142" fill="none" stroke="#56c374" stroke-width="2" marker-end="url(#gsel)"/>
  <!-- Pfeil, der nicht passt -->
  <path d="M185 150 L360 206" fill="none" stroke="#e06c6c" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#rsel)"/>
  <line x1="266" y1="168" x2="282" y2="184" stroke="#e06c6c" stroke-width="2.5"/>
  <line x1="282" y1="168" x2="266" y2="184" stroke="#e06c6c" stroke-width="2.5"/>

  <text x="300" y="22" text-anchor="middle" fill="#56c374" font-size="10">passt</text>
  <text x="300" y="242" text-anchor="middle" fill="#e06c6c" font-size="10">passt nicht</text>

  <defs>
    <marker id="gsel" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#56c374"/></marker>
    <marker id="rsel" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#e06c6c"/></marker>
  </defs>
</svg>
<figcaption>Die Verbindung ist keine feste Liste, sondern eine laufende Frage: Welche Pods tragen gerade das Label app: hello? Nur die bekommen Anfragen – ein Pod mit anderem Label bleibt außen vor.</figcaption>
</figure>

Das Schöne daran: Die Verbindung ist **nicht fest verdrahtet**, sondern eine **laufende Frage**. Der Service prüft ständig: „Welche Pods tragen gerade das Label `app: hello`?" Skalierst du das Deployment von 3 auf 5 Pods hoch, tragen die zwei neuen Pods dasselbe Label – und der Service nimmt sie **automatisch** mit auf. Stirbt einer, fällt er ebenso automatisch wieder raus. Niemand muss eine Liste pflegen.

!!! note "Kurz erklärt: Labels sind das Klebeband in Kubernetes"
    Labels verbinden Dinge, ohne sie fest aneinanderzuketten. Ein Service findet seine Pods über ein Label, ein Deployment verwaltet seine Pods über ein Label, du selbst filterst mit `kubectl get pods -l app=hello`. Statt feste Verweise zu pflegen, beschreibst du nur: „alles mit diesem Stempel gehört zusammen." Genau diese Lockerheit macht das automatische Mitwachsen erst möglich.

!!! tip "Selektor und Label müssen zusammenpassen"
    Wenn ein Service „nichts findet", liegt es fast immer daran, dass sein **Selektor** nicht zum **Label** der Pods passt – ein Tippfehler, ein falscher Wert. Beide Seiten müssen exakt dasselbe sagen. Wie du das prüfst, steht in [Hilfekarte 7](09-hilfekarten.md#hilfekarte-7-service-liefert-nichts-labels-und-selektor).

---

## Cluster-DNS

Eine feste IP ist gut – aber Menschen merken sich schlecht Zahlen. Deshalb hat Kubernetes ein eigenes **DNS** eingebaut: Jeder Service ist im Cluster **unter seinem Namen** erreichbar.

Heißt dein Service `hello`, dann erreicht ein anderer Pod im selben Namespace ihn einfach unter dem Namen `hello` (ein **Namespace** ist nur ein Abteil im Cluster, in dem Objekte zusammen wohnen – bei uns das Standard-Abteil `default`):

```text
  curl http://hello        ->  trifft den Service "hello"
                               -> der verteilt an einen der hello-Pods
```

Voll ausgeschrieben lautet der Name `hello.default.svc.cluster.local` – das liest sich von links nach rechts so:

<figure>
<svg viewBox="0 0 580 150" width="100%" height="150" role="img" aria-label="Zerlegung des DNS-Namens hello.default.svc.cluster.local in seine vier Bestandteile">
  <!-- Chips -->
  <rect x="40" y="26" width="78" height="34" rx="6" fill="rgba(125,255,154,0.12)" stroke="#7dff9a" stroke-width="2"/>
  <text x="79" y="48" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="13">hello</text>
  <text x="128" y="48" text-anchor="middle" fill="#8fa498" font-size="14">.</text>
  <rect x="140" y="26" width="98" height="34" rx="6" fill="rgba(125,255,154,0.04)" stroke="#56c374" stroke-width="2"/>
  <text x="189" y="48" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="13">default</text>
  <text x="248" y="48" text-anchor="middle" fill="#8fa498" font-size="14">.</text>
  <rect x="260" y="26" width="58" height="34" rx="6" fill="rgba(125,255,154,0.04)" stroke="#56c374" stroke-width="2"/>
  <text x="289" y="48" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="13">svc</text>
  <text x="328" y="48" text-anchor="middle" fill="#8fa498" font-size="14">.</text>
  <rect x="340" y="26" width="150" height="34" rx="6" fill="rgba(125,255,154,0.04)" stroke="#56c374" stroke-width="2"/>
  <text x="415" y="48" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="13">cluster.local</text>

  <!-- Fuehrungslinien + Erklaerungen -->
  <line x1="79" y1="60" x2="79" y2="86" stroke="#8fa498" stroke-width="1"/>
  <text x="79" y="102" text-anchor="middle" fill="#8fa498" font-size="11">Name des</text>
  <text x="79" y="116" text-anchor="middle" fill="#8fa498" font-size="11">Service</text>

  <line x1="189" y1="60" x2="189" y2="86" stroke="#8fa498" stroke-width="1"/>
  <text x="189" y="102" text-anchor="middle" fill="#8fa498" font-size="11">Namespace</text>
  <text x="189" y="116" text-anchor="middle" fill="#8fa498" font-size="11">(hier: default)</text>

  <line x1="289" y1="60" x2="289" y2="86" stroke="#8fa498" stroke-width="1"/>
  <text x="289" y="102" text-anchor="middle" fill="#8fa498" font-size="11">es ist ein</text>
  <text x="289" y="116" text-anchor="middle" fill="#8fa498" font-size="11">Service</text>

  <line x1="415" y1="60" x2="415" y2="86" stroke="#8fa498" stroke-width="1"/>
  <text x="415" y="102" text-anchor="middle" fill="#8fa498" font-size="11">Cluster-interne</text>
  <text x="415" y="116" text-anchor="middle" fill="#8fa498" font-size="11">Domain (fest)</text>
</svg>
<figcaption>Von links nach rechts: der Name des Service, sein Namespace, die Kennung für Services und die feste Cluster-Domain. Im selben Namespace genügt der kurze Name hello.</figcaption>
</figure>

Im selben Namespace genügt der kurze Name `hello`. Erst über Namespace-Grenzen hinweg brauchst du die längere Form. So **finden sich Dienste gegenseitig ohne eine einzige IP** – eine App ruft `http://datenbank` auf und landet beim Service `datenbank`, egal wo dessen Pods gerade laufen.

!!! note "Kurz erklärt: das kennst du schon von Docker Compose"
    Im Compose-Block hast du Dienste über ihren **Service-Namen** angesprochen, statt über IPs – `http://prometheus:9090` zum Beispiel. Kubernetes macht genau dasselbe, nur clusterweit über viele Rechner: Der Service-Name ist die Adresse, das Cluster-DNS löst ihn zur aktuellen Service-IP auf. Derselbe Gedanke, größere Bühne.

---

## Service-Typen

Ein Service kann auf verschiedene Arten erreichbar sein. Es gibt drei Typen – für unsere Übung brauchst du vor allem den ersten:

| Typ | Wer erreicht den Service? | Wann? |
|---|---|---|
| **ClusterIP** | nur Pods **innerhalb** des Clusters | Standard – Dienste, die nur cluster-intern reden |
| **NodePort** | von **außen** über einen Port am Knoten | zum Testen, einfacher Zugang von außen |
| **LoadBalancer** | von außen über einen echten Load-Balancer | in der **Cloud**, für öffentliche Dienste |

!!! tip "Für die Praxis: ClusterIP + port-forward"
    Merke dir die einfache Regel für diesen Block: **ClusterIP als Typ, `kubectl port-forward` zum Reinschauen.** Damit erreichst du jede App im Browser unter `http://localhost:8080`, egal mit welchem lokalen Cluster du arbeitest. NodePort ist nur ein optionaler Bonus.

Die drei Typen genauer:

**ClusterIP** (der Standard) erreichst du von außen – also von deinem Browser – zuverlässig mit **`kubectl port-forward`**. Das klappt überall gleich – egal ob minikube oder Docker Desktop – und genau das nutzen wir in [Praxis 3](08-praxis-service.md).

**NodePort** öffnet zusätzlich einen festen Port (im Bereich 30000–32767) am Cluster-Knoten – darüber kommst du von außen direkt rein. Bei minikube findest du die Adresse mit `minikube service hello --url`. Das zeigen wir als klar markierten **Bonus**.

**LoadBalancer** ergibt erst in der **Cloud** Sinn: Dort fordert Kubernetes beim Anbieter (AWS, Azure, Google) einen echten Load-Balancer mit öffentlicher IP an. Lokal hast du den nicht – deshalb spielt dieser Typ in unseren Übungen keine Rolle.

!!! note "Kurz erklärt: port-forward trifft nur EINEN Pod"
    `kubectl port-forward` baut einen direkten Tunnel von deinem Rechner zu **einem** Pod auf. Das ist super zum Reinschauen – aber das **Load-Balancing siehst du damit nicht**, weil immer derselbe Pod antwortet. Die Verteilung über alle Pods passiert **cluster-intern**: Dafür sorgt auf jedem Knoten ein eingebauter Baustein namens **kube-proxy**. Erst wenn du den Service von einem anderen Pod im Cluster aus aufrufst, wechseln die antwortenden Pod-Namen durch. Genau diesen Trick machst du in [Praxis 3](08-praxis-service.md) sichtbar.

---

## Endpoints – wer steckt wirklich dahinter

Der Service ist die Vorderseite. Aber welche konkreten Pods stecken in diesem Moment dahinter? Das zeigen dir die **Endpoints**:

```bash
kubectl get endpoints hello
```

Die Ausgabe listet die **aktuellen Pod-IPs** auf, die der Service bedient:

```text
NAME    ENDPOINTS                                   AGE
hello   10.244.0.17:80,10.244.0.31:80,10.244.0.42:80   2m
```

Drei IPs, weil gerade drei Pods das Label `app: hello` tragen. Das Spannende: Diese Liste ist **lebendig**. Skalierst du auf fünf Pods hoch, stehen kurz darauf fünf IPs drin. Löschst du einen Pod, verschwindet seine IP und die des Ersatz-Pods erscheint. Die Endpoints **wachsen und schrumpfen mit der Pod-Zahl** – vollautomatisch, weil sie sich am Label entlanghangeln.

!!! note "Kurz erklärt: Service, Selektor, Endpoints – das Zusammenspiel"
    Drei Dinge greifen ineinander: Der **Service** ist die stabile Adresse. Sein **Selektor** (`app: hello`) ist die Suchanfrage „wen meine ich?". Die **Endpoints** sind das laufend aktualisierte Ergebnis dieser Suche – die Liste der gerade passenden Pod-IPs. Stehen dort keine Einträge, findet der Service keine passenden Pods. Das ist beim Fehlersuchen der erste Blick: `kubectl get endpoints <name>` zeigt sofort, ob überhaupt jemand dahintersteht.

---

## Das Service-Manifest Zeile für Zeile

Hier ist das fertige Manifest aus `apps/kubernetes-praxis/manifests/hello-service.yaml`. Gehen wir es durch:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello
spec:
  type: ClusterIP            # nur im Cluster erreichbar (Standard)
  selector:
    app: hello               # schickt Anfragen an alle Pods mit diesem Label
  ports:
    - port: 80               # unter diesem Port ist der Service erreichbar
      targetPort: 80         # dorthin leitet er weiter (Container-Port)
```

Was die Zeilen bedeuten:

| Zeile | Bedeutung |
|---|---|
| `apiVersion: v1` | Services gehören zur Kern-API – Version `v1` (nicht `apps/v1` wie beim Deployment). |
| `kind: Service` | Wir legen ein **Service**-Objekt an. |
| `metadata.name: hello` | Der Name – **genau** dieser Name ist im Cluster-DNS erreichbar (`http://hello`). |
| `spec.type: ClusterIP` | Der Typ. `ClusterIP` = nur intern erreichbar, der Standard. |
| `spec.selector.app: hello` | Der **Selektor**: bediene alle Pods mit dem Label `app: hello`. |
| `spec.ports.port: 80` | Der **Service-Port** – unter diesem Port nimmt der Service Anfragen an. |
| `spec.ports.targetPort: 80` | Der **Ziel-Port** im Container – dorthin leitet der Service weiter. |

!!! note "Kurz erklärt: port und targetPort dürfen sich unterscheiden"
    `port` ist die Tür **am Service**, `targetPort` ist die Tür **am Container** dahinter. Bei uns sind beide `80`, also fällt der Unterschied nicht auf. Aber sie **dürfen** verschieden sein: Du könntest den Service auf `port: 8080` lauschen lassen und ihn intern auf `targetPort: 80` weiterleiten lassen. Anrufer sprechen dann `hello:8080` an, der Container hört weiterhin auf `80`. Der Service übersetzt dazwischen – wie eine Telefonzentrale, die einen Anruf auf den richtigen Apparat durchstellt.

!!! warning "Merksatz"
    Der **Selektor** des Service muss zum **Label** der Pods passen, sonst stehen die Endpoints leer und der Service liefert nichts. Beide sagen hier `app: hello` – diese Übereinstimmung ist die ganze Magie.

---

## Weiter

- [Praxis 3: Service](08-praxis-service.md) – jetzt legst du den Service an, machst die App im Browser erreichbar und machst das Load-Balancing über viele Pods sichtbar.
- [Hilfekarte 7: Service liefert nichts](09-hilfekarten.md#hilfekarte-7-service-liefert-nichts-labels-und-selektor) – falls Selektor und Label einmal nicht zusammenpassen.
