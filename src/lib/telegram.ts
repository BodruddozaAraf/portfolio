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

// Zod's default email pattern (zod/v4/core/regexes), inlined so the form ships no validation
// library (step 5.1)
const EMAIL =
  /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

export type TelegramErrors = Partial<Record<keyof Telegram, string>>;

/** Trims each field and checks it; the first problem per field, in the form's words. */
export function validateTelegram(
  values: Telegram,
): { ok: true; data: Telegram } | { ok: false; errors: TelegramErrors } {
  const data = {
    name: values.name.trim(),
    email: values.email.trim(),
    message: values.message.trim(),
  };
  const errors: TelegramErrors = {};
  if (!data.name) errors.name = "Put your name on it.";
  else if (data.name.length > 80)
    errors.name = "Keep the name under 80 characters.";
  if (!EMAIL.test(data.email))
    errors.email = "That address will not reach you back. Check it for a typo.";
  if (data.message.length < 10)
    errors.message = "Say a little more: at least 10 characters.";
  else if (data.message.length > MESSAGE_MAX)
    errors.message = `Keep it under ${MESSAGE_MAX} characters so every mail app can open it.`;
  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, data };
}
