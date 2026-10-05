import { readStorage, writeStorage } from './utils.js';

const CITY_KEY = 'briaton-city';

export const CITIES = {
  moscow: 'Москва',
  orenburg: 'Оренбург',
  saintPetersburg: 'Санкт-Петербург',
};

const DEFAULT_CITY = 'orenburg';
const DEFAULT_FILTERS = {
  types: [],
  status: 'all-item',
};

function loadCity() {
  const saved = readStorage(CITY_KEY, DEFAULT_CITY);

  return saved in CITIES ? saved : DEFAULT_CITY;
}

// Единое состояние каталога: всё, от чего зависит список товаров на странице
const state = {
  filters: { ...DEFAULT_FILTERS },
  sort: 'price-min',
  page: 1,
  city: loadCity(),
};

export function getState() {
  return state;
}

export function setPage(page) {
  state.page = page;
}

// Любое изменение выборки возвращает на первую страницу
export function setFilters(newFilters) {
  state.filters = { ...state.filters, ...newFilters };
  state.page = 1;
}

export function resetFilters() {
  state.filters = { ...DEFAULT_FILTERS };
  state.page = 1;
}

export function setSort(sort) {
  state.sort = sort;
  state.page = 1;
}

export function setCity(city) {
  if (!(city in CITIES)) return;

  state.city = city;
  state.page = 1;

  writeStorage(CITY_KEY, city);
}
