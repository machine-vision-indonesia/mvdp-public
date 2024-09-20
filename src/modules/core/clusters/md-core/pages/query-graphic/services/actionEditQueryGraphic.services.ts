import client from '@/client'
import { useMutation } from '@tanstack/react-query'
import { URL_QUERY_GRAPHIC } from '../constants/ManageQueryGraphic.constants'
import { SchemaEditQueryGraphic } from '../types/ManageQueryGraphicAddPage.types'

export function useEditQueryGraphic() {
  return useMutation({
    async mutationFn(data: SchemaEditQueryGraphic) {
      return client.api.patch(`${URL_QUERY_GRAPHIC}/${data.id}`, {
        code: data.code,
        name: data.name,
        product: data.product,
        page: data.page,
        query: data.query,
        parameters: data.parameters,
        status: 'published'
      })
    }
  })
}
