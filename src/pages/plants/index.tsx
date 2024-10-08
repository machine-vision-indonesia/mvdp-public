import Breadcrumbs from '@mui/material/Breadcrumbs'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import Image from 'next/image'
import NextLink from 'next/link'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import { Button } from 'src/components/atoms/button'
import { Input } from 'src/components/atoms/input'
import { Switch } from 'src/components/atoms/switch'

type Plant = {
  id: string
  code: string
  name: string
  picture: string
  status: boolean
}

const plants: Plant[] = [
  {
    id: '1',
    code: '00001',
    name: 'Job Level 1',
    picture: '/images/plant-1.jpg',
    status: true
  },
  {
    id: '2',
    code: '00002',
    name: 'Job Level 2',
    picture: '/images/plant-2.jpg',
    status: false
  }
]

export default function ManagePlantsPage() {
  const theme = useTheme()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<Plant>()
  const [paddingTop, setPaddingTop] = useState('0')

  return (
    <>
      <main>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flexGrow: 1 }}>
            <Typography variant='h2'>Manage Plant</Typography>
            <Breadcrumbs
              aria-label='breadcrumb'
              sx={{ mt: '8px' }}
              separator={<Icon icon='mdi:chevron-right' color='#909094' />}
            >
              <Link component={NextLink} href='/'>
                <Icon icon='mdi:home-outline' style={{ color: theme.palette.primary.main }} fontSize='20px' />
              </Link>
              <Typography variant='body1' color={`${theme.palette.text.primary} !important`}>
                Manage Plant
              </Typography>
            </Breadcrumbs>
          </div>
          <Button
            variant='contained'
            size='large'
            content='iconText'
            text='Add New'
            icon='material-symbols:keyboard-arrow-down'
            endIcon={<Icon icon='material-symbols:keyboard-arrow-down' fontSize='18px' />}
            sx={{ height: '43px', padding: '8px 16px !important', borderRadius: '4px', fontSize: '1rem' }}
            onClick={event => setAnchorEl(event.currentTarget)}
            aria-controls='add-menu'
            aria-haspopup='true'
          />
          <Menu
            keepMounted
            id='add-menu'
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            open={Boolean(anchorEl)}
            sx={{ mt: 2 }}
            transformOrigin={{
              horizontal: 10,
              vertical: 'top'
            }}
            MenuListProps={{
              style: {
                padding: '5px',
                width: '174px'
              }
            }}
          >
            <MenuItem
              style={{ padding: '8px 16px', margin: 0, justifyContent: 'space-between' }}
              component={NextLink}
              href='/plants/add'
            >
              <span style={{ fontWeight: 500, fontSize: '14px', letterSpacing: '0.43px' }}>Data Plant</span>
              <Icon fontSize='16px' icon='material-symbols:add' />
            </MenuItem>
            <MenuItem
              style={{ padding: '8px 16px', margin: 0, justifyContent: 'space-between' }}
              component={NextLink}
              href='/plants/add/bulk'
            >
              <span style={{ fontWeight: 500, fontSize: '14px', letterSpacing: '0.43px' }}>Bulk Data Plant</span>
              <Icon fontSize='16px' icon='material-symbols:playlist-add' />
            </MenuItem>
          </Menu>
        </div>

        <div
          style={{
            backgroundColor: '#FEFEFE',
            borderRadius: '6px',
            boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
            marginTop: '24.5px'
          }}
        >
          <div style={{ padding: '10px 20px' }}>
            <Input
              placeholder='Search'
              variant='filled'
              fullWidth
              sx={{
                '& fieldset': { border: 'none' },
                '& .MuiOutlinedInput-root.Mui-focused': {
                  boxShadow: 'none'
                }
              }}
              InputProps={{
                style: {
                  paddingLeft: '0px'
                },
                startAdornment: (
                  <Icon fontSize='24px' icon='mdi:magnify' color='#6C7086' style={{ marginRight: '10px' }} />
                )
              }}
            />
          </div>

          <Divider sx={{ borderColor: theme.palette.grey[200] }} />

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: '#F5F8FF' }}>
                <TableRow>
                  <TableCell style={{ color: theme.palette.text.secondary }}>Code</TableCell>
                  <TableCell style={{ color: theme.palette.text.secondary }}>Name</TableCell>
                  <TableCell style={{ color: theme.palette.text.secondary }}>Picture</TableCell>
                  <TableCell style={{ color: theme.palette.text.secondary }}>Status</TableCell>
                  <TableCell style={{ textAlign: 'center', color: theme.palette.text.secondary }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plants.map(plant => (
                  <TableRow key={plant.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell style={{ color: theme.palette.text.primary }}>{plant.code}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{plant.name}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>
                      <Button
                        type='button'
                        variant='text'
                        content='textOnly'
                        text='View'
                        onClick={() => {
                          setSelectedPlant(plant)
                          setImageModalOpen(true)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch checked={plant.status} />
                    </TableCell>
                    <TableCell style={{ width: '1px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', columnGap: '16px' }}>
                        <Button
                          style={{ padding: 0, minWidth: 'auto', color: theme.palette.brand.second }}
                          type='button'
                          LinkComponent={NextLink}
                          href={`/plants/${plant.id}/edit`}
                          content='iconOnly'
                          icon='mdi:pencil-outline'
                        />
                        <Button
                          style={{ padding: 0, minWidth: 'auto', color: theme.palette.primary.main }}
                          type='button'
                          LinkComponent={NextLink}
                          href={`/plants/${plant.id}`}
                          content='iconOnly'
                          icon='mdi:eye-outline'
                        />
                        <Button
                          style={{ padding: 0, minWidth: 'auto', color: theme.palette.error.main }}
                          type='button'
                          onClick={() => setDeleteModalOpen(true)}
                          content='iconOnly'
                          icon='mdi:delete-outline'
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>

      <Dialog
        fullWidth
        open={deleteModalOpen}
        scroll='body'
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{
          style: {
            maxWidth: '512px'
          }
        }}
      >
        <DialogContent
          sx={{
            position: 'relative',
            paddingTop: '43px 0 42px 0 !important'
          }}
        >
          <IconButton
            size='small'
            onClick={() => setDeleteModalOpen(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>

          <div style={{ textAlign: 'center' }}>
            <Icon icon='mdi:cancel-circle-outline' fontSize='80px' color={theme.palette.error[200]} />
            <Typography variant='h4' sx={{ mt: 3 }}>
              Are you sure?
            </Typography>
            <Typography variant='labelMd' sx={{ mt: 1, display: 'block' }}>
              You won’t be able to revert this!
            </Typography>
            <DialogActions
              sx={{
                justifyContent: 'center',
                mt: '31px'
              }}
            >
              <Button
                variant='outlined'
                content='textOnly'
                text='Cancel'
                color='secondary'
                size='medium'
                onClick={() => setDeleteModalOpen(false)}
              />
              <Button variant='contained' content='textOnly' text='Yes, delete it' color='error' size='medium' />
            </DialogActions>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            borderRadius: 0
          }
        }}
        maxWidth='md'
      >
        {selectedPlant ? (
          <>
            <DialogContent sx={{ padding: '0 !important' }}>
              <div style={{ position: 'relative', paddingTop }}>
                <Image
                  src={selectedPlant.picture}
                  alt={selectedPlant.name}
                  fill
                  style={{ objectFit: 'contain' }}
                  onLoadingComplete={img => {
                    setPaddingTop(`calc(100% / (${img.naturalWidth} / ${img.naturalHeight}))`)
                  }}
                />
              </div>
            </DialogContent>

            <Button
              type='button'
              style={{ position: 'absolute', right: 0, top: 0 }}
              onClick={() => setImageModalOpen(false)}
              content='iconOnly'
              icon='material-symbols:close'
            />
          </>
        ) : null}
      </Dialog>
    </>
  )
}
