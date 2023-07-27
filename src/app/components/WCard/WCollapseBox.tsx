import React, { useCallback, useState } from 'react'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { isEmpty } from '@/utils/helpers'

interface WCollapseBoxProps {
  children?: React.ReactNode
  className?: string
  title: string
  isOpenCollapse?: boolean
}

const StyledWCollapseBox = styled('div')(
  ({ theme }) => `
  .whead {
    background-color: ${theme.palette.bg};
  }
  `
)

const WCollapseBox: React.FC<WCollapseBoxProps> = props => {
  const { children, className, title, isOpenCollapse } = props
  const [isOpen, setIsOpen] = useState<boolean>(isOpenCollapse || false)

  const classChildren = clsx('wcontent', isOpen ? '' : 'hidden')

  // Actions Func
  const toggleCollapse = useCallback((): void => {
    if (isEmpty(children)) {
      return
    }
    setIsOpen((prev: boolean) => !prev)
  }, [children])

  return (
    <StyledWCollapseBox className={className}>
      <div
        onClick={toggleCollapse}
        aria-hidden="true"
        className="flex flex-row items-center justify-between p-4 cursor-pointer whead f16Bold"
      >
        <span>{title}</span>
        <div>{children && <FontAwesomeIcon icon={faAngleDown} size="sm" />}</div>
      </div>

      {children && <div className={classChildren}>{children}</div>}
    </StyledWCollapseBox>
  )
}

export default WCollapseBox
