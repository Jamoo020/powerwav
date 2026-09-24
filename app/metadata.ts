import { Metadata } from "next";

export const metadataBase = new URL("https://powerwaveav.com");

export const siteMetadata: Metadata = {
  applicationName: "PowerWave AV",
  title: {
    default: "PowerWave AV | Premium Audio Visual Solutions in Kenya",
    template: "%s | PowerWave AV",
  },
  description: "PowerWave AV delivers premium audio visual, boardroom, conferencing, CCTV, and maintenance solutions for businesses in Kenya.",
  metadataBase,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PowerWave AV",
    description: "Premium AV systems for modern businesses in Kenya",
    url: "/",
    siteName: "PowerWave AV",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PowerWave AV",
    description: "Premium AV systems for modern businesses in Kenya",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};
