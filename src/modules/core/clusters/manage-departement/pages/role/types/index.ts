import { PropsAlert } from '@/components/molecules/alert/types/alertType'

type Parent = {
  id: string
  name: string
}

export type Role = {
  id: string
  code: string
  name: string
  description: string
  parent?: Parent
  is_active: boolean
}

export type GetRolesResponse = {
  data: Role[]
}

export type AlertAtom = {
  title: string
  content: string
  size: PropsAlert['size']
  variant: PropsAlert['variant']
  pathname: string
  open: boolean
}
