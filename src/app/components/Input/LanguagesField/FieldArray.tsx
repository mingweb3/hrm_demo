import { useEffect } from 'react'
import { Autocomplete, Checkbox, FormControl, FormControlLabel, IconButton, TextField, Tooltip } from '@mui/material'
import { t } from 'i18next'
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useFieldArray
} from 'react-hook-form'
import { levels } from '@/constants/JsonData/jobLevel'
import { Languages } from '@/constants/JsonData/languages'
import { convertSelectListData } from '@/utils/helper.national'
import { RemoveIcon } from '../../Svg/RemoveIcon'
import { SelectList } from '../SelectList'
import { messages } from './messages'

interface FieldArrayProps {
  control: Control<any>
  register: UseFormRegister<any>
  setValue?: UseFormSetValue<any>
  getValues?: UseFormGetValues<any>
  triggerAppend?: number
  errors?: FieldErrors<any>
}

const appendItemDefault = { lang: { text: 'English', value: 'en' }, oral: true, written: false, level: 'basic' }

const FieldArray = ({ control, triggerAppend }: FieldArrayProps) => {
  // Register Fields in Array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'langItem'
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

  return (
    <div className="flex flex-col gap-4">
      {fields.map((item: any, index) => {
        return (
          <div key={item.id} className="flex flex-col md:flex-row gap-4">
            <FormControl className="flex-1 int-group">
              <Controller
                name={`langItem.${index}.lang`}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange } }) => (
                  <Autocomplete
                    options={convertSelectListData({ data: Languages, textField: 'name', valueField: 'code' })}
                    renderInput={params => <TextField {...params} size="small" label={`${t(messages.Language())}`} />}
                    defaultValue={item?.lang || { text: 'English', value: 'en' }}
                    onChange={(_, data) => onChange(data)} // Should be Obj, not string
                    getOptionLabel={option => option.text || ''}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                  />
                )}
              />
            </FormControl>
            <FormControl className="flex-1 int-group flex flex-row gap-4">
              <Controller
                name={`langItem.${index}.oral`}
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox onChange={e => field.onChange(e.target.checked)} checked={field.value} />}
                    label="Oral"
                  />
                )}
              />
              <Controller
                name={`langItem.${index}.written`}
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox onChange={e => field.onChange(e.target.checked)} checked={field.value} />}
                    label="Written"
                  />
                )}
              />
            </FormControl>
            <FormControl className="flex-1 int-group">
              <SelectList
                control={control}
                fieldName={`langItem.${index}.level`}
                dataList={levels}
                label={`${t(messages.Level())}`}
              />
            </FormControl>

            <div>
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
        )
      })}
    </div>
  )
}

export default FieldArray
