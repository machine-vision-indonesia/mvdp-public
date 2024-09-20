import { useMutation } from '@tanstack/react-query'
import { SchemaEditUnit } from '../types/PageUnitOfMeasurement.types'
import client from '@/client'

const URL_UNIT_OF_MEASUREMENT = '/items/mt_unit_of_measurement'

export function useEditUnitOfMeasurement() {
  return useMutation({
    async mutationFn(data: SchemaEditUnit) {
      return client.api.patch(`${URL_UNIT_OF_MEASUREMENT}/${data.id}`, {
        code: data.code,
        name: data.name,
        description: data.description,
        is_active: data.is_active,
        status: 'published'
      })
    }
  })
}
