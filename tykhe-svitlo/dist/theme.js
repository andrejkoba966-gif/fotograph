(() => {
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let transition;
  let saved;
  try { saved = localStorage.getItem('tykhe-theme'); } catch {}
  let explicit = saved === 'dark' || saved === 'light';
  function apply(theme) {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171c16' : '#dce59c');
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('aria-label', root.lang === 'en' ? (theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme') : (theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'));
      button.title = button.getAttribute('aria-label');
      button.textContent = theme === 'dark' ? '☀' : '☾';
    }
  }
  apply(explicit ? saved : 'light');
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    let selectedTheme = root.dataset.theme;
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      const theme = (explicit ? selectedTheme : root.dataset.theme) === 'dark' ? 'light' : 'dark';
      selectedTheme = theme;
      explicit = true;
      transition?.skipTransition();
      if (document.startViewTransition && !reducedMotion.matches) {
        transition = document.startViewTransition(() => apply(theme));
        transition.finished.catch(() => {});
      } else apply(theme);
      try { localStorage.setItem('tykhe-theme', theme); } catch {}
    });
  });
})();
