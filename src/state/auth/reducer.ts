import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@/utils/@reduxjs/toolkit'
import { useInjectReducer } from '@/utils/redux-injectors'
import { AuthState } from './types'

export const initialState: AuthState = {
  isAuthenticated: false
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateIsAuthenticated(state: AuthState, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload
    }
  }
})

export const { actions: authActions, reducer } = slice

export const useAuthSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer })
  return { actions: slice.actions }
}
