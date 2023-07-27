import React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { INavItem } from '@/types'

interface NavListProps {
  dataList: INavItem[]
  headTitle?: string
}

const StyledNavList = styled('div')(
  ({ theme }) => `
  .grp-list {
    > a {
      display: block;
      transition: background-color 0.25s ease-out;
      &:hover {
        text-decoration: none;
        background-color: ${theme.palette.blue3};
        color: ${theme.palette.primary.main};
      }
      &.active {
        font-weight: bold;
        color: ${theme.palette.primary.main};
      }
    }
  }
  `
)

const NavList: React.FC<NavListProps> = props => {
  const { dataList, headTitle } = props

  return (
    <StyledNavList>
      <div className="grp-box">
        {headTitle && (
          <div className="head px-5 f12Regular uppercase letter tracking-[.2em] text-gray5">{headTitle}</div>
        )}
        {dataList.length > 0 && (
          <div className="grp-list">
            {dataList.map((item: INavItem, i) => {
              const { href, text } = item
              return (
                // eslint-disable-next-line react/no-array-index-key
                <Link key={`${i}-nav-link`} to={href} className="px-5 py-2 f12Regular sm:f14Regular">
                  {text}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </StyledNavList>
  )
}

export default NavList
