import { Link } from 'react-router-dom'
import WCard from '../WCard'

interface NoDataProps {
  text?: string
  redirectText?: string
  redirectLink?: string
}

const _defaultProps: NoDataProps = {
  text: 'No data found.',
  redirectText: 'Refresh now!',
  redirectLink: '/admin/dashboard'
}

const NoData: React.FC<NoDataProps> = ({ text, redirectText, redirectLink }) => {
  return (
    // eslint-disable-next-line react/jsx-no-undef
    <WCard className="w-full shadow-card" padd="p-0">
      <div className="p-4 text-">
        {text}&nbsp;
        {redirectLink && <Link to={redirectLink}>{redirectText}</Link>}
      </div>
    </WCard>
  )
}

NoData.defaultProps = _defaultProps

export default NoData
