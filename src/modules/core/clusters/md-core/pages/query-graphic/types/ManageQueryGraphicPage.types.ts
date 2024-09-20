import { IParams } from '@/types/master/filter'
import { DataGridProps } from '@mui/x-data-grid'
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { ReactNode } from 'react'

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

export type QueryGraphic = {
  id: string
  code: string
  product: string
  page: string
  name: string
  query: string
  parameters: string
}

type Meta = {
  filter_count: number
}

export type GetTableQueryGraphicsResponse = {
  meta: Meta
  data: QueryGraphic[]
}

export type GetQueryGraphicResponse = {
  data: QueryGraphic
}

export type GetQueryGraphicsResponse = {
  data: QueryGraphic[]
}

export type UseGetQueryGraphicParams = Pick<UseQueryOptions, 'enabled'> & {
  id: string
}

export interface SectionProps {
  title: string
  fields: Array<{
    label: string
    value: string | string[] | undefined
    flexBasis?: string
  }>
  renderEditButton?: ReactNode
}

export type GetByCodeParams = {
  code: string
}
