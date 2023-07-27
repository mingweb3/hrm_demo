import { TextFieldProps } from '@mui/material/TextField'
import dayjs from 'dayjs'
import { IUserAttributes } from './IAuth'
import { IFile } from './IFile'
import { ILangItemDto, ISectionForm, IUserJob, IUserJobDto } from './IJob'
import { IMetaData } from './IPagination'

export interface ICandidates {
  data: ICandidate[]
  meta: IMetaData
}
export interface ICandidate {
  id: string
  type: string
  attributes: ICandidateForm
}

export interface IDateTime {
  date: string
  time: string
}
export interface ICandidatePlacement {
  id: number
  jobTitle: string
  jobType: string
  organization: string
  assignedOn: IDateTime
  updatedOn: IDateTime
  status: string
  assignedRecruiter: string
}
export interface ITagItem {
  value: number
  label: string
}

export interface IFilterCandidateForm {
  name?: string
  email?: string
  isPublished?: string & TextFieldProps
  job?: ISectionForm
  userJobs?: {
    sectionId: string
  }
  userBio: {
    jobLevel?: string & TextFieldProps
  }
  nationality?: string
}

export interface ICandidateForm {
  id?: number
  name: string
  email: string
  contactNum: string
  nationality?: string
  nationalId: string
  gender: string
  yob: dayjs.Dayjs | Date | string
  currentLocation?: string
  areaOfResidence?: string
  currentPassType: string
  UUID?: string
  principalUUID?: string
  userBio?: IUserBio
  userLanguages?: ILangItemDto[]
  userJobs?: IUserJobDto[] | IUserJob[]
  documents?: IFile[]
  // - native
  createdAt?: Date | string
  mofifiedAt?: Date | string
  isPublished?: boolean
  creatorUser?: IUserAttributes
  modifiedUser?: IUserAttributes
}

export interface IUserBio {
  id?: number
  grade?: string
  jobSuitabilityIds?: string
  jobLevel?: string
  prefCommitmentId?: string
  raceId?: string
  curSalary?: number
  expSalary?: number
  currencyCurSalarySelected?: { text: string; value: string }
  currencyExpSalarySelected?: { text: string; value: string }
  currencyCurSalary?: string
  currencyExpSalary?: string
  noticePeriodId?: string
  overTimeCommit?: boolean
  weekendCommit?: boolean
  candidateSource?: string
  refMode?: string
  itSavviness?: string
  latestEduCert?: string
  note?: string
  covidVacStatus?: boolean
  physicalHealth?: string
  transportMode?: string
  VEPAutopass?: boolean
}
