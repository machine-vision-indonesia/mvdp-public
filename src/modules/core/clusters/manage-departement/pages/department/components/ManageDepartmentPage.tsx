import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { queryClient } from '@/pages/_app'
import { useAtom } from 'jotai'
import { type GetTableDepartmentsResponse } from 'src/components/complexes/department/service/list/GetTableDepartments.service'
import { useRouter } from 'next/router'
import { ActionButton, ActionItem, PagePrimary } from '@/components/templates/page-primary'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { GetTableUsersResponse } from '@/modules/core/clusters/md-user/pages/user/types/ManageUserPage.types'
import { Badge } from '@/components/atoms/badge'
import { fetchListDepartment, GetTableDepartments } from '../services/fetchDepartment.service'
import { useDeleteDepartment } from '../services/actionDeleteDepartment.service'
import { Alert } from '@/components/molecules/alert'
import { departmentAlertAtom } from '../atoms'

export default function ManageDepartmentPage() {
  const router = useRouter()

  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null)
  const [modalData, setModalData] = useState({
    id: '',
    email: ''
  })
  const [departmentAlert, setDepartmentAlert] = useAtom(departmentAlertAtom)

  const deleteDepartment = useDeleteDepartment()

  async function onDeleteRow() {
    try {
      await deleteDepartment.mutateAsync({ id: modalData.id })
      await queryClient.invalidateQueries()

      setDepartmentAlert({
        title: 'Successfully delete data.',
        content: 'Department has been deleted by our system.',
        size: 'small',
        variant: 'success',
        pathname: '/core/department',
        open: true
      })
    } catch {
      setDepartmentAlert({
        title: 'Network Errors',
        content: 'Unable to connect to the network or server',
        size: 'small',
        variant: 'danger',
        pathname: '/core/department',
        open: true
      })
    }

    deleteDepartment.reset()

    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }

  const filterControllers = [
    {
      key: 'code',
      name: 'Search Department',
      type: 'SEARCH'
    },
    {
      key: 'parent.name',
      name: 'Search Work Center',
      type: 'MULTI_SELECT',
      dataFetchService: fetchListDepartment,
      valueKey: 'id',
      labelKey: 'name'
    },
    {
      name: 'Group By',
      type: 'SELECT',
      dataFetchService: fetchListDepartment,
      valueKey: 'id',
      labelKey: 'name'
    }
  ]

  const COLUMNS = [
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableDepartmentsResponse['data'][number]>) =>
        params.row.code || '-',
      searchable: true
    },
    {
      field: 'name',
      headerName: 'Department Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableDepartmentsResponse['data'][number]>) =>
        params.row.name || '-',
      searchable: true
    },
    {
      field: 'parent.name',
      headerName: 'Work Center',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableDepartmentsResponse['data'][number]>) =>
        params.row.parent?.name || '-',
      searchable: true
    },
    {
      field: 'status',
      headerName: 'Data Status',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableDepartmentsResponse['data'][number]>) =>
        params.row.name || '-',
      searchable: true,
      renderCell: (params: GridRenderCellParams<GetTableDepartmentsResponse['data'][number]>) => {
        const value = params.row.parent?.name ? 'Active' : 'Inactive'
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

  const renderActionButton = (props: GridRenderCellParams) => (
    <Box display='flex' alignItems='center' justifyContent='center' width='100%'>
      <ActionButton
        items={[
          {
            label: 'Edit',
            icon: 'ic:outline-edit',
            color: 'primary.main',
            isLink: true,
            href: `/core/department/${props.row.id}/edit`,
            action: () => {}
          },
          {
            label: 'View',
            icon: 'ic:outline-remove-red-eye',
            color: 'primary.main',
            isLink: true,
            href: `/core/department/${props.row.id}`,
            action: () => {}
          },
          {
            label: 'Delete',
            icon: 'ic:outline-delete',
            color: 'error.main',
            isLink: false,
            action: () => {
              setModalData(props.row)
            },
            modalProps: {
              title: 'Are you sure to delete department?',
              description: `You won't be able to revert this!`,
              positiveLabel: 'Yes',
              status: 'danger',
              variant: 'confirmation',
              renderAction: true,
              onClick: onDeleteRow
            }
          }
        ]}
        currentAction={currentAction}
        setCurrentAction={setCurrentAction}
      />
    </Box>
  )

  useEffect(() => {
    if (!departmentAlert.open) {
      return
    }

    setTimeout(() => {
      setDepartmentAlert({
        ...departmentAlert,
        open: false
      })
    }, 4000)
  }, [setDepartmentAlert, departmentAlert])

  return (
    <>
      <PagePrimary<GetTableUsersResponse['data'][number]>
        title='Manage Department'
        action={{
          label: 'Create Department',
          href: '/core/department/add'
        }}
        columns={COLUMNS}
        dataFetchService={GetTableDepartments}
        filters={filterControllers}
        renderActionButton={renderActionButton}
      />
      {departmentAlert.pathname === router.pathname && departmentAlert.open ? (
        <Box sx={{ position: 'absolute', zIndex: 9999, top: 80, right: 0 }}>
          <Alert
            title={departmentAlert.title}
            size={departmentAlert.size}
            content={departmentAlert.content}
            variant={departmentAlert.variant}
          />
        </Box>
      ) : null}
    </>
  )
}
