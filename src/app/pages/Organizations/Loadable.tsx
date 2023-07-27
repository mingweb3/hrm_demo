import * as React from 'react'
import { lazyLoad } from '@/utils/loadable'

export const OrganizationsPage: React.FC = lazyLoad(
  () => import('./index'),
  module => module.OrganizationsPage
)
