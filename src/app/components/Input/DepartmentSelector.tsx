import { useCallback, useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import debounce from '@mui/material/utils/debounce'
import { useQuery } from '@tanstack/react-query'
import { Controller } from 'react-hook-form'
import { Control, RegisterOptions } from 'react-hook-form/dist/types'
import { getDepartmentFn } from '@/apis/division.api'
import { IDepartmentForm } from '@/types/IJob'
import { convertDataToList } from '@/utils/helper.object'

interface DepartmentSelectorProps {
  control: Control<any>
  label: string
  fieldName: string
  noOptionsText?: string
  defaultValue?: IDepartmentForm
  onSelect?: (val: string) => void
  onTyping?: (val: string) => void
  onLoadOptions?: (data: any) => void
  divisionId?: number | string
  error?: boolean
  rules?: Omit<RegisterOptions<any, string>, 'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'> | undefined
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = props => {
  const {
    control,
    label,
    fieldName,
    noOptionsText,
    error,
    onSelect,
    onTyping,
    onLoadOptions,
    divisionId,
    defaultValue,
    rules
  } = props

  const [options, setOptions] = useState<readonly IDepartmentForm[]>([])
  const [keyword, setKeyword] = useState('')

  // Fetching
  const defaultQueryStr = `filter[categoryTitle]=`
  const findQuery = useQuery({
    queryKey: ['department', defaultQueryStr + keyword.trim()],
    queryFn: () => {
      const queryParams = new URLSearchParams({
        'filter[categoryTitle]': keyword.trim()
      })
      if (divisionId) {
        queryParams.append('filter[divisionId]', divisionId.toString())
      }
      return getDepartmentFn(queryParams)
    },
    onSuccess(data) {
      if (onLoadOptions) {
        onLoadOptions(data.data)
      }
      setOptions(convertDataToList(data.data, 'categoryTitle') as IDepartmentForm[])
    },
    enabled: false,
    keepPreviousData: true,
    retry: 0
  })

  // onTyping
  const handleTyping = (nChar: string) => {
    if (nChar.length >= 3) {
      setKeyword(nChar)
      if (onTyping) {
        onTyping(nChar)
      }
    }
  }

  useEffect(() => {
    let isMount = true
    if (isMount && keyword.length >= 3) {
      findQuery.refetch()
    }
    return () => {
      isMount = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

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
              options={options}
              defaultValue={defaultValue}
              onChange={(_, newValue: IDepartmentForm | null) => {
                onChange(newValue)
                if (newValue?.id && onSelect) {
                  onSelect(newValue?.id.toString())
                }
              }}
              onInputChange={(_, newInputValue) => {
                debounceFn(newInputValue)
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id?.toString()}
              getOptionLabel={option =>
                option.title ? option.title : option.categoryTitle ? option.categoryTitle : ''
              }
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
              options={options}
              onChange={(_, newValue: IDepartmentForm | null) => {
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

export default DepartmentSelector
