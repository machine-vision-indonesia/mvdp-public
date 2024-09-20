import { useQuery } from '@tanstack/react-query'
import client from 'src/client'
import { PREFIX_KEY } from 'src/constant/common'
import { PRIMARY_QUERY_KEY_USERS } from '../constant'
import { PropsTable } from '../types/ManageRoleDetailPage.types'

type Profile = {
  id_number: string
  full_name: string
}

type Werk = {
  name: string
}

type Sto = {
  name: string
}

type User = {
  id: string
  email: string | null
  is_verified: boolean
  profile: Profile | null
  werk: Werk | null
  sto: Sto | null
}

type GetTableUsersMeta = {
  filter_count: number
}

export type GetTableUsersResponse = {
  data: User[]
  meta: GetTableUsersMeta
}

export const PRIMARY_QUERY_KEY = 'USERS'
const URL_USERS = '/users'

export const GetTableUsers: PropsTable['dataFetchService'] = params => {
  const queryParams = {
    ...params,
    fields: [
      'id',
      'email',
      'profile.id_number',
      'profile.full_name',
      'werk.name',
      'sto.name',
      'is_verified'
    ].toString(),
    sort: ['profile.id_number', 'id'].toString(),
    filter: {
      _and: [
        params?.filter,
        {
          _and: [
            {
              sto: {
                _in: params?.filterResult?.resultController?.['sto.name']?.[0]?.id ?? undefined
              }
            }
          ]
        },
        {
          _or: [
            {
              profile: {
                full_name: {
                  _icontains: params?.filterResult?.resultController?.['profile.full_name']
                }
              }
            }
          ]
        }
      ]
    },
    deep: {
      profile: {
        _filter: {
          status: {
            _eq: 'published'
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
      }
    }
  }

  return useQuery({
    queryKey: [PREFIX_KEY.GET, PRIMARY_QUERY_KEY_USERS, queryParams],
    async queryFn() {
      const response = await client.api.get<GetTableUsersResponse>(URL_USERS, {
        params: queryParams
      })

      return response.data
    }
  })
}
