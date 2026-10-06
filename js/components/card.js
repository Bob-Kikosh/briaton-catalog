import { CITIES } from './state.js';
import { escapeHtml, formatPrice } from './utils.js';

const IMAGE_SIZES = {
  default: { width: 290, height: 436 },
  small: { width: 290, height: 344 },
};

// One card markup for both the catalog and the "Deals of the day" slider.
// small — compact card, headingTag — heading level that fits the section.
export function createCardMarkup(item, { small = false, headingTag = 'h2' } = {}) {
  const size = small ? IMAGE_SIZES.small : IMAGE_SIZES.default;
  const name = escapeHtml(item.name);

  return `
    <div class="product-card${small ? ' product-card--small' : ''}">
      <div class="product-card__visual">
        <img class="product-card__img" src="${escapeHtml(item.image)}" width="${size.width}" height="${size.height}"
             alt="${name}" loading="lazy">
        <div class="product-card__more">
          <button class="product-card__link btn btn--icon" type="button" data-basket-add="${item.id}">
            <span class="btn__text">Add to cart</span>
            <svg width="24" height="24" aria-hidden="true">
              <use href="images/sprite.svg#icon-basket"></use>
            </svg>
          </button>
          <a href="#" class="product-card__link btn btn--secondary">
            <span class="btn__text">Details</span>
          </a>
        </div>
      </div>
      <div class="product-card__info">
        <${headingTag} class="product-card__title">${name}</${headingTag}>
        ${item.price.old ? `<span class="product-card__old">${formatPrice(item.price.old)}</span>` : ''}
        <span class="product-card__price">${formatPrice(item.price.new)}</span>
        <div class="product-card__tooltip tooltip">
          <button class="tooltip__btn" type="button" aria-label="Show stock by city">
            <svg class="tooltip__icon" width="5" height="10" aria-hidden="true">
              <use href="images/sprite.svg#icon-i"></use>
            </svg>
          </button>
          <div class="tooltip__content">
            ${createAvailabilityMarkup(item.availability)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function createAvailabilityMarkup(availability) {
  const items = Object.entries(availability)
    .map(([city, count]) => `
      <li class="tooltip__item">
        <span class="tooltip__text">
          ${escapeHtml(CITIES[city] ?? city)}: <span class="tooltip__count">${Number(count)}</span>
        </span>
      </li>
    `)
    .join('');

  return `
    <span class="tooltip__text">Stock by city:</span>
    <ul class="tooltip__list">${items}</ul>
  `;
}
