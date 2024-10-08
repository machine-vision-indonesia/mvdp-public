import React, { PropsWithChildren, useContext } from 'react'
import { Controller } from 'react-hook-form'
import { FieldInputControllerProps } from '../types/Field.types'
import { FieldContext } from '../constants'
import { FieldInput } from './FieldInput'

export const FieldInputController: React.FC<PropsWithChildren<FieldInputControllerProps>> = ({
  controller,
  errors,
  children
}) => {
  const { isRequired, name, error, helperText, ...otherProps } = useContext(FieldContext)

  return (
    <Controller
      name={name || ''}
      control={controller}
      render={({ field: { name, onChange, ...rest }, fieldState }) => {
        const fieldError = fieldState.invalid
        const fieldHelperText = errors && errors[name]?.message

        const handleChange = (
          event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { value: unknown }>
        ) => {
          const newValue = event.target.value
          onChange(newValue) // Ensure the event's new value is passed to the controller's onChange
        }

        return (
          <FieldInput fieldError={fieldError} fieldHelperText={fieldHelperText} onChange={handleChange} {...rest}>
            {children}
          </FieldInput>
        )
      }}
    />
  )
}
