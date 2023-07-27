import React from 'react'
import { styled } from '@mui/system'
import { INavGroup, INavList } from '@/types/INavigation'
import NavHead from './NavHead'
import NavList from './NavList'

export interface NavGroupProps {
  data: INavGroup
}

const StyledNavGroup = styled('div')(() => ``)

const NavGroup: React.FC<NavGroupProps> = ({ data }) => {
  const { title, headIcon, children } = data
  return (
    <StyledNavGroup className="flex flex-col">
      <NavHead text={title} iconComp={headIcon} />
      {children.map((item: INavList, i) => {
        const { headTitle, dataList } = item
        return (
          // eslint-disable-next-line react/no-array-index-key
          <NavList key={`${headTitle}-${i}`} headTitle={headTitle} dataList={dataList} />
        )
      })}

      {/*  */}
    </StyledNavGroup>
  )
}

export default NavGroup
