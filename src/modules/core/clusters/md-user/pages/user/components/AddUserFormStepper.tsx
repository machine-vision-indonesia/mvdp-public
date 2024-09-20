import { useTheme } from '@mui/material/styles'
import { useEffect, useState, type MouseEventHandler } from 'react'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import { useForm } from 'react-hook-form'
import client from 'src/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from 'src/components/atoms/button'
import { useRouter } from 'next/router'
import { queryClient } from 'src/pages/_app'
import { useAtom } from 'jotai'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Stepper } from '@/components/molecules'
import { UserStepOne } from './UserStepOne'
import { UserStepTwo } from './UserStepTwo'
import { UserStepThree } from './UserStepThree'
import { UserStepFour } from './UserStepFor'
import { UserStepFive } from './UserStepFive'
import { schemaAddUser } from '../validations'
import { GENDERS, RELIGIONS } from '../constants/ManageUserPage.constants'
import { SchemaAddUser } from '../types/ManageUserPage.types'
import { usePostUser } from '../services/actionAddUser.service'
import { useGetJobFunctions, useGetRoles, useGetWorkCenters } from '../services/fetchUser.service'
import { useListDepartment } from '../services/fetchDetailUser.service'
import { ModalDialog } from '@/components/molecules/modal-dialog'
import { userAlertAtom } from '../atoms'

