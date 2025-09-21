const navLinks = document.querySelectorAll('[data-nav-target]');
const sections = [...document.querySelectorAll('main section')];

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          if (link.dataset.navTarget === id) {
            link.setAttribute('aria-current', 'page');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );
  sections.forEach((section) => observer.observe(section));
} else {
  navLinks.forEach((link) => {
    link.addEventListener('focus', () => {
      navLinks.forEach((item) => item.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'page');
    });
  });
}

const copyButton = document.querySelector('[data-copy-email]');
const statusMessage = document.querySelector('[data-copy-status]');

if (copyButton && statusMessage) {
  copyButton.addEventListener('click', async () => {
    const email = copyButton.dataset.copyEmail;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        tempInput.remove();
      }
      statusMessage.textContent = 'Email copiado. ¡Gracias!';
    } catch (error) {
      statusMessage.textContent = 'No se pudo copiar, intenta manualmente.';
    }
  });
}

const yearHolder = document.getElementById('current-year');
if (yearHolder) {
  yearHolder.textContent = new Date().getFullYear();
}
