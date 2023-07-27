import { useEffect, useState } from 'react'
import { FormControl, IconButton, Tooltip, styled } from '@mui/material'
import { t } from 'i18next'
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray
} from 'react-hook-form'
import { ICddJobItem, IDepartmentForm } from '@/types/IJob'
import { RemoveIcon } from '../../Svg/RemoveIcon'
import SectionSelector from '../SectionSelector'
import SkillSelector from '../SkillSelector'
import { messages } from './messages'

const StyledFieldArray = styled('div')(`
  .form-arr-item {
    border-bottom: 1px dashed #ddd;
  }
`)

interface FieldArrayProps {
  control: Control<any>
  register: UseFormRegister<any>
  setValue?: UseFormSetValue<any>
  getValues?: UseFormGetValues<any>
  watch: UseFormWatch<any>
  triggerAppend?: number
  errors?: FieldErrors<any>
  department?: IDepartmentForm
}

const appendItemDefault = undefined

const FieldArray = ({ control, triggerAppend, getValues, register, watch, department }: FieldArrayProps) => {
  // Register Fields in Array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'jobs'
  })

  // Trigger Click: Append
  useEffect(() => {
    if (triggerAppend && triggerAppend > 0) {
      append(appendItemDefault)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerAppend])

  // Remove Item
  const handleRemoveItm = (idx: number) => {
    if (idx === 0) return
    remove(idx)
  }

  // Ping Form Changing
  const [cJobs, setCJobs] = useState<ICddJobItem[] | undefined>()
  useEffect(() => {
    const subscription = watch(() => {
      if (getValues) {
        const dataForm = getValues()
        if (dataForm && dataForm.jobs && dataForm.jobs.length > 0) {
          setCJobs(dataForm.jobs)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [getValues, watch])

  useEffect(() => {
    const _fields: ICddJobItem[] = fields as ICddJobItem[]
    if (_fields.length > 0 && _fields[0]?.job) {
      setCJobs(_fields)
    }
  }, [fields])

  return (
    <StyledFieldArray className="form-arr-list pt-2 flex flex-col gap-4">
      {fields.map((item: any, index) => {
        return (
          <div key={item.id} className="form-arr-item flex flex-row gap-4 py-4">
            <div>#{index + 1}</div>
            <div className="flex flex-col flex-1 gap-4">
              <div className="flex flex-row gap-4">
                <FormControl id="section-selector" className="flex-1 int-group">
                  <SectionSelector
                    control={control}
                    fieldName={`jobs.${index}.job`}
                    label="Chooses job (section)"
                    noOptionsText="Find ..."
                    department={department}
                    defaultValue={item?.job || { id: '', title: '' }}
                  />
                </FormControl>
                <div className="flex-1">
                  {index === 0 && <p className="w-[40px]">&nbsp;</p>}
                  {index !== 0 && (
                    <Tooltip title={`${t(messages.RemoveThisItem())}`}>
                      <IconButton onClick={() => handleRemoveItm(index)} aria-hidden="true">
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </div>
              {cJobs && cJobs[index]?.job && (
                <FormControl className="flex-1 int-group">
                  <SkillSelector
                    control={control}
                    fieldName={`jobs.${index}.skills`}
                    label="Add skills"
                    noOptionsText="Find ..."
                    section={cJobs[index]?.job}
                    defaultValue={item?.skills || []}
                  />
                </FormControl>
              )}
              <FormControl className="flex-1 int-group">
                <textarea
                  {...register(`jobs.${index}.otherSkills`)}
                  cols={30}
                  rows={3}
                  placeholder="Input skills (Word, Execl, Photoshop, CapCut...)"
                  className="p-2 border border-gray3 border-solid rounded-[4px]"
                />
              </FormControl>
            </div>
          </div>
        )
      })}
    </StyledFieldArray>
  )
}

export default FieldArray
