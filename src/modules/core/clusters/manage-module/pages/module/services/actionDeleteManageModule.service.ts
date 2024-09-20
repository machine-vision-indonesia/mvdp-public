import { useMutation } from '@tanstack/react-query'
import { Capability, Cluster, Page } from '../types/ManageModulePage.types'
import client from '@/client'
import Module from 'module'
import { Status } from '@/types/directus/general'

export function useDeleteCapabilities() {
  return useMutation({
    mutationFn: async (ids: Capability['id'][]) => client.api.delete('/items/mt_capabilities', { data: ids })
  })
}

export function useDeleteModuleMutation() {
  return useMutation({
    mutationFn: async (id: Module['id']) => {
      return client.api.patch(`/items/mt_modules/${id}`, {
        status: 'archived'
      })
    }
  })
}

export function useDeleteClusterMutation() {
  return useMutation({
    mutationFn: async (id: Cluster['id']) => {
      return client.api.patch(`/items/mt_clusters/${id}`, {
        status: 'archived'
      })
    }
  })
}

export const useDeletePageMutation = () => {
  return useMutation({
    mutationFn: async (id: Page['id']) => {
      return client.api.patch<any, any, { status: Status }>(`/items/mt_pages/${id}`, {
        status: 'archived'
      })
    }
  })
}
