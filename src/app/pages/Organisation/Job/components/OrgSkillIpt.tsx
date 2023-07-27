import { t } from 'i18next'
import { Controller } from 'react-hook-form'
import { Control, RegisterOptions } from 'react-hook-form/dist/types'
import { TagItem } from '@/app/pages/Department/edit/components/SkillsBox'
import { IDepartmentForm, ISkillForm } from '@/types/IJob'
import { messages } from '../messages'
import OrgSeletorSkill from './OrgSeletorSkill'

interface OrgSkillIptProps {
  department?: IDepartmentForm
  onSelect: (data: ISkillForm | null) => void
  onRemove: (id: string | number) => void
  skills?: ISkillForm[]
  control: Control<any>
  fieldName: string
  rules?: Omit<RegisterOptions<any, string>, 'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'> | undefined
  hideBtnCreateNew?: boolean
}

const OrgSkillIpt: React.FC<OrgSkillIptProps> = props => {
  const { department, skills, onSelect, onRemove, fieldName, control, rules, hideBtnCreateNew } = props

  return (
    <>
      <Controller
        name={fieldName}
        rules={rules}
        control={control}
        render={({ field: { onChange } }) => (
          <>
            <OrgSeletorSkill
              hideBtnCreateNew={hideBtnCreateNew}
              department={department}
              onSelect={(data: ISkillForm | null) => {
                onSelect(data)
                onChange(data?.title || fieldName)
              }}
            />
            {skills && skills?.length > 0 && (
              <div className="pt-2">
                <div className="section-title f12Regular uppercase letter tracking-[.2em] text-gray3">
                  {`${t(messages.Skills())}`}
                </div>
                <div className="flex flex-row flex-wrap gap-2">
                  {skills.map((item: any) => {
                    const { id } = item
                    return (
                      <TagItem
                        key={id}
                        id={id}
                        editMode
                        data={item}
                        onRemoveItem={(id: string | number) => {
                          onRemove(id)
                          onChange(id as string)
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      />
    </>
  )
}

export default OrgSkillIpt
