import client from '@/client'
import { useMutation } from '@tanstack/react-query'
import { URL_QUERY_GRAPHIC } from '../constants/ManageQueryGraphic.constants'

export function useDeleteQueryGraphic() {
  return useMutation({
    async mutationFn(data: { id: string }) {
      return client.api.patch(`${URL_QUERY_GRAPHIC}/${data.id}`, {
        status: 'archived'
      })
    }
  })
}
