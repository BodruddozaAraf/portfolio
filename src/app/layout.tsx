import type { Metadata } from "next";
import { Grain } from "@/components/fx/Grain";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bodruddoza Araf, Full-Stack & AI/ML Engineer",
  description:
    "Portfolio of Bodruddoza Araf, a full-stack developer from Dhaka working in TypeScript, Next.js, LLMs and deep learning for computer vision.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="paper flex min-h-full flex-col">
        {children}
        <Grain />
      </body>
    </html>
  );
}
