// Animaciones al estilo de la invitación Carmesí (GSAP + ScrollTrigger), con elementos 3D:
//  - Imágenes (fotos, galería, tarjetas, hojas de lugares): entran por los lados girando desde la esquina
//    y se acomodan al ritmo del scroll (scrub), alternando izquierda/derecha.
//  - Cadenas de rosas azules y blancas (renders 3D de models/rosa.glb): cada flor brota girando,
//    se mece sola y la cadena se desliza con el scroll.
//  - Rosas grandes que entran girando por los costados entre secciones (decoraciones "reloj" de Carmesí).
//  - Pétalos azules y blancos cayendo sobre la portada.
// Con "reducir movimiento" o sin GSAP, todo queda en su lugar sin animación.
(() => {
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const azar = (a, b) => a + Math.random() * (b - a);

  // ---------- cadenas de rosas: cada flor en su propio contenedor para mecerse ----------
  const SPRITES = ['rosa-azul-1', 'boton-blanco-1', 'rosa-blanca', 'boton-azul', 'rosa-azul-2', 'boton-blanco-2'];
  $$('.cadena').forEach((cadena, c) => {
    const tira = document.createElement('div');
    tira.className = 'cadena-tira';
    for (let i = 0; i < 16; i++) {
      const flor = document.createElement('span');
      flor.className = 'flor';
      const tam = azar(0.72, 1.18);
      flor.style.setProperty('--tam', tam.toFixed(2));
      flor.style.setProperty('--r', `${azar(-28, 28).toFixed(0)}deg`);
      flor.style.setProperty('--dy', `${azar(-14, 14).toFixed(0)}%`);
      flor.style.setProperty('--dur', `${azar(3.2, 6).toFixed(1)}s`);
      flor.style.setProperty('--ret', `${azar(-6, 0).toFixed(1)}s`);
      flor.style.zIndex = Math.round(tam * 10);
      const img = document.createElement('img');
      img.src = `img/deco/${SPRITES[(i + c * 2) % SPRITES.length]}.webp`;
      img.alt = '';
      img.loading = 'lazy';
      flor.append(img);
      tira.append(flor);
    }
    cadena.append(tira);
  });

  // ---------- rosas grandes que entran por los costados ----------
  const LADOS = [
    ['.familia', 'izq', 'rosa-azul-tallo'], ['#lugares', 'der', 'rosa-blanca'], ['#programa', 'izq', 'rosa-azul-1'],
    ['#menu', 'der', 'rosa-azul-2'], ['#regalos', 'der', 'rosa-azul-tallo'], ['.galeria', 'izq', 'rosa-blanca'],
    ['.deseos', 'der', 'rosa-azul-1'], ['#confirmar', 'izq', 'rosa-azul-2'],
  ];
  LADOS.forEach(([sel, lado, sprite]) => {
    const sec = document.querySelector(sel);
    if (!sec) return;
    const flor = document.createElement('img');
    flor.className = `flor-lado flor-${lado}`;
    flor.src = `img/deco/${sprite}.webp`;
    flor.alt = '';
    flor.loading = 'lazy';
    flor.setAttribute('aria-hidden', 'true');
    sec.prepend(flor);
  });

  // ---------- pétalos de la portada ----------
  const petalos = document.getElementById('petalos');
  if (petalos && !reducir) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('i');
      p.style.setProperty('--x', `${Math.random() * 100}%`);
      p.style.setProperty('--d', `${azar(7, 14)}s`);
      p.style.setProperty('--t', `${-Math.random() * 12}s`);
      p.style.setProperty('--s', azar(0.6, 1.4).toFixed(2));
      p.style.setProperty('--g', `${(Math.random() < 0.5 ? -1 : 1) * azar(400, 1000)}deg`);
      if (i % 3 === 0) p.style.setProperty('--color-petalo', 'radial-gradient(circle at 30% 30%, #ffffff, #dfe6f3 70%)');
      petalos.append(p);
    }
  }

  function animar() {
    const { gsap, ScrollTrigger } = window;
    if (!gsap || !ScrollTrigger || reducir) return;
    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add('con-gsap');

    // entrada lateral con giro desde la esquina (fotoGsap de Carmesí), ligada al scroll
    const entrarDeLado = (el, derecha, { x = 60, y = 25, giro = 18, start = 'top 92%', end = 'top 45%', scrub = 1.2 } = {}) => {
      gsap.fromTo(el,
        { xPercent: derecha ? x : -x, yPercent: y, rotation: derecha ? giro : -giro, opacity: 0.2, transformOrigin: derecha ? 'bottom right' : 'bottom left' },
        { xPercent: 0, yPercent: 0, rotation: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start, end, scrub } });
    };

    $$('.foto-slide .foto-full').forEach((img, i) => entrarDeLado(img, i % 2 !== 0, { x: 55, giro: 25, scrub: 2 }));
    $$('.hoja').forEach((hoja) => entrarDeLado(hoja, hoja.dataset.entra === 'der', { x: 65, y: 30, giro: 12, start: 'top 98%', end: 'top 60%', scrub: 0.6 }));
    $$('#mosaico .m').forEach((m, i) => entrarDeLado(m, i % 2 !== 0, { x: 70, y: 20, giro: 14, start: 'top 100%', end: 'top 65%', scrub: 1 }));
    $$('.tarjeta, .menu-panel, .album-qr, .despedida-foto').forEach((t, i) => entrarDeLado(t, i % 2 === 0, { x: 40, y: 15, giro: 8, start: 'top 98%', end: 'top 70%', scrub: 0.8 }));

    // cuenta regresiva: cada cuadro cae girando
    gsap.from('#cuenta > div', {
      y: -50, rotation: (i) => (i % 2 ? 12 : -12), opacity: 0, duration: 0.9, ease: 'back.out(2)', stagger: 0.1,
      scrollTrigger: { trigger: '#cuenta', start: 'top 90%', once: true },
    });

    // cadenas: la tira se desliza y cada flor brota girando cuando la cadena entra a la pantalla
    $$('.cadena').forEach((cadena) => {
      const dir = +cadena.dataset.dir || 1;
      gsap.fromTo(cadena.querySelector('.cadena-tira'),
        { xPercent: dir > 0 ? -30 : 0 },
        { xPercent: dir > 0 ? 0 : -30, ease: 'none', scrollTrigger: { trigger: cadena, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.from(cadena.querySelectorAll('.flor'), { // el contenedor: la imagen ya trae su vaivén en CSS
        scale: 0, rotation: () => azar(-200, 200), y: 40, duration: 1.2, ease: 'back.out(1.6)', stagger: { each: 0.06, from: 'random' },
        scrollTrigger: { trigger: cadena, start: 'top 95%', once: true },
      });
    });

    // rosas de los costados: entran rodando desde fuera de la pantalla y luego giran despacio
    $$('.flor-lado').forEach((flor) => {
      const izq = flor.classList.contains('flor-izq');
      gsap.fromTo(flor,
        { xPercent: izq ? -130 : 130, rotation: izq ? -220 : 220, scale: 0.4 },
        { xPercent: 0, rotation: izq ? 15 : -15, scale: 1, ease: 'power2.out', scrollTrigger: { trigger: flor.parentElement, start: 'top 85%', end: 'top 35%', scrub: 1.5 } });
    });

    // íconos de tarjetas y del minuto a minuto: aparecen con giro (show-p-x de Carmesí)
    $$('.tarjeta > svg, .linea svg').forEach((ico) => {
      gsap.from(ico, {
        scale: 0, rotation: -120, duration: 0.9, ease: 'back.out(2)',
        scrollTrigger: { trigger: ico, start: 'top 92%', once: true },
      });
    });

    // la página cambia de alto al abrir el sobre y cuando cargan fotos y álbum: recalcular posiciones
    window.refrescarAnimaciones = () => ScrollTrigger.refresh();
    addEventListener('load', () => ScrollTrigger.refresh());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', animar);
  else animar();
})();
