---
title: "Cheatsheet – Multipass"
description: "Die wichtigsten Multipass-Befehle als Tabellen – zum schnellen Nachschlagen."
---

# Cheatsheet – Multipass

## Grundlagen

| Befehl | Bedeutung |
|--------|-----------|
| `multipass version` | Installierte Version anzeigen |
| `multipass find` | Verfügbare Ubuntu-Images und Aliase auflisten |
| `multipass help` | Hilfe anzeigen |
| `multipass help <befehl>` | Detaillierte Hilfe zu einem einzelnen Befehl |

## VMs starten

| Befehl | Bedeutung |
|--------|-----------|
| `multipass launch` | VM mit Standard-Parametern starten (aktuelles LTS, 1 CPU, 1 GB RAM, 5 GB Disk) |
| `multipass launch 22.04` | VM mit Ubuntu 22.04 starten |
| `multipass launch --name demo` | VM mit festem Namen starten |
| `multipass launch 22.04 --name demo --cpus 2 --memory 2G --disk 10G` | Ressourcen explizit setzen |
| `multipass launch --cloud-init <datei>.yaml` | VM mit Cloud-Init-Skript vorkonfigurieren |

## VMs ansehen und betreten

| Befehl | Bedeutung |
|--------|-----------|
| `multipass list` | Alle VMs mit Status und IP anzeigen |
| `multipass info <name>` | Detailinfos zu einer VM |
| `multipass info --all` | Details zu allen VMs |
| `multipass shell <name>` | Interaktive Shell in der VM öffnen |
| `multipass exec <name> -- <befehl>` | Einzelbefehl in der VM ausführen, ohne Shell zu öffnen |

Beispiel `exec`:

```bash
multipass exec demo -- hostname
multipass exec demo -- sudo apt update
```

## VMs stoppen, starten, neu starten

| Befehl | Bedeutung |
|--------|-----------|
| `multipass stop <name>` | VM sauber herunterfahren |
| `multipass start <name>` | Gestoppte VM wieder anfahren |
| `multipass restart <name>` | VM neu starten |
| `multipass stop --all` | Alle VMs stoppen |
| `multipass start --all` | Alle VMs starten |
| `multipass suspend <name>` | VM in Ruhezustand versetzen (Zustand wird gespeichert) |

## VMs entfernen

!!! warning "Löschen läuft zweistufig"
    `delete` markiert nur, `purge` räumt endgültig auf.

| Befehl | Bedeutung |
|--------|-----------|
| `multipass delete <name>` | VM zum Löschen markieren (rückgängig möglich) |
| `multipass recover <name>` | Versehentliches Delete rückgängig machen |
| `multipass purge` | Alle markierten VMs endgültig entfernen |
| `multipass delete --all` | Alle VMs markieren |

## Dateien zwischen Host und VM bewegen

| Befehl | Bedeutung |
|--------|-----------|
| `multipass transfer host-datei <name>:/pfad/im/gast` | Datei vom Host in die VM kopieren |
| `multipass transfer <name>:/pfad/im/gast host-datei` | Datei aus der VM auf den Host holen |
| `multipass mount ~/projekt demo:/home/ubuntu/projekt` | Host-Verzeichnis in die VM mounten |
| `multipass umount demo:/home/ubuntu/projekt` | Mount wieder entfernen |

## Netzwerk

| Befehl | Bedeutung |
|--------|-----------|
| `multipass list` | IP der VMs anzeigen |
| `multipass info <name>` | unter anderem die IPv4-Adresse |

SSH vom Host in die VM (falls man auf Multipass-Shell verzichten möchte):

```bash
ssh ubuntu@$(multipass info demo | awk '/IPv4/ {print $2}')
```

## Konfiguration und Daemon

| Befehl | Bedeutung |
|--------|-----------|
| `multipass get` | Konfigurations­schlüssel anzeigen |
| `multipass set <key>=<value>` | Konfiguration setzen |

Beispiel: Standard-CPU-Anzahl für neue VMs:

```bash
multipass set local.privileged-mounts=true
multipass set local.driver=qemu
```

## Nützliche Einzeiler

VM starten und direkt rein:

```bash
multipass launch 22.04 --name demo && multipass shell demo
```

Alle VMs stoppen und löschen:

```bash
multipass stop --all
multipass delete --all
multipass purge
```

In allen laufenden VMs denselben Befehl ausführen:

```bash
for vm in $(multipass list --format csv | tail -n +2 | cut -d, -f1); do
  echo "=== $vm ==="
  multipass exec "$vm" -- uptime
done
```

---

## Minimal-Workflow im Unterricht

```bash
# 1) starten
multipass launch 22.04 --name demo

# 2) reingehen
multipass shell demo

# 3) drinnen
hostname
whoami
uname -a
exit

# 4) stoppen
multipass stop demo

# 5) löschen
multipass delete demo
multipass purge
```

Fünf Phasen, alle abgedeckt. Für alles Weitere: [Praxis mit Multipass](../virtualisierung/praxis-multipass.md).
