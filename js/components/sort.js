import { getState, setSort } from './state.js';

export function initSort(onChange) {
  const select = document.querySelector('.catalog__sort-select');

  if (!select) return;

  // Браузер может восстановить значение поля после перезагрузки — синхронизируем с состоянием
  select.value = getState().sort;

  select.addEventListener('change', () => {
    setSort(select.value);
    onChange();
  });
}
