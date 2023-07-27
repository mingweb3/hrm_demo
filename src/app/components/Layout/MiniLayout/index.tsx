import React from 'react'
import { Outlet } from 'react-router-dom'
import { useToggleDrawer } from '@/hooks/useToggleDrawer'
// COMPS
import Header from '../components/Header'

export const MiniLayout: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = useToggleDrawer()
  return (
    <div className="bg-bg text-black444">
      <Header isDrawerOpen={isDrawerOpen} onToggleDrawer={toggleDrawer} mode="min" />
      <div className="flex w-screen">
        <div className="w-full p-5 grow sm:p-7">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
