import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import client from '@/client'
import { PREFIX_KEY } from '@/constant/common'
import { FetchListShiftParams, GetTableShiftResponse, PropsTableShift } from '../types/PageShift.type'
import { PRIMARY_QUERY_KEY_PLANT, PRIMARY_QUERY_KEY_SHIFT, URL_PLANT, URL_SHIFT } from '../constants/common'
import { FetchListPlantParams } from '../types/FormAddShift.type'
import { GetSelectResponse } from '@/components/molecules/select-async'

const renderListShiftParams = (params: FetchListShiftParams) => {
  return {
    ...params,
    fields: ['id', 'name', 'is_overtime', 'start', 'end', 'status'].toString(),
    sort: ['id'].toString()
    // filter: {
    //   _and: [
    //     params?.filter,
    //     {
    //       _and: [
    //         {
    //           sto: {
    //             _in: params?.filterResult?.resultController?.['sto.name']?.[0]?.id ?? undefined
    //           }
    //         }
    //       ]
    //     },
    //     {
    //       _or: [
    //         {
    //           profile: {
    //             full_name: {
    //               _icontains: params?.filterResult?.resultController?.['profile.full_name']
    //             }
    //           }
    //         }
    //       ]
    //     }
    //   ]
    // },
    // deep: {
    //   profile: {
    //     _filter: {
    //       status: {
    //         _eq: 'published'
    //       }
    //     }
    //   },
    //   werk: {
    //     _filter: {
    //       status: {
    //         _eq: 'published'
    //       }
    //     }
    //   },
    //   sto: {
    //     _filter: {
    //       status: {
    //         _eq: 'published'
    //       }
    //     }
    //   }
    // }
  }
}

const renderListPlantParams = (params: FetchListPlantParams, pageParam?: object) => {
  return {
    ...params,
    page: pageParam,
    search: params?.search,
    limit: params?.limit || 10, // Set default limit if not provided
    fields: ['id', 'name', 'code', 'company_id'],
    meta: ['total_count', 'filter_count', 'current_page', 'limit', 'total_page']
  }
}

export const getListShiftService: PropsTableShift['dataFetchService'] = (params?: FetchListShiftParams) => {
  const queryKeys = [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_SHIFT, params ? renderListShiftParams(params) : {}]

  return useQuery({
    queryKey: queryKeys,
    async queryFn() {
      const response = await client.api.get<GetTableShiftResponse>(URL_SHIFT, {
        params: params ? renderListShiftParams(params) : {}
      })

      return response.data
    }
  })
}

export const getListShiftPlantService = (params?: FetchListPlantParams): any => {
  const queryKeys = [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_PLANT, params ? renderListPlantParams(params) : {}]

  return useInfiniteQuery<GetSelectResponse, Error>({
    queryKey: queryKeys,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const currPageParam = pageParam || 1
      const queryParams = params ? renderListPlantParams(params, currPageParam) : {}

      const response = await client.api.get<GetSelectResponse>(URL_PLANT, {
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
