import type { ElementType, ReactNode } from "react";
import { seededRange } from "@/lib/seed";
import { Pin } from "./Pin";

// A printed poster tacked to a board: a fresh sheet with scorched edges, lifted at the corners,
// hung slightly off true. Rotation comes from the seed so SSR and hydration agree
// (DESIGN.md, The Tilt Rule: pinned posters up to 1.5deg).

type PosterProps = {
  as?: ElementType;
  /** Seed for the hang angle; use something stable like the bounty slug. */
  seed: string;
  pins?: 1 | 2;
  children: ReactNode;
  className?: string;
};

export function Poster({
  as: Tag = "article",
  seed,
  pins = 1,
  children,
  className = "",
}: PosterProps) {
  const rotate = seededRange(seed, 1.5);
  return (
    <Tag
      className={`paper-light burn shadow-pinned px-6 pt-11 pb-8 md:px-8 ${className}`}
      style={{ rotate: `${rotate}deg` }}
    >
      {pins === 1 ? (
        <Pin className="absolute top-3.5 left-1/2 -translate-x-1/2" />
      ) : (
        <>
          <Pin className="absolute top-3.5 left-4" />
          <Pin className="absolute top-3.5 right-4" />
        </>
      )}
      {children}
    </Tag>
  );
}
