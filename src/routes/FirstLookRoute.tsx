import PersistAuth from '@/app/components/Auth/PersistAuth'
import RequireAuth from '@/app/components/Auth/RequireAuth'
import { MiniLayout } from '@/app/components/Layout'
import { FirstTimePage } from '@/app/pages/FirstTime'

export const FirstLookRoutes = {
  path: '/admin/',
  element: <PersistAuth />,
  children: [
    {
      path: '',
      element: <MiniLayout />,
      children: [
        {
          path: 'first-time-welcome',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <FirstTimePage />
            }
          ]
        }
      ]
    }
  ]
}
