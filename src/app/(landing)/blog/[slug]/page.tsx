import prisma from "@/database/datasource";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TiptapViewer } from "@/components/blog/tiptap-editor";
import { extractTextFromContent } from "@/lib/blog-utils";
import { Metadata } from "next";
import { JSONContent } from "@tiptap/react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  return prisma.blogPost.findFirst({
    where: {
      slug,
      status: "published",
      deletedAt: null,
    },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true, slug: true } },
      tags: {
        include: {
          tag: { select: { name: true, slug: true } },
        },
      },
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const description =
    post.metaDescription ||
    extractTextFromContent(post.content as Record<string, unknown>, 160);
  const ogImage = post.ogImageUrl || post.featuredImageUrl;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author?.name ? [post.author.name] : undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="container mx-auto px-4 py-12">
      <header className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.publishedAt?.toISOString()}>{formattedDate}</time>
          {post.category && (
            <>
              <span>·</span>
              <Link href={`/blog?category=${post.category.slug}`}>
                <Badge variant="secondary">{post.category.name}</Badge>
              </Link>
            </>
          )}
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-4 text-muted-foreground">
          <span>By {post.author?.name || "Anonymous"}</span>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(({ tag }) => (
              <Link key={tag.slug} href={`/blog?tag=${tag.slug}`}>
                <Badge variant="outline">{tag.name}</Badge>
              </Link>
            ))}
          </div>
        )}
      </header>

      {post.featuredImageUrl && (
        <div className="mx-auto mt-8 max-w-4xl">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="mx-auto mt-8 max-w-3xl">
        <TiptapViewer content={post.content as JSONContent} />
      </div>

      <footer className="mx-auto mt-12 max-w-3xl border-t pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-primary hover:underline"
        >
          ← Back to all posts
        </Link>
      </footer>
    </article>
  );
}
