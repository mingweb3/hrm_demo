import { styled } from '@mui/material/styles'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ITagItem } from '@/types/ICandidate'

const StyledTagList = styled('div')(`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`)

const TagItem = styled('div')(
  ({ theme }) => `
    background-color: ${theme.palette.gray8};
    padding: 4px 12px;
    border-radius: 4px;
  `
)

interface TagListProps {
  tabList: ITagItem[]
}
export const TagList: React.FC<TagListProps> = ({ tabList }) => {
  if (tabList?.length === 0) return null
  return (
    <StyledTagList>
      {tabList?.map(item => {
        const { value, label } = item
        return (
          <TagItem key={value}>
            <span className="mr-4 f14Regular">{label}</span>
            <FontAwesomeIcon size="xs" icon={faClose} />
          </TagItem>
        )
      })}
    </StyledTagList>
  )
}
