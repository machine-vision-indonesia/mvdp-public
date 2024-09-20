import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { jobLevelAlertAtom } from '../atoms'
import { useRouter } from 'next/router'
import { GridRenderCellParams, type GridValueGetterParams } from '@mui/x-data-grid'
import { fetchListDepartment } from '../services/fetchJobLevel.service'
import { ActionButton, ActionItem, PagePrimary } from '@/components/templates/page-primary'
import { useDeleteUser } from '@/components/complexes/user'
import { queryClient } from '@/pages/_app'
import { Alert } from '@/components/molecules/alert'
import { Badge } from '@/components/atoms/badge'
import { GetTableUsersResponse } from '@/modules/core/clusters/md-user/pages/user/types/ManageUserPage.types'
import { GetTableUsers } from '@/modules/core/clusters/md-user/pages/user/services/fetchUser.service'

export default function ManageJobLevelPage() {
  const [jobLevelAlert, setJobLevelAlert] = useAtom(jobLevelAlertAtom)
  const router = useRouter()
  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null)
  const [modalData, setModalData] = useState({
    id: '',
    email: ''
  })

  const deleteJobLevel = useDeleteUser()

  useEffect(() => {
    if (!jobLevelAlert.open) {
      return
    }

    setTimeout(() => {
      setJobLevelAlert({
        ...jobLevelAlert,
        open: false
      })
    }, 4000)
  }, [setJobLevelAlert, jobLevelAlert])

  const filterControllers = [
    {
      key: 'profile.full_name',
      name: 'Search Job Level',
      type: 'SEARCH'
    },
    {
      key: 'sto.name',
      name: 'Search Work Center',
      type: 'MULTI_SELECT',
      dataFetchService: fetchListDepartment,
      valueKey: 'id',
      labelKey: 'name'
    },
    {
      key: 'plant.label',
      name: 'Group By',
      type: 'SELECT',
      dataFetchService: fetchListDepartment,
      valueKey: 'id',
      labelKey: 'name'
    }
  ]

  const COLUMNS = [
    {
      field: 'profile.id_number',
      headerName: 'Code',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.profile?.id_number || '-',
      searchable: true
    },
    {
      field: 'profile.full_name',
      headerName: 'Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.profile?.full_name || '-',
      searchable: true
    },
    {
      field: 'werk.function',
      headerName: 'Job Function',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.werk?.name || '-',
      searchable: true
    },
    {
      field: 'sto.name',
      headerName: 'Department',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.sto?.name || '-',
      searchable: true
    },
    {
      field: 'werk.name',
      headerName: 'Work Center',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.werk?.name || '-',
      searchable: true
    },
    {
      field: 'werk.status',
      headerName: 'Data Status',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.werk?.name || '-',
      searchable: true,
      renderCell: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) => {
        const value = params.row.werk?.name ? 'Active' : 'Inactive'
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

  const onDelete = async () => {
    try {
      await deleteJobLevel.mutateAsync({
        id: modalData?.id
      })

      await queryClient.invalidateQueries()

      setJobLevelAlert({
        title: 'Delete Successful',
        content: 'Your user was success to delete',
        color: 'success',
        icon: 'ic:baseline-check',
        pathname: '/core/job-level',
        open: true
      })
    } catch {
      setJobLevelAlert({
        title: 'Delete Failed',
        content: 'Your user was failed to delete',
        color: 'error',
        icon: 'ic:baseline-do-disturb',
        pathname: '/core/job-level',
        open: true
      })
    }

    deleteJobLevel.reset()
  }

  const renderActionButton = (props: GridRenderCellParams) => (
    <Box display='flex' alignItems='center' justifyContent='center' width='100%'>
      <ActionButton
        items={[
          {
            label: 'Edit',
            icon: 'ic:outline-edit',
            color: 'primary.main',
            isLink: true,
            href: `/core/job-level/${props.row.id}/edit`,
            action: () => {}
          },
          {
            label: 'View',
            icon: 'ic:outline-remove-red-eye',
            color: 'primary.main',
            isLink: true,
            href: `/core/job-level/${props.row.id}`,
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
              title: 'Are you sure to delete job level?',
              description: `You won't be able to revert this!`,
              positiveLabel: 'Yes',
              status: 'danger',
              variant: 'confirmation',
              renderAction: true,
              onClick: onDelete
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
        title='Manage Job Level'
        action={{
          label: 'Create Job Level',
          href: '/core/job-level/add'
        }}
        columns={COLUMNS}
        dataFetchService={GetTableUsers}
        filters={filterControllers}
        renderActionButton={renderActionButton}
      />
      {jobLevelAlert.pathname === router.pathname && jobLevelAlert.open ? (
        <Box sx={{ position: 'absolute', zIndex: 9999, top: 80, right: 0 }}>
          <Alert
            variant='primary'
            content={jobLevelAlert.content}
            color={jobLevelAlert.color ?? 'info'}
            title={jobLevelAlert.title}
            icon={jobLevelAlert.icon}
            onClose={() => setJobLevelAlert({ ...jobLevelAlert, open: false })}
          />
        </Box>
      ) : null}
    </>
  )
}
