import { atom } from 'jotai'
import { AlertAtom } from './types/PageUnitOfMeasurement.types'

export const unitOfMeasurementAlertAtom = atom<AlertAtom>({
  title: '',
  content: '',
  size: 'small',
  variant: 'primary',
  pathname: '',
  open: false
})
