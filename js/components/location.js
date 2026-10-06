import { CITIES, getState, setCity } from './state.js';

export function initLocation(onChange) {
  const location = document.querySelector('.location');
  const btn = document.querySelector('.location__city');
  const name = document.querySelector('.location__city-name');
  const items = document.querySelectorAll('.location__sublink');

  if (!location || !btn || !name) return;

  const toggleList = (isOpen) => {
    btn.classList.toggle('location__city--active', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  };

  const showCity = () => {
    const { city } = getState();

    name.textContent = CITIES[city];

    items.forEach((item) => {
      item.classList.toggle('location__sublink--active', item.dataset.city === city);
    });
  };

  showCity();

  btn.addEventListener('click', () => {
    toggleList(!btn.classList.contains('location__city--active'));
  });

  items.forEach((item) => {
    item.addEventListener('click', () => {
      setCity(item.dataset.city);
      showCity();
      toggleList(false);
      btn.focus();

      // The "In stock" filter depends on the city
      onChange();
    });
  });

  document.addEventListener('click', (event) => {
    if (!location.contains(event.target)) toggleList(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && btn.classList.contains('location__city--active')) {
      toggleList(false);
      btn.focus();
    }
  });
}
