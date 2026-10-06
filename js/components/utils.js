const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatPrice(value) {
  return priceFormatter.format(value);
}

// Product data is inserted into markup as a string, so special characters must be escaped
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// localStorage may be unavailable (private mode, blocked in settings),
// so no access to it should ever break the page
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
    // Saving failed — keep working without persistence
  }
}
