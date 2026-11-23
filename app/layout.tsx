import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/app/fonts/text-face";
import { SiteProviders } from "@/components/site-providers";
import { SITE_META } from "@/lib/site-content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_META.url),
  title: SITE_META.title,
  description: SITE_META.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_META.title,
    description: SITE_META.description,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: SITE_META.title,
    description: SITE_META.description,
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f8f9" },
    { media: "(prefers-color-scheme: dark)", color: "#1b2126" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={fontVariables} lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}
