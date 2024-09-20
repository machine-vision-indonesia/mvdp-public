import client from '@/client'
import { PREFIX_KEY } from '@/constant/common'
import { useQuery } from '@tanstack/react-query'
import {
  GetOtProtocolResponse,
  GetTableOtProtocolResponse,
  PropsTable,
  UseGetOtProtocolParams
} from '../types/PageOtProtocol'
import { QUERY_KEY_OT_PROTOCOL, URL_OT_PROTOCOL } from '../constants'

export const fetchTableOtProtocol: PropsTable['dataFetchService'] = params => {
  const queryParams = {
    ...params,
    fields: ['id', 'code', 'json_property'].toString(),
    filter: {
      _and: [
        params?.filter,
        {
          _or: [
            {
              code: {
                _icontains: params?.filterResult?.resultController?.['OT Protocol'] || undefined
              }
            },
            {
              json_property: {
                _icontains: params?.filterResult?.resultController?.['OT Protocol'] || undefined
              }
            }
          ]
        }
      ]
    }
  }

  return useQuery({
    queryKey: [PREFIX_KEY.GET, QUERY_KEY_OT_PROTOCOL, queryParams],
    async queryFn() {
      const response = await client.api.get<GetTableOtProtocolResponse>(URL_OT_PROTOCOL, {
        params: queryParams
      })

      return response.data
    }
  })
}
