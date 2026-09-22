// Fixed film-grain layer over everything. Static for now; step 2.8 animates it.
// Plain opacity, no blend mode, so it stays a cheap composited layer while scrolling.
export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-(--z-grain) bg-[url('/textures/grain.webp')] bg-size-[160px_160px] opacity-20"
    />
  );
}
