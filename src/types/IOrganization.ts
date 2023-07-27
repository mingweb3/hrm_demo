import { IDepartmentForm } from './IJob'
import { IMetaData } from './IPagination'

export interface IOrganizations {
  data: IOrganization[]
  meta: IMetaData
}

export interface IOrganization {
  type: string
  id: string
  attributes: IOrganizationForm
}

export interface IOrganizationForm {
  id?: number
  UUID?: string
  companyName?: string
  buzRegNum?: string
  buzAddress?: string
  billAddress?: string
  officeAddress?: string
  contactNum?: string
  contactEmail?: string
  contactPersonalName?: string
  contactPeronalDesignation?: string
  status?: string
  departmentIds?: string[]
  departments?: IDepartmentForm[]
  workLocations?: IWorkPlaceForm[]
  createdAt?: Date
  mofifiedAt?: Date
}

export interface IFilterOrgForm {
  companyName?: string
  contactEmail?: string
  contactNum?: string
  status?: string
}

// WorkPlace
export interface IWorkPlaces {
  data: IWorkPlace[]
  meta?: IMetaData
}

export interface IWorkPlace {
  type: string
  id: string
  attributes: IWorkPlaceForm
}

export interface IWorkPlaceForm {
  UUID?: string
  address: string
  postalCode?: number
  geoTag?: string
  lat?: number
  lng?: number
  isDefault?: boolean
  orgUUID?: string
  createdAt?: Date
  mofifiedAt?: Date
  id?: number | string
}

export interface IDepartmentIdForm {
  departmentId: string | number
}
