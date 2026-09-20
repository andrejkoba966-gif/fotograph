(() => {
  const video = document.querySelector('.hero-video');
  const toggle = document.querySelector('.hero-video-toggle');
  const mobile = matchMedia('(max-width:700px)');
  const motion = matchMedia('(prefers-reduced-motion:reduce)');
  let userPaused = motion.matches;
  let visible = true;
  video.muted = true;
  function label() { toggle.textContent = document.documentElement.lang === 'en' ? (video.paused ? 'Play video' : 'Pause') : (video.paused ? 'Відтворити відео' : 'Пауза'); }
  function play() { if (!userPaused && visible) video.play().catch(label); }
  function source() {
    video.classList.remove('is-ready');
    video.src = mobile.matches ? 'assets/hero-video-b.mp4' : 'assets/hero-video-a.mp4';
    video.load();
    play();
  }
  toggle.addEventListener('click', () => {
    userPaused = !video.paused;
    if (userPaused) video.pause(); else video.play().catch(label);
  });
  video.addEventListener('play', label);
  video.addEventListener('pause', label);
  video.addEventListener('error', () => { video.hidden = true; toggle.hidden = true; });
  video.addEventListener('loadeddata', () => {
    video.hidden = false; toggle.hidden = false;
    if ('requestVideoFrameCallback' in video && !video.paused) {
      video.requestVideoFrameCallback(() => video.classList.add('is-ready'));
    } else video.classList.add('is-ready');
  });
  mobile.addEventListener('change', source);
  motion.addEventListener('change', () => { userPaused = motion.matches; if (userPaused) video.pause(); else play(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) play(); else video.pause();
  }).observe(video);
  source();
})();
