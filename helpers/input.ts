import { $ } from "./dom";

export function inputIsFocused(): boolean {
  const activeElement = document.activeElement;
  const inputs = ["INPUT", "SELECT", "TEXTAREA"];
  const editorFocused = $(".ProseMirror-focused");
  return inputs.includes(activeElement?.tagName) || editorFocused.length > 0;
}
