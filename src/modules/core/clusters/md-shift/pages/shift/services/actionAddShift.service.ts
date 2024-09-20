import { useMutation } from '@tanstack/react-query'
import { SchemaAddShift } from '../types/FormAddShift.type'
import client from '@/client'
import { URL_SHIFT } from '../constants/common'

export const addShiftService = () => {
  return useMutation({
    async mutationFn(payload: SchemaAddShift) {
      return client.api.post(URL_SHIFT, {
        ...payload
      })
    }
  })
}
