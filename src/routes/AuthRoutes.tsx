import { Navigate } from 'react-router-dom'
import { LoginPage, RegisterPage, VerifiedPage } from '@/pages/Auth/Loadable'
import PublicView from '@/app/components/Auth/PublicView'
import { EmptyLayout } from '@/components/Layout'

export const AuthRoutes = {
  path: '/',
  element: <PublicView />,
  children: [
    {
      path: '',
      element: <EmptyLayout />,
      children: [
        {
          path: '',
          element: <Navigate to="/login" replace />
        },
        {
          path: '*',
          element: <Navigate to="/login" replace />
        },
        {
          path: 'login',
          element: <LoginPage />
        },
        {
          path: 'register',
          element: <RegisterPage />
        },
        {
          path: 'enter-verified-code',
          element: <VerifiedPage />
        }
      ]
    }
  ]
}
