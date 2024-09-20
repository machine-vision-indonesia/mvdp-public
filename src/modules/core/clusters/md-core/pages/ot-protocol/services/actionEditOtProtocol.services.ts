import client from '@/client'
import { useMutation } from '@tanstack/react-query'
import { SchemaAddOtProtocol } from '../types/PageOtProtocol'
import { URL_OT_PROTOCOL } from '../constants'

export function actionEditOtProtocol() {
  return useMutation({
    async mutationFn(data: SchemaAddOtProtocol) {
      return client.api.patch(`${URL_OT_PROTOCOL}/${data.id}`, {
        code: data.code,
        json_property: data.json_property,
        status: 'published'
      })
    }
  })
}
