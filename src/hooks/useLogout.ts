import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthProvider'
import { logoutFn } from '@/apis/auth.api'

const useLogout = () => {
  const authCtx = useAuthContext()
  const navigate = useNavigate()

  const logout = async () => {
    try {
      await logoutFn()
    } catch (err) {
      console.error(err)
    }
    authCtx.dispatch({ type: 'LOGOUT_USER', payload: null })
    navigate('/login')
  }

  return logout
}

export default useLogout
