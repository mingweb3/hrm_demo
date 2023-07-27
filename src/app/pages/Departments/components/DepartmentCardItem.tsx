import { useNavigate } from 'react-router-dom'
import { IconButton, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { t } from 'i18next'
import { PenIcon } from '@/app/components/Svg/PenIcon'
import { RemoveIcon } from '@/app/components/Svg/RemoveIcon'
// - COMPS
import WCard from '@/app/components/WCard'
import { IDepartmentForm, ISectionForm } from '@/types/IJob'
import { messages } from '../messages'
import SectionCardItem from './SectionCardItem'

const StyledDepartmentCardItem = styled('div')(
  ({ theme }) => `
  .title {
    span {
      color: ${theme.palette.gray3};
    }
  }
`
)

type DepartmentCardItemProps = {
  id: string
  data: IDepartmentForm
  onRemoveItem?: (id: string) => void
}

const DepartmentCardItem: React.FC<DepartmentCardItemProps> = ({ id, data, onRemoveItem }) => {
  const { categoryTitle, description, division, sections } = data
  // Navigate
  const navigate = useNavigate()
  const goToEdit = (id: string) => {
    navigate(`/admin/departments/${id}`)
  }

  return (
    <StyledDepartmentCardItem>
      <WCard className="w-full shadow-card" padd="p-4">
        <div className="head flex flex-row items-center justify-between">
          {categoryTitle && (
            <div className="title f16Bold">
              {division && <span> {division.title} / </span>}
              {categoryTitle}
            </div>
          )}
          <div className="tool-box">
            <Tooltip title={`${t(messages.EditThisItem())}`}>
              <IconButton onClick={() => goToEdit(id)} aria-hidden="true">
                <PenIcon />
              </IconButton>
            </Tooltip>
            {onRemoveItem && (
              <Tooltip title={`${t(messages.RemoveThisItem())}`}>
                <IconButton onClick={() => onRemoveItem(id)} aria-hidden="true">
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>
        {description && (
          <div className="desc f14Regular text-gray3 pb-4">
            <small className="f12Regular">#{id}</small> {description}
          </div>
        )}
        {sections && (
          <div className="section-list">
            {sections.length > 0 && (
              <>
                {sections.map((item: ISectionForm) => {
                  const { id } = item
                  return <SectionCardItem key={id} data={item} />
                })}
              </>
            )}
          </div>
        )}
      </WCard>
    </StyledDepartmentCardItem>
  )
}

export default DepartmentCardItem
