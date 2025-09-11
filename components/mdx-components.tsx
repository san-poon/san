import type { ComponentProps, HTMLAttributes } from "react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";

type ComponentMap = Record<string, React.ComponentType<any>>;

const H1 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <h1 {...props} className={cn("scroll-m-20 text-4xl font-bold tracking-tight", props.className)} />
);

const H2 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    {...props}
    className={cn("scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0", props.className)}
  />
);

const H3 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 {...props} className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", props.className)} />
);

const P = (props: HTMLAttributes<HTMLParagraphElement>) => (
  <p {...props} className={cn("leading-7 [&:not(:first-child)]:mt-6", props.className)} />
);

const UL = (props: HTMLAttributes<HTMLUListElement>) => (
  <ul {...props} className={cn("my-6 ml-6 list-disc", props.className)} />
);

const OL = (props: HTMLAttributes<HTMLOListElement>) => (
  <ol {...props} className={cn("my-6 ml-6 list-decimal", props.className)} />
);

const Blockquote = (props: HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote {...props} className={cn("mt-6 border-l-2 pl-6 italic text-muted-foreground", props.className)} />
);

const InlineCode = (props: HTMLAttributes<HTMLElement>) => (
  <code {...props} className={cn("relative rounded bg-muted px-1.5 py-0.5 font-mono text-sm", props.className)} />
);

const Pre = (props: HTMLAttributes<HTMLPreElement>) => (
  <pre
    {...props}
    className={cn("my-6 overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm", props.className)}
  />
);

const Img = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img {...props} alt={props.alt ?? ""} className={cn("rounded-md border", props.className)} />
);

const ImageComp = (props: ComponentProps<typeof NextImage>) => (
  <NextImage {...props} className={cn("rounded-md border", props.className)} />
);

export const mdxComponents: ComponentMap = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  ul: UL,
  ol: OL,
  blockquote: Blockquote,
  code: InlineCode,
  pre: Pre,
  img: Img,
  Image: ImageComp,
};

