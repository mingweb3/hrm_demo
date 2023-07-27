import * as React from 'react'
import FullScreenLoader from '@/app/components/FullScreenLoader'
import { lazyLoad } from '@/utils/loadable'

export const FirstTimePage: React.FC = lazyLoad(
  () => import('./index'),
  module => module.FirstTimePage,
  { fallback: <FullScreenLoader /> }
)
