export interface IMetaData {
  include: string[]
  pagination: IPaging
}

export interface IPaging {
  total: number
  count: number
  perPage: number
  currentPage: number
  totalPages: number
}
