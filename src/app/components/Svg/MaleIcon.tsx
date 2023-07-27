import React from 'react'

type MaleIconProps = {
  color?: string
}

export const MaleIcon: React.FC<MaleIconProps> = ({ color }) => (
  <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.6066 10.8388C10.654 8.88621 7.48813 8.88621 5.53551 10.8388C3.58289 12.7915 3.58289 15.9573 5.53551 17.9099C7.48813 19.8625 10.654 19.8625 12.6066 17.9099C14.5592 15.9573 14.5592 12.7915 12.6066 10.8388ZM12.6066 10.8388L15.435 8.01041L17.9099 5.53553M17.9099 5.53553V10.4853M17.9099 5.53553H12.9601"
      stroke={color || '#13294B'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
