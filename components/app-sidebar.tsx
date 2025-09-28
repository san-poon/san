"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, BookOpenText, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Right-anchored app sidebar with Home, Blogs, Theme toggle
export function AppSidebarRight() {
  return (
    <Sidebar side="right">
      <SidebarHeader className="p-2" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/blog">
                    <BookOpenText />
                    <span>Blogs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <ThemeMenuItem />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// Floating avatar trigger to open the right sidebar
export function SidebarAvatarTrigger({ className }: { className?: string }) {
  return <TopbarTrigger className={className} />;
}

// Layout helper to wrap pages easily
export function WithRightSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarInset>
        {children}
      </SidebarInset>
      <AppSidebarRight />
    </SidebarProvider>
  );
}

function TopbarTrigger({ className }: { className?: string }) {
  const base = "size-10 p-0 rounded-full border bg-background";
  const merged = className ? `${base} ${className}` : base;
  return (
    <SidebarTrigger className={merged} aria-label="Toggle Sidebar">
      <Image
        src="/san-poon-global-profile.jpg"
        alt="Profile"
        width={40}
        height={40}
        className="size-10 rounded-full object-cover object-center"
        priority
      />
    </SidebarTrigger>
  );
}

function ThemeMenuItem() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = theme === "dark";
  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={() => setTheme(isDark ? "light" : "dark")}>        
        {mounted ? (isDark ? <Sun /> : <Moon />) : <Sun className="opacity-0" />}
        <span>Toggle theme</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}


