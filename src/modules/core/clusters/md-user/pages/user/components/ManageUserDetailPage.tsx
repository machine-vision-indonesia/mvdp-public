import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from 'src/components/atoms/button'
import Icon from 'src/@core/components/icon'
import { CircularProgress } from 'src/components/atoms/circular-progress/CircularProgress'
import { titleCase } from 'src/utils/general'
import { Breadcrumbs } from '@/components/atoms/breadcrumbs'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Modal, UploadFile } from '@/components/molecules'
import {
  useFetchUser,
  useGetAsset,
  useGetUser,
  useGetUserLogActivity
} from '@/modules/core/clusters/md-user/pages/user/services/fetchDetailUser.service'
import {
  useUpdateCover,
  useUpdatePhoto
} from '@/modules/core/clusters/md-user/pages/user/services/actionUpdateUser.service'
import { userAlertAtom } from '@/modules/core/clusters/md-user/pages/user/atoms'
import { SchemaFile, SchemaProfileOtp } from '@/modules/core/clusters/md-user/pages/user/types/UserEditPage.type'
import { schemaFile, schemaProfileOtp } from '@/modules/core/clusters/md-user/pages/user/validations'
import InfoProfile from '@/modules/core/clusters/md-user/pages/user/components/InfoProfile'
import { useParams } from 'react-router-dom'
import { FormControlLabel, Grid, Link, Stack } from '@mui/material'
import ModalVerificationOtp from '@/components/molecules/modal-verification-otp/components/ModalVerificationOtp'
import { ModalVerificationPassword } from '@/components/molecules/modal-verification-password'
import { useTfaGenerateMutation } from '@/components/complexes/login/services/actionPostLogin.service'
import { Switch } from '@/components/atoms/switch'
import { Badge } from '@/components/atoms/badge'
import { Alert } from '@/components/molecules/alert'
import { Dropdown } from '@/components/atoms/dropdown'
import { UserLogActivity } from './UserLogActivity'
import { GetUserLogActivityResponseData, UserLog } from '../types/ManageUserPage.types'
import { groupUserLogs } from '../utils/groupUserLogs'
import { ContentModalCamera } from './ContentModalCamera'

