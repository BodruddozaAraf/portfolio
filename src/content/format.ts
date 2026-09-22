// Display formatting for content values. Date ranges use a spaced hyphen, never a dash (D31).

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "2026-06" to "June 2026". */
export function formatMonth(month: string) {
  const [year, m] = month.split("-");
  return `${months[Number(m) - 1]} ${year}`;
}

/** "June 2026 - August 2026", or "June 2026 - present" for an open range. */
export function formatRange(start: string, end: string | null) {
  return `${formatMonth(start)} - ${end ? formatMonth(end) : "present"}`;
}

/** Splits text marked with **key terms** into plain and key segments for rendering. */
export function keyTerms(text: string) {
  return text.split("**").map((value, i) => ({ value, key: i % 2 === 1 }));
}

/** The text without key-term markers (for metadata, alt text, plain contexts). */
export function plain(text: string) {
  return text.replaceAll("**", "");
}
