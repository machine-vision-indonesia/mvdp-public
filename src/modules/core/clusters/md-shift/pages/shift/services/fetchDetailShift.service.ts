import client from '@/client'
import { useQuery } from '@tanstack/react-query'
import { PREFIX_KEY } from '@/constant/common'
import { PRIMARY_QUERY_KEY_SHIFT, URL_SHIFT } from '../constants/common'
import { FetchDetailShiftParams } from '../types/PageDetailShift.type'

export const getDetailShiftService = (params?: FetchDetailShiftParams) => {
  if (!params?.id) return

  const queryKeys = [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_SHIFT, params?.id]

  return useQuery({
    queryKey: queryKeys,
    async queryFn() {
      const response = await client.api.get(`${URL_SHIFT}/${params?.id}`)

      return response.data
    }
  })
}
