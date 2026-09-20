(() => {
  const english = document.documentElement.lang === 'en';
  const sections = ['.hero', '#about', '#work', '#marta', '#sessions', '#contact', 'footer'];
  let position;
  try {
    const saved = JSON.parse(sessionStorage.getItem('tykhe-language-position') || 'null');
    if (saved && saved.language === document.documentElement.lang && Date.now() - saved.time < 15000) {
      position = saved;
      sessionStorage.removeItem('tykhe-language-position');
      history.scrollRestoration = 'manual';
    }
  } catch {}
  try {
    if (!english && localStorage.getItem('tykhe-language') === 'en') {
      location.replace('en.html' + location.search + location.hash);
    }
    if (english) localStorage.setItem('tykhe-language', 'en');
  } catch {}
  document.addEventListener('DOMContentLoaded', () => {
    if (position) {
      let interrupted = false;
      const cancel = () => { interrupted = true; };
      ['wheel', 'touchstart', 'keydown'].forEach(name => addEventListener(name, cancel, { once: true, passive: true }));
      const restore = () => {
        if (interrupted) return;
        const section = sections.includes(position.section) && document.querySelector(position.section);
        const top = section ? section.getBoundingClientRect().top + scrollY + position.ratio * section.offsetHeight : position.y;
        const root = document.documentElement;
        const previous = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        scrollTo(0, position.y === 0 ? 0 : top);
        root.style.scrollBehavior = previous;
      };
      restore();
      document.fonts.ready.then(() => requestAnimationFrame(() => {
        restore();
        ['wheel', 'touchstart', 'keydown'].forEach(name => removeEventListener(name, cancel));
        history.scrollRestoration = 'auto';
      }));
    }
    document.querySelectorAll('[data-language]').forEach(link => {
      link.href = link.dataset.language === 'en' ? 'en.html' : 'index.html';
      link.addEventListener('click', event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (link.dataset.language === document.documentElement.lang) { event.preventDefault(); return; }
        let current = sections[0];
        sections.forEach(selector => { if (document.querySelector(selector)?.getBoundingClientRect().top <= 1) current = selector; });
        const section = document.querySelector(current);
        try {
          localStorage.setItem('tykhe-language', link.dataset.language);
          sessionStorage.setItem('tykhe-language-position', JSON.stringify({
            language: link.dataset.language, section: current, y: scrollY,
            ratio: section ? -section.getBoundingClientRect().top / section.offsetHeight : 0, time: Date.now()
          }));
        } catch {}
      });
    });
  });
})();
