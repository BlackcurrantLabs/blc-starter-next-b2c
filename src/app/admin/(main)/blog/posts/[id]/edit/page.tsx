"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostForm, PostFormValues } from "../../_components/post-form";
import {
  getPost,
  updatePost,
  getCategories,
  getAllTags,
} from "../../_actions/post-actions";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { JSONContent } from "@tiptap/react";

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

interface PostData {
  id: string;
  title: string;
  slug: string;
  content: JSONContent;
  featuredImageUrl: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  status: string;
  categoryId: string;
  tags: Array<{ tag: { id: string; name: string; slug: string } }>;
}

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<PostData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [postData, categoriesData, tagsData] = await Promise.all([
        getPost(id),
        getCategories(),
        getAllTags(),
      ]);

      if (!postData || postData.deletedAt) {
        setNotFoundState(true);
        setLoading(false);
        return;
      }

      setPost(postData as unknown as PostData);
      setCategories(categoriesData);
      setTags(tagsData);
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleSubmit = async (values: PostFormValues) => {
    try {
      await updatePost(id, {
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
      toast.success("Post updated successfully");
      router.push("/admin/blog/posts");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update post"
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

  if (notFoundState) {
    notFound();
  }

  if (!post) {
    return null;
  }

  const defaultValues: Partial<PostFormValues> = {
    title: post.title,
    slug: post.slug,
    content: post.content,
    featuredImageUrl: post.featuredImageUrl || "",
    metaDescription: post.metaDescription || "",
    ogImageUrl: post.ogImageUrl || "",
    status: post.status as "draft" | "published",
    categoryId: post.categoryId,
    tagIds: post.tags.map((t) => t.tag.id),
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        {post.status === "published" && (
          <Link href={`/blog/${post.slug}`} target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Post
            </Button>
          </Link>
        )}
      </div>
      <PostForm
        defaultValues={defaultValues}
        categories={categories}
        tags={tags}
        onSubmit={handleSubmit}
        isEdit
      />
    </div>
  );
}
