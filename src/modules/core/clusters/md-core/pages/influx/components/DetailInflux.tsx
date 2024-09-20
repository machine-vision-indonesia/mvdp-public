import React, { Dispatch, SetStateAction } from 'react'
import { Box, Stack, useTheme } from '@mui/material'
import { MvTypography } from '@/components/atoms/mv-typography'
import { ActionItem } from '@/components/templates/page-primary'
import { Button } from '@/components/atoms'

const DetailUnit = ({
  setCurrentAction,
  setIsEditModalOpen
}: { setCurrentAction: Dispatch<SetStateAction<ActionItem | null>>; setIsEditModalOpen: any }) => {
  const theme = useTheme()


  const handleEdit = () => {
    setCurrentAction(null)
    setIsEditModalOpen(true)
  }

  const data = {
    fields: [],
    filter: {},
    sort: []
  }

  return (
    <Box mt={5}>
      <Box mt={5} display="flex" gap={40}>
        <Box >
          <MvTypography size='LABEL_MD_NORMAL' color={theme.colorToken.text.neutralInverted.disabled} typeSize='PX'>
            Code
          </MvTypography>
          <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
            MU002
          </MvTypography>
        </Box>
        <Box>
          <MvTypography size='LABEL_MD_NORMAL' color={theme.colorToken.text.neutralInverted.disabled} typeSize='PX'>
            Collections
          </MvTypography>
          <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
            mt Event Log
          </MvTypography>
        </Box>
      </Box>

      <Box mt={5}>
        <MvTypography size='LABEL_MD_NORMAL' color={theme.colorToken.text.neutralInverted.disabled} typeSize='PX'>
          JSON property
        </MvTypography>
        <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
          <pre>{JSON.stringify(data, null, 2)}</pre>
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

export default DetailUnit
