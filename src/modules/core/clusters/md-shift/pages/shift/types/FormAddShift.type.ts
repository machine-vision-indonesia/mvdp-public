import * as yup from 'yup'
import { schemaAddShift } from '../validations'
import { IParams } from '@/types/master/filter'

export type SchemaAddShift = yup.InferType<typeof schemaAddShift>
export interface FetchListPlantParams extends IParams {
  limit?: number
  page?: number
  search?: string
  hasNextPage?: boolean
  fetchNextPage?: () => void
  isFetchingNextPage?: boolean
}
