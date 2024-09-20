import client from '@/client'
import { useMutation } from '@tanstack/react-query'
import { SchemaAddJobFunction } from '../types/ManageJobFunction.types'

const URL = '/items/mt_job_functions'
const URL_ROLES = '/items/mt_roles'

export function useAddJobFunction() {
  return useMutation({
    async mutationFn(data: SchemaAddJobFunction) {
      return client.api.post(URL, {
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

export function useAddRole() {
  return useMutation({
    async mutationFn(data: SchemaAddJobFunction) {
      return client.api.post(URL_ROLES, {
        code: data.role_code,
        name: data.role_name,
        work_center: data.role_work_center.id,
        description: data.role_description || null,
        status: 'published'
      })
    }
  })
}
