import React from 'react'
import { ButtonUnstyled, ButtonUnstyledProps } from '@mui/base'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'

const StyledButtonElement = styled('button')(
  ({ theme }) => `
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  padding: 8px 16px;
  outline: 0;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border-radius: 4px;
  
  &.mui-btn-size-sm {
    font-weight: 600;
    font-size: 12px;
    line-height: 1;
    padding: 6px 12px;
  }
  &.mui-btn-size-md {
    font-weight: 600;
    font-size: 14px;
    line-height: 1;
    padding: 10px 22px;
    height: unset;
  }
  &.mui-btn-size-lg {
    font-weight: 700;
    font-size: 16px;
    line-height: 1;
    padding: 10px 24px;
    height: 40px;
  }

  &.Mui-primary {
    color: ${theme.palette.common.white};
    background: ${theme.palette.primary.main};
  }

  &.Mui-dangerous {
    color: ${theme.palette.common.white};
    background: ${theme.palette.red};
  }

  &.Mui-warning {
    color: ${theme.palette.common.white};
    background: ${theme.palette.orange1};
  }

  &.Mui-success {
    color: ${theme.palette.common.white};
    background: ${theme.palette.green2};
  }

  &.Mui-outline {
    color: ${theme.palette.primary.main};
    border: 1px solid ${theme.palette.primary.main};
  }

  &.Mui-gray {
    color: ${theme.palette.common.white};
    background: ${theme.palette.black444};
  }

  &.Mui-outline-gray {
    color: ${theme.palette.gray2};
    border: 1px solid ${theme.palette.gray2};
  }

  &.Mui-outline-red {
    color: ${theme.palette.red};
    border: 1px solid ${theme.palette.red};
  }

  &.Mui-white {
    color: ${theme.palette.black444};
    background: ${theme.palette.common.white};
    border: 1px solid ${theme.palette.gray8};
  }

  &:disabled {
    cursor: default;
    opacity: 0.4;
    &:hover {
      opacity: 0.4;
    }
  }

  &:hover {
    opacity: 0.7;
  }

  &:focus {
    border-color: ${theme.palette.primary.main};
  }
`
)

export interface ButtonProps {
  variant?:
    | 'primary'
    | 'dangerous'
    | 'warning'
    | 'outline'
    | 'outline-gray'
    | 'outline-red'
    | 'success'
    | 'gray'
    | 'white'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef(function CustomButton(
  props: ButtonProps & ButtonUnstyledProps,
  ref: React.ForwardedRef<any>
) {
  const { className, variant, size, ...rest } = props
  const classNameArr = clsx(className, variant ? `Mui-${variant}` : '', size ? `mui-btn-size-${size}` : '')

  return <ButtonUnstyled {...rest} className={classNameArr} component={StyledButtonElement} ref={ref} />
})
