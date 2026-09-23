import { existsSync } from "node:fs";
import path from "node:path";

// Server-only: whether an optional file exists in public/ at build time, so links to assets that
// have not been supplied yet (the resume PDF, A15) are simply not rendered instead of 404ing.
export function hasPublicFile(file: string) {
  return existsSync(path.join(process.cwd(), "public", file));
}

export const resumeAvailable = hasPublicFile("resume.pdf");
