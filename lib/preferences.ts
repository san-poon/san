import {
  type ColorSchemeValue,
  createColorScheme,
  createLocalStorage,
} from "@ui-sdk/core";

export const colorScheme = createColorScheme({
  global: true,
  storage: createLocalStorage("san-color-scheme"),
});

export const COLOR_SCHEME_OPTIONS: ReadonlyArray<{
  value: ColorSchemeValue;
  label: string;
}> = [
  { value: "light", label: "light" },
  { value: "system", label: "auto" },
  { value: "dark", label: "dark" },
];
