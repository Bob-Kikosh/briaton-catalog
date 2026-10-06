// Test endpoint: accepts the request and echoes its contents back
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
        errorMessage: 'Enter your name',
      },
      {
        rule: 'minLength',
        value: 3,
        errorMessage: 'At least 3 characters',
      },
      {
        rule: 'maxLength',
        value: 20,
        errorMessage: 'No more than 20 characters',
      },
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Enter your email',
      },
      {
        rule: 'email',
        errorMessage: 'Invalid email',
      },
    ])
    .addField('#agree', [
      {
        rule: 'required',
        errorMessage: 'Please confirm your consent',
      },
    ])
    .onSuccess(async () => {
      // The button is disabled so the request is not sent twice
      submitBtn.disabled = true;

      try {
        const response = await fetch(FORM_URL, {
          method: 'POST',
          body: new FormData(form),
        });

        if (!response.ok) throw new Error(`Request failed: ${response.status}`);

        showMessage('Your request has been sent');

        form.reset();
        validator.refresh();
      } catch (error) {
        console.error(error);
        showMessage('Failed to send the request. Please try again');
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
  message.setAttribute('aria-label', 'Message');

  message.innerHTML = `
    <div class="message__content">
      <p class="message__text"></p>
      <button class="message__close" type="button" aria-label="Close">
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
    // Closes on the button and on a backdrop click
    if (event.target === message || event.target.closest('.message__close')) closeMessage();
  });

  document.addEventListener('keydown', onKeydown);

  document.body.append(message);
  document.body.classList.add('no-scroll');
  message.querySelector('.message__close').focus();
}
