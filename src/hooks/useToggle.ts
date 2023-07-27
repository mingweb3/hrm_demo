import { useCallback, useState } from 'react'

export const useToggle = (): { isVisible: boolean; onToggle: () => void } => {
  const [isVisible, setIsVisible] = useState(false)

  const onToggle = useCallback(() => {
    setIsVisible(prevState => !prevState)
  }, [])

  return {
    isVisible,
    onToggle
  }
}
