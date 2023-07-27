import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { RemoveIcon } from '@/app/components/Svg/RemoveIcon'
import { removeDepartmentFromOrgFn } from '@/apis/organization.api'
import { IErrorForm } from '@/types/IErrorForm'
import { IDepartmentForm } from '@/types/IJob'
import { IDepartmentIdForm } from '@/types/IOrganization'
import { isAxiosError } from '@/utils/helpers'
import { messages } from '../../messages'

const StyledOrgDepartments = styled('div')(
  ({ theme }) => `
    .list {
      .dep-item:last-child {
        border-bottom: none;
      }
    }
    .dep-item {
      padding: 12px 0;
      border-bottom: 1px solid ${theme.palette.gray5};
    }
`
)

interface OrgDepartmentsProps {
  className?: string
  id: string // ORG UUID
  data?: IDepartmentForm[]
}

const OrgDepartments: React.FC<OrgDepartmentsProps> = ({ id, data }) => {
  const queryClient = useQueryClient()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Add Department to ORG: Mutation
  const { mutate: removeDepartmentFromOrg, isLoading } = useMutation(
    (formData: IDepartmentIdForm) => removeDepartmentFromOrgFn(id, formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organization', `${id}_departments_divisions`], exact: true })
        enqueueSnackbar(t(messages.RemovedDepartment()), { variant: 'success' })
      },
      onError(error) {
        if (isAxiosError<{ error: IErrorForm }>(error)) {
          if (error.response?.data) {
            const errorData = error.response?.data
            enqueueSnackbar(errorData.error?.message, { variant: 'error' })
          }
        }
      }
    }
  )

  // action: Get Department out of ORG
  const removeItem = (id?: string | number) => {
    if (isLoading) return
    if (!id) return
    removeDepartmentFromOrg({ departmentId: id.toString() })
  }

  // helper: Sort Division Title A-Z
  const sortByDivisionTitle = (arr: IDepartmentForm[]) => {
    return arr.sort((a, b) => {
      if (a.division && b.division) {
        const nameA = a.division.title.toUpperCase()
        const nameB = b.division.title.toUpperCase()
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
      }
      return 0
    })
  }

  return (
    <StyledOrgDepartments className="p-4">
      {data && (
        <>
          {data.length > 0 && (
            <div className="list">
              {sortByDivisionTitle(data).map(item => (
                <div key={`depitem_${item.id}`} className="dep-item flex flex-row items-center justify-between">
                  <div>
                    <div className="f12Bold text-gray6">{item.division?.title}</div>
                    <p className="f16Bold">{item.categoryTitle}</p>
                  </div>
                  <div>
                    <Tooltip title={`${t(messages.RemoveThisItem())}`}>
                      <IconButton onClick={() => removeItem(item.id)} aria-hidden="true">
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </StyledOrgDepartments>
  )
}

export default OrgDepartments
