## sanpoon — Profile + Blog (Bilingual MDX)

Minimal personal site with a bilingual blog. Each post has English and Nepali versions and a single URL; readers switch languages in-place, similar to dark/light mode.

### Features
- **Bilingual posts (EN/NE)**: One URL per post, in-place language toggle
- **MDX content**: Styled typography, images, and code blocks
- **shadcn/ui + dark mode**: Theme toggle powered by next-themes
- **Static generation**: Blog index and posts are prerendered

### Content structure
- Posts live under `core/content/blog/<slug>/{en,ne}.mdx`
- Required frontmatter:
  - `title` (string)
  - `date` (ISO: YYYY-MM-DD)
  - `summary` (string)
  - `tags` (string[])
  - `cover` (string path)
  - `slug` (string)
  - `lang` ("en" | "ne")

### Local development
```bash
pnpm install
pnpm dev
# build & serve production
pnpm build && pnpm start
```

### Add a new post
1) Create a folder: `core/content/blog/my-post/`
2) Add `en.mdx` and `ne.mdx` with frontmatter (use ISO date)
3) `pnpm build` to include it in SSG

### Notes / Roadmap
- Reactions (love/dislike; dislike requires a comment) and threaded comments are planned later
- robots.txt and sitemap.xml to be added later
