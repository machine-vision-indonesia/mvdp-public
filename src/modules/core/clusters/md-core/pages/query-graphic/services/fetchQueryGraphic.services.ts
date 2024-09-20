import client from '@/client'
import { PREFIX_KEY } from '@/constant/common'
import { useQuery } from '@tanstack/react-query'
import {
  GetByCodeParams,
  GetQueryGraphicResponse,
  GetQueryGraphicsResponse,
  GetTableQueryGraphicsResponse,
  PropsTable,
  UseGetQueryGraphicParams
} from '../types/ManageQueryGraphicPage.types'
import { PRIMARY_QUERY_KEY_GRAPHIC_QUERY, URL_QUERY_GRAPHIC } from '../constants/ManageQueryGraphic.constants'

export const GetTableQueryGraphics: PropsTable['dataFetchService'] = params => {
  const queryParams = {
    ...params,
    fields: ['id', 'code', 'product', 'page', 'name', 'query', 'parameters'].toString(),
    filter: {
      _and: [
        {
          status: {
            _eq: 'published'
          }
        },
        params?.filter,
        {
          _or: [
            {
              name: {
                _icontains: params?.filterResult?.resultController?.['query graphic']
              }
            },
            {
              code: {
                _icontains: params?.filterResult?.resultController?.['query graphic']
              }
            }
          ]
        }
      ]
    }
  }

  return useQuery({
    queryKey: [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_GRAPHIC_QUERY, queryParams],
    async queryFn() {
      const response = await client.api.get<GetTableQueryGraphicsResponse>(URL_QUERY_GRAPHIC, {
        params: queryParams
      })

      return response.data
    }
  })
}

export function useGetQueryGraphic(params: UseGetQueryGraphicParams) {
  const queryParams = {
    fields: ['id', 'code', 'product', 'page', 'name', 'query', 'parameters']
  }

  const key = [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_GRAPHIC_QUERY, 'detail', params.id, queryParams]

  return useQuery({
    queryKey: key,
    async queryFn() {
      const response = await client.api.get<GetQueryGraphicResponse>(`${URL_QUERY_GRAPHIC}/${params.id}`, {
        params: queryParams
      })

      return response.data
    }
  })
}

export const GetQueryGraphicByCode = (params: GetByCodeParams) =>
  client.api.get<GetQueryGraphicsResponse>(URL_QUERY_GRAPHIC, {
    params: {
      filter: {
        code: {
          _eq: params.code
        },
        status: {
          _eq: 'published'
        }
      },
      fields: ['id']
    }
  })
