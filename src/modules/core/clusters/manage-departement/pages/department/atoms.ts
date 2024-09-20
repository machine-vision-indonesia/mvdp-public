import { PropsAlert } from '@/components/molecules/alert/types/alertType'
import { atom } from 'jotai'

type AlertAtom = {
  title: string
  content: string
  size: PropsAlert['size']
  variant: PropsAlert['variant']
  pathname: string
  open: boolean
}

export const departmentAlertAtom = atom<AlertAtom>({
  title: '',
  content: '',
  size: 'small',
  variant: 'primary',
  pathname: '',
  open: false
})
