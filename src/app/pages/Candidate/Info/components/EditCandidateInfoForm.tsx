import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Autocomplete, FormControl, TextField } from '@mui/material'
import { styled } from '@mui/system'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
// COMPs
import { useSnackbar } from 'notistack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import LoadingBtn from '@/app/components/Button/LoadingBtn'
import { CddJobField } from '@/app/components/Input/CddJobField'
import { CurrencyField } from '@/app/components/Input/CurrencyField'
import { LanguagesField } from '@/app/components/Input/LanguagesField'
import { SelectList } from '@/app/components/Input/SelectList'
import { Switcher } from '@/app/components/Input/Switcher'
import WCollapseBox from '@/app/components/WCard/WCollapseBox'
import WToolBox from '@/app/components/WCard/WToolBox'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { updateCandidateFn } from '@/apis/candidate.api'
import { countries, currencies } from '@/constants/JsonData/countries'
import { candidateSources, eduCerts, overallGrades, refModes } from '@/constants/JsonData/eduCert'
import { gender } from '@/constants/JsonData/gender'
import { PrefCommitment, jobLevels, noticePeriod } from '@/constants/JsonData/jobLevel'
import { passTypes, physicalHealth, transportMode } from '@/constants/JsonData/passType'
// services
import { EMAIL_REGEX } from '@/constants/form/validation'
import { ICandidate, ICandidateForm } from '@/types/ICandidate'
import { IErrorForm } from '@/types/IErrorForm'
import { IUserJob } from '@/types/IJob'
import { convertSelectListData, convertToSelectedObj } from '@/utils/helper.national'
import { findSelectedItem, isEmptyObject } from '@/utils/helper.object'
import { dirtyValues, isAxiosError } from '@/utils/helpers'
import { messages } from '../../messages'

const StyledForm = styled('div')(``)

interface EditCandidateInfoFormProps {
  data: ICandidate
}

const currencyDefault = { value: 'USD', text: 'United States dollar' }

