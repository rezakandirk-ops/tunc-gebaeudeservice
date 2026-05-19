(function () {
  function attach(form) {
    if (!form || form.dataset.bound === '1') return;
    form.dataset.bound = '1';

    var hp = document.createElement('input');
    hp.type = 'text';
    hp.name = 'website';
    hp.tabIndex = -1;
    hp.autocomplete = 'off';
    hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;';
    form.appendChild(hp);

    var status = document.createElement('div');
    status.className = 'form-status';
    form.appendChild(status);

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      var btn = form.querySelector('button[type="submit"], .form-btn');
      var originalBtn = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Wird gesendet …'; }

      var fd = new FormData(form);
      var data = {
        vorname:   fd.get('vorname')   || fd.get('first_name') || '',
        nachname:  fd.get('nachname')  || fd.get('last_name')  || '',
        email:     fd.get('email')     || '',
        telefon:   fd.get('telefon')   || fd.get('phone') || '',
        leistung:  fd.get('leistung')  || fd.get('service') || '',
        nachricht: fd.get('nachricht') || fd.get('message') || '',
        website:   fd.get('website')   || ''
      };

      try {
        var resp = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        var json = await resp.json().catch(function () { return {}; });
        if (resp.ok && json.ok) {
          status.className = 'form-status success';
          status.innerHTML = '<strong>Vielen Dank!</strong> Ihre Anfrage ist bei uns eingegangen. Eine Bestätigung wurde an <strong>' + escapeHtml(data.email) + '</strong> gesendet. Wir melden uns innerhalb von 24 Stunden.';
          form.reset();
        } else {
          throw new Error(json.error || 'Versand fehlgeschlagen.');
        }
      } catch (err) {
        status.className = 'form-status error';
        status.innerHTML = '<strong>Etwas ist schiefgelaufen.</strong> ' + escapeHtml(err.message || '') + ' Bitte rufen Sie uns direkt unter <a href="tel:+491637648031">0163 7648031</a> an oder per E-Mail an <a href="mailto:vedat-tunc@outlook.de">vedat-tunc@outlook.de</a>.';
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = originalBtn; }
      }
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  function init() {
    document.querySelectorAll('form[data-contact-form]').forEach(attach);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
