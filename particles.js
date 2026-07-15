export function initRevealObserver() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((t) => io.observe(t));
}
