import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import client from 'src/client'
import { Button } from 'src/components/atoms/button'
import { CircularProgress } from 'src/components/atoms/circular-progress/CircularProgress'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Breadcrumbs } from '@/components/atoms/breadcrumbs'
import {
  useGetJobFunctions,
  useGetRoles,
  useGetWorkCenters
} from '@/modules/core/clusters/md-user/pages/user/services/fetchUser.service'
import {
  useListDepartment,
  useUserQuery
} from '@/modules/core/clusters/md-user/pages/user/services/fetchDetailUser.service'
import { usePostEditAuthFieldMutation } from '@/modules/core/clusters/md-user/pages/user/services/actionUpdateUser.service'
import { userAlertAtom } from '@/modules/core/clusters/md-user/pages/user/atoms'
import { UserStepTwo } from './UserStepTwo'
import { Alert } from '@/components/molecules/alert'
import { SchemaJobProfile } from '../types/UserEditPage.type'
import { schemaJobProfile } from '../validations'
import { ModalDialog } from '@/components/molecules/modal-dialog'

export default function ManageUserAuthAndFieldPage() {
  const theme = useTheme()
  const router = useRouter()

  const { reset, getValues, setValue, ...form } = useForm<SchemaJobProfile>({
    resolver: yupResolver(schemaJobProfile),
    defaultValues: {
      roles: []
    }
  })

  const watchDepartment = form.watch('department')
  const watchJobFunction = form.watch('job_function')

  const workCenters = useGetWorkCenters()
  const jobFunctions = useGetJobFunctions()
  const departmentsQuery = useListDepartment()
  const rolesQuery = useGetRoles()
  const userQuery = useUserQuery()
  const updateMutation = usePostEditAuthFieldMutation()

  const departmentOptions =
    departmentsQuery.data?.data.map(department => ({
      id: department.id,
      label: department.name
    })) ?? []

  const jobFunctionOptions =
    jobFunctions.data?.data.map(jobFunction => ({
      id: jobFunction.id,
      label: jobFunction.name,
      job_level: jobFunction.job_level
    })) ?? []

  const roleOptions =
    rolesQuery.data?.data.map(role => ({
      id: role.id,
      label: role.name
    })) ?? []

  useEffect(() => {
    if (userQuery.isSuccess) {
      reset({
        role: userQuery.data?.data.privileges.map(privilege => ({
          id: privilege.role.id,
          label: privilege.role.name
        })),
        work_center: {
          id: userQuery.data?.data?.werk?.id,
          label: userQuery.data?.data?.werk?.name
        },
        department: {
          id: userQuery.data?.data?.sto?.id,
          label: userQuery.data?.data?.sto?.name
        },
        job_function: {
          id: userQuery.data?.data?.job_function?.id,
          label: userQuery.data?.data?.job_function?.name,
          job_level: userQuery.data?.data?.job_function?.job_level
        },
        job_level: userQuery.data?.data?.job_function?.job_level,
        job_title: userQuery.data?.data.job_title
      })
    }
  }, [
    reset,
    userQuery.data?.data.email,
    userQuery.data?.data?.job_function?.id,
    userQuery.data?.data?.job_function?.job_level,
    userQuery.data?.data?.job_function?.name,
    userQuery.data?.data.job_title,
    userQuery.data?.data.privileges,
    userQuery.data?.data?.sto?.id,
    userQuery.data?.data?.sto?.name,
    userQuery.data?.data?.werk?.id,
    userQuery.data?.data?.werk?.name,
    userQuery.isSuccess
  ])

  const queryClient = useQueryClient()
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [userAlert, setUserAlert] = useAtom(userAlertAtom)

  useEffect(() => {
    if (!userAlert.open) {
      return
    }

    setTimeout(() => {
      setUserAlert({
        ...userAlert,
        open: false
      })
    }, 4000)
  }, [setUserAlert, userAlert])

  return (
    <main>
      <MvTypography size='TITLE_MD' typeSize='PX'>
        Edit Job Profile
      </MvTypography>
      <Breadcrumbs
        data={[
          {
            icon: 'tabler:briefcase',
            label: 'User',
            path: '/core/user'
          },
          {
            icon: 'tabler:briefcase',
            label: 'View User Profile',
            path: `/core/user/${router.query.id}`
          },
          {
            label: 'Edit Job Profile',
            path: `/core/job-profile`
          }
        ]}
      />
      <Card
        sx={{
          boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
          padding: '20px',
          flex: '1 1 0%',
          marginTop: '24.5px'
        }}
      >
        <CardContent style={{ padding: 0 }}>
          {userQuery.isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : null}

          {userQuery.isError ? (
            <MvTypography size='BODY_MD_NORMAL' typeSize='PX' sx={{ textAlign: 'center' }}>
              Something went wrong. Please try again later
            </MvTypography>
          ) : null}

          {userQuery.isSuccess ? (
            <form
              onSubmit={form.handleSubmit(async data => {
                // const response = await client.api.get('/users', {
                //   params: {
                //     filter: {
                //       email: {
                //         _eq: data.email
                //       },
                //       id: {
                //         _neq: router.query.id
                //       }
                //     }
                //   }
                // })

                // if (response.data.data.length) {
                //   form.setError('email', {
                //     type: 'manual',
                //     message: 'Email already exists'
                //   })

                //   return
                // }

                setIsConfirmModalOpen(true)
              })}
            >
              <MvTypography size='LABEL_LG_BOLDEST' typeSize='PX' sx={{ lineHeight: '26px' }}>
                Job Profile
              </MvTypography>

              <UserStepTwo
                pages='edit'
                form={form}
                roleOptions={roleOptions}
                workCenters={workCenters}
                departmentOptions={departmentOptions}
                jobFunctionOptions={jobFunctionOptions}
                watchDepartment={watchDepartment}
                watchJobFunction={watchJobFunction}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: '30px' }}>
                <Button
                  variant='outlined'
                  content='textOnly'
                  text='Cancel'
                  size='large'
                  LinkComponent={NextLink}
                  href={`/core/user/${router.query.id}`}
                />

                <Button
                  variant='contained'
                  content='textOnly'
                  text='Save'
                  size='large'
                  type='submit'
                  disabled={form.formState.isSubmitting}
                  loading={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? <CircularProgress size={30} /> : 'Save'}
                </Button>
              </div>
            </form>
          ) : null}
        </CardContent>
      </Card>

      <ModalDialog
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        typeVariant='confirmation'
        statusVariant='warning'
        loading={updateMutation.isPending || updateMutation.isSuccess}
        positiveLabel='Yes'
        title='Are you sure to save data user?'
        description="You won't be able to revert this!"
        onOk={async () => {
          try {
            const data = getValues()

            await updateMutation.mutateAsync({
              currentPrivilegeIds: userQuery.data?.data?.privileges.map(privilege => privilege.id) ?? [],
              roleIds: data?.role.map(role => role.id),
              werk: data?.work_center?.id,
              sto: data?.department?.id,
              job_function: data?.job_function?.id,
              job_title: data.job_title
            })

            await queryClient.invalidateQueries()

            setUserAlert({
              title: 'Successfully save data.',
              content: 'User has been saved by our system.',
              variant: 'success',
              size: 'small',
              pathname: '/core/user/[id]/edit',
              open: true
            })

            router.push(`/core/user/${router.query.id}/edit`)
          } catch {
            setUserAlert({
              title: 'Network Errors',
              content: 'Unable to connect to the network or server.',
              variant: 'danger',
              size: 'small',
              pathname: '/core/user/[id]/edit/auth-and-field',
              open: true
            })

            setIsConfirmModalOpen(false)

            updateMutation.reset()
          }
        }}
      />

      {userAlert.pathname === router.pathname && userAlert.open ? (
        <Box position='fixed' top='85px' right='24px'>
          <Alert
            content={userAlert.content}
            variant={userAlert.variant ?? 'primary'}
            title={userAlert.title}
            size={userAlert.size ?? 'small'}
          />
        </Box>
      ) : null}
    </main>
  )
}
