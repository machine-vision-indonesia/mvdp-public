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
import { Box } from '@mui/material'
import { Alert } from '@/components/molecules/alert'
import { useRouter } from 'next/router'
import { ModalDialog } from '@/components/molecules/modal-dialog'
import { queryClient } from '@/pages/_app'
import { useAddQueryGraphic } from '../services/actionAddQueryGraphic.services'
import { GetQueryGraphicByCode } from '../services/fetchQueryGraphic.services'

export function ManageQueryGraphicAddPage() {
  const router = useRouter()
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [queryGraphicAlert, setQueryGraphicAlert] = useAtom(queryGraphicAlertAtom)

  const createQueryGraphic = useAddQueryGraphic()

  const form = useForm<SchemaAddQueryGraphic>({
    resolver: yupResolver(schemaAddQueryGraphic),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  async function onSubmit(data: SchemaAddQueryGraphic) {
    try {
      setIsLoading(true)

      const responseQG = await GetQueryGraphicByCode({ code: data.code })

      if (responseQG.data.data.length) {
        form.setError('code', {
          type: 'manual',
          message: 'Job Function Code already exists'
        })

        window.scrollTo(0, 0)
        return
      }

      setIsConfirmModalOpen(true)
    } catch {
      setQueryGraphicAlert({
        title: 'Failed',
        content: createQueryGraphic.error?.message ?? 'Unable to connect to the network or server.',
        size: 'small',
        variant: 'danger',
        pathname: '/core/query-graphic/add',
        open: true
      })
    } finally {
      setIsLoading(false)
    }
  }

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
        Create Query Graphics
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
            path: '/core/query-graphic/add'
          }
        ]}
      />

      <AddQueryGraphicForm form={form} pages='add' onSubmit={onSubmit} isLoading={isLoading} />

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
        loading={createQueryGraphic.isPending}
        positiveLabel='Yes'
        title={`Are you sure to create Query Graphic?`}
        description="You won't be able to revert this!"
        onOk={async () => {
          try {
            await createQueryGraphic.mutateAsync(form.getValues())
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
              content: createQueryGraphic.error?.message ?? 'Unable to connect to the network or server.',
              size: 'small',
              variant: 'danger',
              pathname: '/core/query-graphic/add',
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
