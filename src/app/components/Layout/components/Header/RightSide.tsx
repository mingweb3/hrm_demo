import React from 'react'
// COMPS
import { Menu, MenuItem } from '@mui/material'
import { faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuthContext } from '@/context/AuthProvider'
import { BadgeSquare } from '@/app/components/Button/BadgeSquare'
import useLogout from '@/hooks/useLogout'
import { getFirstChar } from '@/utils/helpers'

interface RightSideProps {
  mode: string
}

export const RightSide: React.FC<RightSideProps> = props => {
  const { mode } = props
  const authCtx = useAuthContext()

  // SubMenu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Action: Logout
  const logout = useLogout()
  const handleLogout = () => {
    setAnchorEl(null)
    logout()
  }

  return (
    <div className="flex gap-4">
      <BadgeSquare variant="dark" className="border-white">
        <FontAwesomeIcon icon={faQuestion} size="xs" />
      </BadgeSquare>
      {mode === 'full' && (
        <BadgeSquare variant="light" className="border-white bg-white">
          <FontAwesomeIcon icon={faPlus} size="xs" />
        </BadgeSquare>
      )}
      {authCtx.state.currentUser && (
        <>
          <BadgeSquare
            variant="dark"
            className="border-blue2 bg-blue2"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <span>{getFirstChar(authCtx.state.currentUser?.attributes?.name).toUpperCase()}</span>
            <div className="num">8</div>
          </BadgeSquare>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </>
      )}
    </div>
  )
}

export default RightSide
