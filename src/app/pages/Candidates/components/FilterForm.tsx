import { useEffect } from 'react'
import { Autocomplete, FormControl, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { t } from 'i18next'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
// COMPs
import { Button } from '@/app/components/Button'
import SectionSelector from '@/app/components/Input/SectionSelector'
import { SelectList } from '@/app/components/Input/SelectList'
import useSection from '@/hooks/useSection'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { countries } from '@/constants/JsonData/countries'
import { jobLevels } from '@/constants/JsonData/jobLevel'
import { publishedStatus } from '@/constants/JsonData/status'
import { IFilterCandidateForm } from '@/types/ICandidate'
import { ISectionForm } from '@/types/IJob'
import { convertSelectListData } from '@/utils/helper.national'
import { isEmptyObject, mergeObjects } from '@/utils/helper.object'
import { messages } from '../messages'

const StyledFilterForm = styled('div')(
  ({ theme }) => `
      border-top: 1px solid ${theme.palette.bg};
      .btn-group {
        button {
          ${theme.breakpoints.up('md')} {
            padding: 10px 24px;
          }
          padding: 0;
        }
      }
  `
)

interface FilterFormProps {
  onClose?: () => void
  isTableLoading?: boolean
}

const initFilterForm = {
  name: '',
  email: '',
  nationality: '',
  isPublished: ''
}

export const FilterForm: React.FC<FilterFormProps> = props => {
  const { isTableLoading } = props
  const { filterParamsObj, setSearchParams, cleanEmptyFilterData, removeAllParams, plainFilterKeys } =
    useFilterQueryUrl()

  // get Filter Data from URL
  const { section, getSectionById } = useSection() // get Setion obj by ID
  useEffect(() => {
    const newParams = plainFilterKeys(removeAllParams(filterParamsObj, 'page['))
    if (!isEmptyObject(filterParamsObj)) {
      if (newParams['userJobs.sectionId'] && newParams['userJobs.sectionId'] !== '') {
        getSectionById(newParams['userJobs.sectionId'] as string)
      }
      reset(mergeObjects(initFilterForm, newParams))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filter Form : Register FormHook
  const { register, control, handleSubmit, reset, setValue, getValues } = useForm<IFilterCandidateForm>({
    defaultValues: initFilterForm
  })

  const onSubmit: SubmitHandler<IFilterCandidateForm> = data => {
    if (isEmptyObject(data)) {
      setSearchParams()
      return
    }
    const _data = data

    // handle filter by Job ID
    if (_data.job && _data.job?.id) {
      delete _data.job
    } else {
      delete _data.userJobs
    }

    const filterData = cleanEmptyFilterData(_data)
    setSearchParams({ ...filterData, 'page[number]': '1' })
  }

  const handleClearFilter = () => {
    if (isEmptyObject(getValues())) return
    reset(initFilterForm)
    const clearButton = document.querySelector('.filter-form-wrap .MuiAutocomplete-clearIndicator')
    if (clearButton instanceof HTMLElement) {
      clearButton.click()
    }

    const newParams = removeAllParams(filterParamsObj, 'filter[')
    setSearchParams({ ...newParams, 'page[number]': '1' })
  }

  return (
    <StyledFilterForm className="filter-form-wrap">
      <div className="p-4">
        <h5 className="f12Regular uppercase letter tracking-[.2em] text-gray5 mb-4">{`${t(
          messages.filter_data()
        )}`}</h5>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <TextField {...register('name')} size="small" label={`${t(messages.Name())}`} variant="outlined" />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <TextField {...register('email')} size="small" label={`${t(messages.Email())}`} variant="outlined" />
              </FormControl>
            </div>
            <div className="flex flex-row gap-4">
              <FormControl id="section-selector" className="flex-1 int-group">
                <SectionSelector
                  control={control}
                  fieldName="job"
                  label={`${t(messages.JobSuitability())}`}
                  noOptionsText={`${t(messages.TypeToFind())}`}
                  onSelect={val => setValue('userJobs', { sectionId: val })}
                  defaultValue={(section as ISectionForm) || undefined}
                />
              </FormControl>

              <FormControl className="flex-1 int-group">
                <SelectList
                  control={control}
                  fieldName="userBio.jobLevel"
                  defaultValue=""
                  dataList={[{ label: 'All', value: '' }, ...jobLevels]}
                  label={`${t(messages.Level())}`}
                />
              </FormControl>
            </div>
            <div className="flex flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <Controller
                  name="nationality"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      options={convertSelectListData({ data: countries, textField: 'nation', valueField: 'code' })}
                      renderInput={params => (
                        <TextField {...params} size="small" label={`${t(messages.Nationality())}`} />
                      )}
                      onChange={(_, data) => onChange(data?.value)} // Should be Obj, not string
                      getOptionLabel={option => option.text || ''}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                    />
                  )}
                />
              </FormControl>

              <FormControl className="flex-1 int-group">
                <SelectList
                  control={control}
                  fieldName="isPublished"
                  dataList={[{ label: 'All', value: 'all' }, ...publishedStatus]}
                  label={`${t(messages.Status())}`}
                />
              </FormControl>
            </div>
            {/* BUTTONS */}
            <div className="flex flex-1 gap-4 int-group btn-group">
              <Button type="submit" size="lg" variant="primary" className="w-[140px] p-0" disabled={!!isTableLoading}>
                <span>{`${t(messages.filter())}`}</span>
              </Button>
              <Button
                onClick={handleClearFilter}
                size="lg"
                variant="outline-gray"
                className="w-[140px] p-0"
                disabled={!!isTableLoading}
              >
                <span>{`${t(messages.clear())}`}</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </StyledFilterForm>
  )
}
