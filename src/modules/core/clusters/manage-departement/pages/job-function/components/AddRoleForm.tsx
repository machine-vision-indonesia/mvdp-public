import { Field } from '@/components/molecules/field'
import { useState } from 'react'
import { SectionGroup } from '@/components/molecules/section-group'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { Controller } from 'react-hook-form'
import CreateNewRoleForm from './CreateNewRoleForm'
import ExistingRoleForm from './ExistingRoleForm'
import { AddJobFunctionFormProps } from '../types/ManageJobFunction.types'
import { CHOOSE_ROLE_RADIOS } from '../constants/ManageJobFunctionPage.constants'

export default function AddRoleForm({ form, pages, fields }: AddJobFunctionFormProps) {
  const [isUsingExistingRole, setIsUsingExistingRole] = useState(true)

  return (
    <>
      <SectionGroup title='Role Information' color='default'>
        <Controller
          name='existingRoleOrCreateNew'
          control={form.control}
          render={({ field: { name, ...rest }, fieldState }) => (
            <Field
              size='small'
              label='Choose Role'
              isRequired
              error={form.formState.errors[name]?.message}
              helperText={form.errors && form.errors[name]?.message}
              {...rest}
            >
              <RadioGroup defaultValue={'existing'} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                {CHOOSE_ROLE_RADIOS.map(radio => (
                  <FormControlLabel
                    key={radio.name}
                    control={<Radio value={radio.name} name={radio.name} />}
                    onChange={() => setIsUsingExistingRole(radio.name === 'existing')}
                    label={radio.label}
                  />
                ))}
              </RadioGroup>
            </Field>
          )}
        />
        {isUsingExistingRole ? (
          <ExistingRoleForm form={form} pages={pages} fields={fields} />
        ) : (
          <CreateNewRoleForm form={form} pages={pages} fields={fields} />
        )}
      </SectionGroup>
    </>
  )
}
