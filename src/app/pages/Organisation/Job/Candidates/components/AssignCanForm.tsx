import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormControl, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { SubmitHandler, useForm } from 'react-hook-form'
// COMPs
import { Button } from '@/app/components/Button'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import { SelectList } from '@/app/components/Input/SelectList'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import ToolBarForm from '@/app/pages/Candidate/Placement/components/ToolBarForm'
import { createPlacementFn } from '@/apis/placement.api'
import { orgJobCandidateStatus } from '@/constants/JsonData/status'
import { NOT_EMPTY } from '@/constants/form/validation'
import { ICandidate } from '@/types/ICandidate'
import { IErrorForm } from '@/types/IErrorForm'
import { IOrgJob } from '@/types/IOrgJob'
import { IPlacementForm } from '@/types/IPlacement'
import { isEmptyObject } from '@/utils/helper.object'
import { messages } from '../../messages'
import { AssignCanInfo } from './AssignCanInfo'

const StyledAssignCanForm = styled('div')(
  ({ theme }) => `
      .job-title {
        color: ${theme.palette.blueHover};
      }
    `
)

const initAssginForm: IPlacementForm = {
  decision: 'submitted',
  interviewDate: '',
  panelOfInterviewers: '',
  meetingRoomUrl: '',
  candidateUUID: '',
  jobUUID: ''
}

interface AssignCanFormProps {
  onBackStep: () => void
  onCloseModal: () => void
  stdCandidate?: ICandidate | null
  currentJob?: IOrgJob
}

export const AssignCanForm: React.FC<AssignCanFormProps> = ({ onBackStep, onCloseModal, stdCandidate, currentJob }) => {
  const navigate = useNavigate()
  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // Assign candidate Form : Register FormHook
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IPlacementForm>({
    defaultValues: initAssginForm
  })

  // API Create Placement: Mutation
  const {
    mutate: createPlacement,
    isLoading,
    error
  } = useMutation((formData: IPlacementForm) => createPlacementFn(formData), {
    onSuccess: data => {
      enqueueSnackbar(t(messages.CreateNewSuccess()), { variant: 'success' }) // ADD Notify
      onCloseModal()
      navigate(`/admin/placement/${data.attributes.UUID}?from=job`)
    }
  })

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  // Action: Submit form
  const onSubmit: SubmitHandler<IPlacementForm> = data => {
    if (isEmptyObject(data)) return

    const _data = data
    _data.candidateUUID = stdCandidate?.attributes.UUID
    _data.jobUUID = currentJob?.attributes.UUID

    createPlacement({ ..._data })
  }

  // Action: back step 1
  const clickBack = () => {
    reset(initAssginForm)

    onBackStep()
  }

  return (
    <StyledAssignCanForm>
      {/* TOOLBAR */}
      <ToolBarForm>
        <>
          <Button variant="white" className="uppercase" onClick={clickBack}>
            <span>{t(messages.Back())}</span>
          </Button>
          <Button type="button" variant="primary" onClick={handleSubmit(onSubmit)}>
            {!isLoading && <span className="uppercase">{t(messages.Assign())}</span>}
            {isLoading && <LoadingBtn />}
          </Button>
        </>
      </ToolBarForm>
      {/* CANDIDATE INFO */}
      <div className="pt-6">
        <AssignCanInfo stdCandidate={stdCandidate?.attributes} currentJob={currentJob?.attributes} />
      </div>
      {/* FORM */}
      {errorForm && <ErrorForm error={errorForm?.error} />}
      <div className="flex flex-col md:flex-row pt-4 gap-4">
        <div className="w-full md:w-1/2">
          <div className="flex flex-col flex-1 pb-4">
            <FormControl className="int-group">
              <SelectList
                control={control}
                fieldName="decision"
                dataList={orgJobCandidateStatus}
                label={`${t(messages.Status())}`}
                {...register('decision', { required: true, pattern: NOT_EMPTY })}
                error={!!errors.decision}
              />
            </FormControl>
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              type="date"
              size="small"
              label={`${t(messages.InterviewDate())}`}
              variant="outlined"
              focused
              {...register('interviewDate')}
            />
          </div>
        </div>
      </div>
      <div>
        <FormControl className="int-group mt-4 w-full">
          <textarea
            cols={30}
            rows={6}
            placeholder={`${t(messages.PanelOfInterviewers())}`}
            className="p-2 border border-gray3 border-solid rounded-[4px]"
            {...register('panelOfInterviewers')}
          />
        </FormControl>
      </div>
      <div className="flex mt-4 mb-8 md:mb-[80px]">
        <FormControl className="w-full md:w-1/2 int-group">
          <TextField
            size="small"
            label={t(messages.MeetingRoomUrl())}
            variant="outlined"
            {...register('meetingRoomUrl')}
          />
        </FormControl>
      </div>
      {/* TOOLBAR */}
      <ToolBarForm>
        <>
          <Button variant="white" className="uppercase" onClick={clickBack}>
            <span>{t(messages.Back())}</span>
          </Button>
          <Button type="button" variant="primary" onClick={handleSubmit(onSubmit)}>
            {!isLoading && <span className="uppercase">{t(messages.Assign())}</span>}
            {isLoading && <LoadingBtn />}
          </Button>
        </>
      </ToolBarForm>
    </StyledAssignCanForm>
  )
}
