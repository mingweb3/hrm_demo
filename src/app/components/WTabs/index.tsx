import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { INavItem } from '@/types'

const StyledWTabs = styled('div')(
  ({ theme }) => `
    border-bottom: 1px solid ${theme.palette.gray5};
    .tab-item {
      color: ${theme.palette.common.black};
      margin-bottom: -1px;
      position: relative;
      &::before {
        content: '';
        height: 1px;
        background-color: ${theme.palette.common.white};
        position: absolute;
        bottom: 0;
        z-index: 1;
        display: none;
        left: 0;
        right: 0;
      }
      &.active {
        border: 1px solid ${theme.palette.gray5};
        border-bottom: none;
        background-color: ${theme.palette.common.white};
        &::before {
          display: block;
        }
      }
    }
  `
)

interface WTabsProps {
  dataList: INavItem[]
}

const WTabs: React.FC<WTabsProps> = props => {
  const { dataList } = props

  // Get Current Page for Menu
  const location = useLocation()
  const { pathname } = location

  useEffect(() => {
    const index = dataList.findIndex(({ href }) => pathname.endsWith(href))

    if (index !== -1) {
      setSelectedIndex(index)
    } else {
      setSelectedIndex(0)
    }
  }, [pathname, dataList])

  // Action: Select an Item then goto the url
  const navigate = useNavigate()
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const handleTabItemClick = (index: number) => {
    const { href } = dataList[index]
    setSelectedIndex(index)
    navigate(href)
  }

  return dataList ? (
    <StyledWTabs className="pl-[1rem]">
      <ul className="flex flex-wrap text-sm font-medium text-center">
        {dataList.map((item, index) => (
          <li
            className="mr-2"
            // eslint-disable-next-line react/no-array-index-key
            key={`${index}-tabitem`}
          >
            <button
              type="button"
              className={`inline-block tab-item p-3 ${selectedIndex === index ? 'active f20Bold' : 'f20Regular'}`}
              onClick={() => handleTabItemClick(index)}
            >
              {item?.text}
            </button>
          </li>
        ))}
      </ul>
    </StyledWTabs>
  ) : null
}

export default WTabs
