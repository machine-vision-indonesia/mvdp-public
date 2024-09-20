import { useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import { useGetUser } from '@/modules/core/clusters/md-user/pages/user/services/fetchDetailUser.service'
import { useParams } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'

import { MvTypography } from '@/components/atoms/mv-typography'
import { Breadcrumbs } from '@/components/atoms/breadcrumbs'
import { ModalDialog } from '@/components/molecules/modal-dialog'
import Icon from 'src/@core/components/icon'
import { Button } from '@/components/atoms'
import { Badge } from '@/components/atoms/badge'

import NextLink from 'next/link'
import InfoJobLevel from './InfoJobLevel'

export default function ManageJobLevelDetailPage() {
  const theme = useTheme()
  const router = useRouter()
  const { id: userId } = useParams()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const currId = router.query.id || userId

  const user = useGetUser({ id: currId as string, enabled: router.isReady })

  return (
    <main>
      <Link component={NextLink} href='/core/job-level' sx={{ display: 'flex', alignItems: 'center', marginY: '12px' }}>
        <Icon icon='ic:arrow-back' style={{ color: theme.palette.primary.main }} fontSize='20px' /> Back
      </Link>
      <MvTypography size='TITLE_MD' typeSize='PX'>
        Detail Job Level
      </MvTypography>

      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Breadcrumbs
          data={[
            {
              icon: 'tabler:briefcase',
              label: 'Manage Job Level',
              path: '/core/job-level'
            },
            {
              label: 'Detail Job Level',
              path: '/core/job-level/' + currId
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
            href={`/core/job-level/${currId}/edit`}
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

      {!router.isReady || user.isInitialLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : null}

      {user.isError ? (
        <MvTypography size='BODY_MD_NORMAL' typeSize='PX' sx={{ textAlign: 'center' }}>
          Something went wrong. Please try again later
        </MvTypography>
      ) : null}

      {user.isSuccess ? (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '24.5px', gap: '24px' }}>
          <InfoJobLevel
            title='General Information'
            fields={[
              { label: 'Code', value: user.data.data.sto?.id ?? '-' },
              { label: 'Job Level name', value: user.data.data.job_function?.job_level.name ?? '-' },
              { label: 'Work Center', value: user.data.data.werk?.name ?? '-' },
              { label: 'Department', value: user.data.data.sto?.name ?? '-' },
              { label: 'Job Function', value: user.data.data.job_function?.name ?? '-' },
              { label: 'Description', value: user.data.data.profile?.address ?? '-' }
            ]}
          />
          <Card
            sx={{
              boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
              padding: '20px',
              flex: '1 1 0%'
            }}
          >
            <CardContent style={{ display: 'flex', flexDirection: 'column', rowGap: 2, padding: 0 }}>
              <Box width={'min-content'}>
                <Badge color={'success'} label={'Active'} isTransparent={true} size='medium' style='rect' />
              </Box>
              <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
                This data record is active and accessible across application. It could be shown as a dropdown value, or
                else.
              </MvTypography>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <ModalDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        closeable
        title='Are you sure you want to delete this user?'
        description="You won't be able to revert this!"
        positiveLabel='Yes'
        statusVariant='danger'
        typeVariant='confirmation'
        onOk={() => {
          setIsDeleteModalOpen(false)
        }}
      />
    </main>
  )
}
