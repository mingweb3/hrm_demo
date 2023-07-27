import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Autocomplete, FormControl, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import dayjs from 'dayjs'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import { CurrencyField } from '@/app/components/Input/CurrencyField'
import { SelectList } from '@/app/components/Input/SelectList'
import { Switcher } from '@/app/components/Input/Switcher'
import WCollapseBox from '@/app/components/WCard/WCollapseBox'
// COMPs
import WToolBox from '@/app/components/WCard/WToolBox'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { Button } from '@/components/Button'
import { AssignCanInfo } from '@/app/pages/Organisation/Job/Candidates/components/AssignCanInfo'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { updatePlacementFn } from '@/apis/placement.api'
import { currencies } from '@/constants/JsonData/countries'
import { orgJobCandidateStatus, probationaryPeriod } from '@/constants/JsonData/status'
import { IErrorForm } from '@/types/IErrorForm'
import { IPlacement, IPlacementForm } from '@/types/IPlacement'
import { convertSelectListData } from '@/utils/helper.national'
import { isEmptyObject } from '@/utils/helper.object'
import { dirtyValues } from '@/utils/helpers'
import { messages } from '../../messages'

const StyledForm = styled('div')(
  ({ theme }) => `
    .job-title {
      color: ${theme.palette.blueHover};
    }
    `
)

const currencyDefault = { value: 'USD', text: 'United States dollar' }
const defautExtendPlacement = {
  reasonReject: '',
  videoLink: '',
  notes: '',
  remarks: '',
  yearRelExp: undefined,
  comDate: '',
  probPeriod: '',
  confDate: '',
  lastDay: '',
  offerMadeDate: '',
  offerAccepted: false,
  loaSigned: '',
  currency: '',
  basicOffered: '',
  otherAllowance: undefined,
  transAllowance: undefined
}

interface EditFormProps {
  data: IPlacement
}

