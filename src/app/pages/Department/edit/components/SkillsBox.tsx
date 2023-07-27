import { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { CrossIcon } from '@/app/components/Svg/CrossIcon'
import { removeSkillFn } from '@/apis/division.api'
import { ISkill, ISkillForm } from '@/types/IJob'

const StyledTagItem = styled('div')(
  ({ theme }) => `
    background-color: ${theme.palette.gray8};
    border-radius: 20px;
    padding: 2px 16px 2px 16px;
    svg {
        width: 16px;
        margin-right: -6px;
    }
`
)

export const TagItem = (props: any) => {
  const { data, editMode, id, onRemoveItem } = props

  return (
    <StyledTagItem className="inline-flex items-center f14Regular gap-2">
      {data.title && <span>{data.title}</span>}
      {editMode && onRemoveItem && (
        <IconButton onClick={() => onRemoveItem(id)} sx={{ padding: 0 }} aria-hidden="true">
          <CrossIcon />
        </IconButton>
      )}
    </StyledTagItem>
  )
}

const StyledSkillsBox = styled('div')(``)

type SkillsBoxProps = {
  isEditwMode?: boolean
  data: ISkill[] | ISkillForm[]
  departmentId: string
}

const SkillsBox: React.FC<SkillsBoxProps> = ({ isEditwMode, data, departmentId }) => {
  const queryClient = useQueryClient()
  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // ACTION : DELETE ITEM
  const removeItmMut = useMutation({
    mutationFn: (id: string) => removeSkillFn(id),
    onSuccess: () => {
      enqueueSnackbar(`Removed skill ok!`, { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['department', departmentId], exact: true })
    }
  })

  const onRemoveSkill = async (id: string | number) => {
    // removeItmMut.mutate(id.toString().trim())
    try {
      await removeItmMut.mutateAsync(id.toString().trim())
      if (skills) {
        const newList = skills?.filter(item => item.id?.toString() !== id.toString().trim())
        setSkills(newList)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Load list
  const [skills, setSkills] = useState<ISkill[] | ISkillForm[] | null>(null)
  useEffect(() => {
    if (data && data.length > 0) setSkills(data)
  }, [data])

  return (
    <StyledSkillsBox className={`flex flex-row flex-wrap gap-2 ${removeItmMut.isLoading ? 'section-loading' : ''}`}>
      {skills && skills.length > 0 && (
        <>
          {skills.map((item: any) => {
            const { id } = item
            // Detect interface ISkill / ISkillForm
            if (item.type) {
              return (
                <TagItem key={id} id={id} data={item.attributes} editMode={isEditwMode} onRemoveItem={onRemoveSkill} />
              )
            }
            return <TagItem key={id} id={id} data={item} editMode={isEditwMode} onRemoveItem={onRemoveSkill} />
          })}
        </>
      )}
    </StyledSkillsBox>
  )
}

export default SkillsBox
