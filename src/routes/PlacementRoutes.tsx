import PersistAuth from '@/app/components/Auth/PersistAuth'
import RequireAuth from '@/app/components/Auth/RequireAuth'
import { MainLayout } from '@/components/Layout'
import { EditPlacementPage } from '@/app/pages/Placement/Loadable'

export const PlacementRoutes = {
  path: '/admin/',
  element: <PersistAuth />,
  children: [
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: 'placement/:id',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <EditPlacementPage />
            }
          ]
        }
      ]
    }
  ]
}
