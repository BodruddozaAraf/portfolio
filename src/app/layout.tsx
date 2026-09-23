import type { Metadata } from "next";
import Script from "next/script";
import { Grain } from "@/components/fx/Grain";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { profile } from "@/content";
import { PREFERENCES_KEY } from "@/lib/preferences-key";
import { SITE_URL } from "@/lib/site";
import { fontVariables } from "./fonts";
import "./globals.css";

// Importing @/content here validates every fact on every build (see src/content/index.ts)
const title = `${profile.name}, Full-Stack & AI/ML Engineer`;
const description =
  "Portfolio of Bodruddoza Araf, a full-stack developer from Dhaka working in TypeScript, Next.js, LLMs and deep learning for computer vision.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${profile.name}` },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  formatDetection: { telephone: false },
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
        <SmoothScroll />
        {/* Apply the stored Plain mode choice before hydration, so effects never flash */}
        <Script id="plain-mode" strategy="beforeInteractive">
          {`try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(PREFERENCES_KEY)})||"{}");document.documentElement.dataset.plain=p.state&&p.state.plainMode?"true":"false"}catch(e){}`}
        </Script>
      </body>
    </html>
  );
}
