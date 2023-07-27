import React from 'react'
import { styled } from '@mui/material/styles'

interface WCardProps {
  children: React.ReactNode
  className?: string
  padd?: string
}

const _defaultProps: WCardProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  children: <p>Put content here</p>,
  padd: 'p-4'
}

const StyledWCard = styled('div')(
  ({ theme }) => `
  background-color: ${theme.palette.common.white};
  `
)

const WCard: React.FC<WCardProps> = props => {
  const { children, className, padd } = props
  return <StyledWCard className={`${className} ${padd}`}>{children}</StyledWCard>
}

WCard.defaultProps = _defaultProps

export default WCard
