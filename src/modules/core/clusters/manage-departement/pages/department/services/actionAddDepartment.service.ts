import client from '@/client'
import { useMutation } from '@tanstack/react-query'
import { SchemaAddDepartment } from '../types/ManageDepartmentPage.types'

export function useAddDepartment() {
  return useMutation({
    async mutationFn(data: SchemaAddDepartment) {
      type Company = {
        id: string
      }

      type GetCompanyResponse = {
        data: Company[]
      }

      const response = await client.api.get<GetCompanyResponse>('/items/mt_companies', {
        params: {
          filter: {
            code: {
              _eq: 'LANIUS'
            }
          },
          fields: ['id'].toString(),
          limit: 1
        }
      })

      if (!response.data.data.length) {
        throw new Error('Company not found')
      }

      return client.api.post('/items/mt_departments', {
        parent: data.parent?.id ?? null,
        code: data.code,
        department_level: data.level.id,
        name: data.name,
        description: data.description || null,
        company: response.data.data[0].id,
        status: 'published'
      })
    }
  })
}
