(function () {
  if (localStorage.getItem('snap_nl_subscribed') || sessionStorage.getItem('snap_nl_closed')) return;

  const CSS = `
    #snap-popup-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(27,42,74,0.6); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      padding: 1.5rem;
      animation: snapFadeIn 0.4s ease both;
    }
    @keyframes snapFadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes snapSlideUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }

    #snap-popup {
      background: #F7F4EF;
      max-width: 460px; width: 100%;
      padding: 2.75rem 2.5rem 2.25rem;
      position: relative;
      border-top: 4px solid #B8975A;
      box-shadow: 0 28px 72px rgba(27,42,74,0.28);
      animation: snapSlideUp 0.45s ease both 0.1s;
    }

    #snap-popup-close {
      position: absolute; top: 0.9rem; right: 1.1rem;
      background: none; border: none; cursor: pointer;
      font-size: 1.3rem; color: #1B2A4A; opacity: 0.35;
      line-height: 1; padding: 0.3rem;
      transition: opacity 0.2s;
    }
    #snap-popup-close:hover { opacity: 0.75; }

    #snap-popup-eyebrow {
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.7rem; font-weight: 500; letter-spacing: 0.14em;
      text-transform: uppercase; color: #B8975A;
      display: flex; align-items: center; gap: 0.6rem;
      margin-bottom: 0.9rem;
    }
    #snap-popup-eyebrow::before {
      content: ''; display: block; width: 1.5rem; height: 1px; background: #B8975A;
    }

    #snap-popup-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(1.55rem, 3.5vw, 2.1rem);
      font-weight: 400; color: #1B2A4A;
      line-height: 1.18; letter-spacing: -0.02em;
      margin-bottom: 0.35rem;
    }
    #snap-popup-title em { font-style: italic; color: #B8975A; }

    #snap-popup-sub {
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.82rem; font-weight: 300; color: #2C2C2C;
      opacity: 0.65; margin-bottom: 1.5rem; letter-spacing: 0.01em;
    }

    #snap-popup-benefits {
      list-style: none; margin-bottom: 1.75rem;
      display: flex; flex-direction: column; gap: 0.7rem;
    }
    #snap-popup-benefits li {
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.93rem; font-weight: 300; color: #1B2A4A;
      display: flex; align-items: flex-start; gap: 0.7rem;
      line-height: 1.55;
    }
    #snap-popup-benefits li::before {
      content: '✓';
      display: flex; align-items: center; justify-content: center;
      min-width: 1.3rem; height: 1.3rem; border-radius: 50%;
      background: #1B2A4A; color: #B8975A;
      font-size: 0.65rem; font-weight: 700;
      flex-shrink: 0; margin-top: 0.1rem;
    }

    #snap-popup-form { display: flex; flex-direction: column; gap: 0.65rem; }

    #snap-popup-input {
      width: 100%; padding: 0.85rem 1rem;
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.93rem; font-weight: 300;
      color: #1B2A4A; background: #fff;
      border: 1.5px solid #D4C9B4; border-radius: 2px;
      outline: none; transition: border-color 0.2s;
    }
    #snap-popup-input:focus { border-color: #B8975A; }
    #snap-popup-input::placeholder { color: #1B2A4A; opacity: 0.35; }

    #snap-popup-btn {
      width: 100%; padding: 0.9rem;
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.88rem; font-weight: 600;
      letter-spacing: 0.06em; text-transform: uppercase;
      background: #1B2A4A; color: #F7F4EF;
      border: 2px solid #1B2A4A; border-radius: 2px;
      cursor: pointer; transition: background 0.25s, color 0.25s;
    }
    #snap-popup-btn:hover { background: #B8975A; border-color: #B8975A; color: #fff; }
    #snap-popup-btn:disabled { opacity: 0.55; cursor: not-allowed; }

    #snap-popup-notice {
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.7rem; font-weight: 300; color: #2C2C2C;
      opacity: 0.4; text-align: center; margin-top: 0.15rem;
    }

    #snap-popup-success {
      text-align: center; padding: 0.75rem 0 0.25rem;
    }
    #snap-popup-success .snap-check {
      width: 52px; height: 52px; border-radius: 50%;
      background: #1B2A4A; color: #B8975A;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; margin: 0 auto 1.1rem;
    }
    #snap-popup-success .snap-success-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.25rem; font-weight: 400; color: #1B2A4A;
      margin-bottom: 0.5rem;
    }
    #snap-popup-success p {
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.9rem; font-weight: 300; color: #2C2C2C;
      opacity: 0.75; line-height: 1.7;
    }

    @media (max-width: 520px) {
      #snap-popup { padding: 2.25rem 1.5rem 2rem; }
      #snap-popup-title { font-size: 1.5rem; }
    }
  `;

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'snap-popup-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'snap-popup-title');

  overlay.innerHTML = `
    <div id="snap-popup">
      <button id="snap-popup-close" aria-label="Fermer">✕</button>
      <div id="snap-popup-eyebrow">La newsletter gratuite de SnapEnglish</div>
      <h2 id="snap-popup-title">Parlez anglais<br>comme un <em>natif</em> 🇬🇧</h2>
      <p id="snap-popup-sub">Rejoignez les abonnés SnapEnglish — c'est gratuit.</p>
      <ul id="snap-popup-benefits">
        <li>Je reçois 1 conseil pratique par semaine pour progresser en anglais</li>
        <li>J'apprends à utiliser les expressions des anglophones</li>
        <li>Je télécharge mon ebook gratuit (expressions les plus utilisées par les anglophones)</li>
      </ul>
      <form id="snap-popup-form" name="newsletter" method="POST" data-netlify="true" netlify-honeypot="bot-field" novalidate>
        <input type="hidden" name="form-name" value="newsletter" />
        <input type="hidden" name="bot-field" />
        <input id="snap-popup-input" type="email" name="email" placeholder="Votre adresse e-mail" autocomplete="email" required />
        <button id="snap-popup-btn" type="submit">Je m'abonne gratuitement</button>
        <p id="snap-popup-notice">Pas de spam · Désinscription en 1 clic</p>
      </form>
      <div id="snap-popup-success" style="display:none">
        <div class="snap-check">✓</div>
        <div class="snap-success-title">Bienvenue !</div>
        <p>Vous êtes inscrit(e) à la newsletter SnapEnglish.</p>
        <a id="snap-ebook-btn" href="/ebook-expressions-anglophones" target="_blank" style="display:inline-flex;align-items:center;gap:0.5rem;margin-top:1.25rem;background:#B8975A;color:#1B2A4A;padding:0.8rem 1.75rem;font-family:'DM Sans',system-ui,sans-serif;font-size:0.85rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;text-decoration:none;border-radius:2px;">
          📖 Accéder à mon ebook gratuit
        </a>
      </div>
    </div>
  `;

  function closePopup() {
    sessionStorage.setItem('snap_nl_closed', '1');
    overlay.style.transition = 'opacity 0.3s';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 320);
  }

  function showPopup() {
    document.body.appendChild(overlay);
    document.getElementById('snap-popup-close').addEventListener('click', closePopup);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closePopup(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePopup(); });
  }

  setTimeout(showPopup, 10000);

  document.getElementById('snap-popup-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('snap-popup-input').value.trim();
    if (!email || !email.includes('@')) {
      document.getElementById('snap-popup-input').focus();
      return;
    }
    const btn = document.getElementById('snap-popup-btn');
    btn.disabled = true;
    btn.textContent = 'Envoi…';

    try {
      const body = new URLSearchParams({ email });
      const res = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
      if (!res.ok) throw new Error('fail');
      localStorage.setItem('snap_nl_subscribed', '1');
      document.getElementById('snap-popup-form').style.display = 'none';
      document.getElementById('snap-popup-success').style.display = 'block';
    } catch {
      btn.disabled = false;
      btn.textContent = "Je m'abonne gratuitement";
    }
  });
})();
