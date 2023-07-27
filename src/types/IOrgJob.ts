import { TextFieldProps } from '@mui/material'
import { Dayjs } from 'dayjs'
import { IUserAttributes } from './IAuth'
import { IDateTime } from './ICandidate'
import { IDepartmentForm } from './IJob'
import { IOrganizationForm, IWorkPlaceForm } from './IOrganization'
import { IMetaData } from './IPagination'

export interface IOrgJobs {
  data: IOrgJob[]
  meta: IMetaData
}

export interface IOrgJobForm {
  id?: number | string
  UUID?: string
  title?: string
  skillIds?: string[]
  skills?: { id: string; title: string }[]
  jobSkills?: string
  jobLocations?: string
  workLocationIds?: string[]
  workLocation?: IWorkPlaceForm[]
  departmentId?: string
  orgUUID?: string
  stdDepartment?: { id: string; title: string }
  department?: IDepartmentForm
  numberOpen?: number
  minSalary?: number
  maxSalary?: number
  currency?: string
  stdCurrency?: { text: string; value: string }
  startDateObj?: Dayjs
  endDateObj?: Dayjs
  startDate?: Date | string
  endDate?: Date | string
  status?: string
  extendJob?: IOrgJobExt
  organisation?: IOrganizationForm
  // ---
  createdAt?: Date
  modifiedAt?: Date
  creatorUser?: IUserAttributes
  modifiedUser?: IUserAttributes
}

export interface IOrgJobExt {
  description?: string
  prefCommitmentId?: string
  openToForeinger?: boolean
  foreingerQuote?: number
  permissleForeinger?: string
  mrfId?: string
  mrfType?: string
  overtime?: boolean
  perfBonus?: boolean
  aws?: boolean
  annualLeave?: number
  otherBenefits?: string
  otherAllowance?: string
  shuttleService?: boolean
  overTimeMealAllowance?: boolean
  overtimeTransportClaim?: boolean
  minTransAllowance?: number
  maxTransAllowance?: number
  probationPeriod?: string
}

export interface IOrgJob {
  id: string
  type: string
  attributes: IOrgJobForm
}

export interface IFilterOrgJobForm {
  title?: string
  department?: {
    categoryTitle?: string
  }
  minSalary?: string
  maxSalary?: string
  createBy?: string
  modifiedBy?: string
  createdDateForm?: string
  createdDateTo?: string
  startDate?: string
  endDate?: string
}

export interface IQueryParamsOrgJobs {
  filterStartDate?: string
  filterEndDate?: string
  filterCreatedAtFrom?: string
  filterCreatedAtTo?: string
  status?: string
}

export interface IOrgJobSkillForm {
  title?: string
  categoryId?: number | string
}

export interface IFilterOrgJobCanForm {
  candidate?: {
    name?: string
    email?: string
    nationality?: string
    currentLocation?: string
    userBio: {
      jobLevel?: string & TextFieldProps
    }
  }
  decision?: string
}

export interface IOrgJobCandidate {
  id: number | string
  name: string
  email: string
  country: string
  currentLocation: string
  jobLevel: string
  grade?: string
  assignedOn: IDateTime
  status: string
  assignedRecruiter: string
}
