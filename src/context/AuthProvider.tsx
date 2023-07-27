/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react'
import { refreshTokenFn } from '@/apis/auth.api'
import { ILoginResponse, IUser } from '@/types/IAuth'
import clientRequest from '@/utils/Request'

type State = {
  authUser: ILoginResponse | null
  currentUser: IUser | null
}

type Action = {
  type: string
  payload: any
}

type Dispatch = (action: Action) => void

const initialState: State = {
  authUser: null,
  currentUser: null
}

type AuthContextProviderProps = { children: React.ReactNode }

const AuthContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined)

const stateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'LOGIN_USER': {
      if (action.payload) {
        localStorage.setItem('refreshToken', action.payload?.refreshToken)
        localStorage.setItem('paveHrmKey', action.payload?.accessToken)
      }

      return {
        ...state,
        authUser: action.payload
      }
    }
    case 'UPDATE_AUTH': {
      return {
        ...state,
        authUser: action.payload
      }
    }
    case 'LOGOUT_USER': {
      localStorage.clear()
      return {
        ...state,
        authUser: null,
        currentUser: null
      }
    }
    case 'GET_USER': {
      return {
        ...state,
        currentUser: action.payload
      }
    }
    default: {
      throw new Error(`Unhandled action type`)
    }
  }
}

const AuthProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = React.useReducer(stateReducer, initialState)
  const value = { state, dispatch }

  // Update Axios - JWT flow
  useEffect(() => {
    const requestIntercept = clientRequest.interceptors.request.use(
      config => {
        const _accessToken = localStorage.getItem('paveHrmKey')
        if (!config.headers.Authorization && _accessToken) {
          config.headers.Authorization = `Bearer ${_accessToken}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    const responseIntercept = clientRequest.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config
        if (error?.response?.status === 401 && !prevRequest?._retry) {
          prevRequest._retry = true
          const newAccessToken = await refreshTokenFn()
          prevRequest.headers.Authorization = `Bearer ${newAccessToken.accessToken}`
          dispatch({ type: 'LOGIN_USER', payload: newAccessToken })
          return clientRequest(prevRequest)
        }

        const errMessage = error?.response.data?.error.message as string
        if (error?.response?.status === 400 && errMessage.includes('token is expired')) {
          dispatch({ type: 'LOGOUT_USER', payload: null })
          document.location.href = '/login'
        }

        return Promise.reject(error)
      }
    )

    return () => {
      clientRequest.interceptors.request.eject(requestIntercept)
      clientRequest.interceptors.response.eject(responseIntercept)
    }
  }, []) // ONLOAD set HEADER

  useEffect(() => {
    const requestIntercept = clientRequest.interceptors.request.use(
      config => {
        const _accessToken = localStorage.getItem('paveHrmKey')

        if (!config.headers.Authorization && _accessToken) {
          config.headers.Authorization = `Bearer ${_accessToken}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    const responseIntercept = clientRequest.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config
        if (error?.response?.status === 401 && !prevRequest?._retry) {
          prevRequest._retry = true
          const newAccessToken = await refreshTokenFn()
          prevRequest.headers.Authorization = `Bearer ${newAccessToken.accessToken}`
          dispatch({ type: 'LOGIN_USER', payload: newAccessToken })
          return clientRequest(prevRequest)
        }

        const errMessage = error?.response.data.message as string
        if (error?.response?.status === 400 && errMessage.includes('token is expired')) {
          dispatch({ type: 'LOGOUT_USER', payload: null })
          document.location.href = '/login'
        }

        return Promise.reject(error)
      }
    )

    return () => {
      clientRequest.interceptors.request.eject(requestIntercept)
      clientRequest.interceptors.response.eject(responseIntercept)
    }
  }, [state]) // On STATE CHANGING set HEADER

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuthContext = () => {
  const context = React.useContext(AuthContext)

  if (context) {
    return context
  }

  throw new Error(`useAuthContext must be used within a AuthContextProvider`)
}

export { AuthProvider, useAuthContext }
