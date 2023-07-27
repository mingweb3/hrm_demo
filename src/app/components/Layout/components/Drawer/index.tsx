import React from 'react'
import { useMediaQuery } from '@mui/material'
import { alpha, styled, useTheme } from '@mui/material/styles'
import { Navigation, OrgInfo } from './DrawerContent'

export const widthOfNav = '260px'
export const headerH = '60px'

const StyledDrawer = styled('nav')(
  ({ theme }) => `
  .wrapper {
    width: ${widthOfNav};
    overflow-x: hidden;
    overflow-y: auto;
    position: fixed;
    z-index: 6;
    top: ${headerH};
    bottom: 0;
    background-color:  ${theme.palette.common.white};
    box-sizing: border-box;
    transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    transform: translateX(-${widthOfNav});
    pointer-events: none;

    &.opened {
      transform: none;
      pointer-events: all;
    }

    > .inner {
      width: ${widthOfNav};
    }
  }

  ${theme.breakpoints.up('lg')} {
    width: ${widthOfNav};
    flex: 0 0 auto;

    .wrapper {
      transform: none;
      pointer-events: all;
    }
  }
`
)

const StyledDrawerOverlay = styled('div')(
  ({ theme }) => `
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  inset: 0px;
  background-color: ${alpha(theme.palette.common.black, 0.3)};
  opacity: 0;
  transition: opacity 195ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  visibility: hidden;
  top: ${headerH};
  &.opened {
    transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    visibility: visible;
  }
`
)

interface DrawerProps {
  onToggleDrawer: () => void
}

export const Drawer: React.FC<DrawerProps> = props => {
  const { onToggleDrawer } = props

  const theme = useTheme()
  const matchDownLg = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <StyledDrawer>
      <div id="drawer-nav" className="wrapper">
        <div className="py-5 inner">
          <OrgInfo />
          <Navigation />
        </div>
      </div>
      {matchDownLg ? <StyledDrawerOverlay id="drawer-nav__overlay" onClick={onToggleDrawer} /> : null}
    </StyledDrawer>
  )
}
