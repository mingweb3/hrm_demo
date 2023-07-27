export interface IPrincipleForm {
  UUID: string
  companyName: string
  buzRegNum: string
  buzAddress?: string
  billAddress?: string
  country?: {
    text: string
    value: string
  }
  operationContriesId?: string
}

export interface IPrinciple {
  id: string
  type: string
  attributes: IPrincipleForm
}
