---
title: "Probes & Limits"
description: "Die zwei anderen Lücken: Health-Probes lassen Kubernetes selbst prüfen, ob ein Pod bereit (readiness) und lebendig (liveness) ist – readiness hält Anfragen zurück, liveness startet einen hängenden Container neu. Requests und Limits legen fest, wie viel ein Container reserviert bekommt und höchstens nehmen darf – wer das Speicher-Limit sprengt, wird OOMKilled."
---

# Probes & Limits

Die erste Lücke ist zu – Konfiguration lebt jetzt außerhalb des Images. Bleiben zwei: Kubernetes soll **erkennen, ob deine App gesund ist** – und **verhindern, dass ein Container den Node auffrisst**. Beides sind wenige Zeilen im Pod-Template und beide siehst du in der nächsten Praxis live.

---

## Teil 1: Health-Probes – ist die App gesund?

Bisher weiß Kubernetes nur: **läuft der Prozess?** Das ist zu wenig. Deshalb kann es **selbst nachfragen** – regelmäßig, mit einer kleinen Prüfung, die du festlegst. Es gibt zwei Fragen und sie sind **nicht** dasselbe:

- **readiness** – *„Bist du **bereit**, Anfragen zu bekommen?"* Fällt sie negativ aus, nimmt Kubernetes den Pod aus der Verteilung – er bekommt **keine** Anfragen mehr, wird aber **nicht** neu gestartet. Sobald er wieder bereit meldet, ist er zurück.
- **liveness** – *„**Lebst** du noch, oder hängst du?"* Fällt sie mehrfach hintereinander negativ aus, **startet Kubernetes den Container neu**.

<figure>
<svg viewBox="0 0 640 250" width="100%" height="250" role="img" aria-label="Readiness ist ein Tuersteher, der Anfragen erst durchlaesst wenn der Pod bereit ist; liveness ist ein Pulsmesser, der bei Stillstand neu startet">
  <!-- readiness -->
  <text x="160" y="30" text-anchor="middle" fill="#7aa2ff" font-family="system-ui, sans-serif" font-size="14" font-weight="800">readiness = Türsteher</text>
  <text x="60" y="95" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="12">Anfrage</text>
  <text x="92" y="97" text-anchor="middle" fill="#7dff9a" font-size="20">→</text>
  <rect x="112" y="70" width="30" height="52" rx="4" fill="rgba(224,179,92,0.15)" stroke="#e0b35c" stroke-width="2"/>
  <text x="127" y="140" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="10">Tür</text>
  <rect x="180" y="66" width="90" height="60" rx="6" fill="rgba(46,158,91,0.14)" stroke="#2e9e5b" stroke-width="2"/>
  <text x="225" y="92" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="12">Pod</text>
  <text x="225" y="110" text-anchor="middle" fill="#2e9e5b" font-family="system-ui, sans-serif" font-size="11">bereit</text>
  <text x="160" y="165" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">nicht bereit → Tür bleibt zu,</text>
  <text x="160" y="182" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">keine Anfragen, kein Neustart</text>

  <!-- Trennlinie -->
  <line x1="330" y1="45" x2="330" y2="195" stroke="#3a4658" stroke-width="1"/>

  <!-- liveness -->
  <text x="490" y="30" text-anchor="middle" fill="#7aa2ff" font-family="system-ui, sans-serif" font-size="14" font-weight="800">liveness = Pulsmesser</text>
  <polyline points="380,100 405,100 415,78 428,122 440,100 470,100" fill="none" stroke="#7dff9a" stroke-width="2"/>
  <text x="425" y="140" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">Puls da → alles gut</text>
  <polyline points="500,100 600,100" fill="none" stroke="#e06c6c" stroke-width="2"/>
  <text x="550" y="140" text-anchor="middle" fill="#e06c6c" font-family="system-ui, sans-serif" font-size="11">flach → Neustart</text>
  <text x="490" y="182" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">hängt der Container, wird er erneuert</text>

  <text x="320" y="225" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="12">readiness steuert den Verkehr · liveness entscheidet über Neustart</text>
