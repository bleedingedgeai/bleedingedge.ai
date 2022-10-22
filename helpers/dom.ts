/**
 * Enable or disable scrolling behavior. Particularly useful for mobile interactions
 * and toggling of different drawers.
 *
 * @param {string} action enable or disable
 *
 * @example
 *    scrollable('enable') Will allow the user to scroll again
 *    scrollable('disable') Will freeze the screen
 */
export const scrollable = (enable: boolean) => {
  const posEl = document.getElementById("Canvas") as HTMLElement;
  const appEl = document.getElementById("App") as HTMLElement;
  const contentEl = document.getElementById("Content") as HTMLElement;

  const elements = [document.body, appEl, contentEl, posEl];

  elements.forEach((element) => {
    if (element) {
      if (enable) {
        element.style.cssText = "";
      } else {
        element.style.overflow = "hidden";
        element.style.height = "100%";
        element.style.position = "relative";
      }
    }
  });
};

// jQuery but not quite ;)
export const $ = (query: string): HTMLElement[] =>
  Array.from(document.querySelectorAll(query));

/**
 * Copy and keep formatting of an elements content
 *
 * @param {HTMLElement}
 * @example
 *    copyElementContentToClipboard(document.getElementById(id))
 */

export function copyElementContentToClipboard(element: HTMLElement) {
  window.getSelection().removeAllRanges();
  const range = document.createRange();
  range.selectNode(
    typeof element === "string" ? document.getElementById(element) : element
  );
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}
