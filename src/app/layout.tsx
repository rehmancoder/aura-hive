import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import { isProduction, siteUrl } from "@/lib/env";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import "./globals.css";

// Self-hosted variable fonts: no third-party request, no layout shift.
const sofia = localFont({
  src: "../fonts/sofia-sans-latin-wght-normal.woff2",
  variable: "--font-sofia",
  weight: "100 900",
  display: "swap",
});

const sofiaXC = localFont({
  src: "../fonts/sofia-sans-extra-condensed-latin-wght-normal.woff2",
  variable: "--font-sofia-xc",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.name,
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  publisher: site.name,
  category: "Marketing",
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: isProduction,
    follow: isProduction,
    googleBot: {
      index: isProduction,
      follow: isProduction,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sofia.variable} ${sofiaXC.variable} antialiased`}>
      <body className="min-h-dvh">
        {/* Shared by every page */}
        <Preloader />
        <SmoothScroll />
        <Cursor />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
