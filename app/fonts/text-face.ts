import { Google_Sans_Code } from "next/font/google";
import localFont from "next/font/local";

// Every face declares the same weight range (400-700) so the browser groups
// them by weight descriptors before consulting unicode-range.
const latin = localFont({
  src: "./google-sans-flex-latin.woff2",
  style: "normal",
  weight: "400 700",
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-text-latin",
  declarations: [
    { prop: "font-family", value: "San Text" },
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
    { prop: "size-adjust", value: "100%" },
    { prop: "ascent-override", value: "96.6%" },
    { prop: "descent-override", value: "28.6%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});

const latinItalic = localFont({
  src: "./google-sans-flex-latin-italic.woff2",
  style: "italic",
  weight: "400 700",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-text-latin-italic",
  declarations: [
    { prop: "font-family", value: "San Text" },
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
    { prop: "size-adjust", value: "100%" },
    { prop: "ascent-override", value: "96.6%" },
    { prop: "descent-override", value: "28.6%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});

const latinExt = localFont({
  src: [
    {
      path: "./google-sans-flex-latin-ext.woff2",
      style: "normal",
      weight: "400 700",
    },
    {
      path: "./google-sans-flex-latin-ext-italic.woff2",
      style: "italic",
      weight: "400 700",
    },
  ],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-text-latin-ext",
  declarations: [
    { prop: "font-family", value: "San Text" },
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
    },
    { prop: "size-adjust", value: "100%" },
    { prop: "ascent-override", value: "96.6%" },
    { prop: "descent-override", value: "28.6%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});

const devanagari = localFont({
  src: [
    {
      path: "./noto-sans-devanagari.woff2",
      style: "normal",
      weight: "400 700",
    },
    {
      path: "./noto-sans-devanagari.woff2",
      style: "italic",
      weight: "400 700",
    },
  ],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-text-devanagari",
  declarations: [
    { prop: "font-family", value: "San Text" },
    {
      prop: "unicode-range",
      value:
        "U+0900-097F, U+1CD0-1CF9, U+200C-200D, U+20F0, U+25CC, U+A830-A839, U+A8E0-A8FF, U+11B00-11B09",
    },
    { prop: "size-adjust", value: "100%" },
    { prop: "ascent-override", value: "96.6%" },
    { prop: "descent-override", value: "28.6%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});

const mono = Google_Sans_Code({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Consolas",
    "Liberation Mono",
    "monospace",
  ],
  variable: "--font-code",
});

export const fontVariables = [latin, latinItalic, latinExt, devanagari, mono]
  .map((face) => face.variable)
  .join(" ");
