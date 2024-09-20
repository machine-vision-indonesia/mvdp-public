import { Button, Textarea } from '@/components/atoms'
import { Input } from '@/components/atoms/input'
import { Modal } from '@/components/molecules'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, FormControlLabel, FormHelperText } from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { moduleSchema } from '../validations'
import { ModuleSchema } from '../types/ManageModulePage.types'
import { useGetModulesAndGeneralPagesQuery } from '../services/fetchManageModule.service'
import { queryClient } from '@/pages/_app'
import { useCreateModuleMutation } from '../services/actionAddManageModule.service'
import MuiCheckbox from '@mui/material/Checkbox'
import { ICONS } from '../constants'
import { MvTypography } from '@/components/atoms/mv-typography'
import Link from 'next/link'

const CreateModule = ({
  createModuleModalOpen,
  setCreateModuleModalOpen,
  setChooseAnotherIconModuleCreateChecked,
  chooseAnotherIconModuleCreateChecked
}: any) => {

  const createModuleForm = useForm<ModuleSchema>({
    resolver: yupResolver(moduleSchema),
    defaultValues: {
      icon: null
    }
  })
  const moduleIconCreate = createModuleForm.watch('icon', null)

  const getModulesAndGeneralPagesQuery = useGetModulesAndGeneralPagesQuery();
  const createModuleMutation = useCreateModuleMutation()


  const onCreateModuleSubmit = async (data: ModuleSchema) => {
    try {
      let maxModuleOrder = 0

      if (getModulesAndGeneralPagesQuery.data?.length) {
        maxModuleOrder = getModulesAndGeneralPagesQuery.data.reduce((prev, curr) =>
          curr.order > prev.order ? curr : prev
        ).order
      }

      await createModuleMutation.mutateAsync({
        ...data,
        order: maxModuleOrder ? maxModuleOrder + 1 : 1,
        status: 'published'
      })

      await queryClient.invalidateQueries()
      setCreateModuleModalOpen(false)

      createModuleForm.reset({
        code: '',
        name: '',
        description: '',
        icon: ''
      })

      setChooseAnotherIconModuleCreateChecked(false)
    } catch { }
  }

  return (
    <Modal
      isOpen={createModuleModalOpen}
      onClose={() => setCreateModuleModalOpen(false)}
      title='Create Module'
      description='Create Module for Manufacturing Data Platform'
      renderAction={false}
    >
      <form onSubmit={createModuleForm.handleSubmit(onCreateModuleSubmit)}>

        <Box>
          <label htmlFor='code' style={{ display: 'block' }}>
            Module Code
          </label>
          <Controller
            control={createModuleForm.control}
            name='code'
            render={({ field: { value, onChange } }) => (
              <Input
                fullWidth
                id='code'
                defaultValue={value}
                onChange={onChange}
                placeholder='Module Code'
                variant='filled'
                style={{ marginTop: '4px' }}
              />
            )}
          />
          {createModuleForm.formState.errors.code && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {createModuleForm.formState.errors.code.message}
            </FormHelperText>
          )}
        </Box>
        <Box sx={{ marginTop: 5 }}>
          <label htmlFor='name' style={{ display: 'block' }}>
            Module Name
          </label>
          <Controller
            control={createModuleForm.control}
            name='name'
            render={({ field: { value, onChange } }) => (
              <Input
                fullWidth
                id='name'
                defaultValue={value}
                onChange={onChange}
                placeholder='Module Name'
                variant='filled'
                style={{ marginTop: '4px' }}
              />
            )}
          />
          {createModuleForm.formState.errors.name && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {createModuleForm.formState.errors.name.message}
            </FormHelperText>
          )}
        </Box>
        <Box sx={{ marginTop: 5 }}>
          <label htmlFor='description' style={{ display: 'block' }}>
            Description
          </label>
          <Controller
            control={createModuleForm.control}
            name='description'
            render={({ field: { value, onChange } }) => (
              <Textarea
                id='description'
                defaultValue={value}
                onChange={onChange}
                placeholder='Module Description'
                style={{ marginTop: '4px' }}
              // fullWidth
              />
            )}
          />
          {createModuleForm.formState.errors.description && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {createModuleForm.formState.errors.description.message}
            </FormHelperText>
          )}
        </Box>
        <Box sx={{ marginTop: 5 }}>
          <label style={{ display: 'block' }}>Icon</label>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              maxHeight: 300,
              overflowY: 'auto',
              gap: 4,
              mt: 2
            }}
          >
            {ICONS.map(icon => (
              <Button
                key={icon}
                variant={moduleIconCreate === icon ? 'contained' : 'plain'}
                size='large'
                onClick={() => {
                  setChooseAnotherIconModuleCreateChecked(false)
                  createModuleForm.setValue('icon', icon)
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
                    createModuleForm.setValue('icon', '')
                  }

                  setChooseAnotherIconModuleCreateChecked(checked)
                }}
              />
            }
            label='I want to choose different icon'
            checked={chooseAnotherIconModuleCreateChecked}
          />

          {chooseAnotherIconModuleCreateChecked ? (
            <>
              <Controller
                control={createModuleForm.control}
                name='icon'
                render={({ field: { value, onChange } }) => (
                  <Input
                    fullWidth
                    defaultValue={value}
                    onChange={onChange}
                    placeholder='icon-prefix:icon-name'
                    variant='filled'
                    style={{ marginTop: '4px' }}
                  />
                )}
              />
              <MvTypography size="BODY_MD_NORMAL" typeSize='PX' sx={{ mt: 2 }}>
                You can find icon prefixes and names in{' '}
                <Link href='https://icon-sets.iconify.design' target='_blank'>
                  here
                </Link>
              </MvTypography>
            </>
          ) : null}
        </Box>

        <Box >
          <Button
            variant='outlined'
            content='textOnly'
            text='Cancel'
            size='medium'
            color='secondary'
            onClick={() => setCreateModuleModalOpen(false)}
          />
          <Button
            variant='contained'
            content='textOnly'
            text='Submit'
            size='medium'
            type='submit'
            disabled={createModuleForm.formState.isSubmitting}
            loading={createModuleForm.formState.isSubmitting}
          />
        </Box>
      </form>
    </Modal>

  )
}

export default CreateModule
