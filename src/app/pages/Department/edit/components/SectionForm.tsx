import { useEffect, useMemo } from 'react'
import { DialogActions, DialogContent, DialogTitle, FormControl, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { createSectionFn, updateSectionFn } from '@/apis/division.api'
import { NOT_EMPTY } from '@/constants/form/validation'
import { IErrorForm } from '@/types/IErrorForm'
import { ISectionForm } from '@/types/IJob'
import { cleanEmptyFields, isEmptyObject } from '@/utils/helper.object'
import { dirtyValues } from '@/utils/helpers'
import { messages } from '../../messages'
import SkillForm from './SkillForm'

interface AddSectionFormProps {
  data?: ISectionForm | null
  departmentId: string
  onClose: () => void
}

const SectionForm: React.FC<AddSectionFormProps> = ({ onClose, departmentId, data }) => {
  const queryClient = useQueryClient()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Section: Mutation
  const createMutation = useMutation((formData: ISectionForm) => createSectionFn(formData), {
    onSuccess: res => {
      enqueueSnackbar(t(messages.CreateNewSuccess()), { variant: 'success' })
      reset({ ...res.attributes, id: res.id })
      queryClient.invalidateQueries({ queryKey: ['department', departmentId], exact: true })
    }
  })

  const updateMutation = useMutation((formData: ISectionForm) => updateSectionFn(getValues().id as string, formData), {
    onSuccess: res => {
      enqueueSnackbar(t(messages.UpdateSuccess(), { UID: res.id }), { variant: 'success' })
      reset({ ...res.attributes, id: res.id })
      queryClient.invalidateQueries({ queryKey: ['department', departmentId], exact: true })
    }
  })

  // Error handle
  const errorFormCreate = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(createMutation.error)) {
      return createMutation.error.response?.data
    }
    return undefined
  }, [createMutation.error])

  const errorFormEdit = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(updateMutation.error)) {
      return updateMutation.error.response?.data
    }
    return undefined
  }, [updateMutation.error])

  // Form Section : Register formState
  const {
    reset,
    register,
    handleSubmit,
    getValues,
    formState: { errors, dirtyFields }
  } = useForm<ISectionForm>()

  const onSubmit: SubmitHandler<ISectionForm> = data => {
    const updateData = dirtyValues(dirtyFields, data)
    if (isEmptyObject(updateData)) return
    updateData.categoryId = parseInt(departmentId)

    // mode: EDIT
    if (getValues().id) updateMutation.mutate(cleanEmptyFields(updateData))
    // mode: CREATE
    else createMutation.mutate(cleanEmptyFields(updateData))
  }

  // Get DATA to Edit Form
  useEffect(() => {
    if (data) reset(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div>
      <DialogTitle>{t(messages.SectionForm())}</DialogTitle>
      <DialogContent className={`${createMutation.isLoading || updateMutation.isLoading ? 'section-loading' : ''}`}>
        <div className="flex flex-col gap-4 pt-2">
          {errorFormCreate && <ErrorForm key={1} error={errorFormCreate?.error} />}
          {errorFormEdit && <ErrorForm key={2} error={errorFormEdit?.error} />}
          <FormControl className="w-full int-group">
            <TextField
              {...register('title', { pattern: NOT_EMPTY, required: true })}
              error={!!errors.title}
              size="small"
              label={t(messages.SectionTitle())}
              variant="outlined"
            />
          </FormControl>
        </div>

        {getValues().id && (
          <div className="pt-4">
            <SkillForm
              sectionId={getValues().id as string}
              departmentId={departmentId}
              skillData={getValues().skills}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: ' 0 24px 20px' }} className="flex flex-row justify-between items-center">
        <Button onClick={onClose}>{t(messages.close())}</Button>
        {!getValues().id && (
          <Button onClick={handleSubmit(onSubmit)} size="lg" variant="primary" className="w-full md:w-[140px] p-0">
            {!createMutation.isLoading && <span>{t(messages.Submit())}</span>}
            {createMutation.isLoading && <LoadingBtn />}
          </Button>
        )}
        {getValues().id && (
          <Button onClick={handleSubmit(onSubmit)} size="lg" variant="primary" className="w-full md:w-[140px] p-0">
            {!updateMutation.isLoading && <span>{t(messages.update())}</span>}
            {updateMutation.isLoading && <LoadingBtn />}
          </Button>
        )}
      </DialogActions>
    </div>
  )
}

export default SectionForm
