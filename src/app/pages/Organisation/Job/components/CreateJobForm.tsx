import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Autocomplete, FormControl, TextField } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import { CurrencyField } from '@/app/components/Input/CurrencyField'
import DepartmentSelector from '@/app/components/Input/DepartmentSelector'
import WCollapseBox from '@/app/components/WCard/WCollapseBox'
import WToolBox from '@/app/components/WCard/WToolBox'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { Button } from '@/components/Button'
import { createOrgJobFn } from '@/apis/org.job.api'
import { currencies } from '@/constants/JsonData/countries'
import { NOT_EMPTY } from '@/constants/form/validation'
import { IErrorForm } from '@/types/IErrorForm'
import { IOrgJobForm } from '@/types/IOrgJob'
import { convertSelectListData } from '@/utils/helper.national'
import { isEmptyObject } from '@/utils/helper.object'
import { isAxiosError } from '@/utils/helpers'
import { messages } from '../messages'

const currencyDefault = { value: 'USD', text: 'United States dollar' }

interface CreateJobFormProps {
  orgId: string
}

const CreateJobForm: React.FC<CreateJobFormProps> = ({ orgId }) => {
  const navigate = useNavigate()

  const cancelCurPage = () => {
    navigate(`/admin/organizations/${orgId}/jobs`)
  }

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Create Candidate: Mutation
  const {
    mutate: createOrgJob,
    isLoading,
    error
  } = useMutation((formData: IOrgJobForm) => createOrgJobFn(formData), {
    onSuccess: data => {
      enqueueSnackbar(t(messages.CreateNewSuccess()), { variant: 'success' }) // ADD Notify
      const { attributes } = data
      navigate(`/admin/organizations/${orgId}/jobs/${attributes.UUID}`)
    }
  })

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  // New Org Job Form : Register FormState
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IOrgJobForm>()

  const onSubmit: SubmitHandler<IOrgJobForm> = data => {
    if (isEmptyObject(data)) return
    // Request API
    const _data = data
    if (_data.startDate) {
      _data.startDate = dayjs(_data.startDate).format('YYYY-MM-DD HH:mm:ss')
    }
    if (_data.endDate) {
      _data.endDate = dayjs(_data.endDate).format('YYYY-MM-DD HH:mm:ss')
    }
    if (_data.stdCurrency) {
      delete _data.stdCurrency
    } else {
      _data.currency = 'USD'
    }
    if (_data.stdDepartment) delete _data.stdDepartment
    _data.orgUUID = orgId
    createOrgJob(_data)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <WToolBox className="p-4">
          <div className="flex items-center justify-between gap-2">
            <Button onClick={cancelCurPage} variant="outline">
              <span className="uppercase">{t(messages.cancel())}</span>
            </Button>
            <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
              {!isLoading && <span className="uppercase">{t(messages.Submit())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </div>
        </WToolBox>
        {/* FORM */}
        {errorForm && <ErrorForm error={errorForm?.error} />}
        <div className="flex flex-col gap-4">
          <FormControl className="flex-1 int-group">
            <TextField
              {...register('title', { required: true, pattern: NOT_EMPTY })}
              error={!!errors.title}
              size="small"
              label={`${t(messages['Job title']())}`}
              variant="outlined"
            />
          </FormControl>
          <div className="flex flex-col gap-4">
            <FormControl className="w-[50%] int-group pr-2">
              <TextField
                type="date"
                {...register('startDate', { required: true })}
                error={!!errors.startDate}
                size="small"
                label="Start date"
                variant="outlined"
                focused
              />
            </FormControl>
            <FormControl className="w-[50%] int-group pr-2">
              <TextField
                type="date"
                {...register('endDate', { required: true })}
                error={!!errors.endDate}
                size="small"
                label="End date"
                variant="outlined"
                focused
              />
            </FormControl>
          </div>
          <WCollapseBox title={`${t(messages.DepartmentSkills())}`} isOpenCollapse>
            <div className="flex flex-row gap-4 pt-4">
              <FormControl className="basis-1/2 int-group pr-2">
                <DepartmentSelector
                  control={control}
                  fieldName="stdDepartment"
                  label="Choose department"
                  rules={{ required: true }}
                  error={!!errors.stdDepartment}
                  onSelect={val => setValue('departmentId', val)}
                />
              </FormControl>
            </div>
          </WCollapseBox>
          <WCollapseBox title={`${t(messages.Salary())}`} isOpenCollapse>
            <div className="flex flex-row gap-4 pt-4">
              <FormControl className="int-group flex-1">
                <CurrencyField control={control} fieldName="minSalary" label={`${t(messages['Min salary']())}`} />
              </FormControl>
              <FormControl className="int-group flex-1">
                <CurrencyField control={control} fieldName="maxSalary" label={`${t(messages['Max salary']())}`} />
              </FormControl>
            </div>
            <div className="flex flex-row gap-4 pt-4">
              <FormControl className="w-[40%] int-group">
                <Controller
                  name="stdCurrency"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      options={convertSelectListData({ data: currencies, textField: 'name', valueField: 'label' })}
                      renderInput={params => <TextField {...params} size="small" label={`${t(messages.Currency())}`} />}
                      getOptionLabel={option => `${option.value} - ${option.text}` || ''}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      onChange={(_, data) => {
                        onChange(data)
                        setValue('currency', data?.value)
                      }}
                      defaultValue={currencyDefault}
                    />
                  )}
                />
              </FormControl>
            </div>

            <div className="flex flex-row gap-4 pt-4">
              <FormControl className="w-[40%] int-group">
                <TextField
                  {...register('numberOpen', { required: true, min: 1 })}
                  error={!!errors.numberOpen}
                  type="number"
                  size="small"
                  label={`${t(messages['Number of openings']())}`}
                  variant="outlined"
                />
              </FormControl>
            </div>
          </WCollapseBox>
        </div>
        {/* END: FORM */}
        <WToolBox className="p-4">
          <div className="flex items-center justify-between gap-2">
            <Button onClick={cancelCurPage} variant="outline">
              <span className="uppercase">{t(messages.cancel())}</span>
            </Button>
            <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
              {!isLoading && <span className="uppercase">{t(messages.Submit())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </div>
        </WToolBox>
      </div>
    </>
  )
}

export default CreateJobForm
