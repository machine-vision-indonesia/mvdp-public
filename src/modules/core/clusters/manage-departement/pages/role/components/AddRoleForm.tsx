import { GetRolesResponse } from '../types'
import { Field } from '@/components/molecules/field'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Select } from '@/components/atoms'
import { Input } from 'src/components/atoms/input'
import { Textarea } from 'src/components/atoms/textarea'
import { Checkbox } from '@/components/atoms/checkbox'
import { useGetParents } from '../service/list/useGetParents'
import { useTheme } from '@mui/material'

export interface AddRoleFormProps {
  form: any
  mode?: 'add' | 'edit'
  fields?: GetRolesResponse['data'][number]
}

const AddRoleForm = ({ form, mode, fields }: AddRoleFormProps) => {
  const parents = useGetParents()
  const theme = useTheme()

  const roleOptions =
    parents.data?.map(role => ({
      id: role.id,
      label: role.name
    })) ?? []

  const defaultValues = { id: fields?.parent?.id, label: fields?.parent?.name }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '15px', marginTop: '12px' }}>
      <div style={{ gridColumn: 'span 6' }}>
        <Field name='code' size='large' isRequired>
          <Field.Label>Code</Field.Label>
          <Field.InputController controller={form.control} errors={form.formState.errors}>
            <Field.Input>
              <Input type='text' fullWidth variant='outlined' defaultValue={mode === 'edit' ? fields?.code : ''} />
            </Field.Input>
          </Field.InputController>
        </Field>
      </div>
      <div style={{ gridColumn: 'span 6' }}>
        <Field name='name' size='large' isRequired>
          <Field.Label>Name</Field.Label>
          <Field.InputController controller={form.control} errors={form.formState.errors}>
            <Field.Input>
              <Input type='text' fullWidth variant='outlined' defaultValue={mode === 'edit' ? fields?.name : ''} />
            </Field.Input>
          </Field.InputController>
        </Field>
      </div>
      <div>
        <Field label='Role Parent' name='parent'>
          <Field.SelectController controller={form.control} errors={form.formState.errors}>
            <Select
              selected={mode === 'edit' ? defaultValues : []}
              data={roleOptions}
              labelKey='label'
              valueKey='id'
              size='medium'
              placeholder='Select role parent'
              variant='default'
            />
          </Field.SelectController>
        </Field>
      </div>
      <div style={{ gridColumn: 'span 6' }}>
        <Field name='description' size='large'>
          <Field.Label>Description</Field.Label>
          <Field.InputController controller={form.control} errors={form.formState.errors}>
            <Field.Input>
              <Textarea rows={4} placeholder='Description' defaultValue={mode === 'edit' ? fields?.description : ''} />
            </Field.Input>
          </Field.InputController>
        </Field>
      </div>

      {mode === 'edit' && (
        <div style={{ gridColumn: 'span 6' }}>
          <Field name='is_active' label='Set as Active'>
            <Field.CheckboxController controller={form.control} errors={form.formState.errors}>
              <Field.Input>
                <Checkbox size='large' checked={fields?.is_active} />
              </Field.Input>
            </Field.CheckboxController>
            <MvTypography size='BODY_MD_BOLDEST' typeSize='PX' color={theme.colorToken.text.danger.normal}>
              If deactivated, this data record will be hiden and will no longer be accessible in dropdown menus or other
              paths of the application. Use with caution
            </MvTypography>
          </Field>
        </div>
      )}
    </div>
  )
}

export default AddRoleForm
