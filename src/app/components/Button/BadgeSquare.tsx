import React from 'react'
import { ButtonUnstyled, ButtonUnstyledProps } from '@mui/base'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'

const StyledBadgeSquare = styled('button')(
  ({ theme }) => `
    outline: 0;
    transition: all 0.15s ease;
    line-height: 0;
    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
    width: 24px;
    height: 24px;
    position: relative;
    &.Mui-dark {
      color: ${theme.palette.common.white};
    }

    &.Mui-light {
      color: ${theme.palette.primary.main};
    }

    &:hover {
      opacity: 0.9;
    }

    .num {
      position: absolute;
      color: ${theme.palette.common.white};
      background-color: ${theme.palette.red};
      top: -9px;
      right: -9px;
      font-size: 10px;
      line-height: 1;
      padding: 2px 5px;
      border-radius: 9px;
    }
`
)

export interface BadgeSquareProps {
  variant?: 'dark' | 'light'
}

export const BadgeSquare = React.forwardRef(function CustomButton(
  props: BadgeSquareProps & ButtonUnstyledProps,
  ref: React.ForwardedRef<any>
) {
  const { className, variant, ...rest } = props

  return (
    <ButtonUnstyled
      className={clsx(className, variant ? `Mui-${variant}` : '')}
      component={StyledBadgeSquare}
      {...rest}
      ref={ref}
    />
  )
})
