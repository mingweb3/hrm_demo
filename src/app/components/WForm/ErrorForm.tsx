import React from 'react'
import { styled } from '@mui/material/styles'
import { IErrorForm } from '@/types/IErrorForm'

const StyledErrorForm = styled('div')(
  ({ theme }) => `
		color: ${theme.palette.red};
		border-radius: 4px;
		border: 1px solid ${theme.palette.red};
		padding: 10px 14px;
		background: #ffecec;
	`
)

interface ErrorFormProps {
  error: IErrorForm
}

const ErrorForm: React.FC<ErrorFormProps> = ({ error }) => {
  const { code, message, data } = error
  return (
    <StyledErrorForm>
      <div className="flex flex-row">
        <div>
          <b>{code}</b>&nbsp;-&nbsp;
        </div>
        <div>{message}</div>
      </div>
      {data && data?.length > 0 && (
        <div className="err-list pt-2">
          {data.map((item: string, i) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <p key={`${i}-err-item`}>- {item}</p>
            )
          })}
        </div>
      )}
    </StyledErrorForm>
  )
}

export default ErrorForm
