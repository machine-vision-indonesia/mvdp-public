import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { userAlertAtom } from '../atoms'
import { useRouter } from 'next/router'
import { GridRenderCellParams, type GridValueGetterParams } from '@mui/x-data-grid'
import { fetchTableUserCollapsed } from '../services/fetchUser.service'
import { GetTableUsersResponse } from '../types/ManageUserPage.types'
import { ActionButton, ActionItem, PagePrimary } from '@/components/templates/page-primary'
import { useDeleteUser } from '@/components/complexes/user'
import { useResetPassword } from '../services/actionUpdateUser.service'
import { queryClient } from '@/pages/_app'
import { Alert } from '@/components/molecules/alert'
import { Button } from '@/components/atoms'
import { Badge } from '@/components/atoms/badge'

export default function ManageUserPage() {
  const [userAlert, setUserAlert] = useAtom(userAlertAtom)
  const router = useRouter()
  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null)
  const [modalData, setModalData] = useState({
    id: '',
    email: ''
  })
  const [showModalImport, setShowModalImport] = useState(false)

  const deleteUser = useDeleteUser()

  const resetPassword = useResetPassword()

  useEffect(() => {
    if (!userAlert.open) {
      return
    }

    setTimeout(() => {
      setUserAlert({
        ...userAlert,
        open: false
      })
    }, 4000)
  }, [setUserAlert, userAlert])

  const filterControllers = [
    {
      key: 'profile.full_name',
      name: 'Search User',
      type: 'SEARCH'
    },

    {
      key: 'id',
      name: 'Group by',
      type: 'SELECT',
      options: [
        {
          id: 'department',
          label: 'Department'
        }
      ],
      valueKey: 'code',
      labelKey: 'label'
    }
  ]

  const COLUMNS = [
    {
      field: 'profile.id_number',
      headerName: 'ID',
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
      field: 'status',
      headerName: 'Data Status',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<GetTableUsersResponse['data'][number]>) => {
        const value = params.row.status === 'active' ? 'Active' : 'Inactive'

        return (
          <Badge
            color={value === 'Active' ? 'success' : 'neutral'}
            label={value}
            size='medium'
            isTransparent={true}
            style='rect'
          />
        )
      },
      searchable: true
    },
    {
      field: 'verified',
      headerName: 'Verification',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<GetTableUsersResponse['data'][number]>) => {
        const value = params.row.is_verified
        return (
          <Badge
            color={value ? 'primary' : 'neutral'}
            label={value ? 'Verified' : 'Unverified'}
            size='medium'
            isTransparent={true}
            style='rect'
          />
        )
      },
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.sto?.name || '-',
      searchable: true
    }
  ]

  const onResetPassword = async () => {
    try {
      await resetPassword.mutateAsync({ id: modalData?.id, email: modalData?.email })

      setUserAlert({
        title: 'Successfully reset password',
        content: 'New password has been sent to user email',
        variant: 'success',
        size: 'small',
        pathname: '/core/user',
        open: true
      })
    } catch {
      setUserAlert({
        title: 'Network Errors',
        content: 'Unable to connect to the network or server.',
        variant: 'danger',
        size: 'small',
        pathname: '/core/user',
        open: true
      })
    }
  }

  const onVerify = () => {
    if (Math.floor(Math.random() * 2)) {
      setUserAlert({
        title: 'Successfully verify account',
        content: 'You are was success to verify!',
        variant: 'success',
        size: 'small',
        pathname: '/core/user',
        open: true
      })
    } else {
      setUserAlert({
        title: 'Network Errors.',
        content: 'Unable to connect to the netwotk or server.',
        variant: 'danger',
        size: 'small',
        pathname: '/core/user',
        open: true
      })
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onDelete = async () => {
    try {
      await deleteUser.mutateAsync({
        id: modalData?.id
      })

      await queryClient.invalidateQueries()

      setUserAlert({
        title: 'Successfully delete data',
        content: 'User has been deleted by our system',
        variant: 'success',
        size: 'small',
        pathname: '/core/user',
        open: true
      })
    } catch {
      setUserAlert({
        title: 'Network Errors',
        content: 'Unable to connect to the network or server.',
        variant: 'danger',
        size: 'small',
        pathname: '/core/user',
        open: true
      })
    }

    deleteUser.reset()
  }

  const renderActionButton = (props: GridRenderCellParams) => (
    <Box display='flex' alignItems='center' justifyContent='center' width='100%'>
      <ActionButton
        items={[
          {
            label: 'View User Profile',
            icon: 'tabler:user-circle',
            color: 'neutral.default',
            isLink: true,
            href: `/core/user/${props.row.id}`
          },
          {
            label: 'Verify',
            icon: 'ic:baseline-check',
            color: 'neutral.default',
            isLink: false,
            action: () => {
              setModalData(props.row)
            },
            modalProps: {
              title: `Are you sure to verify account of ${props?.row?.profile?.full_name}`,
              description: 'This account will be verified to access the system based on role.',
              positiveLabel: 'Yes',
              status: 'warning',
              variant: 'confirmation',
              renderAction: true,
              onClick: onVerify
            }
          },
          {
            label: 'Reset password',
            icon: 'ic:baseline-key',
            color: 'neutral.default',
            isLink: false,
            action: () => {
              setModalData(props.row)
            },
            modalProps: {
              title: `Are you sure to reset password account of ${props?.row?.profile?.full_name}`,
              description:
                'This account will receive an email to reset the password, please ensure the account is correct because you cannot revert this',
              positiveLabel: 'Yes',
              status: 'warning',
              variant: 'confirmation',
              renderAction: true,
              onClick: onResetPassword
            }
          },
          {
            label: 'Delete',
            icon: 'ic:outline-delete',
            color: 'danger.main',
            isLink: false,
            action: () => {
              setModalData(props.row)
            },
            modalProps: {
              title: 'Delete this user',
              description: `${props?.row?.profile?.full_name} might be used and related to existing data. Deleted data could not be restore.`,
              positiveLabel: 'Yes, delete it',
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

  const renderTopBarAction = (
    <Button
      text='Import Data'
      color='primary'
      variant='plain'
      content='iconText'
      icon='tabler:file-import'
      onClick={() => setShowModalImport(true)}
      disabled={showModalImport}
    />
  )

  return (
    <>
      <PagePrimary<GetTableUsersResponse['data'][number]>
        title='Manage User'
        action={{
          label: 'Create User',
          content: 'iconText',
          icon: 'ic:baseline-add',
          href: '/core/user/add',
          modalProps: {
            title: 'Import Data for User',
            description: 'File should be match with this template. See Template',
            renderAction: false
          }
        }}
        columns={COLUMNS}
        dataFetchService={fetchTableUserCollapsed}
        filters={filterControllers}
        renderActionButton={renderActionButton}
        renderTopBarAction={renderTopBarAction}
        modalOpen={showModalImport}
        setModalOpen={setShowModalImport}
        isCollapsed={true}
        groupFieldKeyTitle='name'
        groupName='user'
      />
      {userAlert.pathname === router.pathname && userAlert.open ? (
        <Box sx={{ position: 'absolute', zIndex: 9999, top: 80, right: 0 }}>
          <Alert
            content={userAlert.content}
            variant={userAlert.variant ?? 'primary'}
            title={userAlert.title}
            size={userAlert.size ?? 'small'}
          />
        </Box>
      ) : null}
    </>
  )
}
