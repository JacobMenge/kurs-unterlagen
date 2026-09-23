---
title: "Training: Images"
description: "Übungen 4 und 5: Name, Tag und ID eines Images verstehen und sehen, warum viele Container aus einem Image sich nicht in die Quere kommen."
---

# Images

Zwei Übungen zum Bauplan hinter jedem Container. Du lernst, was ein
Image-Name eigentlich bedeutet und warum aus einem Image beliebig viele
unabhängige Container entstehen können.

---

## Übung 4: Name, Tag und ID

!!! info "Was du lernst"
    - wie sich ein Image-Name zusammensetzt
    - was ein Tag ist und was `latest` bedeutet
    - woran du erkennst, dass zwei Namen dasselbe Image meinen

### Worum es geht

Ein Image hat einen Namen der Form **`Repository:Tag`**, zum Beispiel
`nginx:alpine`. Der Tag ist eine Art Etikett für eine bestimmte Variante
oder Version. Eindeutig ist ein Image aber erst über seine **ID**.

### Schritt für Schritt

Zeig alle Images, die zu `nginx` gehören:

```bash
docker images nginx
```

```text
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
nginx        latest    05b8cb60c354   2 weeks ago    268MB
nginx        alpine    5616878291a2   5 months ago   91.8MB
```

Ob bei dir auch `nginx:latest` auftaucht, hängt davon ab, was du früher
schon ausprobiert hast. Es ist dasselbe Programm auf einer anderen
Grundlage (Debian statt Alpine) und fast dreimal so groß. IDs und Datum
sehen bei dir anders aus.

Jetzt klebst du demselben Image ein zweites Etikett auf:

```bash
docker tag nginx:alpine meinweb:1.0
```

```bash
docker images
```

In der Liste stehen jetzt `nginx:alpine` **und** `meinweb:1.0`. Vergleiche
die Spalte `IMAGE ID`: Beide Einträge haben **dieselbe** ID. Es ist ein
einziges Image mit zwei Namen, belegt also auch nur einmal Speicher.

Entferne das zweite Etikett wieder:

```bash
docker rmi meinweb:1.0
```

```text
Untagged: meinweb:1.0
```

`Untagged` heißt: Nur der Name ist weg. Das Image selbst bleibt, weil
`nginx:alpine` noch darauf zeigt.

### Was dahinter steckt

- **Repository** ist der Name des Projekts (`nginx`, `postgres`),
  **Tag** die Variante (`alpine`, `16`, `1.27`). Fehlt der Tag, ergänzt
  Docker automatisch `latest`.
- `latest` heißt nicht „das Neueste", sondern nur „der Standard-Tag". Wer
  im Betrieb `latest` verwendet, bekommt nach einem `pull` womöglich
  unbemerkt eine neue Version. Deshalb legt man in Produktion die
  Version fest. `postgres:16` bleibt bei Version 16, wandert aber mit
  jedem Update innerhalb von 16 mit. Ganz genau wird es mit
  `postgres:16.4`.
- Die **ID** ist ein Prüfwert über den Inhalt des Images. Gleiche ID
  heißt garantiert gleicher Inhalt. Tags sind nur bewegliche Etiketten,
  die auf eine ID zeigen.
- `alpine` im Tag bedeutet: gebaut auf Alpine Linux, einer sehr kleinen
  Linux-Distribution. Kleinere Images laden schneller und enthalten
  weniger Software, die angreifbar sein könnte.

??? question "Kontrollfrage: Zwei Server holen beide `nginx:latest`, der eine im Januar, der andere im Juni. Laufen sie garantiert dieselbe Version?"
    Nein. `latest` zeigt auf das, was zum Zeitpunkt des `pull` als
    Standard veröffentlicht war. Im Juni kann das ein anderes Image mit
    anderer ID sein. Sehr wahrscheinlich gleich sind die beiden mit einem
    exakten Versions-Tag wie `nginx:1.27.3`, garantiert gleich nur mit
    derselben Image-ID.

### Aufräumen

Nichts zu tun, `meinweb:1.0` ist schon entfernt.

---

## Übung 5: Ein Image, viele Container

