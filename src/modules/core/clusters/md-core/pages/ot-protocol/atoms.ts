import { atom } from 'jotai'
import { AlertAtom } from './types/AtomOtProtocol'

export const otProtocolAlertAtom = atom<AlertAtom>({
  title: '',
  content: '',
  size: 'small',
  variant: 'primary',
  pathname: '',
  open: false
})
