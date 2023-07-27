import { itemsPerPageDefault } from '@/app/components/WTable/configTable'
import {
  IDepartmentIdForm,
  IOrganization,
  IOrganizationForm,
  IOrganizations,
  IWorkPlace,
  IWorkPlaceForm,
  IWorkPlaces
} from '@/types/IOrganization'
import clientRequest from '@/utils/Request'

export const getOrgnizationsFn = async (
  searchParams?: URLSearchParams,
  signal?: AbortSignal
): Promise<IOrganizations> => {
  // Default Query Params
  const paramQuery: any = {
    'filter[status]': 'active', // active | pending | stopped
    'page[number]': 1,
    'page[size]': itemsPerPageDefault,
    sort: '-createdAt' // default newest
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  const response = await clientRequest.get('/organisations', {
    params: paramQuery,
    signal
  })
  return response.data
}

export const getOrganizationByIdFn = async (
  uuid: string,
  searchParams?: URLSearchParams,
  signal?: AbortSignal
): Promise<IOrganization> => {
  const paramQuery: Record<string, string> = {
    include: 'creatorUser,workLocations'
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  const response = await clientRequest.get(`/organisations/${uuid}`, {
    params: paramQuery,
    signal
  })
  return response.data.data
}

export const createOrgnizationFn = async (body: IOrganizationForm): Promise<IOrganization> => {
  const response = await clientRequest.post(`/organisations`, body)
  return response.data?.data
}

export const updateOrgnizationFn = async (uuid: string, body: IOrganizationForm): Promise<IOrganization> => {
  const response = await clientRequest.put(`/organisations/${uuid}`, body)
  return response.data?.data
}

// Change Status for Multiple Org
export const postStatusOrgsFn = async (body: {
  UUIDs: (string | undefined)[]
  status: 'active' | 'pending' | 'stopped'
}): Promise<any> => {
  const response = await clientRequest.post('/organisations/status', body)
  return response
}

// WorkPlace
export const getWorkPlacesFn = async (searchParams?: URLSearchParams, signal?: AbortSignal): Promise<IWorkPlaces> => {
  // Default Query Params
  const paramQuery: any = {
    include: 'organisation',
    'page[number]': 1,
    'page[size]': 200,
    sort: '-createdAt' // default newest
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  const response = await clientRequest.get('/work-locations', {
    params: paramQuery,
    signal
  })
  return response.data
}

export const createWorkPlaceFn = async (body: IWorkPlaceForm): Promise<IWorkPlace> => {
  const response = await clientRequest.post(`/work-locations`, body)
  return response.data?.data
}

export const updateWorkPlaceFn = async (uuid: string, body: IWorkPlaceForm): Promise<IWorkPlace> => {
  const response = await clientRequest.put(`/work-locations/${uuid}`, body)
  return response.data?.data
}

export const removeWorkPlaceFn = async (id: string) => {
  const response = await clientRequest.delete(`/work-locations/${id}`)
  return response
}

export const addDepartmentToOrgFn = async (uuid: string, body: IDepartmentIdForm) => {
  const response = await clientRequest.post(`/organisations/${uuid}/add-department`, body)
  return response
}

export const removeDepartmentFromOrgFn = async (uuid: string, body: IDepartmentIdForm) => {
  const response = await clientRequest.post(`/organisations/${uuid}/remove-department`, body)
  return response
}
