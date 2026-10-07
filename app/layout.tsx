import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { siteMetadata } from "./metadata";
import "./globals.css";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-text)]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
