import React, { useCallback, useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Icon from 'src/@core/components/icon'
import { Button } from 'src/components/atoms/button'
import { CircularProgress } from 'src/components/atoms/circular-progress/CircularProgress'
import { MvTypography } from '@/components/atoms/mv-typography'
import {
  createPageModalOpenAtom,
  debouncedSearchAtom,
} from '../atoms'
import { ModuleCard } from './ModuleCard'
import { GeneralPageCard } from './GeneralPageCard'
import { useUpdateModuleOrders } from '../services/actionUpdateManageModule.service'
import { getModulesAndGeneralPages } from '../services/fetchManageModule.service'
import dynamic from 'next/dynamic'

const ModalManageModule = dynamic(() => import('./ModalManageModule'), { ssr: false })

const ModulePage = () => {
  const queryClient = useQueryClient()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [loaderDragger, setLoaderDragger] = useState(false)
  const [createModuleModalOpen, setCreateModuleModalOpen] = useState(false)
  const [, setCreatePageModalOpen] = useAtom(createPageModalOpenAtom)
  const [debouncedSearch] = useAtom(debouncedSearchAtom)

  const updateModuleOrdersMutation = useUpdateModuleOrders()

  const { data: modulesAndPages, isLoading, isError } = useQuery({
    queryKey: ['modulesAndPages', debouncedSearch],
    queryFn: () => getModulesAndGeneralPages(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const memoizedModulesAndPages = useMemo(() => modulesAndPages || [], [modulesAndPages])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setLoaderDragger(true)

    if (active.id !== over?.id) {
      const oldIndex = memoizedModulesAndPages && memoizedModulesAndPages.findIndex(item => item.id === active.id)
      const newIndex = memoizedModulesAndPages && memoizedModulesAndPages.findIndex(item => item.id === over?.id)

      const newOrder = memoizedModulesAndPages && arrayMove(memoizedModulesAndPages, oldIndex, newIndex)
      const updatedOrder = newOrder && newOrder.map((item, index) => ({ ...item, order: index + 1 }))

      updateModuleOrdersMutation.mutate(
        { data: updatedOrder, search: debouncedSearch },
        {
          onSuccess: () => {
            queryClient.setQueryData(['modulesAndPages', debouncedSearch], updatedOrder)
            setLoaderDragger(false)
          },
          onError: () => {
            setLoaderDragger(false)
          }
        }
      )
    } else {
      setLoaderDragger(false)
    }
  }, [memoizedModulesAndPages, updateModuleOrdersMutation, debouncedSearch, queryClient])

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      )
    }

    if (isError) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <MvTypography typeSize='PX' size='BODY_MD_NORMAL'>
            Something went wrong. Please try to refresh the page
          </MvTypography>
        </Box>
      )
    }

    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={memoizedModulesAndPages} strategy={verticalListSortingStrategy}>
          {memoizedModulesAndPages && memoizedModulesAndPages.map(item =>
            item.additional_type === 'module' ? (
              <ModuleCard key={item.id} module={item} />
            ) : (
              <GeneralPageCard key={item.id} page={item} />
            )
          )}
        </SortableContext>
      </DndContext>
    )
  }, [isLoading, isError, memoizedModulesAndPages, handleDragEnd])

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', columnGap: 2 }}>
          <Button
            variant='contained'
            size='medium'
            aria-controls='add-menu'
            aria-haspopup='true'
            onClick={event => setAnchorEl(event.currentTarget)}
            endIcon={<Icon icon='tabler:chevron-down' />}
            content='textOnly'
            text='Add New...'
          />
          <Menu
            keepMounted
            id='add-menu'
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            open={Boolean(anchorEl)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => setCreateModuleModalOpen(true)}>Module</MenuItem>
            <MenuItem onClick={() => setCreatePageModalOpen(true)}>General Page</MenuItem>
          </Menu>
        </Box>
        {loaderDragger ? (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 9998
            }}
          >
            <Box
              sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CircularProgress />
            </Box>
          </Box>
        ) : null}
        {renderContent}
      </Box>
      <ModalManageModule
        createModuleModalOpen={createModuleModalOpen}
        setCreateModuleModalOpen={setCreateModuleModalOpen}
      />
    </>
  )
}

export default React.memo(ModulePage)
