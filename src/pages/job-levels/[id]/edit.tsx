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
  department: yup
    .object({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .required()
    .default(null),
  job_title: yup
    .object({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .required()
    .default(null),
  code: yup.string().required().min(1).default(''),
  name: yup.string().required().min(1).default(''),
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

type JobTitle = {
  id: string
  name: string
}

const jobTitles: JobTitle[] = [
  {
    id: '1',
    name: 'Job Title 1'
  },
  {
    id: '2',
    name: 'Job Title 2'
  }
]

const jobTitleOptions = jobTitles.map(jobTitle => ({
  id: jobTitle.id,
  label: jobTitle.name
}))

export default function JobLevelsEditPage() {
  const theme = useTheme()
  const form = useForm<Schema>({
    resolver: yupResolver(schema)
  })

  function onSubmit() {
    console.log('submitted')
  }

  return (
    <main>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flexGrow: 1 }}>
          <Typography variant='h2'>Edit Job Level</Typography>
          <Breadcrumbs
            aria-label='breadcrumb'
            sx={{ mt: '8px' }}
            separator={<Icon icon='mdi:chevron-right' color='#909094' />}
          >
            <Link component={NextLink} href='/'>
              <Icon icon='mdi:home-outline' style={{ color: theme.palette.primary.main }} fontSize='20px' />
            </Link>
            <Link component={NextLink} href='/job-levels'>
              <Typography variant='body1' color={`${theme.palette.primary.main} !important`}>
                Job Level
              </Typography>
            </Link>
            <Typography variant='body1' color={`${theme.palette.text.primary} !important`}>
              Edit Job Level
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
                  Job Level Form
                </Typography>

                <Typography
                  variant='caption'
                  component='p'
                  style={{ fontSize: '12px', letterSpacing: '.25px', color: '#485171' }}
                >
                  Complete the data to edit a Job Level
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
                  htmlFor='department'
                  style={{
                    display: 'inline-block',
                    color: theme.palette.text.secondary,
                    fontSize: '14px',
                    letterSpacing: '.25px'
                  }}
                >
                  Department <span style={{ color: theme.palette.error.main }}>*</span>
                </label>

                <Controller
                  control={form.control}
                  name='department'
                  render={({ field: { value, onChange, ...rest }, fieldState }) => (
                    <Autocomplete<(typeof departmentOptions)[number]>
                      options={departmentOptions}
                      size='small'
                      id='department'
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

                {form.formState.errors.department ? (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {form.formState.errors.department.message}
                  </FormHelperText>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor='job_title'
                  style={{
                    display: 'inline-block',
                    color: theme.palette.text.secondary,
                    fontSize: '14px',
                    letterSpacing: '.25px'
                  }}
                >
                  Job Title <span style={{ color: theme.palette.error.main }}>*</span>
                </label>

                <Controller
                  control={form.control}
                  name='job_title'
                  render={({ field: { value, onChange, ...rest }, fieldState }) => (
                    <Autocomplete<(typeof jobTitleOptions)[number]>
                      options={jobTitleOptions}
                      size='small'
                      id='job_title'
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
                            placeholder='Select Job Title'
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

                {form.formState.errors.job_title ? (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {form.formState.errors.job_title.message}
                  </FormHelperText>
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
                  Job Level Code <span style={{ color: theme.palette.error.main }}>*</span>
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
                      placeholder='Job Level Code'
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
                  Job Level Name <span style={{ color: theme.palette.error.main }}>*</span>
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
                      placeholder='Job Level Name'
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
                      placeholder='Description'
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
                href='/job-levels'
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
