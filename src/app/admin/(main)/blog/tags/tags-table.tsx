"use client";

import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  TagWithCount,
  createTag,
  updateTag,
  deleteTag,
  getTags,
} from "./_actions/tag-actions";
import { TagForm, TagFormValues } from "./_components/tag-form";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";

interface TagsTableProps {
  initialData: TagWithCount[];
}

const columnHelper = createColumnHelper<TagWithCount>();

export function TagsTable({ initialData }: TagsTableProps) {
  const [data, setData] = useState(initialData);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagWithCount | null>(null);

  const refreshData = async () => {
    const tags = await getTags();
    setData(tags);
  };

  const handleCreate = async (values: TagFormValues) => {
    try {
      await createTag({
        name: values.name,
        slug: values.slug || "",
      });
      toast.success("Tag created successfully");
      setCreateDialogOpen(false);
      await refreshData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create tag");
    }
  };

  const handleUpdate = async (values: TagFormValues) => {
    if (!editingTag) return;
    try {
      await updateTag(editingTag.id, {
        name: values.name,
        slug: values.slug || "",
      });
      toast.success("Tag updated successfully");
      setEditingTag(null);
      await refreshData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update tag");
    }
  };

  const handleDelete = async (tag: TagWithCount) => {
    try {
      await deleteTag(tag.id);
      toast.success("Tag deleted successfully");
      await refreshData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete tag");
    }
  };

  const columns = [
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("slug", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Slug" />
      ),
      cell: (info) => (
        <code className="rounded bg-muted px-2 py-1 text-sm">{info.getValue()}</code>
      ),
    }),
    columnHelper.accessor("_count.posts", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Posts" />
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Dialog
            open={editingTag?.id === row.original.id}
            onOpenChange={(open) => {
              if (!open) setEditingTag(null);
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingTag(row.original)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Tag</DialogTitle>
                <DialogDescription>
                  Update the tag details below.
                </DialogDescription>
              </DialogHeader>
              <TagForm
                defaultValues={{
                  name: row.original.name,
                  slug: row.original.slug,
                }}
                onSubmit={handleUpdate}
                onCancel={() => setEditingTag(null)}
                isEdit
              />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{row.original.name}&quot;?
                  {row.original._count.posts > 0 && (
                    <span className="mt-2 block text-muted-foreground">
                      This tag is used by {row.original._count.posts} post(s). 
                      The tag will be removed from those posts.
                    </span>
                  )}
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
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="space-y-4 py-4">
      <div className="flex justify-end">
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Tag</DialogTitle>
              <DialogDescription>
                Add a new tag for your blog posts.
              </DialogDescription>
            </DialogHeader>
            <TagForm
              onSubmit={handleCreate}
              onCancel={() => setCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4">
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No tags found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
