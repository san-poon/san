import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getAllSlugs } from "@/core/data/access/blog";
import { mdxComponents } from "@/components/mdx-components";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Suspense } from "react";
import { LanguageToggle } from "@/components/blog/language-toggle";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { frontmatter } = getPostBySlug(slug, "en");
  if (!frontmatter) return {};
  return {
    title: frontmatter.title,
    description: frontmatter.summary,
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { frontmatter: enFrontmatter, content: enContent } = getPostBySlug(
    slug,
    "en",
  );
  const { frontmatter: neFrontmatter, content: neContent } = getPostBySlug(
    slug,
    "ne",
  );

  if (!enFrontmatter || !neFrontmatter || !enContent || !neContent) return notFound();

  // Render both languages and hide/show on client
  const fm = enFrontmatter;

  return (
    <main className="container mx-auto max-w-3xl py-12">
      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-bold">{fm.title}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(fm.date).toLocaleDateString()}
          </p>
        </header>
        <div className="mb-6 flex justify-end">
          <LanguageToggle containerId="mdx-lang-container" />
        </div>
        <section id="mdx-lang-container" className="prose prose-neutral dark:prose-invert max-w-none">
          <div data-slot="content-en">
            <Suspense>
              <MDXRemote source={enContent} components={mdxComponents} />
            </Suspense>
          </div>
          <div data-slot="content-ne" className="hidden">
            <Suspense>
              <MDXRemote source={neContent} components={mdxComponents} />
            </Suspense>
          </div>
        </section>
      </article>
    </main>
  );
}


