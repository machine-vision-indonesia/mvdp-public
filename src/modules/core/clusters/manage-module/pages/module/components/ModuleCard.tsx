import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { yupResolver } from '@hookform/resolvers/yup'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useState, memo } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import client from 'src/client'
import { Button } from 'src/components/atoms/button'
import { CircularProgress } from 'src/components/atoms/circular-progress/CircularProgress'
import { type Status } from 'src/types/directus/general'
import {
  AssignToRoleSchema,
  ModifiedModule,
  ModifiedPage,
  Page,
  Role
} from '@/modules/core/clusters/manage-module/pages/module/types/ManageModulePage.types'
import { assignToRoleSchema } from '@/modules/core/clusters/manage-module/pages/module/validations'
import { ModuleTabPanel } from '@/modules/core/clusters/manage-module/pages/module/components/ModuleTabPanel'
import {
  getCapabilityRoles,
  getModulesAndGeneralPages,
  useGetRoles
} from '@/modules/core/clusters/manage-module/pages/module/services/fetchManageModule.service'
import { useDeleteCapabilities } from '@/modules/core/clusters/manage-module/pages/module/services/actionDeleteManageModule.service'
import { useUpdateModuleOrders } from '@/modules/core/clusters/manage-module/pages/module/services/actionUpdateManageModule.service'
import { ClusterCard } from '@/modules/core/clusters/manage-module/pages/module/components/ClusterCard'
import {
  createClusterModalOpenAtom,
  debouncedSearchAtom,
  deleteModuleModalOpenAtom,
  editModuleModalOpenAtom,
  selectedGeneralPageIdAtom,
  selectedModuleIdAtom
} from '../atoms'
import { MvTypography } from '@/components/atoms/mv-typography'

const isModifiedPage = (mod: ModifiedModule | ModifiedPage): mod is ModifiedPage => mod.additional_type === 'page'

type ModuleCardProps = {
  module: ModifiedModule
}

const getAutocompleteRoleData = (roles: Role[]) => {
  return roles.map(role => ({
    id: role.id,
    label: role.name
  }))
}

type CapabilityCreateData = {
  role: Role['id']
  page: Page['id']
  create: boolean
  update: boolean
  delete: boolean
  status: Status
}

function useCreateCapabilities() {
  return useMutation({
    mutationFn: async (capabilities: CapabilityCreateData[]) => client.api.post('/items/mt_capabilities', capabilities)
  })
}

