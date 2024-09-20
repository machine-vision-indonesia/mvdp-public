import React from 'react'
import { UploadFile } from '@/components/molecules'
import { Controller } from 'react-hook-form'
import { MvTypography } from '@/components/atoms/mv-typography'

export const UserStepFour = ({ form }: { form: any }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        rowGap: '12px',
        columnGap: '20px',
        marginTop: '20px'
      }}
    >
      <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column' }}>
        <MvTypography size='LABEL_LG_BOLDEST' typeSize='PX' sx={{ my: 1 }}>
          Upload Foto Profile
        </MvTypography>
        <Controller
          name='photo'
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
            />
          )}
        />
      </div>
      <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column' }}>
        <MvTypography size='LABEL_LG_BOLDEST' typeSize='PX' sx={{ my: 1 }}>
          Upload Foto Header
        </MvTypography>
        <Controller
          name='cover'
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
            />
          )}
        />
      </div>
    </div>
  )
}
