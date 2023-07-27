import * as React from 'react'
import { lazyLoad } from '@/utils/loadable'

export const PrincipleDetailsPage: React.FC = lazyLoad(
  () => import('./index'),
  module => module.PrincipleDetailsPage
)
