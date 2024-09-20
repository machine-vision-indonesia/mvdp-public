import client from '@/client'
import { PREFIX_KEY } from '@/constant/common'
import { useQuery } from '@tanstack/react-query'
import { GetUnitResponse, GetUnitsResponse, PropsTable } from '../types/PageUnitOfMeasurement.types'

type UnitOfMeasurement = {
  id: string
  code: string
  name: string
  description?: string
  is_active: boolean
  status: string
}

type Meta = {
  filter_count: number
}

export type GetTableUnitOfMeasurementResponse = {
  meta: Meta
  data: UnitOfMeasurement[]
}

const PRIMARY_QUERY_KEY_UNIT_OF_MEASUREMENT = 'UNIT_OF_MEASUREMENT'
const URL_UNIT_OF_MEASUREMENT = '/items/mt_unit_of_measurement'

export const GetTableUnitOfMeasurements: PropsTable['dataFetchService'] = params => {
  const queryParams = {
    ...params,
    fields: ['id', 'code', 'name', 'status', 'is_active'].toString(),
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
                _icontains: params?.filterResult?.resultController?.['unit_of_measurement'] || undefined
              }
            },
            {
              code: {
                _icontains: params?.filterResult?.resultController?.['unit_of_measurement'] || undefined
              }
            }
          ]
        }
      ]
    }
  }

  return useQuery({
    queryKey: [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_UNIT_OF_MEASUREMENT, queryParams],
    async queryFn() {
      const response = await client.api.get<GetTableUnitOfMeasurementResponse>(URL_UNIT_OF_MEASUREMENT, {
        params: queryParams
      })

      return response.data
    }
  })
}

export const GetUnitByCode = (params: { code: string }) =>
  client.api.get<GetUnitsResponse>(URL_UNIT_OF_MEASUREMENT, {
    params: {
      filter: {
        code: {
          _eq: params.code
        }
      },
      fields: ['id']
    }
  })

export function useGetUnit(params: { id: string }) {
  const queryParams = {
    fields: ['id', 'name', 'code', 'description', 'status', 'is_active']
  }

  const key = [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_UNIT_OF_MEASUREMENT, 'detail', params.id, queryParams]

  return useQuery({
    queryKey: key,
    async queryFn() {
      const response = await client.api.get<GetUnitResponse>(`${URL_UNIT_OF_MEASUREMENT}/${params.id}`, {
        params: queryParams
      })

      return response.data
    }
  })
}
