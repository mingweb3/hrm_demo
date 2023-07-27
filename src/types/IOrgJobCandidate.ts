import { TextFieldProps } from '@mui/material'
import { IDepartmentForm, ISkillForm } from './IJob'

export interface IFilterCanForm {
  name?: string
  stdDepartment?: { id: string; title: string }
  department?: IDepartmentForm
  skillIds?: string[]
  skills?: ISkillForm[]
  candidateSkills?: string
  userBio: {
    jobLevel?: string & TextFieldProps
    expSalary?: number
  }
  currentLocation?: string
  email?: string
  nationality?: string
}
