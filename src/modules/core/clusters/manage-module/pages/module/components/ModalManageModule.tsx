import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useDebounce } from 'src/hooks/useDebounce'

import { Modal } from '@/components/molecules'
import {
  createClusterModalOpenAtom,
  debouncedSearchAtom,
  deleteClusterModalOpenAtom,
  deleteModuleModalOpenAtom,
  deletePageModalOpenAtom,
  editClusterModalOpenAtom,
  editModuleModalOpenAtom,
  editPageModalOpenAtom,
  selectedClusterIdAtom,
  selectedModuleIdAtom,
  selectedPageIdAtom
} from '@/modules/core/clusters/manage-module/pages/module/atoms'
import { CreateCluster } from '@/modules/core/clusters/manage-module/pages/module/components/CreateCluster'
import {
  useDeleteClusterMutation,
  useDeleteModuleMutation,
  useDeletePageMutation
} from '@/modules/core/clusters/manage-module/pages/module/services/actionDeleteManageModule.service'
import dynamic from 'next/dynamic'

const CreateModule = dynamic(() => import('./CreateModule'), { ssr: false })
const EditModuleModal = dynamic(() => import('./EditModule'), { ssr: false })
const CreatePage = dynamic(() => import('./CreatePage'), { ssr: false })
const DetailPageModal = dynamic(() => import('./DetailPageModal'), { ssr: false })
const EditCluster = dynamic(() => import('./EditCluster'), { ssr: false })
const EditPage = dynamic(() => import('./EditPage'), { ssr: false })

const ModalManageModule = ({
  createModuleModalOpen,
  setCreateModuleModalOpen
}: { createModuleModalOpen: boolean; setCreateModuleModalOpen: Dispatch<SetStateAction<boolean>> }) => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const localDebouncedSearch = useDebounce(search, 1000)
  const [, setDebouncedSearch] = useAtom(debouncedSearchAtom)
  useEffect(() => {
    setDebouncedSearch(localDebouncedSearch)
  }, [localDebouncedSearch, setDebouncedSearch])

  const [createClusterModalOpen, setCreateClusterModalOpen] = useAtom(createClusterModalOpenAtom)
  const [editClusterModalOpen, setEditClusterModalOpen] = useAtom(editClusterModalOpenAtom)
  const [selectedModuleId, setSelectedModuleId] = useAtom(selectedModuleIdAtom)
  const [selectedClusterId, setSelectedClusterId] = useAtom(selectedClusterIdAtom)
  const [editModuleModalOpen, setEditModuleModalOpen] = useAtom(editModuleModalOpenAtom)
  const [deleteModuleModalOpen, setDeleteModuleModalOpen] = useAtom(deleteModuleModalOpenAtom)
  const [deleteClusterModalOpen, setDeleteClusterModalOpen] = useAtom(deleteClusterModalOpenAtom)
  const [editPageModalOpen, setEditPageModalOpen] = useAtom(editPageModalOpenAtom)
  const [selectedPageId, setSelectedPageId] = useAtom(selectedPageIdAtom)
  const [deletePageModalOpen, setDeletePageModalOpen] = useAtom(deletePageModalOpenAtom)
  const [chooseAnotherIconModuleCreateChecked, setChooseAnotherIconModuleCreateChecked] = useState(false)
  const [chooseAnotherIconModuleEditChecked, setChooseAnotherIconModuleEditChecked] = useState(false)
  const [chooseAnotherIconPageCreateChecked, setChooseAnotherIconPageCreateChecked] = useState(false)
  const [chooseAnotherIconPageEditChecked, setChooseAnotherIconPageEditChecked] = useState(false)
  const deleteModuleMutation = useDeleteModuleMutation()
  const deleteClusterMutation = useDeleteClusterMutation()
  const deletePageMutation = useDeletePageMutation()

  return (
    <>
      <CreateModule
        createModuleModalOpen={createModuleModalOpen}
        setCreateModuleModalOpen={setCreateModuleModalOpen}
        setChooseAnotherIconModuleCreateChecked={setChooseAnotherIconModuleCreateChecked}
        chooseAnotherIconModuleCreateChecked={chooseAnotherIconModuleCreateChecked}
      />
      <CreateCluster
        createClusterModalOpen={createClusterModalOpen}
        setCreateClusterModalOpen={setCreateClusterModalOpen}
        selectedModuleId={selectedModuleId}
      />

      <CreatePage
        setChooseAnotherIconPageCreateChecked={setChooseAnotherIconPageCreateChecked}
        chooseAnotherIconPageCreateChecked={chooseAnotherIconPageCreateChecked}
      />

      <EditModuleModal
        selectedModuleId={selectedModuleId}
        editModuleModalOpen={editModuleModalOpen}
        setEditModuleModalOpen={setEditModuleModalOpen}
        setChooseAnotherIconModuleEditChecked={setChooseAnotherIconModuleEditChecked}
        chooseAnotherIconModuleEditChecked={chooseAnotherIconModuleEditChecked}
      />
      <Modal
        isOpen={deleteModuleModalOpen}
        onClose={() => setDeleteModuleModalOpen(false)}
        type='confirmation'
        status='danger'
        title='Are you sure?'
        description="You won't be able to revert this!"
        positiveLabel='Yes, delete it'
        loading={deleteModuleMutation.isPending || deleteModuleMutation.isSuccess}
        onOk={() => {
          if (!selectedModuleId) {
            return
          }

          deleteModuleMutation.mutate(selectedModuleId, {
            onSuccess: async () => {
              await queryClient.invalidateQueries()
              setDeleteModuleModalOpen(false)
              setSelectedModuleId(null)
              deleteModuleMutation.reset()
            }
          })
        }}
      />
      <EditCluster editClusterModalOpen={editClusterModalOpen} setEditClusterModalOpen={setEditClusterModalOpen} />

      <Modal
        isOpen={deleteClusterModalOpen}
        onClose={() => setDeleteClusterModalOpen(false)}
        type='confirmation'
        status='danger'
        title='Are you sure?'
        description="You won't be able to revert this!"
        positiveLabel='Yes, delete it'
        loading={deleteModuleMutation.isPending || deleteModuleMutation.isSuccess}
        onOk={() => {
          if (!selectedClusterId) {
            return
          }

          deleteClusterMutation.mutate(selectedClusterId, {
            onSuccess: async () => {
              await queryClient.invalidateQueries()
              setDeleteClusterModalOpen(false)
              setSelectedClusterId(null)
              deleteClusterMutation.reset()
            }
          })
        }}
      />

      <DetailPageModal />

      <EditPage
        editPageModalOpen={editPageModalOpen}
        setEditPageModalOpen={setEditPageModalOpen}
        chooseAnotherIconPageEditChecked={chooseAnotherIconPageEditChecked}
        setChooseAnotherIconPageEditChecked={setChooseAnotherIconPageEditChecked}
      />

      <Modal
        isOpen={deletePageModalOpen}
        onClose={() => setDeletePageModalOpen(false)}
        type='confirmation'
        status='danger'
        title='Are you sure?'
        description="You won't be able to revert this!"
        positiveLabel='Yes, delete it'
        loading={deleteModuleMutation.isPending || deleteModuleMutation.isSuccess}
        onOk={() => {
          if (!selectedPageId) {
            return
          }

          deletePageMutation.mutate(selectedPageId, {
            onSuccess: async () => {
              await queryClient.invalidateQueries()
              setDeletePageModalOpen(false)
              setSelectedPageId(null)
              deletePageMutation.reset()
            }
          })
        }}
      />
    </>
  )
}

export default ModalManageModule
