import { Field } from '@/components/molecules/field'
import { Input } from '@/components/atoms/input'
import { Select, Textarea } from '@/components/atoms'
import { SectionGroup } from '@/components/molecules/section-group'
import { useGetWorkCenters, useListDepartment, useGetJobLevels } from '../services/fetchJobFunction.service'
import { AddJobFunctionFormProps } from '../types/ManageJobFunction.types'
import { useEffect } from 'react'

export default function AddJobFunctionForm({ form, pages, fields }: AddJobFunctionFormProps) {
  // Services
  const workCenters = useGetWorkCenters()
  const departmentsQuery = useListDepartment()
  const jobLevels = useGetJobLevels()

  const departmentOptions =
    departmentsQuery.data?.data.map(department => ({
      id: department.id,
      label: department.name
    })) ?? []

  useEffect(() => {
    if (pages === 'edit') {
      for (const key in fields) {
        form.setValue(key, fields[key as keyof typeof fields])
      }
    }
  }, [pages])

  return (
    <>
      <SectionGroup title='General Information' color='default'>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            rowGap: '12px',
            columnGap: '20px'
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
              <Field.Label>Name</Field.Label>
              <Field.InputController controller={form.control} errors={form.formState.errors}>
                <Field.Input>
                  <Input
                    type='text'
                    fullWidth
                    variant='outlined'
                    placeholder="Job Function's name"
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
            <Field name='department' label='Department' isRequired>
              <Field.SelectController controller={form.control} errors={form.formState.errors}>
                <Select
                  data={departmentOptions}
                  labelKey='label'
                  valueKey='id'
                  size='medium'
                  placeholder='--Select Department--'
                  selected={pages === 'edit' ? fields?.department : null}
                />
              </Field.SelectController>
            </Field>
          </div>
          <div style={{ gridColumn: 'span 3' }}>
            <Field name='job_level' label='Job Level' isRequired>
              <Field.SelectController controller={form.control} errors={form.formState.errors}>
                <Select
                  data={jobLevels?.data ?? []}
                  labelKey='label'
                  valueKey='id'
                  size='medium'
                  placeholder='--Select Job Level--'
                  selected={pages === 'edit' ? fields?.job_level : null}
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
        </div>
      </SectionGroup>
    </>
  )
}
