// COMPs
import { useEffect } from 'react'
import { FormControl, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { t } from 'i18next'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import { SelectList } from '@/app/components/Input/SelectList'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { divisionSort } from '@/constants/JsonData/sortData'
import { IFilterDivisionForm } from '@/types/IJob'
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

const initFilterForm = {
  title: '',
  sort: ''
}

export const FilterForm: React.FC = () => {
  const { filterParamsObj, setSearchParams, cleanEmptyFilterData, plainFilterKeys, removeAllParams } =
    useFilterQueryUrl()

  // get Filter Data from URL
  useEffect(() => {
    if (!isEmptyObject(filterParamsObj)) {
      const newParams = plainFilterKeys(removeAllParams(filterParamsObj, 'page['))
      reset(mergeObjects(initFilterForm, newParams))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filter Form : Register FormHook
  const { register, control, handleSubmit, reset, getValues } = useForm<IFilterDivisionForm>({
    defaultValues: initFilterForm
  })

  const onSubmit: SubmitHandler<IFilterDivisionForm> = data => {
    if (isEmptyObject(data)) {
      setSearchParams()
      return
    }
    const _sort = data.sort
    const _data = data
    if (_sort && _data.sort) {
      delete _data.sort
      const filterData = cleanEmptyFilterData(_data)
      setSearchParams({ ...filterData, sort: _sort })
    } else {
      const filterData = cleanEmptyFilterData(_data)
      setSearchParams(filterData)
    }
  }

  const handleClearFilter = () => {
    if (isEmptyObject(getValues())) return
    reset(initFilterForm)
    setSearchParams()
  }

  return (
    <StyledFilterForm className="filter-form-wrap">
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <h5 className="f12Regular uppercase letter tracking-[.2em] text-gray7 mb-4">{`${t(
              messages.filter_data()
            )}`}</h5>
            <FormControl className="w-full int-group">
              <TextField
                {...register('title')}
                size="small"
                label={t(messages['Division title']())}
                variant="outlined"
              />
            </FormControl>
          </div>
          <div className="flex-1">
            <h5 className="f12Regular uppercase letter tracking-[.2em] text-gray7 mb-4">{`${t(
              messages['Sort by']()
            )}`}</h5>
            <FormControl className="w-full int-group">
              <SelectList
                control={control}
                fieldName="sort"
                dataList={[{ label: 'None', value: '' }, ...divisionSort]}
                label={t(messages['Department name A-Z']())}
              />
            </FormControl>
          </div>
        </div>
        <div className="flex flex-1 gap-4 int-group btn-group pt-4">
          <Button onClick={handleSubmit(onSubmit)} size="lg" variant="primary" className="w-full md:w-[140px] p-0 mb-2">
            <span>{`${t(messages.filter())}`}</span>
          </Button>
          <Button
            onClick={handleClearFilter}
            size="lg"
            variant="outline-gray"
            className="w-full md:w-[140px] p-0 md:ml-4"
          >
            <span>{`${t(messages.clear())}`}</span>
          </Button>
        </div>
      </div>
    </StyledFilterForm>
  )
}
