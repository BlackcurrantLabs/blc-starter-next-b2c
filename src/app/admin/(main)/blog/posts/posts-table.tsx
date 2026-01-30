"use client";

import { useEffect, useRef, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  TableState,
  InitialTableState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { DataTableToolbar } from "@/components/tables/data-table-toolbar";
import { DataTablePagination } from "@/components/tables/data-table-pagination";
import {
  ExternalLink,
  FilePlus,
  FileText,
  CircleDot,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  PostWithRelations,
  searchPosts,
  deletePost,
} from "./_actions/post-actions";

interface PostsTableProps {
  initialData: PostWithRelations[];
  initialTotal: number;
  initialState: InitialTableState;
}

export function PostsTable({
  initialData,
  initialTotal,
  initialState,
}: PostsTableProps) {
  const [data, setData] = useState(initialData);
  const [total, setTotal] = useState(initialTotal);
  const skipPageResetRef = useRef(true);
  const router = useRouter();

  const [tableState, setTableState] = useState<TableState>(
    initialState as TableState
  );

  const refreshData = async () => {
    const result = await searchPosts(tableState);
    skipPageResetRef.current = true;
    setData(result.posts);
    setTotal(result.total);
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableState.globalFilter,
    tableState.columnFilters,
    tableState.sorting,
    tableState.pagination,
  ]);

  useEffect(() => {
    skipPageResetRef.current = false;
  });

  const handleDelete = async (post: PostWithRelations) => {
    try {
      await deletePost(post.id);
      toast.success("Post deleted successfully");
      await refreshData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post"
      );
    }
  };



  const columnHelper = createColumnHelper<PostWithRelations>();

  const columns = [
    columnHelper.accessor("title", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: (info) => (
        <Link
          href={`/admin/blog/posts/${info.row.original.id}/edit`}
          className="font-medium hover:underline"
        >
          {info.getValue()}
        </Link>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge variant={status === "published" ? "default" : "secondary"}>
            {status === "published" ? (
              <CircleDot className="mr-1 h-3 w-3" />
            ) : (
              <FileText className="mr-1 h-3 w-3" />
            )}
            {status}
          </Badge>
        );
      },
      enableSorting: false,
      meta: {
        filterTitle: "Status",
        filterOptions: [
          { icon: CircleDot, label: "Published", value: "published" },
          { icon: FileText, label: "Draft", value: "draft" },
        ],
      },
    }),
    columnHelper.accessor("category.name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: (info) => info.getValue() || "-",
      enableSorting: false,
    }),
    columnHelper.accessor("author.name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Author" />
      ),
      cell: (info) => info.getValue() || info.row.original.author?.email || "-",
      enableSorting: false,
    }),
    columnHelper.accessor("publishedAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Published" />
      ),
      cell: (info) => {
        const date = info.getValue();
        return date ? new Date(date).toLocaleDateString("en-IN") : "-";
      },
      enableSorting: true,
    }),
    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: (info) => new Date(info.getValue()).toLocaleDateString("en-IN"),
      enableSorting: true,
    }),
    columnHelper.display({
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Actions"
          className="text-end"
        />
      ),
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Link href={`/admin/blog/posts/${row.original.id}/edit`}>
            <Button variant="secondary" size="icon">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{row.original.title}
                  &quot;? This will remove the post from public view.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(row.original)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    rowCount: total,
    state: tableState,
    initialState,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    autoResetAll: !skipPageResetRef,
    onStateChange: setTableState,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleCreate = () => {
    router.push("/admin/blog/posts/create");
  };

  return (
    <section className="space-y-4 py-4">
      <DataTableToolbar
        table={table}
        tableActions={[
          <Button key="create" onClick={handleCreate} variant="outline">
            <FilePlus className="mr-2 h-4 w-4" />
            Create Post
          </Button>,
        ]}
      />

      <div className="rounded-md border overflow-hidden">
        <Table className="border-collapse animate-in">
          <TableHeader className="bg-slate-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-4"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No posts found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </section>
  );
}
