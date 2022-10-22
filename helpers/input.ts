export function inputIsFocused(): boolean {
  const activeElement = document.activeElement;
  const inputs = ["INPUT", "SELECT", "TEXTAREA"];
  return inputs.includes(activeElement?.tagName);
}
