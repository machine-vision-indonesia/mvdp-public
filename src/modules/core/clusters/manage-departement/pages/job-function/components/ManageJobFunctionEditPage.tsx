import NextLink from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai/index'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { Alert } from '@/components/molecules/alert'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Breadcrumbs } from '@/components/atoms/breadcrumbs'
import { useParams } from 'react-router-dom'
import AddJobFunctionForm from './AddJobFunctionForm'
import AddRoleForm from './AddRoleForm'
import { Button } from '@/components/atoms'
import { Field } from '@/components/molecules/field'
import { Checkbox } from '@/components/atoms/checkbox'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@emotion/react'
import { GetRolesByCode, useGetJobFunction } from '../services/fetchJobFunction.service'
import { jobFunctionAlertAtom } from '../atoms'
import { ModalDialog } from '@/components/molecules/modal-dialog'
import { queryClient } from '@/pages/_app'
import { useEditJobFunction } from '../services/actionEditJobFunction.service'
import { GetRolesResponse, SchemaAddJobFunction } from '../types/ManageJobFunction.types'
import { schemaAddJobFunction } from '../validations'
import client from '@/client'
import { useAddRole } from '../services/actionAddJobFunction.service'

export default function ManageJobFunctionEditPage() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [jobFunctionAlert, setJobFunctionAlert] = useAtom(jobFunctionAlertAtom)
  const router = useRouter()
  const { id: jobFunctionId } = useParams()
  const theme = useTheme()

  const currId = router.query.id || jobFunctionId

  // Services
  const jobFunction = useGetJobFunction({ id: currId as string, enabled: router.isReady })
  const editJobFunction = useEditJobFunction()
  const createRole = useAddRole()

  const form = useForm<SchemaAddJobFunction>({
    resolver: yupResolver(schemaAddJobFunction),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })
  const watchExistingRoleOrCreateNew = form.watch('existingRoleOrCreateNew')

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
        pathname: `{/core/job-function/${currId}/edit}`,
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
        Edit Job Function
      </MvTypography>
      <Breadcrumbs
        data={[
          {
            icon: 'tabler:briefcase',
            label: 'Manage Job Function',
            path: '/core/job-function'
          },
          {
            label: 'Edit Job Function',
            path: '/core/job-function/edit'
          }
        ]}
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}
      >
        {jobFunction.isSuccess ? (
          <>
            <AddJobFunctionForm
              form={form}
              pages='edit'
              fields={{
                code: jobFunction.data.data.code ?? '-',
                name: jobFunction.data.data.name ?? '-',
                department: jobFunction.data.data.sto?.id
                  ? { id: jobFunction.data.data.sto.id, label: jobFunction.data.data.sto.name }
                  : null,
                job_level: jobFunction.data.data.job_level?.id
                  ? {
                      id: jobFunction.data.data.job_level.id,
                      label: jobFunction.data.data.job_level.name
                    }
                  : null,
                description: jobFunction.data.data.description ?? '-',
                set_is_active: true
              }}
            />
            <AddRoleForm form={form} pages='edit' />{' '}
          </>
        ) : null}
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '24.5px',
            boxShadow: '0px 2px 6px 0px rgba(0, 0,x 0, 0.25)',
            flex: '1 1 0%'
          }}
        >
          <CardContent sx={{ width: '100%' }}>
            <div style={{ gridColumn: 'span 6' }}>
              <Field name='is_active' label='Set as Active'>
                <Field.CheckboxController controller={form.control} errors={form.formState.errors}>
                  <Field.Input>
                    <Checkbox size='large' checked={/*fields?.set_is_active*/ true} />
                  </Field.Input>
                </Field.CheckboxController>
                <MvTypography size='BODY_MD_BOLDEST' typeSize='PX' color={theme.colorToken.text.danger.normal}>
                  If deactivated, this data record will be hiden and will no longer be accessible in dropdown menus or
                  other paths of the application. Use with caution
                </MvTypography>
              </Field>
            </div>
          </CardContent>
        </Card>

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
        loading={editJobFunction.isPending}
        positiveLabel='Yes'
        title={`Are you sure to Edit job function?`}
        description="You won't be able to revert this!"
        onOk={async () => {
          try {
            await editJobFunction.mutateAsync({ id: currId as string, ...form.getValues() })
            await queryClient.invalidateQueries()

            setJobFunctionAlert({
              title: 'Successfully save data.',
              content: 'Job function has been saved by our system',
              size: 'small',
              variant: 'success',
              pathname: '/core/job-function',
              open: true
            })
            router.push('/core/job-function')
          } catch (error) {
            setJobFunctionAlert({
              title: 'Network Errors',
              content: 'Unable to connect to the network or server.',
              size: 'small',
              variant: 'danger',
              pathname: `{/core/job-function/${currId}/edit}`,
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
