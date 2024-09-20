import * as yup from 'yup'

export const schemaAddDepartment = yup.object().shape({
  code: yup.string().required('Department Code is a required field').min(1).default(''),
  name: yup.string().required('Department Name is a required field').min(1).default(''),
  work_center: yup
    .object()
    .shape({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .required('Work Center is a required field')
    .default(null),
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
    .required('Department Level is a required field')
    .default(null),
  description: yup.string().default('')
})
