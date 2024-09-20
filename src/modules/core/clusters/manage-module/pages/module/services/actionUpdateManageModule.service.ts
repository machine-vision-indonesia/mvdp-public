import { useMutation } from '@tanstack/react-query'
import { getModulesAndGeneralPages } from './fetchManageModule.service'
import { queryClient } from '@/pages/_app'
import client from '@/client'
import {
  EditClusterMutationFnParams,
  EditModuleMutationFnParams,
  EditPageMutationFnParams
} from '../types/ManageModulePage.types'
// import { ChangePageStatusMutationFnParams, GetModulesResponse } from '../types/ManageModulePage.types'

export function useUpdateModuleOrders() {
  return useMutation({
    mutationFn: async (params: { data: Awaited<ReturnType<typeof getModulesAndGeneralPages>>; search: string }) => {
      return client.api.post(`/modules/bulk`, params.data)
    },
    onMutate: async params => {
      await queryClient.cancelQueries({ queryKey: ['modules'] })

      const previousModules = queryClient.getQueryData<Awaited<ReturnType<typeof getModulesAndGeneralPages>>>([
        'modules'
      ])
      if (previousModules) {
        queryClient.setQueryData<Awaited<ReturnType<typeof getModulesAndGeneralPages>>>(['modules'], params.data)
      }

      return { previousModules }
    },
    onError: (_, variables, context) => {
      if (context?.previousModules) {
        queryClient.setQueryData(['modules'], context.previousModules)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries()
    }
  })
}

// export const changePageStatusMutation = useMutation({
//   mutationFn: async (params: ChangePageStatusMutationFnParams) =>
//     client.api.patch(`/items/mt_pages/${params.id}`, { status: params.status }),
//   onMutate: async params => {
//     await queryClient.cancelQueries({ queryKey: ['modules'] })

//     const previousModules = queryClient.getQueryData<GetModulesResponse>(['modules'])
//     if (previousModules) {
//       const previousModulesCopy = previousModules
//       const relatedModuleIndex = previousModulesCopy.data.findIndex(module => module.id === props.cluster.module.id)

//       previousModulesCopy.data[relatedModuleIndex].clusters = previousModulesCopy.data[
//         relatedModuleIndex
//       ].clusters.map(cluster => {
//         const relatedPageIndex = cluster.pages.findIndex(page => page.id === params.id)
//         if (relatedPageIndex !== -1) {
//           cluster.pages[relatedPageIndex].status = params.status
//         }

//         return cluster
//       })

//       queryClient.setQueryData<GetModulesResponse>(['modules'], previousModulesCopy)
//     }

//     return { previousModules }
//   },
//   onError: (_, __, context) => {
//     if (context?.previousModules) {
//       queryClient.setQueryData(['modules'], context.previousModules)
//     }
//   },
//   onSettled: () => {
//     queryClient.invalidateQueries()
//   }
// })

export const useEditModuleMutation = () => {
  return useMutation({
    mutationFn: async (params: EditModuleMutationFnParams) => {
      const { id, ...rest } = params

      return client.api.patch(`/items/mt_modules/${id}`, rest)
    }
  })
}

export const useEditClusterMutation = () => {
  return useMutation({
    mutationFn: async (params: EditClusterMutationFnParams) => {
      const { id, ...rest } = params

      return client.api.patch(`/items/mt_clusters/${id}`, rest)
    }
  })
}

export const useUpdatePageMutation = () => {
  return useMutation({
    mutationFn: async (params: EditPageMutationFnParams) => {
      const { id, ...rest } = params

      return client.api.patch(`/items/mt_pages/${id}`, rest)
    }
  })
}
