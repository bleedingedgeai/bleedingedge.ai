import React from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";

type KeysTheme = "dark" | "light";
type Gap = "none" | "narrow" | "regular";

interface KeysProps {
  keys: KeyType[];
  gap?: Gap;
  margin?: boolean;
  theme?: KeysTheme;
}

const themes = {
  dark: {
    color: theme.colors.black,
    text: theme.colors.white,
  },
  light: {
    color: theme.colors.white,
    text: theme.colors.black,
  },
};

export default function Keys({
  keys,
  gap,
  margin,
  theme: themeProp = "dark",
}: KeysProps) {
  if (!keys) {
    return null;
  }

  const { color, text } = themes[themeProp];

  if (keys[1] === KeyType.THEN || keys[1] === KeyType.OR) {
    return (
      <Container
        margin={margin}
        style={{
          gridGap: gap === "none" ? 0 : gap === "narrow" ? 5 : 10,
          color,
        }}
      >
        <Key keyType={keys[0]} theme={themeProp} />
        <span style={{ color: text }}>{keys[1].toLowerCase()}</span>
        <Key keyType={keys[2]} theme={themeProp} />
      </Container>
    );
  }

  return (
    <Container
      margin={margin}
      style={{ gridGap: gap === "none" ? 0 : gap === "narrow" ? 4 : 8, color }}
    >
      {keys.map((key) => (
        <Key key={key} keyType={key} theme={themeProp} />
      ))}
    </Container>
  );
}

function Key({ keyType, theme }: { keyType: KeyType; theme: KeysTheme }) {
  if (!keyType || keyType === KeyType.THEN || keyType === KeyType.OR) {
    return null;
  }
  const { text } = themes[theme];
  const width = keyType.includes("W-") ? 40 : 16;
  const height = 16;

  return (
    <svg width={width} height={height}>
      {theme === "dark" && (
        <rect x={2} y={2} width={width - 4} height={height - 4} fill={text} />
      )}
      <use
        xlinkHref={`/keys/key-${keyType.toLowerCase()}.svg#KEY-${keyType}`}
      />
    </svg>
  );
}

const Container = styled.span<{ margin?: boolean }>`
  display: inline-grid;
  align-items: center;
  justify-content: center;
  grid-auto-flow: column;
  grid-gap: 4px;
  margin: ${(p) => (p.margin ? "0 6px" : "0")};
  color: ${(p) => p.theme.colors.black};
`;

export enum KeyType {
  "THEN" = "THEN",
  "OR" = "OR",
  "A" = "A",
  "B" = "B",
  "C" = "C",
  "D" = "D",
  "E" = "E",
  "F" = "F",
  "G" = "G",
  "H" = "H",
  "I" = "I",
  "J" = "J",
  "K" = "K",
  "L" = "L",
  "M" = "M",
  "N" = "N",
  "O" = "O",
  "P" = "P",
  "Q" = "Q",
  "R" = "R",
  "S" = "S",
  "T" = "T",
  "U" = "U",
  "V" = "V",
  "W" = "W",
  "X" = "X",
  "Y" = "Y",
  "Z" = "Z",
  "ZERO" = "0",
  "ONE" = "1",
  "TWO" = "2",
  "THREE" = "3",
  "FOUR" = "4",
  "FIVE" = "5",
  "SIX" = "6",
  "SEVEN" = "7",
  "EIGHT" = "8",
  "NINE" = "9",
  "AMPERSAND" = "AMPERSAND",
  "ASTERISK" = "ASTERISK",
  "AT-SIGN" = "AT-SIGN",
  "BACKSLASH" = "BACKSLASH",
  "BACKTICK" = "BACKTICK",
  "CARET" = "CARET",
  "COLON" = "COLON",
  "COMMA" = "COMMA",
  "CMD" = "CMD",
  "DIVISION-SIGN" = "DIVISION-SIGN",
  "DOLLAR-SIGN" = "DOLLAR-SIGN",
  "DOWN" = "DOWN",
  "EQUALS-SIGN" = "EQUALS-SIGN",
  "EXCLAMATION-POINT" = "EXCLAMATION-POINT",
  "HYPHEN" = "HYPHEN",
  "LEFT-APOSTROPHE" = "LEFT-APOSTROPHE",
  "LEFT-BRACE" = "LEFT-BRACE",
  "LEFT-BRACKET" = "LEFT-BRACKET",
  "LEFT-CHEVRON" = "LEFT-CHEVRON",
  "LEFT-PARENTHESES" = "LEFT-PARENTHESES",
  "LEFT-QUOTATION-MARKS" = "LEFT-QUOTATION-MARKS",
  "LEFT" = "LEFT",
  "NUMBER-SIGN" = "NUMBER-SIGN",
  "OPTION" = "OPTION",
  "PERCENT-SIGN" = "PERCENT-SIGN",
  "PERIOD" = "PERIOD",
  "PLUS-SIGN" = "PLUS-SIGN",
  "QUESTION-MARK" = "QUESTION-MARK",
  "RIGHT-APOSTROPHE" = "RIGHT-APOSTROPHE",
  "RIGHT-BRACE" = "RIGHT-BRACE",
  "RIGHT-BRACKET" = "RIGHT-BRACKET",
  "RIGHT-CHEVRON" = "RIGHT-CHEVRON",
  "RIGHT-PARENTHESES" = "RIGHT-PARENTHESES",
  "RIGHT-QUOTATION-MARKS" = "RIGHT-QUOTATION-MARKS",
  "RIGHT" = "RIGHT",
  "SEMICOLON" = "SEMICOLON",
  "SHIFT" = "SHIFT",
  "SLASH" = "SLASH",
  "TILDE" = "TILDE",
  "UNDERSCORE" = "UNDERSCORE",
  "UP" = "UP",
  "W-ALT" = "W-ALT",
  "W-BKSP" = "W-BKSP",
  "W-CONTROL" = "W-CONTROL",
  "W-DELETE" = "W-DELETE",
  "W-ENTER" = "W-ENTER",
  "W-ESC" = "W-ESC",
  "W-OPTION" = "W-OPTION",
  "W-RETURN" = "W-RETURN",
  "W-SHIFT" = "W-SHIFT",
  "W-SPACE" = "W-SPACE",
  "W-TAB" = "W-TAB",
}
