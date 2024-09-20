import client from '@/client'
import { useMutation } from '@tanstack/react-query'
import { URL_OT_PROTOCOL } from '../constants'

export function actionDeleteOtProtocol() {
  return useMutation({
    async mutationFn(data: { id: string }) {
      return client.api.delete(`${URL_OT_PROTOCOL}`, {
        data: [data.id]
      })
    }
  })
}
