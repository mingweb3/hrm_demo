export interface ILoginInput {
  email: string
  password: string
}

export interface ILoginResponse {
  tokenType?: string
  expiresIn?: number
  accessToken: string
  refreshToken: string
}

export interface IAuth {
  loggedIn: boolean
  accessToken?: string
  refreshToken?: string
}

export interface IUser {
  type: string
  id: string
  attributes: IUserAttributes
}

export interface IUserAttributes {
  UUID: string
  principalUUID: string
  roleId: number
  name: string
  email: string
  gender?: string
  contactNum?: string
  createdAt?: Date
  updatedAt?: Date
  id?: number
}
