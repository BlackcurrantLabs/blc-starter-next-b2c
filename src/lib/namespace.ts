import { RowData } from '@tanstack/react-table'

export interface FilterOption<TValue = string | boolean, TData = RowData> {
  value: TValue,
  label: string,
  icon?: React.ComponentType<{ className?: string }>
  data?: TData
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterTitle: string,
    filterOptions: FilterOption<TValue, TData>[]
  }
}
