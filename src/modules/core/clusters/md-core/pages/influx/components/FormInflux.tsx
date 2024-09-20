import React, { Dispatch, SetStateAction } from 'react'
import { Stack } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { Field } from '@/components/molecules/field'
import { Input } from '@/components/atoms/input'
import { Button, Select, Textarea } from '@/components/atoms'
import { schemaAddUnit } from '../validations'
import { SchemaAddUnit } from '../types/PageInflux'

const FormUnit = ({
  setCurrentAction,
  pages = 'add'
}: {
  pages: 'add' | 'edit'
  setCurrentAction: Dispatch<SetStateAction<any>>
}) => {
  const { reset, getValues, setValue, handleSubmit, ...form } = useForm<SchemaAddUnit>({
    resolver: yupResolver(schemaAddUnit),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  const onSubmit = (val: SchemaAddUnit) => {
    if (pages === 'add') {
      setCurrentAction(false)
    } else {
      setCurrentAction(null)
    }
  }

  const dataCollection = [
    {
      id: 1,
      label: "Test collection"
    }
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ gridColumn: 'span 3', marginTop: 5, }}>
        <Field name='code' size='large'>
          <Field.Label>Code</Field.Label>
          <Field.InputController controller={form.control} errors={form.formState.errors}>
            <Input placeholder='' type='number' disabled={true} fullWidth variant='outlined' />
          </Field.InputController>
        </Field>
      </div>
      <div style={{ gridColumn: 'span 3', marginTop: 5 }}>
        <Field name='collection' size='large' isRequired>
          <Field.Label>Collections</Field.Label>
          <Field.SelectController controller={form.control} errors={form.formState.errors}>
            <Select size='small' data={dataCollection} labelKey='label' valueKey='id' placeholder='Select collection' />
          </Field.SelectController>
        </Field>
      </div>
      <div style={{ gridColumn: 'span 3', marginTop: 10 }}>
        <Controller
          name='json'
          control={form.control}
          render={({ field: { name, onChange, ...rest }, fieldState }) => {
            return (
              <Field
                size='small'
                label='JSON Property'
                isRequired
                error={fieldState.invalid}
                helperText={form.formState.errors && form.formState.errors[name]?.message}
                {...rest}
              >
                <Textarea rows={4} onChange={onChange} />
              </Field>
            )
          }}
        />
      </div>
      <Stack direction='row' gap={3} mt={5} justifyContent='end'>
        <Button
          content='textOnly'
          text='Cancel'
          variant='outlined'
          onClick={() => {
            if (pages === 'add') {
              setCurrentAction(false)
            } else {
              setCurrentAction(null)
            }
          }}
        />
        <Button content='textOnly' text='Save' type='submit' />
      </Stack>
    </form>
  )
}

export default FormUnit
