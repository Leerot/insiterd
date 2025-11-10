document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const elTitle = modal.querySelector('.modal-title');
  const elMeta = modal.querySelector('.modal-meta');
  const elDesc = modal.querySelector('.modal-desc');
  const elLink = modal.querySelector('.modal-link');

  function openModal(data) {
    elTitle.textContent = data.name || '';
    elMeta.textContent = data.year ? `Año: ${data.year}` : '';
    elDesc.textContent = data.desc || '';
    if (data.link) {
      elLink.href = data.link;
      elLink.textContent = 'Ver Website';
      elLink.style.display = '';
    } else {
      elLink.removeAttribute('href');
      elLink.textContent = '';
      elLink.style.display = 'none';
    }
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', (e) => {
    const target = e.target;
    if (target.matches('[data-close]') || target.classList.contains('modal-backdrop')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  // Pagination: 6 items per page
  const items = Array.from(gallery.querySelectorAll('figure'));
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageIndicator = document.querySelector('.page-indicator');
  const pageSize = 6;
  let currentPage = 0;

  function totalPages() {
    return Math.max(1, Math.ceil(items.length / pageSize));
  }

  function renderPage() {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    items.forEach((el, i) => {
      el.style.display = (i >= start && i < end) ? '' : 'none';
    });
    if (pageIndicator) pageIndicator.textContent = `${currentPage + 1}/${totalPages()}`;
    if (prevBtn) prevBtn.disabled = currentPage <= 0;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages() - 1;
  }

  function go(delta) {
    const tp = totalPages();
    currentPage = Math.min(tp - 1, Math.max(0, currentPage + delta));
    renderPage();
  }

  prevBtn && prevBtn.addEventListener('click', () => go(-1));
  nextBtn && nextBtn.addEventListener('click', () => go(1));
  renderPage();

  gallery.addEventListener('click', (e) => {
    const fig = e.target.closest('figure');
    if (!fig || !gallery.contains(fig)) return;

    const anchor = fig.querySelector('a');
    if (anchor && anchor.contains(e.target)) e.preventDefault();

    const img = fig.querySelector('img');
    const data = {
      year: fig.getAttribute('data-year') || '',
      name: fig.getAttribute('data-name') || (img ? img.alt : ''),
      desc: fig.getAttribute('data-desc') || '',
      link: fig.getAttribute('data-link') || (anchor ? anchor.href : ''),
    };
    openModal(data);
  });
});
