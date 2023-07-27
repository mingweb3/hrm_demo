import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import AlertModal from '@/app/components/WModal/AlertModal'
import { itemsPerPageDefault } from '@/app/components/WTable'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { removeDepartmentFn } from '@/apis/division.api'
import { IDepartment } from '@/types/IJob'
import DepartmentCardItem from './DepartmentCardItem'

const StyledDepartmentList = styled('div')(``)

type DepartmentListProps = {
  className?: string
  listData: IDepartment[]
}

const DepartmentList: React.FC<DepartmentListProps> = ({ listData, className }) => {
  const queryClient = useQueryClient()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // GET DATA LIST
  const defaultQueryStr = `page[number]=1&page[size]=${itemsPerPageDefault}`
  const { searchParams } = useFilterQueryUrl()

  // ACTION : DELETE ITEM
  const removeItmMut = useMutation({
    mutationFn: (id: string) => removeDepartmentFn(id),
    onSuccess: () => {
      enqueueSnackbar(`Removed department ok!`, { variant: 'success' })
      queryClient.invalidateQueries({
        queryKey: ['departments', decodeURI(searchParams.toString()) || defaultQueryStr],
        exact: true
      })
    }
  })

  // MODAL REMOVE SECTION
  const [removeId, setRemoveId] = useState<null | string>(null)
  const [openDelBox, setOpenDelBox] = useState(false)
  const closeDelBox = (res: boolean) => {
    setOpenDelBox(false)
    if (res && removeId) removeItmMut.mutate(removeId)
  }

  const removeDep = (id: string) => {
    setRemoveId(id)
    setOpenDelBox(true)
  }

  return (
    <StyledDepartmentList className={`flex flex-col gap-4 ${className}`}>
      {listData.length > 0 && (
        <>
          {listData.map((item: IDepartment) => {
            const { id, attributes } = item
            return <DepartmentCardItem key={id} id={id} data={attributes} onRemoveItem={removeDep} />
          })}
        </>
      )}
      <Dialog open={openDelBox} maxWidth="sm" fullWidth>
        <AlertModal
          getResult={closeDelBox}
          title="Please confirm"
          content={`Do you really want to remove this deppartment #${removeId}, all sections and all skills inside?`}
        />
      </Dialog>
    </StyledDepartmentList>
  )
}

export default DepartmentList
