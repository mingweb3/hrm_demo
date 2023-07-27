import { itemsPerPageDefault } from '@/app/components/WTable'
import { IOrgJob, IOrgJobForm, IOrgJobSkillForm, IOrgJobs } from '@/types/IOrgJob'
import clientRequest from '@/utils/Request'

export const getOrgJobsFn = async (searchParams?: URLSearchParams, signal?: AbortSignal): Promise<IOrgJobs> => {
  // Default Query Params
  const paramQuery: any = {
    include: 'department',
    'page[number]': 1,
    'page[size]': itemsPerPageDefault,
    sort: '-createdAt' // default newest
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  const response = await clientRequest.get('/jobs', {
    params: paramQuery,
    signal
  })
  return response.data
}

export const getJobById = async (
  id: string,
  searchParams?: URLSearchParams,
  signal?: AbortSignal
): Promise<IOrgJob> => {
  const paramQuery: Record<string, string> = {
    include: 'extendJob,department,skills,workLocation'
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  const response = await clientRequest.get(`/jobs/${id}`, {
    params: paramQuery,
    signal
  })
  return response.data?.data
}

export const getOrgJobsByIdFn = async (
  id: string,
  searchParams?: URLSearchParams,
  signal?: AbortSignal
): Promise<IOrgJobs> => {
  // Default Query Params
  const paramQuery: any = {
    include: 'department,creatorUser,modifiedUser',
    'filter[status]': 'active', // default active
    'page[number]': 1,
    'page[size]': itemsPerPageDefault,
    sort: '-createdAt' // default newest
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  const response = await clientRequest.get(`/organisations/${id}/jobs`, {
    params: paramQuery,
    signal
  })
  return response.data
}

export const createOrgJobFn = async (body: IOrgJobForm): Promise<IOrgJob> => {
  const response = await clientRequest.post(`/jobs`, body)
  return response.data?.data
}

export const updateOrgJobFn = async (id: string, body: IOrgJobForm): Promise<IOrgJob> => {
  const response = await clientRequest.put(`/jobs/${id}`, body)
  return response.data?.data
}

export const createOrgJobSkillFn = async (body: IOrgJobSkillForm): Promise<IOrgJob> => {
  const response = await clientRequest.post(`/skills`, body)
  return response.data?.data
}
