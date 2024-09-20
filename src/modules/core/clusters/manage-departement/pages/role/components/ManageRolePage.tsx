// ** React & Next Lib
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

// ** Mui Material
import { Box } from '@mui/material'
import { type GridRenderCellParams, type GridValueGetterParams } from '@mui/x-data-grid'

//  ** Atoms
import { Modal } from 'src/components/atoms/modal/Modal'
import { ActionButton, ActionItem, PagePrimary } from '@/components/templates/page-primary'

// ** Molecules
import { Alert } from '@/components/molecules/alert'

// ** Services
import { GetTableRoles, type GetTableRolesResponse } from '../service/list/GetTableRoles.service'
import { useDeleteRole } from '../services/actionDeleteRole.service'
import { fetchListRole } from '../services/fetchRole.service'
import { useUpdateRole } from '../services/actionUpdateRole.service'
import { usePostRole } from '../services/actionAddRole.service'

// ** Types & Validations
import { type AddEditRole, addEditRole } from '../validations'

// ** Constant
import { ROLEALERT } from '../constant'

// ** Utils
import { useAtom } from 'jotai'
import { checkExistingRole } from '../utils/checkExistingRole'
import { yupResolver } from '@hookform/resolvers/yup'
import { queryClient } from '@/pages/_app'
import AddRoleForm from './AddRoleForm'

export default function ManageRolePage() {
  // ** State Management
  const [alert, setAlert] = useAtom(ROLEALERT)

  const [idRole, setIdRole] = useState<NonNullable<string>>()
  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmEditModalOpen, setConfirmEditModalOpen] = useState(false)

  // ** Form Service & Mutation
  const createMutation = usePostRole()
  const updateMutation = useUpdateRole(idRole)
  const deleteRole = useDeleteRole()

  const form = useForm<AddEditRole>({
    resolver: yupResolver(addEditRole),
    defaultValues: {
      parent: null
    }
  })

  async function onAddSubmitConfirm() {
    try {
      const data = form.getValues()
      await createMutation.mutateAsync(data)
      await queryClient.invalidateQueries()

      setAddModalOpen(false)
      setConfirmModalOpen(false)

      setAlert({
        title: 'Submit Successful',
        content: 'Your role was success to submitted',
        size: 'small',
        pathname: '/core/role',
        variant: 'success',
        open: true
      })

      createMutation.reset()
      form.reset()
    } catch {
      setAddModalOpen(false)
      setConfirmModalOpen(false)

      setAlert({
        title: 'Submit Failed',
        content: 'Your role was failed to submitted',
        size: 'small',
        variant: 'danger',
        pathname: '/core/role',
        open: true
      })
    }
  }

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

  const onDeleteRow = async () => {
    try {
      if (!idRole) {
        return
      }

      await deleteRole.mutateAsync({
        id: idRole
      })

      await queryClient.invalidateQueries()

      setAlert({
        title: 'Delete Successful',
        content: 'Your role was success to deleted',
        size: 'small',
        pathname: '/core/role',
        variant: 'success',
        open: true
      })

      deleteRole.reset()
    } catch {
      setAlert({
        title: 'Delete Failed',
        content: 'Your role was failed to deleted',
        size: 'small',
        pathname: '/core/role',
        variant: 'danger',
        open: true
      })
    }
  }

  // ** Page Primary Props
  const CONTROLLER = [
    {
      key: 'code',
      name: 'Search Role',
      type: 'SEARCH'
    },
    {
      key: 'parent.name',
      name: 'Select Parent',
      type: 'MULTI_SELECT',
      dataFetchService: fetchListRole,
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
      searchable: true
    },
    {
      field: 'name',
      headerName: 'Role',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      searchable: true
    },
    {
      field: 'parent.name',
      headerName: 'Parent',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      searchable: true,
      valueGetter: (params: GridValueGetterParams<GetTableRolesResponse['data'][number]>) => {
        return params.row.parent?.name ?? '-'
      }
    },
    {
      field: 'count',
      headerName: 'Jumlah User',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      searchable: false,
      renderCell: (params: GridRenderCellParams<GetTableRolesResponse['data'][number]>) => {
        return `${params.row.count} users`
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
            isLink: false,
            action: () => {
              setIdRole(props.row.id)
            },

            modalProps: {
              title: 'Edit Role',
              description: 'Please fill these information to edit',
              onClick: () => {
                setConfirmEditModalOpen(true)
              }
            },
            renderContent: () => <AddRoleForm form={form} mode='edit' fields={props.row} />
          },
          {
            label: 'View',
            icon: 'ic:outline-remove-red-eye',
            color: 'primary.main',
            isLink: true,
            href: `/core/role/${props.row.id}`,
            action: () => {}
          },
          {
            label: 'Delete',
            icon: 'ic:outline-delete',
            color: 'error.main',
            isLink: false,
            action: () => {
              setIdRole(props.row.id)
            },
            modalProps: {
              title: 'Are you sure to delete Role?',
              description: `You won't be able to revert this!`,
              positiveLabel: 'Yes',
              status: 'danger',
              variant: 'confirmation',
              renderAction: true,
              isLoading: deleteRole.isPending,
              onClick: onDeleteRow
            }
          }
        ]}
        currentAction={currentAction}
        setCurrentAction={setCurrentAction}
      />
    </Box>
  )

  // ** Use Effect
  useEffect(() => {
    if (!alert.open) {
      return
    }

    window.scrollTo(0, 0)

    setTimeout(() => {
      setAlert({
        ...alert,
        open: false
      })
    }, 4000)
  }, [alert])

  return (
    <main>
      {alert.open ? (
        <Box sx={{ position: 'absolute', zIndex: 9999, top: 80, right: 0 }}>
          <Alert title={alert.title} size={alert.size} content={alert.content} variant={alert.variant} />
        </Box>
      ) : null}
      <PagePrimary<GetTableRolesResponse['data'][number]>
        action={{
          label: 'Create Role',
          modalProps: {
            title: 'Create Role',
            description: 'Please fill these information to create',
            onOk: async () => {
              await form.handleSubmit(async data => {
                const isExisting = await checkExistingRole(data.code, () => {
                  form.setError('code', {
                    type: 'manual',
                    message: 'Role Code already exists'
                  })
                })

                if (!isExisting) {
                  setConfirmModalOpen(true)
                }
              })()
            },
            positiveLabel: 'Submit',
            negativeLabel: 'Cancel'
          },
          modalContent: <AddRoleForm form={form} mode='add' />
        }}
        modalOpen={addModalOpen}
        setModalOpen={setAddModalOpen}
        title='Manage Roles'
        columns={COLUMNS}
        dataFetchService={GetTableRoles}
        filters={CONTROLLER}
        renderActionButton={renderActionButton}
      />

      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        variant='warning'
        loading={(createMutation.isPending || createMutation.isSuccess) && !createMutation.isPaused}
        positiveLabel='Yes'
        title='Are you sure you want to create this role?'
        onOk={onAddSubmitConfirm}
      />

      <Modal
        isOpen={confirmEditModalOpen}
        onClose={() => setConfirmEditModalOpen(false)}
        variant='warning'
        loading={(updateMutation.isPending || updateMutation.isSuccess) && !updateMutation.isPaused}
        positiveLabel='Yes'
        title='Are you sure you want to edit this role?'
        onOk={onEditSubmitConfirm}
      />
    </main>
  )
}
