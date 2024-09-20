import { useInfiniteQuery, useQuery, UseQueryOptions } from '@tanstack/react-query'
import client from 'src/client'
import { PREFIX_KEY } from 'src/constant/common'
import { FetchParameters, GetSelectResponse } from '@/components/molecules/select-async'
import {
  PRIMARY_QUERY_KEY_DEPARTMENTS,
  PRIMARY_QUERY_KEY_JOB_FUNCTION,
  PRIMARY_QUERY_KEY_JOB_LEVEL,
  PRIMARY_QUERY_KEY_ROLES,
  PRIMARY_QUERY_KEY_WORK_CENTERS,
  URL_DEPARTMENT,
  URL_JOB_FUNCTION,
  URL_JOB_LEVEL,
  URL_ROLES,
  URL_WORK_CENTER
} from '../constants/ManageJobFunctionPage.constants'
import { GetWorkCentersResponse } from '../../job-level/types/ManageJobLevelPage.types'
import {
  GetByCodeParams,
  GetJobFunctionsResponse,
  GetRolesResponse,
  PropsTable
} from '../types/ManageJobFunction.types'

type Sto = {
  id: string
  name: string
}

type JobLevel = {
  id: string
  name: string
}

type JobFunction = {
  id: string
  code: string
  department: string
  name: string
  sto: Sto
  job_level: JobLevel
  description?: string
  status: string
}

type Meta = {
  filter_count: number
}

export type GetTableJobFunctionsResponse = {
  meta: Meta
  data: JobFunction[]
}

export const GetTableJobFunctions: PropsTable['dataFetchService'] = params => {
  const queryParams = {
    ...params,
    fields: ['id', 'code', 'name', 'department.name', 'sto.name'].toString(),
    filter: {
      _and: [
        {
          status: {
            _eq: 'published'
          }
        },
        params?.filter,
        {
          _or: [
            {
              name: {
                _icontains: params?.filterResult?.resultController?.['job function']
              }
            },
            {
              code: {
                _icontains: params?.filterResult?.resultController?.['job function']
              }
            }
          ]
        }
      ]
    },
    deep: {
      parent: {
        _filter: {
          status: {
            _eq: 'published'
          }
        }
      }
    }
  }

  return useQuery({
    queryKey: [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_JOB_FUNCTION, queryParams],
    async queryFn() {
      const response = await client.api.get<GetTableJobFunctionsResponse>(URL_JOB_FUNCTION, {
        params: queryParams
      })

      return response.data
    }
  })
}

export const fetchListJobFunction = (params?: FetchParameters): any => {
  return useInfiniteQuery<GetSelectResponse, Error>({
    queryKey: [PRIMARY_QUERY_KEY_JOB_FUNCTION, params],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = {
        ...params,
        page: pageParam,
        search: params?.search || undefined,
        limit: params?.limit || 10, // Set default limit if not provided
        fields: ['id', 'name'],
        meta: ['total_count', 'filter_count', 'current_page', 'limit', 'total_page']
      }

      const response = await client.api.get<GetSelectResponse>(URL_JOB_FUNCTION, {
        params: queryParams
      })

      return response.data
    },
    getNextPageParam: lastPage => {
      const nextPage = (lastPage.meta?.current_page ?? 1) + 1
      return nextPage <= (lastPage.meta?.total_page ?? 1) ? nextPage : undefined
    }
  })
}

type GetJobFunctionResponse = {
  data: JobFunction
}

type UseGetJobFunctionParams = Pick<UseQueryOptions, 'enabled'> & {
  id: string
}

export function useGetJobFunction(params: UseGetJobFunctionParams) {
  const queryParams = {
    fields: [
      'id',
      'name',
      'code',
      'description',
      'sto.id',
      'sto.name',
      'job_level.id',
      'job_level.name',
      'work_center.id',
      'work_center.name',
      'role.id',
      'role.name'
    ]
  }

  const key = [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_JOB_FUNCTION, 'detail', params.id, queryParams]

  return useQuery({
    queryKey: key,
    async queryFn() {
      const response = await client.api.get<GetJobFunctionResponse>(`${URL_JOB_FUNCTION}/${params.id}`, {
        params: queryParams
      })

      return response.data
    }
  })
}

export const GetJobFunctionByCode = (params: GetByCodeParams) =>
  client.api.get<GetJobFunctionsResponse>(URL_JOB_FUNCTION, {
    params: {
      filter: {
        code: {
          _eq: params.code
        },
        status: {
          _eq: 'published'
        }
      },
      fields: ['id']
    }
  })

export const useGetWorkCenters = () => {
  const queryParams = {
    fields: ['id', 'name'],
    sort: ['name', 'id'],
    limit: -1,
    filter: {
      status: {
        _eq: 'published'
      }
    }
  }

  const key = [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_WORK_CENTERS, queryParams]

  return useQuery({
    queryKey: key,
    async queryFn() {
      const response = await client.api.get<GetWorkCentersResponse>(URL_WORK_CENTER, {
        params: queryParams
      })

      return response.data.data.map(workCenter => ({
        id: workCenter.id,
        label: workCenter.name
      }))
    }
  })
}

const departmentsQueryParams = {
  fields: ['id', 'name'],
  limit: -1,
  sort: 'name',
  filter: {
    status: {
      _eq: 'published'
    }
  }
}

export function useListDepartment() {
  return useQuery({
    queryKey: [PRIMARY_QUERY_KEY_DEPARTMENTS, 'list', departmentsQueryParams], // TODO: Pindah ke query-keys.ts
    async queryFn() {
      type Department = {
        id: string
        name: string
      }

      type GetDepartmentsResponse = {
        data: Department[]
      }

      const response = await client.api.get<GetDepartmentsResponse>(URL_DEPARTMENT, {
        params: departmentsQueryParams
      })

      return response.data
    }
  })
}

export const useGetRoles = () => {
  const queryParams = {
    fields: ['id', 'name'],
    sort: ['name', 'id'],
    limit: -1,
    filter: {
      status: {
        _eq: 'published'
      }
    }
  }

  const key = [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_ROLES, queryParams]

  return useQuery({
    queryKey: key,
    async queryFn() {
      const response = await client.api.get<GetRolesResponse>(URL_ROLES, {
        params: queryParams
      })

      return response.data.data.map(role => ({
        id: role.id,
        label: role.name
      }))
    }
  })
}

export const GetRolesByCode = (params: GetByCodeParams) =>
  client.api.get<GetRolesResponse>(URL_ROLES, {
    params: {
      filter: {
        code: {
          _eq: params.code
        }
      },
      fields: ['id'].toString()
    }
  })

export const useGetJobLevels = () => {
  const queryParams = {
    fields: ['id', 'name'],
    sort: ['name', 'id'],
    limit: -1,
    filter: {
      status: {
        _eq: 'published'
      }
    }
  }

  const key = [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_JOB_LEVEL, queryParams]

  return useQuery({
    queryKey: key,
    async queryFn() {
      const response = await client.api.get<GetRolesResponse>(URL_JOB_LEVEL, {
        params: queryParams
      })

      return response.data.data.map(jobLevel => ({
        id: jobLevel.id,
        label: jobLevel.name
      }))
    }
  })
}
