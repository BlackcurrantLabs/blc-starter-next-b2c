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
  CategoryWithCount,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} from "./_actions/category-actions";
import {
  CategoryForm,
  CategoryFormValues,
} from "./_components/category-form";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";

interface CategoriesTableProps {
  initialData: CategoryWithCount[];
}

const columnHelper = createColumnHelper<CategoryWithCount>();

export function CategoriesTable({ initialData }: CategoriesTableProps) {
  const [data, setData] = useState(initialData);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);

  const refreshData = async () => {
    const categories = await getCategories();
    setData(categories);
  };

  const handleCreate = async (values: CategoryFormValues) => {
    try {
      await createCategory({
        name: values.name,
        slug: values.slug || "",
      });
      toast.success("Category created successfully");
      setCreateDialogOpen(false);
      await refreshData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create category");
    }
  };

  const handleUpdate = async (values: CategoryFormValues) => {
    if (!editingCategory) return;
    try {
      await updateCategory(editingCategory.id, {
        name: values.name,
        slug: values.slug || "",
      });
      toast.success("Category updated successfully");
      setEditingCategory(null);
      await refreshData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update category");
    }
  };

  const handleDelete = async (category: CategoryWithCount) => {
    try {
      await deleteCategory(category.id);
      toast.success("Category deleted successfully");
      await refreshData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete category");
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
            open={editingCategory?.id === row.original.id}
            onOpenChange={(open) => {
              if (!open) setEditingCategory(null);
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingCategory(row.original)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>
                  Update the category details below.
                </DialogDescription>
              </DialogHeader>
              <CategoryForm
                defaultValues={{
                  name: row.original.name,
                  slug: row.original.slug,
                }}
                onSubmit={handleUpdate}
                onCancel={() => setEditingCategory(null)}
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
                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{row.original.name}&quot;?
                  {row.original._count.posts > 0 && (
                    <span className="mt-2 block text-destructive">
                      This category has {row.original._count.posts} post(s) and cannot be deleted.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(row.original)}
                  disabled={row.original._count.posts > 0}
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
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>
                Add a new category for your blog posts.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
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
                  No categories found. Create one to get started.
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
