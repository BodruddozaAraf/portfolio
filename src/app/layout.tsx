import type { Metadata } from "next";
import Script from "next/script";
import { Grain } from "@/components/fx/Grain";
import { profile } from "@/content";
import { PREFERENCES_KEY } from "@/lib/preferences-key";
import { fontVariables } from "./fonts";
import "./globals.css";

// Importing @/content here validates every fact on every build (see src/content/index.ts)
export const metadata: Metadata = {
  title: `${profile.name}, Full-Stack & AI/ML Engineer`,
  description:
    "Portfolio of Bodruddoza Araf, a full-stack developer from Dhaka working in TypeScript, Next.js, LLMs and deep learning for computer vision.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="paper flex min-h-full flex-col">
        {children}
        <Grain />
        {/* Apply the stored Plain mode choice before hydration, so effects never flash */}
        <Script id="plain-mode" strategy="beforeInteractive">
          {`try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(PREFERENCES_KEY)})||"{}");document.documentElement.dataset.plain=p.state&&p.state.plainMode?"true":"false"}catch(e){}`}
        </Script>
      </body>
    </html>
  );
}
