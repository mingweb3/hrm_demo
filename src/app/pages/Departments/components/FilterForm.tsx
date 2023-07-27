import { useEffect } from 'react'
import { FormControl, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { t } from 'i18next'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import DivisionSelector from '@/app/components/Input/DivisionSelector'
import SectionSelector from '@/app/components/Input/SectionSelector'
import { SelectList } from '@/app/components/Input/SelectList'
import useDivision from '@/hooks/useDivision'
import useSection from '@/hooks/useSection'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { departmentSort } from '@/constants/JsonData/sortData'
import { IDivisionForm, IFilterDeForm, ISectionForm } from '@/types/IJob'
import { isEmptyObject, mergeObjects } from '@/utils/helper.object'
import { messages } from '../messages'

const StyledFilterForm = styled('div')(
  ({ theme }) => `
  border-top: 1px solid ${theme.palette.bg};
`
)

const initFilterForm = {
  categoryTitle: '',
  sectionId: '',
  divisionId: '',
  sort: ''
}

export const FilterForm: React.FC = () => {
  const { filterParamsObj, setSearchParams, cleanEmptyFilterData, plainFilterKeys, removeAllParams } =
    useFilterQueryUrl()

  // Get Filter Data from URL
  const { division, getDivision } = useDivision() // get Division obj by ID
  const { section, getSectionById } = useSection() // get Setion obj by ID
  useEffect(() => {
    const newParams = plainFilterKeys(removeAllParams(filterParamsObj, 'page['))
    if (!isEmptyObject(filterParamsObj)) {
      // - Detecting Division
      if (newParams.divisionId && newParams.divisionId !== '') {
        getDivision(newParams.divisionId as string)
      }
      if (newParams['sections.id'] && newParams['sections.id'] !== '') {
        getSectionById(newParams['sections.id'] as string)
      }
      reset(mergeObjects(initFilterForm, newParams))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filter Form : Register FormState
  const { register, control, handleSubmit, reset, getValues, setValue } = useForm<IFilterDeForm>({
    defaultValues: initFilterForm
  })

  const onSubmit: SubmitHandler<IFilterDeForm> = data => {
    if (isEmptyObject(data)) {
      setSearchParams()
      return
    }
    const _sort = data.sort
    const _data = data
    if (_data.division) {
      delete _data.division
    }
    if (_data.sections && _data.sections?.title) {
      delete _data.sections.title
      delete _data.sectionId
    }
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
    const clearSectionBtn = document.querySelector('#section-selector .MuiAutocomplete-clearIndicator')
    const clearDivisionBtn = document.querySelector('#division-selector .MuiAutocomplete-clearIndicator')
    if (clearSectionBtn instanceof HTMLElement) clearSectionBtn.click()
    if (clearDivisionBtn instanceof HTMLElement) clearDivisionBtn.click()

    setSearchParams()
  }

  return (
    <StyledFilterForm className="filter-form-wrap">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <h5 className="basis-1/2 f12Regular uppercase letter tracking-[.2em] text-gray3">
            {`${t(messages.filterData())}`}
          </h5>
          <h5 className="basis-1/2 f12Regular uppercase letter tracking-[.2em] text-gray3">
            {`${t(messages.SortBy())}`}
          </h5>
        </div>

        <div className="flex flex-row gap-4">
          <FormControl className="flex-1 int-group">
            <TextField
              {...register('categoryTitle')}
              size="small"
              label={`${t(messages.DepartmentTitle())}`}
              variant="outlined"
            />
          </FormControl>
          {/* departmentNameSort */}
          <FormControl className="flex-1 int-group">
            <SelectList
              control={control}
              fieldName="sort"
              dataList={[{ label: 'None', value: '' }, ...departmentSort]}
              label={t(messages['Department name A-Z']())}
            />
          </FormControl>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <FormControl id="division-selector" className="basis-1/2 int-group">
            <DivisionSelector
              control={control}
              fieldName="division"
              label={`${t(messages.ChooseDivision())}`}
              noOptionsText={`${t(messages.TypeToFind())}`}
              onSelect={val => setValue('divisionId', val)}
              defaultValue={(division as IDivisionForm) || undefined}
            />
          </FormControl>

          <div className="basis-1/2 flex gap-4 btn-group">
            <Button onClick={handleSubmit(onSubmit)} size="lg" variant="primary" className="w-[140px]">
              <span>{`${t(messages.filter())}`}</span>
            </Button>
            <Button onClick={handleClearFilter} size="lg" variant="outline-gray" className="w-[140px]">
              <span>{`${t(messages.clear())}`}</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <FormControl id="section-selector" className="basis-1/2 int-group">
            <SectionSelector
              control={control}
              fieldName="sections"
              label={`${t(messages.ChooseSection())}`}
              noOptionsText={`${t(messages.TypeToFind())}`}
              onSelect={val => setValue('sectionId', val)}
              defaultValue={(section as ISectionForm) || undefined}
            />
          </FormControl>

          <div className="basis-1/2 flex gap-4 btn-group" />
        </div>
      </div>
    </StyledFilterForm>
  )
}
