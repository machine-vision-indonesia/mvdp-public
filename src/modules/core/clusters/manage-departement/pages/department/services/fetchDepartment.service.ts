import { useInfiniteQuery, useQuery, UseQueryOptions } from '@tanstack/react-query'
import client from 'src/client'
import { type PropsTable } from 'src/components/molecules/table-async/TableAsync.type'
import { PREFIX_KEY } from 'src/constant/common'
import { PRIMARY_QUERY_KEY_DEPARTMENTS } from '../constants/ManageDepartmentPage.constants'
import { FetchParameters, GetSelectResponse } from '@/components/molecules/select-async'

export type Parent = {
  name: string
}

type Department = {
  id: string
  code: string
  name: string
  parent?: Parent
}

type Meta = {
  filter_count: number
}

export type GetTableDepartmentsResponse = {
  meta: Meta
  data: Department[]
}

const URL = '/items/mt_departments'

export const GetTableDepartments: PropsTable['dataFetchService'] = params => {
  const queryParams = {
    ...params,
    fields: ['id', 'code', 'name', 'parent.name'].toString(),
    filter: {
      _and: [
        {
          status: {
            _eq: 'published'
          }
        },
        params?.filter
      ]
    },
    deep: {
      parent: {
        _filter: {
          status: {
            _eq: 'published'
          }
        }
      }
    }
  }

  return useQuery({
    queryKey: [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_DEPARTMENTS, queryParams],
    async queryFn() {
      const response = await client.api.get<GetTableDepartmentsResponse>(URL, {
        params: queryParams
      })

      return response.data
    }
  })
}

export const fetchListDepartment = (params?: FetchParameters): any => {
  return useInfiniteQuery<GetSelectResponse, Error>({
    queryKey: ['DEPARTMENT', params],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = {
        ...params,
        page: pageParam,
        search: params?.search || undefined,
        limit: params?.limit || 10, // Set default limit if not provided
        fields: ['id', 'name'],
        meta: ['total_count', 'filter_count', 'current_page', 'limit', 'total_page']
      }

      const response = await client.api.get<GetSelectResponse>('/items/mt_departments', {
        params: queryParams
      })

      return response.data
    },
    getNextPageParam: lastPage => {
      const nextPage = (lastPage.meta?.current_page ?? 1) + 1
      return nextPage <= (lastPage.meta?.total_page ?? 1) ? nextPage : undefined
    }
  })
}

export type DepartmentLevel = {
  id: string
  name: string
}

type Data = {
  id: string
  name: string
  code: string
  parent: Parent | null
  department_level: DepartmentLevel
  description: string | null
}

type GetDepartmentResponse = {
  data: Data
}

type UseGetDepartmentParams = Pick<UseQueryOptions, 'enabled'> & {
  id: string
}

export function useGetDepartment(params: UseGetDepartmentParams) {
  const queryParams = {
    fields: [
      'id',
      'name',
      'code',
      'parent.id',
      'parent.name',
      'department_level.id',
      'department_level.name',
      'description'
    ]
  }

  const key = [PREFIX_KEY.GET, 'DEPARTMENTS', 'detail', params.id, queryParams]

  return useQuery({
    queryKey: key,
    async queryFn() {
      const response = await client.api.get<GetDepartmentResponse>(`/items/mt_departments/${params.id}`, {
        params: queryParams
      })

      return response.data
    }
  })
}
