/* eslint-disable import/no-self-import */

/**
 * Asynchronously loads the component for HomePage
 */
import * as React from 'react'
import { lazyLoad } from '@/utils/loadable'

export const NotFoundPage: React.FC = lazyLoad(
  () => import('./index'),
  module => module.NotFoundPage
)
