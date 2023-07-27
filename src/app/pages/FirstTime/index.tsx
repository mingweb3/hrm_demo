import * as React from 'react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
// COMPS
import WCard from '@/app/components/WCard'
import useLogout from '@/hooks/useLogout'
import { FirstTimeForm, SuccessForm } from './components'

export const FirstTimePage: React.FC = () => {
  const [formState, setFormState] = useState<boolean>(false)
  const logout = useLogout()

  const emitForm = (res: boolean) => {
    setFormState(res)
    logout()
  }

  return (
    <>
      <Helmet>
        <title>Welcome page</title>
        <meta name="description" content="Welcome page" />
      </Helmet>
      <div className="flex items-center justify-center py-0 sm:py-[100px]">
        <WCard className="w-full sm:w-[540px]">
          {!formState && <FirstTimeForm emitForm={emitForm} />}
          {formState && <SuccessForm />}
        </WCard>
      </div>
    </>
  )
}
