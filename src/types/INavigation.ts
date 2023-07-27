import { IconProp } from '@fortawesome/fontawesome-svg-core'

export interface INavItem {
  text?: string
  href: string
  target?: string
}

export interface INavList {
  headTitle?: string
  dataList: INavItem[]
}

export interface INavGroup {
  id: string
  title: string
  headIcon: IconProp
  children: INavList[]
}
