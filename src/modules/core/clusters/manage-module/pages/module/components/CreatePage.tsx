import { Modal } from '@/components/molecules'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ModifiedModule, ModifiedPage, PageSchema } from '../types/ManageModulePage.types'
import { yupResolver } from '@hookform/resolvers/yup'
import { pageSchema } from '../validations'
import { Button } from '@/components/atoms'
import { Input } from '@/components/atoms/input'
import { Autocomplete, Box, FormControlLabel, FormHelperText, Typography } from '@mui/material'

import { useGetModulesAndGeneralPagesQuery } from '../services/fetchManageModule.service'
import { useCreatePageMutation } from '../services/actionAddManageModule.service'
import { queryClient } from '@/pages/_app'
import { useUpdateMainPages } from '@/service/module/useUpdateMainPage'
import MuiCheckbox from '@mui/material/Checkbox'
import { ICONS } from '../constants'
import Link from 'next/link'
import { useGetProducts } from '@/service/module/useGetProducts'
import { isValidHttpUrl } from '@/utils/general'
import { useAtom } from 'jotai'
import { createPageModalOpenAtom, selectedClusterIdAtom } from '../atoms'

const isModifiedModule = (mod: ModifiedModule | ModifiedPage): mod is ModifiedModule => mod.additional_type === 'module'

