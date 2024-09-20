import { Field } from '@/components/molecules/field'
import { Input } from '@/components/atoms/input'
import { Button, Select, Textarea } from '@/components/atoms'
import CardContent from '@mui/material/CardContent'
import { AddDepartmentFormProps, SchemaAddDepartment } from '../types/ManageDepartmentPage.types'
import { useTheme } from '@mui/material/styles'
import NextLink from 'next/link'
import { useState } from 'react'
import { useListDepartment, useListDepartmentLevel } from '../services/fetchDetailDepartment.service'
import { Checkbox } from '@/components/atoms/checkbox'
import { MvTypography } from '@/components/atoms/mv-typography'
import { useGetWorkCenters } from '../../job-level/services/fetchJobLevel.service'
import { ModalDialog } from '@/components/molecules/modal-dialog'
import client from '@/client'
import { useAddDepartment } from '../services/actionAddDepartment.service'
import { useAtom } from 'jotai'
import { departmentAlertAtom } from '../atoms'
import { queryClient } from '@/pages/_app'
import { useRouter } from 'next/router'

export default function AddDepartmentForm({ form, pages, fields }: AddDepartmentFormProps) {
  const theme = useTheme()
  const router = useRouter()
  const [_, setDepartmentAlert] = useAtom(departmentAlertAtom)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  // Services
  const workCenters = useGetWorkCenters()
  const departmentsQuery = useListDepartment()
  const levelsQuery = useListDepartmentLevel()

  const levelOptions =
    levelsQuery.data?.data.map(level => ({
      id: level.id,
      label: level.name
    })) ?? []

  const departmentOptions =
    departmentsQuery.data?.data.map(department => ({
      id: department.id,
      label: department.name
    })) ?? []

  const createDepartment = useAddDepartment()

  async function onSubmit(data: SchemaAddDepartment) {
    type Department = {
      id: string
    }

    type GetDepartmentsResponse = {
      data: Department[]
    }

    const response = await client.api.get<GetDepartmentsResponse>('/items/mt_departments', {
      params: {
        filter: {
          code: {
            _eq: data.code
          }
        },
        fields: ['id'].toString()
      }
    })

    if (response.data.data.length) {
      form.setError('code', {
        type: 'manual',
        message: 'Department Code already exists'
      })

      return
    }

    setIsConfirmModalOpen(true)
  }

  return (
    <>
      <CardContent sx={{ width: '100%', padding: 0 }}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              rowGap: '12px',
              columnGap: '20px',
              marginTop: '24px'
            }}
          >
            <div style={{ gridColumn: 'span 3' }}>
              <Field name='code' size='large' isRequired>
                <Field.Label>Code</Field.Label>
                <Field.InputController controller={form.control} errors={form.formState.errors}>
                  <Field.Input>
                    <Input
                      type='text'
                      fullWidth
                      variant='outlined'
                      placeholder='123456'
                      defaultValue={pages === 'edit' ? fields?.code : ''}
                    />
                  </Field.Input>
                </Field.InputController>
              </Field>
            </div>
            <div style={{ gridColumn: 'span 3' }}>
              <Field name='name' size='large' isRequired>
                <Field.Label>Department Name</Field.Label>
                <Field.InputController controller={form.control} errors={form.formState.errors}>
                  <Field.Input>
                    <Input
                      type='text'
                      fullWidth
                      variant='outlined'
                      placeholder="Department's name"
                      defaultValue={pages === 'edit' ? fields?.name : ''}
                    />
                  </Field.Input>
                </Field.InputController>
              </Field>
            </div>
            <div style={{ gridColumn: 'span 3' }}>
              <Field name='work_center' label='Work Center' isRequired>
                <Field.SelectController controller={form.control} errors={form.formState.errors}>
                  <Select
                    data={workCenters?.data ?? []}
                    labelKey='label'
                    valueKey='id'
                    size='medium'
                    placeholder='--Select Work Center--'
                  />
                </Field.SelectController>
              </Field>
            </div>
            <div style={{ gridColumn: 'span 3' }}>
              <Field name='parent' label='Department Parent' isRequired>
                <Field.SelectController controller={form.control} errors={form.formState.errors}>
                  <Select
                    data={departmentOptions}
                    labelKey='label'
                    valueKey='id'
                    size='medium'
                    placeholder="--Select Department's Parent--"
                  />
                </Field.SelectController>
              </Field>
            </div>
            <div style={{ gridColumn: 'span 3' }}>
              <Field name='level' label='Department Level' isRequired>
                <Field.SelectController controller={form.control} errors={form.formState.errors}>
                  <Select
                    data={levelOptions}
                    labelKey='label'
                    valueKey='id'
                    size='medium'
                    placeholder="--Select Department's Parent--"
                  />
                </Field.SelectController>
              </Field>
            </div>
            <div style={{ gridColumn: 'span 3' }}>
              <Field name='description' label='Description'>
                <Field.InputController controller={form.control} errors={form.formState.errors}>
                  <Field.Input>
                    <Textarea
                      rows={4}
                      placeholder='Description'
                      defaultValue={pages === 'edit' ? (fields?.description as string) : ''}
                    />
                  </Field.Input>
                </Field.InputController>
              </Field>
            </div>

            {pages === 'edit' && (
              <div style={{ gridColumn: 'span 6' }}>
                <Field name='is_active' label='Set as Active'>
                  <Field.CheckboxController controller={form.control} errors={form.formState.errors}>
                    <Field.Input>
                      <Checkbox size='large' checked={fields?.set_is_active} />
                    </Field.Input>
                  </Field.CheckboxController>
                  <MvTypography size='BODY_MD_BOLDEST' typeSize='PX' color={theme.colorToken.text.danger.normal}>
                    If deactivated, this data record will be hiden and will no longer be accessible in dropdown menus or
                    other paths of the application. Use with caution
                  </MvTypography>
                </Field>
              </div>
            )}

            <div
              style={{ marginTop: '30px', gridColumn: 'span 6', display: 'flex', justifyContent: 'flex-end', gap: 12 }}
            >
              <Button
                variant='outlined'
                content='textOnly'
                text='Cancel'
                color='primary'
                size='large'
                sx={{
                  height: '44px',
                  padding: '12.5px 20px !important',
                  borderRadius: '4px',
                  fontSize: '16px',
                  border: `1.5px solid ${theme.palette.primary.main}`
                }}
                type='button'
                LinkComponent={NextLink}
                href='/core/job-level'
              />
              <Button
                variant='contained'
                content='textOnly'
                text='Save'
                size='large'
                sx={{ height: '44px', padding: '12.5px 20px !important', borderRadius: '4px', fontSize: '16px' }}
                type='submit'
              />
            </div>
          </div>
        </form>
      </CardContent>

      <ModalDialog
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        typeVariant='confirmation'
        statusVariant='warning'
        loading={false}
        positiveLabel='Yes'
        title={`Are you sure to ${pages === 'add' ? 'create' : 'edit'} department?`}
        description="You won't be able to revert this!"
        onOk={async () => {
          try {
            await createDepartment.mutateAsync(form.getValues())
            await queryClient.invalidateQueries()

            setDepartmentAlert({
              title: 'Submit Successful',
              content: 'Your department was success to submitted',
              size: 'small',
              variant: 'success',
              pathname: '/core/department',
              open: true
            })
            router.push('/core/department')
          } catch {
            setDepartmentAlert({
              title: 'Submit Failed',
              content: 'Your department was failed to submitted',
              size: 'small',
              variant: 'danger',
              pathname: '/core/department',
              open: true
            })
          }
        }}
      />
    </>
  )
}
