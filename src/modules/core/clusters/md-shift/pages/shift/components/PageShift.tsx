import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material'
import { userAlertAtom } from '@/components/complexes/user/atoms'
import { ActionItem, PagePrimary, ActionButton } from '@/components/templates/page-primary/index'
import { getListShiftService } from '../services/fetchListShift.service'
import { GetTableShiftResponse } from '../types/PageShift.type'
import { Badge } from '@/components/atoms/badge'
import { FormAddShift } from './FormAddShift'
import { shiftAlertAtom } from '../store/shiftAlertAtom'
import { useRouter } from 'next/router'
import { Alert } from '@/components/molecules/alert'

export const PageShift = () => {
  const theme = useTheme()
  const router = useRouter()

  const [shiftAlert, setShiftAlert] = useAtom(shiftAlertAtom)

  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null)
  const [modalAction, setModalAction] = useState(false)

  useEffect(() => {
    if (!shiftAlert.open) return
    const timer = setTimeout(() => setShiftAlert({ ...shiftAlert, open: false }), 3000)
    return () => clearTimeout(timer)
  }, [setShiftAlert, shiftAlert])

  const FILTERS = [
    {
      key: 'name',
      name: 'Search Shift',
      type: 'SEARCH'
    }
  ]

  const COLUMNS = [
    {
      field: 'name',
      headerName: 'name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableShiftResponse['data'][number]>) => params.row.name || '-',
      searchable: true
    },
    {
      field: 'is_overtime',
      headerName: 'type',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableShiftResponse['data'][number]>) => {
        const value = params.row.is_overtime ? 'Overtime' : 'Reguler'

        return value || '-'
      },
      searchable: true
    },
    {
      field: 'start',
      headerName: 'shift start',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableShiftResponse['data'][number]>) => params.row.start || '-',
      searchable: true
    },
    {
      field: 'end',
      headerName: 'shift end',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableShiftResponse['data'][number]>) => params.row.end || '-',
      searchable: true
    },
    {
      field: 'status',
      headerName: 'data status',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<GetTableShiftResponse['data'][number]>) => {
        const value = params.row.status ? 'Active' : 'Inactive'

        return (
          <Badge
            color={value === 'Active' ? 'success' : 'neutral'}
            label={value}
            isTransparent={true}
            size='medium'
            style='rect'
          />
        )
      }
    }
  ]

  const renderEditModal = (shiftId?: string) => (
    <FormAddShift formType='edit' setCurrentAction={setCurrentAction} shiftId={shiftId as string} />
  )

  const renderActionButton = (props: GridRenderCellParams) => (
    <Box display='flex' alignItems='center' justifyContent='center' width='100%'>
      <ActionButton
        items={[
          {
            label: 'Edit',
            icon: 'tabler:pencil',
            color: theme.colorToken.text.primary.normal,
            isLink: false,
            action: () => {
              alert('test')
            },
            renderContent: () => renderEditModal(props.row.id),
            modalProps: {
              title: 'Edit Shift',
              description: 'Edit information you want to update',
              renderAction: false
            }
          },
          {
            label: 'Detail',
            icon: 'mynaui:eye',
            color: theme.colorToken.text.primary.normal,
            isLink: true,
            href: `/core/shift/${props.row.id}`,
            action: () => {}
          },
          {
            label: 'Delete',
            icon: 'tabler:trash',
            color: theme.colorToken.icon.danger.normal,
            isLink: false,
            // href: `/core/user/${params.row.id}`,
            action: () => {}
            // modalProps: {
            //   // renderAction: false,
            //   status: 'danger',
            //   variant: 'confirmation',
            //   title: 'Delete this Configuration',
            //   description:
            //     '“CFG010 (Config Name-2)” might be used and related to existing data. Deleted data could not be restore.'
            // }
          }
        ]}
        currentAction={currentAction}
        setCurrentAction={setCurrentAction}
      />
    </Box>
  )

  return (
    <>
      <PagePrimary<GetTableShiftResponse['data'][number]>
        title='Shift'
        action={{
          label: 'Create Shift',
          modalContent: <FormAddShift formType='add' setCurrentAction={setModalAction} />,
          modalProps: {
            variant: 'confirmation',
            title: 'Create Shift',
            description: 'Please fill these information to create',
            renderAction: false,
            onClose: () => setModalAction(false)
          }
        }}
        columns={COLUMNS}
        dataFetchService={getListShiftService}
        filters={FILTERS}
        renderActionButton={renderActionButton}
        modalOpen={modalAction}
        setModalOpen={setModalAction}
      />

      {shiftAlert.pathname === router.pathname && shiftAlert.open ? (
        <Box sx={{ position: 'absolute', zIndex: 9999, top: 80, right: 0 }}>
          <Alert
            title={shiftAlert.title}
            size={shiftAlert.size}
            content={shiftAlert.content}
            variant={shiftAlert.variant}
          />
        </Box>
      ) : null}
    </>
  )
}
