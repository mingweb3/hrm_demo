import { useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useQuery } from '@tanstack/react-query'
import qs from 'qs'
import { Controller } from 'react-hook-form'
import { Control, RegisterOptions } from 'react-hook-form/dist/types'
import { getSectionFn } from '@/apis/division.api'
import { IDepartmentForm, ISectionForm } from '@/types/IJob'
import { convertDataToList } from '@/utils/helper.object'

interface SectionSelectorProps {
  control: Control<any>
  label: string
  fieldName: string
  noOptionsText?: string
  defaultValue?: ISectionForm
  onSelect?: (val: string) => void
  error?: boolean
  rules?: Omit<RegisterOptions<any, string>, 'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'> | undefined
  department?: IDepartmentForm
}

const SectionSelector: React.FC<SectionSelectorProps> = props => {
  const { control, label, fieldName, noOptionsText, error, onSelect, defaultValue, rules, department } = props

  const [options, setOptions] = useState<readonly ISectionForm[]>([])
  const [keyword, setKeyword] = useState('')

  // Fetching
  const paramQuery = {
    'filter[title]': keyword.trim(),
    'filter[categoryId]': department ? `${department.id}` : ''
  }
  const findQuery = useQuery({
    queryKey: ['sections', decodeURI(qs.stringify(paramQuery))],
    queryFn: () => {
      return getSectionFn(new URLSearchParams(paramQuery))
    },
    onSuccess(data) {
      setOptions(convertDataToList(data.data, 'title') as ISectionForm[])
    },
    enabled: false,
    keepPreviousData: true,
    retry: 0
  })

  // onTyping
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
              onChange={(_, newValue: ISectionForm | null) => {
                onChange(newValue)
                if (newValue?.id && onSelect) {
                  onSelect(newValue?.id.toString())
                }
              }}
              onInputChange={(_, newInputValue) => {
                setKeyword(newInputValue)
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
              options={options}
              onChange={(_, newValue: ISectionForm | null) => {
                onChange(newValue)
                if (newValue?.id && onSelect) {
                  onSelect(newValue?.id.toString())
                }
              }}
              onInputChange={(_, newInputValue) => {
                setKeyword(newInputValue)
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

export default SectionSelector
