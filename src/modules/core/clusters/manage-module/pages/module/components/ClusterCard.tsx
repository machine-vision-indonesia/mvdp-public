import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
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
import MuiCheckbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow, { type TableRowProps } from '@mui/material/TableRow'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { atom, useAtom } from 'jotai'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import client from 'src/client'
import { Button } from 'src/components/atoms/button'
import { Chip } from 'src/components/atoms/chip'
import { CircularProgress } from 'src/components/atoms/circular-progress/CircularProgress'
import { Input } from 'src/components/atoms/input'
import { Textarea } from 'src/components/atoms/textarea'
import { useDebounce } from 'src/hooks/useDebounce'
import { useGetProducts } from 'src/service/module/useGetProducts'
import { useUpdateMainPages } from 'src/service/module/useUpdateMainPage'
import { type Module as CurrentUserModule } from 'src/types/directus/current-user'
import { type Status } from 'src/types/directus/general'
import { isValidHttpUrl } from 'src/utils/general'
import * as yup from 'yup'
import { Capability, Cluster, ClusterCardProps, ClusterSchema, EditPageMutationFnParams, GetCapabilityRolesParams, GetCapabilityRolesResponse, GetModulesResponse, GetPagesResponse, GetRolesResponse, ModifiedModule, ModifiedPage, Module, ModuleSchema, Page, PageSchema, PagesQueryParams, Role } from '@/modules/core/clusters/manage-module/pages/module/types/ManageModulePage.types'
import { assignToRoleClusterSchema, assignToRolePageSchema, assignToRoleRoleSchema, clusterSchema, moduleSchema, pageSchema } from '@/modules/core/clusters/manage-module/pages/module/validations'
import { ModuleTabPanel } from '@/modules/core/clusters/manage-module/pages/module/components/ModuleTabPanel'
import { getCapabilityRoles, getGeneralPages, getModulesAndGeneralPages, useGetRoles } from '@/modules/core/clusters/manage-module/pages/module/services/fetchManageModule.service'
import { useUpdateModuleOrders } from '@/modules/core/clusters/manage-module/pages/module/services/actionUpdateManageModule.service'
import { SortableTableRow } from '@/modules/core/clusters/manage-module/pages/module/components/SortableRow'
import { MvTypography } from '@/components/atoms/mv-typography'
import { createPageModalOpenAtom, debouncedSearchAtom, deleteClusterModalOpenAtom, deletePageModalOpenAtom, detailPageModalOpenAtom, editClusterModalOpenAtom, editPageModalOpenAtom, selectedClusterIdAtom, selectedPageIdAtom } from '../atoms'

const isModifiedPage = (mod: ModifiedModule | ModifiedPage): mod is ModifiedPage => mod.additional_type === 'page'

