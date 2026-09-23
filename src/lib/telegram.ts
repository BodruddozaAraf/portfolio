// Telegram (contact) compose links, D19: the mail is written in the visitor's own mail, from their
// own address, so there is no server and no secret. Pure functions; tested by
// scripts/test-telegram.mjs.

export const TELEGRAM_TO = "bodruddozaaraf@gmail.com";
export const MESSAGE_MAX = 1500; // long enough for a real note, short enough for every mail client's URL limit

export type Telegram = { name: string; email: string; message: string };

export function telegramSubject(
  name: string,
  template = "Telegram from {name} via bodruddozaaraf.me",
) {
  return template.replace("{name}", name.trim());
}

export function telegramBody({ name, email, message }: Telegram) {
  return `${message.trim()}\n\n${name.trim()}\n${email.trim()}`;
}

/** Gmail's compose window in a new tab, addressed and pre-filled. */
export function gmailComposeUrl(t: Telegram, subjectTemplate?: string) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: TELEGRAM_TO,
    su: telegramSubject(t.name, subjectTemplate),
    body: telegramBody(t),
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/** The visitor's default mail app. RFC 6068: percent-encode, and line breaks are CRLF. */
export function mailtoUrl(t: Telegram, subjectTemplate?: string) {
  const enc = (s: string) => encodeURIComponent(s.replace(/\r?\n/g, "\r\n"));
  return `mailto:${TELEGRAM_TO}?subject=${enc(telegramSubject(t.name, subjectTemplate))}&body=${enc(telegramBody(t))}`;
}
