import { keepPreviousData, useQuery } from '@tanstack/react-query'
import client from 'src/client'
import { PREFIX_KEY } from 'src/constant/common'
import { GetUserResponse, Params } from '../types/UserEditPage.type'
import { PRIMARY_QUERY_KEY_ASSETS } from '../constants/ManageUserPage.constants'
import { useRouter } from 'next/router'
import { GetUserLogActivityQueryResponse, UserLogActivityParams } from '../types/ManageUserPage.types'

const URL_ASSET = '/assets'

export function useGetAsset(params: Params) {
  const key = [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_ASSETS, 'detail', params.id]

  return useQuery({
    queryKey: key,
    async queryFn() {
      if (!params.id) {
        throw new Error('Invalid asset ID')
      }

      const response = await client.api.get(`${URL_ASSET}/${params.id}`, {
        responseType: 'blob'
      })

      return new Promise<string>(callback => {
        const reader = new FileReader()
        reader.onload = function () {
          callback(String(reader.result))
        }
        reader.readAsDataURL(response.data)
      })
    },
    enabled: Boolean(params.id)
  })
}

const PRIMARY_QUERY_KEY = 'USERS'
const URL = '/users'

export function useGetUser(params: Params) {
  const userParams = {
    fields: [
      'tfa_secret',
      'profile.cover',
      'profile.photo',
      'profile.full_name',
      'email',
      'profile.address',
      'privileges.role.name',
      'werk.name',
      'sto.name',
      'job_function.name',
      'job_function.job_level.name',
      'job_title',
      'profile.id_number',
      'profile.first_name',
      'profile.last_name',
      'profile.gender',
      'profile.religion',
      'profile.phone',
      'profile.post_code',
      'profile.id',
      'is_verified'
    ],
    filter: {
      status: {
        _eq: 'active'
      }
    },
    deep: {
      profile: {
        _filter: {
          status: {
            _eq: 'published'
          }
        }
      },
      privileges: {
        _filter: {
          status: {
            _eq: 'published'
          }
        },
        role: {
          _filter: {
            status: {
              _eq: 'published'
            }
          }
        }
      },
      werk: {
        _filter: {
          status: {
            _eq: 'published'
          }
        }
      },
      sto: {
        _filter: {
          status: {
            _eq: 'published'
          }
        }
      },
      job_function: {
        _filter: {
          status: {
            _eq: 'published'
          }
        },
        job_level: {
          _filter: {
            status: {
              _eq: 'published'
            }
          }
        }
      }
    }
  }

  const key = [PREFIX_KEY.GET, PRIMARY_QUERY_KEY, 'detail', params.id, userParams]

  return useQuery({
    queryKey: key,
    async queryFn() {
      const response = await client.api.get<GetUserResponse>(`${URL}/${params.id}`, {
        params: {
          ...userParams,
          enabled: params.enabled
        }
      })

      return response.data
    }
    // enabled: params.enabled
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
    queryKey: ['departments', 'list', departmentsQueryParams], // TODO: Pindah ke query-keys.ts
    async queryFn() {
      type Department = {
        id: string
        name: string
      }

      type GetDepartmentsResponse = {
        data: Department[]
      }

      const response = await client.api.get<GetDepartmentsResponse>('/items/mt_departments', {
        params: departmentsQueryParams
      })

      return response.data
    }
  })
}

export function useUserQuery() {
  const router = useRouter()

  const userQueryParams = {
    fields: [
      'email',
      'privileges.id',
      'privileges.role.id',
      'privileges.role.name',
      'werk.id',
      'werk.name',
      'sto.id',
      'sto.name',
      'job_function.id',
      'job_function.name',
      'job_function.job_level.name',
      'job_title'
    ],
    filter: {
      status: {
        _eq: 'active'
      }
    },
    deep: {
      profile: {
        _filter: {
          status: {
            _eq: 'published'
          }
        }
      },
      privileges: {
        _filter: {
          status: {
            _eq: 'published'
          }
        },
        role: {
          _filter: {
            status: {
              _eq: 'published'
            }
          }
        }
      },
      stos: {
        _filter: {
          status: {
            _eq: 'published'
          }
        },
        department: {
          _filter: {
            status: {
              _eq: 'published'
            }
          }
        }
      },
      job_function: {
        _filter: {
          status: {
            _eq: 'published'
          }
        },
        job_level: {
          _filter: {
            status: {
              _eq: 'published'
            }
          }
        }
      }
    }
  }

  return useQuery({
    queryKey: ['users', 'detail', router.query.id, userQueryParams], // TODO: Pindah ke query-keys.ts
    async queryFn() {
      const response = await client.api.get<GetUserLogActivityQueryResponse>(`/users/${router.query.id}`, {
        params: userQueryParams
      })

      return response.data
    },
    enabled: router.isReady
  })
}

export const fetchUserMe = async () => {
  const response = await client.api.get('/user/me')
  return response.data
}

export function useFetchUser() {
  return useQuery({
    queryKey: ['userme'],
    async queryFn() {
      const response = await client.api.get('/user/me')

      return response.data
    }
  })
}

const URL_USER_LOG = '/revisions'

export function useGetUserLogActivity({ user_id, enabled, page = 1 }: UserLogActivityParams) {
  const key = [PREFIX_KEY.GET, PRIMARY_QUERY_KEY, 'detail', user_id, 'log_activity', `page: ${page}`]

  const userLogActivityQueryParams = {
    meta: ['total_count', 'filter_count', 'current_page', 'limit', 'total_page'],
    fields: [
      'id',
      'collection',
      'item',
      'delta',
      'activity.id',
      'activity.id',
      'activity.action',
      'activity.timestamp',
      'activity.user.first_name',
      'activity.user.last_name',
      'activity.user.avatar',
      'activity.user.job_function_id.name'
    ],
    sort: ['-activity.timestamp'].toString(),
    filter: {
      item: {
        _eq: user_id
      }
    },
    limit: 10,
    page: page
  }

  return useQuery({
    queryKey: key,
    placeholderData: keepPreviousData,
    async queryFn() {
      const response = await client.api.get<GetUserLogActivityQueryResponse>(`${URL_USER_LOG}`, {
        params: {
          ...userLogActivityQueryParams,
          enabled
        }
      })

      return response.data
    }
  })
}
