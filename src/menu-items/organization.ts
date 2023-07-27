import { INavItem } from '@/types/INavigation'

const orgPath = '/admin/organizations/'
export const orgMenu = (id: string): INavItem[] => [
  {
    text: 'Details',
    href: `${orgPath}${id}/details`
  },
  {
    text: 'Departments',
    href: `${orgPath}${id}/departments`
  },
  {
    text: 'Jobs',
    href: `${orgPath}${id}/jobs`
  },
  {
    text: 'Candidates',
    href: `${orgPath}${id}/candidates`
  },
  {
    text: 'Work locations',
    href: `${orgPath}${id}/work-location`
  }
]
