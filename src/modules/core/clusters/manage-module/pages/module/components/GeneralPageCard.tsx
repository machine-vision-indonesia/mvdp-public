import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { yupResolver } from '@hookform/resolvers/yup'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MuiCheckbox from '@mui/material/Checkbox'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import { useAtom } from 'jotai'
import { useEffect, useState, memo } from 'react'
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { Button } from 'src/components/atoms/button'
import { CircularProgress } from 'src/components/atoms/circular-progress/CircularProgress'
import {
  AssignToRoleGeneralPageSchema,
  CapabilityCreateData,
  GeneralPageCardProps,
  Role
} from '@/modules/core/clusters/manage-module/pages/module/types/ManageModulePage.types'
import { assignToRoleGeneralPageSchema } from '@/modules/core/clusters/manage-module/pages/module/validations'
import {
  useGetCapabilitiesByPageIdQuery,
  useGetRoles
} from '@/modules/core/clusters/manage-module/pages/module/services/fetchManageModule.service'
import { useDeleteCapabilities } from '@/modules/core/clusters/manage-module/pages/module/services/actionDeleteManageModule.service'
import { queryClient } from '@/pages/_app'
import { useCreateCapabilities } from '../services/actionAddManageModule.service'
import {
  deletePageModalOpenAtom,
  editPageModalOpenAtom,
  selectedGeneralPageIdAtom,
  selectedModuleIdAtom,
  selectedPageIdAtom
} from '../atoms'
import { MvTypography } from '@/components/atoms/mv-typography'

