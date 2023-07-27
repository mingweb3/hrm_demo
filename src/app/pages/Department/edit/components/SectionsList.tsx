import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import AlertModal from '@/app/components/WModal/AlertModal'
import SectionCardItem from '@/app/pages/Departments/components/SectionCardItem'
import { removeSectionFn } from '@/apis/division.api'
import { ISectionForm } from '@/types/IJob'
import { messages } from '../../messages'
import SectionForm from './SectionForm'

type SectionsListProps = {
  data: ISectionForm[]
  departmentId: string
}

const SectionsList: React.FC<SectionsListProps> = ({ data, departmentId }) => {
  const queryClient = useQueryClient()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // ACTION : DELETE ITEM
  const removeItemMutaion = useMutation({
    mutationFn: (id: string) => removeSectionFn(id),
    onSuccess: () => {
      enqueueSnackbar(`Removed ok!`, { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['department', departmentId], exact: true })
    }
  })

  const removeItem = (sectionId: string) => {
    handleOpenDelBox(sectionId)
  }

  // MODAL REMOVE SECTION
  const [removeId, setRemoveId] = useState<null | string>(null)
  const [openDelBox, setOpenDelBox] = useState(false)
  const closeDelBox = (res: boolean) => {
    setOpenDelBox(false)
    if (res && removeId) removeItemMutaion.mutate(removeId)
  }
  const handleOpenDelBox = (id: string) => {
    setRemoveId(id)
    setOpenDelBox(true)
  }

  // MODAL: EDIT
  const [curEditItem, setCurEditItem] = useState<null | ISectionForm>(null)
  const [openAddSection, setOpenAddSection] = useState(false)
  const closeSectionBox = () => {
    setOpenAddSection(false)
  }
  const handleOpenAddSection = (itemData: ISectionForm) => {
    setCurEditItem(itemData)
    setOpenAddSection(true)
  }

  return (
    <div>
      {data.length > 0 && (
        <>
          {data.map((item: ISectionForm) => {
            const { id } = item
            return (
              <SectionCardItem
                key={id}
                data={item}
                isEditMode
                onRemoveItem={removeItem}
                onEditItem={handleOpenAddSection}
              />
            )
          })}
        </>
      )}
      <Dialog open={openDelBox} maxWidth="sm" fullWidth>
        <AlertModal
          getResult={closeDelBox}
          title={t(messages.PleaseConfirm()) || 'PleaseConfirm'}
          content={`Do you really want to remove this section #${removeId} and all skills inside?`}
        />
      </Dialog>
      <Dialog open={openAddSection} maxWidth="sm" fullWidth disableEscapeKeyDown>
        <SectionForm onClose={closeSectionBox} departmentId={departmentId} data={curEditItem} />
      </Dialog>
    </div>
  )
}

export default SectionsList
