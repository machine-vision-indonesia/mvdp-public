import { styled } from '@mui/material'

export const StyledWebcamVideo = styled('video')(({ theme }) => ({
  width: '100%',
  borderRadius: '8px',
  [theme.breakpoints.down('sm')]: {
    height: '100vh',
    objectFit: 'cover',
    borderRadius: '0'
  }
}))

export const StyledWebcamCanvas = styled('canvas')({
  display: 'none'
})

export const StyledPreviewImg = styled('img')(({ theme }) => ({
  width: '50%'
}))
