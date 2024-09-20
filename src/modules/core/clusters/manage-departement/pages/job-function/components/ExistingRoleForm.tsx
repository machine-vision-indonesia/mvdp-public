import { Field } from '@/components/molecules/field'
import { Select } from '@/components/atoms'
import { useGetRoles } from '../services/fetchJobFunction.service'
import { AddJobFunctionFormProps } from '../types/ManageJobFunction.types'
import { useEffect } from 'react'

export default function ExistingRoleForm({ form, pages, fields }: AddJobFunctionFormProps) {
  const roles = useGetRoles()

  useEffect(() => {
    if (pages === 'edit') {
      for (const key in fields) {
        form.setValue(key, fields[key as keyof typeof fields])
      }
    }
  }, [pages])

  return (
    <div style={{ gridColumn: 'span 6' }}>
      <Field name='role' label='Select Role' isRequired>
        <Field.SelectController controller={form.control} errors={form.formState.errors}>
          <Select
            data={roles?.data ?? []}
            labelKey='label'
            valueKey='id'
            size='medium'
            selected={pages === 'edit' ? fields?.role : null}
            placeholder='--Select Role--'
          />
        </Field.SelectController>
      </Field>
    </div>
  )
}
