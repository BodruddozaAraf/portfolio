"use client";

import {
  ArrowSquareOut,
  Envelope,
  PencilSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  gmailComposeUrl,
  mailtoUrl,
  MESSAGE_MAX,
  type Telegram,
} from "@/lib/telegram";

// The telegram form (docs/05-sections.md section 9, D19). Validates in the browser, then hands
// the visitor two ways to send it from their own address. The transmit animation is step 2.6.

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Put your name on it.")
    .max(80, "Keep the name under 80 characters."),
  email: z.email("That address will not reach you back. Check it for a typo."),
  message: z
    .string()
    .trim()
    .min(10, "Say a little more: at least 10 characters.")
    .max(
      MESSAGE_MAX,
      `Keep it under ${MESSAGE_MAX} characters so every mail app can open it.`,
    ),
});

type Field = keyof Telegram;
type Errors = Partial<Record<Field, string>>;

const input =
  "mt-2 w-full border-0 border-b border-ink bg-paper/70 px-3 py-2.5 text-body text-ink placeholder:text-ink-soft/70 aria-invalid:border-blood aria-invalid:bg-blood/5";
const label = "block text-small tracking-(--tracking-caps) uppercase";

export function TelegramForm({ subjectTemplate }: { subjectTemplate: string }) {
  const id = useId();
  const [values, setValues] = useState<Telegram>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [ready, setReady] = useState<Telegram | null>(null);
  const status = useRef<HTMLDivElement>(null);
  // the form is replaced by its result: move focus there so keyboard users are not stranded
  useEffect(() => {
    if (ready) status.current?.focus();
  }, [ready]);

  const set = (field: Field) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as Field;
        next[field] ??= issue.message;
      }
      setErrors(next);
      const first = (["name", "email", "message"] as Field[]).find(
        (f) => next[f],
      );
      if (first) document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setReady(result.data);
  }

  if (ready) {
    return (
      <div
        ref={status}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="outline-none"
      >
        <p className="font-type text-h4 uppercase">
          Telegram ready to send, {ready.name}
        </p>
        <p className="mt-3 max-w-(--measure)">
          It goes from your own address, so a reply finds you. Pick how to send
          it:
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button
            href={gmailComposeUrl(ready, subjectTemplate)}
            target="_blank"
            rel="noreferrer"
            icon={<Icon icon={ArrowSquareOut} />}
          >
            Send via Gmail
            <span className="sr-only"> (opens in a new tab)</span>
          </Button>
          <Button
            href={mailtoUrl(ready, subjectTemplate)}
            variant="outline"
            icon={<Icon icon={Envelope} />}
          >
            Use my mail app
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setReady(null)}
          className="text-small decoration-ink/40 hover:text-blood hover:decoration-blood mt-6 inline-flex items-center gap-2 underline underline-offset-[0.22em]"
        >
          <Icon icon={PencilSimple} />
          Change the telegram
        </button>
      </div>
    );
  }

  const left = MESSAGE_MAX - values.message.length;
  const describe = (field: Field, extra?: string) =>
    [errors[field] ? `${id}-${field}-error` : null, extra]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-label="Telegram"
      className="grid gap-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>
            Your name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            aria-describedby={describe("name")}
            className={input}
          />
          <FieldError id={`${id}-name-error`} message={errors.name} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>
            Your email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            aria-describedby={describe("email")}
            className={input}
          />
          <FieldError id={`${id}-email-error`} message={errors.email} />
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-message`} className={label}>
          The message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={6}
          value={values.message}
          onChange={set("message")}
          aria-invalid={!!errors.message}
          aria-describedby={describe("message", `${id}-message-count`)}
          className={`${input} font-type resize-y leading-relaxed`}
        />
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <FieldError id={`${id}-message-error`} message={errors.message} />
          <p
            id={`${id}-message-count`}
            className={`text-caption ml-auto tabular-nums ${left < 0 ? "text-blood" : "text-ink-soft"}`}
          >
            {left} characters left
          </p>
        </div>
      </div>
      <div>
        <Button type="submit" icon={<Icon icon={Envelope} />}>
          Send word
        </Button>
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-small text-blood mt-2 flex items-start gap-2">
      <Icon icon={WarningCircle} className="mt-0.5 shrink-0" />
      {message}
    </p>
  );
}
