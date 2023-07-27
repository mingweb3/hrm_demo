import { useCallback, useState } from 'react'

export const useToggleDrawer = (): { isDrawerOpen: boolean; toggleDrawer: () => void } => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  const toggleDrawer = useCallback((): void => {
    const drawerNav = document.getElementById('drawer-nav')
    const drawerNavOverlay = document.getElementById('drawer-nav__overlay')

    if (isDrawerOpen) {
      drawerNav?.classList.remove('opened')
      drawerNavOverlay?.classList.remove('opened')
    } else {
      drawerNav?.classList.add('opened')
      drawerNavOverlay?.classList.add('opened')
    }

    setIsDrawerOpen((prev: boolean) => !prev)
  }, [isDrawerOpen])

  return { isDrawerOpen, toggleDrawer }
}
