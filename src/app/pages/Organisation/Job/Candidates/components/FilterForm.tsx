import React from 'react'
import { Autocomplete, FormControl, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { t } from 'i18next'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
// COMPs
import { Button } from '@/app/components/Button'
import { SelectList } from '@/app/components/Input/SelectList'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { countries } from '@/constants/JsonData/countries'
import { jobLevels } from '@/constants/JsonData/jobLevel'
import { orgJobCandidateStatus } from '@/constants/JsonData/status'
import { IFilterOrgJobCanForm } from '@/types/IOrgJob'
import { convertSelectListData } from '@/utils/helper.national'
import { isEmptyObject } from '@/utils/helper.object'
import { messages } from '../../messages'

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

const initFilterForm: IFilterOrgJobCanForm = {
  candidate: {
    name: '',
    email: '',
    nationality: '',
    currentLocation: '',
    userBio: {
      jobLevel: ''
    }
  },
  decision: ''
}

interface FilterFormProps {
  closeFilter: () => void
  isTableLoading?: boolean
}

export const FilterForm: React.FC<FilterFormProps> = props => {
  const { closeFilter, isTableLoading } = props

  // Filter Form : Register FormHook
  const { control, register, handleSubmit, reset, getValues } = useForm<IFilterOrgJobCanForm>()

  const { filterParamsObj, setSearchParams, cleanEmptyFilterData, removeAllParams } = useFilterQueryUrl()
  const onSubmit: SubmitHandler<IFilterOrgJobCanForm> = data => {
    if (isEmptyObject(data)) {
      setSearchParams()
      return
    }

    const _data = data

    // filter job level
    const jobLevelParam = { filterJobLevel: _data.candidate?.userBio.jobLevel }
    if (_data.candidate?.userBio.jobLevel) {
      delete _data.candidate?.userBio.jobLevel
    }

    const filterData = cleanEmptyFilterData(_data)
    const filterJobLevel = cleanEmptyFilterData(jobLevelParam, '')
    setSearchParams({ ...filterData, ...filterJobLevel, 'page[number]': '1' })
  }

  const handleClearFilter = () => {
    if (isEmptyObject(getValues())) return

    // reset form
    reset(initFilterForm)
    const clearNationalityBtn = document.querySelector('#nationality-section .MuiAutocomplete-clearIndicator')
    if (clearNationalityBtn instanceof HTMLElement) clearNationalityBtn.click()

    const newParams = removeAllParams(filterParamsObj, 'filter')
    setSearchParams({ ...newParams, 'page[number]': '1' })
  }

  return (
    <StyledFilterForm>
      <div className="p-4">
        <h5 className="f12Regular uppercase letter tracking-[.2em] text-gray5 mb-4">{`${t(
          messages.filter_data()
        )}`}</h5>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <TextField
                  size="small"
                  label={`${t(messages.CandidateName())}`}
                  variant="outlined"
                  {...register('candidate.name')}
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <TextField
                  size="small"
                  label={`${t(messages.Email())}`}
                  variant="outlined"
                  {...register('candidate.email')}
                />
              </FormControl>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <FormControl className="flex-1 int-group" id="nationality-section">
                <Controller
                  name="candidate.nationality"
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
                <TextField
                  {...register('candidate.currentLocation')}
                  size="small"
                  label={`${t(messages.Location())}`}
                  variant="outlined"
                />
              </FormControl>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <SelectList
                  control={control}
                  fieldName="candidate.userBio.jobLevel"
                  defaultValue=""
                  dataList={[{ label: 'All', value: '' }, ...jobLevels]}
                  label={`${t(messages.JobLevel())}`}
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <SelectList
                  control={control}
                  fieldName="decision"
                  defaultValue=""
                  dataList={orgJobCandidateStatus}
                  label={`${t(messages['Status of placement']())}`}
                />
              </FormControl>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-1 gap-4 int-group btn-group">
                <Button type="submit" size="lg" variant="primary" className="w-[140px]" disabled={!!isTableLoading}>
                  <span className="uppercase">{`${t(messages.filter())}`}</span>
                </Button>
                <Button
                  size="lg"
                  variant="outline-gray"
                  className="w-[140px]"
                  disabled={!!isTableLoading}
                  onClick={handleClearFilter}
                >
                  <span className="uppercase">{`${t(messages.clear())}`}</span>
                </Button>
                <Button size="lg" variant="outline-gray" className="w-[140px]" onClick={closeFilter}>
                  <span className="uppercase">{`${t(messages.close())}`}</span>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </StyledFilterForm>
  )
}
