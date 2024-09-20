import { Select } from '@/components/atoms'
import { Input } from '@/components/atoms/input'
import { Field } from '@/components/molecules/field'
import { UserStepOneProps } from '../types/ManageUserPage.types'
import { Card, CardContent, FormGroup } from '@mui/material'
import { Checkbox } from '@/components/atoms/checkbox'
import { MvTypography } from '@/components/atoms/mv-typography'
import { useTheme } from '@mui/material/styles'
import { Controller } from 'react-hook-form'
import { FormControlLabel } from '@mui/material'

export const UserStepOne: React.FC<UserStepOneProps> = ({ form, genders, religions, pages = 'add' }) => {
  const theme = useTheme()
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        rowGap: '12px',
        columnGap: '20px',
        marginTop: '20px'
      }}
    >
      <div style={{ gridColumn: 'span 6' }}>
        <Field name='id_number' size='large' isRequired>
          <Field.Label>ID Number</Field.Label>
          <Field.InputController controller={form.control} errors={form.formState.errors}>
            <Field.Input>
              <Input type='text' fullWidth variant='outlined' placeholder='ID Number' />
            </Field.Input>
          </Field.InputController>
        </Field>
      </div>

      <div style={{ gridColumn: 'span 3' }}>
        <Field name='first_name' size='large' isRequired>
          <Field.Label>First Name</Field.Label>
          <Field.InputController controller={form.control} errors={form.formState.errors}>
            <Field.Input>
              <Input type='text' fullWidth variant='outlined' placeholder='First name' />
            </Field.Input>
          </Field.InputController>
        </Field>
      </div>

      <div style={{ gridColumn: 'span 3' }}>
        <Field name='last_name' size='large' isRequired>
          <Field.Label>Last Name</Field.Label>
          <Field.InputController controller={form.control} errors={form.formState.errors}>
            <Field.Input>
              <Input type='text' fullWidth variant='outlined' placeholder='Last name' />
            </Field.Input>
          </Field.InputController>
        </Field>
      </div>

      <div style={{ gridColumn: 'span 3' }}>
        <Field size='large' name='gender' label='Gender'>
          <Field.SelectController controller={form.control} errors={form.formState.errors}>
            <Select data={genders} labelKey='label' valueKey='id' placeholder='Select gender' variant='default' />
          </Field.SelectController>
        </Field>
      </div>

      <div style={{ gridColumn: 'span 3' }}>
        <Field size='large' name='religion' label='Religion'>
          <Field.SelectController controller={form.control} errors={form.formState.errors}>
            <Select data={religions} labelKey='label' valueKey='id' placeholder='Select Religion' variant='default' />
          </Field.SelectController>
        </Field>
      </div>

      <div style={{ gridColumn: 'span 6' }}>
        <Field name='email' size='large' isRequired>
          <Field.Label>Email</Field.Label>
          <Field.InputController controller={form.control} errors={form.formState.errors}>
            <Field.Input>
              <Input type='text' fullWidth variant='outlined' placeholder='Input email here' />
            </Field.Input>
          </Field.InputController>
        </Field>
      </div>

      {pages === 'add' ? (
        <>
          <div style={{ gridColumn: 'span 3' }}>
            <Field name='password' size='large' isRequired>
              <Field.Label>Password</Field.Label>
              <Field.InputController controller={form.control} errors={form.formState.errors}>
                <Field.Input>
                  <Input placeholder='Input password' type='password' fullWidth variant='outlined' />
                </Field.Input>
              </Field.InputController>
            </Field>
          </div>

          <div style={{ gridColumn: 'span 3' }}>
            <Field name='confirm_password' size='large' isRequired>
              <Field.Label>Confirm Password</Field.Label>
              <Field.InputController controller={form.control} errors={form.formState.errors}>
                <Field.Input>
                  <Input placeholder='Input password again' type='password' fullWidth variant='outlined' />
                </Field.Input>
              </Field.InputController>
            </Field>
          </div>
        </>
      ) : (
        <Card
          sx={{
            gridColumn: 'span 6',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '24.5px',
            boxShadow: '0px 2px 6px 0px rgba(0, 0,x 0, 0.25)',
            flex: '1 1 0%'
          }}
        >
          <CardContent>
            <Controller
              name='is_active'
              control={form.control}
              render={({ field: { name, value, onChange, ...rest }, fieldState }) => {
                return (
                  <Field {...rest} error={fieldState.invalid}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox size='large' onChange={onChange} label='Set as Active' {...rest} />}
                        label={''}
                      />
                    </FormGroup>
                  </Field>
                )
              }}
            />
            <MvTypography
              size='BODY_MD_NORMAL'
              typeSize='PX'
              color={theme.colorToken.text.danger.normal}
              sx={{ pl: 4 }}
            >
              If deactivated, this data record will be hiden and will no longer be accessible in dropdown menus or other
              paths of the application. Use with caution
            </MvTypography>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
