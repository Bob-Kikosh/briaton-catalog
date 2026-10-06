import { getProductById } from './products.js';
import { escapeHtml, formatPrice, readStorage, writeStorage } from './utils.js';

const STORAGE_KEY = 'basket';

const basketBtn = document.querySelector('.header__user-btn--basket');
const basketBlock = document.querySelector('.basket');
const basketList = document.querySelector('.basket__list');
const basketCount = document.querySelector('.header__user-count');
const emptyBlock = document.querySelector('.basket__empty-block');
const footer = document.querySelector('.basket__footer');
const totalPrice = document.querySelector('.basket__total-price');

// Basket entries: { id, quantity }. Products are looked up in the catalog by id,
// so the name and price in the basket never drift from the data.
let basket = [];

export function initBasket() {
  if (!basketBtn || !basketBlock) return;

  basket = loadBasket();
  renderBasket();

  basketBtn.addEventListener('click', () => {
    toggleBasket(!basketBlock.classList.contains('basket--active'));
  });

  document.addEventListener('click', (event) => {
    const addBtn = event.target.closest('[data-basket-add]');

    if (addBtn) {
      changeQuantity(Number(addBtn.dataset.basketAdd), 1);
      return;
    }

    // A click outside the basket closes it
    if (!event.target.closest('.basket') && !event.target.closest('.header__user-btn--basket')) {
      toggleBasket(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && basketBlock.classList.contains('basket--active')) {
      toggleBasket(false);
      basketBtn.focus();
    }
  });

  basketList.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action]');

    if (!btn) return;

    // The list is re-rendered, so the click must not reach the outside-click handler
    event.stopPropagation();

    const id = Number(btn.closest('[data-id]').dataset.id);

    if (btn.dataset.action === 'increase') changeQuantity(id, 1);
    if (btn.dataset.action === 'decrease') changeQuantity(id, -1);
    if (btn.dataset.action === 'remove') removeItem(id);
  });
}

function toggleBasket(isOpen) {
  basketBlock.classList.toggle('basket--active', isOpen);
  basketBtn.setAttribute('aria-expanded', String(isOpen));
}

function changeQuantity(id, delta) {
  const item = basket.find((entry) => entry.id === id);

  if (item) {
    item.quantity += delta;
  } else if (delta > 0 && getProductById(id)) {
    basket.push({ id, quantity: delta });
  }

  basket = basket.filter((entry) => entry.quantity > 0);

  saveBasket();
  renderBasket();
}

function removeItem(id) {
  basket = basket.filter((entry) => entry.id !== id);

  saveBasket();
  renderBasket();
}

function renderBasket() {
  const items = basket.map((entry) => ({ ...entry, product: getProductById(entry.id) }));
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price.new * item.quantity, 0);

  basketList.innerHTML = items.map(createItemMarkup).join('');

  basketCount.textContent = totalCount;
  totalPrice.textContent = formatPrice(total);

  emptyBlock.hidden = items.length > 0;
  footer.hidden = items.length === 0;
}

function createItemMarkup({ product, quantity }) {
  const name = escapeHtml(product.name);

  return `
    <li class="basket__item" data-id="${product.id}">
      <div class="basket__img">
        <img src="${escapeHtml(product.image)}" alt="" width="60" height="60">
      </div>
      <div class="basket__info">
        <span class="basket__name">${name}</span>
        <div class="basket__counter">
          <button class="basket__counter-btn" type="button" data-action="decrease"
                  aria-label="Decrease quantity">−</button>
          <span class="basket__count" aria-label="Quantity">${quantity}</span>
          <button class="basket__counter-btn" type="button" data-action="increase"
                  aria-label="Increase quantity">+</button>
        </div>
      </div>
      <span class="basket__price">${formatPrice(product.price.new * quantity)}</span>
      <button class="basket__close" type="button" data-action="remove" aria-label="Remove item: ${name}">
        <svg width="24" height="24" aria-hidden="true">
          <use href="images/sprite.svg#icon-close"></use>
        </svg>
      </button>
    </li>
  `;
}

function saveBasket() {
  writeStorage(STORAGE_KEY, basket);
}

function loadBasket() {
  const saved = readStorage(STORAGE_KEY, []);

  if (!Array.isArray(saved)) return [];

  const quantities = new Map();

  // Older versions stored whole products, one entry per unit.
  // Either format is collapsed into a quantity per id; products missing from the catalog are dropped.
  saved.forEach((entry) => {
    const id = Number(entry?.id);
    const quantity = Number(entry?.quantity ?? 1);

    if (!getProductById(id) || !(quantity > 0)) return;

    quantities.set(id, (quantities.get(id) ?? 0) + Math.floor(quantity));
  });

  return [...quantities].map(([id, quantity]) => ({ id, quantity }));
}
