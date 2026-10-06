export function initAccordion() {
  const buttons = document.querySelectorAll('.accordion__btn');

  const setActive = (btn, isActive) => {
    btn.classList.toggle('accordion__btn--active', isActive);
    btn.setAttribute('aria-expanded', String(isActive));
  };

  buttons.forEach((btn) => {
    setActive(btn, false);

    btn.addEventListener('click', () => {
      const isActive = btn.classList.contains('accordion__btn--active');

      // Only one question stays open at a time
      buttons.forEach((other) => setActive(other, false));

      setActive(btn, !isActive);
    });
  });
}
