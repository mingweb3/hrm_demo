import { useCallback, useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import debounce from '@mui/material/utils/debounce'
import { useQuery } from '@tanstack/react-query'
import { Controller } from 'react-hook-form'
import { Control, RegisterOptions } from 'react-hook-form/dist/types'
import { getDivisionFn } from '@/apis/division.api'
import { IDivisionForm } from '@/types/IJob'
import { convertDataToList } from '@/utils/helper.object'

interface DivisionSelectorProps {
  control: Control<any>
  label: string
  fieldName: string
  noOptionsText?: string
  defaultValue?: IDivisionForm
  onSelect?: (val: string) => void
  onTyping?: (val: string) => void
  onLoadOptions?: (data: any) => void
  error?: boolean
  rules?: Omit<RegisterOptions<any, string>, 'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'> | undefined
}

const DivisionSelector: React.FC<DivisionSelectorProps> = props => {
  const { control, label, fieldName, noOptionsText, error, onSelect, onTyping, onLoadOptions, defaultValue, rules } =
    props

  const [diOptions, setDiOptions] = useState<readonly IDivisionForm[]>([])
  const [charDivision, setCharDivision] = useState('')

  // Fetching
  const defaultQueryStr = `filter[title]=`
  const divisionsQuery = useQuery({
    queryKey: ['divisions', defaultQueryStr + charDivision.trim()],
    queryFn: () => {
      return getDivisionFn(new URLSearchParams({ 'filter[title]': charDivision.trim() }))
    },
    onSuccess(data) {
      if (onLoadOptions) {
        onLoadOptions(data.data)
      }
      setDiOptions(convertDataToList(data.data, 'title'))
    },
    enabled: false,
    keepPreviousData: true,
    retry: 0
  })

  // onTyping
  const handleTyping = (nChar: string) => {
    if (nChar.length >= 3) {
      setCharDivision(nChar)
      if (onTyping) {
        onTyping(nChar)
      }
    }
  }

  useEffect(() => {
    let isMount = true
    if (isMount && charDivision.length >= 3) {
      divisionsQuery.refetch()
    }
    return () => {
      isMount = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charDivision])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(debounce(handleTyping, 400), [])

  return (
    <div>
      {defaultValue && (
        <Controller
          name={fieldName}
          rules={rules}
          control={control}
          render={({ field: { onChange } }) => (
            <Autocomplete
              noOptionsText={noOptionsText || 'Type to find...'}
              options={diOptions}
              defaultValue={defaultValue}
              onChange={(_, newValue: IDivisionForm | null) => {
                onChange(newValue)
                if (newValue?.id && onSelect) {
                  onSelect(newValue?.id.toString())
                }
              }}
              onInputChange={(_, newInputValue) => {
                debounceFn(newInputValue)
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id?.toString()}
              getOptionLabel={option => option.title || ''}
              renderInput={params => <TextField {...params} error={error} size="small" label={label} />}
            />
          )}
        />
      )}

      {!defaultValue && (
        <Controller
          name={fieldName}
          rules={rules}
          control={control}
          render={({ field: { onChange } }) => (
            <Autocomplete
              noOptionsText={noOptionsText || 'Type to find...'}
              options={diOptions}
              onChange={(_, newValue: IDivisionForm | null) => {
                onChange(newValue)
                if (newValue?.id && onSelect) {
                  onSelect(newValue?.id.toString())
                }
              }}
              onInputChange={(_, newInputValue) => {
                debounceFn(newInputValue)
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id?.toString()}
              getOptionLabel={option => option.title || ''}
              renderInput={params => <TextField {...params} error={error} size="small" label={label} />}
            />
          )}
        />
      )}
    </div>
  )
}

export default DivisionSelector
