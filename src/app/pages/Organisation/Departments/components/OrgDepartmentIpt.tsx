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
import DepartmentSelector from '@/app/components/Input/DepartmentSelector'
import { CrossIcon } from '@/app/components/Svg/CrossIcon'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { createDepartmentFn } from '@/apis/division.api'
import { IErrorForm } from '@/types/IErrorForm'
import { IDepartmentForm, IDivisionForm } from '@/types/IJob'
import { isAxiosError, isEmpty } from '@/utils/helpers'
import { messages } from '../../messages'
import { OrgDepartmentForm } from './types'

const StyledOrgDepartmentIpt = styled('div')(
  ({ theme }) => `
    border-bottom: 1px solid ${theme.palette.common.white};
`
)

interface OrgDepartmentIptProps {
  className?: string
  onSelect?: (data: IDepartmentForm | null) => void
  division: IDivisionForm
}

const OrgDepartmentIpt: React.FC<OrgDepartmentIptProps> = ({ onSelect, division }) => {
  const [stdDep, setStdDep] = useState<IDepartmentForm | null>()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Create Division: Mutation
  const depMut = useMutation((formData: IDepartmentForm) => createDepartmentFn(formData), {
    onSuccess: data => {
      setNewDep('')
      enqueueSnackbar(t(messages.CreateNewSuccess()), { variant: 'success' })
      const stdData = {
        id: data.id,
        title: data.attributes.categoryTitle,
        categoryTitle: data.attributes.categoryTitle
      }
      setStdDep(stdData)
      if (onSelect) {
        onSelect(stdData)
      }
    }
  })

  const onSubmitDiv = () => {
    if (isEmpty(newDep)) return
    depMut.mutate({
      categoryTitle: newDep,
      divisionId: division.id
    })
  }

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(depMut.error)) {
      return depMut.error.response?.data
    }
    return undefined
  }, [depMut.error])

  // Department Form : Register FormState
  const { control, watch, getValues } = useForm<OrgDepartmentForm>()

  const watchDep = watch('department', undefined)

  // Action: Get New Department
  const [newDep, setNewDep] = useState('')
  const [nChar, setNChar] = useState('')
  const getNewDep = (char: string) => {
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

  // action: Reset Departmemt data
  const resetDep = () => {
    setStdDep(null)
    if (onSelect) {
      onSelect(null)
    }
  }

  // watch: Dep typing to get Selected Departmemt
  useEffect(() => {
    if (nChar) {
      if (opList.length <= 0) {
        setNewDep(nChar)
      } else {
        const isFound = opList.findIndex((item: any) => lowerCase(item?.attributes?.categoryTitle) === lowerCase(nChar))
        if (isFound < 0) {
          setNewDep(nChar)
        } else {
          setNewDep('')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opList, nChar])

  // watch: Selected Dep to Emit
  useEffect(() => {
    setStdDep(getValues('department'))
    const _data = getValues('department')
    if (onSelect && _data) {
      onSelect(_data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDep])

  return (
    <StyledOrgDepartmentIpt className={`${depMut.isLoading ? 'section-loading' : 'standby'}`}>
      <h5 className="f12Regular uppercase letter tracking-[.2em] text-gray6 mb-4">{t(messages.Department())}</h5>
      {errorForm && (
        <div className="mb-4">
          <ErrorForm error={errorForm?.error} />
        </div>
      )}
      <div className="flex flex-col gap-4">
        {stdDep && (
          <div className="flex flex-row items-center gap-2">
            <div className="f16Regular">
              Selected Department: <span className="f16Bold">{stdDep.title}</span>
            </div>
            <Tooltip title="Choose again">
              <IconButton onClick={() => resetDep()} aria-hidden="true">
                <CrossIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
        {!stdDep && (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <FormControl className="w-full sm:flex-1 int-group">
              <DepartmentSelector
                control={control}
                fieldName="department"
                label={`${t(messages.Department())}`}
                noOptionsText={`${t(messages.TypeToFind())}`}
                onTyping={getNewDep}
                onLoadOptions={getOpList}
                divisionId={division.id?.toString()}
                rules={{ required: true }}
              />
            </FormControl>
            <FormControl className="w-full sm:flex-1 int-group flex flex-row gap-4">
              {newDep !== '' && (
                <Button onClick={onSubmitDiv} variant="outline">
                  <span className="uppercase">
                    Create new: <i className="f12Regular">{newDep}</i>
                  </span>
                </Button>
              )}
              {newDep !== '' && (
                <Tooltip title="Clear">
                  <IconButton onClick={() => setNewDep('')} aria-hidden="true">
                    <CrossIcon />
                  </IconButton>
                </Tooltip>
              )}
            </FormControl>
          </div>
        )}
      </div>
    </StyledOrgDepartmentIpt>
  )
}

export default OrgDepartmentIpt
