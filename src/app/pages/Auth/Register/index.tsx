import React from 'react'
// COMPS
import { Link } from 'react-router-dom'
import { FormControl, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { SocialBox } from '@/components/Button/SocialBox'
import { FacebookIcon } from '@/components/Svg/FacebookIcon'
import { GoogleIcon } from '@/components/Svg/GoogleIcon'
import { LinkedInIcon } from '@/components/Svg/LinkedInIcon'
import { AuthWrapper } from '../AuthWrapper'
import { messages } from '../messages'

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <AuthWrapper>
      <h1 className="mb-8 f24Bold sm:fh1 text-primary">{t(messages['Register now for free']())}</h1>
      <div>
        <div className="mb-4 f14Bold sm:f16Bold text-black444">
          {t(messages['Sign up as HR Manager. You have 1-month free trial']())}
        </div>
        <div className="flex flex-col gap-4 mb-16">
          <FormControl className="flex-1 int-group">
            <TextField size="small" label={`${t(messages['Your email']())}`} variant="outlined" />
          </FormControl>
          <FormControl className="flex-1 int-group">
            <TextField size="small" label={`${t(messages['Your password']())}`} variant="outlined" />
          </FormControl>
          <Button variant="primary">
            <span className="uppercase">{t(messages['Sign up']())}</span>
          </Button>
          <div className="flex items-center justify-between">
            <p className="f12Regular sm:f14Regular">
              {t(messages['By creating the account you agree to our']())}&nbsp;
              <Link to="/" className="underline text-black444">
                {t(messages['Terms of Services']())}
              </Link>
              &nbsp;and&nbsp;
              <Link to="/" className="underline text-black444">
                {t(messages['Privacy Policy']())}
              </Link>
              .
            </p>
          </div>
        </div>
        <div>
          <div className="mb-4 f14Bold sm:f16Bold text-black444">{t(messages['Or sign up with']())}</div>
          <div className="flex items-center justify-between">
            <SocialBox iconComp={<GoogleIcon />} text="Gmail" />
            <SocialBox iconComp={<FacebookIcon />} text="Facebook" />
            <SocialBox iconComp={<LinkedInIcon />} text="LinkedIn" />
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
