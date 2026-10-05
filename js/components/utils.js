const priceFormatter = new Intl.NumberFormat('ru-RU');

export function formatPrice(value) {
  return `${priceFormatter.format(value)} ₽`;
}

// Данные о товарах вставляются в разметку строкой, поэтому спецсимволы нужно экранировать
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// localStorage может быть недоступен (приватный режим, запрет в настройках),
// поэтому любое обращение к нему не должно ломать страницу
export function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    return saved === null ? fallback : JSON.parse(saved);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Сохранить не получилось — работаем дальше без сохранения
  }
}
