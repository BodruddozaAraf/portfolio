"use client";

import { useRef } from "react";
import { useLazyGsap } from "@/hooks/useLazyGsap";
import { toMorse } from "@/lib/morse";

// The telegram going out (docs/05-sections.md section 9): the opening words of the message are
// taken off the page as their Morse runs out along the wire. About 1.4s, then `onDone`. Shown only
// at motion level "full"; the caller skips it otherwise. The marks are drawn as shapes.

const RUN_S = 1.2;

export function Transmission({
  message,
  onDone,
}: {
  message: string;
  onDone: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const excerpt = message.slice(0, 48);
  const marks = [...toMorse(message)];

  useLazyGsap(
    ref,
    ({ gsap }) => {
      gsap
        .timeline({ onComplete: onDone })
        .fromTo(
          ".tx-words",
          { clipPath: "inset(0 0% 0 0)" },
          { clipPath: "inset(0 100% 0 0)", duration: RUN_S, ease: "none" },
        )
        .fromTo(
          ".tx-code",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: RUN_S, ease: "none" },
          0,
        )
        .to({}, { duration: 0.2 });
    },
    [],
  );

  return (
    <div ref={ref} role="status" aria-live="polite">
      <p className="font-type text-h4 uppercase">Transmitting</p>
      <div aria-hidden className="mt-6">
        <p className="tx-words font-type text-lead truncate">{excerpt}</p>
        <div className="border-ink/60 relative mt-3 overflow-hidden border-b pb-2">
          <p className="tx-code flex h-3 items-center gap-1 whitespace-nowrap">
            {marks.map((m, i) =>
              m === "." ? (
                <span
                  key={i}
                  className="bg-ink size-1.5 shrink-0 rounded-full"
                />
              ) : m === "-" ? (
                <span key={i} className="bg-ink h-1.5 w-4 shrink-0" />
              ) : (
                <span
                  key={i}
                  className={m === "/" ? "w-4 shrink-0" : "w-1.5 shrink-0"}
                />
              ),
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
