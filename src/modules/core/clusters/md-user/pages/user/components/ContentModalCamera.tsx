import { useState, useRef, useEffect } from 'react'
import { Box, Grid, IconButton, useTheme } from '@mui/material'
import { Icon } from '@iconify/react/dist/iconify.js'
import { StyledPreviewImg, StyledWebcamCanvas, StyledWebcamVideo } from '../styled/styled'
import { CircularProgress } from '@/components/atoms/circular-progress/CircularProgress'
import { Button } from '@/components/atoms'
import { ContentModalCameraProps } from '../types/ContentModalCamera'

export const ContentModalCamera: React.FC<ContentModalCameraProps> = ({ onSaveAsProfile }) => {
  const theme = useTheme()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const mediaStreamTrack = mediaStream?.getTracks()
  const isLiveMediaStream = mediaStreamTrack && mediaStreamTrack[0].readyState === 'live'

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user' // Request the front camera (selfie camera)
        }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setMediaStream(stream)
    } catch (error) {
      console.error('Error accessing webcam', error)
    }
  }

  const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        track.stop()
      })

      if (videoRef.current) {
        videoRef.current.srcObject = null // Remove the video source
      }

      setMediaStream(null)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      // Set canvas dimensions to match video stream
      if (context && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame onto canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Get image data URL from canvas
        const imageDataUrl = canvas.toDataURL('image/jpeg')

        // Set the captured image
        setCapturedImage(imageDataUrl)

        // Stop the webcam
        stopWebcam()

        // You can do something with the captured image here, like save it to state or send it to a server
      }
    }
  }

  const resetState = () => {
    stopWebcam() // Stop the webcam if it's active
    setCapturedImage(null) // Reset captured image
  }

  useEffect(() => {
    startWebcam()
  }, [])

  useEffect(() => {
    return () => {
      // Stop the webcam when the component unmounts
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [mediaStream])

  return (
    <Grid container sx={{ gap: 4, flexWrap: 'nowrap', mt: '20px' }}>
      <Grid
        item
        sx={{
          height: !isLiveMediaStream && !capturedImage ? '200px' : '',
          width: !captureImage ? '90%' : '100%',
          backgroundColor:
            !isLiveMediaStream && !capturedImage ? theme.colorToken.background.neutral.subtle : 'inherit',
          borderRadius: '8px'
        }}
      >
        {capturedImage ? (
          <Box>
            <Box
              sx={{
                height: '200px',
                width: '90%',
                position: 'absolute',
                backgroundColor: 'black'
              }}
            />
            <Grid container sx={{ position: 'relative', justifyContent: 'center' }}>
              <Box
                sx={{
                  height: '200px',
                  width: '50%',
                  position: 'absolute',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}
              />
              <Box
                sx={{
                  height: '200px',
                  width: '200px',
                  borderRadius: '100px',
                  position: 'absolute'
                }}
              />
              <img
                src={capturedImage}
                style={{
                  height: '200px',
                  width: '200px',
                  borderRadius: '50%',
                  position: 'absolute'
                }}
              />
              <StyledPreviewImg src={capturedImage} />
            </Grid>
            <Grid container sx={{ justifyContent: 'space-between', flexWrap: 'nowrap', mt: '20px' }}>
              <Grid item>
                <Button
                  variant='text'
                  content='iconText'
                  icon='octicon:undo-16'
                  text='Retake Photo'
                  onClick={() => {
                    resetState()
                    startWebcam()
                  }}
                />
              </Grid>
              <Grid item>
                <Button content='textOnly' text='Save as profile' onClick={() => onSaveAsProfile('photo')} />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <>
            {!isLiveMediaStream && (
              <Grid container sx={{ justifyContent: 'center', marginTop: '80px' }}>
                <CircularProgress />
              </Grid>
            )}
            <StyledWebcamVideo ref={videoRef} autoPlay playsInline muted />
            <StyledWebcamCanvas ref={canvasRef} />
          </>
        )}
      </Grid>
      <Grid
        item
        container
        sx={{
          display: !capturedImage ? 'flex' : 'none',
          flexDirection: 'column',
          width: '10%',
          justifyContent: 'space-around'
        }}
      >
        <Grid item>
          <IconButton
            sx={{
              border: `2px solid ${theme.colorToken.text.neutral.normal}`,
              color: theme.colorToken.text.neutral.normal
            }}
            onClick={captureImage}
          >
            <Icon icon='ph:camera' fontSize='24px' />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  )
}
