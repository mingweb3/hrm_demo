import { useEffect, useMemo, useState } from 'react'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { useMutation } from '@tanstack/react-query'
import { t } from 'i18next'
import lowerCase from 'lodash/lowerCase'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import DivisionSelector from '@/app/components/Input/DivisionSelector'
import { CrossIcon } from '@/app/components/Svg/CrossIcon'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { createDivisionFn } from '@/apis/division.api'
import { IErrorForm } from '@/types/IErrorForm'
import { IDivisionForm } from '@/types/IJob'
import { isAxiosError, isEmpty } from '@/utils/helpers'
import { messages } from '../../messages'
import { OrgDepartmentForm } from './types'

const StyledOrgDivisionIpt = styled('div')(
  ({ theme }) => `
    border-bottom: 1px solid ${theme.palette.common.white};
`
)

interface OrgDivisionIptProps {
  className?: string
  onSelect?: (data: IDivisionForm | null) => void
}

const OrgDivisionIpt: React.FC<OrgDivisionIptProps> = ({ onSelect }) => {
  const [stdDiv, setStdDiv] = useState<IDivisionForm | null>()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Create Division: Mutation
  const divMut = useMutation((formData: IDivisionForm) => createDivisionFn(formData), {
    onSuccess: data => {
      setNewDiv('')
      enqueueSnackbar(t(messages.CreateNewSuccess()), { variant: 'success' })
      const stdData = {
        id: data.id,
        title: data.attributes.title
      }
      setStdDiv(stdData)
      if (onSelect) {
        onSelect(stdData)
      }
    }
  })

  const onSubmitDiv = () => {
    if (isEmpty(newDiv)) return
    divMut.mutate({ title: newDiv })
  }

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(divMut.error)) {
      return divMut.error.response?.data
    }
    return undefined
  }, [divMut.error])

  // Division Form : Register FormState
  const { control, watch, getValues } = useForm<OrgDepartmentForm>()

  const watchDivision = watch('division', undefined)

  // Action: Get New Division
  const [newDiv, setNewDiv] = useState('')
  const [nChar, setNChar] = useState('')
  const getNewDiv = (char: string) => {
    if (char) {
      setNChar(char)
    } else {
      setNChar('')
    }
  }

  // Action: Get OptionList
  const [opList, setOpList] = useState([])
  const getOpList = (data: any) => {
    setOpList(data)
  }

  // action: Reset Division data
  const resetDiv = () => {
    setStdDiv(null)
    if (onSelect) {
      onSelect(null)
    }
  }

  // watch: Div typing to get Selected Division
  useEffect(() => {
    if (nChar) {
      if (opList.length <= 0) {
        setNewDiv(nChar)
      } else {
        const isFound = opList.findIndex((item: any) => lowerCase(item?.attributes?.title) === lowerCase(nChar))
        if (isFound < 0) {
          setNewDiv(nChar)
        } else {
          setNewDiv('')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opList, nChar])

  // watch: Selected Div to Emit
  useEffect(() => {
    setStdDiv(getValues('division'))
    const _data = getValues('division')
    if (onSelect && _data) {
      onSelect(_data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDivision])

  return (
    <StyledOrgDivisionIpt className={`${divMut.isLoading ? 'section-loading' : 'standby'}`}>
      <h5 className="f12Regular uppercase letter tracking-[.2em] text-gray6 mb-4">{t(messages.Division())}</h5>
      {errorForm && (
        <div className="mb-4">
          <ErrorForm error={errorForm?.error} />
        </div>
      )}
      <div className="flex flex-col gap-4">
        {stdDiv && (
          <div className="flex flex-row items-center gap-2">
            <div className="f16Regular">
              Selected Division: <span className="f16Bold">{stdDiv.title}</span>
            </div>
            <Tooltip title="Choose again">
              <IconButton onClick={() => resetDiv()} aria-hidden="true">
                <CrossIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
        {!stdDiv && (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <FormControl className="w-full sm:flex-1 int-group">
              <DivisionSelector
                control={control}
                fieldName="division"
                label={`${t(messages.Division())}`}
                noOptionsText={`${t(messages.TypeToFind())}`}
                onTyping={getNewDiv}
                onLoadOptions={getOpList}
                rules={{ required: true }}
              />
            </FormControl>
            <FormControl className="w-full sm:flex-1 int-group flex flex-row gap-4">
              {newDiv !== '' && (
                <Button onClick={onSubmitDiv} variant="outline">
                  <span className="uppercase">
                    Create new: <i className="f12Regular">{newDiv}</i>
                  </span>
                </Button>
              )}
              {newDiv !== '' && (
                <Tooltip title="Clear">
                  <IconButton onClick={() => setNewDiv('')} aria-hidden="true">
                    <CrossIcon />
                  </IconButton>
                </Tooltip>
              )}
            </FormControl>
          </div>
        )}
      </div>
    </StyledOrgDivisionIpt>
  )
}

export default OrgDivisionIpt
