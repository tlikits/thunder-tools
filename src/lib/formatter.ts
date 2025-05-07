export function formatCurrency(value: number, fractionDigits: number = 2) {
  return value.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatCurrency0(value: number) {
  return formatCurrency(value, 0);
}

export function formatNumber(value: number, fractionDigits: number = 2) {
  return value.toLocaleString("en-AU", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatPercentage(value: number, fractionDigits: number = 2) {
  return value.toLocaleString("en-AU", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatPercentage0(value: number) {
  return formatPercentage(value, 0);
}

export function formatPercentage1(value: number) {
  return formatPercentage(value, 1);
}

export function formatPercentage2(value: number) {
  return formatPercentage(value, 2);
}
