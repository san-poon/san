## Blog MVP To-Dos (Bilingual MDX)

1. [ ] **Initialize UI/MDX**: Install MDX support and shadcn/ui; enable dark/light via ThemeProvider.
2. [ ] **Content structure**: Use `core/content/blog/<slug>/{en,ne}.mdx` for each post; both files required.
3. [ ] **Frontmatter**: Require `title`, `date`, `summary`, `tags`, `cover`, `slug`, `lang`.
4. [ ] **MDX components**: Map MDX elements to styled components (typography, code, image).
5. [ ] **Content utilities**: Pair `en/ne` by `slug`; expose `getAllPosts()` and `getPostBySlug(slug, lang)`.
6. [ ] **Index page**: Create `/blog` listing posts (latest first) with title, date, summary.
7. [ ] **Post page**: Create `/blog/[slug]` (single URL); language toggle swaps content in place.
8. [ ] **Language toggle**: shadcn button; in-place EN/NE switch; persist preference (no routing change).
9. [ ] **Theme toggle**: Add dark/light toggle using shadcn + next-themes.
10. [ ] **Seed content**: Add one sample post in both languages to validate pipeline.
11. [ ] **SEO basics**: Use default language for metadata; keep a single canonical URL.
12. [ ] **Ship**: Smoke test locally, deploy to production, verify index and post pages in both languages. (if you're an AI, you don't need to worry about this)

---

## Later (Do Not Implement Now)

1. [ ] **Reactions**: Love/Dislike; Dislike requires a comment explaining why.
2. [ ] **Comments**: Threaded comments with replies; moderation/admin tools.
3. [ ] **Hardening**: Anti-spam, rate limiting, persistence, analytics, and performance.

- [ ] robots.txt and sitemap.xml


Note: When in doubt, STOP and ask for confirmation.