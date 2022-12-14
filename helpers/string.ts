export function slugify(string) {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

// Tiny util that's not perfect but okay for now.
// We check if the word 'day' will become pluarl and then apply the same rule to the passed in word.
export function pluralize(word: string, number) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "unit",
    // @ts-ignore
    unit: "day",
    unitDisplay: "long",
  }).format(number);

  if (formatted.substr(-1) === "s") {
    return word + "s";
  } else {
    return word;
  }
}

export function copyToClipboard(textToCopy: string) {
  const el = document.createElement(`textarea`);
  el.value = textToCopy;
  el.setAttribute(`readonly`, ``);
  el.style.position = `absolute`;
  el.style.left = `-9999px`;
  document.body.appendChild(el);
  el.select();
  document.execCommand(`copy`);
  document.body.removeChild(el);
}
