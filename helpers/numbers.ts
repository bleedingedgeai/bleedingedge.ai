export function isNumeric(value): boolean {
  if (value === "") {
    return false;
  }

  return !isNaN(value);
}

export const clamp = (value: number, min: number, max: number): number => {
  return value < min ? min : value > max ? max : value;
};
