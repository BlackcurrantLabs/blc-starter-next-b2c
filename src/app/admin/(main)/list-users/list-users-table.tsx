"use client";

import { useEffect, useState } from "react";

import { DataTablePagination } from "@/components/tables/data-table-pagination";
import { Button } from "@/components/ui/button";
import { Prisma } from "@/database/prisma/client";
import {
  createColumnHelper,
  flexRender,
  useTable,
} from "@tanstack/react-table";
import {
  appTableFeatures,
  type AppInitialTableState,
  type AppTableFeatures,
} from "@/components/tables/table-features";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableColumnHeader } from "../../../../components/tables/data-table-column-header";
import {
  User,
  ShieldCheck,
  ShieldQuestionMark,
  UserStar,
  ExternalLink,
  UserPlus,
} from "lucide-react";
import { DataTableToolbar } from "../../../../components/tables/data-table-toolbar";
import { searchUsers } from "./search.action";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface ListUsersTableProps {
  readonly initialData: Prisma.UserModel[];
  readonly initialTotal: number;
  readonly initialState: AppInitialTableState;
}

const columnHelper = createColumnHelper<AppTableFeatures, Prisma.UserModel>();
const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
      ></DataTableColumnHeader>
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("email", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email"
      ></DataTableColumnHeader>
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("emailVerified", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email Verified"
      ></DataTableColumnHeader>
    ),
    enableHiding: false,
    enableSorting: false,
    cell: (props) =>
      props.row.original.emailVerified ? (
        <ShieldCheck size={16} className="inline" />
      ) : (
        <ShieldQuestionMark size={16} className="inline" />
      ),
    meta: {
      filterTitle: "Email Verified",
      filterOptions: [
        {
          icon: ShieldCheck,
          label: "Verified",
          value: true,
        },
        {
          icon: ShieldQuestionMark,
          label: "Unverified",
          value: false,
        },
      ],
    },
  }),
  columnHelper.accessor("role", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Role"
      ></DataTableColumnHeader>
    ),
    enableHiding: false,
    enableSorting: false,
    meta: {
      filterTitle: "Role",
      filterOptions: [
        {
          icon: User,
          label: "User",
          value: "user",
        },
        {
          icon: UserStar,
          label: "Admin",
          value: "admin",
        },
      ],
    },
  }),
  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
      ></DataTableColumnHeader>
    ),
    enableSorting: true,
    enableHiding: false,
    cell: (props) => (
      <span>{new Date(props.cell.getValue()).toLocaleDateString("en-IN")}</span>
    ),
  }),
  columnHelper.display({
    id: "Open",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Open"
        className="text-end"
      ></DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <div className="text-end">
      <Link href={`/admin/user-details/${row.id}`}>
        <Button variant={"secondary"} size={"icon"}>
          <ExternalLink></ExternalLink>
        </Button>
      </Link>
      </div>
    ),
  }),
]);

export default function ListUsersTable({
  initialData,
  initialTotal,
  initialState,
}: ListUsersTableProps) {
  const [data, setData] = useState(initialData);
  const [total, setTotal] = useState(initialTotal);
  const router = useRouter();

  // The table owns its state (seeded from `initialState`); searching, sorting
  // and paging all happen on the server.
  const table = useTable({
    features: appTableFeatures,
    data,
    columns,
    rowCount: total,
    initialState,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    autoResetAll: false,
    getRowId: (row) => row.id,
  });

  const { globalFilter, columnFilters, sorting, pagination } = table.state;

  useEffect(() => {
    let isCurrent = true;
    const fetchData = async () => {
      const result = await searchUsers({
        globalFilter,
        columnFilters,
        sorting,
        pagination,
      });
      if (!isCurrent) return;
      setData(result.users);
      setTotal(result.total);
    };
    fetchData();
    return () => {
      isCurrent = false;
    };
  }, [globalFilter, columnFilters, sorting, pagination]);

  const addUser = () => {
    router.push("/admin/user-details/new");
  };

  return (
    <section className="space-y-4 py-4">
      <DataTableToolbar
        table={table}
        tableActions={[
          <Button key={"create"} onClick={addUser} variant={"outline"}>
            <UserPlus className="inline"></UserPlus>
            Create User
          </Button>,
        ]}
      ></DataTableToolbar>
      <div className="border rounded-md overflow-hidden">
        <Table className="border-collapse animate-in">        
          <TableHeader className="bg-slate-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} className="px-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table}></DataTablePagination>
    </section>
  );
}
