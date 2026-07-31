import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects & Case Studies | PowerWave AV",
  description: "Explore PowerWave AV's portfolio of successful audio visual installations across boardrooms, hospitality, security, and corporate environments in Kenya.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects & Case Studies | PowerWave AV",
    description: "Real-world AV solutions and case studies from PowerWave AV",
    url: "/projects",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PowerWave AV Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects & Case Studies",
    description: "Real-world AV solutions and case studies",
  },
  keywords: ["AV projects", "case studies", "boardroom installation", "security systems", "corporate AV", "Kenya"],
};
