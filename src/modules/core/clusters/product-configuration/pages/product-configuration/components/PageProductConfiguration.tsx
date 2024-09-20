import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { GridValueGetterParams } from '@mui/x-data-grid'
import { GetTableUsers } from '@/components/atoms/dropdown-async/GetUser.service'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material'
import { userAlertAtom } from '@/components/complexes/user/atoms'
import { ActionItem, GetTableUsersResponse, PagePrimary, ActionButton } from '@/components/templates/page-primary/index'
import FormAddProductConfiguration from './FormProductConfiguration'

export default function PageProductConfiguration() {
  const [userAlert, setUserAlert] = useAtom(userAlertAtom)
  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null)
  const [modalAction, setModalAction] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    if (!userAlert.open) return
    const timer = setTimeout(() => setUserAlert({ ...userAlert, open: false }), 4000)
    return () => clearTimeout(timer)
  }, [setUserAlert, userAlert])

  const FILTERS = [
    {
      key: 'profile.full_name',
      name: 'Search Configuration',
      type: 'SEARCH'
    }
  ]

  const COLUMNS = [
    {
      field: 'profile.id_number',
      headerName: 'KEY',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.profile?.id_number || '-',
      searchable: true
    },
    {
      field: 'profile.full_name',
      headerName: 'Value',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.profile?.full_name || '-',
      searchable: true
    }
  ]

  const renderEditModal = () => <FormAddProductConfiguration pages='edit' setCurrentAction={setCurrentAction} />

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
              title: 'Edit Configuration',
              description:
                'Provide Key and its Value for configuration. Add Description to give explanation about configuration.',
              renderAction: false
            }
          },
          {
            label: 'Delete',
            icon: 'ic:outline-delete',
            color: theme.colorToken.icon.danger.normal,
            isLink: false,
            // href: `/core/user/${params.row.id}`,
            action: () => {},
            modalProps: {
              // renderAction: false,
              status: 'danger',
              variant: 'confirmation',
              title: 'Delete this Configuration',
              description:
                '“CFG010 (Config Name-2)” might be used and related to existing data. Deleted data could not be restore.'
            }
          }
        ]}
        currentAction={currentAction}
        setCurrentAction={setCurrentAction}
      />
    </Box>
  )

  return (
    <PagePrimary<GetTableUsersResponse['data'][number]>
      title='Product Configuration'
      action={{
        label: 'Create New',
        modalContent: <FormAddProductConfiguration pages='add' setCurrentAction={setModalAction} />,
        modalProps: {
          variant: 'confirmation',
          title: 'Create Product Configuration',
          description:
            'Provide Key and its Value for configuration. Add Description to give explanation about configuration.',
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
  )
}