export default function ManageUserDetailPage() {
  const theme = useTheme()
  const router = useRouter()
  const { id: userId } = useParams()
  const isUserProfileRoute = router.pathname === '/core/user/[id]/profile'

  const [openPhoto, setOpenPhoto] = useState(false)
  const [openCover, setOpenCover] = useState(false)
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState<string[]>([])

  //OTP
  const [scanQRCode, setScanQRCode] = useState(false)
  const [isAccountVerified, setIsAccountVerified] = useState(false)
  const [isDisableTfa, setIsDisableTfa] = useState(false)
  const [isModalPassword, setIsModalPassword] = useState(false)
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState({
    camera: false
  })
  const [modalConfirmData, setModalConfirmData] = useState({
    title: '',
    description: '',
    positiveLabel: 'Yes',
    variant: 'warning',
    successAlert: {
      title: '',
      content: ''
    }
  })
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [secret, setSecret] = useState('')
  const [otpUrl, setOtpUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const currId = router.query.id || userId

  const queryClient = useQueryClient()

  const formOtp = useForm<SchemaProfileOtp>({
    resolver: yupResolver(schemaProfileOtp)
  })

  const user = useGetUser({ id: currId as string, enabled: router.isReady })
  const tfa = useFetchUser()

  const cover = useGetAsset({
    id: user.data?.data.profile?.cover ?? null,
    enabled: Boolean(user.data?.data.profile?.cover)
  })

  const photo = useGetAsset({
    id: user.data?.data.profile?.photo ?? null,
    enabled: Boolean(user.data?.data.profile?.photo)
  })

  const updateCover = useUpdateCover()
  const updatePhoto = useUpdatePhoto()
  const tfaGenerateMutation = useTfaGenerateMutation()

  const [userAlert, setUserAlert] = useAtom(userAlertAtom)

  const { reset, getValues, setValue, watch, handleSubmit, ...form } = useForm<SchemaFile>({
    resolver: yupResolver(schemaFile)
  })

  const [currPage, setCurrPage] = useState(1)
  const [userLogs, setUserLogs] = useState<GetUserLogActivityResponseData[]>([])
  const [groupedUserLogs, setGroupedUserLogs] = useState<UserLog[]>([])

  const userLogActivity = useGetUserLogActivity({ user_id: currId as string, page: currPage, enabled: router.isReady })

  useEffect(() => {
    if (userLogActivity.isSuccess) {
      setUserLogs(prevLogs => [...prevLogs, ...userLogActivity.data.data])
    }
  }, [userLogActivity.isSuccess, userLogActivity.data?.meta.current_page])

  useEffect(() => {
    if (userLogs.length) {
      const groupedLogActivity = groupUserLogs(userLogs)
      setGroupedUserLogs(groupedLogActivity)
    }
  }, [userLogs.length])

  const onSubmitPhoto = (type: string) => {
    setLoading(true)
    if (type === 'photo') {
      const formData = axios.toFormData({ file: watch('file') })
      updatePhoto.mutate(
        {
          file: formData,
          userId: router.query.id as string,
          profileId: user?.data?.data?.profile?.id,
          idPhoto: id[0]
        },
        {
          async onSuccess() {
            setOpenPhoto(false)
            await queryClient.invalidateQueries()
          }
        }
      )
    } else {
      const formData = axios.toFormData({ file: watch('file') })
      updateCover.mutate(
        {
          file: formData,
          userId: router.query.id as string,
          profileId: user?.data?.data?.profile?.id,
          idPhoto: id[0]
        },
        {
          async onSuccess() {
            setOpenCover(false)
            await queryClient.invalidateQueries()
          }
        }
      )
    }
    setLoading(false)

    // sementara sampe integration
    setIsOpenModal({
      ...isOpenModal,
      camera: false
    })
  }

  const onSaveOtp = () => {
    if (tfa?.data?.data?.tfa_secret === null) {
      setIsModalPassword(true)
    } else {
      setIsAccountVerified(true)
      setIsDisableTfa(true)
      setScanQRCode(true)
    }
  }

  // useEffect(() => {
  //   const defaultValue = tfa?.data?.data?.tfa_secret !== null ? 'enable' : 'disable'
  //   console.log(defaultValue)
  //   formOtp.setValue('loginOption', defaultValue)
  // }, [])

  // const defaultValue = tfa?.data?.data?.tfa_secret !== null ? 'enable' : 'disable'

  const onSubmit = async (password: string) => {
    if (tfa?.data?.data?.tfa_secret === null) {
      setIsDisableTfa(false)
      //login otp
      try {
        const responseTFAGenerate = await tfaGenerateMutation.mutateAsync(password)
        setOtpUrl(responseTFAGenerate.data.data.otpauth_url)
        setSecret(responseTFAGenerate.data.data.secret)
        setIsAccountVerified(false)
        setScanQRCode(true)
        setIsModalPassword(false)
      } catch (err: any) {
        setPasswordError(err?.response?.data?.errors[0]?.message)
      }
    } else {
      setIsAccountVerified(true)
      setIsDisableTfa(true)
      setScanQRCode(true)
      setIsModalPassword(false)
    }
    setIsLoading(false)
  }

  const profileSections = [
    {
      id: 1,
      title: 'Personal Data',
      fields: [
        {
          label: 'ID Number',
          value: user.data?.data.profile?.id_number ?? '-'
        },
        {
          label: 'First Name',
          value: user.data?.data.profile?.first_name ?? '-'
        },
        {
          label: 'Last Name',
          value: user.data?.data.profile?.last_name ?? '-'
        },
        {
          label: 'Gender',
          value: user.data?.data.profile?.gender ? titleCase(user.data?.data.profile?.gender ?? '-') : '-'
        },
        {
          label: 'Religion',
          value: user.data?.data.profile?.religion
            ? titleCase(user.data?.data.profile?.religion?.replaceAll('_', ' '))
            : '-'
        }
      ],
      path: 'personal-data'
    },
    {
      id: 2,
      title: 'Job Profile',
      fields: [
        {
          label: 'Email',
          value: user?.data?.data.email
        },
        {
          label: 'Roles',
          value: user?.data?.data.privileges.map(privilege => privilege.role.name)
        },
        {
          label: 'Work Center',
          value: user?.data?.data.werk?.name
        },
        {
          label: 'Department',
          value: user?.data?.data.sto?.name
        },
        {
          label: 'Job Function',
          value: user?.data?.data?.job_function?.name
        },
        {
          label: 'Job Level',
          value: user?.data?.data?.job_function?.job_level.name
        },
        {
          label: 'Job Title',
          value: user?.data?.data.job_title ?? ''
        }
      ],
      path: 'job-profile'
    },
    {
      id: 3,
      title: 'Address & Contact',
      fields: [
        { label: 'Address', value: user.data?.data.profile?.address ?? '-' },
        { label: 'Phone', value: user.data?.data.profile?.phone ?? '-' },
        { label: 'Postal Code', value: user.data?.data.profile?.post_code ?? '-' }
      ],
      path: 'address-and-contact'
    }
  ]

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

  const renderContentModal = (type: string = 'camera') => {
    const modalType: Record<string, JSX.Element | null> = {
      camera: <ContentModalCamera onSaveAsProfile={onSubmitPhoto} />
    }

    return modalType[type]
  }

  return (
    <main>
      <Link component={NextLink} href='/core/user' sx={{ display: 'flex', alignItems: 'center', marginY: '12px' }}>
        <Icon icon='ic:arrow-back' style={{ color: theme.palette.primary.main }} fontSize='20px' /> Back
      </Link>
      <MvTypography size='TITLE_MD' typeSize='PX' paddingY={4}>
        View User Profile
      </MvTypography>

      <Breadcrumbs
        data={[
          {
            icon: 'tabler:briefcase',
            label: 'User',
            path: '/core/user'
          },
          {
            label: 'View User Profile',
            path: '/core/user/' + currId
          }
        ]}
      />

      <Grid container spacing={3}>
        <Grid item sm={12} md={isUserProfileRoute ? 12 : 8}>
          <Card
            sx={{
              boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
              padding: '20px',
              flex: '1 1 0%',
              marginTop: '24.5px'
            }}
          >
            <CardContent style={{ display: 'flex', flexDirection: 'column', rowGap: '20px', padding: 0 }}>
              {!router.isReady || user.isInitialLoading || cover.isInitialLoading || photo.isInitialLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : null}

              {user.isError || cover.isError || photo.isError ? (
                <MvTypography size='BODY_MD_NORMAL' typeSize='PX' sx={{ textAlign: 'center' }}>
                  Something went wrong. Please try again later
                </MvTypography>
              ) : null}

              {user.isSuccess ? (
                <>
                  <div
                    style={{
                      backgroundColor: theme.palette.grey[100],
                      borderRadius: '6px',
                      overflow: 'hidden',
                      position: 'relative',
                      height: '328px'
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '250px',
                        position: 'relative'
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: cover.data ? undefined : 'rgba(0, 94, 255, .16)'
                        }}
                      >
                        {cover.data ? (
                          <Image src={cover.data} alt='Header photo' fill style={{ objectFit: 'cover' }} />
                        ) : null}
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          right: 20,
                          top: 20
                        }}
                      >
                        <Dropdown
                          icon='mdi:pencil-outline'
                          label=''
                          color='primary'
                          menu={[
                            {
                              content: 'Take Photo',
                              icon: 'tabler:camera'
                            },
                            {
                              content: 'Choose From Gallery',
                              icon: 'tabler:photo',
                              onClick: () => setOpenCover(true)
                            },
                            {
                              content: 'Remove Current Photo',
                              icon: 'tabler:trash',
                              onClick: () => {
                                setModalConfirmData({
                                  title: 'Are you sure to delete cover photo?',
                                  description: "You won't be able to revert this.",
                                  positiveLabel: 'Yes, delete it.',
                                  variant: 'danger',
                                  successAlert: {
                                    title: 'Successfully delete data.',
                                    content: 'Cover photo has been deleted by our system.'
                                  }
                                })
                                setIsOpenModalConfirm(true)
                              }
                            }
                          ]}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        position: 'absolute',
                        left: '20px',
                        bottom: '20px',
                        columnGap: '15px'
                      }}
                    >
                      <div
                        style={{
                          width: '88px',
                          height: '88px',
                          position: 'relative'
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '9999px',
                            overflow: 'hidden',
                            position: 'relative',
                            ...(photo.data
                              ? {}
                              : {
                                  backgroundColor: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                })
                          }}
                        >
                          {photo.data ? (
                            <Image src={photo.data} alt='Profile photo' fill style={{ objectFit: 'cover' }} />
                          ) : (
                            <Icon icon='mdi:account-outline' color='#005EFF' fontSize='48px' />
                          )}
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0
                          }}
                        >
                          <Dropdown
                            icon='mdi:pencil-outline'
                            label=''
                            color='primary'
                            menu={[
                              {
                                content: 'Take Photo',
                                icon: 'tabler:camera',
                                onClick: () =>
                                  setIsOpenModal({
                                    ...isOpenModal,
                                    camera: true
                                  })
                              },
                              {
                                content: 'Choose From Gallery',
                                icon: 'tabler:photo',
                                onClick: () => setOpenPhoto(true)
                              },
                              {
                                content: 'Remove Current Photo',
                                icon: 'tabler:trash',
                                onClick: () => {
                                  setModalConfirmData({
                                    title: 'Are you sure to delete profile photo?',
                                    description: "You won't be able to revert this.",
                                    positiveLabel: 'Yes, delete it.',
                                    variant: 'danger',
                                    successAlert: {
                                      title: 'Successfully delete data.',
                                      content: 'Profile photo has been deleted by our system.'
                                    }
                                  })
                                  setIsOpenModalConfirm(true)
                                }
                              }
                            ]}
                          />
                        </div>
                      </div>
                      <div style={{ alignSelf: 'flex-end' }}>
                        <MvTypography size='LABEL_LG_BOLDEST' typeSize='PX'>
                          {user.data.data.profile?.full_name ?? '-'}
                        </MvTypography>
                        <div style={{ display: 'flex', alignItems: 'center', columnGap: '13px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', columnGap: '5px', marginTop: '5px' }}>
                            <Icon icon='mdi:email-outline' color='#5D5E61' fontSize='20px' />
                            <MvTypography size='BODY_SM_NORMAL' typeSize='PX'>
                              {user.data.data.email}
                            </MvTypography>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', columnGap: '5px', marginTop: '5px' }}>
                            <Icon icon='mdi:map-marker-outline' color='#5D5E61' fontSize='20px' />
                            <MvTypography size='BODY_SM_NORMAL' typeSize='PX'>
                              {user.data.data.profile?.address ?? '-'}
                            </MvTypography>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert
                    title={isAccountVerified ? 'Your data has been verified!' : 'User data need verification'}
                    content='Data verification is needed for users to log in to the existing system'
                    variant={isAccountVerified ? 'primary' : 'warning'}
                    size='large'
                  >
                    {!isAccountVerified && (
                      <Button
                        content='iconText'
                        icon='tabler:check'
                        color='warning'
                        variant='contained'
                        text='Verify'
                        onClick={() => {
                          setModalConfirmData({
                            title: `Are you sure to verify account of ${user.data.data.profile?.full_name}`,
                            description: 'This account will be verified to access the system based on role.',
                            positiveLabel: 'Yes',
                            variant: 'warning',
                            successAlert: {
                              title: 'Successfully verify account',
                              content: 'User has been verified'
                            }
                          })
                          setIsOpenModalConfirm(true)
                        }}
                      />
                    )}
                  </Alert>

                  {profileSections.map(section => (
                    <InfoProfile
                      key={section.id}
                      title={section.title}
                      fields={section.fields}
                      renderEditButton={
                        <Button
                          content='iconText'
                          text='Edit'
                          icon='iconoir:edit-pencil'
                          variant='plain'
                          LinkComponent={NextLink}
                          href={`/core/user/${currId}/edit/${section.path}`}
                        />
                      }
                    />
                  ))}
                </>
              ) : null}

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  gap: 2
                }}
              >
                {isUserProfileRoute ? (
                  <Box
                    sx={{
                      backgroundColor: '#FEFEFE',
                      border: `1px solid ${theme.palette.grey[300]}`,
                      borderRadius: '6px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      minWidth: '200px',
                      width: '100%'
                    }}
                  >
                    <Controller
                      name='loginOption'
                      control={formOtp.control}
                      defaultValue={tfa?.data?.data?.tfa_secret?.length ? 'enable' : 'disable'}
                      render={({ field }) => (
                        <>
                          <Box ml={6} sx={{ width: '100%', display: 'flex', alignItem: 'center' }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={tfa?.data?.data?.tfa_secret?.length ? true : false}
                                  onChange={onSaveOtp}
                                  label={tfa?.data?.data?.tfa_secret?.length ? 'Enable' : 'Disable'}
                                />
                              }
                              label={''}
                            />
                          </Box>
                          <Box>
                            <MvTypography
                              mt={2}
                              typeSize='PX'
                              size='LABEL_MD_BOLDEST'
                              lineHeight='14px'
                              letterSpacing='0.25px'
                            >
                              Two-Factor Authenctication
                            </MvTypography>
                            <MvTypography
                              mt={2}
                              typeSize='PX'
                              size='LABEL_MD_NORMAL'
                              lineHeight='14px'
                              letterSpacing='0.25px'
                              color={theme.colorToken.text.neutral.normal}
                            >
                              The login process will go through two stages, namely password input and OTP input.
                            </MvTypography>
                          </Box>
                        </>
                      )}
                    />
                    {formOtp.formState.errors.loginOption && (
                      <MvTypography size='HELPER_TEXT_SM' typeSize='PX' color='error'>
                        {formOtp.formState.errors.loginOption.message}
                      </MvTypography>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      border: `1px solid ${theme.colorToken.border.neutral.normal}`,
                      backgroundColor: theme.colorToken.background.neutral.normal,
                      borderRadius: '6px',
                      padding: '20px',
                      minWidth: '200px',
                      width: '100%'
                    }}
                  >
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Badge
                        color={user.data?.data.tfa_secret ? 'neutral' : 'success'}
                        label={user.data?.data.tfa_secret ? 'Disable' : 'Enable'}
                        size='medium'
                        style='rect'
                      />
                      <Button
                        content='iconText'
                        text='Reset 2-FA'
                        icon='tabler:refresh-dot'
                        variant='plain'
                        onClick={() => {
                          setModalConfirmData({
                            title: `Are you sure to reset two-factor authentication of ${user.data?.data.profile?.full_name} account?`,
                            description:
                              'Two factor authentication will reset and user must be scan qr code or enter verification code was sent by email.',
                            positiveLabel: 'Yes',
                            variant: 'warning',
                            successAlert: {
                              title: 'Successfully Reset 2-FA.',
                              content: 'This account was success to reset 2-FA!'
                            }
                          })
                          setIsOpenModalConfirm(true)
                        }}
                      />
                    </Stack>
                    <MvTypography
                      mt={2}
                      typeSize='PX'
                      size='LABEL_MD_BOLDEST'
                      lineHeight='14px'
                      letterSpacing='0.25px'
                      color={theme.colorToken.text.neutral.normal}
                    >
                      Two-Factor Authenctication
                    </MvTypography>
                    <MvTypography
                      mt={2}
                      typeSize='PX'
                      size='LABEL_MD_NORMAL'
                      lineHeight='14px'
                      letterSpacing='0.25px'
                      color={theme.colorToken.text.neutral.normal}
                    >
                      The login process will go through two stages, namely password input and OTP input.
                    </MvTypography>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    border: `1px solid ${theme.palette.grey[300]}`,
                    borderRadius: '6px',
                    padding: '20px',
                    minWidth: '200px',
                    width: '100%'
                  }}
                >
                  <Box sx={{ alignItems: 'center', gap: 2 }}>
                    <Badge color='success' label='Active' size='medium' style='rect' />
                    <MvTypography
                      mt={2}
                      typeSize='PX'
                      size='LABEL_MD_NORMAL'
                      lineHeight='14px'
                      letterSpacing='0.25px'
                      color={theme.colorToken.text.neutral.normal}
                    >
                      This data record is active and accessible across application. It could be shown as a dropdown
                      value, or else.
                    </MvTypography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {!isUserProfileRoute && (
          <Grid item sm={12} md={4} sx={{ mt: 6 }}>
            <UserLogActivity userLogs={groupedUserLogs} />
            {userLogActivity.isSuccess &&
            userLogActivity.data?.meta.total_page > 1 &&
            userLogActivity.data.meta.current_page < userLogActivity.data.meta.total_page ? (
              <Button
                content='iconText'
                icon='tabler:arrow-down'
                text='Load more'
                loading={userLogActivity.isPending}
                disabled={userLogActivity.isPending}
                onClick={() => setCurrPage(prev => prev + 1)}
              />
            ) : null}
          </Grid>
        )}
      </Grid>

      {/* Modal Photo */}
      <Modal
        isOpen={openPhoto}
        closeable={true}
        onClose={() => setOpenPhoto(prev => !prev)}
        title='Choose photo from your gallery'
        description='A good photo profile will help you stand out.'
        renderAction={false}
      >
        <form style={{ marginTop: 10 }} onSubmit={handleSubmit(() => onSubmitPhoto('photo'))}>
          <Controller
            name='file'
            control={form.control}
            render={({ field: { onChange, ref } }) => (
              <UploadFile
                {...ref}
                onChange={(event: any) => {
                  const files = event.target.files
                  if (files && files.length > 0) {
                    onChange(files[0])
                  }
                }}
                variant='single'
                type='dragndrop'
                setId={setId}
              />
            )}
          />

          <Box sx={{ display: 'flex', justifyContent: 'end', gap: 3, marginTop: 5 }}>
            <Button content='textOnly' variant='outlined' text='Cancel' onClick={() => setOpenPhoto(false)} />
            <Button type='submit' content='textOnly' text='Save' />
          </Box>
        </form>
      </Modal>
      {/* Modal Cover */}
      <Modal
        isOpen={openCover}
        onClose={() => setOpenCover(prev => !prev)}
        title='Choose photo from your gallery'
        description='A good photo profile will help you stand out.'
        renderAction={false}
      >
        <form style={{ marginTop: 10 }} onSubmit={handleSubmit(() => onSubmitPhoto('cover'))}>
          <Controller
            name='file'
            control={form.control}
            render={({ field: { onChange, ref } }) => (
              <UploadFile
                {...ref}
                onChange={(event: any) => {
                  const files = event.target.files
                  if (files && files.length > 0) {
                    onChange(files[0])
                  }
                }}
                variant='single'
                type='dragndrop'
                setId={setId}
              />
            )}
          />

          <Box sx={{ display: 'flex', justifyContent: 'end', gap: 3, marginTop: 3 }}>
            <Button content='textOnly' variant='outlined' text='Cancel' onClick={() => setOpenCover(false)} />
            <Button type='submit' content='textOnly' variant='outlined' text='Save' />
          </Box>
        </form>
      </Modal>
      {/* Modal OTP Verification */}
      <ModalVerificationOtp
        password={password}
        valueQrCode={otpUrl}
        secret={secret}
        open={scanQRCode}
        setOpen={setScanQRCode}
        isVerifiedCode={isAccountVerified}
        email={user?.data?.data.email as string}
        isLoggedIn={true}
        isDisableTfa={isDisableTfa}
      />
      {/* End Modal OTP Verification */}

      <ModalVerificationPassword
        isLoading={isLoading}
        passwordError={passwordError}
        open={isModalPassword}
        setOpen={setIsModalPassword}
        onSubmit={val => {
          setPassword(val)
          onSubmit(val)
        }}
      />

      {/* Modal verify/remove photo/confirm rest 2-fa */}
      <Modal
        title={modalConfirmData.title}
        description={modalConfirmData.description}
        positiveLabel={modalConfirmData.positiveLabel}
        status={modalConfirmData.variant as 'primary' | 'danger' | 'success' | 'warning'}
        type='confirmation'
        isOpen={isOpenModalConfirm}
        onClose={() => setIsOpenModalConfirm(false)}
        onOk={() => {
          setIsOpenModalConfirm(false)
          if (Math.floor(Math.random() * 2)) {
            if (modalConfirmData.title.toLowerCase().includes('verify')) {
              setIsAccountVerified(true)
            }
            setUserAlert({
              title: modalConfirmData.successAlert.title,
              content: modalConfirmData.successAlert.content,
              variant: 'success',
              size: 'small',
              pathname: `/core/user/[id]${isUserProfileRoute ? '/profile' : ''}`,
              open: true
            })
          } else {
            setUserAlert({
              title: 'Network Errors.',
              content: 'Unable to connect to the netwotk or server.',
              variant: 'danger',
              size: 'small',
              pathname: `/core/user/[id]${isUserProfileRoute ? '/profile' : ''}`,
              open: true
            })
          }
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />

      {/* Modal Camera  */}
      <Modal
        isOpen={isOpenModal.camera}
        closeable={true}
        onClose={() =>
          setIsOpenModal({
            ...isOpenModal,
            camera: !isOpenModal.camera
          })
        }
        title='Camera'
        description=''
        renderAction={false}
      >
        {renderContentModal()}
      </Modal>

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
