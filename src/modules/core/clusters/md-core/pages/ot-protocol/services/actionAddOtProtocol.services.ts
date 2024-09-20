import { useMutation } from '@tanstack/react-query'
import { SchemaAddOtProtocol } from '../types/PageOtProtocol'
import client from '@/client'
import { URL_OT_PROTOCOL } from '../constants'

export function actionAddOtProtocol() {
  return useMutation({
    async mutationFn(data: SchemaAddOtProtocol) {
      return client.api.post(URL_OT_PROTOCOL, {
        ...data,
        status: 'published'
      })
    }
  })
}
