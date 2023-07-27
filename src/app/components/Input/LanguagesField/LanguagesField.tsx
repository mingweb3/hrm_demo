import { useEffect, useState } from 'react'
import { IconButton, Tooltip, styled } from '@mui/material'
import { t } from 'i18next'
import { useForm } from 'react-hook-form'
import { ILangItemDto, ILangItemsForm } from '@/types/IJob'
import { CirclePlusIcon } from '../../Svg/CirclePlusIcon'
import FieldArray from './FieldArray'
import { convertToForm, transformDto, validateData } from './helper'
import { messages } from './messages'

const StyledLanguagesField = styled('div')(``)

const defaultValues = {
  langItem: [
    {
      lang: { text: 'English', value: 'en' },
      oral: true,
      written: false,
      level: 'basic'
    }
  ]
}

interface LanguagesFieldProps {
  defaultData?: ILangItemDto[]
  onConfirm: (data: ILangItemDto[]) => void
}

const LanguagesField: React.FC<LanguagesFieldProps> = ({ defaultData, onConfirm }) => {
  const [cTriggerAppend, setCTriggerAppend] = useState(0) // Ping Clicking Append

  // Languages Input Row : Register FormState
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ILangItemsForm>({ defaultValues })

  // Ping Form Changing
  useEffect(() => {
    const subscription = watch(() => {
      const dataForm = getValues()
      if (validateData(dataForm)) {
        const tData = transformDto(dataForm)
        if (tData) {
          onConfirm(tData)
        }
      }
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch])

  // Load Data to FORM
  useEffect(() => {
    if (defaultData && defaultData.length) {
      reset(convertToForm(defaultData))
    }
  }, [defaultData, reset])

  return (
    <StyledLanguagesField>
      <div className="lang pb-8">
        <div className="flex justify-between items-center pt-4">
          <p className="f12Regular text-gray6 uppercase">{t(messages.Language())}</p>
          <div className="flex flex-row items-center gap-2">
            <Tooltip title="Add language">
              <IconButton onClick={() => setCTriggerAppend(cTriggerAppend + 1)} aria-hidden="true">
                <CirclePlusIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="pt-4 pb-2">
          <FieldArray
            {...{ control, register, getValues, setValue, defaultValues, errors }}
            triggerAppend={cTriggerAppend}
          />
        </div>
        <div className="lang-note f12Regular text-blue">* Please make sure to check Oral / Written!</div>
      </div>
    </StyledLanguagesField>
  )
}

export default LanguagesField
