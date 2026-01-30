import { InitialTableState, TableState } from "@tanstack/react-table";
import { PostsTable } from "./posts-table";
import { searchPosts } from "./_actions/post-actions";

export default async function BlogPostsPage() {
  const initialState: InitialTableState = {
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

  const data = await searchPosts(initialState as TableState);

  return (
    <PostsTable
      initialData={data.posts}
      initialTotal={data.total}
      initialState={initialState}
    />
  );
}
