import prisma from "@/database/datasource";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { extractTextFromContent } from "@/lib/blog-utils";

interface SearchParams {
  category?: string;
  tag?: string;
  page?: string;
}

const POSTS_PER_PAGE = 12;

async function getPublishedPosts(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || "1", 10);
  const skip = (page - 1) * POSTS_PER_PAGE;

  const where = {
    status: "published",
    deletedAt: null,
    ...(searchParams.category && {
      category: { slug: searchParams.category },
    }),
    ...(searchParams.tag && {
      tags: { some: { tag: { slug: searchParams.tag } } },
    }),
  };

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: POSTS_PER_PAGE,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { posts, total, page, totalPages: Math.ceil(total / POSTS_PER_PAGE) };
}

async function getCategories() {
  return prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          posts: {
            where: { status: "published", deletedAt: null },
          },
        },
      },
    },
  });
}

function BlogPostCard({
  post,
}: {
  post: {
    id: string;
    title: string;
    slug: string;
    content: unknown;
    featuredImageUrl: string | null;
    publishedAt: Date | null;
    author: { name: string } | null;
    category: { name: string; slug: string } | null;
  };
}) {
  const excerpt = extractTextFromContent(post.content as Record<string, unknown>, 150);
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="group overflow-hidden rounded-lg border bg-card shadow-sm transition hover:shadow-lg">
      <Link href={`/blog/${post.slug}`}>
        <div className="aspect-video relative overflow-hidden bg-muted">
          {post.featuredImageUrl ? (
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              className="object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg
                className="h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.publishedAt?.toISOString()}>{formattedDate}</time>
          {post.category && (
            <>
              <span>·</span>
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="hover:text-primary"
              >
                <Badge variant="secondary">{post.category.name}</Badge>
              </Link>
            </>
          )}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2 className="mt-3 text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
          {excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {post.author?.name || "Anonymous"}
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}

function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: SearchParams;
}) {
  if (totalPages <= 1) return null;

  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.tag) params.set("tag", searchParams.tag);
    params.set("page", p.toString());
    return `/blog?${params.toString()}`;
  };

  return (
    <nav className="mt-12 flex justify-center gap-2">
      {page > 1 && (
        <Link
          href={buildUrl(page - 1)}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Previous
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildUrl(p)}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            p === page
              ? "bg-primary text-primary-foreground"
              : "border hover:bg-accent"
          }`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link
          href={buildUrl(page + 1)}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Next
        </Link>
      )}
    </nav>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [{ posts, total, page, totalPages }, categories] = await Promise.all([
    getPublishedPosts(params),
    getCategories(),
  ]);

  const activeCategory = params.category;
  const activeTag = params.tag;

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Insights, updates, and stories from our team
        </p>
      </header>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/blog"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              !activeCategory && !activeTag
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeCategory === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat.name} ({cat._count.posts})
            </Link>
          ))}
        </div>
      )}

      {activeTag && (
        <div className="mb-8 text-center">
          <span className="text-muted-foreground">Filtered by tag: </span>
          <Badge variant="secondary">{activeTag}</Badge>
          <Link href="/blog" className="ml-2 text-sm text-primary hover:underline">
            Clear
          </Link>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-lg text-muted-foreground">
            No posts found. Check back soon!
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} searchParams={params} />

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing {(page - 1) * POSTS_PER_PAGE + 1} -{" "}
            {Math.min(page * POSTS_PER_PAGE, total)} of {total} posts
          </div>
        </>
      )}
    </div>
  );
}
