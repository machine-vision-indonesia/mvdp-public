import * as yup from 'yup'

export const schemaAddUnit = yup.object().shape({
  code: yup.string().default('').required('Code is a required field'),
  name: yup.string().required('Name is a required field'),
  description: yup.string().default(''),
  is_active: yup.boolean()
})
