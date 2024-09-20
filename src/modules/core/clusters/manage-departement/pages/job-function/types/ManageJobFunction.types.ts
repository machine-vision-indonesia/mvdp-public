import * as yup from 'yup'
import { schemaAddJobFunction } from '../validations'
import { ReactNode } from 'react'
import { type IParams } from 'src/types/master/filter'
import { UseQueryResult } from '@tanstack/react-query'
import { DataGridProps } from '@mui/x-data-grid'

export type SchemaAddJobFunction = yup.InferType<typeof schemaAddJobFunction>
export type SchemaEditJobFunction = yup.InferType<typeof schemaAddJobFunction> & {
  id: string
}

export type SchemaAddRole = {
  code: string
  name: string
  work_center: string
  description?: string
  status: string
}

export type Data = {
  id: string
}
type Role = {
  id: string
  name: string
}

export type GetRolesResponse = {
  data: Role[]
}

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

type Options = {
  id: string
  label: string
}

export type EditJobFunctionField = {
  name: string
  code: string
  department: Options | null
  job_level: Options | null
  description: string | null
  set_is_active: boolean
  role?: Options //TODO: fix this if Job Function API included role property
}

export interface AddJobFunctionFormProps {
  form: any
  pages?: 'add' | 'edit'
  fields?: EditJobFunctionField
}

type JobFunction = {
  id: string
}

export type GetJobFunctionsResponse = {
  data: JobFunction[]
}

export type GetByCodeParams = {
  code: string
}
