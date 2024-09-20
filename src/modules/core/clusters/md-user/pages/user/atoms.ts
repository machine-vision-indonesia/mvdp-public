import { atom } from 'jotai'
import { AlertAtom } from './types/AlertAtom.types'

export const userAlertAtom = atom<AlertAtom>({
  title: '',
  content: '',
  size: 'small',
  variant: 'primary',
  pathname: '',
  open: false
})
