import { getState, setSort } from './state.js';

export function initSort(onChange) {
  const select = document.querySelector('.catalog__sort-select');

  if (!select) return;

  // The browser may restore the field value after a reload, so it is synced with the state
  select.value = getState().sort;

  select.addEventListener('change', () => {
    setSort(select.value);
    onChange();
  });
}
