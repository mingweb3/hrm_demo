import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import DivisionSelector from '@/app/components/Input/DivisionSelector'
import WToolBox from '@/app/components/WCard/WToolBox'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { createDepartmentFn } from '@/apis/division.api'
import { NOT_EMPTY } from '@/constants/form/validation'
import { IErrorForm } from '@/types/IErrorForm'
import { IDepartmentForm } from '@/types/IJob'
import { cleanEmptyFields, isEmptyObject } from '@/utils/helper.object'
import { messages } from '../../messages'

const StyledCreateDepartmentForm = styled('div')(``)

const initDeparmentForm: IDepartmentForm = {
  categoryTitle: '',
  divisionId: undefined,
  division: undefined,
  description: ''
}

const CreateDepartmentForm: React.FC = () => {
  const navigate = useNavigate()
  const cancelCurPage = () => {
    navigate('/admin/departments')
  }

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Create Candidate: Mutation
  const {
    mutate: createDepartment,
    isLoading,
    error
  } = useMutation((formData: IDepartmentForm) => createDepartmentFn(formData), {
    onSuccess: res => {
      enqueueSnackbar(t(messages.CreateNewSuccess()), { variant: 'success' })
      navigate(`/admin/departments/${res.id}`)
    },
    onSettled: () => {
      reset(initDeparmentForm)
      const clearButton = document.querySelector('.form-content .MuiAutocomplete-clearIndicator')
      if (clearButton instanceof HTMLElement) {
        clearButton.click()
      }
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
    setValue,
    formState: { errors }
  } = useForm<IDepartmentForm>()

  const onSubmit: SubmitHandler<IDepartmentForm> = data => {
    if (isEmptyObject(data)) return

    const _data = cleanEmptyFields(data) as IDepartmentForm
    if (_data.division) {
      delete _data.division
      createDepartment(_data)
    }
  }

  return (
    <StyledCreateDepartmentForm>
      <form>
        <div className="flex flex-col gap-4">
          <WToolBox className="p-4 text-right flex justify-between">
            <Button onClick={cancelCurPage} variant="outline">
              <span className="uppercase">{t(messages.cancel())}</span>
            </Button>
            <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
              {!isLoading && <span className="uppercase">{t(messages.Submit())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </WToolBox>
          {/* FORM CONTENT */}
          {errorForm && <ErrorForm error={errorForm?.error} />}
          <div className={`form-content flex flex-col gap-4 ${isLoading ? 'section-loading' : ''}`}>
            <FormControl className="flex-1 int-group">
              <TextField
                {...register('categoryTitle', { required: true, pattern: NOT_EMPTY })}
                error={!!errors.categoryTitle}
                size="small"
                label={`${t(messages.DepartmentTitle())}`}
                variant="outlined"
              />
            </FormControl>

            <div className="flex gap-4">
              <FormControl className="flex-1 int-group">
                <DivisionSelector
                  control={control}
                  fieldName="division"
                  label={`${t(messages.Division())}`}
                  noOptionsText={`${t(messages.TypeToFind())}`}
                  onSelect={val => setValue('divisionId', parseInt(val))}
                  error={!!errors.division}
                  rules={{ required: true }}
                />
              </FormControl>
              <FormControl className="flex-1 int-group hidden sm:flex" />
            </div>

            <FormControl className="int-group w-full">
              <textarea
                {...register('description')}
                cols={30}
                rows={6}
                placeholder={`${t(messages.description())}`}
                className="p-2 border border-gray3 border-solid rounded-[4px]"
              />
            </FormControl>
          </div>
          <WToolBox className="p-4 text-right flex justify-between">
            <Button onClick={cancelCurPage} variant="outline">
              <span className="uppercase">{t(messages.cancel())}</span>
            </Button>
            <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
              {!isLoading && <span className="uppercase">{t(messages.Submit())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </WToolBox>
        </div>
      </form>
    </StyledCreateDepartmentForm>
  )
}

export default CreateDepartmentForm
