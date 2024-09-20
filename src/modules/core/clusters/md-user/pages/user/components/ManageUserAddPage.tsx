import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useAtom } from 'jotai'
import { MvTypography } from '@/components/atoms/mv-typography'
import { userAlertAtom } from '@/modules/core/clusters/md-user/pages/user/atoms'
import AddUserFormStepper from '@/modules/core/clusters/md-user/pages/user/components/AddUserFormStepper'
import { Alert } from '@/components/molecules/alert'
import { Breadcrumbs } from '@/components/atoms/breadcrumbs'

export default function ManageUserAddPage() {
  const router = useRouter()

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
    <>
      <main>
        <MvTypography size='TITLE_MD' typeSize='PX' sx={{ mb: 2 }}>
          Create User
        </MvTypography>
        <Breadcrumbs
          data={[
            {
              icon: 'tabler:briefcase',
              label: 'User',
              path: '/core/user'
            },
            {
              label: 'Create User',
              path: '/core/user/add'
            }
          ]}
        />
        <Card
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            marginTop: '24.5px',
            boxShadow: '0px 2px 6px 0px rgba(0, 0,x 0, 0.25)',
            padding: '20px'
          }}
        >
          <AddUserFormStepper />
        </Card>
      </main>

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
    </>
  )
}
