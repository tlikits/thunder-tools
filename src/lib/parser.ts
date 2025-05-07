export function parseNumberCharacters(value: string): string {
  // Remove all non-numeric and non-dot characters
  const cleaned = value.replace(/[^0-9.]/g, "");

  // Extract leading integer and optional decimal parts
  const match = cleaned.match(/^0*(\d*)(\.?\d*)/);
  if (!match) return "";

  const intPart = match[1] || "0"; // fallback to "0" if empty
  const fracPart = match[2] || "";

  return intPart + fracPart;
}

export function parseNumber(value: string): number {
  const sanitizedValue = parseNumberCharacters(value);
  const parsedValue = parseFloat(sanitizedValue);
  return isNaN(parsedValue) ? NaN : parsedValue;
}
