import { useMutation } from '@tanstack/react-query'
import { SchemaAddUnit } from '../types/PageUnitOfMeasurement.types'
import client from '@/client'

const URL_UNIT_OF_MEASUREMENT = '/items/mt_unit_of_measurement'

export function useAddUnitOfMeasurement() {
  return useMutation({
    async mutationFn(data: SchemaAddUnit) {
      return client.api.post(URL_UNIT_OF_MEASUREMENT, {
        code: data.code,
        name: data.name,
        description: data.description,
        status: 'published'
      })
    }
  })
}
