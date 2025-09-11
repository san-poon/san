import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";
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
          <div className="flex flex-col min-h-screen">
          <div className="fixed right-4 top-4 z-50">
            <UserMenu />
          </div>
          {children}
          </div>
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
