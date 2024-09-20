import React from 'react'
import {
  Box,
  Typography,
  IconButton,
  Input,
  FormHelperText,
  FormControlLabel,
  Checkbox as MuiCheckbox,
  Link,
  Autocomplete,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Textarea } from '@/components/atoms';
import { ICONS } from '../constants';
import { ClusterSchema, ModifiedModule, ModifiedPage, ModuleSchema } from '../types/ManageModulePage.types';
import { useEditClusterMutation, useEditModuleMutation } from '../services/actionUpdateManageModule.service';
import { queryClient } from '@/pages/_app';
import { yupResolver } from '@hookform/resolvers/yup';
import { clusterSchema, moduleSchema } from '../validations';
import { Modal } from '@/components/molecules';
import { useAtom } from 'jotai';
import { getModulesAndGeneralPages } from '../services/fetchManageModule.service';
import { useQuery } from '@tanstack/react-query';
import { Chip } from '@/components/atoms/chip';
import { isValidHttpUrl } from '@/utils/general';
import { detailPageModalOpenAtom, editClusterModalOpenAtom, selectedPageIdAtom } from '../atoms';
import { MvTypography } from '@/components/atoms/mv-typography';

const isModifiedModule = (mod: ModifiedModule | ModifiedPage): mod is ModifiedModule => mod.additional_type === 'module'
const isModifiedPage = (mod: ModifiedModule | ModifiedPage): mod is ModifiedPage => mod.additional_type === 'page'

const DetailPageModal = () => {
  const [detailPageModalOpen, setDetailPageModalOpen] = useAtom(detailPageModalOpenAtom)
  const [selectedPageId] = useAtom(selectedPageIdAtom)
  const [_, setEditClusterModalOpen] = useAtom(editClusterModalOpenAtom)

  const getModulesAndGeneralPagesQuery = useQuery({
    queryKey: ['modules'],
    queryFn: () => getModulesAndGeneralPages()
  })

  const selectedPage = selectedPageId
    ? [
      ...(getModulesAndGeneralPagesQuery.data
        ?.filter(isModifiedModule)
        .flatMap(mod => mod.clusters)
        .flatMap(cl => cl.pages) ?? []),
      ...(getModulesAndGeneralPagesQuery.data?.filter(isModifiedPage) ?? [])
    ].find(p => p.id === selectedPageId)
    : undefined

  return (
    <Modal
      isOpen={detailPageModalOpen}
      onClose={() => setDetailPageModalOpen(false)}
      title='Page Detail'
      renderAction={false}
    >
      {/* <Box sx={{ mb: 8, textAlign: 'center' }}>
        <MvTypography typeSize='PX' size='BODY_MD_NORMAL' sx={{ mb: 3 }}>
          Page Detail
        </MvTypography>
      </Box> */}
      <Box>
        <label htmlFor='code' style={{ display: 'block' }}>
          Page Code
        </label>
        <Input
          fullWidth
          id='code'
          value={selectedPage?.code}
          disabled
          placeholder='Page Code'
          style={{ marginTop: '4px' }}
        />
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <label htmlFor='name' style={{ display: 'block' }}>
          Display Name
        </label>
        <Input
          fullWidth
          id='name'
          value={selectedPage?.name}
          disabled
          placeholder='Display Name'
          style={{ marginTop: '4px' }}
        />
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <label style={{ display: 'block' }}>Icon</label>
        {selectedPage?.icon ? (
          <Box sx={{ mt: 2 }}>
            <Icon icon={selectedPage.icon} fontSize='1.75rem' />
          </Box>
        ) : null}
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <label htmlFor='type' style={{ display: 'block' }}>
          Type
        </label>

        <Autocomplete
          id='type'
          options={['page', 'sub-page']}
          value={selectedPage?.type}
          style={{ marginTop: '4px' }}
          disabled
          renderInput={params => <Input {...params} placeholder='Type' />}
        />
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <label htmlFor='products' style={{ display: 'block' }}>
          Products
        </label>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', columnGap: 1 }}>
          {selectedPage
            ? selectedPage.products.map(product => (
              <Chip key={product.id} label={product.product.name} onClick={() => { }} />
            ))
            : null}
        </Box>
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <label htmlFor='url' style={{ display: 'block' }}>
          Link (Next.js pathname / URL)
        </label>
        <Input
          fullWidth
          id='url'
          value={selectedPage?.url}
          disabled
          placeholder='Link'
          style={{ marginTop: '4px' }}
        />

        {selectedPage?.url && isValidHttpUrl(selectedPage.url) ? (
          <iframe src={selectedPage.url} style={{ marginTop: '10px', width: '100%', height: '300px', border: 0 }} />
        ) : null}
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <FormControlLabel
          disabled
          control={<MuiCheckbox />}
          checked={selectedPage?.is_external_src}
          label='Use External Source'
        />
      </Box>

      <Box>
        <FormControlLabel
          disabled
          control={<MuiCheckbox />}
          checked={Boolean(selectedPage?.products.map(p => p.product.main_page).find(p => p === selectedPageId))}
          label='Set as the main page for the selected products'
        />
      </Box>


    </Modal>
  )
}

export default DetailPageModal
