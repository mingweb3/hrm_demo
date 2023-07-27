import React from 'react'
import { InputUnstyled, InputUnstyledProps } from '@mui/base'
import { alpha, styled } from '@mui/material/styles'

const StyledInputElement = styled('input')(
  ({ theme }) => `
  font-weight: 400;
  line-height: 20px;
  padding: 10px 12px;
  color: ${theme.palette.black444};
  background: ${theme.palette.common.white};
  border: 1px solid ${alpha(theme.palette.common.black, 0.2)};
  outline: 0;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${theme.palette.primary.main};
  }

  &:focus {
    border-color: ${theme.palette.primary.main};
  }
`
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rootCls?: string
  inputCls?: string
}

export const Input = React.forwardRef(function CustomInput(
  props: InputProps & InputUnstyledProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { rootCls, inputCls, ...rest } = props
  return (
    <InputUnstyled
      slots={{ input: StyledInputElement }}
      slotProps={{ root: { className: rootCls }, input: { className: inputCls } }}
      {...rest}
      ref={ref}
    />
  )
})
