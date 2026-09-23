// Checks the telegram compose links: every character survives the round trip, long messages fit.
//   node --experimental-strip-types --no-warnings scripts/test-telegram.mjs
import assert from "node:assert/strict";
import {
  gmailComposeUrl,
  mailtoUrl,
  MESSAGE_MAX,
  telegramBody,
  telegramSubject,
  TELEGRAM_TO,
} from "../src/lib/telegram.ts";

const tricky =
  'Hi Araf & crew,\nQ: 100% remote? #hiring ?x=1&y=2 + spaces\n\nThanks, naïve café 🤠 "quotes" <tags>';
const t = { name: "Ada Lovelace", email: "ada@example.com", message: tricky };

// Gmail: parse back with URLSearchParams
const g = new URL(gmailComposeUrl(t));
assert.equal(g.origin + g.pathname, "https://mail.google.com/mail/");
assert.equal(g.searchParams.get("view"), "cm");
assert.equal(g.searchParams.get("to"), TELEGRAM_TO);
assert.equal(
  g.searchParams.get("su"),
  "Telegram from Ada Lovelace via bodruddozaaraf.me",
);
assert.equal(g.searchParams.get("body"), telegramBody(t));

// mailto: decode by hand, CRLF line breaks, no raw reserved characters left
const m = mailtoUrl(t);
assert.ok(m.startsWith(`mailto:${TELEGRAM_TO}?subject=`));
const [, query] = m.split("?");
const params = Object.fromEntries(query.split("&").map((kv) => kv.split("=")));
assert.equal(decodeURIComponent(params.subject), telegramSubject(t.name));
assert.equal(
  decodeURIComponent(params.body),
  telegramBody(t).replace(/\n/g, "\r\n"),
);
assert.ok(!/[ \n#&"<>]/.test(params.body), "body is fully percent-encoded");

// the longest allowed message still produces a link under common client limits
const long = { ...t, message: "x".repeat(MESSAGE_MAX) };
assert.ok(
  mailtoUrl(long).length < 2048,
  `mailto length ${mailtoUrl(long).length}`,
);
assert.ok(
  gmailComposeUrl(long).length < 8000,
  `gmail length ${gmailComposeUrl(long).length}`,
);

console.log("telegram links: all checks passed");
