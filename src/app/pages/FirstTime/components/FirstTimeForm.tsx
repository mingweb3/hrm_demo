import * as React from 'react'
// COMPS
import { Link } from 'react-router-dom'
import { Checkbox, FormControl, TextField } from '@mui/material'
import { t } from 'i18next'
import { Button } from '@/components/Button'
import { messages } from '../messages'

interface FirstTimeFormProps {
  emitForm: (res: boolean) => void
}

const FirstTimeForm: React.FC<FirstTimeFormProps> = props => {
  const { emitForm } = props
  return (
    <>
      <h1 className="mb-8 text-left f16Bold sm:f24Bold sm:fh1 text-primary">
        {t(messages['Add your principle company']())}
      </h1>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <FormControl>
            <TextField size="small" id="company-name" label={`${t(messages['Company name']())}`} variant="outlined" />
          </FormControl>
          <FormControl>
            <TextField
              size="small"
              id="buz-register-name"
              label={`${t(messages['Business registration number']())}`}
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <TextField
              size="small"
              id="buz-address"
              label={`${t(messages['Business address']())}`}
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <TextField size="small" id="buz-address" label={`${t(messages['Billing address']())}`} variant="outlined" />
          </FormControl>
          <FormControl>
            <TextField size="small" id="buz-address" label={`${t(messages['Billing address']())}`} variant="outlined" />
          </FormControl>

          <div className="flex items-center -mt-3 -ml-3">
            <Checkbox />
            <span>
              I agree to our{' '}
              <Link className="underline text-primary" to="/" target="_blank">
                Terms of service
              </Link>{' '}
              and{' '}
              <Link className="underline text-primary" to="/" target="_blank">
                Privacy policy
              </Link>
            </span>
          </div>
        </div>

        <Button variant="primary" className="w-[200px] mx-auto" onClick={() => emitForm(true)}>
          <span className="uppercase">{t(messages.Submit())}</span>
        </Button>
      </div>
    </>
  )
}

export default FirstTimeForm
