import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { useTheme } from '@mui/material'
import { GridValueGetterParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { GetTableUsers } from '@/components/atoms/dropdown-async/GetUser.service'
import { userAlertAtom } from '@/components/complexes/user/atoms'
import { Modal } from '@/components/molecules'
import { ActionButton, ActionItem, GetTableUsersResponse, PagePrimary } from '@/components/templates/page-primary'
import FormUnit from './FormInflux'
import DetailUnit from './DetailInflux'

export default function PageInflux() {
  const [userAlert, setUserAlert] = useAtom(userAlertAtom)
  const theme = useTheme()

  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null)
  const [modalAction, setModalAction] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    if (!userAlert.open) return
    const timer = setTimeout(() => setUserAlert({ ...userAlert, open: false }), 4000)
    return () => clearTimeout(timer)
  }, [setUserAlert, userAlert])

  const FILTERS = [
    {
      key: 'profile.full_name',
      name: 'Search',
      type: 'SEARCH'
    }
  ]

  const COLUMNS = [
    {
      field: 'profile.id_number',
      headerName: 'CODE',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.profile?.id_number || '-',
      searchable: true
    },
    {
      field: 'profile.full_name',
      headerName: 'COLLECTIONS',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.profile?.full_name || '-',
      searchable: true
    },
    {
      field: 'werk.name',
      headerName: 'CONFIGURATION',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.werk?.name || '-',
      searchable: true
    }
  ]

  const renderEditModal = () => <FormUnit pages='edit' setCurrentAction={setCurrentAction} />
  const renderViewModal = () => (
    <DetailUnit setIsEditModalOpen={setIsEditModalOpen} setCurrentAction={setCurrentAction} />
  )

  const renderActionButton = () => (
    <Box display='flex' alignItems='center' justifyContent='center' width='100%'>
      <ActionButton
        items={[
          {
            label: 'Edit',
            icon: 'ic:outline-edit',
            color: theme.colorToken.text.primary.normal,
            isLink: false,
            // href: `/core/user/${params.row.id}/edit`,
            action: () => {
              alert('test')
            },
            renderContent: renderEditModal,
            modalProps: {
              title: 'Edit Influx',
              description: 'Make change these data to edit Influx.',
              renderAction: false
            }
          },
          {
            label: 'View',
            icon: 'ic:outline-remove-red-eye',
            color: theme.colorToken.text.primary.normal,
            isLink: false,
            // href: `/core/user/${params.row.id}`,
            action: () => { },
            renderContent: renderViewModal,
            modalProps: {
              title: 'Detail Influx',
              description: "Below is details of influx you've selected.",
              renderAction: false
            }
          },

          {
            label: 'Delete',
            icon: 'ic:outline-delete',
            color: theme.colorToken.icon.danger.normal,
            isLink: false,
            // href: `/core/user/${params.row.id}`,
            action: () => { },
            // renderContent: renderDeleteModal,
            modalProps: {
              renderAction: true,
              status: 'danger',
              variant: 'confirmation',
              title: 'Delete this influx?',
              description: 'It might be used and related to existing data. Deleted data could not be restore.',
              positiveLabel: "Yes, delete it"
            }
          }
        ]}
        currentAction={currentAction}
        setCurrentAction={setCurrentAction}
      />
    </Box>
  )

  return (
    <>
      <PagePrimary<GetTableUsersResponse['data'][number]>
        title='Influx'
        action={{
          label: 'Create Influx',
          modalContent: <FormUnit pages='add' setCurrentAction={setModalAction} />,
          modalProps: {
            variant: 'confirmation',
            title: 'Create Influx',
            description: 'Provides these data to create influx.',
            renderAction: false,
            onClose: () => setModalAction(false)
          }
        }}
        columns={COLUMNS}
        dataFetchService={GetTableUsers}
        filters={FILTERS}
        renderActionButton={renderActionButton}
        modalOpen={modalAction}
        setModalOpen={setModalAction}
      />

      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title='Edit' renderAction={false}>
          <FormUnit pages='edit' setCurrentAction={setIsEditModalOpen} />
        </Modal>
      )}
    </>
  )
}
