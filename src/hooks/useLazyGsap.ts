"use client";

import { useEffect, type DependencyList, type RefObject } from "react";

// GSAP without the weight on the first load: the library (src/lib/gsap.ts) is imported on demand
// after hydration, so it never sits in the initial JavaScript. `setup` runs inside a gsap.context
// scoped to `scope`; everything it creates (tweens, timelines, ScrollTriggers, SplitTexts) is
// reverted when the deps change or the component unmounts. Work created later, in a callback,
// goes through `ctx.add(() => ...)` so it is reverted too.

export type Gsap = typeof import("@/lib/gsap");
type Context = ReturnType<Gsap["gsap"]["context"]>;

export function useLazyGsap(
  scope: RefObject<Element | null>,
  setup: (m: Gsap, ctx: Context) => void | (() => void),
  deps: DependencyList,
) {
  useEffect(() => {
    let cancelled = false;
    let ctx: Context | undefined;
    let cleanup: void | (() => void);
    import("@/lib/gsap").then((m) => {
      if (cancelled || !scope.current) return;
      ctx = m.gsap.context((self) => {
        cleanup = setup(m, self);
      }, scope.current);
    });
    return () => {
      cancelled = true;
      cleanup?.();
      ctx?.revert();
    };
    // the caller's deps decide when to rebuild, like useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
