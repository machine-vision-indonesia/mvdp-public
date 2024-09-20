import * as yup from 'yup'

export const addEditRole = yup.object().shape({
  code: yup.string().required('Code is a required field').min(1),
  name: yup.string().required('Name is a required field').min(1),
  parent: yup
    .object({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .nullable()
    .default(null),
  description: yup.string()
})

export type AddEditRole = yup.InferType<typeof addEditRole>
