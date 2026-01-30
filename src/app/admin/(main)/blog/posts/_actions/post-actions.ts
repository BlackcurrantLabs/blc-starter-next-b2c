"use server";

import prisma from "@/database/datasource";
import type { TableState } from "@tanstack/react-table";
import { BlogPostWhereInput } from "@/database/prisma/models";
import { auth } from "@/auth";
import { headers } from "next/headers";
import type { JSONContent } from "@tiptap/react";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface PostFormData {
  title: string;
  slug: string;
  content: JSONContent;
  featuredImageUrl?: string | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
  status: "draft" | "published";
  categoryId: string;
  tagIds: string[];
}

export async function searchPosts(tableState: TableState) {
  const skip = tableState.pagination.pageIndex * tableState.pagination.pageSize;
  const take = tableState.pagination.pageSize;

  let where: BlogPostWhereInput = {
    deletedAt: null,
  };

  if (tableState.globalFilter) {
    where = {
      ...where,
      OR: [
        { title: { contains: tableState.globalFilter } },
        { slug: { contains: tableState.globalFilter } },
      ],
    };
  }

  tableState.columnFilters?.forEach((col) => {
    const values = col.value as unknown[];
    if (col.id === "status" && values.length > 0) {
      where = {
        ...where,
        status: { in: values as string[] },
      };
    }
    if (col.id === "categoryId" && values.length > 0) {
      where = {
        ...where,
        categoryId: { in: values as string[] },
      };
    }
  });

  type OrderByInput = { [key: string]: "asc" | "desc" };
  let orderBy: OrderByInput = {};
  tableState.sorting.forEach((s) => {
    orderBy = {
      ...orderBy,
      [s.id]: s.desc ? "desc" : "asc",
    };
  });

  if (Object.keys(orderBy).length === 0) {
    orderBy = { createdAt: "desc" };
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        tags: {
          include: {
            tag: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { posts, total };
}

export type PostWithRelations = Awaited<
  ReturnType<typeof searchPosts>
>["posts"][number];

export async function createPost(data: PostFormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const slug = data.slug || generateSlug(data.title);

  const existing = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new Error("A post with this slug already exists");
  }

  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      content: data.content,
      featuredImageUrl: data.featuredImageUrl || null,
      metaDescription: data.metaDescription || null,
      ogImageUrl: data.ogImageUrl || null,
      status: data.status,
      publishedAt: data.status === "published" ? new Date() : null,
      authorId: session.user.id,
      categoryId: data.categoryId,
      tags: {
        create: data.tagIds.map((tagId) => ({
          tagId,
        })),
      },
    },
  });

  return post;
}

export async function updatePost(id: string, data: PostFormData) {
  const existingPost = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!existingPost) {
    throw new Error("Post not found");
  }

  const slug = data.slug || generateSlug(data.title);

  const slugConflict = await prisma.blogPost.findFirst({
    where: {
      slug,
      NOT: { id },
    },
  });

  if (slugConflict) {
    throw new Error("A post with this slug already exists");
  }

  const wasPublished = existingPost.status === "published";
  const isPublished = data.status === "published";

  let publishedAt = existingPost.publishedAt;
  if (!wasPublished && isPublished) {
    publishedAt = new Date();
  }

  await prisma.blogPostTag.deleteMany({
    where: { postId: id },
  });

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      content: data.content,
      featuredImageUrl: data.featuredImageUrl || null,
      metaDescription: data.metaDescription || null,
      ogImageUrl: data.ogImageUrl || null,
      status: data.status,
      publishedAt,
      categoryId: data.categoryId,
      tags: {
        create: data.tagIds.map((tagId) => ({
          tagId,
        })),
      },
    },
  });

  return post;
}

export async function deletePost(id: string) {
  return prisma.blogPost.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function restorePost(id: string) {
  return prisma.blogPost.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
}

export async function getPost(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
      category: {
        select: { id: true, name: true, slug: true },
      },
      tags: {
        include: {
          tag: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
    },
  });
}

export async function getCategories() {
  return prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getAllTags() {
  return prisma.blogTag.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createTagOnFly(name: string) {
  const slug = generateSlug(name);

  const existing = await prisma.blogTag.findUnique({
    where: { slug },
  });

  if (existing) {
    return existing;
  }

  return prisma.blogTag.create({
    data: { name, slug },
  });
}
