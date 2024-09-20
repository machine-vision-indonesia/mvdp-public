import { useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import { useParams } from 'react-router-dom'

import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'

import { MvTypography } from '@/components/atoms/mv-typography'
import { Breadcrumbs } from '@/components/atoms/breadcrumbs'
import { ModalDialog } from '@/components/molecules/modal-dialog'
import Icon from 'src/@core/components/icon'
import { Button } from '@/components/atoms'

import NextLink from 'next/link'
import { useAtom } from 'jotai'
import { queryGraphicAlertAtom } from '../atoms'
import { useGetQueryGraphic } from '../services/fetchQueryGraphic.services'
import { InfoQueryGraphic } from './InfoQueryGraphic'
import { useDeleteQueryGraphic } from '../services/actionDeleteQueryGraphic.services'

export function ManageQueryGraphicDetailPage() {
  const theme = useTheme()
  const router = useRouter()
  const { id: userId } = useParams()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [_, setQueryGraphicAlert] = useAtom(queryGraphicAlertAtom)

  const currId = router.query.id || userId

  // Services
  const queryGraphic = useGetQueryGraphic({ id: currId as string, enabled: router.isReady })
  const deleteQueryGraphic = useDeleteQueryGraphic()

  return (
    <main>
      <Link
        component={NextLink}
        href='/core/query-graphic'
        sx={{ display: 'flex', alignItems: 'center', marginY: '12px' }}
      >
        <Icon icon='ic:arrow-back' style={{ color: theme.palette.primary.main }} fontSize='20px' /> Back
      </Link>
      <MvTypography size='TITLE_MD' typeSize='PX'>
        Detail Job Function
      </MvTypography>

      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Breadcrumbs
          data={[
            {
              icon: 'tabler:briefcase',
              label: 'Manage Job Function',
              path: '/core/query-graphic'
            },
            {
              label: 'Detail Job Function',
              path: '/core/query-graphic/' + currId
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
          <Link
            component={NextLink}
            href={`/core/query-graphic/${currId}/edit`}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Button
              variant='outlined'
              content='iconText'
              text='Edit'
              icon='fluent:edit-12-regular'
              color='primary'
              sx={{ paddingX: 3 }}
            />
          </Link>
        </Stack>
      </Stack>
      {!router.isReady || queryGraphic.isInitialLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : null}
      {queryGraphic.isError ? (
        <MvTypography size='BODY_MD_NORMAL' typeSize='PX' sx={{ textAlign: 'center' }}>
          Something went wrong. Please try again later
        </MvTypography>
      ) : null}

      {queryGraphic.isSuccess ? (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '24.5px', gap: '24px' }}>
          <InfoQueryGraphic
            title='General Information'
            fields={[
              { label: 'Code', value: queryGraphic.data.data.code ?? '-' },
              { label: 'Product', value: queryGraphic.data.data.product ?? '-' },
              { label: 'Page', value: queryGraphic.data.data.page ?? '-' },
              { label: 'Name', value: queryGraphic.data.data.name ?? '-' },
              { label: 'Query', value: queryGraphic.data.data.query ?? '-', flexBasis: '100%' },
              { label: 'Parameters', value: queryGraphic.data.data.parameters ?? '-', flexBasis: '100%' }
            ]}
          />
        </div>
      ) : null}

      <ModalDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        closeable
        title='Delete this core query?'
        description='It might be used and related to existing data. Deleted data could not be restore'
        positiveLabel='Yes, delete it.'
        statusVariant='danger'
        typeVariant='confirmation'
        loading={deleteQueryGraphic.isPending}
        onOk={async () => {
          try {
            await deleteQueryGraphic.mutateAsync({ id: currId as string })

            setQueryGraphicAlert({
              title: 'Successfully delete data.',
              content: 'Query Graphic has been deleted by our system.',
              size: 'small',
              variant: 'success',
              pathname: '/core/query-graphic',
              open: true
            })

            setIsDeleteModalOpen(false)
            router.push('/core/query-graphic')
          } catch {
            setQueryGraphicAlert({
              title: 'Network Errors',
              content: 'Unable to connect to the network or server',
              size: 'small',
              variant: 'danger',
              pathname: `/core/query-graphic/${currId}`,
              open: true
            })
          }

          deleteQueryGraphic.reset()
        }}
      />
    </main>
  )
}
