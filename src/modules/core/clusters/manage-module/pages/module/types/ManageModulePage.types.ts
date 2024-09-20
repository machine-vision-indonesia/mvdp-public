import {
  assignToRoleGeneralPageSchema,
  assignToRolePageSchema,
  assignToRoleSchema,
  clusterSchema,
  moduleSchema,
  pageSchema
} from '../validations'
import * as yup from 'yup'
import { type Status } from 'src/types/directus/general'
import { TableRowProps } from '@mui/material'
import { UniqueIdentifier } from '@dnd-kit/core'

export type ModuleSchema = yup.InferType<typeof moduleSchema>
export type ClusterSchema = yup.InferType<typeof clusterSchema>
export type PageSchema = yup.InferType<typeof pageSchema>

export type GetRolesResponse = {
  data: Role[]
}

export type Role = {
  id: string
  name: string
  modules: Module3[]
}

export type Module3 = {
  module: number
}

export type GetPagesResponse = {
  data: Page[]
}

export type GetModulesResponse = {
  data: Module2[]
}

export type Module2 = {
  id: string
  code: string
  name: string
  description: string
  base_path: string
  order: number
  icon: string | null
  clusters: Cluster[]
}

export type Cluster = {
  id: string
  code: string
  name: string
  is_active: boolean
  order: number
  pages: Page[]
  module: Module
}

export type Product = {
  id: string
  product: Product2
}

export type Product2 = {
  id: string
  name: string
  main_page: string | null
}

export type Page = {
  id: string
  code: string
  name: string
  description: string | null
  icon: string | null
  url: string
  type: string | null
  status: boolean
  products: Product[]
  order: number
  is_external_src: boolean
  capabilities: Capability[]
}

export type Capability = {
  id: string
  role: string
  page: string
  create: boolean
  update: boolean
  delete: boolean
}

export type Module = {
  id: string
}

export type ModifiedModule = Module2 & {
  additional_type: 'module'
}

export type ModifiedPage = Page & {
  additional_type: 'page'
}

export type EditPageMutationFnParams = Omit<PageSchema, 'products' | 'is_main_page'> & {
  id: Page['id']
  products: {
    create: {
      product: PageSchema['products'][number]['id']
      page: Page['id']
      status: Status
    }[]
    update: {
      id: Product['id']
      status: Status
    }[]
  }
}

export type GetCapabilityRolesResponse = {
  data: {
    role: Pick<Role, 'id' | 'name'>
  }[]
}

export type GetCapabilityRolesParams = {
  moduleId: Module['id'] | null
}

export type PagesQueryParams = {
  fields: string[]
  filter: {
    cluster: {
      _null: boolean
    }
    name?: {
      _icontains: string
    }
    status: {
      _eq: Status
    }
  }
  deep: {
    products: {
      _filter: {
        status: {
          _eq: Status
        }
      }
    }
  }
}

export type ModulesQueryParams = {
  fields: string[]
  filter: {
    code: {
      _neq: string
    }
    name?: {
      _icontains: string
    }
    status: {
      _eq: Status
    }
  }
  sort: string[]
  deep: {
    clusters: {
      _filter: {
        status: {
          _eq: Status
        }
      }
      _sort: string[]
      pages: {
        _filter: {
          status: {
            _eq: Status
          }
        }
        _sort: string[]
        products: {
          _filter: {
            status: {
              _eq: Status
            }
          }
        }
      }
    }
  }
}

export type ModuleTabPanelProps = {
  value: number
  index: number
}

export type AssignToRoleRoleSchema = yup.InferType<typeof assignToRolePageSchema>

export type AssignToRoleSchema = yup.InferType<typeof assignToRoleSchema>

export type AssignToRoleGeneralPageSchema = yup.InferType<typeof assignToRoleGeneralPageSchema>

export interface SortableTableRowProps extends TableRowProps {
  sortableId: UniqueIdentifier
}

export type CapabilityCreateData = {
  role: Role['id']
  page: Page['id']
  create: boolean
  update: boolean
  delete: boolean
  status: Status
}

export type ChangePageStatusMutationFnParams = Pick<Page, 'id'> & {
  status: boolean
}

export type UseGetRolesParams = {
  moduleId: Module['id'] | null
  generalPageId: Page['id'] | null
  content: 'default' | 'assign_to_role'
}

export type GetGeneralPagesResponse = {
  data: Page[]
}

export type EditModuleMutationFnParams = {
  id: Module['id']
} & ModuleSchema

export type EditClusterMutationFnParams = {
  id: Cluster['id']
} & ClusterSchema

export type GeneralPageCardProps = {
  page: ModifiedPage
}

export type GetCapabilitiesByPageIdParams = {
  pageId: Page['id'] | null
}

export type GetCapabilitiesByPageIdResponse = {
  data: {
    role: Pick<Role, 'id' | 'name'>
  }[]
}

export type ClusterCardProps = {
  cluster: Cluster
}
