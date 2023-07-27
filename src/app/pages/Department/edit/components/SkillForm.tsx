import { useEffect, useState } from 'react'
import FormControl from '@mui/material/FormControl'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/app/components/Button'
import { addSkillFn } from '@/apis/division.api'
import { NOT_EMPTY } from '@/constants/form/validation'
import { IMultiSkillForm, ISkill, ISkillForm } from '@/types/IJob'
import { isEmptyObject, stringToArray } from '@/utils/helper.object'
import { messages } from '../../messages'
import SkillsBox from './SkillsBox'

type SkillFormProps = {
  sectionId: string
  departmentId: string
  skillData?: ISkillForm[]
}

const initSkillForm = {
  skills: ''
}

const SkillForm: React.FC<SkillFormProps> = ({ sectionId, departmentId, skillData }) => {
  const [skills, setSkills] = useState<ISkill[] | ISkillForm[] | null>(null)
  const queryClient = useQueryClient()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Section: Mutation
  const addSkillMutation = useMutation((formData: string[]) => addSkillFn(sectionId, formData), {
    onSuccess: res => {
      enqueueSnackbar(t(messages.CreateNewSuccess()), { variant: 'success' })
      setSkills(res)
      reset(initSkillForm)
      queryClient.invalidateQueries({ queryKey: ['department', departmentId], exact: true })
    }
  })

  // Form : Section
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IMultiSkillForm>()

  const onSubmit: SubmitHandler<IMultiSkillForm> = data => {
    if (isEmptyObject(data)) return
    if (data.skills) {
      addSkillMutation.mutate(stringToArray(data.skills, ','))
    }
  }

  // get skillData to List
  useEffect(() => {
    if (skillData && skillData.length > 0) setSkills(skillData)
  }, [skillData])

  return (
    <div className="flex flex-col gap-4">
      <div className="section-title f12Regular uppercase letter tracking-[.2em] text-gray3">{t(messages.Skills())}</div>
      {skills && skills?.length > 0 && <SkillsBox data={skills} isEditwMode departmentId={departmentId} />}
      {/* FORM */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <FormControl className="int-group flex-1">
          <textarea
            {...register('skills', { pattern: NOT_EMPTY, required: true })}
            cols={30}
            rows={3}
            placeholder="Input skills (Word, Execl, Photoshop, CapCut...)"
            className="p-2 border border-gray3 border-solid rounded-[4px]"
          />
          {!!errors.skills && <p className="f12Regular text-red">{t(messages.RequiredSkills())}</p>}
        </FormControl>
        <FormControl className="int-group">
          <Button onClick={handleSubmit(onSubmit)} variant="outline" size="sm" className="min-w-[92px]">
            <span>{t(messages.AddSkill())}</span>
          </Button>
        </FormControl>
      </div>
    </div>
  )
}

export default SkillForm