export const ModuleCard = memo((props: ModuleCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.module.id })
  const queryClient = useQueryClient()
  const [tabValue, setTabValue] = useState(0)
  const [collapse, setCollapse] = useState(false)
  const [, setCreateClusterModalOpen] = useAtom(createClusterModalOpenAtom)
  const [selectedModuleId, setSelectedModuleId] = useAtom(selectedModuleIdAtom)
  const [, setEditModuleModalOpen] = useAtom(editModuleModalOpenAtom)
  const [, setDeleteModuleModalOpen] = useAtom(deleteModuleModalOpenAtom)
  const [selectedGeneralPageId] = useAtom(selectedGeneralPageIdAtom)
  const [selectedRoles, setSelectedRoles] = useState<(Pick<Role, 'id'> & { label: Role['name'] })[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [debouncedSearch] = useAtom(debouncedSearchAtom)

  const [content, setContent] = useState<'default' | 'assign_to_role'>('default')

  const assignToRoleForm = useForm<AssignToRoleSchema>({
    resolver: yupResolver(assignToRoleSchema)
  })

  const { append, fields, remove } = useFieldArray({
    control: assignToRoleForm.control,
    name: 'rows'
  })

  const getRolesQuery = useGetRoles({ moduleId: selectedModuleId, generalPageId: selectedGeneralPageId, content })

  const getCapabilityRolesQuery = useQuery({
    queryKey: ['capability_roles', { moduleId: selectedModuleId }],
    queryFn: () => getCapabilityRoles({ moduleId: selectedModuleId }),
    enabled: selectedModuleId !== null && content === 'assign_to_role'
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    if (!getCapabilityRolesQuery.isSuccess) {
      return
    }

    const roles = getCapabilityRolesQuery.data
      .filter((capability, index, self) => self.findIndex(c => c.role.id === capability.role.id) === index)
      .map(capability => ({
        id: capability.role.id,
        label: capability.role.name
      }))

    setSelectedRoles(roles)

    if (props.module.id === selectedModuleId) {
      for (const role of roles) {
        const pages = props.module.clusters.flatMap(cluster => cluster.pages.map(page => ({ ...page, cluster })))

        append({
          role: {
            id: role.id,
            name: role.label
          },
          capabilities: pages.map(page => {
            const relatedCapability = page.capabilities.find(capability => capability.role === role.id)
            if (relatedCapability) {
              return {
                cluster: {
                  id: page.cluster.id,
                  name: page.cluster.name
                },
                page: {
                  id: page.id,
                  name: page.name
                },
                create: relatedCapability.create,
                update: relatedCapability.update,
                delete: relatedCapability.delete
              }
            }
            useCreateCapabilities

            return {
              cluster: {
                id: page.cluster.id,
                name: page.cluster.name
              },
              page: {
                id: page.id,
                name: page.name
              },
              create: false,
              update: false,
              delete: false
            }
          })
        })
      }
    }
  }, [
    getCapabilityRolesQuery.data,
    getCapabilityRolesQuery.isSuccess,
    append,
    props.module.clusters,
    props.module.id,
    selectedModuleId
  ])

  const createCapabilitiesMutation = useCreateCapabilities()

  const deleteCapabilitiesMutation = useDeleteCapabilities()

  const updateModuleOrdersMutation = useUpdateModuleOrders()

  const onSubmit = async (data: AssignToRoleSchema) => {
    try {
      if (!data.rows || !selectedModuleId) {
        return
      }

      const prevCapabilityIds = props.module.clusters
        .flatMap(cluster => cluster.pages.map(page => ({ ...page, cluster })))
        .flatMap(page => page.capabilities)
        .map(capability => capability.id)

      if (prevCapabilityIds.length) {
        await deleteCapabilitiesMutation.mutateAsync(prevCapabilityIds)
      }

      const capabilities: CapabilityCreateData[] = []
      for (const row of data.rows) {
        if (!row.capabilities) {
          continue
        }

        for (const capability of row.capabilities) {
          capabilities.push({
            role: row.role.id,
            page: capability.page.id,
            create: capability.create,
            update: capability.update,
            delete: capability.delete,
            status: 'published'
          })
        }
      }

      if (capabilities.length) {
        await createCapabilitiesMutation.mutateAsync(capabilities)
      }

      await queryClient.invalidateQueries()
      setSelectedModuleId(null)
      setContent('default')
      assignToRoleForm.reset({
        rows: []
      })
    } catch { }
  }

  const onDragger = useCallback((event: DragEndEvent) => {
    if (event.active.id !== event.over?.id) {
      const from = props.module.clusters.findIndex(cluster => cluster.id === event.active.id)
      const to = props.module.clusters.findIndex(cluster => cluster.id === event.over?.id)

      const newClusters = arrayMove(props.module.clusters, from, to).map((cluster, index) => ({
        ...cluster,
        order: index + 1
      }))

      const modules = queryClient.getQueryData<Awaited<ReturnType<typeof getModulesAndGeneralPages>>>(['modules'])
      if (!modules) {
        return
      }

      const newModules = modules.map(mod => {
        if (isModifiedPage(mod)) {
          return mod
        }

        if (mod.id !== props.module.id) {
          return mod
        }

        return {
          ...mod,
          clusters: newClusters
        }
      })

      updateModuleOrdersMutation.mutate(
        {
          data: newModules,
          search: debouncedSearch
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries()
          }
        }
      )
    }
  }, [])

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
          {content === 'default' ? (
            <>
              <Icon icon='mdi:drag' />
              <Button
                variant='outlined'
                onClick={() => setCollapse(prev => !prev)}
                content='iconOnly'
                icon={collapse ? 'tabler:chevron-up' : 'tabler:chevron-down'}
              />
            </>
          ) : null}
          <MvTypography typeSize='PX' size='BODY_MD_NORMAL'>
            {props.module.name} module
          </MvTypography>
        </Box>
        {content === 'default' ? (
          <Button
            variant='plain'
            aria-controls={`menu-${props.module.id}`}
            aria-haspopup='true'
            onClick={event => setAnchorEl(event.currentTarget)}
            content='iconOnly'
            icon='tabler:dots-vertical'
          />
        ) : null}
        <Menu
          keepMounted
          id={`menu-${props.module.id}`}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          open={Boolean(anchorEl)}
        >
          <MenuItem disabled>Preview Sidebar</MenuItem>
          <MenuItem
            onClick={() => {
              setSelectedModuleId(props.module.id)
              setContent('assign_to_role')
              setAnchorEl(null)
            }}
          >
            Assign to Role
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSelectedModuleId(props.module.id)
              setEditModuleModalOpen(true)
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => {
              setSelectedModuleId(props.module.id)
              setDeleteModuleModalOpen(true)
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
      {content === 'default' ? (
        <Collapse in={collapse} sx={{ pr: 6, pl: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', rowGap: 4 }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={event => onDragger(event)}>
              <SortableContext items={props.module.clusters} strategy={verticalListSortingStrategy}>
                {props.module.clusters.map(cluster => (
                  <ClusterCard key={cluster.id} cluster={cluster} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
          <Button
            size='medium'
            startIcon={<Icon fontSize='16px' icon='tabler:plus' />}
            onClick={() => {
              setSelectedModuleId(props.module.id)
              setCreateClusterModalOpen(true)
            }}
            sx={{ my: 4, ml: 8 }}
            content='textOnly'
            text='Add Cluster'
          />
        </Collapse>
      ) : null}
      {content === 'assign_to_role' && selectedModuleId === props.module.id ? (
        <>
          {getRolesQuery.isPending || getCapabilityRolesQuery.isPending ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
              <CircularProgress />
            </Box>
          ) : null}

          {getRolesQuery.isError || getCapabilityRolesQuery.isError ? (
            <MvTypography typeSize='PX' size='BODY_MD_NORMAL' sx={{ mb: 6, textAlign: 'center' }}>
              Something went wrong. Please try again later
            </MvTypography>
          ) : null}

          {getRolesQuery.isSuccess && getCapabilityRolesQuery.isSuccess ? (
            <FormProvider {...assignToRoleForm}>
              <Box sx={{ px: 6, mb: 6 }}>
                <form onSubmit={assignToRoleForm.handleSubmit(onSubmit)}>
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

                        const pages = props.module.clusters.flatMap(cluster =>
                          cluster.pages.map(page => ({ ...page, cluster }))
                        )
                        append({
                          role: {
                            id: newRole.id,
                            name: newRole.label
                          },
                          capabilities: pages.map(page => {
                            const relatedCapability = page.capabilities.find(
                              capability => capability.role === newRole.id
                            )
                            if (relatedCapability) {
                              return {
                                cluster: {
                                  id: page.cluster.id,
                                  name: page.cluster.name
                                },
                                page: {
                                  id: page.id,
                                  name: page.name
                                },
                                create: relatedCapability.create,
                                update: relatedCapability.update,
                                delete: relatedCapability.delete
                              }
                            }

                            return {
                              cluster: {
                                id: page.cluster.id,
                                name: page.cluster.name
                              },
                              page: {
                                id: page.id,
                                name: page.name
                              },
                              create: false,
                              update: false,
                              delete: false
                            }
                          })
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
                        <ModuleTabPanel key={field.id} value={tabValue} index={index} />
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
                        setSelectedModuleId(null)
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
                      color='primary'
                      disabled={assignToRoleForm.formState.isLoading || assignToRoleForm.formState.isSubmitSuccessful}
                      loading={assignToRoleForm.formState.isLoading || assignToRoleForm.formState.isSubmitSuccessful}
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
