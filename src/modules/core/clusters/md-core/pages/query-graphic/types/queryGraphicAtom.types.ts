import { PropsAlert } from '@/components/molecules/alert/types/alertType'

export type AlertAtom = {
  title: string
  content: string
  size: PropsAlert['size']
  variant: PropsAlert['variant']
  pathname: string
  open: boolean
}
