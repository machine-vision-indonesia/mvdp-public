import * as yup from 'yup'
import { schemaAddJobLevel } from '../validations'
import { ReactNode } from 'react'
import { type DataGridProps } from '@mui/x-data-grid'
import { type UseQueryResult } from '@tanstack/react-query'
import { type IParams } from 'src/types/master/filter'

export type DepartmentDropdown = {
  id: string
  name: string
}

export type GetDepartmentsResponse = {
  data: DepartmentDropdown[]
}

export type GetDepartmentsParamsParams = {
  search: string
}

export type Params = {
  search?: string
  enabled?: boolean
  id?: string
}

export type Data = {
  id: string
}

export type Department = {
  id: number
  name: string
}

export type GetDropdownDepartmentsResponse = {
  data: Department[]
}

type Werk = {
  name: string
}

type Sto = {
  name: string
}

export type SchemaAddJobLevel = yup.InferType<typeof schemaAddJobLevel>

// TODO: adjust the type if job level api is ready
export type EditJobLevelField = {
  code: string
  job_level_name: string
  work_center?: Werk | null
  department?: Sto | null
  job_function?: JobFunction | null
  description: string | undefined
  set_is_active: boolean
}

export interface AddJobLevelProps {
  form: any
  pages?: 'add' | 'edit'
  fields?: EditJobLevelField
}

type WorkCenter = {
  id: string
  name: string
}

export type GetWorkCentersResponse = {
  data: WorkCenter[]
}

type JobLevel = {
  name: string
}

type JobFunction = {
  id: string
  name: string
  job_level: JobLevel
}

export type GetJobFunctionsResponse = {
  data: JobFunction[]
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

export type FilterType = Filter['type']

export interface SectionProps {
  title: string
  fields: Array<{
    label: string
    value: string | string[] | undefined
  }>
  renderEditButton?: ReactNode
}
