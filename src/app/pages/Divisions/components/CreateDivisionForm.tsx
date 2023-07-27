import { useMemo } from 'react'
import { FormControl, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { createDivisionFn } from '@/apis/division.api'
import { NOT_EMPTY } from '@/constants/form/validation'
import { IErrorForm } from '@/types/IErrorForm'
import { IDivisionForm } from '@/types/IJob'
import { cleanEmptyFields, isEmptyObject } from '@/utils/helper.object'
import { messages } from '../messages'

interface Props {
  onClose: () => void
}

const initDivisionForm: IDivisionForm = {
  title: '',
  description: ''
}

const CreateDivisionForm: React.FC<Props> = ({ onClose }) => {
  const queryClient = useQueryClient()
  const defaultQueryStr = `page[number]=1&page[size]=500`

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Create Division: Mutation
  const {
    mutate: createDivision,
    isLoading,
    error
  } = useMutation((formData: IDivisionForm) => createDivisionFn(formData), {
    onSuccess: () => {
      reset(initDivisionForm)
      enqueueSnackbar(t(messages.CreateNewSuccess()), { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['divisions', defaultQueryStr], exact: true })
    }
  })

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  // New Division Form : Register FormState
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IDivisionForm>()

  const onSubmit: SubmitHandler<IDivisionForm> = data => {
    if (isEmptyObject(data)) return
    createDivision(cleanEmptyFields(data))
  }

  return (
    <div className="p-4 bg-white">
      <h5 className="f12Regular uppercase letter tracking-[.2em] text-gray5 mb-4">{`${t(
        messages['Create new form']()
      )}`}</h5>
      <div className={`flex flex-col gap-4 ${isLoading ? 'section-loading' : ''}`}>
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
            rows={2}
            placeholder={`${t(messages.description())}`}
            className="p-2 border border-gray3 border-solid rounded-[4px]"
          />
        </FormControl>
      </div>
      <div className="flex flex-row pt-4 btn-group">
        <Button onClick={handleSubmit(onSubmit)} size="lg" variant="primary" className="w-full md:w-[140px] p-0">
          {!isLoading && <span>{t(messages.Add())}</span>}
          {isLoading && <LoadingBtn />}
        </Button>
        <Button size="lg" variant="outline-gray" className="w-full md:w-[140px] p-0 md:ml-4" onClick={onClose}>
          <span>{`${t(messages.close())}`}</span>
        </Button>
      </div>
    </div>
  )
}

export default CreateDivisionForm
