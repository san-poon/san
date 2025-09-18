import Link from "next/link";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const isExternalLink = (href: string): boolean => {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:");
};

export const LinkComponent = ({ href, children, className, ...props }: LinkProps) => {
  const isExternal = isExternalLink(href);
  
  const linkClasses = cn(
    "underline-offset-4 underline decoration-blue-500/80 decoration-1 focus:underline focus:outline-none",
    className
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClasses} {...props}>
      {children}
    </Link>
  );
};
