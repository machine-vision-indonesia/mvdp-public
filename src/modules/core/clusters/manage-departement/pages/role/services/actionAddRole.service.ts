import client from '@/client'
import { useMutation } from '@tanstack/react-query'
import { AddEditRole } from '../validations'

export const usePostRole = () => {
  return useMutation({
    async mutationFn(data: AddEditRole) {
      return client.api.post('/items/mt_roles', {
        description: data.description,
        code: data.code,
        name: data.name,
        parent: data.parent?.id,
        status: 'published'
      })
    }
  })
}
