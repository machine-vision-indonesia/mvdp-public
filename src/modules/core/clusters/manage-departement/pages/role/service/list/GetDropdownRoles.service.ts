import { FetchParameters, GetSelectResponse } from '@/components/molecules/select-async'
import { useInfiniteQuery } from '@tanstack/react-query'
import client from 'src/client'
import { PREFIX_KEY } from 'src/constant/common'

export const PRIMARY_QUERY_KEY = 'ROLES'
const URL = '/items/mt_roles'

export const GetDropdownRoles = (params?: FetchParameters) => {
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
