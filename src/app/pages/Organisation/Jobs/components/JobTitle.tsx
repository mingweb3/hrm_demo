import * as React from 'react'
import { Link, useParams } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import dayjs from 'dayjs'
import { IOrgJob } from '@/types/IOrgJob'

const StyledJobTitle = styled('div')(
  ({ theme }) => `
    .sub-text {
        color: ${theme.palette.gray7};
    }
`
)

export const JobTitle: React.FC<IOrgJob> = props => {
  const { id } = useParams<{ id: string }>()
  const { attributes } = props

  return (
    <StyledJobTitle>
      <Link to={`/admin/organizations/${id}/jobs/${attributes.UUID}`} className="f16Bold">
        {attributes.title}
      </Link>
      {attributes.createdAt && (
        <p className="f14Regular">
          Created on: {dayjs(attributes.createdAt).format('DD/MM/YYYY HH:mm:ss')} ({attributes.creatorUser?.name})
        </p>
      )}
      {attributes.modifiedAt && (
        <p className="f14Regular">
          Modified on: {dayjs(attributes.modifiedAt).format('DD/MM/YYYY HH:mm:ss')} ({attributes.modifiedUser?.name})
        </p>
      )}
    </StyledJobTitle>
  )
}
