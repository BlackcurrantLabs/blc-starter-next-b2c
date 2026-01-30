"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { FilterOption } from "@/lib/namespace"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  tableActions?: React.ReactNode[]
}

export function DataTableToolbar<TData>({
  table,
  tableActions = []
}: Readonly<DataTableToolbarProps<TData>>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        {/* Global Search */}
        <Input
          placeholder="Search..."
          value={table.getState().globalFilter}
          onChange={(event) =>
            table.setGlobalFilter(String(event.target.value))
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* Explicit Filters set per column usually for enum type columns */}
        {table
          .getAllColumns()
          .filter((c) => c.getCanFilter() && c.columnDef.meta?.filterOptions)
          .map((col) => {
            const options = col.columnDef.meta!.filterOptions as FilterOption[]
            return (
              <DataTableFacetedFilter
                key={col.id}
                options={options}
                title={col.columnDef.meta!.filterTitle}
                column={col}
              />
            )
          })}

        {/* Reset Filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {tableActions.map(ta => ta)}
      </div>
    </div>
  )
}
