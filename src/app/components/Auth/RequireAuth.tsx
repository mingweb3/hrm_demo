import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthContext } from '@/context/AuthProvider'
import { getMeFn } from '@/apis/user.api'
import FullScreenLoader from '../FullScreenLoader'

const RequireAuth = () => {
  const authCtx = useAuthContext()
  const location = useLocation()

  const { isLoading, isFetching, data } = useQuery(['getUser'], getMeFn, {
    retry: 1,
    select: data => data,
    onSuccess: data => {
      authCtx.dispatch({ type: 'GET_USER', payload: data })
    }
  })

  if (isLoading || isFetching) {
    return <FullScreenLoader />
  }

  return authCtx.state.authUser?.accessToken && data?.id ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default RequireAuth
