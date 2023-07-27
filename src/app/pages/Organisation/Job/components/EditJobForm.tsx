import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Autocomplete, Dialog, FormControl, FormGroup, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import { CurrencyField } from '@/app/components/Input/CurrencyField'
import DepartmentSelector from '@/app/components/Input/DepartmentSelector'
import { SelectList } from '@/app/components/Input/SelectList'
import { Switcher } from '@/app/components/Input/Switcher'
import WCollapseBox from '@/app/components/WCard/WCollapseBox'
import WToolBox from '@/app/components/WCard/WToolBox'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import AlertModal from '@/app/components/WModal/AlertModal'
import { Button } from '@/components/Button'
import MarkDownEditor from '@/components/Input/MarkDownEditor'
import { updateOrgJobFn } from '@/apis/org.job.api'
import { currencies } from '@/constants/JsonData/countries'
import { PrefCommitment, mrfType } from '@/constants/JsonData/jobLevel'
import { NOT_EMPTY } from '@/constants/form/validation'
import { IErrorForm } from '@/types/IErrorForm'
import { IDepartmentForm, ISkillForm } from '@/types/IJob'
import { IOrgJob, IOrgJobForm } from '@/types/IOrgJob'
import { IWorkPlaceForm } from '@/types/IOrganization'
import { convertSelectListData } from '@/utils/helper.national'
import { isEmptyObject } from '@/utils/helper.object'
import { dirtyValues, isAxiosError } from '@/utils/helpers'
import { StatusLabel } from '../../Jobs/components/StatusLabel'
import { messages } from '../messages'
import OrgSkillIpt from './OrgSkillIpt'
import OrgWorkplacesIpt from './OrgWorkplacesIpt'

const currencyDefault = { value: 'USD', text: 'United States dollar' }

const defaultExtendJob = {
  description: '',
  openToForeinger: false,
  foreingerQuote: undefined,
  permissleForeinger: '',
  mrfId: '',
  mrfType: '',
  overtime: false,
  perfBonus: false,
  aws: false,
  annualLeave: undefined,
  otherBenefits: '',
  minTransAllowance: undefined,
  maxTransAllowance: undefined,
  otherAllowance: '',
  shuttleService: false,
  overtimeTransportClaim: false,
  overTimeMealAllowance: false,
  probationPeriod: '',
  prefCommitmentId: ''
}

interface EditJobFormProps {
  className?: string
  orgId: string
  data: IOrgJob
}

