import React from 'react'
import {
  // Autocomplete,
  FormControl,
  TextField
} from '@mui/material'
import { styled } from '@mui/material/styles'
import dayjs from 'dayjs'
import { t } from 'i18next'
import {
  // Controller,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { Button } from '@/app/components/Button'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { IFilterOrgJobForm, IQueryParamsOrgJobs } from '@/types/IOrgJob'
import { isEmptyObject } from '@/utils/helper.object'
// import { adminUsers } from '@/fake-data/AdminUsers'
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

const initFilterForm: IFilterOrgJobForm = {
  title: '',
  department: {
    categoryTitle: ''
  },
  minSalary: '',
  maxSalary: '',
  createBy: '',
  modifiedBy: '',
  createdDateForm: '',
  createdDateTo: '',
  startDate: '',
  endDate: ''
}

interface FilterFormProps {
  closeFilter: () => void
  isTableLoading?: boolean
}

export const FilterForm: React.FC<FilterFormProps> = props => {
  const { closeFilter, isTableLoading } = props
  const { filterParamsObj, setSearchParams, cleanEmptyFilterData, removeAllParams } = useFilterQueryUrl()

  // Filter Form : Register FormHook
  const { register, handleSubmit, reset, getValues } = useForm<IFilterOrgJobForm>({
    defaultValues: initFilterForm
  })

  const onSubmit: SubmitHandler<IFilterOrgJobForm> = data => {
    if (isEmptyObject(data)) {
      setSearchParams()
      return
    }

    const _data = data

    // handle filter by dates
    const dateParams: IQueryParamsOrgJobs = {
      filterCreatedAtFrom: _data.createdDateForm ? dayjs(_data.createdDateForm).format('YYYY-MM-DD') : '',
      filterCreatedAtTo: _data.createdDateTo ? dayjs(_data.createdDateTo).format('YYYY-MM-DD') : '',
      filterStartDate: _data.startDate ? dayjs(_data.startDate).format('YYYY-MM-DD') : '',
      filterEndDate: _data.endDate ? dayjs(_data.endDate).format('YYYY-MM-DD') : ''
    }
    if (_data.createdDateForm) {
      delete _data.createdDateForm
    }
    if (_data.createdDateTo) {
      delete _data.createdDateTo
    }
    if (_data.startDate) {
      delete _data.startDate
    }
    if (_data.endDate) {
      delete _data.endDate
    }

    // handle filter by status
    const qsStatus = filterParamsObj['filter[status]']
    const statusParams: IQueryParamsOrgJobs = {
      status: qsStatus && qsStatus !== '' ? qsStatus : ''
    }

    const filterData = cleanEmptyFilterData(_data)
    const filterDataByDates = cleanEmptyFilterData(dateParams, '')
    const filterDataByStatus = cleanEmptyFilterData(statusParams)

    setSearchParams({ ...filterData, ...filterDataByDates, ...filterDataByStatus, 'page[number]': '1' })
  }

  const handleClearFilter = () => {
    if (isEmptyObject(getValues())) return

    // reset form
    reset(initFilterForm)

    const clearCreateByBtn = document.querySelector('#createby-section .MuiAutocomplete-clearIndicator')
    const clearModifiedByBtn = document.querySelector('#modifiedBy-section .MuiAutocomplete-clearIndicator')
    if (clearCreateByBtn instanceof HTMLElement) clearCreateByBtn.click()
    if (clearModifiedByBtn instanceof HTMLElement) clearModifiedByBtn.click()

    const newParams = removeAllParams(filterParamsObj, 'filter')
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
                <TextField
                  size="small"
                  label={`${t(messages['Job title']())}`}
                  variant="outlined"
                  {...register('title')}
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <TextField
                  size="small"
                  label={`${t(messages.Department())}`}
                  variant="outlined"
                  {...register('department.categoryTitle')}
                />
              </FormControl>
            </div>
            <div className="flex flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <TextField
                  type="date"
                  {...register('createdDateForm')}
                  size="small"
                  label={`${t(messages.created_date_from())}`}
                  variant="outlined"
                  focused
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <TextField
                  type="date"
                  {...register('createdDateTo')}
                  size="small"
                  label={`${t(messages.created_date_to())}`}
                  variant="outlined"
                  focused
                />
              </FormControl>
            </div>

            <div className="flex flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <TextField
                  type="date"
                  {...register('startDate')}
                  size="small"
                  label={`${t(messages['Start date']())}`}
                  variant="outlined"
                  focused
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <TextField
                  type="date"
                  {...register('endDate')}
                  size="small"
                  label={`${t(messages['Closed date']())}`}
                  variant="outlined"
                  focused
                />
              </FormControl>
            </div>
            <div className="flex flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <TextField
                  size="small"
                  label={`${t(messages['Min salary']())}`}
                  variant="outlined"
                  {...register('minSalary')}
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <TextField
                  size="small"
                  label={`${t(messages['Max salary']())}`}
                  variant="outlined"
                  {...register('maxSalary')}
                />
              </FormControl>
            </div>
            {/* <div className="flex flex-row gap-4">
              <FormControl className="flex-1 int-group" id="createby-section">
                <Controller
                  name="createBy"
                  control={control}
                  render={() => (
                    <Autocomplete
                      disablePortal
                      id="createby-select-box"
                      options={adminUsers}
                      renderInput={params => (
                        <TextField {...params} size="small" label={`${t(messages['Created by']())}`} />
                      )}
                      onChange={(_, data) => {
                        setValue('createBy', data?.label)
                      }}
                    />
                  )}
                />
              </FormControl>
              <FormControl className="flex-1 int-group" id="modifiedBy-section">
                <Controller
                  name="modifiedBy"
                  control={control}
                  render={() => (
                    <Autocomplete
                      disablePortal
                      id="modifiedby-select-box"
                      options={adminUsers}
                      renderInput={params => (
                        <TextField {...params} size="small" label={`${t(messages['Modified by']())}`} />
                      )}
                      onChange={(_, data) => {
                        setValue('modifiedBy', data?.label)
                      }}
                    />
                  )}
                />
              </FormControl>
            </div> */}
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
