import * as yup from 'yup'

export const schemaAddOtProtocol = yup.object().shape({
  code: yup.string().required('code is required'),
  json_property: yup
    .string()
    .required('json in required')
    .test('is-json', 'JSON property must be in JSON format', function (value) {
      if (!value) return true // Allow empty value
      try {
        JSON.parse(value)
        return true
      } catch (error) {
        return false
      }
    })
})