!!! info "Was du lernst"
    - dass aus einem Image beliebig viele Container entstehen
    - dass jeder Container seinen eigenen Zustand hat
    - warum das Image dabei unverändert bleibt

### Worum es geht

Das Image ist der Bauplan, der Container das gebaute Haus. Aus einem
Bauplan kannst du viele Häuser bauen. Was du in einem Haus
umstellst, verändert weder den Bauplan noch die anderen Häuser.

### Schritt für Schritt

Starte zwei Container aus demselben Image:

```bash
docker run -d --name kiste1 nginx:alpine
```

```bash
docker run -d --name kiste2 nginx:alpine
```

```bash
docker ps
```

Beide laufen, beide mit dem Image `nginx:alpine`. Jetzt legst du **nur in
`kiste1`** eine Datei an:

```bash
docker exec kiste1 touch /tmp/nur-in-kiste1.txt
```

Schau in beiden Containern in denselben Ordner:

```bash
docker exec kiste1 ls /tmp
```

```text
nur-in-kiste1.txt
```

```bash
docker exec kiste2 ls /tmp
```

Die Ausgabe bei `kiste2` ist **leer**. Die Datei existiert nur in
`kiste1`.

Zum Schluss ein dritter Container aus demselben Image:

```bash
docker run -d --name kiste3 nginx:alpine
```

```bash
docker exec kiste3 ls /tmp
```

Auch leer: Der neue Container startet mit dem unveränderten Stand des
Images.

### Was dahinter steckt

- Ein Image ist **schreibgeschützt**. Es besteht aus übereinander
  liegenden Schichten (Layern), die sich nie mehr ändern.
- Jeder Container bekommt beim Start eine eigene, dünne
  **Schreibschicht** oben drauf. Alles, was im Container geändert wird,
  landet nur dort. Deshalb stören sich `kiste1` und `kiste2` nicht.
- Die schreibgeschützten Schichten teilen sich alle Container. Drei
  Container aus `nginx:alpine` brauchen also nicht dreimal 92 MB, sondern
  nur einmal das Image plus drei winzige Schreibschichten.
- Genau darauf beruht das Skalieren im Betrieb: Mehrere identische
  Instanzen eines Dienstes laufen nebeneinander, alle aus einem Image.

??? question "Kontrollfrage: Du löschst `kiste1` und startest einen neuen Container mit demselben Namen. Ist `nur-in-kiste1.txt` noch da?"
    Nein. Die Datei lag in der Schreibschicht des alten Containers und
    die wird mit dem Container gelöscht. Der neue `kiste1` startet
    wieder mit dem sauberen Stand des Images. Wie man Daten über das
    Löschen hinaus rettet, zeigt [Übung 9](04-daten.md).

### Aufräumen

```bash
docker rm -f kiste1 kiste2 kiste3
```

---

## Selbst probieren

**Auftrag:** Gib dem Image `alpine` zusätzlich den Namen `werkzeugkiste:1.0`
und beweise, dass beide Namen dasselbe Image meinen. Starte dann aus
`werkzeugkiste:1.0` einen Container, der dir das Betriebssystem ausgibt.
Entferne zum Schluss den Namen `werkzeugkiste:1.0` wieder, ohne `alpine`
zu verlieren.

**Geschafft, wenn:** `docker images` beide Namen mit derselben ID zeigt,
der Container `Alpine Linux` ausgibt und am Ende nur noch `alpine` übrig
ist.

??? tip "Hinweis"
    `docker tag` vergibt den Namen, `docker images` zeigt die IDs. Den
    Inhalt der Datei `/etc/os-release` kennst du aus
    [Übung 3](01-container.md#ubung-3-in-einen-laufenden-container-hineinschauen).
    `--rm` beim `docker run` löscht den Container automatisch, sobald er
    fertig ist.

??? success "Lösung"
    ```bash
    docker tag alpine werkzeugkiste:1.0
    ```

    ```bash
    docker images
    ```

    ```bash
    docker run --rm werkzeugkiste:1.0 cat /etc/os-release
    ```

    ```bash
    docker rmi werkzeugkiste:1.0
    ```

    Die Ausgabe `Untagged: werkzeugkiste:1.0` bestätigt, dass nur das
    Etikett entfernt wurde.
