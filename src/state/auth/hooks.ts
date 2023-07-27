import { useAppSelector } from '@/store/hooks'

export const useIsAuthenticated = () => {
  return useAppSelector(state => state.auth.isAuthenticated)
}
