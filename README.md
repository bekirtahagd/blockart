# BlockArt – Blumenstudio

Die Idee war, eine Blume aus kleinen Würfeln als Geschenk zu bauen. Mit BlockArt lässt sich der Entwurf vorher im Browser ausprobieren, bevor die echten Blöcke zusammengebaut werden.

Der Planer ist für bis zu 120 Blöcke gedacht. Ein Block hat standardmäßig eine Kantenlänge von 1,5 cm.

## Was geht?

- Blöcke setzen, färben und entfernen
- Einzelne Blöcke oder ganze Bereiche auswählen, verschieben und duplizieren
- Acht Blumenvorlagen ausprobieren: vier im Minecraft-Look und vier eigene Entwürfe
- Die Blume drehen, Schichten ansehen und im Vollbild bearbeiten
- Projekte als JSON speichern und wieder öffnen
- Einen Bauplan mit Farben, Stückzahlen und Koordinaten exportieren

## Lokal starten

Du brauchst Node.js und einen Browser mit WebGL-Unterstützung. Im Projektordner ausführen:

```sh
node preview.mjs
```

Danach [localhost:4173](http://127.0.0.1:4173) öffnen. Eine Installation von npm-Paketen ist nicht nötig.

## Beim Ausprobieren

Mit „Auswahl“ kannst du einen Rahmen um mehrere Blöcke ziehen. Die ausgewählten Blöcke lassen sich gemeinsam verschieben, kopieren oder löschen. Strg+Z macht Änderungen rückgängig.

Speichere deinen Entwurf über „Projekt speichern“, bevor du den Browser schließt. Es gibt keine automatische Speicherung.

## Technik

Die Anwendung liegt in `dist/` und besteht aus HTML, CSS und JavaScript. Für die 3D-Ansicht wird Three.js verwendet; die Bibliothek und ihre MIT-Lizenz liegen in `dist/vendor/`.
