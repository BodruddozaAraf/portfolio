import type { LoadingTip } from "@/content/schema";

// Features that have shipped. Content that mentions a feature (loading tips) stays hidden until
// the feature is listed here: the weapon wheel lands in step 4.1, Dead Eye in step 4.2.

const shipped = new Set<NonNullable<LoadingTip["requires"]>>([]);

export function isLive(tip: LoadingTip) {
  return !tip.requires || shipped.has(tip.requires);
}
