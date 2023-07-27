import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import { useMutation } from '@tanstack/react-query'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import DivisionSelector from '@/app/components/Input/DivisionSelector'
import WToolBox from '@/app/components/WCard/WToolBox'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { updateDepartmentFn } from '@/apis/division.api'
import { NOT_EMPTY } from '@/constants/form/validation'
import { IErrorForm } from '@/types/IErrorForm'
import { IDepartment, IDepartmentForm } from '@/types/IJob'
import { dirtyValues, isAxiosError } from '@/utils/helpers'
import { messages } from '../../messages'
import SectionForm from './SectionForm'
import SectionsList from './SectionsList'

const StyledEditDepartmentForm = styled('div')(``)

type EditDepartmentFormProps = {
  data: IDepartment
}

const EditDepartmentForm: React.FC<EditDepartmentFormProps> = ({ data }) => {
  const { id, attributes } = data
  const navigate = useNavigate()
  const cancelCurPage = () => {
    navigate('/admin/departments')
  }

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Create Division: Mutation
  const {
    mutate: updateDivision,
    isLoading,
    error
  } = useMutation((formData: IDepartmentForm) => updateDepartmentFn(id, formData), {
    onSuccess: res => {
      const formData = getValues()
      if (res && typeof res === 'object') {
        reset({ ...formData, categoryTitle: res.attributes.categoryTitle, description: res.attributes.description })
      }

      enqueueSnackbar(t(messages.UpdateSuccess(), { UID: id }), { variant: 'success' })
    }
  })

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  // Edit Candidate Form : Register FormState
  const {
    reset,
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, dirtyFields }
  } = useForm<IDepartmentForm>()

  const onSubmit: SubmitHandler<IDepartmentForm> = data => {
    const updateData = dirtyValues(dirtyFields, data)
    if (updateData.division) {
      delete updateData.division
    }
    updateDivision(updateData)
  }

  /// LOAD data to FORM
  useEffect(() => {
    reset(attributes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, attributes])

  // MODAL: EDIT
  // const [curEditItem, setCurEditItem] = useState<null | I>(null)
  const [openAddSection, setOpenAddSection] = useState(false)
  const closeSectionBox = () => {
    setOpenAddSection(false)
  }
  const handleOpenAddSection = () => {
    // setCurEditItem(data)
    setOpenAddSection(true)
  }

  return (
    <StyledEditDepartmentForm>
      <div className="flex flex-col gap-4">
        <WToolBox className="p-4 text-right flex justify-between">
          <Button onClick={cancelCurPage} variant="outline">
            <span className="uppercase">{t(messages.cancel())}</span>
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
            {!isLoading && <span className="uppercase">{t(messages.update())}</span>}
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
                defaultValue={attributes.division}
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
        {/* SECTION LIST */}
        <div className="section-list">
          <div className="tool-box mb-4">
            <Button onClick={handleOpenAddSection} variant="outline">
              <span>+ {t(messages.AddSection())}</span>
            </Button>
          </div>
          {attributes.sections && attributes.sections.length > 0 && (
            <SectionsList data={attributes.sections} departmentId={id} />
          )}
        </div>

        <WToolBox className="p-4 text-right flex justify-between">
          <Button onClick={cancelCurPage} variant="outline">
            <span className="uppercase">{t(messages.cancel())}</span>
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
            {!isLoading && <span className="uppercase">{t(messages.update())}</span>}
            {isLoading && <LoadingBtn />}
          </Button>
        </WToolBox>
      </div>
      <Dialog open={openAddSection} maxWidth="sm" fullWidth disableEscapeKeyDown>
        <SectionForm onClose={closeSectionBox} departmentId={id} />
      </Dialog>
    </StyledEditDepartmentForm>
  )
}

export default EditDepartmentForm
