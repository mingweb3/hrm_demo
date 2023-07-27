import { useEffect, useState } from 'react'
import { FormControl, styled } from '@mui/material'
import { useForm } from 'react-hook-form'
import { IDepartmentForm, IJobPackForm, IUserJob, IUserJobDto } from '@/types/IJob'
import { Button } from '../../Button'
import DepartmentSelector from '../DepartmentSelector'
import FieldArray from './FieldArray'
import { convertToForm, transformDto } from './helper'

const StyledCddJobField = styled('div')(``)

interface CddJobFieldProps {
  defaultData?: IUserJob[]
  onConfirm: (data: IUserJobDto[]) => void
}

const CddJobField: React.FC<CddJobFieldProps> = ({ onConfirm, defaultData }) => {
  const [cTriggerAppend, setCTriggerAppend] = useState(0) // Ping Clicking Append
  const [cFormState, setCFormState] = useState<IJobPackForm | undefined>()

  // Languages Input Row : Register FormState
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<IJobPackForm>()

  // Ping Form Changing
  useEffect(() => {
    const subscription = watch(() => {
      const dataForm = getValues()
      // Make Update FormState
      setCFormState(dataForm)

      // Convert Data to Output
      if (dataForm.jobs) {
        // console.log('transformDto', transformDto(dataForm))
        const dataDto = transformDto(dataForm)
        if (onConfirm && dataDto) {
          onConfirm(dataDto)
        }
      }
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch])

  // Load Data to FORM
  const [dftDepartment, setDftDepartment] = useState<IDepartmentForm | undefined>()
  useEffect(() => {
    if (defaultData && defaultData.length) {
      const _formData = convertToForm(defaultData)
      if (_formData) {
        setDftDepartment(_formData.department)
        reset(_formData)
      }
    }
  }, [defaultData, reset])

  return (
    <StyledCddJobField>
      <div className="job-package pb-12">
        <div className="flex items-center">
          <p className="f12Regular text-gray6 uppercase">Job / Career</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row pt-4 gap-4">
            <FormControl className="int-group   flex-1">
              <DepartmentSelector
                control={control}
                fieldName="department"
                label="Choose department"
                rules={{ required: true }}
                defaultValue={dftDepartment as IDepartmentForm}
              />
            </FormControl>
            <div className="flex-1">
              {cFormState && cFormState.department && cFormState.department.id !== '' && (
                <Button size="md" variant="outline" onClick={() => setCTriggerAppend(cTriggerAppend + 1)}>
                  <span>+ Job (Section)</span>
                </Button>
              )}
            </div>
          </div>

          {cFormState && cFormState.department && cFormState.department.id !== '' && (
            <div className="listing">
              <FieldArray
                {...{ control, register, getValues, setValue, errors, watch }}
                triggerAppend={cTriggerAppend}
                department={cFormState.department}
              />
            </div>
          )}
        </div>
      </div>
    </StyledCddJobField>
  )
}

export default CddJobField
