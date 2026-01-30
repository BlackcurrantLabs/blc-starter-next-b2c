"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { TiptapEditor } from "@/components/blog/tiptap-editor";
import { Loader2, X, Plus } from "lucide-react";
import { JSONContent } from "@tiptap/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createTagOnFly } from "../_actions/post-actions";
import { toast } from "sonner";

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  slug: z
    .string()
    .max(255, "Slug is too long")
    .regex(
      /^[a-z0-9-]*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .optional()
    .or(z.literal("")),
  content: z.record(z.string(), z.unknown()).nullable(),
  featuredImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  metaDescription: z.string().max(160, "Meta description is too long").optional().or(z.literal("")),
  ogImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  categoryId: z.string().min(1, "Category is required"),
  tagIds: z.array(z.string()),
});

type FormValues = z.infer<typeof postFormSchema>;

export interface PostFormValues {
  title: string;
  slug?: string;
  content: JSONContent | null;
  featuredImageUrl?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  status: "draft" | "published";
  categoryId: string;
  tagIds: string[];
}

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

interface PostFormProps {
  defaultValues?: Partial<PostFormValues>;
  categories: Category[];
  tags: Tag[];
  onSubmit: (values: PostFormValues) => Promise<void>;
  isEdit?: boolean;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PostForm({
  defaultValues,
  categories,
  tags: initialTags,
  onSubmit,
  isEdit = false,
}: PostFormProps) {
  const [tags, setTags] = useState(initialTags);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    defaultValues?.tagIds || []
  );
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: null,
      featuredImageUrl: "",
      metaDescription: "",
      ogImageUrl: "",
      status: "draft",
      categoryId: "",
      tagIds: [],
      ...defaultValues,
    },
  });

  const watchedTitle = form.watch("title");
  const currentSlug = form.watch("slug");

  useEffect(() => {
    if (!isEdit && watchedTitle && !currentSlug) {
      const generatedSlug = generateSlug(watchedTitle);
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [watchedTitle, isEdit, currentSlug, form]);

  useEffect(() => {
    form.setValue("tagIds", selectedTags);
  }, [selectedTags, form]);

  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values as PostFormValues);
  };

  const handleTagSelect = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
    setTagPopoverOpen(false);
    setTagSearch("");
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  const handleCreateTag = async () => {
    if (!tagSearch.trim()) return;
    try {
      const newTag = await createTagOnFly(tagSearch.trim());
      setTags([...tags, newTag]);
      setSelectedTags([...selectedTags, newTag.id]);
      setTagPopoverOpen(false);
      setTagSearch("");
      toast.success(`Tag "${newTag.name}" created`);
    } catch {
      toast.error("Failed to create tag");
    }
  };

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
      !selectedTags.includes(tag.id)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="My Amazing Blog Post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="my-amazing-blog-post" {...field} />
                </FormControl>
                <FormDescription>URL-friendly version of the title</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <TiptapEditor
                  content={field.value as JSONContent | undefined}
                  onChange={field.onChange}
                  placeholder="Write your blog post content here..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Tags</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tagId) => {
                const tag = tags.find((t) => t.id === tagId);
                return tag ? (
                  <Badge key={tag.id} variant="secondary" className="gap-1">
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag.id)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
            <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" type="button">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tag
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search or create tag..."
                    value={tagSearch}
                    onValueChange={setTagSearch}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {tagSearch.trim() && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={handleCreateTag}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create &quot;{tagSearch}&quot;
                        </Button>
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredTags.map((tag) => (
                        <CommandItem
                          key={tag.id}
                          value={tag.name}
                          onSelect={() => handleTagSelect(tag.id)}
                        >
                          {tag.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormItem>
        </div>

        <FormField
          control={form.control}
          name="featuredImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image.jpg"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                URL for the post&apos;s featured/hero image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A brief description for search engines..."
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormDescription>
                  {(field.value?.length || 0)}/160 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ogImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Open Graph Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/og-image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Image for social media sharing (optional, uses featured image if not set)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Publish</FormLabel>
                <FormDescription>
                  {field.value === "published"
                    ? "Post is live and visible to the public"
                    : "Post is saved as draft and not visible"}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === "published"}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? "published" : "draft")
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEdit ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
