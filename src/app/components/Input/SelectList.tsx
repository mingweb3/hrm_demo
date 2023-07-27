import { ForwardedRef, forwardRef } from 'react'
import { FormControl, styled } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Control, Controller } from 'react-hook-form'

const StyledSelectList = styled('div')(``)
export interface IOption {
  label: string
  value?: string | number | null
}

interface SelectListProps {
  control: Control<any>
  label: string
  fieldName: string
  defaultValue?: string | number | ''
  dataList: IOption[]
  onChange?: (e: SelectChangeEvent<any>) => void
  error?: boolean
}

export const SelectList = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (props: SelectListProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { fieldName, label, dataList, defaultValue, control, onChange, error } = props

    return (
      <StyledSelectList>
        <FormControl fullWidth size="small">
          <InputLabel id={`slet-lbl-${label}`}>{label}</InputLabel>
          <Controller
            name={fieldName}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
              <Select
                {...field}
                labelId={`slet-lbl-${label}`}
                id={`slet-${label}`}
                label={label}
                error={error}
                onChange={e => {
                  if (onChange && typeof onChange === 'function') onChange(e)
                  field.onChange(e.target.value)
                }}
              >
                {dataList.map((item: IOption, i) => {
                  const { value, label } = item
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <MenuItem key={`${i}-${value}`} value={value?.toString()}>
                      {label}
                    </MenuItem>
                  )
                })}
              </Select>
            )}
          />
        </FormControl>
      </StyledSelectList>
    )
  }
)
