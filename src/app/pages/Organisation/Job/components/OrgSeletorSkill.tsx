import { useEffect, useState } from 'react'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { t } from 'i18next'
import lowerCase from 'lodash/lowerCase'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import SkillSelectorOne from '@/app/components/Input/SkillSeletorOne'
import { CrossIcon } from '@/app/components/Svg/CrossIcon'
import { createOrgJobSkillFn } from '@/apis/org.job.api'
import { IErrorForm } from '@/types/IErrorForm'
import { IDepartmentForm, ISkillForm } from '@/types/IJob'
import { IOrgJobSkillForm } from '@/types/IOrgJob'
import { isEmpty } from '@/utils/helpers'
import { messages } from '../../messages'

const StyledOrgSeletorSkill = styled('div')(
  ({ theme }) => `
      border-bottom: 1px solid ${theme.palette.common.white};
  `
)

interface OrgSeletorSkillProps {
  className?: string
  onSelect?: (data: ISkillForm | null) => void
  department?: IDepartmentForm
  hideBtnCreateNew?: boolean
}

const OrgSeletorSkill: React.FC<OrgSeletorSkillProps> = ({ onSelect, department, hideBtnCreateNew }) => {
  const [stdSkill, setStdSkill] = useState<ISkillForm | null>()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // Skills Form : Register FormState
  const { control, getValues, watch } = useForm()

  const watchSkill = watch('skill', undefined)

  // API Create Skill: Mutation
  const skillMut = useMutation((formData: IOrgJobSkillForm) => createOrgJobSkillFn(formData), {
    onSuccess: data => {
      enqueueSnackbar(t(messages.CreateNewSuccess()), { variant: 'success' })
      const stdData = {
        id: data.id,
        title: data.attributes.title
      }
      if (onSelect) {
        onSelect(stdData)
      }
      resetSkill()
    },
    onError: e => {
      if (isAxiosError<{ error: IErrorForm }>(e)) {
        const _errorMsg = e.response?.data?.error?.data?.toString() || 'There is an issue on saving'
        enqueueSnackbar(`${e.response?.data?.error.code} - ${_errorMsg}`, { variant: 'error' })

        resetSkill()
      }
    }
  })

  const onSubmitSkill = () => {
    if (isEmpty(newSkill)) return

    skillMut.mutate({
      title: newSkill,
      categoryId: department?.id
    })
  }

  // Action: Get New Skills
  const [newSkill, setNewSkill] = useState('')
  const [nChar, setNChar] = useState('')
  const getNewSkill = (char: string) => {
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
  const resetSkill = () => {
    setStdSkill(null)
    setNewSkill('')
    if (onSelect) {
      onSelect(null)
    }
  }

  // watch: Dep typing to get Selected Departmemt
  useEffect(() => {
    if (nChar) {
      if (opList.length <= 0) {
        setNewSkill(nChar)
      } else {
        const isFound = opList.findIndex((item: any) => lowerCase(item?.attributes?.title) === lowerCase(nChar))
        if (isFound < 0) {
          setNewSkill(nChar)
        } else {
          setNewSkill('')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opList, nChar])

  // watch: Selected SKill to Emit
  useEffect(() => {
    setStdSkill(getValues('skill'))
    const _data = getValues('skill')
    if (onSelect && _data) {
      onSelect(_data)
      // reset skills after selected skill
      setTimeout(() => {
        resetSkill()
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchSkill])

  return (
    <StyledOrgSeletorSkill className="standby">
      <div className="flex flex-row gap-4">
        <FormControl className="w-[50%] int-group">
          <SkillSelectorOne
            control={control}
            fieldName="skill"
            label={`${t(messages['Select skills']())}`}
            noOptionsText={`${t(messages.TypeToFind())}`}
            onTyping={getNewSkill}
            onLoadOptions={getOpList}
            department={department}
          />
        </FormControl>
        {!stdSkill && !hideBtnCreateNew && (
          <FormControl className="w-full sm:flex-1 int-group flex flex-row gap-4">
            {newSkill !== '' && (
              <Button variant="outline" onClick={onSubmitSkill}>
                <span className="uppercase">
                  Create new: <i className="f12Regular">{newSkill}</i>
                </span>
              </Button>
            )}
            {newSkill !== '' && (
              <Tooltip title="Clear">
                <IconButton onClick={() => setNewSkill('')} aria-hidden="true">
                  <CrossIcon />
                </IconButton>
              </Tooltip>
            )}
          </FormControl>
        )}
      </div>
    </StyledOrgSeletorSkill>
  )
}

export default OrgSeletorSkill
