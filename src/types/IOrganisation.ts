export interface IOrganisation {
  id: number
  company: ICompany
  jobs: IJobs
  candidates: number
  status: string
}
interface IJobs {
  openning: number
  closed: number
}
export interface ICompany {
  name: string
  address: string
  hrName: string
  hrEmail: string
}

export interface IWorkLocation {
  id: number
  location: string
  postalCode: number
  isDefault: boolean
}
