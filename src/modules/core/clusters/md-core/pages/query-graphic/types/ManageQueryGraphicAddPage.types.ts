import * as yup from 'yup'
import { schemaAddQueryGraphic } from '../validations'
import { QueryGraphic } from './ManageQueryGraphicPage.types'

export type SchemaAddQueryGraphic = yup.InferType<typeof schemaAddQueryGraphic>
export type SchemaEditQueryGraphic = yup.InferType<typeof schemaAddQueryGraphic> & {
  id: string
}

export type AddQueryGraphicFormProps = {
  form: any
  pages: 'add' | 'edit'
  fields?: Omit<QueryGraphic, 'id'>
  onSubmit: (data: SchemaAddQueryGraphic) => void
  isLoading: boolean
}
