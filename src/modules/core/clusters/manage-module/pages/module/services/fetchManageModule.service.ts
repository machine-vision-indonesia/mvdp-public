import client from '@/client'
import {
  GetCapabilitiesByPageIdParams,
  GetCapabilitiesByPageIdResponse,
  GetCapabilityRolesParams,
  GetCapabilityRolesResponse,
  GetGeneralPagesResponse,
  GetModulesResponse,
  GetPagesResponse,
  GetRolesResponse,
  ModifiedModule,
  ModifiedPage,
  ModulesQueryParams,
  PagesQueryParams,
  UseGetRolesParams
} from '../types/ManageModulePage.types'
import { useQuery } from '@tanstack/react-query'

export async function getModulesAndGeneralPages() {
  const modulesQueryParams: ModulesQueryParams = {
    fields: [
      'id',
      'code',
      'name',
      'description',
      'base_path',
      'order',
      'icon',
      'clusters.id',
      'clusters.code',
      'clusters.name',
      'clusters.is_active',
      'clusters.order',
      'clusters.pages.id',
      'clusters.pages.code',
      'clusters.pages.name',
      'clusters.pages.description',
      'clusters.pages.icon',
      'clusters.pages.url',
      'clusters.pages.type',
      'clusters.pages.status',
      'clusters.pages.products.id',
      'clusters.pages.products.product.id',
      'clusters.pages.products.product.name',
      'clusters.pages.products.product.main_page',
      'clusters.pages.order',
      'clusters.pages.is_external_src',
      'clusters.module.id',
      'clusters.pages.capabilities.id',
      'clusters.pages.capabilities.role',
      'clusters.pages.capabilities.page',
      'clusters.pages.capabilities.create',
      'clusters.pages.capabilities.update',
      'clusters.pages.capabilities.delete'
    ],
    filter: { code: { _neq: 'GE' }, status: { _eq: 'published' } },
    sort: ['order'],
    deep: {
      clusters: {
        _filter: {
          status: {
            _eq: 'published'
          }
        },
        _sort: ['order'],
        pages: {
          _filter: {
            status: {
              _eq: 'published'
            }
          },
          _sort: ['order'],
          products: {
            _filter: {
              status: {
                _eq: 'published'
              }
            }
          }
        }
      }
    }
  }

  const modulesResponse = await client.api.get<GetModulesResponse>('/items/mt_modules', {
    params: modulesQueryParams
  })

  const modules = modulesResponse.data.data.map<ModifiedModule>(mod => ({
    ...mod,
    additional_type: 'module'
  }))

  const pagesQueryParams: PagesQueryParams = {
    filter: {
      cluster: {
        _null: true
      },
      status: {
        _eq: 'published'
      }
    },
    fields: [
      'id',
      'code',
      'name',
      'description',
      'icon',
      'url',
      'type',
      'status',
      'products.id',
      'products.product.id',
      'products.product.name',
      'products.product.main_page',
      'order',
      'is_external_src',
      'capabilities.id',
      'capabilities.role',
      'capabilities.page',
      'capabilities.create',
      'capabilities.update',
      'capabilities.delete'
    ],
    deep: {
      products: {
        _filter: {
          status: {
            _eq: 'published'
          }
        }
      }
    }
  }

  const pagesResponse = await client.api.get<GetPagesResponse>(`/items/mt_pages`, {
    params: pagesQueryParams
  })

  const pages = pagesResponse.data.data.map<ModifiedPage>(page => ({
    ...page,
    additional_type: 'page'
  }))

  const modulesAndPages = [...modules, ...pages].sort((a, b) => {
    if (a.order === null || a.order === undefined) {
      return 1
    }

    if (b.order === null || b.order === undefined) {
      return -1
    }

    return a.order - b.order
  })

  return modulesAndPages
}


export async function getCapabilityRoles(params: GetCapabilityRolesParams) {
  const queryParams = {
    filter: {
      page: {
        cluster: {
          module: {
            _eq: params.moduleId
          }
        }
      }
    },
    fields: ['role.id', 'role.name']
  }

  const response = await client.api.get<GetCapabilityRolesResponse>('/items/mt_capabilities', {
    params: queryParams
  })

  return response.data.data
}

async function getRoles() {
  const queryParams = {
    fields: ['id', 'name', 'modules.module']
  }

  const response = await client.api.get<GetRolesResponse>('/items/mt_roles', {
    params: queryParams
  })

  return response.data
}

export function useGetRoles(params: UseGetRolesParams) {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    enabled: (params.moduleId !== null || params.generalPageId !== null) && params.content === 'assign_to_role'
  })
}

export async function getGeneralPages() {
  const response = await client.api.get<GetGeneralPagesResponse>(`/items/mt_pages`, {
    params: {
      filter: {
        cluster: {
          _null: true
        }
      },
      fields: [
        'id',
        'code',
        'name',
        'description',
        'icon',
        'url',
        'type',
        'status',
        'products.id',
        'products.product.id',
        'products.product.name',
        'products.product.main_page',
        'order',
        'is_external_src'
      ]
    }
  })

  return response.data
}

async function getCapabilitiesByPageId(params: GetCapabilitiesByPageIdParams) {
  if (!params.pageId) {
    return Promise.reject(new Error('Invalid page ID'))
  }

  const queryParams = {
    filter: {
      page: {
        _eq: params.pageId
      }
    },
    fields: ['role.id', 'role.name']
  }

  const response = await client.api.get<GetCapabilitiesByPageIdResponse>('/items/mt_capabilities', {
    params: queryParams
  })

  return response.data.data
}

export const useGetCapabilitiesByPageIdQuery = (selectedGeneralPageId: any) => {
  return useQuery({
    queryKey: ['capabilities', { pageId: selectedGeneralPageId }],
    queryFn: () => getCapabilitiesByPageId({ pageId: selectedGeneralPageId }),
    enabled: !!selectedGeneralPageId
  })
}

export const useGetCapabilityRolesQuery = (selectedModuleId: any, content: 'default' | 'assign_to_role') => {
  return useQuery({
    queryKey: ['capability_roles', { moduleId: selectedModuleId }],
    queryFn: () => getCapabilityRoles({ moduleId: selectedModuleId }),
    enabled: selectedModuleId !== null && content === 'assign_to_role'
  })
}

export const useGetModulesAndGeneralPagesQuery = () => {
  return useQuery({
    queryKey: ['modules'],
    queryFn: () => getModulesAndGeneralPages()
  })
}
