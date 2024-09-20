import client from '@/client'
import { GetRolesResponse } from '../types'

export const checkExistingRole = async (code: string, onExisting: () => void): Promise<boolean> => {
  try {
    const response = await client.api.get<GetRolesResponse>('/items/mt_roles', {
      params: {
        filter: {
          code: {
            _eq: code
          }
        },
        fields: ['id'].toString()
      }
    })

    if (response.data.data.length) {
      onExisting()
      return true
    }

    return false
  } catch (error) {
    console.error('Error checking existing role:', error)
    return false
  }
}
