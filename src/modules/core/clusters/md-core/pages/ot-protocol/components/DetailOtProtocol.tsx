import React, { Dispatch, SetStateAction } from 'react'
import { Box, Stack, useTheme } from '@mui/material'
import { MvTypography } from '@/components/atoms/mv-typography'
import { ActionItem } from '@/components/templates/page-primary'
import { Button } from '@/components/atoms'
import { fetchDetailOtProtocol } from '../services/fetchDetailOtProtocol.services'

export const DetailOtProtocol = ({
  setCurrentAction,
  setIsEditModalOpen,
  id,
  setId
}: {
  id: string
  setId: any
  setCurrentAction: Dispatch<SetStateAction<ActionItem | null>>
  setIsEditModalOpen: any
}) => {
  const theme = useTheme()

  const handleEdit = () => {
    setCurrentAction(null)
    setIsEditModalOpen(true)
    setId(id)
  }

  const otProtocol = fetchDetailOtProtocol({ id: id as string })

  return (
    <Box mt={5}>
      <Box mt={5}>
        <MvTypography size='LABEL_MD_NORMAL' color={theme.colorToken.text.neutralInverted.disabled} typeSize='PX'>
          Code
        </MvTypography>
        <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
          {otProtocol?.data?.data?.code}
        </MvTypography>
      </Box>

      <Box mt={5}>
        <MvTypography size='LABEL_MD_NORMAL' color={theme.colorToken.text.neutralInverted.disabled} typeSize='PX'>
          JSON property
        </MvTypography>
        <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
          <pre>{JSON.stringify(otProtocol?.data?.data?.json_property, null, 2)}</pre>
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
