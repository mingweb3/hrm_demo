import { useCallback, useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import debounce from '@mui/material/utils/debounce'
import { useQuery } from '@tanstack/react-query'
import qs from 'qs'
import { Controller } from 'react-hook-form'
import { Control, RegisterOptions } from 'react-hook-form/dist/types'
import { getSkillsFn } from '@/apis/division.api'
import { IDepartmentForm, ISectionForm, ISkillForm } from '@/types/IJob'
import { convertDataToList } from '@/utils/helper.object'

interface SkillSelectorOneProps {
  control: Control<any>
  label: string
  fieldName: string
  noOptionsText?: string
  defaultValue?: ISkillForm
  onSelect?: (val: ISkillForm) => void
  onTyping?: (val: string) => void
  onLoadOptions?: (data: any) => void
  error?: boolean
  rules?: Omit<RegisterOptions<any, string>, 'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'> | undefined
  section?: ISectionForm
  department?: IDepartmentForm
}

const SkillSelectorOne: React.FC<SkillSelectorOneProps> = props => {
  const {
    control,
    label,
    fieldName,
    noOptionsText,
    error,
    onSelect,
    onTyping,
    onLoadOptions,
    defaultValue,
    rules,
    section,
    department
  } = props

  const [options, setOptions] = useState<readonly ISkillForm[]>([])
  const [keyword, setKeyword] = useState('')

  // Fetching
  const paramQuery = {
    include: 'section',
    'filter[title]': keyword.trim(),
    'filter[sectionId]': section ? `${section.id}` : '',
    'filter[categoryId]': department ? `${department.id}` : ''
  }

  const findQuery = useQuery({
    queryKey: ['skills', decodeURI(qs.stringify(paramQuery))],
    queryFn: () => {
      return getSkillsFn(new URLSearchParams(paramQuery))
    },
    onSuccess(data) {
      if (onLoadOptions) {
        onLoadOptions(data.data)
      }
      setOptions(convertDataToList(data.data, 'title') as ISkillForm[])
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

  // onTyping
  const handleTyping = (nChar: string) => {
    setKeyword(nChar)
    if (onTyping) {
      onTyping(nChar)
    }
  }

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
              onChange={(_, newValue: ISkillForm | null) => {
                onChange(newValue)
                if (newValue && onSelect) {
                  onSelect(newValue)
                }
              }}
              onInputChange={(_, newInputValue) => {
                debounceFn(newInputValue)
              }}
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
              onChange={(_, newValue: ISkillForm | null) => {
                onChange(newValue)
                if (newValue && onSelect) {
                  onSelect(newValue)
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

export default SkillSelectorOne
