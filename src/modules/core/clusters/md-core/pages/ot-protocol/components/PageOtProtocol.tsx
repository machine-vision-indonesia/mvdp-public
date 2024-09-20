import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { useTheme } from '@mui/material'
import { GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { userAlertAtom } from '@/components/complexes/user/atoms'
import { Modal } from '@/components/molecules'
import { ActionButton, ActionItem, GetTableUsersResponse, PagePrimary } from '@/components/templates/page-primary'
import { FormOtProtocol } from './FormOtProtocol'
import { fetchTableOtProtocol } from '../services/fetchListOtProtocol.services'
import { GetTableOtProtocolResponse } from '../types/PageOtProtocol'
import { actionDeleteOtProtocol } from '../services/actionDeleteOtProtocol.services'
import { otProtocolAlertAtom } from '../atoms'
import { queryClient } from '@/pages/_app'
import { Alert } from '@/components/molecules/alert'
import { DetailOtProtocol } from './DetailOtProtocol'

export default function PageOtProtocol() {
  const [userAlert, setUserAlert] = useAtom(userAlertAtom)
  const theme = useTheme()

  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null)
  const [modalAction, setModalAction] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [id, setId] = useState('')
  const [otProtocolAlert, setOtProtocolAlert] = useAtom(otProtocolAlertAtom)

  const deleteOtProtocol = actionDeleteOtProtocol()

  useEffect(() => {
    if (!userAlert.open) return
    const timer = setTimeout(() => setUserAlert({ ...userAlert, open: false }), 4000)
    return () => clearTimeout(timer)
  }, [setUserAlert, userAlert])

  const FILTERS = [
    {
      key: 'OT Protocol',
      name: 'Search',
      type: 'SEARCH'
    }
  ]

  const COLUMNS = [
    {
      field: 'code',
      headerName: 'CODE',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableOtProtocolResponse['data'][number]>) =>
        params.row.code || '-',
      searchable: true
    },
    {
      field: 'json_property',
      headerName: 'JSON PROPERTY',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableOtProtocolResponse['data'][number]>) =>
        params.row.json_property || '-',
      searchable: true
    }
  ]

  async function onDeleteRow(rowId: string) {
    try {
      const response = await deleteOtProtocol.mutateAsync({ id: rowId })
      await queryClient.invalidateQueries()

      if (response.status === 204) {
        setOtProtocolAlert({
          title: 'Successfully delete data.',
          content: 'OT Protocol has been deleted by our system.',
          size: 'small',
          variant: 'success',
          pathname: '/core/ot-protocol',
          open: true
        })
      } else {
        setOtProtocolAlert({
          title: 'Something went wrong',
          content: response.data.message,
          size: 'small',
          variant: 'danger',
          pathname: '/core/ot-protocol',
          open: true
        })
      }
    } catch {
      setOtProtocolAlert({
        title: 'Network Errors',
        content: 'Unable to connect to the network or server',
        size: 'small',
        variant: 'danger',
        pathname: '/core/ot-protocol',
        open: true
      })
    }
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }

  useEffect(() => {
    if (!otProtocolAlert.open) {
      return
    }

    setTimeout(() => {
      setOtProtocolAlert({
        ...otProtocolAlert,
        open: false
      })
    }, 4000)
  }, [setOtProtocolAlert, otProtocolAlert])

  const renderEditModal = (id: string) => <FormOtProtocol id={id} pages='edit' setCurrentAction={setCurrentAction} />
  const renderViewModal = (id: string) => (
    <DetailOtProtocol
      id={id}
      setId={setId}
      setIsEditModalOpen={setIsEditModalOpen}
      setCurrentAction={setCurrentAction}
    />
  )

  const renderActionButton = (props: GridRenderCellParams) => (
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
            renderContent: () => renderEditModal(props?.row?.id),
            modalProps: {
              title: 'Edit OT Protocol',
              description: 'Make change these data to edit OT Protocol.',
              renderAction: false
            }
          },
          {
            label: 'View',
            icon: 'ic:outline-remove-red-eye',
            color: theme.colorToken.text.primary.normal,
            isLink: false,
            // href: `/core/user/${params.row.id}`,
            action: () => {},
            renderContent: () => renderViewModal(props.row.id),
            modalProps: {
              title: 'Detail OT Protocol',
              description: 'Below is details of OT Protocol you’ve selected.',
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
            // renderContent: renderDeleteModal,
            modalProps: {
              renderAction: true,
              status: 'danger',
              variant: 'confirmation',
              title: 'Delete this OT Protocol?',
              description: 'It might be used and related to existing data. Deleted data could not be restore.',
              positiveLabel: 'Yes, delete it',
              onClick: () => onDeleteRow(props.row.id),
              isLoading: deleteOtProtocol.isPending
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
        title='OT Protocol'
        action={{
          label: 'Create Protocol',
          content: 'iconText',
          icon: 'ic:outline-add',
          modalContent: <FormOtProtocol pages='add' setCurrentAction={setModalAction} />,
          modalProps: {
            variant: 'confirmation',
            title: 'Provides these data to create OT Protocol.',
            description: 'Provides these data to create OT Protocol.',
            renderAction: false,
            onClose: () => setModalAction(false)
          }
        }}
        columns={COLUMNS}
        dataFetchService={fetchTableOtProtocol}
        filters={FILTERS}
        renderActionButton={renderActionButton}
        modalOpen={modalAction}
        setModalOpen={setModalAction}
      />

      {isEditModalOpen ? (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title='Edit' renderAction={false}>
          <FormOtProtocol id={id} pages='edit' setCurrentAction={setIsEditModalOpen} />
        </Modal>
      ) : null}

      {otProtocolAlert.open ? (
        <Box sx={{ position: 'absolute', zIndex: 9999, top: 80, right: 0 }}>
          <Alert
            title={otProtocolAlert.title}
            size={otProtocolAlert.size}
            content={otProtocolAlert.content}
            variant={otProtocolAlert.variant}
          />
        </Box>
      ) : null}
    </>
  )
}
