// Hero title "develops" letter by letter, the first one keeps a touch of green light.
(function () {
  var root = document.documentElement;
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) root.classList.add('hero-anim');
  document.addEventListener('DOMContentLoaded', function () {
    var h1 = document.getElementById('hero-title');
    var word = h1 && h1.firstChild;
    if (!word || word.nodeType !== 3) { root.classList.remove('hero-anim'); return; }
    var text = word.textContent;
    h1.setAttribute('aria-label', text.trim());
    var letters = document.createElement('span');
    letters.setAttribute('aria-hidden', 'true');
    Array.from(text).forEach(function (ch, i) {
      var s = document.createElement('span');
      s.className = 'hero-letter';
      s.style.setProperty('--i', i);
      s.textContent = ch;
      letters.appendChild(s);
    });
    h1.replaceChild(letters, word);
    var mark = h1.querySelector('.title-dot');
    if (mark) mark.setAttribute('aria-hidden', 'true');
  });
})();
