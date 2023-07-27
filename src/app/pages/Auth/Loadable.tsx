import * as React from 'react'
import FullScreenLoader from '@/app/components/FullScreenLoader'
import { lazyLoad } from '@/utils/loadable'

export const LoginPage: React.FC = lazyLoad(
  () => import('./Login'),
  module => module.LoginPage
)

export const RegisterPage: React.FC = lazyLoad(
  () => import('./Register'),
  module => module.RegisterPage,
  { fallback: <FullScreenLoader /> }
)

export const VerifiedPage: React.FC = lazyLoad(
  () => import('./Verified'),
  module => module.VerifiedPage
)
