// COMPS
import React from 'react'
import { FormControl, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { AuthWrapper } from '../AuthWrapper'
import { messages } from '../messages'

export const VerifiedPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <AuthWrapper>
      <h1 className="mb-8 f24Bold sm:fh1 text-primary">{t(messages['6-digits']())}</h1>
      <div>
        <div className="mb-4 f14Bold sm:f16Bold text-black444">
          {t(messages['Please check your email to get verified code']())}
        </div>
        <div className="flex flex-col gap-4 mb-16">
          <FormControl className="flex-1 int-group">
            <TextField size="small" label={`${t(messages['Verified code']())}`} variant="outlined" />
          </FormControl>
          <Button variant="primary">
            <span className="uppercase">{t(messages.Submit())}</span>
          </Button>
          <div className="flex items-center justify-between">
            <p className="f12Regular sm:f14Regular">
              {t(messages['Dont get code?']())} <span className="underline text-black444">{t(messages.Resend())}</span>{' '}
            </p>
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
