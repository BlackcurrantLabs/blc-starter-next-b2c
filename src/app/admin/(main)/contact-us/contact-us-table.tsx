"use client";

import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  InitialTableState,
  TableState,
  useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/tables/data-table-pagination";
import { DataTableToolbar } from "@/components/tables/data-table-toolbar";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Prisma } from "@/database/prisma/client";
import {
  getContactMessage,
  markContactMessageRead,
  searchContactMessages,
} from "@/app/(landing)/contact-us/actions";

export interface ContactUsTableProps {
  readonly initialMessages: Prisma.ContactMessageModel[];
  readonly initialTotal: number;
  readonly initialState: InitialTableState;
}

const columnHelper = createColumnHelper<Prisma.ContactMessageModel>();

const columns = [
  columnHelper.accessor("email", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("subject", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject" />
    ),
    cell: (info) => info.getValue() ?? "(No subject)",
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Received" />
    ),
    cell: (info) => formatDate(info.getValue()),
    enableSorting: true,
    enableHiding: false,
  }),
  columnHelper.accessor("isRead", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: (info) => (
      <Badge variant={info.getValue() ? "secondary" : "default"}>
        {info.getValue() ? "Read" : "Unread"}
      </Badge>
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      filterTitle: "Status",
      filterOptions: [
        { label: "Unread", value: false },
        { label: "Read", value: true },
      ],
    },
  }),
];

function formatDate(value: Date) {
  return new Date(value).toLocaleString();
}

export default function ContactUsTable({
  initialMessages,
  initialTotal,
  initialState,
}: ContactUsTableProps) {
  const [tableState, setTableState] = useState<TableState>(
    initialState as TableState
  );
  const [messages, setMessages] = useState(initialMessages);
  const [total, setTotal] = useState(initialTotal);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialMessages[0]?.id ?? null
  );
  const [selectedMessage, setSelectedMessage] =
    useState<Prisma.ContactMessageModel | null>(initialMessages[0] ?? null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const table = useReactTable({
    data: messages,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: tableState,
    onStateChange: setTableState,
    rowCount: total,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
  });

  useEffect(() => {
    let isMounted = true;
    const loadMessages = async () => {
      const result = await searchContactMessages(table.getState());
      if (!isMounted) return;
      setMessages(result.messages);
      setTotal(result.total);
      if (result.messages.length && !selectedId) {
        setSelectedId(result.messages[0].id);
      }
    };
    loadMessages();
    return () => {
      isMounted = false;
    };
  }, [tableState, table, selectedId]);

  useEffect(() => {
    if (!selectedId) {
      setSelectedMessage(null);
      return;
    }
    let isMounted = true;
    setIsLoadingDetail(true);
    const loadDetail = async () => {
      const result = await getContactMessage(selectedId);
      if (!isMounted) return;
      setSelectedMessage(result);
      setIsLoadingDetail(false);
    };
    loadDetail();
    return () => {
      isMounted = false;
    };
  }, [selectedId]);

  const toggleRead = async () => {
    if (!selectedMessage) return;
    const updated = await markContactMessageRead(
      selectedMessage.id,
      !selectedMessage.isRead
    );
    setSelectedMessage(updated);
    setMessages((prev) =>
      prev.map((message) =>
        message.id === updated.id ? { ...message, ...updated } : message
      )
    );
  };

  const rows = table.getRowModel().rows;
  const selectedMessageId = selectedMessage?.id;

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <DataTableToolbar table={table} />
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
              {rows.length ? (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "cursor-pointer",
                      row.original.id === selectedMessageId &&
                        "bg-muted/50"
                    )}
                    onClick={() => setSelectedId(row.original.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No messages yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Details</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={toggleRead}
              disabled={!selectedMessage}
            >
              {selectedMessage?.isRead ? "Mark unread" : "Mark read"}
            </Button>
          </div>
          {isLoadingDetail ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Loading message...
            </p>
          ) : selectedMessage ? (
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">From</p>
                <p className="font-medium">{selectedMessage.email}</p>
                {selectedMessage.name ? (
                  <p className="text-muted-foreground">{selectedMessage.name}</p>
                ) : null}
              </div>
              <div>
                <p className="text-muted-foreground">Subject</p>
                <p className="font-medium">
                  {selectedMessage.subject ?? "(No subject)"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Received</p>
                <p>{formatDate(selectedMessage.createdAt)}</p>
              </div>
              {selectedMessage.readAt ? (
                <div>
                  <p className="text-muted-foreground">Read at</p>
                  <p>{formatDate(selectedMessage.readAt)}</p>
                </div>
              ) : null}
              <div>
                <p className="text-muted-foreground">Message</p>
                <p className="whitespace-pre-line">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Select a message to review it.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
