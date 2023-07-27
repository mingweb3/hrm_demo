import * as React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import clsx from 'clsx'
import { CheckedIcon } from '@/app/components/Svg/CheckedIcon'
import { UnCheckedIcon } from '@/app/components/Svg/UnCheckedIco'

const StyledStatusLabel = styled('span')(
  ({ theme }) => `
    text-transform: capitalize;
    font-size: 14px;
    &.Mui-published {
        color: ${theme.palette.primary.main};
    }
    &.Mui-unPublished {
        color: ${theme.palette.gray5};
    }
`
)

interface StatusLabelProps {
  data: boolean
}

export const StatusLabel: React.FC<StatusLabelProps> = props => {
  const { data } = props
  const className = 'status-label'
  const variant = data ? 'published' : 'unPublished'
  const classNameArr = clsx(className, variant ? `Mui-${variant}` : '')
  const theme = useTheme()

  return (
    <StyledStatusLabel className={classNameArr}>
      {data ? <CheckedIcon color={theme.palette.green3} /> : <UnCheckedIcon color={theme.palette.gray5} />}
    </StyledStatusLabel>
  )
}
