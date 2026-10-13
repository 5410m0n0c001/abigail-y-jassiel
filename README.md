# Boda Abigail & Jasiel · Invitación digital (INIT IDEA)

Invitación estática (HTML/CSS/JS, sin build) que fusiona tres invitaciones:

- **Carmesí** (diseño): papel con salpicado, sobre con sello de cera, fotos que entran deslizándose y girando
  desde la esquina, tarjetas de papel para los lugares, cadenas de rosas y pétalos. Recoloreado de carmesí a
  **azul marino y blanco** (paleta del montaje: azul marino, arena, ivory, rosa pastel).
- **XV Azul 3D** (funciones): escena 3D fija que acompaña el scroll, álbum en Supabase con cámara,
  ruleta de 200 retos, QR para mesas, pases personalizados, panel de organizador, buzón de deseos y
  botón de compartir que florece en rosa.
- **Demo** (funciones): agendar en el calendario, menú con pestañas, hospedaje, clima, navegación rápida,
  recorrido guiado la primera vez y confeti cuando llega la hora del evento.

Publicación: https://5410m0n0c001.github.io/abigail-y-jassiel/ (repo `5410m0n0c001/abigail-y-jassiel`).

## La escena 3D
- `js/escena3d.js`: la **rosa roja** (`models/rosa.glb`, morph "Abierta") se abre con el scroll en la portada.
  Después el objeto **cambia según la sección**: cada `<section>` lleva `data-lado="izq|der|cierre|final"`
  (dónde se coloca) y `data-3d="…"` (qué objeto se muestra). Al cambiar, el objeto se encoge girando y
  aparece el siguiente. En el RSVP la rosa vuelve cerrada.
- `js/modelos3d.js`: objetos hechos con geometría de Three.js (sin descargas): `anillos`, `corazon`, `reloj`
  (marca las 4:00, la hora de la ceremonia), `pin`, `campanas`, `copa` (azul y transparente, como las del
  montaje), `banquete`, `monio`, `regalo`, `clima`, `camara`, `instagram`, `sobre`.
- `img/deco/*.webp`: rosas rojas y botones blancos renderizados en Blender desde el mismo modelo
  (`tools/render_rosas.py`); se usan en las cadenas y en los pases.
- Sin WebGL se ven imágenes de respaldo; con "reducir movimiento" no hay animaciones.

## Archivos
- `index.html`: todos los textos visibles.
- `js/config.js`: fecha, WhatsApp, mapa, clima y álbum (lo marcado `PENDIENTE` se llena aquí).
- `js/app.js`: sobre, música, cuenta regresiva, calendario, menú, navegación, compartir, WhatsApp y recorrido.
- `js/carmesi.js`: animaciones al estilo Carmesí con GSAP + ScrollTrigger.
- `js/pases.js`: pases de 1 a 5 (`?pases=4,2&para=Familia%20López`). Panel de organizador: **3 toques en los
  nombres de la portada** + clave (guardada como SHA-256; la clave provisional se entregó por chat; cambiarla
  antes de enviar invitaciones: `printf 'nueva' | sha256sum`).
- `js/album.js`, `js/retos.js`: álbum (`albumId: boda-abigail-jasiel-2026`) y ruleta de retos de boda.
- `p/N.html` + `img/pases/og-N.jpg`: vista previa en WhatsApp de enlaces con N lugares (1 a 20).
- `tools/generar-imagenes.sh` + `tools/tarjeta.html`: regeneran pases y vistas previas (Chrome sin ventana).
- `originales/`: fotos de la preboda tal como llegaron (no se publican).

## Pendientes con los novios
Todo lo pendiente se ve en la invitación como texto en cursiva con un ✎.

| Dato | Dónde se cambia |
|---|---|
| WhatsApp de confirmaciones | `js/config.js` → `whatsapp` |
| Enlace de Google Maps del jardín y dirección | `js/config.js` → `mapa`; dirección en `index.html` (`data-dir-jardin`) |
| Coordenadas para el clima | `js/config.js` → `clima` |
| Padres y padrinos | `index.html` → sección familia |
| Tema de la entrada triunfal | `index.html` → minuto a minuto |
| ¿Evento sin alcohol? (barra mix e "Información importante") | `index.html` (`data-alcohol`) |
| ¿Niños? / menú infantil | `index.html` (`data-ninos`) |
| Código de vestimenta | `index.html` → sección vestimenta |
| Mesa de regalos: banco, cuenta, titular y tienda | `index.html` → sección regalos (quitar `aria-disabled` del enlace) |
| Hospedaje | `index.html` → sección hospedaje |
| Canción (hoy: canción provisional de Primavera Events Group) | `audio/cancion.mp3` |
| Video de portada (sesión del 14 de octubre) | `index.html` → `.portada-foto` (ver comentario) |
| Hashtag `#AbiYJasiel2026` (validar en Instagram que esté libre) | `index.html` → sección comparte |
| Clave del panel de organizador | `js/pases.js` → `CLAVE_SHA256` |

Menú: el checklist decía carnitas 90 % puerco / 10 % pollo; por corrección es **carnitas de res y pollo**.

## Probar en local
```bash
npx http-server . -p 4510 -c-1
```
Agrega `?debug` a la URL para probar sin música ni recorrido guiado.
