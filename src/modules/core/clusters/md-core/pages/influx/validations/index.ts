import * as yup from 'yup'

export const schemaAddUnit = yup.object().shape({
  code: yup.string().default(''),
  collection: yup
    .object()
    .shape({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .required('Collection is a required field'),
  json: yup.string().default('')
})
