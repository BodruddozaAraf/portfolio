"use client";

import { useRef, type ReactNode } from "react";
import { useMotionLevel } from "@/hooks/useReducedMotion";
import { useLazyGsap } from "@/hooks/useLazyGsap";

// Research's moment (DESIGN.md, The One Moment Rule; spec 05 section 5): the engraving is burnt
// through where its fire smoulders and rebuilds as the reader scrolls past it (src/lib/reconstruct.ts).
// The pipeline stage doing the work lights up beside it (`[data-stage]` in the section).
// Full motion only, and only when the plate starts below the fold: the server's image is the
// whole plate, and a canvas takes its place only where the reader has not seen it yet (The Still
// Fallback Rule). The <img> stays in the page (and in the accessibility tree) underneath.

type Props = {
  children: ReactNode;
  /** where the fire sits on the plate, as fractions from the top left */
  center: [number, number];
};

const STAGES = [0.12, 0.42, 0.7, 0.95];

export function ReconstructMoment({ children, center }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const level = useMotionLevel();
  const [cx, cy] = center;

  useLazyGsap(
    ref,
    ({ ScrollTrigger }, ctx) => {
      const root = ref.current;
      const img = root?.querySelector("img");
      if (!root || !img || level !== "full") return;
      if (root.getBoundingClientRect().top < innerHeight) return;

      const section = root.closest("section");
      const stages = Array.from(
        section?.querySelectorAll<HTMLElement>("[data-stage]") ?? [],
      );
      const mark = (p: number) => {
        const active =
          p < STAGES[0] || p >= STAGES[3]
            ? -1
            : p < STAGES[1]
              ? 0
              : p < STAGES[2]
                ? 1
                : 2;
        stages.forEach((el, i) =>
          el.toggleAttribute("data-active", i === active),
        );
      };

      let cancelled = false;
      let undo = () => {};
      img.loading = "eager";
      Promise.all([
        import("@/lib/reconstruct"),
        img.decode().catch(() => undefined),
      ]).then(([{ createReconstruction }]) => {
        // too late if the reader has already reached the plate: leave it whole
        if (cancelled || root.getBoundingClientRect().top < innerHeight) return;
        const canvas = document.createElement("canvas");
        canvas.setAttribute("aria-hidden", "true");
        canvas.className = `${img.className} reconstruct-canvas`;
        img.after(canvas);
        const place = () => {
          Object.assign(canvas.style, {
            top: `${img.offsetTop}px`,
            left: `${img.offsetLeft}px`,
            width: `${img.offsetWidth}px`,
            height: `${img.offsetHeight}px`,
          });
        };
        place();
        const r = createReconstruction(canvas, img, [cx, cy]);
        if (!r) {
          canvas.remove();
          return;
        }
        r.resize();
        r.draw(0);
        img.style.opacity = "0";
        const ro = new ResizeObserver(() => {
          place();
          r.resize();
        });
        ro.observe(img);
        ctx.add(() => {
          ScrollTrigger.create({
            trigger: canvas,
            start: "top 80%",
            end: "center 30%",
            scrub: true,
            onUpdate: (self) => {
              r.draw(self.progress);
              mark(self.progress);
            },
          });
        });
        undo = () => {
          ro.disconnect();
          r.dispose();
          canvas.remove();
          img.style.opacity = "";
          stages.forEach((el) => el.removeAttribute("data-active"));
        };
      });
      return () => {
        cancelled = true;
        undo();
      };
    },
    [level, cx, cy],
  );

  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
}
