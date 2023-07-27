import { IUser } from '@/types/IAuth'
import clientRequest from '@/utils/Request'

export const getMeFn = async (): Promise<IUser> => {
  const response = await clientRequest.get('auth/me')

  return response.data?.data
}
