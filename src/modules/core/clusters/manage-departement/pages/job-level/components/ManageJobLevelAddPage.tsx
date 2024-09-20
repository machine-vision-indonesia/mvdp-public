import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { MvTypography } from '@/components/atoms/mv-typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Icon from 'src/@core/components/icon'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import { useAtom } from 'jotai'
import { userAlertAtom } from '@/modules/core/clusters/md-user/pages/user/atoms'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Alert } from '@/components/atoms/alert/Alert'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import AddJobLevelForm from './AddJobLevelForm'
import { SchemaAddJobLevel } from '../types/ManageJobLevelPage.types'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaAddJobLevel } from '../validations'

export default function ManageJobLevelAddPage() {
  const theme = useTheme()
  const router = useRouter()
  const form = useForm<SchemaAddJobLevel>({
    resolver: yupResolver(schemaAddJobLevel),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })
  const [userAlert, setUserAlert] = useAtom(userAlertAtom)

  return (
    <>
      <main>
        <MvTypography size='TITLE_MD' typeSize='PX'>
          Create Job Level
        </MvTypography>
        {/* <MvTypography size='TITLE_XL' typeSize='PX'>Add User</MvTypography> */}
        <Breadcrumbs
          aria-label='breadcrumb'
          sx={{ mt: '8px' }}
          separator={<Icon icon='mdi:chevron-right' color='#909094' />}
        >
          <Link component={NextLink} href='/'>
            <Icon icon='mdi:home-outline' style={{ color: theme.palette.primary.main }} fontSize='20px' />
          </Link>
          <Link component={NextLink} href='/core/job-level'>
            <MvTypography size='BODY_MD_BOLDEST' typeSize='PX' color={theme.colorToken.text.primary.inverted}>
              Manage Job Level
            </MvTypography>
          </Link>
          <MvTypography size='BODY_MD_BOLDEST' typeSize='PX' color={theme.colorToken.text.primary.normal}>
            Create New
          </MvTypography>
        </Breadcrumbs>
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '24.5px',
            boxShadow: '0px 2px 6px 0px rgba(0, 0,x 0, 0.25)',
            padding: '20px',
            flex: '1 1 0%'
          }}
        >
          <CardContent sx={{ width: '100%', padding: 0 }}>
            <MvTypography size='BODY_LG_BOLDEST' typeSize='PX' component='h2' sx={{ paddingY: 2 }}>
              General Information
            </MvTypography>
            <Divider flexItem sx={{ borderColor: theme.colorToken.border.neutral.normal }} />
          </CardContent>
          <AddJobLevelForm form={form} pages='add' />
        </Card>
      </main>

      {userAlert.pathname === router.pathname && userAlert.open ? (
        <Box position='fixed' top='85px' right='24px'>
          <Alert
            variant='contained'
            content={userAlert.content}
            color={userAlert.color}
            title={userAlert.title}
            icon={userAlert.icon}
            onClose={() => setUserAlert({ ...userAlert, open: false })}
          />
        </Box>
      ) : null}
    </>
  )
}
