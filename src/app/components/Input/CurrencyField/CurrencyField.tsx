import { styled } from '@mui/material'
import CurrencyInput from 'react-currency-input-field'
import { Control, Controller } from 'react-hook-form'

const StyledCurrencyField = styled('div')(
  ({ theme }) => `
    border: 1px solid ${theme.palette.gray2};
    border-radius: 4px;
    padding: 8px 14px;
    position: relative;
    .lbl {
      font-size: 12px;
      position: absolute;
      top: -10px;
      left: 5px;
      background: ${theme.palette.common.white};
      padding: 0 5px;
    }
    input {
      outline: none;
      width: 100%;
      color: ${theme.palette.gray2};
    }
`
)

interface CurrencyFieldProps {
  control?: Control<any>
  allowNegativeValue?: boolean
  allowDecimals?: boolean
  groupSeparator?: string
  decimalSeparator?: string
  label?: string
  fieldName?: string
}

const _defaultProps: CurrencyFieldProps = {
  allowNegativeValue: false,
  allowDecimals: false,
  groupSeparator: ',',
  decimalSeparator: '.'
}

const CurrencyField: React.FC<CurrencyFieldProps> = ({
  control,
  label,
  fieldName,
  allowNegativeValue,
  allowDecimals,
  groupSeparator,
  decimalSeparator
}) => {
  return (
    <StyledCurrencyField>
      {label && <div className="lbl">{label}</div>}
      {fieldName && control && (
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <CurrencyInput
              allowNegativeValue={allowNegativeValue}
              allowDecimals={allowDecimals}
              groupSeparator={groupSeparator}
              decimalSeparator={decimalSeparator}
              value={field.value}
              name={field.name}
              onValueChange={value => field.onChange(value)}
            />
          )}
        />
      )}
    </StyledCurrencyField>
  )
}

CurrencyField.defaultProps = _defaultProps

export default CurrencyField
