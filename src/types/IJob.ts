import { TextFieldProps } from '@mui/material/TextField'
import { ItemList } from '@/utils/helper.object'
import { IMetaData } from './IPagination'

export interface IJob {
  id: number
  title: string
  openings: number
  salary: string
  currency: string
  startDate: string
  closeDate: string
  status: string
  department: string
  createdLog: ILogAction
  modifiedLog: ILogAction
}

export interface ILogAction {
  datetime: string
  userAccount: string
}

// DIVISION
export interface IDivisions {
  data: IDivision[]
  meta: IMetaData
}

export interface IDivision {
  id: string
  type: string
  attributes: IDivisionForm
}

export interface IDivisionForm {
  id?: number | string
  title: string
  description?: string
}

export interface IFilterDivisionForm {
  title?: string
  sort?: string & TextFieldProps
}

// DEPARTMENT
export interface IDepartments {
  data: IDepartment[]
  meta: IMetaData
}

export interface IDepartment {
  id: string
  type: string
  attributes: IDepartmentForm
}

export interface IDepartmentForm {
  id?: number | string
  categoryTitle: string
  title?: string
  description?: string
  divisionId?: number | ItemList | string // Create/Edit Form
  division?: IDivisionForm
  sections?: ISectionForm[]
}

export interface IFilterDeForm {
  categoryTitle?: string
  sections?: { id?: string; title?: string }
  sectionId?: string
  division?: IDivisionForm
  divisionId?: string
  sort?: string
}

// SECTION
export interface ISections {
  data: ISection[]
  meta: IMetaData
}

export interface ISection {
  id: string
  type: string
  attributes: ISectionForm
}

export interface ISectionForm {
  id?: number | string
  title: string
  description?: string
  categoryId?: number | string
  skills?: ISkillForm[]
}

// Skills
export interface ISkills {
  data: ISkill[]
  meta: IMetaData
}

export interface ISkill {
  type: string
  id: string
  title: string
  attributes: ISkillForm
}

export interface ISkillForm {
  id?: number | string
  title?: string
}

export interface IMultiSkillForm {
  skills?: string
}

export interface ILangItem {
  lang?: {
    text: string
    value: string
  }
  oral: boolean
  written: boolean
  level: string
}

// LANG
export interface ILangItemsForm {
  langItem?: ILangItem[]
}

export interface ILangItemDto {
  langaugeId: string
  languageCompetency: string
  languageProficiency: string
}

// JOB_PACKAGE
export interface IUserJob {
  id: number
  department: IDepartmentForm
  section: ISectionForm
  skills?: ISkillForm[]
  otherSkills?: string
}
export interface ICddJobItem {
  id?: string
  job: ISectionForm
  skills: ISkillForm[]
  otherSkills: string
}

export interface IJobPackForm {
  department: IDepartmentForm
  jobs?: ICddJobItem[]
}

export interface IUserJobDto {
  departmentId: number
  sectionId: number
  skills: ISkillForm[]
  otherSkills: string
}
