import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { queryGraphicAlertAtom } from '../atoms'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Breadcrumbs } from '@/components/atoms/breadcrumbs'
import { AddQueryGraphicForm } from './AddQueryGraphicForm'
import { useForm } from 'react-hook-form'
import { SchemaAddQueryGraphic } from '../types/ManageQueryGraphicAddPage.types'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaAddQueryGraphic } from '../validations'
import { useRouter } from 'next/router'
import { useParams } from 'react-router-dom'
import { GetQueryGraphicByCode, useGetQueryGraphic } from '../services/fetchQueryGraphic.services'
import { Box } from '@mui/material'
import { Alert } from '@/components/molecules/alert'
import { ModalDialog } from '@/components/molecules/modal-dialog'
import { queryClient } from '@/pages/_app'
import { useEditQueryGraphic } from '../services/actionEditQueryGraphic.services'

export function ManageQueryGraphicEditPage() {
  const router = useRouter()
  const { id: jobFunctionId } = useParams()

  const currId = router.query.id || jobFunctionId

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [queryGraphicAlert, setQueryGraphicAlert] = useAtom(queryGraphicAlertAtom)

  // Services
  const queryGraphic = useGetQueryGraphic({ id: currId as string, enabled: router.isReady })
  const editQueryGraphic = useEditQueryGraphic()

  const form = useForm<SchemaAddQueryGraphic>({
    resolver: yupResolver(schemaAddQueryGraphic),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  useEffect(() => {
    if (!queryGraphicAlert.open) {
      return
    }

    setTimeout(() => {
      setQueryGraphicAlert({
        ...queryGraphicAlert,
        open: false
      })
    }, 4000)
  }, [setQueryGraphicAlert, queryGraphicAlert])

  return (
    <main>
      <MvTypography size='TITLE_MD' typeSize='PX'>
        Edit Query Graphics
      </MvTypography>
      <Breadcrumbs
        data={[
          {
            icon: 'tabler:briefcase',
            label: 'MV Core Query',
            path: '/core/query-graphic'
          },
          {
            label: 'Create Query Graphics',
            path: `/core/query-graphic/edit/${currId}`
          }
        ]}
      />

      {queryGraphic.isSuccess ? (
        <AddQueryGraphicForm
          form={form}
          pages='edit'
          fields={queryGraphic.data.data}
          onSubmit={() => setIsConfirmModalOpen(true)}
          isLoading={isLoading}
        />
      ) : null}

      {queryGraphicAlert.pathname === router.pathname && queryGraphicAlert.open ? (
        <Box sx={{ position: 'absolute', zIndex: 9999, top: 80, right: 0 }}>
          <Alert
            title={queryGraphicAlert.title}
            size={queryGraphicAlert.size}
            content={queryGraphicAlert.content}
            variant={queryGraphicAlert.variant}
          />
        </Box>
      ) : null}

      <ModalDialog
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        typeVariant='confirmation'
        statusVariant='warning'
        loading={editQueryGraphic.isPending}
        positiveLabel='Yes'
        title={`Are you sure to edit Query Graphic?`}
        description="You won't be able to revert this!"
        onOk={async () => {
          try {
            await editQueryGraphic.mutateAsync({ id: currId as string, ...form.getValues() })
            await queryClient.invalidateQueries()

            setQueryGraphicAlert({
              title: 'Successfully save data.',
              content: 'Query Graphic has been saved by our system',
              size: 'small',
              variant: 'success',
              pathname: '/core/query-graphic',
              open: true
            })
            router.push('/core/query-graphic')
          } catch (error) {
            setQueryGraphicAlert({
              title: 'Network Errors',
              content: 'Unable to connect to the network or server.',
              size: 'small',
              variant: 'danger',
              pathname: `/core/query-graphic/${currId}/edit`,
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