export const GeneralPageCard = memo((props: GeneralPageCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.page.id })
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [, setEditPageModalOpen] = useAtom(editPageModalOpenAtom)
  const [, setDeletePageModalOpen] = useAtom(deletePageModalOpenAtom)
  const [, setSelectedPageId] = useAtom(selectedPageIdAtom)
  const [content, setContent] = useState<'default' | 'assign_to_role'>('default')
  const [selectedModuleId] = useAtom(selectedModuleIdAtom)
  const [selectedGeneralPageId, setSelectedGeneralPageId] = useAtom(selectedGeneralPageIdAtom)
  const getRolesQuery = useGetRoles({ moduleId: selectedModuleId, generalPageId: selectedGeneralPageId, content })
  const [selectedRoles, setSelectedRoles] = useState<(Pick<Role, 'id'> & { label: Role['name'] })[]>([])
  const [tabValue, setTabValue] = useState(0)

  const assignToRoleForm = useForm<AssignToRoleGeneralPageSchema>({
    resolver: yupResolver(assignToRoleGeneralPageSchema)
  })

  const { append, fields, remove } = useFieldArray({
    control: assignToRoleForm.control,
    name: 'rows'
  })

  const deleteCapabilitiesMutation = useDeleteCapabilities()

  const createCapabilitiesMutation = useCreateCapabilities()

  const getCapabilitiesByPageIdQuery = useGetCapabilitiesByPageIdQuery(selectedGeneralPageId)

  const onAssignToRoleSubmit = async (data: AssignToRoleGeneralPageSchema) => {
    try {
      if (!data.rows || !selectedGeneralPageId) {
        return
      }

      const prevCapabilityIds = props.page.capabilities.map(capability => capability.id)

      if (prevCapabilityIds.length) {
        await deleteCapabilitiesMutation.mutateAsync(prevCapabilityIds)
      }

      const capabilities: CapabilityCreateData[] = []
      for (const row of data.rows) {
        capabilities.push({
          role: row.role.id,
          page: selectedGeneralPageId,
          create: row.create,
          update: row.update,
          delete: row.delete,
          status: 'published'
        })
      }

      if (capabilities.length) {
        await createCapabilitiesMutation.mutateAsync(capabilities)
      }

      await queryClient.invalidateQueries()
      setSelectedGeneralPageId(null)
      setContent('default')
      assignToRoleForm.reset({
        rows: []
      })
    } catch { }
  }

  useEffect(() => {
    if (!getCapabilitiesByPageIdQuery.isSuccess) {
      return
    }

    const roles = getCapabilitiesByPageIdQuery.data
      .filter((capability, index, self) => self.findIndex(c => c.role.id === capability.role.id) === index)
      .map(capability => ({
        id: capability.role.id,
        label: capability.role.name
      }))

    setSelectedRoles(roles)

    if (props.page.id === selectedGeneralPageId) {
      for (const role of roles) {
        const relatedCapability = props.page.capabilities.find(capability => capability.role === role.id)

        if (relatedCapability) {
          append({
            role: {
              id: role.id,
              name: role.label
            },
            create: relatedCapability.create,
            update: relatedCapability.update,
            delete: relatedCapability.delete
          })
        }
      }
    }
  }, [
    append,
    getCapabilitiesByPageIdQuery.data,
    getCapabilitiesByPageIdQuery.isSuccess,
    props.page.capabilities,
    props.page.id,
    selectedGeneralPageId
  ])

  const getAutocompleteRoleData = (roles: Role[]) => {
    return roles.map(role => ({
      id: role.id,
      label: role.name
    }))
  }

  return (
    <Card
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
        cursor: 'pointer'
      }}
      {...attributes}
      {...listeners}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2 }}>
          {content === 'default' ? <Icon icon='mdi:drag' /> : null}
          <MvTypography typeSize='PX' size='BODY_MD_NORMAL'>
            {props.page.name}
          </MvTypography>
        </Box>
        {content === 'default' ? (
          <Button
            variant='text'
            aria-controls={`general-page-${props.page.id}-menu`}
            aria-haspopup='true'
            onClick={event => setAnchorEl(event.currentTarget)}
            content='iconOnly'
            icon='tabler:dots-vertical'
          />
        ) : null}
        <Menu
          keepMounted
          id={`general-page-${props.page.id}-menu`}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          open={Boolean(anchorEl)}
        >
          <MenuItem
            onClick={() => {
              setSelectedGeneralPageId(props.page.id)
              setContent('assign_to_role')
              setAnchorEl(null)
            }}
          >
            Assign to Role
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSelectedPageId(props.page.id)
              setEditPageModalOpen(true)
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => {
              setSelectedPageId(props.page.id)
              setDeletePageModalOpen(true)
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
      {content === 'assign_to_role' ? (
        <>
          {getRolesQuery.isPending || getCapabilitiesByPageIdQuery.isPending ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
              <CircularProgress />
            </Box>
          ) : null}

          {getRolesQuery.isError || getCapabilitiesByPageIdQuery.isError ? (
            <MvTypography typeSize='PX' size='BODY_MD_NORMAL' sx={{ mb: 6, textAlign: 'center' }}>
              Something went wrong. Please try again later
            </MvTypography>
          ) : null}

          {getRolesQuery.isSuccess && getCapabilitiesByPageIdQuery.isSuccess ? (
            <FormProvider {...assignToRoleForm}>
              <Box sx={{ px: 6, mb: 6 }}>
                <form onSubmit={assignToRoleForm.handleSubmit(onAssignToRoleSubmit)}>
                  <Box>
                    <label htmlFor='roles'>Choose roles</label>
                    <Autocomplete<ReturnType<typeof getAutocompleteRoleData>[number], true>
                      options={getAutocompleteRoleData(getRolesQuery.data.data)}
                      size='small'
                      multiple
                      id='roles'
                      sx={{ mt: 1 }}
                      value={selectedRoles}
                      onChange={(_, roles) => {
                        setSelectedRoles(roles)
                        if (roles.length === 0) {
                          remove(0)

                          return
                        }

                        if (roles.length < selectedRoles.length) {
                          const roleIds = roles.map(role => role.id)
                          const removedRole = selectedRoles.find(role => !roleIds.includes(role.id))
                          if (!removedRole) {
                            return
                          }

                          const removedIndex = fields.findIndex(field => field.role.id === removedRole.id)
                          if (removedIndex === -1) {
                            return
                          }

                          remove(removedIndex)

                          return
                        }

                        const roleIds = selectedRoles.map(role => role.id)
                        const newRole = roles.find(role => !roleIds?.includes(role.id)) ?? roles[0]

                        const relatedCapability = props.page.capabilities.find(
                          capability => capability.role === newRole.id
                        )

                        if (relatedCapability) {
                          return append({
                            role: {
                              id: newRole.id,
                              name: newRole.label
                            },
                            create: relatedCapability.create,
                            update: relatedCapability.update,
                            delete: relatedCapability.delete
                          })
                        }

                        return append({
                          role: {
                            id: newRole.id,
                            name: newRole.label
                          },
                          create: false,
                          update: false,
                          delete: false
                        })
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={params => <TextField {...params} />}
                    />
                  </Box>

                  {fields.length ? (
                    <>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                          {fields.map(field => (
                            <Tab key={field.id} label={field.role.name} />
                          ))}
                        </Tabs>
                      </Box>
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          role='tabpanel'
                          hidden={tabValue !== index}
                          id={`assign-to-role-general-page-${field.id}-tabpanel`}
                        >
                          {tabValue === index ? (
                            <TableContainer component={Paper}>
                              <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Create</TableCell>
                                    <TableCell>Update</TableCell>
                                    <TableCell>Delete</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow key={field.id}>
                                    <TableCell>
                                      <Controller
                                        control={assignToRoleForm.control}
                                        name={`rows.${index}.create`}
                                        defaultValue={field.create}
                                        render={({ field }) => (
                                          <MuiCheckbox
                                            {...field}
                                            checked={field.value}
                                            onChange={e => field.onChange(e.target.checked)}
                                          />
                                        )}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Controller
                                        control={assignToRoleForm.control}
                                        name={`rows.${index}.update`}
                                        defaultValue={field.update}
                                        render={({ field }) => (
                                          <MuiCheckbox
                                            {...field}
                                            checked={field.value}
                                            onChange={e => field.onChange(e.target.checked)}
                                          />
                                        )}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Controller
                                        control={assignToRoleForm.control}
                                        name={`rows.${index}.delete`}
                                        defaultValue={field.delete}
                                        render={({ field }) => (
                                          <MuiCheckbox
                                            {...field}
                                            checked={field.value}
                                            onChange={e => field.onChange(e.target.checked)}
                                          />
                                        )}
                                      />
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : null}
                        </div>
                      ))}
                    </>
                  ) : null}

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 2,
                      my: 4,
                      justifyContent: 'end'
                    }}
                  >
                    <Button
                      type='button'
                      variant='outlined'
                      size='medium'
                      color='secondary'
                      content='textOnly'
                      text='Cancel'
                      onClick={() => {
                        setSelectedGeneralPageId(null)
                        setContent('default')
                        assignToRoleForm.reset({
                          rows: []
                        })
                      }}
                    />
                    <Button
                      type='submit'
                      size='medium'
                      variant='contained'
                      content='textOnly'
                      text='Save'
                      loading={assignToRoleForm.formState.isLoading || assignToRoleForm.formState.isSubmitSuccessful}
                      color='primary'
                      disabled={assignToRoleForm.formState.isLoading || assignToRoleForm.formState.isSubmitSuccessful}
                    />
                  </Box>
                </form>
              </Box>
            </FormProvider>
          ) : null}
        </>
      ) : null}
    </Card>
  )
})
