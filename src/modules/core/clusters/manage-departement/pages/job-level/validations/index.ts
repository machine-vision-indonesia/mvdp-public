import * as yup from 'yup'

export const schemaAddJobLevel = yup.object().shape({
  code: yup.string().required('Code is a required field').min(1).default('123456'),
  job_level_name: yup.string().required('Job Level Name is a required field').min(1).default(''),
  work_center: yup
    .object()
    .shape({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .required('Work Center is a required field')
    .default(null),
  department: yup
    .array()
    .of(
      yup.object()
      .shape({
        id: yup.string().required(),
        label: yup.string().required()
      })
    )
    .required('Department is a required field')
    .min(1, 'Department is a required field')
    .default([]),
  job_function: yup
    .array()
    .of(
      yup.object()
      .shape({
        id: yup.string().required(),
        label: yup.string().required(),
        job_level: yup.object().shape({
          name: yup.string().required()
        })
      })

    )
    .required('Job Function is a required field')
    .min(1, 'Job Function is a required field')
    .default([]),
  description: yup.string(),
})
