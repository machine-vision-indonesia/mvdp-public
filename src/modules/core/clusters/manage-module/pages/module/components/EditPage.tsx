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
import { ModifiedModule, ModifiedPage, ModuleSchema, PageSchema } from '../types/ManageModulePage.types';
import { useEditModuleMutation } from '../services/actionUpdateManageModule.service';
import { queryClient } from '@/pages/_app';
import { yupResolver } from '@hookform/resolvers/yup';
import { moduleSchema, pageSchema } from '../validations';
import { Modal } from '@/components/molecules';
import { Autocomplete } from '@mui/material';
import { isValidHttpUrl } from '@/utils/general';
import { useGetProducts } from '@/service/module/useGetProducts';
import { useQuery } from '@tanstack/react-query';
import { getModulesAndGeneralPages, useGetModulesAndGeneralPagesQuery } from '../services/fetchManageModule.service';
import { selectedPageIdAtom } from '../atoms';
import { useAtom } from 'jotai';
import { MvTypography } from '@/components/atoms/mv-typography';

const isModifiedModule = (mod: ModifiedModule | ModifiedPage): mod is ModifiedModule => mod.additional_type === 'module'
const isModifiedPage = (mod: ModifiedModule | ModifiedPage): mod is ModifiedPage => mod.additional_type === 'page'

