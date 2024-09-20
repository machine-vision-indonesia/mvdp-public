import React from 'react'
import { Select } from '@/components/atoms'
import { Field } from '@/components/molecules/field'
import { AddUserStepTwoProps } from '../types/ManageUserPage.types'

export const UserStepTwo: React.FC<AddUserStepTwoProps> = ({
  form,
  roleOptions,
  departmentOptions,
  jobFunctionOptions,
  workCenters,
  pages = 'add'
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        rowGap: '12px',
        columnGap: '20px',
        marginTop: '20px'
      }}
    >
      <div style={{ gridColumn: 'span 3' }}>
        <Field size='medium' name='roles' label='Roles' isRequired>
          <Field.SelectController controller={form.control} errors={form.formState.errors}>
            <Select
              data={roleOptions}
              labelKey='label'
              valueKey='id'
              placeholder='Select Role'
              // selected={rest.value}
              variant='multiple'
              // onChange={(value) => onChange(value)}
            />
          </Field.SelectController>
        </Field>
      </div>

      <div style={{ gridColumn: 'span 3' }}>
        <Field size='medium' name='work_center' label='Work Center'>
          <Field.SelectController controller={form.control} errors={form.formState.errors}>
            <Select
              data={workCenters.data ?? []}
              labelKey='label'
              valueKey='id'
              placeholder='Select Work Center'
              // selected={value}
              variant='default'
            />
          </Field.SelectController>
        </Field>
      </div>

      <div style={{ gridColumn: 'span 3' }}>
        <Field size='medium' name='department' label='Department'>
          <Field.SelectController controller={form.control} errors={form.formState.errors}>
            <Select
              data={departmentOptions}
              labelKey='label'
              valueKey='id'
              placeholder='Select Department'
              variant='default'
            />
          </Field.SelectController>
        </Field>
      </div>

      <div style={{ gridColumn: 'span 3' }}>
        <Field size='medium' name='job_function' label='Job Function' isRequired>
          <Field.SelectController controller={form.control} errors={form.formState.errors}>
            <Select
              data={jobFunctionOptions}
              labelKey='label'
              valueKey='id'
              placeholder='Select Job Function'
              variant='default'
            />
          </Field.SelectController>
        </Field>
      </div>

      <div style={{ gridColumn: 'span 3' }}>
        <Field size='medium' name='job_level' label='Job Level'>
          <Field.SelectController controller={form.control} errors={form.formState.errors}>
            <Select
              data={jobFunctionOptions}
              labelKey='label'
              valueKey='id'
              placeholder='Select Job Level'
              variant='default'
            />
          </Field.SelectController>
        </Field>
      </div>

      <div style={{ gridColumn: 'span 3' }}>
        <Field size='medium' name='job_title' label='Job Title'>
          <Field.SelectController controller={form.control} errors={form.formState.errors}>
            <Select
              data={jobFunctionOptions}
              labelKey='label'
              valueKey='id'
              placeholder='Select Job Title'
              variant='default'
            />
          </Field.SelectController>
        </Field>
      </div>
    </div>
  )
}