const CreatePage = ({
  setChooseAnotherIconPageCreateChecked,
  chooseAnotherIconPageCreateChecked
}: any) => {
  const [createPageModalOpen, setCreatePageModalOpen] = useAtom(createPageModalOpenAtom)
  const [selectedClusterId] = useAtom(selectedClusterIdAtom)

  const createPageForm = useForm<PageSchema>({
    resolver: yupResolver(pageSchema),
    defaultValues: {
      is_external_src: false,
      is_main_page: false
    }
  })

  const pageIconCreate = createPageForm.watch('icon', null)

  const getModulesAndGeneralPagesQuery = useGetModulesAndGeneralPagesQuery()
  const createPageMutation = useCreatePageMutation();
  const updateMainPages = useUpdateMainPages();
  const products = useGetProducts()
  const productOptions =
    products.data?.data.map(product => ({
      id: product.id,
      label: product.name
    })) ?? []

  const onCreatePageSubmit = async (data: PageSchema) => {
    try {
      let maxPageOrder = 0

      if (selectedClusterId) {
        const relatedCluster = getModulesAndGeneralPagesQuery.data
          ?.filter(isModifiedModule)
          .flatMap(mod => mod.clusters)
          .find(cl => cl.id === selectedClusterId)

        if (!relatedCluster) {
          return
        }

        if (relatedCluster.pages.length) {
          maxPageOrder = relatedCluster.pages.reduce((prev, curr) => {
            return curr.order > prev.order ? curr : prev
          }).order
        }
      } else {

        const lastModule = getModulesAndGeneralPagesQuery.data?.reduce((prev, curr) => {
          return curr.order > prev.order ? curr : prev
        })

        if (!lastModule) {
          return
        }

        maxPageOrder = lastModule.order
      }

      const response = await createPageMutation.mutateAsync({
        is_external_src: data.is_external_src,
        code: data.code,
        name: data.name,
        type: data.type,
        url: data.url,
        icon: data.icon,
        products: data.products.map(product => ({
          product: product.id,
          status: 'published'
        })),
        cluster: selectedClusterId,
        order: maxPageOrder + 1,
        status: 'published'
      })

      if (data.is_main_page) {
        await updateMainPages.mutateAsync({
          productIds: data.products.map(product => product.id),
          pageId: response.data.data.id
        })
      }

      await queryClient.invalidateQueries()
      setCreatePageModalOpen(false)

      createPageForm.reset({
        code: '',
        name: '',
        icon: null,
        type: undefined,
        products: [],
        url: '',
        is_external_src: false,
        is_main_page: false
      })

      setChooseAnotherIconPageCreateChecked(false)
    } catch {
    }
  }
  return (
    <Modal
      isOpen={createPageModalOpen}
      onClose={() => setCreatePageModalOpen(false)}
      title='Create Page'
      description='Create Page for Manufacturing Data Platform'
      maxWidth='lg'
      scroll='body'
      renderAction={false}
    >
      <form onSubmit={createPageForm.handleSubmit(onCreatePageSubmit)}>
        <Box mt={6}>
          <label htmlFor='code' style={{ display: 'block' }}>
            Page Code
          </label>
          <Controller
            control={createPageForm.control}
            name='code'
            render={({ field: { value, onChange } }) => (
              <Input
                fullWidth
                id='code'
                defaultValue={value}
                onChange={onChange}
                placeholder='Page Code'
                variant='filled'
                style={{ marginTop: '4px' }}
              />
            )}
          />
          {createPageForm.formState.errors.code && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {createPageForm.formState.errors.code.message}
            </FormHelperText>
          )}
        </Box>
        <Box sx={{ marginTop: 5 }}>
          <label htmlFor='name' style={{ display: 'block' }}>
            Display Name
          </label>
          <Controller
            control={createPageForm.control}
            name='name'
            render={({ field: { value, onChange } }) => (
              <Input
                fullWidth
                id='name'
                defaultValue={value}
                onChange={onChange}
                placeholder='Display Name'
                variant='filled'
                style={{ marginTop: '4px' }}
              />
            )}
          />
          {createPageForm.formState.errors.name && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {createPageForm.formState.errors.name.message}
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
                variant={pageIconCreate === icon ? 'contained' : 'outlined'}
                size='large'
                onClick={() => {
                  setChooseAnotherIconPageCreateChecked(false)
                  createPageForm.setValue('icon', icon)
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
                    createPageForm.setValue('icon', '')
                  }

                  setChooseAnotherIconPageCreateChecked(checked)
                }}
              />
            }
            label='I want to choose different icon'
            checked={chooseAnotherIconPageCreateChecked}
          />

          {chooseAnotherIconPageCreateChecked ? (
            <>
              <Controller
                control={createPageForm.control}
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
              <Typography variant='body2' sx={{ mt: 2 }}>
                You can find icon prefixes and names in{' '}
                <Link href='https://icon-sets.iconify.design' target='_blank'>
                  here
                </Link>
              </Typography>
            </>
          ) : null}
        </Box>
        <Box sx={{ marginTop: 5 }}>
          <label htmlFor='type' style={{ display: 'block' }}>
            Type
          </label>
          <Controller
            control={createPageForm.control}
            name='type'
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                id='type'
                options={['page', 'sub-page']}
                value={value}
                onChange={(_, selectedValue) => onChange(selectedValue)}
                style={{ marginTop: '4px' }}
                renderInput={params => <Input {...params} variant='filled' placeholder='Type' />}
              />
            )}
          />
          {createPageForm.formState.errors.type && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {createPageForm.formState.errors.type.message}
            </FormHelperText>
          )}
        </Box>

        <Controller
          control={createPageForm.control}
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
                renderInput={params => <Input {...params} variant='filled' placeholder='Products' />}
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
            control={createPageForm.control}
            name='url'
            render={({ field: { value, onChange } }) => (
              <>
                <Input
                  fullWidth
                  id='url'
                  defaultValue={value}
                  onChange={onChange}
                  placeholder='Link'
                  variant='filled'
                  style={{ marginTop: '4px' }}
                />

                {value && isValidHttpUrl(value) ? (
                  <iframe src={value} style={{ marginTop: '10px', width: '100%', height: '300px', border: 0 }} />
                ) : null}
              </>
            )}
          />
          {createPageForm.formState.errors.url && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {createPageForm.formState.errors.url.message}
            </FormHelperText>
          )}
        </Box>

        <Box sx={{ marginTop: 5 }}>
          <Controller
            control={createPageForm.control}
            name='is_external_src'
            render={({ field }) => (
              <FormControlLabel
                control={
                  <MuiCheckbox {...field} checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                }
                label='Use External Source'
              />
            )}
          />
        </Box>

        <Box>
          <Controller
            control={createPageForm.control}
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
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant='outlined'
            content='textOnly'
            text='Cancel'
            color='secondary'
            size='medium'
            onClick={() => setCreatePageModalOpen(false)}
          />
          <Button
            variant='contained'
            content='textOnly'
            text='Submit'
            size='medium'
            type='submit'
            disabled={createPageForm.formState.isSubmitting}
            loading={createPageForm.formState.isSubmitting}
          />
        </Box>
      </form>
    </Modal >
  )
}

export default CreatePage
