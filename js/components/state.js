import { readStorage, writeStorage } from './utils.js';

const CITY_KEY = 'briaton-city';

export const CITIES = {
  newYork: 'New York',
  chicago: 'Chicago',
  losAngeles: 'Los Angeles',
};

const DEFAULT_CITY = 'chicago';
const DEFAULT_FILTERS = {
  types: [],
  status: 'all-item',
};

function loadCity() {
  const saved = readStorage(CITY_KEY, DEFAULT_CITY);

  return saved in CITIES ? saved : DEFAULT_CITY;
}

// Single catalog state: everything the product list on the page depends on
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

// Any change to the selection returns to the first page
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
