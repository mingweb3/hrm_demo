import { faNetworkWired } from '@fortawesome/free-solid-svg-icons'

// ==============================|| MENU ITEMS - CLIENTS ||============================== //
const clientsList = {
  headTitle: 'clients',
  dataList: [
    {
      text: 'Users',
      href: '/'
    },
    {
      text: 'Roles',
      href: '/'
    }
  ]
}

const accountsNav = {
  id: 'group-accounts',
  title: 'Account management',
  headIcon: faNetworkWired,
  children: [clientsList]
}

export default accountsNav
