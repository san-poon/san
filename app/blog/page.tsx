import Link from "next/link";
import { getAllPosts } from "@/core/data/access/blog";

export const dynamic = "force-static";

export default function BlogIndexPage() {
  const posts = getAllPosts();
  return (
    <main className="container mx-auto max-w-3xl py-12">
      <h1 className="mb-8 text-3xl font-bold">Blogs</h1>
      <ul className="space-y-6">
        {posts.map(({ slug, en }) => (
          <li key={slug} className="group">
            <Link href={`/blog/${slug}`} className="block">
              <h2 className="text-xl font-semibold group-hover:underline">
                {en.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {new Date(en.date).toLocaleDateString()}
              </p>
              <p className="mt-2 text-foreground/80">{en.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}


