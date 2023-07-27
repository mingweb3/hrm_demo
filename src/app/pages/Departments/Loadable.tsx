import * as React from 'react'
import { lazyLoad } from '@/utils/loadable'

export const DepartmentsPage: React.FC = lazyLoad(
  () => import('./index'),
  module => module.DepartmentsPage
)
