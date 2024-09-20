import { MvTypography } from '@/components/atoms/mv-typography'
import { Modal } from '@/components/molecules'
import { Breadcrumbs, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { useTheme } from '@mui/material/styles'
import { useAtom } from 'jotai'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import { Alert } from 'src/components/atoms/alert/Alert'
import { userAlertAtom } from '../atoms'
import { PagePrimaryProps, schemaImportExcel, SchemaImportExcel } from '../types/PagePrimary.type'
import { DynamicTableWithActionButton } from './DynamicTableWithActionButton'
import { Button } from '@/components/atoms'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { FormImportFile } from './FormImportFile'

export function PagePrimary<T>({
  title,
  action,
  columns,
  dataFetchService,
  filters,
  renderActionButton,
  modalOpen,
  setModalOpen,
  isCollapsed,
  renderTopBarAction,
  groupFieldKeyTitle,
  groupName
}: PagePrimaryProps<T>) {
  const theme = useTheme()
  const [userAlert, setUserAlert] = useAtom(userAlertAtom)
  const router = useRouter()

  const [processingFile, setProcessingFile] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const form = useForm<SchemaImportExcel>({
    resolver: yupResolver(schemaImportExcel),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  const handleActionClick = () => {
    if (action?.href) {
      router.push(action.href)
    } else if (action?.modalContent) {
      setModalOpen(true)
    }
  }

  const handleActionConfirm = () => {
    if (action?.modalProps?.onOk) {
      action.modalProps.onOk()
    }
    setModalOpen(false)
  }

  const handleModalClose = () => {
    if (action?.modalProps?.onClose) {
      action.modalProps.onClose()
    }
    setModalOpen(false)
  }

  const handleProcessFile = () => {
    setProcessingFile(true)

    try {
      const progressUpload = setInterval(() => {
        setUploadProgress(prevProgress => {
          let updatedProgress = prevProgress + 10
          if (updatedProgress === 100) {
            clearInterval(progressUpload)
            handleModalClose()
            setUserAlert({
              title: 'Import Data Success',
              content: `{{x} data has been imported to ${title}}`,
              color: 'success',
              icon: 'ic:baseline-check',
              pathname: router.pathname,
              open: true
            })
            setProcessingFile(false)
            updatedProgress = 0
          }
          return updatedProgress
        })
      }, 500)
    } catch (error) {
      setUserAlert({
        title: 'Error when importing data',
        content: '{Custom reason/response error message}',
        color: 'error',
        icon: 'ic:baseline-do-disturb',
        pathname: router.pathname,
        open: true
      })
    }
  }

  const onUpload = () => {
    setProcessingFile(false)
    setUploadProgress(0)
    handleModalClose()
    form.reset()
  }

  return (
    <main>
      <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '24px' }}>
        <Box sx={{ flexGrow: 1 }}>
          <MvTypography size='TITLE_XL' typeSize='PX'>
            {title}
          </MvTypography>
          <Breadcrumbs
            aria-label='breadcrumb'
            sx={{ m: '20px 0px' }}
            separator={<Icon icon='mdi:chevron-right' color='#909094' />}
          >
            <Link component={NextLink} href='/'>
              <Icon icon='mdi:home-outline' style={{ color: theme.palette.primary.main }} fontSize='20px' />
            </Link>
            <MvTypography size='BODY_MD_BOLDEST' typeSize='PX'>
              {title}
            </MvTypography>
          </Breadcrumbs>
        </Box>

        {userAlert.pathname === router.pathname && userAlert.open && (
          <Alert
            variant='contained'
            content={userAlert.content}
            color={userAlert.color}
            title={userAlert.title}
            icon={userAlert.icon}
            onClose={() => setUserAlert({ ...userAlert, open: false })}
          />
        )}
        <Stack flexDirection='row' gap={1}>
          {renderTopBarAction && renderTopBarAction}
          {action && action.content === 'iconText' ? (
            <Button
              variant={action.variant ?? 'contained'}
              onClick={handleActionClick}
              content='iconText'
              text={action.label}
              icon={action.icon as string}
              loading={action?.loading}
              disabled={action?.disabled}
            />
          ) : action?.content === 'iconOnly' ? (
            <Button
              variant={action.variant ?? 'contained'}
              onClick={handleActionClick}
              content='iconOnly'
              icon={action.icon as string}
              loading={action?.loading}
              disabled={action?.disabled}
            />
          ) : (
            <Button
              variant={action?.variant ?? 'contained'}
              onClick={handleActionClick}
              content='textOnly'
              text={action?.label as string}
              loading={action?.loading}
              disabled={action?.disabled}
            />
          )}
        </Stack>

        {(action?.modalContent || action?.modalProps) && (
          <Modal
            isOpen={modalOpen || false}
            onClose={handleModalClose}
            type={action.modalProps?.variant || 'default'}
            positiveLabel={action.modalProps?.positiveLabel || 'Confirm'}
            negativeLabel={action.modalProps?.negativeLabel || 'Cancel'}
            loading={action.modalProps?.loading}
            title={
              processingFile
                ? 'We are inserting data from your file'
                : action.modalProps?.title || `Confirm ${action.label}`
            }
            description={
              processingFile
                ? 'This process time are vary, depends on numbers of data processed'
                : action.modalProps?.description || 'File should be match with this predefined template. See template'
            }
            renderAction={action.modalProps?.renderAction}
            onOk={handleActionConfirm}
          >
            {renderTopBarAction ? (
              <FormImportFile
                form={form}
                processingFile={processingFile}
                handleProcessFile={handleProcessFile}
                uploadProgress={uploadProgress}
                onUpload={onUpload}
              />
            ) : (
              action.modalContent
            )}
          </Modal>
        )}
      </Box>

      <DynamicTableWithActionButton
        columns={columns}
        dataFetchService={dataFetchService}
        filters={filters}
        renderActionButton={renderActionButton}
        isCollapsed={isCollapsed}
        groupFieldKeyTitle={groupFieldKeyTitle}
        groupName={groupName}
      />
    </main>
  )
}
