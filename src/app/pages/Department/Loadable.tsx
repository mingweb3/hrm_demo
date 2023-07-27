import * as React from 'react'
import { lazyLoad } from '@/utils/loadable'

export const CreateDepartmentPage: React.FC = lazyLoad(
  () => import('./new/index'),
  module => module.CreateDepartmentPage
)

export const EditDepartmentPage: React.FC = lazyLoad(
  () => import('./edit/index'),
  module => module.EditDepartmentPage
)
