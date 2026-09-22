import { readFile } from "node:fs/promises";
import path from "node:path";

// Reads the color tokens straight from tokens.css at build time, so the styleguide can never
// drift from the real values.

export type ColorToken = { name: string; hex: string };

export async function readColorTokens(): Promise<ColorToken[]> {
  const css = await readFile(
    path.join(process.cwd(), "src/styles/tokens.css"),
    "utf8",
  );
  return [...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})/gi)].map(
    ([, name, hex]) => ({
      name,
      hex: hex.toUpperCase(),
    }),
  );
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
