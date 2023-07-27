import * as React from 'react'
import { lazyLoad } from '@/utils/loadable'

export const CandidatePlacementPage: React.FC = lazyLoad(
  () => import('./Placement/index'),
  module => module.CandidatePlacementPage
)

export const CandidateInfoPage: React.FC = lazyLoad(
  () => import('./Info/index'),
  module => module.CandidateInfoPage
)

export const CandidateDocumentPage: React.FC = lazyLoad(
  () => import('./Document/index'),
  module => module.CandidateDocumentPage
)

export const CreateCandidatePage: React.FC = lazyLoad(
  () => import('./CreateCandidate/index'),
  module => module.CreateCandidatePage
)
