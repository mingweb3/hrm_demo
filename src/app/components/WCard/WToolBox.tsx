import React from 'react'
import { styled } from '@mui/material/styles'

interface WToolBoxProps {
  children: React.ReactNode
  className?: string
}

const StyledWToolBox = styled('div')(
  ({ theme }) => `
  background-color: ${theme.palette.bg};
  `
)

const WToolBox: React.FC<WToolBoxProps> = props => {
  const { children, className } = props
  return <StyledWToolBox className={className}>{children}</StyledWToolBox>
}

export default WToolBox
