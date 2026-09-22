import { profile } from "@/content";

// Placeholder until step 1.5 builds the real sections (see docs/06-roadmap.md).
export default function Home() {
  return (
    <main
      id="content"
      className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <h1 className="font-display text-h1 tracking-poster uppercase">
        {profile.name}
      </h1>
      <p className="text-lead">{profile.roleLine}</p>
      <p className="text-lead italic">
        The Outlaw&apos;s Journal is being written.
      </p>
    </main>
  );
}
