import { Button } from '@/components/atoms'
import { MvTypography } from '@/components/atoms/mv-typography'
import { UploadFile } from '@/components/molecules'
import { Box, LinearProgress, Stack } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form'
import { FormImportFileProps } from '../types/FormInputFile.type'

export function FormImportFile({
  form,
  processingFile,
  handleProcessFile,
  uploadProgress,
  onUpload
}: FormImportFileProps) {
  return (
    <form onSubmit={form.handleSubmit(handleProcessFile)}>
      {!processingFile ? (
        <Controller
          name='file'
          control={form.control}
          render={({ field: { onChange, ref } }) => (
            <UploadFile
              {...ref}
              onChange={(event: any) => {
                const files = event.target.files
                if (files && files.length > 0) {
                  onChange(files[0])
                }
              }}
              variant='single'
              type='dragndrop'
              helperText
            />
          )}
        />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant='determinate' value={uploadProgress} sx={{ height: 8 }} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <MvTypography size='BODY_MD_NORMAL' typeSize='PX'>{`${Math.round(uploadProgress)}%`}</MvTypography>
          </Box>
        </Box>
      )}
      <Stack direction='row' gap={1} sx={{ justifyContent: 'flex-end', marginTop: 4 }}>
        <Button variant='outlined' content='textOnly' text='Cancel' onClick={onUpload} />
        <Button content='textOnly' text='Process File' type='submit' disabled={!form.watch('file') || processingFile} />
      </Stack>
    </form>
  )
}
