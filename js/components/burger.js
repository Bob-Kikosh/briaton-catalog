export function initBurger() {
  const openBtn = document.querySelector('.header__catalog-btn');
  const menu = document.querySelector('.main-menu');
  const closeBtn = document.querySelector('.main-menu__close');

  if (!openBtn || !menu || !closeBtn) return;

  const toggleMenu = (isOpen) => {
    menu.classList.toggle('main-menu--active', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    openBtn.setAttribute('aria-expanded', String(isOpen));

    // Focus moves into the menu on open and back to the button on close
    (isOpen ? closeBtn : openBtn).focus();
  };

  openBtn.addEventListener('click', () => toggleMenu(true));
  closeBtn.addEventListener('click', () => toggleMenu(false));

  // A click on the backdrop around the panel
  menu.addEventListener('click', (event) => {
    if (event.target === menu) toggleMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('main-menu--active')) {
      toggleMenu(false);
    }
  });
}
