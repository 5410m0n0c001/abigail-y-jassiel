// Animaciones al estilo de la invitación Carmesí (GSAP + ScrollTrigger), con elementos 3D:
//  - Fotos a todo lo ancho: entran deslizándose y girando desde la esquina inferior (alternan lado).
//  - Tarjetas de papel de los lugares: entran inclinadas desde su lado.
//  - Cadenas de rosas rojas y botones blancos (renders 3D de models/rosa.glb) que se deslizan con el scroll.
//  - Fotos de la galería e íconos: aparecen con giro.
//  - Pétalos rojos cayendo sobre la portada.
// Con "reducir movimiento" o sin GSAP, todo queda en su lugar sin animación.
(() => {
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- cadenas de rosas (se arman siempre; solo se mueven si hay animación) ----------
  const SPRITES = ['rosa-roja-1', 'boton-blanco-1', 'rosa-roja-2', 'boton-blanco-2'];
  $$('.cadena').forEach((cadena) => {
    const tira = document.createElement('div');
    tira.className = 'cadena-tira';
    for (let i = 0; i < 14; i++) {
      const img = document.createElement('img');
      img.src = `img/deco/${SPRITES[i % SPRITES.length]}.webp`;
      img.alt = '';
      img.loading = 'lazy';
      img.style.setProperty('--r', `${(i * 47) % 50 - 25}deg`);
      tira.append(img);
    }
    cadena.append(tira);
  });

  // ---------- pétalos de la portada ----------
  const petalos = document.getElementById('petalos');
  if (petalos && !reducir) {
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('i');
      p.style.setProperty('--x', `${Math.random() * 100}%`);
      p.style.setProperty('--d', `${7 + Math.random() * 7}s`);
      p.style.setProperty('--t', `${-Math.random() * 12}s`);
      p.style.setProperty('--s', (0.6 + Math.random() * 0.8).toFixed(2));
      p.style.setProperty('--g', `${(Math.random() < 0.5 ? -1 : 1) * (400 + Math.random() * 600)}deg`);
      petalos.append(p);
    }
  }

  function animar() {
    const { gsap, ScrollTrigger } = window;
    if (!gsap || !ScrollTrigger || reducir) return;
    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add('con-gsap');

    // fotos: entran desde la esquina, alternando izquierda/derecha (fotoGsap de Carmesí)
    $$('.foto-slide').forEach((bloque, i) => {
      const img = bloque.querySelector('.foto-full');
      const derecha = i % 2 !== 0;
      gsap.fromTo(img,
        { xPercent: derecha ? 50 : -50, yPercent: 25, rotation: derecha ? 25 : -25, transformOrigin: derecha ? 'bottom right' : 'bottom left' },
        { xPercent: 0, yPercent: 0, rotation: 0, ease: 'power3.out', scrollTrigger: { trigger: bloque, start: 'top 85%', end: 'top 30%', scrub: 2 } });
    });

    // tarjetas de papel (hojaGsap de Carmesí)
    $$('.hoja').forEach((hoja) => {
      const derecha = hoja.dataset.entra === 'der';
      gsap.fromTo(hoja,
        { xPercent: derecha ? 60 : -60, yPercent: 30, rotation: derecha ? -12 : 12, transformOrigin: derecha ? 'bottom right' : 'bottom left' },
        { xPercent: 0, yPercent: 0, rotation: 0, ease: 'power3.out', scrollTrigger: { trigger: hoja, start: 'top 95%', end: 'top 60%', scrub: 0.5 } });
    });

    // cadenas de rosas: se deslizan en sentido contrario al scroll (cadena-infinita de Carmesí)
    $$('.cadena').forEach((cadena) => {
      const dir = +cadena.dataset.dir || 1;
      gsap.fromTo(cadena.querySelector('.cadena-tira'),
        { xPercent: dir > 0 ? -35 : 0 },
        { xPercent: dir > 0 ? 0 : -35, ease: 'none', scrollTrigger: { trigger: cadena, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });

    // galería: cada foto entra girando desde su lado
    ScrollTrigger.batch('#mosaico .m', {
      start: 'top 92%',
      once: true,
      onEnter: (lote) => gsap.from(lote, {
        opacity: 0, y: 60, rotation: (i) => (i % 2 ? 8 : -8), scale: 0.86,
        duration: 1.1, ease: 'back.out(1.4)', stagger: 0.12,
      }),
    });

    // íconos de tarjetas y del minuto a minuto: aparecen con giro (show-p-x de Carmesí)
    $$('.tarjeta > svg, .linea svg').forEach((ico) => {
      gsap.from(ico, {
        scale: 0, rotation: -120, duration: 0.9, ease: 'back.out(2)',
        scrollTrigger: { trigger: ico, start: 'top 90%', once: true },
      });
    });

    // la página cambia de alto cuando cargan las fotos y el álbum
    addEventListener('load', () => ScrollTrigger.refresh());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', animar);
  else animar();
})();
