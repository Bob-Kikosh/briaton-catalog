export function initBurger() {
  const openBtn = document.querySelector('.header__catalog-btn');
  const menu = document.querySelector('.main-menu');
  const closeBtn = document.querySelector('.main-menu__close');

  if (!openBtn || !menu || !closeBtn) return;

  const toggleMenu = (isOpen) => {
    menu.classList.toggle('main-menu--active', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    openBtn.setAttribute('aria-expanded', String(isOpen));

    // Фокус переходит в меню при открытии и возвращается на кнопку при закрытии
    (isOpen ? closeBtn : openBtn).focus();
  };

  openBtn.addEventListener('click', () => toggleMenu(true));
  closeBtn.addEventListener('click', () => toggleMenu(false));

  // Клик по затемнению вокруг панели
  menu.addEventListener('click', (event) => {
    if (event.target === menu) toggleMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('main-menu--active')) {
      toggleMenu(false);
    }
  });
}
