import NextLink from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useParams } from 'react-router-dom'

import { useTheme } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'

import Icon from 'src/@core/components/icon'
import { Button } from '@/components/atoms'
import { Breadcrumbs } from '@/components/atoms/breadcrumbs'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Modal as ModalConfirm } from 'src/components/atoms/modal/Modal'

import { ModalDialog } from '@/components/molecules/modal-dialog'
import { Modal } from '@/components/molecules'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { AddEditRole, addEditRole } from '../validations'

import InfoRole from './InfoRole'
import InfoStatus from './InfoStatus'
import InfoUser from './InfoUser'
import AddRoleForm from './AddRoleForm'

import { queryClient } from '@/pages/_app'
import { useAtom } from 'jotai'
import { ROLEALERT } from '../constant'

import { useDeleteRole } from '../services/actionDeleteRole.service'
import { useUpdateRole } from '../services/actionUpdateRole.service'
import { useGetRole } from '../services/fetchRole.service'


export default function ManageRoleDetailPage() {
  const theme = useTheme()
  const router = useRouter()
  const { id: roleId } = useParams()
  const currId = router.query.id || roleId

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [confirmEditModalOpen, setConfirmEditModalOpen] = useState(false)
  const [_, setAlert] = useAtom(ROLEALERT)

  const {
    data: role,
    isInitialLoading,
    isError,
    isSuccess
  } = useGetRole({ id: currId as string, enabled: router.isReady })

  const form = useForm<AddEditRole>({
    resolver: yupResolver(addEditRole),
    defaultValues: {
      parent: null
    }
  })

  const deleteRole = useDeleteRole()
  const updateMutation = useUpdateRole(currId as string)

  async function onEditSubmitConfirm() {
    try {
      const data = form.getValues()
      await updateMutation.mutateAsync(data)
      await queryClient.invalidateQueries()

      setConfirmEditModalOpen(false)

      setAlert({
        title: 'Edit Successful',
        content: 'Your role was success to edited',
        size: 'small',
        pathname: '/core/role',
        variant: 'success',
        open: true
      })

      router.push('/core/role')

      updateMutation.reset()
    } catch {
      setConfirmEditModalOpen(false)

      setAlert({
        title: 'Edit Failed',
        content: 'Your role was failed to edited',
        size: 'small',
        pathname: '/core/role',
        variant: 'danger',
        open: true
      })
    }
  }

  return (
    <main>
      <Link component={NextLink} href='/core/role' sx={{ display: 'flex', alignItems: 'center', marginY: '12px' }}>
        <Icon icon='ic:arrow-back' style={{ color: theme.palette.primary.main }} fontSize='20px' /> Back
      </Link>
      <MvTypography size='TITLE_MD' typeSize='PX'>
        Detail Role
      </MvTypography>

      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Breadcrumbs
          data={[
            {
              icon: 'tabler:briefcase',
              label: 'Manage Role',
              path: '/core/role'
            },
            {
              label: 'Detail Role',
              path: '/core/role/' + currId
            }
          ]}
        />

        <Stack direction='row' gap={3}>
          <Button
            variant='outlined'
            content='iconText'
            text='Delete'
            icon='fluent:delete-12-regular'
            color='error'
            onClick={() => setIsDeleteModalOpen(true)}
            sx={{ paddingX: 3 }}
          />
          <Button
            variant='outlined'
            content='iconText'
            text='Edit'
            onClick={() => setEditModalOpen(true)}
            icon='fluent:edit-12-regular'
            color='primary'
            sx={{ paddingX: 3 }}
          />
        </Stack>
      </Stack>

      {!router.isReady || isInitialLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : null}

      {isError ? (
        <MvTypography size='BODY_MD_NORMAL' typeSize='PX' sx={{ textAlign: 'center' }}>
          Something went wrong. Please try again later
        </MvTypography>
      ) : null}

      {isSuccess ? (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '24.5px', gap: '24px' }}>
          <InfoRole
            title='General Information'
            fields={[
              { label: 'Code', value: role.data.code ?? '-' },
              { label: 'Name', value: role.data.name ?? '-' },
              { label: 'Role Parent', value: role.data.parent?.name ?? '-' },
              { label: 'Description', value: role.data.description ?? '-' }
            ]}
          />
          <InfoStatus statusActive={role.data.is_active} />
          <InfoUser currId={currId} title='Detail user' />
        </div>
      ) : null}
      <ModalDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        closeable
        loading={deleteRole.isPending}
        title='Are you sure to delete role?'
        description="You won't be able to revert this!"
        positiveLabel='Yes'
        statusVariant='danger'
        typeVariant='confirmation'
        onOk={async () => {
          setIsDeleteModalOpen(false)
          try {
            await deleteRole.mutateAsync({ id: currId as string })

            setAlert({
              title: 'Successfully delete data.',
              content: 'Role has been deleted by our system.',
              size: 'small',
              variant: 'success',
              pathname: '/core/role',
              open: true
            })

            router.push('/core/role')
          } catch {
            setAlert({
              title: 'Network Errors',
              content: 'Unable to connect to the network or server',
              size: 'small',
              variant: 'danger',
              pathname: '/core/role',
              open: true
            })
          }

          deleteRole.reset()
        }}
      />
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        type={'default'}
        positiveLabel={'Confirm'}
        negativeLabel={'Cancel'}
        title={'Edit Role'}
        description={'Please fill these information to edit'}
        onOk={() => {
          setEditModalOpen(false)
          setConfirmEditModalOpen(true)
        }}
        status={'default'}
        loading={updateMutation.isPending}
      >
        <AddRoleForm form={form} mode='edit' fields={role?.data} />
      </Modal>
      <ModalConfirm
        isOpen={confirmEditModalOpen}
        onClose={() => {
          setConfirmEditModalOpen(false)
          setEditModalOpen(true)
        }}
        variant='warning'
        loading={(updateMutation.isPending || updateMutation.isSuccess) && !updateMutation.isPaused}
        positiveLabel='Yes'
        title='Are you sure you want to edit this role?'
        onOk={onEditSubmitConfirm}
      />
    </main>
  )
}