export const ClusterCard = (props: ClusterCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.cluster.id })
  const [collapse, setCollapse] = useState(false)
  const [, setCreatePageModalOpen] = useAtom(createPageModalOpenAtom)
  const [, setSelectedClusterId] = useAtom(selectedClusterIdAtom)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [, setEditClusterModalOpen] = useAtom(editClusterModalOpenAtom)
  const [, setDeleteClusterModalOpen] = useAtom(deleteClusterModalOpenAtom)
  const [, setSelectedPageId] = useAtom(selectedPageIdAtom)
  const [, setEditPageModalOpen] = useAtom(editPageModalOpenAtom)
  const [, setDetailPageModalOpen] = useAtom(detailPageModalOpenAtom)

  const [, setDeletePageModalOpen] = useAtom(deletePageModalOpenAtom)
  const queryClient = useQueryClient()
  const [debouncedSearch] = useAtom(debouncedSearchAtom)

  const updateModuleOrdersMutation = useUpdateModuleOrders()

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

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          ml: 8,

          transform: CSS.Transform.toString(transform),
          transition,
          touchAction: 'none'
        }}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2, py: 3 }}>
          <Icon icon='mdi:drag' />
          <Button
            content='iconOnly'
            variant='outlined'
            icon={collapse ? 'tabler:chevron-up' : 'tabler:chevron-down'}
            onClick={() => setCollapse(prev => !prev)}
          />
          <MvTypography size='BODY_MD_NORMAL' typeSize='PX'>{props.cluster.name}</MvTypography>
        </Box>
        <Button
          variant='text'
          aria-controls={`menu-${props.cluster.id}`}
          aria-haspopup='true'
          content='iconOnly'
          icon='tabler:dots-vertical'
          onClick={event => setAnchorEl(event.currentTarget)}
        />
        <Menu
          keepMounted
          id={`menu-${props.cluster.id}`}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          open={Boolean(anchorEl)}
        >
          <MenuItem
            onClick={() => {
              setSelectedClusterId(props.cluster.id)
              setEditClusterModalOpen(true)
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => {
              setSelectedClusterId(props.cluster.id)
              setDeleteClusterModalOpen(true)
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </Box>
      <Collapse in={collapse}>
        <CardContent sx={{ pl: 20 }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={event => {
              if (event.active.id !== event.over?.id) {
                const from = props.cluster.pages.findIndex(page => page.id === event.active.id)
                const to = props.cluster.pages.findIndex(page => page.id === event.over?.id)

                const newPages = arrayMove(props.cluster.pages, from, to).map((page, index) => ({
                  ...page,
                  order: index + 1
                }))

                const modules = queryClient.getQueryData<Awaited<ReturnType<typeof getModulesAndGeneralPages>>>([
                  'modules'
                ])

                if (!modules) {
                  return
                }

                const newModules = modules.map(mod => {
                  if (isModifiedPage(mod)) {
                    return mod
                  }

                  if (mod.id !== props.cluster.module.id) {
                    return mod
                  }

                  const clusters = mod.clusters.map(cluster => {
                    if (cluster.id !== props.cluster.id) {
                      return cluster
                    }

                    cluster.pages = newPages

                    return cluster
                  })

                  return {
                    ...mod,
                    clusters
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
            }}
          >
            {props.cluster.pages.length ? (
              <SortableContext items={props.cluster.pages} strategy={verticalListSortingStrategy}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center'>DISPLAY NAME</TableCell>
                        <TableCell style={{ width: '1px', whiteSpace: 'nowrap' }}>TYPE</TableCell>
                        <TableCell align='center'>PRODUCTS</TableCell>
                        <TableCell align='center'>ACTIONS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.cluster.pages.map(page => (
                        <SortableTableRow sortableId={page.id} key={page.id}>
                          <TableCell style={{ paddingLeft: 0, lineHeight: 'normal' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span>
                                <Icon icon='mdi:drag' style={{ display: 'block' }} />
                              </span>
                              <span style={{ marginLeft: '1.5rem' }}>{page.name}</span>
                            </div>
                          </TableCell>
                          <TableCell style={{ width: '1px', whiteSpace: 'nowrap' }}>{page.type}</TableCell>
                          <TableCell>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                columnGap: '.7rem'
                              }}
                            >
                              {page.products.map(product => (
                                <Chip shape="rounded" onClick={() => { }} key={product.id} label={product.product.name} />
                              ))}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div
                              style={{
                                display: 'flex',
                                columnGap: '1.5rem',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Button
                                variant="plain"
                                sx={{
                                  aspectRatio: '1/1',
                                  minWidth: '26px',
                                  p: '4px'
                                }}
                                content='iconOnly'
                                icon='tabler:info-circle'
                                onClick={() => {
                                  setSelectedPageId(page.id)
                                  setDetailPageModalOpen(true)
                                }}
                              />
                              <Button
                                variant="plain"
                                sx={{
                                  aspectRatio: '1/1',
                                  minWidth: '26px',
                                  p: '4px'
                                }}
                                content='iconOnly'
                                icon='tabler:pencil'
                                onClick={() => {
                                  setSelectedPageId(page.id)
                                  setEditPageModalOpen(true)
                                }}
                              />
                              <Button
                                variant="plain"
                                sx={{
                                  aspectRatio: '1/1',
                                  minWidth: '26px',
                                  p: '4px',
                                  color: 'error.main'
                                }}
                                content='iconOnly'
                                icon='tabler:trash-filled'
                                onClick={() => {
                                  setSelectedPageId(page.id)
                                  setDeletePageModalOpen(true)
                                }}
                              />
                            </div>
                          </TableCell>
                        </SortableTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </SortableContext>
            ) : (
              <MvTypography size="BODY_MD_NORMAL" typeSize='PX' sx={{ textAlign: 'center', padding: '1rem 0' }}>
                No pages found
              </MvTypography>
            )}
          </DndContext>
          <Button
            sx={{ mt: 5 }}
            content='iconText'
            text='Add Page'
            icon='tabler:plus'
            onClick={() => {
              setSelectedClusterId(props.cluster.id)
              setCreatePageModalOpen(true)
            }}
            size='medium'
          />
        </CardContent>
      </Collapse>
    </>
  )
}
