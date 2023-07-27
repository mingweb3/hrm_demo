import { t } from 'i18next'
import ToolBarForm from '@/app/pages/Candidate/Placement/components/ToolBarForm'
// COMPs
import { ICandidateForm } from '@/types/ICandidate'
import { IOrgJobForm } from '@/types/IOrgJob'
import { messages } from '../../messages'

interface AssignCanInfoProps {
  stdCandidate?: ICandidateForm | null
  currentJob?: IOrgJobForm
}
export const AssignCanInfo: React.FC<AssignCanInfoProps> = props => {
  const { stdCandidate, currentJob } = props

  return (
    <ToolBarForm>
      <div className="flex flex-col flex-1">
        <div className="f14Regular">
          {t(messages['Current job']())}: #{currentJob?.UUID}
        </div>
        <h3 className="f20Bold job-title mb-1">{currentJob?.title}</h3>
        <div className="f16Regular mb-1">
          {currentJob?.currency} {currentJob?.minSalary} - {currentJob?.maxSalary} /{' '}
          {currentJob?.department?.categoryTitle}
        </div>
        <div className="f16Bold text-black444">{currentJob?.organisation?.companyName}</div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="f16Regular mb-1">
          {t(messages.Candidate())}: #{stdCandidate?.UUID}
        </div>
        <div className="f16Bold text-black444 mb-1">{stdCandidate?.name}</div>
        <div className="f16Regular mb-1 capitalize">
          {stdCandidate?.userBio?.prefCommitmentId} {stdCandidate?.userBio?.prefCommitmentId ? '-' : ''}{' '}
          {stdCandidate?.userBio?.jobLevel}
        </div>
        {stdCandidate?.userBio?.expSalary ? (
          <div className="f16Regular mb-1">
            {t(messages.ExpectedSalary())}: {stdCandidate?.userBio?.expSalary}{' '}
            {stdCandidate?.userBio?.currencyExpSalary}
          </div>
        ) : null}
      </div>
    </ToolBarForm>
  )
}
