import { Field } from '@/components/molecules/field'
import { Input } from '@/components/atoms/input'
import { Button, Select, Textarea } from '@/components/atoms'
import CardContent from '@mui/material/CardContent'
import { AddJobLevelProps } from '../types/ManageJobLevelPage.types'
import { useTheme } from '@mui/material/styles'
import NextLink from 'next/link'
import { useState } from 'react'
import { Modal } from '@/components/atoms/modal/Modal'
import { useGetJobFunctions, useGetWorkCenters } from '../services/fetchJobLevel.service'
import { useListDepartment } from '../services/fetchDetailUser.service'
import { Checkbox } from '@/components/atoms/checkbox'
import { MvTypography } from '@/components/atoms/mv-typography'

export default function AddJobLevelForm({ form, pages, fields }: AddJobLevelProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const theme = useTheme()

  // Services
  const workCenters = useGetWorkCenters()
  const jobFunctions = useGetJobFunctions()
  const departmentsQuery = useListDepartment()

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

  return (
    <>
      <CardContent sx={{ width: '100%', padding: 0 }}>
        <form onSubmit={form.handleSubmit(() => setIsConfirmModalOpen(true))}>
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
                      disabled
                      defaultValue={pages === 'edit' ? fields?.code : '123456'}
                    />
                  </Field.Input>
                </Field.InputController>
              </Field>
            </div>
            <div style={{ gridColumn: 'span 3' }}>
              <Field name='job_level_name' size='large' isRequired>
                <Field.Label>Job Level Name</Field.Label>
                <Field.InputController controller={form.control} errors={form.formState.errors}>
                  <Field.Input>
                    <Input
                      type='text'
                      fullWidth
                      variant='outlined'
                      placeholder="Job level's name"
                      defaultValue={pages === 'edit' ? fields?.job_level_name : ''}
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
              <Field name='department' label='Department' isRequired>
                <Field.SelectController controller={form.control} errors={form.formState.errors}>
                  <Select
                    data={departmentOptions}
                    labelKey='label'
                    valueKey='id'
                    size='medium'
                    placeholder='--Select Department--'
                    variant='multiple'
                  />
                </Field.SelectController>
              </Field>
            </div>
            <div style={{ gridColumn: 'span 3' }}>
              <Field name='job_function' label='Job Function' isRequired>
                <Field.SelectController controller={form.control} errors={form.formState.errors}>
                  <Select
                    data={jobFunctionOptions}
                    labelKey='label'
                    valueKey='id'
                    size='medium'
                    placeholder='--Select Job Function--'
                    variant='multiple'
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

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        variant='warning'
        loading={false}
        positiveLabel='Yes'
        title='Are you sure you want to Edit data job level?'
        description="You won't be able to revert this!"
        onOk={() => {
          setIsConfirmModalOpen(false)
          form.reset()
        }}
      />
    </>
  )
}
