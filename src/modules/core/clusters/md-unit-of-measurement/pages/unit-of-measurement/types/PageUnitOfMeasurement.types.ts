import * as yup from 'yup'
import { schemaAddUnit } from '../validations'
import { IParams } from '@/types/master/filter'
import { UseQueryResult } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { DataGridProps } from '@mui/x-data-grid'
import { PropsAlert } from '@/components/molecules/alert/types/alertType'

export type SchemaAddUnit = yup.InferType<typeof schemaAddUnit>
export type SchemaEditUnit = yup.InferType<typeof schemaAddUnit> & { id: string }

export interface FetchParameters extends IParams {
  search?: string
  filterResult?: any
}

export type DropdownMultipleFilter = {
  type: 'dropdown-multiple'
  name: string
  labelKey: string
  field: string
  dataFetchService: () => UseQueryResult<{ data: any[] }>
}

type DateFilter = {
  type: 'date'
  name: string
  field: string
}

type Filter = DropdownMultipleFilter | DateFilter

export type PropsTable = {
  limit?: number
  title?: string
  rightHeaderContent?: ReactNode
  isStripped?: boolean
  dataFetchService: (params?: FetchParameters) => UseQueryResult<{
    data: any[]
    meta?: { filter_count: number }
    aggregate?: { countDistinct: string }
  }>
  filters?: Filter[]
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

export type AlertAtom = {
  title: string
  content: string
  size: PropsAlert['size']
  variant: PropsAlert['variant']
  pathname: string
  open: boolean
}

export type Unit = {
  id: string
  code: string
  name: string
  description?: string
  is_active: boolean
  status: string
}

export type GetUnitsResponse = {
  data: Unit[]
}

export type GetUnitResponse = {
  data: Unit
}
