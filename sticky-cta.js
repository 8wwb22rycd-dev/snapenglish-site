(function () {
  if (sessionStorage.getItem('snap_cta_closed')) return;

  var CSS = `
    #snap-sticky {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 95;
      background: #1B2A4A; border-top: 2px solid #B8975A;
      padding: 0.85rem clamp(1.5rem,5vw,4rem);
      transform: translateY(100%); transition: transform 0.35s ease;
      display: none;
    }
    #snap-sticky.snap-sticky-visible { transform: translateY(0); }
    #snap-sticky-inner {
      max-width: 1200px; margin: 0 auto;
      display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    }
    #snap-sticky-text { display: flex; flex-direction: column; gap: 0.1rem; }
    #snap-sticky-text strong { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.9rem; font-weight: 600; color: #F7F4EF; }
    #snap-sticky-text span { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.75rem; color: rgba(247,244,239,0.55); }
    #snap-sticky-btn {
      background: #B8975A; color: #1B2A4A;
      padding: 0.7rem 1.5rem; border-radius: 2px;
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.85rem; font-weight: 700; letter-spacing: 0.03em;
      text-decoration: none; white-space: nowrap; flex-shrink: 0;
      transition: background 0.2s;
    }
    #snap-sticky-btn:hover { background: #c9a96a; }
    #snap-sticky-close {
      background: none; border: none; color: #F7F4EF; opacity: 0.4;
      font-size: 1rem; cursor: pointer; padding: 0.3rem; flex-shrink: 0;
      transition: opacity 0.2s; line-height: 1;
    }
    #snap-sticky-close:hover { opacity: 0.85; }
    @media (max-width: 600px) {
      #snap-sticky-text span { display: none; }
      #snap-sticky-btn { padding: 0.65rem 1.1rem; font-size: 0.8rem; }
    }
  `;

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.id = 'snap-sticky';
  bar.setAttribute('role', 'complementary');
  bar.setAttribute('aria-label', 'Inscription formation anglais CPF');
  bar.innerHTML = `
    <div id="snap-sticky-inner">
      <div id="snap-sticky-text">
        <strong>Formation anglais CPF</strong>
        <span>150&nbsp;€ reste à charge &middot; Certification incluse</span>
      </div>
      <a href="/tarifs" id="snap-sticky-btn">S'inscrire →</a>
      <button id="snap-sticky-close" aria-label="Fermer">✕</button>
    </div>
  `;
  document.body.appendChild(bar);

  var visible = false;

  function update() {
    var scrollY = window.scrollY;
    var footer = document.querySelector('footer');
    var footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
    var show = scrollY > 400 && footerTop > 80;

    if (show && !visible) {
      bar.style.display = 'block';
      requestAnimationFrame(function () { bar.classList.add('snap-sticky-visible'); });
      visible = true;
    } else if (!show && visible) {
      bar.classList.remove('snap-sticky-visible');
    } else if (show && visible) {
      bar.classList.add('snap-sticky-visible');
    }
  }

  window.addEventListener('scroll', update, { passive: true });

  document.getElementById('snap-sticky-close').addEventListener('click', function () {
    bar.classList.remove('snap-sticky-visible');
    sessionStorage.setItem('snap_cta_closed', '1');
  });
})();
