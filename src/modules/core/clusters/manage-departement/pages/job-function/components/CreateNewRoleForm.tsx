import { Select, Textarea } from '@/components/atoms'
import { Input } from '@/components/atoms/input'
import { Field } from '@/components/molecules/field'
import { useGetWorkCenters } from '../services/fetchJobFunction.service'
import { AddJobFunctionFormProps } from '../types/ManageJobFunction.types'

export default function CreateNewRoleForm({ form, pages, fields }: AddJobFunctionFormProps) {
  const workCenters = useGetWorkCenters()

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        rowGap: '12px',
        columnGap: '20px'
      }}
    >
      <div style={{ gridColumn: 'span 3' }}>
        <Field name='role_code' size='large' isRequired>
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
        <Field name='role_name' size='large' isRequired>
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
        <Field name='role_work_center' label='Work Center' isRequired>
          <Field.SelectController controller={form.control} errors={form.formState.errors}>
            <Select
              data={workCenters.data ?? []}
              labelKey='label'
              valueKey='id'
              size='medium'
              placeholder='--Select Work Center--'
            />
          </Field.SelectController>
        </Field>
      </div>
      <div style={{ gridColumn: 'span 3' }}>
        <Field name='role_description' label='Description'>
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
  )
}
