import { faGears } from '@fortawesome/free-solid-svg-icons'

// ==============================|| MENU ITEMS - CLIENTS ||============================== //
const settingList = {
  headTitle: 'PRINCIPLE  SETTINGS',
  dataList: [
    {
      text: 'Company details',
      href: '/admin/principle-details'
    }
  ]
}

const settingNav = {
  id: 'group-settings',
  title: 'Settings',
  headIcon: faGears,
  children: [settingList]
}

export default settingNav
