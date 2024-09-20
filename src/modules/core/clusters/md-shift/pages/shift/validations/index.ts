import * as yup from 'yup'

export const schemaAddShift = yup.object().shape({
  name: yup.string().required('Name is required field'),
  shiftType: yup
    .string()
    .oneOf(['is_overtime', 'is_first_shift'], 'Shift Type is a required field')
    .required('Shift Type is a required field'),
  // start: yup.string().required('Start Shift is a required field'),
  // end: yup.string().required('End Shift is a required field'),
  start: yup.string().nullable(),
  end: yup.string().nullable(),
  company_id: yup.string().nullable(),
  plant_id: yup.object().required('Plant Name is a required field'),
  Is_active: yup.boolean().nullable()
})
