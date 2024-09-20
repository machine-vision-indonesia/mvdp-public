import * as yup from 'yup'
import { Cluster, Page, Role } from '../types/ManageModulePage.types'

export const moduleSchema = yup.object().shape({
  code: yup.string().required().min(1),
  name: yup.string().required().min(1),
  description: yup.string(),
  icon: yup.string().default(null).nullable()
})

export const clusterSchema = yup.object().shape({
  code: yup.string().required().min(1),
  name: yup.string().required().min(1)
})

export const pageSchema = yup.object().shape({
  code: yup.string().required().min(1),
  name: yup.string().required().min(1),
  icon: yup.string().nullable(),
  type: yup.string().required().min(1),
  products: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        label: yup.string().required()
      })
    )
    .required()
    .min(1),
  url: yup.string().required(),
  is_external_src: yup.boolean().default(false),
  is_main_page: yup.boolean().default(false)
})

export const assignToRoleRoleSchema: yup.ObjectSchema<Pick<Role, 'id' | 'name'>> = yup.object({
  id: yup.string().required(),
  name: yup.string().required()
})

export const assignToRoleClusterSchema: yup.ObjectSchema<Pick<Cluster, 'id' | 'name'>> = yup.object({
  id: yup.string().required(),
  name: yup.string().required()
})

export const assignToRolePageSchema: yup.ObjectSchema<Pick<Page, 'id' | 'name'>> = yup.object({
  id: yup.string().required(),
  name: yup.string().required()
})

export const assignToRoleSchema = yup.object().shape({
  rows: yup.array().of(
    yup.object().shape({
      role: assignToRoleRoleSchema,
      capabilities: yup.array().of(
        yup.object().shape({
          cluster: assignToRoleClusterSchema,
          page: assignToRolePageSchema,
          create: yup.boolean().required(),
          update: yup.boolean().required(),
          delete: yup.boolean().required()
        })
      )
    })
  )
})

export const assignToRoleGeneralPageSchema = yup.object().shape({
  rows: yup.array().of(
    yup.object().shape({
      role: assignToRoleRoleSchema,
      create: yup.boolean().required(),
      update: yup.boolean().required(),
      delete: yup.boolean().required()
    })
  )
})
