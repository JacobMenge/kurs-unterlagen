---
title: "ConfigMap & Secret"
description: "Konfiguration und Geheimnisse gehören nicht ins Image: Eine ConfigMap hält offene Werte (Standort, Log-Level, URLs), ein Secret die Geheimnisse (Passwörter, Schlüssel). Beide werden dem Container als Umgebungsvariablen injiziert – dieselbe App, verschiedene Umgebungen. Plus die ehrliche Wahrheit: ein Secret ist base64, nicht verschlüsselt."
---

# ConfigMap & Secret

Die erste Lücke: **Konfiguration steckt im Image.** Jetzt lösen wir sie heraus. Das Ziel ist einfach – **dieselbe App, verschiedene Werte**, ohne das Image anzufassen. Kubernetes hat dafür zwei Objekte, die sich nur in einer Sache unterscheiden: wie geheim der Inhalt ist.

- **ConfigMap** – für **offene** Werte: Standort, Log-Level, Feature-Schalter, die Adresse eines anderen Dienstes. Nichts davon ist geheim.
- **Secret** – für **Geheimnisse**: Passwörter, API-Schlüssel, Zertifikate. Gleiche Idee, aber gesondert behandelt.

Beide sind im Grunde nur eine **Liste von Schlüssel-Wert-Paaren**, die außerhalb des Images lebt. Der Container bekommt die Werte zur Startzeit hineingereicht – am einfachsten als **Umgebungsvariablen**.

---

## Das Bild dahinter

<figure>
<svg viewBox="0 0 640 260" width="100%" height="260" role="img" aria-label="Ein Image plus eine ConfigMap plus ein Secret ergeben den fertig konfigurierten Pod">
  <!-- Image -->
  <rect x="30" y="70" width="150" height="110" rx="8" fill="rgba(143,164,152,0.12)" stroke="#8fa498" stroke-width="2"/>
  <text x="105" y="55" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="13">Image (unverändert)</text>
  <text x="105" y="120" text-anchor="middle" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="13">nginx:1.27</text>
  <text x="105" y="145" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">nur der Code,</text>
  <text x="105" y="162" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">keine Werte</text>

  <!-- ConfigMap -->
  <rect x="235" y="42" width="170" height="70" rx="8" fill="rgba(122,162,255,0.12)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="320" y="66" text-anchor="middle" fill="#7aa2ff" font-family="system-ui, sans-serif" font-size="13" font-weight="700">ConfigMap</text>
  <text x="320" y="88" text-anchor="middle" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="11">STANDORT, COLOR …</text>
  <text x="320" y="103" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="10">offene Werte</text>

  <!-- Secret -->
  <rect x="235" y="138" width="170" height="70" rx="8" fill="rgba(255,196,120,0.10)" stroke="#e0b35c" stroke-width="2"/>
  <text x="320" y="162" text-anchor="middle" fill="#e0b35c" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Secret</text>
  <text x="320" y="184" text-anchor="middle" fill="#c9d4e3" font-family="JetBrains Mono, monospace" font-size="11">APP_TOKEN …</text>
  <text x="320" y="199" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="10">Geheimnisse</text>

  <!-- Pfeile -->
  <text x="205" y="128" text-anchor="middle" fill="#7dff9a" font-size="24">+</text>
  <text x="430" y="128" text-anchor="middle" fill="#7dff9a" font-size="22">→</text>

  <!-- Pod -->
  <rect x="460" y="70" width="150" height="110" rx="8" fill="rgba(46,158,91,0.12)" stroke="#2e9e5b" stroke-width="2"/>
  <text x="535" y="55" text-anchor="middle" fill="#2e9e5b" font-family="system-ui, sans-serif" font-size="13">fertiger Pod</text>
  <text x="535" y="118" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="12">Code + Werte</text>
  <text x="535" y="140" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">als Umgebungs-</text>
  <text x="535" y="157" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">variablen</text>

  <text x="320" y="240" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="12">Dasselbe Image, andere ConfigMap → andere Umgebung. Das Image bleibt immer gleich.</text>
</svg>
<figcaption>Das Image bringt nur den Code mit. Die Werte kommen von außen – aus ConfigMap und Secret. So läuft dieselbe App in Test und Produktion mit unterschiedlicher Konfiguration.</figcaption>
</figure>

---

## Wie die Werte in den Container kommen

Es gibt zwei Wege und wir nutzen den bequemen. Zum Verständnis beide kurz:

- **`envFrom`** – nimm **alle** Schlüssel aus einer ConfigMap (oder einem Secret) und mach daraus Umgebungsvariablen. Ein Zweizeiler, ideal, wenn ohnehin alle Werte gebraucht werden.
- **`valueFrom`** – hol dir **einen bestimmten** Schlüssel gezielt in **eine** Variable. Genauer, aber mehr Schreibarbeit.

