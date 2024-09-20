import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Button } from 'src/components/atoms/button'
import { CircularProgress } from 'src/components/atoms/circular-progress/CircularProgress'
import { useGetUser } from 'src/service/user/edit/address-and-contact/useGetUser'
import { useUpdateProfile } from '@/service/user/useUpdateProfile'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Breadcrumbs } from '@/components/atoms/breadcrumbs'
import { userAlertAtom } from '@/modules/core/clusters/md-user/pages/user/atoms'
import { UserStepThree } from '@/modules/core/clusters/md-user/pages/user/components/UserStepThree'
import { SchemaAddressContact } from '@/modules/core/clusters/md-user/pages/user/types/UserEditPage.type'
import { schemaAddressContact } from '@/modules/core/clusters/md-user/pages/user/validations'
import { ModalDialog } from '@/components/molecules/modal-dialog'
import { Alert } from '@/components/molecules/alert'

export default function ManageUserAddressAndContactPage() {
  const router = useRouter()
  const form = useForm<SchemaAddressContact>({
    resolver: yupResolver(schemaAddressContact)
  })

  const user = useGetUser({ id: router.query.id as string, enabled: router.isReady })
  const updateProfile = useUpdateProfile()
  const queryClient = useQueryClient()

  useEffect(() => {
    form.reset({
      address: user.data?.data.profile.address,
      phone: user.data?.data.profile.phone,
      post_code: user.data?.data.profile.post_code
    })
  }, [form, user.data?.data.profile?.address, user.data?.data.profile?.phone, user.data?.data.profile?.post_code])

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
        Edit Address & Contact
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
            path: `/core/user/${router.query.id}/edit`
          },
          {
            label: 'Edit Address & Contact',
            path: `/core/address-and-contact`
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
          {!router.isReady || user.isLoading ? (
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
            <form onSubmit={form.handleSubmit(() => setIsConfirmModalOpen(true))}>
              <MvTypography size='LABEL_LG_BOLDEST' typeSize='PX' sx={{ lineHeight: '26px' }}>
                Address & Contact
              </MvTypography>

              <UserStepThree form={form} />

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
                  content='textOnly'
                  text='Save'
                  variant='contained'
                  size='large'
                  type='submit'
                  disabled={form.formState.isSubmitting}
                  loading={form.formState.isSubmitting}
                />
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
        loading={updateProfile.isPending || updateProfile.isSuccess}
        positiveLabel='Yes'
        title='Are you sure to save data user?'
        description="You won't be able to revert this!"
        onOk={async () => {
          try {
            if (!user.data) {
              return
            }

            const data = form.getValues()

            await updateProfile.mutateAsync({
              ...data,
              id: user.data.data.profile.id
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

            updateProfile.reset()
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
