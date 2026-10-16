(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Header: sombra al hacer scroll ---------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const burger = $('#burger');
  const nav = $('#nav');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => window.innerWidth > 900 && setMenu(false));

  /* ---------- Hero carrusel ---------- */
  const slides = $$('.hero__slide');
  const dotsWrap = $('#heroDots');
  const DELAY = 6000;
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
    b.addEventListener('click', () => go(i, true));
    dotsWrap.appendChild(b);
  });
  const dots = $$('button', dotsWrap);

  function go(i, user = false) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('is-active', n === current));
    dots.forEach((d, n) => {
      d.classList.remove('is-active');
      if (n === current) { void d.offsetWidth; d.classList.add('is-active'); }
    });
    const img = $('img', slides[current]);
    if (img && img.loading === 'lazy') img.loading = 'eager';
    restart();
  }
  function restart() { clearTimeout(timer); timer = setTimeout(() => go(current + 1), DELAY); }

  $('#heroPrev').addEventListener('click', () => go(current - 1, true));
  $('#heroNext').addEventListener('click', () => go(current + 1, true));
  const hero = $('.hero');
  hero.addEventListener('mouseenter', () => clearTimeout(timer));
  hero.addEventListener('mouseleave', restart);
  document.addEventListener('visibilitychange', () => (document.hidden ? clearTimeout(timer) : restart()));
  go(0);

  /* ---------- Sliders de producto ---------- */
  $$('[data-slider]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const track = document.getElementById(btn.dataset.slider);
      const card = $('.card', track);
      const step = card.getBoundingClientRect().width + 22;
      track.scrollBy({ left: step * Number(btn.dataset.dir), behavior: 'smooth' });
    });
  });

  /* ---------- Revelado al hacer scroll ---------- */
  const targets = $$('.section__head, .bento__card, .trust__item, .card, .steps li, .contact-list li, .showroom__map, .quote, .service__info, .stats__grid > div, .brands__row img');
  targets.forEach((el) => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const siblings = [...e.target.parentElement.children];
        const delay = Math.min(siblings.indexOf(e.target), 6) * 70;
        setTimeout(() => e.target.classList.add('is-in'), delay);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Cotizador Dinámico + WhatsApp ---------- */
  const form = $('#cotizar');
  const catSelect = $('#q-cat');
  const m2Input = $('#q-m2');
  const servSelect = $('#q-serv');
  const cityInput = $('#q-city');
  const telInput = $('#q-tel');
  const estimateWrap = $('#quoteEstimate');
  const estimateVal = $('#estimateVal');

  const updateEstimate = () => {
    const opt = catSelect.options[catSelect.selectedIndex];
    const price = opt && opt.dataset.price ? Number(opt.dataset.price) : 0;
    const m2 = Number(m2Input.value) || 0;

    if (price > 0 && m2 > 0) {
      const total = price * m2;
      estimateVal.textContent = `$${total.toLocaleString('es-CL')} CLP`;
      estimateWrap.style.display = 'block';
    } else {
      estimateWrap.style.display = 'none';
    }
  };

  catSelect.addEventListener('change', () => {
    catSelect.classList.remove('is-invalid');
    updateEstimate();
  });
  m2Input.addEventListener('input', updateEstimate);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    catSelect.classList.toggle('is-invalid', !catSelect.value);
    if (!catSelect.value) {
      catSelect.focus();
      return;
    }

    let lines = ['Hola Pisos Manríquez, quisiera solicitar una cotización:'];
    lines.push(`• Categoría: ${catSelect.value}`);
    if (m2Input.value) lines.push(`• Superficie: ${m2Input.value} m²`);
    if (servSelect && servSelect.value) lines.push(`• Servicio: ${servSelect.value}`);
    if (cityInput && cityInput.value.trim()) lines.push(`• Ubicación: ${cityInput.value.trim()}`);
    if (telInput && telInput.value.trim()) lines.push(`• Teléfono de contacto: ${telInput.value.trim()}`);

    const opt = catSelect.options[catSelect.selectedIndex];
    const price = opt && opt.dataset.price ? Number(opt.dataset.price) : 0;
    const m2 = Number(m2Input.value) || 0;
    if (price > 0 && m2 > 0) {
      const total = price * m2;
      lines.push(`• Presupuesto material referencial: ~$${total.toLocaleString('es-CL')} CLP`);
    }

    lines.push('\n¿Podrían indicarme disponibilidad y coordinar asesoría? Muchas gracias.');

    const fullMsg = lines.join('\n');
    window.open(`https://wa.me/56973763087?text=${encodeURIComponent(fullMsg)}`, '_blank', 'noopener');
  });

  /* ---------- Contador animado para estadísticas ---------- */
  const countEls = $$('[data-count]');
  if ('IntersectionObserver' in window && countEls.length) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = Number(el.dataset.count);
        let cur = 0;
        const step = Math.ceil(target / 30);
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) {
            el.textContent = target;
            clearInterval(t);
          } else {
            el.textContent = cur;
          }
        }, 35);
        countIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    countEls.forEach((el) => countIO.observe(el));
  }

  /* ---------- Newsletter (demo) ---------- */
  $('#newsletter').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = $('button', e.target);
    btn.textContent = '¡Suscrito con éxito!';
    e.target.reset();
    setTimeout(() => (btn.textContent = 'Suscribirme'), 3000);
  });
})();
