import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { useTheme } from '@mui/material'
import { GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { Modal } from '@/components/molecules'
import { ActionButton, ActionItem, PagePrimary } from '@/components/templates/page-primary'
import { FormUnit } from './FormUnit'
import { DetailUnit } from './DetailUnit'
import {
  GetTableUnitOfMeasurementResponse,
  GetTableUnitOfMeasurements
} from '../services/fetchUnitOfMeasurement.services'
import { Badge } from '@/components/atoms/badge'
import { Alert } from '@/components/molecules/alert'
import { useRouter } from 'next/router'
import { unitOfMeasurementAlertAtom } from '../atoms'
import { queryClient } from '@/pages/_app'
import { useDeleteUnitOfMeasurement } from '../services/actionDeleteUnitOfMeasurement.services'

export function PageUnitOfMeasurement() {
  const theme = useTheme()
  const router = useRouter()

  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null)
  const [modalAction, setModalAction] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [unitOfMeasurementAlert, setUnitOfMeasurementAlert] = useAtom(unitOfMeasurementAlertAtom)
  const [id, setId] = useState('')

  const deleteUnit = useDeleteUnitOfMeasurement()

  useEffect(() => {
    if (!unitOfMeasurementAlert.open) return
    const timer = setTimeout(() => setUnitOfMeasurementAlert({ ...unitOfMeasurementAlert, open: false }), 4000)
    return () => clearTimeout(timer)
  }, [setUnitOfMeasurementAlert, unitOfMeasurementAlert])

  const FILTERS = [
    {
      key: 'unit_of_measurement',
      name: 'Search Unit Of Measurement',
      type: 'SEARCH'
    }
  ]

  const COLUMNS = [
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUnitOfMeasurementResponse['data'][number]>) =>
        params.row.code || '-',
      searchable: true
    },
    {
      field: 'name',
      headerName: 'unit name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUnitOfMeasurementResponse['data'][number]>) =>
        params.row.name || '-',
      searchable: true
    },
    {
      field: 'is_active',
      headerName: 'data status',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<GetTableUnitOfMeasurementResponse['data'][number]>) => {
        const value = params.row.is_active
        return (
          <Badge
            size='medium'
            style='rect'
            isTransparent={true}
            color={value ? 'success' : 'neutral'}
            label={value ? 'Active' : 'Inactive'}
          />
        )
      },
      searchable: true
    }
  ]

  const renderEditModal = (id: string) => <FormUnit pages='edit' setCurrentAction={setCurrentAction} id={id} />
  const renderViewModal = (id: string) => (
    <DetailUnit setIsEditModalOpen={setIsEditModalOpen} setCurrentAction={setCurrentAction} id={id} setId={setId} />
  )

  async function onDeleteRow(rowId: string) {
    try {
      const response = await deleteUnit.mutateAsync({ id: rowId })
      await queryClient.invalidateQueries()

      if (response.status === 204) {
        setUnitOfMeasurementAlert({
          title: 'Successfully delete data.',
          content: 'Unit has been deleted by our system.',
          size: 'small',
          variant: 'success',
          pathname: '/core/unit-of-measurement',
          open: true
        })
      }
    } catch {
      setUnitOfMeasurementAlert({
        title: 'Network Errors',
        content: 'Unable to connect to the network or server',
        size: 'small',
        variant: 'danger',
        pathname: '/core/unit-of-measurement',
        open: true
      })
    }

    deleteUnit.reset()

    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }

  const renderActionButton = (props: GridRenderCellParams) => (
    <Box display='flex' alignItems='center' justifyContent='center' width='100%'>
      <ActionButton
        items={[
          {
            label: 'Edit',
            icon: 'ic:outline-edit',
            color: theme.colorToken.text.primary.normal,
            isLink: false,
            action: () => {},
            renderContent: () => renderEditModal(props.row.id),
            modalProps: {
              title: 'Edit Unit',
              renderAction: false
            }
          },
          {
            label: 'View',
            icon: 'ic:outline-remove-red-eye',
            color: theme.colorToken.text.primary.normal,
            isLink: false,
            action: () => {},
            renderContent: () => renderViewModal(props.row.id),
            modalProps: {
              title: 'Detail Unit',
              description: 'These information is details of material type',
              renderAction: false
            }
          },

          {
            label: 'Delete',
            icon: 'ic:outline-delete',
            color: theme.colorToken.icon.danger.normal,
            isLink: false,
            action: () => {},
            // renderContent: renderDeleteModal,
            modalProps: {
              renderAction: true,
              status: 'danger',
              variant: 'confirmation',
              title: 'Delete this Unit of Measurement?',
              description: `${props.row.name} might be used and related to existing data. Deleted data could not be restore.`,
              positiveLabel: 'Yes, delete it.',
              onClick: () => onDeleteRow(props.row.id),
              isLoading: deleteUnit.isPending
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
      <PagePrimary<GetTableUnitOfMeasurementResponse['data'][number]>
        title='Unit of Measurement'
        action={{
          label: 'Create Unit',
          content: 'iconText',
          icon: 'ic:outline-add',
          modalContent: <FormUnit setCurrentAction={setModalAction} />,
          modalProps: {
            variant: 'confirmation',
            title: 'Create Unit',
            description: 'Please fill these informations to create',
            renderAction: false,
            onClose: () => setModalAction(false)
          }
        }}
        columns={COLUMNS}
        dataFetchService={GetTableUnitOfMeasurements}
        filters={FILTERS}
        renderActionButton={renderActionButton}
        modalOpen={modalAction}
        setModalOpen={setModalAction}
      />

      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setId('')
            setIsEditModalOpen(false)
          }}
          title='Edit'
          renderAction={false}
        >
          <FormUnit pages='edit' setCurrentAction={setIsEditModalOpen} id={id} />
        </Modal>
      )}

      {unitOfMeasurementAlert.pathname === router.pathname && unitOfMeasurementAlert.open ? (
        <Box sx={{ position: 'absolute', zIndex: 9999, top: 80, right: 0 }}>
          <Alert
            title={unitOfMeasurementAlert.title}
            size={unitOfMeasurementAlert.size}
            content={unitOfMeasurementAlert.content}
            variant={unitOfMeasurementAlert.variant}
          />
        </Box>
      ) : null}
    </>
  )
}
