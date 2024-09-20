import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { Grid, Stack, useTheme } from '@mui/material'
import { userAlertAtom } from '@/components/complexes/user/atoms'
import { ActionItem, PagePrimary, ActionButton } from '@/components/templates/page-primary/index'
import { getListShiftService } from '../services/fetchListShift.service'
import { GetTableShiftResponse } from '../types/PageShift.type'
import { Badge } from '@/components/atoms/badge'
import { FormAddShift } from './FormAddShift'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Breadcrumbs } from '@/components/atoms/breadcrumbs'
// import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'

import NextLink from 'next/link'
import { Link } from '@mui/material'
import { Button } from '@/components/atoms'
import { shiftAlertAtom } from '../store/shiftAlertAtom'
import { getDetailShiftService } from '../services/fetchDetailShift.service'
import { useParams } from 'next/navigation'
import { SectionGroup } from '@/components/molecules/section-group'
import { CircularProgress } from '@/components/atoms/circular-progress/CircularProgress'
import { Accordion } from '@/components/molecules/accordion'

export const PageDetailShift = () => {
  const { id: shiftId } = useParams()

  const [userAlert, setUserAlert] = useAtom(shiftAlertAtom)
  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null)
  const [modalAction, setModalAction] = useState(false)
  const theme = useTheme()

  const detailShiftParam = {
    id: shiftId as string
  }

  const responseDetailShift = getDetailShiftService(detailShiftParam)
  const detailShift = responseDetailShift?.data?.data || {}

  const fieldGeneralInformations = [
    { label: 'Name', value: detailShift.code ?? '-' },
    { label: 'Shift Type', value: detailShift.is_overtime ? 'Overtime' : detailShift.is_first_shift ? 'Reguler' : '-' },
    { label: 'Start - End time', value: `${detailShift.start ?? '-'} - ${detailShift.end ?? '-'}` },
    { label: 'Company', value: detailShift.company_name ?? '-' },
    { label: 'Plant Name', value: detailShift.plant_name ?? '-' }
  ]

  const fieldRepetitiveDowntimes = [
    { day: 'Monday', time: '11:30 - 12:30' },
    { day: 'Tuesday', time: '11:30 - 12:30' },
    { day: 'Wednesday', time: '11:30 - 12:30' },
    { day: 'Thursday', time: '11:30 - 12:30' }
  ]

  const accordionRepetitiveDowntimes = [
    {
      title: 'Lunch Break Reguler',
      content: (
        <Grid container sx={{ flexDirection: 'column', gap: '16px' }}>
          {fieldRepetitiveDowntimes.map((field, index) => (
            <Grid key={index} item container sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Grid item>
                <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
                  {field.day || '-'}
                </MvTypography>
              </Grid>
              <Grid item>
                <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
                  {field.time || '-'}
                </MvTypography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      )
    },
    {
      title: 'Lunch Break Friday',
      content: 'Libur'
    }
  ]

  // useEffect(() => {
  //   if (!userAlert.open) return
  //   const timer = setTimeout(() => setUserAlert({ ...userAlert, open: false }), 4000)
  //   return () => clearTimeout(timer)
  // }, [setUserAlert, userAlert])

  return (
    <main>
      <Link component={NextLink} href='/core/shift' sx={{ display: 'flex', alignItems: 'center', marginY: '12px' }}>
        <Icon icon='ic:arrow-back' style={{ color: theme.palette.primary.main }} fontSize='20px' /> Back
      </Link>

      <MvTypography size='TITLE_MD' typeSize='PX'>
        Detail Shift
      </MvTypography>

      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Breadcrumbs
          data={[
            {
              icon: 'tabler:briefcase',
              label: 'Shift',
              path: '/core/shift'
            },
            {
              label: 'Detail',
              path: '/core/shift'
            }
          ]}
        />

        <Stack direction='row' gap={3}>
          <Button
            variant='outlined'
            content='iconText'
            text='Delete'
            icon='fluent:delete-12-regular'
            color='error'
            // onClick={() => setIsDeleteModalOpen(true)}
            sx={{ paddingX: 3 }}
          />
          <Link component={NextLink} href={``} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant='outlined'
              content='iconText'
              text='Edit'
              icon='fluent:edit-12-regular'
              color='primary'
              sx={{ paddingX: 3 }}
            />
          </Link>
        </Stack>
      </Stack>

      {responseDetailShift?.isPending && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}

      {responseDetailShift?.isSuccess ? (
        <Grid container sx={{ mt: '25px', gap: '20px', flexWrap: 'nowrap' }}>
          <Grid item width='60%'>
            <SectionGroup title='General Information' color='default'>
              <Grid container sx={{ gap: '20px' }}>
                {fieldGeneralInformations.map((field, index) => (
                  <div key={index} style={{ flexBasis: '50%' }}>
                    <MvTypography
                      size='LABEL_MD_NORMAL'
                      color={theme.colorToken.text.neutralInverted.disabled}
                      typeSize='PX'
                    >
                      {field.label}
                    </MvTypography>
                    <MvTypography size='BODY_MD_NORMAL' typeSize='PX' marginTop='5px'>
                      {Array.isArray(field.value) ? field.value.join(', ') : field.value || '-'}
                    </MvTypography>
                  </div>
                ))}
              </Grid>
            </SectionGroup>
          </Grid>
          <Grid item width='40%'>
            <SectionGroup title='Repetitive Downtime on this Shift' color='default'>
              <Grid container>
                <Grid item width='100%'>
                  <Accordion data={accordionRepetitiveDowntimes} />
                </Grid>
              </Grid>
            </SectionGroup>
          </Grid>
        </Grid>
      ) : (
        <MvTypography size='BODY_MD_NORMAL' typeSize='PX' sx={{ textAlign: 'center' }}>
          Something went wrong. Please try again later
        </MvTypography>
      )}
    </main>
  )
}
