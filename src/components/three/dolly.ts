import { Vector3 } from "three";
import { BOOK } from "./Props";
import { groundHeight } from "./land";
import { JOURNAL, JOURNAL_TURN } from "./world";

// The scroll camera (step 3.5). The hero sits sticky inside a taller track (`[data-hero-track]`,
// sized in CSS before the first paint, so nothing shifts when the camp arrives); scrolling
// through the track is the dolly's progress, 0 at the top of the page and 1 where the track ends.
// The CSS on the same scroll fades the copy out early and lays the paper over the picture at the
// end, so the camera only has to arrive on the open journal in time. Where the track is not
// extended (small screens, reduced motion, Plain mode, browsers without scroll timelines) the
// range is 0 and the camp simply stays on its establishing shot.

export const dolly = {
  /** 0..1 through the track */
  progress: 0,
  top: 0,
  range: 0,
};

/** Measures the track; call on mount and whenever it or the window resizes. */
export function measureTrack() {
  const track = document.querySelector<HTMLElement>("[data-hero-track]");
  const hero = track?.querySelector<HTMLElement>(":scope > section") ?? null;
  if (!track || !hero) {
    dolly.range = 0;
    return;
  }
  dolly.top = track.getBoundingClientRect().top + scrollY;
  dolly.range = Math.max(0, track.offsetHeight - hero.offsetHeight);
}

export function readProgress() {
  dolly.progress =
    dolly.range > 0
      ? Math.min(1, Math.max(0, (scrollY - dolly.top) / dolly.range))
      : 0;
  return dolly.progress;
}

const turn = (x: number, z: number): [number, number] => [
  x * Math.cos(JOURNAL_TURN) + z * Math.sin(JOURNAL_TURN),
  -x * Math.sin(JOURNAL_TURN) + z * Math.cos(JOURNAL_TURN),
];

/** The journal's spine on top of the closed book: the middle of the spread once it is open. */
export const spine = (() => {
  const [x, z] = turn(-BOOK.w / 2, 0);
  const y = groundHeight(JOURNAL[0], JOURNAL[2]) + BOOK.t;
  return new Vector3(JOURNAL[0] + x, y, JOURNAL[2] + z);
})();

/** Which way the head of the book points, flat on the ground. */
export const head = (() => {
  const [x, z] = turn(0, -1);
  return new Vector3(x, 0, z).normalize();
})();

/** Smoothstep. */
export const ease = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
