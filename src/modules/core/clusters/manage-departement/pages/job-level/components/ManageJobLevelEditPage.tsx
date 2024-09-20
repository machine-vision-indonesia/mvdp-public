import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from 'src/components/atoms/button'
import Icon from 'src/@core/components/icon'
import { CircularProgress } from 'src/components/atoms/circular-progress/CircularProgress'
import { titleCase } from 'src/utils/general'
import { Alert } from 'src/components/atoms/alert/Alert'
import { Breadcrumbs } from '@/components/atoms/breadcrumbs'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Modal, UploadFile } from '@/components/molecules'
import { useGetUser } from '@/modules/core/clusters/md-user/pages/user/services/fetchDetailUser.service'
import { useParams } from 'react-router-dom'
import { jobLevelAlertAtom } from '../atoms'
import { SchemaAddJobLevel } from '../types/ManageJobLevelPage.types'
import { schemaAddJobLevel } from '../validations'
import AddJobLevelForm from './AddJobLevelForm'

export default function ManageJobLevelEditPage() {
  const theme = useTheme()
  const router = useRouter()
  const { id: jobLevelId } = useParams()

  const [openPhoto, setOpenPhoto] = useState(false)
  const [openCover, setOpenCover] = useState(false)
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState<string[]>([])

  const currId = router.query.id || jobLevelId

  const queryClient = useQueryClient()

  const jobLevel = useGetUser({ id: currId as string, enabled: router.isReady })

  // const cover = useGetAsset({
  //   id: jobLevel.data?.data.profile?.cover ?? null,
  //   enabled: Boolean(jobLevel.data?.data.profile?.cover)
  // })

  // const photo = useGetAsset({
  //   id: jobLevel.data?.data.profile?.photo ?? null,
  //   enabled: Boolean(jobLevel.data?.data.profile?.photo)
  // })

  // const updateCover = useUpdateCover()
  // const updatePhoto = useUpdatePhoto()

  const [jobLevelAlert, setJobLevelAlert] = useAtom(jobLevelAlertAtom)

  const form = useForm<SchemaAddJobLevel>({
    resolver: yupResolver(schemaAddJobLevel)
  })

  useEffect(() => {
    if (!jobLevelAlert.open) {
      return
    }

    setTimeout(() => {
      setJobLevelAlert({
        ...jobLevelAlert,
        open: false
      })
    }, 4000)
  }, [setJobLevelAlert, jobLevelAlert])

  // const onSubmitPhoto = (type: string) => {
  //   setLoading(true)
  //   if (type === 'photo') {
  //     const formData = axios.toFormData({ file: watch('file') })
  //     updatePhoto.mutate(
  //       {
  //         file: formData,
  //         jobLevelId: router.query.id as string,
  //         profileId: jobLevel?.data?.data?.profile?.id,
  //         idPhoto: id[0]
  //       },
  //       {
  //         async onSuccess() {
  //           setOpenPhoto(false)
  //           await queryClient.invalidateQueries()
  //         }
  //       }
  //     )
  //   } else {
  //     const formData = axios.toFormData({ file: watch('file') })
  //     updateCover.mutate(
  //       {
  //         file: formData,
  //         jobLevelId: router.query.id as string,
  //         profileId: jobLevel?.data?.data?.profile?.id,
  //         idPhoto: id[0]
  //       },
  //       {
  //         async onSuccess() {
  //           setOpenCover(false)
  //           await queryClient.invalidateQueries()
  //         }
  //       }
  //     )
  //   }
  //   setLoading(false)
  // }

  return (
    <main>
      <MvTypography size='TITLE_MD' typeSize='PX'>
        Edit Job Level
      </MvTypography>
      <Breadcrumbs
        data={[
          {
            icon: 'tabler:briefcase',
            label: 'Manage Job Level',
            path: '/core/job-level'
          },
          {
            label: 'Edit Job Level',
            path: '/core/job-level/edit'
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
        <CardContent style={{ display: 'flex', flexDirection: 'column', rowGap: '20px', padding: 0 }}>
          {!router.isReady || jobLevel.isInitialLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : null}

          {jobLevel.isError ? (
            <MvTypography size='BODY_MD_NORMAL' typeSize='PX' sx={{ textAlign: 'center' }}>
              Something went wrong. Please try again later
            </MvTypography>
          ) : null}

          {jobLevel.isSuccess ? (
            <>
              <AddJobLevelForm
                form={form}
                pages='edit'
                fields={{
                  code: jobLevel.data.data.sto?.id ?? '-',
                  job_level_name: jobLevel.data.data.job_title ?? '-',
                  // work_center: jobLevel.data.data.werk,
                  // department: jobLevel.data.data.sto,
                  // job_function: jobLevel.data.data.job_function,
                  description: jobLevel.data.data.email,
                  set_is_active: true
                }}
              />
            </>
          ) : null}
        </CardContent>
      </Card>

      {jobLevelAlert.pathname === router.pathname && jobLevelAlert.open ? (
        <Box position='fixed' top='85px' right='24px'>
          <Alert
            variant='contained'
            content={jobLevelAlert.content}
            color={jobLevelAlert.color}
            title={jobLevelAlert.title}
            icon={jobLevelAlert.icon}
            onClose={() => setJobLevelAlert({ ...jobLevelAlert, open: false })}
          />
        </Box>
      ) : null}
    </main>
  )
}