</svg>
<figcaption>Zwei verschiedene Fragen: readiness ist der Türsteher, der Anfragen erst durchlässt, wenn der Pod bereit ist. liveness ist der Pulsmesser, der einen hängenden Container neu startet.</figcaption>
</figure>

### Wie eine Probe aussieht

Am gebräuchlichsten ist die **HTTP-Probe**: Kubernetes ruft regelmäßig eine URL im Container auf. Antwortet sie mit einem Erfolgscode (200–399), gilt die Probe als bestanden. So steht es im Pod-Template:

```yaml
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 2      # erste Prüfung 2s nach dem Start
            periodSeconds: 5            # danach alle 5s
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
            failureThreshold: 3         # erst nach 3 Fehlversuchen neu starten
```

!!! note "Kurz erklärt: die drei Zahlen an einer Probe"
    - **`initialDelaySeconds`** – Schonfrist nach dem Start. Manche Apps brauchen ein paar Sekunden zum Hochfahren; so lange wird nicht geprüft.
    - **`periodSeconds`** – wie oft geprüft wird.
    - **`failureThreshold`** – wie viele Fehlversuche in Folge nötig sind, bis die Probe als „gescheitert" gilt. Bei liveness bewahrt das vor Neustarts wegen eines einzelnen Aussetzers.

    Neben `httpGet` gibt es noch `tcpSocket` (Port offen?) und `exec` (ein Befehl im Container liefert 0). Das Prinzip ist immer dasselbe.

### Der wichtigste Nebeneffekt: readiness schützt dein Update

Beim Rolling Update aus Teil 1 tauscht Kubernetes Pod für Pod. Aber woran erkennt es, dass ein **neuer** Pod übernehmen kann? An der **readiness-Probe.** Ein neuer Pod bekommt erst dann Anfragen und ersetzt einen alten, **wenn er bereit meldet**.

Das hat eine schöne Folge: Rollst du eine **kaputte** Version aus, die nie „bereit" wird, dann bleibt der Rollout einfach **stehen** – die alten, gesunden Pods laufen weiter und bedienen alle Anfragen. Ohne readiness hätte Kubernetes die alten Pods abgeräumt und du stündest mit einer toten neuen Version da.

!!! warning "Merksatz"
    **Eine gute readiness-Probe ist deine Rollout-Bremse.** Sie sorgt dafür, dass eine kaputte Version den Dienst nicht mitreißt, sondern der Rollout stehen bleibt, bis du zurückrollst. Genau das übst du gleich – absichtlich mit einer kaputten Probe.

---

## Teil 2: Requests & Limits – wie viel darf ein Container?

Jeder Node hat endlich viel Speicher und CPU. Ohne Regeln nimmt sich jeder Container, was er kriegen kann – bis nichts mehr da ist. Zwei Angaben verhindern das:

- **requests** – die Menge, die für den Container **reserviert** wird. Kubernetes plant den Pod nur auf einen Node, der diese Menge noch frei hat. Requests sind die **Garantie** und die Grundlage fürs **Scheduling**.
- **limits** – die **harte Obergrenze**. Mehr bekommt der Container nicht.

```yaml
          resources:
            requests:
              memory: "32Mi"      # so viel wird fest eingeplant
              cpu: "50m"          # 50m = 0,05 CPU-Kern
            limits:
              memory: "128Mi"     # mehr Speicher gibt es nicht
              cpu: "250m"
```

