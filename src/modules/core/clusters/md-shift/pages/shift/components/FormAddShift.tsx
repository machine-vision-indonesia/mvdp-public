import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { Box, Checkbox, Grid, Radio, RadioGroup, Stack, useTheme } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Field } from '@/components/molecules/field'
import { Input } from '@/components/atoms/input'
import { Button, Select, Textarea } from '@/components/atoms'
import { schemaAddShift } from '../validations'
import { SchemaAddShift } from '../types/FormAddShift.type'
import { dummyPlants, shiftTypes } from '../constants/common'
import { FormControlLabel } from '@mui/material'
import { DateTimePicker } from '@/components/molecules/date-time-picker'
import { FormGroup } from '@mui/material'
import { MvTypography } from '@/components/atoms/mv-typography'
import { addShiftService } from '../services/actionAddShift.service'
import { getDetailShiftService } from '../services/fetchDetailShift.service'
import { SelectAsync } from '@/components/molecules/select-async'
import { getListShiftPlantService } from '../services/fetchListShift.service'
import { useAtom } from 'jotai'
import { shiftAlertAtom } from '../store/shiftAlertAtom'
import { queryClient } from '@/pages/_app'

export const FormAddShift = ({
  formType = 'add',
  shiftId,
  setCurrentAction
}: {
  formType: 'add' | 'edit'
  shiftId?: string
  setCurrentAction: Dispatch<SetStateAction<any>>
}) => {
  const theme = useTheme()
  const [_, setShiftAlert] = useAtom(shiftAlertAtom)

  const detailShiftParam = {
    id: shiftId as string
  }

  const addShiftMutation = addShiftService()
  const responseDetailShift = getDetailShiftService(detailShiftParam)
  const detailShift = responseDetailShift?.data?.data

  const { reset, getValues, setValue, handleSubmit, ...form } = useForm<SchemaAddShift>({
    resolver: yupResolver(schemaAddShift),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: formType === 'edit' && detailShift
  })

  const onSubmit = async (currentFieldValue: SchemaAddShift) => {
    const submittedValue = {
      ...currentFieldValue,
      is_overtime: currentFieldValue.shiftType === 'is_overtime' ? true : false,
      is_first_shift: currentFieldValue.shiftType === 'is_first_shift' ? true : false,
      start: '18:00:00',
      end: '20:00:00',
      company_id: 'dummy company name',
      plant_id: currentFieldValue.plant_id.value
    }

    if (formType === 'add') {
      try {
        const responseAddShift = await addShiftMutation.mutateAsync(submittedValue)

        if (responseAddShift.status == 200) {
          setCurrentAction(false)
          setShiftAlert({
            title: 'Successfully save data.',
            content: 'Shift has been saved by our system',
            size: 'small',
            variant: 'success',
            pathname: '/core/shift',
            open: true
          })
          await queryClient.invalidateQueries()
        }
      } catch {
        setShiftAlert({
          title: 'Failed save data',
          content: addShiftMutation.error?.message ?? 'Unable to connect to the network or server.',
          size: 'small',
          variant: 'danger',
          pathname: '/core/shift',
          open: true
        })
      }
    } else {
      setCurrentAction(null)
    }
  }

  // This will update all fields values when `detailShift` is available
  useEffect(() => {
    if (formType === 'edit' && detailShift) {
      reset({
        ...getValues(),
        ...detailShift,
        name: detailShift.code,
        shiftType: detailShift.is_overtime ? 'is_overtime' : detailShift.is_first_shift ? 'is_first_shift' : ''
      })
    }
  }, [formType, detailShift, reset, getValues])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        sx={{
          mt: 5,
          gap: 5,
          flexDirection: 'column'
        }}
      >
        <Grid item>
          <Field name='name' size='medium' isRequired fullWidth>
            <Field.Label>Name</Field.Label>
            <Field.InputController controller={form.control} errors={form.formState.errors}>
              <Input placeholder='Shift name' />
            </Field.InputController>
          </Field>
        </Grid>
        <Grid item>
          <Controller
            name='shiftType'
            control={form.control}
            render={({ field: { name, ...rest }, fieldState }) => {
              return (
                <Field
                  size='medium'
                  label='Shift Type'
                  isRequired
                  error={fieldState.invalid}
                  helperText={form.formState.errors && form.formState.errors[name]?.message}
                  isCustomHelperText
                  {...rest}
                >
                  <RadioGroup
                    sx={{
                      flexDirection: 'row'
                    }}
                  >
                    {shiftTypes.map(radio => (
                      <FormControlLabel
                        key={radio.name}
                        control={<Radio value={radio.name} name={radio.name} />}
                        label={radio.label}
                      />
                    ))}
                  </RadioGroup>
                </Field>
              )
            }}
          />
        </Grid>
        <Grid
          item
          container
          sx={{
            flexDirection: 'row',
            gap: 5
          }}
        >
          <Grid item>
            <Field name='start' size='medium' isRequired>
              <Field.Label>Start Shift</Field.Label>
              <Field.InputController controller={form.control} errors={form.formState.errors}>
                <DateTimePicker type='timePicker' variant='default' size='medium' value={new Date()} />
              </Field.InputController>
            </Field>
          </Grid>
          <Grid item>
            <Field name='end' size='medium' isRequired>
              <Field.Label>End Shift</Field.Label>
              <Field.InputController controller={form.control} errors={form.formState.errors}>
                <DateTimePicker type='timePicker' variant='default' size='medium' value={new Date()} />
              </Field.InputController>
            </Field>
          </Grid>
        </Grid>
        <Grid item>
          <Field name='company_id' size='medium' isRequired fullWidth disabled>
            <Field.Label>Company</Field.Label>
            <Field.InputController controller={form.control} errors={form.formState.errors}>
              <Input placeholder='Company name' value='dummy company name' />
            </Field.InputController>
          </Field>
        </Grid>
        <Grid item>
          <Field name='plant_id' size='medium' isRequired fullWidth>
            <Field.Label>Plant Name</Field.Label>
            <Field.SelectController controller={form.control} errors={form.formState.errors}>
              {/* <Select data={dummyPlants} labelKey='label' valueKey='value' placeholder='Select plant name' /> */}
              <SelectAsync
                labelKey='code'
                valueKey='id'
                placeholder='Select plant name'
                // onChange={e =>
                //   handleSelectTempChange(
                //     item.key,
                //     e?.[item.valueKey || 'id'],
                //     e?.[item.labelKey || 'label'],
                //     item.valueKey || 'id',
                //     item.labelKey || 'label'
                //   )
                // }
                // selected={filterSelectTempValues.find(fv => fv[item.key] === filterSelectedTemp[item.key])}
                size='small'
                fullWidth
                dataFetchService={getListShiftPlantService}
              />
            </Field.SelectController>
          </Field>
        </Grid>
        <Grid item>
          <Controller
            name='Is_active'
            control={form.control}
            render={({ field: { name, value, onChange, ...rest }, fieldState }) => {
              return (
                <Field {...rest}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name='Is_active'
                          onChange={e => {
                            const newValue = e.target.checked
                            onChange(newValue)
                          }}
                        />
                      }
                      label='Set as Active'
                    />
                  </FormGroup>
                  <MvTypography
                    size='BODY_MD_BOLDEST'
                    typeSize='PX'
                    color={theme.colorToken.text.danger.normal}
                    sx={{
                      marginLeft: '30px'
                    }}
                  >
                    If deactivated, this data record will be hiden and will no longer be accessible in dropdown menus or
                    other parts of the application. Use with caution
                  </MvTypography>
                </Field>
              )
            }}
          />
        </Grid>
      </Grid>

      <Stack direction='row' mt={10} gap={3} justifyContent='end'>
        <Button
          disabled={addShiftMutation.isPending}
          content='textOnly'
          text='Cancel'
          variant='outlined'
          onClick={() => {
            if (formType === 'add') {
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