export const EditCandidateInfoForm: React.FC<EditCandidateInfoFormProps> = ({ data }) => {
  const { attributes } = data
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const cancelCurPage = () => {
    navigate('/admin/candidates')
  }

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API update Candidate: Mutation
  const {
    mutate: updateCandidate,
    isLoading,
    error
  } = useMutation((formData: ICandidateForm) => updateCandidateFn(attributes.UUID || '', formData), {
    onSuccess: () => {
      enqueueSnackbar(t(messages.UpdateSuccess(), { UID: attributes.UUID }), { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['candidate', attributes.UUID], exact: true })
    }
  })

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  // Update Candidate Form : Register FormState
  const {
    reset,
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields }
  } = useForm<ICandidateForm>()

  const onSubmit: SubmitHandler<ICandidateForm> = data => {
    if (isLoading) return
    if (isEmptyObject(data)) return

    // before Submit: handle Currency
    const updatedData = dirtyValues(dirtyFields, data)
    if (updatedData && updatedData.userBio && updatedData.userBio.currencyCurSalarySelected) {
      updatedData.userBio.currencyCurSalary = updatedData.userBio.currencyCurSalarySelected.value
      delete updatedData.userBio.currencyCurSalarySelected
    }
    if (updatedData && updatedData.userBio && updatedData.userBio.currencyExpSalarySelected) {
      updatedData.userBio.currencyExpSalary = updatedData.userBio.currencyExpSalarySelected.value
      delete updatedData.userBio.currencyExpSalarySelected
    }

    updateCandidate(updatedData)
  }

  // LOAD DATA FORM
  useEffect(() => {
    reset(attributes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, attributes])

  return (
    <StyledForm>
      <form>
        <div className="flex flex-col gap-4">
          <WToolBox className="p-4 text-right flex justify-between">
            <Button onClick={cancelCurPage} variant="outline">
              <span className="uppercase">{t(messages.cancel())}</span>
            </Button>
            <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
              {!isLoading && <span className="uppercase">{t(messages.Update())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </WToolBox>
          {/* FORM */}
          {errorForm && <ErrorForm error={errorForm?.error} />}
          <div className={`form-inner flex flex-col gap-4 ${isLoading ? 'section-loading' : ''}`}>
            <FormControl className="flex-1 int-group">
              <TextField
                size="small"
                label={`${t(messages.CandidateName())}`}
                {...register('name', { required: true })}
                error={!!errors.name}
                variant="outlined"
              />
            </FormControl>
            <div className="flex flex-col sm:flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <TextField
                  size="small"
                  {...register('contactNum', { required: true })}
                  error={!!errors.contactNum}
                  label={`${t(messages.ContactNumber())}`}
                  variant="outlined"
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <TextField
                  {...register('email', { pattern: EMAIL_REGEX, required: true })}
                  size="small"
                  label={`${t(messages.Email())}`}
                  variant="outlined"
                  error={!!errors.email}
                />
              </FormControl>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <Controller
                  name="nationality"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      options={convertSelectListData({ data: countries, textField: 'nation', valueField: 'code' })}
                      renderInput={params => (
                        <TextField {...params} size="small" label={`${t(messages.Nationality())}`} />
                      )}
                      defaultValue={{
                        text: countries.find(item => item.code === attributes.nationality)?.nationality,
                        value: attributes.nationality
                      }}
                      onChange={(_, data) => onChange(data?.value)} // Should be Obj, not string
                      getOptionLabel={option => option.text || ''}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                    />
                  )}
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <TextField
                  {...register('nationalId')}
                  error={!!errors.nationalId}
                  size="small"
                  label={`${t(messages.NationalId())}`}
                  variant="outlined"
                />
              </FormControl>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <SelectList
                  control={control}
                  fieldName="gender"
                  dataList={gender}
                  defaultValue=""
                  label={`${t(messages.Gender())}`}
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <TextField
                  type="number"
                  size="small"
                  label={`${t(messages.YearOfBirth())}`}
                  {...register('yob', {
                    min: 1940,
                    max: new Date().getFullYear()
                  })}
                  error={!!errors.yob}
                  variant="outlined"
                />
              </FormControl>
            </div>
            <div className="flex gap-4">
              <FormControl className="flex-1 int-group">
                <Controller
                  name="userBio.raceId"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      options={convertSelectListData({ data: countries, textField: 'nation', valueField: 'code' })}
                      renderInput={params => <TextField {...params} size="small" label={`${t(messages.Race())}`} />}
                      defaultValue={{
                        text: countries.find(item => item.code === attributes.userBio?.raceId)?.nationality,
                        value: attributes.userBio?.raceId
                      }}
                      onChange={(_, data) => onChange(data?.value)} // Should be Obj, not string
                      getOptionLabel={option => option.text || ''}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                    />
                  )}
                />
              </FormControl>
              <FormControl className="flex-1 int-group hidden sm:flex" />
            </div>
            <div className="flex gap-4">
              <FormControl className="flex-1 int-group">
                <TextField
                  {...register('currentLocation')}
                  size="small"
                  label={`${t(messages.CurrentLocation())}`}
                  variant="outlined"
                />
              </FormControl>
              <FormControl className="flex-1 int-group hidden sm:flex" />
            </div>
            <div className="flex gap-4">
              <FormControl className="flex-1 int-group">
                <TextField
                  {...register('areaOfResidence')}
                  size="small"
                  label={`${t(messages.AreaOfResidence())}`}
                  variant="outlined"
                />
              </FormControl>
              <FormControl className="flex-1 int-group hidden sm:flex" />
            </div>
            <div className="flex gap-4">
              <FormControl className="flex-1 int-group">
                <SelectList
                  control={control}
                  fieldName="currentPassType"
                  dataList={passTypes}
                  defaultValue="none"
                  label={`${t(messages.currentPassType())}`}
                />
              </FormControl>
              <FormControl className="flex-1 int-group hidden sm:flex" />
            </div>

            <WCollapseBox title={`${t(messages['Education / Department / Skills']())}`} isOpenCollapse>
              <div className="flex gap-4 pt-4 flex-col md:flex-row">
                <FormControl className="flex-1 int-group">
                  <SelectList
                    fieldName="userBio.grade"
                    control={control}
                    dataList={overallGrades}
                    defaultValue=""
                    label={`${t(messages.OverallCandidateGrade())}`}
                  />
                </FormControl>
                <FormControl className="flex-1 int-group">
                  <SelectList
                    fieldName="userBio.latestEduCert"
                    control={control}
                    dataList={eduCerts}
                    defaultValue=""
                    label={`${t(messages.LatestEducation())}`}
                  />
                </FormControl>
              </div>
              {/* LANGUAGES */}
              <Controller
                name="userLanguages"
                control={control}
                render={({ field: { onChange } }) => (
                  <LanguagesField onConfirm={data => onChange(data)} defaultData={attributes.userLanguages} />
                )}
              />
              {/* JOBS, SKILLS */}
              <Controller
                name="userJobs"
                control={control}
                render={({ field: { onChange } }) => (
                  <CddJobField onConfirm={data => onChange(data)} defaultData={attributes.userJobs as IUserJob[]} />
                )}
              />

              {/* ------ */}
              <div className="flex gap-4">
                <FormControl className="flex-1 int-group">
                  <SelectList
                    fieldName="userBio.jobLevel"
                    control={control}
                    dataList={jobLevels}
                    defaultValue=""
                    label={`${t(messages.JobLevel())}`}
                  />
                </FormControl>
                <FormControl className="flex-1 int-group">
                  <SelectList
                    fieldName="userBio.prefCommitmentId"
                    control={control}
                    dataList={PrefCommitment}
                    defaultValue=""
                    label={`${t(messages.PreferredCommitment())}`}
                  />
                </FormControl>
              </div>
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <FormControl className="flex-1 int-group">
                  <SelectList
                    fieldName="userBio.candidateSource"
                    control={control}
                    dataList={candidateSources}
                    defaultValue=""
                    label={`${t(messages.CandidateSource())}`}
                  />
                </FormControl>

                <FormControl className="flex-1 int-group">
                  <SelectList
                    fieldName="userBio.refMode"
                    control={control}
                    dataList={refModes}
                    defaultValue=""
                    label={`${t(messages.ReferralMode())}`}
                  />
                </FormControl>
              </div>
            </WCollapseBox>

            <WCollapseBox title={t(messages.SalaryBenefit())}>
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <FormControl className="flex-1 int-group">
                    <CurrencyField
                      control={control}
                      fieldName="userBio.curSalary"
                      label={`${t(messages.CurrentSalary())}`}
                    />
                  </FormControl>
                  <FormControl className="flex-1 int-group">
                    <Controller
                      name="userBio.currencyCurSalarySelected"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          options={convertSelectListData({ data: currencies, textField: 'name', valueField: 'label' })}
                          renderInput={params => (
                            <TextField {...params} size="small" label={`${t(messages.Currency())}`} />
                          )}
                          getOptionLabel={option => `${option.value} - ${option.text}` || ''}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          onChange={(_, data) => {
                            onChange(data)
                            setValue('userBio.currencyCurSalary', data?.value)
                          }}
                          defaultValue={
                            convertToSelectedObj(
                              findSelectedItem(attributes.userBio?.currencyCurSalary, currencies, 'label'),
                              'name',
                              'label'
                            ) || currencyDefault
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
                      fieldName="userBio.expSalary"
                      label={`${t(messages.ExpectedSalary())}`}
                    />
                  </FormControl>
                  <FormControl className="flex-1 int-group">
                    <Controller
                      name="userBio.currencyExpSalarySelected"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          options={convertSelectListData({ data: currencies, textField: 'name', valueField: 'label' })}
                          renderInput={params => (
                            <TextField {...params} size="small" label={`${t(messages.Currency())}`} />
                          )}
                          getOptionLabel={option => `${option.value} - ${option.text}` || ''}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          onChange={(_, data) => {
                            onChange(data)
                            setValue('userBio.currencyExpSalary', data?.value)
                          }}
                          defaultValue={
                            convertToSelectedObj(
                              findSelectedItem(attributes.userBio?.currencyExpSalary, currencies, 'label'),
                              'name',
                              'label'
                            ) || currencyDefault
                          }
                        />
                      )}
                    />
                  </FormControl>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <FormControl className="flex-1 int-group">
                    <SelectList
                      fieldName="userBio.noticePeriodId"
                      control={control}
                      dataList={noticePeriod}
                      defaultValue=""
                      label={`${t(messages.NoticePeriod())}`}
                    />
                  </FormControl>
                  <FormControl className="flex-1 int-group hidden sm:flex" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <FormControl className="int-group">
                    <Switcher
                      control={control}
                      fieldName="userBio.overTimeCommit"
                      label={`${t(messages.OvertimeCommitment())}`}
                    />
                  </FormControl>
                  <FormControl className="int-group">
                    <Switcher
                      control={control}
                      fieldName="userBio.weekendCommit"
                      label={`${t(messages.WeekendCommitment())}`}
                    />
                  </FormControl>
                </div>
              </div>
            </WCollapseBox>

            <WCollapseBox title={t(messages.Notes())}>
              <div className="flex flex-col gap-4 pt-4">
                <FormControl className="int-group w-full">
                  <textarea
                    {...register('userBio.itSavviness')}
                    cols={30}
                    rows={6}
                    placeholder={`${t(messages.ITSaviness())}`}
                    className="p-2 border border-gray3 border-solid rounded-[4px]"
                  />
                </FormControl>
                <FormControl className="int-group w-full">
                  <textarea
                    {...register('userBio.note')}
                    cols={30}
                    rows={6}
                    placeholder={`${t(messages.CandidateNotes())}`}
                    className="p-2 border border-gray3 border-solid rounded-[4px]"
                  />
                </FormControl>

                <div className="flex flex-col sm:flex-row gap-4">
                  <FormControl className="basis-1/2 int-group">
                    <SelectList
                      fieldName="userBio.physicalHealth"
                      control={control}
                      dataList={physicalHealth}
                      defaultValue=""
                      label={`${t(messages.PhysicalHealth())}`}
                    />
                  </FormControl>
                  <FormControl className="int-group">
                    <Switcher
                      control={control}
                      fieldName="userBio.covidVacStatus"
                      label={`${t(messages.COVIDVaccine())}`}
                    />
                  </FormControl>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <FormControl className="basis-1/2 int-group">
                    <SelectList
                      fieldName="userBio.transportMode"
                      control={control}
                      dataList={transportMode}
                      defaultValue=""
                      label={`${t(messages.ModeOfTransport())}`}
                    />
                  </FormControl>
                  <FormControl className="int-group">
                    <Switcher
                      control={control}
                      fieldName="userBio.VEPAutopass"
                      label={`${t(messages.VEPAutopass())}`}
                    />
                  </FormControl>
                </div>
              </div>
            </WCollapseBox>
          </div>
          <WToolBox className="p-4 text-right flex justify-between">
            <Button onClick={cancelCurPage} variant="outline">
              <span className="uppercase">{t(messages.cancel())}</span>
            </Button>
            <Button onClick={handleSubmit(onSubmit)} variant="primary" className="min-w-[92px]">
              {!isLoading && <span className="uppercase">{t(messages.Update())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>
          </WToolBox>
        </div>
      </form>
    </StyledForm>
  )
}
