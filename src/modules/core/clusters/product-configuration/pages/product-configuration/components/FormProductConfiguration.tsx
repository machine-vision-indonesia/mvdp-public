import React, { Dispatch, SetStateAction } from 'react'
import { Box, Stack } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Field } from '@/components/molecules/field'
import { Input } from '@/components/atoms/input'
import { Button, Textarea } from '@/components/atoms'
import { schemaAddUnit } from '../validations'
import { SchemaAddUnit } from '../types/PageProductConfiguration'

const FormAddProductConfiguration = ({
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box mt={5}>
        <Field name='code' size='large' isRequired>
          <Field.Label>Key</Field.Label>
          <Field.SelectController controller={form.control} errors={form.formState.errors}>
            <Input placeholder='Create specific key' type='number' variant='outlined' />
          </Field.SelectController>
        </Field>
      </Box>
      <Box mt={5}>
        <Field name='name' size='large' isRequired>
          <Field.Label>Name</Field.Label>
          <Field.InputController controller={form.control} errors={form.formState.errors}>
            <Input placeholder='Create specific key' type='text' fullWidth variant='outlined' />
          </Field.InputController>
        </Field>
      </Box>
      <Stack direction='row' mt={10} gap={3} justifyContent='end'>
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

export default FormAddProductConfiguration