export default function AddUserFormStepper() {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const { reset, getValues, setValue, ...form } = useForm<SchemaAddUser>({
    resolver: yupResolver(schemaAddUser),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  const watchCover = form.watch('cover')
  const coverPreviewString = watchCover ? URL.createObjectURL(new Blob([watchCover], { type: watchCover.type })) : null

  useEffect(() => {
    return () => {
      if (coverPreviewString) {
        URL.revokeObjectURL(coverPreviewString)
      }
    }
  }, [coverPreviewString])

  const watchPhoto = form.watch('photo')
  const photoPreviewString = watchPhoto ? URL.createObjectURL(new Blob([watchPhoto], { type: watchPhoto.type })) : null

  useEffect(() => {
    return () => {
      if (photoPreviewString) {
        URL.revokeObjectURL(photoPreviewString)
      }
    }
  }, [photoPreviewString])

  const watchFirstName = form.watch('first_name')
  const watchLastName = form.watch('last_name')
  const fullName = watchFirstName + ' ' + watchLastName

  const watchEmail = form.watch('email')
  const watchAddress = form.watch('address')
  const watchRoles = form.watch('roles')
  const watchWorkCenter = form.watch('work_center')
  const watchDepartment = form.watch('department')
  const watchJobFunction = form.watch('job_function')
  const watchJobLevel = form.watch('job_level')
  const watchJobTitle = form.watch('job_title')

  const watchIdNumber = form.watch('id_number')
  const watchGenderLabel = form.watch('gender.label')
  const watchReligionLabel = form.watch('religion.label')
  const watchPhone = form.watch('phone')
  const watchPostCode = form.watch('post_code')

  // Services
  const rolesQuery = useGetRoles()
  const workCenters = useGetWorkCenters()
  const jobFunctions = useGetJobFunctions()
  const departmentsQuery = useListDepartment()
  const roleOptions =
    rolesQuery.data?.data.map(role => ({
      id: role.id,
      label: role.name
    })) ?? []

  const jobFunctionOptions =
    jobFunctions.data?.data.map(jobFunction => ({
      id: jobFunction.id,
      label: jobFunction.name,
      job_level: jobFunction.job_level
    })) ?? []

  const departmentOptions =
    departmentsQuery.data?.data.map(department => ({
      id: department.id,
      label: department.name
    })) ?? []

  const [isLoadingNext, setIsLoadingNext] = useState(false)

  const handleAddUser = async () => {
    try {
      await createUserMutation.mutateAsync(getValues())
      await queryClient.invalidateQueries()

      setUserAlert({
        title: 'Successfully save data.',
        content: 'User has been saved by our system.',
        variant: 'success',
        size: 'small',
        pathname: '/core/user',
        open: true
      })

      router.push('/core/user')
    } catch {
      setUserAlert({
        title: 'Network Errors',
        content: 'Unable to connect to the network or server.',
        variant: 'danger',
        size: 'small',
        pathname: '/core/user/add',
        open: true
      })

      setIsConfirmModalOpen(false)

      createUserMutation.reset()
    }
  }

  const handleBack = () => {
    if (activeStep === 0) {
      setModalConfirmData({
        title: 'Are you sure to cancel this process?',
        description: "You won't be able to revert this!",
        handleOk: () => router.push('/core/user')
      })
      setIsConfirmModalOpen(true)
    } else {
      setActiveStep(prev => prev - 1)
    }
  }

  const onSubmit = () => {
    setModalConfirmData({
      title: 'Are you sure to save data user?',
      description: "You won't be able to revert this!",
      handleOk: handleAddUser
    })
    setIsConfirmModalOpen(true)
  }

  const onNextClick: MouseEventHandler<HTMLButtonElement> = async e => {
    e.preventDefault()
    let isValid = false

    if (activeStep === 0) {
      isValid = await form.trigger([
        'id_number',
        'first_name',
        'last_name',
        'gender',
        'religion',
        'email',
        'password',
        'confirm_password'
      ])

      // if (isValid) {
      //   setIsLoadingNext(true)

      //   const email = getValues('email')
      //   const response = await client.api.get('/users', {
      //     params: {
      //       filter: {
      //         email: {
      //           _eq: email
      //         }
      //       }
      //     }
      //   })

      //   if (response.data.data.length) {
      //     form.setError('email', {
      //       type: 'manual',
      //       message: 'Email already exists'
      //     })

      //     isValid = false
      //   }

      //   setIsLoadingNext(false)
      // }
    }

    if (activeStep === 1) {
      isValid = await form.trigger(['roles', 'work_center', 'department', 'job_function', 'job_level', 'job_title'])

      // if (isValid) {
      //   setIsLoadingNext(true)

      //   const idNumber = getValues('id_number')
      //   const response = await client.api.get('/users', {
      //     params: {
      //       filter: {
      //         profile: {
      //           id_number: {
      //             _eq: idNumber
      //           }
      //         }
      //       }
      //     }
      //   })

      //   if (response.data.data.length) {
      //     form.setError('id_number', {
      //       type: 'manual',
      //       message: 'ID Number already exists'
      //     })

      //     isValid = false
      //   }

      //   setIsLoadingNext(false)
      // }
    }

    if (activeStep === 2) {
      isValid = await form.trigger(['address', 'phone', 'post_code'])
    }

    if (activeStep === 3) {
      isValid = await form.trigger(['photo', 'cover'])
    }

    if (isValid) {
      setActiveStep(prev => prev + 1)
    }
  }

  const createUserMutation = usePostUser()

  const router = useRouter()

  const [userAlert, setUserAlert] = useAtom(userAlertAtom)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [modalConfirmData, setModalConfirmData] = useState({
    title: '',
    description: '',
    handleOk: () => {}
  })

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

  const STEPS = [
    {
      active: activeStep === 0,
      label: '1',
      passed: activeStep > 0,
      subtitle: 'Enter your Personal Data',
      title: 'Personal Data'
    },
    {
      active: activeStep === 1,
      label: '2',
      passed: activeStep > 1,
      subtitle: 'Enter your Job Profile',
      title: 'Job Profile'
    },
    {
      active: activeStep === 2,
      label: '3',
      passed: activeStep > 2,
      subtitle: 'Enter your Address & Contact',
      title: 'Address & Contact'
    },
    {
      active: activeStep === 3,
      label: '4',
      passed: activeStep > 3,
      subtitle: 'Upload your Photo Profile',
      title: 'Photo Profile'
    },
    {
      active: activeStep === 4,
      label: '5',
      passed: activeStep > 4,
      subtitle: 'Review your data',
      title: 'Review Data'
    }
  ]

  return (
    <>
      <CardContent sx={{ padding: 0, flexShrink: 0 }}>
        <Stepper data={STEPS} orientation='vertical' size='small' />
      </CardContent>
      <Divider
        flexItem
        orientation='vertical'
        sx={{ borderColor: theme.colorToken.border.neutral.normal, mx: '24px' }}
      />
      <CardContent sx={{ width: '100%', padding: 0 }}>
        <form onSubmit={form.handleSubmit(() => onSubmit())}>
          <MvTypography size='TITLE_SM' typeSize='PX'>
            {STEPS[activeStep].title}
          </MvTypography>
          {/* <MvTypography size='BODY_SM_NORMAL' typeSize='PX'>
            {STEPS[activeStep]?.subtitle}
          </MvTypography> */}
          {activeStep === 0 ? <UserStepOne pages='add' form={form} genders={GENDERS} religions={RELIGIONS} /> : null}

          {activeStep === 1 ? (
            <UserStepTwo
              form={form}
              roleOptions={roleOptions}
              workCenters={workCenters}
              departmentOptions={departmentOptions}
              jobFunctionOptions={jobFunctionOptions}
              watchDepartment={watchDepartment}
              watchJobFunction={watchJobFunction}
            />
          ) : null}

          {activeStep === 2 ? <UserStepThree form={form} /> : null}

          {activeStep === 3 ? <UserStepFour form={form} /> : null}

          {activeStep === 4 ? (
            <UserStepFive
              fullName={fullName}
              watchDepartment={watchDepartment}
              watchEmail={watchEmail}
              watchFirstName={watchFirstName}
              watchGenderLabel={watchGenderLabel}
              watchIdNumber={watchIdNumber}
              watchJobFunction={watchJobFunction}
              watchJobLevel={watchJobLevel}
              watchJobTitle={watchJobTitle}
              watchLastName={watchLastName}
              watchReligionLabel={watchReligionLabel}
              watchRoles={watchRoles}
              watchWorkCenter={watchWorkCenter}
              coverPreviewString={coverPreviewString}
              photoPreviewString={photoPreviewString}
              watchAddress={watchAddress}
              watchPhone={watchPhone}
              watchPostCode={watchPostCode}
            />
          ) : null}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 4,
              alignItems: 'center',
              marginTop: '3rem'
            }}
          >
            <Button
              content='textOnly'
              text={activeStep !== 0 ? 'Back' : 'Cancel'}
              onClick={handleBack}
              variant='outlined'
              size='large'
            />

            <Button
              variant='contained'
              content='textOnly'
              text={activeStep === STEPS.length - 1 ? 'Submit' : 'Next'}
              size='large'
              disabled={isLoadingNext}
              loading={isLoadingNext}
              {...(activeStep === 4 ? { type: 'submit' } : { type: 'button', onClick: onNextClick })}
            />
          </div>
        </form>
      </CardContent>

      <ModalDialog
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        typeVariant='confirmation'
        statusVariant='warning'
        loading={createUserMutation.isPending || createUserMutation.isSuccess}
        positiveLabel='Yes'
        title={modalConfirmData.title}
        description={modalConfirmData.description}
        onOk={modalConfirmData.handleOk}
      />
    </>
  )
}
