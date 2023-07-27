import * as React from 'react'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'

const StyledStatusLabel = styled('span')(
  ({ theme }) => `
    text-transform: capitalize;
    font-weight: bold;
    &.Mui-assigned {
        color: ${theme.palette.blue4};
    }
    &.Mui-interviewing,
    &.Mui-pending-offer,
    &.Mui-offer-accepted,
    &.Mui-pending-loa-signing,
    &.Mui-pending-2nd-interview,
    &.Mui-pending-3rd-interview {
        color: ${theme.palette.orange1};
    }
    &.Mui-next.stage {
        color: ${theme.palette.black444};
    }
    &.Mui-kiv {
        text-transform: uppercase;
    }
    &.Mui-kiv,
    &.Mui-shortlisted,
    &.Mui-short-listed, {
        color: ${theme.palette.common.black};
    }
    &.Mui-offered,
    &.Mui-offer,
    &.Mui-hired, {
        color: ${theme.palette.green2};
    }
    &.Mui-rejected,
    &.Mui-draft {
        color: ${theme.palette.gray5};
    }
    &.Mui-new,
    &.Mui-submitted {
        color: ${theme.palette.blue};
    }
    &.Mui-offer-rejected {
        color: ${theme.palette.red};
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
