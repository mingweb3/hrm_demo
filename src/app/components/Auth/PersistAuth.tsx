import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthProvider'
import FullScreenLoader from '../FullScreenLoader'

const PersistAuth = () => {
  const authCtx = useAuthContext()
  const [isLoading, setIsLoading] = useState(true)

  const _accessToken = localStorage.getItem('paveHrmKey')
  const _refreshToken = localStorage.getItem('refreshToken')

  useEffect(() => {
    let isMounted = true

    const verifyRefreshToken = () => {
      authCtx.dispatch({
        type: 'UPDATE_AUTH',
        payload: {
          accessToken: _accessToken,
          refreshToken: _refreshToken,
          expiresIn: 3600,
          tokenType: 'Bearer'
        }
      })
      if (isMounted) setIsLoading(false)
    }

    if (!authCtx.state?.authUser && _refreshToken) {
      verifyRefreshToken()
    } else {
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [_accessToken, _refreshToken, authCtx])

  return <>{!_refreshToken ? <Outlet /> : isLoading ? <FullScreenLoader /> : <Outlet />}</>
}

export default PersistAuth
