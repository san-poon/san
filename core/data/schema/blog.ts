import { z } from "zod";

export const SupportedLanguageSchema = z.enum(["en", "ne"]);
export type SupportedLanguage = z.infer<typeof SupportedLanguageSchema>;

export const BlogFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  cover: z.string().min(1),
  slug: z.string().min(1),
  lang: SupportedLanguageSchema,
});

export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;

export const sortByDateDesc = <T extends { date: Date }>(items: T[]) =>
  [...items].sort((a, b) => b.date.getTime() - a.date.getTime());


