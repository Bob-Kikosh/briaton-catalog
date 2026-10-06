const DATA_URL = './data/data.json';

let products = [];

export async function loadProducts() {
  const response = await fetch(DATA_URL);

  if (!response.ok) {
    throw new Error(`Failed to load products: ${response.status}`);
  }

  products = await response.json();

  return products;
}

export function getProducts() {
  return products;
}

export function getProductById(id) {
  return products.find((product) => product.id === Number(id));
}
