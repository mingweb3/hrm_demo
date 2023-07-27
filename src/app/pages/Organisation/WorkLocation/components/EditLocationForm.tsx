// COMPs
import React, { useEffect, useMemo } from 'react'
import { FormControl, TextField } from '@mui/material'
import { styled } from '@mui/system'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import { Switcher } from '@/app/components/Input/Switcher'
import WToolBox from '@/app/components/WCard/WToolBox'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { updateWorkPlaceFn } from '@/apis/organization.api'
import { POSTAL_CODE } from '@/constants/form/validation'
import { IErrorForm } from '@/types/IErrorForm'
import { IWorkPlaceForm } from '@/types/IOrganization'
import { isEmptyObject } from '@/utils/helper.object'
import { isAxiosError } from '@/utils/helpers'
import { messages } from '../../messages'

const StyledForm = styled('form')(
  ({ theme }) => `
    height: 100%;
    .col-12 {
      ${theme.breakpoints.up('md')} {
        width: calc(50% - 10px);
      }
      width: 100%
    }
  `
)

const initFormData = {
  address: '',
  postalCode: undefined,
  isDefault: false
}

interface EditLocationFormProps {
  orgID: string
  data: IWorkPlaceForm
  onClose: () => void
}

export const EditLocationForm: React.FC<EditLocationFormProps> = ({ orgID, data, onClose }) => {
  const { UUID } = data
  const queryClient = useQueryClient()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Create Candidate: Mutation
  const {
    mutate: updateWorkPlace,
    isLoading,
    error
  } = useMutation((formData: IWorkPlaceForm) => updateWorkPlaceFn(UUID || '', formData), {
    onSuccess: () => {
      reset(initFormData)
      enqueueSnackbar(t(messages.CreateNewSuccess()), { variant: 'success' }) // ADD Notify
      queryClient.invalidateQueries({
        queryKey: ['organization', `${orgID}_locations`],
        exact: true
      })

      onClose()
    }
  })

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  // New ORG Form : Register FormHook
  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IWorkPlaceForm>()

  const onSubmit: SubmitHandler<IWorkPlaceForm> = data => {
    if (isLoading) return
    if (isEmptyObject(data)) return
    const _data = data
    // SUBMIT API
    _data.orgUUID = orgID
    updateWorkPlace(_data)
  }

  // LOAD DATA FORM
  useEffect(() => {
    reset(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <StyledForm>
      <div className="flex flex-col gap-4 h-full">
        <WToolBox className="p-4">
          <div className="flex items-center justify-end gap-2">
            <Button onClick={handleSubmit(onSubmit)} className="min-w-[92px]" variant="primary">
              {!isLoading && <span className="uppercase">{t(messages.Update())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </div>
        </WToolBox>
        <div className="flex flex-col gap-4">
          {errorForm && <ErrorForm error={errorForm?.error} />}
          <FormControl className="flex-1 int-group">
            <TextField
              {...register('address', { required: true })}
              error={!!errors.address}
              size="small"
              label={t(messages.address())}
              variant="outlined"
            />
          </FormControl>
          <FormControl className="col-12 int-group">
            <TextField
              {...register('postalCode', { required: true, pattern: POSTAL_CODE })}
              error={!!errors.postalCode}
              size="small"
              label={t(messages['Postal code']())}
              variant="outlined"
            />
          </FormControl>
          <FormControl className="int-group">
            <Switcher control={control} fieldName="isDefault" label={`${t(messages.isDefault())}`} />
          </FormControl>
        </div>
        <WToolBox className="p-4">
          <div className="flex items-center justify-end gap-2">
            <Button onClick={handleSubmit(onSubmit)} className="min-w-[92px]" variant="primary">
              {!isLoading && <span className="uppercase">{t(messages.Update())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </div>
        </WToolBox>
      </div>
    </StyledForm>
  )
}
