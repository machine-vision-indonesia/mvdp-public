import { Modal } from '@/components/molecules'
import { IconButton } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import NextLink from 'next/link'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import { ActionButtonProps, ActionItem } from '../types/PagePrimary.type'
import { useTheme } from '@emotion/react'

export function ActionButton({
  items,
  onActionComplete,
  triggerIcon = 'ic:baseline-more-vert',
  triggerColor,
  currentAction,
  setCurrentAction = () => { }
}: ActionButtonProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const getDefaultIconAndColor = (label: string): { icon: string; color: string } => {
    switch (label.toLowerCase()) {
      case 'edit':
        return { icon: 'tabler:pencil', color: theme.colorToken.text.primary.normal };
      case 'view':
      case 'detail':
        return { icon: 'mynaui:eye', color: theme.colorToken.text.primary.normal };
      case 'delete':
        return { icon: 'tabler:trash', color: theme.colorToken.icon.danger.normal };
      default:
        return { icon: 'ic:outline-more-horiz', color: theme.colorToken.text.primary.normal };
    }
  }

  const itemsWithDefaults = items.map(item => {
    const defaults = getDefaultIconAndColor(item.label);
    return {
      ...item,
      icon: item.icon || defaults.icon,
      color: item.color || defaults.color
    };
  });

  const handleActionConfirm = async () => {
    if (currentAction) {
      if (currentAction.action) {
        await currentAction.action()
      }
      await currentAction.modalProps?.onClick?.()
      setModalOpen(false)
      setCurrentAction(null)
      if (onActionComplete) {
        onActionComplete()
      }
    }
  }

  const renderIconButtons = () => (
    <>
      {itemsWithDefaults.map((item, index) => (
        <IconButton
          key={index}
          sx={{
            color: item.color,
            padding: '8px',
            '&:hover': {
              background: 'transparent'
            }
          }}
          component={item.isLink ? NextLink : 'button'}
          href={item.isLink ? item.href : undefined}
          onClick={() => handleMenuItemClick(item)}
          passHref={item.isLink}
        >
          <Icon fontSize="22px" icon={item.icon} />
        </IconButton>
      ))}
    </>
  );

  const handleMenuItemClick = (item: ActionItem) => {
    setAnchorEl(null);

    if (item.isLink) {
      if (typeof item.action === 'function') {
        item.action();
      }
    } else {
      setCurrentAction(item);
      setModalOpen(true);
    }
  };


  const renderMenu = () => (
    <>
      <IconButton
        sx={{
          aspectRatio: '1/1',
          minWidth: 'unset',
          color: triggerColor,
          padding: 0,
          '&:hover': {
            background: 'transparent'
          }
        }}
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        <Icon fontSize='22px' icon={triggerIcon} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        sx={{
          '& .MuiButtonBase-root-MuiMenuItem-root:not(.Mui-focusVisible):hover': {
            color: 'unset'
          }
        }}
      >
        {itemsWithDefaults.map((item, index) => (
          <MenuItem
            key={index}
            component={item.isLink ? NextLink : 'li'}
            href={item.isLink ? item.href : undefined}
            onClick={() => handleMenuItemClick(item)}
            sx={{
              color: item.color,
              display: 'flex',
              alignItems: 'center',
              columnGap: '6px',
              fontWeight: 500,
              '&:not(.Mui-focusVisible):hover': {
                color: item.color
              }
            }}
          >
            <Icon icon={item.icon} fontSize='16px' />
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )

  const handleActionCancel = () => {
    setModalOpen(false)
    setCurrentAction(null)
    if (currentAction?.modalProps?.onClose) {
      currentAction.modalProps?.onClose()
    }
  }

  return (
    <>
      {itemsWithDefaults.length <= 3 ? renderIconButtons() : renderMenu()}

      {currentAction && (
        <Modal
          isOpen={modalOpen as boolean}
          onClose={handleActionCancel}
          type={currentAction.modalProps?.variant || 'default'}
          positiveLabel={currentAction.modalProps?.positiveLabel || 'Confirm'}
          negativeLabel={currentAction.modalProps?.negativeLabel || 'Cancel'}
          title={currentAction.modalProps?.title || `Confirm ${currentAction.label}`}
          description={currentAction.modalProps?.description}
          onOk={handleActionConfirm}
          renderAction={currentAction.modalProps?.renderAction}
          status={currentAction.modalProps?.status || 'default'}
          loading={currentAction.modalProps?.isLoading}
        >
          {typeof currentAction.renderContent === 'function' ? currentAction.renderContent() : currentAction.renderContent}
        </Modal>
      )}
    </>
  )
}
