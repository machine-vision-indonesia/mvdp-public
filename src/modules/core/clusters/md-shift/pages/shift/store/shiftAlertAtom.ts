import { atom } from 'jotai'
import { AlertAtom } from '../types/PageShift.type'

export const shiftAlertAtom = atom<AlertAtom>({
  title: '',
  content: '',
  size: 'small',
  variant: 'primary',
  pathname: '',
  open: false
})
