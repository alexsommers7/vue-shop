export function prettyPriceUS(number) {
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function truncTitle(title) {
  const maxChars = 50;
  return title.length > maxChars ? `${title.substring(0, maxChars)}...` : title;
}

export function removeObjNull(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => (value === null ? acc : ((acc[key] = value), acc)), {});
}
