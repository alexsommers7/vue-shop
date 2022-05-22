export function formatUSPrice(price) {
  const priceString = price.toString();
  const priceRounded = Number(priceString).toFixed(2);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceRounded);
}

export function truncTitle(title) {
  const maxChars = 50;
  return title.length > maxChars ? `${title.substring(0, maxChars)}...` : title;
}
