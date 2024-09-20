import { yupResolver } from '@hookform/resolvers/yup'
import Autocomplete from '@mui/material/Autocomplete'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormHelperText from '@mui/material/FormHelperText'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import Dropzone, { type FileWithPath } from 'react-dropzone'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { Button } from 'src/components/atoms/button'
import { Input } from 'src/components/atoms/input'
import { Textarea } from 'src/components/atoms/textarea'
import * as yup from 'yup'

const schema = yup.object().shape({
  plant: yup
    .object({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .required()
    .default(null),
  sector: yup
    .object({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .required()
    .default(null),
  code: yup.string().required().min(1).default(''),
  name: yup.string().required().min(1).default(''),
  description: yup.string(),
  picture: yup.mixed().nullable().default(null)
})

type Schema = yup.InferType<typeof schema>

type Plant = {
  id: string
  name: string
}

const plants: Plant[] = [
  {
    id: '1',
    name: 'Plant 1'
  },
  {
    id: '2',
    name: 'Plant 2'
  }
]

const plantOptions = plants.map(plant => ({
  id: plant.id,
  label: plant.name
}))

type Sector = {
  id: string
  name: string
}

const sectors: Sector[] = [
  {
    id: '1',
    name: 'Sector 1'
  },
  {
    id: '2',
    name: 'Sector 2'
  }
]

const sectorOptions = sectors.map(sector => ({
  id: sector.id,
  label: sector.name
}))

export default function ManageLinesEditPage() {
  const theme = useTheme()
  const form = useForm<Schema>({
    resolver: yupResolver(schema)
  })
  const router = useRouter()

  function onSubmit(data: Schema) {
    console.log('submitted data', data)
    router.push('/lines')
  }

  return (
    <main>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flexGrow: 1 }}>
          <Typography variant='h2'>Edit Line</Typography>
          <Breadcrumbs
            aria-label='breadcrumb'
            sx={{ mt: '8px' }}
            separator={<Icon icon='mdi:chevron-right' color='#909094' />}
          >
            <Link component={NextLink} href='/'>
              <Icon icon='mdi:home-outline' style={{ color: theme.palette.primary.main }} fontSize='20px' />
            </Link>
            <Link component={NextLink} href='/lines'>
              <Typography variant='body1' color={`${theme.palette.primary.main} !important`}>
                Manage Line
              </Typography>
            </Link>
            <Typography variant='body1' color={`${theme.palette.text.primary} !important`}>
              Edit Line
            </Typography>
          </Breadcrumbs>
        </div>
      </div>

      <Card
        sx={{
          boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
          padding: '20px',
          flex: '1 1 0%',
          marginTop: '24.5px'
        }}
      >
        <CardContent style={{ padding: 0 }}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                rowGap: '15px',
                columnGap: '20px'
              }}
            >
              <div style={{ gridColumn: 'span 2' }}>
                <Typography variant='h6' sx={{ fontWeight: 500, lineHeight: '26px', fontSize: '16px' }} component='h2'>
                  Line Form
                </Typography>

                <Typography
                  variant='caption'
                  component='p'
                  style={{ fontSize: '12px', letterSpacing: '.25px', color: '#485171' }}
                >
                  Complete the data to edit a Line
                </Typography>
              </div>

              <div>
                <label
                  htmlFor='plant'
                  style={{
                    display: 'inline-block',
                    color: theme.palette.text.secondary,
                    fontSize: '14px',
                    letterSpacing: '.25px'
                  }}
                >
                  Plant <span style={{ color: theme.palette.error.main }}>*</span>
                </label>

                <Controller
                  control={form.control}
                  name='plant'
                  render={({ field: { value, onChange, ...rest }, fieldState }) => (
                    <Autocomplete<(typeof plantOptions)[number]>
                      options={plantOptions}
                      size='small'
                      id='plant'
                      sx={{
                        marginTop: '4px',
                        ...(fieldState.invalid
                          ? {
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: 'error.main'
                                }
                              }
                            }
                          : {})
                      }}
                      onChange={(_, value) => onChange(value)}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={params => {
                        return (
                          <TextField
                            color={fieldState.invalid ? 'error' : 'primary'}
                            placeholder='Select Plant'
                            {...params}
                          />
                        )
                      }}
                      filterOptions={options => options}
                      value={value || null}
                      {...rest}
                    />
                  )}
                />

                {form.formState.errors.plant ? (
                  <FormHelperText sx={{ color: 'error.main' }}>{form.formState.errors.plant.message}</FormHelperText>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor='sector'
                  style={{
                    display: 'inline-block',
                    color: theme.palette.text.secondary,
                    fontSize: '14px',
                    letterSpacing: '.25px'
                  }}
                >
                  Sector <span style={{ color: theme.palette.error.main }}>*</span>
                </label>

                <Controller
                  control={form.control}
                  name='sector'
                  render={({ field: { value, onChange, ...rest }, fieldState }) => (
                    <Autocomplete<(typeof sectorOptions)[number]>
                      options={sectorOptions}
                      size='small'
                      id='sector'
                      sx={{
                        marginTop: '4px',
                        ...(fieldState.invalid
                          ? {
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: 'error.main'
                                }
                              }
                            }
                          : {})
                      }}
                      onChange={(_, value) => onChange(value)}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={params => {
                        return (
                          <TextField
                            color={fieldState.invalid ? 'error' : 'primary'}
                            placeholder='Select Sector'
                            {...params}
                          />
                        )
                      }}
                      filterOptions={options => options}
                      value={value || null}
                      {...rest}
                    />
                  )}
                />

                {form.formState.errors.sector ? (
                  <FormHelperText sx={{ color: 'error.main' }}>{form.formState.errors.sector.message}</FormHelperText>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor='code'
                  style={{
                    display: 'inline-block',
                    color: theme.palette.text.secondary,
                    fontSize: '14px',
                    letterSpacing: '.25px'
                  }}
                >
                  Sector Code <span style={{ color: theme.palette.error.main }}>*</span>
                </label>
                <Controller
                  control={form.control}
                  name='code'
                  defaultValue=''
                  render={({ field: { ref, ...rest }, fieldState }) => (
                    <Input
                      fullWidth
                      type='text'
                      id='code'
                      inputRef={ref}
                      variant='filled'
                      placeholder='Sector Code'
                      color={fieldState.invalid ? 'error' : 'primary'}
                      sx={{
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
                {form.formState.errors.code ? (
                  <FormHelperText sx={{ color: 'error.main' }}>{form.formState.errors.code.message}</FormHelperText>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor='name'
                  style={{
                    display: 'inline-block',
                    color: theme.palette.text.secondary,
                    fontSize: '14px',
                    letterSpacing: '.25px'
                  }}
                >
                  Sector Name <span style={{ color: theme.palette.error.main }}>*</span>
                </label>
                <Controller
                  control={form.control}
                  name='name'
                  defaultValue=''
                  render={({ field: { ref, ...rest }, fieldState }) => (
                    <Input
                      fullWidth
                      type='text'
                      id='name'
                      inputRef={ref}
                      variant='filled'
                      placeholder='Sector Name'
                      color={fieldState.invalid ? 'error' : 'primary'}
                      sx={{
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
                {form.formState.errors.name ? (
                  <FormHelperText sx={{ color: 'error.main' }}>{form.formState.errors.name.message}</FormHelperText>
                ) : null}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', rowGap: '4px' }}>
                <label
                  htmlFor='description'
                  style={{
                    display: 'inline-block',
                    color: theme.palette.text.secondary,
                    fontSize: '14px',
                    letterSpacing: '.25px'
                  }}
                >
                  Description
                </label>

                <Controller
                  control={form.control}
                  name='description'
                  defaultValue=''
                  render={({ field: { ref, ...rest }, fieldState }) => (
                    <Textarea
                      id='description'
                      fullWidth
                      placeholder='Description'
                      inputRef={ref}
                      color={fieldState.invalid ? 'error' : 'primary'}
                      sx={{
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

                {form.formState.errors.description ? (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {form.formState.errors.description.message}
                  </FormHelperText>
                ) : null}
              </div>

              <div>
                <Controller
                  control={form.control}
                  name='picture'
                  render={({ field: { onChange, onBlur }, fieldState }) => (
                    <>
                      <Dropzone
                        onDrop={(acceptedFiles: FileWithPath[]) => {
                          onChange(acceptedFiles[0])
                        }}
                        multiple={false}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <>
                            <label
                              htmlFor='logo'
                              style={{
                                display: 'inline-block',
                                color: theme.palette.text.secondary,
                                fontSize: '14px',
                                letterSpacing: '.25px'
                              }}
                            >
                              Picture
                            </label>
                            <div
                              {...getRootProps()}
                              style={{
                                borderRadius: '8px',
                                border: '1px dashed #005EFF',
                                backgroundColor: '#F7F8FA',
                                textAlign: 'center',
                                height: '237px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                marginTop: '4px'
                              }}
                            >
                              <div>
                                <p style={{ color: '#2F3033', fontWeight: '500', fontSize: '14px', margin: 0 }}>
                                  Choose a file or drag it here
                                </p>
                                <div
                                  style={{
                                    backgroundColor: '#D5D7DA',
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    marginTop: '12px'
                                  }}
                                >
                                  <Icon fontSize='28px' icon='mdi:tray-arrow-up' color='#2F3033' />
                                </div>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  position: 'absolute',
                                  bottom: '16px',
                                  left: 0,
                                  right: 0
                                }}
                              >
                                <div style={{ flexBasis: '50%' }}>
                                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
                                    Maximum file size : <span style={{ fontWeight: 700, color: '#2F3033' }}>10 Mb</span>
                                  </p>
                                </div>
                                <div style={{ flexBasis: '50%' }}>
                                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
                                    Format : <span style={{ fontWeight: 700, color: '#2F3033' }}>JPG, PNG</span>
                                  </p>
                                </div>
                              </div>
                              <input
                                id='logo'
                                {...getInputProps({
                                  onChange,
                                  onBlur
                                })}
                              />
                            </div>

                            {fieldState.error ? (
                              <FormHelperText sx={{ color: 'error.main' }}>{fieldState.error?.message}</FormHelperText>
                            ) : null}
                          </>
                        )}
                      </Dropzone>
                    </>
                  )}
                />
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant='outlined'
                color='primary'
                content='textOnly'
                text='Cancel'
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
                href='/lines'
              />
              <Button
                variant='contained'
                content='textOnly'
                text='Save'
                size='large'
                sx={{ height: '44px', padding: '12.5px 20px !important', borderRadius: '4px', fontSize: '16px' }}
                type='submit'
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
