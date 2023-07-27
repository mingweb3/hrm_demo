import * as React from 'react'
import ButtonUnstyled from '@mui/base/ButtonUnstyled'
import { styled } from '@mui/material/styles'
import { Helmet } from 'react-helmet-async'

const CustomButton = styled(ButtonUnstyled)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: '8px 24px'
}))

export const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="This is homepage" />
      </Helmet>
      <div className="text-ellipsis">
        <h1 className="text-slate-400">Home Page</h1>
        <CustomButton>Button</CustomButton>
      </div>
    </>
  )
}
