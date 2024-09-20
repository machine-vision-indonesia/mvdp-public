import { useTheme } from '@mui/material/styles'
import NextLink from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai/index'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Breadcrumbs } from '@/components/atoms/breadcrumbs'
import AddJobFunctionForm from './AddJobFunctionForm'
import { Alert } from '@/components/molecules/alert'
import AddRoleForm from './AddRoleForm'
import { Button } from '@/components/atoms'
import { SchemaAddJobFunction } from '../types/ManageJobFunction.types'
import { schemaAddJobFunction } from '../validations'
import { ModalDialog } from '@/components/molecules/modal-dialog'
import { queryClient } from '@/pages/_app'
import { useAddJobFunction, useAddRole } from '../services/actionAddJobFunction.service'
import { jobFunctionAlertAtom } from '../atoms'
import { GetJobFunctionByCode, GetRolesByCode } from '../services/fetchJobFunction.service'

export default function ManageJobFunctionAddPage() {
  const router = useRouter()
  const theme = useTheme()
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [jobFunctionAlert, setJobFunctionAlert] = useAtom(jobFunctionAlertAtom)

  const form = useForm<SchemaAddJobFunction>({
    resolver: yupResolver(schemaAddJobFunction),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })
  const watchExistingRoleOrCreateNew = form.watch('existingRoleOrCreateNew')

  // Services
  const createJobFunction = useAddJobFunction()
  const createRole = useAddRole()

  async function onSubmit(data: SchemaAddJobFunction) {
    try {
      setIsLoading(true)

      // create new role
      if (watchExistingRoleOrCreateNew === 'create') {
        // check if role code is exist
        const responseRole = await GetRolesByCode({ code: data.role_code })

        if (responseRole.data.data.length) {
          form.setError('role_code', {
            type: 'manual',
            message: 'Role Code already exists'
          })

          return
        }

        await addNewRole()
      }

      const responseJF = await GetJobFunctionByCode({ code: data.code })

      if (responseJF.data.data.length) {
        form.setError('code', {
          type: 'manual',
          message: 'Job Function Code already exists'
        })

        return
      }

      setIsConfirmModalOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function addNewRole() {
    try {
      const responseCreateRole = await createRole.mutateAsync(form.getValues())
      await queryClient.invalidateQueries()

      if (responseCreateRole.data.data) {
        form.setValue('role', { id: responseCreateRole.data.data.id, label: responseCreateRole.data.data.name })
      }
    } catch (error) {
      setJobFunctionAlert({
        title: 'Failed',
        content: 'Failed save new role',
        size: 'small',
        variant: 'danger',
        pathname: '/core/job-function/add',
        open: true
      })
      return
    }
  }

  useEffect(() => {
    if (!jobFunctionAlert.open) {
      return
    }

    setTimeout(() => {
      setJobFunctionAlert({
        ...jobFunctionAlert,
        open: false
      })
    }, 4000)
  }, [setJobFunctionAlert, jobFunctionAlert])

  return (
    <main>
      <MvTypography size='TITLE_MD' typeSize='PX'>
        Create Job Function
      </MvTypography>
      <Breadcrumbs
        data={[
          {
            icon: 'tabler:briefcase',
            label: 'Manage Job Function',
            path: '/core/job-function'
          },
          {
            label: 'Create Job Function',
            path: '/core/job-function/add'
          }
        ]}
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}
      >
        <AddJobFunctionForm form={form} pages='add' />
        <AddRoleForm form={form} pages='add' />
        <div style={{ gridColumn: 'span 6', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button
            variant='outlined'
            content='textOnly'
            text='Cancel'
            color='primary'
            size='large'
            sx={{
              height: '44px',
              padding: '12.5px 20px !important',
              borderRadius: '4px',
              fontSize: '16px',
              border: `1.5px solid ${theme.palette.primary.main}`
            }}
            type='button'
            LinkComponent={NextLink}
            href='/core/job-function'
          />
          <Button
            variant='contained'
            content='textOnly'
            text='Save'
            size='large'
            sx={{ height: '44px', padding: '12.5px 20px !important', borderRadius: '4px', fontSize: '16px' }}
            type='submit'
            loading={isLoading}
          />
        </div>
      </form>

      {jobFunctionAlert.pathname === router.pathname && jobFunctionAlert.open ? (
        <Box position='fixed' top='85px' right='24px'>
          <Alert
            title={jobFunctionAlert.title}
            size={jobFunctionAlert.size}
            content={jobFunctionAlert.content}
            variant={jobFunctionAlert.variant}
          />
        </Box>
      ) : null}

      <ModalDialog
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        typeVariant='confirmation'
        statusVariant='warning'
        loading={createJobFunction.isPending}
        positiveLabel='Yes'
        title={`Are you sure to create job function?`}
        description="You won't be able to revert this!"
        onOk={async () => {
          try {
            await createJobFunction.mutateAsync(form.getValues())
            await queryClient.invalidateQueries()

            setJobFunctionAlert({
              title: 'Successfully save data.',
              content: 'Job function has been saved by our system',
              size: 'small',
              variant: 'success',
              pathname: '/core/job-function/add',
              open: true
            })
            router.push('/core/job-function')
          } catch (error) {
            setJobFunctionAlert({
              title: 'Network Errors',
              content: 'Unable to connect to the network or server.',
              size: 'small',
              variant: 'danger',
              pathname: '/core/job-function/add',
              open: true
            })
          } finally {
            setIsConfirmModalOpen(false)
          }
        }}
      />
    </main>
  )
}
