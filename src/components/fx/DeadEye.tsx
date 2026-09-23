"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionLevel } from "@/hooks/useReducedMotion";
import { slowTime } from "@/lib/time";

// Dead Eye (docs/05-sections.md, Global features; step 4.2), the journal's easter egg. Press E, or
// the eye in the footer: for six seconds the page goes sepia with a red cast and dark corners,
// the journal's own motion slows to a quarter, and a small meter runs down. Links clicked (or
// entered) meanwhile are not followed but marked with a red X; when the meter runs out, or E is
// pressed again, the last one marked opens. Esc calls it off. Never under reduced motion or in
// Plain mode, and never while the reader is typing. No sound (sound is deferred, D75).

export const DEAD_EYE_EVENT = "outlaw:dead-eye";
const DURATION_MS = 6000;

type Mark = { x: number; y: number; id: number };

export function DeadEye() {
  const level = useMotionLevel();
  const [active, setActive] = useState(false);
  const [marks, setMarks] = useState<Mark[]>([]);
  const last = useRef<HTMLAnchorElement | null>(null);
  const timer = useRef(0);
  const nextId = useRef(0);
  const firing = useRef(false);

  const start = useCallback(() => {
    if (level !== "full" || document.querySelector("[data-wheel]")) return;
    last.current = null;
    firing.current = false;
    setMarks([]);
    setActive(true);
  }, [level]);

  const end = useCallback((fire: boolean) => {
    setActive(false);
    const target = fire ? last.current : null;
    last.current = null;
    // this click is the shot itself: the marking listener lets it through
    firing.current = true;
    if (target) requestAnimationFrame(() => target.click());
    window.setTimeout(() => setMarks([]), 600);
  }, []);

  // E starts it (or ends it early and fires); the footer's eye starts it too
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (
        t instanceof HTMLInputElement ||
        t instanceof HTMLTextAreaElement ||
        t instanceof HTMLSelectElement ||
        t?.isContentEditable
      )
        return;
      if (e.key === "e" || e.key === "E") {
        if (active) end(true);
        else start();
      } else if (e.key === "Escape" && active) {
        end(false);
      }
    };
    const onEvent = () => (active ? end(true) : start());
    document.addEventListener("keydown", onKey);
    window.addEventListener(DEAD_EYE_EVENT, onEvent);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener(DEAD_EYE_EVENT, onEvent);
    };
  }, [active, start, end]);

  // while active: time slows, the meter runs, and link clicks become marks
  useEffect(() => {
    if (!active) return;
    slowTime("dead-eye", 0.25);
    timer.current = window.setTimeout(() => end(true), DURATION_MS);
    const onClick = (e: MouseEvent) => {
      if (firing.current) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (
        !(link instanceof HTMLAnchorElement) ||
        link.closest("[data-realtime]")
      )
        return;
      e.preventDefault();
      e.stopPropagation();
      last.current = link;
      // a keyboard click has no position: mark the middle of the link
      const r = link.getBoundingClientRect();
      const x = e.detail === 0 ? r.left + r.width / 2 : e.clientX;
      const y = e.detail === 0 ? r.top + r.height / 2 : e.clientY;
      const id = nextId.current++;
      setMarks((m) => [...m, { x: x + scrollX, y: y + scrollY, id }]);
    };
    // before anything else sees the click (smooth scroll, Next's links)
    window.addEventListener("click", onClick, { capture: true });
    return () => {
      clearTimeout(timer.current);
      slowTime("dead-eye", null);
      window.removeEventListener("click", onClick, { capture: true });
    };
  }, [active, end]);

  return (
    <>
      <p aria-live="polite" className="sr-only">
        {active
          ? "Dead Eye. Links you choose are marked instead of followed; the last one opens when it ends. Press Escape to call it off."
          : ""}
      </p>
      {active ? (
        <div aria-hidden data-realtime className="dead-eye fixed inset-0">
          <div className="dead-eye-meter">
            <span className="font-type">Dead Eye</span>
            <div className="dead-eye-bar">
              <div style={{ animationDuration: `${DURATION_MS}ms` }} />
            </div>
          </div>
        </div>
      ) : null}
      {marks.length ? (
        <div aria-hidden data-realtime className="dead-eye-marks">
          {marks.map((m) => (
            <svg
              key={m.id}
              viewBox="0 0 40 40"
              className="dead-eye-mark"
              data-fading={!active || undefined}
              style={{ left: m.x, top: m.y }}
            >
              <path d="M8 8 L32 32 M32 8 L8 32" />
            </svg>
          ))}
        </div>
      ) : null}
    </>
  );
}
