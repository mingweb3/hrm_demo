// import { faClose } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { useMediaQuery } from '@mui/material'
import { styled, useTheme } from '@mui/system'
import { faBars, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
// COMPS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BadgeSquare } from '@/app/components/Button/BadgeSquare'
import { LogoIcon } from '@/components/Logo/LogoIcon'
import { RightSide } from './RightSide'

const StyledHeader = styled('header')(
  () => `
  .header-frame {
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
  }
  `
)

interface HeaderProps {
  isDrawerOpen?: boolean
  mode?: 'full' | 'min'
  onToggleDrawer?: () => void
}

const _defaultProps: HeaderProps = {
  isDrawerOpen: false,
  mode: 'full',
  onToggleDrawer: () => null
}

const Header: React.FC<HeaderProps> = props => {
  const { isDrawerOpen, onToggleDrawer, mode } = props

  const theme = useTheme()
  const matchDownLg = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <StyledHeader className="w-full h-[60px]">
      <div className="min-h-[60px] flex flex-nowrap justify-between items-center header-frame fixed w-screen bg-primary py-2.5 px-5">
        <div className="flex items-center left-side flex-nowrap">
          {mode === 'full' && matchDownLg && (
            <BadgeSquare variant="dark" className="mr-4 border-white" onClick={onToggleDrawer}>
              {isDrawerOpen ? (
                <FontAwesomeIcon icon={faChevronLeft} size="xs" />
              ) : (
                <FontAwesomeIcon icon={faBars} size="xs" />
              )}
            </BadgeSquare>
          )}
          <LogoIcon />
        </div>
        <div className="right-side ">
          <RightSide mode={mode || 'full'} />
        </div>
      </div>
    </StyledHeader>
  )
}

Header.defaultProps = _defaultProps

export default Header
