import * as React from 'react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Autocomplete, FormControl, TextField } from '@mui/material'
import { styled } from '@mui/system'
import { useMutation } from '@tanstack/react-query'
import { t } from 'i18next'
// COMPS
import { useSnackbar } from 'notistack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import { SelectList } from '@/app/components/Input/SelectList'
import WToolBox from '@/app/components/WCard/WToolBox'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { Button } from '@/components/Button'
// Helper
import { createCandidateFn } from '@/apis/candidate.api'
import { countries } from '@/constants/JsonData/countries'
import { gender } from '@/constants/JsonData/gender'
import { passTypes } from '@/constants/JsonData/passType'
import { EMAIL_REGEX } from '@/constants/form/validation'
import { ICandidateForm } from '@/types/ICandidate'
import { IErrorForm } from '@/types/IErrorForm'
import { convertSelectListData } from '@/utils/helper.national'
import { isEmptyObject } from '@/utils/helper.object'
import { isAxiosError } from '@/utils/helpers'
import { messages } from '../../messages'

const StyledForm = styled('div')(``)

const initCreateCandidateForm: ICandidateForm = {
  name: '',
  email: '',
  contactNum: '',
  nationalId: '',
  nationality: '',
  gender: '',
  yob: '1990',
  currentLocation: '',
  areaOfResidence: '',
  currentPassType: ''
}

const CreateCandidateForm: React.FC = () => {
  const navigate = useNavigate()

  const cancelCurPage = () => {
    navigate('/admin/candidates')
  }

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Create Candidate: Mutation
  const {
    mutate: createCandidate,
    isLoading,
    error
  } = useMutation((formData: ICandidateForm) => createCandidateFn(formData), {
    onSuccess: data => {
      reset(initCreateCandidateForm)
      enqueueSnackbar(t(messages.CreateNewSuccess()), { variant: 'success' }) // ADD Notify
      navigate(`/admin/candidates/${data.attributes.UUID}/info`)
    }
  })

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  // New Candidate Form : Register FormState
  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ICandidateForm>()

  const onSubmit: SubmitHandler<ICandidateForm> = data => {
    if (isEmptyObject(data)) return
    // Request API
    createCandidate({ ...data, isPublished: true })
  }

  return (
    <StyledForm>
      <form>
        <div className="flex flex-col gap-4">
          <WToolBox className={`p-4 text-right flex justify-between ${isLoading ? 'section-loading' : ''}`}>
            <Button onClick={cancelCurPage} variant="outline">
              <span className="uppercase">{t(messages.cancel())}</span>
            </Button>
            <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
              {!isLoading && <span className="uppercase">{t(messages.submit())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </WToolBox>
          {/* FORM */}
          {errorForm && <ErrorForm error={errorForm?.error} />}
          <FormControl className="flex-1 int-group">
            <TextField
              {...register('name', { required: true })}
              size="small"
              label={`${t(messages.CandidateName())}`}
              variant="outlined"
              error={!!errors.name}
            />
          </FormControl>
          <div className="flex flex-col sm:flex-row gap-4">
            <FormControl className="flex-1 int-group">
              <TextField
                {...register('contactNum', { required: true })}
                size="small"
                label={`${t(messages.ContactNumber())}`}
                variant="outlined"
                error={!!errors.contactNum}
              />
            </FormControl>
            <FormControl className="flex-1 int-group">
              <TextField
                {...register('email', { pattern: EMAIL_REGEX, required: true })}
                size="small"
                label={`${t(messages.Email())}`}
                variant="outlined"
                error={!!errors.email}
              />
            </FormControl>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
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
              <TextField
                {...register('nationalId')}
                error={!!errors.nationalId}
                size="small"
                label={`${t(messages.NationalId())}`}
                variant="outlined"
              />
            </FormControl>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <FormControl className="flex-1 int-group">
              <SelectList
                control={control}
                fieldName="gender"
                dataList={gender}
                defaultValue=""
                label={`${t(messages.Gender())}`}
              />
            </FormControl>
            <FormControl className="flex-1 int-group">
              <TextField
                type="number"
                size="small"
                label={`${t(messages.YearOfBirth())}`}
                {...register('yob', {
                  min: 1940,
                  max: new Date().getFullYear()
                })}
                error={!!errors.yob}
                variant="outlined"
              />
            </FormControl>
          </div>
          <div className="flex gap-4">
            <FormControl className="flex-1 int-group">
              <SelectList
                control={control}
                fieldName="currentPassType"
                dataList={passTypes}
                defaultValue="none"
                label={`${t(messages.currentPassType())}`}
              />
            </FormControl>
            <FormControl className="flex-1 int-group hidden sm:flex" />
          </div>
          <div className="flex gap-4">
            <FormControl className="flex-1 int-group">
              <TextField
                {...register('currentLocation')}
                size="small"
                label={`${t(messages.CurrentLocation())}`}
                variant="outlined"
              />
            </FormControl>
            <FormControl className="flex-1 int-group hidden sm:flex" />
          </div>
          <div className="flex gap-4">
            <FormControl className="flex-1 int-group">
              <TextField
                {...register('areaOfResidence')}
                size="small"
                label={`${t(messages.AreaOfResidence())}`}
                variant="outlined"
              />
            </FormControl>
            <FormControl className="flex-1 int-group hidden sm:flex" />
          </div>

          {/* END: FORM */}
          <WToolBox className={`p-4 text-right flex justify-between ${isLoading ? 'section-loading' : ''}`}>
            <Button onClick={cancelCurPage} variant="outline">
              <span className="uppercase">{t(messages.cancel())}</span>
            </Button>
            <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
              {!isLoading && <span className="uppercase">{t(messages.submit())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </WToolBox>
        </div>
      </form>
    </StyledForm>
  )
}

export default CreateCandidateForm
