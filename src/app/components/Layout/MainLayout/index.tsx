import React from 'react'
import { Outlet } from 'react-router-dom'
import { useToggleDrawer } from '@/hooks/useToggleDrawer'
import { Drawer } from '../components/Drawer'
// COMPS
import Header from '../components/Header'

export const MainLayout: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = useToggleDrawer()
  return (
    <div className="bg-bg text-black444">
      <Header isDrawerOpen={isDrawerOpen} onToggleDrawer={toggleDrawer} />
      <div className="flex w-screen">
        <Drawer onToggleDrawer={toggleDrawer} />
        <div className="w-full p-5 grow sm:p-7">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
