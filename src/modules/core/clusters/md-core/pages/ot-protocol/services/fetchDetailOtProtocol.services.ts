import { useQuery } from '@tanstack/react-query'
import client from '@/client'
import { PREFIX_KEY } from '@/constant/common'
import { GetOtProtocolResponse, UseGetOtProtocolParams } from '../types/PageOtProtocol'
import { QUERY_KEY_OT_PROTOCOL, URL_OT_PROTOCOL } from '../constants'

export function fetchDetailOtProtocol(params: UseGetOtProtocolParams) {
  const queryParams = {
    fields: ['id', 'code', 'json_property']
  }

  const key = [PREFIX_KEY.GET, QUERY_KEY_OT_PROTOCOL, 'detail', params.id, queryParams]
  if (!params.id) return

  return useQuery({
    queryKey: key,
    async queryFn() {
      const response = await client.api.get<GetOtProtocolResponse>(`${URL_OT_PROTOCOL}/${params.id}`, {
        params: queryParams
      })

      return response.data
    }
  })
}
