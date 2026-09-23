// The visitor's fine pointer, shared by the camp's camera turn and the fire's flare. One window
// listener (the canvas sits under the hero copy, so it never receives pointer events itself).
// Touch and pens are ignored: nothing in the camp reacts to a finger.

export const pointer = {
  /** -1..1 across the window, eased by whoever reads it */
  x: 0,
  y: 0,
  clientX: -1e4,
  clientY: -1e4,
  /** false until a fine pointer has moved over the page */
  active: false,
};

let users = 0;
let stop = () => {};

export function watchPointer() {
  users += 1;
  if (users === 1) {
    const fine = matchMedia("(pointer: fine)");
    const onMove = (e: PointerEvent) => {
      if (!fine.matches || e.pointerType === "touch") return;
      pointer.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.y = (e.clientY / innerHeight) * 2 - 1;
      pointer.clientX = e.clientX;
      pointer.clientY = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.clientX = pointer.clientY = -1e4;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    stop = () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }
  return () => {
    users -= 1;
    if (users === 0) stop();
  };
}
