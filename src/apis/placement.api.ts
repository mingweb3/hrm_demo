import { itemsPerPageDefault } from '@/app/components/WTable'
import { IJobPlacement, IPlacement, IPlacementForm } from '@/types/IPlacement'
import clientRequest from '@/utils/Request'

export const createPlacementFn = async (body: IPlacementForm): Promise<IPlacement> => {
  const response = await clientRequest.post('/placements', body)
  return response.data?.data
}

export const getPlacementsByJobIdFn = async (
  uuid: string,
  searchParams?: URLSearchParams,
  signal?: AbortSignal
): Promise<IJobPlacement> => {
  // Default Query Params
  const paramQuery: any = {
    include: 'creatorUser,candidate,modifiedUser,job,extendPlacement,userBio,userJobs',
    'filter[jobUUID]': uuid,
    'page[number]': 1,
    'page[size]': itemsPerPageDefault,
    sort: '-createdAt' // default newest
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  const response = await clientRequest.get(`/placements`, {
    params: paramQuery,
    signal
  })
  return response.data
}

export const getPlacementByIdFn = async (
  id: string,
  searchParams?: URLSearchParams,
  signal?: AbortSignal
): Promise<IPlacement> => {
  // Default Query Params
  const paramQuery: Record<string, string> = {
    include: 'creatorUser,candidate,modifiedUser,job,extendPlacement,userBio,userJobs,organisation,department'
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  const response = await clientRequest.get(`/placements/${id}`, {
    params: paramQuery,
    signal
  })
  return response.data?.data
}

export const updatePlacementFn = async (id: string, body: IPlacementForm): Promise<IPlacement> => {
  const response = await clientRequest.put(`/placements/${id}`, body)
  return response.data?.data
}
