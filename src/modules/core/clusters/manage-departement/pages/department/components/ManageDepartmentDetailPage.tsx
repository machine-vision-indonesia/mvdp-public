import { useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
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
import InfoDepartment from './InfoDepartment'
import { useGetDepartment } from '../services/fetchDepartment.service'
import { queryClient } from '@/pages/_app'
import { useDeleteDepartment } from '../services/actionDeleteDepartment.service'
import { useAtom } from 'jotai'
import { departmentAlertAtom } from '../atoms'

export default function ManageDepartmentDetailPage() {
  const theme = useTheme()
  const router = useRouter()
  const { id: userId } = useParams()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [_, setDepartmentAlert] = useAtom(departmentAlertAtom)

  const currId = router.query.id || userId

  const department = useGetDepartment({ id: currId as string, enabled: router.isReady })

  const deleteDepartment = useDeleteDepartment()

  return (
    <main>
      <Link
        component={NextLink}
        href='/core/department'
        sx={{ display: 'flex', alignItems: 'center', marginY: '12px' }}
      >
        <Icon icon='ic:arrow-back' style={{ color: theme.palette.primary.main }} fontSize='20px' /> Back
      </Link>
      <MvTypography size='TITLE_MD' typeSize='PX'>
        Detail Department
      </MvTypography>

      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Breadcrumbs
          data={[
            {
              icon: 'tabler:briefcase',
              label: 'Manage Department',
              path: '/core/department'
            },
            {
              label: 'Detail Department',
              path: '/core/department/' + currId
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
            href={`/core/department/${currId}/edit`}
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

      {!router.isReady || department.isInitialLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : null}

      {department.isError ? (
        <MvTypography size='BODY_MD_NORMAL' typeSize='PX' sx={{ textAlign: 'center' }}>
          Something went wrong. Please try again later
        </MvTypography>
      ) : null}

      {department.isSuccess ? (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '24.5px', gap: '24px' }}>
          <InfoDepartment
            title='General Information'
            fields={[
              { label: 'Code', value: department.data.data.code ?? '-' },
              { label: 'Department name', value: department.data.data.name ?? '-' },
              { label: 'Work Center', value: department.data.data.parent?.name ?? '-' },
              { label: 'Department Parent', value: department.data.data.parent?.name ?? '-' },
              { label: 'Level', value: department.data.data.department_level.name ?? '-' },
              { label: 'Description', value: department.data.data.description ?? '-' }
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
        title='Are you sure to delete department?'
        description="You won't be able to revert this!"
        positiveLabel='Yes'
        statusVariant='danger'
        typeVariant='confirmation'
        onOk={async () => {
          setIsDeleteModalOpen(false)
          try {
            await deleteDepartment.mutateAsync({ id: currId as string })
            await queryClient.invalidateQueries()

            setDepartmentAlert({
              title: 'Successfully delete data.',
              content: 'Department has been deleted by our system.',
              size: 'small',
              variant: 'success',
              pathname: '/core/department',
              open: true
            })
            router.push('/core/department')
          } catch {
            setDepartmentAlert({
              title: 'Network Errors',
              content: 'Unable to connect to the network or server',
              size: 'small',
              variant: 'danger',
              pathname: '/core/department',
              open: true
            })
          }

          deleteDepartment.reset()
        }}
      />
    </main>
  )
}
