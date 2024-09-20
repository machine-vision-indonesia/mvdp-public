import client from '@/client'
import { useMutation } from '@tanstack/react-query'

const URL_UNIT_OF_MEASUREMENT = '/items/mt_unit_of_measurement'

export function useDeleteUnitOfMeasurement() {
  return useMutation({
    async mutationFn(data: { id: string }) {
      return client.api.patch(`${URL_UNIT_OF_MEASUREMENT}/${data.id}`, {
        status: 'archived'
      })
    }
  })
}
