import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { queryClient } from '@/pages/_app'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { ActionButton, ActionItem, PagePrimary } from '@/components/templates/page-primary'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { Badge } from '@/components/atoms/badge'
import { Alert } from '@/components/molecules/alert'
import { useDeleteJobFunction } from '../services/deleteJobFunction.service'
import { jobFunctionAlertAtom } from '../atoms'
import {
  fetchListJobFunction,
  GetTableJobFunctions,
  GetTableJobFunctionsResponse
} from '../services/fetchJobFunction.service'

export default function ManageJobFunctionPage() {
  const router = useRouter()

  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null)

  const [jobFunctionAlert, setJobFunctionAlert] = useAtom(jobFunctionAlertAtom)

  const deleteJobFunction = useDeleteJobFunction()

  async function onDeleteRow(rowId: string) {
    try {
      await deleteJobFunction.mutateAsync({ id: rowId })
      await queryClient.invalidateQueries()

      setJobFunctionAlert({
        title: 'Successfully delete data.',
        content: 'Job Function has been deleted by our system.',
        size: 'small',
        variant: 'success',
        pathname: '/core/job-function',
        open: true
      })
    } catch {
      setJobFunctionAlert({
        title: 'Network Errors',
        content: 'Unable to connect to the network or server',
        size: 'small',
        variant: 'danger',
        pathname: '/core/job-function',
        open: true
      })
    }

    deleteJobFunction.reset()

    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }

  const filterControllers = [
    {
      key: 'job function',
      name: 'Search Job Function',
      type: 'SEARCH'
    },
    {
      key: 'parent.name',
      name: 'Search Work Center',
      type: 'MULTI_SELECT',
      dataFetchService: fetchListJobFunction,
      valueKey: 'id',
      labelKey: 'name'
    },
    {
      name: 'Group By',
      type: 'SELECT',
      dataFetchService: fetchListJobFunction,
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
      valueGetter: (params: GridRenderCellParams<GetTableJobFunctionsResponse['data'][number]>) =>
        params.row.code || '-',
      searchable: true
    },
    {
      field: 'name',
      headerName: 'Job Function Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableJobFunctionsResponse['data'][number]>) =>
        params.row.name || '-',
      searchable: true
    },
    {
      field: 'department.name',
      headerName: 'Department',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableJobFunctionsResponse['data'][number]>) =>
        params.row.sto?.name || '-',
      searchable: true
    },
    {
      field: 'sto.name',
      headerName: 'Work Center',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableJobFunctionsResponse['data'][number]>) =>
        params.row.sto?.name || '-',
      searchable: true
    },
    {
      field: 'status',
      headerName: 'Data Status',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableJobFunctionsResponse['data'][number]>) =>
        params.row.status || '-',
      searchable: true,
      renderCell: (params: GridRenderCellParams<GetTableJobFunctionsResponse['data'][number]>) => {
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

  const renderActionButton = (props: GridRenderCellParams) => (
    <Box display='flex' alignItems='center' justifyContent='center' width='100%'>
      <ActionButton
        items={[
          {
            label: 'Edit',
            icon: 'ic:outline-edit',
            color: 'primary.main',
            isLink: true,
            href: `/core/job-function/${props.row.id}/edit`,
            action: () => {}
          },
          {
            label: 'View',
            icon: 'ic:outline-remove-red-eye',
            color: 'primary.main',
            isLink: true,
            href: `/core/job-function/${props.row.id}`,
            action: () => {}
          },
          {
            label: 'Delete',
            icon: 'ic:outline-delete',
            color: 'error.main',
            isLink: false,
            action: () => {},
            modalProps: {
              title: 'Are you sure to delete job function?',
              description: `You won't be able to revert this!`,
              positiveLabel: 'Yes',
              status: 'danger',
              variant: 'confirmation',
              renderAction: true,
              isLoading: deleteJobFunction.isPending,
              onClick: () => onDeleteRow(props.row.id)
            }
          }
        ]}
        currentAction={currentAction}
        setCurrentAction={setCurrentAction}
      />
    </Box>
  )

  useEffect(() => {
    if (!jobFunctionAlert.open) {
      return
    }

    setTimeout(() => {
      setJobFunctionAlert({
        ...jobFunctionAlert,
        open: false
      })
    }, 4000)
  }, [setJobFunctionAlert, jobFunctionAlert])

  return (
    <>
      <PagePrimary<GetTableJobFunctionsResponse['data'][number]>
        title='Manage Job Function'
        action={{
          label: 'Create Job Function',
          href: '/core/job-function/add',
          content: 'iconText',
          icon: 'ic:outline-add'
        }}
        columns={COLUMNS}
        dataFetchService={GetTableJobFunctions}
        filters={filterControllers}
        renderActionButton={renderActionButton}
      />
      {jobFunctionAlert.pathname === router.pathname && jobFunctionAlert.open ? (
        <Box sx={{ position: 'absolute', zIndex: 9999, top: 80, right: 0 }}>
          <Alert
            title={jobFunctionAlert.title}
            size={jobFunctionAlert.size}
            content={jobFunctionAlert.content}
            variant={jobFunctionAlert.variant}
          />
        </Box>
      ) : null}
    </>
  )
}
