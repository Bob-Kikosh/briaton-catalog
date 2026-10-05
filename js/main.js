import { initAccordion } from './components/accordion.js';
import { initBasket } from './components/basket.js';
import { initBurger } from './components/burger.js';
import { initCatalog, renderCatalog, showCatalogMessage } from './components/catalog.js';
import { initFilters } from './components/filters.js';
import { initForm } from './components/form.js';
import { initLocation } from './components/location.js';
import { loadProducts } from './components/products.js';
import { initSlider } from './components/slider.js';
import { initSort } from './components/sort.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Всё, что не зависит от товаров, запускаем сразу
  initBurger();
  initAccordion();
  initForm();
  initLocation(renderCatalog);

  try {
    await loadProducts();
  } catch (error) {
    console.error(error);
    showCatalogMessage('Не удалось загрузить товары. Обновите страницу');
    return;
  }

  initFilters(renderCatalog);
  initSort(renderCatalog);
  initCatalog();
  initBasket();
  initSlider();
});
