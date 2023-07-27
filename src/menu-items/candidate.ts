import { INavItem } from '@/types/INavigation'

export const candidateMenus: (id: string) => INavItem[] = id => [
  {
    text: 'Info',
    href: `/admin/candidates/${id}/info`
  },
  {
    text: 'Placement',
    href: `/admin/candidates/${id}/placement`
  },
  {
    text: 'Document',
    href: `/admin/candidates/${id}/document`
  }
]
