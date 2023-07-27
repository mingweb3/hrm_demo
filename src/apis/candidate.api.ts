import { itemsPerPageDefault } from '@/app/components/WTable'
import { ICandidate, ICandidateForm, ICandidates } from '@/types/ICandidate'
import clientRequest from '@/utils/Request'

export const getCandidatesFn = async (searchParams?: URLSearchParams, signal?: AbortSignal): Promise<any> => {
  // Default Query Params
  const paramQuery: any = {
    include: 'userBio,userJobs',
    'filter[isPublished]': 1, // default true
    'fields[userBio]': 'jobLevel,prefCommitmentId',
    'page[number]': 1,
    'page[size]': itemsPerPageDefault,
    sort: '-createdAt' // default newest
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  // filter by status
  if (searchParams?.get('filter[isPublished]') === 'all') {
    delete paramQuery['filter[isPublished]']
  }

  const response = await clientRequest.get<ICandidates>('/candidates', {
    params: paramQuery,
    signal
  })
  return response.data
}

export const getCandidateByIdFn = async (
  id: string,
  searchParams?: URLSearchParams,
  signal?: AbortSignal
): Promise<any> => {
  const paramQuery: Record<string, string> = {
    include: 'userBio,userLanguages,userJobs'
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  const response = await clientRequest.get<ICandidate>(`/candidates/${id}`, {
    params: paramQuery,
    signal
  })
  return response.data
}

export const createCandidateFn = async (body: ICandidateForm): Promise<ICandidate> => {
  const response = await clientRequest.post('/candidates', body)
  return response.data?.data
}

export const updateCandidateFn = async (id: string, body: ICandidateForm): Promise<ICandidate> => {
  const response = await clientRequest.put(`/candidates/${id}`, body)
  return response.data?.data
}

// Publish Candidates
export const postPublishCandiates = async (body: { UUIDs: (string | undefined)[]; status: 0 | 1 }): Promise<any> => {
  const response = await clientRequest.post('/candidates/unpublish', body)
  return response
}

// Documents /media/{type}/{typeID}/{mediaId}
export const removeCanDocumentbyId = async (id: string): Promise<any> => {
  const response = await clientRequest.delete(`/media/${id}`)
  return response
}

export const uploadCanDocument = async (body: any): Promise<any> => {
  const response = await clientRequest.post(`/media`, body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}
