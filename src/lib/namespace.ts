import type { CellData, RowData, TableFeatures } from '@tanstack/react-table'

export interface FilterOption<TValue = string | boolean, TData = RowData> {
  value: TValue,
  label: string,
  icon?: React.ComponentType<{ className?: string }>
  data?: TData
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> {
    filterTitle: string,
    filterOptions: FilterOption<TValue, TData>[]
  }
}
