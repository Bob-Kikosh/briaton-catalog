const pagination = document.querySelector('.catalog__pagination');

export function renderPagination(totalPages, currentPage) {
  if (!pagination) return;

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  pagination.innerHTML = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    const isCurrent = page === currentPage;

    return `
      <li class="catalog__pagination-item">
        <button class="catalog__pagination-link${isCurrent ? ' catalog__pagination-link--active' : ''}"
                type="button" data-page="${page}" aria-label="Page ${page}"
                ${isCurrent ? 'aria-current="page"' : ''}>${page}</button>
      </li>
    `;
  }).join('');
}

// One handler for the whole list instead of one per button
export function initPagination(onChange) {
  if (!pagination) return;

  pagination.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-page]');

    if (!btn) return;

    onChange(Number(btn.dataset.page));
  });
}
