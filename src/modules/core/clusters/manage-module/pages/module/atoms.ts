import { atom } from 'jotai'
import { type PropsAlert } from 'src/components/atoms/alert/Alert'
import { Cluster, Page } from './types/ManageModulePage.types'
import Module from 'module'

type AlertAtom = {
  title: string
  content: string
  color: PropsAlert['color']
  icon: 'ic:baseline-check' | 'ic:baseline-do-disturb'
  pathname: string
  open: boolean
}

export const userAlertAtom = atom<AlertAtom>({
  title: '',
  content: '',
  color: 'success',
  icon: 'ic:baseline-check',
  pathname: '',
  open: false
})

export const editModuleModalOpenAtom = atom(false)

export const selectedModuleIdAtom = atom<Module['id'] | null>(null)
export const selectedClusterIdAtom = atom<Cluster['id'] | null>(null)
export const createClusterModalOpenAtom = atom(false)
export const createPageModalOpenAtom = atom(false)

export const editClusterModalOpenAtom = atom(false)
export const detailPageModalOpenAtom = atom(false)
export const selectedPageIdAtom = atom<Page['id'] | null>(null)
export const editPageModalOpenAtom = atom(false)
export const deletePageModalOpenAtom = atom(false)

export const deleteClusterModalOpenAtom = atom(false)

export const deleteModuleModalOpenAtom = atom(false)
export const debouncedSearchAtom = atom('')

export const selectedGeneralPageIdAtom = atom<Page['id'] | null>(null)
