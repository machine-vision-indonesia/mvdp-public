import { UseQueryOptions } from '@tanstack/react-query'

export type Params = Pick<UseQueryOptions, 'enabled'> & {
  id: string | null
}

// type Sto = {
//   name: string
//   id: string
// }

// type Werk = {
//   name: string
//   id?: string
// }

type DepartmentLevel = {
  id: string
  name: string
}

type Data = {
  id: string
  code: string
  name: string
  // work_center: Werk
  // parent: Parent
  department_level: DepartmentLevel
  description?: string
}

export type GetDepartmentResponse = {
  data: Data
}
