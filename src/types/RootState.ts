import { AuthState } from '@/state/auth/types'

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
  Properties are optional because they are injected when the components are mounted sometime in your application's life. 
  So, not available always
*/
export interface RootState {
  auth: AuthState
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
