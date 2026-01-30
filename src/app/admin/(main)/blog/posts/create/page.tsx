"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { PostForm, PostFormValues } from "../_components/post-form";
import {
  createPost,
  getCategories,
  getAllTags,
} from "../_actions/post-actions";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export default function CreatePostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [categoriesData, tagsData] = await Promise.all([
        getCategories(),
        getAllTags(),
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSubmit = async (values: PostFormValues) => {
    try {
      await createPost({
        title: values.title,
        slug: values.slug || "",
        content: values.content || { type: "doc", content: [] },
        featuredImageUrl: values.featuredImageUrl || null,
        metaDescription: values.metaDescription || null,
        ogImageUrl: values.ogImageUrl || null,
        status: values.status,
        categoryId: values.categoryId,
        tagIds: values.tagIds,
      });
      toast.success("Post created successfully");
      router.push("/admin/blog/posts");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create post"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-4">
          You need to create at least one category before creating a post.
        </p>
        <a
          href="/admin/blog/categories"
          className="text-primary underline underline-offset-4"
        >
          Create a category
        </a>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <PostForm
        categories={categories}
        tags={tags}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
