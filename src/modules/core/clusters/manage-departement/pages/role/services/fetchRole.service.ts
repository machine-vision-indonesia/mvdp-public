import { FetchParameters, GetSelectResponse } from '@/components/molecules/select-async'
import { useInfiniteQuery, useQuery, UseQueryOptions } from '@tanstack/react-query'
import client from 'src/client'
import { PREFIX_KEY } from 'src/constant/common'

export const PRIMARY_QUERY_KEY = 'ROLES'
const URL = '/items/mt_roles'

export const fetchListRole = (params?: FetchParameters) => {
  return useInfiniteQuery<GetSelectResponse, Error>({
    queryKey: [PREFIX_KEY.GET, PRIMARY_QUERY_KEY, params],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = {
        ...params,
        page: pageParam,
        search: params?.search || undefined,
        limit: params?.limit || 10,
        fields: ['id', 'name', 'parent.name'],
        meta: ['total_count', 'filter_count', 'current_page', 'limit', 'total_page']
      }

      const response = await client.api.get<GetSelectResponse>(URL, {
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

type ParentRole = {
  id: string
  name: string
}

type Data = {
  id: string
  code: string
  name: string
  is_active: boolean
  description: string
  parent: ParentRole
}

type GetRoleResponse = {
  data: Data
}

type UseGetRoleParams = Pick<UseQueryOptions, 'enabled'> & {
  id: string
}

export function useGetRole(params: UseGetRoleParams) {
  const queryParams = {
    fields: ['id', 'name', 'code', 'parent.id', 'parent.name', 'description', 'is_active']
  }

  const key = [PREFIX_KEY.GET, 'ROLES', 'detail', params.id, queryParams]

  return useQuery({
    queryKey: key,
    async queryFn() {
      const response = await client.api.get<GetRoleResponse>(`/items/mt_roles/${params.id}`, {
        params: queryParams
      })

      return response.data
    }
  })
}
