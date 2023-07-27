import React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'

const StyledOrgInfo = styled('div')(
  ({ theme }) => `
  .inner {
    border: 1px solid ${theme.palette.bg};
    border-radius: 4px;
    padding: 5px;
  }
  .avatar {
    width: 48px;
    height: 48px;
    overflow: hidden;
  }
  `
)

const OrgInfo: React.FC = () => {
  return (
    <Link to="/principle-details" className="hover:no-underline">
      <StyledOrgInfo className="cursor-pointer px-5 rounded-[4px]">
        <div className="flex gap-2 inner">
          <figure className="avatar bg-bg flex justify-center items-center rounded-[4px]">
            <strong>P</strong>
          </figure>
          <div className="org-info">
            <h4 className="org-name f16Bold">Pave Group</h4>
            <div className="org-plan f14Regular text-primary">PRO PLAN</div>
          </div>
        </div>
      </StyledOrgInfo>
    </Link>
  )
}

export default OrgInfo
