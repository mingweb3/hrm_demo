import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { t } from 'i18next'
import { IPlacement } from '@/types/IPlacement'
import { getNationByCode } from '@/utils/helper.national'
import { messages } from '../../messages'

export const CandidateName: React.FC<IPlacement> = props => {
  const { attributes } = props
  const { candidate, UUID } = attributes

  return (
    <div>
      <Link to={`/admin/placement/${UUID}?from=job`} className="f16Bold hover:underline cursor-pointer mb-1">
        {candidate?.name}
      </Link>
      <p className="f16Regular underline mb-2">{candidate?.email}</p>
      <p className="f16Regular mb-2">
        {getNationByCode(candidate?.nationality)?.nationality || '-'}
        {candidate?.yob && <span> - {dayjs(candidate?.yob).format('YYYY')}</span>}
      </p>
      {candidate?.currentLocation && (
        <p className="f16Regular">
          {t(messages['Cur Location']())}: {candidate?.currentLocation}
        </p>
      )}
    </div>
  )
}
