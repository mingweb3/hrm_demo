import * as React from 'react'
import { lazyLoad } from '@/utils/loadable'

export const WorkLocationPage: React.FC = lazyLoad(
  () => import('./WorkLocation/index'),
  module => module.WorkLocationPage
)

export const OrgDetailsPage: React.FC = lazyLoad(
  () => import('./Details/index'),
  module => module.OrgDetailsPage
)

export const OrgJobsPage: React.FC = lazyLoad(
  () => import('./Jobs/index'),
  module => module.OrgJobsPage
)

export const EditJobPage: React.FC = lazyLoad(
  () => import('./Job/EditJobPage'),
  module => module.EditJobPage
)

export const CreateJobPage: React.FC = lazyLoad(
  () => import('./Job/CreateJobPage'),
  module => module.CreateJobPage
)

export const OrgDepartmentsPage: React.FC = lazyLoad(
  () => import('./Departments/index'),
  module => module.OrgDepartmentsPage
)

export const OrgJobCandidatesPage: React.FC = lazyLoad(
  () => import('./Job/Candidates/index'),
  module => module.OrgJobCandidatesPage
)
