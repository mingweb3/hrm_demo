import { useTheme } from '@mui/material/styles'
import { t } from 'i18next'
// COMPs
import { FemaleIcon } from '@/app/components/Svg/FemaleIcon'
import { MaleIcon } from '@/app/components/Svg/MaleIcon'
import { PrefCommitment } from '@/constants/JsonData/jobLevel'
import { ICandidate } from '@/types/ICandidate'
import { findOne } from '@/utils/helper.object'
import { messages } from '../../messages'

interface CandidateItemProps {
  candidate: ICandidate
  onSelect: (candidate: ICandidate) => void
}

export const CandidateItem: React.FC<CandidateItemProps> = props => {
  const { candidate, onSelect } = props
  const { attributes } = candidate

  const theme = useTheme()

  return (
    <div
      className="candidate-item py-4 px-2 cursor-pointer flex flex-col md:flex-row md:gap-4"
      onClick={() => onSelect(candidate)}
      aria-hidden="true"
    >
      <div className="md:w-[50%]">
        <div className="flex items-baseline">
          <p className="f16Bold">{attributes.name}</p>
          {attributes.gender === 'male' && (
            <span className="nm-icon ml-1">
              <MaleIcon color={theme.palette.blue2} />
            </span>
          )}
          {attributes.gender === 'female' && (
            <span className="nm-icon ml-1">
              <FemaleIcon color={theme.palette.red2} />
            </span>
          )}
        </div>
        <p className="f14Regular underline">{attributes.email}</p>
        {attributes.userBio?.prefCommitmentId && (
          <p className="f14Regular">
            {findOne(attributes.userBio?.prefCommitmentId, 'value', PrefCommitment).label} -{' '}
            <span className="capitalize">{attributes.userBio?.jobLevel}</span>
          </p>
        )}
      </div>
      <div className="md:w-[50%]">
        {attributes.currentLocation && (
          <p className="f14Regular">
            {t(messages['Cur Location']())}: {attributes.currentLocation}
          </p>
        )}
        {attributes.userBio?.expSalary && (
          <p className="f14Regular">
            {t(messages.ExpectedSalary())}: {attributes.userBio?.expSalary} {attributes.userBio?.currencyExpSalary}
          </p>
        )}
      </div>
    </div>
  )
}
