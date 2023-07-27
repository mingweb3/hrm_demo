import { Outlet } from 'react-router-dom'

export const EmptyLayout = (): JSX.Element => {
  return (
    <>
      <Outlet />
    </>
  )
}
