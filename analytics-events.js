(function () {
  if (typeof gtag !== 'function') return;

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.href || '';

    // Clic vers Mon Compte Formation (inscription CPF)
    if (href.includes('moncompteformation.gouv.fr')) {
      gtag('event', 'clic_inscription_cpf', {
        event_category: 'conversion',
        event_label: window.location.pathname
      });
    }

    // Clic WhatsApp
    if (href.includes('wa.me')) {
      gtag('event', 'clic_whatsapp', {
        event_category: 'conversion',
        event_label: window.location.pathname
      });
    }

    // Clic email contact
    if (href.startsWith('mailto:')) {
      gtag('event', 'clic_email_contact', {
        event_category: 'conversion',
        event_label: window.location.pathname
      });
    }
  });
})();
