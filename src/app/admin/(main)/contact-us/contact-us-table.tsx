"use client";

import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  useTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/tables/data-table-pagination";
import { DataTableToolbar } from "@/components/tables/data-table-toolbar";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import {
  appTableFeatures,
  type AppInitialTableState,
  type AppTableFeatures,
} from "@/components/tables/table-features";
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

interface MessageDetail {
  readonly id: string;
  readonly message: Prisma.ContactMessageModel | null;
}

export interface ContactUsTableProps {
  readonly initialMessages: Prisma.ContactMessageModel[];
  readonly initialTotal: number;
  readonly initialState: AppInitialTableState;
}

const columnHelper = createColumnHelper<
  AppTableFeatures,
  Prisma.ContactMessageModel
>();

const columns = columnHelper.columns([
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
]);

function formatDate(value: Date) {
  return new Date(value).toLocaleString();
}

export default function ContactUsTable({
  initialMessages,
  initialTotal,
  initialState,
}: ContactUsTableProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [total, setTotal] = useState(initialTotal);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialMessages[0]?.id ?? null
  );
  // The most recently loaded detail, tagged with the id it was loaded for so
  // "loading" and "selected message" can be derived instead of stored.
  const [detail, setDetail] = useState<MessageDetail | null>(
    initialMessages[0]
      ? { id: initialMessages[0].id, message: initialMessages[0] }
      : null
  );
  const isDetailCurrent = selectedId !== null && detail?.id === selectedId;
  const selectedMessage = isDetailCurrent ? detail.message : null;
  const isLoadingDetail = selectedId !== null && !isDetailCurrent;

  // The table owns its state (seeded from `initialState`); searching, sorting
  // and paging all happen on the server.
  const table = useTable({
    features: appTableFeatures,
    data: messages,
    columns,
    initialState,
    rowCount: total,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
  });

  const { globalFilter, columnFilters, sorting, pagination } = table.state;

  // Depend on the state slices, never on `table` itself: `useTable` returns a
  // new table object on every render.
  useEffect(() => {
    let isMounted = true;
    const loadMessages = async () => {
      const result = await searchContactMessages({
        globalFilter,
        columnFilters,
        sorting,
        pagination,
      });
      if (!isMounted) return;
      setMessages(result.messages);
      setTotal(result.total);
      setSelectedId((current) => current ?? result.messages[0]?.id ?? null);
    };
    loadMessages();
    return () => {
      isMounted = false;
    };
  }, [globalFilter, columnFilters, sorting, pagination]);

  useEffect(() => {
    if (!selectedId) return;
    let isMounted = true;
    const loadDetail = async () => {
      const result = await getContactMessage(selectedId);
      if (!isMounted) return;
      setDetail({ id: selectedId, message: result });
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
    setDetail({ id: updated.id, message: updated });
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
