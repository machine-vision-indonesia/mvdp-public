import { atom } from 'jotai'
import { AlertAtom } from '../types'

export const ROLEALERT = atom<AlertAtom>({
  title: '',
  content: '',
  size: 'small',
  variant: 'primary',
  pathname: '',
  open: false
})
