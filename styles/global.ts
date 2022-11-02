import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: dark;
  }

  *,
  *:before,
  *:after {
    outline: none;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
    margin: 0px;
    padding: 0px;
    font-size: inherit;
  }

  /**
  * Firefox specific rule
  */
  @-moz-document url-prefix() {
    body {
      font-weight: lighter !important;
    }

    *,
    *:before,
    *:after {
      font-weight: 400;
    }
  }

  body,
  html {
    font-family: ${theme.fontFamily.space};
    font-weight: 400;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizelegibility;
    -webkit-text-size-adjust: none;
    text-size-adjust: none;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    color: #fff;
    height: 100%;
    width: 100%;
    cursor: default;
    background: ${theme.colors.black};
    font-size: 12px;
  }


  ::selection,
  ::-moz-selection  {
    background: rgba(72, 158, 250, 0.2);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${theme.fontFamily.space};
  }


  button,
  a {
    text-decoration: none;
    cursor: pointer;
  }

  a {
    color: ${theme.colors.white};
  }

  [hidden] {
    display: none;
  }

  [unselectable] {
    user-select: none;
  }

  [role="button"] {
    cursor: pointer;
  }

  audio,
  canvas,
  iframe,
  img,
  svg,
  video {
    vertical-align: middle;
  }

  select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: none;
    background-color: transparent;
    width: 100%;

    &::-ms-expand {
      display: none;
    }

    option {
      color: #262626;
    }
  }

  input,
  textarea,
  select,
  button {
    font-family: ${theme.fontFamily.space};
    color: #fff;

    &:-webkit-autofill {
      box-shadow: 0 0 0 1000px transparent inset !important;
    }
  }

  button,
  input,
  select,
  textarea {
    color: inherit;
    font-family: inherit;
    font-style: inherit;
    font-weight: inherit;
    text-align: left;
  }

  code,
  kbd,
  pre,
  samp {
    font-family: monospace;
  }

  fieldset,
  button {
    appearance: none;
    border: none;
    outline: none;
    background: transparent;
  }

  table {
    border-collapse: separate;
    border-spacing: 0;
  }

  audio:not([controls]) {
    display: none;
  }

  details {
    display: block;
  }

  input,
  textarea {
    &:focus,
    &:active {
      outline: none;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type="number"] {
      -moz-appearance: textfield;
    }

    &[type="search"] {
      -webkit-appearance: textfield;

      &::-webkit-search-cancel-button,
      &::-webkit-search-decoration {
        -webkit-appearance: none;
      }
    }
  }

  input {
    border: none;
    background: transparent;
    color: ${theme.colors.white};
    max-width: 100%;

    &::-webkit-input-placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }

`;
