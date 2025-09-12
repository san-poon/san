import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/core/data/access/blog";

export const dynamic = "force-static";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <main className="container mx-auto max-w-4xl px-6 py-12 sm:py-16">
      {/* Hero */}
      <section className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold sm:text-4xl">Hi, I’m San.</h1>
          <p className="mt-3 text-foreground/80">
            A web developer crafting ai native learning web tools. Am currently building <Link href="https://www.axinder.com" target="_blank" className="text-primary underline">Axinder</Link>, an AI Tutor.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
          </div>
        </div>
        <div className="shrink-0">
          <Image
            src="/san-poon-global-profile.jpg"
            alt="San Poon headshot"
            width={112}
            height={112}
            className="rounded-full ring-1 ring-border"
            priority
          />
        </div>
      </section>

      {/* Featured projects */}
      <section id="projects" className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-full border px-2 py-1 text-xs text-foreground/70">Featured</span>
            <h2 className="text-xl font-semibold">Featured projects</h2>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border p-6 sm:p-8">
          <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" aria-hidden />
          <div className="grid gap-4 sm:grid-cols-2">
              <div className="group rounded-xl border bg-background/50 p-5 backdrop-blur-sm transition-all hover:shadow-sm">
                <Link href="https://www.axinder.com" target="_blank">
                  <div className="relative h-16 w-16 rounded-full bg-cyan-50 ring-1 ring-inset ring-border/50 dark:bg-cyan-500/30">
                    <Image
                      src="/axinder.svg"
                      alt="Axinder logo"
                      fill
                      className="object-contain p-4 dark:invert"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">Axinder</h3>
                </Link>
                <p className="mt-1 text-sm text-foreground/70">
                  AI Tutor for stem fields.
                </p>
                <div className="mt-3 flex gap-2 text-xs text-foreground/70">
                  <span>Next.js</span>
                  <span>Postgres</span>
                  <span>ai-sdk</span>
                  <span>Vercel</span>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Latest blog posts (highlighted) */}
      <section className="mt-12">
        <div className="relative overflow-hidden rounded-2xl border p-6 sm:p-8">
          <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" aria-hidden />
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="rounded-full border px-2 py-1 text-xs text-foreground/70">Latest</span>
              <h2 className="text-xl font-semibold">Latest posts</h2>
            </div>
            <Button asChild variant="link">
              <Link href="/blog">See all</Link>
            </Button>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {posts.map(({ slug, en }) => (
              <li key={slug} className="group rounded-xl border bg-background/50 p-4 transition-all hover:shadow-sm">
                <Link href={`/blog/${slug}`} className="block">
                  <h3 className="text-base font-medium group-hover:underline">
                    {en.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-foreground/60">
                    {new Date(en.date).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-sm text-foreground/80">{en.summary}</p>
                  {en.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {en.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-md border px-1.5 py-0.5 text-[10px] text-foreground/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
            {posts.length === 0 && (
              <li className="text-foreground/70">No posts yet.</li>
            )}
          </ul>
        </div>
      </section>

      {/* About snapshot */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">About</h2>
        <p className="mt-2 text-foreground/80">
          I build ai & web native tools for learning and teaching.
        </p>
      </section>

      {/* Skills / Tech stack */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Skills</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 md:grid-cols-3">
          {[
            "TypeScript",
            "React",
            "Next.js",
            "Postgres",
            "Drizzle ORM",
            "Tailwind CSS",
            "Testing",
            "ai-sdk",
            "cli, git"
          ].map((skill) => (
            <span key={skill} className="rounded-md border px-2 py-1">
              {skill}
            </span>
          ))}
        </div>
      </section>

    </main>
  );
}
