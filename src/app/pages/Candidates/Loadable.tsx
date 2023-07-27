import * as React from 'react'
import FullScreenLoader from '@/app/components/FullScreenLoader'
import { lazyLoad } from '@/utils/loadable'

export const CandidatesPage: React.FC = lazyLoad(
  () => import('./index'),
  module => module.CandidatesPage,
  { fallback: <FullScreenLoader /> }
)
