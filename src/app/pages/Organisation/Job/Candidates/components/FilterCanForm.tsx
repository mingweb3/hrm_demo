import React, { useEffect, useState } from 'react'
import { Autocomplete, FormControl, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
// COMPs
import { Button } from '@/app/components/Button'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import { CurrencyField } from '@/app/components/Input/CurrencyField'
import DepartmentSelector from '@/app/components/Input/DepartmentSelector'
import { SelectList } from '@/app/components/Input/SelectList'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { countries } from '@/constants/JsonData/countries'
import { jobLevels } from '@/constants/JsonData/jobLevel'
import { IErrorForm } from '@/types/IErrorForm'
import { IDepartmentForm, ISkillForm } from '@/types/IJob'
import { IOrgJob } from '@/types/IOrgJob'
import { IFilterCanForm } from '@/types/IOrgJobCandidate'
import { convertSelectListData } from '@/utils/helper.national'
import { isEmptyObject } from '@/utils/helper.object'
import { dirtyValues } from '@/utils/helpers'
import OrgSkillIpt from '../../components/OrgSkillIpt'
import { messages } from '../../messages'

const StyledFilterCanForm = styled('div')(
  ({ theme }) => `
    .job-title {
        color: ${theme.palette.blueHover};
    }
  `
)

const initAssignForm: IFilterCanForm = {
  name: '',
  stdDepartment: { id: '', title: '' },
  department: {
    categoryTitle: ''
  },
  skillIds: [],
  skills: [],
  candidateSkills: '',
  userBio: {
    jobLevel: '',
    expSalary: 0
  },
  currentLocation: '',
  email: '',
  nationality: ''
}

interface FilterCanFormProps {
  onChange: (candidate: IFilterCanForm) => void
  defaultValue: IFilterCanForm | null
  currentJob?: IOrgJob
  isLoading: boolean
  errorForm:
    | {
        error: IErrorForm
      }
    | undefined
}

export const FilterCanForm: React.FC<FilterCanFormProps> = ({
  onChange,
  defaultValue,
  currentJob,
  isLoading,
  errorForm
}) => {
  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // Assign Candidate Form : Register FormHook
  const {
    control,
    watch,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { dirtyFields }
  } = useForm<IFilterCanForm>()

  const { fields: skills, append, remove } = useFieldArray({ name: 'skills', control, keyName: 'key' })

  // watch: department change
  const watchDeparment = watch('stdDepartment', undefined)

  // Set dependent Department to SKILLs
  const [stdDepartment, setStdDepartment] = useState<IDepartmentForm>()
  useEffect(() => {
    setStdDepartment({
      id: watchDeparment?.id?.toString() || '',
      categoryTitle: watchDeparment?.title?.toString() || ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDeparment])

  // Load Data to FORM on Init Comp
  useEffect(() => {
    if (defaultValue) {
      reset(defaultValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue])

  // Action: selected skills
  const handleSelectSkills = (data: ISkillForm | null) => {
    if (data === null) return
    // check skill is exists
    if (skills.findIndex(o => Number(o.id) === Number(data.id)) !== -1) {
      enqueueSnackbar(`${t(messages.SkillExists())}`, { variant: 'error' })
      return
    }

    append(data)
  }

  // Action: Remove skills
  const onRemoveSkill = async (id: string | number) => {
    const tempSkills = [...skills]
    const idxSkill = tempSkills.findIndex(o => o.id === id)

    if (idxSkill !== -1) {
      remove(idxSkill)
    }
  }

  // Action: Submit form
  const onSubmit: SubmitHandler<IFilterCanForm> = data => {
    if (isEmptyObject(data)) return
    const updatedData = dirtyValues(dirtyFields, data)

    updatedData.skillIds = skills.length > 0 ? skills.map(o => o.id) : []
    if (updatedData.candidateSkills) {
      delete updatedData.candidateSkills
    }

    // merge data
    onChange(Object.assign(updatedData, data))
  }

  // Action: Reset form
  const resetForm = () => {
    if (isEmptyObject(getValues())) return

    reset(initAssignForm)
    setStdDepartment({
      id: '',
      categoryTitle: ''
    })
    const clearNationalityBtn = document.querySelector('#assign-nationality .MuiAutocomplete-clearIndicator')
    if (clearNationalityBtn instanceof HTMLElement) clearNationalityBtn.click()
  }

  return (
    <StyledFilterCanForm>
      <div className="f14Regular">
        {t(messages['Current job']())}: #{currentJob?.attributes.UUID}
      </div>
      <h3 className="f20Bold job-title mb-4">{currentJob?.attributes?.title}</h3>
      <h5 className="f12Regular uppercase letter tracking-[.2em] text-gray5 mb-4">{`${t(
        messages['Find Your Candidate']()
      )}`}</h5>
      {/* FORM */}
      {errorForm && <ErrorForm error={errorForm?.error} />}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <FormControl className="flex-1 int-group">
              <TextField
                size="small"
                label={`${t(messages.CandidateName())}`}
                variant="outlined"
                {...register('name')}
              />
            </FormControl>
            <FormControl className="flex-1 int-group">
              <TextField {...register('email')} size="small" label={`${t(messages.Email())}`} variant="outlined" />
            </FormControl>
          </div>
          <FormControl className="w-full int-group sm:w-[50%] pr-2">
            <DepartmentSelector
              control={control}
              fieldName="stdDepartment"
              label="Choose department"
              defaultValue={defaultValue?.stdDepartment as IDepartmentForm}
            />
          </FormControl>
          <FormControl className="w-full int-group pr-3">
            <OrgSkillIpt
              hideBtnCreateNew
              department={stdDepartment}
              onSelect={handleSelectSkills}
              skills={skills}
              onRemove={onRemoveSkill}
              control={control}
              fieldName="candidateSkills"
            />
          </FormControl>
          <div className="flex flex-col sm:flex-row gap-4">
            <FormControl className="flex-1 int-group">
              <SelectList
                control={control}
                fieldName="userBio.jobLevel"
                defaultValue=""
                dataList={[{ label: 'All', value: '' }, ...jobLevels]}
                label={`${t(messages.JobLevel())}`}
              />
            </FormControl>
            <FormControl className="flex-1 int-group">
              <CurrencyField
                control={control}
                fieldName="userBio.expSalary"
                label={`${t(messages.ExpectedSalary())}`}
              />
            </FormControl>
          </div>
          <div className="flex flex-col sm:flex-row gap-4" id="assign-nationality">
            <FormControl className="flex-1 int-group">
              <Controller
                name="nationality"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={convertSelectListData({ data: countries, textField: 'nation', valueField: 'code' })}
                    renderInput={params => (
                      <TextField {...params} size="small" label={`${t(messages.Nationality())}`} />
                    )}
                    onChange={(_, data) => onChange(data?.value)} // Should be Obj, not string
                    getOptionLabel={option => option.text || ''}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={{
                      text: countries.find(item => item.code === value)?.nationality,
                      value
                    }}
                  />
                )}
              />
            </FormControl>
            <FormControl className="flex-1 int-group">
              <TextField
                {...register('currentLocation')}
                size="small"
                label={`${t(messages.Location())}`}
                variant="outlined"
              />
            </FormControl>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            size="lg"
            variant="success"
            className="w-full sm:w-[180px]"
            onClick={handleSubmit(onSubmit)}
          >
            {!isLoading && <span className="uppercase">{`${t(messages['Find Candidate']())}`}</span>}
            {isLoading && <LoadingBtn />}
          </Button>
          <Button size="lg" variant="white" className="w-full sm:w-[140px]" onClick={resetForm}>
            <span className="uppercase">{`${t(messages.Reset())}`}</span>
          </Button>
        </div>
      </div>
    </StyledFilterCanForm>
  )
}
