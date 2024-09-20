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
import { ICONS } from '../constants';
import { ModifiedModule, ModifiedPage, ModuleSchema } from '../types/ManageModulePage.types';
import { useEditModuleMutation } from '../services/actionUpdateManageModule.service';
import { queryClient } from '@/pages/_app';
import { yupResolver } from '@hookform/resolvers/yup';
import { moduleSchema } from '../validations';
import { Modal } from '@/components/molecules';
import { getModulesAndGeneralPages } from '../services/fetchManageModule.service';
import { useQuery } from '@tanstack/react-query';
import { MvTypography } from '@/components/atoms/mv-typography';

interface EditModuleModalProps {
  editModuleModalOpen: boolean;
  setEditModuleModalOpen: (open: boolean) => void;
  setChooseAnotherIconModuleEditChecked: (checked: boolean) => void;
  chooseAnotherIconModuleEditChecked: boolean;
  selectedModuleId: any
}

const isModifiedModule = (mod: ModifiedModule | ModifiedPage): mod is ModifiedModule => mod.additional_type === 'module'

const EditModuleModal: React.FC<EditModuleModalProps> = ({
  editModuleModalOpen,
  setEditModuleModalOpen,
  setChooseAnotherIconModuleEditChecked,
  chooseAnotherIconModuleEditChecked,
  selectedModuleId
}) => {

  const editModuleForm = useForm<ModuleSchema>({
    resolver: yupResolver(moduleSchema),
    defaultValues: {
      icon: null
    }
  })

  const moduleIconEdit = editModuleForm.watch('icon', null)

  const editModuleMutation = useEditModuleMutation()
  const getModulesAndGeneralPagesQuery = useQuery({
    queryKey: ['modules'],
    queryFn: () => getModulesAndGeneralPages()
  })

  const onEditModuleSubmit = async (data: ModuleSchema) => {
    try {
      if (!selectedModuleId) {
        return
      }

      await editModuleMutation.mutateAsync({ ...data, id: selectedModuleId })

      await queryClient.invalidateQueries()
      setEditModuleModalOpen(false)

      editModuleForm.reset({
        code: '',
        name: '',
        description: '',
        icon: ''
      })

      setChooseAnotherIconModuleEditChecked(false)
    } catch { }
  }

  useEffect(() => {
    if (editModuleModalOpen) {
      const relatedModule = getModulesAndGeneralPagesQuery.data
        ?.filter(isModifiedModule)
        .find(m => m.id === selectedModuleId)

      if (!relatedModule) {
        return
      }

      editModuleForm.reset({
        code: relatedModule.code,
        name: relatedModule.name,
        description: relatedModule.description,
        icon: relatedModule.icon
      })

      if (relatedModule.icon && !ICONS.includes(relatedModule.icon)) {
        setChooseAnotherIconModuleEditChecked(true)
      }
    }
  }, [editModuleForm, editModuleModalOpen, getModulesAndGeneralPagesQuery.data, selectedModuleId])


  return (
    <Modal
      isOpen={editModuleModalOpen}
      title="Edit Module"
      description="Edit Module for Manufacturing Data Platform"
      onClose={() => setEditModuleModalOpen(false)}
      renderAction={false}
    >
      <Box
        component='form'
        onSubmit={editModuleForm.handleSubmit(onEditModuleSubmit)}
        sx={{
          width: '90%',
          maxWidth: 600,
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 1,
          boxShadow: 24,
          mt: 5
        }}
      >
        <Box>
          <label htmlFor='code' style={{ display: 'block' }}>
            Module Code
          </label>
          <Controller
            control={editModuleForm.control}
            name='code'
            render={({ field: { value, onChange } }) => (
              <Input
                fullWidth
                id='code'
                value={value}
                onChange={onChange}
                placeholder='Module Code'
                // variant='filled'
                sx={{ mt: 1 }}
              />
            )}
          />
          {editModuleForm.formState.errors.code && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {editModuleForm.formState.errors.code.message}
            </FormHelperText>
          )}
        </Box>
        <Box sx={{ mt: 5 }}>
          <label htmlFor='name' style={{ display: 'block' }}>
            Module Name
          </label>
          <Controller
            control={editModuleForm.control}
            name='name'
            render={({ field: { value, onChange } }) => (
              <Input
                fullWidth
                id='name'
                value={value}
                onChange={onChange}
                placeholder='Module Name'
                // variant='filled'
                sx={{ mt: 1 }}
              />
            )}
          />
          {editModuleForm.formState.errors.name && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {editModuleForm.formState.errors.name.message}
            </FormHelperText>
          )}
        </Box>
        <Box sx={{ mt: 5 }}>
          <label htmlFor='description' style={{ display: 'block' }}>
            Description
          </label>
          <Controller
            control={editModuleForm.control}
            name='description'
            render={({ field: { value, onChange } }) => (
              <Textarea
                id='description'
                value={value}
                onChange={onChange}
                placeholder='Module Description'
              // sx={{ mt: 1 }}
              />
            )}
          />
          {editModuleForm.formState.errors.description && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {editModuleForm.formState.errors.description.message}
            </FormHelperText>
          )}
        </Box>
        <Box sx={{ mt: 5 }}>
          <label style={{ display: 'block' }}>Icon</label>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              maxHeight: 300,
              overflowY: 'auto',
              gap: 4,
              mt: 2,
            }}
          >
            {ICONS.map(icon => (
              <Button
                key={icon}
                variant={moduleIconEdit === icon ? 'contained' : 'outlined'}
                size='large'
                onClick={() => {
                  setChooseAnotherIconModuleEditChecked(false);
                  editModuleForm.setValue('icon', icon);
                }}
                content='iconOnly'
                icon={icon}
              />
            ))}
          </Box>
          <FormControlLabel
            control={
              <MuiCheckbox
                onChange={(_, checked) => {
                  if (checked) {
                    editModuleForm.setValue('icon', '');
                  }
                  setChooseAnotherIconModuleEditChecked(checked);
                }}
              />
            }
            label='I want to choose a different icon'
            checked={chooseAnotherIconModuleEditChecked}
          />
          {chooseAnotherIconModuleEditChecked && (
            <>
              <Controller
                control={editModuleForm.control}
                name='icon'
                render={({ field: { value, onChange } }) => (
                  <Input
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder='icon-prefix:icon-name'
                    sx={{ mt: 1 }}
                  />
                )}
              />
              <MvTypography size="BODY_MD_NORMAL" typeSize='PX' sx={{ mt: 2 }}>
                You can find icon prefixes and names{' '}
                <Link href='https://icon-sets.iconify.design' target='_blank'>
                  here
                </Link>
              </MvTypography>
            </>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant='outlined'
            type="button"
            content='textOnly'
            size='medium'
            color='secondary'
            onClick={() => setEditModuleModalOpen(false)}
            sx={{ mr: 2 }}
            text='Cancel'
          />
          <Button
            variant='contained'
            size='medium'
            type='submit'
            disabled={editModuleForm.formState.isSubmitting}
            sx={{ ml: 2 }}
            text="Submit"
            content="textOnly"
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default EditModuleModal;
