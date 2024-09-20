import { atom } from 'jotai'
import { AlertAtom } from './types/JobFunctionAtom.types'

export const isCreateSuccessAtom = atom<boolean>(false)
export const isEditSuccessAtom = atom<boolean>(false)

export const jobFunctionAlertAtom = atom<AlertAtom>({
  title: '',
  content: '',
  size: 'small',
  variant: 'primary',
  pathname: '',
  open: false
})
