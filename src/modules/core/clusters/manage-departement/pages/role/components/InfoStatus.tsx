import React from 'react'
import { Box, useTheme } from '@mui/material'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Badge } from '@/components/atoms/badge'
import { INFOMESSAGE } from '../constant'

const InfoStatus: React.FC<{ statusActive: boolean }> = ({ statusActive }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        padding: 4,
        width: '100%',
        borderRadius: '6px',
        border: '1px solid',
        borderColor: theme.colorToken.border.neutral.normal
      }}
    >
      <Box width={'min-content'}>
        <Badge
          color={statusActive ? 'success' : 'danger'}
          label={statusActive ? 'Active' : 'InActive'}
          isTransparent={true}
          size='medium'
          style='rect'
        />
      </Box>
      <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
        {statusActive ? INFOMESSAGE['active'] : INFOMESSAGE['inActive']}
      </MvTypography>
    </Box>
  )
}

export default InfoStatus
