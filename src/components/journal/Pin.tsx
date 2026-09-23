// A brass tack holding a poster to the board. The dome shading is the object's own light (top
// left), not decoration; its shadow falls down and right like every shadow on the page.

type PinProps = { className?: string };

export function Pin({ className = "" }: PinProps) {
  return (
    <span
      aria-hidden
      className={`block size-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--color-paper-light)_0%,var(--color-brass)_38%,var(--color-leather)_100%)] shadow-[1px_2px_2px_color-mix(in_srgb,var(--color-ink)_45%,transparent),2px_5px_6px_-2px_color-mix(in_srgb,var(--color-ink)_35%,transparent)] ${className}`}
    />
  );
}
