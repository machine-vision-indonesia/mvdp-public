import client from '@/client'
import { useMutation } from '@tanstack/react-query'

type Data = {
  id: string
}

export function useDeleteDepartment() {
  return useMutation({
    async mutationFn(data: Data) {
      return client.api.patch(`/items/mt_departments/${data.id}`, {
        status: 'archived'
      })
    }
  })
}
