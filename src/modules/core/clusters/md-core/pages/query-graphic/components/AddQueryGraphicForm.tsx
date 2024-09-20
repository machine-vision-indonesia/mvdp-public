import { Button, Textarea } from '@/components/atoms'
import NextLink from 'next/link'
import { AddQueryGraphicFormProps } from '../types/ManageQueryGraphicAddPage.types'
import { useTheme } from '@mui/material/styles'
import { SectionGroup } from '@/components/molecules/section-group'
import { Field } from '@/components/molecules/field'
import { Input } from '@/components/atoms/input'
import { useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { FormHelperText } from '@mui/material'

export function AddQueryGraphicForm({ form, pages, fields, onSubmit, isLoading }: AddQueryGraphicFormProps) {
  const theme = useTheme()

  useEffect(() => {
    if (pages === 'edit') {
      for (const key in fields) {
        form.setValue(key, fields[key as keyof typeof fields])
      }
    }
  }, [pages])

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}
      >
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
              <Field name='product' size='large' isRequired>
                <Field.Label>Product</Field.Label>
                <Field.InputController controller={form.control} errors={form.formState.errors}>
                  <Field.Input>
                    <Input
                      type='text'
                      fullWidth
                      variant='outlined'
                      placeholder='Input product'
                      defaultValue={pages === 'edit' ? fields?.product : ''}
                    />
                  </Field.Input>
                </Field.InputController>
              </Field>
            </div>
            <div style={{ gridColumn: 'span 3' }}>
              <Field name='page' size='large' isRequired>
                <Field.Label>Page</Field.Label>
                <Field.InputController controller={form.control} errors={form.formState.errors}>
                  <Field.Input>
                    <Input
                      type='text'
                      fullWidth
                      variant='outlined'
                      placeholder='Input page here'
                      defaultValue={pages === 'edit' ? fields?.page : ''}
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
                      placeholder='Input name'
                      defaultValue={pages === 'edit' ? fields?.name : ''}
                    />
                  </Field.Input>
                </Field.InputController>
              </Field>
            </div>
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column' }}>
              <label
                htmlFor='query'
                style={{
                  display: 'inline-block',
                  color: theme.palette.text.secondary,
                  fontSize: '14px',
                  letterSpacing: '.25px',
                  fontWeight: 'bold'
                }}
              >
                Query <span style={{ color: theme.palette.error.main }}>*</span>
              </label>
              <Controller
                control={form.control}
                name='query'
                render={({ field: { ref, ...rest }, fieldState }) => (
                  <Textarea
                    rows={4}
                    placeholder='{}'
                    id='query'
                    defaultValue={pages === 'edit' ? fields?.query : ''}
                    isError={form.formState.errors?.query?.message ? true : false}
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
              {form.formState.errors.query ? (
                <FormHelperText sx={{ color: 'error.main' }}>{form.formState.errors.query.message}</FormHelperText>
              ) : null}
            </div>
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
                Parameters <span style={{ color: theme.palette.error.main }}>*</span>
              </label>
              <Controller
                control={form.control}
                name='parameters'
                render={({ field: { ref, ...rest }, fieldState }) => (
                  <Textarea
                    rows={4}
                    placeholder='[{}]'
                    id='parameters'
                    defaultValue={pages === 'edit' ? fields?.parameters : ''}
                    isError={form.formState.errors?.parameters?.message ? true : false}
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
              {form.formState.errors.parameters ? (
                <FormHelperText sx={{ color: 'error.main' }}>{form.formState.errors.parameters.message}</FormHelperText>
              ) : null}
            </div>
          </div>
        </SectionGroup>

        <div style={{ gridColumn: 'span 6', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button
            variant='outlined'
            content='textOnly'
            text='Cancel'
            color='primary'
            size='large'
            sx={{
              height: '44px',
              padding: '12.5px 20px !important',
              borderRadius: '4px',
              fontSize: '16px',
              border: `1.5px solid ${theme.palette.primary.main}`
            }}
            type='button'
            LinkComponent={NextLink}
            href='/core/query-graphic'
          />
          <Button
            variant='contained'
            content='textOnly'
            text='Save'
            size='large'
            sx={{ height: '44px', padding: '12.5px 20px !important', borderRadius: '4px', fontSize: '16px' }}
            type='submit'
            loading={isLoading}
          />
        </div>
      </form>
    </>
  )
}
