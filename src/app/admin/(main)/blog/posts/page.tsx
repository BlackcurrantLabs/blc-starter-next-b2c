import type { TableQuery } from "@/components/tables/table-features";
import { PostsTable } from "./posts-table";
import { searchPosts } from "./_actions/post-actions";

export default async function BlogPostsPage() {
  const initialState: TableQuery = {
    globalFilter: "",
    columnFilters: [],
    sorting: [
      {
        id: "createdAt",
        desc: true,
      },
    ],
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  };

  const data = await searchPosts(initialState);

  return (
    <PostsTable
      initialData={data.posts}
      initialTotal={data.total}
      initialState={initialState}
    />
  );
}
