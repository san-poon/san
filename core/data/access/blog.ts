import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { BlogFrontmatterSchema, type BlogFrontmatter, sortByDateDesc, type SupportedLanguage } from "@/core/data/schema/blog";

const BLOG_ROOT = path.join(process.cwd(), "core", "content", "blog");

export type BlogLanguagePair = {
  slug: string;
  en: BlogFrontmatter;
  ne: BlogFrontmatter;
};

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_ROOT)) return [];
  return fs
    .readdirSync(BLOG_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function readFrontmatter(filePath: string): BlogFrontmatter | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  const parsed = BlogFrontmatterSchema.safeParse(data);
  if (!parsed.success) return null;
  return parsed.data;
}

export function getAllPosts(): BlogLanguagePair[] {
  const slugs = getAllSlugs();
  const pairs: BlogLanguagePair[] = [];

  for (const slug of slugs) {
    const enPath = path.join(BLOG_ROOT, slug, "en.mdx");
    const nePath = path.join(BLOG_ROOT, slug, "ne.mdx");
    const en = readFrontmatter(enPath);
    const ne = readFrontmatter(nePath);
    if (en && ne) {
      pairs.push({ slug, en, ne });
    }
  }

  // Sort by EN date (assuming parity between langs)
  return [...pairs].sort(
    (a, b) => new Date(b.en.date).getTime() - new Date(a.en.date).getTime(),
  );
}

export function getPostBySlug(slug: string, lang: SupportedLanguage): {
  frontmatter: BlogFrontmatter | null;
  content: string | null;
} {
  const filePath = path.join(BLOG_ROOT, slug, `${lang}.mdx`);
  if (!fs.existsSync(filePath)) return { frontmatter: null, content: null };
  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);
  const parsed = BlogFrontmatterSchema.safeParse(data);
  if (!parsed.success) return { frontmatter: null, content: null };
  return { frontmatter: parsed.data, content };
}


