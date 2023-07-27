import { ICandidateForm } from './ICandidate'
import { IOrgJobForm } from './IOrgJob'
import { IMetaData } from './IPagination'

export interface IJobPlacement {
  data: IPlacement[]
  meta: IMetaData
}

export interface IPlacement {
  id: string
  type: string
  attributes: IPlacementForm
}

export interface IPlacementForm {
  UUID?: string
  candidateUUID?: string
  jobUUID?: string
  candidateGrade?: string
  panelOfInterviewers?: string
  interviewDate?: Date | string
  meetingRoomUrl?: string
  decision?: string
  extendPlacement?: IExtendPlacement
  candidate?: ICandidateForm
  job?: IOrgJobForm
  // - native
  createdAt?: Date | string
  modifiedAt?: Date | string
}

export interface IExtendPlacement {
  reasonReject?: string
  videoLink?: string
  notes?: string
  remarks?: string
  yearRelExp?: number
  comDate?: Date | string
  probPeriod?: string
  confDate?: Date | string
  lastDay?: Date | string
  offerMadeDate?: Date | string
  offerAccepted?: boolean
  loaSigned?: Date | string
  currency?: string
  basicOffered?: string
  otherAllowance?: number
  transAllowance?: number
}
