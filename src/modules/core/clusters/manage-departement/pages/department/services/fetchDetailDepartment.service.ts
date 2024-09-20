import { useQuery } from '@tanstack/react-query'
import client from 'src/client'
import { PREFIX_KEY } from 'src/constant/common'

const departmentsQueryParams = {
  fields: ['id', 'name'],
  limit: -1,
  sort: 'name',
  filter: {
    status: {
      _eq: 'published'
    }
  }
}

const departmentLevelQueryParams = {
  fields: ['id', 'name'],
  sort: ['name', 'id'],
  limit: 10,
  filter: {
    status: {
      _eq: 'published'
    }
  }
}

export function useListDepartment() {
  return useQuery({
    queryKey: ['departments', 'list', departmentsQueryParams], // TODO: Pindah ke query-keys.ts
    async queryFn() {
      type Department = {
        id: string
        name: string
      }

      type GetDepartmentsResponse = {
        data: Department[]
      }

      const response = await client.api.get<GetDepartmentsResponse>('/items/mt_departments', {
        params: departmentsQueryParams
      })

      return response.data
    }
  })
}

export function useListDepartmentLevel() {
  return useQuery({
    queryKey: [PREFIX_KEY.GET, 'DEPARTMENT_LEVELS', departmentLevelQueryParams],
    async queryFn() {
      type DepartmentLevel = {
        id: string
        name: string
      }

      type GetDepartmentLevelsResponse = {
        data: DepartmentLevel[]
      }
      const response = await client.api.get<GetDepartmentLevelsResponse>('/items/mt_department_levels', {
        params: departmentLevelQueryParams
      })

      return response.data
    }
  })
}
