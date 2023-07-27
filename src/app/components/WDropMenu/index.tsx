import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { INavItem } from '@/types/INavigation'

interface WDropMenuProps {
  dataList: INavItem[]
  width?: number
}

const WDropMenu: React.FC<WDropMenuProps> = props => {
  const { dataList, width } = props

  const theme = useTheme()

  // Get Current Page for Menu
  const location = useLocation()
  const { pathname } = location

  React.useEffect(() => {
    const index = dataList.findIndex(({ href }) => pathname.startsWith(href))
    if (index !== -1) {
      setSelectedIndex(index)
    } else {
      setSelectedIndex(0)
    }
  }, [pathname, dataList])

  // Action: Open Dropdown List
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  // Action: Select an Item then goto the url
  const navigate = useNavigate()
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const handleMenuItemClick = (index: number) => {
    setAnchorEl(null)
    const { href } = dataList[index]
    setSelectedIndex(index)
    navigate(href)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      {/* Menu Selector */}
      {dataList && (
        <List
          component="nav"
          sx={{ bgcolor: 'background.paper', padding: 0, boxShadow: theme.shadows[1], width: width || 160 }}
        >
          <ListItem
            id="lock-button"
            aria-haspopup="listbox"
            aria-controls="lock-menu"
            aria-label="Drop Menu"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickListItem}
          >
            <ListItemText primary={dataList[selectedIndex]?.text} />
          </ListItem>
        </List>
      )}

      {/* DropDown List */}
      {dataList && (
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox'
          }}
        >
          {dataList.map((item, index) => (
            <MenuItem
              // eslint-disable-next-line react/no-array-index-key
              key={`${index}-dropmenu`}
              disabled={index === selectedIndex}
              selected={index === selectedIndex}
              onClick={() => handleMenuItemClick(index)}
            >
              {item?.text}
            </MenuItem>
          ))}
        </Menu>
      )}
    </div>
  )
}

export default WDropMenu
