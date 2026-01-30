"use server";

import prisma from "@/database/datasource";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface TagFormData {
  name: string;
  slug: string;
}

export async function createTag(data: TagFormData) {
  const slug = data.slug || generateSlug(data.name);

  const existing = await prisma.blogTag.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new Error("A tag with this slug already exists");
  }

  return prisma.blogTag.create({
    data: {
      name: data.name,
      slug,
    },
  });
}

export async function updateTag(id: string, data: TagFormData) {
  const slug = data.slug || generateSlug(data.name);

  const existing = await prisma.blogTag.findFirst({
    where: {
      slug,
      NOT: { id },
    },
  });

  if (existing) {
    throw new Error("A tag with this slug already exists");
  }

  return prisma.blogTag.update({
    where: { id },
    data: {
      name: data.name,
      slug,
    },
  });
}

export async function deleteTag(id: string) {
  return prisma.blogTag.delete({
    where: { id },
  });
}

export async function getTags() {
  return prisma.blogTag.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export type TagWithCount = Awaited<ReturnType<typeof getTags>>[number];
