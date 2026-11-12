import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AssistantWidget } from "@/components/assistant/assistant-widget";
import { getPortfolioSnapshot } from "@/features/portfolio/application/queries";
import { getAppConfig } from "@/lib/config/env";

const geistSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const config = getAppConfig();

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: "Logesh T | Software Engineer L2 & Full Stack Developer",
    template: "%s | Logesh T",
  },
  description:
    "Portfolio of Logesh T — Software Engineer L2 at Techcedence Infosystems Pvt. Ltd. Building scalable web, mobile, healthcare, IoT, and enterprise applications with React, Next.js, Angular, Node.js, TypeScript, PostgreSQL, and React Native.",
  keywords: [
    "Logesh T",
    "Software Engineer",
    "Software Engineer L2",
    "Full Stack Developer",
    "React",
    "Next.js",
    "Angular",
    "Node.js",
    "TypeScript",
    "React Native",
    "PostgreSQL",
    "MERN",
    "MEAN",
  ],
  authors: [{ name: "Logesh T", url: "https://github.com/Logesh18" }],
  openGraph: {
    title: "Logesh T | Software Engineer L2 & Full Stack Developer",
    description:
      "Building scalable web, mobile, and enterprise applications across asset management, healthcare, warehouse IoT, and EdTech.",
    url: config.siteUrl,
    siteName: "Logesh T Portfolio",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, faqs } = getPortfolioSnapshot();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    worksFor: {
      "@type": "Organization",
      name: profile.currentEmployer,
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    sameAs: profile.socialLinks.map((s) => s.url),
    knowsAbout: [
      "React.js",
      "Next.js",
      "Angular",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "React Native",
      "Prisma ORM",
      "MQTT",
      "BLE",
      "RFID",
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <AssistantWidget faqs={faqs} />
        </ThemeProvider>
      </body>
    </html>
  );
}
