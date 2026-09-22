import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bodruddoza Araf, Full-Stack & AI/ML Engineer",
  description:
    "Portfolio of Bodruddoza Araf, a full-stack developer from Dhaka working in TypeScript, Next.js, LLMs and deep learning for computer vision.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
