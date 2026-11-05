(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = $('.site-header');
  const menuButton = $('.menu-toggle');
  const nav = $('#menu-principal');
  addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 24), { passive: true });
  menuButton.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });
  $$('nav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open');
  }));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -35px' });
  $$('.reveal, .reveal-shape').forEach(el => observer.observe(el));

  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    const glow = $('.cursor-glow');
    addEventListener('pointermove', event => { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; }, { passive: true });
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        $('.hero-frame', card).style.transform = `rotateY(${x * 8 - 4}deg) rotateX(${-y * 7 + 2}deg)`;
      });
      card.addEventListener('pointerleave', () => $('.hero-frame', card).style.transform = 'rotateY(-4deg) rotateX(2deg)');
    });
  }

  $$('.service-card button').forEach(button => button.addEventListener('click', () => {
    const service = button.closest('.service-card').dataset.service;
    const target = $(`input[name="produto"][value="${service}"]`);
    if (target) { target.checked = true; target.dispatchEvent(new Event('change', { bubbles: true })); }
    $('#orcamento').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

  const form = $('#quote-form');
  const steps = $$('.form-step', form);
  const back = $('.form-back', form);
  const next = $('.form-next', form);
  const progress = $('.form-progress i', form);
  const progressText = $('.form-progress b', form);
  const navWrap = $('.form-nav', form);
  const result = $('.form-result', form);
  let step = 1;
  const selected = () => $(`.form-step[data-step="${step}"] input:checked`, form);
  function renderStep() {
    steps.forEach(item => item.classList.toggle('active', Number(item.dataset.step) === step));
    progress.style.width = `${step * 33.333}%`; progressText.textContent = String(step);
    back.disabled = step === 1; next.disabled = !selected(); next.textContent = step === 3 ? 'Concluir →' : 'Continuar →';
  }
  form.addEventListener('change', () => { next.disabled = !selected(); });
  back.addEventListener('click', () => { if (step > 1) { step--; renderStep(); } });
  next.addEventListener('click', () => {
    if (!selected()) return;
    if (step < 3) { step++; renderStep(); return; }
    const data = new FormData(form);
    const message = `Olá, Dominus Vidraçaria! Gostaria de solicitar um orçamento.\n\nProjeto: ${data.get('produto')}\nLocal: ${data.get('local')}\nPrazo: ${data.get('prazo')}\n\nPodemos conversar?`;
    $('#whatsapp-result').href = `https://wa.me/5585998520072?text=${encodeURIComponent(message)}`;
    steps.forEach(item => item.classList.remove('active')); $('.form-progress', form).hidden = true; navWrap.hidden = true; result.hidden = false;
  });
  $('.restart-form', form).addEventListener('click', () => {
    form.reset(); step = 1; result.hidden = true; $('.form-progress', form).hidden = false; navWrap.hidden = false; renderStep();
  });
  renderStep();

  $$('.faq details').forEach(item => item.addEventListener('toggle', () => {
    if (item.open) $$('.faq details').forEach(other => { if (other !== item) other.open = false; });
  }));
})();

