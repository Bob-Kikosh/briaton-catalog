import { getProducts } from './products.js';
import { resetFilters, setFilters } from './state.js';

export function initFilters(onChange) {
  const form = document.querySelector('.catalog-form');

  if (!form) return;

  updateFilterCounts(form);

  // Браузер может восстановить отмеченные поля после перезагрузки — берём значения из формы
  setFilters(readFilters(form));

  form.addEventListener('change', () => {
    setFilters(readFilters(form));
    onChange();
  });

  // Кнопка «Сбросить фильтры» очищает поля сама, остаётся сбросить состояние
  form.addEventListener('reset', () => {
    resetFilters();
    onChange();
  });

  form.addEventListener('submit', (event) => event.preventDefault());
}

function readFilters(form) {
  return {
    types: [...form.querySelectorAll('input[name="type"]:checked')].map((input) => input.value),
    status: form.querySelector('input[name="status"]:checked')?.value ?? 'all-item',
  };
}

// Количество товаров каждого типа рядом с чекбоксом
function updateFilterCounts(form) {
  const counts = {};

  getProducts().forEach((product) => {
    product.type.forEach((type) => {
      counts[type] = (counts[type] ?? 0) + 1;
    });
  });

  form.querySelectorAll('input[name="type"]').forEach((input) => {
    const countElement = input.closest('.custom-checkbox')?.querySelector('.custom-checkbox__count');

    if (countElement) {
      countElement.textContent = counts[input.value] ?? 0;
    }
  });
}