const EditPage = ({ editPageModalOpen, setEditPageModalOpen, chooseAnotherIconPageEditChecked, setChooseAnotherIconPageEditChecked }: any) => {
  const [selectedPageId] = useAtom(selectedPageIdAtom)

  const editPageForm = useForm<PageSchema>({
    resolver: yupResolver(pageSchema),
    defaultValues: {
      is_external_src: false
    }
  })
  const pageIconEdit = editPageForm.watch('icon', null)


  const products = useGetProducts()
  const getModulesAndGeneralPagesQuery = useGetModulesAndGeneralPagesQuery()

  const productOptions =
    products.data?.data.map(product => ({
      id: product.id,
      label: product.name
    })) ?? []


  useEffect(() => {
    if (editPageModalOpen) {
      const pages = [
        ...(getModulesAndGeneralPagesQuery.data
          ?.filter(isModifiedModule)
          .flatMap(mod => mod.clusters)
          .flatMap(cl => cl.pages) ?? []),
        ...(getModulesAndGeneralPagesQuery.data?.filter(isModifiedPage) ?? [])
      ]

      const relatedPage = pages.find(p => p.id === selectedPageId)

      if (!relatedPage) {
        return
      }

      editPageForm.reset({
        code: relatedPage.code,
        name: relatedPage.name,
        icon: relatedPage.icon,
        type: relatedPage.type ?? undefined,
        products: relatedPage.products.map(p => ({ id: p.product.id, label: p.product.name })),
        url: relatedPage.url,
        is_external_src: relatedPage.is_external_src,
        is_main_page: Boolean(relatedPage.products.map(p => p.product.main_page).find(p => p === selectedPageId))
      })

      if (relatedPage.icon && !ICONS.includes(relatedPage.icon)) {
        setChooseAnotherIconPageEditChecked(true)
      }
    }
  }, [editPageForm, editPageModalOpen, getModulesAndGeneralPagesQuery.data, selectedPageId])


  return (
    <Modal
      title="Edit Page"
      description='Edit Page for Manufacturing Data Platform'
      onClose={() => setEditPageModalOpen(false)}
      isOpen={editPageModalOpen}
      renderAction={false}
    >

      <Box>
        <label htmlFor='code' style={{ display: 'block' }}>
          Page Code
        </label>
        <Controller
          control={editPageForm.control}
          name='code'
          render={({ field: { value, onChange } }) => (
            <Input
              fullWidth
              id='code'
              defaultValue={value}
              onChange={onChange}
              placeholder='Page Code'
              style={{ marginTop: '4px' }}
            />
          )}
        />
        {editPageForm.formState.errors.code && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {editPageForm.formState.errors.code.message}
          </FormHelperText>
        )}
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <label htmlFor='name' style={{ display: 'block' }}>
          Display Name
        </label>
        <Controller
          control={editPageForm.control}
          name='name'
          render={({ field: { value, onChange } }) => (
            <Input
              fullWidth
              id='name'
              defaultValue={value}
              onChange={onChange}
              placeholder='Display Name'
              style={{ marginTop: '4px' }}
            />
          )}
        />
        {editPageForm.formState.errors.name && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {editPageForm.formState.errors.name.message}
          </FormHelperText>
        )}
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <label style={{ display: 'block' }}>Menu Icon</label>
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
              variant={pageIconEdit === icon ? 'contained' : 'outlined'}
              size='large'
              onClick={() => {
                setChooseAnotherIconPageEditChecked(false)
                editPageForm.setValue('icon', icon)
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
                  editPageForm.setValue('icon', '')
                }

                setChooseAnotherIconPageEditChecked(checked)
              }}
            />
          }
          label='I want to choose different icon'
          checked={chooseAnotherIconPageEditChecked}
        />

        {chooseAnotherIconPageEditChecked ? (
          <>
            <Controller
              control={editPageForm.control}
              name='icon'
              render={({ field: { value, onChange } }) => (
                <Input
                  fullWidth
                  defaultValue={value}
                  onChange={onChange}
                  placeholder='icon-prefix:icon-name'
                  style={{ marginTop: '4px' }}
                />
              )}
            />
            <MvTypography typeSize='PX' size='BODY_MD_NORMAL' sx={{ mt: 2 }}>
              You can find icon prefixes and names in{' '}
              <Link href='https://icon-sets.iconify.design' target='_blank'>
                here
              </Link>
            </MvTypography>
          </>
        ) : null}
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <label htmlFor='type' style={{ display: 'block' }}>
          Type
        </label>
        <Controller
          control={editPageForm.control}
          name='type'
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              id='type'
              options={['page', 'sub-page']}
              value={value}
              onChange={(_, selectedValue) => onChange(selectedValue)}
              style={{ marginTop: '4px' }}
              renderInput={params => <Input {...params} placeholder='Type' />}
            />
          )}
        />
        {editPageForm.formState.errors.type && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {editPageForm.formState.errors.type.message}
          </FormHelperText>
        )}
      </Box>

      <Controller
        control={editPageForm.control}
        name='products'
        defaultValue={[]}
        render={({ field: { onChange, ...restField }, fieldState }) => (
          <Box sx={{ marginTop: 5 }}>
            <label htmlFor={restField.name} style={{ display: 'block' }}>
              Products
            </label>

            <Autocomplete
              multiple
              loading={products.isPending}
              options={productOptions}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              style={{ marginTop: '4px' }}
              renderInput={params => <Input {...params} placeholder='Products' />}
              id={restField.name}
              {...restField}
              onChange={(_, selectedValue) => onChange(selectedValue)}
            />

            {fieldState.invalid ? (
              <FormHelperText sx={{ color: 'error.main' }}>{fieldState.error?.message}</FormHelperText>
            ) : null}
          </Box>
        )}
      />

      <Box sx={{ marginTop: 5 }}>
        <label htmlFor='url' style={{ display: 'block' }}>
          Link (Next.js pathname / URL)
        </label>
        <Controller
          control={editPageForm.control}
          name='url'
          render={({ field: { value, onChange } }) => (
            <>
              <Input
                fullWidth
                id='url'
                defaultValue={value}
                onChange={onChange}
                placeholder='Link'
                style={{ marginTop: '4px' }}
              />

              {value && isValidHttpUrl(value) ? (
                <iframe src={value} style={{ marginTop: '10px', width: '100%', height: '300px', border: 0 }} />
              ) : null}
            </>
          )}
        />
        {editPageForm.formState.errors.url && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {editPageForm.formState.errors.url.message}
          </FormHelperText>
        )}
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <Controller
          control={editPageForm.control}
          name='is_external_src'
          render={({ field }) => (
            <>
              <FormControlLabel
                control={
                  <MuiCheckbox
                    {...field}
                    checked={field.value}
                    onChange={e => field.onChange(e.target.checked)}
                  />
                }
                label='Use External Source'
              />
            </>
          )}
        />
      </Box>

      <Box>
        <Controller
          control={editPageForm.control}
          name='is_main_page'
          render={({ field }) => (
            <FormControlLabel
              control={
                <MuiCheckbox {...field} checked={field.value} onChange={e => field.onChange(e.target.checked)} />
              }
              label='Set as the main page for the selected products'
            />
          )}
        />
      </Box>
      <Box display="flex" justifyContent="end" alignItems="center" gap={3}>
        <Button
          variant='outlined'
          content='textOnly'
          text='Cancel'
          color='secondary'
          size='medium'
          onClick={() => setEditPageModalOpen(false)}
        />
        <Button
          variant='contained'
          content='textOnly'
          text='Submit'
          type='submit'
          size='medium'
          disabled={editPageForm.formState.isSubmitting}
          loading={editPageForm.formState.isSubmitting}
        />
      </Box>
    </Modal>
  )
}

export default EditPage
