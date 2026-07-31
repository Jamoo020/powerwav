import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AV Planning Guide & Blog | PowerWave AV",
  description: "Practical insights and guides on audio visual planning, boardroom design, security systems, and communication technology for modern businesses.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "AV Planning Guide & Blog | PowerWave AV",
    description: "Practical AV planning advice for businesses and organizations",
    url: "/blog",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PowerWave AV Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AV Planning Guide",
    description: "Practical AV planning advice for businesses",
  },
  keywords: ["AV planning", "boardroom tips", "audio visual guide", "conferencing solutions", "security systems"],
};
