import { ILoginInput, ILoginResponse } from '@/types/IAuth'
import clientRequest from '@/utils/Request'

export const loginUserFn = async ({ email, password }: ILoginInput): Promise<ILoginResponse> => {
  const response = await clientRequest.post('auth/login', {
    email,
    password
  })
  return response.data?.data
}

export const refreshTokenFn = async (): Promise<ILoginResponse> => {
  const refeshToken = await localStorage.getItem('refreshToken')
  const response = await clientRequest.post('auth/refresh', {
    refreshToken: refeshToken
  })
  return response.data?.data
}

export const logoutFn = async (): Promise<string> => {
  const response = await clientRequest.post('auth/logout')
  return response.data?.message
}
