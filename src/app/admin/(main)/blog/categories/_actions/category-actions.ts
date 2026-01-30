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

export interface CategoryFormData {
  name: string;
  slug: string;
}

export async function createCategory(data: CategoryFormData) {
  const slug = data.slug || generateSlug(data.name);

  const existing = await prisma.blogCategory.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new Error("A category with this slug already exists");
  }

  return prisma.blogCategory.create({
    data: {
      name: data.name,
      slug,
    },
  });
}

export async function updateCategory(id: string, data: CategoryFormData) {
  const slug = data.slug || generateSlug(data.name);

  const existing = await prisma.blogCategory.findFirst({
    where: {
      slug,
      NOT: { id },
    },
  });

  if (existing) {
    throw new Error("A category with this slug already exists");
  }

  return prisma.blogCategory.update({
    where: { id },
    data: {
      name: data.name,
      slug,
    },
  });
}

export async function deleteCategory(id: string) {
  const category = await prisma.blogCategory.findUnique({
    where: { id },
    include: { _count: { select: { posts: true } } },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (category._count.posts > 0) {
    throw new Error(
      `Cannot delete category with ${category._count.posts} post(s). Remove posts first.`
    );
  }

  return prisma.blogCategory.delete({
    where: { id },
  });
}

export async function getCategories() {
  return prisma.blogCategory.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export type CategoryWithCount = Awaited<ReturnType<typeof getCategories>>[number];
