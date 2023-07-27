import { t } from 'i18next'
import { messages } from '@/app/pages/Organisation/Job/messages'
import { INavItem } from '@/types/INavigation'

const orgPath = '/admin/organizations/'
export const orgJobTabs: (id: string, jobId: string, countCans: number) => INavItem[] = (id, jobId, countCans) => [
  {
    text: `${t(messages.JobDetails())}`,
    href: `${orgPath}${id}/jobs/${jobId}`
  },
  {
    text: `${t(messages.AppliedCandidates(), { count: countCans })}`,
    href: `${orgPath}${id}/jobs/${jobId}/candidates`
  }
]
