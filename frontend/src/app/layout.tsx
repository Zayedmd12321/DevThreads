// layout.tsx
import type { Metadata } from "next";
import ThemeScript from "@/components/ThemeScript";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevThreads",
  description: "Clean techy discussions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
        {children}
      </body>
    </html>
  );
}