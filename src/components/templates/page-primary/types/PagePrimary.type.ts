import { buttonVariant } from '@/components/atoms/button'
import { IResultController } from '@/components/molecules/filter/types/filter.types'
import { ConfirmationStatus } from '@/components/molecules/modal'
import { type DataGridProps, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { type UseQueryResult } from '@tanstack/react-query'
import { Dispatch, ReactNode, SetStateAction } from 'react'
import { type IParams } from 'src/types/master/filter'
import * as yup from 'yup'

export type Gender = {
  id: string
  label: string
}

export type Religion = {
  id: string
  label: string
}

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

type Profile = {
  id_number: string
  full_name: string
}

type Werk = {
  name: string
}

type Sto = {
  name: string
}

type User = {
  id: string
  email: string | null
  is_verified: boolean
  profile: Profile | null
  werk: Werk | null
  sto: Sto | null
}

type GetTableUsersMeta = {
  filter_count: number
}

export type GetTableUsersResponse = {
  data: User[]
  meta: GetTableUsersMeta
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

export type ResetPasswordData = Pick<GetTableUsersResponse['data'][number], 'id' | 'email'>

type DirectusRole = {
  id: string
}

export type GetAdministatorIdResponse = {
  data: DirectusRole[]
}

export interface UserStepOneProps {
  form: any
  roleOptions: any[]
  workCenters: any
  departmentOptions: any[]
  jobFunctionOptions: any[]
  watchDepartment: any
  watchJobFunction: any
  pages?: 'add' | 'edit'
}

export interface AddUserStepTwoProps {
  form: any
  genders: { label: string; id: string }[]
  religions: { label: string; id: string }[]
  pages?: 'add' | 'edit'
}

export interface ProfileSummaryProps {
  coverPreviewString?: any
  photoPreviewString?: any
  fullName: string
  watchEmail: string
  watchAddress?: string
  watchRoles: { label: string }[]
  watchWorkCenter: { label: string }
  watchDepartment: { label: string }
  watchJobFunction: { label: string }
  watchJobLevel: string
  watchJobTitle: string
  watchIdNumber: string
  watchFirstName: string
  watchLastName: string
  watchGenderLabel: string
  watchReligionLabel: string
  watchPhone?: string
  watchPostCode?: string
}

export interface SectionProps {
  title: string
  fields: Array<{
    label: string
    value: string | string[] | undefined
  }>
  renderEditButton?: ReactNode
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

export interface ActionItem {
  label: string
  icon?: string
  color?: string
  action?: () => Promise<void> | void
  renderContent?: (() => ReactNode) | ReactNode
  modalProps?: {
    title?: string
    variant?: 'default' | 'feedback' | 'confirmation' | undefined
    positiveLabel?: string
    negativeLabel?: string
    renderAction?: boolean
    status?: ConfirmationStatus
    description?: string
    onClick?: any
    isLoading?: boolean
    disabled?: boolean
    onClose?: any
  }
  isLink?: boolean
  href?: string
}

export interface ActionButtonProps {
  items: ActionItem[]
  onActionComplete?: () => void
  triggerIcon?: string
  triggerColor?: string
  currentAction?: ActionItem | null
  setCurrentAction?: Dispatch<SetStateAction<ActionItem | null>>
}

export interface DynamicTableProps<T> {
  columns: GridColDef[]
  dataFetchService: any
  filters: IResultController[]
  renderActionButton: (params: GridRenderCellParams<any>) => ReactNode | ReactNode
  isCollapsed?: boolean
  groupFieldKeyTitle?: string
  groupName?: string
}

interface ModalProps {
  variant?: 'default' | 'feedback' | 'confirmation' | undefined
  positiveLabel?: string
  negativeLabel?: string
  title?: string
  description?: string
  renderAction?: boolean
  onClose?: () => void
  onOk?: () => void
  loading?: boolean
  disabled?: boolean
}

export interface PagePrimaryProps<T> {
  title: string
  action?: {
    label: string
    href?: string
    modalContent?: ReactNode
    modalProps?: ModalProps
    content?: 'iconText' | 'iconOnly' | 'textOnly'
    icon?: string
    variant?: buttonVariant
    loading?: boolean
    disabled?: boolean
  }
  columns: GridColDef[]
  dataFetchService: any
  filters: any
  renderActionButton: (params: GridRenderCellParams<any>) => ReactNode
  modalOpen?: boolean
  setModalOpen?: any
  renderTopBarAction?: ReactNode
  isCollapsed?: boolean
  groupFieldKeyTitle?: string
  groupName?: string
}

export const schemaImportExcel = yup.object().shape({
  file: yup.mixed().required('File is required')
})

export type SchemaImportExcel = yup.InferType<typeof schemaImportExcel>
