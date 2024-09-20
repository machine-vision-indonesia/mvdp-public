import * as yup from 'yup'

export const schemaAddUser = yup.object().shape({
  id_number: yup.string().required('ID Number is a required field').default(''),
  first_name: yup.string().required('First Name is a required field').default(''),
  last_name: yup.string().required('Last Name is a required field').default(''),
  gender: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  }),
  religion: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  }),
  email: yup.string().email().required('Email is a required field').min(1).default(''),
  password: yup.string().required('Password is a required field').min(1).default(''),
  confirm_password: yup
    .string()
    .required('Confirm Password is a required field')
    .oneOf([yup.ref('password')], 'Passwords must match')
    .default(''),
  roles: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        label: yup.string().required()
      })
    )
    .required('Roles is a required field')
    .min(1, 'Roles is a required field')
    .default([]),
  work_center: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  }),
  department: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  }),
  job_function: yup
    .object()
    .shape({
      id: yup.string().required(),
      label: yup.string().required(),
      job_level: yup.object().shape({
        name: yup.string().required()
      })
    })
    .required('Job Function is a required field')
    .default(null),
  job_level: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  }),
  job_title: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  }),
  address: yup.string().default(null),
  phone: yup.string().default(null),
  post_code: yup.string().default(null),
  photo: yup
    .mixed<File>()
    .test('file', 'Invalid file type', value => !value || value instanceof File)
    .nullable()
    .default(null),
  cover: yup
    .mixed<File>()
    .test('file', 'Invalid file type', value => !value || value instanceof File)
    .nullable()
    .default(null)
})

export const schemaPersonalData = yup.object().shape({
  id_number: yup.string().required('ID Number is a required field').default(''),
  first_name: yup.string().required('First Name is a required field').default(''),
  last_name: yup.string().required('Last Name is a required field').default(''),
  gender: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  }),
  religion: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  }),
  email: yup.string().email().required('Email is a required field').min(1).default(''),
  password: yup.string().required('Password is a required field').min(1).default(''),
  confirm_password: yup
    .string()
    .required('Confirm Password is a required field')
    .oneOf([yup.ref('password')], 'Passwords must match')
    .default('')
})

export const schemaEditPersonalData = yup.object().shape({
  id_number: yup.string().required('ID Number is a required field').default(''),
  first_name: yup.string().required('First Name is a required field').default(''),
  last_name: yup.string().required('Last Name is a required field').default(''),
  gender: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  }),
  religion: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  }),
  email: yup.string().email().required('Email is a required field').min(1).default('')
})

export const schemaJobProfile = yup.object().shape({
  roles: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        label: yup.string().required()
      })
    )
    .required('Roles is a required field')
    .min(1, 'Roles is a required field')
    .default([]),
  work_center: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  }),
  department: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  }),
  job_function: yup
    .object()
    .shape({
      id: yup.string().required(),
      label: yup.string().required(),
      job_level: yup.object().shape({
        name: yup.string().required()
      })
    })
    .required('Job Function is a required field')
    .default(null),
  job_level: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  }),
  job_title: yup.object().shape({
    id: yup.string(),
    label: yup.string()
  })
})

export const schemaAddressContact = yup.object().shape({
  address: yup.string().default(null),
  phone: yup.string().default(null),
  post_code: yup.string().default(null)
})

export const schemaFile = yup.object().shape({
  file: yup
    .mixed<File>()
    .test('file', 'Invalid file type', value => !value || value instanceof File)
    .nullable()
    .default(null)
})

export const schemaProfileOtp = yup.object().shape({
  loginOption: yup.string().required('Please select an option')
})
