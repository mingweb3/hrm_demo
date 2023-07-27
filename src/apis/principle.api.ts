import { IPrinciple, IPrincipleForm } from '@/types/IPrinciple'
import clientRequest from '@/utils/Request'

export const getPrincipleFn = async (uuid: string, signal?: AbortSignal): Promise<IPrinciple> => {
  const response = await clientRequest.get<{ data: IPrinciple }>(`/principal-companies/${uuid}`, {
    signal
  })
  return response.data?.data
}

export const updatePrincipleFn = async (uuid: string, body: IPrincipleForm): Promise<IPrinciple> => {
  const response = await clientRequest.put(`/principal-companies/${uuid}`, body)
  return response.data?.data
}
