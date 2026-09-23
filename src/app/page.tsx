import { TopBar } from "@/components/nav/TopBar";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";
import { About } from "@/components/sections/About";
import { BountyBoard } from "@/components/sections/BountyBoard";
import { CampStories } from "@/components/sections/CampStories";
import { Colophon } from "@/components/sections/Colophon";
import { Hero } from "@/components/sections/Hero";
import { Research } from "@/components/sections/Research";
import { Satchel } from "@/components/sections/Satchel";
import { Telegram } from "@/components/sections/Telegram";
import { Trail } from "@/components/sections/Trail";
import { Wanted } from "@/components/sections/Wanted";

// The whole journey on one page (docs/05-sections.md). Night once, then paper (D32).
export default function Home() {
  return (
    <>
      <a
        href="#about"
        className="night text-small fixed top-3 left-3 z-50 -translate-y-24 px-4 py-2 focus:translate-y-0"
      >
        Skip to the journal
      </a>
      <PersonJsonLd />
      <TopBar />
      <main id="content" className="flex-1">
        <Hero />
        <About />
        <Wanted />
        <BountyBoard />
        <Research />
        <Trail />
        <Satchel />
        <CampStories />
        <Telegram />
      </main>
      <Colophon />
    </>
  );
}
