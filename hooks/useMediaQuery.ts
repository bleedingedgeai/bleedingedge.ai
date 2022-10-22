import React, { useEffect, useState } from "react";
import { breakpoints, mq, useMQ } from "../styles/mediaqueries";

function canUseDOM(): boolean {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}

const isBrowser = canUseDOM();

const queries = Object.keys(mq)
  .filter((mq) => !mq.includes("Up"))
  .map((key) => ({ media: mq[key].replace("@media ", ""), key }));

const initialActive = breakpoints[breakpoints.length - 1];

function useActiveMediaQuery(allMatches: useMQ) {
  const [active, setActive] = useState(initialActive);

  useEffect(() => {
    const matches = Object.keys(allMatches)
      .map((key) => ({
        name: key,
        active: allMatches[key],
      }))
      .filter((match) => match.active);

    if (matches.length > 1) {
      let active = [];

      for (let i = 0; i < matches.length - 1; i++) {
        const bp = breakpoints.find((bp) => bp[0] === matches[i].name);
        active.push(bp);
      }

      return setActive(active.sort((a, b) => a[1] - b[1])[0]);
    }

    return setActive(initialActive);
  }, [allMatches]);

  return active;
}

export function useMediaQuery(): useMQ {
  const isSupported = isBrowser && "matchMedia" in window;

  const [matches, setMatches] = React.useState<useMQ>(
    queries
      .map(({ key, media }) => ({
        media: isSupported ? !!window.matchMedia(media).matches : false,
        key,
      }))
      .reduce(
        (prev, curr) => ({ ...prev, [curr.key]: curr.media }),
        {} as useMQ
      )
  );

  const active = useActiveMediaQuery(matches);

  useEffect(() => {
    if (!isSupported) return undefined;

    const handleResize = () => {
      setMatches(
        queries.reduce((prev, query) => {
          const match = window.matchMedia(query.media);

          return {
            ...prev,
            [query.key]: match.matches,
          };
        }, {} as useMQ)
      );
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSupported]);

  return { ...matches, active };
}
