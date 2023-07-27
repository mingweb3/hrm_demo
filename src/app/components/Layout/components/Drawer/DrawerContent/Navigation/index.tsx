import React from 'react'
import menuItems from '@/menu-items'
import { INavGroup } from '@/types/INavigation'
// COMPs
import NavGroup from './NavGroup'

const Navigation: React.FC = () => {
  return (
    <div className="flex flex-col">
      {menuItems.length > 0 && (
        <div>
          {menuItems.map((item: INavGroup) => {
            return <NavGroup key={item.id} data={item} />
          })}
        </div>
      )}
    </div>
  )
}

export default Navigation
