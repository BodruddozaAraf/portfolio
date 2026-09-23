// International Morse for the telegram's transmit animation (decoration: the real message is the
// text the visitor typed). Letters and digits only; anything else becomes a word gap.

const CODE: Record<string, string> = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
};

/**
 * Morse for the start of `text` as ".", "-", " " (between letters) and "/" (between words).
 * Draw the marks as shapes, not glyphs: a dash character would break the no-dashes copy rule.
 */
export function toMorse(text: string, maxChars = 48) {
  return text
    .toLowerCase()
    .slice(0, maxChars)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((word) => [...word].map((ch) => CODE[ch]).join(" "))
    .join("/");
}
