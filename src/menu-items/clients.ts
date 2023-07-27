import { faUserTie } from '@fortawesome/free-solid-svg-icons'

// ==============================|| MENU ITEMS - CLIENTS ||============================== //
const clientsList = {
  headTitle: 'clients',
  dataList: [
    {
      text: '1. Facebook Ltd,.',
      href: '/jobs'
    },
    {
      text: '2. Shopee Ltd,.',
      href: '/jobs'
    },
    {
      text: '3. IST Finance Corp,.',
      href: '/jobs'
    }
  ]
}

const manageList = {
  headTitle: 'Manage',
  dataList: [
    {
      text: 'Organizations',
      href: '/admin/organizations'
    },
    {
      text: 'General divisions',
      href: '/admin/divisions'
    },
    {
      text: 'General departments',
      href: '/admin/departments'
    },
    {
      text: 'Candidates',
      href: '/admin/candidates'
    }
  ]
}

const clientsNav = {
  id: 'group-clients',
  title: 'Organization',
  headIcon: faUserTie,
  children: [clientsList, manageList]
}

export default clientsNav
