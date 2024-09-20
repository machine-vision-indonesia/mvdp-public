import client from '@/client'
import { useMutation } from '@tanstack/react-query'
import { AddEditRole } from '../validations'

export const useUpdateRole = (id: string | undefined) => {
  return useMutation({
    async mutationFn(data: AddEditRole) {
      return client.api.patch(`/items/mt_roles/${id}`, {
        description: data.description,
        code: data.code,
        name: data.name,
        parent: data.parent?.id
      })
    }
  })
}
