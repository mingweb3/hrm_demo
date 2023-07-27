import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { IBreadCumbItem } from '@/types/IBreadCrumb'

interface WBreadcrumsProps {
  className?: string
  dataList?: IBreadCumbItem[]
}

const StyledWBreadcrums = styled('div')(``)

export const WBreadcrums: React.FC<WBreadcrumsProps> = props => {
  const { className, dataList } = props
  if (!dataList || dataList?.length === 0) return null
  return (
    <StyledWBreadcrums className={className}>
      <Breadcrumbs
        sx={{
          color: 'gray2'
        }}
        aria-label="breadcrumb"
      >
        {dataList.map((item, index) => {
          const { link, text } = item
          const key = `${index}-breadcrumb`
          if (link) {
            return (
              <Link key={key} to={link} className="text-gray3 hover:underline">
                {text}
              </Link>
            )
          }
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Typography key={key} color="text.primary">
              {text}
            </Typography>
          )
        })}
      </Breadcrumbs>
    </StyledWBreadcrums>
  )
}