export const EditForm: React.FC<EditFormProps> = ({ data }) => {
  const { attributes } = data

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API update placement: Mutation
  const {
    mutate: updatePlacement,
    isLoading,
    error
  } = useMutation((formData: IPlacementForm) => updatePlacementFn(attributes.UUID || '', formData), {
    onSuccess: () => {
      enqueueSnackbar(t(messages.UpdateSuccess(), { UID: attributes.UUID }), { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['placement_detail', attributes.UUID], exact: true })
    }
  })

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  // Back previous page
  const { filterParamsObj } = useFilterQueryUrl()
  const cancelCurPage = () => {
    if (filterParamsObj && filterParamsObj.from === 'job') {
      // redirect to page job detail
      const orgId = attributes?.job?.organisation?.UUID
      const jobId = attributes?.job?.UUID
      navigate(`/admin/organizations/${orgId}/jobs/${jobId}/candidates`)
    } else if (filterParamsObj && filterParamsObj.from === 'candidate') {
      // redirect to page candidates
      const canId = attributes?.candidate?.UUID
      navigate(`/admin/candidates/${canId}/placement`)
    }
  }

  // Edit Placement Form : Register FormState
  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { dirtyFields, isDirty }
  } = useForm<IPlacementForm>()

  // LOAD DATA FORM
  useEffect(() => {
    const formData = attributes

    // set Default extendPlacement null
    if (!formData.extendPlacement) formData.extendPlacement = defautExtendPlacement

    // Commencement Date
    if (formData.extendPlacement.comDate) {
      formData.extendPlacement.comDate = dayjs(attributes?.extendPlacement?.comDate?.toString()).format('YYYY-MM-DD')
    }
    // Confirmation Date
    if (formData.extendPlacement.confDate) {
      formData.extendPlacement.confDate = dayjs(attributes?.extendPlacement?.confDate?.toString()).format('YYYY-MM-DD')
    }
    // Last day
    if (formData.extendPlacement.lastDay) {
      formData.extendPlacement.lastDay = dayjs(attributes?.extendPlacement?.lastDay?.toString()).format('YYYY-MM-DD')
    }
    // Offer Made Date
    if (formData.extendPlacement.offerMadeDate) {
      formData.extendPlacement.offerMadeDate = dayjs(attributes?.extendPlacement?.offerMadeDate?.toString()).format(
        'YYYY-MM-DD'
      )
    }
    // LOA Signed Date
    if (formData.extendPlacement.loaSigned) {
      formData.extendPlacement.loaSigned = dayjs(attributes?.extendPlacement?.loaSigned?.toString()).format(
        'YYYY-MM-DD'
      )
    }

    // interviewDate
    if (formData.interviewDate) {
      formData.interviewDate = dayjs(attributes.interviewDate?.toString()).format('YYYY-MM-DD')
    }

    reset(formData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, attributes])

  // Action: submit form
  const onSubmit: SubmitHandler<IPlacementForm> = data => {
    if (isLoading) return
    if (!isDirty) return
    if (isEmptyObject(data)) return

    const updatedData = dirtyValues(dirtyFields, data)

    updatePlacement(updatedData)
  }

  return (
    <StyledForm className="flex flex-col gap-4">
      {/* BUTTONS  */}
      <WToolBox className="p-4 mb-4">
        <div className={`flex items-start justify-between gap-2 ${isLoading ? 'section-loading' : ''}`}>
          <Button onClick={cancelCurPage} variant="outline">
            <span className="uppercase">{t(messages.cancel())}</span>
          </Button>
          <Button variant="primary" className="min-w-[92px]" onClick={handleSubmit(onSubmit)}>
            {!isLoading && <span className="uppercase">{t(messages.update())}</span>}
            {isLoading && <LoadingBtn />}
          </Button>
        </div>
      </WToolBox>
      {/* CANDIDATE INFO  */}
      <AssignCanInfo stdCandidate={attributes.candidate} currentJob={attributes.job} />
      {/* FORM */}
      {errorForm && <ErrorForm error={errorForm?.error} />}
      <div className={`form-inner ${isLoading ? 'section-loading' : ''}`}>
        <div className="flex flex-col pt-4 gap-4">
          <div className="flex flex-col flex-1 w-full md:w-1/2 md:pr-2">
            <FormControl className="int-group">
              <SelectList
                control={control}
                fieldName="decision"
                dataList={orgJobCandidateStatus}
                label={`${t(messages.Status())}`}
                {...register('decision')}
                defaultValue=""
              />
            </FormControl>
          </div>
          <div className="flex flex-col flex-1 w-full md:w-1/2  md:pr-2">
            <TextField
              type="date"
              size="small"
              label={`${t(messages.InterviewDate())}`}
              variant="outlined"
              focused
              {...register('interviewDate')}
            />
          </div>
          <div>
            <FormControl className="int-group w-full">
              <textarea
                cols={30}
                rows={6}
                placeholder={`${t(messages.PanelOfInterviewers())}`}
                className="p-2 border border-gray3 border-solid rounded-[4px]"
                {...register('panelOfInterviewers')}
              />
            </FormControl>
          </div>
          <div className="flex">
            <FormControl className="w-full md:w-1/2 int-group md:pr-2">
              <TextField
                size="small"
                label={t(messages.MeetingRoomUrl())}
                variant="outlined"
                {...register('meetingRoomUrl')}
              />
            </FormControl>
          </div>
        </div>
        <WCollapseBox title={t(messages.Offer())} isOpenCollapse className="mt-4">
          <div className="col-12 flex flex-col gap-4 mt-4">
            <FormControl className="int-group w-full md:w-1/2 md:pr-2">
              <SelectList
                control={control}
                fieldName="extendPlacement.probPeriod"
                dataList={probationaryPeriod}
                label={`${t(messages.ProbationaryPeriod())}`}
                {...register('extendPlacement.probPeriod')}
                defaultValue=""
              />
            </FormControl>
            <FormControl className="w-full md:w-1/2 md:pr-2 int-group">
              <TextField
                type="date"
                size="small"
                label={`${t(messages.CommencementDate())}`}
                variant="outlined"
                focused
                {...register('extendPlacement.comDate')}
              />
            </FormControl>
            <FormControl className="w-full md:w-1/2 md:pr-2 int-group">
              <TextField
                type="date"
                size="small"
                label={`${t(messages.ConfirmationDate())}`}
                variant="outlined"
                focused
                {...register('extendPlacement.confDate')}
              />
            </FormControl>
            <FormControl className="w-full md:w-1/2 md:pr-2 int-group">
              <TextField
                type="date"
                size="small"
                label={`${t(messages.LastDay())}`}
                variant="outlined"
                focused
                {...register('extendPlacement.lastDay')}
              />
            </FormControl>
            <div className="flex flex-col md:flex-row">
              <FormControl className="w-full md:w-1/2  md:pr-2 int-group">
                <TextField
                  type="date"
                  size="small"
                  label={`${t(messages.OfferMade())}`}
                  variant="outlined"
                  focused
                  {...register('extendPlacement.offerMadeDate')}
                />
              </FormControl>
              <Switcher
                control={control}
                fieldName="extendPlacement.offerAccepted"
                label={`${t(messages.OfferAccepted())}`}
              />
            </div>
            <FormControl className="w-full md:w-1/2 int-group md:pr-2">
              <TextField
                type="date"
                size="small"
                label={`${t(messages.LOASigned())}`}
                variant="outlined"
                focused
                {...register('extendPlacement.loaSigned')}
              />
            </FormControl>
            <div className="flex flex-col md:flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <CurrencyField
                  control={control}
                  fieldName="extendPlacement.basicOffered"
                  label={`${t(messages.BasicOffered())}`}
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <Controller
                  name="extendPlacement.currency"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      options={convertSelectListData({ data: currencies, textField: 'name', valueField: 'label' })}
                      renderInput={params => <TextField {...params} size="small" label={`${t(messages.Currency())}`} />}
                      getOptionLabel={option => `${option.value} - ${option.text}` || ''}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      onChange={(_, data) => {
                        onChange(data?.value)
                      }}
                      defaultValue={
                        attributes.extendPlacement?.currency
                          ? {
                              text: currencies.find(item => item.label === attributes.extendPlacement?.currency)?.name,
                              value: attributes.extendPlacement?.currency
                            }
                          : currencyDefault
                      }
                    />
                  )}
                />
              </FormControl>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <CurrencyField
                  control={control}
                  fieldName="extendPlacement.transAllowance"
                  label={`${t(messages.TransportAllowance())}`}
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <CurrencyField
                  control={control}
                  fieldName="extendPlacement.otherAllowance"
                  label={`${t(messages.TransportAllowance())}`}
                />
              </FormControl>
            </div>
          </div>
        </WCollapseBox>
        <WCollapseBox title={t(messages.Interview())} isOpenCollapse className="mt-4">
          <div>
            <FormControl className="w-full int-group mt-4">
              <TextField
                size="small"
                label={t(messages.VideoInterviewLink())}
                variant="outlined"
                {...register('extendPlacement.videoLink')}
              />
            </FormControl>
          </div>
          <div>
            <FormControl className="int-group mt-4 w-full">
              <textarea
                cols={30}
                rows={6}
                placeholder={`${t(messages.ReasonForRejection())}`}
                className="p-2 border border-gray3 border-solid rounded-[4px]"
                {...register('extendPlacement.reasonReject')}
              />
            </FormControl>
          </div>
          <div>
            <FormControl className="int-group mt-4 w-full">
              <textarea
                cols={30}
                rows={6}
                placeholder={`${t(messages.Notes())}`}
                className="p-2 border border-gray3 border-solid rounded-[4px]"
                {...register('extendPlacement.notes')}
              />
            </FormControl>
          </div>
          <div>
            <FormControl className="int-group mt-4 w-full">
              <textarea
                cols={30}
                rows={6}
                placeholder={`${t(messages.Remark())}`}
                className="p-2 border border-gray3 border-solid rounded-[4px]"
                {...register('extendPlacement.remarks')}
              />
            </FormControl>
          </div>
          <div className="col-12 mt-4">
            <FormControl className="w-full md:w-1/2 int-group">
              <TextField
                size="small"
                label={t(messages.YearOfRelevantExperience())}
                variant="outlined"
                type="number"
                {...register('extendPlacement.yearRelExp')}
              />
            </FormControl>
          </div>
        </WCollapseBox>
      </div>
      {/* BUTTONS  */}
      <WToolBox className="p-4 mb-4">
        <div className={`flex items-start justify-between gap-2 ${isLoading ? 'section-loading' : ''}`}>
          <Button onClick={cancelCurPage} variant="outline">
            <span className="uppercase">{t(messages.cancel())}</span>
          </Button>
          <Button variant="primary" className="min-w-[92px]" onClick={handleSubmit(onSubmit)}>
            {!isLoading && <span className="uppercase">{t(messages.update())}</span>}
            {isLoading && <LoadingBtn />}
          </Button>
        </div>
      </WToolBox>
    </StyledForm>
  )
}
