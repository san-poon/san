"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          className="h-10 w-10 rounded-full border bg-background p-0"
          type="button"
        >
          <Image
            src="/san-poon-global-profile.jpg"
            alt="Profile"
            width={40}
            height={40}
            className="size-10 rounded-full object-cover object-center"
            priority
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
      <DropdownMenuItem asChild>
          <Link href="/">Home</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/blog">Blogs</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex items-center justify-center gap-2"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          <span className="sr-only">Toggle theme</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


