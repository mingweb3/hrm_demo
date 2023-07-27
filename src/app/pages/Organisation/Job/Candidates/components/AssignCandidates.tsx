import React from 'react'
import { styled } from '@mui/material/styles'
import { t } from 'i18next'
import { ICandidate } from '@/types/ICandidate'
// COMPs
import { messages } from '../../messages'
import { CandidateItem } from './CandidateItem'

const StyledAssignCandidates = styled('div')(
  ({ theme }) => `
    .candidate-item {
      border-bottom: 1px solid ${theme.palette.gray8};
      &:last-child {
        border-bottom: none;
      }
      &:hover {
        background-color: ${theme.palette.gray9};
      }
      .nm-icon {
        display: inline-block;
        vertical-align: -2px;
        svg {
            width: 18px;
            height: auto;
        }
      }
    }
    `
)

interface AssignCandidatesProps {
  onSelect: (candidate: ICandidate) => void
  listData: ICandidate[]
}

export const AssignCandidates: React.FC<AssignCandidatesProps> = ({ onSelect, listData }) => {
  return (
    <StyledAssignCandidates>
      <h3 className="f16Regular uppercase letter tracking-[.2em] text-gray5 mb-2 pl-2">{`${t(
        messages.Candidates()
      )}`}</h3>
      <div className="candidates-lst">
        {listData?.map(item => (
          <CandidateItem key={`assign-candidate-${item?.id}`} candidate={item} onSelect={onSelect} />
        ))}
      </div>
    </StyledAssignCandidates>
  )
}
