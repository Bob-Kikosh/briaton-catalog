import { createCardMarkup } from './card.js';
import { getProducts } from './products.js';
import { initTippy } from './tippy.js';

export function initSlider() {
  const container = document.querySelector('.day-products__list');

  if (!container || typeof Swiper !== 'function') return;

  container.innerHTML = getProducts()
    .filter((item) => item.goodsOfDay)
    .map((item) => `
      <li class="day-products__item swiper-slide">
        ${createCardMarkup(item, { small: true, headingTag: 'h3' })}
      </li>
    `)
    .join('');

  initTippy(container);

  new Swiper('.day-products__slider', {
    slidesPerView: 1.2,
    spaceBetween: 12,

    // Количество карточек подстраивается под ширину экрана
    breakpoints: {
      480: { slidesPerView: 2, spaceBetween: 16 },
      768: { slidesPerView: 3, spaceBetween: 20 },
      1200: { slidesPerView: 4, spaceBetween: 40 },
    },

    navigation: {
      nextEl: '.day-products__navigation-btn--next',
      prevEl: '.day-products__navigation-btn--prev',
    },
  });
}
