import { ChangeEvent, ForwardedRef, forwardRef } from 'react'
import { FormControlLabel, Switch, styled } from '@mui/material'
import { Control, Controller } from 'react-hook-form'

interface SwitcherProps {
  control: Control<any>
  label: string
  fieldName: string
  defaultValue?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const StyledSwitcher = styled('div')(``)

export const Switcher = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (props: SwitcherProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { fieldName, label, defaultValue, control, onChange } = props

    return (
      <StyledSwitcher>
        <Controller
          name={fieldName}
          control={control}
          defaultValue={defaultValue || false}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  onChange={e => {
                    if (onChange && typeof onChange === 'function') onChange(e)
                    field.onChange(e.target.checked)
                  }}
                  checked={field.value}
                />
              }
              label={label}
            />
          )}
        />
      </StyledSwitcher>
    )
  }
)
