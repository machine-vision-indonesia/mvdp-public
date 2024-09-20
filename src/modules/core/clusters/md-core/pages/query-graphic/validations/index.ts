import * as yup from 'yup'

export const schemaAddQueryGraphic = yup.object().shape({
  code: yup.string().required('Code is required'),
  product: yup.string().required('Product is required'),
  page: yup.string().required('Page is required'),
  name: yup.string().required('Name is required'),
  query: yup
    .string()
    .test('is-sql-query', 'Query must be a valid SQL query', function (value) {
      if (!value) return true // Allow empty value
      const sqlQueryPattern =
        /^SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE|RENAME|GRANT|REVOKE|CALL|MERGE|SHOW|DESCRIBE|EXPLAIN|USE|BEGIN|COMMIT|ROLLBACK|SET|LOCK|UNLOCK/i
      return sqlQueryPattern.test(value)
    })
    .required('Query is required'),
  parameters: yup
    .string()
    .test('is-json', 'Parameters must be in JSON format', function (value) {
      if (!value) return true // Allow empty value
      try {
        JSON.parse(value)
        return true
      } catch (error) {
        return false
      }
    })
    .required('Parameters is required')
})
