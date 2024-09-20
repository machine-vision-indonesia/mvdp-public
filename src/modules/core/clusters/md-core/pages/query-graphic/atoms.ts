import { atom } from 'jotai'
import { AlertAtom } from './types/queryGraphicAtom.types'

export const queryGraphicAlertAtom = atom<AlertAtom>({
  title: '',
  content: '',
  size: 'small',
  variant: 'primary',
  pathname: '',
  open: false
})
