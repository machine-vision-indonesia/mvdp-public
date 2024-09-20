// ** React Imports
import { Fragment, SyntheticEvent, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import { styled, useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { Select } from '@/components/atoms'
import { MvTypography } from '@/components/atoms/mv-typography'
import { Modal } from '@/components/molecules'
import { Alert } from '@/components/molecules/alert'
import { FormLabel } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'
import { navItemsAtom, roleOptionsAtom, selectedRoleAtom } from 'src/atoms'
import client from 'src/client'
import { CircularProgress } from 'src/components/atoms/circular-progress/CircularProgress'
import authConfig from 'src/configs/auth'
import { useUser } from 'src/hooks/useUser'
import { getNavItems } from 'src/utils/general'
import { assetKeys } from 'src/utils/query-keys'

interface Props {
  settings: Settings
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const MenuItemStyled = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main
  }
}))

const UserDropdown = (props: Props) => {
  const [roleOptions] = useAtom(roleOptionsAtom)
  // const roles = roleOptions.map(role => role.label).join(', ')
  const [selectedRole, setSelectedRole] = useAtom(selectedRoleAtom)
  const [, setNavItems] = useAtom(navItemsAtom)
  const [openSwitchRole, setOpenSwitchRole] = useState(false)
  const [newRole, setNewRole] = useState(selectedRole)
  const [isSwitchSuccess, setIsSwitchSuccess] = useState(false)

  const theme = useTheme()

  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()
  const meQuery = useUser()
  const getAssetQuery = useQuery({
    queryKey: assetKeys.detail(meQuery.data?.data?.profile?.photo),
    async queryFn() {
      if (!meQuery.data?.data?.profile?.photo) {
        throw new Error('Invalid asset ID')
      }

      const response = await client.api.get(`/assets/${meQuery.data?.data.profile.photo}`, {
        responseType: 'blob'
      })

      return new Promise<string>(callback => {
        const reader = new FileReader()
        reader.onload = function () {
          callback(String(reader.result))
        }
        reader.readAsDataURL(response.data)
      })
    },
    enabled: Boolean(meQuery.data?.data?.profile?.photo)
  })

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return client.api.post('/auth/logout', {
        refresh_token: localStorage.getItem(authConfig.refreshTokenKeyName)
      })
    }
  })

  const queryClient = useQueryClient()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      async onSuccess() {
        await queryClient.invalidateQueries()
        handleDropdownClose()
        localStorage.removeItem(authConfig.refreshTokenKeyName)
        localStorage.removeItem(authConfig.accessTokenKeyName)
        router.push('/login')
      }
    })
  }

  if (!meQuery.isSuccess || (meQuery.data?.data?.profile?.photo && !getAssetQuery.isSuccess)) {
    return null
  }

  const onSwitchRole = () => {
    const options =
      meQuery?.data?.data?.roles.map(role => ({
        id: role.id,
        label: role.name,
        code: role.code
      })) ?? []

    const selected = options.find(role => role.id !== selectedRole?.id) || options[0]

    setSelectedRole(selected)
    if (!selectedRole || !meQuery.data?.data) {
      return
    }

    const navItems = getNavItems({
      data: meQuery.data.data,
      roleIds: options.map(role => role.id),
      selectedRoleId: selected.id,
      uiConfigs: []
    })

    setNavItems(navItems)
  }

  const onSubmitModalSwitch = () => {
    if (!newRole || !meQuery.data?.data) {
      return
    }

    const navItems = getNavItems({
      data: meQuery.data.data,
      roleIds: roleOptions.map(role => role.id),
      selectedRoleId: newRole.id,
      uiConfigs: []
    })

    setNavItems(navItems)
    setSelectedRole(newRole)
    setOpenSwitchRole(false)
    setIsSwitchSuccess(true)

    setTimeout(() => {
      setIsSwitchSuccess(false)
    }, 3000)
  }

  const onOpenSwitch = () => {
    handleDropdownClose()
    setOpenSwitchRole(true)
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer', gap: 2, alignItems: 'center' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Box sx={{ textAlign: 'end' }}>
          <MvTypography
            color={theme.colorToken.background.neutralInverted.subtle}
            size='LABEL_MD_BOLDEST'
            typeSize='PX'
          >
            {meQuery.data?.data?.first_name} {meQuery.data?.data?.last_name}
          </MvTypography>
          <MvTypography color={theme.colorToken.background.neutralInverted.subtle} size='HELPER_TEXT_MD' typeSize='PX'>
            {selectedRole?.label}
          </MvTypography>
        </Box>
        <Avatar
          alt={`${meQuery.data?.data?.first_name} ${meQuery.data?.data?.last_name}`}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={meQuery.data?.data?.profile?.photo ? getAssetQuery.data : undefined}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.5 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem
          onClick={() =>
            meQuery?.data?.data?.roles && meQuery?.data?.data?.roles?.length > 2 ? onOpenSwitch() : onSwitchRole()
          }
          sx={{ gap: 2 }}
        >
          <Icon icon='mi:switch' />
          Switch Role
        </MenuItem>
        <MenuItem onClick={() => router.push(`/core/user/${meQuery.data?.data?.id}/profile`)} sx={{ gap: 2 }}>
          <Icon icon='mynaui:eye' />
          View User Profile
        </MenuItem>
        {logoutMutation.isPending || logoutMutation.isSuccess ? (
          <div style={{ height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={18} />
          </div>
        ) : (
          <MenuItemStyled
            onClick={handleLogout}
            sx={{
              color: 'red',
              height: 38,
              '& svg':
                logoutMutation.isPending || logoutMutation.isSuccess ? undefined : { mr: 2, fontSize: '1.375rem' }
            }}
          >
            <Icon icon='ic:outline-logout' />
            Logout
          </MenuItemStyled>
        )}
      </Menu>

      <Modal
        title='Switch Role'
        description='If you change roles, the menu display will be updated according to your new role.'
        isOpen={openSwitchRole}
        onClose={() => setOpenSwitchRole(false)}
        onOk={onSubmitModalSwitch}
      >
        <form style={{ marginTop: 10 }}>
          <FormLabel required>Role</FormLabel>
          <Select
            valueKey='id'
            labelKey='label'
            data={roleOptions}
            selected={selectedRole}
            onChange={(newValue: any) => {
              setNewRole(newValue)
            }}
          />
        </form>
      </Modal>

      {isSwitchSuccess ? (
        <Box position='fixed' top='85px' right='24px'>
          <Alert variant='success' content='Role has been switched by our system.' title='Successfully switch role.' />
        </Box>
      ) : null}
    </Fragment>
  )
}

export default UserDropdown
