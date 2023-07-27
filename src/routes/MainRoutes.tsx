import { HomePage } from '@/pages/Home/Loadable'
import PersistAuth from '@/app/components/Auth/PersistAuth'
import RequireAuth from '@/app/components/Auth/RequireAuth'
import { MainLayout } from '@/components/Layout'
import {
  CandidateDocumentPage,
  CandidateInfoPage,
  CandidatePlacementPage,
  CreateCandidatePage
} from '@/app/pages/Candidate/Loadable'
import { CandidatesPage } from '@/app/pages/Candidates/Loadable'
import { CreateDepartmentPage, EditDepartmentPage } from '@/app/pages/Department/Loadable'
import { DepartmentsPage } from '@/app/pages/Departments/Loadable'
import { DivisionsPage } from '@/app/pages/Divisions/Loadable'
import { PrincipleDetailsPage } from '@/app/pages/Principle/Loadable'

export const MainRoutes = {
  path: '/admin/',
  element: <PersistAuth />,
  children: [
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: 'dashboard',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <HomePage />
            }
          ]
        },
        {
          path: 'candidates',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <CandidatesPage />
            }
          ]
        },
        {
          path: 'candidates/:id/placement',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <CandidatePlacementPage />
            }
          ]
        },
        {
          path: 'candidates/:id/document',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <CandidateDocumentPage />
            }
          ]
        },
        {
          path: 'candidates/:id/info',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <CandidateInfoPage />
            }
          ]
        },
        {
          path: 'candidates/create-candidate',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <CreateCandidatePage />
            }
          ]
        },
        {
          path: 'principle-details',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <PrincipleDetailsPage />
            }
          ]
        },
        {
          path: 'divisions',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <DivisionsPage />
            }
          ]
        },
        {
          path: 'departments',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <DepartmentsPage />
            }
          ]
        },
        {
          path: 'departments/create-new',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <CreateDepartmentPage />
            }
          ]
        },
        {
          path: 'departments/:id',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <EditDepartmentPage />
            }
          ]
        }
      ]
    }
  ]
}