const EditJobForm: React.FC<EditJobFormProps> = ({ orgId, data }) => {
  const { attributes } = data
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const cancelCurPage = () => {
    navigate(`/admin/organizations/${orgId}/jobs`)
  }

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API update OrgJob: Mutation
  const {
    mutate: updateOrgJob,
    isLoading,
    error
  } = useMutation((formData: IOrgJobForm) => updateOrgJobFn(attributes.UUID || '', formData), {
    onSuccess: () => {
      enqueueSnackbar(t(messages.UpdateSuccess(), { UID: attributes.UUID }), { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['job_details', attributes.UUID], exact: true })
      setStatus('')
    }
  })

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  // Edit Org-Job Form : Register FormState
  const {
    reset,
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, dirtyFields, isDirty }
  } = useForm<IOrgJobForm>()

  const watchOverTimeTransport = watch('extendJob.overtimeTransportClaim', undefined)
  const watchShuttleService = watch('extendJob.shuttleService', undefined)
  const watchOpenToForeinger = watch('extendJob.openToForeinger', undefined)
  const watchDeparment = watch('stdDepartment', undefined)

  // Action: Update status
  const [openStsBox, setOpenStsBox] = useState<boolean>(false)
  const [status, setStatus] = useState<string>('')
  const [confirmMsg, setConfirmMsg] = useState<string>('')

  // set confirm message
  const setConfirmMessage = (_status: string) => {
    switch (_status) {
      case 'active':
        setConfirmMsg('Please confirm to publish this job?')
        break
      case 'on-hold':
        setConfirmMsg('Please confirm to hold on this job?')
        break
      case 'closed':
        setConfirmMsg('Please confirm to close this job?')
        break
      case 'draft':
        setConfirmMsg('Please confirm to re-use on this job?')
        break
      default:
        break
    }
  }

  const openStatusBox = (_status: string) => {
    setOpenStsBox(true)
    setStatus(_status)
    setConfirmMessage(_status)
  }

  const closeStatusBox = (res: boolean) => {
    setOpenStsBox(false)

    if (res) updateStatus(status)
  }

  const updateStatus = (_status: string) => {
    const params: IOrgJobForm = {
      status: _status
    }
    updateOrgJob(params)
  }

  const onSubmit: SubmitHandler<IOrgJobForm> = data => {
    if (isLoading) return
    if (!isDirty) return
    if (isEmptyObject(data)) return
    const updatedData = dirtyValues(dirtyFields, data)

    // Request API
    if (updatedData.startDate) {
      updatedData.startDate = dayjs(updatedData.startDate).format('YYYY-MM-DD HH:mm:ss')
    }
    if (updatedData.endDate) {
      updatedData.endDate = dayjs(updatedData.endDate).format('YYYY-MM-DD HH:mm:ss')
    }
    if (updatedData.stdDepartment) {
      updatedData.departmentId = updatedData.stdDepartment.id
      delete updatedData.stdDepartment
    }

    // update skills
    updatedData.skillIds = skills.length > 0 ? skills.map(o => o.id) : []
    if (updatedData.jobSkills) {
      delete updatedData.jobSkills
    }

    // updated workplaces
    updatedData.workLocationIds = stdWorkPlaces.length > 0 ? stdWorkPlaces.map(o => o.id) : []
    if (updatedData.jobLocations) {
      delete updatedData.jobLocations
    }

    updateOrgJob(updatedData)
  }

  // LOAD DATA FORM
  const [jobDepartment, setJobDepartment] = useState<IDepartmentForm>()
  const [workplaces, setWorkplaces] = useState<IWorkPlaceForm[]>([])
  useEffect(() => {
    const formData = attributes

    // Convert Date
    if (formData.startDate) {
      formData.startDate = dayjs(attributes.startDate?.toString()).format('YYYY-MM-DD')
    }
    if (formData.endDate) {
      formData.endDate = dayjs(attributes.endDate?.toString()).format('YYYY-MM-DD')
    }

    // set temp Department
    if (attributes.department) {
      formData.stdDepartment = {
        id: attributes.department?.id?.toString() || '',
        title: attributes.department?.categoryTitle?.toString() || ''
      }
      setJobDepartment({
        id: attributes.department?.id?.toString() || '',
        categoryTitle: attributes.department?.categoryTitle?.toString() || ''
      })
    }

    // set skills
    if (attributes.skills) {
      setSkills(attributes.skills.map(o => ({ id: o.id, title: o.title })))
    }

    // set workplaces
    if (attributes.workLocation) {
      setWorkplaces(attributes.workLocation)
    }

    // set Default extendJob null
    if (!formData.extendJob) formData.extendJob = defaultExtendJob
    reset(formData)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, attributes])

  // Action: selected skills
  const [skills, setSkills] = useState<ISkillForm[]>([])
  const handleSelectSkills = (data: ISkillForm | null) => {
    if (data === null) return
    // check skill is exists
    if (skills.findIndex(o => o.id === Number(data.id)) !== -1) {
      enqueueSnackbar(`${t(messages.SkillExists())}`, { variant: 'error' })
      return
    }

    setSkills(prev => [...prev, ...[data]])
  }

  // Action: Remove skills
  const onRemoveSkill = async (id: string | number) => {
    const tempSkills = [...skills]
    const idxSkill = tempSkills.findIndex(o => o.id === id)

    if (idxSkill !== -1) {
      tempSkills.splice(idxSkill, 1)

      setSkills(tempSkills)
    }
  }

  // Action: selected workplaces
  const [stdWorkPlaces, setStdWorkPlaces] = useState<IWorkPlaceForm[]>([])
  const handleSelectWorkplaces = (data: IWorkPlaceForm[]) => {
    setStdWorkPlaces(data)
  }

  // watch: department change
  useEffect(() => {
    setJobDepartment({
      id: watchDeparment?.id?.toString() || '',
      categoryTitle: watchDeparment?.title?.toString() || ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDeparment])

  return (
    <>
      <div className="flex flex-col gap-4">
        <WToolBox className="p-4">
          <div className="md:flex items-center justify-between gap-2">
            <Button onClick={cancelCurPage} variant="outline" className="mb-4 md:mb-0">
              <span className="uppercase">{t(messages.cancel())}</span>
            </Button>
            <div className={`flex items-center gap-2 ${isLoading ? 'section-loading' : ''}`}>
              {/* Button: Publish */}
              {(attributes.status === 'draft' || attributes.status === 'on-hold') && (
                <Button className="min-w-[92px]" variant="success" onClick={() => openStatusBox('active')}>
                  <span className="uppercase">{t(messages.Publish())}</span>
                </Button>
              )}
              {/* Button: Hold on */}
              {attributes.status === 'active' && (
                <Button className="min-w-[92px]" variant="warning" onClick={() => openStatusBox('on-hold')}>
                  <span className="uppercase">{t(messages['Hold on']())}</span>
                </Button>
              )}
              {/* Button: Close */}
              {attributes.status === 'on-hold' && (
                <Button className="min-w-[92px]" variant="gray" onClick={() => openStatusBox('closed')}>
                  <span className="uppercase">{t(messages.Close())}</span>
                </Button>
              )}
              {/* Button: Re-use */}
              {attributes.status === 'closed' && (
                <Button className="min-w-[92px]" variant="outline" onClick={() => openStatusBox('draft')}>
                  <span className="uppercase">{t(messages['Re-use']())}</span>
                </Button>
              )}
              {/* Button: Update */}
              <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
                {!isLoading && <span className="uppercase">{t(messages.update())}</span>}
                {isLoading && <LoadingBtn />}
              </Button>
            </div>
          </div>
        </WToolBox>
        {/* FORM */}
        {errorForm && <ErrorForm error={errorForm?.error} />}
        <div className={`form-inner flex flex-col gap-4 ${isLoading ? 'section-loading' : ''}`}>
          <FormControl className="flex-1 int-group">
            <TextField
              {...register('title', { required: true, pattern: NOT_EMPTY })}
              error={!!errors.title}
              size="small"
              label={`${t(messages['Job title']())}`}
              variant="outlined"
            />
          </FormControl>
          <div className="flex flex-col gap-4">
            <FormControl className="w-[50%] int-group pr-2">
              <TextField
                type="date"
                {...register('startDate', { required: true })}
                error={!!errors.startDate}
                size="small"
                label="Start date"
                variant="outlined"
              />
            </FormControl>
            <FormControl className="w-[50%] int-group pr-2">
              <TextField
                type="date"
                {...register('endDate', { required: true })}
                error={!!errors.endDate}
                size="small"
                label="End date"
                variant="outlined"
              />
            </FormControl>
          </div>
          {attributes.status && (
            <div className="int-group flex-1">
              <span className="f16Bold">{`${t(messages.Status())}`}:</span>&nbsp;
              <StatusLabel text={attributes.status} variant={attributes.status} />
            </div>
          )}
          <WCollapseBox title={`${t(messages.DepartmentSkills())}`} isOpenCollapse>
            <div className="flex flex-col gap-4 pt-4">
              <FormControl className="w-[50%] int-group">
                <DepartmentSelector
                  control={control}
                  fieldName="stdDepartment"
                  label="Choose department"
                  rules={{ required: true }}
                  error={!!errors.stdDepartment}
                  onSelect={val => setValue('departmentId', val)}
                  defaultValue={attributes.department as unknown as IDepartmentForm}
                />
              </FormControl>
              {/* Skills */}
              <OrgSkillIpt
                department={jobDepartment}
                onSelect={handleSelectSkills}
                skills={skills}
                onRemove={onRemoveSkill}
                control={control}
                fieldName="jobSkills"
              />
            </div>
          </WCollapseBox>
          <WCollapseBox title={`${t(messages['Job description']())}`}>
            <div className="pt-4">
              <Controller
                name="extendJob.description"
                control={control}
                render={({ field: { onChange } }) => (
                  <MarkDownEditor
                    defaultValue={attributes.extendJob?.description}
                    onChange={val => onChange(val)}
                    height={540}
                  />
                )}
              />
            </div>
          </WCollapseBox>
          <WCollapseBox title={`${t(messages.Salary())}`}>
            <div className="flex flex-row gap-4 pt-4">
              <FormControl className="w-[40%] int-group">
                <SelectList
                  fieldName="extendJob.prefCommitmentId"
                  control={control}
                  // dataList={[{ label: 'All', value: '' }, ...jobLevels]}
                  dataList={PrefCommitment}
                  defaultValue=""
                  label={`${t(messages.PreferredCommitment())}`}
                />
              </FormControl>
            </div>
            <div className="flex flex-row gap-4 pt-4">
              <FormControl className="int-group flex-1">
                <CurrencyField control={control} fieldName="minSalary" label={`${t(messages['Min salary']())}`} />
              </FormControl>
              <FormControl className="int-group flex-1">
                <CurrencyField control={control} fieldName="maxSalary" label={`${t(messages['Max salary']())}`} />
              </FormControl>
            </div>
            <div className="flex flex-row gap-4 pt-4">
              <FormControl className="w-[40%] int-group">
                <Controller
                  name="stdCurrency"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      options={convertSelectListData({ data: currencies, textField: 'name', valueField: 'label' })}
                      renderInput={params => <TextField {...params} size="small" label={`${t(messages.Currency())}`} />}
                      getOptionLabel={option => `${option.value} - ${option.text}` || ''}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      onChange={(_, data) => {
                        onChange(data)
                        setValue('currency', data?.value)
                      }}
                      defaultValue={currencyDefault}
                    />
                  )}
                />
              </FormControl>
            </div>
            <div className="flex flex-row gap-4 pt-4">
              <FormControl className="int-group w-[40%]">
                <TextField
                  {...register('numberOpen', { required: true, min: 1 })}
                  error={!!errors.numberOpen}
                  type="number"
                  size="small"
                  label={`${t(messages['Number of openings']())}`}
                  variant="outlined"
                />
              </FormControl>
            </div>
          </WCollapseBox>
          <WCollapseBox title={`${t(messages.Benefit())}`} isOpenCollapse>
            <div className="flex flex-row items-center gap-4 pt-4">
              <FormControl className="w-[20%] int-group">
                <TextField
                  {...register('extendJob.annualLeave', { min: 1 })}
                  type="number"
                  size="small"
                  label={`${t(messages['Annual leave']())}`}
                  variant="outlined"
                />
              </FormControl>
              <div>days</div>
            </div>

            <div className="flex flex-row gap-4 py-2 px-4">
              <Switcher
                control={control}
                fieldName="extendJob.perfBonus"
                label={`${t(messages['Performance bonus']())}`}
              />
              <Switcher control={control} fieldName="extendJob.aws" label={`${t(messages.AWS())}`} />
            </div>

            <div className="flex flex-row gap-4 py-2 px-4">
              <Switcher control={control} fieldName="extendJob.overtime" label={`${t(messages['Over-time']())}`} />
              <Switcher
                control={control}
                fieldName="extendJob.overTimeMealAllowance"
                label={`${t(messages['Overtime meal allowance']())}`}
              />
            </div>
            <div className="flex flex-row gap-4 py-2 px-4">
              <Switcher
                control={control}
                fieldName="extendJob.overtimeTransportClaim"
                label={`${t(messages['Overtime transport claims']())}`}
              />
            </div>
            {watchOverTimeTransport && (
              <div className="flex flex-row gap-4 pt-4">
                <FormControl className="int-group flex-1">
                  <CurrencyField
                    control={control}
                    fieldName="extendJob.minTransAllowance"
                    label={`${t(messages['Transport allowance minimum']())}`}
                  />
                </FormControl>
                <FormControl className="int-group flex-1">
                  <CurrencyField
                    control={control}
                    fieldName="extendJob.maxTransAllowance"
                    label={`${t(messages['Transport allowance maximum']())}`}
                  />
                </FormControl>
              </div>
            )}
            <div className="flex flex-col gap-4 pt-4">
              <FormGroup className="int-group pl-4">
                <Switcher
                  control={control}
                  fieldName="extendJob.shuttleService"
                  label={`${t(messages['Shuttle service']())}`}
                />
              </FormGroup>
              {watchShuttleService && (
                <TextField label={`${t(messages['Shuttle service details']())}`} multiline rows={6} />
              )}
            </div>
            <div className="flex flex-row gap-4 pt-4">
              <FormControl className="flex-1 int-group">
                <TextField
                  type="number"
                  {...register('extendJob.otherAllowance')}
                  size="small"
                  label={`${t(messages['Other allowance amount']())}`}
                  variant="outlined"
                />
              </FormControl>
              <div className="flex-1">&nbsp;</div>
            </div>
            <div className="flex flex-col pt-4">
              <TextField
                {...register('extendJob.otherBenefits')}
                label={`${t(messages['Other benefits']())}`}
                multiline
                rows={6}
              />
            </div>
          </WCollapseBox>
          <WCollapseBox title={`${t(messages['Other policies']())}`}>
            <div className="flex flex-row gap-4 pt-4">
              <FormGroup className="flex flex-row gap-4 int-group pl-2">
                <Switcher
                  control={control}
                  fieldName="extendJob.openToForeinger"
                  label={`${t(messages['Open to foreigner']())}`}
                />
              </FormGroup>
            </div>
            {watchOpenToForeinger && (
              <div className="flex flex-col gap-4 pt-4">
                <FormControl className="w-[40%] int-group">
                  <TextField
                    {...register('extendJob.foreingerQuote')}
                    type="number"
                    size="small"
                    label={`${t(messages['Foreigner quota']())}`}
                    variant="outlined"
                  />
                </FormControl>
                <FormControl className="flex-1 int-group">
                  <TextField
                    {...register('extendJob.permissleForeinger')}
                    size="small"
                    label={`${t(messages.PermissbleForeigner())}`}
                    variant="outlined"
                  />
                </FormControl>
              </div>
            )}
            <div className="flex flex-col gap-4 pt-4">
              <FormControl className="flex-1 int-group">
                <TextField size="small" label={`${t(messages['MRF ID']())}`} variant="outlined" />
              </FormControl>
              <SelectList
                fieldName="extendJob.mrfType"
                control={control}
                dataList={mrfType}
                label={`${t(messages['MRF type']())}`}
                defaultValue=""
              />
            </div>
          </WCollapseBox>
          <WCollapseBox title={`${t(messages.Workplaces())}`}>
            <OrgWorkplacesIpt
              control={control}
              fieldName="jobLocations"
              orgId={orgId}
              workplaces={workplaces}
              onChange={handleSelectWorkplaces}
            />
          </WCollapseBox>
        </div>
        {/* END: FORM */}
        <WToolBox className="p-4">
          <div className="flex items-center justify-between gap-2">
            <Button onClick={cancelCurPage} variant="outline">
              <span className="uppercase">{t(messages.cancel())}</span>
            </Button>
            <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
              {!isLoading && <span className="uppercase">{t(messages.update())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </div>
        </WToolBox>
      </div>

      <Dialog open={openStsBox} maxWidth="sm" fullWidth>
        <AlertModal getResult={closeStatusBox} title="Please confirm" content={confirmMsg} btnConfirmText="confirm" />
      </Dialog>
    </>
  )
}

export default EditJobForm
