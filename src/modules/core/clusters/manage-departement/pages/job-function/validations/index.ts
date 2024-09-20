import * as yup from 'yup'

export const schemaAddJobFunction = yup.object().shape({
  code: yup.string().required('Job Function Code is a required field').min(1).default(''),
  name: yup.string().required('Job Function Name is a required field').min(1).default(''),
  work_center: yup
    .object()
    .shape({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .required('Work Center is a required field')
    .default(null),
  department: yup
    .object({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .required('Department is a required field')
    .default(null),
  job_level: yup
    .object({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .required('Job Level is a required field')
    .default(null),
  description: yup.string().default(''),
  existingRoleOrCreateNew: yup.string().oneOf(['create', 'existing']).default('existing'),
  role: yup
    .object()
    .shape({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .when('existingRoleOrCreateNew', requiredIf('existing', 'Role is a required field'))
    .default(null),
  role_code: yup
    .string()
    .when('existingRoleOrCreateNew', requiredIf('create', 'Role Code is a required field'))
    .default(''),
  role_name: yup
    .string()
    .when('existingRoleOrCreateNew', requiredIf('create', 'Role Name is a required field'))
    .default(''),
  role_work_center: yup
    .object()
    .shape({
      id: yup.string().required(),
      label: yup.string().required()
    })
    .when('existingRoleOrCreateNew', requiredIf('create', 'Role Work Center is a required field'))
    .default(null),
  role_description: yup.string().default('')
})

// mark field as required based on existingRoleOrCreateNew' value
function requiredIf(condition: string, message: string) {
  return function (value: string | string[], schema: yup.Schema) {
    if (Array.isArray(value)) {
      value = value[0] // Assume first value if it's an array
    }

    if (value === condition) {
      return schema.required(message)
    } else {
      return schema.nullable()
    }
  }
}
