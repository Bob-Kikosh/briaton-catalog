// Учебный адрес-заглушка: принимает запрос и возвращает его содержимое
const FORM_URL = 'https://httpbin.org/post';

export function initForm() {
  const form = document.querySelector('.questions__form');

  if (!form || typeof JustValidate !== 'function') return;

  const submitBtn = form.querySelector('[type="submit"]');
  const validator = new JustValidate(form);

  validator
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Введите имя',
      },
      {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Минимум 3 символа',
      },
      {
        rule: 'maxLength',
        value: 20,
        errorMessage: 'Максимум 20 символов',
      },
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Введите email',
      },
      {
        rule: 'email',
        errorMessage: 'Некорректный email',
      },
    ])
    .addField('#agree', [
      {
        rule: 'required',
        errorMessage: 'Подтвердите согласие',
      },
    ])
    .onSuccess(async () => {
      // Блокируем кнопку, чтобы заявка не ушла дважды
      submitBtn.disabled = true;

      try {
        const response = await fetch(FORM_URL, {
          method: 'POST',
          body: new FormData(form),
        });

        if (!response.ok) throw new Error(`Ошибка отправки: ${response.status}`);

        showMessage('Заявка успешно отправлена');

        form.reset();
        validator.refresh();
      } catch (error) {
        console.error(error);
        showMessage('Не удалось отправить заявку. Попробуйте ещё раз');
      } finally {
        submitBtn.disabled = false;
      }
    });
}

function showMessage(text) {
  const lastFocused = document.activeElement;
  const message = document.createElement('div');

  message.classList.add('message');
  message.setAttribute('role', 'alertdialog');
  message.setAttribute('aria-modal', 'true');
  message.setAttribute('aria-label', 'Сообщение');

  message.innerHTML = `
    <div class="message__content">
      <p class="message__text"></p>
      <button class="message__close" type="button" aria-label="Закрыть">
        <svg width="24" height="24" aria-hidden="true">
          <use href="images/sprite.svg#icon-close"></use>
        </svg>
      </button>
    </div>
  `;

  message.querySelector('.message__text').textContent = text;

  const closeMessage = () => {
    message.remove();
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKeydown);
    lastFocused?.focus();
  };

  function onKeydown(event) {
    if (event.key === 'Escape') closeMessage();
  }

  message.addEventListener('click', (event) => {
    // Закрываем по кнопке и по клику на затемнение
    if (event.target === message || event.target.closest('.message__close')) closeMessage();
  });

  document.addEventListener('keydown', onKeydown);

  document.body.append(message);
  document.body.classList.add('no-scroll');
  message.querySelector('.message__close').focus();
}
