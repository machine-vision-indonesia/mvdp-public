import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { FormHelperText, Grid, Stack } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { Field } from '@/components/molecules/field'
import { Input } from '@/components/atoms/input'
import { Button, Textarea } from '@/components/atoms'
import { schemaAddOtProtocol } from '../validations'
import { SchemaAddOtProtocol } from '../types/PageOtProtocol'
import { fetchDetailOtProtocol } from '../services/fetchDetailOtProtocol.services'
import { useTheme } from '@mui/material'
import { actionAddOtProtocol } from '../services/actionAddOtProtocol.services'
import { queryClient } from '@/pages/_app'
import { actionEditOtProtocol } from '../services/actionEditOtProtocol.services'
import { useAtom } from 'jotai'
import { otProtocolAlertAtom } from '../atoms'

export const FormOtProtocol = ({
  setCurrentAction,
  pages = 'add',
  id
}: {
  id?: string
  pages: 'add' | 'edit'
  setCurrentAction: Dispatch<SetStateAction<any>>
}) => {
  const theme = useTheme()
  const { reset, getValues, setValue, handleSubmit, ...form } = useForm<SchemaAddOtProtocol>({
    resolver: yupResolver(schemaAddOtProtocol),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  const [_, setOtProtocolAlert] = useAtom(otProtocolAlertAtom)

  // service
  const addOtProtocol = actionAddOtProtocol()
  const editOtProtocol = actionEditOtProtocol()

  const onSubmit = async (val: SchemaAddOtProtocol) => {
    if (pages === 'add') {
      try {
        const response = await addOtProtocol.mutateAsync(val)
        if (response.status === 200) {
          setCurrentAction(false)
          setCurrentAction(null)
          setOtProtocolAlert({
            title: 'Successfully add data',
            content: 'Ot Protocol has been saved by our system',
            size: 'small',
            variant: 'success',
            pathname: '/core/ot-protocol',
            open: true
          })
          await queryClient.invalidateQueries()
        } else {
          setOtProtocolAlert({
            title: 'Something went wrong',
            content: response.data.message,
            size: 'small',
            variant: 'danger',
            pathname: '/core/ot-protocol',
            open: true
          })
        }
      } catch (error: any) {
        setOtProtocolAlert({
          title: 'Something went wrong',
          content: error?.response?.data?.errors[0]?.message,
          size: 'small',
          variant: 'danger',
          pathname: '/core/ot-protocol',
          open: true
        })
      }
    } else {
      val.id = id
      const response = await editOtProtocol.mutateAsync(val)
      try {
        if (response.status === 200) {
          setCurrentAction(null)
          setOtProtocolAlert({
            title: 'Successfully edit data',
            content: 'Ot Protocol has been saved by our system',
            size: 'small',
            variant: 'success',
            pathname: '/core/ot-protocol',
            open: true
          })
          await queryClient.invalidateQueries()
        } else {
          setOtProtocolAlert({
            title: 'Something went wrong',
            content: response.data.message,
            size: 'small',
            variant: 'danger',
            pathname: '/core/ot-protocol',
            open: true
          })
        }
      } catch (error: any) {
        setOtProtocolAlert({
          title: 'Something went wrong',
          content: error?.response?.data?.errors[0]?.message,
          size: 'small',
          variant: 'danger',
          pathname: '/core/ot-protocol',
          open: true
        })
      }
    }
  }
  const otProtocol = fetchDetailOtProtocol({ id: id as string })

  useEffect(() => {
    if (pages === 'edit') {
      reset({
        code: otProtocol?.data?.data.code ?? '',
        json_property: otProtocol?.data?.data.json_property
      })
    }
  }, [reset, pages, otProtocol?.data?.data.code, otProtocol?.data?.data?.json_property])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container sx={{ flexDirection: 'column', gap: 4, mt: 5 }}>
        <Grid item>
          <div style={{ gridColumn: 'span 3', marginTop: 5 }}>
            <Field name='code' size='large'>
              <Field.Label>Code</Field.Label>
              <Field.InputController controller={form.control} errors={form.formState.errors}>
                <Input
                  placeholder=''
                  type='text'
                  value={form.watch('code')}
                  disabled={pages === 'edit'}
                  fullWidth
                  variant='outlined'
                />
              </Field.InputController>
            </Field>
          </div>
        </Grid>
        <Grid item>
          <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor='parameters'
              style={{
                display: 'inline-block',
                color: theme.palette.text.secondary,
                fontSize: '14px',
                letterSpacing: '.25px',
                fontWeight: 'bold'
              }}
            >
              JSON Property <span style={{ color: theme.palette.error.main }}>*</span>
            </label>
            <Controller
              control={form.control}
              name='json_property'
              render={({ field: { ref, ...rest }, fieldState }) => (
                <Textarea
                  rows={4}
                  placeholder='Please input JSON format'
                  id='code'
                  isError={form.formState.errors?.json_property?.message ? true : false}
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
                />
              )}
            />
            {form.formState.errors.json_property ? (
              <FormHelperText sx={{ color: 'error.main' }}>
                {form.formState.errors.json_property.message}
              </FormHelperText>
            ) : null}
          </div>
        </Grid>
      </Grid>
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
