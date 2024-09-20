import * as yup from 'yup'

export const schemaAddUnit = yup.object().shape({
  key: yup.string().required('Key is required field'),
  value: yup.string().required('Name is a required field')
})
