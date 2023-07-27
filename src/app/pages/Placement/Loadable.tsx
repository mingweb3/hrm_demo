import * as React from 'react'
import { lazyLoad } from '@/utils/loadable'

export const EditPlacementPage: React.FC = lazyLoad(
  () => import('./Edit/index'),
  module => module.EditPlacementPage
)