<figure>
<svg viewBox="0 0 620 190" width="100%" height="190" role="img" aria-label="Ein Balken zeigt request als reservierte Grundmenge und limit als harte Obergrenze; darueber ist OOMKilled">
  <text x="310" y="26" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="13">Speicherverbrauch eines Containers</text>
  <!-- Balkenrahmen -->
  <rect x="70" y="50" width="480" height="46" rx="4" fill="none" stroke="#3a4658" stroke-width="1"/>
  <!-- request -->
  <rect x="70" y="50" width="150" height="46" fill="rgba(46,158,91,0.20)"/>
  <line x1="220" y1="42" x2="220" y2="104" stroke="#2e9e5b" stroke-width="2"/>
  <text x="145" y="120" text-anchor="middle" fill="#2e9e5b" font-family="JetBrains Mono, monospace" font-size="12">request 32Mi</text>
  <text x="145" y="136" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="10">reserviert (Scheduling)</text>
  <!-- normalbereich -->
  <rect x="220" y="50" width="240" height="46" fill="rgba(122,162,255,0.12)"/>
  <!-- limit -->
  <line x1="460" y1="42" x2="460" y2="104" stroke="#e0b35c" stroke-width="2"/>
  <text x="460" y="120" text-anchor="middle" fill="#e0b35c" font-family="JetBrains Mono, monospace" font-size="12">limit 128Mi</text>
  <text x="460" y="136" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="10">harte Obergrenze</text>
  <!-- ueber limit -->
  <rect x="460" y="50" width="90" height="46" fill="rgba(224,108,108,0.18)"/>
  <text x="505" y="78" text-anchor="middle" fill="#e06c6c" font-family="system-ui, sans-serif" font-size="12" font-weight="700">OOMKilled</text>
  <text x="310" y="168" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="12">Speicher über das Limit → Container wird beendet. CPU über das Limit → nur gebremst (throttling).</text>
</svg>
<figcaption>request ist die reservierte Grundmenge (und bestimmt, wohin der Pod eingeplant wird), limit die harte Obergrenze. Sprengt ein Container sein Speicher-Limit, wird er beendet: OOMKilled.</figcaption>
</figure>

### Ein wichtiger Unterschied: Speicher und CPU verhalten sich anders

- **Speicher** ist nicht teilbar: Überschreitet ein Container sein Memory-Limit, kann Kubernetes ihn nicht „ausbremsen" – es **beendet** ihn. Im Status erscheint dann **`OOMKilled`** (Out Of Memory Killed).
- **CPU** ist teilbar: Überschreitet ein Container sein CPU-Limit, wird er nur **gedrosselt** (throttling) – er läuft langsamer, wird aber nicht beendet.

!!! note "Kurz erklärt: was `Mi` und `m` bedeuten"
    - **`Mi`** ist Mebibyte (≈ Megabyte) – `128Mi` sind also 128 „Megabyte" Speicher.
    - **`m`** bei der CPU heißt Milli-Kern: `1000m` = 1 ganzer CPU-Kern, `250m` = ein Viertelkern, `50m` = ein Zwanzigstel. So kann sich ein Kern auf viele Container aufteilen.

!!! warning "Merksatz"
    **request ist die Zusage, limit ist die Grenze.** Zu niedrige Limits killen deine App unter Last (OOMKilled), zu hohe requests machen sie unplanbar (der Pod bleibt `Pending`, weil kein Node so viel frei hat). Beides bewusst zu setzen ist Teil eines betriebsreifen Dienstes.

!!! note "Kurz erklärt: zu hohe requests → Pod bleibt `Pending`"
    Verlangst du per request mehr, als irgendein Node frei hat, findet Kubernetes keinen Platz – der Pod bleibt in `Pending` hängen, mit einem Event wie `Insufficient memory`. Das ist kein Fehler von Kubernetes, sondern die ehrliche Auskunft „so viel habe ich nicht". Auch das siehst du gleich in der Praxis.

---

## Weiter

- [Praxis: Probes & Limits](05-praxis-probes-limits.md) – jetzt baust du Probes ein, brichst sie absichtlich und sprengst ein Speicher-Limit
