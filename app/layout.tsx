import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { WithRightSidebarLayout, SidebarAvatarTrigger } from "@/components/app-sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "san poon",
  description: "san poon portfolio & blogs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WithRightSidebarLayout>
            <div className="flex flex-col min-h-screen">
              <header className="sticky top-0 z-50 flex h-14 items-center justify-end px-2">
                <SidebarAvatarTrigger />
              </header>
              <main className="container mx-auto max-w-4xl px-6 py-8 sm:py-12">
                {children}
              </main>
            </div>
          </WithRightSidebarLayout>
          <footer className="container mt-24 mx-auto max-w-4xl px-6 py-10 text-center">
            <Button asChild variant="outline" className=" text-xs text-muted-foreground">
              <a href="mailto:sanjibpoon123@gmail.com">sanjibpoon123@gmail.com</a>
            </Button>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
