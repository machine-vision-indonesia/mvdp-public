import * as yup from 'yup'
import { schemaAddDepartment } from '../validations'
import { DepartmentLevel, Parent } from '../services/fetchDepartment.service'

// type Werk = {
//   name: string
// }

// type Sto = {
//   name: string
// }

export type SchemaAddDepartment = yup.InferType<typeof schemaAddDepartment>

export type EditDepartmentField = {
  // work_center?: Werk | null
  name: string
  code: string
  parent: Parent | null
  department_level: DepartmentLevel
  description: string | null
  set_is_active: boolean
}

export interface AddDepartmentFormProps {
  form: any
  pages?: 'add' | 'edit'
  fields?: EditDepartmentField
}
