import { styled, RadioProps } from '@mui/material';
import { Palette } from '@mui/material/styles';

interface CustomRadioProps extends RadioProps {
  hover?: boolean;
  colorHover?: string;
  colorPalette?: Palette;
}

export const CustomRadioIcon = styled('span')<CustomRadioProps>(({ theme, colorHover, hover }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,
  boxShadow: 'inset 0 0 0 2px rgba(16,22,26,.2), inset 0 -2px 0 rgba(16,22,26,.1)',
  transition: hover ? 'box-shadow 0.1s ease' : 'none',
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
    cursor: 'not-allowed',
  },
  'input:not(:disabled):hover ~ &': {
    border: hover ? `2px solid ${colorHover}` : '2px solid rgba(16,22,26,.2)',
    boxShadow: 'none',
  },
  'input:checked ~ &': {
    backgroundColor: colorHover,
  },
  'input:checked:disabled ~ &': {
    backgroundColor: theme.colorToken.background.primary.hover,
    opacity: 0.5,
  },
}))

export const CustomRadioCheckedIcon = styled(CustomRadioIcon)<CustomRadioProps>(({ theme,colorHover, colorPalette }) => ({
  boxShadow: 'none',
  backgroundColor: colorHover,
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&::before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: `radial-gradient(${colorPalette?.primary.contrastText},${colorPalette?.primary.contrastText} 28%,transparent 32%)`,
    content: '""',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: colorHover,
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  'input:not(:disabled):hover ~ &': {
    boxShadow: 'none',
    border: '0px',
  },
  'input:checked ~ &': {
    backgroundColor: colorHover,
  },
  'input:checked:disabled ~ &': {
    backgroundColor: theme.colorToken.background.primary.hover,
    opacity: 0.5,
  },
}))
