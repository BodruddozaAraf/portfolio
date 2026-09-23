"use client";

import {
  ArrowSquareOut,
  Envelope,
  PencilSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Stamp } from "@/components/journal/Stamp";
import { SlamIn } from "@/components/motion/SlamIn";
import { Transmission } from "@/components/motion/Transmission";
import { Button } from "@/components/ui/Button";
import { useMotionLevel } from "@/hooks/useReducedMotion";
import { Icon } from "@/components/ui/Icon";
import {
  gmailComposeUrl,
  mailtoUrl,
  MESSAGE_MAX,
  type Telegram,
  type TelegramErrors,
  validateTelegram,
} from "@/lib/telegram";

// The telegram form (docs/05-sections.md section 9, D19). Validates in the browser, then hands
// the visitor two ways to send it from their own address. With full motion the message is first
// transmitted (Morse along a wire), then stamped "Composed": not "Delivered", because nothing
// is sent until the visitor sends it from their own mail (D19, D63).

type Field = keyof Telegram;
type Errors = TelegramErrors;

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
  const [sending, setSending] = useState<Telegram | null>(null);
  const level = useMotionLevel();
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
    const result = validateTelegram(values);
    if (!result.ok) {
      const next = result.errors;
      setErrors(next);
      const first = (["name", "email", "message"] as Field[]).find(
        (f) => next[f],
      );
      if (first) document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    if (level === "full") setSending(result.data);
    else setReady(result.data);
  }

  if (sending) {
    return (
      <Transmission
        message={sending.message}
        onDone={() => {
          setReady(sending);
          setSending(null);
        }}
      />
    );
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-type text-h4 uppercase">
            Telegram ready to send, {ready.name}
          </p>
          <SlamIn>
            <Stamp seed="telegram-ready" size="sm">
              Composed
            </Stamp>
          </SlamIn>
        </div>
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
