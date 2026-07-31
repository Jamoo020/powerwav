import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audio Visual Services | PowerWave AV Kenya",
  description: "Complete AV solutions including boardroom conferencing, CCTV security, sound systems, video displays, and ongoing maintenance support.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Audio Visual Services | PowerWave AV",
    description: "Boardroom, conferencing, security, and audio visual solutions for businesses in Kenya",
    url: "/services",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PowerWave AV Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Visual Services",
    description: "Complete AV solutions for businesses in Kenya",
  },
  keywords: ["audio visual services", "boardroom systems", "CCTV security", "conferencing solutions", "sound systems", "video displays", "Kenya"],
};
