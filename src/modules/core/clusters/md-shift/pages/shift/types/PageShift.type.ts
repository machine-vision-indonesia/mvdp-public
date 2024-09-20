import { ReactNode } from 'react'
import { type UseQueryResult } from '@tanstack/react-query'
import { type DataGridProps } from '@mui/x-data-grid'
import { IParams } from '@/types/master/filter'
import { PropsAlert } from '@/components/molecules/alert/types/alertType'

export interface FetchListShiftParams extends IParams {
  search?: string
}

export type PropsTableShift = {
  limit?: number
  title?: string
  rightHeaderContent?: ReactNode
  isStripped?: boolean
  dataFetchService: (params?: FetchListShiftParams) => UseQueryResult<{
    data: any[]
    meta?: { filter_count: number }
    aggregate?: { countDistinct: string }
  }>
  columns: (DataGridProps['columns'][number] & {
    searchable?: boolean
  })[]
  hideSearchBar?: boolean
  searchText?: string
  defaultSortBy?: string
  maxWidth?: string
  width?: string
  dataKey?: string
  withOnScroll?: boolean
  rowSelection?: boolean
  countBy?: string
  persistentFilters?: boolean
}

export type Shift = {
  id: string
  name: string | null
  is_overtime: boolean
  start: string | null
  end: string | null
  status: string | null
}

export type GetTableShiftMeta = {
  filter_count: number
}

export type GetTableShiftResponse = {
  data: Shift[]
  meta: GetTableShiftMeta
}

export type AlertAtom = {
  title: string
  content: string
  size: PropsAlert['size']
  variant: PropsAlert['variant']
  pathname: string
  open: boolean
}
