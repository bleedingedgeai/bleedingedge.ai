type BP = [string, number];

export const breakpoints: BP[] = [
  ["phoneSmall", 320],
  ["phone", 376],
  ["phablet", 540],
  ["tablet", 768],
  ["desktopSmall", 960],
  ["desktop", 1024],
  ["desktopMedium", 1280],
  ["desktopLarge", 1440],
  ["desktopMax", 1680],
];

// Manually typing this
type MQ = {
  phoneSmall: `@media (max-width: 320px)`;
  phoneSmallUp: `@media (min-width: 320px)`;
  phone: `@media (max-width: 376px)`;
  phoneUp: `@media (min-width: 376px)`;
  phablet: `@media (max-width: 540px)`;
  phabletUp: `@media (min-width: 540px)`;
  tablet: `@media (max-width: 768px)`;
  tabletUp: `@media (min-width: 768px)`;
  desktopSmall: `@media (max-width: 960px)`;
  desktopSmallUp: `@media (min-width: 960px)`;
  desktop: `@media (max-width: 1024px)`;
  desktopUp: `@media (min-width: 1024px)`;
  desktopMedium: `@media (max-width: 1280px)`;
  desktopMediumUp: `@media (min-width: 1280px)`;
  desktopLarge: `@media (max-width: 1440px)`;
  desktopLargeUp: `@media (min-width: 1440px)`;
  desktopMax: `@media (max-width: 1680px)`;
  desktopMaxUp: `@media (min-width: 1680px)`;
};

export type useMQ = {
  phoneSmall: boolean;
  phone: boolean;
  phablet: boolean;
  tablet: boolean;
  desktopSmall: boolean;
  desktop: boolean;
  desktopMedium: boolean;
  desktopLarge: boolean;
  active: BP;
};

const mediaqueries: any = breakpoints.reduce(
  (acc, [label, size]: any) => ({
    ...acc,
    [label]: `@media (max-width: ${size}px)`,
    [`${label}Up`]: `@media (min-width: ${size + 1}px)`,
  }),
  {}
);

export const mq = mediaqueries as MQ;
