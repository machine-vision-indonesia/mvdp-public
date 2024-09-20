import { useMutation } from '@tanstack/react-query'
import { SchemaAddQueryGraphic } from '../types/ManageQueryGraphicAddPage.types'
import client from '@/client'
import { URL_QUERY_GRAPHIC } from '../constants/ManageQueryGraphic.constants'

export function useAddQueryGraphic() {
  return useMutation({
    async mutationFn(data: SchemaAddQueryGraphic) {
      return client.api.post(URL_QUERY_GRAPHIC, {
        ...data,
        status: 'published'
      })
    }
  })
}
