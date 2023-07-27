import { useCallback, useEffect, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export const useToggleFlyout = () => {
  const [isVisibleFlyout, setIsVisibleFlyout] = useState(false)

  const theme = useTheme()
  const matchDownLg = useMediaQuery(theme.breakpoints.up('lg'))

  useEffect(() => {
    document.body.style.overflowX = 'hidden'

    const flyoutOverlay = document.getElementById('flyout-overlay')
    const flyout = document.getElementById('flyout')

    if (isVisibleFlyout) {
      flyoutOverlay?.classList.add('opened')
      flyout?.classList.add('opened')
      if (flyout && matchDownLg) {
        const positionScroll = document.documentElement.scrollTop
        flyout.style.bottom = `-${positionScroll}px`
      }
      document.body.style.overflowY = 'hidden'
    } else {
      flyoutOverlay?.classList.remove('opened')
      flyout?.classList.remove('opened')

      document.body.style.overflowY = ''
    }
    return () => {
      flyoutOverlay?.classList.remove('opened')
      flyout?.classList.remove('opened')

      document.body.style.overflow = ''
    }
  }, [isVisibleFlyout, matchDownLg])

  const onCloseFlyout = useCallback(() => {
    if (isVisibleFlyout) setIsVisibleFlyout(false)
  }, [isVisibleFlyout])

  const onToggleFlyout = useCallback(() => {
    setIsVisibleFlyout(prev => !prev)
  }, [])

  return {
    isVisibleFlyout,
    onToggleFlyout,
    onCloseFlyout
  }
}
