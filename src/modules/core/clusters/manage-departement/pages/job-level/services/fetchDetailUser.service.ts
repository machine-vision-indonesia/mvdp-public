import { useQuery } from '@tanstack/react-query'
import client from 'src/client'

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
