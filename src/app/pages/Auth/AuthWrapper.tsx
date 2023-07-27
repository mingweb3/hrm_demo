// assets
import React from 'react'
import { styled } from '@mui/system'
// COMPS
import { Logo } from '@/components/Logo'
import authBg from '@/assets/images/auth/auth_bg.png'

interface AuthWrapperProps {
  children: React.ReactNode
}

const StyledAuthBackground = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
    flex: 1,
    height: '100vh',
    backgroundImage: `url(${authBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}))

export const AuthWrapper: React.FC<AuthWrapperProps> = props => {
  const { children } = props
  return (
    <div className="flex items-center h-screen">
      <StyledAuthBackground />
      <div className="max-w-[440px] mx-auto w-full h-full pt-12 sm:pt-[100px] px-[30px]">
        <Logo />
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}
