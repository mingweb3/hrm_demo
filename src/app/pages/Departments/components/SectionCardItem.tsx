import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { t } from 'i18next'
import { PenIcon } from '@/app/components/Svg/PenIcon'
// - COMPS
import { RemoveIcon } from '@/app/components/Svg/RemoveIcon'
import { ISectionForm, ISkillForm } from '@/types/IJob'
import { messages } from '../messages'

const StyledSectionCardItem = styled('div')(
  ({ theme }) => `
  border-top: 1px solid ${theme.palette.gray5};
  margin-top: 6px;
  padding: 6px 0 24px;
  .title {
    span {
      color: ${theme.palette.gray3};
    }
  }

  .tool-box {
    svg {
      width: 14px;
    }
  }
`
)

type SectionCardItemProps = {
  data: ISectionForm
  isEditMode?: boolean
  onRemoveItem?: (id: string) => void
  onEditItem?: (item: ISectionForm) => void
}

const SectionCardItem: React.FC<SectionCardItemProps> = ({ data, isEditMode, onRemoveItem, onEditItem }) => {
  const { title, skills, id } = data
  return (
    <StyledSectionCardItem>
      <div className="flex flex-row items-center justify-between">
        {title && (
          <div className="section-title f12Regular uppercase letter tracking-[.2em] text-gray3 mb-4">
            SECTION: {title}
          </div>
        )}
        {isEditMode && (
          <div className="tool-box flex items-center gap-2">
            {onEditItem && id && (
              <Tooltip title={`${t(messages.EditThisItem())}`}>
                <IconButton onClick={() => onEditItem(data)} aria-hidden="true">
                  <PenIcon />
                </IconButton>
              </Tooltip>
            )}
            {onRemoveItem && id && (
              <Tooltip title={`${t(messages.RemoveThisItem())}`}>
                <IconButton onClick={() => onRemoveItem(id as string)} aria-hidden="true">
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        )}
      </div>

      {skills && (
        <div className="skill-pool">
          {skills.length > 0 && (
            <Stack direction="row" className="gap-2 flex-wrap">
              {skills.map((item: ISkillForm) => {
                const { id } = item
                return <Chip key={id} label={item.title} />
              })}
            </Stack>
          )}
        </div>
      )}
    </StyledSectionCardItem>
  )
}

export default SectionCardItem
