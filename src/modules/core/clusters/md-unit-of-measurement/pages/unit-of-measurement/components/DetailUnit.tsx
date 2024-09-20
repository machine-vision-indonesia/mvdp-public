import React, { Dispatch, SetStateAction } from 'react'
import { Stack } from '@mui/material'
import { Box, useTheme } from '@mui/material'
import { Button } from '@/components/atoms'
import { Badge } from '@/components/atoms/badge'
import { MvTypography } from '@/components/atoms/mv-typography'
import { ActionItem } from '@/components/templates/page-primary'
import { useGetUnit } from '../services/fetchUnitOfMeasurement.services'
import { useAtom } from 'jotai'

export const DetailUnit = ({
  setCurrentAction,
  setIsEditModalOpen,
  id,
  setId
}: {
  setCurrentAction: Dispatch<SetStateAction<ActionItem | null>>
  setIsEditModalOpen: any
  id: string
  setId: Dispatch<SetStateAction<string>>
}) => {
  const theme = useTheme()

  const currentUnit = useGetUnit({ id })

  const handleEdit = () => {
    setId(id)
    setCurrentAction(null)
    setIsEditModalOpen(true)
  }

  if (currentUnit.isSuccess)
    return (
      <Box mt={5}>
        <Box mt={5}>
          <MvTypography size='LABEL_MD_NORMAL' color={theme.colorToken.text.neutralInverted.disabled} typeSize='PX'>
            Code
          </MvTypography>
          <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
            {currentUnit.data?.data.code ?? '-'}
          </MvTypography>
        </Box>
        <Box mt={5}>
          <MvTypography size='LABEL_MD_NORMAL' color={theme.colorToken.text.neutralInverted.disabled} typeSize='PX'>
            Material Unit Name
          </MvTypography>
          <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
            {currentUnit.data?.data.name ?? '-'}
          </MvTypography>
        </Box>
        <Box mt={5}>
          <MvTypography size='LABEL_MD_NORMAL' color={theme.colorToken.text.neutralInverted.disabled} typeSize='PX'>
            Description
          </MvTypography>
          <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
            {currentUnit.data?.data.description ?? '-'}
          </MvTypography>
        </Box>
        <Box mt={5}>
          <MvTypography size='LABEL_MD_NORMAL' color={theme.colorToken.text.neutralInverted.disabled} typeSize='PX'>
            Data Status
          </MvTypography>
          <Badge
            color={currentUnit.data?.data.is_active ? 'success' : 'neutral'}
            label={currentUnit.data?.data.is_active ? 'Active' : 'Inactive'}
            size='medium'
            style='rect'
            isTransparent={true}
          />
          <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
            {currentUnit.data?.data.is_active
              ? 'This data record is active and accessible across application. It could be shown as a dropdown value, or else.'
              : 'This data record is inactive and no longer be accessible in dropdown menus or other parts of the application.'}
          </MvTypography>
        </Box>
        <Stack direction='row' mt={10} gap={3} justifyContent='end'>
          <Button
            content='textOnly'
            text='Cancel'
            variant='outlined'
            onClick={() => {
              setCurrentAction(null)
            }}
          />
          <Button content='textOnly' text='Edit' onClick={handleEdit} />
        </Stack>
      </Box>
    )
}
