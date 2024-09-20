import { useTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai/index'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { departmentAlertAtom } from 'src/components/complexes/department/atoms'
import { Alert } from '@/components/molecules/alert'
import { schemaAddDepartment } from '../validations'
import { SchemaAddDepartment } from '../types/ManageDepartmentPage.types'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Breadcrumbs } from '@/components/atoms/breadcrumbs'
import { Divider } from '@mui/material'
import AddDepartmentForm from './AddDepartmentForm'

export default function ManageDepartmentAddPage() {
  const [departmentAlert, setDepartmentAlert] = useAtom(departmentAlertAtom)

  useEffect(() => {
    if (!departmentAlert.open) {
      return
    }

    setTimeout(() => {
      setDepartmentAlert({
        ...departmentAlert,
        open: false
      })
    }, 4000)
  }, [setDepartmentAlert, departmentAlert])

  const router = useRouter()
  const theme = useTheme()

  const form = useForm<SchemaAddDepartment>({
    resolver: yupResolver(schemaAddDepartment)
  })

  return (
    <main>
      <MvTypography size='TITLE_MD' typeSize='PX'>
        Create Department
      </MvTypography>
      <Breadcrumbs
        data={[
          {
            icon: 'tabler:briefcase',
            label: 'Manage Department',
            path: '/core/department'
          },
          {
            label: 'Create Department',
            path: '/core/department/add'
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
        <CardContent sx={{ width: '100%', padding: 0 }}>
          <MvTypography size='BODY_LG_BOLDEST' typeSize='PX' component='h2' sx={{ paddingY: 2 }}>
            General Information
          </MvTypography>
          <Divider flexItem sx={{ borderColor: theme.colorToken.border.neutral.normal }} />
        </CardContent>
        <AddDepartmentForm form={form} pages='add' />
      </Card>

      {departmentAlert.pathname === router.pathname && departmentAlert.open ? (
        <Box position='fixed' top='85px' right='24px'>
          <Alert
            title={departmentAlert.title}
            size={departmentAlert.size}
            content={departmentAlert.content}
            variant={departmentAlert.variant}
          />
        </Box>
      ) : null}
    </main>
  )
}
