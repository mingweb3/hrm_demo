// COMPS
import * as React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { t } from 'i18next'
import { SuccessCheckIcon } from '@/app/components/Svg/SuccessCheckIcon'
import { messages } from '../messages'

const StyledSuccessForm = styled('div')(
  ({ theme }) => `
    padding: 20px;
    .ttl {
        color: ${theme.palette.green2};
    }
    a {
        color: ${theme.palette.primary.main};
    }
`
)

const SuccessForm: React.FC = () => {
  return (
    <StyledSuccessForm>
      <div className="flex flex-col items-center justify-center">
        <SuccessCheckIcon />
        <h1 className="mt-8 mb-2 uppercase ttl f16Bold sm:f24Bold sm:fh1">{`${t(messages.submit_success())}`}</h1>
        <p>
          Go to <Link to="/">dashboard</Link> in 4s.
        </p>
      </div>
    </StyledSuccessForm>
  )
}

export default SuccessForm
