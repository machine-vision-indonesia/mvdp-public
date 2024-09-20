import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FormControlLabel, FormGroup, FormHelperText, Stack, useTheme } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { Field } from '@/components/molecules/field'
import { Input } from '@/components/atoms/input'
import { Button, Textarea } from '@/components/atoms'
import { schemaAddUnit } from '../validations'
import { SchemaAddUnit, Unit } from '../types/PageUnitOfMeasurement.types'
import { useAtom } from 'jotai'
import { unitOfMeasurementAlertAtom } from '../atoms'
import { GetUnitByCode, useGetUnit } from '../services/fetchUnitOfMeasurement.services'
import { queryClient } from '@/pages/_app'
import { Checkbox } from '@/components/atoms/checkbox'
import { MvTypography } from '@/components/atoms/mv-typography'
import { useEditUnitOfMeasurement } from '../services/actionEditUnitOfMeasurement.services'
import { useAddUnitOfMeasurement } from '../services/actionAddUnitOfMeasurement.services'

export const FormUnit = ({
  setCurrentAction,
  id,
  pages = 'add'
}: {
  setCurrentAction: Dispatch<SetStateAction<any>>
  id?: string
  pages?: 'add' | 'edit'
}) => {
  const { reset, getValues, setValue, handleSubmit, ...form } = useForm<SchemaAddUnit>({
    resolver: yupResolver(schemaAddUnit),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })
  const theme = useTheme()
  const [isActive, setIsActive] = useState(false)

  const [_, setUnitOfMeasurementAlert] = useAtom(unitOfMeasurementAlertAtom)

  // Services
  const unit = useGetUnit({ id: id as string })
  const createUnit = useAddUnitOfMeasurement()
  const editUnit = useEditUnitOfMeasurement()

  const onSubmit = async (data: SchemaAddUnit) => {
    if (pages === 'add') {
      try {
        const responseUnit = await GetUnitByCode({ code: data.code })

        if (responseUnit.data.data.length) {
          form.setError('code', {
            type: 'manual',
            message: 'Code already exists'
          })
          return
        }

        const responseCreateUnit = await createUnit.mutateAsync(data)

        if (responseCreateUnit.status == 200) {
          setCurrentAction(false)
          setUnitOfMeasurementAlert({
            title: 'Successfully save data.',
            content: 'Unit has been saved by our system',
            size: 'small',
            variant: 'success',
            pathname: '/core/unit-of-measurement',
            open: true
          })
          await queryClient.invalidateQueries()
        }
      } catch {
        setUnitOfMeasurementAlert({
          title: 'Failed save data',
          content: createUnit.error?.message ?? 'Unable to connect to the network or server.',
          size: 'small',
          variant: 'danger',
          pathname: '/core/unit-of-measurement',
          open: true
        })
      }
    } else {
      try {
        await editUnit.mutateAsync({ id: id as string, ...data })
        await queryClient.invalidateQueries()

        setUnitOfMeasurementAlert({
          title: 'Successfully edit data.',
          content: 'Unit has been saved by our system',
          size: 'small',
          variant: 'success',
          pathname: '/core/unit-of-measurement',
          open: true
        })

        setTimeout(() => {
          window.scrollTo(0, 0)
        }, 100)

        setCurrentAction(false)
      } catch {
        setUnitOfMeasurementAlert({
          title: 'Failed edit data',
          content: editUnit.error?.message ?? 'Unable to connect to the network or server.',
          size: 'small',
          variant: 'danger',
          pathname: '/core/unit-of-measurement',
          open: true
        })
      }
      setCurrentAction(null)
    }
  }

  useEffect(() => {
    if (pages === 'edit') {
      reset({
        code: unit.data?.data.code,
        name: unit.data?.data.name,
        description: unit.data?.data.description,
        is_active: unit.data?.data.is_active
      })
      setIsActive(unit.data?.data.is_active ?? false)
    }
  }, [pages, unit.data?.data.code, unit.data?.data.name, unit.data?.data.description, unit.data?.data.is_active])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ gridColumn: 'span 3', marginTop: 5 }}>
        <Field name='code' size='large' isRequired>
          <Field.Label>Code</Field.Label>
          <Field.InputController controller={form.control} errors={form.formState.errors}>
            <Input placeholder='' type='text' fullWidth variant='outlined' value={form.watch('code')} />
          </Field.InputController>
        </Field>
      </div>
      <div style={{ gridColumn: 'span 3', marginTop: 5 }}>
        <Field name='name' size='large' isRequired>
          <Field.Label>Name</Field.Label>
          <Field.InputController controller={form.control} errors={form.formState.errors}>
            <Input
              placeholder='Material unit’s name'
              type='text'
              fullWidth
              variant='outlined'
              value={form.watch('name')}
            />
          </Field.InputController>
        </Field>
      </div>
      <div style={{ gridColumn: 'span 3', marginTop: 10, display: 'flex', flexDirection: 'column' }}>
        <label
          htmlFor='description'
          style={{
            display: 'inline-block',
            color: theme.palette.text.secondary,
            fontSize: '14px',
            letterSpacing: '.25px',
            fontWeight: 'bold'
          }}
        >
          Description
        </label>
        <Controller
          control={form.control}
          name='description'
          render={({ field: { ref, ...rest }, fieldState }) => (
            <Textarea
              rows={4}
              placeholder=''
              id='description'
              isError={form.formState.errors?.description?.message ? true : false}
              style={{
                marginTop: '4px',
                ...(fieldState.invalid
                  ? {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'error.main'
                        },
                        '&:hover fieldset': {
                          borderColor: 'error.main'
                        }
                      }
                    }
                  : {})
              }}
              {...rest}
              value={form.watch('description')}
            />
          )}
        />
        {form.formState.errors.description ? (
          <FormHelperText sx={{ color: 'error.main' }}>{form.formState.errors.description.message}</FormHelperText>
        ) : null}
      </div>
      {pages === 'edit' && unit.isSuccess && (
        <div style={{ gridColumn: 'span 3', marginTop: 10 }}>
          <Controller
            name='is_active'
            control={form.control}
            render={({ field: { name, value, onChange, ...rest }, fieldState }) => {
              return (
                <Field {...rest} error={fieldState.invalid}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size='large'
                          onChange={e => {
                            setIsActive(e.target.checked)
                            onChange(e.target.checked)
                          }}
                          label='Set as Active'
                          {...rest}
                          checked={isActive}
                        />
                      }
                      sx={{ pl: 3 }}
                      label={''}
                    />
                  </FormGroup>
                </Field>
              )
            }}
          />
          <MvTypography size='BODY_MD_NORMAL' typeSize='PX' color={theme.colorToken.text.danger.normal} sx={{ pl: 6 }}>
            If deactivated, this data record will be hiden and will no longer be accessible in dropdown menus or other
            paths of the application. Use with caution
          </MvTypography>
        </div>
      )}
      <Stack direction='row' gap={3} mt={5} justifyContent='end'>
        <Button
          content='textOnly'
          text='Cancel'
          variant='outlined'
          onClick={() => {
            setCurrentAction(null)
          }}
        />
        <Button content='textOnly' text='Save' type='submit' loading={editUnit.isPending || createUnit.isPending} />
      </Stack>
    </form>
  )
}
