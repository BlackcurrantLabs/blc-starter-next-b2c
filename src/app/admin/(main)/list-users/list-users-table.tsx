"use client";

import { useEffect, useRef, useState } from "react";

import { DataTablePagination } from "@/components/tables/data-table-pagination";
import { Button } from "@/components/ui/button";
import { Prisma } from "@/database/prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  TableState,
  InitialTableState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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
  readonly initialState: InitialTableState;
}

const columnHelper = createColumnHelper<Prisma.UserModel>();
const columns = [
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
    cell: ({ row, cell }) => (
      <div className="text-end">
      <Link href={`/admin/user-details/${row.id}`}>
        <Button variant={"secondary"} size={"icon"}>
          <ExternalLink></ExternalLink>
        </Button>
      </Link>
      </div>
    ),
  }),
];

export default function ListUsersTable({
  initialData,
  initialTotal,
  initialState,
}: ListUsersTableProps) {
  const [data, setData] = useState(initialData);
  const [total, setTotal] = useState(initialTotal);
  const skipPageResetRef = useRef(true);
  const router = useRouter();

  const [tableState, setTableState] = useState<TableState>(
    initialState as TableState
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await searchUsers(table.getState());

      // When data gets updated with this function, set a flag
      // to disable all of the auto resetting
      skipPageResetRef.current = true;

      setData(result.users);
      setTotal(result.total);
    };
    fetchData();
  }, [
    tableState.globalFilter,
    tableState.columnFilters,
    tableState.sorting,
    tableState.pagination,
  ]);

  useEffect(() => {
    // After the table has updated, always remove the flag
    skipPageResetRef.current = false;
  });

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
