"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getLenis } from "@/lib/lenis";

// Arriving on "/#section" (a deep link, or a link like "/#send-word" from a case study):
// 1. Keep the section in place while the page settles. Motion added after load (the Trail's
//    pinned ride adds its scroll length) would otherwise push the section down after the browser
//    jumped to it. The section is re-aligned on every size change for a moment, until the visitor
//    scrolls, presses a key or touches the page.
// 2. Then drop the hash from the address (replaceState, no new history entry), so Back to this
//    page restores where the visitor had scrolled to instead of jumping to the hash again.

const SETTLE_MS = 2500;

export function CleanHash() {
  const pathname = usePathname();

  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    let settled = false;
    let observer: ResizeObserver | undefined;
    let timer = 0;
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

    const align = () => {
      if (settled || !target) return;
      // an absolute position, and fresh page sizes: right after a route change Lenis still holds
      // the previous page's scroll and height, and would clamp to them
      const y = target.getBoundingClientRect().top + window.scrollY;
      const lenis = getLenis();
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(y, { immediate: true, force: true });
      } else window.scrollTo(0, y);
    };
    const finish = () => {
      if (settled) return;
      settled = true;
      observer?.disconnect();
      clearTimeout(timer);
      inputs.forEach((e) => window.removeEventListener(e, finish));
      if (location.hash)
        history.replaceState(
          history.state,
          "",
          location.pathname + location.search,
        );
    };
    if (target) {
      observer = new ResizeObserver(align);
      observer.observe(document.body);
      inputs.forEach((e) =>
        window.addEventListener(e, finish, { passive: true }),
      );
      timer = window.setTimeout(finish, SETTLE_MS);
    } else {
      finish();
    }

    // a same-page hash link later on (native or Next jumps, when smooth scroll is off): drop the
    // hash once the jump is done; Next's Link writes it without a hashchange event
    const onHash = () =>
      requestAnimationFrame(() => {
        if (location.hash)
          history.replaceState(
            history.state,
            "",
            location.pathname + location.search,
          );
      });
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href*='#']");
      if (
        link instanceof HTMLAnchorElement &&
        link.pathname === location.pathname
      )
        window.setTimeout(onHash, 400);
    };
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    return () => {
      settled = true;
      observer?.disconnect();
      clearTimeout(timer);
      inputs.forEach((e) => window.removeEventListener(e, finish));
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
    };
  }, [pathname]);

  return null;
}
