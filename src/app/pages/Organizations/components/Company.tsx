import { Link } from 'react-router-dom'
import { IOrganizationForm } from '@/types/IOrganization'

interface CompanyItemRowProps {
  data: IOrganizationForm
}

export const CompanyItemRow: React.FC<CompanyItemRowProps> = ({ data }) => {
  const { companyName, UUID, buzAddress, contactPersonalName, contactEmail } = data
  const pathToDetails = '/admin/organizations/'
  return (
    <div>
      <Link to={`${pathToDetails}${UUID}/details`} className="f16Bold">
        {companyName}
      </Link>
      {buzAddress && <p className="f14Regular">{buzAddress}</p>}
      {contactPersonalName && <p className="f14Regular">{contactPersonalName}</p>}
      {contactEmail && (
        <a href={`mailto:${contactEmail}`} className="f14Regular text-primary underline">
          {contactEmail}
        </a>
      )}
    </div>
  )
}
