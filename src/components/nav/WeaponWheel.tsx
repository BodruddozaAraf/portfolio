"use client";

import { Crosshair, X } from "@phosphor-icons/react/ssr";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Icon } from "@/components/ui/Icon";
import type { Microcopy } from "@/content/schema";
import { useMotionLevel } from "@/hooks/useReducedMotion";
import { getLenis, glideTo } from "@/lib/lenis";
import { slowTime } from "@/lib/time";

// The weapon wheel (docs/05-sections.md, Global features; step 4.1): every chapter of the journal
// on one radial menu, an original design in the camp's materials. It opens from the button at the
// bottom right, always there, or by holding Tab for a quarter second (a quick Tab still moves
// focus as usual). While it is open the page dims and the journal's ambient motion slows to 20%.
// Point in a direction, use the arrow keys, or click a wedge; releasing a held Tab or pressing
// Enter takes the reader there. Esc, the Close button or a click outside closes it. It is a modal
// dialog: focus moves in, stays in, and goes back where it came from.

type Chapter = Microcopy["wheel"]["chapters"][number];
type Props = { label: string; chapters: Chapter[] };

const HOLD_MS = 250;
const SLICE = 360 / 8;

/** An annular wedge in a -100..100 box, clockwise from the top, with a small gap each side. */
function wedge(i: number, inner = 40, outer = 96, gap = 1.4) {
  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const a0 = rad(i * SLICE - SLICE / 2 + gap);
  const a1 = rad(i * SLICE + SLICE / 2 - gap);
  const p = (r: number, a: number) =>
    `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  return `M ${p(outer, a0)} A ${outer} ${outer} 0 0 1 ${p(outer, a1)} L ${p(inner, a1)} A ${inner} ${inner} 0 0 0 ${p(inner, a0)} Z`;
}

/** Where a wedge's label sits, as percentages of the wheel box. */
function labelAt(i: number) {
  const a = ((i * SLICE - 90) * Math.PI) / 180;
  const r = 68 / 2; // mid-ring radius, in % of the box (the ring runs from 40 to 96 of 200)
  return { left: `${50 + r * Math.cos(a)}%`, top: `${50 + r * Math.sin(a)}%` };
}

/** The chapter whose section holds the upper part of the screen right now. */
function currentChapter(chapters: Chapter[]) {
  let index = 0;
  chapters.forEach((c, i) => {
    const el = document.getElementById(c.id);
    if (el && el.getBoundingClientRect().top < innerHeight * 0.4) index = i;
  });
  return index;
}

export function WeaponWheel({ label, chapters }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const level = useMotionLevel();
  const dialogId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const byHold = useRef(false);
  const moved = useRef(false);
  const selectedRef = useRef(selected);

  const show = useCallback(
    (hold: boolean) => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      byHold.current = hold;
      moved.current = false;
      setSelected(currentChapter(chapters));
      setOpen(true);
    },
    [chapters],
  );

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus)
      (returnFocus.current ?? trigger.current)?.focus({ preventScroll: true });
  }, []);

  const go = useCallback(
    (index: number) => {
      const target = document.getElementById(chapters[index].id);
      close(false);
      if (target) requestAnimationFrame(() => glideTo(target));
    },
    [chapters, close],
  );

  const choose = useCallback((index: number) => {
    moved.current = true;
    setSelected((index + 8) % 8);
  }, []);

  // hold Tab to open: a quick press still moves focus, as it always does
  useEffect(() => {
    let timer = 0;
    const onDown = (e: KeyboardEvent) => {
      if (
        e.key !== "Tab" ||
        e.repeat ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        open
      )
        return;
      const active = document.activeElement;
      const typing =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement ||
        (active as HTMLElement | null)?.isContentEditable;
      if (typing || document.documentElement.dataset.loader === "show") return;
      if (document.querySelector(":popover-open")) return;
      clearTimeout(timer);
      timer = window.setTimeout(() => show(true), HOLD_MS);
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === "Tab") clearTimeout(timer);
    };
    document.addEventListener("keydown", onDown);
    document.addEventListener("keyup", onUp);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("keyup", onUp);
    };
  }, [open, show]);

  // while open: focus follows the selection, the page holds still and time slows
  useEffect(() => {
    if (!open) return;
    links.current[selected]?.focus({ preventScroll: true });
  }, [open, selected]);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    if (level === "full") slowTime("wheel", 0.2);
    // a released Tab that was held to open the wheel takes the reader to the chosen chapter
    const onUp = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !byHold.current) return;
      byHold.current = false;
      if (moved.current) go(selectedRef.current);
    };
    const block = (e: WheelEvent | TouchEvent) => e.preventDefault();
    document.addEventListener("keyup", onUp);
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    return () => {
      lenis?.start();
      slowTime("wheel", null);
      document.removeEventListener("keyup", onUp);
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
    };
  }, [open, level, go]);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // pointing: the direction from the wheel's middle picks a wedge
  const onPointerMove = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse" || !disc.current) return;
    const r = disc.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < r.width * 0.12) return;
    const deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    const index = Math.round((((deg % 360) + 360) % 360) / SLICE) % 8;
    if (index !== selected) choose(index);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        choose(selected + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        choose(selected - 1);
        break;
      case "Home":
        e.preventDefault();
        choose(0);
        break;
      case "End":
        e.preventDefault();
        choose(7);
        break;
      case "Tab": {
        // focus stays in the wheel: Tab walks the wedges, then the Close button
        e.preventDefault();
        if (e.repeat) break;
        const stops = [...links.current, closeButton.current].filter(
          Boolean,
        ) as HTMLElement[];
        const at = stops.indexOf(document.activeElement as HTMLElement);
        const next =
          stops[(at + (e.shiftKey ? -1 : 1) + stops.length) % stops.length];
        const linkIndex = links.current.indexOf(next as HTMLAnchorElement);
        if (linkIndex >= 0) setSelected(linkIndex);
        next.focus();
        break;
      }
    }
  };
  const active = chapters[selected];

  return (
    <>
      <div className="night wheel-trigger fixed right-4 bottom-4 z-(--z-wheel-button) md:right-6 md:bottom-6">
        <button
          ref={trigger}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? dialogId : undefined}
          onClick={() => (open ? close() : show(false))}
          className="border-paper-light/60 text-paper-light hover:border-ember hover:text-ember-glow ease-journal inline-flex size-12 items-center justify-center border transition-colors duration-(--dur-hover)"
        >
          <Icon icon={Crosshair} size={22} />
          <span className="sr-only">{label}</span>
        </button>
      </div>

      {open ? (
        <div
          id={dialogId}
          data-wheel
          data-realtime
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="wheel night fixed inset-0 z-(--z-wheel) grid place-items-center"
          // the page shows through, dimmed (inline, so it wins over the surface's own ground)
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-night) 86%, transparent)",
          }}
          onKeyDown={onKeyDown}
          onPointerMove={onPointerMove}
          onClick={(e) => {
            // a click outside the wheel closes it
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={disc}
            className="wheel-disc relative aspect-square w-[min(92vw,34rem,78vh)]"
          >
            <svg
              viewBox="-100 -100 200 200"
              aria-hidden
              className="absolute inset-0 size-full"
            >
              <circle r="99" className="wheel-rim" />
              {chapters.map((c, i) => (
                <path
                  key={c.id}
                  d={wedge(i)}
                  className="wheel-wedge"
                  data-selected={i === selected || undefined}
                  onClick={() => go(i)}
                />
              ))}
              <circle r="37" className="wheel-hub" />
            </svg>
            <nav aria-label={label}>
              <ul>
                {chapters.map((c, i) => (
                  <li key={c.id}>
                    <a
                      ref={(el) => {
                        links.current[i] = el;
                      }}
                      href={`#${c.id}`}
                      tabIndex={i === selected ? 0 : -1}
                      aria-current={i === selected ? "true" : undefined}
                      className="wheel-label font-type text-small absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 tracking-(--tracking-caps) uppercase"
                      data-selected={i === selected || undefined}
                      style={labelAt(i)}
                      onClick={(e) => {
                        e.preventDefault();
                        go(i);
                      }}
                      onFocus={() => i !== selected && setSelected(i)}
                    >
                      {c.wedge}
                      <span className="sr-only">
                        : {c.title}. {c.line}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            {/* the middle names the chapter under the pointer */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[33%] grid place-content-center text-center"
            >
              <p className="wheel-title font-display tracking-poster uppercase">
                {active.title}
              </p>
              <p className="wheel-line text-paper-light/80 mt-2 italic">
                {active.line}
              </p>
            </div>
          </div>
          <button
            ref={closeButton}
            type="button"
            onClick={() => close()}
            className="text-small text-paper-light/85 hover:text-ember-glow absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 px-4 py-2 tracking-(--tracking-caps) uppercase"
          >
            <Icon icon={X} size={16} /> Close
          </button>
        </div>
      ) : null}
    </>
  );
}
