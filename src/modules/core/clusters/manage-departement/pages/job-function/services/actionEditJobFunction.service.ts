import client from '@/client'
import { useMutation } from '@tanstack/react-query'
import { SchemaEditJobFunction } from '../types/ManageJobFunction.types'

const URL = '/items/mt_job_functions'

export function useEditJobFunction() {
  return useMutation({
    async mutationFn(data: SchemaEditJobFunction) {
      return client.api.patch(`${URL}/${data.id}`, {
        code: data.code,
        name: data.name,
        work_center: data.work_center.id,
        sto: data.department.id,
        job_level: data.job_level.id,
        description: data.description || null,
        role: data.role.id,
        status: 'published'
      })
    }
  })
}
