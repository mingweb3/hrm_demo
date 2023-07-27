import PersistAuth from '@/app/components/Auth/PersistAuth'
import RequireAuth from '@/app/components/Auth/RequireAuth'
import { MainLayout } from '@/components/Layout'
import { OrgJobCandidatesPage } from '@/app/pages/Organisation/Job'
import {
  CreateJobPage,
  EditJobPage,
  OrgDepartmentsPage,
  OrgDetailsPage,
  OrgJobsPage,
  WorkLocationPage
} from '@/app/pages/Organisation/Loadable'
import { OrganizationsPage } from '@/app/pages/Organizations/Loadable'

export const OrgRoutes = {
  path: '/admin/',
  element: <PersistAuth />,
  children: [
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: 'organizations',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <OrganizationsPage />
            }
          ]
        },
        {
          path: 'organizations/:id/details',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <OrgDetailsPage />
            }
          ]
        },
        {
          path: 'organizations/:id/departments',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <OrgDepartmentsPage />
            }
          ]
        },
        {
          path: 'organizations/:id/jobs',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <OrgJobsPage />
            }
          ]
        },
        {
          path: 'organizations/:id/jobs/:jobId',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <EditJobPage />
            }
          ]
        },
        {
          path: 'organizations/:id/jobs/create-job',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <CreateJobPage />
            }
          ]
        },
        {
          path: 'organizations/:id/work-location',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <WorkLocationPage />
            }
          ]
        },
        {
          path: 'organizations/:id/jobs/:jobId/candidates',
          element: <RequireAuth />,
          children: [
            {
              path: '',
              element: <OrgJobCandidatesPage />
            }
          ]
        }
      ]
    }
  ]
}
