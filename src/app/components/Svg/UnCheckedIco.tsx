import React from 'react'

type UnCheckedIconProps = {
  color?: string
}

export const UnCheckedIcon: React.FC<UnCheckedIconProps> = ({ color }) => (
  <svg width="24px" height="24px" viewBox="0 0 24 24" fill={color || '#111111'} xmlns="http://www.w3.org/2000/svg">
    <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3.71,12.29a1,1,0,0,1,0,1.42,1,1,0,0,1-1.42,0L12,13.42,9.71,15.71a1,1,0,0,1-1.42,0,1,1,0,0,1,0-1.42L10.58,12,8.29,9.71A1,1,0,0,1,9.71,8.29L12,10.58l2.29-2.29a1,1,0,0,1,1.42,1.42L13.42,12Z" />
  </svg>
)