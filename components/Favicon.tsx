import { useEffect, useState } from "react";
import { Environment, currentEnvironment } from "../helpers/environment";

const dev = currentEnvironment === Environment.dev ? "development-" : "";

export default function Favicon() {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    function handleIsDarkQuery(event) {
      const newColorScheme = event.matches ? "dark" : "light";
      setTheme(newColorScheme);
    }

    const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    try {
      // Chrome & Firefox
      darkMediaQuery.addEventListener("change", handleIsDarkQuery);
      const colorScheme = darkMediaQuery.matches ? "dark" : "light";
      setTheme(colorScheme);
      return () =>
        darkMediaQuery.removeEventListener("change", handleIsDarkQuery);
    } catch (error) {
      try {
        // Safari
        darkMediaQuery.addListener(handleIsDarkQuery);
        // @ts-ignore for safari
        return () => darkMediaQuery.removeEventListener(handleIsDarkQuery);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    if (theme) {
      const smallIcon: HTMLLinkElement = document.createElement("link");
      smallIcon.setAttribute(`rel`, `icon`);
      smallIcon.setAttribute(`sizes`, `16x16`);
      smallIcon.setAttribute(`href`, `/favicon/favicon-${dev}${theme}.png`);
      document.head.appendChild(smallIcon);

      const largeIcon: HTMLLinkElement = document.createElement("link");
      largeIcon.setAttribute(`rel`, `icon`);
      largeIcon.setAttribute(`sizes`, `32x32`);
      largeIcon.setAttribute(`sizes`, `/favicon/favicon-${dev}${theme}@2x.png`);
      document.head.appendChild(largeIcon);

      const vectorIcon: HTMLLinkElement = document.createElement("link");
      vectorIcon.setAttribute(`rel`, `icon`);
      vectorIcon.setAttribute(`sizes`, `any`);
      vectorIcon.setAttribute(`type`, `image/svg+xml`);
      vectorIcon.setAttribute(`sizes`, `/favicon/favicon-grey.svg`);
      document.head.appendChild(vectorIcon);
    }
  }, [theme]);

  return null;
}
