import { MvTypography } from '@/components/atoms/mv-typography'
import { SectionGroup } from '@/components/molecules/section-group'
import { FormControlLabel, RadioGroup, useTheme } from '@mui/material'
import React from 'react'
import { SectionProps } from '../../job-level/types/ManageJobLevelPage.types'
import { Field } from '@/components/molecules/field'
import { CHOOSE_ROLE_RADIOS } from '../constants/ManageJobFunctionPage.constants'
import { Radio } from '@mui/material'

const InfoRole: React.FC<SectionProps> = ({ title, fields, renderEditButton }) => {
  const theme = useTheme()
  return (
    <SectionGroup title={title} color='default' squareRightChildrenRight={renderEditButton}>
      <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: '12px' }}>
        <Field size='small' label='Choose Role' isRequired>
          <RadioGroup defaultValue={'create'} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            {CHOOSE_ROLE_RADIOS.map(radio => (
              <FormControlLabel
                key={radio.name}
                disabled
                control={<Radio value={radio.name} name={radio.name} />}
                label={radio.label}
              />
            ))}
          </RadioGroup>
        </Field>
        {fields.map((field, index) => (
          <div key={index} style={{ flexBasis: '50%' }}>
            <MvTypography size='LABEL_MD_NORMAL' color={theme.colorToken.text.neutralInverted.disabled} typeSize='PX'>
              {field.label} :
            </MvTypography>
            <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
              {Array.isArray(field.value) ? field.value.join(', ') : field.value || '-'}
            </MvTypography>
          </div>
        ))}
      </div>
    </SectionGroup>
  )
}

export default InfoRole
