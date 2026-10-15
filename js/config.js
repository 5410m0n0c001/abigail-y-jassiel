// Datos del evento que usa el JavaScript. Los textos visibles viven en index.html.
// Lo marcado como PENDIENTE se confirma con los novios (ver README.md → "Pendientes").
window.INVITACION = {
  // Inicio de la ceremonia con zona horaria (centro de México = UTC-6)
  fechaEvento: '2026-12-13T16:00:00-06:00',
  finEvento: '2026-12-13T22:00:00-06:00',
  titulo: 'Boda de Abigail & Jasiel',
  lugar: 'Jardín Mina Real',

  // WhatsApp que recibe confirmaciones y el buzón de deseos (lada 52 + número, sin espacios)
  whatsapp: '527772600914',

  // Enlace de Google Maps del jardín (los botones "Cómo llegar" lo usan)
  mapa: 'https://maps.app.goo.gl/s9GLkghkNa3gFr4N9',

  // Coordenadas del jardín para el pronóstico del clima (Windy); tomadas del enlace de Google Maps
  clima: { lat: 18.81277, lon: -99.20510 },

  album: {
    supabaseUrl: 'https://fhnnqmbbeeobassvfeox.supabase.co',
    supabaseKey: 'sb_publishable_JV54Q8BDmg5XDXsq7NwO6Q_YDPBOLrm', // clave pública (publishable)
    bucket: 'fotos-album',
    albumId: 'boda-abigail-jasiel-2026', // álbum propio de esta boda
    fotosPorPagina: 24,
    // compresión en el navegador
    maxLado: 1600,               // px del lado largo de la foto grande
    maxBytes: 600 * 1024,        // objetivo de peso de la foto grande
    miniLado: 480,               // px del lado largo de la miniatura
    maxArchivos: 10,             // fotos por envío
  },
};
