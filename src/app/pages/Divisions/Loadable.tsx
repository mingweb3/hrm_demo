import * as React from 'react'
import { lazyLoad } from '@/utils/loadable'

export const DivisionsPage: React.FC = lazyLoad(
  () => import('./index'),
  module => module.DivisionsPage
)
