import { ActionButton, ActionItem, PagePrimary } from '@/components/templates/page-primary'
import { Box } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { GetTableQueryGraphics } from '../services/fetchQueryGraphic.services'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { queryGraphicAlertAtom } from '../atoms'
import { Alert } from '@/components/molecules/alert'
import { GetTableQueryGraphicsResponse } from '../types/ManageQueryGraphicPage.types'
import { useDeleteQueryGraphic } from '../services/actionDeleteQueryGraphic.services'
import { queryClient } from '@/pages/_app'

export function ManageQueryGraphicPage() {
  const router = useRouter()
  const [modalData, setModalData] = useState({
    id: '',
    email: ''
  })
  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null)

  const [queryGraphicAlert, setQueryGraphicAlert] = useAtom(queryGraphicAlertAtom)

  const deleteQueryGraphic = useDeleteQueryGraphic()

  const COLUMNS = [
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableQueryGraphicsResponse['data'][number]>) =>
        params.row.code || '-',
      searchable: true
    },
    {
      field: 'product',
      headerName: 'Product',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableQueryGraphicsResponse['data'][number]>) =>
        params.row.product || '-',
      searchable: true
    },
    {
      field: 'page',
      headerName: 'Page',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableQueryGraphicsResponse['data'][number]>) =>
        params.row.page || '-',
      searchable: true
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableQueryGraphicsResponse['data'][number]>) =>
        params.row.name || '-',
      searchable: true
    },
    {
      field: 'query',
      headerName: 'Query',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableQueryGraphicsResponse['data'][number]>) =>
        params.row.query || '-',
      searchable: true
    },
    {
      field: 'parameters',
      headerName: 'Parameters',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridRenderCellParams<GetTableQueryGraphicsResponse['data'][number]>) =>
        params.row.parameters || '-',
      searchable: true
    }
  ]

  const filterControllers = [
    {
      key: 'query graphic',
      name: 'Search product',
      type: 'SEARCH'
    }
  ]

  async function onDeleteRow(rowId: string) {
    try {
      await deleteQueryGraphic.mutateAsync({ id: rowId })
      await queryClient.invalidateQueries()

      setQueryGraphicAlert({
        title: 'Successfully delete data.',
        content: 'Query Graphic has been deleted by our system.',
        size: 'small',
        variant: 'success',
        pathname: '/core/query-graphic',
        open: true
      })
    } catch {
      setQueryGraphicAlert({
        title: 'Network Errors',
        content: 'Unable to connect to the network or server',
        size: 'small',
        variant: 'danger',
        pathname: '/core/query-graphic',
        open: true
      })
    }

    deleteQueryGraphic.reset()

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
            color: 'primary.main',
            isLink: true,
            href: `/core/query-graphic/${props.row.id}/edit`,
            action: () => {}
          },
          {
            label: 'View',
            icon: 'ic:outline-remove-red-eye',
            color: 'primary.main',
            isLink: true,
            href: `/core/query-graphic/${props.row.id}`,
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
              title: 'Delete this core query?',
              description: `It might be used and related to existing data. Deleted data could not be restore`,
              positiveLabel: 'Yes, delete it.',
              status: 'danger',
              variant: 'confirmation',
              renderAction: true,
              isLoading: deleteQueryGraphic.isPending,
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
    if (!queryGraphicAlert.open) {
      return
    }

    setTimeout(() => {
      setQueryGraphicAlert({
        ...queryGraphicAlert,
        open: false
      })
    }, 4000)
  }, [setQueryGraphicAlert, queryGraphicAlert])

  return (
    <>
      <PagePrimary
        title='Query Graphics'
        action={{
          label: 'Create Query',
          href: '/core/query-graphic/add',
          content: 'iconText',
          icon: 'ic:outline-add'
        }}
        columns={COLUMNS}
        filters={filterControllers}
        renderActionButton={renderActionButton}
        dataFetchService={GetTableQueryGraphics}
      />
      {queryGraphicAlert.pathname === router.pathname && queryGraphicAlert.open ? (
        <Box sx={{ position: 'absolute', zIndex: 9999, top: 80, right: 0 }}>
          <Alert
            title={queryGraphicAlert.title}
            size={queryGraphicAlert.size}
            content={queryGraphicAlert.content}
            variant={queryGraphicAlert.variant}
          />
        </Box>
      ) : null}
    </>
  )
}
