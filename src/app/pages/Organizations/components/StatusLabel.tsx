import * as React from 'react'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'

const StyledStatusLabel = styled('span')(
  ({ theme }) => `
    text-transform: capitalize;
    font-weight: bold;
    color: ${theme.palette.gray5};
    &.Mui-active {
        color: ${theme.palette.green2};
    }
    &.Mui-pending {
      color: ${theme.palette.primary.main};
    }
`
)

interface StatusLabelProps {
  text: string
  variant?: string
}

export const StatusLabel: React.FC<StatusLabelProps> = props => {
  const { text, variant } = props
  const className = 'status-label'
  const classNameArr = clsx(className, variant ? `Mui-${variant}` : '')

  return <StyledStatusLabel className={classNameArr}>{text}</StyledStatusLabel>
}
