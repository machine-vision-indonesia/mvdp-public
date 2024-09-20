import * as yup from 'yup'
import { schemaAddUnit } from '../validations'

export type SchemaAddUnit = yup.InferType<typeof schemaAddUnit>
