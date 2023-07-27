// COMPs
import React, { useEffect, useMemo } from 'react'
import { Autocomplete, FormControl, TextField } from '@mui/material'
import { styled } from '@mui/system'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import WToolBox from '@/app/components/WCard/WToolBox'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { updatePrincipleFn } from '@/apis/principle.api'
import { countries } from '@/constants/JsonData/countries'
import { IErrorForm } from '@/types/IErrorForm'
import { IPrinciple, IPrincipleForm } from '@/types/IPrinciple'
import { convertSelectListData } from '@/utils/helper.national'
import { isEmptyObject } from '@/utils/helper.object'
import { messages } from '../messages'

const StyledForm = styled('form')(``)

const initForm = {
  companyName: '',
  buzRegisterNumber: '',
  buzAddress: '',
  billingAddress: ''
}

interface PrincipleFormProps {
  data: IPrinciple
}

export const PrincipleForm: React.FC<PrincipleFormProps> = ({ data }) => {
  const { attributes } = data

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Update Principle: Mutation
  const {
    mutate: updatePrinciple,
    isLoading,
    error
  } = useMutation((formData: IPrincipleForm) => updatePrincipleFn(data.attributes.UUID || '', formData), {
    onSuccess: data => {
      reset(data.attributes)
      enqueueSnackbar(t(messages.UpdateSuccess(), { UID: attributes.UUID }), { variant: 'success' })
    }
  })

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  // Submit Principle Form : Register FormHook
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IPrincipleForm>({
    defaultValues: initForm
  })

  const onSubmit: SubmitHandler<IPrincipleForm> = data => {
    if (isLoading) return
    if (isEmptyObject(data)) return
    const _data = data

    // Convert operationContriesId
    if (_data.country) {
      _data.operationContriesId = _data.country.value
      delete _data.country
    }

    updatePrinciple(_data)
  }

  // LOAD DATA FORM
  useEffect(() => {
    reset(attributes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <StyledForm>
      <div className="flex flex-col gap-4">
        <WToolBox className="p-4">
          <div className="flex items-center justify-end gap-2">
            <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
              {!isLoading && <span className="uppercase">{t(messages.Submit())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </div>
        </WToolBox>
        {/* FORM */}
        {errorForm && <ErrorForm error={errorForm?.error} />}
        <div className={`p-form ${isLoading ? 'section-loading' : ''}`}>
          <div className="flex flex-col gap-4">
            <FormControl className="w-full int-group">
              <TextField
                {...register('companyName', { required: true })}
                error={!!errors.companyName}
                size="small"
                label={t(messages['Company name']())}
                variant="outlined"
              />
            </FormControl>
            <FormControl className="w-full int-group">
              <TextField
                {...register('buzRegNum', { required: true })}
                error={!!errors.buzRegNum}
                size="small"
                label={t(messages['Business registration number']())}
                variant="outlined"
              />
            </FormControl>
            <div className="flex flex-row gap-4">
              <FormControl className="basis-full sm:basis-1/2 int-group">
                <TextField
                  {...register('buzAddress')}
                  size="small"
                  label={t(messages['Business address']())}
                  variant="outlined"
                />
              </FormControl>
            </div>
            <div className="flex flex-row gap-4">
              <FormControl className="basis-full sm:basis-1/2 int-group">
                <TextField
                  {...register('billAddress')}
                  size="small"
                  label={t(messages['Billing address']())}
                  variant="outlined"
                />
              </FormControl>
            </div>
            <div className="flex flex-row gap-4">
              <FormControl className="basis-full sm:basis-1/2 int-group">
                <Controller
                  name="country"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      options={convertSelectListData({ data: countries, textField: 'nation', valueField: 'code' })}
                      renderInput={params => (
                        <TextField {...params} size="small" label={`${t(messages.CountryOfOperations())}`} />
                      )}
                      defaultValue={{
                        text: countries.find(item => item.code === attributes.operationContriesId)?.nationality,
                        value: attributes.operationContriesId
                      }}
                      onChange={(_, data) => onChange(data)}
                      getOptionLabel={option => option.text || ''}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                    />
                  )}
                />
              </FormControl>
            </div>
          </div>
        </div>
        <WToolBox className="p-4">
          <div className="flex items-center justify-end gap-2">
            <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
              {!isLoading && <span className="uppercase">{t(messages.Submit())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </div>
        </WToolBox>
      </div>
    </StyledForm>
  )
}
