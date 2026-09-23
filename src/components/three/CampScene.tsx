"use client";

import type { Tier } from "@/lib/device-tier";
import { Sky } from "./Sky";

// The camp at night (docs/05-sections.md section 1). Built up over Phase 3: the sky and land in
// 3.2, the fire in 3.3, the props and the horse in 3.4.

export function CampScene({}: { tier: Exclude<Tier, "low"> }) {
  return <Sky />;
}
