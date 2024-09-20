import { Modal } from '@/components/molecules'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ClusterSchema, ModifiedModule, ModifiedPage } from '../types/ManageModulePage.types'
import { yupResolver } from '@hookform/resolvers/yup'
import { clusterSchema } from '../validations'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/atoms'
import { Input } from '@/components/atoms/input'
import { Box, FormHelperText } from '@mui/material'

import { getModulesAndGeneralPages } from '../services/fetchManageModule.service'
import { useCreateClusterMutation } from '../services/actionAddManageModule.service'
import { queryClient } from '@/pages/_app'
const isModifiedModule = (mod: ModifiedModule | ModifiedPage): mod is ModifiedModule => mod.additional_type === 'module'

export const CreateCluster = ({ createClusterModalOpen, setCreateClusterModalOpen, selectedModuleId }: any) => {
  const createClusterForm = useForm<ClusterSchema>({
    resolver: yupResolver(clusterSchema)
  })

  const createClusterMutation = useCreateClusterMutation()

  const getModulesAndGeneralPagesQuery = useQuery({
    queryKey: ['modules'],
    queryFn: () => getModulesAndGeneralPages()
  })

  const onCreateClusterSubmit = async (data: ClusterSchema) => {
    try {
      if (!selectedModuleId) {
        return
      }

      const relatedModule = getModulesAndGeneralPagesQuery.data
        ?.filter(isModifiedModule)
        .find(mod => mod.id === selectedModuleId)

      if (!relatedModule) {
        return
      }

      const maxClusterOrder = relatedModule.clusters.length
        ? relatedModule.clusters.reduce((prev, curr) => {
          return curr.order > prev.order ? curr : prev
        }).order
        : 0

      await createClusterMutation.mutateAsync({
        ...data,
        module: selectedModuleId,
        order: maxClusterOrder + 1,
        status: 'published'
      })

      await queryClient.invalidateQueries()
      setCreateClusterModalOpen(false)

      createClusterForm.reset({
        code: '',
        name: ''
      })
    } catch { }
  }

  return (
    <Modal
      isOpen={createClusterModalOpen}
      onClose={() => setCreateClusterModalOpen(false)}
      title='Create Cluster'
      description='Create Cluster for Manufacturing Data Platform'
      maxWidth='md'
      scroll='body'
      renderAction={false}
    >
      <form onSubmit={createClusterForm.handleSubmit(onCreateClusterSubmit)}>
        <Box sx={{ marginTop: 10 }}>
          <label htmlFor='code' style={{ display: 'block' }}>
            Cluster Code
          </label>
          <Controller
            control={createClusterForm.control}
            name='code'
            render={({ field: { value, onChange } }) => (
              <Input
                fullWidth
                id='code'
                defaultValue={value}
                onChange={onChange}
                placeholder='Cluster Code'
                variant='filled'
                style={{ marginTop: '4px' }}
              />
            )}
          />
          {createClusterForm.formState.errors.code && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {createClusterForm.formState.errors.code.message}
            </FormHelperText>
          )}
        </Box>
        <Box sx={{ marginTop: 5 }}>
          <label htmlFor='name' style={{ display: 'block' }}>
            Cluster Name
          </label>
          <Controller
            control={createClusterForm.control}
            name='name'
            render={({ field: { value, onChange } }) => (
              <Input
                fullWidth
                id='name'
                defaultValue={value}
                onChange={onChange}
                placeholder='Cluster Name'
                variant='filled'
                style={{ marginTop: '4px' }}
              />
            )}
          />
          {createClusterForm.formState.errors.name && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {createClusterForm.formState.errors.name.message}
            </FormHelperText>
          )}
        </Box>
        <Box display="flex" justifyContent="center" gap={2} mt={5}>
          <Button
            variant='outlined'
            content='textOnly'
            text='Cancel'
            color='secondary'
            size='medium'
            onClick={() => setCreateClusterModalOpen(false)}
          />
          <Button
            size='medium'
            variant='contained'
            content='textOnly'
            text='Submit'
            type='submit'
            disabled={createClusterForm.formState.isSubmitting}
            loading={createClusterForm.formState.isSubmitting}
          />
        </Box>
      </form>
    </Modal>
  )
}
