(function () {
  try {
    if (localStorage.getItem('tunc-cookie-ok') === '1') return;
  } catch (e) { /* localStorage disabled — show banner anyway */ }

  var path = window.location.pathname;
  var depth = (path.replace(/[^\/]+$/, '').match(/\//g) || []).length - 1;
  var dsHref = (depth > 0 ? '../' : './') + 'datenschutz.html';

  var bar = document.createElement('div');
  bar.className = 'cookie-banner';
  bar.innerHTML =
    '<div class="cookie-text">' +
      '<strong>Hinweis zu Cookies & externen Inhalten:</strong> ' +
      'Diese Website verwendet ausschließlich technisch notwendige Cookies. ' +
      'Auf der Startseite wird zur Standortanzeige Google Maps eingebunden. ' +
      'Mehr in der <a href="' + dsHref + '">Datenschutzerklärung</a>.' +
    '</div>' +
    '<button class="cookie-btn" type="button" aria-label="Hinweis bestätigen">Verstanden</button>';
  document.body.appendChild(bar);

  requestAnimationFrame(function () { bar.classList.add('show'); });

  bar.querySelector('.cookie-btn').addEventListener('click', function () {
    try { localStorage.setItem('tunc-cookie-ok', '1'); } catch (e) {}
    bar.classList.remove('show');
    setTimeout(function () { bar.remove(); }, 350);
  });
})();
