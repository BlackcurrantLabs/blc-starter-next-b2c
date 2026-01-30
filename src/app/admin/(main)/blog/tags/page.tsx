import { getTags } from "./_actions/tag-actions";
import { TagsTable } from "./tags-table";

export default async function BlogTagsPage() {
  const tags = await getTags();

  return <TagsTable initialData={tags} />;
}
