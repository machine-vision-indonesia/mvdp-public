import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Input,
  FormHelperText,
  FormControlLabel,
  Checkbox as MuiCheckbox,
  Link,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Textarea } from '@/components/atoms';
import { ClusterSchema, ModifiedModule, ModifiedPage } from '../types/ManageModulePage.types';
import { useEditClusterMutation } from '../services/actionUpdateManageModule.service';
import { queryClient } from '@/pages/_app';
import { yupResolver } from '@hookform/resolvers/yup';
import { clusterSchema } from '../validations';
import { Modal } from '@/components/molecules';
import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { getModulesAndGeneralPages } from '../services/fetchManageModule.service';
import { selectedClusterIdAtom } from '../atoms';


const isModifiedModule = (mod: ModifiedModule | ModifiedPage): mod is ModifiedModule => mod.additional_type === 'module'

const EditCluster = ({ editClusterModalOpen, setEditClusterModalOpen }: { editClusterModalOpen: any, setEditClusterModalOpen: any }) => {
  const [selectedClusterId] = useAtom(selectedClusterIdAtom)

  const editClusterForm = useForm<ClusterSchema>({
    resolver: yupResolver(clusterSchema)
  })

  const editClusterMutation = useEditClusterMutation()

  const getModulesAndGeneralPagesQuery = useQuery({
    queryKey: ['modules'],
    queryFn: () => getModulesAndGeneralPages()
  })

  const onEditClusterSubmit = async (data: ClusterSchema) => {
    try {
      if (!selectedClusterId) {
        return
      }

      await editClusterMutation.mutateAsync({ ...data, id: selectedClusterId })

      await queryClient.invalidateQueries()
      setEditClusterModalOpen(false)

      editClusterForm.reset({
        code: '',
        name: ''
      })
    } catch { }
  }

  useEffect(() => {
    if (editClusterModalOpen) {
      const relatedCluster = getModulesAndGeneralPagesQuery.data
        ?.filter(isModifiedModule)
        .flatMap(mod => mod.clusters)
        .find(c => c.id === selectedClusterId)

      if (!relatedCluster) {
        return
      }

      editClusterForm.reset({
        code: relatedCluster.code,
        name: relatedCluster.name
      })
    }
  }, [editClusterForm, editClusterModalOpen, getModulesAndGeneralPagesQuery.data, selectedClusterId])

  return (
    <Modal
      isOpen={editClusterModalOpen}
      onClose={() => setEditClusterModalOpen(false)}
      title="Edit Cluster"
      description='Edit Cluster for Manufacturing Data Platform'
      renderAction={false}
    >
      <form onSubmit={editClusterForm.handleSubmit(onEditClusterSubmit)}>
        <Box>
          <label htmlFor='code' style={{ display: 'block' }}>
            Cluster Code
          </label>
          <Controller
            control={editClusterForm.control}
            name='code'
            render={({ field: { value, onChange } }) => (
              <Input
                fullWidth
                id='code'
                defaultValue={value}
                onChange={onChange}
                placeholder='Cluster Code'
                style={{ marginTop: '4px' }}
              />
            )}
          />
          {editClusterForm.formState.errors.code && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {editClusterForm.formState.errors.code.message}
            </FormHelperText>
          )}
        </Box>
        <Box sx={{ marginTop: 5 }}>
          <label htmlFor='name' style={{ display: 'block' }}>
            Cluster Name
          </label>
          <Controller
            control={editClusterForm.control}
            name='name'
            render={({ field: { value, onChange } }) => (
              <Input
                fullWidth
                id='name'
                defaultValue={value}
                onChange={onChange}
                placeholder='Cluster Name'
                style={{ marginTop: '4px' }}
              />
            )}
          />
          {editClusterForm.formState.errors.name && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {editClusterForm.formState.errors.name.message}
            </FormHelperText>
          )}
        </Box>
        <Box mt={5} display="flex" justifyContent="end" alignItems="center">
          <Button
            variant='outlined'
            content='textOnly'
            text='Cancel'
            color='secondary'
            size='medium'
            onClick={() => setEditClusterModalOpen(false)}
          />
          <Button
            variant='contained'
            content='textOnly'
            text='Submit'
            size='medium'
            type='submit'
            disabled={editClusterForm.formState.isSubmitting}
            loading={editClusterForm.formState.isSubmitting}
          />
        </Box>
      </form>
    </Modal>
  )
}

export default EditCluster
