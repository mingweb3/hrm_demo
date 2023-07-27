import React, { useEffect, useMemo } from 'react'
import { DialogActions, DialogContent, DialogTitle, FormControl, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { SubmitHandler, useForm } from 'react-hook-form'
// COMPS
import { Button } from '@/app/components/Button'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { updateDivisionFn } from '@/apis/division.api'
import { NOT_EMPTY } from '@/constants/form/validation'
import { IErrorForm } from '@/types/IErrorForm'
// SERVICES
import { IDivision, IDivisionForm } from '@/types/IJob'
import { dirtyValues } from '@/utils/helper.form'
import { cleanEmptyFields, isEmptyObject } from '@/utils/helper.object'
import { messages } from '../messages'

interface EditDivisionFormProps {
  data: IDivision
  onClose: () => void
}

const initDivisionForm: IDivisionForm = {
  title: '',
  description: ''
}

const EditDivisionForm: React.FC<EditDivisionFormProps> = ({ data, onClose }) => {
  const { id, attributes } = data
  const queryClient = useQueryClient()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Create Division: Mutation
  const {
    mutate: updateDivision,
    isLoading,
    error
  } = useMutation((formData: IDivisionForm) => updateDivisionFn(id, formData), {
    onSuccess: () => {
      reset(initDivisionForm)
      queryClient.invalidateQueries({ queryKey: ['divisions', 'all'], exact: true })
      enqueueSnackbar(t(messages.UpdateSuccess(), { UID: id }), { variant: 'success' })
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

  // Edit Form : Division
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, dirtyFields }
  } = useForm<IDivisionForm>()

  const onSubmit: SubmitHandler<IDivisionForm> = data => {
    const updateData = dirtyValues(dirtyFields, data)
    if (isEmptyObject(cleanEmptyFields(updateData))) return

    updateDivision(cleanEmptyFields(data))
  }

  useEffect(() => {
    reset(attributes)
  }, [attributes, data, reset])

  return (
    <>
      <DialogTitle>{`${t(messages.EditDivision())}`}</DialogTitle>
      <DialogContent>
        <div className={`flex flex-col gap-4 pt-4 ${isLoading ? 'section-loading' : ''}`}>
          {errorForm && <ErrorForm error={errorForm?.error} />}
          <FormControl className="w-full int-group">
            <TextField
              {...register('title', { pattern: NOT_EMPTY, required: true })}
              error={!!errors.title}
              size="small"
              label={t(messages['Division title']())}
              variant="outlined"
            />
          </FormControl>
          <FormControl className="w-full int-group">
            <textarea
              {...register('description')}
              cols={30}
              rows={4}
              placeholder={`${t(messages.description())}`}
              className="p-2 border border-gray3 border-solid rounded-[4px]"
            />
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions sx={{ padding: ' 0 24px 20px' }} className="flex flex-row justify-between items-center">
        <Button onClick={handleSubmit(onSubmit)} size="lg" variant="primary" className="w-full md:w-[140px] p-0">
          {!isLoading && <span>{t(messages.update())}</span>}
          {isLoading && <LoadingBtn />}
        </Button>
        <Button onClick={onClose}>{t(messages.close())}</Button>
      </DialogActions>
    </>
  )
}

export default EditDivisionForm