So sieht `envFrom` im Deployment aus – genau das steckt im Manifest, das du gleich anwendest:

```yaml
    spec:
      containers:
        - name: webserver
          image: nginx:1.27-alpine
          envFrom:
            - configMapRef:
                name: webserver-config     # alle Schlüssel aus dieser ConfigMap
            - secretRef:
                name: webserver-secret     # alle Schlüssel aus diesem Secret
```

Damit stehen im Container alle Schlüssel aus beiden Objekten als Umgebungsvariablen bereit – `STANDORT`, `COLOR`, `VERSION` aus der ConfigMap und `APP_TOKEN` aus dem Secret. Die Demo-App liest genau diese Variablen und baut daraus ihre Seite.

!!! note "Kurz erklärt: die ConfigMap selbst"
    Eine ConfigMap ist selbst nur ein winziges Manifest – ein Name und ein `data`-Block mit Schlüssel-Wert-Paaren:

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: webserver-config
    data:
      VERSION: "1"
      COLOR: "#2563a8"
      STANDORT: "Rechenzentrum Nord"
    ```

    Mehr ist es nicht. Ein Secret sieht fast genauso aus – mit `kind: Secret` und dem Inhalt unter `stringData` (Klartext rein, Kubernetes kodiert selbst).

---

## Die wichtigste ehrliche Wahrheit: Secret ≠ verschlüsselt

Der Name führt in die Irre. Ein **Secret ist nicht verschlüsselt** – es ist nur **base64-kodiert**. Base64 ist keine Sicherheit, sondern eine reine Umschreibung, die jeder in einer Sekunde rückgängig macht: Aus dem kryptisch aussehenden `czNoci1nZWhlaW0tNDI=` wird mit einem einzigen Befehl wieder `s3hr-geheim-42`. Genau das machst du gleich in der [Praxis](03-praxis-config-secrets.md#schritt-5-das-secret-entlarven-base64-nicht-verschlusselt) selbst.

Warum dann überhaupt ein Secret statt einer ConfigMap? Weil Kubernetes Secrets **anders behandelt**: Sie werden nicht in normalen Log-Ausgaben mitgedruckt, lassen sich im Cluster mit strengeren Rechten schützen (RBAC) und man kann die Verschlüsselung im Hintergrund (Encryption at Rest) aktivieren. Das Secret ist also der **richtige Ort** für Geheimnisse und das Signal „hier ist etwas Schützenswertes" – aber base64 allein ist **kein** Schutz.

!!! warning "Merksatz"
    **Ein Secret ist base64, nicht verschlüsselt.** Es gehört trotzdem jedes Passwort und jeder Schlüssel hinein statt in eine ConfigMap – aber verlass dich nie darauf, dass der Inhalt „geheim" ist, nur weil er kryptisch aussieht. Wer das Secret lesen darf, liest den Klartext.

!!! note "Kurz erklärt: Geheimnisse gehören nicht ins Git-Repo"
    ConfigMaps mit offenen Werten kannst du bedenkenlos zu deinen Manifesten in [Git](../git/index.md) legen. Ein Secret mit echten Passwörtern **nicht** – sonst steht das Passwort in der Historie. In der Praxis hält man Secrets aus dem Repo heraus (oder verschlüsselt sie mit Werkzeugen wie *SealedSecrets* oder einem externen *Vault*). Für unsere Übung mit einem Wegwerf-Token ist das egal, im Beruf ist es das nicht.

---

## Ein Haken, den du kennen musst

Änderst du eine ConfigMap, **merken die laufenden Pods das nicht von selbst.** Sie haben ihre Umgebungsvariablen beim Start bekommen und behalten sie. Erst wenn die Pods **neu** entstehen, lesen sie die neuen Werte. Dafür gibt es einen Befehl, der genau das auslöst – ohne dass du etwas löschen musst:

```bash
kubectl rollout restart deployment/webserver
```

Das tauscht die Pods sauber wellenweise aus (wie ein Rolling Update) – danach laufen sie mit der neuen Konfiguration.

!!! note "Kurz erklärt: warum kein automatischer Neustart?"
    Ein automatischer Neustart aller Pods bei jeder kleinen Config-Änderung wäre im Betrieb gefährlich – ein Tippfehler in der ConfigMap würde sofort alles durchtauschen. Kubernetes trennt deshalb bewusst: **Ändern** und **Ausrollen** sind zwei Schritte. Du entscheidest, wann die neue Konfiguration greift.

---

## Weiter

- [Praxis: Config & Secrets](03-praxis-config-secrets.md) – jetzt legst du ConfigMap und Secret an, injizierst sie und rollst eine Änderung aus
