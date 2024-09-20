import client from '@/client'
import { useMutation } from '@tanstack/react-query'
import { Data } from '../types/ManageJobFunction.types'

export function useDeleteJobFunction() {
  return useMutation({
    async mutationFn(data: Data) {
      return client.api.patch(`/items/mt_job_functions/${data.id}`, {
        status: 'archived'
      })
    }
  })
}
