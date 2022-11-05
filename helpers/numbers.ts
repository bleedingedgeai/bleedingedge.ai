export function isNumeric(value): boolean {
  if (value === "") {
    return false;
  }

  return !isNaN(value);
}

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function getRandomWholeNumber(min, max): number {
  return Math.floor(Math.random() * (max - min) + min);
}

const THOUSAND = 1000;
const MILLION = 1000000;
const BILLION = THOUSAND * MILLION;

function getDecimals(num) {
  if (num % MILLION === 0) {
    return 0;
  }

  // If greater than a 100 billion show 2 decimals
  if (num >= 100 * BILLION) {
    return 1;
  }

  // If greater than a billion show 2 decimals
  if (num >= BILLION) {
    return 2;
  }

  // If only in the millions show 1 decimal
  if (num >= 100 * MILLION || num === 0) {
    return 0;
  }

  if (num >= 1) {
    return 1;
  }

  return 2;
}

export function formatNumber(num) {
  const decimals = getDecimals(num);

  const [before, after] = new Intl.NumberFormat("en-US", {
    // @ts-ignore
    notation: "compact",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
    .format(num)
    .split(".");

  const letter = after?.replace(/[0-9]/g, "");
  const notation = letter === "K" ? letter.toLowerCase() : letter;
  const decimalValue = after?.replace(/[^0-9]/g, "");

  return `${before}${parseFloat(decimalValue) ? `.${decimalValue}` : ``}${
    notation ? notation : ""
  }`;
}
