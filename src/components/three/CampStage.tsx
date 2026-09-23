"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { useMotionLevel } from "@/hooks/useReducedMotion";
import { getCamp, setCamp, useCamp } from "@/lib/camp";
import { detectTier, tierOverride, type Tier } from "@/lib/device-tier";
import { campLive } from "@/lib/features";
import type { CampCanvasProps } from "./CampCanvas";

// Where the 3D camp lives in the hero. This file is in the page's first JavaScript, so it stays
// tiny: three.js and the scene arrive in their own chunk (CampCanvas), imported only when this
// visitor gets WebGL (full motion, a mid or high tier device). Everyone else keeps the
// server-rendered hero, which is the finished picture (The Still Fallback Rule). The canvas sits
// between the hero's art and its copy and fades in once its first frames are drawn.

type Canvas = ComponentType<CampCanvasProps>;

export function CampStage() {
  const level = useMotionLevel();
  const { status, tier } = useCamp();
  const [Canvas, setCanvas] = useState<Canvas | null>(null);
  const [inView, setInView] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const wanted = level === "full";

  // decide once motion is known; load the chunk only for WebGL tiers
  useEffect(() => {
    if (!wanted) {
      setCamp({ status: "off", progress: 0 });
      return;
    }
    const first: Tier = campLive || tierOverride() ? detectTier() : "low";
    if (first === "low") {
      setCamp({ status: "off", tier: "low", progress: 0 });
      return;
    }
    let cancelled = false;
    setCamp({ status: "loading", tier: first, progress: 0.1 });
    import("./CampCanvas")
      .then((m) => {
        if (cancelled) return;
        setCamp({ progress: 0.6 });
        setCanvas(() => m.CampCanvas);
      })
      .catch(() => setCamp({ status: "off", tier: "low" }));
    return () => {
      cancelled = true;
    };
  }, [wanted]);

  // leaving 3D (Plain mode switched on, reduced motion, or the monitor fell back to low) unmounts
  // the canvas, which frees the GPU
  const running = wanted && tier !== "low" && Canvas !== null;

  // render only while the hero is on screen
  useEffect(() => {
    const el = ref.current;
    if (!el || !running) return;
    const io = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    io.observe(el);
    return () => io.disconnect();
  }, [running]);

  useEffect(() => {
    if (!running && getCamp().status !== "off") setCamp({ status: "off" });
  }, [running]);

  return (
    <div
      ref={ref}
      aria-hidden
      data-camp-stage
      className={`camp-stage absolute inset-0 -z-10 ${status === "ready" && running ? "opacity-100" : "opacity-0"}`}
    >
      {running ? (
        <Canvas tier={tier === "high" ? "high" : "mid"} active={inView} />
      ) : null}
    </div>
  );
}
