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
  code: yup.string().required().min(1).default(''),
  name: yup.string().required().min(1).default(''),
  parent: yup
    .object({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .nullable()
    .default(null),
  level: yup
    .object({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .nullable()
    .default(null),
  description: yup.string()
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

type Department = {
  id: string
  name: string
}

const departments: Department[] = [
  {
    id: '1',
    name: 'Department 1'
  },
  {
    id: '2',
    name: 'Department 2'
  }
]

const departmentOptions = departments.map(department => ({
  id: department.id,
  label: department.name
}))

type DepartmentLevel = {
  id: string
  name: string
}

const departmentLevels: DepartmentLevel[] = [
  {
    id: '1',
    name: 'Direktorat'
  },
  {
    id: '2',
    name: 'Divisi'
  },
  {
    id: '2',
    name: 'Departemen'
  }
]

const departmentLevelOptions = departmentLevels.map(departmentLevel => ({
  id: departmentLevel.id,
  label: departmentLevel.name
}))

export default function ManageDepartmentsEditPage() {
  const theme = useTheme()
  const form = useForm<Schema>({
    resolver: yupResolver(schema),
    defaultValues: {
      parent: null
    }
  })
  const router = useRouter()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onSubmit(data: Schema) {
    router.push('/departments')
  }

  return (
    <main>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flexGrow: 1 }}>
          <Typography variant='h2'>Edit Department</Typography>
          <Breadcrumbs
            aria-label='breadcrumb'
            sx={{ mt: '8px' }}
            separator={<Icon icon='mdi:chevron-right' color='#909094' />}
          >
            <Link component={NextLink} href='/'>
              <Icon icon='mdi:home-outline' style={{ color: theme.palette.primary.main }} fontSize='20px' />
            </Link>
            <Link component={NextLink} href='/departments'>
              <Typography variant='body1' color={`${theme.palette.primary.main} !important`}>
                Manage Department
              </Typography>
            </Link>
            <Typography variant='body1' color={`${theme.palette.text.primary} !important`}>
              Edit Department
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
                  Department Form
                </Typography>

                <Typography
                  variant='caption'
                  component='p'
                  style={{ fontSize: '12px', letterSpacing: '.25px', color: '#485171' }}
                >
                  Complete the data to edit a Department
                </Typography>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
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
                  htmlFor='code'
                  style={{
                    display: 'inline-block',
                    color: theme.palette.text.secondary,
                    fontSize: '14px',
                    letterSpacing: '.25px'
                  }}
                >
                  Department Code <span style={{ color: theme.palette.error.main }}>*</span>
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
                      placeholder='Department Code'
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
                  Department Name <span style={{ color: theme.palette.error.main }}>*</span>
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
                      placeholder='Department Name'
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

              <div>
                <label
                  htmlFor='parent'
                  style={{
                    display: 'inline-block',
                    color: theme.palette.text.secondary,
                    fontSize: '14px',
                    letterSpacing: '.25px'
                  }}
                >
                  Parent Department
                </label>

                <Controller
                  control={form.control}
                  name='parent'
                  render={({ field: { value, onChange, ...rest }, fieldState }) => (
                    <Autocomplete<(typeof departmentOptions)[number]>
                      options={departmentOptions}
                      size='small'
                      id='parent'
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
                            placeholder='Select Parent Department'
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

                {form.formState.errors.parent ? (
                  <FormHelperText sx={{ color: 'error.main' }}>{form.formState.errors.parent.message}</FormHelperText>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor='level'
                  style={{
                    display: 'inline-block',
                    color: theme.palette.text.secondary,
                    fontSize: '14px',
                    letterSpacing: '.25px'
                  }}
                >
                  Department Level
                </label>

                <Controller
                  control={form.control}
                  name='level'
                  render={({ field: { value, onChange, ...rest }, fieldState }) => (
                    <Autocomplete<(typeof departmentLevelOptions)[number]>
                      options={departmentLevelOptions}
                      size='small'
                      id='level'
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
                            placeholder='Select Level Department'
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

                {form.formState.errors.level ? (
                  <FormHelperText sx={{ color: 'error.main' }}>{form.formState.errors.level.message}</FormHelperText>
                ) : null}
              </div>

              <div style={{ gridColumn: 'span 2' }}>
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
                      inputRef={ref}
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
                {form.formState.errors.description ? (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {form.formState.errors.description.message}
                  </FormHelperText>
                ) : null}
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
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
                href='/departments'
              />
              <Button
                variant='contained'
                content='textOnly'
                text='Submit'
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
