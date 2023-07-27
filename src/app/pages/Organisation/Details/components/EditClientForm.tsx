import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormControl, TextField } from '@mui/material'
import { styled } from '@mui/system'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import WToolBox from '@/app/components/WCard/WToolBox'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { updateOrgnizationFn } from '@/apis/organization.api'
import { EMAIL_REGEX } from '@/constants/form/validation'
import { IErrorForm } from '@/types/IErrorForm'
import { IOrganization, IOrganizationForm } from '@/types/IOrganization'
import { isEmptyObject } from '@/utils/helper.object'
import { dirtyValues, isAxiosError } from '@/utils/helpers'
import { messages } from '../../messages'

const StyledForm = styled('div')(``)

interface EditClientFormProps {
  data: IOrganization
}

const EditClientForm: React.FC<EditClientFormProps> = ({ data }) => {
  const { attributes } = data
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const cancelCurPage = () => {
    navigate('/admin/organizations')
  }

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Update ORG: Mutation
  const {
    mutate: updateOrgnization,
    isLoading,
    error
  } = useMutation((formData: IOrganizationForm) => updateOrgnizationFn(attributes.UUID || '', formData), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', attributes.UUID], exact: true })
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

  // New ORG Form : Register FormHook
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, dirtyFields }
  } = useForm<IOrganizationForm>()

  const onSubmit: SubmitHandler<IOrganizationForm> = data => {
    if (isLoading) return
    if (isEmptyObject(data)) return

    // before Submit: handle Currency
    const updatedData = dirtyValues(dirtyFields, data)
    // SUBMIT API
    updateOrgnization(updatedData)
  }

  // LOAD DATA FORM
  useEffect(() => {
    reset(attributes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, attributes])

  return (
    <StyledForm>
      <div className="flex flex-col gap-4">
        <WToolBox className="p-4">
          <div className="flex items-center justify-between gap-2">
            <Button onClick={cancelCurPage} variant="outline">
              <span className="uppercase">{t(messages.cancel())}</span>
            </Button>
            <Button onClick={handleSubmit(onSubmit)} className="min-w-[92px]" variant="primary">
              {!isLoading && <span className="uppercase">{t(messages.update())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </div>
        </WToolBox>
        {/* FORM */}
        {errorForm && <ErrorForm error={errorForm?.error} />}
        <div className="frm-ct flex flex-col gap-4 p-4">
          <FormControl className="flex-1 int-group">
            <TextField
              {...register('companyName', { required: true })}
              error={!!errors.companyName}
              size="small"
              label={t(messages['Company name']())}
              variant="outlined"
            />
          </FormControl>
          <FormControl className="int-group">
            <TextField
              {...register('buzRegNum', { required: true })}
              error={!!errors.buzRegNum}
              size="small"
              label={t(messages['Business registration number']())}
              variant="outlined"
            />
          </FormControl>
          <div className="flex flex-col md:flex-row gap-4">
            <FormControl className="flex-1 int-group">
              <TextField
                {...register('buzAddress')}
                size="small"
                label={t(messages['Business address']())}
                variant="outlined"
              />
            </FormControl>
            <FormControl className="flex-1 int-group">
              <TextField
                {...register('billAddress')}
                size="small"
                label={t(messages['Billing address']())}
                variant="outlined"
              />
            </FormControl>
          </div>
          <FormControl className="int-group">
            <TextField
              {...register('officeAddress')}
              size="small"
              label={t(messages['Office address']())}
              variant="outlined"
            />
          </FormControl>

          <div className="flex flex-col gap-4">
            <FormControl className="w-[50%] int-group">
              <TextField
                {...register('contactEmail', { pattern: EMAIL_REGEX, required: true })}
                error={!!errors.contactEmail}
                size="small"
                label={t(messages['Contact email']())}
                variant="outlined"
              />
            </FormControl>
            <FormControl className="w-[50%] int-group">
              <TextField
                {...register('contactNum', { required: true })}
                error={!!errors.contactNum}
                size="small"
                label={t(messages['Contact number']())}
                variant="outlined"
              />
            </FormControl>
          </div>

          <div className="flex flex-col gap-4">
            <FormControl className="w-[50%] int-group">
              <TextField
                {...register('contactPersonalName')}
                size="small"
                label={t(messages['Contact person name']())}
                variant="outlined"
              />
            </FormControl>
            <FormControl className="w-[50%] int-group">
              <TextField
                {...register('contactPeronalDesignation')}
                size="small"
                label={t(messages['Contract person designation']())}
                variant="outlined"
              />
            </FormControl>
          </div>
        </div>
        <WToolBox className="p-4">
          <div className="flex items-center justify-between gap-2">
            <Button onClick={cancelCurPage} variant="outline">
              <span className="uppercase">{t(messages.cancel())}</span>
            </Button>
            <Button onClick={handleSubmit(onSubmit)} className="min-w-[92px]" variant="primary">
              {!isLoading && <span className="uppercase">{t(messages.update())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </div>
        </WToolBox>
      </div>
    </StyledForm>
  )
}

export default EditClientForm
