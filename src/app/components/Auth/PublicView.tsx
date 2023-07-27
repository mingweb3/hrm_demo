import { Outlet } from 'react-router-dom'
import { DEFAULT_URL } from '@/constants/AppConfig'
import FullScreenLoader from '../FullScreenLoader'

const PublicView = () => {
  const refeshToken = localStorage.getItem('refreshToken')

  if (refeshToken) {
    document.location.href = DEFAULT_URL
  }

  // return <Outlet />
  return !refeshToken ? <Outlet /> : <FullScreenLoader />
}

export default PublicView
