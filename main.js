/* ================================================
   TOGGLE – Main block open/close
================================================ */
function toggleBlock(id) {
  const block = document.getElementById(id);
  if (!block) return;
  const isOpen = block.classList.toggle('open');
  const header = block.querySelector('.srv-block-header');
  if (header) header.setAttribute('aria-expanded', String(isOpen));
}

/* ================================================
   NAVBAR – scroll effect
================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ================================================
   HAMBURGER – mobile menu
================================================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
}

/* ================================================
   REVEAL on scroll – IntersectionObserver
================================================ */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ================================================
   FAQ ACCORDION
================================================ */
function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    const item = btn.closest('.faq-item');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });
}

/* ================================================
   INIT – srv-item accordion (static HTML, event delegation)
================================================ */
function initSrvAccordions() {
  ['rehabAccordion', 'trainingAccordion'].forEach(containerId => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener('click', e => {
      const header = e.target.closest('.srv-item-header');
      if (!header) return;
      const item = header.closest('.srv-item');
      const isOpen = item.classList.contains('open');
      container.querySelectorAll('.srv-item').forEach(s => {
        s.classList.remove('open');
        s.querySelector('.srv-item-header').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
    container.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const header = e.target.closest('.srv-item-header');
        if (header) { e.preventDefault(); header.click(); }
      }
    });
  });
}

/* ================================================
   INIT – pop-cat accordion (static HTML, event delegation)
================================================ */
function initPopAccordions() {
  const popContainer = document.getElementById('popCategories');
  if (!popContainer) return;

  popContainer.addEventListener('click', e => {
    const subHeader = e.target.closest('.pop-sub-header');
    if (subHeader) {
      e.stopPropagation();
      const sub = subHeader.closest('.pop-sub');
      const catEl = subHeader.closest('.pop-cat');
      const isActive = sub.classList.contains('active');
      catEl.querySelectorAll('.pop-sub').forEach(s => {
        s.classList.remove('active');
        s.querySelector('.pop-sub-header').setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        sub.classList.add('active');
        subHeader.setAttribute('aria-expanded', 'true');
      }
      return;
    }

    const catHeader = e.target.closest('.pop-cat-header');
    if (catHeader) {
      const catEl = catHeader.closest('.pop-cat');
      const isActive = catEl.classList.contains('active');
      popContainer.querySelectorAll('.pop-cat').forEach(c => {
        c.classList.remove('active');
        const h = c.querySelector('.pop-cat-header');
        if (h) h.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        catEl.classList.add('active');
        catHeader.setAttribute('aria-expanded', 'true');
      }
    }
  });

  popContainer.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target.closest('.pop-cat-header, .pop-sub-header');
      if (target) { e.preventDefault(); target.click(); }
    }
  });
}

function initSrvBlocks() {
  document.querySelectorAll('.srv-block-header').forEach(header => {
    const block = header.closest('.srv-block');
    if (!block) return;
    header.addEventListener('click', () => toggleBlock(block.id));
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleBlock(block.id); }
    });
  });
}

function initMobileNavLinks() {
  document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', closeMobile);
  });
}

/* ================================================
   CONVERSIONES – eventos GA4 en cada punto de contacto
   Identifica el origen por la sección que contiene el enlace,
   para saber qué parte de la página genera cada conversación.
================================================ */
function origenDelEnlace(el) {
  if (el.closest('.whatsapp-float')) return 'boton_flotante';
  if (el.closest('#navbar') || el.closest('#mobileMenu')) return 'nav';
  if (el.closest('footer')) return 'footer';
  const seccion = el.closest('section');
  return seccion && seccion.id ? seccion.id : 'sin_seccion';
}

function initConversionTracking() {
  document.addEventListener('click', e => {
    const enlace = e.target.closest('a[href]');
    if (!enlace) return;

    const href = enlace.getAttribute('href') || '';
    let evento = null;

    if (href.includes('wa.me/')) evento = 'contacto_whatsapp';
    else if (href.startsWith('tel:')) evento = 'contacto_llamada';
    else if (href.includes('google.com/maps/dir')) evento = 'como_llegar';
    else if (href.includes('instagram.com')) evento = 'visita_instagram';

    if (!evento || typeof gtag !== 'function') return;

    gtag('event', evento, {
      origen: origenDelEnlace(enlace),
      etiqueta: (enlace.textContent || '').trim().slice(0, 60)
    });
  }, { passive: true });
}

/* ================================================
   BIFURCACIÓN – registra qué camino eligió la persona.
   Los paneles llevan a páginas propias, así que aquí solo se mide.
================================================ */
function initBifurcacion() {
  document.querySelectorAll('[data-abrir]').forEach(enlace => {
    enlace.addEventListener('click', () => {
      if (typeof gtag !== 'function') return;
      gtag('event', 'eleccion_camino', {
        camino: enlace.getAttribute('data-abrir') === 'srvRehab' ? 'rehabilitacion' : 'entrenamiento'
      });
    });
  });
}

/* ================================================
   SUBPÁGINAS – barra de progreso y sección activa.
   Solo actúan si los elementos existen, así que en la home no hacen nada.
================================================ */
function initProgresoLectura() {
  const barra = document.querySelector('.pg-progreso');
  if (!barra) return;

  let pendiente = false;
  const pintar = () => {
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.width = (alto > 0 ? Math.min(window.scrollY / alto, 1) * 100 : 0) + '%';
    pendiente = false;
  };
  window.addEventListener('scroll', () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(pintar);
  }, { passive: true });
  pintar();
}

function initSeccionActiva() {
  const enlaces = document.querySelectorAll('.pg-subnav a[href^="#"]');
  if (!enlaces.length) return;

  const porId = new Map();
  const observadas = [];
  enlaces.forEach(a => {
    const seccion = document.getElementById(a.getAttribute('href').slice(1));
    if (!seccion) return;
    porId.set(seccion.id, a);
    observadas.push(seccion);
  });
  if (!observadas.length) return;

  const visibles = new Set();
  const observador = new IntersectionObserver(entradas => {
    entradas.forEach(e => e.isIntersecting ? visibles.add(e.target.id) : visibles.delete(e.target.id));
    const actual = observadas.find(s => visibles.has(s.id));
    enlaces.forEach(a => a.classList.remove('activo'));
    if (actual && porId.get(actual.id)) porId.get(actual.id).classList.add('activo');
  }, { rootMargin: '-40% 0px -50% 0px' });

  observadas.forEach(s => observador.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
  initConversionTracking();
  initProgresoLectura();
  initSeccionActiva();
  initBifurcacion();
  initSrvBlocks();
  initMobileNavLinks();
  initSrvAccordions();
  initPopAccordions();
  initFaq();
  initReveal();
});
