import * as React from 'react'
import { Autocomplete, FormControl, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { t } from 'i18next'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import { SelectList } from '@/app/components/Input/SelectList'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { orgStatus } from '@/constants/JsonData/status'
import { IFilterOrgForm } from '@/types/IOrganization'
import { isEmptyObject } from '@/utils/helper.object'
import { adminUsers } from '@/fake-data/AdminUsers'
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

const initFilterForm = {
  companyName: '',
  contactEmail: '',
  contactNum: '',
  status: 'active'
}

interface FilterFormProps {
  isTableLoading?: boolean
}

export const FilterForm: React.FC<FilterFormProps> = ({ isTableLoading }) => {
  const { filterParamsObj, setSearchParams, cleanEmptyFilterData, removeAllParams } = useFilterQueryUrl()

  // Filter Form : Register FormHook
  const { register, control, handleSubmit, reset, getValues } = useForm<IFilterOrgForm>({
    defaultValues: initFilterForm
  })

  const onSubmit: SubmitHandler<IFilterOrgForm> = data => {
    if (isEmptyObject(data)) {
      setSearchParams()
      return
    }
    const _data = data

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
                <TextField
                  {...register('companyName')}
                  size="small"
                  label={`${t(messages['Company name']())}`}
                  variant="outlined"
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <Autocomplete
                  disablePortal
                  id="countries-select-box"
                  options={adminUsers}
                  renderInput={params => <TextField {...params} size="small" label={`${t(messages.department())}`} />}
                />
              </FormControl>
            </div>
            <div className="flex flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <TextField
                  {...register('contactEmail')}
                  size="small"
                  label={`${t(messages['Contact email']())}`}
                  variant="outlined"
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <SelectList
                  control={control}
                  fieldName="status"
                  defaultValue=""
                  dataList={orgStatus}
                  label={`${t(messages.status())}`}
                />
              </FormControl>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <TextField
                  {...register('contactNum')}
                  size="small"
                  label={`${t(messages['Contact number']())}`}
                  variant="outlined"
                />
              </FormControl>

              <div className="flex flex-1 gap-4 int-group btn-group">
                <Button type="submit" size="lg" variant="primary" className="w-[140px]" disabled={!!isTableLoading}>
                  <span className="uppercase">{`${t(messages.filter())}`}</span>
                </Button>
                <Button
                  onClick={handleClearFilter}
                  size="lg"
                  variant="outline-gray"
                  className="w-[140px]"
                  disabled={!!isTableLoading}
                >
                  <span className="uppercase">{`${t(messages.clear())}`}</span>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </StyledFilterForm>
  )
}
