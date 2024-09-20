import { useMutation } from '@tanstack/react-query'
import { CapabilityCreateData, ClusterSchema, ModuleSchema, PageSchema } from '../types/ManageModulePage.types'
import client from '@/client'
import Module from 'module'
import { type Module as CurrentUserModule } from 'src/types/directus/current-user'
import { Status } from '@/types/directus/general'

export const useCapabilitiesMutation = () => {
  return useMutation({
    mutationFn: async (capabilities: CapabilityCreateData[]) => client.api.post('/items/mt_capabilities', capabilities)
  })
}

export const useCreateClusterMutation = () => {
  return useMutation({
    mutationFn: async (
      data: ClusterSchema & {
        module: Module['id']
        order: CurrentUserModule['clusters'][number]['order']
        status: Status
      }
    ) =>
      client.api.post('/items/mt_clusters', {
        ...data,
        is_active: true
      })
  })
}

export const useCreatePageMutation = () => {
  return useMutation({
    mutationFn: async (
      data: Omit<PageSchema, 'products' | 'is_main_page'> & {
        products: {
          product: PageSchema['products'][number]['id']
          status: Status
        }[]
        cluster: CurrentUserModule['clusters'][number]['id'] | null
        order: CurrentUserModule['clusters'][number]['pages'][number]['order']
        status: Status
      }
    ) =>
      client.api.post('/items/mt_pages', data, {
        params: {
          fields: ['id']
        }
      })
  })
}

export const useCreateModuleMutation = () => {
  return useMutation({
    mutationFn: async (
      newModule: ModuleSchema &
        Pick<CurrentUserModule, 'order'> & {
          status: Status
        }
    ) => client.api.post('/items/mt_modules', newModule)
  })
}

export const useCreateCapabilities = () => {
  return useMutation({
    mutationFn: async (capabilities: CapabilityCreateData[]) => client.api.post('/items/mt_capabilities', capabilities)
  })
}
