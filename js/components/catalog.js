import { createCardMarkup } from './card.js';
import { initPagination, renderPagination } from './pagination.js';
import { getProducts } from './products.js';
import { getState, setPage } from './state.js';
import { initTippy } from './tippy.js';

const PER_PAGE = 6;

const SORTERS = {
  'price-min': (a, b) => a.price.new - b.price.new,
  'price-max': (a, b) => b.price.new - a.price.new,
  'rating-max': (a, b) => b.rating - a.rating,
};

const catalog = document.querySelector('.catalog');
const list = document.querySelector('.catalog__list');

export function initCatalog() {
  if (!list) return;

  initPagination((page) => {
    setPage(page);
    renderCatalog();

    catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  renderCatalog();
}

// Отфильтрованный и отсортированный список без разбивки на страницы
function getVisibleProducts() {
  const { filters, sort, city } = getState();

  return getProducts()
    .filter((item) => {
      const matchesType = !filters.types.length || item.type.some((type) => filters.types.includes(type));
      // «В наличии» проверяем для города, выбранного в шапке
      const matchesStatus = filters.status !== 'instock' || item.availability[city] > 0;

      return matchesType && matchesStatus;
    })
    .sort(SORTERS[sort]);
}

export function renderCatalog() {
  if (!list) return;

  const products = getVisibleProducts();
  const totalPages = Math.ceil(products.length / PER_PAGE);

  // После смены фильтров текущей страницы может уже не существовать
  if (getState().page > totalPages) {
    setPage(Math.max(totalPages, 1));
  }

  const { page } = getState();
  const start = (page - 1) * PER_PAGE;

  if (products.length) {
    list.innerHTML = products
      .slice(start, start + PER_PAGE)
      .map((item) => `<li class="catalog__item">${createCardMarkup(item)}</li>`)
      .join('');
  } else {
    showCatalogMessage('По выбранным фильтрам ничего не найдено');
  }

  initTippy(list);
  renderPagination(totalPages, page);
}

export function showCatalogMessage(text) {
  if (!list) return;

  const item = document.createElement('li');

  item.classList.add('catalog__empty');
  item.textContent = text;

  list.replaceChildren(item);
}
